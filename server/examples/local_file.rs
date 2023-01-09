use std::{sync::Arc, time::Duration};

use feature_probe_server::{
    base::ServerConfig,
    http::{serve_http, FpHttpHandler, LocalFileHttpHandlerForTest},
    repo::SdkRepository,
};

#[cfg(feature = "realtime")]
use feature_probe_server::realtime::RealtimeSocket;
use feature_probe_server_sdk::Url;

#[tokio::main]
async fn main() {
    // mock fp api
    let api_port = 9991;
    tokio::spawn(serve_http::<LocalFileHttpHandlerForTest>(
        api_port,
        LocalFileHttpHandlerForTest::default(),
    ));

    let server_sdk_key = "server-sdk-key1".to_owned();
    let client_sdk_key = "client-sdk-key1".to_owned();

    // start fp server
    let fp_port = 9990;
    let toggles_url = Url::parse(&format!(
        "http://0.0.0.0:{}/api/server-sdk/toggles",
        api_port
    ))
    .unwrap();
    let events_url = Url::parse(&format!("http://0.0.0.0:{}/api/events", api_port)).unwrap();
    let refresh_seconds = Duration::from_secs(1);
    let config = ServerConfig {
        toggles_url,
        events_url: events_url.clone(),
        keys_url: None,
        refresh_interval: refresh_seconds,
        client_sdk_key: Some(client_sdk_key.clone()),
        server_sdk_key: Some(server_sdk_key.clone()),
        server_port: 9000,
        #[cfg(feature = "realtime")]
        realtime_port: 9100,
        #[cfg(feature = "realtime")]
        realtime_path: "/server/realtime".to_owned(),
    };

    #[cfg(feature = "realtime")]
    let realtime_socket = RealtimeSocket::serve(config.realtime_port, &config.realtime_path);
    let repo = SdkRepository::new(
        config,
        #[cfg(feature = "realtime")]
        realtime_socket,
    );
    repo.sync(client_sdk_key, server_sdk_key, 1);
    let repo = Arc::new(repo);
    let feature_probe_server = FpHttpHandler {
        repo: repo.clone(),
        events_url,
        events_timeout: refresh_seconds,
        http_client: Default::default(),
    };
    tokio::spawn(serve_http::<FpHttpHandler>(fp_port, feature_probe_server));

    tokio::signal::ctrl_c().await.expect("shut down");
}
