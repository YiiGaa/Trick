"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[116],{8491:(t,e,n)=>{n.d(e,{BN:()=>R,Ej:()=>q,UU:()=>k,__:()=>L,cY:()=>T,ll:()=>b,rD:()=>C});var i=n(7193),o=n(5361),r=n(6635);function c(t){const e=(0,r.L9)(t);let n=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const c=(0,r.sb)(t),l=c?t.offsetWidth:n,s=c?t.offsetHeight:o,f=(0,i.LI)(n)!==l||(0,i.LI)(o)!==s;return f&&(n=l,o=s),{width:n,height:o,$:f}}function l(t){return(0,r.vq)(t)?t:t.contextElement}function s(t){const e=l(t);if(!(0,r.sb)(e))return(0,i.Jx)(1);const n=e.getBoundingClientRect(),{width:o,height:s,$:f}=c(e);let u=(f?(0,i.LI)(n.width):n.width)/o,h=(f?(0,i.LI)(n.height):n.height)/s;return u&&Number.isFinite(u)||(u=1),h&&Number.isFinite(h)||(h=1),{x:u,y:h}}const f=(0,i.Jx)(0);function u(t){const e=(0,r.zk)(t);return(0,r.Tc)()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:f}function h(t,e,n,o){void 0===e&&(e=!1),void 0===n&&(n=!1);const c=t.getBoundingClientRect(),f=l(t);let h=(0,i.Jx)(1);e&&(o?(0,r.vq)(o)&&(h=s(o)):h=s(t));const d=function(t,e,n){return void 0===e&&(e=!1),!(!n||e&&n!==(0,r.zk)(t))&&e}(f,n,o)?u(f):(0,i.Jx)(0);let a=(c.left+d.x)/h.x,g=(c.top+d.y)/h.y,p=c.width/h.x,x=c.height/h.y;if(f){const t=(0,r.zk)(f),e=o&&(0,r.vq)(o)?(0,r.zk)(o):o;let n=t,i=(0,r._m)(n);for(;i&&o&&e!==n;){const t=s(i),e=i.getBoundingClientRect(),o=(0,r.L9)(i),c=e.left+(i.clientLeft+parseFloat(o.paddingLeft))*t.x,l=e.top+(i.clientTop+parseFloat(o.paddingTop))*t.y;a*=t.x,g*=t.y,p*=t.x,x*=t.y,a+=c,g+=l,n=(0,r.zk)(i),i=(0,r._m)(n)}}return(0,i.B1)({width:p,height:x,x:a,y:g})}function d(t,e){const n=(0,r.CP)(t).scrollLeft;return e?e.left+n:h((0,r.ep)(t)).left+n}function a(t,e,n){void 0===n&&(n=!1);const i=t.getBoundingClientRect();return{x:i.left+e.scrollLeft-(n?0:d(t,i)),y:i.top+e.scrollTop}}function g(t,e,n){let o;if("viewport"===e)o=function(t,e){const n=(0,r.zk)(t),i=(0,r.ep)(t),o=n.visualViewport;let c=i.clientWidth,l=i.clientHeight,s=0,f=0;if(o){c=o.width,l=o.height;const t=(0,r.Tc)();(!t||t&&"fixed"===e)&&(s=o.offsetLeft,f=o.offsetTop)}return{width:c,height:l,x:s,y:f}}(t,n);else if("document"===e)o=function(t){const e=(0,r.ep)(t),n=(0,r.CP)(t),o=t.ownerDocument.body,c=(0,i.T9)(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),l=(0,i.T9)(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let s=-n.scrollLeft+d(t);const f=-n.scrollTop;return"rtl"===(0,r.L9)(o).direction&&(s+=(0,i.T9)(e.clientWidth,o.clientWidth)-c),{width:c,height:l,x:s,y:f}}((0,r.ep)(t));else if((0,r.vq)(e))o=function(t,e){const n=h(t,!0,"fixed"===e),o=n.top+t.clientTop,c=n.left+t.clientLeft,l=(0,r.sb)(t)?s(t):(0,i.Jx)(1);return{width:t.clientWidth*l.x,height:t.clientHeight*l.y,x:c*l.x,y:o*l.y}}(e,n);else{const n=u(t);o={x:e.x-n.x,y:e.y-n.y,width:e.width,height:e.height}}return(0,i.B1)(o)}function p(t,e){const n=(0,r.$4)(t);return!(n===e||!(0,r.vq)(n)||(0,r.eu)(n))&&("fixed"===(0,r.L9)(n).position||p(n,e))}function x(t,e,n){const o=(0,r.sb)(e),c=(0,r.ep)(e),l="fixed"===n,s=h(t,!0,l,e);let f={scrollLeft:0,scrollTop:0};const u=(0,i.Jx)(0);if(o||!o&&!l)if(("body"!==(0,r.mq)(e)||(0,r.ZU)(c))&&(f=(0,r.CP)(e)),o){const t=h(e,!0,l,e);u.x=t.x+e.clientLeft,u.y=t.y+e.clientTop}else c&&(u.x=d(c));const g=!c||o||l?(0,i.Jx)(0):a(c,f);return{x:s.left+f.scrollLeft-u.x-g.x,y:s.top+f.scrollTop-u.y-g.y,width:s.width,height:s.height}}function y(t){return"static"===(0,r.L9)(t).position}function v(t,e){if(!(0,r.sb)(t)||"fixed"===(0,r.L9)(t).position)return null;if(e)return e(t);let n=t.offsetParent;return(0,r.ep)(t)===n&&(n=n.ownerDocument.body),n}function m(t,e){const n=(0,r.zk)(t);if((0,r.Tf)(t))return n;if(!(0,r.sb)(t)){let e=(0,r.$4)(t);for(;e&&!(0,r.eu)(e);){if((0,r.vq)(e)&&!y(e))return e;e=(0,r.$4)(e)}return n}let i=v(t,e);for(;i&&(0,r.Lv)(i)&&y(i);)i=v(i,e);return i&&(0,r.eu)(i)&&y(i)&&!(0,r.sQ)(i)?n:i||(0,r.gJ)(t)||n}const w={convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{elements:e,rect:n,offsetParent:o,strategy:c}=t;const l="fixed"===c,f=(0,r.ep)(o),u=!!e&&(0,r.Tf)(e.floating);if(o===f||u&&l)return n;let d={scrollLeft:0,scrollTop:0},g=(0,i.Jx)(1);const p=(0,i.Jx)(0),x=(0,r.sb)(o);if((x||!x&&!l)&&(("body"!==(0,r.mq)(o)||(0,r.ZU)(f))&&(d=(0,r.CP)(o)),(0,r.sb)(o))){const t=h(o);g=s(o),p.x=t.x+o.clientLeft,p.y=t.y+o.clientTop}const y=!f||x||l?(0,i.Jx)(0):a(f,d,!0);return{width:n.width*g.x,height:n.height*g.y,x:n.x*g.x-d.scrollLeft*g.x+p.x+y.x,y:n.y*g.y-d.scrollTop*g.y+p.y+y.y}},getDocumentElement:r.ep,getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:o,strategy:c}=t;const l=[..."clippingAncestors"===n?(0,r.Tf)(e)?[]:function(t,e){const n=e.get(t);if(n)return n;let i=(0,r.v9)(t,[],!1).filter((t=>(0,r.vq)(t)&&"body"!==(0,r.mq)(t))),o=null;const c="fixed"===(0,r.L9)(t).position;let l=c?(0,r.$4)(t):t;for(;(0,r.vq)(l)&&!(0,r.eu)(l);){const e=(0,r.L9)(l),n=(0,r.sQ)(l);n||"fixed"!==e.position||(o=null),(c?!n&&!o:!n&&"static"===e.position&&o&&["absolute","fixed"].includes(o.position)||(0,r.ZU)(l)&&!n&&p(t,l))?i=i.filter((t=>t!==l)):o=e,l=(0,r.$4)(l)}return e.set(t,i),i}(e,this._c):[].concat(n),o],s=l[0],f=l.reduce(((t,n)=>{const o=g(e,n,c);return t.top=(0,i.T9)(o.top,t.top),t.right=(0,i.jk)(o.right,t.right),t.bottom=(0,i.jk)(o.bottom,t.bottom),t.left=(0,i.T9)(o.left,t.left),t}),g(e,s,c));return{width:f.right-f.left,height:f.bottom-f.top,x:f.left,y:f.top}},getOffsetParent:m,getElementRects:async function(t){const e=this.getOffsetParent||m,n=this.getDimensions,i=await n(t.floating);return{reference:x(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(t){return Array.from(t.getClientRects())},getDimensions:function(t){const{width:e,height:n}=c(t);return{width:e,height:n}},getScale:s,isElement:r.vq,isRTL:function(t){return"rtl"===(0,r.L9)(t).direction}};function b(t,e,n,o){void 0===o&&(o={});const{ancestorScroll:c=!0,ancestorResize:s=!0,elementResize:f="function"==typeof ResizeObserver,layoutShift:u="function"==typeof IntersectionObserver,animationFrame:d=!1}=o,a=l(t),g=c||s?[...a?(0,r.v9)(a):[],...(0,r.v9)(e)]:[];g.forEach((t=>{c&&t.addEventListener("scroll",n,{passive:!0}),s&&t.addEventListener("resize",n)}));const p=a&&u?function(t,e){let n,o=null;const c=(0,r.ep)(t);function l(){var t;clearTimeout(n),null==(t=o)||t.disconnect(),o=null}return function r(s,f){void 0===s&&(s=!1),void 0===f&&(f=1),l();const{left:u,top:h,width:d,height:a}=t.getBoundingClientRect();if(s||e(),!d||!a)return;const g={rootMargin:-(0,i.RI)(h)+"px "+-(0,i.RI)(c.clientWidth-(u+d))+"px "+-(0,i.RI)(c.clientHeight-(h+a))+"px "+-(0,i.RI)(u)+"px",threshold:(0,i.T9)(0,(0,i.jk)(1,f))||1};let p=!0;function x(t){const e=t[0].intersectionRatio;if(e!==f){if(!p)return r();e?r(!1,e):n=setTimeout((()=>{r(!1,1e-7)}),1e3)}p=!1}try{o=new IntersectionObserver(x,{...g,root:c.ownerDocument})}catch(t){o=new IntersectionObserver(x,g)}o.observe(t)}(!0),l}(a,n):null;let x,y=-1,v=null;f&&(v=new ResizeObserver((t=>{let[i]=t;i&&i.target===a&&v&&(v.unobserve(e),cancelAnimationFrame(y),y=requestAnimationFrame((()=>{var t;null==(t=v)||t.observe(e)}))),n()})),a&&!d&&v.observe(a),v.observe(e));let m=d?h(t):null;return d&&function e(){const i=h(t);!m||i.x===m.x&&i.y===m.y&&i.width===m.width&&i.height===m.height||n();m=i,x=requestAnimationFrame(e)}(),n(),()=>{var t;g.forEach((t=>{c&&t.removeEventListener("scroll",n),s&&t.removeEventListener("resize",n)})),null==p||p(),null==(t=v)||t.disconnect(),v=null,d&&cancelAnimationFrame(x)}}const L=o.__,T=o.cY,R=o.BN,k=o.UU,q=o.Ej,C=(t,e,n)=>{const i=new Map,r={platform:w,...n},c={...r.platform,_c:i};return(0,o.rD)(t,e,{...r,platform:c})}}}]);