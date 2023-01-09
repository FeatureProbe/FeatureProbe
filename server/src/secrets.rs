use std::{collections::HashMap, ops::Deref};

use serde::Deserialize;

type ClientSdkKey = String;
type ServerSdkKey = String;

#[derive(Deserialize, Debug, Default, Clone)]
pub struct SecretMapping {
    version: u128,
    mapping: HashMap<ClientSdkKey, ServerSdkKey>,
    #[serde(skip)]
    reverse: HashMap<ServerSdkKey, ClientSdkKey>,
}

impl SecretMapping {
    #[cfg(test)]
    pub fn new(version: u128, mapping: HashMap<ClientSdkKey, ServerSdkKey>) -> Self {
        let mut reverse = HashMap::new();
        for (k, v) in &mapping {
            reverse.insert(v.clone(), k.clone());
        }
        Self {
            version,
            mapping,
            reverse,
        }
    }

    pub fn version(&self) -> u128 {
        self.version
    }

    pub fn update_mapping(&mut self, new: SecretMapping) {
        if new.version > self.version {
            self.version = new.version;
            self.mapping = new.mapping;

            let mut reverse = HashMap::new();
            for (k, v) in &self.mapping {
                reverse.insert(v.clone(), k.clone());
            }

            self.reverse = reverse;
        }
    }

    pub fn client_sdk_key(&self, server_sdk_key: &str) -> Option<&String> {
        self.reverse.get(server_sdk_key)
    }

    pub fn server_sdk_key(&self, client_sdk_key: &str) -> Option<&String> {
        self.mapping.get(client_sdk_key)
    }

    pub fn server_sdk_keys(&self) -> Vec<&String> {
        self.reverse.keys().into_iter().collect()
    }

    pub fn mapping_clone(&self) -> HashMap<String, String> {
        self.mapping.clone()
    }

    pub fn insert(&mut self, client_sdk_key: String, server_sdk_key: String, version: u128) {
        self.version = version;
        self.mapping
            .insert(client_sdk_key.clone(), server_sdk_key.clone());
        self.reverse.insert(server_sdk_key, client_sdk_key);
    }

    pub fn contains_server_sdk_key(&self, server_sdk_key: &str) -> bool {
        self.reverse.contains_key(server_sdk_key)
    }
}

impl Deref for SecretMapping {
    type Target = HashMap<ClientSdkKey, ServerSdkKey>;

    fn deref(&self) -> &Self::Target {
        &self.mapping
    }
}
