"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[7927],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=u(n),d=r,g=m["".concat(s,".").concat(d)]||m[d]||c[d]||l;return n?a.createElement(g,o(o({ref:t},p),{},{components:n})):a.createElement(g,o({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var u=2;u<l;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),r=n(6010);const l="tabItem_Ymn6";function o(e){let{children:t,hidden:n,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,o),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>y});var a=n(7462),r=n(7294),l=n(6010),o=n(2466),i=n(6550),s=n(1980),u=n(7392),p=n(12);function c(e){return function(e){return r.Children.map(e,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function m(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??c(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function d(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function g(e){let{queryString:t=!1,groupId:n}=e;const a=(0,i.k6)(),l=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,s._X)(l),(0,r.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(a.location.search);t.set(l,e),a.replace({...a.location,search:t.toString()})}),[l,a])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,l=m(e),[o,i]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!d({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:l}))),[s,u]=g({queryString:n,groupId:a}),[c,f]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,l]=(0,p.Nk)(n);return[a,(0,r.useCallback)((e=>{n&&l.set(e)}),[n,l])]}({groupId:a}),h=(()=>{const e=s??c;return d({value:e,tabValues:l})?e:null})();(0,r.useLayoutEffect)((()=>{h&&i(h)}),[h]);return{selectedValue:o,selectValue:(0,r.useCallback)((e=>{if(!d({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),u(e),f(e)}),[u,f,l]),tabValues:l}}var h=n(2389);const k="tabList__CuJ",b="tabItem_LNqP";function _(e){let{className:t,block:n,selectedValue:i,selectValue:s,tabValues:u}=e;const p=[],{blockElementScrollPositionUntilNextRender:c}=(0,o.o5)(),m=e=>{const t=e.currentTarget,n=p.indexOf(t),a=u[n].value;a!==i&&(c(t),s(a))},d=e=>{let t=null;switch(e.key){case"Enter":m(e);break;case"ArrowRight":{const n=p.indexOf(e.currentTarget)+1;t=p[n]??p[0];break}case"ArrowLeft":{const n=p.indexOf(e.currentTarget)-1;t=p[n]??p[p.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:o}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:i===t?0:-1,"aria-selected":i===t,key:t,ref:e=>p.push(e),onKeyDown:d,onClick:m},o,{className:(0,l.Z)("tabs__item",b,o?.className,{"tabs__item--active":i===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:a}=e;if(n=Array.isArray(n)?n:[n],t){const e=n.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},n.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function E(e){const t=f(e);return r.createElement("div",{className:(0,l.Z)("tabs-container",k)},r.createElement(_,(0,a.Z)({},e,t)),r.createElement(v,(0,a.Z)({},e,t)))}function y(e){const t=(0,h.Z)();return r.createElement(E,(0,a.Z)({key:String(t)},e))}},4144:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>u,toc:()=>c});var a=n(7462),r=(n(7294),n(3905)),l=n(4866),o=n(5162);const i={sidebar_position:7},s="Use metric analysis",u={unversionedId:"tutorials/analysis",id:"tutorials/analysis",title:"Use metric analysis",description:"We will guide you to use the metric analysis function of the FeatureProbe platform. By writing back-end/front-end programs, use the SDK to realize the data reporting of custom events, and view the analysis results on the platform.",source:"@site/docs/tutorials/analysis.md",sourceDirName:"tutorials",slug:"/tutorials/analysis",permalink:"/FeatureProbe/tutorials/analysis",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/docs/tutorials/analysis.md",tags:[],version:"current",lastUpdatedAt:1706624576,formattedLastUpdatedAt:"Jan 30, 2024",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"defaultSidebar",previous:{title:"Publish toggle with REST API",permalink:"/FeatureProbe/tutorials/open_api"},next:{title:"How-to guides",permalink:"/FeatureProbe/category/how-to-guides"}},p={},c=[{value:"Create a toggle on the platform",id:"create-a-toggle-on-the-platform",level:2},{value:"Save metrics and start iteration",id:"save-metrics-and-start-iteration",level:2},{value:"Control the backend program",id:"control-the-backend-program",level:2},{value:"Write code",id:"backend-code",level:3},{value:"Control the front-end program",id:"control-the-front-end-program",level:2},{value:"Write code",id:"frontend-code",level:3},{value:"Validate results",id:"validate-results",level:2}],m={toc:c};function d(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,a.Z)({},m,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"use-metric-analysis"},"Use metric analysis"),(0,r.kt)("p",null,"We will guide you to use the metric analysis function of the FeatureProbe platform. By writing back-end/front-end programs, use the SDK to realize the data reporting of ",(0,r.kt)("inlineCode",{parentName:"p"},"custom events"),", and view the analysis results on the platform."),(0,r.kt)("h2",{id:"create-a-toggle-on-the-platform"},"Create a toggle on the platform"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Log in to the FeatureProbe ",(0,r.kt)("a",{parentName:"li",href:"https://featureprobe.io"},"demo platform"),". If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future."),(0,r.kt)("li",{parentName:"ol"},"Click ",(0,r.kt)("inlineCode",{parentName:"li"},"+Toggle")," to create a new toggle.\n",(0,r.kt)("img",{alt:"add",src:n(9381).Z,width:"3004",height:"706"})),(0,r.kt)("li",{parentName:"ol"},"Set the name and key to ",(0,r.kt)("inlineCode",{parentName:"li"},"custom_event"),", click ",(0,r.kt)("inlineCode",{parentName:"li"},"Create and publish"),".\n",(0,r.kt)("img",{alt:"create",src:n(4388).Z,width:"1666",height:"1734"})),(0,r.kt)("li",{parentName:"ol"},"Click ",(0,r.kt)("inlineCode",{parentName:"li"},"custom_event")," from the toggle list to open the targeting details page.\n",(0,r.kt)("img",{alt:"list",src:n(4126).Z,width:"2996",height:"860"})),(0,r.kt)("li",{parentName:"ol"},"Set the status to ",(0,r.kt)("inlineCode",{parentName:"li"},"enabled"),".\nChange the return variation of the default rule to ",(0,r.kt)("inlineCode",{parentName:"li"},"a percentage rollout"),". Set 50% to variation1, 50% to variation2.\n",(0,r.kt)("img",{alt:"list",src:n(2758).Z,width:"1876",height:"1858"})),(0,r.kt)("li",{parentName:"ol"},"Click the ",(0,r.kt)("inlineCode",{parentName:"li"},"Publish")," button below and ",(0,r.kt)("inlineCode",{parentName:"li"},"Confirm")," the changes.\n",(0,r.kt)("img",{alt:"list",src:n(5724).Z,width:"1600",height:"946"}))),(0,r.kt)("h2",{id:"save-metrics-and-start-iteration"},"Save metrics and start iteration"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"Analysis")," Tab, Add a metric named ",(0,r.kt)("inlineCode",{parentName:"p"},"Button Click Conversion"),", select the metric type as ",(0,r.kt)("inlineCode",{parentName:"p"},"Conversion")," then select ",(0,r.kt)("inlineCode",{parentName:"p"},"Custom")," event type, configure the event name as ",(0,r.kt)("inlineCode",{parentName:"p"},"test_event"),", and click ",(0,r.kt)("inlineCode",{parentName:"p"},"Save"),".\n",(0,r.kt)("img",{alt:"list",src:n(4600).Z,width:"3142",height:"1488"}))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"After the metric is saved successfully, click the ",(0,r.kt)("inlineCode",{parentName:"p"},"Start iteration")," button to start collecting data.\n",(0,r.kt)("img",{alt:"list",src:n(2456).Z,width:"3120",height:"1468"})))),(0,r.kt)("h2",{id:"control-the-backend-program"},"Control the backend program"),(0,r.kt)("p",null,"We provide a backend code example, from which you can start to experience how the backend code report custom event."),(0,r.kt)("h3",{id:"backend-code"},"Write code"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"According to the language you are familiar with, download and open the corresponding back-end sample code.")),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-java.git\ncd server-sdk-java\n")),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java")," file with an editor.")),(0,r.kt)(o.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-go.git\ncd server-sdk-go\n")),(0,r.kt)("p",null,"Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"example/main.go")," file with an editor.")),(0,r.kt)(o.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-rust.git\ncd server-sdk-rust\n")),(0,r.kt)("p",null,"Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"examples/demo.rs")," file with an editor.")),(0,r.kt)(o.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-python.git\ncd server-sdk-python\n")),(0,r.kt)("p",null,"Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"demo.py")," file with an editor.")),(0,r.kt)(o.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-node.git\ncd server-sdk-node\n")),(0,r.kt)("p",null,"Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"examples/demo.js")," file with an editor."))),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Open the FeatureProbe platform ",(0,r.kt)("a",{parentName:"p",href:"https://featureprobe.io/projects"},"project list page"),", you can click ",(0,r.kt)("inlineCode",{parentName:"p"},"Projects")," on the toggle details page to open:\n",(0,r.kt)("img",{alt:"project",src:n(77).Z,width:"3008",height:"974"}))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Copy ",(0,r.kt)("inlineCode",{parentName:"p"},"Server SDK Key"),".\n",(0,r.kt)("img",{alt:"sdk key",src:n(5775).Z,width:"2114",height:"1268"}))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Fill in ",(0,r.kt)("inlineCode",{parentName:"p"},"Server SDK Key")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"FeatureProbe remote URL"),' ("',(0,r.kt)("a",{parentName:"p",href:"https://featureprobe.io/server%22"},'https://featureprobe.io/server"'),") into the corresponding variables of the backend code."))),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"',title:'"src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"'},'    private static final String FEATURE_PROBE_SERVER_URL = "https://featureprobe.io/server";\n    private static final String FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key\n'))),(0,r.kt)(o.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go",metastring:'title="example/main.go"',title:'"example/main.go"'},'config := featureprobe.FPConfig{\n    // highlight-start\n  RemoteUrl: "https://featureprobe.io/server",\n  ServerSdkKey:    // Fill in the server SDK key\n  // highlight-end\n  RefreshInterval: 5000, // ms\n  WaitFirstResp:   true,\n}\n'))),(0,r.kt)(o.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust",metastring:'title="examples/demo.rs"',title:'"examples/demo.rs"'},'let remote_url = "https://featureprobe.io/server";\nlet server_sdk_key = // Fill in the server SDK key\n'))),(0,r.kt)(o.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python",metastring:'title="demo.py"',title:'"demo.py"'},"FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'\nFEATURE_PROBE_SERVER_SDK_KEY = # Fill in the server SDK key\n"))),(0,r.kt)(o.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="demo.js"',title:'"demo.js"'},"const FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server';\nconst FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key\n")))),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Add the following code. Simulate 1000 users accessing the toggle. Among the users whose toggle return value is ",(0,r.kt)("inlineCode",{parentName:"li"},"true"),", 55% of them report custom events, and among users whose toggle return value is ",(0,r.kt)("inlineCode",{parentName:"li"},"false"),", 45% of them report custom events.")),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"',title:'"src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"'},'    public static void main(String[] args) throws IOException, InterruptedException {\n\n        Logger root = (Logger)LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);\n        root.setLevel(Level.WARN);\n\n        final FPConfig config = FPConfig.builder()\n          .remoteUri(FEATURE_PROBE_SERVER_URL)\n          .build();\n\n        // Init FeatureProbe, share this FeatureProbe instance in your project.\n        final FeatureProbe fpClient = new FeatureProbe(FEATURE_PROBE_SERVER_SDK_KEY, config);\n\n        final String YOUR_TOGGLE_KEY = "custom_event";\n        final String YOUR_EVENT_NAME = "test_event";\n\n        // highlight-start\n        for (int i = 0; i < 1000; i++) {\n            FPUser user = new FPUser().stableRollout(String.valueOf(System.nanoTime()));\n            boolean newFeature = fpClient.boolValue(YOUR_TOGGLE_KEY, user, false);\n            Random random = new Random();\n            int randomRang = random.nextInt(100);\n            if (newFeature) {\n                if (randomRang <= 55) {\n                    fpClient.track(YOUR_EVENT_NAME, user);\n                }\n            } else {\n                if (randomRang > 55) {\n                    fpClient.track(YOUR_EVENT_NAME, user);\n                }\n            }\n            Thread.sleep(300);\n        }\n        // highlight-end\n\n        fpClient.close();\n    }\n'))),(0,r.kt)(o.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go",metastring:'title="example/main.go"',title:'"example/main.go"'},'package main\n\nimport (\n    "fmt"\n    featureprobe "github.com/featureprobe/server-sdk-go/v2"\n    "math/rand"\n    "time"\n)\n\nfunc main() {\n\n    config := featureprobe.FPConfig{\n        RemoteUrl: FEATURE_PROBE_SERVER_URL,\n        ServerSdkKey:    FEATURE_PROBE_SERVER_SDK_KEY,\n        RefreshInterval: 2 * time.Second,\n        StartWait:       5 * time.Second,\n    }\n    fp := featureprobe.NewFeatureProbe(config)\n    if !fp.Initialized() {\n        fmt.Println("SDK failed to initialize!")\n    }\n\n\n  // highlight-start\n    for i := 1; i <= 1000; i++ {\n        user := featureprobe.NewUser().StableRollout(fmt.Sprintf("%d", time.Now().UnixNano()/1000000))\n        newFeature := fp.BoolValue(YOUR_TOGGLE_KEY, user, false)\n        rand.Seed(time.Now().UnixNano())\n        randomNum := rand.Intn(101)\n        if newFeature {\n            if randomNum <= 55 {\n                fp.Track(YOUR_EVENT_NAME, user, nil)\n            }\n        } else {\n            if randomNum > 55 {\n                fp.Track(YOUR_EVENT_NAME, user, nil)\n            }\n        }\n    }\n  // highlight-end\n\n    fp.Close()\n}\n'))),(0,r.kt)(o.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust",metastring:'title="examples/demo.rs"',title:'"examples/demo.rs"'},'#[tokio::main]\nasync fn main() {\n    let remote_url = FEATURE_PROBE_SERVER_URL;\n    let server_sdk_key = FEATURE_PROBE_SERVER_SDK_KEY;\n    let config = FPConfig {\n        remote_url: remote_url.to_owned(),\n        server_sdk_key: server_sdk_key.to_owned(),\n        refresh_interval: Duration::from_millis(2000),\n        ..Default::default()\n    };\n\n    let fp = match FeatureProbe::new(config) {\n        Ok(fp) => fp,\n        Err(e) => {\n            tracing::error!("{:?}", e);\n            return;\n        }\n    };\n\n    // highlight-start\n    for i in 0..1000 {\n        let mut rng = rand::thread_rng();\n        let random_number = rng.gen_range(0..=100);\n        let mut user = FPUser::new().stable_rollout(Utc::now().timestamp_millis().to_string());\n        let new_feature = fp.bool_value(YOUR_TOGGLE_KEY, &user, false);\n        if new_feature {\n            if random_number <= 55 {\n                fp.track(YOUR_EVENT_NAME, &user, None);\n            }\n        } else {\n            if random_number > 55 {\n                fp.track(YOUR_EVENT_NAME, &user, None);\n            }\n        }\n    }\n    // highlight-end\n\n    fp.close();\n}\n'))),(0,r.kt)(o.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python",metastring:'title="demo.py"',title:'"demo.py"'},"logging.basicConfig(level=logging.WARNING)\n\nif __name__ == '__main__':\n    FEATURE_PROBE_SERVER_URL = FEATURE_PROBE_SERVER_URL\n    FEATURE_PROBE_SERVER_SDK_KEY = FEATURE_PROBE_SERVER_SDK_KEY # Fill in the server SDK key\n\n    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL\n                       sync_mode='polling',\n                       refresh_interval=3)\n\n    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:\n    \n    # highlight-start\n    for i in range(1000):\n      random_number = random.randint(0, 100)\n      user = fp.User().stable_rollout(str(time.time()))\n      new_feature = client.value(YOUR_TOGGLE_KEY, user, default=False)\n      if new_feature:\n        if random_number <= 55:\n          client.track(YOUR_EVENT_NAME, user, None)\n      else:\n        if random_number5> 55\n          client.track(YOUR_EVENT_NAME, user, None)\n    # highlight-end      \n    client.close()\n"))),(0,r.kt)(o.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="demo.js"',title:'"demo.js"'},'const fpClient = new featureProbe.FeatureProbe({\n  remoteUrl: FEATURE_PROBE_SERVER_URL,\n  serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,\n  refreshInterval: 5000,\n});\n\nconst YOUR_TOGGLE_KEY = "custom_event";\nconst YOUR_EVENT_NAME = "test_event";\n    \n// highlight-start\nfor(let i = 0; i < 1000; i++) {\n  const user = new featureProbe.FPUser(Date.now());\n  const boolValue = fpClient. boolValue(YOUR_TOGGLE_KEY, user, false);\n  const random = Math.floor(Math.random() * (100 - 1) + 1);\n\n  if (boolValue) {\n    if (random <= 55) {\n      fpClient.track(YOUR_EVENT_NAME, user);\n    }\n  } else {\n    if (random > 55) {\n      fpClient.track(YOUR_EVENT_NAME, user);\n    }\n  }\n}\n// highlight-end\n\nfpClient.close();\n')))),(0,r.kt)("ol",{start:6},(0,r.kt)("li",{parentName:"ol"},"Run the program.")),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(o.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"mvn package\njava -jar ./target/server-sdk-java-1.4.0.jar\n"))),(0,r.kt)(o.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"go run example/main.go\n"))),(0,r.kt)(o.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cargo run --example demo\n"))),(0,r.kt)(o.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pip3 install -r requirements.txt\npython3 demo.py\n"))),(0,r.kt)(o.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"node demo.js\n")))),(0,r.kt)("h2",{id:"control-the-front-end-program"},"Control the front-end program"),(0,r.kt)("p",null,"We provide a front-end js code example, and you can start to experience how the front-end code report custom event."),(0,r.kt)("h3",{id:"frontend-code"},"Write code"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Clone the code.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/client-sdk-js.git\ncd client-sdk-js\n")),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"Open ",(0,r.kt)("a",{parentName:"li",href:"https://featureprobe.io/projects"},"platform")," to get client sdk key.")),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},'Click the "Projects" tab to enter the "Projects" list, obtain various SDK keys, and modify service and environment information.')),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"client sdk key",src:n(9646).Z,width:"2144",height:"1266"})),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Open ",(0,r.kt)("inlineCode",{parentName:"li"},"example/index.html")," and fill in ",(0,r.kt)("inlineCode",{parentName:"li"},"Client SDK Key")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"FeatureProbe URL"),' ("',(0,r.kt)("a",{parentName:"li",href:"https://featureprobe.io/server%22"},'https://featureprobe.io/server"'),")")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="example/index.html"',title:'"example/index.html"'},'const fpClient = new featureProbe. FeatureProbe({\n  // highlight-start\n  remoteUrl: "https://featureprobe.io/server",\n  clientSdkKey: // Paste client sdk key here,\n  // highlight-end\n  user,\n  refreshInterval: 5000,\n});\n')),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Add the following code.\nSimulate a lot of users are accessing the toggle. Among the users whose toggle return value is ",(0,r.kt)("inlineCode",{parentName:"li"},"true"),", 55% of them report custom events, and among users whose toggle return value is ",(0,r.kt)("inlineCode",{parentName:"li"},"false"),", 45% of them report custom events.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="example/index.html"',title:'"example/index.html"'},'<script>\n  const user = new featureProbe.FPUser();\n\n  const fpClient = new featureProbe.FeatureProbe({\n    remoteUrl: "https://featureprobe.io/server",\n    clientSdkKey: // Paste client sdk key here,\n    user,\n    refreshInterval: 1000,\n  });\n\n  const YOUR_TOGGLE_KEY = "tutorial_rollout";\n  const YOUR_EVENT_NAME = \'test_event\';\n\n  fpClient.waitUntilReady().then(() => {\n    // highlight-start\n    const boolValue = fpClient. boolValue(YOUR_TOGGLE_KEY, false);\n    const random = Math.floor(Math.random() * (100 - 1) + 1);\n\n    if (boolValue) {\n      if (random <= 55) {\n        fpClient.track(YOUR_EVENT_NAME);\n      }\n    } else {\n      if (random > 55) {\n        fpClient.track(YOUR_EVENT_NAME);\n      }\n    }\n\n    // Reload page to simulate a new user visiting the page\n    setTimeout(() => {\n      location.reload();\n    }, 1100);\n    // highlight-end\n  })\n\n  fpClient.start();\n\n<\/script>\n')),(0,r.kt)("h2",{id:"validate-results"},"Validate results"),(0,r.kt)("p",null,"Open the ",(0,r.kt)("inlineCode",{parentName:"p"},"Analysis")," Tab on platform to view the result.\n",(0,r.kt)("img",{alt:"result",src:n(2290).Z,width:"3116",height:"1712"})))}d.isMDXComponent=!0},77:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_click_project_en-31e382beb680826367336c8abef12e8c.png"},9646:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_client_sdk_key_en-1d0063e09cdc2c33baa2049dc69c0124.png"},9381:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_create_toggle_button_en-c1be44036b363082cce70f9f216cbea5.png"},4388:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_create_en-631f61c8c5a30f47fbe79aa783ff7bff.png"},4126:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_list_click_en-75302432a9544adb1bcbc5aed6465c03.png"},2290:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_result_en-6072c052661171ac67e10ecdd3d021b7.png"},4600:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_save_en-463570e22740ddcaea7e03e1cefcdb81.png"},2456:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_start_en-6e65ab9040c0cadb2eab1ba5f17390f2.png"},5724:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_targeting_confirm_en-6278eebeb64760dcea202ac02e849245.png"},2758:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_metric_analysis_targeting_en-16f95899a2ffdf320f5d70591b5ea817.png"},5775:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_rollout_server_sdk_key_en-7101df1cd765f46fd60257d00552c4ad.png"}}]);