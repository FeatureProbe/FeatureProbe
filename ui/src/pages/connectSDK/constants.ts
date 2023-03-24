import { IntlShape } from 'react-intl';
import java from 'images/java.svg';
import rust from 'images/rust.svg';
import go from 'images/go.svg';
import python from 'images/python.svg';
import node from 'images/nodejs.svg';
import javascript from 'images/javascript.svg';
import android from 'images/android.svg';
import swift from 'images/swift.svg';
import apple from 'images/apple.svg';
import miniprogram from 'images/wechat-miniprogram.png';
import reactLogo from 'images/react.svg';

export type ToggleReturnType = '' | 'boolean' | 'number' | 'string' | 'json';

export type SdkLanguage = 
  'Java'
  | 'Python'
  | 'Rust'
  | 'Go'
  | 'Node.js'
  | 'Android'
  | 'Swift'
  | 'Objective-C'
  | 'JavaScript'
  | 'Mini Program'
  | 'React';

export const SDK_LOGOS: {[key in SdkLanguage]: string} = {
  'Java': java,
  'Rust': rust,
  'Go': go,
  'Python': python,
  'Node.js': node,
  'JavaScript': javascript,
  'Android': android,
  'Swift': swift,
  'Objective-C': apple,
  'Mini Program': miniprogram,
  'React': reactLogo,
};

export const SDK_TYPES = new Map([
  ['Java', 'Java'],
  ['Rust', 'Rust'],
  ['Go', 'Go'],
  ['Python', 'Python'],
  ['Node.js', 'NodeJS'],
  ['JavaScript', 'JavaScript'],
  ['Android', 'Android'],
  ['Swift', 'Swift'],
  ['Objective-C', 'ObjectiveC'],
  ['Mini Program', 'MiniProgram'],
]);

export const SERVER_SIDE_SDKS = [
  {
    name: 'Java',
    logo: java,
  },
  {
    name: 'Go',
    logo: go,
  },
  {
    name: 'Python',
    logo: python,
  },
  {
    name: 'Rust',
    logo: rust,
  },
  {
    name: 'Node.js',
    logo: node,
  },
];

export const CLIENT_SIDE_SDKS = [
  {
    name: 'JavaScript',
    logo: javascript,
  },
  {
    name: 'Android',
    logo: android,
  },
  {
    name: 'Swift',
    logo: swift,
  },
  {
    name: 'Objective-C',
    logo: apple,
  },
  {
    name: 'Mini Program',
    logo: miniprogram,
  },
  {
    name: 'React',
    logo: reactLogo,
  }
];

export const CLIENT_SIDE_AUTO_REPORT_SDKS = [
  {
    name: 'JavaScript',
    logo: javascript,
  },
  {
    name: 'React',
    logo: reactLogo,
  }
];

export const SDK_VERSION = new Map([
  ['Java', 'java_sdk_version'],
  ['Rust', 'rust_sdk_version'],
  ['Android', 'android_sdk_version'],
]);

interface IOption {
  intl: IntlShape;
  returnType: ToggleReturnType;
  userWithCode: string;
  remoteUrl: string;
  sdkVersion?: string;
  toggleKey?: string;
  serverSdkKey?: string;
  clientSdkKey?: string;
}

