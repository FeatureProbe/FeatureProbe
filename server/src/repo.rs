#[cfg(feature = "realtime")]
use crate::realtime::RealtimeSocket;
use crate::FPServerError;
use crate::{base::ServerConfig, secrets::SecretMapping};
use feature_probe_server_sdk::{
    EvalDetail, FPConfig, FPUser, FeatureProbe as FPClient, SyncType, Url,
};
#[cfg(feature = "unstable")]
use feature_probe_server_sdk::{Segment, Toggle};
use parking_lot::RwLock;
use reqwest::Method;
use serde_json::Value;
use std::{collections::HashMap, sync::Arc};
use tracing::{debug, error, info};

#[derive(Debug, Clone)]
pub struct SdkRepository {
    inner: Arc<Inner>,
}

#[derive(Debug)]
struct Inner {
    server_config: ServerConfig,
    http_client: reqwest::Client,
    sdk_clients: RwLock<HashMap<String, FPClient>>,
    secret_mapping: RwLock<SecretMapping>,
    #[cfg(feature = "realtime")]
    realtime_socket: RealtimeSocket,
}

impl SdkRepository {
    pub fn new(
        server_config: ServerConfig,
        #[cfg(feature = "realtime")] realtime_socket: RealtimeSocket,
    ) -> Self {
        Self {
            inner: Arc::new(Inner {
                server_config,
                http_client: Default::default(),
                sdk_clients: Default::default(),
                secret_mapping: Default::default(),
                #[cfg(feature = "realtime")]
                realtime_socket,
            }),
        }
    }

    #[cfg(feature = "unstable")]
    pub fn update_segments(
        &self,
        _segments: HashMap<String, Segment>,
    ) -> Result<(), FPServerError> {
        // TODO:
        Ok(())
    }

    #[cfg(feature = "unstable")]
    pub fn update_toggles(
        &self,
        _server_sdk_key: &str,
        _toggles: HashMap<String, Toggle>,
    ) -> Result<(), FPServerError> {
        // TODO:
        Ok(())
    }

    pub fn secret_keys(&self) -> HashMap<String, String> {
        let secret_mapping = self.inner.secret_mapping.read();
        secret_mapping.mapping_clone()
    }

    pub fn sync(&self, client_sdk_key: String, server_sdk_key: String, version: u128) {
        self.inner.sync(&server_sdk_key);
        let mut secret_mapping = self.inner.secret_mapping.write();
        secret_mapping.insert(client_sdk_key, server_sdk_key, version);
    }

    pub fn sync_with(&self, keys_url: Url) {
        self.sync_secret_keys(keys_url);
        let inner = self.inner.clone();
        tokio::spawn(async move {
            let mut interval = tokio::time::interval(inner.server_config.refresh_interval);
            loop {
                {
                    inner.update_clients();
                }
                interval.tick().await;
            }
        });
    }

    fn sync_secret_keys(&self, keys_url: Url) {
        let inner = self.inner.clone();
        let mut interval = tokio::time::interval(inner.server_config.refresh_interval);
        tokio::spawn(async move {
            loop {
                let url = keys_url.clone();
                let request = inner
                    .http_client
                    .request(Method::GET, url)
                    .timeout(inner.server_config.refresh_interval);
                match request.send().await {
                    Err(e) => error!("sync_secret_keys error: {}", e),
                    Ok(resp) => match resp.text().await {
                        Err(e) => error!("sync_secret_keys: {}", e),
                        Ok(body) => match serde_json::from_str::<SecretMapping>(&body) {
                            Err(e) => error!("sync_secret_keys json error: {}", e),
                            Ok(r) => {
                                debug!("sync_secret_keys success. version: {:?}", r.version(),);
                                inner.update_mapping(r);
                            }
                        },
                    },
                }
                interval.tick().await;
            }
        });
    }

    pub fn server_sdk_repo_string(&self, server_sdk_key: &str) -> Result<String, FPServerError> {
        let secret_mapping = self.inner.secret_mapping.read();
        if secret_mapping.version() == 0 {
            return Err(FPServerError::NotReady(server_sdk_key.to_string()));
        }
        if !secret_mapping.contains_server_sdk_key(server_sdk_key) {
            return Err(FPServerError::NotFound(server_sdk_key.to_string()));
        }
        match self.inner.repo_string(server_sdk_key) {
            Ok(repo) => Ok(repo),
            Err(e) => Err(e),
        }
    }

