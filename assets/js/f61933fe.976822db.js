"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[5625],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=c(r),d=o,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||a;return r?n.createElement(f,l(l({ref:t},p),{},{components:r})):n.createElement(f,l({ref:t},p))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var c=2;c<a;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},9593:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const a={sidebar_position:7},l="Deploy a Cluster",i={unversionedId:"reference/deployment-cluster",id:"reference/deployment-cluster",title:"Deploy a Cluster",description:"This document describes how to deploy the FeatureProbe service in a multi-cluster manner.",source:"@site/docs/reference/deployment-cluster.md",sourceDirName:"reference",slug:"/reference/deployment-cluster",permalink:"/FeatureProbe/reference/deployment-cluster",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/docs/reference/deployment-cluster.md",tags:[],version:"current",lastUpdatedAt:1679370019,formattedLastUpdatedAt:"Mar 21, 2023",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"defaultSidebar",previous:{title:"Setup database",permalink:"/FeatureProbe/reference/database-setup"},next:{title:"Deployment Configuration",permalink:"/FeatureProbe/reference/deployment-configuration"}},s={},c=[{value:"Deployment topology",id:"deployment-topology",level:2},{value:"Multiple Environments",id:"multiple-environments",level:2}],p={toc:c};function u(e){let{components:t,...a}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"deploy-a-cluster"},"Deploy a Cluster"),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"This document describes how to deploy the FeatureProbe service in a multi-cluster manner.")),(0,o.kt)("h2",{id:"deployment-topology"},"Deployment topology"),(0,o.kt)("p",null,"In order to ensure the high availability of the overall service, we recommend the deployment topology as follows:"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"image-20220906181332418",src:r(2081).Z,width:"1704",height:"758"})),(0,o.kt)("p",null,"An independent FeatureProbe cluster consists of three parts:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Admin cluster"),(0,o.kt)("p",{parentName:"li"}," An Admin service consists of UI (Nginx) and API modules. The cluster can use ",(0,o.kt)("em",{parentName:"p"},"domain name")," or ",(0,o.kt)("em",{parentName:"p"},"VIP")," mode load balancing mechanism")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Server cluster"),(0,o.kt)("p",{parentName:"li"}," Relying on the API service, you need to access the API service in the Admin cluster under the same cluster. This service provides the SDK with toggle caculation and distribution capabilities, and it is recommended to provide external access in the form of ",(0,o.kt)("em",{parentName:"p"},"domain name"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Database cluster"),(0,o.kt)("p",{parentName:"li"}," It is recommended to use the one-master-multiple-slave cluster mode."))),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Network Policy")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Control the Admin cluster and database only for internal network access, and it is not recommended to expose it to the public network."),(0,o.kt)("li",{parentName:"ul"},"The server cluster needs to provide toggle caculation capabilities for the APP SDK and JS SDK, so it needs to be accessible on the public network. If you only use the Server SDK to access, it does not need to be exposed to the public network.")),(0,o.kt)("h2",{id:"multiple-environments"},"Multiple Environments"),(0,o.kt)("p",null,"FeatureProbe itself provides multi-environment support, and the data between different environments is logically isolated, so there is no need to deploy separate environments for different environments."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"For support for multiple environments and custom environments, please reference ",(0,o.kt)("a",{parentName:"p",href:"/how-to/platform/project-and-environment"},"How to use project and environment"))))}u.isMDXComponent=!0},2081:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/deploy-201cd46a4c9cd27bceec365dd8461e19.png"}}]);