export const getJavaCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, sdkVersion, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.java.first.step'}),
      name: intl.formatMessage({id: 'getstarted.java.first.step.name.one'}),
      code: 'mvn archetype:generate -DgroupId=com.featureprobe.demo -DartifactId=featureprobe-java-demo'
    },
    {
      name: intl.formatMessage({id: 'getstarted.java.first.step.name.two'}),
      code:
`<dependency>
  <groupId>com.featureprobe</groupId>
  <artifactId>server-sdk-java</artifactId>
  <version>${sdkVersion}</version>
</dependency>
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.second.step'}),
      code:
`private static final FPConfig config = FPConfig.builder()
        .remoteUri("${remoteUrl}")
        .build();
private static final FeatureProbe fp = new FeatureProbe("${serverSdkKey}", config);
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.common.third.step'}),
      code:
`FPUser user = new FPUser()${userWithCode};

${eventName ? (
  `${isTrackValue ? `fp.track("${eventName}", user, /* value */);` : `fp.track("${eventName}", user);`}`
) : 
`${returnType === 'boolean' ? `boolean boolValue = fp.boolValue("${toggleKey}", user, false);` : ''}${returnType === 'string' ? `String stringValue = fp.stringValue("${toggleKey}", user, "Test");` : ''}${returnType === 'number' ? `double numberValue = fp.numberValue("${toggleKey}", user, 500);` : ''}${returnType === 'json' ? `Map jsonValue = fp.jsonValue("${toggleKey}", user, new HashMap(), Map.class);` : ''}`
} 
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.fourth.step'}),
      code: 'fp.close();'
    }
  ];
};

export const getRustCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, sdkVersion, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.rust.first.step'}),
      code: `feature-probe-server-sdk = ${sdkVersion}`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.second.step'}),
      code:
`use feature_probe_server_sdk::{FPConfig, FPUser, FeatureProbe};
let config = FPConfig {
    remote_url: "${remoteUrl}".to_owned(),
    server_sdk_key: "${serverSdkKey}".to_owned(),
    refresh_interval: Duration::from_secs(1),
    start_wait: Some(Duration::from_secs(1))
    ..Default::default()
};

let fp = match FeatureProbe::new(config).unwrap(); //should check result in production
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.common.third.step'}),
      code:
`let user = FPUser::new();
${userWithCode}
${eventName ? (
  `${isTrackValue ? `fp.track("${eventName}", &user, Some(/* value */));` : `fp.track("${eventName}", &user, None);`}`
) :
`${returnType === 'boolean' ? `let value = fp.bool_value("${toggleKey}", &user, false);` : ''}${returnType === 'number' ? `let value = fp.number_value("${toggleKey}", &user, 20.0), 12.5);` : ''}${returnType === 'string' ? `let value = fp.string_value("${toggleKey}", &user, "val".to_owned()), "value");` : ''}${returnType === 'json' ? `let value = fp.json_value("${toggleKey}", &user, json!("v"));` : ''}`}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.fourth.step'}),
      code: 'fp.close();'
    }
  ];
};

export const getGoCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.go.first.step.title'}),
      name: intl.formatMessage({id: 'getstarted.go.first.step.name.one'}),
      code: 'import "github.com/featureprobe/server-sdk-go"'
    },
    {
      name: intl.formatMessage({id: 'getstarted.go.first.step.name.two'}),
      code: 'go get github.com/featureprobe/server-sdk-go'
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.second.step'}),
      code:
`config := featureprobe.FPConfig{
    RemoteUrl:       "${remoteUrl}",
    ServerSdkKey:    "${serverSdkKey}",
    RefreshInterval: 2 * time.Second,
    StartWait:       5 * time.Second,
}
  
fp, err := featureprobe.NewFeatureProbe(config)
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.common.third.step'}),
      code:
`user := featureprobe.NewUser()
${userWithCode}
${eventName ? (
  `${isTrackValue ? `fp.track("${eventName}", user, /* value */);` : `fp.track("${eventName}", user, nil);`}`
) :
`${returnType === 'boolean' ? `val := fp.BoolValue("${toggleKey}", user, true)` : ''}${returnType === 'string' ? `val := fp.StrValue("${toggleKey}", user, "1")` : ''}${returnType === 'number' ? `val := fp.NumberValue("${toggleKey}", user, 1.0)` : ''}${returnType === 'json' ? `val := fp.JsonValue("${toggleKey}", user, nil)` : ''}`
}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.fourth.step'}),
      code: 'fp.Close();'
    }
  ];
};

export const getPythonCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.python.first.step'}),
      code: 'pip3 install featureprobe-server-sdk-python'
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.second.step'}),
      code:
`import featureprobe as fp

config = fp.Config(remote_uri='${remoteUrl}', sync_mode='pooling', refresh_interval=3)
client = fp.Client('${serverSdkKey}', config)
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.common.third.step'}),
      code: 
`user = fp.User()
${userWithCode}
${eventName ? (
  `${isTrackValue ? `fp.track("${eventName}", user, 'value')` : `fp.track("${eventName}", user)`}`
): 
`val = client.value('${toggleKey}', user, default=${returnType === 'boolean' ? 'False' : ''}${returnType === 'string' ? '\'not connected\'' : ''}${returnType === 'number' ? '-1' : ''}${returnType === 'json' ? '{}' : ''})`}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.fourth.step'}),
      code: 'client.close()'
    }
  ];
};

export const getNodeCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, serverSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.node.first.step'}),
      code: 'npm install featureprobe-server-sdk-node --save'
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.second.step'}),
      code:
`import { FeatureProbe, FPUser } from 'featureprobe-server-sdk-node'

const fp = new FeatureProbe({
    serverSdkKey: '${serverSdkKey}',
    remoteUrl: '${remoteUrl}',
    refreshInterval: 2000,
})
await fp.start();  // if you want a time limit for the initialization process, set 'startWait' as the timeout milliseconds
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.common.third.step'}),
      code:
`const user = new FPUser()${userWithCode};

${eventName ? (
  `${isTrackValue ? `fp.track("${eventName}", user, /* value */);` : `fp.track("${eventName}", user);`}`
) : 
`const toggleValue = fp.${returnType}Value('${toggleKey}', user, ${returnType === 'boolean' ? 'false' : ''}${returnType === 'string' ? '\'not connected\'' : ''}${returnType === 'number' ? '-1' : ''}${returnType === 'json' ? '{}' : ''});`}
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.common.fourth.step'}),
      code: 'await fp.close();'
    }
  ];
};

export const getAndroidCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl, sdkVersion } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.mobile.first.step'}),
      code:
`implementation 'com.featureprobe:client-sdk-android:${sdkVersion}@aar'
implementation "net.java.dev.jna:jna:5.7.0@aar"
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.mobile.second.step'}),
      code:
`import com.featureprobe.mobile.*

val url = FpUrlBuilder("${remoteUrl}").build()
val user = FpUser()
${userWithCode}
val config = FpConfig(url!!, "${clientSdkKey}", 10u, true)
val fp = FeatureProbe(config, user)
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.mobile.third.step'}),
      code:
      `${eventName ? (
        `${isTrackValue ? `fp.track("${eventName}", /* value */)` : `fp.track("${eventName}")`}`
      ) : 
      `${returnType === 'boolean' ? `val value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `val value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `val value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `val value = fp.jsonValue("${toggleKey}", "{}")` : ''}`}`
    },
  ];
};

