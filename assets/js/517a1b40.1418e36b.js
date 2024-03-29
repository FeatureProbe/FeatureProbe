"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[1937],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>g});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),u=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},m=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),c=u(n),g=r,d=c["".concat(i,".").concat(g)]||c[g]||p[g]||l;return n?a.createElement(d,s(s({ref:t},m),{},{components:n})):a.createElement(d,s({ref:t},m))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,s=new Array(l);s[0]=c;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,s[1]=o;for(var u=2;u<l;u++)s[u]=n[u];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},5162:(e,t,n)=>{n.d(t,{Z:()=>s});var a=n(7294),r=n(6010);const l="tabItem_Ymn6";function s(e){let{children:t,hidden:n,className:s}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(l,s),hidden:n},t)}},4866:(e,t,n)=>{n.d(t,{Z:()=>N});var a=n(7462),r=n(7294),l=n(6010),s=n(2466),o=n(6550),i=n(1980),u=n(7392),m=n(12);function p(e){return function(e){return r.Children.map(e,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))}(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}function c(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??p(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function g(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function d(e){let{queryString:t=!1,groupId:n}=e;const a=(0,o.k6)(),l=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,i._X)(l),(0,r.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(a.location.search);t.set(l,e),a.replace({...a.location,search:t.toString()})}),[l,a])]}function h(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,l=c(e),[s,o]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!g({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:l}))),[i,u]=d({queryString:n,groupId:a}),[p,h]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,l]=(0,m.Nk)(n);return[a,(0,r.useCallback)((e=>{n&&l.set(e)}),[n,l])]}({groupId:a}),f=(()=>{const e=i??p;return g({value:e,tabValues:l})?e:null})();(0,r.useLayoutEffect)((()=>{f&&o(f)}),[f]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!g({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),h(e)}),[u,h,l]),tabValues:l}}var f=n(2389);const b="tabList__CuJ",k="tabItem_LNqP";function _(e){let{className:t,block:n,selectedValue:o,selectValue:i,tabValues:u}=e;const m=[],{blockElementScrollPositionUntilNextRender:p}=(0,s.o5)(),c=e=>{const t=e.currentTarget,n=m.indexOf(t),a=u[n].value;a!==o&&(p(t),i(a))},g=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const n=m.indexOf(e.currentTarget)+1;t=m[n]??m[0];break}case"ArrowLeft":{const n=m.indexOf(e.currentTarget)-1;t=m[n]??m[m.length-1];break}}t?.focus()};return r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":n},t)},u.map((e=>{let{value:t,label:n,attributes:s}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:o===t?0:-1,"aria-selected":o===t,key:t,ref:e=>m.push(e),onKeyDown:g,onClick:c},s,{className:(0,l.Z)("tabs__item",k,s?.className,{"tabs__item--active":o===t})}),n??t)})))}function v(e){let{lazy:t,children:n,selectedValue:a}=e;if(n=Array.isArray(n)?n:[n],t){const e=n.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return r.createElement("div",{className:"margin-top--md"},n.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a}))))}function y(e){const t=h(e);return r.createElement("div",{className:(0,l.Z)("tabs-container",b)},r.createElement(_,(0,a.Z)({},e,t)),r.createElement(v,(0,a.Z)({},e,t)))}function N(e){const t=(0,f.Z)();return r.createElement(y,(0,a.Z)({key:String(t)},e))}},2424:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>i,default:()=>g,frontMatter:()=>o,metadata:()=>u,toc:()=>p});var a=n(7462),r=(n(7294),n(3905)),l=n(4866),s=n(5162);const o={sidebar_position:5},i="Use segment",u={unversionedId:"tutorials/user_segment_tutorial",id:"tutorials/user_segment_tutorial",title:"Use segment",description:"Commonly used target rules can be set up as segment, which can be shared between toggles.",source:"@site/docs/tutorials/user_segment_tutorial.md",sourceDirName:"tutorials",slug:"/tutorials/user_segment_tutorial",permalink:"/FeatureProbe/tutorials/user_segment_tutorial",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/docs/tutorials/user_segment_tutorial.md",tags:[],version:"current",lastUpdatedAt:1706624576,formattedLastUpdatedAt:"Jan 30, 2024",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"defaultSidebar",previous:{title:"Show different information to different users",permalink:"/FeatureProbe/tutorials/backend_custom_attribute"},next:{title:"Publish toggle with REST API",permalink:"/FeatureProbe/tutorials/open_api"}},m={},p=[{value:"Create a segment on the platform",id:"create-a-segment-on-the-platform",level:2},{value:"Use segment in toggle",id:"use-segment-in-toggle",level:2},{value:"Validate segment",id:"validate-segment",level:2},{value:"Backend code writing",id:"backend-code-writing",level:3},{value:"Run the code",id:"run-the-code",level:3},{value:"Update segment",id:"update-segment",level:2},{value:"Update segments on the page",id:"update-segments-on-the-page",level:3},{value:"Rerun the program to see the result",id:"rerun-the-program-to-see-the-result",level:3}],c={toc:p};function g(e){let{components:t,...o}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"use-segment"},"Use segment"),(0,r.kt)("p",null,"Commonly used target rules can be set up as segment, which can be shared between toggles."),(0,r.kt)("p",null,"We'll guide you to use FeatureProbe's platform to create a segment and then use the segment in two toggles. And through a back-end program, the modification of the segment will take effect in the two toggles at the same time."),(0,r.kt)("p",null,"Suppose we want to implement the following scenario:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"There is a whitelist of QAs emails that needs to be used in multiple toggles. so that QAs can test multiple toggles."),(0,r.kt)("li",{parentName:"ul"},"This whitelist of QAs needs to be modified uniformly, and the new QA added can take effect in multiple toggles.")),(0,r.kt)("h2",{id:"create-a-segment-on-the-platform"},"Create a segment on the platform"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Log in to the FeatureProbe ",(0,r.kt)("a",{parentName:"li",href:"https://featureprobe.io"},"demo platform"),". If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future."),(0,r.kt)("li",{parentName:"ol"},"Click ",(0,r.kt)("inlineCode",{parentName:"li"},"Segments/+Segment")," to create a new segment.")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"create segment",src:n(5918).Z,width:"3006",height:"850"})),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Fill in the name and key, click ",(0,r.kt)("inlineCode",{parentName:"li"},"Create and publish"),".")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"publish segment",src:n(426).Z,width:"964",height:"806"})),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Click the newly created segment from the list to enter editing.")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"segment_list_cn.png",src:n(4211).Z,width:"3000",height:"822"})),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Add a rule, select the type, enter the attribute ",(0,r.kt)("inlineCode",{parentName:"li"},"email"),",")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Select ",(0,r.kt)("inlineCode",{parentName:"li"},"string")," type"),(0,r.kt)("li",{parentName:"ul"},"Select ",(0,r.kt)("inlineCode",{parentName:"li"},"is one of")," operator"),(0,r.kt)("li",{parentName:"ul"},"Then enter the emails of the two QAs"),(0,r.kt)("li",{parentName:"ul"},"Click ",(0,r.kt)("inlineCode",{parentName:"li"},"Publish"))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"tutorial_segment_detail_en.png",src:n(6581).Z,width:"1900",height:"1688"})),(0,r.kt)("ol",{start:6},(0,r.kt)("li",{parentName:"ol"},'There is no toggle to use this "segment", click "next" and "confirm" to change.')),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"tutorial_segment_publish_next_step_en.png",src:n(5604).Z,width:"1622",height:"1122"})),(0,r.kt)("h2",{id:"use-segment-in-toggle"},"Use segment in toggle"),(0,r.kt)("p",null,"Next, we come to ",(0,r.kt)("inlineCode",{parentName:"p"},"Toggles")," list, create two toggles using the segment ",(0,r.kt)("inlineCode",{parentName:"p"},"qa_email")," created above."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a toggle ",(0,r.kt)("inlineCode",{parentName:"li"},"feature1")," with a return variation value of boolean type, use the default configuration, and then click ",(0,r.kt)("inlineCode",{parentName:"li"},"Create and publish"),".")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"tutorial_toggle_create_use_segment_en.png",src:n(163).Z,width:"1626",height:"1712"})),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"Enter the targeting page of the toggle ",(0,r.kt)("inlineCode",{parentName:"li"},"feature1"),", change the status to ",(0,r.kt)("inlineCode",{parentName:"li"},"enabled"),", click ",(0,r.kt)("inlineCode",{parentName:"li"},"+ Add Rule"),", and select the ",(0,r.kt)("inlineCode",{parentName:"li"},"segment")," type.")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"tutorial_toggle_use_segment_add_rule_en.png",src:n(2107).Z,width:"1798",height:"1772"})),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Edit rules")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Select ",(0,r.kt)("inlineCode",{parentName:"li"},"is in segments")),(0,r.kt)("li",{parentName:"ul"},"Select the ",(0,r.kt)("inlineCode",{parentName:"li"},"QA Email")," segment"),(0,r.kt)("li",{parentName:"ul"},"Set the return variation value ",(0,r.kt)("inlineCode",{parentName:"li"},"variation2")," for the segment"),(0,r.kt)("li",{parentName:"ul"},"Other return rules set the return variation value ",(0,r.kt)("inlineCode",{parentName:"li"},"variation1"))),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"tutorial_toggle_use_segment_rule_detail_en.png",src:n(5120).Z,width:"1974",height:"1686"})),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"Publish toggle ",(0,r.kt)("inlineCode",{parentName:"li"},"feature1"),"."),(0,r.kt)("li",{parentName:"ol"},"Repeat steps 1-4 above to create another toggle ",(0,r.kt)("inlineCode",{parentName:"li"},"feature2")," using the same segment.")),(0,r.kt)("h2",{id:"validate-segment"},"Validate segment"),(0,r.kt)("h3",{id:"backend-code-writing"},"Backend code writing"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"According to the language you are familiar with, download and open the corresponding back-end sample code.")),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-java.git\ncd server-sdk-java\n")),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java")," file with an editor.")),(0,r.kt)(s.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-go.git\ncd server-sdk-go\n")),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"example/main.go")," file with an editor.")),(0,r.kt)(s.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-rust.git\ncd server-sdk-rust\n")),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"examples/demo.rs")," file with an editor.")),(0,r.kt)(s.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-python.git\ncd server-sdk-python\n")),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"demo.py")," file with an editor.")),(0,r.kt)(s.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/FeatureProbe/server-sdk-node.git\ncd server-sdk-node\n")),(0,r.kt)("p",null,"Open ",(0,r.kt)("inlineCode",{parentName:"p"},"example/demo.js")," file with an editor."))),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"Open the FeatureProbe platform ",(0,r.kt)("a",{parentName:"li",href:"https://featureprobe.io/projects"},"project list page"),", you can click ",(0,r.kt)("inlineCode",{parentName:"li"},"Projects")," on the toggle details page to open\n",(0,r.kt)("img",{alt:"project",src:n(77).Z,width:"3008",height:"974"})),(0,r.kt)("li",{parentName:"ol"},"Copy ",(0,r.kt)("inlineCode",{parentName:"li"},"Server SDK Key"),(0,r.kt)("img",{alt:"sdk key",src:n(5775).Z,width:"2114",height:"1268"})),(0,r.kt)("li",{parentName:"ol"},"Fill in ",(0,r.kt)("inlineCode",{parentName:"li"},"Server SDK Key")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"FeatureProbe remote URL"),' ("',(0,r.kt)("a",{parentName:"li",href:"https://featureprobe.io/server%22"},'https://featureprobe.io/server"'),") into the corresponding variables of the backend code")),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"',title:'"src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"'},'private static final String FEATURE_PROBE_SERVER_URL = "https://featureprobe.io/server";\nprivate static final String FEATURE_PROBE_SERVER_SDK_KEY = // \u586b\u5165 \u670d\u52a1\u7aefSDK\u5bc6\u94a5 ;\n'))),(0,r.kt)(s.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go",metastring:'title="example/main.go"',title:'"example/main.go"'},'config := featureprobe.FPConfig{\n    // highlight-start\n    RemoteUrl: "https://featureprobe.io/server",\n    ServerSdkKey:    // \u586b\u5165 \u670d\u52a1\u7aefSDK\u5bc6\u94a5\n    // highlight-end\n    RefreshInterval: 5000, // ms\n    WaitFirstResp:   true,\n}\n'))),(0,r.kt)(s.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust",metastring:'title="examples/demo.rs"',title:'"examples/demo.rs"'},'let remote_url = "https://featureprobe.io/server";\nlet server_sdk_key = // \u586b\u5165 \u670d\u52a1\u7aefSDK\u5bc6\u94a5\n'))),(0,r.kt)(s.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python",metastring:'title="demo.py"',title:'"demo.py"'},"FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'\nFEATURE_PROBE_SERVER_SDK_KEY = # \u586b\u5165 \u670d\u52a1\u7aefSDK\u5bc6\u94a5\n"))),(0,r.kt)(s.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="demo.js"',title:'"demo.js"'},"const FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server';\nconst FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key\n")))),(0,r.kt)("ol",{start:5},(0,r.kt)("li",{parentName:"ol"},"Add the following code to simulate three users with email attributes accessing these 2 toggles.")),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"',title:'"src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"'},'\npublic static void main(String[] args) throws IOException {\n\n     Logger root = (Logger)LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);\n     root.setLevel(Level.WARN);\n\n     final FPConfig config = FPConfig.builder()\n     .remoteUri(FEATURE_PROBE_SERVER_URL)\n     .build();\n\n      // Init FeatureProbe, share this FeatureProbe instance in your project.\n      final FeatureProbe fpClient = new FeatureProbe(FEATURE_PROBE_SERVER_SDK_KEY, config);\n      \n      // highlight-start\n      FPUser[] users = {\n         new FPUser().with("email", "tester_a@company.com"),\n         new FPUser().with("email", "tester_b@company.com"),\n         new FPUser().with("email", "tester_c@company.com"),\n      };\n\n      for (FPUser user:users) {\n         if (fpClient.boolValue("feature1", user, false)) {\n            System.out.println(user.getAttr("email") + " see the new feature1");\n         } else {\n            System.out.println(user.getAttr("email") + " see nothing");\n         }\n      }\n\n      for (FPUser user:users) {\n         if (fpClient.boolValue("feature2", user, false)) {\n            System.out.println(user.getAttr("email") + " see the new feature2");\n         } else {\n            System.out.println(user.getAttr("email") + " see nothing");\n         }        \n      }\n      // highlight-end\n\n      fpClient.close();\n}\n\n'))),(0,r.kt)(s.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-go",metastring:'title="example/main.go"',title:'"example/main.go"'},'func main() {\n    config := featureprobe.FPConfig{\n        RemoteUrl: "https://featureprobe.io/server",\n        ServerSdkKey:    // Fill in the server SDK key,\n        RefreshInterval: 5000, // ms\n        WaitFirstResp:   true,\n    }\n    fp, err := featureprobe.NewFeatureProbe(config)\n    if err != nil {\n        fmt.Println(err)\n        return\n    }\n    // highlight-start\n    users := []featureprobe.FPUser{\n        featureprobe.NewUser().With("email", "tester_a@company.com"),\n        featureprobe.NewUser().With("email", "tester_b@company.com"),\n        featureprobe.NewUser().With("email", "tester_c@company.com"),\n    }\n\n    for _, user := range users {\n        if (fp.BoolValue("feature1", user, false)) {\n            fmt.Println(user.Get("email"), "see the new feature1")\n        } else {\n            fmt.Println(user.Get("email"), "see nothing")\n        }\n    }\n    \n    for _, user := range users {\n        if (fp.BoolValue("feature2", user, false)) {\n            fmt.Println(user.Get("email"), "see the new feature2")\n        } else {\n            fmt.Println(user.Get("email"), "see nothing")\n        }\n    }\n    // highlight-end\n    fp.Close()\n}\n'))),(0,r.kt)(s.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust",metastring:'title="examples/demo.rs"',title:'"examples/demo.rs"'},'#[tokio::main]\nasync fn main() {\n    let remote_url = "https://featureprobe.io/server";\n    let server_sdk_key = // Fill in the server SDK key\n    let config = FPConfig {\n        remote_url: remote_url.to_owned(),\n        server_sdk_key: server_sdk_key.to_owned(),\n        refresh_interval: Duration::from_millis(2000),\n        ..Default::default()\n    };\n\n    let fp = match FeatureProbe::new(config) {\n        Ok(fp) => fp,\n        Err(e) => {\n            tracing::error!("{:?}", e);\n            return;\n        }\n    };\n  // highlight-start\n    let users = [\n        FPUser::new().with("email", "tester_a@company.com"),\n        FPUser::new().with("email", "tester_b@company.com"),\n        FPUser::new().with("email", "tester_c@company.com")\n    ];\n    for user in users {\n        if fp.bool_value("feature1", &user, false) {\n           println!("{:?} see the new feature1", user.get("email"));\n        } else {\n           println!("{:?} see nothing", user.get("email"));\n        }\n    }\n    for user in users {\n        if fp.bool_value("feature2", &user, false) {\n            println!("{:?} see the new feature2", user.get("email"));\n        } else {\n            println!("{:?} see nothing", user.get("email"));\n        }\n    }\n    // highlight-end\n    fp.close();\n}\n'))),(0,r.kt)(s.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-python",metastring:'title="demo.py"',title:'"demo.py"'},"logging.basicConfig(level=logging.WARNING)\n\nif __name__ == '__main__':\n    FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'\n    FEATURE_PROBE_SERVER_SDK_KEY = # Fill in the server SDK key\n\n    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL\n                       sync_mode='polling',\n                       refresh_interval=3)\n\n    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:\n        # highlight-start\n        users = [\n            fp.User().with_attr(\"email\", \"tester_a@company.com\"),\n            fp.User().with_attr(\"email\", \"tester_b@company.com\"),\n            fp.User().with_attr(\"email\", \"tester_c@company.com\")\n        ]\n\n        for user in users:\n            if client.value('feature1', user, default=False):\n                print(user['email'] + 'see the new feature1')\n            else:\n                print(user['email'] + 'see nothing')\n\n        for user in users:\n            if client.value('feature2', user, default=False):\n                print(user['email'] + 'see the new feature2')\n            else:\n                print(user['email'] + 'see nothing')\n        # highlight-end\n\n"))),(0,r.kt)(s.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="demo.js"',title:'"demo.js"'},'const fpClient = new featureProbe.FeatureProbe({\n  remoteUrl: FEATURE_PROBE_SERVER_URL,\n  serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,\n  refreshInterval: 5000,\n});\n\n// highlight-start\nconst users = [\n    new featureProbe.FPUser().with("email", "tester_a@company.com"),\n    new featureProbe.FPUser().with("email", "tester_b@company.com"),\n    new featureProbe.FPUser().with("email", "tester_c@company.com"),\n];\n\nfor(let i = 0; i < users.length; i++) {\n  if (fpClient.booleanValue("feature1", users[i], false)) {\n    console.log(users[i].get("email") + \' see the new feature1\');\n  } else {\n    console.log(users[i].get("email") + \' see nothing\');\n  }\n}\n\nfor(let i = 0; i < users.length; i++) {\n  if (fpClient.booleanValue("feature2", users[i], false)) {\n    console.log(users[i].get("email") + \' see the new feature2\');\n  } else {\n    console.log(users[i].get("email") + \' see nothing\');\n  }\n}\n// highlight-end\n')))),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"In addition to the user attributes explicitly used in the rules of toggle, which need to be passed to the SDK through the with method, the user attributes (for example: email) that need to be used in the segment used in toggle also need to be passed to the FeatureProbe SDK through the with method.")),(0,r.kt)("h3",{id:"run-the-code"},"Run the code"),(0,r.kt)("p",null,"Run the program."),(0,r.kt)(l.Z,{groupId:"language",mdxType:"Tabs"},(0,r.kt)(s.Z,{value:"java",label:"Java",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"mvn package\njava -jar ./target/server-sdk-java-1.4.0.jar\n"))),(0,r.kt)(s.Z,{value:"golang",label:"Go",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"go run example/main.go\n"))),(0,r.kt)(s.Z,{value:"rust",label:"Rust",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"cargo run --example demo\n"))),(0,r.kt)(s.Z,{value:"python",label:"Python",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"pip3 install -r requirements.txt\npython3 demo.py\n"))),(0,r.kt)(s.Z,{value:"nodejs",label:"Node.js",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"node example/demo.js\n")))),(0,r.kt)("p",null,"Check the log verification results, you can see that the two test emails (tester_a and tester_b) in the segment can see the two new features, but the email (tester_c) not in the segment cannot see them."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"tester_a@company.com see the new feature1\ntester_b@company.com see the new feature1\ntester_c@company.com see nothing\ntester_a@company.com see the new feature2\ntester_b@company.com see the new feature2\ntester_c@company.com see nothing\n")),(0,r.kt)("h2",{id:"update-segment"},"Update segment"),(0,r.kt)("p",null,"Next, let's update the rules of the segment, and then verify that the updated results can take effect on the two toggles at the same time."),(0,r.kt)("h3",{id:"update-segments-on-the-page"},"Update segments on the page"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Enter the edit page of the segment ",(0,r.kt)("inlineCode",{parentName:"li"},"qa_email"),"."),(0,r.kt)("li",{parentName:"ol"},"Delete email account ",(0,r.kt)("inlineCode",{parentName:"li"},"test_b")," and add email account ",(0,r.kt)("inlineCode",{parentName:"li"},"test_c"),".")),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"tutorial_segment_after_update_en.png",src:n(3051).Z,width:"3110",height:"910"})),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"Publish segment.")),(0,r.kt)("h3",{id:"rerun-the-program-to-see-the-result"},"Rerun the program to see the result"),(0,r.kt)("p",null,"Run the program again according to the above ",(0,r.kt)("a",{parentName:"p",href:"##run-the-code"},"operation method")," to view the log"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"tester_a@company.com see the new feature1\ntester_b@company.com see nothing\ntester_c@company.com see the new feature1\ntester_a@company.com see the new feature2\ntester_b@company.com see nothing\ntester_c@company.com see the new feature2\n")),(0,r.kt)("p",null,"You can see that the modification has taken effect on both toggles."))}g.isMDXComponent=!0},77:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_click_project_en-31e382beb680826367336c8abef12e8c.png"},5918:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_create_segment_en-55fbb40bfba348e0f0db87fd0eb6f2f5.png"},426:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_publish_segment_en-279f60da8a3f75521a0abb26af26152c.png"},5775:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_rollout_server_sdk_key_en-7101df1cd765f46fd60257d00552c4ad.png"},3051:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_segment_after_update_en-3ec3b03f47d3002246a3c2cfd19a8fd8.png"},6581:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_segment_detail_en-62208a9727439b0203636b19230ae10a.png"},4211:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_segment_list_en-e2e0ab8c759df612549a455f3323b4b1.png"},5604:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_segment_publish_next_step_en-d9d34319b4f1c1ff3811d7eee20b05ea.png"},163:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_toggle_create_use_segment_en-66691e96d7e745bb2d55f2351babfc2b.png"},2107:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_toggle_use_segment_add_rule_en-3b5af3af38b00cb2d1459cd571dceb5d.png"},5120:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/tutorial_toggle_use_segment_rule_detail_en-57872cdc96828aa474a4f1d75af6ed8f.png"}}]);