    pub fn client_sdk_eval_string(
        &self,
        client_sdk_key: &str,
        user: &FPUser,
    ) -> Result<String, FPServerError> {
        let secret_mapping = self.inner.secret_mapping.read();
        if secret_mapping.version() == 0 {
            return Err(FPServerError::NotReady(client_sdk_key.to_string()));
        }
        let server_sdk_key = match secret_mapping.server_sdk_key(client_sdk_key) {
            Some(sdk_key) => sdk_key,
            None => return Err(FPServerError::NotFound(client_sdk_key.to_string())),
        };
        self.inner.all_evaluated_string(server_sdk_key, user)
    }

    pub fn client_sdk_events_string(&self, client_sdk_key: &str) -> Result<String, FPServerError> {
        let secret_mapping = self.inner.secret_mapping.read();
        if secret_mapping.version() == 0 {
            return Err(FPServerError::NotReady(client_sdk_key.to_string()));
        }
        let server_sdk_key = match secret_mapping.server_sdk_key(client_sdk_key) {
            Some(sdk_key) => sdk_key,
            None => return Err(FPServerError::NotFound(client_sdk_key.to_string())),
        };
        self.inner.all_event_string(server_sdk_key)
    }

    pub fn client_sync_now(&self, sdk_key: &str, t: SyncType) -> Result<String, FPServerError> {
        let sdk_clients = self.inner.sdk_clients.write();
        let client = match sdk_clients.get(sdk_key) {
            Some(client) => client,
            None => return Err(FPServerError::NotFound(sdk_key.to_string())),
        };
        client.sync_now(t);
        Ok(sdk_key.to_string())
    }

    #[cfg(test)]
    #[cfg(feature = "unstable")]
    fn sdk_client(&self, sdk_key: &str) -> Option<FPClient> {
        let sdk_clients = self.inner.sdk_clients.read();
        sdk_clients.get(sdk_key).cloned()
    }
}

impl Inner {
    pub fn sync(&self, server_sdk_key: &str) {
        let should_sync = {
            let sdks = self.sdk_clients.read();
            !sdks.contains_key(server_sdk_key)
        };

        if !should_sync {
            return;
        }

        let mut mut_sdks = self.sdk_clients.write();
        let config = FPConfig {
            server_sdk_key: server_sdk_key.to_owned(),
            remote_url: Url::parse("http://nouse.com").unwrap(),
            toggles_url: Some(self.server_config.toggles_url.clone()),
            refresh_interval: self.server_config.refresh_interval,
            http_client: Some(self.http_client.clone()),
            ..Default::default()
        };
        info!("{:?} added", server_sdk_key);

        #[cfg(feature = "realtime")]
        {
            let mut client = FPClient::new(config);
            self.setup_notify(server_sdk_key, &mut client);
            let _ = &mut_sdks.insert(server_sdk_key.to_owned(), client);
        }

        #[cfg(not(feature = "realtime"))]
        let _ = &mut_sdks.insert(server_sdk_key.to_owned(), FPClient::new(config));
    }

    pub fn remove_client(&self, server_sdk_key: &str) {
        let mut sdks = self.sdk_clients.write();
        sdks.remove(server_sdk_key);
    }

    pub fn update_clients(&self) {
        let secret_mapping = self.secret_mapping.read();
        let clients = self.sdk_clients.read().clone();
        if secret_mapping.version() > 0 {
            let server_sdk_keys = secret_mapping.server_sdk_keys();
            for server_sdk_key in &server_sdk_keys {
                self.sync(server_sdk_key);
            }

            for server_sdk_key in clients.keys() {
                if !server_sdk_keys.contains(&server_sdk_key) {
                    info!("{:?} removed.", server_sdk_key);
                    self.remove_client(server_sdk_key);
                }
            }
        }
    }

    pub fn update_mapping(&self, new: SecretMapping) {
        let version = self.secret_mapping.read().version();
        if new.version() > version {
            let mut secret_mapping = self.secret_mapping.write();
            secret_mapping.update_mapping(new)
        }
    }