export const getSwiftCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.mobile.first.step'}),
      name: 'Swift Package Manager:',
      code:
`1. XCode -> File -> Add Packages -> input \`https://github.com/FeatureProbe/client-sdk-ios.git\`
2. click \`Add Package\`
`
    },
    {
      name: 'Cocoapods:',
      code:
`1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\`
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.mobile.second.step'}),
      name: '',
      code:
`import featureprobe
let url = FpUrlBuilder(remoteUrl: "${remoteUrl}").build()
let user = FpUser()
${userWithCode}
let config = FpConfig(
    remoteUrl: url!,
    clientSdkKey: "${clientSdkKey}",
    refreshInterval: 10,
    startWait: 2
)
let fp = FeatureProbe(config: config, user: user)
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.mobile.third.step'}),
      name: '',
      code: 
        `${eventName 
          ? `${isTrackValue ? `fp.track("${eventName}", /* value */)` : `fp.track("${eventName}")`}`
          : `${returnType === 'boolean' ? `let value = fp.boolValue("${toggleKey}", false)` : ''}${returnType === 'number' ? `let value = fp.numberValue("${toggleKey}", 1.0)` : ''}${returnType === 'string' ? `let value = fp.stringValue("${toggleKey}", "s")` : ''}${returnType === 'json' ? `let value = fp.jsonValue("${toggleKey}", "{}")` : ''}`
        }`
    }
  ];
};

