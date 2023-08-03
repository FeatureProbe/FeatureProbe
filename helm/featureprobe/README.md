
Featureprobe
===========

A Helm chart for FeatureProbe feature management service


## Configuration

The following table lists the configurable parameters of the Featureprobe chart and their default values.

| Parameter                | Description             | Default        |
| ------------------------ | ----------------------- | -------------- |
| `timezone` | Timezone for containers in pods | `"America/Chicago"` |
| `ingress` | The list of Ingress resources to create | `[]` |
| `apiEndpoints.toggles` | Allows to set custom API endpoint for toggles | `null` |
| `apiEndpoints.events` | Allows to set custom API endpoint for events | `null` |
| `apiEndpoints.keys` | Allows to set custom API endpoint for keys | `null` |
| `apiEndpoints.analysis` | Allows to set custom API endpoint for analysis | `null` |
| `apiEndpoints.analysis_base` | Allows to set custom value for analysis base URL | `null` |
| `apiEndpoints.server_base` | Allows to set custom value for server base URL | `null` |
| `ldap.enabled` | Enable or disable LDAP setup | `false` |
| `ldap.url` | LDAP server URI | `"ldaps://ldap.example.com:389"` |
| `ldap.credentialsSecretName` | The name of Kubernetes secret with LDAP credentials | `"featureprobe-credentials"` |
| `ldap.credentialsManagerDnSecretKey` | The name of the key with manager DN value | `"ldap-username"` |
| `ldap.credentialsPasswordSecretKey` | The name of the key with manager password | `"ldap-password"` |
| `ldap.usernameAttribute` | User name attribute value | `"sAMAccountName"` |
| `ldap.searchBase` | LDAP users search base | `"ou=Users,dc=example,dc=com"` |
| `ldap.truststoreConfigmapName` | The name of Kubernetes ConfigMap name for LDAP trusted certificate | `null` |
| `ldap.truststorePassword` |  | `"changeit"` |
| `backendAPI.name` | Always "backend-api" | `"backend-api"` |
| `backendAPI.enabled` | Enables or disables backend API service deployment | `true` |
| `backendAPI.replicaCount` | The number of replicas for backend API service | `2` |
| `backendAPI.logLevel` | Backend API service logging level | `"INFO"` |
| `backendAPI.ports.http` | Backend API service HTTP port number | `4008` |
| `backendAPI.image.repository` | Container repository to pull the image from | `"featureprobe/api"` |
| `backendAPI.image.tag` | Image tag to use | `null` |
| `backendAPI.image.pullPolicy` | Container image pull policy | `"IfNotPresent"` |
| `backendAPI.readinessProbe.httpGet.path` | Health check path | `"/actuator/health"` |
| `backendAPI.readinessProbe.httpGet.port` | Health check port | `"http"` |
| `backendAPI.readinessProbe.initialDelaySeconds` | Health check initial delay, seconds | `10` |
| `backendAPI.resources.requests.memory` | Backend API service memory resources requests | `"64Mi"` |
| `backendAPI.resources.requests.cpu` | Backend API service CPU resources requests | `"250m"` |
| `backendAPI.resources.limits.memory` | Backend API service memory resources limits | `"2Gi"` |
| `backendAPI.resources.limits.cpu` | Backend API service CPU resources limits | `2` |
| `backendAPI.service.labels` | Backend API service labels | `{}` |
| `backendAPI.service.type` | Backend API service type | `"ClusterIP"` |
| `backendAPI.database.url` | Backend API database connection URL | `"jdbc:mysql://localhost:3306/featureprobe"` |
| `backendAPI.database.secret_name` | The name of Kubernetes secret that holds database credentials | `"featureprobe-database-credentials"` |
| `backendAPI.database.username_secret_key` | Kubernetes secret key for MySQL user name | `"featureprobe_user"` |
| `backendAPI.database.password_secret_key` | Kubernetes secret key for MySQL password | `"featureprobe_password"` |
| `serverAPI.name` | Always "server-api" | `"server-api"` |
| `serverAPI.enabled` | Enables or disables Server API service deployment | `true` |
| `serverAPI.replicaCount` | The number of replicas for Server API service | `2` |
| `serverAPI.refreshSeconds` | Refresh interval | `3` |
| `serverAPI.ports.http` | Server API service HTTP port number | `4007` |
| `serverAPI.ports.realtime` | Server API service "realtime" HTTP port number | `4011` |
| `serverAPI.image.repository` | Container repository to pull the image from | `"featureprobe/server"` |
| `serverAPI.image.tag` | Image tag to use | `null` |
| `serverAPI.image.pullPolicy` | Container image pull policy | `"IfNotPresent"` |
| `serverAPI.resources.requests.memory` | Server API service memory resources requests | `"64Mi"` |
| `serverAPI.resources.requests.cpu` | Server API service CPU resources requests | `"250m"` |
| `serverAPI.resources.limits.memory` | Server API service memory resources limits | `"2Gi"` |
| `serverAPI.resources.limits.cpu` | Server API service CPU resources limits | `2` |
| `serverAPI.readinessProbe.httpGet.path` | Health check path | `"/"` |
| `serverAPI.readinessProbe.httpGet.port` | Health check port | `"http"` |
| `serverAPI.service.labels` | Server API service labels | `{}` |
| `serverAPI.service.type` | Server API service type | `"ClusterIP"` |
| `ui.name` | Always "ui" | `"ui"` |
| `ui.enabled` | Enables or disables UI deployment | `true` |
| `ui.replicaCount` | The number of replicas for UI service | `2` |
| `ui.ports.http` | UI service HTTP port number | `4009` |
| `ui.image.repository` | Container repository to pull the image from | `"featureprobe/ui"` |
| `ui.image.tag` | Image tag to use | `null` |
| `ui.image.pullPolicy` | Container image pull policy | `"IfNotPresent"` |
| `ui.resources.requests.memory` | UI service memory resources requests | `"64Mi"` |
| `ui.resources.requests.cpu` | UI service CPU resources requests | `"250m"` |
| `ui.resources.limits.memory` | UI service memory resources limits | `"512Mi"` |
| `ui.resources.limits.cpu` | UI service CPU resources limits | `1` |
| `ui.readinessProbe.httpGet.path` | Health check path | `"/"` |
| `ui.readinessProbe.httpGet.port` | Health check port | `"http"` |
| `ui.service.labels` | UI service labels | `{}` |
| `ui.service.type` | UI service type | `"ClusterIP"` |
| `analysisAPI.name` | Always "analysis-api" | `"analysis-api"` |
| `analysisAPI.enabled` | Enables or disables analysis API service deployment | `true` |
| `analysisAPI.replicaCount` | The number of replicas for analysis API service | `2` |
| `analysisAPI.jvmArgs` | Analysis API JVM arguments | `"-Xmx2048m -Xms2048m"` |
| `analysisAPI.ports.http` | Analysis API service HTTP port number | `4006` |
| `analysisAPI.image.repository` | Container repository to pull the image from | `"featureprobe/analysis"` |
| `analysisAPI.image.tag` | Image tag to use | `null` |
| `analysisAPI.image.pullPolicy` | Container image pull policy | `"IfNotPresent"` |
| `analysisAPI.resources.requests.memory` | Analysis API service memory resources requests | `"1024Mi"` |
| `analysisAPI.resources.requests.cpu` | Analysis API service CPU resources requests | `"1"` |
| `analysisAPI.resources.limits.memory` | Analysis API service memory resources limits | `"4Gi"` |
| `analysisAPI.resources.limits.cpu` | Analysis API service CPU resources limits | `2` |
| `analysisAPI.readinessProbe.tcpSocket.port` | Health check port | `"http"` |
| `analysisAPI.readinessProbe.initialDelaySeconds` |  | `30` |
| `analysisAPI.service.labels` | Analysis API service labels | `{}` |
| `analysisAPI.service.type` | Analysis API service type | `"ClusterIP"` |
| `analysisAPI.database.url` | Analysis API database connection URL | `"jdbc:mysql://localhost:3306/featureprobe-events"` |
| `analysisAPI.database.secret_name` | The name of Kubernetes secret that holds database credentials | `"featureprobe-database-credentials"` |
| `analysisAPI.database.username_secret_key` | Kubernetes secret key for MySQL user name | `"featureprobe_events_user"` |
| `analysisAPI.database.password_secret_key` | Kubernetes secret key for MySQL password | `"featureprobe_events_password"` |
| `databaseSecret.create` | Creates a Kubernetes secret with database credentials. If the secret already exists, leave it `false`. | `false` |
| `databaseSecret.namePostfix` | Name postfix for database Kubernetes secret | `"database-credentials"` |
| `databaseSecret.secrets.featureprobe_user` | Kubernetes secret key for Backend API MySQL user name | `"featureprobe"` |
| `databaseSecret.secrets.featureprobe_password` | Kubernetes secret key for Backend API MySQL user password | `null` |
| `databaseSecret.secrets.featureprobe_events_user` | Kubernetes secret key for Analysis API MySQL user name | `"featureprobe_events"` |
| `databaseSecret.secrets.featureprobe_events_password` | Kubernetes secret key for Analysis API MySQL user password | `null` |



---
_Documentation generated by [Frigate](https://frigate.readthedocs.io)._

