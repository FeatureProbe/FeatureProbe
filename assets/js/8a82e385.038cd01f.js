"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[6382],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>h});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=o.createContext({}),p=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},d=function(e){var t=p(e.components);return o.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},s=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),s=p(n),h=r,u=s["".concat(c,".").concat(h)]||s[h]||m[h]||i;return n?o.createElement(u,a(a({ref:t},d),{},{components:n})):o.createElement(u,a({ref:t},d))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,a[1]=l;for(var p=2;p<i;p++)a[p]=n[p];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}s.displayName="MDXCreateElement"},7824:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var o=n(7462),r=(n(7294),n(3905));const i={sidebar_position:1},a="How to use project and environment",l={unversionedId:"how-to/platform/project-and-environment",id:"how-to/platform/project-and-environment",title:"How to use project and environment",description:"Project Management",source:"@site/docs/how-to/platform/project-and-environment.md",sourceDirName:"how-to/platform",slug:"/how-to/platform/project-and-environment",permalink:"/FeatureProbe/how-to/platform/project-and-environment",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/docs/how-to/platform/project-and-environment.md",tags:[],version:"current",lastUpdatedAt:1675406286,formattedLastUpdatedAt:"Feb 3, 2023",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"defaultSidebar",previous:{title:"Platform",permalink:"/FeatureProbe/category/platform"},next:{title:"How to use toggle",permalink:"/FeatureProbe/how-to/platform/how-to-create-toggle"}},c={},p=[{value:"Project Management",id:"project-management",level:2},{value:"Add project",id:"add-project",level:3},{value:"Adding an environment",id:"adding-an-environment",level:3},{value:"Edit project",id:"edit-project",level:3},{value:"Edit environment",id:"edit-environment",level:3},{value:"Offline and recovery environment",id:"offline-and-recovery-environment",level:3},{value:"Delete Item",id:"delete-item",level:3}],d={toc:p};function m(e){let{components:t,...i}=e;return(0,r.kt)("wrapper",(0,o.Z)({},d,i,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"how-to-use-project-and-environment"},"How to use project and environment"),(0,r.kt)("h2",{id:"project-management"},"Project Management"),(0,r.kt)("p",null,'Projects allow one FeatureProbe account to manage multiple different business goals. Generally a project corresponds to a system platform. For example, you can create a project called "Mobile Application" and another project called "Server Application". Each project has its own unique environment and corresponding functional toggles. You can create multiple environments in each project, all projects must have at least one environment\nThe system will have an initial project (My First Project) with 2 environments (test, online) each with its own SDK key to connect the FeatureProbe SDK to the specific environment.'),(0,r.kt)("h3",{id:"add-project"},"Add project"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"create project screenshot",src:n(1914).Z,width:"1748",height:"828"})),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},'Click "Projects" in the top menu to enter the project list page'),(0,r.kt)("li",{parentName:"ol"},"Click the Add Project button"),(0,r.kt)("li",{parentName:"ol"},"fill in the project name"),(0,r.kt)("li",{parentName:"ol"},"fill in the key (the project's unique identifier, once created, cannot be edited)"),(0,r.kt)("li",{parentName:"ol"},"Fill in the description"),(0,r.kt)("li",{parentName:"ol"},"Click the Create button to complete the creation of the project (once the project is created, it cannot be deleted. The newly created project will come with an online environment)"),(0,r.kt)("li",{parentName:"ol"},"Click the environment card under the project to go directly to the list of toggles for that environment under the project")),(0,r.kt)("h3",{id:"adding-an-environment"},"Adding an environment"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Click Add Environment"),(0,r.kt)("li",{parentName:"ol"},"Fill in the environment name"),(0,r.kt)("li",{parentName:"ol"},"fill in the key (the unique identifier of the environment, unique under the same project, once created, cannot be edited)"),(0,r.kt)("li",{parentName:"ol"},"Select an environment to copy (optional range: all existing environments under this project), and all toggles information of this environment will be copied to the new environment. (Toggle latest configuration content,toggle status, etc.)"),(0,r.kt)("li",{parentName:"ol"},"click the Create button to complete the creation of the environment (once the environment is created, it cannot be deleted)")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Note: After the new environment is created, it will share the list of toggles under the project (the template information of the toggles), and the configuration information of the toggles will need to be configured independently by entering the environment.")),(0,r.kt)("h3",{id:"edit-project"},"Edit project"),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"edit environment screenshot",src:n(9105).Z,width:"682",height:"548"})),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Click Edit Project Icon"),(0,r.kt)("li",{parentName:"ol"},"Edit the project information"),(0,r.kt)("li",{parentName:"ol"},"Click the Save button to finish editing the project")),(0,r.kt)("h3",{id:"edit-environment"},"Edit environment"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Click Edit Environment"),(0,r.kt)("li",{parentName:"ol"},"Only supports editing the environment name"),(0,r.kt)("li",{parentName:"ol"},"Click the Save button to finish editing the environment")),(0,r.kt)("h3",{id:"offline-and-recovery-environment"},"Offline and recovery environment"),(0,r.kt)("p",null,"! ",(0,r.kt)("a",{target:"_blank",href:n(5661).Z},"archived environment screenshot")),(0,r.kt)("p",null,"Archive environment:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},'Click "Archive environment" to offline environment at any time. After Archived,it cannot be edited\uff0cand the platform will not display the toggle configuration information corresponding to this environment (the toggle list page cannot be switched to this environment)'),(0,r.kt)("li",{parentName:"ol"},"When there is only one environment under the project, the environment cannot be Archived (if you want to Archive the last environment, you can directly delete the project)"),(0,r.kt)("li",{parentName:"ol"},'Click "View Archived environments" to see the Archived environments of the project (click the Archived environment card to not enter the toggle list page), and click "View active environments" to return to the online environment of the project')),(0,r.kt)("p",null,"Restore oenvironment:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},'Click "Restore environment" to restore the environment to online. After restoration, restore all toggles and toggle configurations in the environment (if some toggles are Archived, the Archived toggles and configurations will not be restored)')),(0,r.kt)("h3",{id:"delete-item"},"Delete Item"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},'Click "Delete Item" to delete the item (Note: the item can only be deleted after all switches are offline);'),(0,r.kt)("li",{parentName:"ol"},"After the item is deleted, it will disappear from the item list (unrecoverable);")))}m.isMDXComponent=!0},5661:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/files/archived_env_en-41211bf31694945fdaf34632474a366e.png"},1914:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/create_pro_env_en-1e8aa209db397faf49fb8b5247a63e85.png"},9105:(e,t,n)=>{n.d(t,{Z:()=>o});const o=n.p+"assets/images/edit_pro_env_en-04ec3667ef2e3df747f6bcbab4d70b8f.png"}}]);