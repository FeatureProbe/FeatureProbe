use feature_probe_server_sdk::Url;
use serde::Deserialize;
use std::{fmt::Display, time::Duration};
use thiserror::Error;
use tracing_core::{Event, Subscriber};
use tracing_log::NormalizeEvent;
use tracing_subscriber::fmt::{
    format::{self, FormatEvent, FormatFields},
    time::{FormatTime, SystemTime},
    FmtContext,
};
use tracing_subscriber::registry::LookupSpan;

#[derive(Debug, Error, Deserialize, PartialEq, Eq)]
pub enum FPServerError {
    #[error("not found {0}")]
    NotFound(String),
    #[error("user base64 decode error")]
    UserDecodeError,
    #[error("config error: {0}")]
    ConfigError(String),
    #[error("not ready error: {0}")]
    NotReady(String),
    #[error("json error: {0}")]
    JsonError(String),
}

#[derive(Debug, Clone)]
pub struct ServerConfig {
    pub toggles_url: Url,
    pub events_url: Url,
    pub keys_url: Option<Url>,
    pub refresh_interval: Duration,
    pub server_sdk_key: Option<String>,
    pub client_sdk_key: Option<String>,
    pub server_port: u16,
    #[cfg(feature = "realtime")]
    pub realtime_port: u16,
    #[cfg(feature = "realtime")]
    pub realtime_path: String,
}

impl ServerConfig {
    pub fn try_parse(config: config::Config) -> Result<ServerConfig, FPServerError> {
        let toggles_url = match config.get_string("toggles_url") {
            Err(_) => {
                return Err(FPServerError::ConfigError(
                    "NOT SET FP_TOGGLES_URL".to_owned(),
                ))
            }
            Ok(url) => match Url::parse(&url) {
                Err(e) => {
                    return Err(FPServerError::ConfigError(format!(
                        "INVALID FP_TOGGLES_URL: {}",
                        e,
                    )))
                }
                Ok(u) => u,
            },
        };

        let events_url = match config.get_string("events_url") {
            Err(_) => {
                return Err(FPServerError::ConfigError(
                    "NOT SET FP_EVENTS_URL".to_owned(),
                ))
            }
            Ok(url) => match Url::parse(&url) {
                Err(e) => {
                    return Err(FPServerError::ConfigError(format!(
                        "INVALID FP_EVENTS_URL: {}",
                        e,
                    )))
                }
                Ok(u) => u,
            },
        };
        let client_sdk_key = config.get_string("client_sdk_key").ok();
        let server_sdk_key = config.get_string("server_sdk_key").ok();

        let keys_url = match config.get_string("keys_url") {
            Ok(url) => match Url::parse(&url) {
                Err(e) => {
                    return Err(FPServerError::ConfigError(format!(
                        "INVALID FP_KEYS_URL: {}",
                        e,
                    )))
                }
                Ok(u) => Some(u),
            },
            Err(_) => {
                if client_sdk_key.is_none() {
                    return Err(FPServerError::ConfigError(
                        "NOT SET FP_CLIENT_SDK_KEY".to_owned(),
                    ));
                }
                if server_sdk_key.is_none() {
                    return Err(FPServerError::ConfigError(
                        "NOT SET FP_SERVER_SDK_KEY".to_owned(),
                    ));
                }
                None
            }
        };

        let refresh_interval = match config.get_int("refresh_seconds") {
            Err(_) => {
                return Err(FPServerError::ConfigError(
                    "NOT SET FP_REFRESH_SECONDS".to_owned(),
                ))
            }
            Ok(interval) => Duration::from_secs(interval as u64),
        };
        let server_port = match config.get_int("server_port") {
            Err(_) => 9000, // default port
            Ok(port) => port as u16,
        };

        #[cfg(feature = "realtime")]
        let realtime_port = match config.get_int("realtime_port") {
            Err(_) => 9100, // default port
            Ok(port) => port as u16,
        };

        #[cfg(feature = "realtime")]
        let realtime_path = match config.get_string("realtime_path") {
            Err(_) => "/server/realtime".to_owned(), // default port
            Ok(path) => path,
        };

        Ok(ServerConfig {
            toggles_url,
            events_url,
            keys_url,
            refresh_interval,
            client_sdk_key,
            server_sdk_key,
            server_port,
            #[cfg(feature = "realtime")]
            realtime_port,
            #[cfg(feature = "realtime")]
            realtime_path,
        })
    }
}

impl Display for ServerConfig {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let keys_url = match &self.keys_url {
            None => "None".to_owned(),
            Some(s) => s.to_string(),
        };
        write!(f, "server_port {}, toggles_url {}, events_url {}, keys_url {}, refresh_interval {:?}, client_sdk_key {:?}, server_sdk_key {:?}",
            self.server_port,
            self.toggles_url,
            self.events_url,
            keys_url,
            self.refresh_interval,
            self.client_sdk_key,
            self.server_sdk_key,
        )
    }
}

#[derive(Debug)]
pub struct LogFormatter<T = SystemTime> {
    timer: T,
}

impl<T2> LogFormatter<T2>
where
    T2: FormatTime,
{
    #[allow(dead_code)]
    pub fn with_timer(timer: T2) -> Self {
        LogFormatter { timer }
    }
}

impl<C, N, T> FormatEvent<C, N> for LogFormatter<T>
where
    C: Subscriber + for<'a> LookupSpan<'a>,
    N: for<'a> FormatFields<'a> + 'static,
    T: FormatTime,
{
    fn format_event(
        &self,
        ctx: &FmtContext<'_, C, N>,
        mut writer: format::Writer<'_>,
        event: &Event<'_>,
    ) -> std::fmt::Result {
        let normalized = event.normalized_metadata();
        let meta = normalized.as_ref().unwrap_or_else(|| event.metadata());
        write!(writer, "[{}][", meta.level())?;
        if self.timer.format_time(&mut writer).is_err() {
            write!(writer, "<unknown time>")?;
        }
        write!(writer, "]")?;
        if let Some(m) = meta.module_path() {
            write!(writer, "[{}", m)?;
        }
        if let Some(l) = meta.line() {
            write!(writer, ":{}", l)?;
        }
        write!(writer, "]")?;

        ctx.field_format().format_fields(writer.by_ref(), event)?;
        writeln!(writer)
    }
}
