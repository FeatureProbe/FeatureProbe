"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[1622],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var i=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,i)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,i,n=function(e,t){if(null==e)return{};var a,i,n={},r=Object.keys(e);for(i=0;i<r.length;i++)a=r[i],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)a=r[i],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=i.createContext({}),c=function(e){var t=i.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=c(e.components);return i.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},u=i.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),u=c(a),d=n,h=u["".concat(s,".").concat(d)]||u[d]||m[d]||r;return a?i.createElement(h,l(l({ref:t},p),{},{components:a})):i.createElement(h,l({ref:t},p))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,l=new Array(r);l[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:n,l[1]=o;for(var c=2;c<r;c++)l[c]=a[c];return i.createElement.apply(null,l)}return i.createElement.apply(null,a)}u.displayName="MDXCreateElement"},4362:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var i=a(7462),n=(a(7294),a(3905));const r={sidebar_position:9},l="How to use analysis",o={unversionedId:"how-to/platform/Analysis",id:"how-to/platform/Analysis",title:"How to use analysis",description:"This module supports defining metric in the toggle, and viewing the metric analysis data corresponding to all groups in the toggle.",source:"@site/docs/how-to/platform/Analysis.md",sourceDirName:"how-to/platform",slug:"/how-to/platform/Analysis",permalink:"/FeatureProbe/how-to/platform/Analysis",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/docs/how-to/platform/Analysis.md",tags:[],version:"current",lastUpdatedAt:1677038235,formattedLastUpdatedAt:"Feb 22, 2023",sidebarPosition:9,frontMatter:{sidebar_position:9},sidebar:"defaultSidebar",previous:{title:"Open API Tokens",permalink:"/FeatureProbe/how-to/platform/token"},next:{title:"How to use Event tracker",permalink:"/FeatureProbe/how-to/platform/Event tracker"}},s={},c=[{value:"Define metrics",id:"define-metrics",level:2},{value:"&quot;Start iteration&quot; and view metrics analysis",id:"start-iteration-and-view-metrics-analysis",level:2},{value:"Start collecting data while publishing toggle release",id:"start-collecting-data-while-publishing-toggle-release",level:2}],p={toc:c};function m(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,i.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"how-to-use-analysis"},"How to use analysis"),(0,n.kt)("p",null,"This module supports defining metric in the toggle, and viewing the metric analysis data corresponding to all groups in the toggle."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"metric analysis screenshot",src:a(8991).Z,width:"2856",height:"1636"})),(0,n.kt)("h2",{id:"define-metrics"},"Define metrics"),(0,n.kt)("p",null,'"Metrics" supports 4 event types: custom conversion event, custom numeric event, page event, click event'),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Fill in the metric name")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Fill in the metric description")),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Select the event type (custom event, page event, click event)"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"Custom events"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},'Custom events need to choose "conversion" or "numeric" type.'),(0,n.kt)("li",{parentName:"ul"},"Fill in the event name"),(0,n.kt)("li",{parentName:"ul"},'Fill in "Measurement Unit" and "Winning Standard" (only for "numeric" type, it is required to fill in)'))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"page events"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"Fill in the URL of the target page (currently 4 match types are provided: simple match, exact match, substring match, regular expression match)"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"click event"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"Fill in the URL of the target page (currently 4 match types are provided: simple match, exact match, substring match, regular expression match)"),(0,n.kt)("li",{parentName:"ul"},"fill click target (input a CSS selector)"))))),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Click to save the metric information"))),(0,n.kt)("h2",{id:"start-iteration-and-view-metrics-analysis"},'"Start iteration" and view metrics analysis'),(0,n.kt)("p",null,"Once the Metrics are saved, you can Start iteration metrics analytics data."),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},'After clicking "Start iteration", the collection of metric analysis data can be started (at this time, you can see the sign of "Collection Data ")')),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},'After clicking "Stop iteration", the collection of metric data will stop. The collection of metric analysis data will end at the moment of "Stop iteration". After stopping, you can click "Start iteration" to collect analysis data.')),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("p",{parentName:"li"},"Graphical display of metric analysis data"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},'Table display: display the metric analysis information of all "variations", and the variation with the highest "winning probability" is the best solution.'),(0,n.kt)("li",{parentName:"ul"},'Probability distribution display: By default, the probability distribution of all "variations" is displayed, which can be filtered by the inverse selection operation at the bottom')))),(0,n.kt)("h2",{id:"start-collecting-data-while-publishing-toggle-release"},"Start collecting data while publishing toggle release"),(0,n.kt)("p",null,'In order to ensure the integrity of the metric analysis data, when the "metric information has been saved" and not in the "Collection Data", the function of "start data collecting" is provided when the toggle is published.'),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"publish metric screenshot",src:a(9815).Z,width:"846",height:"158"})),(0,n.kt)("p",null,'Note: When the metric analysis data is being analyzed, modifying the content in the toggle targeting other than "information such as name and description" may affect the accuracy of the metric analysis results.'))}m.isMDXComponent=!0},8991:(e,t,a)=>{a.d(t,{Z:()=>i});const i=a.p+"assets/images/metric_analysis_en-842423dc81c26268ef5d29d59bc5e47a.png"},9815:(e,t,a)=>{a.d(t,{Z:()=>i});const i=a.p+"assets/images/publish_metric_en-7d2034bb4c223ca8e56a47c7a4faab8e.png"}}]);