    #[cfg(feature = "realtime")]
    fn setup_notify(&self, server_sdk_key: &str, client: &mut FPClient) {
        let sdk_key = server_sdk_key.to_owned();
        let realtime_socket = self.realtime_socket.clone();
        let client_sdk_key = {
            let mapping = self.secret_mapping.read();
            mapping.client_sdk_key(server_sdk_key).cloned()
        };

        client.set_update_callback(Box::new(move |_old, _new, _type| {
            let server_key = sdk_key.clone();
            let client_key = client_sdk_key.clone();
            let socket = realtime_socket.clone();
            tokio::spawn(async move {
                socket
                    .notify_sdk(server_key, client_key, "update", serde_json::json!(""))
                    .await;
            });
        }));
    }

    fn repo_string(&self, sdk_key: &str) -> Result<String, FPServerError> {
        let clients = self.sdk_clients.read();
        let client = match clients.get(sdk_key) {
            Some(client) if !client.initialized() => {
                return Err(FPServerError::NotReady(sdk_key.to_string()))
            }
            Some(client) => client,
            None => return Err(FPServerError::NotReady(sdk_key.to_string())),
        };
        let arc_repo = client.repo();
        let repo = arc_repo.read();
        serde_json::to_string(&*repo).map_err(|e| FPServerError::JsonError(e.to_string()))
    }

    fn all_evaluated_string(&self, sdk_key: &str, user: &FPUser) -> Result<String, FPServerError> {
        let clients = self.sdk_clients.read();
        let client = match clients.get(sdk_key) {
            Some(client) if !client.initialized() => {
                return Err(FPServerError::NotReady(sdk_key.to_string()))
            }
            Some(client) => client,
            None => return Err(FPServerError::NotReady(sdk_key.to_string())),
        };
        let arc_repo = client.repo();
        let repo = arc_repo.read();
        let map: HashMap<String, EvalDetail<Value>> = repo
            .toggles
            .iter()
            .filter(|(_, t)| t.is_for_client())
            .map(|(key, toggle)| (key.to_owned(), toggle.eval_detail(user, &repo.segments)))
            .collect();
        serde_json::to_string(&map).map_err(|e| FPServerError::JsonError(e.to_string()))
    }

    fn all_event_string(&self, sdk_key: &str) -> Result<String, FPServerError> {
        let clients = self.sdk_clients.read();
        let client = match clients.get(sdk_key) {
            Some(client) if !client.initialized() => {
                return Err(FPServerError::NotReady(sdk_key.to_string()))
            }
            Some(client) => client,
            None => return Err(FPServerError::NotReady(sdk_key.to_string())),
        };
        let arc_repo = client.repo();
        let repo = arc_repo.read();
        serde_json::to_string(&repo.events).map_err(|e| FPServerError::JsonError(e.to_string()))
    }
}

#[cfg(test)]
mod tests {

    use super::*;
    use crate::FPServerError::{NotFound, NotReady};
    use axum::{routing::get, Json, Router, TypedHeader};
    #[cfg(feature = "unstable")]
    use feature_probe_server_sdk::FPUser;
    use feature_probe_server_sdk::{Repository, SdkAuthorization};
    #[cfg(feature = "unstable")]
    use serde_json::json;
    use std::{fs, net::SocketAddr, path::PathBuf, time::Duration};

    #[tokio::test]
    async fn test_repo_sync() {
        let port = 9590;
        setup_mock_api(port);
        let client_sdk_key = "client-sdk-key".to_owned();
        let server_sdk_key = "server-sdk-key".to_owned();
        let client_sdk_key2 = "client-sdk-key2".to_owned();
        let server_sdk_key2 = "server-sdk-key2".to_owned();
        let repository = setup_repository(port, &client_sdk_key, &server_sdk_key).await;

        let repo_string = repository.server_sdk_repo_string(&server_sdk_key);
        assert!(repo_string.is_ok());
        let r = serde_json::from_str::<Repository>(&repo_string.unwrap()).unwrap();
        assert_eq!(r, repo_from_test_file());

        let secret_keys = repository.secret_keys();
        assert_eq!(secret_keys.len(), 1);
        assert_eq!(secret_keys.get(&client_sdk_key), Some(&server_sdk_key));

        // test mapping sync

        let mut mapping = HashMap::new();
        mapping.insert(client_sdk_key2.to_string(), server_sdk_key2.to_string());
        let new = SecretMapping::new(2, mapping);
        let clients = { (repository.inner.sdk_clients.read()).clone() };
        assert!(clients.contains_key(&server_sdk_key));
        repository.inner.update_mapping(new);
        let secret_mapping = { (repository.inner.secret_mapping.read()).clone() };
        let secret = &secret_mapping.server_sdk_key(&client_sdk_key2);
        assert_eq!(secret_mapping.version(), 2);
        assert_eq!(secret.unwrap(), &server_sdk_key2.to_string());

        // test clients sync
        repository.inner.update_clients();
        let clients = { (repository.inner.sdk_clients.read()).clone() };
        assert!(!clients.contains_key(&server_sdk_key));
        assert!(clients.contains_key(&server_sdk_key2));

        let sdk_key = repository.client_sync_now(&server_sdk_key2, SyncType::Polling);
        assert!(sdk_key.is_ok());
    }