export const getObjCCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  return [
    {
      title: intl.formatMessage({id: 'getstarted.mobile.first.step'}),
      name: 'Cocoapods:',
      code:
`1. add \`pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'\` to Podfile
2. \`pod install\` or \`pod update\`
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.mobile.second.step'}),
      name: '',
      code:
`#import "FeatureProbe-Swift.h"

NSString *urlStr = @"${remoteUrl}";
NSString *userId = /* User id in your business context */;
FpUrl *url = [[[FpUrlBuilder alloc] initWithRemoteUrl: urlStr] build];
FpUser *user = [[FpUser alloc] init];
${userWithCode}
FpConfig *config = [[FpConfig alloc] initWithRemoteUrl: url
                                          clientSdkKey:@"${clientSdkKey}"
                                       refreshInterval: 10
                                             startWait: 2];
FeatureProbe *fp = [[FeatureProbe alloc] initWithConfig:config user:user];`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.mobile.third.step'}),
      name: '',
      code: 
        `${eventName 
          ? `${isTrackValue ? `[fp trackWithEvent:@"${eventName}" value:/* value */];` : `[fp trackWithEvent:@"${eventName}"];`}`
          : `${returnType === 'boolean' ? `bool value = [fp boolValueWithKey: @"${toggleKey}" defaultValue: false];` : ''}${returnType === 'number' ? `double value = [fp numberValueWithKey: @"${toggleKey}" defaultValue: 1.0];` : ''}${returnType === 'string' ? `NSString* value = [fp stringValueWithKey: @"${toggleKey}" defaultValue: @"s"];` : ''}${returnType === 'json' ? `NSString* value = [fp jsonValueWithKey: @"${toggleKey}" defaultValue: @"{}"];` : ''}`
        }`
    }
  ];
};

export const getJSCode = (options: IOption, eventName?: string, isTrackValue?: boolean, isTrackEvent?: boolean) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;

  const result = [
    {
      title: intl.formatMessage({id: 'getstarted.js.first.step.title'}),
      name: 'NPM',
      code: 'npm install featureprobe-client-sdk-js --save'
    },
    {
      name: intl.formatMessage({id: 'getstarted.js.second.step.or'}) + 'CDN',
      code: '<script type="text/javascript" src="https://unpkg.com/featureprobe-client-sdk-js@latest/dist/featureprobe-client-sdk-js.min.js"></script>'
    },
    {
      title: intl.formatMessage({id: 'getstarted.js.second.step.title'}),
      name: 'NPM',
      code:
`import { FeatureProbe, FPUser } from "featureprobe-client-sdk-js";

const user = new FPUser();
${userWithCode}
const fp = new FeatureProbe({
    remoteUrl: "${remoteUrl}",
    clientSdkKey: "${clientSdkKey}",
    user,
});

fp.start();
`
    },
    {
      name: intl.formatMessage({id: 'getstarted.js.second.step.or'}) + 'CDN',
      code:
`const user = new featureProbe.FPUser();
${userWithCode}
const fp = new featureProbe.FeatureProbe({
    remoteUrl: "${remoteUrl}",
    clientSdkKey: "${clientSdkKey}",
    user,
});

fp.start();
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.js.third.step.title'}),
      name: eventName ? '' : intl.formatMessage({id: 'getstarted.js.third.step.name.one'}),
      code:
`fp.on("ready", function() {
  ${eventName 
    ? `${isTrackValue ? `fp.track("${eventName}", /* value */);` : `fp.track("${eventName}");`}`
    : `${returnType === 'boolean' ? `const value = fp.boolValue("${toggleKey}", false);` : ''}${returnType === 'number' ? `const value = fp.numberValue("${toggleKey}", 1.0);` : ''}${returnType === 'string' ? `const value = fp.stringValue("${toggleKey}", "s");` : ''}${returnType === 'json' ? `const value = fp.jsonValue("${toggleKey}", {});` : ''}`
  }
})
`
    }
  ];

  if (eventName && !isTrackEvent) {
    result.splice(4, 1);
  }

  return result;
};

