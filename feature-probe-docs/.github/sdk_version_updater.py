import re

from requests import Session
from requests.adapters import HTTPAdapter


adapter = HTTPAdapter(
            pool_maxsize=5,
            pool_connections=5,
            max_retries=5,
        )
session = Session()
session.mount('https://', adapter)

sdk_versions = {
    'java': None,
    'android': None,
    'rust': None,
}


def nothrow(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            return None
        
    return wrapper

@nothrow
def parse_search_maven_org(artifact: str) -> str:
    resp = session.get(f'https://search.maven.org/solrsearch/select?q=com.featureprobe.{artifact}').json()
    return resp['response']['docs'][0]['latestVersion']

@nothrow
def parse_developer_aliyun_com(artifact: str) -> str:
    resp = session.get(f'https://developer.aliyun.com/artifact/aliyunMaven/searchArtifactByGav?groupId=com.featureprobe&artifactId={artifact}&version=&repoId=central').json()
    return resp['object'][0]['version']

@nothrow
def parse_crates_io(artifact: str) -> str:
    resp = session.get(f'https://crates.io/api/v1/crates/{artifact}').json()
    return resp['crate']['max_stable_version']


def update_java_docs(JAVA_DOC_PATH: str):
    with open(JAVA_DOC_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        content = re.sub('<artifactId>server-sdk-java</artifactId>\n    <version>.*</version>', f'<artifactId>server-sdk-java</artifactId>\n    <version>{sdk_versions["java"]}</version>', content)
        content = re.sub("implementation 'com\\.featureprobe:server-sdk-java:.*'", f"implementation 'com.featureprobe:server-sdk-java:{sdk_versions['java']}'", content)
        content = re.sub("./target/server-sdk-java-.*\\.jar", f"./target/server-sdk-java-{sdk_versions['java']}.jar", content)
    with open(JAVA_DOC_PATH, 'w', encoding='utf-8') as f:
        f.write(content)


def update_android_docs(ANDROID_DOC_PATH: str):
    with open(ANDROID_DOC_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        content = re.sub('com\\.featureprobe\\.mobile:android_sdk:.*@aar', f'com.featureprobe.mobile:android_sdk:{sdk_versions["android"]}@aar', content)
    with open(ANDROID_DOC_PATH, 'w', encoding='utf-8') as f:
        f.write(content)


if __name__ == '__main__':
    sdk_versions['java'] = parse_search_maven_org('server-sdk-java') or parse_developer_aliyun_com('server-sdk-java')
    sdk_versions['android'] = parse_search_maven_org('client-sdk-android') or parse_developer_aliyun_com('client-sdk-android')
    # sdk_versions['rust'] = parse_crates_io('feature-probe-server-sdk')

    print(sdk_versions)
    
    update_java_docs('docs/tutorials/rollout_tutorial/index.md')
    update_java_docs('docs/tutorials/rollout_tutorial/stable_rollout_tutorial.md')
    update_java_docs('docs/tutorials/backend_custom_attribute.md')
    update_java_docs('docs/how-to/Server-Side SDKs/java-sdk.md')
    update_android_docs('docs/how-to/Client-Side SDKs/android-sdk.md')

    update_java_docs('i18n/zh-CN/docusaurus-plugin-content-docs/current/tutorials/rollout_tutorial/index.md')
    update_java_docs('i18n/zh-CN/docusaurus-plugin-content-docs/current/tutorials/rollout_tutorial/stable_rollout_tutorial.md')
    update_java_docs('i18n/zh-CN/docusaurus-plugin-content-docs/current/tutorials/backend_custom_attribute.md')
    update_java_docs('i18n/zh-CN/docusaurus-plugin-content-docs/current/how-to/Server-Side SDKs/java-sdk.md')
    update_android_docs('i18n/zh-CN/docusaurus-plugin-content-docs/current/how-to/Client-Side SDKs/android-sdk.md')
