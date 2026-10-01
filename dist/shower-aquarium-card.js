var We=globalThis,Ke=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),ao=new WeakMap,Ee=class{constructor(t,o,i){if(this._$cssResult$=!0,i!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o,o=this.t;if(Ke&&t===void 0){let i=o!==void 0&&o.length===1;i&&(t=ao.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ao.set(o,t))}return t}toString(){return this.cssText}},lo=e=>new Ee(typeof e=="string"?e:e+"",void 0,yt),bt=(e,...t)=>{let o=e.length===1?e[0]:t.reduce((i,r,s)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1],e[0]);return new Ee(o,e,yt)},co=(e,t)=>{if(Ke)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of t){let i=document.createElement("style"),r=We.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,e.appendChild(i)}},xt=Ke?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(let i of t.cssRules)o+=i.cssText;return lo(o)})(e):e;var{is:Tr,defineProperty:Er,getOwnPropertyDescriptor:Lr,getOwnPropertyNames:Fr,getOwnPropertySymbols:Rr,getPrototypeOf:Or}=Object,te=globalThis,ho=te.trustedTypes,Ir=ho?ho.emptyScript:"",Br=te.reactiveElementPolyfillSupport,Le=(e,t)=>e,wt={toAttribute(e,t){switch(t){case Boolean:e=e?Ir:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},uo=(e,t)=>!Tr(e,t),fo={attribute:!0,type:String,converter:wt,reflect:!1,useDefault:!1,hasChanged:uo};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),te.litPropertyMetadata??(te.litPropertyMetadata=new WeakMap);var K=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=fo){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(t,i,o);r!==void 0&&Er(this.prototype,t,r)}}static getPropertyDescriptor(t,o,i){let{get:r,set:s}=Lr(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:r,set(n){let a=r?.call(this);s?.call(this,n),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fo}static _$Ei(){if(this.hasOwnProperty(Le("elementProperties")))return;let t=Or(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Le("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Le("properties"))){let o=this.properties,i=[...Fr(o),...Rr(o)];for(let r of i)this.createProperty(r,o[r])}let t=this[Symbol.metadata];if(t!==null){let o=litPropertyMetadata.get(t);if(o!==void 0)for(let[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[o,i]of this.elementProperties){let r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let o=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let r of i)o.unshift(xt(r))}else t!==void 0&&o.push(xt(t));return o}static _$Eu(t,o){let i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,o=this.constructor.elementProperties;for(let i of o.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return co(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,o,i){this._$AK(t,i)}_$ET(t,o){let i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:wt).toAttribute(o,i.type);this._$Em=t,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,o){let i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let s=i.getPropertyOptions(r),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:wt;this._$Em=r;let a=n.fromAttribute(o,s.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(t,o,i,r=!1,s){if(t!==void 0){let n=this.constructor;if(r===!1&&(s=this[t]),i??(i=n.getPropertyOptions(t)),!((i.hasChanged??uo)(s,o)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:i,reflect:r,wrapped:s},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(o=void 0),this._$AL.set(t,o)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,s]of i){let{wrapped:n}=s,a=this[r];n!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,s,a)}}let t=!1,o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[Le("elementProperties")]=new Map,K[Le("finalized")]=new Map,Br?.({ReactiveElement:K}),(te.reactiveElementVersions??(te.reactiveElementVersions=[])).push("2.1.2");var Re=globalThis,po=e=>e,Je=Re.trustedTypes,mo=Je?Je.createPolicy("lit-html",{createHTML:e=>e}):void 0,xo="$lit$",oe=`lit$${Math.random().toFixed(9).slice(2)}$`,wo="?"+oe,Nr=`<${wo}>`,ae=document,Oe=()=>ae.createComment(""),Ie=e=>e===null||typeof e!="object"&&typeof e!="function",Tt=Array.isArray,Pr=e=>Tt(e)||typeof e?.[Symbol.iterator]=="function",Mt=`[ 	
\f\r]`,Fe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_o=/-->/g,go=/>/g,se=RegExp(`>|${Mt}(?:([^\\s"'>=/]+)(${Mt}*=${Mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$o=/'/g,yo=/"/g,Mo=/^(?:script|style|textarea|title)$/i,Et=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),D=Et(1),u=Et(2),Rn=Et(3),le=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),bo=new WeakMap,ne=ae.createTreeWalker(ae,129);function vo(e,t){if(!Tt(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return mo!==void 0?mo.createHTML(t):t}var Ur=(e,t)=>{let o=e.length-1,i=[],r,s=t===2?"<svg>":t===3?"<math>":"",n=Fe;for(let a=0;a<o;a++){let l=e[a],c,d,f=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===Fe?d[1]==="!--"?n=_o:d[1]!==void 0?n=go:d[2]!==void 0?(Mo.test(d[2])&&(r=RegExp("</"+d[2],"g")),n=se):d[3]!==void 0&&(n=se):n===se?d[0]===">"?(n=r??Fe,f=-1):d[1]===void 0?f=-2:(f=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?se:d[3]==='"'?yo:$o):n===yo||n===$o?n=se:n===_o||n===go?n=Fe:(n=se,r=void 0);let p=n===se&&e[a+1].startsWith("/>")?" ":"";s+=n===Fe?l+Nr:f>=0?(i.push(c),l.slice(0,f)+xo+l.slice(f)+oe+p):l+oe+(f===-2?a:p)}return[vo(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},Be=class e{constructor({strings:t,_$litType$:o},i){let r;this.parts=[];let s=0,n=0,a=t.length-1,l=this.parts,[c,d]=Ur(t,o);if(this.el=e.createElement(c,i),ne.currentNode=this.el.content,o===2||o===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(r=ne.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let f of r.getAttributeNames())if(f.endsWith(xo)){let m=d[n++],p=r.getAttribute(f).split(oe),_=/([.?@])?(.*)/.exec(m);l.push({type:1,index:s,name:_[2],strings:p,ctor:_[1]==="."?kt:_[1]==="?"?St:_[1]==="@"?Ct:$e}),r.removeAttribute(f)}else f.startsWith(oe)&&(l.push({type:6,index:s}),r.removeAttribute(f));if(Mo.test(r.tagName)){let f=r.textContent.split(oe),m=f.length-1;if(m>0){r.textContent=Je?Je.emptyScript:"";for(let p=0;p<m;p++)r.append(f[p],Oe()),ne.nextNode(),l.push({type:2,index:++s});r.append(f[m],Oe())}}}else if(r.nodeType===8)if(r.data===wo)l.push({type:2,index:s});else{let f=-1;for(;(f=r.data.indexOf(oe,f+1))!==-1;)l.push({type:7,index:s}),f+=oe.length-1}s++}}static createElement(t,o){let i=ae.createElement("template");return i.innerHTML=t,i}};function ge(e,t,o=e,i){if(t===le)return t;let r=i!==void 0?o._$Co?.[i]:o._$Cl,s=Ie(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(e),r._$AT(e,o,i)),i!==void 0?(o._$Co??(o._$Co=[]))[i]=r:o._$Cl=r),r!==void 0&&(t=ge(e,r._$AS(e,t.values),r,i)),t}var vt=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:o},parts:i}=this._$AD,r=(t?.creationScope??ae).importNode(o,!0);ne.currentNode=r;let s=ne.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Ne(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new At(s,this,t)),this._$AV.push(c),l=i[++a]}n!==l?.index&&(s=ne.nextNode(),n++)}return ne.currentNode=ae,r}p(t){let o=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,o),o+=i.strings.length-2):i._$AI(t[o])),o++}},Ne=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,o,i,r){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,o=this._$AM;return o!==void 0&&t?.nodeType===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=ge(this,t,o),Ie(t)?t===C||t==null||t===""?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==le&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==C&&Ie(this._$AH)?this._$AA.nextSibling.data=t:this.T(ae.createTextNode(t)),this._$AH=t}$(t){let{values:o,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Be.createElement(vo(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(o);else{let s=new vt(r,this),n=s.u(this.options);s.p(o),this.T(n),this._$AH=s}}_$AC(t){let o=bo.get(t.strings);return o===void 0&&bo.set(t.strings,o=new Be(t)),o}k(t){Tt(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,i,r=0;for(let s of t)r===o.length?o.push(i=new e(this.O(Oe()),this.O(Oe()),this,this.options)):i=o[r],i._$AI(s),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(t=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);t!==this._$AB;){let i=po(t).nextSibling;po(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},$e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,i,r,s){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=o,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=C}_$AI(t,o=this,i,r){let s=this.strings,n=!1;if(s===void 0)t=ge(this,t,o,0),n=!Ie(t)||t!==this._$AH&&t!==le,n&&(this._$AH=t);else{let a=t,l,c;for(t=s[0],l=0;l<s.length-1;l++)c=ge(this,a[i+l],o,l),c===le&&(c=this._$AH[l]),n||(n=!Ie(c)||c!==this._$AH[l]),c===C?t=C:t!==C&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!r&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},kt=class extends $e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}},St=class extends $e{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==C)}},Ct=class extends $e{constructor(t,o,i,r,s){super(t,o,i,r,s),this.type=5}_$AI(t,o=this){if((t=ge(this,t,o,0)??C)===le)return;let i=this._$AH,r=t===C&&i!==C||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==C&&(i===C||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},At=class{constructor(t,o,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){ge(this,t)}};var Dr=Re.litHtmlPolyfillSupport;Dr?.(Be,Ne),(Re.litHtmlVersions??(Re.litHtmlVersions=[])).push("3.3.3");var ko=(e,t,o)=>{let i=o?.renderBefore??t,r=i._$litPart$;if(r===void 0){let s=o?.renderBefore??null;i._$litPart$=r=new Ne(t.insertBefore(Oe(),s),s,void 0,o??{})}return r._$AI(e),r};var Pe=globalThis,z=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;let t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ko(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return le}};z._$litElement$=!0,z.finalized=!0,Pe.litElementHydrateSupport?.({LitElement:z});var Hr=Pe.litElementPolyfillSupport;Hr?.({LitElement:z});(Pe.litElementVersions??(Pe.litElementVersions=[])).push("4.2.2");var et="0.9.0",So="https://github.com/Adrien40/ha-shower-aquarium-card";var y=Object.freeze({title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:5,temp_boiling_threshold:40,temp_deadly_threshold:45,comfort_temp_min:33,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,show_cost:!1,water_price_per_m3:4.5,energy_price_per_kwh:.25,cold_water_temp:15,animation_quality:"max",creature_style:"flat",respect_reduced_motion:!0,show_fps:!1,gauge_style:"thermometer",show_budget:!1,swipe_biotope:!0,show_gauges:!1,show_tiles:!0,use_threshold_colors:!0});var Co=bt`
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
  ha-card {
    padding: 4px 6px;
    background: var(--card-background-color, #ffffff);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  :host([fullscreen]) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    z-index: 1;
  }
  :host([fullscreen]) ha-card {
    padding: 0;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    height: 100%;
    width: 100%;
    border: none;
    background: transparent;
    justify-content: center;
    align-items: center;
  }
  .card-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 4px;
    padding: 0 4px;
  }
  .card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color, #1f2937);
  }
  .aquarium-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host([fullscreen]) .aquarium-container {
    width: 100%;
    height: 100%;
    flex: 1;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: calc(100vh - 100px);
    cursor: pointer;
    /* Vertical scrolling of the page stays; a horizontal swipe is the card's (it changes the biotope). */
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  :host([fullscreen]) svg {
    width: 100%;
    height: 100%;
    max-height: 100%;
    aspect-ratio: auto !important;
  }
  /* Keyboard and screen reader access to feeding and knocking. The buttons are
     invisible at rest and appear over the tank as soon as the keyboard focus
     enters the group, so a sighted keyboard user sees what they are pressing. */
  .keyboard-actions {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    display: flex;
    gap: 8px;
  }
  .kb-button {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
    opacity: 0;
  }
  .keyboard-actions:focus-within .kb-button {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    padding: 6px 14px;
    overflow: visible;
    clip-path: none;
    opacity: 1;
    border: 2px solid var(--primary-color, #0284c7);
    border-radius: 18px;
    background: var(--card-background-color, #ffffff);
    color: var(--primary-text-color, #111827);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }
  .keyboard-actions:focus-within .kb-button:focus-visible {
    outline: 3px solid var(--primary-color, #0284c7);
    outline-offset: 2px;
  }
  .keyboard-actions:focus-within .kb-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  /* Text for screen readers only. */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
  /* The volume blinks once the last coloured threshold of the showerhead is passed. */
  .threshold-blink {
    animation: threshold-blink 1s ease-in-out infinite;
  }
  @keyframes threshold-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.15;
    }
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    gap: 6px;
    margin-top: 6px;
    text-align: center;
  }
  .metric-box {
    background-color: var(--secondary-background-color, #f3f4f6);
    padding: 6px 4px;
    border-radius: 8px;
  }
  .metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--primary-text-color, #111827);
  }
  .metric-unit {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--secondary-text-color, #6b7280);
  }
  .metric-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
    margin-top: 1px;
  }
`;var Ao={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche confort",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge actuel des algues",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)",field_animation_quality:"Qualit\xE9 d'animation",quality_max:"Maximale",quality_balanced:"\xC9quilibr\xE9e",quality_light:"L\xE9g\xE8re (Google Nest Hub)",helper_animation_quality:"L\xE9g\xE8re : 20 images/s et effets simplifi\xE9s, pour les \xE9crans peu puissants",field_respect_reduced_motion:"Suivre le mode \xAB mouvement r\xE9duit \xBB de l'appareil",field_show_fps:"Afficher les images par seconde (d\xE9bogage)",helper_show_fps:"Affichage de d\xE9bogage : indique une fois par seconde le nombre d'images dessin\xE9es.",helper_respect_reduced_motion:"Activ\xE9 : si votre tablette, t\xE9l\xE9phone ou ordinateur a le r\xE9glage \xAB r\xE9duire les animations \xBB (accessibilit\xE9), l'aquarium reste immobile. D\xE9sactiv\xE9 : l'aquarium s'anime toujours. Si vous ne voyez aucun mouvement, d\xE9sactivez cette option.",aria_summary:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L.",aria_summary_temperature:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L, eau \xE0 {temperature} \xB0C.",aria_dead:"Le bac est vide ou trop chaud : les animaux sont morts.",aria_over_budget:"Le volume cible est d\xE9pass\xE9.",section_aquarium:"Aquarium, animaux et algues",section_limits:"Limites (volume et temp\xE9rature)",section_cost:"Estimation du co\xFBt",section_display:"Affichage et performance",action_feed:"Nourrir les poissons",action_knock:"Taper sur la vitre",aria_actions:"Actions de l'aquarium",aria_food_dropped:"De la nourriture est tomb\xE9e dans le bac.",aria_knocked:"Vous avez tap\xE9 sur la vitre. Les poissons sont effray\xE9s.",field_comfort_temp_entity:"Entit\xE9 de temp\xE9rature de confort minimum (optionnel)",helper_comfort_temp_entity:"Temp\xE9rature minimale de confort, par exemple celle d'un pommeau Hydrao. Elle remplace la valeur ci-dessous.",field_comfort_temp:"Temp\xE9rature minimale de confort (\xB0C)",field_gauge_style:"Style des jauges",field_show_budget:"Afficher le budget sur la jauge de volume",option_gauge_thermometer:"Thermom\xE8tre et barre",option_gauge_arc:"Arcs ouverts",label_sensor_unavailable:"Capteur indisponible",helper_target_budget:"Utilis\xE9 seulement si l'entit\xE9 d'objectif ci-dessus est vide ou indisponible.",helper_fish_count:"Entre 1 et 10 : plus de poissons seraient \xE0 l'\xE9troit dans l'aquarium. Une valeur plus grande est ramen\xE9e \xE0 10.",helper_fish_speed:"Entre 0,2 et 3. Une valeur hors de cette plage est ramen\xE9e dedans.",field_creature_style:"Style des poissons et des autres \xEAtres vivants",option_creature_flat:"Plat et d\xE9taill\xE9",option_creature_cartoon:"Dessin anim\xE9",option_creature_realistic:"R\xE9aliste",helper_creature_style:"Le r\xE9aliste utilise des ombrages doux, que la qualit\xE9 d'animation l\xE9g\xE8re supprime",field_swipe_biotope:"Changer de biotope en glissant le doigt",helper_swipe_biotope:"Glissez horizontalement sur l'aquarium pour passer \xE0 l'eau douce, \xE0 l'eau de mer ou \xE0 l'eau froide. Le choix est gard\xE9 sur cet appareil ; changer le biotope dans cet \xE9diteur le remplace.",action_biotope:"Changer de biotope",aria_biotope:"Biotope : {name}.",helper_algae_age:"0 = automatique : l'\xE2ge suit le temps \xE9coul\xE9 depuis la derni\xE8re douche. Une valeur plus grande force l'\xE2ge des algues \xE0 cet instant, pour voir leur aspect.",field_show_gauges:"Afficher les jauges hors plein \xE9cran",helper_show_gauges:"Le thermom\xE8tre et le volume du plein \xE9cran s'affichent aussi sur l'aquarium du mode normal. Comme en plein \xE9cran, ils n'apparaissent qu'\xE0 partir du premier litre (toujours visibles dans l'aper\xE7u de l'\xE9diteur).",field_show_tiles:"Afficher les tuiles sous l'aquarium",helper_show_tiles:"Les tuiles Consomm\xE9, Restant, Objectif, Temp\xE9rature (et Co\xFBt) du mode normal. D\xE9cochez pour ne garder que l'aquarium. Sans effet en plein \xE9cran.",field_use_threshold_colors:"La jauge de volume prend les couleurs des seuils du pommeau",helper_use_threshold_colors:"Le volume prend la couleur du seuil atteint : chaque couleur reste active tant que son seuil n'est pas d\xE9pass\xE9, et apr\xE8s le seuil 4 la couleur du seuil 4 clignote. Il faut les entit\xE9s des seuils 1 \xE0 3 ci-dessous et l'entit\xE9 d'objectif (seuil 4) ; sinon les couleurs habituelles sont utilis\xE9es.",field_threshold_1_entity:"Entit\xE9 seuil 1 (couleur et litres)",field_threshold_2_entity:"Entit\xE9 seuil 2 (couleur et litres)",field_threshold_3_entity:"Entit\xE9 seuil 3 (couleur et litres)",helper_threshold_entities:"Les capteurs \xAB Seuil 1 \xE0 3 \xBB de Hydrao Custom : leur \xE9tat donne les litres et leur attribut color_hex la couleur. Le seuil 4 est l'entit\xE9 d'objectif plus haut."};var To={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Comfort shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Current algae age",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)",field_animation_quality:"Animation quality",quality_max:"Maximum",quality_balanced:"Balanced",quality_light:"Light (Google Nest Hub)",helper_animation_quality:"Light: 20 frames/s and simpler effects, for low-power screens",field_respect_reduced_motion:"Follow the device's reduced-motion setting",field_show_fps:"Show FPS (debug)",helper_show_fps:"Debug overlay: once per second, shows how many frames were drawn.",helper_respect_reduced_motion:'On: if your tablet, phone or computer has the "reduce motion" accessibility setting, the aquarium stays still. Off: the aquarium always animates. If you see no movement, turn this off.',aria_summary:"Shower aquarium: {consumed} L used out of {target} L.",aria_summary_temperature:"Shower aquarium: {consumed} L used out of {target} L, water at {temperature} \xB0C.",aria_dead:"The tank is empty or too hot: the animals have died.",aria_over_budget:"The target volume has been exceeded.",section_aquarium:"Aquarium, animals and algae",section_limits:"Limits (volume and temperature)",section_cost:"Cost estimate",section_display:"Display and performance",action_feed:"Feed the fish",action_knock:"Knock on the glass",aria_actions:"Aquarium actions",aria_food_dropped:"Fish food dropped into the tank.",aria_knocked:"You knocked on the glass. The fish are startled.",field_comfort_temp_entity:"Minimum comfort temperature entity (optional)",helper_comfort_temp_entity:"Minimum comfortable temperature, for example from a Hydrao showerhead. It replaces the value below.",field_comfort_temp:"Minimum comfort temperature (\xB0C)",field_gauge_style:"Gauge style",field_show_budget:"Show the budget on the volume gauge",option_gauge_thermometer:"Thermometer and bar",option_gauge_arc:"Open arcs",label_sensor_unavailable:"Sensor unavailable",helper_target_budget:"Only used when the target entity above is empty or unavailable.",helper_fish_count:"Between 1 and 10: more fish would be cramped in the tank. A higher value is brought back to 10.",helper_fish_speed:"Between 0.2 and 3. A value outside this range is brought back into it.",field_creature_style:"Look of the fish and the other living things",option_creature_flat:"Flat and detailed",option_creature_cartoon:"Cartoon",option_creature_realistic:"Realistic",helper_creature_style:"Realistic uses soft shading, which the light animation quality leaves out",field_swipe_biotope:"Swipe to change the biotope",helper_swipe_biotope:"Swipe sideways on the aquarium to go to freshwater, saltwater or coldwater. The choice is kept on this device; changing the biotope in this editor replaces it.",action_biotope:"Change biotope",aria_biotope:"Biotope: {name}.",helper_algae_age:"0 = automatic: the age follows the time since the last shower. A higher value sets the age of the algae at this very moment, to see how they look.",field_show_gauges:"Show the gauges outside fullscreen mode",helper_show_gauges:"The thermometer and the volume of fullscreen mode are also drawn on the aquarium of the normal mode. Like in fullscreen, they only appear from the first litre (always shown in the preview of the editor).",field_show_tiles:"Show the tiles under the aquarium",helper_show_tiles:"The Consumed, Remaining, Target, Temperature (and Cost) tiles of the normal mode. Untick to keep only the aquarium. No effect in fullscreen mode.",field_use_threshold_colors:"The volume gauge takes the colours of the showerhead's thresholds",helper_use_threshold_colors:"The volume takes the colour of the threshold it has reached: each colour stays active until its threshold is passed, and after threshold 4 the colour of threshold 4 blinks. It needs the entities of thresholds 1 to 3 below and the target entity (threshold 4); without them the usual colours are used.",field_threshold_1_entity:"Threshold 1 entity (colour and litres)",field_threshold_2_entity:"Threshold 2 entity (colour and litres)",field_threshold_3_entity:"Threshold 3 entity (colour and litres)",helper_threshold_entities:'The "Threshold 1 to 3" sensors of Hydrao Custom: their state gives the litres and their color_hex attribute the colour. Threshold 4 is the target entity above.'};var Lt={fr:Ao,en:To};function Z(e){return(e?.locale?.language||e?.language||"en").substring(0,2).toLowerCase()}function Gr(e){return e&&Lt[e]||Lt.en}function J(e,t){return Gr(e)[t]||Lt.en[t]||t}var It={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#dc2626","#f59e0b","#fef3c7","#cbd5e1"]}};function Nt(e){return It[e]||It.freshwater}var jr=["flat","cartoon","realistic"],zr=["night_entity","night_lux_threshold","cost_in_fullscreen","bottom_design"];function ot(e){let t={...e};for(let o of zr)delete t[o];return t}var ye=["freshwater","saltwater","coldwater"];function Ro(e,t){let o=Math.max(0,ye.indexOf(e));return ye[(o+t+ye.length*2)%ye.length]}var Ft={minDistance:60,maxDurationMs:900,horizontalRatio:1.6};function Oo(e,t,o){return o>Ft.maxDurationMs||Math.abs(e)<Ft.minDistance||Math.abs(e)<Math.abs(t)*Ft.horizontalRatio?0:e<0?1:-1}var Ue=1024,Rt=10,Io=y.comfort_temp_min,Zr=y.survival_volume,Pt=6e4,Xr=400,Yr=2048,Qr=300,Wr=600,Eo=(e,t=Xr)=>Math.max(t,Math.min(Yr,Math.round(e)));function Bo(e,t){if(e?.fullscreen){let r=Number(t?.width),s=Number(t?.height);return r>0&&s>0&&Number.isFinite(r)&&Number.isFinite(s)?Eo(Ue*s/r,Qr):Wr}let o=Number(e?.aspect_ratio_width)||y.aspect_ratio_width,i=Number(e?.aspect_ratio_height)||y.aspect_ratio_height;return Eo(Ue*(i/o))}function No(e,t,o=null){let i={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(t?.target_budget)||y.target_budget,survivalVolume:Number(t?.survival_volume)||Zr,comfortMin:Number(t?.comfort_temp_min)||Io,sensorMissing:!1,lastReading:null,tiers:null};if(!e||!t)return i;let r=t.entity?e.states[t.entity]:void 0,s=r?parseFloat(r.state):NaN,n=o?.lastReading??null;i.sensorMissing=!(r&&!isNaN(s));let a=n;if(r&&!isNaN(s)){let l=Math.max(0,s),c=r.last_changed?new Date(r.last_changed).getTime():NaN,d=n!==null&&n.volume===l&&n.changedMs!==null;a={volume:l,changedMs:d?n.changedMs:Number.isFinite(c)?c:null}}if(a&&(i.consumedVolume=a.volume,i.lastReading=a,a.changedMs!==null&&(i.hoursSinceLastShower=Math.max(0,(Date.now()-a.changedMs)/(1e3*60*60)))),t.temperature_entity&&e.states[t.temperature_entity]){let l=parseFloat(e.states[t.temperature_entity].state);i.temperature=isNaN(l)?0:l}if(t.target_budget_entity&&e.states[t.target_budget_entity]){let l=parseFloat(e.states[t.target_budget_entity].state);l>0&&(i.targetBudget=l)}if(t.comfort_temp_entity&&e.states[t.comfort_temp_entity]){let l=parseFloat(e.states[t.comfort_temp_entity].state),c=Number(t.temp_boiling_threshold)||y.temp_boiling_threshold;l>0&&l<c&&(i.comfortMin=l)}return i.tiers=t.use_threshold_colors===!1?null:Jr(e,t)??o?.tiers??null,i}function Kr(e){let t=e?.color_hex;if(typeof t=="string"&&/^#[0-9a-f]{6}$/i.test(t.trim()))return t.trim().toLowerCase();let o=e?.color_rgb,i=Array.isArray(o)?o:typeof o=="string"?o.split(","):[];if(i.length!==3)return null;let r=i.map(s=>typeof s=="string"&&s.trim()===""?NaN:Number(s));return r.every(s=>Number.isInteger(s)&&s>=0&&s<=255)?`#${r.map(s=>s.toString(16).padStart(2,"0")).join("")}`:null}function Jr(e,t){let o=[t.threshold_1_entity,t.threshold_2_entity,t.threshold_3_entity,t.target_budget_entity],i=[];for(let r of o){let s=r?e.states[r]:void 0,n=s?parseFloat(s.state):NaN,a=s?Kr(s.attributes):null;if(!(n>0)||!a)return null;i.push({limit:n,color:a})}for(let r=1;r<i.length;r++)if(!(i[r].limit>i[r-1].limit))return null;return i}function Po(e,t){if(!t||t.length===0)return null;let o=t.findIndex(i=>e<=i.limit);return o===-1?{color:t[t.length-1].color,blinking:!0,index:t.length-1}:{color:t[o].color,blinking:!1,index:o}}function es(e,t){return t==="saltwater"?e<2?0:e===2?1:e===3?3:Lo[(e-4)%Lo.length]:e%6}var tt=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5],Lo=[4,2,5,6,2,5],Fo={male:1.4,female:1.6},ts=1.5,os=.6,is=2;function it(e,t){let o=Nt(t),i=Math.min(10,Math.max(1,Number(e)||4));return Array.from({length:i},(r,s)=>{let n=es(s,t),a=t==="saltwater"&&n===0,l=t==="freshwater"&&n===2,c=l?os:1,d=1.38-(tt[s%tt.length]-1.2)*.2,f=Math.random()*50-25,m=Math.random()*50-25;return{species:n,color:o.palette[s%o.palette.length],scale:(a?s===0?Fo.male:Fo.female:tt[s%tt.length]*(t==="saltwater"&&n===1?is:1))*(l?ts:1),phase:Math.random()*6.28,x:a?190+s*140:120+s*760/Math.max(1,i-1)+f,y:a?470:160+s%3*90+m,vx:d*(.8+Math.random()*.4)*c,vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5)*c,dir:Math.random()<.5?1:-1,deathProgress:0}})}function rt({config:e,metrics:t,canvasHeight:o}){let i=t.targetBudget,r=t.survivalVolume,s=i+r,n=t.consumedVolume,a=t.temperature,l=Number(e?.temp_boiling_threshold)||y.temp_boiling_threshold,c=Number(e?.temp_deadly_threshold)||y.temp_deadly_threshold,d=Math.max(0,s-n),f=s>0?Math.max(0,Math.min(1,d/s)):0,m=!!e?.fullscreen,p=m?0:15,_=m?o:o-35,x=_-p,M=_-f*x,w=a>=c&&a>0,v=d<=0,A=w||v,L=a>=l&&a>0,F=n>i&&!A,U=n>i*.7&&!F&&!A,W=Number(e?.fish_speed_multiplier)||y.fish_speed_multiplier,j=((F||L)&&!A?2:1)*W;return{targetBudget:i,survivalVolume:r,totalVolume:s,currentVolume:n,currentTemp:a,boilTemp:l,deadlyTemp:c,remainingVolumeInTank:d,waterRatio:f,tankTop:p,tankBottom:_,tankHeight:x,waterSurfaceY:M,isHeatDead:w,isWaterDead:v,isDead:A,isBoiling:L,isCritical:F,isWarning:U,speedMultiplier:j}}function rs(e){let t=Math.max(Rt+10,Math.ceil((e+5)/10)*10),o=[];for(let i=Rt+10;i<=t;i+=10)o.push(i);return{min:Rt,max:t,ticks:o}}function Uo({currentTemp:e,currentVolume:t,targetBudget:o,comfortMin:i,deadlyTemp:r,boilTemp:s,tier:n=null}){let a=rs(r),l=p=>Math.max(0,Math.min(1,(p-a.min)/(a.max-a.min))),c=l(e),d=e>=r?"#ef4444":e>=s?"#f97316":e>=i?"#16a34a":"#0284c7",f=Math.max(0,Math.min(1,t/Math.max(1,o))),m=n?n.color:t>o?"#ef4444":t>o*.7?"#f59e0b":"#0284c7";return{tempFraction:c,tempColor:d,volFraction:f,volColor:m,volBlink:!!n?.blinking,scale:a,marks:[{fraction:l(i),color:"#16a34a"},{fraction:l(s),color:"#f97316"},{fraction:l(r),color:"#ef4444"}],ticks:a.ticks.map(l)}}var Do=8e3,st=900;function nt(){return{lastVolume:null,lastIncreaseAt:0,target:0,showerActive:!1}}function Ho(e,t,o){if(e.lastVolume===null)return{...e,lastVolume:t};if(t<e.lastVolume-1e-6)return{...nt(),lastVolume:t};if(t>e.lastVolume+1e-6){let i=t-e.lastVolume,r=(o-e.lastIncreaseAt)/1e3,n=e.lastIncreaseAt>0&&r>.2&&r<=15?i/(r/60):null,a=n===null?.5:Math.max(.25,Math.min(1,n/10));return{lastVolume:t,lastIncreaseAt:o,target:a,showerActive:!0}}return e}function qo(e,t){return e.lastIncreaseAt&&t-e.lastIncreaseAt<Do?e.target:0}function Vo(e,t){return e.showerActive&&e.lastIncreaseAt>0&&t-e.lastIncreaseAt>=Do}function Go(e,t=36){return e>.02?Math.min(t,Math.round(4+e*(t-4))):0}function jo(e,t,o=45){return e<=t+o?"feed":"knock"}function zo(e,t,o,i,r=280,s=Math.random){let n=e-o,a=t-i,l=Math.hypot(n,a);if(l>r)return null;let c,d;if(l<1){let p=s()*Math.PI*2;c=Math.cos(p),d=Math.sin(p)}else c=n/l,d=a/l;let f=1-l/r,m=2+9*f;return{kx:c*m,ky:d*m*.6,scare:f}}function Zo(e,t,o,i=360){let r=null,s=i;for(let n of o){if(n.eaten)continue;let a=Math.hypot(n.x-e,n.y-t);a<s&&(s=a,r=n)}return r}var Ot={count:10,start:40,speed:3.4};function Xo(e,t,o=Ot.count,i=Math.random){let r=["#f59e0b","#fbbf24","#fb923c","#facc15"];return Array.from({length:o},()=>{let s=(i()-.5)*2;return{x:e+s*Ot.start,y:t+i()*12,vx:s*Ot.speed+(i()-.5)*.8,vy:.4+i()*.55,phase:i()*Math.PI*2,r:3.4+i()*2,color:r[Math.floor(i()*r.length)],landedAt:0,eaten:!1}})}var ss=4.186/3600;function Ut(e,t,o=15){return!(e>0)||!(t>o)?0:e*(t-o)*ss}function Yo({volumeL:e,energyKwh:t,waterPricePerM3:o,energyPricePerKwh:i}){let r=Math.max(0,e||0)*(Number(o)||0)/1e3,s=Math.max(0,t||0)*(Number(i)||0);return{water:r,energy:s,total:r+s}}function at(e,t="fr"){try{return new Intl.NumberFormat(t,{style:"currency",currency:"EUR"}).format(e)}catch{return`${e.toFixed(2)} \u20AC`}}var Bt={max:{fps:0,ambientHz:0,antialias:!0,flowBubbles:36,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0,tentacles:1},balanced:{fps:30,ambientHz:0,antialias:!0,flowBubbles:24,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0,tentacles:1},light:{fps:20,ambientHz:8,antialias:!1,flowBubbles:12,richSurface:!1,deathFilter:!1,doubleRipple:!1,shading:!1,tentacles:.6}};function Qo(e){return e&&Bt[e]||Bt.max}function Wo(e,t,o){return!o||!t?!0:e-t>=1e3/o-2}function Ko(e){return e?Math.max(2,1e3/e/16.66*1.6):2}function Jo(e,t){return[e.consumedVolume,e.temperature,e.targetBudget,e.survivalVolume,e.comfortMin,e.sensorMissing?1:0,Math.floor(e.hoursSinceLastShower),e.tiers?e.tiers.map(o=>`${o.limit}${o.color}`).join(","):"",t].join("|")}function Dt(e){let t={...e};for(let o of ii){if(o.max===void 0)continue;let i=t[o.key];i!=null&&(t[o.key]=Ht({[o.key]:i}).config[o.key])}return t}function ei(e,t=!0){return t===!1?!0:!e}var ti=40;function oi(e){return e?120:2}var ii=[{key:"fish_count",fallback:y.fish_count,min:1,max:10,integer:!0},{key:"target_budget",fallback:y.target_budget,min:0,minExclusive:!0},{key:"survival_volume",fallback:y.survival_volume,min:0,minExclusive:!0},{key:"temp_boiling_threshold",fallback:y.temp_boiling_threshold,min:0,minExclusive:!0},{key:"temp_deadly_threshold",fallback:y.temp_deadly_threshold,min:0,minExclusive:!0},{key:"comfort_temp_min",fallback:y.comfort_temp_min,min:0,minExclusive:!0},{key:"algae_delay_hours",fallback:y.algae_delay_hours,min:0,minExclusive:!0},{key:"algae_age",fallback:y.algae_age,min:0},{key:"fish_speed_multiplier",fallback:y.fish_speed_multiplier,min:0,minExclusive:!0,clampMin:.2,max:3},{key:"aspect_ratio_width",fallback:y.aspect_ratio_width,min:0,minExclusive:!0},{key:"aspect_ratio_height",fallback:y.aspect_ratio_height,min:0,minExclusive:!0},{key:"water_price_per_m3",fallback:y.water_price_per_m3,min:0},{key:"energy_price_per_kwh",fallback:y.energy_price_per_kwh,min:0},{key:"cold_water_temp",fallback:y.cold_water_temp,min:-50}];function Ht(e){let t={...e},o=[];for(let a of Object.keys(t))(t[a]===null||t[a]===void 0)&&delete t[a];for(let a of ii){let l=t[a.key];if(l===void 0)continue;let c=typeof l=="string"&&l.trim()===""?NaN:Number(l);if(!(Number.isFinite(c)&&(a.minExclusive?c>a.min:c>=a.min))){o.push(`${a.key}: ${JSON.stringify(l)} is not valid, using ${a.fallback}`),t[a.key]=a.fallback;continue}a.integer&&(c=Math.round(c)),a.clampMin!==void 0&&c<a.clampMin&&(c=a.clampMin),a.max!==void 0&&c>a.max&&(c=a.max),c!==l&&(c!==Number(l)&&o.push(`${a.key}: ${JSON.stringify(l)} is out of range, using ${c}`),t[a.key]=c)}t.theme!==void 0&&!It[t.theme]&&(o.push(`theme: ${JSON.stringify(t.theme)} is unknown, using freshwater`),t.theme="freshwater"),t.animation_quality!==void 0&&!Bt[t.animation_quality]&&(o.push(`animation_quality: ${JSON.stringify(t.animation_quality)} is unknown, using max`),t.animation_quality="max"),t.gauge_style!==void 0&&t.gauge_style!=="thermometer"&&t.gauge_style!=="arc"&&(o.push(`gauge_style: ${JSON.stringify(t.gauge_style)} is unknown, using thermometer`),t.gauge_style="thermometer"),t.creature_style!==void 0&&!jr.includes(t.creature_style)&&(o.push(`creature_style: ${JSON.stringify(t.creature_style)} is unknown, using ${y.creature_style}`),t.creature_style=y.creature_style),t.title!==void 0&&typeof t.title!="string"&&(o.push("title: must be text, ignoring it"),t.title="");let i=t.temp_boiling_threshold??y.temp_boiling_threshold,r=t.temp_deadly_threshold??y.temp_deadly_threshold;r<=i&&(t.temp_deadly_threshold=i+1,o.push(`temp_deadly_threshold: ${r} must be above temp_boiling_threshold (${i}), using ${i+1}`));let s=t.comfort_temp_min??Io,n=t.temp_boiling_threshold??y.temp_boiling_threshold;return s>=n&&(t.comfort_temp_min=Math.max(1,n-1),o.push(`comfort_temp_min: ${s} must be below temp_boiling_threshold (${n}), using ${t.comfort_temp_min}`)),{config:t,warnings:o}}function qt(e,t){return String(e).replace(/\{(\w+)\}/g,(o,i)=>i in t?String(t[i]):o)}function De(e,t="en"){return Number.isInteger(e)?String(e):I(e,t,1)}function I(e,t="en",o=1){try{return new Intl.NumberFormat(t,{minimumFractionDigits:o,maximumFractionDigits:o}).format(e)}catch{return Number(e).toFixed(o)}}var ns="hydrao_custom";function ri(e,...t){let o=e&&typeof e.entities=="object"&&e.entities?e.entities:{},i=e&&typeof e.states=="object"&&e.states?e.states:{},r=[...new Set([...t.flatMap(l=>Array.isArray(l)?l:[]),...Object.keys(o),...Object.keys(i)])].sort(),s=(l,c,d,f)=>{let m=r.filter(_=>_.startsWith(`${l}.`)),p=m.find(_=>o[_]?.platform===ns&&c.includes(o[_]?.translation_key??""));return p||m.find(_=>_.includes("hydrao")&&d.test(_)&&!(f&&f.test(_)))||""},n=/(total|cumul|comfort|confort|wasted|perdu|gaspill)/,a=/_minimum_comfort_temperature|_temperature_de_confort_minimum|_temperature_confort_minimum/;return{entity:s("sensor",["shower_volume_comfort"],/_(comfort_shower_volume|shower_comfort_volume|volume_douche_confort|volume_confort_douche|douche_confort)(_\d+)?$/,/(total|cumul|wasted|perdu|gaspill)/)||s("sensor",["shower_volume_raw"],/_(shower_volume|volume_douche)(_\d+)?$/,n),temperature_entity:s("sensor",["temperature"],/_temperature(_\d+)?$/),comfort_temp_entity:s("number",["comfort_temperature"],/_(minimum_comfort_temperature|temperature_de_confort_minimum|temperature_confort_minimum)(_\d+)?$/),target_budget_entity:s("sensor",["threshold_4"],/_(threshold|seuil)_4(_\d+)?$/,a),threshold_1_entity:s("sensor",["threshold_1"],/_(threshold|seuil)_1(_\d+)?$/),threshold_2_entity:s("sensor",["threshold_2"],/_(threshold|seuil)_2(_\d+)?$/),threshold_3_entity:s("sensor",["threshold_3"],/_(threshold|seuil)_3(_\d+)?$/)}}var ni=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:y.theme,selector:{select:{options:[{value:"freshwater",label:"Freshwater (Tropical)"},{value:"saltwater",label:"Saltwater (Reef)"},{value:"coldwater",label:"Coldwater (Goldfish)"}]}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:y.target_budget,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{type:"expandable",name:"section_aquarium",flatten:!0,schema:[{name:"fish_count",default:y.fish_count,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"fish_speed_multiplier",default:y.fish_speed_multiplier,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"algae_enabled",default:y.algae_enabled,selector:{boolean:{}}},{name:"algae_delay_hours",default:y.algae_delay_hours,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:y.algae_age,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}}]},{type:"expandable",name:"section_limits",flatten:!0,schema:[{name:"survival_volume",default:y.survival_volume,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"comfort_temp_entity",selector:{entity:{domain:["sensor","number","input_number"]}}},{name:"use_threshold_colors",default:y.use_threshold_colors,selector:{boolean:{}}},{name:"threshold_1_entity",selector:{entity:{domain:"sensor"}}},{name:"threshold_2_entity",selector:{entity:{domain:"sensor"}}},{name:"threshold_3_entity",selector:{entity:{domain:"sensor"}}},{name:"comfort_temp_min",default:y.comfort_temp_min,selector:{number:{min:15,max:45,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_boiling_threshold",default:y.temp_boiling_threshold,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:y.temp_deadly_threshold,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_cost",flatten:!0,schema:[{name:"show_cost",default:y.show_cost,selector:{boolean:{}}},{name:"water_price_per_m3",default:y.water_price_per_m3,selector:{number:{min:0,max:30,step:.01,unit_of_measurement:"\u20AC/m\xB3",mode:"box"}}},{name:"energy_price_per_kwh",default:y.energy_price_per_kwh,selector:{number:{min:0,max:2,step:.001,unit_of_measurement:"\u20AC/kWh",mode:"box"}}},{name:"cold_water_temp",default:y.cold_water_temp,selector:{number:{min:0,max:30,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_display",flatten:!0,schema:[{name:"animation_quality",default:y.animation_quality,selector:{select:{options:[{value:"max",label:"Maximum"},{value:"balanced",label:"Balanced"},{value:"light",label:"Light (Google Nest Hub)"}]}}},{name:"creature_style",default:y.creature_style,selector:{select:{options:[{value:"flat",label:"Flat and detailed"},{value:"cartoon",label:"Cartoon"},{value:"realistic",label:"Realistic"}]}}},{name:"show_budget",default:y.show_budget,selector:{boolean:{}}},{name:"respect_reduced_motion",default:y.respect_reduced_motion,selector:{boolean:{}}},{name:"fullscreen",default:y.fullscreen,selector:{boolean:{}}},{name:"show_gauges",default:y.show_gauges,selector:{boolean:{}}},{name:"gauge_style",default:y.gauge_style,selector:{select:{options:[{value:"thermometer",label:"Thermometer and bar"},{value:"arc",label:"Open arcs"}]}}},{name:"show_tiles",default:y.show_tiles,selector:{boolean:{}}},{name:"swipe_biotope",default:y.swipe_biotope,selector:{boolean:{}}},{name:"aspect_ratio_width",default:y.aspect_ratio_width,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:y.aspect_ratio_height,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"show_fps",default:y.show_fps,selector:{boolean:{}}}]}];function ai(e=ni){return e.flatMap(t=>t.type==="expandable"?ai(t.schema):[t])}var si={section_aquarium:"section_aquarium",section_limits:"section_limits",section_cost:"section_cost",section_display:"section_display"},as={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",comfort_temp_entity:"field_comfort_temp_entity",comfort_temp_min:"field_comfort_temp",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",show_cost:"field_show_cost",water_price_per_m3:"field_water_price",energy_price_per_kwh:"field_energy_price",cold_water_temp:"field_cold_water_temp",animation_quality:"field_animation_quality",respect_reduced_motion:"field_respect_reduced_motion",fullscreen:"field_fullscreen",show_fps:"field_show_fps",creature_style:"field_creature_style",gauge_style:"field_gauge_style",show_budget:"field_show_budget",swipe_biotope:"field_swipe_biotope",show_gauges:"field_show_gauges",use_threshold_colors:"field_use_threshold_colors",threshold_1_entity:"field_threshold_1_entity",threshold_2_entity:"field_threshold_2_entity",threshold_3_entity:"field_threshold_3_entity",show_tiles:"field_show_tiles",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},ls={fullscreen:"helper_fullscreen",creature_style:"helper_creature_style",target_budget:"helper_target_budget",fish_count:"helper_fish_count",fish_speed_multiplier:"helper_fish_speed",comfort_temp_entity:"helper_comfort_temp_entity",show_cost:"helper_show_cost",animation_quality:"helper_animation_quality",respect_reduced_motion:"helper_respect_reduced_motion",show_fps:"helper_show_fps",swipe_biotope:"helper_swipe_biotope",show_gauges:"helper_show_gauges",use_threshold_colors:"helper_use_threshold_colors",threshold_1_entity:"helper_threshold_entities",show_tiles:"helper_show_tiles",algae_age:"helper_algae_age"},cs={theme:{freshwater:"theme_freshwater",saltwater:"theme_saltwater",coldwater:"theme_coldwater"},animation_quality:{max:"quality_max",balanced:"quality_balanced",light:"quality_light"},creature_style:{flat:"option_creature_flat",cartoon:"option_creature_cartoon",realistic:"option_creature_realistic"},gauge_style:{thermometer:"option_gauge_thermometer",arc:"option_gauge_arc"}},Vt=class extends z{static get properties(){return{hass:{type:Object},_config:{type:Object}}}constructor(){super(),this.hass=void 0,this._config=void 0}setConfig(t){this._config=ot(t)}_lang(){return Z(this.hass)}_computeLabel(t){let o=as[t.name]||si[t.name];return o?J(this._lang(),o):t.name}_computeHelper(t){let o=ls[t.name];return o?J(this._lang(),o):""}_valueChanged(t){if(!this._config||!this.hass)return;let o=Dt({...t.detail.value});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}_schema(){let t=this._lang(),o=i=>{if(i.type==="expandable")return{...i,title:J(t,si[i.name]),schema:i.schema.map(o)};let r=cs[i.name];return r?{...i,selector:{select:{options:i.selector.select.options.map(s=>({value:s.value,label:J(t,r[s.value])}))}}}:i};return ni.map(o)}_formData(){return{...Object.fromEntries(ai().filter(o=>o.default!==void 0).map(o=>[o.name,o.default])),...Dt(this._config)}}render(){return!this.hass||!this._config?D``:D`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${t=>this._computeLabel(t)}
        .computeHelper=${t=>this._computeHelper(t)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",Vt);function ci(e,t,o,i){let r=`${t}|${o}|${i}|${e._flowIntensity||0}|${(e._flowIntensity||0)>.05?e._animTime:e._ambientTime}|${e._profile.richSurface}`,s=li.get(e);if(s&&s.key===r)return s.strip;let n=hs(e,t,o,i);return li.set(e,{key:r,strip:n}),n}var li=new WeakMap;function hs(e,t,o,i){let r=e._flowIntensity||0,s=3.5+r*6.5,n=90-r*35,l=(r>.05?e._animTime:e._ambientTime)*(1.6+r*2.4),c=e._profile.richSurface,d=c?16:28,f=w=>c?Math.sin(w/17+l*2.3)*r*2.4:0,m=[],p=[];for(let w=t;w<o;w+=d)m.push([w,i+Math.sin(w/n+l)*s+f(w)]),p.push([w,i+4+Math.sin(w/n+l+.6)*s*.7]);m.push([o,i+Math.sin(o/n+l)*s+f(o)]),p.push([o,i+4+Math.sin(o/n+l+.6)*s*.7]);let _=w=>`${w[0].toFixed(1)},${w[1].toFixed(1)}`,x=m.map(_).join(" L "),M=p.slice().reverse().map(_).join(" L ");return u`
    <path d="M ${x} L ${M} Z" fill="#ffffff" opacity="0.25" />
    <path d="M ${x}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
  `}var O=e=>e??C;var S="#1e293b";function R(e){return e._config?.creature_style||"flat"}function B(e){return e._profile.shading}var $=(e,t,o,i)=>`M${e-o},${t} A${o},${i} 0 1,0 ${e+o},${t} A${o},${i} 0 1,0 ${e-o},${t} Z`,b=(e,t,o)=>$(e,t,o,o),k=e=>`M${e.trim().split(/\s+/).join(" L")} Z`,ce=(e,t,o,i)=>`M${e},${t} L${o},${i}`,h=(e,t,o={})=>({d:e,fill:t,...o});function g(e,t=!1){return u`<path d="${e.d}" fill="${e.fill??"none"}" stroke="${O(e.stroke??(t?S:void 0))}" stroke-width="${O(e.sw??(t?1.6:void 0))}" stroke-linecap="${O(e.lc)}" stroke-linejoin="round" opacity="${O(e.op)}" />`}function N(e,t,o,i,r={}){let s=g(h(o,i,r),e==="cartoon");return e==="realistic"&&t?u`${s}<path d="${o}" fill="url(#shade)" opacity="${O(r.op)}" />`:s}function X(e,t,o,i,r){if(!(r>0))return;let s=Math.min(1,r);return`translate(${e} ${t}) rotate(${(o*s).toFixed(1)}) scale(1 ${(1-i*s).toFixed(3)}) translate(${-e} ${-t})`}var ds=600,be=new Map;function T(e,t){if(be.has(e))return be.get(e);let o=t();for(be.set(e,o);be.size>ds;)be.delete(be.keys().next().value);return o}var P=Object.freeze({x0:776,x1:1010,height:254,ledge:190,ledgeFrom:880,ledgeTo:940}),ee=Object.freeze([{x:500,h:26,cave:!1},{x:650,h:26,cave:!1},{x:770,h:26,cave:!1},{x:884,h:22,cave:!0},{x:850,h:118,cave:!1},{x:880,h:190,cave:!1},{x:940,h:190,cave:!1}]),ie=Object.freeze(ee.reduce((e,t,o)=>{if(o===0)return[0];let i=ee[o-1];return[...e,e[o-1]+Math.hypot(t.x-i.x,t.h-i.h)]},[])),xe=ie[ie.length-1];function Gt(e){let t=Math.max(0,Math.min(xe,e)),o=1;for(;o<ie.length-1&&ie[o]<t;)o++;let[i,r]=[ee[o-1],ee[o]],s=(t-ie[o-1])/(ie[o]-ie[o-1]);return{x:i.x+(r.x-i.x)*s,h:i.h+(r.h-i.h)*s}}var lt=Object.freeze(ie.filter((e,t)=>ee[t].cave)),ct=xe-(ee[ee.length-1].x-ee[ee.length-2].x)/2;function fs(e,t=0){let o=`${e._ambientTime}|${t}|${R(e)}|${jt(e)}`,i=hi.get(e);if(i&&i.key===o)return i.parts;let r=us(e,t);return hi.set(e,{key:o,parts:r}),r}var hi=new WeakMap;function jt(e){return e._profile?.tentacles??1}function us(e,t){let o=R(e),i=o==="cartoon"?1.4:o==="realistic"?.65:1,r=o==="cartoon"?1.5:o==="realistic"?.7:1,s=[{count:Math.max(2,Math.round(11*jt(e))),baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:Math.max(2,Math.round(16*jt(e))),baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],n=[];return s.forEach((a,l)=>{for(let c=0;c<a.count;c++){let d=c/(a.count-1),f=-90-a.spread/2+d*a.spread,m=(a.lenMin+(a.lenMax-a.lenMin)*(.5+.5*Math.sin(d*Math.PI)))*(1-.3*t),p=l*10+c*.7,_=Math.sin(e._ambientTime*a.speed+p)*9*(1-t),x=f*Math.PI/180,M=Math.cos(x)*a.baseR,w=Math.sin(x)*a.baseR,v=c*37%17-8,L=(f<-90?-1:1)*(118+c%4*7),F=f+90+_,U=F+(L-F)*t;n.push(u`
        <g transform="translate(${M.toFixed(1)}, ${w.toFixed(1)}) rotate(${U.toFixed(1)})">
          <path d="M 0,0 Q ${v.toFixed(1)},${(-m*.55).toFixed(1)} 0,${(-m).toFixed(1)}" stroke="${a.color}" stroke-width="${(a.width*i).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.9" />
          <circle cx="0" cy="${(-m).toFixed(1)}" r="${(a.width*.9*r).toFixed(1)}" fill="${o==="realistic"?"#ffffff":a.tip}" />
        </g>
      `)}}),n}function ps(e,t,o,i,r){return T(`chunk|${e}|${t}|${o}|${i}|${r}`,()=>ms(e,t,o,i,r))}function ms(e,t,o,i,r){let n=Array.from({length:8},(c,d)=>{let f=d/8*Math.PI*2+.18*Math.sin(r*1.3+d*2.1),m=1+.2*Math.sin(r*2.3+d*2.7)+.1*Math.sin(r*1.1+d*5.1);return{a:f,x:e+Math.cos(f)*o*m,y:t+Math.sin(f)*i*m}}),a=c=>`M${c.map(d=>`${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(" L")} Z`,l=n.filter(c=>Math.sin(c.a)<.15);return{body:a(n),top:a(l)}}function _s(e){let t=e-P.ledge,[o,i]=[P.ledgeFrom-30,P.ledgeTo+52];return`M${o+10},${t} L${i-10},${t} L${i},${t+12} L${i-6},${t+30} L${o+8},${t+30} L${o},${t+12} Z`}var di=[[802,16,36,18,1,"#7d5c8f"],[862,30,58,32,2,"#8b6a9c"],[950,34,66,36,3,"#6d5280"],[1e3,46,34,48,4,"#7d5c8f"],[832,80,46,32,5,"#6d5280"],[906,94,54,34,6,"#8b6a9c"],[978,106,40,40,7,"#7d5c8f"],[920,146,64,30,8,"#6d5280"]],gs=[[958,216,34,30,9,"#8b6a9c"],[998,198,24,36,10,"#7d5c8f"],[930,228,26,26,11,"#6d5280"]],$s=[[572,8,22,9,43,"#6d5280"],[716,11,32,13,44,"#8b6a9c"],[740,24,18,12,45,"#7d5c8f"],[610,6,12,6,46,"#6d5280"],[506,6,10,5,47,"#8b6a9c"]];function ht(e,t,o,[i,r,s,n,a,l]){let c=o-r,{body:d,top:f}=ps(i,c,s,n,a);return u`
    ${N(e,t,d,l)}
    ${e==="cartoon"?"":g(h(f,"#ffffff",{op:.15,stroke:"none"}))}
    ${e==="flat"?[[-.3,.1],[.25,.3],[-.05,.45]].map(([m,p])=>g(h(b(i+m*s,c+p*n,Math.max(1.4,s*.06)),"#3b2a4a",{op:.35,stroke:"none"}))):""}
  `}function fi(e,t,o,i){let r=t,s=R(e),n=B(e),a=(c,d,f)=>N(s,n,c,d,f===void 0?{}:{op:f}),l=(c,d,f,m)=>s==="flat"?c.map(([p,_])=>g(h(b(p,_,f),d,{op:m}))):"";return u`
    <g id="reef-decor">
      <g style="${o}">
      ${T(`corals|${s}|${n}|${r}|${i>0?i.toFixed(3):0}`,()=>u`
      <g transform="${O(X(88,r,-16,.6,i))}">
      ${a(`M 60 ${r} Q 40 ${r-165}, 95 ${r-225} Q 120 ${r-275}, 85 ${r-335} Q 135 ${r-265}, 120 ${r-195} Q 150 ${r-135}, 115 ${r} Z`,"#f43f5e",.95)}
      ${l([[88,r-40],[80,r-110],[98,r-190],[105,r-240],[92,r-300]],"#ffe4e6",3,.55)}
      </g>
      <g transform="${O(X(160,r,14,.55,i))}">
      ${a(`M 115 ${r} Q 150 ${r-155}, 190 ${r-205} Q 215 ${r-245}, 190 ${r-295} Q 230 ${r-235}, 205 ${r-155} Q 180 ${r-105}, 155 ${r} Z`,"#fb7185",.9)}
      ${l([[135,r-40],[160,r-120],[185,r-190],[196,r-250]],"#ffe4e6",3,.55)}
      </g>
      <g transform="translate(690, ${r})">
        <g transform="${O(X(-40,0,12,.55,i))}">
        ${a("M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z","#c084fc",.85)}
        ${a("M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z","#a855f7",.9)}
        ${a("M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z","#d8b4fe",.85)}
        ${a(b(0,-20,60),"#7e22ce",.75)}
        </g>
      </g>
      <g transform="translate(190, ${r-70})">
        <g transform="${O(X(0,46,0,.4,i))}">
        ${N(s,n,"M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z","#1d4ed8",{stroke:"#1e40af",sw:2})}
        <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="5" fill="#60a5fa" />
        </g>
      </g>
      
      `)}
      </g>
      ${T(`live-rock|${s}|${n}|${r}`,()=>u`
      <g id="live-rock">
        ${di.slice(0,4).map(c=>ht(s,n,r,c))}
        ${di.slice(4).map(c=>ht(s,n,r,c))}
        ${g(h($(884,r-52,36,22),"#0b0614",{stroke:"none",op:1}))}
        ${a(_s(r),"#9a78ad")}
        ${s==="cartoon"?"":g(h(`M ${P.ledgeFrom-20},${r-P.ledge+3} L ${P.ledgeTo+44},${r-P.ledge+3}`,void 0,{stroke:"#ffffff",sw:1.6,op:.4,lc:"round"}))}
        ${gs.map(c=>ht(s,n,r,c))}
        ${s==="cartoon"?"":[[850,44,16,7],[942,108,18,8],[976,152,11,6],[812,74,12,6],[1002,200,9,7]].map(([c,d,f,m])=>g(h($(c,r-d,f,m),"#e879f9",{op:.32,stroke:"none"})))}
        ${s==="flat"?[[846,66],[972,158]].map(([c,d])=>u`${g(h(`M ${c},${r-d} L ${c},${r-d-9}`,void 0,{stroke:"#fb923c",sw:1.2,lc:"round"}))}${g(h(b(c,r-d-11,3.2),"#fb923c",{stroke:"none"}))}`):""}
      </g>
      `)}
      ${T(`live-rock-scattered|${s}|${n}|${r}`,()=>u`
      <g id="live-rock-scattered">
        ${$s.map(c=>ht(s,n,r,c))}
      </g>
      `)}
      <g id="anemone" style="${o}" transform="translate(260, ${r-17}) scale(1.4, 1.4)">
        <g transform="${O(X(0,22,0,.3,i))}">
        ${fs(e,i)}
        ${T(`anemone-body|${s}|${n}`,()=>u`
        ${a($(0,-16,30,11),"#86198f",.9)}
        ${a("M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z","#701a75")}
        ${a($(0,16,26,9),"#4a044e",.75)}
        ${s==="cartoon"?u`
              ${g(h(b(-8,3,3.6),"#ffffff",{stroke:S,sw:1.2}))}
              ${g(h(b(8,3,3.6),"#ffffff",{stroke:S,sw:1.2}))}
              ${g(h(b(-7.4,3.4,2),"#111827",{stroke:"none"}))}
              ${g(h(b(8.6,3.4,2),"#111827",{stroke:"none"}))}
              ${g(h("M -6,10 Q 0,16 6,10",void 0,{stroke:S,sw:1.5,lc:"round"}))}
              ${g(h($(-14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
              ${g(h($(14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
            `:""}
        `)}
        </g>
      </g>
    </g>
  `}var ys=[[140,25,70,26,"#475569",1],[250,17,50,20,"#64748b",1],[860,20,75,28,"#334155",1],[760,15,46,18,"#64748b",1],[300,10,26,10,"#94a3b8",.85],[600,8,22,9,"#94a3b8",.8],[660,14,34,14,"#475569",.9]];function ui(e,t,o){return T(`coldwater|${e}|${t}|${o}`,()=>bs(e,t,o))}function bs(e,t,o){return u`
    <g id="coldwater-decor">
      ${ys.map(([i,r,s,n,a,l])=>{let c=e-r;return u`
          ${N(t,o,$(i,c,s,n),a,{op:l})}
          ${g(h($(i-s*.3,c-n*.4,s*.35,n*.22),"#ffffff",{op:.22}))}
        `})}
    </g>
  `}function pi(e,t,o,i,r=0){return T(`freshwater|${e}|${t}|${o}|${i}|${r>0?r.toFixed(3):0}`,()=>xs(e,t,o,i,r))}function xs(e,t,o,i,r){let s=e,n=(l,c,d)=>N(o,i,l,c,d===void 0?{}:{op:d}),a=(l,c)=>o==="flat"?g(h(l,void 0,{stroke:"#052e16",sw:1.5,op:c,lc:"round"})):"";return u`
    <g id="freshwater-plants" style="${t}">
      <g transform="${O(X(165,s,-4,.55,r))}">
      ${n(`M 45 ${s} Q 65 ${s-75}, 115 ${s-60} Q 155 ${s-85}, 200 ${s-50} Q 240 ${s-70}, 285 ${s} Z`,"#15803d")}
      ${n(`M 75 ${s} Q 95 ${s-60}, 135 ${s-55} Q 170 ${s-75}, 210 ${s-40} Q 250 ${s-50}, 270 ${s} Z`,"#22c55e",.85)}
      ${n(b(110,s-55,11),"#4ade80",.7)}
      ${n(b(170,s-63,12),"#4ade80",.7)}
      </g>
      <g transform="${O(X(120,s,72,.25,r))}">
      <path d="M 120 ${s} Q 140 ${s-105}, 160 ${s-155} Q 165 ${s-205}, 145 ${s-265}" stroke="${o==="cartoon"?S:"#14532d"}" stroke-width="${o==="cartoon"?10:8}" fill="none" stroke-linecap="round" />
      ${o==="cartoon"?u`<path d="M 120 ${s} Q 140 ${s-105}, 160 ${s-155} Q 165 ${s-205}, 145 ${s-265}" stroke="#14532d" stroke-width="6" fill="none" stroke-linecap="round" />`:""}
      ${n(`M 145 ${s-265} Q 105 ${s-305}, 85 ${s-280} C 70 ${s-250}, 110 ${s-220}, 145 ${s-265} Z`,"#166534")}
      ${n(`M 145 ${s-265} Q 185 ${s-315}, 215 ${s-295} C 230 ${s-270}, 190 ${s-230}, 145 ${s-265} Z`,"#15803d")}
      ${a(`M 145 ${s-265} Q 110 ${s-278}, 90 ${s-276}`,.4)}
      ${a(`M 145 ${s-265} Q 185 ${s-285}, 212 ${s-291}`,.4)}
      </g>
      <g transform="${O(X(890,s,-68,.3,r))}">
      ${n(`M 880 ${s} Q 920 ${s-195}, 870 ${s-355} Q 845 ${s-195}, 860 ${s} Z`,"#16a34a",.9)}
      ${n(`M 920 ${s} Q 960 ${s-215}, 930 ${s-375} Q 895 ${s-205}, 900 ${s} Z`,"#22c55e",.8)}
      ${a(`M 870 ${s} Q 885 ${s-190}, 870 ${s-350}`,.3)}
      ${a(`M 910 ${s} Q 940 ${s-205}, 930 ${s-370}`,.3)}
      </g>
    </g>
  `}function mi(e,t,o,i=0){let r=o?e._getCanvasHeight():e._getCanvasHeight()-35,s=e._profile.deathFilter?`filter: grayscale(${(i*.85).toFixed(2)}) sepia(${(i*.5).toFixed(2)}) brightness(${(1-i*.45).toFixed(2)});`:`opacity: ${(1-i*.6).toFixed(2)};`;return t==="saltwater"?fi(e,r,s,i):t==="coldwater"?ui(r,R(e),B(e)):pi(r,s,R(e),B(e),i)}var ws=[[70,70,.1,-1],[150,95,.25,1],[260,60,.05,1],[380,110,.4,-1],[470,65,.15,1],[560,90,.3,-1],[650,120,.5,1],[740,70,.1,-1],[830,100,.35,1],[920,80,.2,-1],[985,60,.6,-1],[40,55,.7,1]],Ms=[[-6,1,.15,"#3f6212"],[-2,.8,.35,"#4d7c0f"],[3,.65,-.1,"#365314"],[7,.5,.25,"#65a30d"]],zt=(e,t,o)=>Math.sin(e/t)*.35+Math.sin(e/o+1.3)*.2,Zt=e=>`M${e.map(([t,o])=>`${t.toFixed(1)},${o.toFixed(1)}`).join(" L")} Z`,vs=8,He=new Map;function ks(e,t,o,i,r){let s=`${e}|${t}|${o}|${i}|${r}`,n=He.get(s);if(n)return n;let a=r-i,l=a*(.04+.16*e),c=[[t,r]];for(let x=t;x<=o;x+=8)c.push([x,r-l*(1+zt(x,37,13))]);c.push([o,r]);let d=8+62*e,f=[[t,i]],m=[[o,i]];for(let x=i;x<=r;x+=8)f.push([t+d*(1+zt(x,41,17)),x]),m.push([o-d*(1+zt(x+90,41,17)),x]);f.push([t,r]),m.push([o,r]);let p=[];for(let[x,M,w,v]of ws){let A=Math.min(1,(e-w)/.4);if(A<=0)continue;let L=Math.min(M*A,a*.3);for(let[F,U,W,pe]of Ms){let j=x+F,me=j+v*L*(.2+W),Ce=r-L*U,Ae=j+(me-j)*.3-v*5,_e=r-L*U*.55;p.push({d:`M${j},${r} Q${Ae.toFixed(1)},${_e.toFixed(1)} ${me.toFixed(1)},${Ce.toFixed(1)}`,color:pe})}}let _={bottom:Zt(c),leftWall:Zt(f),rightWall:Zt(m),strands:p};return He.size>=vs&&He.delete(He.keys().next().value),He.set(s,_),_}function _i(e,t,o){let i=e._config;if(!i)return u``;let r=i.algae_delay_hours,s=Number(i.algae_age)||0,n=s>0?s:t;if(!i.algae_enabled||n<r)return u``;let a=Math.round(Math.min(1,(n-r)/36)*1e3)/1e3,l=(.2+a*.78).toFixed(2),c=o?0:14,d=o?e._getCanvasHeight():e._getCanvasHeight()-35,f=ks(a,o?0:12,o?1024:1012,c,d);return u`
    <g id="algae-layer" opacity="${l}">
      <rect x="0" y="${c}" width="1024" height="${d-c}" fill="url(#algaeDots)" opacity="${(.15+a*.2).toFixed(2)}" />
      <path d="${f.bottom}" fill="#4d7c0f" fill-opacity="0.32" />
      <path d="${f.bottom}" fill="url(#algaeDots)" />
      <path d="${f.leftWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${f.leftWall}" fill="url(#algaeDots)" opacity="0.8" />
      <path d="${f.rightWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${f.rightWall}" fill="url(#algaeDots)" opacity="0.8" />
      ${f.strands.map(m=>u`<path d="${m.d}" fill="none" stroke="${m.color}" stroke-width="2.6" stroke-linecap="round" />`)}
    </g>
  `}var E=e=>({fins:[],marks:[],over:[],pec:null,...e}),Xt=(e,t,o)=>`M ${e},${o} Q ${e+6},${o-4} ${e+12},${o} T ${t},${o}`,Ss=e=>E({fins:[h(k("5,-42 -10,-12 10,-12"),e,{op:.9}),h(k("0,42 -8,12 8,12"),e,{op:.9}),h(ce(8,10,20,48),void 0,{stroke:"#ffffff",sw:2,lc:"round"})],tail:{at:[-22,0],mul:1,shapes:[h(k("0,0 -20,-14 -15,0 -20,14"),e)],rays:[[-20,-14],[-17,0],[-20,14]]},body:h(k("-20,0 5,-17 24,0 5,17"),e),marks:[h(ce(3,-17,3,17),void 0,{stroke:"#0f172a",sw:3})],eye:{x:16,y:-3,r:3,iris:"#ef4444"},area:[3,0,12,10]}),Cs=()=>E({tail:{at:[-20,0],mul:1,shapes:[h(k("0,0 -14,-7 -12,0 -14,7"),"rgba(255,255,255,0.7)")],rays:[[-14,-7],[-12,0],[-14,7]]},body:h($(0,0,22,9),"#1e293b"),marks:[h("M 15,-2 L -17,-2",void 0,{stroke:"#06b6d4",sw:3.5,lc:"round"}),h("M 0,3 L -17,3",void 0,{stroke:"#ef4444",sw:3.5,lc:"round"})],eye:{x:14,y:-2,r:2.2,iris:"#38bdf8"},area:[0,0,22,9]}),As=()=>E({fins:[h(b(2,0,24),"#b45309",{op:.75})],tail:{at:[-19,0],mul:1,shapes:[h("M 0,0 C -6,-8 -12,-7 -13,0 C -12,7 -6,8 0,0 Z","#c2410c",{op:.85})],rays:[[-12,-4],[-13,0],[-12,4]]},body:h(b(2,0,20),"#ea6a2a"),marks:[Xt(-14,18,-10),Xt(-14,18,-2),Xt(-14,18,6)].map(e=>h(e,void 0,{stroke:"#22d3ee",sw:1.8,op:.85,lc:"round"})),eye:{x:15,y:-3,r:2.6,iris:"#dc2626"},area:[2,0,14,14]}),Ts=()=>E({fins:[h(k("-4,-6 4,-14 10,-6"),"#f97316",{op:.9})],tail:{at:[-16,0],mul:1,shapes:[h("M 0,0 C -8,-12 -22,-15 -29,-8 C -26,-3 -26,3 -29,8 C -22,15 -8,12 0,0 Z","#f97316",{op:.92}),h(b(-18,-6,2.2),"#1e3a8a",{op:.8}),h(b(-22,4,2.6),"#1e3a8a",{op:.8}),h(b(-14,5,1.6),"#1e3a8a",{op:.7})],rays:[[-29,-8],[-27,0],[-29,8]]},body:h($(0,0,17,7.5),"#38bdf8"),marks:[h($(-2,3.5,13,3),"#e0f2fe",{op:.55}),h($(5,-2.5,6,2.2),"#0ea5e9",{op:.5})],eye:{x:12,y:-2,r:2.2},area:[0,0,13,6]}),Es=()=>E({tail:{at:[-19,0],mul:1,shapes:[h(k("0,0 -12,-8 -9,0 -12,8"),"#fdba74",{op:.9})],rays:[[-12,-8],[-9,0],[-12,8]]},body:h($(0,0,19,10),"#fb923c"),marks:[h($(-1,6,13,3),"#fde68a",{op:.55}),h("M 6,-8.5 C 9,-4 9,4 6,8.5 C -2,8 -10,4 -16,1 C -10,-1 -2,-5 6,-8.5 Z","#111827")],eye:{x:13,y:-3,r:2.4,iris:"#fde68a"},area:[0,-1,14,7]}),Ls=()=>E({fins:[h(k("-14,-12 -3,-22 8,-12"),"#f97316",{op:.85}),h(k("-16,12 -4,20 10,12"),"#f97316",{op:.85}),h("M 12,8 C 18,16 20,24 18,32",void 0,{stroke:"#f97316",sw:.9,lc:"round"})],tail:{at:[-21,0],mul:1,shapes:[h("M 0,0 C -8,-9 -14,-8 -15,0 C -14,8 -8,9 0,0 Z","#3b82f6",{op:.85})],rays:[[-13,-5],[-15,0],[-13,5]]},body:h($(0,0,21,14),"#3b82f6"),marks:[-12,-6,0,6,12].map((e,t)=>h(`M ${e-4},-12 L ${e+2},12`,void 0,{stroke:t%2?"#1d4ed8":"#f97316",sw:1.6,op:.85})),eye:{x:14,y:-4,r:2.8,iris:"#fef3c7"},area:[0,0,17,11]}),Fs=()=>{let e=t=>h(t,"#ffffff",{stroke:"#0f172a",sw:1.4});return E({tail:{at:[-20,0],mul:1,shapes:[h("M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z","#ea580c",{stroke:"#0f172a",sw:1.4})],rays:[[-15,-6],[-17,0],[-15,6]]},body:h($(0,0,24,15),"#f97316"),marks:[e("M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z"),e("M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z"),e("M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z")],pec:{at:[3,3],shapes:[h($(0,6,6,10),"#f97316",{op:.9,stroke:"#0f172a",sw:1})]},eye:{x:15,y:-4,r:3.2},area:[0,0,22,13]})},Rs=()=>E({tail:{at:[-25,0],mul:1,shapes:[h(k("0,-2 -20,-13 -13,-2 -20,9 0,2"),"#f59e0b"),h(k("0,-2 -17,-10 -12,-2 -17,7 0,1"),"#fde047",{op:.85})],rays:[[-20,-13],[-13,-2],[-20,9]]},body:h("M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z","url(#tangBodyGrad)"),marks:[h("M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z","#0f172a",{op:.88})],over:[h(b(19,2,1.5),"#facc15",{op:.8})],eye:{x:18,y:-6,r:2.8,iris:"#0f172a",hl:"#93c5fd"},area:[-2,0,20,16]}),Os=()=>E({fins:[h("M -16,-8 C -8,-17 8,-16 14,-9 Z","#facc15",{op:.9})],tail:{at:[-22,0],mul:1,shapes:[h("M 0,0 C -8,-9 -14,-9 -15,0 C -14,9 -8,9 0,0 Z","#facc15")],rays:[[-13,-5],[-15,0],[-13,5]]},body:h($(0,0,22,10.5),"#facc15"),marks:[h("M -4,-10.3 A 22,10.5 0 0,1 22,0 A 22,10.5 0 0,1 -4,10.3 C 3,5 3,-5 -4,-10.3 Z","#7c3aed"),h("M 10,-3 L 22,-1",void 0,{stroke:"#1e1b4b",sw:1.4,lc:"round"})],eye:{x:16,y:-3,r:2.6,iris:"#fde68a"},area:[0,0,18,8]}),Is=()=>{let e=(t,o)=>h(t,void 0,{stroke:"#ea580c",sw:1.3,op:o});return E({tail:{at:[-22,0],mul:1,shapes:[h(k("0,0 -12,-9 -8,0 -12,9"),"#fbbf24",{op:.9})],rays:[[-12,-9],[-8,0],[-12,9]]},body:h($(0,0,23,20),"url(#butterflyBodyGrad)"),marks:[e(ce(-14,-16,-8,17),.55),e(ce(-6,-19,0,19),.55),e(ce(2,-19,7,19),.55),e(ce(10,-17,14,16),.5)],over:[h("M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z","#fbbf24"),h(b(-15,0,3),"#1f2937",{op:.8}),h(b(-15,0,1.6),"#fbbf24",{op:.9})],eye:{x:12.5,y:-4,r:2.6,iris:"#0f172a",hl:"#e2e8f0"},area:[0,0,20,17]})},Bs=()=>E({fins:[h(k("-14,-15 0,-24 16,-12"),"#fde047",{op:.95}),h(k("-12,15 2,23 16,12"),"#fde047",{op:.95})],tail:{at:[-22,0],mul:1,shapes:[h(k("0,0 -12,-10 -8,0 -12,10"),"#fde047")],rays:[[-12,-10],[-8,0],[-12,10]]},body:h($(0,0,22,17),"#fde047"),marks:[h($(2,8,16,6),"#fef9c3",{op:.7})],over:[h("M 20,-3 Q 27,-1 28,0 Q 27,1 20,3 Z","#fde047"),h(b(-19,0,1.6),"#ffffff",{op:.9})],eye:{x:14,y:-5,r:2.6,iris:"#ffffff"},area:[0,0,17,14]}),Ns=()=>E({fins:[h(k("-6,-7 4,-14 12,-7"),"#2dd4bf",{op:.9}),h(k("-8,7 0,12 8,7"),"#2dd4bf",{op:.9})],tail:{at:[-20,0],mul:1,shapes:[h(k("0,0 -14,-11 -9,0 -14,11"),"#2dd4bf")],rays:[[-14,-11],[-9,0],[-14,11]]},body:h($(0,0,20,8.5),"url(#chromisGrad)"),marks:[h($(0,4,15,2.6),"#e0f2fe",{op:.45})],eye:{x:14,y:-2,r:2.2},area:[0,0,16,7]}),Ps=()=>E({fins:[h(k("-12,-8 4,-20 14,-8"),"#fb923c",{op:.9})],tail:{at:[-21,0],mul:1,shapes:[h("M 0,0 L -8,-10 L -18,-16 L -8,-3 L -7,0 L -8,3 L -18,16 L -8,10 Z","#fb923c")],rays:[[-18,-16],[-7,0],[-18,16]]},body:h($(0,0,21,9),"#f97316"),marks:[h($(0,4.5,15,3.6),"#f9a8d4",{op:.65})],eye:{x:15,y:-2,r:2.4,iris:"#fde68a"},area:[0,0,16,7]}),Us=e=>E({fins:[h("M -4,-20 C 2,-33 18,-31 21,-18 Z",e,{op:.8})],tail:{at:[-14,0],mul:1.1,shapes:[h("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z",e,{op:.88})],rays:[[-35,-11],[-43,17],[-21,34]]},body:h("M -14,4 C -16,-12 -4,-26 10,-22 C 22,-19 28,-8 27,2 C 26,12 18,18 8,18 C -4,18 -14,14 -14,4 Z",e),marks:[h($(4,9,12,6),"#ffffff",{op:.75}),h($(-4,-10,7,4),"#ffffff",{op:.55})],eye:{x:21,y:-3,r:3.4},area:[6,0,15,15]}),Ds=e=>E({fins:[h(k("-4,-16 4,-25 14,-17"),e,{op:.85})],tail:{at:[-16,0],mul:1,shapes:[h("M 0,0 L -48,-19 L -30,-1 Z",e,{op:.92}),h("M 0,0 L -48,19 L -30,1 Z",e,{op:.8})],rays:[[-48,-19],[-48,19]]},body:h("M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z",e),marks:[h($(6,-5,10,4),"#ffffff",{op:.65}),h($(-3,5,8,3.5),"#ffffff",{op:.55})],eye:{x:20,y:-3,r:3},area:[6,0,17,13]}),Hs=e=>E({tail:{at:[-14,0],mul:.8,shapes:[h("M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z",e,{op:.88})],rays:[[-30,-2],[-30,6]]},body:h(b(4,2,22),e),marks:[[-8,-4],[0,-12],[10,-10],[-10,6],[-2,0],[8,-2],[16,4],[-4,12],[6,10],[14,14]].map(([t,o])=>h(b(t,o,3.4),"#ffffff",{op:.32})),eye:{x:20,y:-1,r:3},area:[4,2,17,17]}),qs=()=>E({fins:[h("M -6,-15 C 0,-27 14,-26 15,-14 Z","#fecdd3",{op:.85})],tail:{at:[-15,0],mul:1,shapes:[h("M 0,0 C -8,-16 -24,-20 -38,-13 C -31,-7 -30,-2 -32,3 C -28,10 -36,15 -38,19 C -24,22 -8,16 0,0 Z","#fecdd3",{op:.88})],rays:[[-38,-13],[-32,3],[-38,19]]},body:h($(4,2,21,17),"#ffedd5"),marks:[h($(-2,-6,14,7),"#fdba74",{op:.55})],over:[[22,-6,6],[16,-13,6.5],[8,-15,6],[1,-12,5]].map(([e,t,o])=>h(b(e,t,o),"#dc2626")),eye:{x:22,y:0,r:3},area:[4,3,16,13]}),Vs=()=>E({fins:[h("M -4,-18 C 2,-30 18,-28 20,-16 Z","#1f2937",{op:.85})],tail:{at:[-14,0],mul:1.1,shapes:[h("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z","#1f2937",{op:.9})],rays:[[-35,-11],[-43,17],[-21,34]]},body:h(b(6,1,21),"#111827"),marks:[h($(2,-9,12,5),"#475569",{op:.45})],over:[h($(23,-6,10.5,9),"#1f2937")],eye:{x:24,y:-6,r:6,iris:"#f59e0b"},area:[6,1,16,15]}),Gs=()=>E({fins:[h(k("-6,-14 4,-24 14,-14"),"#dbeafe",{op:.85})],tail:{at:[-20,0],mul:1,shapes:[h("M 0,0 C -10,-15 -28,-15 -34,-5 L -30,0 L -34,5 C -28,15 -10,15 0,0 Z","#dbeafe",{op:.85})],rays:[[-34,-5],[-30,0],[-34,5]]},body:h($(2,0,24,14),"#bfdbfe"),marks:[h($(-8,-4,9,6),"#f97316"),h($(9,4,6,4.5),"#dc2626"),h(b(2,-8,2.2),"#1e3a8a",{op:.75}),h(b(-2,7,1.8),"#111827",{op:.7}),h(b(14,-5,1.6),"#111827",{op:.7})],eye:{x:20,y:-3,r:3},area:[2,0,19,11]}),gi=[Ss,Cs,As,Ts,Es,Ls],$i=[Fs,Rs,Os,Is,Bs,Ns,Ps],yi=[Us,Ds,Hs,qs,Vs,Gs],Na={freshwater:gi.length,saltwater:$i.length,coldwater:yi.length};function bi(e,t){let o=t.color||"#3b82f6",i=e==="saltwater"?$i:e==="coldwater"?yi:gi,r=Math.abs(Math.trunc(Number(t.species)))||0;return T(`fish|${e==="saltwater"||e==="coldwater"?e:"freshwater"}|${r%i.length}|${o}`,()=>i[r%i.length](o))}var js=u``,dt=11,zs=2.399963,Zs=Array.from({length:dt},(e,t)=>{let o=Math.sqrt((t+.5)/dt)*.85,i=t*zs;return[o*Math.cos(i),o*Math.sin(i),.75+t*7%3*.3]});function Xs(e){return e>0?Math.min(dt,Math.ceil(e*dt)):0}function we(e,t,o,i=1.7){let r=Xs(e);if(r===0)return js;let[s,n,a,l]=t,c=Math.min(1,.35+e);return u`
    <g class="stress-dots" pointer-events="none">
      ${Zs.slice(0,r).map(([d,f,m],p)=>{let _=.8+.2*Math.sin(o*5+p*1.7);return u`<circle cx="${(s+d*a).toFixed(1)}" cy="${(n+f*l).toFixed(1)}" r="${(i*m).toFixed(2)}" fill="#ffffff" fill-opacity="${(c*_).toFixed(2)}" stroke="#0f172a" stroke-opacity="${(.28*c).toFixed(2)}" stroke-width="0.4" />`})}
    </g>
  `}function Ys(e){return T(`scales|${e.join(",")}`,()=>Qs(e))}function Qs(e){let[t,o,i,r]=e,s=[],n=0;for(let a=o-r*.7;a<=o+r*.7;a+=5){for(let l=t-i*.8+n%2*3;l<=t+i*.8;l+=6)((l-t)/i)**2+((a-o)/r)**2<=.72&&s.push(`M${l.toFixed(1)},${a.toFixed(1)} q3,2.4 6,0`);n++}return s.join(" ")}function Ws(e,t){let o=t.iris??"#ffffff",i=t.hl??"#ffffff";if(e==="cartoon"){let r=t.r*2.1;return u`
      <circle cx="${t.x}" cy="${t.y}" r="${r}" fill="#ffffff" stroke="${S}" stroke-width="1.5" />
      <circle cx="${t.x+r*.12}" cy="${t.y+r*.1}" r="${r*.6}" fill="#111827" />
      <circle cx="${t.x+r*.3}" cy="${t.y-r*.28}" r="${r*.26}" fill="#ffffff" />
      <circle cx="${t.x-r*.12}" cy="${t.y+r*.3}" r="${r*.12}" fill="#ffffff" />
    `}return e==="realistic"?u`
      <circle cx="${t.x}" cy="${t.y}" r="${t.r*1.15}" fill="${o==="#ffffff"?"#fef3c7":o}" stroke="#111827" stroke-opacity="0.8" stroke-width="0.9" />
      <circle cx="${t.x+.4}" cy="${t.y}" r="${t.r*.62}" fill="#000000" />
      <circle cx="${t.x-t.r*.3}" cy="${t.y-t.r*.4}" r="${t.r*.28}" fill="${i}" />
    `:u`
    <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="${o}" />
    <circle cx="${t.x+1}" cy="${t.y}" r="${t.r*.48}" fill="#0f172a" />
    <circle cx="${t.x+.4}" cy="${t.y-t.r*.4}" r="${t.r*.2}" fill="${i}" />
  `}function Ks(e,t,o){let[i,r,s,n]=o.area,a=o.eye;return e==="cartoon"?u`
      ${g(h($(a.x-a.r*.4,a.y+a.r*3.1,a.r*1.3,a.r*.8),"#fb7185",{op:.7,stroke:"none"}))}
      ${g(h(`M${a.x+a.r*.6},${a.y+a.r*2.7} q${a.r*1.2},${a.r*1.1} ${a.r*2.4},0`,void 0,{stroke:S,sw:1.3,lc:"round"}))}
    `:e==="realistic"?u`
      ${t?u`<path d="${o.body.d}" fill="url(#shade)" />`:""}
      ${g(h(Ys(o.area),void 0,{stroke:"#0f172a",sw:.8,op:.22}))}
      ${g(h($(i-s*.15,r-n*.62,s*.6,Math.max(1.4,n*.13)),"#ffffff",{op:.3}))}
    `:u`
    ${g(h($(i,r+n*.55,s*.85,n*.4),"#ffffff",{op:.14}))}
    ${g(h(`M${a.x-a.r*1.6},${a.y+a.r*.8} q${-a.r*.9},${a.r*2.2} 0,${a.r*4.4}`,void 0,{stroke:"#0f172a",sw:1,op:.22,lc:"round"}))}
  `}function Js(e,t,o,i,r,s=0,n=0){let a=en(e,t,o);return u`
    ${a.fins}
    <g transform="translate(${o.tail.at[0]}, ${o.tail.at[1]}) rotate(${i*o.tail.mul})">
      ${a.tail}
    </g>
    ${a.body}
    ${we(s,o.area,n)}
    ${o.pec?u`<g transform="translate(${o.pec.at[0]}, ${o.pec.at[1]}) rotate(${r})">${a.pec}</g>`:""}
    ${a.eye}
  `}function en(e,t,o){let i=xi.get(o);i||xi.set(o,i=new Map);let r=`${e}|${t}`,s=i.get(r);if(!s){let n=e==="cartoon",a=e==="cartoon"?[]:o.tail.rays,l=e==="realistic"?.32:.16;s={fins:u`${o.fins.map(c=>g(c,n))}`,tail:u`
        ${o.tail.shapes.map(c=>g(c,n))}
        ${a.map(([c,d])=>g(h(`M0,0 L${c},${d}`,void 0,{stroke:"#0f172a",sw:.9,op:l})))}
      `,body:u`
        ${g(o.body,n)}
        ${o.marks.map(c=>g(c,n))}
        ${Ks(e,t,o)}
        ${o.over.map(c=>g(c,n))}
      `,pec:o.pec?u`${o.pec.shapes.map(c=>g(c,n))}`:u``,eye:Ws(e,o.eye)},i.set(r,s)}return s}var xi=new WeakMap;function wi(e,t,o,i){let r=t.dir===-1,s=t.deathProgress||0,n=t.scale||1.4,a=(1-s).toFixed(2),l=s.toFixed(2),c=i?0:t.scare||0,d=i?0:Math.sin(e._animTime*(3.5*t.vx)+t.phase)*14*(1+.8*c),f=i?0:Math.sin(e._animTime*(4.5*t.vx)+t.phase)*10,m=i?0:t.stress||0,p=Js(R(e),B(e),bi(o,t),d,f,m,e._ambientTime);return u`
    <g transform="scale(${r?-n:n}, ${i?-n:n})">
      <g opacity="${a}">${p}</g>${s>0?u`
            <g opacity="${l}">
              <!-- Fish Spine -->
              <line x1="-28" y1="0" x2="16" y2="0" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
              <!-- Fish ribs -->
              <path d="M -20,-8 L -16,0 L -20,8 M -12,-11 L -8,0 L -12,11 M -4,-12 L 0,0 L -4,12 M 4,-10 L 8,0 L 4,10" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" fill="none" />
              <!-- Tail fin rays -->
              <path d="M -28,0 L -36,-10 M -28,0 L -38,0 M -28,0 L -36,10" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" />
              <!-- Skull -->
              <path d="M 12,-9 C 24,-9 27,0 25,9 C 18,9 14,5 12,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
              <circle cx="18" cy="-2" r="2.8" fill="#0f172a" />
            </g>
          `:""}
    </g>
  `}function Yt(e,t){let o=`M${e[0]},${e[1]}`;for(let r of t)o+=` C${r.join(",")}`;let i=[e,...t.map(r=>[r[4],r[5]])];for(let r=t.length-1;r>=0;r--){let[s,n,a,l]=t[r];o+=` C${-a},${l} ${-s},${n} ${-i[r][0]},${i[r][1]}`}return`${o} Z`}function Ve(e,t,o){return{k:(s,n,a)=>N(e,t,s,n,{...e==="cartoon"?{}:o,...a===void 0?{}:{op:a}}),line:(s,n,a,l)=>g(h(s,void 0,{stroke:a,sw:n,op:l,lc:"round"}))}}var tn=[[-24,8,"M -24,8 L -27,16 L -31,21"],[-16,9,"M -16,9 L -17,17 L -20,22"],[-8,9,"M -8,9 L -8,17 L -10,22"],[0,9,"M 0,9 L 1,17 L 0,22"]],on=[[22,-4,"M 22,-4 L 33,-11 L 42,-6","M 22,-4 L 33,-11"],[24,1,"M 24,1 L 36,1 L 44,7","M 24,1 L 36,1"],[22,7,"M 22,7 L 32,14 L 38,24","M 22,7 L 32,14"],[16,12,"M 16,12 L 22,22 L 25,32","M 16,12 L 22,22"]],Me=e=>u`${e}<g transform="scale(-1,1)">${e}</g>`;function qe(e,t,o){return u`
    ${g(h(b(e,t,o),"#ffffff",{stroke:S,sw:1.2}))}
    ${g(h(b(e+o*.15,t+o*.1,o*.58),"#111827",{stroke:"none"}))}
    ${g(h(b(e+o*.32,t-o*.3,o*.24),"#ffffff",{stroke:"none"}))}
  `}function Mi(e,t,o){let i=T(`ancistrus|${e}|${t}`,()=>rn(e,t));return u`${i.before}<g transform="translate(0, 3) scale(${o},${o})">${i.mouth}</g>${i.after}`}function rn(e,t){let o=e==="cartoon",{k:i,line:r}=Ve(e,t,{stroke:"#0a0f14",sw:.8}),s=Array.from({length:18},(c,d)=>{let f=d/18*Math.PI*2,[m,p]=[Math.cos(f),Math.sin(f)];return`M${(m*6.5).toFixed(1)},${(p*5).toFixed(1)} L${(m*8.6).toFixed(1)},${(p*6.7).toFixed(1)}`}).join(" "),n=u`
    ${i(Yt([0,73],[[3,75,8,80,9,89],[6,91,2,88,0,84]]),"#182026")}
    ${e==="cartoon"?"":Me(r("M 1,76 L 6,88 M 1,76 L 8,86",.7,"#64748b",.5))}
    ${Me(u`
      ${i("M 15,12 C 24,12 32,20 34,32 C 33,38 28,40 24,36 C 19,30 16,22 15,16 Z","#182026")}
      ${o?"":r("M 16,15 L 33,26 M 16,17 L 33,32 M 17,19 L 30,37 M 18,20 L 25,37",.7,"#64748b",.5)}
      ${r("M 15,12 C 24,12 31,19 34,31",1.5,"#64748b",.9)}
      ${i("M 9,38 C 15,40 20,47 19,55 C 16,57 12,53 10,48 Z","#182026")}
      ${o?"":r("M 10,41 L 18,52 M 11,43 L 15,54",.6,"#64748b",.5)}
      ${i("M 4,60 C 7,60 9,64 8,68 C 6,68 4,66 3,64 Z","#182026")}
    `)}
    ${i(Yt([0,-11],[[7,-11,13,-8,15,-1],[17,6,18,12,16,18],[14,28,11,42,8,56],[6,64,3,71,0,75]]),"#1e293b")}
    ${i(Yt([0,14],[[7,14,10,22,9,32],[8,44,6,56,4,66],[3,69,2,71,0,72]]),"#475569",.9)}
    ${e==="flat"?[[-3,24,1.2],[4,30,1],[-5,38,1.3],[3,46,1],[-3,54,1.2],[2,62,.9],[-1,32,.8],[5,52,.8]].map(([c,d,f])=>g(h(b(c,d,f),"#ffffff",{op:.7,stroke:"none"}))):""}
    ${e==="realistic"?Me(r("M 12,20 C 10,34 8,48 5,62",.9,"#0a0f14",.4)):""}
    ${Me(u`
      ${r("M 6,-8 C 9,-12 12,-14 13,-19",2.2,"#3b4a5f",1)}
      ${r("M 10,-14 C 13,-15 15,-17 16,-20",1.6,"#3b4a5f",1)}
      ${r("M 2.5,-10 C 3.5,-14 3,-18 1.5,-21",2.2,"#3b4a5f",1)}
    `)}
  `,a=u`
      ${g(h($(0,0,9.2,7.2),"#64748b",{stroke:"#0a0f14",sw:.9}))}
      ${e==="cartoon"?"":r(s,.6,"#94a3b8",.7)}
      ${g(h($(0,0,6.3,4.8),"#334155",{stroke:"#0a0f14",sw:.7}))}
      ${g(h($(0,0,3.4,2.5),"#0f172a",{stroke:"none"}))}
  `,l=u`
    ${o?u`${qe(-9,-3,3.8)}${qe(9,-3,3.8)}${g(h($(-13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}${g(h($(13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}`:Me(u`${g(h(b(12.3,-3,1.7),"#0a0f14",{stroke:"none"}))}${g(h(b(12.7,-3.5,.5),"#f1f5f9",{stroke:"none"}))}`)}
    ${e==="realistic"?g(h($(-4,34,2.4,14),"#ffffff",{op:.1,stroke:"none"})):""}
  `;return{before:n,mouth:a,after:l}}function vi(e,t,o={}){let{phase:i=0,stride:r=0,time:s=0}=o,{line:n}=Ve(e,t,{stroke:"#7f1d1d",sw:.8}),a=ki,l=Qt[2],c=[0,1,2,3,4].map(f=>{let m=-110+f*13,p=8-f*.8,[_,x]=a(m,l-p),[M,w]=a(m,l-p-4.5),v=.3*Math.sin(s*6+f*1.1),[A,L]=[M-_,w-x],[F,U]=[_+A*Math.cos(v)-L*Math.sin(v),x+A*Math.sin(v)+L*Math.cos(v)];return`M${_.toFixed(1)},${x.toFixed(1)} L${F.toFixed(1)},${U.toFixed(1)}`}).join(" "),d=tn.map(([f,m,p],_)=>u`<g transform="rotate(${(r*16*Math.sin(i+_*1.7)).toFixed(1)} ${f} ${m})">${n(p,1.6,"#7f1d1d",.85)}</g>`);return u`
    ${d}
    ${n(c,1.3,"#7f1d1d",.7)}
    ${T(`shrimp|${e}|${t}`,()=>sn(e,t))}
  `}var Qt=[22,28,27];function ki(e,t=Qt[2]){let[o,i]=Qt;return[o+t*Math.cos(e*Math.PI/180),i+t*Math.sin(e*Math.PI/180)]}function sn(e,t){let o=e==="cartoon",{k:i,line:r}=Ve(e,t,{stroke:"#7f1d1d",sw:.8}),s=ki,n=[4,3,2,1,0].map(d=>{let f=-110+d*13,[m,p]=s(f),_=8-d*.8;return u`<g transform="rotate(${f} ${m.toFixed(1)} ${p.toFixed(1)})">${i($(Number(m.toFixed(1)),Number(p.toFixed(1)),_,6.6-d*.25),d%2?"#c81e1e":"#d42424")}</g>`}),[a,l]=s(-45);return u`
    <g transform="translate(${a.toFixed(1)} ${l.toFixed(1)}) rotate(${45})">
      ${i("M 0,-2.4 C 5,-9.5 11,-10.5 14,-7 C 11,-3.2 6,-1 0,0 Z","#dc2626")}
      ${i("M 0,2.4 C 5,9.5 11,10.5 14,7 C 11,3.2 6,1 0,0 Z","#dc2626")}
      ${i("M 0,-3 C 6,-3 11,-1.6 15,0 C 11,1.6 6,3 0,3 Z","#ef4444")}
      ${o?"":r("M 2,-1.5 L 12,-7 M 2,0 L 13,0 M 2,1.5 L 12,7",.7,"#7f1d1d",.5)}
    </g>
    ${n}
    ${i("M -34,-3 C -34,-11 -25,-16 -12,-16 C 0,-16 10,-12 13,-4 C 15,1 12,6 6,8 L -14,8 C -27,8 -34,3 -34,-3 Z","#dc2626")}
    ${o?"":r("M -28,-12 C -18,-17 -2,-17 8,-14 C 12,-14 14,-12 16,-9",2.2,"#fef2f2",.85)}
    ${i("M -33,-9 L -50,-13 L -35,-3 Z","#dc2626")}
    ${r("M -32,-12 Q -60,-24 -88,-30 M -30,-9 Q -54,-12 -80,-10",1.1,"#fef9c3",.9)}
    ${r("M -33,-9 Q -44,-8 -50,-2",1,"#fef9c3",.8)}
    ${o?u`${qe(-26,-12,5)}${g(h($(-22,-2,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${g(h("M -32,-4 Q -28,1 -23,-3",void 0,{stroke:S,sw:1.2,lc:"round"}))}`:u`
          ${g(h(b(-27,-13,3),"#0f172a",{stroke:"none"}))}
          ${g(h(b(-27.8,-14,.9),"#f1f5f9",{stroke:"none"}))}
        `}
    ${e==="flat"?[[-22,-7],[-14,-10],[-6,-10],[1,-7]].map(([d,f])=>g(h(b(d,f,1.5),"#fef2f2",{op:.9,stroke:"none"}))):""}
    ${e==="realistic"?g(h($(-8,-14,12,1.6),"#ffffff",{op:.35,stroke:"none"})):""}
  `}function Si(e,t,o={}){let{phase:i=0,stride:r=0}=o,s=e==="cartoon",{k:n,line:a}=Ve(e,t,{stroke:"#7c2d12",sw:.9}),l=T(`crab-claw|${e}|${t}`,()=>u`
        ${a("M 20,-8 L 30,-17",s?4:3.4,"#7c2d12",1)}
        ${n("M 27,-19 C 25,-30 34,-36 41,-33 C 46,-30 45,-25 41,-24 C 45,-21 43,-16 38,-16 C 33,-16 29,-17 27,-19 Z","#ea580c")}
        ${n("M 31,-31 C 33,-40 42,-42 46,-37 C 42,-38 38,-36 36,-32 Z","#ea580c")}
        ${e==="cartoon"?"":g(h("M 36,-28 L 39,-31 L 40,-27 L 43,-29 M 34,-21 L 38,-22 L 38,-19 L 42,-20",void 0,{stroke:"#fef3c7",sw:.9,lc:"round",op:.8}))}
      `),c=d=>{let f=p=>(r*13*Math.sin(i+p*Math.PI+d*Math.PI)).toFixed(1),m=on.map(([p,_,x,M],w)=>u`
      <g transform="rotate(${f(w)} ${p} ${_})">
        ${a(x,s?3.2:2.6,"#7c2d12",1)}
        ${s?"":a(M,.8,"#f87171",.5)}
      </g>
    `);return u`
      ${m}
      <g transform="rotate(${(r*5*Math.sin(i*.7+d*1.3)).toFixed(1)} 20 -8)">${l}</g>
    `};return u`
    ${c(0)}<g transform="scale(-1,1)">${c(1)}</g>
    ${T(`crab-body|${e}|${t}`,()=>nn(e,t))}
  `}function nn(e,t){let o=e==="cartoon",{k:i,line:r}=Ve(e,t,{stroke:"#7c2d12",sw:.9});return u`
    ${i("M 0,-15 C 10,-16 20,-14 26,-8 L 30,-2 L 27,4 C 24,12 14,18 0,18 C -14,18 -24,12 -27,4 L -30,-2 L -26,-8 C -20,-14 -10,-16 0,-15 Z","#dc2626")}
    ${i("M 0,-11 C 9,-12 17,-10 22,-5 L 24,0 C 22,8 12,13 0,13 C -12,13 -22,8 -24,0 L -22,-5 C -17,-10 -9,-12 0,-11 Z","#ef4444",.55)}
    ${e==="cartoon"?"":u`
          ${r("M -14,-6 Q 0,-13 14,-6 M -16,2 Q 0,-4 16,2 M 0,-12 L 0,12",.9,"#7f1d1d",.4)}
          ${e==="flat"?[[-9,3,1.6],[9,4,1.6],[0,8,1.4],[6,-5,1.2],[-7,-4,1.2]].map(([s,n,a])=>g(h(b(s,n,a),"#fca5a5",{op:.85,stroke:"none"}))):""}
        `}
    ${Me(u`${r("M 6,-15 L 7,-21",1.4,"#7c2d12",1)}${o?"":g(h(b(7,-22,2.2),"#0f172a",{stroke:"none"}))}`)}
    ${o?u`${qe(-7,-23,5)}${qe(7,-23,5)}${g(h("M -6,8 Q 0,14 6,8",void 0,{stroke:S,sw:1.4,lc:"round"}))}${g(h($(-15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${g(h($(15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}`:""}
    ${e==="realistic"?g(h($(-7,-8,11,2.2),"#ffffff",{op:.3,stroke:"none"})):""}
  `}var Ci=(e,t,o)=>({phase:e.walk||0,stride:t?0:e.stride||0,time:o}),Wt=(e,t,o,i)=>we(t?0:e.stress||0,o,i,1.5);function Ai(e,t){if(!e._ancistrus)return u``;let o=e._ancistrus,i=o.deathProgress||0,r=(1-i).toFixed(2),s=t?1:Number((1+Math.sin(e._ambientTime*1.6)*.07).toFixed(3)),n=R(e),a=B(e);return u`
    <g transform="translate(${o.x}, ${o.y}) rotate(${t?0:(o.heading??0).toFixed(1)}) scale(1.5,${t?-1.5:1.5})">
      <g opacity="${r}">
        ${Mi(n,a,s)}
        ${Wt(o,t,[0,30,11,38],e._ambientTime)}
      </g>

      ${i>0?u`
            <g opacity="${i.toFixed(2)}">
              <!-- Main Ancistrus Spine -->
              <line x1="0" y1="-15" x2="0" y2="70" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
              <!-- Ancistrus ribs -->
              <path d="M -12,10 L 0,16 L 12,10 M -14,24 L 0,30 L 14,24 M -12,38 L 0,44 L 12,38 M -9,52 L 0,56 L 9,52 M -6,64 L 0,66 L 6,64" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" fill="none" />
              <!-- Sucker disc bone -->
              <ellipse cx="0" cy="-6" rx="8" ry="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
              <circle cx="-3" cy="-7" r="1.5" fill="#0f172a" />
              <circle cx="3" cy="-7" r="1.5" fill="#0f172a" />
            </g>
          `:""}
    </g>
  `}function Ti(e,t){if(!e._shrimp)return u``;let o=e._shrimp,r=(1-(o.deathProgress||0)).toFixed(2),s=o.dir===-1?-1:1,n=-s,a=t?0:o.pitch||0,l=t?0:o.lift||0;return u`
    ${l>1.5?u`<ellipse cx="${o.x.toFixed(1)}" cy="${((o.floorY??o.y+l)+7).toFixed(1)}" rx="${(26-Math.min(l,120)*.1).toFixed(1)}" ry="3.5" fill="#0f172a" opacity="${(.22*(1-Math.min(l,120)/160)).toFixed(2)}" />`:""}
    <g transform="translate(${o.x}, ${o.y}) rotate(${(-a*s).toFixed(1)}) scale(${n*1.5}, ${t?-1.5:1.5})" opacity="${r}">
      ${vi(R(e),B(e),Ci(o,t,e._ambientTime))}
      ${Wt(o,t,[-4,-3,24,8],e._ambientTime)}
    </g>
  `}function Ei(e,t){if(!e._crab)return u``;let o=e._crab,i=o.deathProgress||0,r=Math.max(0,Math.min(1,o.hide||0)),s=((1-i)*(1-r*.92)).toFixed(2),n=o.dir===-1?-1:1,a=Number((1.4*(1-r*.6)).toFixed(3)),l=r>.85&&!t?Math.min(1,(r-.85)/.15):0;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(${n*a}, ${t?-a:a})" opacity="${s}">
      ${Si(R(e),B(e),Ci(o,t,e._ambientTime))}
      ${Wt(o,t,[0,2,21,11],e._ambientTime)}
    </g>
    ${l>0?u`
          <g transform="translate(${o.x}, ${(o.y-22*a).toFixed(1)})" opacity="${l.toFixed(2)}">
            <circle cx="-6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="-5.4" cy="0.4" r="1.9" fill="#0f172a" />
            <circle cx="6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="6.6" cy="0.4" r="1.9" fill="#0f172a" />
          </g>
        `:""}
  `}function Li(e){return u`
    <g>
      ${e._flowBubbles.filter(t=>t.active).map(t=>u`<circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="${t.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`)}
    </g>
  `}function Fi(e){return e._food.length?u`
    <g>
      ${e._food.map(t=>u`<ellipse cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" rx="${t.r.toFixed(1)}" ry="${(t.r*.6).toFixed(1)}" fill="${t.color}" stroke="#b45309" stroke-width="0.6" />`)}
    </g>
  `:u``}function Ri(e){if(!e._ripples.length)return u``;let t=Date.now();return u`
    <g>
      ${e._ripples.map(o=>{let i=Math.min(1,(t-o.born)/st),r=(1-i).toFixed(2);return u`
          <circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(14+i*150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5-i*3).toFixed(1)}" stroke-opacity="${r}" />
          ${e._profile.doubleRipple?u`<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(6+i*90).toFixed(1)}" fill="#ffffff" fill-opacity="${(.28*(1-i)).toFixed(2)}" />`:""}
        `})}
    </g>
  `}function Oi(e){return u`
    <g>
      ${e.map(t=>u`
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
        `)}
    </g>
  `}function Ii(e){return u`
    <g>
      ${e.map(t=>u`
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
        `)}
    </g>
  `}function Bi(e,t){if(!t)return u``;let o=at(t.total,Z(e._hass));return u`
    <g transform="translate(512, 96)" pointer-events="none">
      <text font-family="system-ui, sans-serif" font-size="54" font-weight="800" text-anchor="middle" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${o}</text>
    </g>
  `}function Ni(e){return!e._config?.show_fps||!e._fpsInfo?u``:u`
    <g pointer-events="none">
      <rect x="292" y="6" width="440" height="30" rx="8" fill="#000000" fill-opacity="0.72" />
      <text x="512" y="27" font-family="monospace" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${e._fpsInfo}</text>
    </g>
  `}function Pi(e,t,o){if(!t)return u``;let i=o?112:24+(e._config?.show_fps?38:0),r=J(Z(e._hass),"label_sensor_unavailable");return u`
    <g transform="translate(0, ${i})" pointer-events="none">
      <rect x="362" y="0" width="300" height="34" rx="17" fill="#000000" fill-opacity="0.72" />
      <path d="M383 25 L393 8 L403 25 Z" fill="#f59e0b" />
      <rect x="392" y="13" width="2" height="7" fill="#0f172a" />
      <circle cx="393" cy="22.4" r="1.3" fill="#0f172a" />
      <text x="416" y="23" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${r}</text>
    </g>
  `}function Ui(e,t){if(!e)return u``;let o=Math.max(260,e.length*22+70);return u`
    <g transform="translate(512, ${Math.round(t/2)})" pointer-events="none">
      <rect x="${-o/2}" y="-30" width="${o}" height="60" rx="30" fill="#000000" fill-opacity="0.72" />
      <text y="9" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">${e}</text>
    </g>
  `}function an(e,t,o,i){let r=e==="cartoon",s=(l,c,d)=>N(e,t,l,c,{...r?{}:{stroke:"#a16207",sw:.7},...d===void 0?{}:{op:d}}),n=(l,c,d,f)=>g(h(l,void 0,{stroke:d,sw:c,op:f,lc:"round"}));return u`
    ${s("M -34,-1 C -40,-7 -47,-7 -49,-1 C -47,5 -40,6 -34,-1 Z","#fde68a")}
    ${s("M -28,-5 C -24,-13 -14,-15 -8,-11 L -10,-6 Z","#fde047",.9)}
    <g transform="rotate(${o.toFixed(2)} 2 -10)">
      ${s("M -6,-10 C -3,-26 8,-30 13,-23 C 12,-17 9,-12 7,-10 Z","#fde047",.95)}
      ${r?"":n("M -3,-13 C 0,-24 6,-27 11,-22",1.1,"#38bdf8",.8)}
    </g>
    ${s("M -34,-1 C -26,-6 -12,-11 6,-12 C 16,-12.5 26,-10 31,-5 C 34,-2 33,1 29,3 C 22,5.5 6,6 -10,4.5 C -24,3 -32,2 -34,-1 Z","#fde047")}
    ${g(h($(4,3,26,3.4),"#fef9c3",{op:.8,stroke:"none"}))}
    ${r?"":n("M -14,-9 L -15,4 M -2,-11 L -3,5 M 10,-11 L 9,5",2.4,"#fffbeb",.55)}
    ${r?"":[[22,-2,1.1],[17,-6,1],[26,-6,.9]].map(([l,c,d])=>g(h(b(l,c,d),"#38bdf8",{stroke:"none"})))}
    ${s("M 15,0 C 22,4 21,11 14,11 C 12,6 12,2 15,0 Z","#fde68a",.9)}
    ${n("M 17,-8 Q 13,-2 16,4",1+i*.3,"#a16207",.35)}
    ${r?u`
          ${g(h(b(25,-11,6),"#ffffff",{stroke:S,sw:1.3}))}
          ${g(h(b(26,-10.4,3.5),"#111827",{stroke:"none"}))}
          ${g(h(b(27.8,-12.6,1.4),"#ffffff",{stroke:"none"}))}
          ${g(h($(22,0,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
          ${n("M 32,0 Q 28,3.5 24,2",1.3,S,1)}
        `:u`
          ${g(h(b(25,-10,3.4),e==="realistic"?"#fef3c7":"#fffbeb",{stroke:"#111827",sw:.7,op:1}))}
          ${g(h(b(25.6,-10,1.8),"#0f172a",{stroke:"none"}))}
          ${g(h(b(24.6,-11,.6),"#ffffff",{stroke:"none"}))}
          ${n("M 33,0 Q 29,2 26,1",.9,"#a16207",.8)}
        `}
    ${e==="realistic"?g(h($(6,-8,14,1.6),"#ffffff",{op:.32,stroke:"none"})):""}
    ${e==="flat"?n("M -20,-6 Q -8,-9 4,-8",.8,"#a16207",.3):""}
  `}function ln(e,t){return u`
    ${N(e,t,$(-44,4,20,7),"#d8b45f",{...e==="cartoon"?{}:{stroke:"#a16207",sw:.7},op:.95})}
    ${g(h($(-42,2.4,11,3.6),"#5b4423",{stroke:"none"}))}
  `}var Ge={slide:-68,sink:3,tilt:78,head:[26,-4],sandLine:5};function cn(e){let[t,o]=Ge.head;return`translate(${(e*Ge.slide).toFixed(1)}, ${(e*Ge.sink).toFixed(1)}) rotate(${(-e*Ge.tilt).toFixed(1)} ${t} ${o})`}function hn(e,t){return N(e,t,"M -64,4 A 20,7 0 0,0 -24,4 Z","#d8b45f",{...e==="cartoon"?{}:{stroke:"none"},op:.95})}function Di(e,t){if(!e._goby)return u``;let o=e._goby,r=(1-(o.deathProgress||0)).toFixed(2),s=t?0:Math.sin(e._ambientTime*1.4)*3,n=t?0:Math.sin(e._ambientTime*2.6),a=R(e),l=B(e),c=Math.max(0,Math.min(1,o.hide||0)),d=o.y+Ge.sandLine*1.3;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(1.3, 1.3)">${ln(a,l)}</g>
    ${c>0?u`<clipPath id="goby-sand"><rect x="-100" y="-100" width="2300" height="${(d+100).toFixed(1)}" /></clipPath>`:""}
    <g clip-path="${c>0?"url(#goby-sand)":"none"}">
      <g transform="translate(${o.x}, ${o.y}) scale(1.3, ${t?-1.3:1.3})" opacity="${r}">
        <g transform="${cn(c)}">
          ${an(a,l,s,n)}
          ${we(t?0:o.stress||0,[0,-3,27,6],e._ambientTime,1.5)}
        </g>
      </g>
    </g>
    ${c>0?u`<g transform="translate(${o.x}, ${o.y}) scale(1.3, 1.3)">${hn(a,l)}</g>`:""}
  `}var Q="#0f172a",ve="system-ui, sans-serif",re=62,Gi=30,ji=92,he=9,dn=38,Hi=114,to=12,Kt=Gi+ji-1+to,Jt=992,ft=170,Y=62,qi=10,eo=270,ut=135,fn=102;function un(e,t,o){let i=s=>Hi-s*(Hi-dn),r=i(t.tempFraction);return u`
    <g pointer-events="none">
      <rect x="${re-he}" y="${Gi}" width="${he*2}" height="${ji}" rx="${he}" fill="#ffffff" fill-opacity="0.9" stroke="${Q}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${re}" cy="${Kt}" r="${to}" fill="#ffffff" fill-opacity="0.9" stroke="${Q}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${re}" cy="${Kt}" r="${to-3.5}" fill="${t.tempColor}" />
      <rect x="${re-4.5}" y="${r}" width="9" height="${Kt-r}" fill="${t.tempColor}" />
      ${t.ticks.map(s=>u`<line x1="${re-he}" y1="${i(s)}" x2="${re-he-8}" y2="${i(s)}" stroke="${Q}" stroke-opacity="0.45" stroke-width="2" />`)}
      ${t.marks.map(s=>u`<line x1="${re+he}" y1="${i(s.fraction)}" x2="${re+he+12}" y2="${i(s.fraction)}" stroke="${s.color}" stroke-width="3.5" stroke-linecap="round" />`)}
      <text x="106" y="96" font-family="${ve}" font-size="54" font-weight="800" fill="${Q}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${I(e,o)}°</text>
    </g>
  `}function zi(e,t){return e.volBlink&&t?"threshold-blink":""}function pn(e,t,o,i,r,s){let n=o?u`<tspan dx="12" font-size="30" font-weight="700">/ ${De(t,r)}</tspan><tspan dx="6" font-size="28" font-weight="800">L</tspan>`:u`<tspan dx="6" font-size="28" font-weight="800">L</tspan>`;return u`
    <g pointer-events="none">
      <text x="${Jt}" y="86" text-anchor="end" font-family="${ve}" font-size="58" font-weight="800" fill="${Q}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${I(e,r)}${n}</text>
      <rect x="${Jt-ft}" y="104" width="${ft}" height="9" rx="4.5" fill="${Q}" fill-opacity="0.18" />
      <rect class="${zi(i,s)}" x="${Jt-ft}" y="104" width="${(i.volFraction*ft).toFixed(1)}" height="9" rx="4.5" fill="${i.volColor}" />
    </g>
  `}function Vi(e,t,o,i,r=[],s=""){let n=2*Math.PI*Y,a=eo/360*n,l=(ut+t*eo)*Math.PI/180,c=Y*Math.cos(l),d=Y*Math.sin(l);return u`
    <g transform="translate(${e}, ${fn})" pointer-events="none">
      <circle r="${Y+26}" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
      <circle r="${Y}" fill="none" stroke="rgba(15, 23, 42, 0.15)" stroke-width="${qi}" stroke-linecap="round" stroke-dasharray="${a.toFixed(1)} ${n.toFixed(1)}" transform="rotate(${ut})" />
      <circle class="${s}" r="${Y}" fill="none" stroke="${o}" stroke-width="${qi}" stroke-linecap="round" stroke-dasharray="${(t*a).toFixed(1)} ${n.toFixed(1)}" transform="rotate(${ut})" />
      ${r.map(f=>{let m=(ut+f.fraction*eo)*Math.PI/180,[p,_]=[Math.cos(m),Math.sin(m)];return u`<line x1="${((Y+8)*p).toFixed(1)}" y1="${((Y+8)*_).toFixed(1)}" x2="${((Y+18)*p).toFixed(1)}" y2="${((Y+18)*_).toFixed(1)}" stroke="${f.color}" stroke-width="3.5" stroke-linecap="round" />`})}
      <circle class="${s}" cx="${c.toFixed(1)}" cy="${d.toFixed(1)}" r="8" fill="#ffffff" stroke="${o}" stroke-width="4" />
      ${i}
    </g>
  `}function Zi({style:e,currentTemp:t,currentVolume:o,targetBudget:i,comfortMin:r,deadlyTemp:s,boilTemp:n,showBudget:a,forceTemp:l=!1,lang:c,volumeTier:d=null,animate:f=!0}){let m=Uo({currentTemp:t,currentVolume:o,targetBudget:i,comfortMin:r,deadlyTemp:s,boilTemp:n,tier:d}),p=t>0||l;if(e!=="arc")return u`
      ${p?un(t,m,c):""}
      ${pn(o,i,a,m,c,f)}
    `;let _=u`<text y="13" font-family="${ve}" font-size="34" font-weight="800" fill="${Q}" text-anchor="middle">${I(t,c)}°</text>`,x=a?u`
        <text y="4" font-family="${ve}" font-size="34" font-weight="800" fill="${Q}" text-anchor="middle">${I(o,c)}</text>
        <text y="30" font-family="${ve}" font-size="20" font-weight="700" fill="${Q}" text-anchor="middle">/ ${De(i,c)} L</text>
      `:u`<text y="13" font-family="${ve}" font-size="34" font-weight="800" fill="${Q}" text-anchor="middle">${I(o,c)}<tspan dx="3" font-size="20" font-weight="800">L</tspan></text>`;return u`
    ${p?Vi(102,m.tempFraction,m.tempColor,_,m.marks):""}
    ${Vi(922,m.volFraction,m.volColor,x,[],zi(m,f))}
  `}function Xi({isFullscreen:e,canvasH:t,canvasBottom:o,waterColorStart:i,waterColorEnd:r,isBoiling:s}){return u`
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
        <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
      </linearGradient>

      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${i}" stop-opacity="${s?"0.5":"0.25"}" />
        <stop offset="100%" stop-color="${r}" stop-opacity="${s?"0.75":"0.45"}" />
      </linearGradient>

      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.42" />
        <stop offset="0.5" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="1" stop-color="#000000" stop-opacity="0.3" />
      </linearGradient>

      <linearGradient id="tangBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e3a8a" />
        <stop offset="55%" stop-color="#2563eb" />
        <stop offset="100%" stop-color="#60a5fa" />
      </linearGradient>

      <linearGradient id="chromisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0d9488" />
        <stop offset="55%" stop-color="#2dd4bf" />
        <stop offset="100%" stop-color="#a5f3fc" />
      </linearGradient>

      <linearGradient id="butterflyBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="55%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#f97316" />
      </linearGradient>

      <pattern id="algaeDots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="3" r="1.4" fill="#2d4a1d" opacity="0.95" />
        <circle cx="8.5" cy="6" r="1.8" fill="#1e3312" opacity="0.98" />
        <circle cx="5" cy="10" r="1.3" fill="#365314" opacity="0.9" />
        <circle cx="10" cy="11" r="1.5" fill="#1b2e10" opacity="0.95" />
      </pattern>

      <clipPath id="innerTankClip">
        ${e?u`<rect x="0" y="0" width="1024" height="${t}" />`:u`<rect x="12" y="14" width="1000" height="${o-14}" rx="18" ry="18" />`}
      </clipPath>
    </defs>
  `}function Yi({isFullscreen:e,canvasH:t,canvasBottom:o,tankBottom:i,theme:r}){return u`
    <rect
      x="${e?0:12}"
      y="${e?0:14}"
      width="${e?1024:1e3}"
      height="${e?t:o-14}"
      fill="${r.background}"
    />

    <path
      d="M ${e?0:12} ${i-60} Q 280 ${i-85}, 512 ${i-55} T ${e?1024:1012} ${i-60} L ${e?1024:1012} ${i} L ${e?0:12} ${i} Z"
      fill="${r.sandColor}"
    />
  `}function Qi(e,t){return e?u``:u`
    <rect x="12" y="14" width="1000" height="${t-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
    <rect x="4" y="${t}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
  `}var Wi=["turret","ramshorn","round"],mn={turret:"#a8a29e",ramshorn:"#dc2626",round:"#d97706"},Ki="M -9,-0.5 C -9,-4 -6,-8 -3,-12 C 0,-8 2,-4 1.5,-0.5 Z",_n="M -2.5,-4.5 a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0 a 3,3 0 0 1 6,0 a 4,4 0 0 1 -8,0";function gn(e,t,o,i){let r=o==="cartoon"?{stroke:S,sw:.5}:{},s=c=>o==="realistic"&&i?u`<path d="${c}" fill="url(#shade)" />`:"",n=(c,d,f)=>o==="cartoon"?"":g(h(c,void 0,{stroke:d,sw:.5,op:f,lc:"round"})),a=o==="realistic"?"#000000":"#ffffff",l=o==="realistic"?.28:.5;return e==="turret"?u`
      ${g(h(Ki,t,r))}
      ${s(Ki)}
      ${n("M -8.4,-3 Q -3.5,-1.2 1.2,-3 M -7.4,-6 Q -3.3,-4.4 0.2,-6 M -6,-9 Q -3.2,-7.8 -0.8,-9",a,l)}
    `:e==="ramshorn"?u`
      ${g(h(b(-2.5,-4.5,5),t,r))}
      ${s(b(-2.5,-4.5,5))}
      ${n(_n,a,l+.15)}
    `:u`
    ${g(h(b(-3,-4,5.5),t,r))}
    ${s(b(-3,-4,5.5))}
    <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
    ${o==="flat"?n("M -6.5,-4 A 3.5,3.5 0 1 1 -3,-0.5 M -5,-4 A 2,2 0 1 1 -3,-2","#ffffff",.5):""}
    ${o==="realistic"?n("M -7,-4 A 4,4 0 1 1 -3,0 M -5.4,-4 A 2.4,2.4 0 1 1 -3,-1.6","#000000",.28):""}
  `}function $n(e,t,o,i,r){let s=o==="cartoon"?{stroke:S,sw:.5}:{},n=mn[r];return u`
    ${gn(r,e.color||"#854d0e",o,i)}
    ${t?"":u`
          ${g(h($(2,-1.5,5,2.2),n,s))}
          ${o==="realistic"&&i?u`<path d="${$(2,-1.5,5,2.2)}" fill="url(#shade)" />`:""}
          <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="${n}" stroke-width="0.8" />
          ${o==="cartoon"?u`${g(h(b(7.5,-5.7,1.5),"#ffffff",{stroke:S,sw:.5}))}${g(h(b(7.8,-5.6,.8),"#111827",{stroke:"none"}))}`:u`<circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />`}
        `}
  `}function Ji(e,t,o,i,r){return u`
    <g>
      ${e.map((s,n)=>{let a=s.type==="glass_left"?90:s.type==="glass_right"?-90:0,l=t==="saltwater"?n%2===0?3.5:4.2:1.8;return u`
          <g transform="translate(${s.x}, ${s.y}) rotate(${o?0:a}) scale(${s.dir*l},${l})">
            ${$n(s,o,i,r,Wi[n%Wi.length])}
          </g>
        `})}
    </g>
  `}function er(e,t){let{isFullscreen:o,canvasH:i,canvasBottom:r,ariaLabel:s,aspectWidth:n,aspectHeight:a,themeKey:l,theme:c,waterColorStart:d,waterColorEnd:f,isBoiling:m,isDead:p,waterRatio:_,waterSurfaceY:x,tankBottom:M,effectiveAlgaeHours:w,showReadings:v,forceTemp:A,displayedTemp:L,currentVolume:F,targetBudget:U,comfortMin:W,deadlyTemp:pe,boilTemp:j,gaugeStyle:me,showBudget:Ce,cost:Ae,lang:_e,sensorLost:_t,biotopeNotice:gt,showGauges:Te,showCostLabel:Ye,volumeTier:$t,animate:Qe}=t;return D`
    <svg
      role="img"
      aria-label="${s}"
      @click=${q=>e._onTankTap(q)}
      @pointerdown=${q=>e._onSwipeStart(q)}
      @pointerup=${q=>e._onSwipeEnd(q)}
      @pointercancel=${()=>e._onSwipeCancel()}
      viewBox="0 0 1024 ${i}"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="${e._profile.antialias?"auto":"optimizeSpeed"}"
      style="${o?"width: 100%; height: 100%;":`aspect-ratio: ${n} /${a};`}"
    >
      ${Xi({isFullscreen:o,canvasH:i,canvasBottom:r,waterColorStart:d,waterColorEnd:f,isBoiling:m})}

      <g clip-path="url(#innerTankClip)">
        ${Yi({isFullscreen:o,canvasH:i,canvasBottom:r,tankBottom:M,theme:c})}

        ${e._renderThemeDecoration(l,o,e._deathProgress)}

        ${Ji(e._snails,l,p,R(e),B(e))}

        ${_>0?u`
              <g>
                <rect
                  x="${o?0:12}"
                  y="${x-5}"
                  width="${o?1024:1e3}"
                  height="${M-x+5}"
                  fill="url(#waterGrad)"
                />
                ${e._renderWaterSurface(o?0:12,o?1024:1012,x)}
              </g>
            `:""}

        ${_>0&&!p?Oi(e._bubbles):""}

        ${_>0&&!p?e._renderFlowBubbles():""}
        ${e._renderFood()}

        ${m&&_>0?Ii(e._boilingBubbles):""}

        <g>
          ${(e._fishes||[]).map(q=>u`
              <g transform="translate(${q.x},${q.y})">
                ${e._renderFishShape(q,l,p)}
              </g>
            `)}
        </g>

        ${l==="freshwater"?e._renderAncistrus(p):""}
        ${l==="saltwater"?e._renderCrab(p):""}
        ${l==="saltwater"?e._renderShrimp(p):""}
        ${l==="saltwater"?e._renderGoby(p):""}
        ${e._renderAlgae(w,o)}
        ${e._renderRipples()}

        <!-- Modern Frosted Glass HUD Gauges -->
        ${Te&&v?Zi({style:me,currentTemp:L,currentVolume:F,targetBudget:U,comfortMin:W,deadlyTemp:pe,boilTemp:j,showBudget:Ce,forceTemp:A,lang:_e,volumeTier:$t,animate:Qe}):""}
        ${Ye&&v?e._renderCostLabel(Ae):""}

        ${Ui(gt,i)}
        ${e._renderFpsBadge()}
        ${Pi(e,_t,Te&&v)}
      </g>

      ${Qi(o,r)}
    </svg>
  `}var yn=.05;function tr(e){let{currentVolume:t,displayedRemaining:o,targetBudget:i,currentTemp:r,tempTileColor:s,animate:n,cost:a,lang:l,t:c}=e,d=t<yn?null:e.volumeTier;return D`
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-value ${d?.blinking&&n?"threshold-blink":""}" style="${d?`color: ${d.color};`:""}">${I(t,l)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${c("label_consumed")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${I(o,l)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${c("label_remaining")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${De(i,l)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${c("label_target")}</div>
      </div>
      ${r>0?D`
            <div class="metric-box">
              <div
                class="metric-value"
                style="color: ${s};"
              >
                ${I(r,l)} <span class="metric-unit">°C</span>
              </div>
              <div class="metric-label">${c("label_temperature")}</div>
            </div>
          `:""}
      ${a?D`
            <div class="metric-box">
              <div class="metric-value">${at(a.total,l)}</div>
              <div class="metric-label">${c("label_cost")}</div>
            </div>
          `:""}
    </div>
  `}function oo(e=()=>Math.random()){return{snails:[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],ancistrus:{x:70,y:340,targetX:70,targetY:340,heading:0,state:"idle",idleUntil:0,deathProgress:0},shrimp:{x:650,y:550,targetX:650,state:"idle",idleUntil:0,dir:-1,deathProgress:0},crab:{x:(P.ledgeFrom+P.ledgeTo)/2,y:565-(P.ledge+30),targetX:(P.ledgeFrom+P.ledgeTo)/2,s:ct,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},goby:{x:530,y:551,targetX:530,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},bubbles:[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],boilingBubbles:Array.from({length:24},()=>({x:10+e()*1004,y:30+e()*540,vy:2.5+e()*3.5,vx:(e()-.5)*1.5,r:4+e()*8})),flowBubbles:Array.from({length:36},()=>({active:!1,x:512,baseX:512,y:0,vy:2,r:3,phase:0}))}}var bn=4500,xn=6e3,pt={keep:.96,minX:30,maxX:994},or=16.66,ir=3500;function ke(e,t,o=1){e.stressUntil=t+ir,e.stressPower=Math.max(0,Math.min(1,o))}function Se(e,t){let o=(e.stressUntil??0)-t;return e.stress=o<=0?0:Math.min(1,o/ir)*(e.stressPower??1),e.stress}var io={rate:.25,maxStep:.9,ease:.15};function so(e,t,o,i){e.walk=(e.walk??0)+Math.min(io.maxStep,Math.abs(t)*io.rate);let r=e.stride??0;e.stride=r+((o?1:0)-r)*Math.min(1,io.ease*i)}function rr({timestamp:e,deltaMs:t,delta:o,nowMs:i,animTime:r,tank:s,userSpeed:n,themeKey:a}){let{tankTop:l,tankBottom:c,waterSurfaceY:d,waterRatio:f,isDead:m,isBoiling:p,speedMultiplier:_}=s;return{timestamp:e,deltaMs:t,delta:o,nowMs:i,animTime:r,userSpeed:n,themeKey:a,tankTop:l,tankBottom:c,waterSurfaceY:d,waterRatio:f,isDead:m,isBoiling:p,speedMultiplier:_,deathStep:(t||or)/bn}}function sr(e,t,o){return t?Math.min(1,(e||0)+o):0}function nr(e,t,o){let i=e+(t-e)*Math.min(1,.03*o);return i<.005&&t===0?0:i}function ar(e,t){return e.filter(o=>t-o.born<st)}function lr(e,t){let{isDead:o,waterRatio:i,delta:r,animTime:s,waterSurfaceY:n,tankBottom:a,nowMs:l}=t;return o||i<=0?{food:[],changed:!1}:e.length===0?{food:e,changed:!1}:(e.forEach(c=>{if(c.landedAt)return;c.y+=c.vy*r;let d=c.vx??0,f=Math.pow(pt.keep,r);c.x+=d*(1-f)/(1-pt.keep)+Math.sin(s*1.5+c.phase)*.25*r,c.vx=d*f,c.x=Math.min(pt.maxX,Math.max(pt.minX,c.x)),c.y<n&&(c.y=n),c.y>=a-30&&(c.y=a-30,c.landedAt=l)}),{food:e.filter(c=>!c.eaten&&!(c.landedAt&&l-c.landedAt>xn)),changed:!0})}function cr(e,t,o,i,r=Math.random){let{waterRatio:s,isDead:n,tankBottom:a,waterSurfaceY:l,delta:c,animTime:d}=t,f=s>0&&!n?Go(o,i):0,m=!1;return e.forEach((p,_)=>{if(!p.active){_<f&&(p.active=!0,p.baseX=512+(r()-.5)*90,p.x=p.baseX,p.y=a-10-r()*40,p.vy=1.8+r()*2.2+o*1.2,p.r=2+r()*4,p.phase=r()*Math.PI*2);return}p.y-=p.vy*c,p.x=p.baseX+Math.sin(d*2+p.phase)*6,(p.y<l+2||n)&&(p.active=!1),m=!0}),m}function hr(e,t){let{waterRatio:o,isDead:i,delta:r,waterSurfaceY:s,tankBottom:n}=t;return!(o>0&&!i)||e.length===0?!1:(e.forEach(a=>{a.y-=a.vy*r,a.y<s&&(a.y=n-15)}),!0)}function dr(e,t,o=Math.random){let{isBoiling:i,waterRatio:r,delta:s,waterSurfaceY:n,tankBottom:a}=t;return!(i&&r>0)||e.length===0?!1:(e.forEach(l=>{l.y-=l.vy*s,l.x+=l.vx*s,l.y<n&&(l.y=a-15,l.x=10+o()*1004)}),!0)}function fr(e,t){let{tankBottom:o,tankTop:i,waterSurfaceY:r,themeKey:s}=t,n=s==="saltwater"&&e.species===0;return{minX:n?160:110,maxX:n?380:910,minY:n?Math.max(i+45,r+35,o-160):Math.max(i+45,r+35),maxY:o-45}}var je={rx:25,ry:16,factor:.85,push:1.4};function ur(e,t){if(t.isDead)return!1;let o=!1;for(let i=0;i<e.length;i++)for(let r=i+1;r<e.length;r++){let s=e[i],n=e[r],a=(s.scale||1.4)+(n.scale||1.4),l=s.x-n.x,c=s.y-n.y,d=Math.hypot(l/(je.rx*je.factor*a),c/(je.ry*je.factor*a));if(d>=1)continue;let f=Math.hypot(l,c),[m,p]=f<1e-6?[1,0]:[l/f,c/f],_=(1-d)*je.push*t.delta;s.x+=m*_,s.y+=p*_,n.x-=m*_,n.y-=p*_,o=!0}if(o)for(let i of e){let{minX:r,maxX:s,minY:n,maxY:a}=fr(i,t);i.x=Math.min(s,Math.max(r,i.x)),i.y=Math.min(a,Math.max(n,i.y))}return o}function pr(e,t,o){let{isDead:i,deathStep:r,tankBottom:s,delta:n,speedMultiplier:a}=t;if(i){e.deathProgress=Math.min(1,(e.deathProgress||0)+r),e.y=Math.min(s-30,e.y+1.2*n);return}e.deathProgress=0,Se(e,t.nowMs);let l=(e.scare??0)>.05?null:Zo(e.x,e.y,o);l?(e._baseVy===void 0&&(e._baseVy=e.vy),Math.abs(l.x-e.x)>6&&(e.dir=l.x<e.x?-1:1),e.vy=Math.max(-1.1,Math.min(1.1,(l.y-e.y)*.02)),e._seeking=!0):e._seeking&&(e._baseVy!==void 0&&(e.vy=e._baseVy),e._seeking=!1);let c=l?1.8:1,{minX:d,maxX:f,minY:m,maxY:p}=fr(e,t);e.x+=e.vx*e.dir*a*c*n,e.y+=e.vy*a*n;let _=e.kickX??0,x=e.kickY??0;if(_||x){e.x+=_*n,e.y+=x*n;let M=Math.pow(.93,n);e.kickX=_*M,e.kickY=x*M;let w=Math.hypot(e.kickX,e.kickY);e.scare=Math.min(1,w/8),w<.15&&(e.kickX=0,e.kickY=0,e.scare=0)}if(o.length>0){let M=e.x+e.dir*22*(e.scale||1.4);o.forEach(w=>{!w.eaten&&Math.hypot(w.x-M,w.y-e.y)<28&&(w.eaten=!0)})}e.x<d?(e.x=d,e.dir=1):e.x>f&&(e.x=f,e.dir=-1),e.y<m?(e.y=m,e.vy=Math.abs(e.vy)):e.y>p&&(e.y=p,e.vy=-Math.abs(e.vy))}var wn=.2;function mr(e,t){let{isDead:o,tankBottom:i,tankTop:r,waterSurfaceY:s,delta:n}=t;if(o){e.y=Math.min(i-10,e.y+1.5*n);return}if(e.type==="bottom")e.y=i-10,e.x+=e.vx*e.dir*n,e.x<100?(e.x=100,e.dir=1):e.x>920&&(e.x=920,e.dir=-1);else if(e.type==="glass_left"||e.type==="glass_right"){let a=Math.max(r+35,s+25);if(e.y<a){e.vy=Math.abs(e.vy),e.y=Math.min(a,e.y+Math.max(e.vy,wn)*n);return}e.y+=e.vy*n,e.y<a?(e.y=a,e.vy=Math.abs(e.vy)):e.y>i-25&&(e.y=i-25,e.vy=-Math.abs(e.vy))}}var H={durationMs:1800,radius:520,ancistrusFactor:18,crawlerFactor:6,ancistrusTurn:16,ancistrusBrake:140},ze={speed:.8,turn:3,minTrip:140,maxTrip:420},Mn=(e,t)=>((t-e)%360+540)%360-180,vn=1.5,kn=[[0,-21],[13,-19],[-13,-19],[15,0],[-15,0],[34,32],[-34,32],[19,55],[-19,55],[9,72],[-9,72]],Sn=[[9,89],[-9,89],[0,84]],mt={surfaceMargin:6,tailOut:16,floorMargin:4,rescue:12};function _r(e,t){let o=e*Math.PI/180,[i,r]=[Math.sin(o),Math.cos(o)],s=([d,f])=>vn*(d*i+f*r),n=kn.map(s),a=Sn.map(s),l=Math.max(t.waterSurfaceY+mt.surfaceMargin-Math.min(...n),t.waterSurfaceY-mt.tailOut-Math.min(...a)),c=t.tankBottom-mt.floorMargin-Math.max(...n,...a);return{minY:l,maxY:c}}function gr(e,t,o,i,r){let[s,n]=[90,934],a=r?Math.hypot(e.x-r.x,e.y-r.y):0,l=null;for(let c of[0,40,-40,80,-80,120,-120,160,180]){let d=o+c*Math.PI/180,f=Math.min(n,Math.max(s,e.x+Math.sin(d)*i)),m=e.y-Math.cos(d)*i,p=!0;for(let M=0;M<4&&p;M++){let w=Math.atan2(f-e.x,-(m-e.y))*180/Math.PI,v=_r(w,t);v.minY>v.maxY?p=!1:m=Math.min(v.maxY,Math.max(v.minY,m))}if(!p)continue;let _=Math.hypot(f-e.x,m-e.y);if(_<60)continue;let x=r?Math.hypot(f-r.x,m-r.y)-a+_*.5-Math.abs(c)*.5:-Math.abs(_-i)-Math.abs(c)*.3;(!l||x>l.score)&&(l={x:f,y:m,score:x})}return l}function $r(e,t,o,i,r,s=Math.random){let n=e.x-t,a=e.y-o,l=Math.hypot(n,a);if(l>H.radius)return!1;let c=l<1?s()*2*Math.PI:Math.atan2(n,-a),d=300+200*(1-l/H.radius),f=gr(e,r,c,d,{x:t,y:o});return f?(e.targetX=f.x,e.targetY=f.y):(e.targetX=e.x,e.targetY=e.y),e.state="moving",e.fleeUntil=i+H.durationMs,!0}function yr(e,t,o=Math.random){let{isDead:i,deathStep:r,tankBottom:s,waterSurfaceY:n,delta:a,timestamp:l,userSpeed:c,nowMs:d}=t,f=(e.fleeUntil??0)>d;if(i){e.deathProgress=Math.min(1,(e.deathProgress||0)+r),e.y=Math.min(s-35,e.y+1.2*a);return}e.deathProgress=0,Se(e,d),e.heading=e.heading??0;let m={tankBottom:s,waterSurfaceY:n};if(e.idleUntil||(e.idleUntil=l+1e3+o()*2e3),e.state==="moving"){let x=e.targetX-e.x,M=e.targetY-e.y,w=Math.hypot(x,M),v=Math.atan2(x,-M)*180/Math.PI,A=(f?H.ancistrusTurn:ze.turn)*a;e.heading+=Math.max(-A,Math.min(A,Mn(e.heading,v)));let L=f?H.ancistrusFactor*Math.min(1,.25+w/H.ancistrusBrake):1,F=Math.min(w,ze.speed*c*L*a);e.x+=x/(w||1)*F,e.y+=M/(w||1)*F,Math.hypot(e.targetX-e.x,e.targetY-e.y)<1.5&&(e.state="idle",e.idleUntil=l+(f?2500:1200)+o()*2e3)}else if(l>=e.idleUntil){let x=o()*2*Math.PI,M=ze.minTrip+o()*(ze.maxTrip-ze.minTrip),w=gr(e,m,x,M);w?(e.state="moving",e.targetX=w.x,e.targetY=w.y):e.idleUntil=l+1500}let p=_r(e.heading,m),_=p.minY>p.maxY?(p.minY+p.maxY)/2:Math.min(p.maxY,Math.max(p.minY,e.y));_!==e.y&&(e.y+=Math.sign(_-e.y)*Math.min(Math.abs(_-e.y),mt.rescue*a))}var fe={minX:560,maxX:740,fleeMinX:470,fleeMaxX:770,floorOffset:25,speed:.9,firstIdle:[1200,2e3],nextIdle:[1500,2500]};function Cn(e,t,o,i=Math.random){let{isDead:r,deathStep:s,tankBottom:n,delta:a,timestamp:l,userSpeed:c,nowMs:d}=t,f=(e.fleeUntil??0)>d;if(r){e.deathProgress=Math.min(1,(e.deathProgress||0)+s);return}e.deathProgress=0,Se(e,d),e.y=n-o.floorOffset;let m=0;if(e.idleUntil||(e.idleUntil=l+o.firstIdle[0]+i()*o.firstIdle[1]),e.state==="moving"){let p=e.targetX-e.x;e.dir=p<0?-1:1;let _=Math.sign(p)*Math.min(Math.abs(p),o.speed*c*(f?H.crawlerFactor:1)*a);e.x+=_,m=_,Math.abs(e.targetX-e.x)<1.5&&(e.state="idle",e.idleUntil=l+o.nextIdle[0]+i()*o.nextIdle[1])}else l>=e.idleUntil&&(e.state="moving",e.targetX=o.minX+i()*(o.maxX-o.minX));so(e,m,e.state==="moving",a)}var V={speed:.9,hideStep:.03,idle:[1500,2500],hidden:[4e3,4e3],fleeHidden:[6e3,3e3],firstIdle:[1500,2e3],caveChance:.4};function Ze(e){return typeof e.s=="number"||(e.s=ct),e.s}function ro(e,t){let{x:o,h:i}=Gt(Ze(e)),r=o-e.x;return e.x=o,e.y=t-(i+30),r}function An(e,t){let o=lt.filter(r=>Math.abs(r-e)>40);if(o.length>0&&t()<V.caveChance)return o[Math.min(o.length-1,Math.floor(t()*o.length))];let i=t()*xe;return Math.abs(i-e)>=40?i:e<xe/2?xe:0}function br(e,t,o=Math.random){let{isDead:i,deathStep:r,tankBottom:s,delta:n,userSpeed:a,nowMs:l}=t,c=(e.fleeUntil??0)>l;if(e.hide=e.hide??0,i){e.deathProgress=Math.min(1,(e.deathProgress||0)+r),e.hide=Math.max(0,e.hide-V.hideStep*n),ro(e,s);return}e.deathProgress=0,Se(e,l),ro(e,s);let d=0;switch(e.idleUntil||(e.idleUntil=l+V.firstIdle[0]+o()*V.firstIdle[1]),e.state){case"moving":{let f=Ze(e),m=e.goalS??f,p=Math.sign(m-f)*Math.min(Math.abs(m-f),V.speed*a*(c?H.crawlerFactor:1)*n);e.s=f+p;let _=ro(e,s);d=p,Math.abs(_)>.01&&(e.dir=_<0?-1:1),Math.abs(m-e.s)<.5&&(e.s=m,lt.some(M=>Math.abs(M-m)<1)?e.state="hiding":(e.state="idle",e.idleUntil=l+V.idle[0]+o()*V.idle[1]));break}case"hiding":if(e.hide=Math.min(1,e.hide+V.hideStep*(c?2:1)*n),e.hide>=1){e.state="hidden";let[f,m]=c?V.fleeHidden:V.hidden;e.idleUntil=l+f+o()*m}break;case"hidden":l>=e.idleUntil&&(e.state="emerging");break;case"emerging":e.hide=Math.max(0,e.hide-V.hideStep*n),e.hide<=0&&(e.state="idle",e.idleUntil=l+600+o()*800);break;default:l>=e.idleUntil&&(e.state="moving",e.goalS=An(Ze(e),o))}e.targetX=Gt(e.goalS??Ze(e)).x,so(e,d,e.state==="moving",n)}function xr(e,t,o,i){if(Math.hypot(e.x-t,e.y-o)>H.radius)return!1;let r=Ze(e);if(e.fleeUntil=i+4e3,e.state==="hidden"||e.state==="hiding")return e.idleUntil=Math.max(e.idleUntil??0,i+V.fleeHidden[0]),!0;if(e.state==="emerging")return e.state="hiding",!0;let[s]=lt;return e.goalS=s,e.state=Math.abs(e.goalS-r)<.5?"hiding":"moving",!0}var de={floorOffset:14,hideStep:.08,emergeStep:.025,hidden:[4e3,3e3]};function wr(e,t,o=Math.random){let{isDead:i,deathStep:r,tankBottom:s,delta:n,nowMs:a}=t;if(e.hide=e.hide??0,e.y=s-de.floorOffset,i){e.deathProgress=Math.min(1,(e.deathProgress||0)+r),e.hide=Math.max(0,e.hide-de.hideStep*n);return}switch(e.deathProgress=0,Se(e,a),e.state){case"hiding":e.hide=Math.min(1,e.hide+de.hideStep*n),e.hide>=1&&(e.state="hidden",e.idleUntil=a+de.hidden[0]+o()*de.hidden[1]);break;case"hidden":a>=e.idleUntil&&(e.state="emerging");break;case"emerging":e.hide=Math.max(0,e.hide-de.emergeStep*n),e.hide<=0&&(e.state="idle");break;default:break}}function Mr(e,t,o,i){return Math.hypot(e.x-t,e.y-o)>H.radius?!1:(e.state==="hidden"?e.idleUntil=Math.max(e.idleUntil??0,i+de.hidden[0]):e.state!=="hiding"&&(e.state="hiding"),!0)}var G={distance:[150,240],share:[.6,.4],height:[110,60],ms:[560,440],pitch:38,minTrip:60,surfaceMargin:25,minHeight:8,rest:[1200,1500]};function vr(e,t,o=Math.random){let i=e.hops;if(t.isDead||e.state!=="jumping"||!i||i.length===0){e.lift=0,e.pitch=0,e.hops=void 0,e.state==="jumping"&&(e.state="idle"),Cn(e,t,fe,o),e.floorY=t.tankBottom-fe.floorOffset,e.y=e.floorY;return}let{tankBottom:r,waterSurfaceY:s,delta:n,timestamp:a,nowMs:l}=t,c=r-fe.floorOffset;e.floorY=c,e.deathProgress=0,Se(e,l);let d=i[0];d.t=Math.min(1,(d.t??0)+n*or/d.ms);let f=d.t,m=Math.max(G.minHeight,c-(s+G.surfaceMargin));e.lift=4*Math.min(d.height,m)*f*(1-f),e.x=d.fromX+(d.toX-d.fromX)*f,e.y=c-e.lift,e.dir=d.toX<d.fromX?-1:1,e.pitch=(.5-f)*2*G.pitch,e.targetX=d.toX,so(e,0,!1,n),f>=1&&(i.shift(),e.x=d.toX,e.lift=0,e.pitch=0,e.y=c,i.length>0?i[0].fromX=e.x:(e.hops=void 0,e.state="idle",e.idleUntil=a+G.rest[0]+o()*G.rest[1]))}function kr(e,t,o,i){let r=Math.hypot(e.x-t,e.y-o);if(r>H.radius)return!1;if(e.state==="jumping"&&e.hops&&e.hops.length>0)return!0;let s=fe.fleeMinX??fe.minX,n=fe.fleeMaxX??fe.maxX,[a,l]=G.distance,c=a+(l-a)*(1-r/H.radius),d=e.x===t?e.dir||1:Math.sign(e.x-t),f=Math.min(n,Math.max(s,e.x+d*c));Math.abs(f-e.x)<G.minTrip&&(f=Math.min(n,Math.max(s,e.x-d*c)));let m=f-e.x,p=e.x+m*G.share[0];return e.hops=[{fromX:e.x,toX:p,ms:G.ms[0],height:G.height[0],t:0},{fromX:p,toX:f,ms:G.ms[1],height:G.height[1],t:0}],e.state="jumping",e.fleeUntil=i+H.durationMs,!0}var ue=()=>Math.random(),no=class extends z{static get properties(){return{_hass:{type:Object,hasChanged:()=>!1},preview:{type:Boolean},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_goby:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array},_flowBubbles:{type:Array},_food:{type:Array},_ripples:{type:Array},_fpsInfo:{type:String},_announcement:{type:String},_biotopeNotice:{type:String}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(t,o,i){let r=ri(t,o,i),s=r.entity||o.find(l=>l.includes("shower")||l.includes("hydrao"))||o.find(l=>l.startsWith("sensor."))||o[0]||"",n=r.temperature_entity||o.find(l=>l.includes("temperature")&&(l.includes("shower")||l.includes("hydrao")))||"",a=y;return{entity:s,temperature_entity:n,...r.comfort_temp_entity?{comfort_temp_entity:r.comfort_temp_entity}:{},...r.target_budget_entity?{target_budget_entity:r.target_budget_entity}:{},...r.threshold_1_entity?{threshold_1_entity:r.threshold_1_entity}:{},...r.threshold_2_entity?{threshold_2_entity:r.threshold_2_entity}:{},...r.threshold_3_entity?{threshold_3_entity:r.threshold_3_entity}:{},title:a.title,theme:a.theme,aspect_ratio_width:a.aspect_ratio_width,aspect_ratio_height:a.aspect_ratio_height,fish_count:a.fish_count,target_budget:a.target_budget,survival_volume:a.survival_volume,temp_boiling_threshold:a.temp_boiling_threshold,temp_deadly_threshold:a.temp_deadly_threshold,algae_enabled:a.algae_enabled,algae_delay_hours:a.algae_delay_hours,algae_age:a.algae_age,fish_speed_multiplier:a.fish_speed_multiplier,fullscreen:a.fullscreen}}constructor(){super(),this._animationFrameId=null,this.preview=!1,this._deathProgress=0,this._flow=nt(),this._flowIntensity=0,this._food=[],this._ripples=[],this._fpsInfo="",this._announcement="",this._announceFlip=!1,this._themeOverride=null,this._swipeStart=null,this._swipedAt=0,this._biotopeNotice="",this._noticeTimer=null,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=0,this._config=void 0,this._hass=void 0,this._viewport=null,this._resizeObserver=null,this._energyKwh=0,this._metrics=null,this._sensorLostSince=null,this._sensorTimer=null,this._metricsSignature="",this._onScreen=!0,this._pageVisible=typeof document>"u"||document.visibilityState!=="hidden",this._prefersReducedMotion=!1,this._intersectionObserver=null,this._motionQuery=null,this._onVisibilityChange=()=>{this._pageVisible=document.visibilityState!=="hidden",this._syncAnimation()},this._onMotionPreferenceChange=o=>{this._prefersReducedMotion=!!o.matches,this._syncAnimation()},this._lastTimestamp=0,this._lastFrameTs=0,this._animTime=0,this._ambientTime=0,this._lastAmbientTs=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=y.target_budget,this._cachedSurvivalVolume=y.survival_volume,this._cachedComfortMin=y.comfort_temp_min,this._lastTemperature=0,this._cachedHoursSinceLastShower=0,this._cachedTiers=null,this._fishes=it(4,"freshwater");let t=oo();this._snails=t.snails,this._ancistrus=t.ancistrus,this._shrimp=t.shrimp,this._crab=t.crab,this._goby=t.goby,this._bubbles=t.bubbles,this._boilingBubbles=t.boilingBubbles,this._flowBubbles=t.flowBubbles}static get styles(){return Co}_t(t){return J(Z(this._hass),t)}get _themeKey(){return this._themeOverride||this._config?.theme||"freshwater"}_biotopeStorageKey(){return`shower-aquarium-card:biotope:${this._config?.entity}`}_restoreBiotope(){if(!this._config?.swipe_biotope)return null;try{let t=JSON.parse(window.localStorage.getItem(this._biotopeStorageKey())||"null");if(t&&t.base===this._config.theme&&t.chosen!==t.base&&ye.includes(t.chosen))return t.chosen}catch{}return null}_rememberBiotope(t){if(!this._isEditorPreview())try{window.localStorage.setItem(this._biotopeStorageKey(),JSON.stringify({base:this._config?.theme,chosen:t}))}catch{}}_onSwipeStart(t){this._swipeStart=this._config?.swipe_biotope?{x:t.clientX,y:t.clientY,t:Date.now()}:null}_onSwipeEnd(t){let o=this._swipeStart;if(this._swipeStart=null,!o)return;let i=Oo(t.clientX-o.x,t.clientY-o.y,Date.now()-o.t);i!==0&&(this._swipedAt=Date.now(),this._switchBiotope(i))}_onSwipeCancel(){this._swipeStart=null}_switchBiotope(t){if(!this._config)return;let o=Ro(this._themeKey,t);this._themeOverride=o===this._config.theme?null:o,this._rememberBiotope(o),this._fishes=it(this._config.fish_count,o);let i=oo();this._snails=i.snails,this._ancistrus=i.ancistrus,this._shrimp=i.shrimp,this._crab=i.crab,this._goby=i.goby,this._food=[],this._ripples=[];let r=this._t(`theme_${o}`);this._biotopeNotice=r,this._announce("aria_biotope",{name:r}),this._noticeTimer!==null&&clearTimeout(this._noticeTimer),this._noticeTimer=setTimeout(()=>{this._noticeTimer=null,this._biotopeNotice=""},2e3),this._onDataChanged()}_onBiotopeButton(){this._switchBiotope(1)}_getCanvasHeight(){return Bo(this._config,this._viewport)}_updateCachedMetrics(){if(!this._hass||!this._config)return!1;let t=No(this._hass,this._config,this._metrics);this._metrics=t,this._cachedConsumedVolume=t.consumedVolume,this._cachedHoursSinceLastShower=t.hoursSinceLastShower,this._cachedTemperature=t.temperature,this._cachedTargetBudget=t.targetBudget,this._cachedSurvivalVolume=t.survivalVolume,this._cachedComfortMin=t.comfortMin,this._cachedTiers=t.tiers,t.consumedVolume<=0?this._lastTemperature=0:t.temperature>0&&(this._lastTemperature=t.temperature),this._trackSensor(t.sensorMissing);let o=Jo(t,Z(this._hass)),i=o!==this._metricsSignature;return this._metricsSignature=o,i}_trackSensor(t){if(!t){this._sensorLostSince=null,this._clearSensorTimer();return}this._sensorLostSince===null&&(this._sensorLostSince=Date.now()),this._scheduleSensorTimer()}_scheduleSensorTimer(){if(this._sensorTimer!==null||this._sensorLostSince===null||!this.isConnected)return;let t=Math.max(0,Pt-(Date.now()-this._sensorLostSince));this._sensorTimer=setTimeout(()=>{this._sensorTimer=null,this.requestUpdate()},t)}_clearSensorTimer(){this._sensorTimer!==null&&(clearTimeout(this._sensorTimer),this._sensorTimer=null)}get _sensorLost(){return this._sensorLostSince!==null&&Date.now()-this._sensorLostSince>=Pt}setConfig(t){if(!t||typeof t.entity!="string"||!t.entity.trim())throw new Error("Please define a valid entity.");let{config:o,warnings:i}=Ht(ot(t));i.forEach(r=>console.warn(`[shower-aquarium-card] ${r}`)),this._config={...y,...o},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen"),this._themeOverride=this._restoreBiotope(),this._fishes=it(this._config.fish_count,this._themeKey),this._flow=nt(),this._food=[],this._metrics=null,this._lastTemperature=0,this._sensorLostSince=null,this._clearSensorTimer(),this._updateCachedMetrics(),this._syncAnimation(),this.requestUpdate()}set hass(t){this._hass=t;let o=this._updateCachedMetrics();this._trackFlow(),o&&this._onDataChanged()}get _visible(){return this._onScreen&&this._pageVisible}get _motionAllowed(){return ei(this._prefersReducedMotion,this._config?.respect_reduced_motion)}shouldUpdate(){return this._visible}_onResize(t,o){if(!this._config?.fullscreen)return;let i=this._getCanvasHeight();this._viewport={width:t,height:o},this._getCanvasHeight()!==i&&this._onDataChanged()}_onDataChanged(){this._visible&&!this._motionAllowed&&this._settleScene(),this.requestUpdate()}_settleScene(){let t=this._tankState();if(!t)return;let{isDead:o}=t;this._food=[],this._ripples=[],this._lastTimestamp=0;let i=oi(o);for(let r=0;r<i;r++)this._updatePhysics(1e3+r*ti);this._lastTimestamp=0}_syncAnimation(){if(!this.isConnected){this._stopAnimation();return}if(this._visible&&this._motionAllowed){this._startAnimation(),this.requestUpdate();return}this._stopAnimation(),this._visible&&(this._settleScene(),this.requestUpdate())}_trackFlow(){if(!this._hass||!this._config)return;let t=this._hass.states?.[this._config.entity]?.state;if(t===void 0||isNaN(parseFloat(t)))return;let o=this._cachedConsumedVolume,i=this._flow.lastVolume,r=this._config.cold_water_temp;i===null||o<i-1e-6?this._energyKwh=Ut(o,this._cachedTemperature,r):o>i+1e-6&&(this._energyKwh+=Ut(o-i,this._cachedTemperature,r)),this._flow=Ho(this._flow,o,Date.now())}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this._pageVisible=document.visibilityState!=="hidden",typeof IntersectionObserver=="function"&&(this._intersectionObserver=new IntersectionObserver(t=>{let o=t[t.length-1];!o||o.isIntersecting===this._onScreen||(this._onScreen=o.isIntersecting,this._syncAnimation())}),this._intersectionObserver.observe(this)),typeof ResizeObserver=="function"&&(this._resizeObserver=new ResizeObserver(t=>{let o=t[t.length-1];o&&this._onResize(o.contentRect.width,o.contentRect.height)}),this._resizeObserver.observe(this)),typeof window.matchMedia=="function"&&(this._motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this._prefersReducedMotion=!!this._motionQuery.matches,this._motionQuery.addEventListener?.("change",this._onMotionPreferenceChange)),this._scheduleSensorTimer(),this._syncAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._clearSensorTimer(),this._noticeTimer!==null&&(clearTimeout(this._noticeTimer),this._noticeTimer=null),document.removeEventListener("visibilitychange",this._onVisibilityChange),this._intersectionObserver?.disconnect(),this._intersectionObserver=null,this._resizeObserver?.disconnect(),this._resizeObserver=null,this._motionQuery?.removeEventListener?.("change",this._onMotionPreferenceChange),this._motionQuery=null,this._stopAnimation()}_sampleFps(t){this._fpsWindowStart||(this._fpsWindowStart=t);let o=t-this._fpsWindowStart;if(o<1e3)return;let i=Math.round(this._rafCount*1e3/o),r=Math.round(this._tickCount*1e3/o),s=this._config?.animation_quality||"max";this._fpsInfo=`v${et} \xB7 ${s} \xB7 display ${i}/s \xB7 drawn ${r}/s`,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=t,this.requestUpdate()}get _profile(){return Qo(this._config?.animation_quality)}_startAnimation(){if(!this._animationFrameId){this._lastTimestamp=0,this._lastFrameTs=0,this._fpsWindowStart=0,this._rafCount=0,this._tickCount=0;let t=o=>{this._rafCount++,Wo(o,this._lastFrameTs,this._profile.fps)&&(this._lastFrameTs=o,this._tickCount++,this._updatePhysics(o)),this._config?.show_fps&&this._sampleFps(o),this._animationFrameId=requestAnimationFrame(t)};this._animationFrameId=requestAnimationFrame(t)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(t){let o=this._config;if(!o)return;this._lastTimestamp||(this._lastTimestamp=t);let i=t-this._lastTimestamp,r=this._profile,s=Math.min(i/16.66,Ko(r.fps));this._lastTimestamp=t,this._animTime=t*.0035,(!r.ambientHz||t-this._lastAmbientTs>=1e3/r.ambientHz)&&(this._ambientTime=this._animTime,this._lastAmbientTs=t);let n={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},a=Date.now(),l=rr({timestamp:t,deltaMs:i,delta:s,nowMs:a,animTime:this._animTime,tank:rt({config:o,metrics:n,canvasHeight:this._getCanvasHeight()}),userSpeed:o.fish_speed_multiplier,themeKey:this._themeKey}),{isDead:c}=l,d=!1;this._deathProgress=sr(this._deathProgress,c,l.deathStep);let f=this._motionAllowed,m=c||!f?0:qo(this._flow,a);this._flowIntensity=nr(this._flowIntensity,m,s),Vo(this._flow,a)&&(this._flow={...this._flow,showerActive:!1}),this._ripples.length>0&&(this._ripples=ar(this._ripples,a),d=!0);let p=lr(this._food,l);p.food!==this._food&&(this._food=p.food),p.changed&&(d=!0),cr(this._flowBubbles,l,this._flowIntensity,r.flowBubbles,ue)&&(d=!0),this._flowIntensity>0&&(d=!0),this._fishes&&this._fishes.length>0&&(this._fishes.forEach(_=>pr(_,l,this._food)),ur(this._fishes,l),d=!0),this._snails&&this._snails.length>0&&(this._snails.forEach(_=>mr(_,l)),d=!0),this._ancistrus&&(yr(this._ancistrus,l,ue),d=!0),this._shrimp&&(vr(this._shrimp,l,ue),d=!0),this._crab&&(br(this._crab,l,ue),d=!0),this._goby&&(wr(this._goby,l,ue),d=!0),this._bubbles&&hr(this._bubbles,l)&&(d=!0),this._boilingBubbles&&dr(this._boilingBubbles,l,ue)&&(d=!0),d&&this.requestUpdate()}_renderWaterSurface(t,o,i){return ci(this,t,o,i)}_renderThemeDecoration(t,o,i=0){return mi(this,t,o,i)}_renderFishShape(t,o,i){return wi(this,t,o,i)}_renderAncistrus(t){return Ai(this,t)}_renderShrimp(t){return Ti(this,t)}_renderGoby(t){return Di(this,t)}_renderCrab(t){return Ei(this,t)}_renderAlgae(t,o){return _i(this,t,o)}_eventToSvgPoint(t){let o=t.currentTarget,i=o.getScreenCTM?o.getScreenCTM():null;if(!i)return null;let r=o.createSVGPoint();r.x=t.clientX,r.y=t.clientY;let s=r.matrixTransform(i.inverse());return{x:s.x,y:s.y}}_isEditorPreview(){if(this.preview)return!0;let t=this;for(;t;){let o=t,i=o.tagName?o.tagName.toLowerCase():"";if(i==="hui-card-preview"||i==="hui-dialog-edit-card"||i==="hui-dialog-suggest-card")return!0;t=o.parentNode||t.host||null}return!1}_tankState(){return this._config?rt({config:this._config,metrics:{consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},canvasHeight:this._getCanvasHeight()}):null}_interactiveTank(){if(!this._hass||!this._motionAllowed)return null;let t=this._tankState();return t?t.isDead||t.waterRatio<=0?null:t:null}_dropFood(t,o){let i=Math.max(80,Math.min(944,t));this._food=[...this._food,...Xo(i,o+2)].slice(-30)}_knockAt(t,o,i){let r=Date.now();this._ripples=[...this._ripples,{x:t,y:o,born:r}],(this._fishes||[]).forEach(s=>{let n=zo(s.x,s.y,t,o);n&&(s.kickX=n.kx,s.kickY=n.ky,s.scare=n.scare,Math.abs(n.kx)>.5&&(s.dir=n.kx<0?-1:1),ke(s,r,.5+.5*n.scare))}),this._ancistrus&&$r(this._ancistrus,t,o,r,i,ue)&&ke(this._ancistrus,r),this._shrimp&&kr(this._shrimp,t,o,r)&&ke(this._shrimp,r),this._crab&&xr(this._crab,t,o,r)&&ke(this._crab,r),this._goby&&Mr(this._goby,t,o,r)&&ke(this._goby,r)}_onTankTap(t){if(Date.now()-this._swipedAt<500)return;let o=this._interactiveTank();if(!o)return;let i=this._eventToSvgPoint(t);i&&(jo(i.y,o.waterSurfaceY)==="feed"?this._dropFood(i.x,o.waterSurfaceY):this._knockAt(i.x,i.y,o),this.requestUpdate())}_onFeedButton(){let t=this._interactiveTank();t&&(this._dropFood(Ue/2,t.waterSurfaceY),this._announce("aria_food_dropped"),this.requestUpdate())}_onKnockButton(){let t=this._interactiveTank();t&&(this._knockAt(Ue/2,(t.waterSurfaceY+t.tankBottom)/2,t),this._announce("aria_knocked"),this.requestUpdate())}_announce(t,o={}){this._announceFlip=!this._announceFlip,this._announcement=qt(this._t(t),o)+(this._announceFlip?"\xA0":"")}_renderFlowBubbles(){return Li(this)}_renderFood(){return Fi(this)}_renderRipples(){return Ri(this)}_renderCostLabel(t){return Bi(this,t)}_ariaLabel({currentVolume:t,currentTemp:o,targetBudget:i,isDead:r,isCritical:s,sensorLost:n=!1}){let a=Z(this._hass),l={consumed:I(t,a),target:I(i,a,0),temperature:I(o,a)},c=[qt(this._t(o>0?"aria_summary_temperature":"aria_summary"),l)];return r?c.push(this._t("aria_dead")):s&&c.push(this._t("aria_over_budget")),n&&c.push(`${this._t("label_sensor_unavailable")}.`),c.join(" ")}_renderFpsBadge(){return Ni(this)}render(){if(!this._config||!this._hass)return D``;let t=!!this._config.fullscreen,o=this._getCanvasHeight(),i=o-35,r={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:s,currentTemp:n,targetBudget:a,boilTemp:l,deadlyTemp:c,waterRatio:d,tankBottom:f,waterSurfaceY:m,isDead:p,isBoiling:_,isCritical:x,isWarning:M}=rt({config:this._config,metrics:r,canvasHeight:o}),w=this._motionAllowed&&!p&&d>0,v=Z(this._hass),A=this._sensorLost,L=this._ariaLabel({currentVolume:s,currentTemp:n,targetBudget:a,isDead:p,isCritical:x,sensorLost:A}),F=Math.max(0,a-s),U=this._themeKey,W=Nt(U),pe=_||x?"#ef4444":M?"#38bdf8":W.waterTop,j=_||x?"#991b1b":M?"#0284c7":W.waterBottom,me=!!(this._config.title&&this._config.title.trim().length>0),Ce=this._config.aspect_ratio_width,Ae=this._config.aspect_ratio_height,_e=Number(this._config.algae_age)||0,_t=_e>0?_e:this._cachedHoursSinceLastShower,gt=n>=c?"#ef4444":n>=l?"#f59e0b":"var(--primary-text-color, #111827)",Te=t||!!this._config.show_gauges,Ye=!t&&this._config.show_tiles!==!1,$t=Te&&!Ye,Qe=this._config.use_threshold_colors===!1?null:Po(s,this._cachedTiers),q=this._config.show_cost?Yo({volumeL:s,energyKwh:this._energyKwh,waterPricePerM3:this._config.water_price_per_m3,energyPricePerKwh:this._config.energy_price_per_kwh}):null;return D`
      <ha-card>
        ${!t&&me?D`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          ${er(this,{isFullscreen:t,canvasH:o,canvasBottom:i,ariaLabel:L,aspectWidth:Ce,aspectHeight:Ae,themeKey:U,theme:W,waterColorStart:pe,waterColorEnd:j,isBoiling:_,isDead:p,waterRatio:d,waterSurfaceY:m,tankBottom:f,effectiveAlgaeHours:_t,showReadings:s>0||this._isEditorPreview(),forceTemp:s<=0&&this._isEditorPreview(),displayedTemp:n>0?n:this._lastTemperature,currentVolume:s,targetBudget:a,comfortMin:this._cachedComfortMin,deadlyTemp:c,boilTemp:l,gaugeStyle:this._config.gauge_style,showBudget:this._config.show_budget,cost:q,lang:v,sensorLost:A,biotopeNotice:this._biotopeNotice,showGauges:Te,showCostLabel:$t,volumeTier:Qe,animate:this._motionAllowed})}

          <!-- The same two actions as a tap on the tank, for the keyboard and screen readers. -->
          <div class="keyboard-actions" role="group" aria-label="${this._t("aria_actions")}">
            <button type="button" class="kb-button" ?disabled=${!w} @click=${()=>this._onFeedButton()}>
              ${this._t("action_feed")}
            </button>
            <button type="button" class="kb-button" ?disabled=${!w} @click=${()=>this._onKnockButton()}>
              ${this._t("action_knock")}
            </button>
            <button type="button" class="kb-button" @click=${()=>this._onBiotopeButton()}>
              ${this._t("action_biotope")}
            </button>
          </div>
          <div class="sr-only" role="status" aria-live="polite">${this._announcement}</div>
        </div>

        ${Ye?tr({currentVolume:s,displayedRemaining:F,targetBudget:a,currentTemp:n,tempTileColor:gt,volumeTier:Qe,animate:this._motionAllowed,cost:q,lang:v,t:Ar=>this._t(Ar)}):""}
      </ha-card>
    `}getCardSize(){return 6}getGridOptions(){let t={columns:12,min_columns:6};return this._config?.fullscreen&&(t.rows=8,t.min_rows=4),t}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",no);console.info(`%c SHOWER-AQUARIUM-CARD %c v${et} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");var Xe=window;Xe.customCards=Xe.customCards||[];var Sr=Xe.customCards.findIndex(e=>e.type==="shower-aquarium-card"),Cr={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${et})`,documentationURL:`${So}#readme`};Sr!==-1?Xe.customCards[Sr]=Cr:Xe.customCards.push(Cr);export{no as AquariumShowerCard};