export const getMiniProgramCode = (options: IOption, eventName?: string, isTrackValue?: boolean) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;
  const result = [
    {
      title: intl.formatMessage({id: 'getstarted.miniprogram.first.step.title'}),
      code: 'npm install featureprobe-client-sdk-miniprogram --save'
    },
    {
      title: intl.formatMessage({id: 'getstarted.miniprogram.second.step.title'}),
      code:
`import { initialize, FPUser } from "featureprobe-client-sdk-miniprogram";

const user = new FPUser();
${userWithCode}
const featureProbeClient = initialize({
    remoteUrl: "${remoteUrl}",
    clientSdkKey: "${clientSdkKey}",
    user,
});

featureProbeClient.start();
`
    },
    {
      title: eventName ? intl.formatMessage({id: 'getstarted.common.third.step.track'}) : intl.formatMessage({id: 'getstarted.miniprogram.third.step.title'}),
      name: eventName? '' : intl.formatMessage({id: 'getstarted.miniprogram.third.step.name.one'}),
      code:
`${eventName 
  ? `${isTrackValue ? `featureProbeClient.on("ready", function() {
  featureProbeClient.track("${eventName}", /* value */);` : `featureProbeClient.track("${eventName}")`}
});`
  : `const app = getApp();
const value = app.globalData.toggles[${toggleKey}].value;`
}
`
    },
    {
      name: intl.formatMessage({id: 'getstarted.miniprogram.third.step.name.second'}),
      code:
`featureProbeClient.on("ready", function() {
  ${returnType === 'boolean' ? `const value = fp.boolValue("${toggleKey}", false);` : ''}${returnType === 'number' ? `const value = fp.numberValue("${toggleKey}", 1.0);` : ''}${returnType === 'string' ? `const value = fp.stringValue("${toggleKey}", "s");` : ''}${returnType === 'json' ? `const value = fp.jsonValue("${toggleKey}", {});` : ''}
});
`
    }
  ];

  if (eventName) {
    result.splice(3, 1);
  }
  return result;
};

export const getReactCode = (options: IOption, eventName?: string, isTrackValue?: boolean, isTrackEvent?: boolean) => {
  const { intl, clientSdkKey, userWithCode, returnType, toggleKey, remoteUrl } = options;
  const result = [
    {
      title: intl.formatMessage({id: 'getstarted.react.first.step.title'}),
      code: 'npx create-react-app react-demo && cd react-demo'
    },
    {
      title: intl.formatMessage({id: 'getstarted.react.second.step.title'}),
      code: 'npm install featureprobe-client-sdk-react --save'
    },
    {
      title: intl.formatMessage({id: 'getstarted.react.third.step.title'}),
      code:
`import { FPProvider } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  ${userWithCode}
  return (
    <FPProvider 
      config={{
        remoteUrl: "${remoteUrl}",
        clientSdkKey: "${clientSdkKey}",
        user,
      }}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
`
    },
    {
      title: intl.formatMessage({id: 'getstarted.react.fourth.step.title'}),
      code:
`import { withFPConsumer } from 'featureprobe-client-sdk-client';

const Home = ({ toggles, client }) => {
  ${returnType === 'boolean' ? `const value = client?.boolValue("${toggleKey}", false);` : ''}${returnType === 'number' ? `const value = client?.numberValue("${toggleKey}", 1.0);` : ''}${returnType === 'string' ? `const value = client?.stringValue("${toggleKey}", "s");` : ''}${returnType === 'json' ? `const value = client.jsonValue("${toggleKey}", {});` : ''}
  return (
    <div>
      <div>You can use toggle value like this: \${value}</div>
      <div>You can also get toggle detail from toggles object like this: \${toggles?.["${toggleKey}"]}</div>
    </div>
  )
};

export default withFPConsumer(Home);
`
    },
  ];

  if (eventName) {
    if (isTrackEvent) {
      result.splice(3, 1, {
        title: intl.formatMessage({id: intl.formatMessage({id: 'getstarted.react.track.event.title'})}),
        code:
  `import { useFPClient } from 'featureprobe-client-sdk-client';
  
  const Home = ({ toggles, client }) => {
    const fp = useFPClient();
    ${isTrackValue ? `fp.track("${eventName}", /* value */);` : `fp.track("${eventName}");`}
  
    return (
      <>
        You can use track custom event in this page
      </div>
    )
  };
  
  export default withFPConsumer(Home);
  `
      });
    } else {
      result.splice(3, 1);
    }
  }

  return result;

};
