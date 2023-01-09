use std::pin::Pin;
use std::sync::Arc;

use futures::{Future, FutureExt};
use serde_json::Value;
use socketio_rs::{Payload, Server, ServerBuilder, ServerSocket};
use tracing::{info, trace, warn};

type SocketCallback = Pin<Box<dyn Future<Output = ()> + Send>>;

#[derive(Clone)]
pub struct RealtimeSocket {
    server: Arc<Server>,
    port: u16,
    // this path shoule be the same as gateway
    // if nginx forward to {host}/{path}, so the PATH should be {path}
    path: Arc<String>,
}

impl RealtimeSocket {
    pub fn serve(port: u16, path: &str) -> Self {
        info!("serve_socektio on port {}", port);
        let callback =
            |payload: Option<Payload>, socket: ServerSocket, _| Self::register(payload, socket);

        let server = ServerBuilder::new(port)
            .on(path, "register", callback)
            .build();

        let server_clone = server.clone();

        tokio::spawn(async move {
            server_clone.serve().await;
        });

        let path = Arc::new(path.to_owned());

        Self { server, port, path }
    }

    pub async fn notify_sdk(
        &self,
        server_sdk_key: String,
        client_sdk_key: Option<String>,
        event: &str,
        data: serde_json::Value,
    ) {
        trace!(
            "notify_sdk {} {:?} {} {:?}",
            server_sdk_key,
            client_sdk_key,
            event,
            data
        );

        let mut keys: Vec<&str> = vec![&server_sdk_key];
        if let Some(client_sdk_key) = &client_sdk_key {
            keys.push(client_sdk_key);
        }

        self.server.emit_to(&self.path, keys, event, data).await
    }

    fn register(payload: Option<Payload>, socket: ServerSocket) -> SocketCallback {
        async move {
            info!("socketio recv {:?}", payload);
            if let Some(Payload::Json(value)) = payload {
                match value.get("key") {
                    Some(Value::String(sdk_key)) => socket.join(vec![sdk_key]).await,
                    _ => {
                        warn!("unkown register payload")
                    }
                }
            }

            let _ = socket.emit("update", serde_json::json!("")).await;
        }
        .boxed()
    }
}

impl std::fmt::Debug for RealtimeSocket {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("RealtimeSocket").field(&self.port).finish()
    }
}
