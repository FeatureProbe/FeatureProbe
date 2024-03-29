"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[5822],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var p=a.createContext({}),s=function(e){var t=a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=s(r),m=n,b=c["".concat(p,".").concat(m)]||c[m]||d[m]||o;return r?a.createElement(b,l(l({ref:t},u),{},{components:r})):a.createElement(b,l({ref:t},u))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=c;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:n,l[1]=i;for(var s=2;s<o;s++)l[s]=r[s];return a.createElement.apply(null,l)}return a.createElement.apply(null,r)}c.displayName="MDXCreateElement"},8988:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var a=r(7462),n=(r(7294),r(3905));const o={sidebar_position:2},l="Spring Boot Starter",i={unversionedId:"how-to/Server-Side SDKs/spring-boot-starter",id:"how-to/Server-Side SDKs/spring-boot-starter",title:"Spring Boot Starter",description:"\u672c\u6587\u4ecb\u7ecd\u5982\u4f55\u5728\u4e00\u4e2a Spring Boot \u9879\u76ee\u4e2d\u4f7f\u7528FeatureProbe SDK\u3002",source:"@site/i18n/zh-CN/docusaurus-plugin-content-docs/current/how-to/Server-Side SDKs/spring-boot-starter.md",sourceDirName:"how-to/Server-Side SDKs",slug:"/how-to/Server-Side SDKs/spring-boot-starter",permalink:"/FeatureProbe/zh-CN/how-to/Server-Side SDKs/spring-boot-starter",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/i18n/zh-CN/docusaurus-plugin-content-docs/current/how-to/Server-Side SDKs/spring-boot-starter.md",tags:[],version:"current",lastUpdatedAt:1672223764,formattedLastUpdatedAt:"2022\u5e7412\u670828\u65e5",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"defaultSidebar",previous:{title:"Java SDK",permalink:"/FeatureProbe/zh-CN/how-to/Server-Side SDKs/java-sdk"},next:{title:"Golang SDK",permalink:"/FeatureProbe/zh-CN/how-to/Server-Side SDKs/golang-sdk"}},p={},s=[{value:"\u63a5\u5165\u4e1a\u52a1\u4ee3\u7801",id:"\u63a5\u5165\u4e1a\u52a1\u4ee3\u7801",level:2},{value:"\u6b65\u9aa4 1. \u5b89\u88c5 FeatureProbe Starter",id:"\u6b65\u9aa4-1-\u5b89\u88c5-featureprobe-starter",level:3},{value:"Apache Maven",id:"apache-maven",level:4},{value:"Gradle Groovy DSL",id:"gradle-groovy-dsl",level:4},{value:"\u6b65\u9aa4 2. \u914d\u7f6e FeatureProbe instance",id:"\u6b65\u9aa4-2-\u914d\u7f6e-featureprobe-instance",level:3},{value:"\u6b65\u9aa4 3. \u4f7f\u7528 FeatureProbe \u5f00\u5173\u83b7\u53d6\u8bbe\u7f6e\u7684\u503c",id:"\u6b65\u9aa4-3-\u4f7f\u7528-featureprobe-\u5f00\u5173\u83b7\u53d6\u8bbe\u7f6e\u7684\u503c",level:3},{value:"\u6b65\u9aa4 4. \u7a0b\u5e8f\u9000\u51fa\u524d\u5173\u95ed FeatureProbe Client",id:"\u6b65\u9aa4-4-\u7a0b\u5e8f\u9000\u51fa\u524d\u5173\u95ed-featureprobe-client",level:3},{value:"\u63a5\u5165\u4e1a\u52a1\u5355\u5143\u6d4b\u8bd5",id:"\u63a5\u5165\u4e1a\u52a1\u5355\u5143\u6d4b\u8bd5",level:2},{value:"1. \u9879\u76ee\u4e2d\u6dfb\u52a0 powermock SDK:",id:"1-\u9879\u76ee\u4e2d\u6dfb\u52a0-powermock-sdk",level:3},{value:"2. Mock FeatureProbe\u5f00\u5173",id:"2-mock-featureprobe\u5f00\u5173",level:3},{value:"\u88ab\u6d4b\u51fd\u6570",id:"\u88ab\u6d4b\u51fd\u6570",level:4},{value:"\u5355\u6d4bCode",id:"\u5355\u6d4bcode",level:4},{value:"\u5b9a\u5236\u5316\u5f00\u53d1\u672cSDK",id:"\u5b9a\u5236\u5316\u5f00\u53d1\u672csdk",level:2}],u={toc:s};function d(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"spring-boot-starter"},"Spring Boot Starter"),(0,n.kt)("p",null,"\u672c\u6587\u4ecb\u7ecd\u5982\u4f55\u5728\u4e00\u4e2a Spring Boot \u9879\u76ee\u4e2d\u4f7f\u7528FeatureProbe SDK\u3002"),(0,n.kt)("admonition",{title:"SDK quick links",type:"note"},(0,n.kt)("p",{parentName:"admonition"},"\u9664\u4e86\u672c\u53c2\u8003\u6307\u5357\u5916\uff0c\u6211\u4eec\u8fd8\u63d0\u4f9b\u6e90\u4ee3\u7801\u3001\u793a\u4f8b\u5e94\u7528\u7a0b\u5e8f\uff0c\u76f8\u5173\u94fe\u63a5\u5982\u4e0b\u6240\u793a\uff1a"),(0,n.kt)("table",{parentName:"admonition"},(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:null},(0,n.kt)("strong",{parentName:"th"},"Resource")),(0,n.kt)("th",{parentName:"tr",align:null},(0,n.kt)("strong",{parentName:"th"},"Location")))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},"GitHub \u4ee3\u7801\u5e93"),(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("a",{parentName:"td",href:"https://github.com/FeatureProbe/featureprobe-spring-boot-starter"},"featureprobe-spring-boot-starter"))),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},"\u63a5\u5165\u793a\u4f8b"),(0,n.kt)("td",{parentName:"tr",align:null},"-")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},"\u5df2\u53d1\u5e03\u6a21\u5757"),(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("a",{parentName:"td",href:"https://mvnrepository.com/artifact/com.featureprobe/featureprobe-spring-boot-starter"},"Maven")))))),(0,n.kt)("admonition",{type:"tip"},(0,n.kt)("p",{parentName:"admonition"},"\u5bf9\u4e8e\u9996\u6b21\u4f7f\u7528FeatureProbe\u7684\u7528\u6237\uff0c\u6211\u4eec\u5f3a\u70c8\u5efa\u8bae\u4f60\u5728\u9605\u8bfb\u8fc7",(0,n.kt)("a",{parentName:"p",href:"../../tutorials/rollout_tutorial/"},"\u7070\u5ea6\u653e\u91cf\u6559\u7a0b"),"\u4e4b\u540e\uff0c\u518d\u56de\u5230\u8fd9\u7bc7\u6587\u7ae0\u7ee7\u7eed\u9605\u8bfb\u3002")),(0,n.kt)("h2",{id:"\u63a5\u5165\u4e1a\u52a1\u4ee3\u7801"},"\u63a5\u5165\u4e1a\u52a1\u4ee3\u7801"),(0,n.kt)("p",null,"\u5bf9\u4e8eSpring Boot\u9879\u76ee\uff0cFeatureProbe\u63d0\u4f9b\u4e00\u4e2a\u5f00\u7bb1\u5373\u7528\u7684 Starter\uff0c\u65b9\u4fbf\u5728Spring boot\u4e2d\u5feb\u901f\u96c6\u6210FeatureProbe\u3002"),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"\u670d\u52a1\u7aefSDK\u91c7\u7528\u5f02\u6b65\u8fde\u63a5FeatureProbe\u670d\u52a1\u5668\u62c9\u53d6\u5224\u5b9a\u89c4\u5219\u7684\u65b9\u5f0f\uff0c\u5224\u5b9a\u89c4\u5219\u4f1a\u5728\u672c\u5730\u5b58\u7f13\u3002\u6240\u6709\u5bf9\u7528\u6237\u4ee3\u7801\u66b4\u9732\u7684\u63a5\u53e3\u90fd\u53ea\u6d89\u53ca\u5185\u5b58\u64cd\u4f5c\uff0c\u8c03\u7528\u65f6\u4e0d\u5fc5\u62c5\u5fc3\u6027\u80fd\u95ee\u9898\u3002")),(0,n.kt)("h3",{id:"\u6b65\u9aa4-1-\u5b89\u88c5-featureprobe-starter"},"\u6b65\u9aa4 1. \u5b89\u88c5 FeatureProbe Starter"),(0,n.kt)("p",null,"\u9996\u5148\uff0c\u5728\u60a8\u7684\u5e94\u7528\u7a0b\u5e8f\u4e2d\u5b89\u88c5 FeatureProbe Starter \u4f5c\u4e3a\u4f9d\u8d56\u9879\u3002"),(0,n.kt)("h4",{id:"apache-maven"},"Apache Maven"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n    <groupId>com.featureprobe</groupId>\n    <artifactId>featureprobe-spring-boot-starter</artifactId>\n    <version>1.4.0</version>\n</dependency>\n")),(0,n.kt)("h4",{id:"gradle-groovy-dsl"},"Gradle Groovy DSL"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-text"},"implementation 'com.featureprobe:featureprobe-spring-boot-starter:1.4.0'\n")),(0,n.kt)("h3",{id:"\u6b65\u9aa4-2-\u914d\u7f6e-featureprobe-instance"},"\u6b65\u9aa4 2. \u914d\u7f6e FeatureProbe instance"),(0,n.kt)("p",null,"\u5b89\u88c5\u5e76\u5bfc\u5165 Starter \u540e\uff0c\u6839\u636e\u5f53\u524d\u73af\u5883\u914d\u7f6e\u9700\u8981\u7684 FeatureProbe instance\u3002"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-yaml"},"spring:\n  featureprobe:\n    event-url: https://featureprobe.io/server/api/events\n    synchronizer-url: https://featureprobe.io/server/api/server-sdk/toggles\n    sdk-key: server-9e53c5db4fd75049a69df8881f3bc90edd58fb06\n    refresh-interval: 5\n")),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"\u914d\u7f6e\u9879"),(0,n.kt)("th",{parentName:"tr",align:"left"},"\u63cf\u8ff0"),(0,n.kt)("th",{parentName:"tr",align:"right"},"\u662f\u5426\u5fc5\u987b"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"spring.featureprobe.event-url"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u4e8b\u4ef6\u4e0a\u4f20Url"),(0,n.kt)("td",{parentName:"tr",align:"right"},"Y")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"spring.featureprobe.synchronizer-url"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u5f00\u5173\u6570\u636e\u540c\u6b65Url"),(0,n.kt)("td",{parentName:"tr",align:"right"},"Y")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"spring.featureprobe.sdk-key"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u5f53\u524d\u73af\u5883SDK KEY"),(0,n.kt)("td",{parentName:"tr",align:"right"},"Y")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"spring.featureprobe.refresh-interval"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u5f00\u5173\u6570\u636e\u540c\u6b65\u9891\u7387\uff08s\uff09\u9ed8\u8ba45s"),(0,n.kt)("td",{parentName:"tr",align:"right"},"N")))),(0,n.kt)("h3",{id:"\u6b65\u9aa4-3-\u4f7f\u7528-featureprobe-\u5f00\u5173\u83b7\u53d6\u8bbe\u7f6e\u7684\u503c"},"\u6b65\u9aa4 3. \u4f7f\u7528 FeatureProbe \u5f00\u5173\u83b7\u53d6\u8bbe\u7f6e\u7684\u503c"),(0,n.kt)("p",null,"\u60a8\u53ef\u4ee5\u4f7f\u7528 sdk \u62ff\u5230\u5bf9\u5e94\u5f00\u5173\u540d\u8bbe\u7f6e\u7684\u503c\u3002"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-java"},"@Resource\nFeatureProbe fpClient;\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-java"},'FPUser user=new FPUser();\nuser.with("ATTRIBUTE_NAME_IN_RULE",VALUE_OF_ATTRIBUTE);    // Call with() for each attribute used in Rule.\nboolean boolValue=fpClient.boolValue("YOUR_TOGGLE_KEY",user,false);\nif(boolValue){\n// the code to run if the toggle is on\n}else{\n// the code to run if the toggle is off\n}\n')),(0,n.kt)("h3",{id:"\u6b65\u9aa4-4-\u7a0b\u5e8f\u9000\u51fa\u524d\u5173\u95ed-featureprobe-client"},"\u6b65\u9aa4 4. \u7a0b\u5e8f\u9000\u51fa\u524d\u5173\u95ed FeatureProbe Client"),(0,n.kt)("p",null,"\u9000\u51fa\u524d\u5173\u95edclient\uff0c\u4fdd\u8bc1\u6570\u636e\u4e0a\u62a5\u51c6\u786e\u3002"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-java"},"fpClient.close();\n")),(0,n.kt)("h2",{id:"\u63a5\u5165\u4e1a\u52a1\u5355\u5143\u6d4b\u8bd5"},"\u63a5\u5165\u4e1a\u52a1\u5355\u5143\u6d4b\u8bd5"),(0,n.kt)("p",null,"FeatureProbe SDK \u63d0\u4f9b\u4e86\u4e00\u5957mock\u673a\u5236\uff0c\u53ef\u4ee5\u5728\u5355\u5143\u6d4b\u8bd5\u4e2d\u6307\u5b9aFeatureProbe SDK\u7684\u8fd4\u56de\u503c\u3002"),(0,n.kt)("h3",{id:"1-\u9879\u76ee\u4e2d\u6dfb\u52a0-powermock-sdk"},"1. \u9879\u76ee\u4e2d\u6dfb\u52a0 powermock SDK:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n    <groupId>org.powermock</groupId>\n    <artifactId>powermock-api-mockito2</artifactId>\n    <version>2.0.9</version>\n    <scope>test</scope>\n</dependency>\n<dependency>\n    <groupId>org.powermock</groupId>\n    <artifactId>powermock-module-junit4</artifactId>\n    <version>2.0.9</version>\n    <scope>test</scope>\n</dependency>\n")),(0,n.kt)("h3",{id:"2-mock-featureprobe\u5f00\u5173"},"2. Mock FeatureProbe\u5f00\u5173"),(0,n.kt)("h4",{id:"\u88ab\u6d4b\u51fd\u6570"},"\u88ab\u6d4b\u51fd\u6570"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-java"},'@AllArgsConstructor\n@Service\npublic class DemoService {\n\n    FeatureProbe fp;\n\n    public boolean businessFunction(String userId, String tel) {\n        FPUser fpUser = new FPUser(userId);\n        fpUser.with("tel", tel);\n        return fp.boolValue("is_tester", fpUser, false);\n    }\n}\n')),(0,n.kt)("h4",{id:"\u5355\u6d4bcode"},"\u5355\u6d4bCode"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-java"},'@RunWith(PowerMockRunner.class)\n@PrepareForTest({FeatureProbe.class})\npublic class FeatureProbeTest {\n\n    @Test\n    public void test() {\n        FeatureProbe fp = PowerMockito.mock(FeatureProbe.class);\n        DemoService demoService = new DemoService(fp);\n        Mockito.when(fp.boolValue(anyString(), any(FPUser.class), anyBoolean())).thenReturn(true);\n        boolean tester = demoService.businessFunction("user123", "12397347232");\n        assert tester;\n    }\n\n}\n')),(0,n.kt)("h2",{id:"\u5b9a\u5236\u5316\u5f00\u53d1\u672csdk"},"\u5b9a\u5236\u5316\u5f00\u53d1\u672cSDK"),(0,n.kt)("admonition",{type:"tip"},(0,n.kt)("p",{parentName:"admonition"},"\u672c\u6bb5\u843d\u9002\u7528\u4e8e\u60f3\u81ea\u5df1\u5b9a\u5236\u5316\u5f00\u53d1\u672cSDK\uff0c\u6216\u8005\u901a\u8fc7\u5f00\u6e90\u793e\u533a\u5bf9\u672cSDK\u8d21\u732e\u4ee3\u7801\u7684\u7528\u6237\u3002\u4e00\u822c\u7528\u6237\u53ef\u4ee5\u8df3\u8fc7\u6b64\u6bb5\u5185\u5bb9\u3002")),(0,n.kt)("p",null,"\u6211\u4eec\u63d0\u4f9b\u4e86\u4e00\u4e2a\u672cSDK\u7684\u9a8c\u6536\u6d4b\u8bd5\uff0c\u7528\u4e8e\u4fdd\u8bc1\u4fee\u6539\u540e\u7684SDK\u8ddfFeatureProbe\u7684\u539f\u751f\u89c4\u5219\u517c\u5bb9\u3002\n\u96c6\u6210\u6d4b\u8bd5\u7528\u4f8b\u4f5c\u4e3a\u6bcf\u4e2a SDK \u5b58\u50a8\u5e93\u7684\u5b50\u6a21\u5757\u6dfb\u52a0\u3002\u6240\u4ee5\u5728\u8fd0\u884c\u6d4b\u8bd5\u4e4b\u524d\uff0c\u8bf7\u52a1\u5fc5\u5148\u62c9\u53d6\u5b50\u6a21\u5757\u4ee5\u83b7\u53d6\u6700\u65b0\u7684\u96c6\u6210\u6d4b\u8bd5\u3002"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-shell"},"git submodule update --init --recursive\nmvn test\n")))}d.isMDXComponent=!0}}]);