    #[tokio::test]
    async fn test_repo_sync2() {
        let port = 9591;
        setup_mock_api(port);
        let client_sdk_key = "client-sdk-key".to_owned();
        let server_sdk_key = "server-sdk-key".to_owned();
        let non_sdk_key = "non-exist-sdk-key".to_owned();
        let repository = setup_repository2(port).await;

        let repo_string_err = repository.server_sdk_repo_string(&non_sdk_key);
        assert_eq!(repo_string_err.err(), Some(NotFound(non_sdk_key)));
        let events_string = repository.client_sdk_events_string(&client_sdk_key);
        assert!(events_string.is_ok());
        let repo_string = repository.server_sdk_repo_string(&server_sdk_key);
        assert!(repo_string.is_ok());
        let r = serde_json::from_str::<Repository>(&repo_string.unwrap()).unwrap();
        assert!(r == repo_from_test_file());
        let secret_keys = repository.secret_keys();
        let secret_keys_version = repository.inner.secret_mapping.read().version();
        assert!(secret_keys_version == 1);
        assert!(secret_keys.len() == 1);
        assert!(secret_keys.get(&client_sdk_key) == Some(&server_sdk_key));
    }

    #[tokio::test]
    async fn test_not_ready_repo_sync() {
        let port = 9592;
        setup_mock_api(port);
        let client_sdk_key = "client-sdk-key".to_owned();
        let server_sdk_key = "server-sdk-key".to_owned();
        let repository = setup_not_ready_repository(port, &client_sdk_key, &server_sdk_key).await;

        let repo_string_err = repository.server_sdk_repo_string(&server_sdk_key);
        assert_eq!(repo_string_err.err(), Some(NotReady(server_sdk_key)));
    }

    #[cfg(feature = "unstable")]
    #[tokio::test]
    async fn test_update_toggles() {
        let port = 9592;
        setup_mock_api(port);

        let server_sdk_key = "sdk-key1".to_owned();
        let client_sdk_key = "client-sdk-key".to_owned();
        let repository = setup_repository(port, &client_sdk_key, &server_sdk_key).await;
        let client = repository.sdk_client(&server_sdk_key);
        assert!(client.is_some());

        let client = client.unwrap();
        let user = FPUser::new().with("city", "4");
        let default: HashMap<String, String> = HashMap::default();
        let v = client.json_value("json_toggle", &user, json!(default));
        assert!(v.get("variation_1").is_some());

        let mut map = update_toggles_from_file();
        let update_toggles = map.remove(&server_sdk_key);
        assert!(update_toggles.is_some());

        let update_toggles = update_toggles.unwrap();
        let result = repository.update_toggles(&server_sdk_key, update_toggles);
        assert!(result.is_ok());
    }

    async fn setup_repository(
        port: u16,
        client_sdk_key: &str,
        server_sdk_key: &str,
    ) -> SdkRepository {
        let toggles_url =
            Url::parse(&format!("http://127.0.0.1:{}/api/server-sdk/toggles", port)).unwrap();
        let events_url = Url::parse(&format!("http://127.0.0.1:{}/api/events", port)).unwrap();
        let analysis_url = None;
        let config = ServerConfig {
            toggles_url,
            events_url,
            analysis_url,
            refresh_interval: Duration::from_secs(1),
            client_sdk_key: Some(client_sdk_key.to_owned()),
            server_sdk_key: Some(server_sdk_key.to_owned()),
            keys_url: None,
            server_port: port,
            #[cfg(feature = "realtime")]
            realtime_port: port + 100,
            #[cfg(feature = "realtime")]
            realtime_path: "/server/realtime".to_owned(),
        };

        #[cfg(feature = "realtime")]
        let rs = RealtimeSocket::serve(config.realtime_port, &config.realtime_path);

        let repo = SdkRepository::new(
            config,
            #[cfg(feature = "realtime")]
            rs,
        );
        repo.sync(client_sdk_key.to_owned(), server_sdk_key.to_owned(), 1);
        tokio::time::sleep(Duration::from_millis(100)).await;
        repo
    }

