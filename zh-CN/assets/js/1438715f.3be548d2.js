"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[3901],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>k});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),i=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},u=function(e){var t=i(e.components);return n.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),d=i(r),k=a,m=d["".concat(c,".").concat(k)]||d[k]||s[k]||o;return r?n.createElement(m,l(l({ref:t},u),{},{components:r})):n.createElement(m,l({ref:t},u))}));function k(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=d;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:a,l[1]=p;for(var i=2;i<o;i++)l[i]=r[i];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6212:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>p,toc:()=>i});var n=r(7462),a=(r(7294),r(3905));const o={slug:"FeatureProbe JS SDK",title:"\u5b9e\u8df5\u5206\u4eab\uff1a\u6253\u9020\u6781\u5177\u9ad8\u6269\u5c55\u6027\u7684JavaScript SDK"},l=void 0,p={permalink:"/FeatureProbe/zh-CN/blog/FeatureProbe JS SDK",editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/blog/2023-05-05-featureprobe.md",source:"@site/blog/2023-05-05-featureprobe.md",title:"\u5b9e\u8df5\u5206\u4eab\uff1a\u6253\u9020\u6781\u5177\u9ad8\u6269\u5c55\u6027\u7684JavaScript SDK",description:"SDK\uff08Software Developer Kit\uff09 \u662f\u4f7f\u7528 FeatureProbe \u670d\u52a1\u5fc5\u4e0d\u53ef\u5c11\u7684\u5de5\u5177\u4e4b\u4e00\u3002SDK\u80fd\u5c06\u7528\u6237\u7684\u5e94\u7528\u7a0b\u5e8f\u8fde\u63a5\u5230 FeatureProbe \u670d\u52a1\uff0c\u6839\u636e\u7528\u6237\u7684\u914d\u7f6e\u83b7\u53d6\u5f00\u5173\u7684\u7ed3\u679c\uff0c\u8fd8\u80fd\u5c06\u5f00\u5173\u7684\u8bbf\u95ee\u60c5\u51b5\u4e0a\u62a5\u7ed9 FeatureProbe\uff0c\u8fdb\u800c\u5b9e\u73b0 A/B \u5b9e\u9a8c\u7684\u80fd\u529b\u3002",date:"2023-05-05T00:00:00.000Z",formattedDate:"2023\u5e745\u67085\u65e5",tags:[],readingTime:7.765,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"FeatureProbe JS SDK",title:"\u5b9e\u8df5\u5206\u4eab\uff1a\u6253\u9020\u6781\u5177\u9ad8\u6269\u5c55\u6027\u7684JavaScript SDK"},nextItem:{title:"\u5982\u4f55\u6309\u767e\u5206\u6bd4\u5c06\u529f\u80fd\u7070\u5ea6\u653e\u91cf",permalink:"/FeatureProbe/zh-CN/blog/FeatureProbe rollout percentage"}},c={authorsImageUrls:[]},i=[{value:"\u5b9e\u73b0\u601d\u8def",id:"\u5b9e\u73b0\u601d\u8def",level:2},{value:"React SDK\u7684\u5b9e\u73b0",id:"react-sdk\u7684\u5b9e\u73b0",level:2},{value:"1\u3001\u5c06\xa0SDK\xa0\u521d\u59cb\u5316",id:"1\u5c06sdk\u521d\u59cb\u5316",level:3},{value:"2\u3001SDK \u7684\u4f7f\u7528",id:"2sdk-\u7684\u4f7f\u7528",level:3},{value:"\u5fae\u4fe1\u5c0f\u7a0b\u5e8f SDK\u7684\u5b9e\u73b0",id:"\u5fae\u4fe1\u5c0f\u7a0b\u5e8f-sdk\u7684\u5b9e\u73b0",level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],u=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,a.kt)("div",t)},s=u("App"),d=u("Home"),k={toc:i};function m(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},k,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"SDK\uff08Software Developer Kit\uff09 \u662f\u4f7f\u7528 FeatureProbe \u670d\u52a1\u5fc5\u4e0d\u53ef\u5c11\u7684\u5de5\u5177\u4e4b\u4e00\u3002SDK\u80fd\u5c06\u7528\u6237\u7684\u5e94\u7528\u7a0b\u5e8f\u8fde\u63a5\u5230 FeatureProbe \u670d\u52a1\uff0c\u6839\u636e\u7528\u6237\u7684\u914d\u7f6e\u83b7\u53d6\u5f00\u5173\u7684\u7ed3\u679c\uff0c\u8fd8\u80fd\u5c06\u5f00\u5173\u7684\u8bbf\u95ee\u60c5\u51b5\u4e0a\u62a5\u7ed9 FeatureProbe\uff0c\u8fdb\u800c\u5b9e\u73b0 A/B \u5b9e\u9a8c\u7684\u80fd\u529b\u3002"),(0,a.kt)("p",null,"FeatureProbe \u76ee\u524d\u5bf9\u5916\u63d0\u4f9b\u5341\u4f59\u79cd\u4e3b\u6d41\u5f00\u53d1\u8bed\u8a00\u7684 SDK\uff0c\u5305\u62ec\u7528\u4e8e\u670d\u52a1\u7aef\u5f00\u53d1\u7684 Java\u3001Golang\u3001Python\u3001Rust\u7b49\uff0c\u4ee5\u53ca\u7528\u4e8e\u5ba2\u6237\u7aef\u5f00\u53d1\u7684 JavaScript\u3001Android\u3001iOS\u7b49\u3002\u5728\u4e4b\u524d\u7684\u6587\u7ae0\u3010",(0,a.kt)("a",{parentName:"p",href:"http://mp.weixin.qq.com/s?__biz=MzAwNTM1MDU2OQ==&mid=2451827558&idx=1&sn=1ecadca93d1e9cde2271a87b4268ab71&chksm=8ccabea0bbbd37b6fefbf86360119c12db94bb78f305db2bb72127e297db577e1414a35425e9&scene=21#wechat_redirect"},"\u7528 Rust \u5f00\u53d1\u8de8\u5e73\u53f0 SDK \u63a2\u7d22\u548c\u5b9e\u8df5"),"\u3011\u4e2d\u6211\u4eec\u66fe\u4ecb\u7ecd\u8fc7\u6211\u4eec\u9009\u62e9\u4f7f\u7528Rust\u5f00\u53d1\u4e86\u8de8\u5e73\u53f0\u8bed\u8a00\u7684 Android SDK \u548c iOS SDK\uff0c\u8fd9\u6837\u505a\u7684\u4e3b\u8981\u539f\u56e0\u662f\uff1a"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\uff081\uff09\u80fd\u51cf\u5c11\u4eba\u529b\u6210\u672c\u548c\u5f00\u53d1\u65f6\u95f4\u3002")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\uff082\uff09\u5171\u4eab\u4e00\u5957\u4ee3\u7801\uff0c\u4fbf\u4e8e\u540e\u671f\u7ef4\u62a4\u3002")),(0,a.kt)("p",null,"\u5728\u5f00\u53d1 JavaScript SDK \u7684\u8fc7\u7a0b\u4e2d\uff0c\u6211\u4eec\u4e5f\u540c\u6837\u91c7\u7528\u7c7b\u4f3c\u7684\u601d\u8def\u3002JavaScript\u662f\u76ee\u524d\u6784\u5efaWeb\u5e94\u7528\u7684\u4e3b\u8981\u8bed\u8a00\uff0c\u5728\u6b64\u57fa\u7840\u4e0a\u4ea7\u751f\u4e86\u5f88\u591a\u73b0\u4ee3\u5316\u7684 JavaScript \u524d\u7aef\u6846\u67b6\uff0c\u6bd4\u5982\uff1aReact\u3001Vue\u3001Angular\u7b49\u3002\u8fd1\u51e0\u5e74\u5728\u56fd\u5185\u7206\u706b\u7684\u5fae\u4fe1\u5c0f\u7a0b\u5e8f\u6846\u67b6\u4e5f\u4e3b\u8981\u4f7f\u7528 JavaScript \u8bed\u8a00\u8fdb\u884c\u5f00\u53d1\u7684\u3002\u5982\u4f55\u5236\u4f5c\u4e00\u6b3e\u80fd\u652f\u6301\u6240\u6709\u524d\u7aef\u6846\u67b6\u4f7f\u7528\u7684\u901a\u7528 SDK\uff0c\u540c\u65f6\u5728\u6b64 SDK \u7684\u57fa\u7840\u4e0a\uff0c\u80fd\u591f\u5feb\u901f\u5730\u6839\u636e\u6846\u67b6\u7684\u8bed\u6cd5\u7279\u6027\u8fdb\u884c\u4e0a\u5c42\u5c01\u88c5\uff0c\u662f JavaScript SDK \u7684\u6838\u5fc3\u8981\u6c42\u4e4b\u4e00\u3002"),(0,a.kt)("h2",{id:"\u5b9e\u73b0\u601d\u8def"},"\u5b9e\u73b0\u601d\u8def"),(0,a.kt)("p",null,"\u5b9e\u73b0\u4e00\u4e2a\u529f\u80fd\u5b8c\u5584\u7684 JavaScript SDK\uff0c\u80fd\u591f\u5728\u666e\u901a\u7684 Web \u524d\u7aef\u5de5\u7a0b\u4e2d\u4f7f\u7528\u3002\u5728\u6b64\u57fa\u7840\u4e0a\uff0c\u6839\u636e\u6846\u67b6\u8bed\u6cd5\u7279\u6027\uff0c\u8fdb\u4e00\u6b65\u5c01\u88c5\u5176\u5b83\u8bed\u8a00\u7684 SDK\uff0c\u4e0d\u540c\u8bed\u8a00\u7684SDK\u5206\u522b\u7ba1\u7406\u548c\u53d1\u7248\u3002"),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_T4Ixnb6bIZtPWYPzNuA4",alt:"image.png"})),(0,a.kt)("h2",{id:"react-sdk\u7684\u5b9e\u73b0"},"React SDK\u7684\u5b9e\u73b0"),(0,a.kt)("p",null,"React SDK \u5728\u5b9e\u73b0\u65f6\u5c06 JavaScript SDK \u4f5c\u4e3a\u4f9d\u8d56\u9879\u5b89\u88c5\u5230\u5de5\u7a0b\u5185\uff0c\u4e3b\u8981\u4f7f\u7528\u4e86 React \u7684 Context API \u548c Context hooks \u8fdb\u884c\u4e0a\u5c42\u5c01\u88c5\uff0c\u65b9\u4fbf\u5f00\u53d1\u8005\u5728React\u5de5\u7a0b\u4e2d\u7684\u4f7f\u7528\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"1\u3001\u4f7f\u7528 React \u7684 createContext API \u521b\u5efa\u4e00\u4e2a\u4e0a\u4e0b\u6587\u5bf9\u8c61\uff0c\u4fdd\u5b58\u5f00\u5173 FeatureProbe \u5b9e\u4f8b\u548c\u5f00\u5173\u7ed3\u679c\u7684\u96c6\u5408\u30022\u3001\u4f7f\u7528 React \u7684 Context Hooks \u5c01\u88c5\u82e5\u5e72\u4e2a\u81ea\u5b9a\u4e49 Hook\uff0c\u7528\u4e8e\u5728\u4efb\u4f55\u7ec4\u4ef6\u5185\u5feb\u901f\u4f7f\u7528 FeatureProbe \u5b9e\u4f8b\u548c\u8bbf\u95ee\u5f00\u5173\u7ed3\u679c\u3002")),(0,a.kt)("p",null,"\u8fd9\u91cc\u6211\u4eec\u5c55\u793a\u4e86\u4e00\u79cd\u4ee5\u9ad8\u9636\u7ec4\u4ef6\u7684\u65b9\u5f0f\u4f7f\u7528 React SDK\u3002"),(0,a.kt)("h3",{id:"1\u5c06sdk\u521d\u59cb\u5316"},"1\u3001\u5c06\xa0SDK\xa0\u521d\u59cb\u5316"),(0,a.kt)("p",null,"\u200b\u4f7f\u7528 FPProvider \u5bf9\u6839\u7ec4\u4ef6 ",(0,a.kt)(s,{mdxType:"App"})," \u8fdb\u884c\u521d\u59cb\u5316\uff0c\u521d\u59cb\u5316\u65f6\u4f20\u5165\u5fc5\u586b\u53c2\u6570 remoteUrl\u3001clientSdkKey \u548c user \u5bf9\u8c61\u7b49\u3002"),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_2eJ5YdVji62rFGfNRtUY",alt:"image.png"})),(0,a.kt)("h3",{id:"2sdk-\u7684\u4f7f\u7528"},"2\u3001SDK \u7684\u4f7f\u7528"),(0,a.kt)("p",null,"\u4f7f\u7528 withFPConsumer \u9ad8\u9636\u7ec4\u4ef6\u7684\u65b9\u5f0f\u5305\u88c5\u4e1a\u52a1\u7ec4\u4ef6 ",(0,a.kt)(d,{mdxType:"Home"}),"\uff0c\u7ec4\u4ef6\u5185\u90e8\u53ef\u901a\u8fc7\xa0 props \u5c5e\u6027\u8bbf\u95ee FeatureProbe \u5b9e\u4f8b\uff08client\uff09\u548c\u5f00\u5173\u96c6\u5408\uff08toggles\uff09\u3002"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\uff081\uff09client \u5b9e\u4f8b\u4e0a\u53ef\u8bbf\u95ee JavaScript SDK \u6240\u6709\u5bf9\u5916\u66b4\u9732\u7684 API\uff0c\u6bd4\u5982 booleanValue\u3001jsonDetail\u3001track \u7b49\u3002")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\uff082\uff09toggles \u5f00\u5173\u96c6\u5408\u662f\u540c\u4e00\u4e2a\u7528\u6237\u5728\u4e00\u4e2a clientSdkKey \u73af\u5883\u4e2d\u8c03\u7528\u6240\u6709\u5f00\u5173\u7684\u8fd4\u56de\u7ed3\u679c\u96c6\u5408\uff0c\u63d0\u4f9b\u4e86\u53e6\u4e00\u79cd\u83b7\u53d6\u5f00\u5173\u7ed3\u679c\u548c\u8be6\u60c5\u7684\u65b9\u5f0f\u3002")),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_WIldHD3gGyJMAzAuZHpX",alt:"image.png"})),(0,a.kt)("h2",{id:"\u5fae\u4fe1\u5c0f\u7a0b\u5e8f-sdk\u7684\u5b9e\u73b0"},"\u5fae\u4fe1\u5c0f\u7a0b\u5e8f SDK\u7684\u5b9e\u73b0"),(0,a.kt)("p",null,"\u76f8\u6bd4\u8f83 React SDK\uff0c\u5728 JavaScript SDK \u4e0a\u7684\u96c6\u6210\u5fae\u4fe1\u5c0f\u7a0b\u5e8f SDK \u66f4\u590d\u6742\u4e00\u4e9b\uff0c\u9700\u8981\u9488\u5bf9\u5fae\u4fe1\u5c0f\u7a0b\u5e8f\u7684\u8bed\u6cd5\u7279\u6027\u505a\u4e00\u4e9b\u517c\u5bb9\u5de5\u4f5c\u3002\u4e3b\u8981\u7684\u539f\u56e0\u662f\u5fae\u4fe1\u5c0f\u7a0b\u5e8f\u548c\u666e\u901a\u7684 Web \u5e94\u7528\u7684\u8fd0\u884c\u73af\u5883\u4e0d\u540c\uff0c\u524d\u8005\u662f\u5728\u5fae\u4fe1\u5ba2\u6237\u7aef\u8fd0\u884c\uff0c\u540e\u8005\u5728\u6d4f\u89c8\u5668\u73af\u5883\u4e2d\u8fd0\u884c\u7684\u3002\u4f8b\u5982\u5728\u6d4f\u89c8\u5668\u73af\u5883\u4e2d\u652f\u6301\u7684 window \u548c document \u5bf9\u8c61\uff0c\u5728\u5fae\u4fe1\u5c0f\u7a0b\u5e8f\u4e2d\u662f\u4e0d\u652f\u6301\u7684\u3002"),(0,a.kt)("p",null,"\u4e0b\u9762\u7684\u8868\u683c\u5217\u4e3e\u51fa\u4e86\u4e24\u79cd SDK \u7684\u4e3b\u8981\u4e0d\u540c\u70b9\uff1a"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null}),(0,a.kt)("th",{parentName:"tr",align:null},"JavaScript SDK"),(0,a.kt)("th",{parentName:"tr",align:null},"\u5fae\u4fe1\u5c0f\u7a0b\u5e8fSDK"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"\u53d1\u9001HTTP\u8bf7\u6c42API"),(0,a.kt)("td",{parentName:"tr",align:null},"fetch"),(0,a.kt)("td",{parentName:"tr",align:null},"wx.request")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"\u672c\u5730\u7f13\u5b58API"),(0,a.kt)("td",{parentName:"tr",align:null},"localStorage.setItem\u3001localStorage.getItem"),(0,a.kt)("td",{parentName:"tr",align:null},"wx.setStorageSync\u3001wx.getStorageSync")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"\u957f\u8fde\u63a5\u5de5\u5177\u5e93"),(0,a.kt)("td",{parentName:"tr",align:null},"socket.io-client"),(0,a.kt)("td",{parentName:"tr",align:null},"wepapp.socket.io")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"\u662f\u5426\u652f\u6301\u81ea\u52a8\u4e0a\u62a5\u4e8b\u4ef6"),(0,a.kt)("td",{parentName:"tr",align:null},"\u652f\u6301"),(0,a.kt)("td",{parentName:"tr",align:null},"\u4e0d\u652f\u6301")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"UA"),(0,a.kt)("td",{parentName:"tr",align:null},"JS/1.0.1"),(0,a.kt)("td",{parentName:"tr",align:null},"MINIPROGRAM/1.0.1")))),(0,a.kt)("p",null,"\u5728\u4ee3\u7801\u5c42\u9762\uff0cJavaScript SDK \u5c06\u4e0a\u8ff0\u5dee\u5f02\u8fdb\u884c\u62bd\u79bb\uff0c\u5e76\u4fdd\u5b58\u5728 platform \u5bf9\u8c61\u4e2d\uff0cplatform\u5bf9\u8c61\u76ee\u524d\u5305\u542b\u7684\u5b57\u6bb5\u6709\uff1a"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"UA:")," \u6807\u8bc6SDK\u540d\u79f0\u548c\u7248\u672c\uff1b"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"localStorage\uff1a")," \u672c\u5730\u5b58\u50a8\u5bf9\u8c61\uff0c\u8c03\u7528 localStorage.setItem() \u65b9\u6cd5\u4fdd\u5b58\u6570\u636e\uff0c\u8c03\u7528localStorage.getItem() \u65b9\u6cd5\u83b7\u53d6\u6570\u636e\uff1b"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"httpRequest\uff1a")," \u53d1\u9001\u8bf7\u6c42\u5bf9\u8c61\uff0c\u8c03\u7528 httpRequest.get() \u65b9\u6cd5\u53d1\u9001GET\u8bf7\u6c42\uff0c\u8c03\u7528httpRequest.post() \u65b9\u6cd5\u53d1\u9001 POST \u8bf7\u6c42\uff1b"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"socket\uff1a")," \u7528\u4e8e\u521d\u59cb\u5316socket.io-client\u5ba2\u6237\u7aef\uff0c\u76d1\u542c\u5f00\u5173\u7684\u53d8\u66f4\u3002"),(0,a.kt)("p",null,"JavaScript SDK \u5bfc\u51fa initializePlatform \u65b9\u6cd5\uff0c\u5176\u5b83\u8bed\u8a00\u7684 SDK \u5728\u521d\u59cb\u5316\u65f6\u53ef\u4f20\u5165 platform \u5bf9\u8c61\u6765\u4fdd\u5b58\u914d\u7f6e\u5dee\u5f02\u90e8\u5206\uff0c\u4e0d\u4f20\u5165\u65f6\u5c06\u4f7f\u7528\u9ed8\u8ba4\u503c\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"export function initializePlatform(options) {\n  if (options.platform) {\n    setPlatform(options.platform);\n  }\n}\n")),(0,a.kt)("p",null,"\u4ee5\u4e0b\u4e3a\u5fae\u4fe1\u5c0f\u7a0b\u5e8f SDK \u7684 platform \u5bf9\u8c61\u6784\u6210\u3002\u5728\u53d1\u9001 HTTP \u8bf7\u6c42\u4e0a\u6211\u4eec\u76ee\u524d\u9009\u62e9\u4e86\u4e00\u6b3e\u5f00\u6e90\u7684\u5de5\u5177\u5e93 wefetch\uff0c\u65b9\u4fbf\u540e\u7eed\u652f\u6301\u5176\u5b83\u7684\u5c0f\u7a0b\u5e8f SDK\uff0cWebSocket \u5ba2\u6237\u7aef\u9009\u62e9\u4e86\u57fa\u4e8e socket.io \u5b9e\u73b0\u7684 weapp.socket.io\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'import wefetch from "wefetch";          // \u5c0f\u7a0b\u5e8f\u8bf7\u6c42\u6269\u5c55\nimport pkg from \'../package.json\';      \nconst PKG_VERSION = pkg.version;        // \u5fae\u4fe1\u5c0f\u7a0b\u5e8f UA \u4fe1\u606f\nconst io = require("weapp.socket.io");  // \u57fa\u4e8e socket.io \u5b9e\u73b0\u7684\u6784\u5efa\u5fae\u4fe1\u5c0f\u7a0b\u5e8f\u7684 WebSocket \u5ba2\u6237\u7aef\n\n// \u57fa\u4e8e\u5fae\u4fe1\u5c0f\u7a0b\u5e8f API \u5c01\u88c5\u7684 localStorage \u5bf9\u8c61\nclass StorageProvider {\n  public async getItem(key) {\n    try {\n      return wx.getStorageSync(key);\n    } catch (e) {\n      console.log(e);\n    }\n  }\n\n  public async setItem(key, data) {\n    try {\n      wx.setStorageSync(key, data);\n    } catch (e) {\n      console.log(e);\n    }\n  }\n}\n\n// \u57fa\u4e8e\u5fae\u4fe1\u5c0f\u7a0b\u5e8f API \u5c01\u88c5\u7684 httpRequest\u5bf9\u8c61\nconst httpRequest = {\n  get: function(url, headers, data, successCb, errorCb) {\n    wefetch.get(url, {\n      header: headers,\n      data,\n    }).then(json => {\n      successCb(json.data);\n    }).catch(e => {\n      errorCb(e);\n    });\n  },\n  post: function(url, headers, data, successCb, errorCb) {\n    wefetch.post(url, {\n      header: headers,\n      data,\n    }).then(() => {\n      successCb();\n    }).catch(e => {\n      errorCb(e);\n    });\n  }\n};\n\nconst platform = {\n  localStorage: new StorageProvider(),\n  UA: "MINIPROGRAM/" + PKG_VERSION,\n  httpRequest: httpRequest,\n  socket: io,\n};\n\n// \u521d\u59cb\u5316\ninitializePlatform({ platform });\n')),(0,a.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,a.kt)("p",null,"\u4e0a\u9762\u6211\u4eec\u4ecb\u7ecd\u4e86\u5728 JavaScript SDK \u7684\u57fa\u7840\u4e0a\u53bb\u5f00\u53d1\u5176\u5b83\u8bed\u8a00\u7684 SDK\u3002\u6838\u5fc3\u601d\u8def\u662f\u9996\u5148\u5b9e\u73b0\u4e00\u4e2a\u300c\u5927\u800c\u5168\u300d\u7684\u901a\u7528SDK\uff0c\u7136\u540e\u5c06\u5404\u4e2a\u8bed\u8a00\u5dee\u5f02\u7684\u90e8\u5206\u8fdb\u884c\u62bd\u79bb\uff0c\u5176\u5b83\u8bed\u8a00SDK\u5728\u521d\u59cb\u5316\u65f6\u8fdb\u884c\u5dee\u5f02\u90e8\u5206\u7684\u66ff\u6362\u3002\u5176\u5b83\u8bed\u8a00\u7684SDK\u518d\u6839\u636e\u5bf9\u5e94\u7684\u8bed\u6cd5\u7279\u6027\u8fdb\u884c\u4e0a\u5c42\u5c01\u88c5\uff0c\u5e95\u5c42\u590d\u7528 JavaScript SDK \u63d0\u4f9b\u7684\u901a\u7528\u80fd\u529b\u3002"),(0,a.kt)("p",null,"\u76ee\u524d\u9664\u4e86 JavaScript SDK \u3001React SDK \u548c \u5fae\u4fe1\u5c0f\u7a0b\u5e8f SDK\u4e4b\u5916\uff0c\u6211\u4eec\u6b63\u5728\u51c6\u5907 Vue SDK\u3002\u5982\u679c FeatureProbe \u76ee\u524d\u63d0\u4f9b\u7684SDK\u4e0d\u6ee1\u8db3\u60a8\u7684\u9700\u6c42\uff0c\u53ef\u4ee5\u901a\u8fc7\u65b0\u5efaissue\u7684\u65b9\u5f0f\u544a\u77e5\u6211\u4eec\u3002\u6211\u4eec\u4e5f\u6b22\u8fce\u793e\u533a\u4f19\u4f34\u80fd\u4e3a\u6211\u4eec\u8d21\u732e\u66f4\u591a\u8bed\u8a00\u7684 SDK\uff0c\u8d21\u732eSDK\u65f6\u53ef\u53c2\u8003\u6587\u6863 SDK \u8d21\u732e\u6307\u5357\uff1a",(0,a.kt)("a",{parentName:"p",href:"https://docs.featureprobe.io/zh-CN/reference/sdk-contributor/%E3%80%82"},"https://docs.featureprobe.io/zh-CN/reference/sdk-contributor/\u3002")))}m.isMDXComponent=!0}}]);