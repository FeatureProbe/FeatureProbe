"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[8983],{3905:(e,t,r)=>{r.d(t,{Zo:()=>m,kt:()=>f});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var u=a.createContext({}),i=function(e){var t=a.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},m=function(e){var t=i(e.components);return a.createElement(u.Provider,{value:t},e.children)},g={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,l=e.originalType,u=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),c=i(r),f=n,d=c["".concat(u,".").concat(f)]||c[f]||g[f]||l;return r?a.createElement(d,o(o({ref:t},m),{},{components:r})):a.createElement(d,o({ref:t},m))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=r.length,o=new Array(l);o[0]=c;var p={};for(var u in t)hasOwnProperty.call(t,u)&&(p[u]=t[u]);p.originalType=e,p.mdxType="string"==typeof e?e:n,o[1]=p;for(var i=2;i<l;i++)o[i]=r[i];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}c.displayName="MDXCreateElement"},1022:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>g,frontMatter:()=>l,metadata:()=>p,toc:()=>i});var a=r(7462),n=(r(7294),r(3905));const l={slug:"FeatureProbe configuration",title:"\u914d\u7f6e\u4e2d\u5fc3\u4e0e Feature Management\u7684\u533a\u522b"},o=void 0,p={permalink:"/FeatureProbe/zh-CN/blog/FeatureProbe configuration",editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/blog/2023-01-12-featureprobe.md",source:"@site/blog/2023-01-12-featureprobe.md",title:"\u914d\u7f6e\u4e2d\u5fc3\u4e0e Feature Management\u7684\u533a\u522b",description:"\u5f88\u591a\u4eba\u5728\u4e00\u5f00\u59cb\u4e86\u89e3\u529f\u80fd\u7ba1\u7406\uff08Feature Management\uff09\u7684\u65f6\u5019\uff0c\u4f1a\u7591\u60d1\u529f\u80fd\u7ba1\u7406\u4e0e\u914d\u7f6e\u4e2d\u5fc3\u6709\u4ec0\u4e48\u533a\u522b\uff0c\u5728\u8fd9\u7bc7\u6587\u7ae0\u4e2d\u6211\u4eec\u6765\u8bb2\u8bb2\u4e8c\u8005\u7684\u533a\u522b\uff0c\u5728\u5bf9\u6bd4\u4e24\u8005\u4e4b\u524d\u6211\u4eec\u5148\u770b\u4e0b\u5b83\u4eec\u662f\u4ec0\u4e48\u3001\u5206\u522b\u80fd\u89e3\u51b3\u4ec0\u4e48\u95ee\u9898\u4ee5\u53ca\u5e38\u89c1\u7684\u5b9e\u73b0\u65b9\u6848\u6709\u54ea\u4e9b\u3002",date:"2023-01-12T00:00:00.000Z",formattedDate:"2023\u5e741\u670812\u65e5",tags:[],readingTime:7.74,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"FeatureProbe configuration",title:"\u914d\u7f6e\u4e2d\u5fc3\u4e0e Feature Management\u7684\u533a\u522b"},prevItem:{title:"\u529f\u80fd\u5f00\u5173 What? Why? How\uff1f",permalink:"/FeatureProbe/zh-CN/blog/FeatureProbe feature toggle what why and how"},nextItem:{title:"\u5206\u652f\u7ba1\u7406\u5de5\u5177:\u7279\u6027\u5206\u652f VS \u7279\u6027\u5f00\u5173",permalink:"/FeatureProbe/zh-CN/blog/FeatureProbe BranchingAndFlags"}},u={authorsImageUrls:[]},i=[{value:"<strong>\u4e00\u3001\u4ec0\u4e48\u662f\u914d\u7f6e\u4e2d\u5fc3\uff1f</strong>",id:"\u4e00\u4ec0\u4e48\u662f\u914d\u7f6e\u4e2d\u5fc3",level:2},{value:"<strong>\u4e8c\u3001\u4ec0\u4e48\u662fFeature Management\uff1f</strong>",id:"\u4e8c\u4ec0\u4e48\u662ffeature-management",level:2},{value:"<strong>\u4e09\u3001\u4e24\u8005\u7684\u533a\u522b\u548c\u5173\u7cfb</strong>",id:"\u4e09\u4e24\u8005\u7684\u533a\u522b\u548c\u5173\u7cfb",level:2},{value:"<strong>\u56db\u3001\u4e24\u8005\u76f8\u4e92\u662f\u5426\u5177\u5907\u66ff\u4ee3\u6027</strong>",id:"\u56db\u4e24\u8005\u76f8\u4e92\u662f\u5426\u5177\u5907\u66ff\u4ee3\u6027",level:2},{value:"<strong>\u4e94\u3001\u603b\u7ed3</strong>",id:"\u4e94\u603b\u7ed3",level:2}],m={toc:i};function g(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"\u5f88\u591a\u4eba\u5728\u4e00\u5f00\u59cb\u4e86\u89e3\u529f\u80fd\u7ba1\u7406\uff08Feature Management\uff09\u7684\u65f6\u5019\uff0c\u4f1a\u7591\u60d1\u529f\u80fd\u7ba1\u7406\u4e0e\u914d\u7f6e\u4e2d\u5fc3\u6709\u4ec0\u4e48\u533a\u522b\uff0c\u5728\u8fd9\u7bc7\u6587\u7ae0\u4e2d\u6211\u4eec\u6765\u8bb2\u8bb2\u4e8c\u8005\u7684\u533a\u522b\uff0c\u5728\u5bf9\u6bd4\u4e24\u8005\u4e4b\u524d\u6211\u4eec\u5148\u770b\u4e0b\u5b83\u4eec\u662f\u4ec0\u4e48\u3001\u5206\u522b\u80fd\u89e3\u51b3\u4ec0\u4e48\u95ee\u9898\u4ee5\u53ca\u5e38\u89c1\u7684\u5b9e\u73b0\u65b9\u6848\u6709\u54ea\u4e9b\u3002"),(0,n.kt)("h2",{id:"\u4e00\u4ec0\u4e48\u662f\u914d\u7f6e\u4e2d\u5fc3"},(0,n.kt)("strong",{parentName:"h2"},"\u4e00\u3001\u4ec0\u4e48\u662f\u914d\u7f6e\u4e2d\u5fc3\uff1f")),(0,n.kt)("p",null,"\u901a\u8fc7\u914d\u7f6e\u4e2d\u5fc3\u5c06\u5e94\u7528\u7a0b\u5e8f\u4e2d\u7ed3\u6784\u5316\u914d\u7f6e\u8fdb\u884c\u7edf\u4e00\u7ba1\u7406\uff0c\u5f53\u914d\u7f6e\u53d8\u66f4\u540e\u80fd\u591f\u5728\u5e94\u7528\u7a0b\u5e8f\u4e2d\u5b9e\u65f6\u751f\u6548\uff0c\u6709\u6548\u907f\u514d\u4e86\u4f20\u7edf\u6a21\u5f0f\u4e0b\u4fee\u6539\u5e94\u7528\u7a0b\u5e8f\u914d\u7f6e\u9700\u8981\u6253\u5305\u3001\u90e8\u7f72\u3001\u6d4b\u8bd5\u3001\u4e0a\u7ebf\u7b49\u4e00\u7cfb\u5217\u7e41\u7410\u6d41\u7a0b\u3002\u5e7f\u6cdb\u7528\u4e8e\u5982\u5fae\u670d\u52a1\u5e94\u7528\u67b6\u6784\u4e0b\u7684\u914d\u7f6e\u7ba1\u7406\u3001\u5e94\u7528\u4e1a\u52a1\u53c2\u6570\u914d\u7f6e\u3001\u6587\u6848\u914d\u7f6e\u7b49\u9700\u8981\u6ee1\u8db3\u5feb\u901f\u5bf9\u7ebf\u4e0a\u53d8\u66f4\u7684\u4e1a\u52a1\u573a\u666f\u3002"),(0,n.kt)("p",null,"\u914d\u7f6e\u4e2d\u5fc3\u7684\u5177\u4f53\u5b9e\u73b0\u4e3b\u8981\u6709\u4e24\u5927\u65b9\u5411\uff1a\u81ea\u5efa\u6216\u4f7f\u7528\u7b2c\u4e09\u65b9\u7ec4\u4ef6\u3002\u6700\u7b80\u5355\u7684\u81ea\u5efa\u65b9\u6848\u5982\u5c06\u914d\u7f6e\u5b58\u50a8\u5728\u6570\u636e\u5e93\u4e2d\uff0c\u7a0b\u5e8f\u5b9a\u65f6\u4ece\u6570\u636e\u5e93\u4e2d\u52a0\u8f7d\u6700\u65b0\u914d\u7f6e\u4ee5\u5b9e\u73b0\u5feb\u901f\u53d8\u66f4\u751f\u6548\u3002\u4e5f\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u6210\u719f\u4e14\u529f\u80fd\u5b8c\u5907\u7684\u7b2c\u4e09\u65b9\u5f00\u6e90\u7ec4\u4ef6\uff0c\u5982\xa0Apollo\u3001Nacos\xa0\u7b49\u3002"),(0,n.kt)("h2",{id:"\u4e8c\u4ec0\u4e48\u662ffeature-management"},(0,n.kt)("strong",{parentName:"h2"},"\u4e8c\u3001\u4ec0\u4e48\u662fFeature Management\uff1f")),(0,n.kt)("p",null,"\u529f\u80fd\u7ba1\u7406\uff08Feature Management\uff0c\u4e5f\u6709\u8bd1\u4f5c\u7279\u6027\u7ba1\u7406\uff09\u662f\u7ba1\u7406\u300c\u529f\u80fd\u300d\u751f\u547d\u5468\u671f\u7684\u8f6f\u4ef6\u5de5\u7a0b\u5b9e\u8df5\uff0c\u5b83\u5305\u542b\u4e86\u6e10\u8fdb\u5f0f\u53d1\u5e03\u3001\u5b9a\u5411\u6295\u653e\u3001A/B \u5b9e\u9a8c\u3001\u5b9e\u65f6\u914d\u7f6e\u53d8\u66f4\u7b49\u9488\u5bf9\u300c\u529f\u80fd\u300d\u7c92\u5ea6\u5168\u751f\u547d\u5468\u671f\u7ba1\u7406\u3002\u5728\u6301\u7eed\u4ea4\u4ed8\u5b9e\u8df5\u4e2d\uff0c\u5b83\u4f7f\u6211\u4eec\u80fd\u591f\u505a\u5230\u8ba9\u6bcf\u4e00\u4e2a\u53d8\u66f4\u90fd\u80fd\u72ec\u7acb\u90e8\u7f72\uff0c\u5e76\u901a\u8fc7\u6e10\u8fdb\u5f0f\u53d1\u5e03\u6765\u51cf\u5c11\u53d8\u66f4\u98ce\u9669\uff1b\u80fd\u591f\u611f\u77e5\u5230\u6bcf\u4e00\u4e2a\u529f\u80fd\u5728\u7ebf\u4e0a\u771f\u5b9e\u73af\u5883\u4e0b\u7528\u6237\u7684\u4f7f\u7528\u60c5\u51b5\u5982\u4f55\uff1b\u80fd\u591f\u6e05\u6670\u5730\u770b\u5230\u65b0\u529f\u80fd\u4ea7\u751f\u7684\u4e1a\u52a1\u4ef7\u503c\u7b49\u7b49\u3002"),(0,n.kt)("p",null,"\u4e00\u4e2a\u5b8c\u5907\u7684\xa0Feature Management\xa0\u7cfb\u7edf\u4e0d\u4ec5\u8981\u5b9e\u73b0\u300c\u529f\u80fd\u300d\u7684\u5168\u751f\u547d\u5468\u671f\u7ba1\u7406\u529f\u80fd\uff0c\u8fd8\u8981\u63d0\u4f9b\u9ad8\u6548\u7684\u300c\u529f\u80fd\u5f00\u5173\u300d\u89c4\u5219\u4e0b\u53d1\u548c\u591a\u8bed\u8a00\u5ba2\u6237\u7aef\u83b7\u53d6\u5f00\u5173\u7ed3\u679c\u7b49\u80fd\u529b\uff0c\u800c\u56fd\u5185\u539f\u751f\u652f\u6301\u529f\u80fd\u7ba1\u7406\u5b9e\u8df5\u7684\u5f00\u6e90\u5de5\u5177\u5e73\u53f0\u53ea\u6709\xa0FeatureProbe\xa0\u3002"),(0,n.kt)("h2",{id:"\u4e09\u4e24\u8005\u7684\u533a\u522b\u548c\u5173\u7cfb"},(0,n.kt)("strong",{parentName:"h2"},"\u4e09\u3001\u4e24\u8005\u7684\u533a\u522b\u548c\u5173\u7cfb")),(0,n.kt)("p",null,"\u4ece\u4e0a\u9762\u5b9a\u4e49\u4e0d\u96be\u770b\u51fa\u4e24\u8005\u4e3b\u8981\u533a\u522b\u662f\u89e3\u51b3\u7684\u95ee\u9898\u4e0d\u4e00\u6837\uff0c\u914d\u7f6e\u4e2d\u5fc3\u89e3\u51b3\u7684\u5982\u4f55\u5229\u7528\u914d\u7f6e\u5b9e\u73b0\u5bf9\u7ebf\u4e0a\u5feb\u901f\u53d8\u66f4\uff0c\u800c Feature Management \u89e3\u51b3\u7684\u662f\u5982\u4f55\u901a\u8fc7\u7ba1\u7406\u300c\u529f\u80fd\u300d\u751f\u547d\u5468\u671f\u6765\u5b9e\u73b0\u5bf9\u529f\u80fd\u7c92\u5ea6\u7684\u7cbe\u51c6\u7ba1\u63a7\u3002"),(0,n.kt)("p",null,"\u4ece\u6280\u672f\u89d2\u5ea6\u6765\u770b\uff0cFeature Management \u7cfb\u7edf\u4e5f\u9700\u8981\u5b9e\u73b0\u5bf9\u7ebf\u4e0a\u5e94\u7528\u7a0b\u5e8f\u5feb\u901f\u53d8\u66f4\u3002\u4f8b\u5982\u5f53\u6211\u4eec\u53d8\u66f4\u300c\u529f\u80fd\u5f00\u5173\u300d\u4e2d\u4eba\u7fa4\u653e\u91cf\u89c4\u5219\u540e\uff0cClient \u7aef\uff08\u5e94\u7528\u7a0b\u5e8f\uff09\u9700\u8981\u80fd\u5feb\u901f\u611f\u77e5\u89c4\u5219\u7684\u53d8\u5316\u6765\u6309\u6700\u65b0\u914d\u7f6e\u89c4\u5219\u6267\u884c\u653e\u91cf\u5904\u7406\uff0c\u4ece\u8fd9\u70b9\u6765\u770b Feature Management \u7cfb\u7edf\u53ef\u4ee5\u4f9d\u6258\u914d\u7f6e\u4e2d\u5fc3\u6765\u4f5c\u4e3a\u5f00\u5173\u89c4\u5219\u4e0b\u53d1\u94fe\u8def\u7684\u5e95\u5c42\u5b9e\u73b0\u3002"),(0,n.kt)("p",null,"\u8fd9\u4e5f\u51b3\u5b9a\u4e86\u4e24\u8005\u7cfb\u7edf\u7ec4\u7ec7\u7ed3\u6784\u4e0a\u76f8\u4f3c\u6027\uff0c\u90fd\u81f3\u5c11\u9700\u8981\u7531\u7ba1\u7406\u5e73\u53f0\u3001\u4e0b\u53d1\u901a\u8def\u53ca Client SDK \u7ec4\u6210\uff0c\u4e0d\u540c\u7684\u5730\u65b9\u5728\u4e8e\u4e24\u8005\u7684\u7ba1\u7406\u5e73\u53f0\u6240\u63d0\u4f9b\u7684\u4e1a\u52a1\u80fd\u529b\u4e0d\u4e00\u6837\u3002\u4e0d\u8fc7\u5b83\u4eec\u4e0b\u53d1\u901a\u8def\u53ca Client SDK \u63d0\u4f9b\u80fd\u529b\u7c7b\u4f3c\uff0c\u5bf9 Feature Management \u800c\u8a00\u9700\u8981\u4e0b\u53d1\u5f00\u5173\uff08\u672c\u8d28\u4e0a\u4e5f\u662f\u4e00\u4e2a\u914d\u7f6e\uff09\u5e76\u4e3a\u5e94\u7528\u7a0b\u5e8f\u63d0\u4f9b\u8bbf\u95ee\u529f\u80fd\u5f00\u5173\u7684 SDK\uff0c\u800c\u914d\u7f6e\u4e2d\u5fc3\u540c\u6837\u4e5f\u9700\u8981\u4e0b\u53d1\u914d\u7f6e\u548c\u4e3a\u5e94\u7528\u7a0b\u5e8f\u63d0\u4f9b\u8bbf\u95ee\u914d\u7f6e\u5185\u5bb9\u7684\u80fd\u529b\u3002"),(0,n.kt)("h2",{id:"\u56db\u4e24\u8005\u76f8\u4e92\u662f\u5426\u5177\u5907\u66ff\u4ee3\u6027"},(0,n.kt)("strong",{parentName:"h2"},"\u56db\u3001\u4e24\u8005\u76f8\u4e92\u662f\u5426\u5177\u5907\u66ff\u4ee3\u6027")),(0,n.kt)("p",null,"\u65e2\u7136\u4e24\u8005\u90e8\u5206\u529f\u80fd\u4e0a\u6709\u4e00\u5b9a\u7684\u76f8\u4f3c\u6027\uff0c\u90a3\u662f\u5426\u5177\u5907\u66ff\u4ee3\u6027\u5462\uff1f  "),(0,n.kt)("p",null,"\u6bd4\u5982\u6211\u4eec\u662f\u5426\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u914d\u7f6e\u4e2d\u5fc3\u5f53\u6210 Feature Management \u7cfb\u7edf\u6765\u4f7f\u7528\u5462\uff1f\u5176\u5b9e\u524d\u9762\u6709\u63d0\u5230\uff0c\u914d\u7f6e\u4e2d\u5fc3\u4f5c\u4e3a\u901a\u7528\u914d\u7f6e\u5e73\u53f0\u5e76\u4e0d\u5173\u6ce8\u914d\u7f6e\u5185\u5bb9\uff0c\u4e5f\u5c31\u610f\u5473\u7740\u4f60\u53ef\u4ee5\u5bf9\u914d\u7f6e\u505a\u4efb\u4f55\u5b9a\u4e49\u3002\u4ee5\u4e00\u4e2a\u6700\u7b80\u5355\u529f\u80fd\u5f00\u5173\u573a\u666f\u4e3a\u4f8b\uff0c\u6bd4\u5982\u63a7\u5236\u529f\u80fdA\u5f00\u542f\u6216\u5173\u95ed\uff0c\u786e\u5b9e\u53ef\u4ee5\u901a\u8fc7\u5728\u914d\u7f6e\u4e2d\u5fc3\u4e0a\u521b\u5efa\u4e00\u4e2a\u9488\u5bf9\u8be5\u573a\u666f\u7684 K-V \u914d\u7f6e\u5f53\u6210\u5f00\u5173\u6765\u6ee1\u8db3\u6700\u57fa\u7840\u7684\u529f\u80fd\u5f00\u5173\u4f7f\u7528\u573a\u666f\u3002"),(0,n.kt)("p",null,"\u4f46\u8fd9\u5bf9\u4e8e Feature Management \u7cfb\u7edf\u6765\u8bf4\u662f\u6700\u7b80\u5355\u7684\u573a\u666f\uff0c\u8fd8\u8981\u505a\u5230\u5bf9\u529f\u80fd\u7c92\u5ea6\u7684\u6e10\u8fdb\u5f0f\u53d1\u5e03\u3001\u5c06\u529f\u80fd\u5b9a\u5411\u6295\u653e\u7ed9\u7279\u5b9a\u4eba\u7fa4\u3001A/B \u5b9e\u9a8c\u53ca\u5bf9 Feature \u8fdb\u884c\u4ef7\u503c\u8bc4\u4f30\u7b49\u7b49\uff0c\u800c\u90fd\u662f\u4f5c\u4e3a\u914d\u7f6e\u4e2d\u5fc3\u6240\u4e0d\u5177\u5907\u7684\u3002  "),(0,n.kt)("p",null,"\u65e2\u7136\u914d\u7f6e\u4e2d\u5fc3\u7cfb\u7edf\u65e0\u6cd5\u66ff\u4ee3 Feature Management \u7cfb\u7edf\uff0c\u90a3\u53cd\u4e4b\u7528 Feature Management \u7cfb\u7edf\u66ff\u4ee3\u914d\u7f6e\u4e2d\u5fc3\u662f\u5426\u53ef\u884c\uff1f\u7b54\u6848\u662f\u80af\u5b9a\u7684\u3002",(0,n.kt)("strong",{parentName:"p"},"\u4ee5\xa0FeatureProbe\xa0\u4e3a\u4f8b\uff0c\u5728\u521b\u5efa\u300c\u529f\u80fd\u5f00\u5173\u300d\u65f6\u652f\u63014\u79cd\u5f00\u5173\u8fd4\u56de\u503c\u7c7b\u578b\uff0c\u5206\u522b\u662f Number\u3001String\u3001Boolean\u3001JSON\uff0c\u610f\u5473\u7740\u4f60\u53ef\u4ee5\u5728\u5f00\u5173\u8fd4\u56de\u503c\u4e2d\u653e\u4e0a\u4f60\u539f\u672c\u5728\u914d\u7f6e\u4e2d\u5fc3\u7684\u914d\u7f6e\u5185\u5bb9\uff0c\u518d\u5229\u7528\xa0\xa0FeatureProbe\xa0\u63d0\u4f9b\u7684 SDK \u6765\u83b7\u53d6\u76f8\u5e94\u7684\u914d\u7f6e\u8fd4\u56de\u503c\u5373\u53ef\u3002")),(0,n.kt)("p",null,(0,n.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_UP9vTitquQb4e8N87Ljs",alt:"image.png"})),(0,n.kt)("h2",{id:"\u4e94\u603b\u7ed3"},(0,n.kt)("strong",{parentName:"h2"},"\u4e94\u3001\u603b\u7ed3")),(0,n.kt)("p",null,"\u6700\u540e\u603b\u7ed3\u4e0b\u914d\u7f6e\u4e2d\u5fc3\u4e0e Feature Management \u4e0d\u540c\u7ef4\u5ea6\u7684\u5bf9\u6bd4\uff1a"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:"left"},"\u5bf9\u6bd4\u7ef4\u5ea6"),(0,n.kt)("th",{parentName:"tr",align:"left"},"\u914d\u7f6e\u4e2d\u5fc3"),(0,n.kt)("th",{parentName:"tr",align:"left"},"Feature Management"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"\u4f7f\u7528\u573a\u666f"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u81ea\u5b9a\u4e49\u7ed3\u6784\u5316\u914d\u7f6e\uff0c\u6ee1\u8db3\u5bf9\u7ebf\u4e0a\u5feb\u901f\u53d8\u66f4\u3002"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u6301\u7eed\u96c6\u6210\u3001\u90e8\u7f72\u548c\u53d1\u5e03\u89e3\u8026\u3001\u6e10\u8fdb\u5f0f\u53d1\u5e03\u3001\u5b9a\u5411\u6295\u653e\u3001A/B \u5b9e\u9a8c\u3001\u9884\u6848\u964d\u7ea7")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"\u7528\u6237\u89d2\u8272"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u5f00\u53d1\u4eba\u5458\u3001QA\u3002"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u5f00\u53d1\u4eba\u5458\u3001QA\u3001PM\u3001SRE\u3001\u8fd0\u8425\u4eba\u5458\u3002")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"\u7cfb\u7edf\u590d\u6742\u6027"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u8f83\u9ad8\uff0c\u4ee5\u7eaf\u6587\u672c\u3001JSON \u6216 K/V \u65b9\u5f0f\u7ba1\u7406\uff0c\u9700\u8981\u9488\u5bf9\u914d\u7f6e\u5185\u5bb9\u5b9a\u5236\u5f00\u53d1\u6ee1\u8db3\u4e0d\u540c\u9700\u6c42\u3002"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u8f83\u4f4e\uff0c\u53ef\u89c6\u5316\u914d\u7f6e\uff0c\u5927\u90e8\u5206\u529f\u80fd\u7ba1\u7406\u573a\u666f\u5f00\u7bb1\u5373\u7528\u3002")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"\u53ef\u89c2\u6d4b\u6027"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u9700\u8981\u81ea\u884c\u5b9a\u5236\u5f00\u53d1\u76d1\u63a7\u903b\u8f91\u3002"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u53ef\u4ee5\u5b9e\u65f6\u76d1\u63a7\u529f\u80fd\u8bbf\u95ee\u60c5\u51b5\u5e76\u5bf9\u529f\u80fd\u8fdb\u884c\u6548\u679c\u8bc4\u4f30")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"\u53d8\u66f4\u5feb\u901f\u751f\u6548"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u652f\u6301\u3002"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u652f\u6301\uff0c\u5229\u7528\u4e0b\u53d1\u901a\u8def\u5b9e\u73b0\u89c4\u5219\u5feb\u901f\u751f\u6548\u3002")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:"left"},"\u9700\u8981\u5b9a\u671f\u6e05\u7406"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u5f88\u5c11\uff0c\u5927\u591a\u6570\u914d\u7f6e\u548c\u4e1a\u52a1\u8026\u5408\u6027\u8f83\u9ad8\uff0c\u9700\u8981\u914d\u5408\u4e1a\u52a1\u957f\u671f\u4f7f\u7528\u3002"),(0,n.kt)("td",{parentName:"tr",align:"left"},"\u7ecf\u5e38\uff0c\u5927\u591a\u6570\u529f\u80fd\u5f00\u5173\u90fd\u662f\u77ed\u671f\u6027\u7684\uff0c\u5728\u4f7f\u7528\u5b8c\u6210\u540e\u5373\u53ef\u6e05\u7406\u3002")))))}g.isMDXComponent=!0}}]);