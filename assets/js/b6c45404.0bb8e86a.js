"use strict";(self.webpackChunkfeature_probe_docs=self.webpackChunkfeature_probe_docs||[]).push([[3417],{3905:(e,t,o)=>{o.d(t,{Zo:()=>c,kt:()=>u});var r=o(7294);function l(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function n(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function a(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?n(Object(o),!0).forEach((function(t){l(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function i(e,t){if(null==e)return{};var o,r,l=function(e,t){if(null==e)return{};var o,r,l={},n=Object.keys(e);for(r=0;r<n.length;r++)o=n[r],t.indexOf(o)>=0||(l[o]=e[o]);return l}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)o=n[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(l[o]=e[o])}return l}var g=r.createContext({}),s=function(e){var t=r.useContext(g),o=t;return e&&(o="function"==typeof e?e(t):a(a({},t),e)),o},c=function(e){var t=s(e.components);return r.createElement(g.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var o=e.components,l=e.mdxType,n=e.originalType,g=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),p=s(o),u=l,h=p["".concat(g,".").concat(u)]||p[u]||d[u]||n;return o?r.createElement(h,a(a({ref:t},c),{},{components:o})):r.createElement(h,a({ref:t},c))}));function u(e,t){var o=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var n=o.length,a=new Array(n);a[0]=p;var i={};for(var g in t)hasOwnProperty.call(t,g)&&(i[g]=t[g]);i.originalType=e,i.mdxType="string"==typeof e?e:l,a[1]=i;for(var s=2;s<n;s++)a[s]=o[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,o)}p.displayName="MDXCreateElement"},1228:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>g,contentTitle:()=>a,default:()=>d,frontMatter:()=>n,metadata:()=>i,toc:()=>s});var r=o(7462),l=(o(7294),o(3905));const n={sidebar_position:2},a="How to use toggle",i={unversionedId:"how-to/platform/how-to-create-toggle",id:"how-to/platform/how-to-create-toggle",title:"How to use toggle",description:"The FeatureProbe platform provides a powerful feature toggle management module. Feature toggles are used for feature placement by selecting target traffic and gradually releasing data through continuous observation until full volume is deployed.",source:"@site/docs/how-to/platform/how-to-create-toggle.md",sourceDirName:"how-to/platform",slug:"/how-to/platform/how-to-create-toggle",permalink:"/FeatureProbe/how-to/platform/how-to-create-toggle",draft:!1,editUrl:"https://github.com/FeatureProbe/FeatureProbe/blob/main/docs/docs/how-to/platform/how-to-create-toggle.md",tags:[],version:"current",lastUpdatedAt:1675393925,formattedLastUpdatedAt:"Feb 3, 2023",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"defaultSidebar",previous:{title:"How to use project and environment",permalink:"/FeatureProbe/how-to/platform/project-and-environment"},next:{title:"How to use toggle detail",permalink:"/FeatureProbe/how-to/platform/toggle-detail"}},g={},s=[{value:"Toggle Dashboard",id:"toggle-dashboard",level:2},{value:"Adding toggle",id:"adding-toggle",level:2},{value:"Edit the toggle",id:"edit-the-toggle",level:2},{value:"Archive and restore toggle",id:"archive-and-restore-toggle",level:2}],c={toc:s};function d(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"how-to-use-toggle"},"How to use toggle"),(0,l.kt)("p",null,"The FeatureProbe platform provides a powerful feature toggle management module. Feature toggles are used for feature placement by selecting target traffic and gradually releasing data through continuous observation until full volume is deployed."),(0,l.kt)("h2",{id:"toggle-dashboard"},"Toggle Dashboard"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"toggles screenshot",src:o(3697).Z,width:"2870",height:"1412"})),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"default display of My First Project's online environment toggle list information"),(0,l.kt)("li",{parentName:"ol"},"the left navigation bar provides a quick entry to toggle environments (click the drop-down icon to the right of the environment)"),(0,l.kt)("li",{parentName:"ol"},'filter conditions allow us to quickly filter the ttoggles by "evaluated", "enabled/disabled", "tags", "name/key/description"')),(0,l.kt)("h2",{id:"adding-toggle"},"Adding toggle"),(0,l.kt)("p",null,"After the toggle is successfully created, it will be synchronized to all environments under the project."),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"create toggle screenshot",src:o(1164).Z,width:"1622",height:"1630"})),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"fill in the toggle name")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"fill in the key of the toggle (a unique identifier for the toggle, unique under the same project, not editable once created)")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"fill in the description information")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"select the label (no initial value, you can create it yourself)")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"select the sdk type")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"select the return type of the toggle (4 types: Boolean, String, Number, JSON), which cannot be edited once created")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"Fill in the Variations"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Default two variations(at least 2, can be increased or decreased)"))),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},'fill in the "When toggle is disabled" (the return value when the toggle is disabled), the default synchronization variation1 data, can be changed')),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},'Select "Is this a permanent toggle?" (The default period for a non-permanent toggle is 30 days, and we will remind you to clear it if it exceeds 30 days) Is this a permanent toggle?')),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"Click the Create button to complete the creation of the toggle"))),(0,l.kt)("h2",{id:"edit-the-toggle"},"Edit the toggle"),(0,l.kt)("p",null,"After successful editing, it will take effect in all environments under the entire project."),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"edit toggle screenshot",src:o(2584).Z,width:"1614",height:"1422"})),(0,l.kt)("h2",{id:"archive-and-restore-toggle"},"Archive and restore toggle"),(0,l.kt)("p",null,(0,l.kt)("img",{alt:"archive toggle screenshot",src:o(5565).Z,width:"1792",height:"954"})),(0,l.kt)("p",null,"Archive toggle:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},'Click "Archive" to offline toggle at any time. After Archived, it cannot be edited or published\uff0cand this toggle will be displayed in the ',"[Archived toggle List]"),(0,l.kt)("li",{parentName:"ol"},'Click "View Archived toggles" to see all Archived toggles of the project. Click "Back" to return to the toggle being used online')),(0,l.kt)("p",null,"Restore toggle:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},'Click "Restore" to restore the toggle online. After restoration, the toggle will be displayed in the ',"[toggle List]")))}d.isMDXComponent=!0},5565:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/archived_toggle_en-0bf5509fcc3263ad9ae1d0d7a6649849.png"},1164:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/create_toggle_en-f2218d6b5c645c69cc153d1cf254d5e3.png"},2584:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/edit_toggle_en-bd33b5f648a2d35f5d9f52013fcae5c7.png"},3697:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/toggles_en-1f2519c996f1934d659226a4bf222827.png"}}]);