    async fn setup_not_ready_repository(
        port: u16,
        client_sdk_key: &str,
        server_sdk_key: &str,
    ) -> SdkRepository {
        let toggles_url =
            Url::parse(&format!("http://127.0.0.1:{}/api/server-sdk/toggles", port)).unwrap();
        let events_url = Url::parse(&format!("http://127.0.0.1:{}/api/events", port)).unwrap();
        let analysis_url = None;
        let config = ServerConfig {
            toggles_url,
            events_url,
            analysis_url,
            refresh_interval: Duration::from_secs(1),
            client_sdk_key: Some(client_sdk_key.to_owned()),
            server_sdk_key: Some(server_sdk_key.to_owned()),
            keys_url: None,
            server_port: port,
            #[cfg(feature = "realtime")]
            realtime_port: port + 100,
            #[cfg(feature = "realtime")]
            realtime_path: "/server/realtime".to_owned(),
        };

        #[cfg(feature = "realtime")]
        let rs = RealtimeSocket::serve(config.realtime_port, &config.realtime_path);

        let repo = SdkRepository::new(
            config,
            #[cfg(feature = "realtime")]
            rs,
        );
        repo.sync(client_sdk_key.to_owned(), server_sdk_key.to_owned(), 0);
        tokio::time::sleep(Duration::from_millis(100)).await;
        repo
    }

    async fn setup_repository2(port: u16) -> SdkRepository {
        let toggles_url =
            Url::parse(&format!("http://127.0.0.1:{}/api/server-sdk/toggles", port)).unwrap();
        let events_url = Url::parse(&format!("http://127.0.0.1:{}/api/events", port)).unwrap();
        let keys_url = Url::parse(&format!("http://127.0.0.1:{}/api/secret-keys", port)).unwrap();
        let analysis_url = None;
        let config = ServerConfig {
            toggles_url,
            events_url,
            analysis_url,
            refresh_interval: Duration::from_millis(100),
            client_sdk_key: None,
            server_sdk_key: None,
            keys_url: Some(keys_url.clone()),
            server_port: port,
            #[cfg(feature = "realtime")]
            realtime_port: port + 100,
            realtime_path: "/server/realtime".to_owned(),
        };

        #[cfg(feature = "realtime")]
        let rs = RealtimeSocket::serve(config.realtime_port, &config.realtime_path);

        let repo = SdkRepository::new(
            config,
            #[cfg(feature = "realtime")]
            rs,
        );
        repo.sync_with(keys_url);
        tokio::time::sleep(Duration::from_millis(300)).await;
        repo
    }

    async fn server_sdk_toggles(
        TypedHeader(SdkAuthorization(_sdk_key)): TypedHeader<SdkAuthorization>,
    ) -> Json<Repository> {
        repo_from_test_file().into()
    }

    async fn secret_keys() -> String {
        r#" { "version": 1, "mapping": { "client-sdk-key": "server-sdk-key" } }"#.to_owned()
    }

    fn setup_mock_api(port: u16) {
        let app = Router::new()
            .route("/api/secret-keys", get(secret_keys))
            .route("/api/server-sdk/toggles", get(server_sdk_toggles));
        let addr = SocketAddr::from(([0, 0, 0, 0], port));
        tokio::spawn(async move {
            let _ = axum::Server::bind(&addr)
                .serve(app.into_make_service())
                .await;
        });
    }

    fn repo_from_test_file() -> Repository {
        let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        path.push("resources/fixtures/repo.json");
        let json_str = fs::read_to_string(path).unwrap();
        serde_json::from_str::<Repository>(&json_str).unwrap()
    }

    #[cfg(feature = "unstable")]
    fn update_toggles_from_file() -> HashMap<String, HashMap<String, Toggle>> {
        let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        path.push("resources/fixtures/toggles_update.json");
        let json_str = fs::read_to_string(path).unwrap();
        serde_json::from_str::<HashMap<String, HashMap<String, Toggle>>>(&json_str).unwrap()
    }
}
