"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[942],{3905:(t,e,r)=>{r.d(e,{Zo:()=>c,kt:()=>m});var a=r(7294);function l(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,a)}return r}function o(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?n(Object(r),!0).forEach((function(e){l(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function p(t,e){if(null==t)return{};var r,a,l=function(t,e){if(null==t)return{};var r,a,l={},n=Object.keys(t);for(a=0;a<n.length;a++)r=n[a],e.indexOf(r)>=0||(l[r]=t[r]);return l}(t,e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);for(a=0;a<n.length;a++)r=n[a],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(l[r]=t[r])}return l}var u=a.createContext({}),i=function(t){var e=a.useContext(u),r=e;return t&&(r="function"==typeof t?t(e):o(o({},e),t)),r},c=function(t){var e=i(t.components);return a.createElement(u.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},d=a.forwardRef((function(t,e){var r=t.components,l=t.mdxType,n=t.originalType,u=t.parentName,c=p(t,["components","mdxType","originalType","parentName"]),d=i(r),m=l,b=d["".concat(u,".").concat(m)]||d[m]||s[m]||n;return r?a.createElement(b,o(o({ref:e},c),{},{components:r})):a.createElement(b,o({ref:e},c))}));function m(t,e){var r=arguments,l=e&&e.mdxType;if("string"==typeof t||l){var n=r.length,o=new Array(n);o[0]=d;var p={};for(var u in e)hasOwnProperty.call(e,u)&&(p[u]=e[u]);p.originalType=t,p.mdxType="string"==typeof t?t:l,o[1]=p;for(var i=2;i<n;i++)o[i]=r[i];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5615:(t,e,r)=>{r.r(e),r.d(e,{assets:()=>u,contentTitle:()=>o,default:()=>s,frontMatter:()=>n,metadata:()=>p,toc:()=>i});var a=r(7462),l=(r(7294),r(3905));const n={slug:"FeatureProbe rollout percentage",title:"\u5982\u4f55\u6309\u767e\u5206\u6bd4\u5c06\u529f\u80fd\u7070\u5ea6\u653e\u91cf"},o=void 0,p={permalink:"/FeatureProbe/blog/FeatureProbe rollout percentage",editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/blog/2023-04-21-featureprobe.md",source:"@site/blog/2023-04-21-featureprobe.md",title:"\u5982\u4f55\u6309\u767e\u5206\u6bd4\u5c06\u529f\u80fd\u7070\u5ea6\u653e\u91cf",description:"\u5f53\u6211\u4eec\u53d1\u5e03\u65b0\u529f\u80fd\u65f6\uff0c\u9700\u8981\u5c3d\u53ef\u80fd\u964d\u4f4e\u56e0\u65b0\u529f\u80fd\u53d1\u5e03\u6240\u5bfc\u81f4\u7684\u7ebf\u4e0a\u98ce\u9669\uff0c\u901a\u5e38\u4f1a\u91c7\u53d6\u7070\u5ea6\u653e\u91cf\u7684\u65b9\u5f0f\u5c06\u65b0\u529f\u80fd\u9010\u6b65\u53d1\u5e03\u7ed9\u7528\u6237\u3002\u5728\u5177\u4f53\u5b9e\u65bd\u7070\u5ea6\u653e\u91cf\u65f6\uff0c\u6211\u4eec\u53ef\u4ee5\u6839\u636e\u4e1a\u52a1\u9700\u6c42\u9009\u62e9\u76f8\u5e94\u7684\u653e\u91cf\u89c4\u5219\uff0c\u5e38\u89c1\u5982\u6309\u767d\u540d\u5355\u653e\u91cf\uff08\u5982\u4ec5 QA \u53ef\u89c1\uff09\u3001\u6309\u7279\u5b9a\u4eba\u7fa4\u5c5e\u6027\u653e\u91cf\uff08\u5982\u4ec5\u67d0\u4e2a\u57ce\u5e02\u7684\u7528\u6237\u53ef\u89c1\uff09\u4ea6\u6216\u662f\u6309\u7528\u6237\u767e\u5206\u6bd4\u653e\u91cf\u3002",date:"2023-04-21T00:00:00.000Z",formattedDate:"April 21, 2023",tags:[],readingTime:5.015,hasTruncateMarker:!1,authors:[],frontMatter:{slug:"FeatureProbe rollout percentage",title:"\u5982\u4f55\u6309\u767e\u5206\u6bd4\u5c06\u529f\u80fd\u7070\u5ea6\u653e\u91cf"},prevItem:{title:"\u5b9e\u8df5\u5206\u4eab\uff1a\u6253\u9020\u6781\u5177\u9ad8\u6269\u5c55\u6027\u7684JavaScript SDK",permalink:"/FeatureProbe/blog/FeatureProbe JS SDK"},nextItem:{title:"\u4ece\u6570\u636e\u4e2d\u53d1\u73b0\u771f\u76f8\uff0c\u8d1d\u53f6\u65af\u65b9\u6cd5\u4e3a\u4f60\u7684AB\u5b9e\u9a8c\u52a0\u901f\u4f18\u5316",permalink:"/FeatureProbe/blog/FeatureProbe bayesian"}},u={authorsImageUrls:[]},i=[{value:"\u90a3\u4e48\u5728 FeatureProbe \u4e0a\u8981\u5982\u4f55\u5b9e\u73b0\u767e\u5206\u6bd4\u653e\u91cf\uff1f",id:"\u90a3\u4e48\u5728-featureprobe-\u4e0a\u8981\u5982\u4f55\u5b9e\u73b0\u767e\u5206\u6bd4\u653e\u91cf",level:2},{value:"\u6b65\u9aa4\u4e00\uff1a\u521b\u5efa\u4e00\u4e2a\u7279\u6027\u5f00\u5173",id:"\u6b65\u9aa4\u4e00\u521b\u5efa\u4e00\u4e2a\u7279\u6027\u5f00\u5173",level:2},{value:"\u6b65\u9aa4\u4e8c\uff1a\u5c06 SDK \u63a5\u5165\u5e94\u7528\u7a0b\u5e8f",id:"\u6b65\u9aa4\u4e8c\u5c06-sdk-\u63a5\u5165\u5e94\u7528\u7a0b\u5e8f",level:2},{value:"1\u3001\u9009\u62e9\u6240\u4f7f\u7528\u7684 SDK",id:"1\u9009\u62e9\u6240\u4f7f\u7528\u7684-sdk",level:4},{value:"2\u3001\u6309\u6b65\u9aa4\u8bbe\u7f6e\u5e94\u7528\u7a0b\u5e8f",id:"2\u6309\u6b65\u9aa4\u8bbe\u7f6e\u5e94\u7528\u7a0b\u5e8f",level:4},{value:"\u6b65\u9aa4\u4e09\uff1a\u6309\u767e\u5206\u6bd4\u653e\u91cf\u53d1\u5e03\u5f00\u5173",id:"\u6b65\u9aa4\u4e09\u6309\u767e\u5206\u6bd4\u653e\u91cf\u53d1\u5e03\u5f00\u5173",level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],c={toc:i};function s(t){let{components:e,...r}=t;return(0,l.kt)("wrapper",(0,a.Z)({},c,r,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u5f53\u6211\u4eec\u53d1\u5e03\u65b0\u529f\u80fd\u65f6\uff0c\u9700\u8981\u5c3d\u53ef\u80fd\u964d\u4f4e\u56e0\u65b0\u529f\u80fd\u53d1\u5e03\u6240\u5bfc\u81f4\u7684\u7ebf\u4e0a\u98ce\u9669\uff0c\u901a\u5e38\u4f1a\u91c7\u53d6\u7070\u5ea6\u653e\u91cf\u7684\u65b9\u5f0f\u5c06\u65b0\u529f\u80fd\u9010\u6b65\u53d1\u5e03\u7ed9\u7528\u6237\u3002\u5728\u5177\u4f53\u5b9e\u65bd\u7070\u5ea6\u653e\u91cf\u65f6\uff0c\u6211\u4eec\u53ef\u4ee5\u6839\u636e\u4e1a\u52a1\u9700\u6c42\u9009\u62e9\u76f8\u5e94\u7684\u653e\u91cf\u89c4\u5219\uff0c\u5e38\u89c1\u5982\u6309\u767d\u540d\u5355\u653e\u91cf\uff08\u5982\u4ec5 QA \u53ef\u89c1\uff09\u3001\u6309\u7279\u5b9a\u4eba\u7fa4\u5c5e\u6027\u653e\u91cf\uff08\u5982\u4ec5\u67d0\u4e2a\u57ce\u5e02\u7684\u7528\u6237\u53ef\u89c1\uff09\u4ea6\u6216\u662f\u6309\u7528\u6237\u767e\u5206\u6bd4\u653e\u91cf\u3002  "),(0,l.kt)("p",null,"\u5f53\u6211\u4eec\u9009\u62e9\u5c06\u529f\u80fd\u4ee5\u7528\u6237\u767e\u5206\u6bd4\u653e\u91cf\u65f6\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u4f1a\u5148\u5c06\u529f\u53d1\u5e03\u7ed910% \u5185\u90e8\u7528\u6237\uff0c\u6b64\u65f6\u5373\u4fbf\u51fa\u73b0\u95ee\u9898\u5f71\u54cd\u4e5f\u76f8\u5bf9\u53ef\u63a7\uff0c\u5982\u89c2\u5bdf\u6ca1\u6709\u95ee\u9898\u540e\u9010\u6b65\u6269\u5927\u9700\u8981\u653e\u91cf\u7684\u7528\u6237\u767e\u5206\u6bd4\uff0c\u5b9e\u73b0\u4ece\u5c11\u91cf\u5230\u5168\u91cf\u5e73\u6ed1\u8fc7\u6e21\u7684\u4e0a\u7ebf\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_LChx6glCtd8a3xF643az",alt:null})),(0,l.kt)("h2",{id:"\u90a3\u4e48\u5728-featureprobe-\u4e0a\u8981\u5982\u4f55\u5b9e\u73b0\u767e\u5206\u6bd4\u653e\u91cf"},"\u90a3\u4e48\u5728 FeatureProbe \u4e0a\u8981\u5982\u4f55\u5b9e\u73b0\u767e\u5206\u6bd4\u653e\u91cf\uff1f"),(0,l.kt)("p",null,"\u4e0b\u9762\u5c06\u901a\u8fc7\u4e00\u4e2a\u5b9e\u9645\u7684\u4f8b\u5b50\u4ecb\u7ecd\u5982\u4f55\u901a\u8fc7 FeatureProbe \u5b9e\u73b0\u6309\u767e\u5206\u6bd4\u653e\u91cf\u53d1\u5e03\u4e00\u4e2a\u65b0\u529f\u80fd\u3002"),(0,l.kt)("h2",{id:"\u6b65\u9aa4\u4e00\u521b\u5efa\u4e00\u4e2a\u7279\u6027\u5f00\u5173"},"\u6b65\u9aa4\u4e00\uff1a\u521b\u5efa\u4e00\u4e2a\u7279\u6027\u5f00\u5173"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_mlYUpBC6rIz2W23I5YLb",alt:null})),(0,l.kt)("p",null,"\u63a5\u7740\uff0c\u914d\u7f6e\u5f00\u5173\u767e\u5206\u6bd4\u4fe1\u606f\u3002\u4ee5\u6536\u85cf\u529f\u80fd\u767e\u5206\u6bd4\u53d1\u5e03\u4e3a\u4f8b\uff0c\u8bbe\u7f6e ",(0,l.kt)("strong",{parentName:"p"},"10%")," \xa0\u7684\u7528\u6237\u53ef\u7528\u6536\u85cf\u529f\u80fd\uff0c\u800c\u53e6\u5916 ",(0,l.kt)("strong",{parentName:"p"},"90%")," \u7684\u7528\u6237\u65e0\u6cd5\u4f7f\u7528\u6536\u85cf\u529f\u80fd\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_12weTSsUB7lSY2Xl1pVA",alt:null})),(0,l.kt)("h2",{id:"\u6b65\u9aa4\u4e8c\u5c06-sdk-\u63a5\u5165\u5e94\u7528\u7a0b\u5e8f"},"\u6b65\u9aa4\u4e8c\uff1a\u5c06 SDK \u63a5\u5165\u5e94\u7528\u7a0b\u5e8f"),(0,l.kt)("p",null,"\u63a5\u4e0b\u6765\uff0c\u5c06 FeatureProbe\xa0SDK \u63a5\u5165\u5e94\u7528\u7a0b\u5e8f\u3002FeatureProbe \u63d0\u4f9b\u5b8c\u6574\u6e05\u6670\u7684\u63a5\u5165\u5f15\u5bfc\uff0c\u53ea\u9700\u6309\u7167\u6b65\u9aa4\u5373\u53ef\u5feb\u901f\u5b8c\u6210 SDK \u63a5\u5165\u3002"),(0,l.kt)("h4",{id:"1\u9009\u62e9\u6240\u4f7f\u7528\u7684-sdk"},"1\u3001\u9009\u62e9\u6240\u4f7f\u7528\u7684 SDK"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_PZBwe7nstJZ6n1emnsvA",alt:null})),(0,l.kt)("h4",{id:"2\u6309\u6b65\u9aa4\u8bbe\u7f6e\u5e94\u7528\u7a0b\u5e8f"},"2\u3001\u6309\u6b65\u9aa4\u8bbe\u7f6e\u5e94\u7528\u7a0b\u5e8f"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_yN6itAwx6g7CViGeQWUt",alt:null})),(0,l.kt)("p",null,"3\u3001\u6d4b\u8bd5\u5e94\u7528\u7a0b\u5e8f SDK\u63a5\u5165\u60c5\u51b5"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_3XVEF37xWgu4SlDwshgi",alt:null})),(0,l.kt)("h2",{id:"\u6b65\u9aa4\u4e09\u6309\u767e\u5206\u6bd4\u653e\u91cf\u53d1\u5e03\u5f00\u5173"},"\u6b65\u9aa4\u4e09\uff1a\u6309\u767e\u5206\u6bd4\u653e\u91cf\u53d1\u5e03\u5f00\u5173"),(0,l.kt)("p",null,"\u5f00\u5173\u4fe1\u606f\u914d\u7f6e\u548c SDK \u63a5\u5165\u90fd\u5b8c\u6210\u540e\uff0c\u70b9\u51fb\u53d1\u5e03\u6309\u94ae\u5e76\u786e\u8ba4\u53d1\u5e03\u3002\u8fd9\u5c06\u4f1a\u5c06\u6536\u85cf\u529f\u80fd\u53d1\u5e03\u7ed9\u7528\u6237\uff0c\u4f46\u53ea\u670910%\u7684\u7528\u6237\u53ef\u4ee5\u4f7f\u7528\u6536\u85cf\u529f\u80fd\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_gXXek8KCPjtkCuZsY7Ld",alt:null})),(0,l.kt)("p",null,"\u5982\u679c\u5e0c\u671b\u9010\u6b65\u6269\u5927\u7070\u5ea6\u8303\u56f4\uff0c\u53ef\u4ee5\u5728\u5f00\u5173\u89c4\u5219\u4e2d\u914d\u7f6e\u767e\u5206\u6bd4\u6bd4\u4f8b\u3002"),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_giz5Hub86igqgQAiPuaY",alt:null})),(0,l.kt)("p",null,"\u5927\u90e8\u5206\u60c5\u51b5\u4e0b\uff0c\u6211\u4eec\u5e0c\u671b\u5728\u4e00\u4e2a\u529f\u80fd\u7684\u7070\u5ea6\u653e\u91cf\u8fc7\u7a0b\u4e2d\uff0c\u67d0\u4e2a\u7279\u5b9a\u7528\u6237\u4e00\u65e6\u8fdb\u5165\u4e86\u7070\u5ea6\u653e\u91cf\u7ec4\uff0c\u5728\u7070\u5ea6\u6bd4\u4f8b\u4e0d\u51cf\u5c11\u7684\u60c5\u51b5\u4e0b\uff0c\u603b\u662f\u8fdb\u5165\u7070\u5ea6\u7ec4\u3002\u4e0d\u5e0c\u671b\u7528\u6237\u56e0\u4e3a\u5237\u65b0\u9875\u9762\u3001\u91cd\u65b0\u6253\u5f00APP\u3001\u8bf7\u6c42\u88ab\u5206\u914d\u5230\u53e6\u4e00\u4e2a\u670d\u52a1\u7aef\u5b9e\u4f8b\u7b49\u539f\u56e0\uff0c\u4e00\u4f1a\u770b\u5230\u65b0\u529f\u80fd\uff0c\u4e00\u4f1a\u770b\u4e0d\u5230\u65b0\u529f\u80fd\uff0c\u4ece\u800c\u611f\u5230\u8ff7\u60d1\u3002\u8981\u8fbe\u5230\u7528\u6237\u7a33\u5b9a\u8fdb\u5165\u7070\u5ea6\u7ec4\uff0c\u53ea\u9700\u8981\u5728\u4e0a\u8ff0\u4ee3\u7801\u7b2c\u4e09\u6b65\u521b\u5efa User \u65f6\u6307\u5b9astableRollout \u5373\u53ef\uff0c\u5177\u4f53\u4f7f\u7528\u8be6\u60c5\u89c1\uff1a",(0,l.kt)("a",{parentName:"p",href:"https://docs.featureprobe.io/zh-CN/tutorials/rollout_tutorial/stable_rollout_tutorial"},"https://docs.featureprobe.io/zh-CN/tutorials/rollout_tutorial/stable_rollout_tutorial")),(0,l.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,l.kt)("p",null,"\u7070\u5ea6\u6309\u767e\u5206\u6bd4\u653e\u91cf\u662f\u4e00\u79cd\u8f6f\u4ef6\u5f00\u53d1\u4e2d\u5e38\u7528\u7684\u529f\u80fd\u53d1\u5e03\u65b9\u6cd5\uff0c\u5b83\u53ef\u4ee5\u5e2e\u52a9\u63d0\u9ad8\u8f6f\u4ef6\u53ef\u9760\u6027\uff0c\u63d0\u9ad8\u7528\u6237\u4f53\u9a8c\uff0c\u5728\u5b9e\u65bd\u65f6\u4e5f\u9700\u8981\u6ce8\u610f\u51e0\u4e2a\u65b9\u9762\uff1a"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"1\u3001\u786e\u5b9a\u653e\u91cf\u76ee\u6807"),"\uff1a\u9996\u5148\u9700\u8981\u786e\u5b9a\u653e\u91cf\u7684\u76ee\u6807\uff0c\u4f8b\u5982\u589e\u52a0\u591a\u5c11\u767e\u5206\u6bd4\u7684\u6570\u636e\u91cf\u3002\u8fd9\u4e2a\u76ee\u6807\u9700\u8981\u6839\u636e\u5b9e\u9645\u60c5\u51b5\u8fdb\u884c\u5236\u5b9a\uff0c\u4f8b\u5982\u9700\u8981\u8003\u8651\u6570\u636e\u91cf\u7684\u5927\u5c0f\u3001\u8ba1\u7b97\u8d44\u6e90\u7684\u9650\u5236\u7b49\u56e0\u7d20\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"2\u3001\u786e\u5b9a\u653e\u91cf\u89c4\u5219"),"\uff1a\u4f60\u9700\u8981\u786e\u5b9a\u5728\u653e\u91cf\u8fc7\u7a0b\u4e2d\uff0c\u54ea\u4e9b\u529f\u80fd\u4f1a\u88ab\u542f\u7528\uff0c\u54ea\u4e9b\u529f\u80fd\u4f1a\u88ab\u7981\u7528\u3002\u4f60\u53ef\u4ee5\u6839\u636e\u5f00\u53d1\u8fdb\u5ea6\u3001\u6d4b\u8bd5\u7ed3\u679c\u548c\u5e02\u573a\u9700\u6c42\u7b49\u56e0\u7d20\u6765\u786e\u5b9a\u653e\u91cf\u89c4\u5219\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"3\u3001\u76d1\u63a7\u653e\u91cf\u8fc7\u7a0b"),"\uff1a\u5728\u5b9e\u65bd\u653e\u91cf\u64cd\u4f5c\u65f6\uff0c\u9700\u8981\u76d1\u63a7\u653e\u91cf\u8fc7\u7a0b\uff0c\u4ee5\u786e\u4fdd\u653e\u91cf\u7ed3\u679c\u7684\u7a33\u5b9a\u6027\u548c\u53ef\u9760\u6027\u3002\u5982\u679c\u51fa\u73b0\u5f02\u5e38\u60c5\u51b5\uff0c\u9700\u8981\u53ca\u65f6\u91c7\u53d6\u63aa\u65bd\u8fdb\u884c\u8c03\u6574\u3002"),(0,l.kt)("p",null,"\u82e5\u8981\u4e86\u89e3\u6709\u5173FeatureProbe \u7070\u5ea6\u53d1\u5e03\u7684\u66f4\u591a\u4fe1\u606f\uff0c\u8bf7\u67e5\u770b\u5176\u5b98\u65b9\u6587\u6863\u4e2d\u7684\u6559\u7a0b\u3002\u8be5\u6559\u7a0b\u53ef\u4ee5\u63d0\u4f9b\u5173\u4e8e\u5982\u4f55\u8fdb\u884c\u7070\u5ea6\u53d1\u5e03\u7684\u8be6\u7ec6\u8bf4\u660e\u3002\u6587\u6863\u4e2d\u8fd8\u5305\u62ec\u5176\u4ed6\u76f8\u5173\u4e3b\u9898\u7684\u4fe1\u606f\uff0c\u4f8b\u5982\u5982\u4f55\u8fdb\u884c\u670d\u52a1\u964d\u7ea7\u548c\u6307\u6807\u5206\u6790\u7b49\u3002\u8bf7\u8bbf\u95ee\u4ee5\u4e0b\u94fe\u63a5\u4ee5\u67e5\u770b\u8be5\u6587\u6863\uff1a",(0,l.kt)("em",{parentName:"p"},(0,l.kt)("a",{parentName:"em",href:"https://docs.featureprobe.io/zh-CN/tutorials/rollout_tutorial/"},"https://docs.featureprobe.io/zh-CN/tutorials/rollout_tutorial/"))))}s.isMDXComponent=!0}}]);