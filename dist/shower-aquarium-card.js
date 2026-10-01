var qe=globalThis,Ve=qe.ShadowRoot&&(qe.ShadyCSS===void 0||qe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,lt=Symbol(),Wt=new WeakMap,Me=class{constructor(e,o,r){if(this._$cssResult$=!0,r!==lt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=o}get styleSheet(){let e=this.o,o=this.t;if(Ve&&e===void 0){let r=o!==void 0&&o.length===1;r&&(e=Wt.get(o)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Wt.set(o,e))}return e}toString(){return this.cssText}},Xt=t=>new Me(typeof t=="string"?t:t+"",void 0,lt),ct=(t,...e)=>{let o=t.length===1?t[0]:e.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new Me(o,t,lt)},Kt=(t,e)=>{if(Ve)t.adoptedStyleSheets=e.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of e){let r=document.createElement("style"),i=qe.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,t.appendChild(r)}},ft=Ve?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let o="";for(let r of e.cssRules)o+=r.cssText;return Xt(o)})(t):t;var{is:lr,defineProperty:cr,getOwnPropertyDescriptor:fr,getOwnPropertyNames:dr,getOwnPropertySymbols:hr,getPrototypeOf:ur}=Object,oe=globalThis,Jt=oe.trustedTypes,pr=Jt?Jt.emptyScript:"",mr=oe.reactiveElementPolyfillSupport,ke=(t,e)=>t,dt={toAttribute(t,e){switch(e){case Boolean:t=t?pr:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=t!==null;break;case Number:o=t===null?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch{o=null}}return o}},to=(t,e)=>!lr(t,e),eo={attribute:!0,type:String,converter:dt,reflect:!1,useDefault:!1,hasChanged:to};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),oe.litPropertyMetadata??(oe.litPropertyMetadata=new WeakMap);var W=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,o=eo){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(e,o),!o.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(e,r,o);i!==void 0&&cr(this.prototype,e,i)}}static getPropertyDescriptor(e,o,r){let{get:i,set:s}=fr(this.prototype,e)??{get(){return this[o]},set(a){this[o]=a}};return{get:i,set(a){let n=i?.call(this);s?.call(this,a),this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??eo}static _$Ei(){if(this.hasOwnProperty(ke("elementProperties")))return;let e=ur(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ke("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ke("properties"))){let o=this.properties,r=[...dr(o),...hr(o)];for(let i of r)this.createProperty(i,o[i])}let e=this[Symbol.metadata];if(e!==null){let o=litPropertyMetadata.get(e);if(o!==void 0)for(let[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[o,r]of this.elementProperties){let i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let o=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)o.unshift(ft(i))}else e!==void 0&&o.push(ft(e));return o}static _$Eu(e,o){let r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,o=this.constructor.elementProperties;for(let r of o.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Kt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,o,r){this._$AK(e,r)}_$ET(e,o){let r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:dt).toAttribute(o,r.type);this._$Em=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,o){let r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:dt;this._$Em=i;let n=a.fromAttribute(o,s.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,o,r,i=!1,s){if(e!==void 0){let a=this.constructor;if(i===!1&&(s=this[e]),r??(r=a.getPropertyOptions(e)),!((r.hasChanged??to)(s,o)||r.useDefault&&r.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,o,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??o??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(o=void 0),this._$AL.set(e,o)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,n=this[i];a!==!0||this._$AL.has(i)||n===void 0||this.C(i,void 0,s,n)}}let e=!1,o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(o)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(o)}willUpdate(e){}_$AE(e){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(e){}firstUpdated(e){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ke("elementProperties")]=new Map,W[ke("finalized")]=new Map,mr?.({ReactiveElement:W}),(oe.reactiveElementVersions??(oe.reactiveElementVersions=[])).push("2.1.2");var Ce=globalThis,oo=t=>t,Ge=Ce.trustedTypes,io=Ge?Ge.createPolicy("lit-html",{createHTML:t=>t}):void 0,co="$lit$",ie=`lit$${Math.random().toFixed(9).slice(2)}$`,fo="?"+ie,_r=`<${fo}>`,le=document,Ae=()=>le.createComment(""),Te=t=>t===null||typeof t!="object"&&typeof t!="function",yt=Array.isArray,gr=t=>yt(t)||typeof t?.[Symbol.iterator]=="function",ht=`[ 	
\f\r]`,Se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ro=/-->/g,so=/>/g,ne=RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),no=/'/g,ao=/"/g,ho=/^(?:script|style|textarea|title)$/i,$t=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),N=$t(1),u=$t(2),Ys=$t(3),ce=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),lo=new WeakMap,ae=le.createTreeWalker(le,129);function uo(t,e){if(!yt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return io!==void 0?io.createHTML(e):e}var yr=(t,e)=>{let o=t.length-1,r=[],i,s=e===2?"<svg>":e===3?"<math>":"",a=Se;for(let n=0;n<o;n++){let l=t[n],c,d,h=-1,p=0;for(;p<l.length&&(a.lastIndex=p,d=a.exec(l),d!==null);)p=a.lastIndex,a===Se?d[1]==="!--"?a=ro:d[1]!==void 0?a=so:d[2]!==void 0?(ho.test(d[2])&&(i=RegExp("</"+d[2],"g")),a=ne):d[3]!==void 0&&(a=ne):a===ne?d[0]===">"?(a=i??Se,h=-1):d[1]===void 0?h=-2:(h=a.lastIndex-d[2].length,c=d[1],a=d[3]===void 0?ne:d[3]==='"'?ao:no):a===ao||a===no?a=ne:a===ro||a===so?a=Se:(a=ne,i=void 0);let m=a===ne&&t[n+1].startsWith("/>")?" ":"";s+=a===Se?l+_r:h>=0?(r.push(c),l.slice(0,h)+co+l.slice(h)+ie+m):l+ie+(h===-2?n:m)}return[uo(t,s+(t[o]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},Ee=class t{constructor({strings:e,_$litType$:o},r){let i;this.parts=[];let s=0,a=0,n=e.length-1,l=this.parts,[c,d]=yr(e,o);if(this.el=t.createElement(c,r),ae.currentNode=this.el.content,o===2||o===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=ae.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(co)){let p=d[a++],m=i.getAttribute(h).split(ie),y=/([.?@])?(.*)/.exec(p);l.push({type:1,index:s,name:y[2],strings:m,ctor:y[1]==="."?pt:y[1]==="?"?mt:y[1]==="@"?_t:me}),i.removeAttribute(h)}else h.startsWith(ie)&&(l.push({type:6,index:s}),i.removeAttribute(h));if(ho.test(i.tagName)){let h=i.textContent.split(ie),p=h.length-1;if(p>0){i.textContent=Ge?Ge.emptyScript:"";for(let m=0;m<p;m++)i.append(h[m],Ae()),ae.nextNode(),l.push({type:2,index:++s});i.append(h[p],Ae())}}}else if(i.nodeType===8)if(i.data===fo)l.push({type:2,index:s});else{let h=-1;for(;(h=i.data.indexOf(ie,h+1))!==-1;)l.push({type:7,index:s}),h+=ie.length-1}s++}}static createElement(e,o){let r=le.createElement("template");return r.innerHTML=e,r}};function pe(t,e,o=t,r){if(e===ce)return e;let i=r!==void 0?o._$Co?.[r]:o._$Cl,s=Te(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(e=pe(t,i._$AS(t,e.values),i,r)),e}var ut=class{constructor(e,o){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:o},parts:r}=this._$AD,i=(e?.creationScope??le).importNode(o,!0);ae.currentNode=i;let s=ae.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Le(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new gt(s,this,e)),this._$AV.push(c),l=r[++n]}a!==l?.index&&(s=ae.nextNode(),a++)}return ae.currentNode=le,i}p(e){let o=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,o),o+=r.strings.length-2):r._$AI(e[o])),o++}},Le=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,o,r,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,o=this._$AM;return o!==void 0&&e?.nodeType===11&&(e=o.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,o=this){e=pe(this,e,o),Te(e)?e===T||e==null||e===""?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==ce&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):gr(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&Te(this._$AH)?this._$AA.nextSibling.data=e:this.T(le.createTextNode(e)),this._$AH=e}$(e){let{values:o,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=Ee.createElement(uo(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(o);else{let s=new ut(i,this),a=s.u(this.options);s.p(o),this.T(a),this._$AH=s}}_$AC(e){let o=lo.get(e.strings);return o===void 0&&lo.set(e.strings,o=new Ee(e)),o}k(e){yt(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,r,i=0;for(let s of e)i===o.length?o.push(r=new t(this.O(Ae()),this.O(Ae()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(e=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);e!==this._$AB;){let r=oo(e).nextSibling;oo(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},me=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,o,r,i,s){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=T}_$AI(e,o=this,r,i){let s=this.strings,a=!1;if(s===void 0)e=pe(this,e,o,0),a=!Te(e)||e!==this._$AH&&e!==ce,a&&(this._$AH=e);else{let n=e,l,c;for(e=s[0],l=0;l<s.length-1;l++)c=pe(this,n[r+l],o,l),c===ce&&(c=this._$AH[l]),a||(a=!Te(c)||c!==this._$AH[l]),c===T?e=T:e!==T&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},pt=class extends me{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}},mt=class extends me{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}},_t=class extends me{constructor(e,o,r,i,s){super(e,o,r,i,s),this.type=5}_$AI(e,o=this){if((e=pe(this,e,o,0)??T)===ce)return;let r=this._$AH,i=e===T&&r!==T||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==T&&(r===T||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},gt=class{constructor(e,o,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){pe(this,e)}};var $r=Ce.litHtmlPolyfillSupport;$r?.(Ee,Le),(Ce.litHtmlVersions??(Ce.litHtmlVersions=[])).push("3.3.3");var po=(t,e,o)=>{let r=o?.renderBefore??e,i=r._$litPart$;if(i===void 0){let s=o?.renderBefore??null;r._$litPart$=i=new Le(e.insertBefore(Ae(),s),s,void 0,o??{})}return i._$AI(t),i};var Fe=globalThis,Z=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;let e=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=e.firstChild),e}update(e){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=po(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ce}};Z._$litElement$=!0,Z.finalized=!0,Fe.litElementHydrateSupport?.({LitElement:Z});var br=Fe.litElementPolyfillSupport;br?.({LitElement:Z});(Fe.litElementVersions??(Fe.litElementVersions=[])).push("4.2.2");var Ze="0.8.82",mo="https://github.com/Adrien40/ha-shower-aquarium-card";var $=Object.freeze({title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:5,temp_boiling_threshold:40,temp_deadly_threshold:45,comfort_temp_min:33,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,show_cost:!1,water_price_per_m3:4.5,energy_price_per_kwh:.25,cold_water_temp:15,animation_quality:"max",creature_style:"flat",respect_reduced_motion:!0,show_fps:!1,gauge_style:"thermometer",show_budget:!1,swipe_biotope:!0});var _o=ct`
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
`;var go={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge actuel des algues (maintenant)",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)",field_animation_quality:"Qualit\xE9 d'animation",quality_max:"Maximale",quality_balanced:"\xC9quilibr\xE9e",quality_light:"L\xE9g\xE8re (Google Nest Hub)",helper_animation_quality:"L\xE9g\xE8re : 20 images/s et effets simplifi\xE9s, pour les \xE9crans peu puissants",field_respect_reduced_motion:"Suivre le mode \xAB mouvement r\xE9duit \xBB de l'appareil",field_show_fps:"Afficher les images par seconde (d\xE9bogage)",helper_show_fps:"Affichage de d\xE9bogage : indique une fois par seconde le nombre d'images dessin\xE9es.",helper_respect_reduced_motion:"Activ\xE9 : si votre tablette, t\xE9l\xE9phone ou ordinateur a le r\xE9glage \xAB r\xE9duire les animations \xBB (accessibilit\xE9), l'aquarium reste immobile. D\xE9sactiv\xE9 : l'aquarium s'anime toujours. Si vous ne voyez aucun mouvement, d\xE9sactivez cette option.",aria_summary:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L.",aria_summary_temperature:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L, eau \xE0 {temperature} \xB0C.",aria_dead:"Le bac est vide ou trop chaud : les animaux sont morts.",aria_over_budget:"Le volume cible est d\xE9pass\xE9.",section_aquarium:"Aquarium, animaux et algues",section_limits:"Limites (volume et temp\xE9rature)",section_cost:"Estimation du co\xFBt",section_display:"Affichage et performance",action_feed:"Nourrir les poissons",action_knock:"Taper sur la vitre",aria_actions:"Actions de l'aquarium",aria_food_dropped:"De la nourriture est tomb\xE9e dans le bac.",aria_knocked:"Vous avez tap\xE9 sur la vitre. Les poissons sont effray\xE9s.",field_comfort_temp_entity:"Entit\xE9 de temp\xE9rature de confort minimum (optionnel)",helper_comfort_temp_entity:"Temp\xE9rature minimale de confort, par exemple celle d'un pommeau Hydrao. Elle remplace la valeur ci-dessous.",field_comfort_temp:"Temp\xE9rature minimale de confort (\xB0C)",field_gauge_style:"Style des jauges (plein \xE9cran)",field_show_budget:"Afficher le budget sur la jauge de volume",option_gauge_thermometer:"Thermom\xE8tre et barre",option_gauge_arc:"Arcs ouverts",label_sensor_unavailable:"Capteur indisponible",helper_target_budget:"Utilis\xE9 seulement si l'entit\xE9 d'objectif ci-dessus est vide ou indisponible.",helper_fish_count:"Entre 1 et 10 : plus de poissons seraient \xE0 l'\xE9troit dans l'aquarium. Une valeur plus grande est ramen\xE9e \xE0 10.",helper_fish_speed:"Entre 0,2 et 3. Une valeur hors de cette plage est ramen\xE9e dedans.",field_creature_style:"Style des poissons et des autres \xEAtres vivants",option_creature_flat:"Plat et d\xE9taill\xE9",option_creature_cartoon:"Dessin anim\xE9",option_creature_realistic:"R\xE9aliste",helper_creature_style:"Le r\xE9aliste utilise des ombrages doux, que la qualit\xE9 d'animation l\xE9g\xE8re supprime",field_swipe_biotope:"Changer de biotope en glissant le doigt",helper_swipe_biotope:"Glissez horizontalement sur l'aquarium pour passer \xE0 l'eau douce, \xE0 l'eau de mer ou \xE0 l'eau froide. Le choix est gard\xE9 sur cet appareil ; changer le biotope dans cet \xE9diteur le remplace.",action_biotope:"Changer de biotope",aria_biotope:"Biotope : {name}.",helper_algae_age:"0 = automatique : l'\xE2ge suit le temps \xE9coul\xE9 depuis la derni\xE8re douche. Une valeur plus grande force l'\xE2ge des algues \xE0 cet instant, pour voir leur aspect."};var yo={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Current algae age (right now)",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)",field_animation_quality:"Animation quality",quality_max:"Maximum",quality_balanced:"Balanced",quality_light:"Light (Google Nest Hub)",helper_animation_quality:"Light: 20 frames/s and simpler effects, for low-power screens",field_respect_reduced_motion:"Follow the device's reduced-motion setting",field_show_fps:"Show FPS (debug)",helper_show_fps:"Debug overlay: once per second, shows how many frames were drawn.",helper_respect_reduced_motion:'On: if your tablet, phone or computer has the "reduce motion" accessibility setting, the aquarium stays still. Off: the aquarium always animates. If you see no movement, turn this off.',aria_summary:"Shower aquarium: {consumed} L used out of {target} L.",aria_summary_temperature:"Shower aquarium: {consumed} L used out of {target} L, water at {temperature} \xB0C.",aria_dead:"The tank is empty or too hot: the animals have died.",aria_over_budget:"The target volume has been exceeded.",section_aquarium:"Aquarium, animals and algae",section_limits:"Limits (volume and temperature)",section_cost:"Cost estimate",section_display:"Display and performance",action_feed:"Feed the fish",action_knock:"Knock on the glass",aria_actions:"Aquarium actions",aria_food_dropped:"Fish food dropped into the tank.",aria_knocked:"You knocked on the glass. The fish are startled.",field_comfort_temp_entity:"Minimum comfort temperature entity (optional)",helper_comfort_temp_entity:"Minimum comfortable temperature, for example from a Hydrao showerhead. It replaces the value below.",field_comfort_temp:"Minimum comfort temperature (\xB0C)",field_gauge_style:"Gauge style (fullscreen)",field_show_budget:"Show the budget on the volume gauge",option_gauge_thermometer:"Thermometer and bar",option_gauge_arc:"Open arcs",label_sensor_unavailable:"Sensor unavailable",helper_target_budget:"Only used when the target entity above is empty or unavailable.",helper_fish_count:"Between 1 and 10: more fish would be cramped in the tank. A higher value is brought back to 10.",helper_fish_speed:"Between 0.2 and 3. A value outside this range is brought back into it.",field_creature_style:"Look of the fish and the other living things",option_creature_flat:"Flat and detailed",option_creature_cartoon:"Cartoon",option_creature_realistic:"Realistic",helper_creature_style:"Realistic uses soft shading, which the light animation quality leaves out",field_swipe_biotope:"Swipe to change the biotope",helper_swipe_biotope:"Swipe sideways on the aquarium to go to freshwater, saltwater or coldwater. The choice is kept on this device; changing the biotope in this editor replaces it.",action_biotope:"Change biotope",aria_biotope:"Biotope: {name}.",helper_algae_age:"0 = automatic: the age follows the time since the last shower. A higher value sets the age of the algae at this very moment, to see how they look."};var bt={fr:go,en:yo};function Q(t){return(t?.locale?.language||t?.language||"en").substring(0,2).toLowerCase()}function vr(t){return t&&bt[t]||bt.en}function X(t,e){return vr(t)[e]||bt.en[e]||e}var vt={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#dc2626","#f59e0b","#fef3c7","#cbd5e1"]}};function kt(t){return vt[t]||vt.freshwater}var Mr=["flat","cartoon","realistic"],kr=["night_entity","night_lux_threshold","cost_in_fullscreen","bottom_design"];function ze(t){let e={...t};for(let o of kr)delete e[o];return e}var _e=["freshwater","saltwater","coldwater"];function wo(t,e){let o=Math.max(0,_e.indexOf(t));return _e[(o+e+_e.length*2)%_e.length]}var xt={minDistance:60,maxDurationMs:900,horizontalRatio:1.6};function vo(t,e,o){return o>xt.maxDurationMs||Math.abs(t)<xt.minDistance||Math.abs(t)<Math.abs(e)*xt.horizontalRatio?0:t<0?1:-1}var Re=1024,wt=10,Mo=$.comfort_temp_min,Sr=$.survival_volume,St=6e4,Cr=400,Ar=2048,Tr=300,Er=600,$o=(t,e=Cr)=>Math.max(e,Math.min(Ar,Math.round(t)));function ko(t,e){if(t?.fullscreen){let i=Number(e?.width),s=Number(e?.height);return i>0&&s>0&&Number.isFinite(i)&&Number.isFinite(s)?$o(Re*s/i,Tr):Er}let o=Number(t?.aspect_ratio_width)||$.aspect_ratio_width,r=Number(t?.aspect_ratio_height)||$.aspect_ratio_height;return $o(Re*(r/o))}function So(t,e,o=null){let r={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(e?.target_budget)||$.target_budget,survivalVolume:Number(e?.survival_volume)||Sr,comfortMin:Number(e?.comfort_temp_min)||Mo,sensorMissing:!1,lastReading:null};if(!t||!e)return r;let i=e.entity?t.states[e.entity]:void 0,s=i?parseFloat(i.state):NaN,a=o?.lastReading??null;r.sensorMissing=!(i&&!isNaN(s));let n=a;if(i&&!isNaN(s)){let l=Math.max(0,s),c=i.last_changed?new Date(i.last_changed).getTime():NaN,d=a!==null&&a.volume===l&&a.changedMs!==null;n={volume:l,changedMs:d?a.changedMs:Number.isFinite(c)?c:null}}if(n&&(r.consumedVolume=n.volume,r.lastReading=n,n.changedMs!==null&&(r.hoursSinceLastShower=Math.max(0,(Date.now()-n.changedMs)/(1e3*60*60)))),e.temperature_entity&&t.states[e.temperature_entity]){let l=parseFloat(t.states[e.temperature_entity].state);r.temperature=isNaN(l)?0:l}if(e.target_budget_entity&&t.states[e.target_budget_entity]){let l=parseFloat(t.states[e.target_budget_entity].state);l>0&&(r.targetBudget=l)}if(e.comfort_temp_entity&&t.states[e.comfort_temp_entity]){let l=parseFloat(t.states[e.comfort_temp_entity].state),c=Number(e.temp_boiling_threshold)||$.temp_boiling_threshold;l>0&&l<c&&(r.comfortMin=l)}return r}function Lr(t,e){return e==="saltwater"?t<2?0:t===2?1:t===3?3:bo[(t-4)%bo.length]:t%6}var Qe=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5],bo=[4,2,5,6,2,5],xo={male:1.4,female:1.6},Fr=1.5,Rr=.6,Or=2;function Ye(t,e){let o=kt(e),r=Math.min(10,Math.max(1,Number(t)||4));return Array.from({length:r},(i,s)=>{let a=Lr(s,e),n=e==="saltwater"&&a===0,l=e==="freshwater"&&a===2,c=l?Rr:1,d=1.38-(Qe[s%Qe.length]-1.2)*.2,h=Math.random()*50-25,p=Math.random()*50-25;return{species:a,color:o.palette[s%o.palette.length],scale:(n?s===0?xo.male:xo.female:Qe[s%Qe.length]*(e==="saltwater"&&a===1?Or:1))*(l?Fr:1),phase:Math.random()*6.28,x:n?190+s*140:120+s*760/Math.max(1,r-1)+h,y:n?470:160+s%3*90+p,vx:d*(.8+Math.random()*.4)*c,vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5)*c,dir:Math.random()<.5?1:-1,deathProgress:0}})}function je({config:t,metrics:e,canvasHeight:o}){let r=e.targetBudget,i=e.survivalVolume,s=r+i,a=e.consumedVolume,n=e.temperature,l=Number(t?.temp_boiling_threshold)||$.temp_boiling_threshold,c=Number(t?.temp_deadly_threshold)||$.temp_deadly_threshold,d=Math.max(0,s-a),h=s>0?Math.max(0,Math.min(1,d/s)):0,p=!!t?.fullscreen,m=p?0:15,y=p?o:o-35,x=y-m,v=y-h*x,w=n>=c&&n>0,S=d<=0,M=w||S,k=n>=l&&n>0,F=a>r&&!M,L=a>r*.7&&!F&&!M,O=Number(t?.fish_speed_multiplier)||$.fish_speed_multiplier,U=((F||k)&&!M?2:1)*O;return{targetBudget:r,survivalVolume:i,totalVolume:s,currentVolume:a,currentTemp:n,boilTemp:l,deadlyTemp:c,remainingVolumeInTank:d,waterRatio:h,tankTop:m,tankBottom:y,tankHeight:x,waterSurfaceY:v,isHeatDead:w,isWaterDead:S,isDead:M,isBoiling:k,isCritical:F,isWarning:L,speedMultiplier:U}}function Pr(t){let e=Math.max(wt+10,Math.ceil((t+5)/10)*10),o=[];for(let r=wt+10;r<=e;r+=10)o.push(r);return{min:wt,max:e,ticks:o}}function Co({currentTemp:t,currentVolume:e,targetBudget:o,comfortMin:r,deadlyTemp:i,boilTemp:s}){let a=Pr(i),n=p=>Math.max(0,Math.min(1,(p-a.min)/(a.max-a.min))),l=n(t),c=t>=i?"#ef4444":t>=s?"#f97316":t>=r?"#16a34a":"#0284c7",d=Math.max(0,Math.min(1,e/Math.max(1,o))),h=e>o?"#ef4444":e>o*.7?"#f59e0b":"#0284c7";return{tempFraction:l,tempColor:c,volFraction:d,volColor:h,scale:a,marks:[{fraction:n(r),color:"#16a34a"},{fraction:n(s),color:"#f97316"},{fraction:n(i),color:"#ef4444"}],ticks:a.ticks.map(n)}}var Ao=8e3,We=900;function Xe(){return{lastVolume:null,lastIncreaseAt:0,target:0,showerActive:!1}}function To(t,e,o){if(t.lastVolume===null)return{...t,lastVolume:e};if(e<t.lastVolume-1e-6)return{...Xe(),lastVolume:e};if(e>t.lastVolume+1e-6){let r=e-t.lastVolume,i=(o-t.lastIncreaseAt)/1e3,a=t.lastIncreaseAt>0&&i>.2&&i<=15?r/(i/60):null,n=a===null?.5:Math.max(.25,Math.min(1,a/10));return{lastVolume:e,lastIncreaseAt:o,target:n,showerActive:!0}}return t}function Eo(t,e){return t.lastIncreaseAt&&e-t.lastIncreaseAt<Ao?t.target:0}function Lo(t,e){return t.showerActive&&t.lastIncreaseAt>0&&e-t.lastIncreaseAt>=Ao}function Fo(t,e=36){return t>.02?Math.min(e,Math.round(4+t*(e-4))):0}function Ro(t,e,o=45){return t<=e+o?"feed":"knock"}function Oo(t,e,o,r,i=280,s=Math.random){let a=t-o,n=e-r,l=Math.hypot(a,n);if(l>i)return null;let c,d;if(l<1){let m=s()*Math.PI*2;c=Math.cos(m),d=Math.sin(m)}else c=a/l,d=n/l;let h=1-l/i,p=2+9*h;return{kx:c*p,ky:d*p*.6,scare:h}}function Po(t,e,o,r=360){let i=null,s=r;for(let a of o){if(a.eaten)continue;let n=Math.hypot(a.x-t,a.y-e);n<s&&(s=n,i=a)}return i}function Io(t,e,o=6,r=Math.random){let i=["#f59e0b","#fbbf24","#fb923c","#facc15"];return Array.from({length:o},()=>({x:t+(r()-.5)*70,y:e+r()*12,vy:.45+r()*.4,phase:r()*Math.PI*2,r:3.4+r()*2,color:i[Math.floor(r()*i.length)],landedAt:0,eaten:!1}))}var Ir=4.186/3600;function Ct(t,e,o=15){return!(t>0)||!(e>o)?0:t*(e-o)*Ir}function Bo({volumeL:t,energyKwh:e,waterPricePerM3:o,energyPricePerKwh:r}){let i=Math.max(0,t||0)*(Number(o)||0)/1e3,s=Math.max(0,e||0)*(Number(r)||0);return{water:i,energy:s,total:i+s}}function Ke(t,e="fr"){try{return new Intl.NumberFormat(e,{style:"currency",currency:"EUR"}).format(t)}catch{return`${t.toFixed(2)} \u20AC`}}var Mt={max:{fps:0,ambientHz:0,antialias:!0,flowBubbles:36,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0},balanced:{fps:30,ambientHz:0,antialias:!0,flowBubbles:24,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0},light:{fps:20,ambientHz:8,antialias:!1,flowBubbles:12,richSurface:!1,deathFilter:!1,doubleRipple:!1,shading:!1}};function No(t){return t&&Mt[t]||Mt.max}function Uo(t,e,o){return!o||!e?!0:t-e>=1e3/o-2}function Do(t){return t?Math.max(2,1e3/t/16.66*1.6):2}function Ho(t,e){return[t.consumedVolume,t.temperature,t.targetBudget,t.survivalVolume,t.comfortMin,t.sensorMissing?1:0,Math.floor(t.hoursSinceLastShower),e].join("|")}function At(t){let e={...t};for(let o of Zo){if(o.max===void 0)continue;let r=e[o.key];r!=null&&(e[o.key]=Tt({[o.key]:r}).config[o.key])}return e}function qo(t,e=!0){return e===!1?!0:!t}var Vo=40;function Go(t){return t?120:2}var Zo=[{key:"fish_count",fallback:$.fish_count,min:1,max:10,integer:!0},{key:"target_budget",fallback:$.target_budget,min:0,minExclusive:!0},{key:"survival_volume",fallback:$.survival_volume,min:0,minExclusive:!0},{key:"temp_boiling_threshold",fallback:$.temp_boiling_threshold,min:0,minExclusive:!0},{key:"temp_deadly_threshold",fallback:$.temp_deadly_threshold,min:0,minExclusive:!0},{key:"comfort_temp_min",fallback:$.comfort_temp_min,min:0,minExclusive:!0},{key:"algae_delay_hours",fallback:$.algae_delay_hours,min:0,minExclusive:!0},{key:"algae_age",fallback:$.algae_age,min:0},{key:"fish_speed_multiplier",fallback:$.fish_speed_multiplier,min:0,minExclusive:!0,clampMin:.2,max:3},{key:"aspect_ratio_width",fallback:$.aspect_ratio_width,min:0,minExclusive:!0},{key:"aspect_ratio_height",fallback:$.aspect_ratio_height,min:0,minExclusive:!0},{key:"water_price_per_m3",fallback:$.water_price_per_m3,min:0},{key:"energy_price_per_kwh",fallback:$.energy_price_per_kwh,min:0},{key:"cold_water_temp",fallback:$.cold_water_temp,min:-50}];function Tt(t){let e={...t},o=[];for(let n of Object.keys(e))(e[n]===null||e[n]===void 0)&&delete e[n];for(let n of Zo){let l=e[n.key];if(l===void 0)continue;let c=typeof l=="string"&&l.trim()===""?NaN:Number(l);if(!(Number.isFinite(c)&&(n.minExclusive?c>n.min:c>=n.min))){o.push(`${n.key}: ${JSON.stringify(l)} is not valid, using ${n.fallback}`),e[n.key]=n.fallback;continue}n.integer&&(c=Math.round(c)),n.clampMin!==void 0&&c<n.clampMin&&(c=n.clampMin),n.max!==void 0&&c>n.max&&(c=n.max),c!==l&&(c!==Number(l)&&o.push(`${n.key}: ${JSON.stringify(l)} is out of range, using ${c}`),e[n.key]=c)}e.theme!==void 0&&!vt[e.theme]&&(o.push(`theme: ${JSON.stringify(e.theme)} is unknown, using freshwater`),e.theme="freshwater"),e.animation_quality!==void 0&&!Mt[e.animation_quality]&&(o.push(`animation_quality: ${JSON.stringify(e.animation_quality)} is unknown, using max`),e.animation_quality="max"),e.gauge_style!==void 0&&e.gauge_style!=="thermometer"&&e.gauge_style!=="arc"&&(o.push(`gauge_style: ${JSON.stringify(e.gauge_style)} is unknown, using thermometer`),e.gauge_style="thermometer"),e.creature_style!==void 0&&!Mr.includes(e.creature_style)&&(o.push(`creature_style: ${JSON.stringify(e.creature_style)} is unknown, using ${$.creature_style}`),e.creature_style=$.creature_style),e.title!==void 0&&typeof e.title!="string"&&(o.push("title: must be text, ignoring it"),e.title="");let r=e.temp_boiling_threshold??$.temp_boiling_threshold,i=e.temp_deadly_threshold??$.temp_deadly_threshold;i<=r&&(e.temp_deadly_threshold=r+1,o.push(`temp_deadly_threshold: ${i} must be above temp_boiling_threshold (${r}), using ${r+1}`));let s=e.comfort_temp_min??Mo,a=e.temp_boiling_threshold??$.temp_boiling_threshold;return s>=a&&(e.comfort_temp_min=Math.max(1,a-1),o.push(`comfort_temp_min: ${s} must be below temp_boiling_threshold (${a}), using ${e.comfort_temp_min}`)),{config:e,warnings:o}}function Et(t,e){return String(t).replace(/\{(\w+)\}/g,(o,r)=>r in e?String(e[r]):o)}function Oe(t,e="en"){return Number.isInteger(t)?String(t):P(t,e,1)}function P(t,e="en",o=1){try{return new Intl.NumberFormat(e,{minimumFractionDigits:o,maximumFractionDigits:o}).format(t)}catch{return Number(t).toFixed(o)}}var Br="hydrao_custom";function Qo(t,...e){let o=t&&typeof t.entities=="object"&&t.entities?t.entities:{},r=t&&typeof t.states=="object"&&t.states?t.states:{},i=[...new Set([...e.flatMap(a=>Array.isArray(a)?a:[]),...Object.keys(o),...Object.keys(r)])].sort(),s=(a,n,l)=>{let c=i.filter(p=>p.startsWith(`${a}.`)),d=c.find(p=>o[p]?.platform===Br&&o[p]?.translation_key===n);if(d)return d;let h=/(total|cumul|comfort|confort|wasted|perdu|gaspill)/;return c.find(p=>p.includes("hydrao")&&l.test(p)&&!h.test(p.replace(/_minimum_comfort_temperature|_temperature_de_confort_minimum|_temperature_confort_minimum/,"")))||""};return{entity:s("sensor","shower_volume_raw",/_(shower_volume|volume_douche)(_\d+)?$/),temperature_entity:s("sensor","temperature",/_temperature(_\d+)?$/),comfort_temp_entity:s("number","comfort_temperature",/_(minimum_comfort_temperature|temperature_de_confort_minimum|temperature_confort_minimum)(_\d+)?$/)}}var Yo=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:$.theme,selector:{select:{options:[{value:"freshwater",label:"Freshwater (Tropical)"},{value:"saltwater",label:"Saltwater (Reef)"},{value:"coldwater",label:"Coldwater (Goldfish)"}]}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:$.target_budget,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{type:"expandable",name:"section_aquarium",flatten:!0,schema:[{name:"fish_count",default:$.fish_count,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"fish_speed_multiplier",default:$.fish_speed_multiplier,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"algae_enabled",default:$.algae_enabled,selector:{boolean:{}}},{name:"algae_delay_hours",default:$.algae_delay_hours,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:$.algae_age,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}}]},{type:"expandable",name:"section_limits",flatten:!0,schema:[{name:"survival_volume",default:$.survival_volume,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"comfort_temp_entity",selector:{entity:{domain:["sensor","number","input_number"]}}},{name:"comfort_temp_min",default:$.comfort_temp_min,selector:{number:{min:15,max:45,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_boiling_threshold",default:$.temp_boiling_threshold,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:$.temp_deadly_threshold,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_cost",flatten:!0,schema:[{name:"show_cost",default:$.show_cost,selector:{boolean:{}}},{name:"water_price_per_m3",default:$.water_price_per_m3,selector:{number:{min:0,max:30,step:.01,unit_of_measurement:"\u20AC/m\xB3",mode:"box"}}},{name:"energy_price_per_kwh",default:$.energy_price_per_kwh,selector:{number:{min:0,max:2,step:.001,unit_of_measurement:"\u20AC/kWh",mode:"box"}}},{name:"cold_water_temp",default:$.cold_water_temp,selector:{number:{min:0,max:30,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_display",flatten:!0,schema:[{name:"animation_quality",default:$.animation_quality,selector:{select:{options:[{value:"max",label:"Maximum"},{value:"balanced",label:"Balanced"},{value:"light",label:"Light (Google Nest Hub)"}]}}},{name:"creature_style",default:$.creature_style,selector:{select:{options:[{value:"flat",label:"Flat and detailed"},{value:"cartoon",label:"Cartoon"},{value:"realistic",label:"Realistic"}]}}},{name:"show_budget",default:$.show_budget,selector:{boolean:{}}},{name:"respect_reduced_motion",default:$.respect_reduced_motion,selector:{boolean:{}}},{name:"fullscreen",default:$.fullscreen,selector:{boolean:{}}},{name:"gauge_style",default:$.gauge_style,selector:{select:{options:[{value:"thermometer",label:"Thermometer and bar"},{value:"arc",label:"Open arcs"}]}}},{name:"swipe_biotope",default:$.swipe_biotope,selector:{boolean:{}}},{name:"show_fps",default:$.show_fps,selector:{boolean:{}}},{name:"aspect_ratio_width",default:$.aspect_ratio_width,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:$.aspect_ratio_height,selector:{number:{min:1,max:4e3,mode:"box"}}}]}];function jo(t=Yo){return t.flatMap(e=>e.type==="expandable"?jo(e.schema):[e])}var zo={section_aquarium:"section_aquarium",section_limits:"section_limits",section_cost:"section_cost",section_display:"section_display"},Nr={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",comfort_temp_entity:"field_comfort_temp_entity",comfort_temp_min:"field_comfort_temp",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",show_cost:"field_show_cost",water_price_per_m3:"field_water_price",energy_price_per_kwh:"field_energy_price",cold_water_temp:"field_cold_water_temp",animation_quality:"field_animation_quality",respect_reduced_motion:"field_respect_reduced_motion",fullscreen:"field_fullscreen",show_fps:"field_show_fps",creature_style:"field_creature_style",gauge_style:"field_gauge_style",show_budget:"field_show_budget",swipe_biotope:"field_swipe_biotope",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},Ur={fullscreen:"helper_fullscreen",creature_style:"helper_creature_style",target_budget:"helper_target_budget",fish_count:"helper_fish_count",fish_speed_multiplier:"helper_fish_speed",comfort_temp_entity:"helper_comfort_temp_entity",show_cost:"helper_show_cost",animation_quality:"helper_animation_quality",respect_reduced_motion:"helper_respect_reduced_motion",show_fps:"helper_show_fps",swipe_biotope:"helper_swipe_biotope",algae_age:"helper_algae_age"},Dr={theme:{freshwater:"theme_freshwater",saltwater:"theme_saltwater",coldwater:"theme_coldwater"},animation_quality:{max:"quality_max",balanced:"quality_balanced",light:"quality_light"},creature_style:{flat:"option_creature_flat",cartoon:"option_creature_cartoon",realistic:"option_creature_realistic"},gauge_style:{thermometer:"option_gauge_thermometer",arc:"option_gauge_arc"}},Lt=class extends Z{static get properties(){return{hass:{type:Object},_config:{type:Object}}}constructor(){super(),this.hass=void 0,this._config=void 0}setConfig(e){this._config=ze(e)}_lang(){return Q(this.hass)}_computeLabel(e){let o=Nr[e.name]||zo[e.name];return o?X(this._lang(),o):e.name}_computeHelper(e){let o=Ur[e.name];return o?X(this._lang(),o):""}_valueChanged(e){if(!this._config||!this.hass)return;let o=At({...e.detail.value});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}_schema(){let e=this._lang(),o=r=>{if(r.type==="expandable")return{...r,title:X(e,zo[r.name]),schema:r.schema.map(o)};let i=Dr[r.name];return i?{...r,selector:{select:{options:r.selector.select.options.map(s=>({value:s.value,label:X(e,i[s.value])}))}}}:r};return Yo.map(o)}_formData(){return{...Object.fromEntries(jo().filter(o=>o.default!==void 0).map(o=>[o.name,o.default])),...At(this._config)}}render(){return!this.hass||!this._config?N``:N`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${e=>this._computeLabel(e)}
        .computeHelper=${e=>this._computeHelper(e)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",Lt);function Wo(t,e,o,r){let i=t._flowIntensity||0,s=3.5+i*6.5,a=90-i*35,l=(i>.05?t._animTime:t._ambientTime)*(1.6+i*2.4),c=t._profile.richSurface,d=c?16:28,h=w=>c?Math.sin(w/17+l*2.3)*i*2.4:0,p=[],m=[];for(let w=e;w<o;w+=d)p.push([w,r+Math.sin(w/a+l)*s+h(w)]),m.push([w,r+4+Math.sin(w/a+l+.6)*s*.7]);p.push([o,r+Math.sin(o/a+l)*s+h(o)]),m.push([o,r+4+Math.sin(o/a+l+.6)*s*.7]);let y=w=>`${w[0].toFixed(1)},${w[1].toFixed(1)}`,x=p.map(y).join(" L "),v=m.slice().reverse().map(y).join(" L ");return u`
    <path d="M ${x} L ${v} Z" fill="#ffffff" opacity="0.25" />
    <path d="M ${x}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
  `}var ge=t=>t??T;var A="#1e293b";function R(t){return t._config?.creature_style||"flat"}function I(t){return t._profile.shading}var g=(t,e,o,r)=>`M${t-o},${e} A${o},${r} 0 1,0 ${t+o},${e} A${o},${r} 0 1,0 ${t-o},${e} Z`,b=(t,e,o)=>g(t,e,o,o),C=t=>`M${t.trim().split(/\s+/).join(" L")} Z`,fe=(t,e,o,r)=>`M${t},${e} L${o},${r}`,f=(t,e,o={})=>({d:t,fill:e,...o});function _(t,e=!1){return u`<path d="${t.d}" fill="${t.fill??"none"}" stroke="${ge(t.stroke??(e?A:void 0))}" stroke-width="${ge(t.sw??(e?1.6:void 0))}" stroke-linecap="${ge(t.lc)}" stroke-linejoin="round" opacity="${ge(t.op)}" />`}function H(t,e,o,r,i={}){let s=_(f(o,r,i),t==="cartoon");return t==="realistic"&&e?u`${s}<path d="${o}" fill="url(#shade)" opacity="${ge(i.op)}" />`:s}var B=Object.freeze({x0:776,x1:1010,height:254,ledge:190,ledgeFrom:880,ledgeTo:940}),de=Object.freeze([{x:372,h:24,cave:!0},{x:500,h:26,cave:!1},{x:650,h:26,cave:!1},{x:770,h:26,cave:!1},{x:884,h:22,cave:!0},{x:850,h:118,cave:!1},{x:880,h:190,cave:!1},{x:940,h:190,cave:!1}]),re=Object.freeze(de.reduce((t,e,o)=>{if(o===0)return[0];let r=de[o-1];return[...t,t[o-1]+Math.hypot(e.x-r.x,e.h-r.h)]},[])),ye=re[re.length-1];function Je(t){let e=Math.max(0,Math.min(ye,t)),o=1;for(;o<re.length-1&&re[o]<e;)o++;let[r,i]=[de[o-1],de[o]],s=(e-re[o-1])/(re[o]-re[o-1]);return{x:r.x+(i.x-r.x)*s,h:r.h+(i.h-r.h)*s}}var et=Object.freeze(re.filter((t,e)=>de[e].cave)),tt=ye-(de[7].x-de[6].x)/2;function Hr(t,e=0){let o=R(t),r=o==="cartoon"?1.4:o==="realistic"?.65:1,i=o==="cartoon"?1.5:o==="realistic"?.7:1,s=[{count:11,baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:16,baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],a=[];return s.forEach((n,l)=>{for(let c=0;c<n.count;c++){let d=c/(n.count-1),h=-90-n.spread/2+d*n.spread,p=(n.lenMin+(n.lenMax-n.lenMin)*(.5+.5*Math.sin(d*Math.PI)))*(1-.3*e),m=l*10+c*.7,y=Math.sin(t._ambientTime*n.speed+m)*9*(1-e),x=h*Math.PI/180,v=Math.cos(x)*n.baseR,w=Math.sin(x)*n.baseR,S=c*37%17-8,M=h+90+y;a.push(u`
        <g transform="translate(${v.toFixed(1)}, ${w.toFixed(1)}) rotate(${M.toFixed(1)})">
          <path d="M 0,0 Q ${S.toFixed(1)},${(-p*.55).toFixed(1)} 0,${(-p).toFixed(1)}" stroke="${n.color}" stroke-width="${(n.width*r).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.9" />
          <circle cx="0" cy="${(-p).toFixed(1)}" r="${(n.width*.9*i).toFixed(1)}" fill="${o==="realistic"?"#ffffff":n.tip}" />
        </g>
      `)}}),a}function qr(t,e,o,r,i){let a=Array.from({length:8},(c,d)=>{let h=d/8*Math.PI*2+.18*Math.sin(i*1.3+d*2.1),p=1+.2*Math.sin(i*2.3+d*2.7)+.1*Math.sin(i*1.1+d*5.1);return{a:h,x:t+Math.cos(h)*o*p,y:e+Math.sin(h)*r*p}}),n=c=>`M${c.map(d=>`${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(" L")} Z`,l=a.filter(c=>Math.sin(c.a)<.15);return{body:n(a),top:n(l)}}function Vr(t){let e=t-B.ledge,[o,r]=[B.ledgeFrom-30,B.ledgeTo+52];return`M${o+10},${e} L${r-10},${e} L${r},${e+12} L${r-6},${e+30} L${o+8},${e+30} L${o},${e+12} Z`}var Xo=[[802,16,36,18,1,"#7d5c8f"],[862,30,58,32,2,"#8b6a9c"],[950,34,66,36,3,"#6d5280"],[1e3,46,34,48,4,"#7d5c8f"],[832,80,46,32,5,"#6d5280"],[906,94,54,34,6,"#8b6a9c"],[978,106,40,40,7,"#7d5c8f"],[920,146,64,30,8,"#6d5280"]],Gr=[[958,216,34,30,9,"#8b6a9c"],[998,198,24,36,10,"#7d5c8f"],[930,228,26,26,11,"#6d5280"]],Zr=[[322,26,38,26,21,"#7d5c8f"],[424,20,28,20,22,"#6d5280"],[314,70,30,36,23,"#8b6a9c"],[428,64,24,32,24,"#7d5c8f"],[372,110,68,30,25,"#6d5280"],[340,138,28,20,26,"#8b6a9c"],[404,134,26,18,27,"#7d5c8f"]],G={left:345,right:398,top:78},Qr=[[330,9,26,11,41,"#7d5c8f"],[352,20,14,10,42,"#8b6a9c"],[572,8,22,9,43,"#6d5280"],[716,11,32,13,44,"#8b6a9c"],[740,24,18,12,45,"#7d5c8f"],[610,6,12,6,46,"#6d5280"],[506,6,10,5,47,"#8b6a9c"]];function Pe(t,e,o,[r,i,s,a,n,l]){let c=o-i,{body:d,top:h}=qr(r,c,s,a,n);return u`
    ${H(t,e,d,l)}
    ${t==="cartoon"?"":_(f(h,"#ffffff",{op:.15,stroke:"none"}))}
    ${t==="flat"?[[-.3,.1],[.25,.3],[-.05,.45]].map(([p,m])=>_(f(b(r+p*s,c+m*a,Math.max(1.4,s*.06)),"#3b2a4a",{op:.35,stroke:"none"}))):""}
  `}function Ko(t,e,o,r){let i=e,s=R(t),a=I(t),n=(c,d,h)=>H(s,a,c,d,h===void 0?{}:{op:h}),l=(c,d,h,p)=>s==="flat"?c.map(([m,y])=>_(f(b(m,y,h),d,{op:p}))):"";return u`
    <g id="reef-decor">
      <g style="${o}">
      ${n(`M 60 ${i} Q 40 ${i-165}, 95 ${i-225} Q 120 ${i-275}, 85 ${i-335} Q 135 ${i-265}, 120 ${i-195} Q 150 ${i-135}, 115 ${i} Z`,"#f43f5e",.95)}
      ${n(`M 115 ${i} Q 150 ${i-155}, 190 ${i-205} Q 215 ${i-245}, 190 ${i-295} Q 230 ${i-235}, 205 ${i-155} Q 180 ${i-105}, 155 ${i} Z`,"#fb7185",.9)}
      ${l([[88,i-40],[80,i-110],[98,i-190],[105,i-240],[92,i-300]],"#ffe4e6",3,.55)}
      ${l([[135,i-40],[160,i-120],[185,i-190],[196,i-250]],"#ffe4e6",3,.55)}
      <g transform="translate(690, ${i})">
        ${n("M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z","#c084fc",.85)}
        ${n("M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z","#a855f7",.9)}
        ${n("M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z","#d8b4fe",.85)}
        ${n(b(0,-20,60),"#7e22ce",.75)}
      </g>
      <g transform="translate(190, ${i-70})">
        ${H(s,a,"M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z","#1d4ed8",{stroke:"#1e40af",sw:2})}
        <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="5" fill="#60a5fa" />
      </g>
      </g>
      <g id="live-rock">
        ${Xo.slice(0,4).map(c=>Pe(s,a,i,c))}
        ${Xo.slice(4).map(c=>Pe(s,a,i,c))}
        ${_(f(g(884,i-52,36,22),"#0b0614",{stroke:"none",op:1}))}
        ${n(Vr(i),"#9a78ad")}
        ${s==="cartoon"?"":_(f(`M ${B.ledgeFrom-20},${i-B.ledge+3} L ${B.ledgeTo+44},${i-B.ledge+3}`,void 0,{stroke:"#ffffff",sw:1.6,op:.4,lc:"round"}))}
        ${Gr.map(c=>Pe(s,a,i,c))}
        ${s==="cartoon"?"":[[850,44,16,7],[942,108,18,8],[976,152,11,6],[812,74,12,6],[1002,200,9,7]].map(([c,d,h,p])=>_(f(g(c,i-d,h,p),"#e879f9",{op:.32,stroke:"none"})))}
        ${s==="flat"?[[846,66],[972,158]].map(([c,d])=>u`${_(f(`M ${c},${i-d} L ${c},${i-d-9}`,void 0,{stroke:"#fb923c",sw:1.2,lc:"round"}))}${_(f(b(c,i-d-11,3.2),"#fb923c",{stroke:"none"}))}`):""}
      </g>
      <g id="live-rock-scattered">
        ${Qr.map(c=>Pe(s,a,i,c))}
      </g>
      <g id="anemone" style="${o}" transform="translate(260, ${i-17}) scale(1.4, 1.4)">
        ${Hr(t,r)}
        ${n(g(0,-16,30,11),"#86198f",.9)}
        ${n("M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z","#701a75")}
        ${n(g(0,16,26,9),"#4a044e",.75)}
        ${s==="cartoon"?u`
              ${_(f(b(-8,3,3.6),"#ffffff",{stroke:A,sw:1.2}))}
              ${_(f(b(8,3,3.6),"#ffffff",{stroke:A,sw:1.2}))}
              ${_(f(b(-7.4,3.4,2),"#111827",{stroke:"none"}))}
              ${_(f(b(8.6,3.4,2),"#111827",{stroke:"none"}))}
              ${_(f("M -6,10 Q 0,16 6,10",void 0,{stroke:A,sw:1.5,lc:"round"}))}
              ${_(f(g(-14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
              ${_(f(g(14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
            `:""}
      </g>
      <g id="live-rock-2">
        ${Zr.map(c=>Pe(s,a,i,c))}
        ${s==="cartoon"?"":[[314,76,12,6],[404,140,14,6],[430,70,10,6]].map(([c,d,h,p])=>_(f(g(c,i-d,h,p),"#e879f9",{op:.32,stroke:"none"})))}
        ${_(f(`M ${G.left},${i-4} L ${G.left},${i-44} Q ${G.left},${i-G.top} ${(G.left+G.right)/2},${i-G.top} Q ${G.right},${i-G.top} ${G.right},${i-44} L ${G.right},${i-4} Z`,"#0b0614",{stroke:"none",op:1}))}
      </g>
    </g>
  `}var zr=[[140,25,70,26,"#475569",1],[250,17,50,20,"#64748b",1],[860,20,75,28,"#334155",1],[760,15,46,18,"#64748b",1],[300,10,26,10,"#94a3b8",.85],[600,8,22,9,"#94a3b8",.8],[660,14,34,14,"#475569",.9]];function Jo(t,e,o){return u`
    <g id="coldwater-decor">
      ${zr.map(([r,i,s,a,n,l])=>{let c=t-i;return u`
          ${H(e,o,g(r,c,s,a),n,{op:l})}
          ${_(f(g(r-s*.3,c-a*.4,s*.35,a*.22),"#ffffff",{op:.22}))}
        `})}
    </g>
  `}function ei(t,e,o,r){let i=t,s=(n,l,c)=>H(o,r,n,l,c===void 0?{}:{op:c}),a=(n,l)=>o==="flat"?_(f(n,void 0,{stroke:"#052e16",sw:1.5,op:l,lc:"round"})):"";return u`
    <g id="freshwater-plants" style="${e}">
      ${s(`M 45 ${i} Q 65 ${i-75}, 115 ${i-60} Q 155 ${i-85}, 200 ${i-50} Q 240 ${i-70}, 285 ${i} Z`,"#15803d")}
      ${s(`M 75 ${i} Q 95 ${i-60}, 135 ${i-55} Q 170 ${i-75}, 210 ${i-40} Q 250 ${i-50}, 270 ${i} Z`,"#22c55e",.85)}
      ${s(b(110,i-55,11),"#4ade80",.7)}
      ${s(b(170,i-63,12),"#4ade80",.7)}
      <path d="M 120 ${i} Q 140 ${i-105}, 160 ${i-155} Q 165 ${i-205}, 145 ${i-265}" stroke="${o==="cartoon"?A:"#14532d"}" stroke-width="${o==="cartoon"?10:8}" fill="none" stroke-linecap="round" />
      ${o==="cartoon"?u`<path d="M 120 ${i} Q 140 ${i-105}, 160 ${i-155} Q 165 ${i-205}, 145 ${i-265}" stroke="#14532d" stroke-width="6" fill="none" stroke-linecap="round" />`:""}
      ${s(`M 145 ${i-265} Q 105 ${i-305}, 85 ${i-280} C 70 ${i-250}, 110 ${i-220}, 145 ${i-265} Z`,"#166534")}
      ${s(`M 145 ${i-265} Q 185 ${i-315}, 215 ${i-295} C 230 ${i-270}, 190 ${i-230}, 145 ${i-265} Z`,"#15803d")}
      ${a(`M 145 ${i-265} Q 110 ${i-278}, 90 ${i-276}`,.4)}
      ${a(`M 145 ${i-265} Q 185 ${i-285}, 212 ${i-291}`,.4)}
      ${s(`M 880 ${i} Q 920 ${i-195}, 870 ${i-355} Q 845 ${i-195}, 860 ${i} Z`,"#16a34a",.9)}
      ${s(`M 920 ${i} Q 960 ${i-215}, 930 ${i-375} Q 895 ${i-205}, 900 ${i} Z`,"#22c55e",.8)}
      ${a(`M 870 ${i} Q 885 ${i-190}, 870 ${i-350}`,.3)}
      ${a(`M 910 ${i} Q 940 ${i-205}, 930 ${i-370}`,.3)}
    </g>
  `}function ti(t,e,o,r=0){let i=o?t._getCanvasHeight():t._getCanvasHeight()-35,s=t._profile.deathFilter?`filter: grayscale(${(r*.85).toFixed(2)}) sepia(${(r*.5).toFixed(2)}) brightness(${(1-r*.45).toFixed(2)});`:`opacity: ${(1-r*.6).toFixed(2)};`;return e==="saltwater"?Ko(t,i,s,r):e==="coldwater"?Jo(i,R(t),I(t)):ei(i,s,R(t),I(t))}var Yr=[[70,70,.1,-1],[150,95,.25,1],[260,60,.05,1],[380,110,.4,-1],[470,65,.15,1],[560,90,.3,-1],[650,120,.5,1],[740,70,.1,-1],[830,100,.35,1],[920,80,.2,-1],[985,60,.6,-1],[40,55,.7,1]],jr=[[-6,1,.15,"#3f6212"],[-2,.8,.35,"#4d7c0f"],[3,.65,-.1,"#365314"],[7,.5,.25,"#65a30d"]],Ft=(t,e,o)=>Math.sin(t/e)*.35+Math.sin(t/o+1.3)*.2,Rt=t=>`M${t.map(([e,o])=>`${e.toFixed(1)},${o.toFixed(1)}`).join(" L")} Z`,Wr=8,Ie=new Map;function Xr(t,e,o,r,i){let s=`${t}|${e}|${o}|${r}|${i}`,a=Ie.get(s);if(a)return a;let n=i-r,l=n*(.04+.16*t),c=[[e,i]];for(let x=e;x<=o;x+=8)c.push([x,i-l*(1+Ft(x,37,13))]);c.push([o,i]);let d=8+62*t,h=[[e,r]],p=[[o,r]];for(let x=r;x<=i;x+=8)h.push([e+d*(1+Ft(x,41,17)),x]),p.push([o-d*(1+Ft(x+90,41,17)),x]);h.push([e,i]),p.push([o,i]);let m=[];for(let[x,v,w,S]of Yr){let M=Math.min(1,(t-w)/.4);if(M<=0)continue;let k=Math.min(v*M,n*.3);for(let[F,L,O,K]of jr){let U=x+F,V=U+S*k*(.2+O),J=i-k*L,ee=U+(V-U)*.3-S*5,te=i-k*L*.55;m.push({d:`M${U},${i} Q${ee.toFixed(1)},${te.toFixed(1)} ${V.toFixed(1)},${J.toFixed(1)}`,color:K})}}let y={bottom:Rt(c),leftWall:Rt(h),rightWall:Rt(p),strands:m};return Ie.size>=Wr&&Ie.delete(Ie.keys().next().value),Ie.set(s,y),y}function oi(t,e,o){let r=t._config;if(!r)return u``;let i=r.algae_delay_hours,s=Number(r.algae_age)||0,a=s>0?s:e;if(!r.algae_enabled||a<i)return u``;let n=Math.round(Math.min(1,(a-i)/36)*1e3)/1e3,l=(.2+n*.78).toFixed(2),c=o?0:14,d=o?t._getCanvasHeight():t._getCanvasHeight()-35,h=Xr(n,o?0:12,o?1024:1012,c,d);return u`
    <g id="algae-layer" opacity="${l}">
      <rect x="0" y="${c}" width="1024" height="${d-c}" fill="url(#algaeDots)" opacity="${(.15+n*.2).toFixed(2)}" />
      <path d="${h.bottom}" fill="#4d7c0f" fill-opacity="0.32" />
      <path d="${h.bottom}" fill="url(#algaeDots)" />
      <path d="${h.leftWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${h.leftWall}" fill="url(#algaeDots)" opacity="0.8" />
      <path d="${h.rightWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${h.rightWall}" fill="url(#algaeDots)" opacity="0.8" />
      ${h.strands.map(p=>u`<path d="${p.d}" fill="none" stroke="${p.color}" stroke-width="2.6" stroke-linecap="round" />`)}
    </g>
  `}var E=t=>({fins:[],marks:[],over:[],pec:null,...t}),Ot=(t,e,o)=>`M ${t},${o} Q ${t+6},${o-4} ${t+12},${o} T ${e},${o}`,Kr=t=>E({fins:[f(C("5,-42 -10,-12 10,-12"),t,{op:.9}),f(C("0,42 -8,12 8,12"),t,{op:.9}),f(fe(8,10,20,48),void 0,{stroke:"#ffffff",sw:2,lc:"round"})],tail:{at:[-22,0],mul:1,shapes:[f(C("0,0 -20,-14 -15,0 -20,14"),t)],rays:[[-20,-14],[-17,0],[-20,14]]},body:f(C("-20,0 5,-17 24,0 5,17"),t),marks:[f(fe(3,-17,3,17),void 0,{stroke:"#0f172a",sw:3})],eye:{x:16,y:-3,r:3,iris:"#ef4444"},area:[3,0,12,10]}),Jr=()=>E({tail:{at:[-20,0],mul:1,shapes:[f(C("0,0 -14,-7 -12,0 -14,7"),"rgba(255,255,255,0.7)")],rays:[[-14,-7],[-12,0],[-14,7]]},body:f(g(0,0,22,9),"#1e293b"),marks:[f("M 15,-2 L -17,-2",void 0,{stroke:"#06b6d4",sw:3.5,lc:"round"}),f("M 0,3 L -17,3",void 0,{stroke:"#ef4444",sw:3.5,lc:"round"})],eye:{x:14,y:-2,r:2.2,iris:"#38bdf8"},area:[0,0,22,9]}),es=()=>E({fins:[f(b(2,0,24),"#b45309",{op:.75})],tail:{at:[-19,0],mul:1,shapes:[f("M 0,0 C -6,-8 -12,-7 -13,0 C -12,7 -6,8 0,0 Z","#c2410c",{op:.85})],rays:[[-12,-4],[-13,0],[-12,4]]},body:f(b(2,0,20),"#ea6a2a"),marks:[Ot(-14,18,-10),Ot(-14,18,-2),Ot(-14,18,6)].map(t=>f(t,void 0,{stroke:"#22d3ee",sw:1.8,op:.85,lc:"round"})),eye:{x:15,y:-3,r:2.6,iris:"#dc2626"},area:[2,0,14,14]}),ts=()=>E({fins:[f(C("-4,-6 4,-14 10,-6"),"#f97316",{op:.9})],tail:{at:[-16,0],mul:1,shapes:[f("M 0,0 C -8,-12 -22,-15 -29,-8 C -26,-3 -26,3 -29,8 C -22,15 -8,12 0,0 Z","#f97316",{op:.92}),f(b(-18,-6,2.2),"#1e3a8a",{op:.8}),f(b(-22,4,2.6),"#1e3a8a",{op:.8}),f(b(-14,5,1.6),"#1e3a8a",{op:.7})],rays:[[-29,-8],[-27,0],[-29,8]]},body:f(g(0,0,17,7.5),"#38bdf8"),marks:[f(g(-2,3.5,13,3),"#e0f2fe",{op:.55}),f(g(5,-2.5,6,2.2),"#0ea5e9",{op:.5})],eye:{x:12,y:-2,r:2.2},area:[0,0,13,6]}),os=()=>E({tail:{at:[-19,0],mul:1,shapes:[f(C("0,0 -12,-8 -9,0 -12,8"),"#fdba74",{op:.9})],rays:[[-12,-8],[-9,0],[-12,8]]},body:f(g(0,0,19,10),"#fb923c"),marks:[f(g(-1,6,13,3),"#fde68a",{op:.55}),f("M 6,-8.5 C 9,-4 9,4 6,8.5 C -2,8 -10,4 -16,1 C -10,-1 -2,-5 6,-8.5 Z","#111827")],eye:{x:13,y:-3,r:2.4,iris:"#fde68a"},area:[0,-1,14,7]}),is=()=>E({fins:[f(C("-14,-12 -3,-22 8,-12"),"#f97316",{op:.85}),f(C("-16,12 -4,20 10,12"),"#f97316",{op:.85}),f("M 12,8 C 18,16 20,24 18,32",void 0,{stroke:"#f97316",sw:.9,lc:"round"})],tail:{at:[-21,0],mul:1,shapes:[f("M 0,0 C -8,-9 -14,-8 -15,0 C -14,8 -8,9 0,0 Z","#3b82f6",{op:.85})],rays:[[-13,-5],[-15,0],[-13,5]]},body:f(g(0,0,21,14),"#3b82f6"),marks:[-12,-6,0,6,12].map((t,e)=>f(`M ${t-4},-12 L ${t+2},12`,void 0,{stroke:e%2?"#1d4ed8":"#f97316",sw:1.6,op:.85})),eye:{x:14,y:-4,r:2.8,iris:"#fef3c7"},area:[0,0,17,11]}),rs=()=>{let t=e=>f(e,"#ffffff",{stroke:"#0f172a",sw:1.4});return E({tail:{at:[-20,0],mul:1,shapes:[f("M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z","#ea580c",{stroke:"#0f172a",sw:1.4})],rays:[[-15,-6],[-17,0],[-15,6]]},body:f(g(0,0,24,15),"#f97316"),marks:[t("M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z"),t("M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z"),t("M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z")],pec:{at:[3,3],shapes:[f(g(0,6,6,10),"#f97316",{op:.9,stroke:"#0f172a",sw:1})]},eye:{x:15,y:-4,r:3.2},area:[0,0,22,13]})},ss=()=>E({tail:{at:[-25,0],mul:1,shapes:[f(C("0,-2 -20,-13 -13,-2 -20,9 0,2"),"#f59e0b"),f(C("0,-2 -17,-10 -12,-2 -17,7 0,1"),"#fde047",{op:.85})],rays:[[-20,-13],[-13,-2],[-20,9]]},body:f("M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z","url(#tangBodyGrad)"),marks:[f("M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z","#0f172a",{op:.88})],over:[f(b(19,2,1.5),"#facc15",{op:.8})],eye:{x:18,y:-6,r:2.8,iris:"#0f172a",hl:"#93c5fd"},area:[-2,0,20,16]}),ns=()=>E({fins:[f("M -16,-8 C -8,-17 8,-16 14,-9 Z","#facc15",{op:.9})],tail:{at:[-22,0],mul:1,shapes:[f("M 0,0 C -8,-9 -14,-9 -15,0 C -14,9 -8,9 0,0 Z","#facc15")],rays:[[-13,-5],[-15,0],[-13,5]]},body:f(g(0,0,22,10.5),"#facc15"),marks:[f("M -4,-10.3 A 22,10.5 0 0,1 22,0 A 22,10.5 0 0,1 -4,10.3 C 3,5 3,-5 -4,-10.3 Z","#7c3aed"),f("M 10,-3 L 22,-1",void 0,{stroke:"#1e1b4b",sw:1.4,lc:"round"})],eye:{x:16,y:-3,r:2.6,iris:"#fde68a"},area:[0,0,18,8]}),as=()=>{let t=(e,o)=>f(e,void 0,{stroke:"#ea580c",sw:1.3,op:o});return E({tail:{at:[-22,0],mul:1,shapes:[f(C("0,0 -12,-9 -8,0 -12,9"),"#fbbf24",{op:.9})],rays:[[-12,-9],[-8,0],[-12,9]]},body:f(g(0,0,23,20),"url(#butterflyBodyGrad)"),marks:[t(fe(-14,-16,-8,17),.55),t(fe(-6,-19,0,19),.55),t(fe(2,-19,7,19),.55),t(fe(10,-17,14,16),.5)],over:[f("M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z","#fbbf24"),f(b(-15,0,3),"#1f2937",{op:.8}),f(b(-15,0,1.6),"#fbbf24",{op:.9})],eye:{x:12.5,y:-4,r:2.6,iris:"#0f172a",hl:"#e2e8f0"},area:[0,0,20,17]})},ls=()=>E({fins:[f(C("-14,-15 0,-24 16,-12"),"#fde047",{op:.95}),f(C("-12,15 2,23 16,12"),"#fde047",{op:.95})],tail:{at:[-22,0],mul:1,shapes:[f(C("0,0 -12,-10 -8,0 -12,10"),"#fde047")],rays:[[-12,-10],[-8,0],[-12,10]]},body:f(g(0,0,22,17),"#fde047"),marks:[f(g(2,8,16,6),"#fef9c3",{op:.7})],over:[f("M 20,-3 Q 27,-1 28,0 Q 27,1 20,3 Z","#fde047"),f(b(-19,0,1.6),"#ffffff",{op:.9})],eye:{x:14,y:-5,r:2.6,iris:"#ffffff"},area:[0,0,17,14]}),cs=()=>E({fins:[f(C("-6,-7 4,-14 12,-7"),"#2dd4bf",{op:.9}),f(C("-8,7 0,12 8,7"),"#2dd4bf",{op:.9})],tail:{at:[-20,0],mul:1,shapes:[f(C("0,0 -14,-11 -9,0 -14,11"),"#2dd4bf")],rays:[[-14,-11],[-9,0],[-14,11]]},body:f(g(0,0,20,8.5),"url(#chromisGrad)"),marks:[f(g(0,4,15,2.6),"#e0f2fe",{op:.45})],eye:{x:14,y:-2,r:2.2},area:[0,0,16,7]}),fs=()=>E({fins:[f(C("-12,-8 4,-20 14,-8"),"#fb923c",{op:.9})],tail:{at:[-21,0],mul:1,shapes:[f("M 0,0 L -8,-10 L -18,-16 L -8,-3 L -7,0 L -8,3 L -18,16 L -8,10 Z","#fb923c")],rays:[[-18,-16],[-7,0],[-18,16]]},body:f(g(0,0,21,9),"#f97316"),marks:[f(g(0,4.5,15,3.6),"#f9a8d4",{op:.65})],eye:{x:15,y:-2,r:2.4,iris:"#fde68a"},area:[0,0,16,7]}),ds=t=>E({fins:[f("M -4,-20 C 2,-33 18,-31 21,-18 Z",t,{op:.8})],tail:{at:[-14,0],mul:1.1,shapes:[f("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z",t,{op:.88})],rays:[[-35,-11],[-43,17],[-21,34]]},body:f("M -14,4 C -16,-12 -4,-26 10,-22 C 22,-19 28,-8 27,2 C 26,12 18,18 8,18 C -4,18 -14,14 -14,4 Z",t),marks:[f(g(4,9,12,6),"#ffffff",{op:.75}),f(g(-4,-10,7,4),"#ffffff",{op:.55})],eye:{x:21,y:-3,r:3.4},area:[6,0,15,15]}),hs=t=>E({fins:[f(C("-4,-16 4,-25 14,-17"),t,{op:.85})],tail:{at:[-16,0],mul:1,shapes:[f("M 0,0 L -48,-19 L -30,-1 Z",t,{op:.92}),f("M 0,0 L -48,19 L -30,1 Z",t,{op:.8})],rays:[[-48,-19],[-48,19]]},body:f("M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z",t),marks:[f(g(6,-5,10,4),"#ffffff",{op:.65}),f(g(-3,5,8,3.5),"#ffffff",{op:.55})],eye:{x:20,y:-3,r:3},area:[6,0,17,13]}),us=t=>E({tail:{at:[-14,0],mul:.8,shapes:[f("M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z",t,{op:.88})],rays:[[-30,-2],[-30,6]]},body:f(b(4,2,22),t),marks:[[-8,-4],[0,-12],[10,-10],[-10,6],[-2,0],[8,-2],[16,4],[-4,12],[6,10],[14,14]].map(([e,o])=>f(b(e,o,3.4),"#ffffff",{op:.32})),eye:{x:20,y:-1,r:3},area:[4,2,17,17]}),ps=()=>E({fins:[f("M -6,-15 C 0,-27 14,-26 15,-14 Z","#fecdd3",{op:.85})],tail:{at:[-15,0],mul:1,shapes:[f("M 0,0 C -8,-16 -24,-20 -38,-13 C -31,-7 -30,-2 -32,3 C -28,10 -36,15 -38,19 C -24,22 -8,16 0,0 Z","#fecdd3",{op:.88})],rays:[[-38,-13],[-32,3],[-38,19]]},body:f(g(4,2,21,17),"#ffedd5"),marks:[f(g(-2,-6,14,7),"#fdba74",{op:.55})],over:[[22,-6,6],[16,-13,6.5],[8,-15,6],[1,-12,5]].map(([t,e,o])=>f(b(t,e,o),"#dc2626")),eye:{x:22,y:0,r:3},area:[4,3,16,13]}),ms=()=>E({fins:[f("M -4,-18 C 2,-30 18,-28 20,-16 Z","#1f2937",{op:.85})],tail:{at:[-14,0],mul:1.1,shapes:[f("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z","#1f2937",{op:.9})],rays:[[-35,-11],[-43,17],[-21,34]]},body:f(b(6,1,21),"#111827"),marks:[f(g(2,-9,12,5),"#475569",{op:.45})],over:[f(g(23,-6,10.5,9),"#1f2937")],eye:{x:24,y:-6,r:6,iris:"#f59e0b"},area:[6,1,16,15]}),_s=()=>E({fins:[f(C("-6,-14 4,-24 14,-14"),"#dbeafe",{op:.85})],tail:{at:[-20,0],mul:1,shapes:[f("M 0,0 C -10,-15 -28,-15 -34,-5 L -30,0 L -34,5 C -28,15 -10,15 0,0 Z","#dbeafe",{op:.85})],rays:[[-34,-5],[-30,0],[-34,5]]},body:f(g(2,0,24,14),"#bfdbfe"),marks:[f(g(-8,-4,9,6),"#f97316"),f(g(9,4,6,4.5),"#dc2626"),f(b(2,-8,2.2),"#1e3a8a",{op:.75}),f(b(-2,7,1.8),"#111827",{op:.7}),f(b(14,-5,1.6),"#111827",{op:.7})],eye:{x:20,y:-3,r:3},area:[2,0,19,11]}),ii=[Kr,Jr,es,ts,os,is],ri=[rs,ss,ns,as,ls,cs,fs],si=[ds,hs,us,ps,ms,_s],Xn={freshwater:ii.length,saltwater:ri.length,coldwater:si.length};function ni(t,e){let o=e.color||"#3b82f6",r=t==="saltwater"?ri:t==="coldwater"?si:ii,i=Math.abs(Math.trunc(Number(e.species)))||0;return r[i%r.length](o)}var ot=11,gs=2.399963,ys=Array.from({length:ot},(t,e)=>{let o=Math.sqrt((e+.5)/ot)*.85,r=e*gs;return[o*Math.cos(r),o*Math.sin(r),.75+e*7%3*.3]});function $s(t){return t>0?Math.min(ot,Math.ceil(t*ot)):0}function $e(t,e,o,r=1.7){let i=$s(t);if(i===0)return u``;let[s,a,n,l]=e,c=Math.min(1,.35+t);return u`
    <g class="stress-dots" pointer-events="none">
      ${ys.slice(0,i).map(([d,h,p],m)=>{let y=.8+.2*Math.sin(o*5+m*1.7);return u`<circle cx="${(s+d*n).toFixed(1)}" cy="${(a+h*l).toFixed(1)}" r="${(r*p).toFixed(2)}" fill="#ffffff" fill-opacity="${(c*y).toFixed(2)}" stroke="#0f172a" stroke-opacity="${(.28*c).toFixed(2)}" stroke-width="0.4" />`})}
    </g>
  `}function bs(t){let[e,o,r,i]=t,s=[],a=0;for(let n=o-i*.7;n<=o+i*.7;n+=5){for(let l=e-r*.8+a%2*3;l<=e+r*.8;l+=6)((l-e)/r)**2+((n-o)/i)**2<=.72&&s.push(`M${l.toFixed(1)},${n.toFixed(1)} q3,2.4 6,0`);a++}return s.join(" ")}function xs(t,e){let o=e.iris??"#ffffff",r=e.hl??"#ffffff";if(t==="cartoon"){let i=e.r*2.1;return u`
      <circle cx="${e.x}" cy="${e.y}" r="${i}" fill="#ffffff" stroke="${A}" stroke-width="1.5" />
      <circle cx="${e.x+i*.12}" cy="${e.y+i*.1}" r="${i*.6}" fill="#111827" />
      <circle cx="${e.x+i*.3}" cy="${e.y-i*.28}" r="${i*.26}" fill="#ffffff" />
      <circle cx="${e.x-i*.12}" cy="${e.y+i*.3}" r="${i*.12}" fill="#ffffff" />
    `}return t==="realistic"?u`
      <circle cx="${e.x}" cy="${e.y}" r="${e.r*1.15}" fill="${o==="#ffffff"?"#fef3c7":o}" stroke="#111827" stroke-opacity="0.8" stroke-width="0.9" />
      <circle cx="${e.x+.4}" cy="${e.y}" r="${e.r*.62}" fill="#000000" />
      <circle cx="${e.x-e.r*.3}" cy="${e.y-e.r*.4}" r="${e.r*.28}" fill="${r}" />
    `:u`
    <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${o}" />
    <circle cx="${e.x+1}" cy="${e.y}" r="${e.r*.48}" fill="#0f172a" />
    <circle cx="${e.x+.4}" cy="${e.y-e.r*.4}" r="${e.r*.2}" fill="${r}" />
  `}function ws(t,e,o){let[r,i,s,a]=o.area,n=o.eye;return t==="cartoon"?u`
      ${_(f(g(n.x-n.r*.4,n.y+n.r*3.1,n.r*1.3,n.r*.8),"#fb7185",{op:.7,stroke:"none"}))}
      ${_(f(`M${n.x+n.r*.6},${n.y+n.r*2.7} q${n.r*1.2},${n.r*1.1} ${n.r*2.4},0`,void 0,{stroke:A,sw:1.3,lc:"round"}))}
    `:t==="realistic"?u`
      ${e?u`<path d="${o.body.d}" fill="url(#shade)" />`:""}
      ${_(f(bs(o.area),void 0,{stroke:"#0f172a",sw:.8,op:.22}))}
      ${_(f(g(r-s*.15,i-a*.62,s*.6,Math.max(1.4,a*.13)),"#ffffff",{op:.3}))}
    `:u`
    ${_(f(g(r,i+a*.55,s*.85,a*.4),"#ffffff",{op:.14}))}
    ${_(f(`M${n.x-n.r*1.6},${n.y+n.r*.8} q${-n.r*.9},${n.r*2.2} 0,${n.r*4.4}`,void 0,{stroke:"#0f172a",sw:1,op:.22,lc:"round"}))}
  `}function vs(t,e,o,r,i,s=0,a=0){let n=t==="cartoon",l=t==="cartoon"?[]:o.tail.rays,c=t==="realistic"?.32:.16;return u`
    ${o.fins.map(d=>_(d,n))}
    <g transform="translate(${o.tail.at[0]}, ${o.tail.at[1]}) rotate(${r*o.tail.mul})">
      ${o.tail.shapes.map(d=>_(d,n))}
      ${l.map(([d,h])=>_(f(`M0,0 L${d},${h}`,void 0,{stroke:"#0f172a",sw:.9,op:c})))}
    </g>
    ${_(o.body,n)}
    ${o.marks.map(d=>_(d,n))}
    ${ws(t,e,o)}
    ${o.over.map(d=>_(d,n))}
    ${$e(s,o.area,a)}
    ${o.pec?u`<g transform="translate(${o.pec.at[0]}, ${o.pec.at[1]}) rotate(${i})">${o.pec.shapes.map(d=>_(d,n))}</g>`:""}
    ${xs(t,o.eye)}
  `}function ai(t,e,o,r){let i=e.dir===-1,s=e.deathProgress||0,a=e.scale||1.4,n=(1-s).toFixed(2),l=s.toFixed(2),c=r?0:e.scare||0,d=r?0:Math.sin(t._animTime*(3.5*e.vx)+e.phase)*14*(1+.8*c),h=r?0:Math.sin(t._animTime*(4.5*e.vx)+e.phase)*10,p=r?0:e.stress||0,m=vs(R(t),I(t),ni(o,e),d,h,p,t._ambientTime);return u`
    <g transform="scale(${i?-a:a}, ${r?-a:a})">
      <g opacity="${n}">${m}</g>${s>0?u`
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
  `}function Pt(t,e){let o=`M${t[0]},${t[1]}`;for(let i of e)o+=` C${i.join(",")}`;let r=[t,...e.map(i=>[i[4],i[5]])];for(let i=e.length-1;i>=0;i--){let[s,a,n,l]=e[i];o+=` C${-n},${l} ${-s},${a} ${-r[i][0]},${r[i][1]}`}return`${o} Z`}function It(t,e,o){return{k:(s,a,n)=>H(t,e,s,a,{...t==="cartoon"?{}:o,...n===void 0?{}:{op:n}}),line:(s,a,n,l)=>_(f(s,void 0,{stroke:n,sw:a,op:l,lc:"round"}))}}var Ms=[[-24,8,"M -24,8 L -27,16 L -31,21"],[-16,9,"M -16,9 L -17,17 L -20,22"],[-8,9,"M -8,9 L -8,17 L -10,22"],[0,9,"M 0,9 L 1,17 L 0,22"]],ks=[[22,-4,"M 22,-4 L 33,-11 L 42,-6","M 22,-4 L 33,-11"],[24,1,"M 24,1 L 36,1 L 44,7","M 24,1 L 36,1"],[22,7,"M 22,7 L 32,14 L 38,24","M 22,7 L 32,14"],[16,12,"M 16,12 L 22,22 L 25,32","M 16,12 L 22,22"]],be=t=>u`${t}<g transform="scale(-1,1)">${t}</g>`;function Be(t,e,o){return u`
    ${_(f(b(t,e,o),"#ffffff",{stroke:A,sw:1.2}))}
    ${_(f(b(t+o*.15,e+o*.1,o*.58),"#111827",{stroke:"none"}))}
    ${_(f(b(t+o*.32,e-o*.3,o*.24),"#ffffff",{stroke:"none"}))}
  `}function li(t,e,o){let r=t==="cartoon",{k:i,line:s}=It(t,e,{stroke:"#0a0f14",sw:.8}),a=Array.from({length:18},(n,l)=>{let c=l/18*Math.PI*2,[d,h]=[Math.cos(c),Math.sin(c)];return`M${(d*6.5).toFixed(1)},${(h*5).toFixed(1)} L${(d*8.6).toFixed(1)},${(h*6.7).toFixed(1)}`}).join(" ");return u`
    ${i(Pt([0,73],[[3,75,8,80,9,89],[6,91,2,88,0,84]]),"#182026")}
    ${t==="cartoon"?"":be(s("M 1,76 L 6,88 M 1,76 L 8,86",.7,"#64748b",.5))}
    ${be(u`
      ${i("M 15,12 C 24,12 32,20 34,32 C 33,38 28,40 24,36 C 19,30 16,22 15,16 Z","#182026")}
      ${r?"":s("M 16,15 L 33,26 M 16,17 L 33,32 M 17,19 L 30,37 M 18,20 L 25,37",.7,"#64748b",.5)}
      ${s("M 15,12 C 24,12 31,19 34,31",1.5,"#64748b",.9)}
      ${i("M 9,38 C 15,40 20,47 19,55 C 16,57 12,53 10,48 Z","#182026")}
      ${r?"":s("M 10,41 L 18,52 M 11,43 L 15,54",.6,"#64748b",.5)}
      ${i("M 4,60 C 7,60 9,64 8,68 C 6,68 4,66 3,64 Z","#182026")}
    `)}
    ${i(Pt([0,-11],[[7,-11,13,-8,15,-1],[17,6,18,12,16,18],[14,28,11,42,8,56],[6,64,3,71,0,75]]),"#1e293b")}
    ${i(Pt([0,14],[[7,14,10,22,9,32],[8,44,6,56,4,66],[3,69,2,71,0,72]]),"#475569",.9)}
    ${t==="flat"?[[-3,24,1.2],[4,30,1],[-5,38,1.3],[3,46,1],[-3,54,1.2],[2,62,.9],[-1,32,.8],[5,52,.8]].map(([n,l,c])=>_(f(b(n,l,c),"#ffffff",{op:.7,stroke:"none"}))):""}
    ${t==="realistic"?be(s("M 12,20 C 10,34 8,48 5,62",.9,"#0a0f14",.4)):""}
    ${be(u`
      ${s("M 6,-8 C 9,-12 12,-14 13,-19",2.2,"#3b4a5f",1)}
      ${s("M 10,-14 C 13,-15 15,-17 16,-20",1.6,"#3b4a5f",1)}
      ${s("M 2.5,-10 C 3.5,-14 3,-18 1.5,-21",2.2,"#3b4a5f",1)}
    `)}
    <g transform="translate(0, 3) scale(${o},${o})">
      ${_(f(g(0,0,9.2,7.2),"#64748b",{stroke:"#0a0f14",sw:.9}))}
      ${t==="cartoon"?"":s(a,.6,"#94a3b8",.7)}
      ${_(f(g(0,0,6.3,4.8),"#334155",{stroke:"#0a0f14",sw:.7}))}
      ${_(f(g(0,0,3.4,2.5),"#0f172a",{stroke:"none"}))}
    </g>
    ${r?u`${Be(-9,-3,3.8)}${Be(9,-3,3.8)}${_(f(g(-13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}${_(f(g(13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}`:be(u`${_(f(b(12.3,-3,1.7),"#0a0f14",{stroke:"none"}))}${_(f(b(12.7,-3.5,.5),"#f1f5f9",{stroke:"none"}))}`)}
    ${t==="realistic"?_(f(g(-4,34,2.4,14),"#ffffff",{op:.1,stroke:"none"})):""}
  `}function ci(t,e,o={}){let{phase:r=0,stride:i=0,time:s=0}=o,a=t==="cartoon",{k:n,line:l}=It(t,e,{stroke:"#7f1d1d",sw:.8}),[c,d,h]=[22,28,27],p=(M,k=h)=>[c+k*Math.cos(M*Math.PI/180),d+k*Math.sin(M*Math.PI/180)],m=[4,3,2,1,0].map(M=>{let k=-110+M*13,[F,L]=p(k),O=8-M*.8;return u`<g transform="rotate(${k} ${F.toFixed(1)} ${L.toFixed(1)})">${n(g(Number(F.toFixed(1)),Number(L.toFixed(1)),O,6.6-M*.25),M%2?"#c81e1e":"#d42424")}</g>`}),y=[0,1,2,3,4].map(M=>{let k=-110+M*13,F=8-M*.8,[L,O]=p(k,h-F),[K,U]=p(k,h-F-4.5),V=.3*Math.sin(s*6+M*1.1),[J,ee]=[K-L,U-O],[te,ve]=[L+J*Math.cos(V)-ee*Math.sin(V),O+J*Math.sin(V)+ee*Math.cos(V)];return`M${L.toFixed(1)},${O.toFixed(1)} L${te.toFixed(1)},${ve.toFixed(1)}`}).join(" "),x=Ms.map(([M,k,F],L)=>u`<g transform="rotate(${(i*16*Math.sin(r+L*1.7)).toFixed(1)} ${M} ${k})">${l(F,1.6,"#7f1d1d",.85)}</g>`),[v,w]=p(-45);return u`
    ${x}
    ${l(y,1.3,"#7f1d1d",.7)}
    <g transform="translate(${v.toFixed(1)} ${w.toFixed(1)}) rotate(${45})">
      ${n("M 0,-2.4 C 5,-9.5 11,-10.5 14,-7 C 11,-3.2 6,-1 0,0 Z","#dc2626")}
      ${n("M 0,2.4 C 5,9.5 11,10.5 14,7 C 11,3.2 6,1 0,0 Z","#dc2626")}
      ${n("M 0,-3 C 6,-3 11,-1.6 15,0 C 11,1.6 6,3 0,3 Z","#ef4444")}
      ${a?"":l("M 2,-1.5 L 12,-7 M 2,0 L 13,0 M 2,1.5 L 12,7",.7,"#7f1d1d",.5)}
    </g>
    ${m}
    ${n("M -34,-3 C -34,-11 -25,-16 -12,-16 C 0,-16 10,-12 13,-4 C 15,1 12,6 6,8 L -14,8 C -27,8 -34,3 -34,-3 Z","#dc2626")}
    ${a?"":l("M -28,-12 C -18,-17 -2,-17 8,-14 C 12,-14 14,-12 16,-9",2.2,"#fef2f2",.85)}
    ${n("M -33,-9 L -50,-13 L -35,-3 Z","#dc2626")}
    ${l("M -32,-12 Q -60,-24 -88,-30 M -30,-9 Q -54,-12 -80,-10",1.1,"#fef9c3",.9)}
    ${l("M -33,-9 Q -44,-8 -50,-2",1,"#fef9c3",.8)}
    ${a?u`${Be(-26,-12,5)}${_(f(g(-22,-2,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${_(f("M -32,-4 Q -28,1 -23,-3",void 0,{stroke:A,sw:1.2,lc:"round"}))}`:u`
          ${_(f(b(-27,-13,3),"#0f172a",{stroke:"none"}))}
          ${_(f(b(-27.8,-14,.9),"#f1f5f9",{stroke:"none"}))}
        `}
    ${t==="flat"?[[-22,-7],[-14,-10],[-6,-10],[1,-7]].map(([M,k])=>_(f(b(M,k,1.5),"#fef2f2",{op:.9,stroke:"none"}))):""}
    ${t==="realistic"?_(f(g(-8,-14,12,1.6),"#ffffff",{op:.35,stroke:"none"})):""}
  `}function fi(t,e,o={}){let{phase:r=0,stride:i=0}=o,s=t==="cartoon",{k:a,line:n}=It(t,e,{stroke:"#7c2d12",sw:.9}),l=c=>{let d=p=>(i*13*Math.sin(r+p*Math.PI+c*Math.PI)).toFixed(1),h=ks.map(([p,m,y,x],v)=>u`
      <g transform="rotate(${d(v)} ${p} ${m})">
        ${n(y,s?3.2:2.6,"#7c2d12",1)}
        ${s?"":n(x,.8,"#f87171",.5)}
      </g>
    `);return u`
      ${h}
      <g transform="rotate(${(i*5*Math.sin(r*.7+c*1.3)).toFixed(1)} 20 -8)">
        ${n("M 20,-8 L 30,-17",s?4:3.4,"#7c2d12",1)}
        ${a("M 27,-19 C 25,-30 34,-36 41,-33 C 46,-30 45,-25 41,-24 C 45,-21 43,-16 38,-16 C 33,-16 29,-17 27,-19 Z","#ea580c")}
        ${a("M 31,-31 C 33,-40 42,-42 46,-37 C 42,-38 38,-36 36,-32 Z","#ea580c")}
        ${t==="cartoon"?"":_(f("M 36,-28 L 39,-31 L 40,-27 L 43,-29 M 34,-21 L 38,-22 L 38,-19 L 42,-20",void 0,{stroke:"#fef3c7",sw:.9,lc:"round",op:.8}))}
      </g>
    `};return u`
    ${l(0)}<g transform="scale(-1,1)">${l(1)}</g>
    ${a("M 0,-15 C 10,-16 20,-14 26,-8 L 30,-2 L 27,4 C 24,12 14,18 0,18 C -14,18 -24,12 -27,4 L -30,-2 L -26,-8 C -20,-14 -10,-16 0,-15 Z","#dc2626")}
    ${a("M 0,-11 C 9,-12 17,-10 22,-5 L 24,0 C 22,8 12,13 0,13 C -12,13 -22,8 -24,0 L -22,-5 C -17,-10 -9,-12 0,-11 Z","#ef4444",.55)}
    ${t==="cartoon"?"":u`
          ${n("M -14,-6 Q 0,-13 14,-6 M -16,2 Q 0,-4 16,2 M 0,-12 L 0,12",.9,"#7f1d1d",.4)}
          ${t==="flat"?[[-9,3,1.6],[9,4,1.6],[0,8,1.4],[6,-5,1.2],[-7,-4,1.2]].map(([c,d,h])=>_(f(b(c,d,h),"#fca5a5",{op:.85,stroke:"none"}))):""}
        `}
    ${be(u`${n("M 6,-15 L 7,-21",1.4,"#7c2d12",1)}${s?"":_(f(b(7,-22,2.2),"#0f172a",{stroke:"none"}))}`)}
    ${s?u`${Be(-7,-23,5)}${Be(7,-23,5)}${_(f("M -6,8 Q 0,14 6,8",void 0,{stroke:A,sw:1.4,lc:"round"}))}${_(f(g(-15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${_(f(g(15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}`:""}
    ${t==="realistic"?_(f(g(-7,-8,11,2.2),"#ffffff",{op:.3,stroke:"none"})):""}
  `}var di=(t,e,o)=>({phase:t.walk||0,stride:e?0:t.stride||0,time:o}),Bt=(t,e,o,r)=>$e(e?0:t.stress||0,o,r,1.5);function hi(t,e){if(!t._ancistrus)return u``;let o=t._ancistrus,r=o.deathProgress||0,i=(1-r).toFixed(2),s=e?1:Number((1+Math.sin(t._ambientTime*1.6)*.07).toFixed(3)),a=R(t),n=I(t);return u`
    <g transform="translate(${o.x}, ${o.y}) rotate(${e?0:(o.heading??0).toFixed(1)}) scale(1.5,${e?-1.5:1.5})">
      <g opacity="${i}">
        ${li(a,n,s)}
        ${Bt(o,e,[0,30,11,38],t._ambientTime)}
      </g>

      ${r>0?u`
            <g opacity="${r.toFixed(2)}">
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
  `}function ui(t,e){if(!t._shrimp)return u``;let o=t._shrimp,i=(1-(o.deathProgress||0)).toFixed(2),s=o.dir===-1?-1:1;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(${s*1.5}, ${e?-1.5:1.5})" opacity="${i}">
      ${ci(R(t),I(t),di(o,e,t._ambientTime))}
      ${Bt(o,e,[-4,-3,24,8],t._ambientTime)}
    </g>
  `}function pi(t,e){if(!t._crab)return u``;let o=t._crab,r=o.deathProgress||0,i=Math.max(0,Math.min(1,o.hide||0)),s=((1-r)*(1-i*.92)).toFixed(2),a=o.dir===-1?-1:1,n=Number((1.4*(1-i*.6)).toFixed(3)),l=i>.85&&!e?Math.min(1,(i-.85)/.15):0;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(${a*n}, ${e?-n:n})" opacity="${s}">
      ${fi(R(t),I(t),di(o,e,t._ambientTime))}
      ${Bt(o,e,[0,2,21,11],t._ambientTime)}
    </g>
    ${l>0?u`
          <g transform="translate(${o.x}, ${(o.y-22*n).toFixed(1)})" opacity="${l.toFixed(2)}">
            <circle cx="-6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="-5.4" cy="0.4" r="1.9" fill="#0f172a" />
            <circle cx="6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="6.6" cy="0.4" r="1.9" fill="#0f172a" />
          </g>
        `:""}
  `}function mi(t){return u`
    <g>
      ${t._flowBubbles.filter(e=>e.active).map(e=>u`<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="${e.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`)}
    </g>
  `}function _i(t){return t._food.length?u`
    <g>
      ${t._food.map(e=>u`<ellipse cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" rx="${e.r.toFixed(1)}" ry="${(e.r*.6).toFixed(1)}" fill="${e.color}" stroke="#b45309" stroke-width="0.6" />`)}
    </g>
  `:u``}function gi(t){if(!t._ripples.length)return u``;let e=Date.now();return u`
    <g>
      ${t._ripples.map(o=>{let r=Math.min(1,(e-o.born)/We),i=(1-r).toFixed(2);return u`
          <circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(14+r*150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5-r*3).toFixed(1)}" stroke-opacity="${i}" />
          ${t._profile.doubleRipple?u`<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(6+r*90).toFixed(1)}" fill="#ffffff" fill-opacity="${(.28*(1-r)).toFixed(2)}" />`:""}
        `})}
    </g>
  `}function yi(t){return u`
    <g>
      ${t.map(e=>u`
          <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
        `)}
    </g>
  `}function $i(t){return u`
    <g>
      ${t.map(e=>u`
          <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
        `)}
    </g>
  `}function bi(t,e){if(!e)return u``;let o=Ke(e.total,Q(t._hass));return u`
    <g transform="translate(512, 96)" pointer-events="none">
      <text font-family="system-ui, sans-serif" font-size="54" font-weight="800" text-anchor="middle" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${o}</text>
    </g>
  `}function xi(t){return!t._config?.show_fps||!t._fpsInfo?u``:u`
    <g pointer-events="none">
      <rect x="292" y="6" width="440" height="30" rx="8" fill="#000000" fill-opacity="0.72" />
      <text x="512" y="27" font-family="monospace" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${t._fpsInfo}</text>
    </g>
  `}function wi(t,e,o){if(!e)return u``;let r=o?112:24+(t._config?.show_fps?38:0),i=X(Q(t._hass),"label_sensor_unavailable");return u`
    <g transform="translate(0, ${r})" pointer-events="none">
      <rect x="362" y="0" width="300" height="34" rx="17" fill="#000000" fill-opacity="0.72" />
      <path d="M383 25 L393 8 L403 25 Z" fill="#f59e0b" />
      <rect x="392" y="13" width="2" height="7" fill="#0f172a" />
      <circle cx="393" cy="22.4" r="1.3" fill="#0f172a" />
      <text x="416" y="23" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${i}</text>
    </g>
  `}function vi(t,e){if(!t)return u``;let o=Math.max(260,t.length*22+70);return u`
    <g transform="translate(512, ${Math.round(e/2)})" pointer-events="none">
      <rect x="${-o/2}" y="-30" width="${o}" height="60" rx="30" fill="#000000" fill-opacity="0.72" />
      <text y="9" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">${t}</text>
    </g>
  `}function Ss(t,e,o,r){let i=t==="cartoon",s=(l,c,d)=>H(t,e,l,c,{...i?{}:{stroke:"#a16207",sw:.7},...d===void 0?{}:{op:d}}),a=(l,c,d,h)=>_(f(l,void 0,{stroke:d,sw:c,op:h,lc:"round"}));return u`
    ${s(g(-44,4,20,7),"#d8b45f",.95)}
    ${_(f(g(-42,2.4,11,3.6),"#5b4423",{stroke:"none"}))}
    ${s("M -34,-1 C -40,-7 -47,-7 -49,-1 C -47,5 -40,6 -34,-1 Z","#fde68a")}
    ${s("M -28,-5 C -24,-13 -14,-15 -8,-11 L -10,-6 Z","#fde047",.9)}
    <g transform="rotate(${o.toFixed(2)} 2 -10)">
      ${s("M -6,-10 C -3,-26 8,-30 13,-23 C 12,-17 9,-12 7,-10 Z","#fde047",.95)}
      ${i?"":a("M -3,-13 C 0,-24 6,-27 11,-22",1.1,"#38bdf8",.8)}
    </g>
    ${s("M -34,-1 C -26,-6 -12,-11 6,-12 C 16,-12.5 26,-10 31,-5 C 34,-2 33,1 29,3 C 22,5.5 6,6 -10,4.5 C -24,3 -32,2 -34,-1 Z","#fde047")}
    ${_(f(g(4,3,26,3.4),"#fef9c3",{op:.8,stroke:"none"}))}
    ${i?"":a("M -14,-9 L -15,4 M -2,-11 L -3,5 M 10,-11 L 9,5",2.4,"#fffbeb",.55)}
    ${i?"":[[22,-2,1.1],[17,-6,1],[26,-6,.9]].map(([l,c,d])=>_(f(b(l,c,d),"#38bdf8",{stroke:"none"})))}
    ${s("M 15,0 C 22,4 21,11 14,11 C 12,6 12,2 15,0 Z","#fde68a",.9)}
    ${a("M 17,-8 Q 13,-2 16,4",1+r*.3,"#a16207",.35)}
    ${i?u`
          ${_(f(b(25,-11,6),"#ffffff",{stroke:A,sw:1.3}))}
          ${_(f(b(26,-10.4,3.5),"#111827",{stroke:"none"}))}
          ${_(f(b(27.8,-12.6,1.4),"#ffffff",{stroke:"none"}))}
          ${_(f(g(22,0,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
          ${a("M 32,0 Q 28,3.5 24,2",1.3,A,1)}
        `:u`
          ${_(f(b(25,-10,3.4),t==="realistic"?"#fef3c7":"#fffbeb",{stroke:"#111827",sw:.7,op:1}))}
          ${_(f(b(25.6,-10,1.8),"#0f172a",{stroke:"none"}))}
          ${_(f(b(24.6,-11,.6),"#ffffff",{stroke:"none"}))}
          ${a("M 33,0 Q 29,2 26,1",.9,"#a16207",.8)}
        `}
    ${t==="realistic"?_(f(g(6,-8,14,1.6),"#ffffff",{op:.32,stroke:"none"})):""}
    ${t==="flat"?a("M -20,-6 Q -8,-9 4,-8",.8,"#a16207",.3):""}
  `}function Mi(t,e){if(!t._goby)return u``;let o=t._goby,i=(1-(o.deathProgress||0)).toFixed(2),s=e?0:Math.sin(t._ambientTime*1.4)*3,a=e?0:Math.sin(t._ambientTime*2.6);return u`
    <g transform="translate(${o.x}, ${o.y}) scale(1.3, ${e?-1.3:1.3})" opacity="${i}">
      ${Ss(R(t),I(t),s,a)}
      ${$e(e?0:o.stress||0,[0,-3,27,6],t._ambientTime,1.5)}
    </g>
  `}var Y="#0f172a",xe="system-ui, sans-serif",se=62,Ai=30,Ti=92,he=9,Cs=38,ki=114,Ht=12,Nt=Ai+Ti-1+Ht,Ut=992,it=170,z=62,Si=10,Dt=270,rt=135,As=102;function Ts(t,e,o){let r=s=>ki-s*(ki-Cs),i=r(e.tempFraction);return u`
    <g pointer-events="none">
      <rect x="${se-he}" y="${Ai}" width="${he*2}" height="${Ti}" rx="${he}" fill="#ffffff" fill-opacity="0.9" stroke="${Y}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${se}" cy="${Nt}" r="${Ht}" fill="#ffffff" fill-opacity="0.9" stroke="${Y}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${se}" cy="${Nt}" r="${Ht-3.5}" fill="${e.tempColor}" />
      <rect x="${se-4.5}" y="${i}" width="9" height="${Nt-i}" fill="${e.tempColor}" />
      ${e.ticks.map(s=>u`<line x1="${se-he}" y1="${r(s)}" x2="${se-he-8}" y2="${r(s)}" stroke="${Y}" stroke-opacity="0.45" stroke-width="2" />`)}
      ${e.marks.map(s=>u`<line x1="${se+he}" y1="${r(s.fraction)}" x2="${se+he+12}" y2="${r(s.fraction)}" stroke="${s.color}" stroke-width="3.5" stroke-linecap="round" />`)}
      <text x="106" y="96" font-family="${xe}" font-size="54" font-weight="800" fill="${Y}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${P(t,o)}°</text>
    </g>
  `}function Es(t,e,o,r,i){let s=o?u`<tspan dx="12" font-size="30" font-weight="700">/ ${Oe(e,i)}</tspan><tspan dx="6" font-size="28" font-weight="800">L</tspan>`:u`<tspan dx="6" font-size="28" font-weight="800">L</tspan>`;return u`
    <g pointer-events="none">
      <text x="${Ut}" y="86" text-anchor="end" font-family="${xe}" font-size="58" font-weight="800" fill="${Y}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${P(t,i)}${s}</text>
      <rect x="${Ut-it}" y="104" width="${it}" height="9" rx="4.5" fill="${Y}" fill-opacity="0.18" />
      <rect x="${Ut-it}" y="104" width="${(r.volFraction*it).toFixed(1)}" height="9" rx="4.5" fill="${r.volColor}" />
    </g>
  `}function Ci(t,e,o,r,i=[]){let s=2*Math.PI*z,a=Dt/360*s,n=(rt+e*Dt)*Math.PI/180,l=z*Math.cos(n),c=z*Math.sin(n);return u`
    <g transform="translate(${t}, ${As})" pointer-events="none">
      <circle r="${z+26}" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
      <circle r="${z}" fill="none" stroke="rgba(15, 23, 42, 0.15)" stroke-width="${Si}" stroke-linecap="round" stroke-dasharray="${a.toFixed(1)} ${s.toFixed(1)}" transform="rotate(${rt})" />
      <circle r="${z}" fill="none" stroke="${o}" stroke-width="${Si}" stroke-linecap="round" stroke-dasharray="${(e*a).toFixed(1)} ${s.toFixed(1)}" transform="rotate(${rt})" />
      ${i.map(d=>{let h=(rt+d.fraction*Dt)*Math.PI/180,[p,m]=[Math.cos(h),Math.sin(h)];return u`<line x1="${((z+8)*p).toFixed(1)}" y1="${((z+8)*m).toFixed(1)}" x2="${((z+18)*p).toFixed(1)}" y2="${((z+18)*m).toFixed(1)}" stroke="${d.color}" stroke-width="3.5" stroke-linecap="round" />`})}
      <circle cx="${l.toFixed(1)}" cy="${c.toFixed(1)}" r="8" fill="#ffffff" stroke="${o}" stroke-width="4" />
      ${r}
    </g>
  `}function Ei({style:t,currentTemp:e,currentVolume:o,targetBudget:r,comfortMin:i,deadlyTemp:s,boilTemp:a,showBudget:n,forceTemp:l=!1,lang:c}){let d=Co({currentTemp:e,currentVolume:o,targetBudget:r,comfortMin:i,deadlyTemp:s,boilTemp:a}),h=e>0||l;if(t!=="arc")return u`
      ${h?Ts(e,d,c):""}
      ${Es(o,r,n,d,c)}
    `;let p=u`<text y="13" font-family="${xe}" font-size="34" font-weight="800" fill="${Y}" text-anchor="middle">${P(e,c)}°</text>`,m=n?u`
        <text y="4" font-family="${xe}" font-size="34" font-weight="800" fill="${Y}" text-anchor="middle">${P(o,c)}</text>
        <text y="30" font-family="${xe}" font-size="20" font-weight="700" fill="${Y}" text-anchor="middle">/ ${Oe(r,c)} L</text>
      `:u`<text y="13" font-family="${xe}" font-size="34" font-weight="800" fill="${Y}" text-anchor="middle">${P(o,c)}<tspan dx="3" font-size="20" font-weight="800">L</tspan></text>`;return u`
    ${h?Ci(102,d.tempFraction,d.tempColor,p,d.marks):""}
    ${Ci(922,d.volFraction,d.volColor,m)}
  `}function Li({isFullscreen:t,canvasH:e,canvasBottom:o,waterColorStart:r,waterColorEnd:i,isBoiling:s}){return u`
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
        <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
      </linearGradient>

      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${r}" stop-opacity="${s?"0.5":"0.25"}" />
        <stop offset="100%" stop-color="${i}" stop-opacity="${s?"0.75":"0.45"}" />
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
        ${t?u`<rect x="0" y="0" width="1024" height="${e}" />`:u`<rect x="12" y="14" width="1000" height="${o-14}" rx="18" ry="18" />`}
      </clipPath>
    </defs>
  `}function Fi({isFullscreen:t,canvasH:e,canvasBottom:o,tankBottom:r,theme:i}){return u`
    <rect
      x="${t?0:12}"
      y="${t?0:14}"
      width="${t?1024:1e3}"
      height="${t?e:o-14}"
      fill="${i.background}"
    />

    <path
      d="M ${t?0:12} ${r-60} Q 280 ${r-85}, 512 ${r-55} T ${t?1024:1012} ${r-60} L ${t?1024:1012} ${r} L ${t?0:12} ${r} Z"
      fill="${i.sandColor}"
    />
  `}function Ri(t,e){return t?u``:u`
    <rect x="12" y="14" width="1000" height="${e-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
    <rect x="4" y="${e}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
  `}var Oi=["turret","ramshorn","round"],Ls={turret:"#a8a29e",ramshorn:"#dc2626",round:"#d97706"},Pi="M -9,-0.5 C -9,-4 -6,-8 -3,-12 C 0,-8 2,-4 1.5,-0.5 Z",Fs="M -2.5,-4.5 a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0 a 3,3 0 0 1 6,0 a 4,4 0 0 1 -8,0";function Rs(t,e,o,r){let i=o==="cartoon"?{stroke:A,sw:.5}:{},s=c=>o==="realistic"&&r?u`<path d="${c}" fill="url(#shade)" />`:"",a=(c,d,h)=>o==="cartoon"?"":_(f(c,void 0,{stroke:d,sw:.5,op:h,lc:"round"})),n=o==="realistic"?"#000000":"#ffffff",l=o==="realistic"?.28:.5;return t==="turret"?u`
      ${_(f(Pi,e,i))}
      ${s(Pi)}
      ${a("M -8.4,-3 Q -3.5,-1.2 1.2,-3 M -7.4,-6 Q -3.3,-4.4 0.2,-6 M -6,-9 Q -3.2,-7.8 -0.8,-9",n,l)}
    `:t==="ramshorn"?u`
      ${_(f(b(-2.5,-4.5,5),e,i))}
      ${s(b(-2.5,-4.5,5))}
      ${a(Fs,n,l+.15)}
    `:u`
    ${_(f(b(-3,-4,5.5),e,i))}
    ${s(b(-3,-4,5.5))}
    <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
    ${o==="flat"?a("M -6.5,-4 A 3.5,3.5 0 1 1 -3,-0.5 M -5,-4 A 2,2 0 1 1 -3,-2","#ffffff",.5):""}
    ${o==="realistic"?a("M -7,-4 A 4,4 0 1 1 -3,0 M -5.4,-4 A 2.4,2.4 0 1 1 -3,-1.6","#000000",.28):""}
  `}function Os(t,e,o,r,i){let s=o==="cartoon"?{stroke:A,sw:.5}:{},a=Ls[i];return u`
    ${Rs(i,t.color||"#854d0e",o,r)}
    ${e?"":u`
          ${_(f(g(2,-1.5,5,2.2),a,s))}
          ${o==="realistic"&&r?u`<path d="${g(2,-1.5,5,2.2)}" fill="url(#shade)" />`:""}
          <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="${a}" stroke-width="0.8" />
          ${o==="cartoon"?u`${_(f(b(7.5,-5.7,1.5),"#ffffff",{stroke:A,sw:.5}))}${_(f(b(7.8,-5.6,.8),"#111827",{stroke:"none"}))}`:u`<circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />`}
        `}
  `}function Ii(t,e,o,r,i){return u`
    <g>
      ${t.map((s,a)=>{let n=s.type==="glass_left"?90:s.type==="glass_right"?-90:0,l=e==="saltwater"?a%2===0?3.5:4.2:1.8;return u`
          <g transform="translate(${s.x}, ${s.y}) rotate(${o?0:n}) scale(${s.dir*l},${l})">
            ${Os(s,o,r,i,Oi[a%Oi.length])}
          </g>
        `})}
    </g>
  `}function Bi(t,e){let{isFullscreen:o,canvasH:r,canvasBottom:i,ariaLabel:s,aspectWidth:a,aspectHeight:n,themeKey:l,theme:c,waterColorStart:d,waterColorEnd:h,isBoiling:p,isDead:m,waterRatio:y,waterSurfaceY:x,tankBottom:v,effectiveAlgaeHours:w,showReadings:S,forceTemp:M,displayedTemp:k,currentVolume:F,targetBudget:L,comfortMin:O,deadlyTemp:K,boilTemp:U,gaugeStyle:V,showBudget:J,cost:ee,lang:te,sensorLost:ve,biotopeNotice:at}=e;return N`
    <svg
      role="img"
      aria-label="${s}"
      @click=${D=>t._onTankTap(D)}
      @pointerdown=${D=>t._onSwipeStart(D)}
      @pointerup=${D=>t._onSwipeEnd(D)}
      @pointercancel=${()=>t._onSwipeCancel()}
      viewBox="0 0 1024 ${r}"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="${t._profile.antialias?"auto":"optimizeSpeed"}"
      style="${o?"width: 100%; height: 100%;":`aspect-ratio: ${a} /${n};`}"
    >
      ${Li({isFullscreen:o,canvasH:r,canvasBottom:i,waterColorStart:d,waterColorEnd:h,isBoiling:p})}

      <g clip-path="url(#innerTankClip)">
        ${Fi({isFullscreen:o,canvasH:r,canvasBottom:i,tankBottom:v,theme:c})}

        ${t._renderThemeDecoration(l,o,t._deathProgress)}

        ${Ii(t._snails,l,m,R(t),I(t))}

        ${y>0?u`
              <g>
                <rect
                  x="${o?0:12}"
                  y="${x-5}"
                  width="${o?1024:1e3}"
                  height="${v-x+5}"
                  fill="url(#waterGrad)"
                />
                ${t._renderWaterSurface(o?0:12,o?1024:1012,x)}
              </g>
            `:""}

        ${y>0&&!m?yi(t._bubbles):""}

        ${y>0&&!m?t._renderFlowBubbles():""}
        ${t._renderFood()}

        ${p&&y>0?$i(t._boilingBubbles):""}

        <g>
          ${(t._fishes||[]).map(D=>u`
              <g transform="translate(${D.x},${D.y})">
                ${t._renderFishShape(D,l,m)}
              </g>
            `)}
        </g>

        ${l==="freshwater"?t._renderAncistrus(m):""}
        ${l==="saltwater"?t._renderCrab(m):""}
        ${l==="saltwater"?t._renderShrimp(m):""}
        ${l==="saltwater"?t._renderGoby(m):""}
        ${t._renderAlgae(w,o)}
        ${t._renderRipples()}

        <!-- Modern Frosted Glass HUD Gauges -->
        ${o&&S?Ei({style:V,currentTemp:k,currentVolume:F,targetBudget:L,comfortMin:O,deadlyTemp:K,boilTemp:U,showBudget:J,forceTemp:M,lang:te}):""}
        ${o&&S?t._renderCostLabel(ee):""}

        ${vi(at,r)}
        ${t._renderFpsBadge()}
        ${wi(t,ve,o&&S)}
      </g>

      ${Ri(o,i)}
    </svg>
  `}function Ni(t){let{currentVolume:e,displayedRemaining:o,targetBudget:r,currentTemp:i,tempTileColor:s,cost:a,lang:n,t:l}=t;return N`
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-value">${P(e,n)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_consumed")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${P(o,n)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_remaining")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${Oe(r,n)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_target")}</div>
      </div>
      ${i>0?N`
            <div class="metric-box">
              <div
                class="metric-value"
                style="color: ${s};"
              >
                ${P(i,n)} <span class="metric-unit">°C</span>
              </div>
              <div class="metric-label">${l("label_temperature")}</div>
            </div>
          `:""}
      ${a?N`
            <div class="metric-box">
              <div class="metric-value">${Ke(a.total,n)}</div>
              <div class="metric-label">${l("label_cost")}</div>
            </div>
          `:""}
    </div>
  `}function qt(t=()=>Math.random()){return{snails:[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],ancistrus:{x:70,y:340,targetX:70,targetY:340,heading:0,state:"idle",idleUntil:0,deathProgress:0},shrimp:{x:650,y:550,targetX:650,state:"idle",idleUntil:0,dir:-1,deathProgress:0},crab:{x:(B.ledgeFrom+B.ledgeTo)/2,y:565-(B.ledge+30),targetX:(B.ledgeFrom+B.ledgeTo)/2,s:tt,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},goby:{x:530,y:551,targetX:530,state:"idle",idleUntil:0,dir:1,deathProgress:0},bubbles:[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],boilingBubbles:Array.from({length:24},()=>({x:10+t()*1004,y:30+t()*540,vy:2.5+t()*3.5,vx:(t()-.5)*1.5,r:4+t()*8})),flowBubbles:Array.from({length:36},()=>({active:!1,x:512,baseX:512,y:0,vy:2,r:3,phase:0}))}}var Ps=4500,Is=6e3,Bs=16.66,Ui=3500;function we(t,e,o=1){t.stressUntil=e+Ui,t.stressPower=Math.max(0,Math.min(1,o))}function nt(t,e){let o=(t.stressUntil??0)-e;return t.stress=o<=0?0:Math.min(1,o/Ui)*(t.stressPower??1),t.stress}var Vt={rate:.25,maxStep:.9,ease:.15};function Di(t,e,o,r){t.walk=(t.walk??0)+Math.min(Vt.maxStep,Math.abs(e)*Vt.rate);let i=t.stride??0;t.stride=i+((o?1:0)-i)*Math.min(1,Vt.ease*r)}function Hi({timestamp:t,deltaMs:e,delta:o,nowMs:r,animTime:i,tank:s,userSpeed:a,themeKey:n}){let{tankTop:l,tankBottom:c,waterSurfaceY:d,waterRatio:h,isDead:p,isBoiling:m,speedMultiplier:y}=s;return{timestamp:t,deltaMs:e,delta:o,nowMs:r,animTime:i,userSpeed:a,themeKey:n,tankTop:l,tankBottom:c,waterSurfaceY:d,waterRatio:h,isDead:p,isBoiling:m,speedMultiplier:y,deathStep:(e||Bs)/Ps}}function qi(t,e,o){return e?Math.min(1,(t||0)+o):0}function Vi(t,e,o){let r=t+(e-t)*Math.min(1,.03*o);return r<.005&&e===0?0:r}function Gi(t,e){return t.filter(o=>e-o.born<We)}function Zi(t,e){let{isDead:o,waterRatio:r,delta:i,animTime:s,waterSurfaceY:a,tankBottom:n,nowMs:l}=e;return o||r<=0?{food:[],changed:!1}:t.length===0?{food:t,changed:!1}:(t.forEach(c=>{c.landedAt||(c.y+=c.vy*i,c.x+=Math.sin(s*1.5+c.phase)*.25*i,c.y<a&&(c.y=a),c.y>=n-30&&(c.y=n-30,c.landedAt=l))}),{food:t.filter(c=>!c.eaten&&!(c.landedAt&&l-c.landedAt>Is)),changed:!0})}function Qi(t,e,o,r,i=Math.random){let{waterRatio:s,isDead:a,tankBottom:n,waterSurfaceY:l,delta:c,animTime:d}=e,h=s>0&&!a?Fo(o,r):0,p=!1;return t.forEach((m,y)=>{if(!m.active){y<h&&(m.active=!0,m.baseX=512+(i()-.5)*90,m.x=m.baseX,m.y=n-10-i()*40,m.vy=1.8+i()*2.2+o*1.2,m.r=2+i()*4,m.phase=i()*Math.PI*2);return}m.y-=m.vy*c,m.x=m.baseX+Math.sin(d*2+m.phase)*6,(m.y<l+2||a)&&(m.active=!1),p=!0}),p}function zi(t,e){let{waterRatio:o,isDead:r,delta:i,waterSurfaceY:s,tankBottom:a}=e;return!(o>0&&!r)||t.length===0?!1:(t.forEach(n=>{n.y-=n.vy*i,n.y<s&&(n.y=a-15)}),!0)}function Yi(t,e,o=Math.random){let{isBoiling:r,waterRatio:i,delta:s,waterSurfaceY:a,tankBottom:n}=e;return!(r&&i>0)||t.length===0?!1:(t.forEach(l=>{l.y-=l.vy*s,l.x+=l.vx*s,l.y<a&&(l.y=n-15,l.x=10+o()*1004)}),!0)}function ji(t,e){let{tankBottom:o,tankTop:r,waterSurfaceY:i,themeKey:s}=e,a=s==="saltwater"&&t.species===0;return{minX:a?160:110,maxX:a?380:910,minY:a?Math.max(r+45,i+35,o-160):Math.max(r+45,i+35),maxY:o-45}}var Ne={rx:25,ry:16,factor:.85,push:1.4};function Wi(t,e){if(e.isDead)return!1;let o=!1;for(let r=0;r<t.length;r++)for(let i=r+1;i<t.length;i++){let s=t[r],a=t[i],n=(s.scale||1.4)+(a.scale||1.4),l=s.x-a.x,c=s.y-a.y,d=Math.hypot(l/(Ne.rx*Ne.factor*n),c/(Ne.ry*Ne.factor*n));if(d>=1)continue;let h=Math.hypot(l,c),[p,m]=h<1e-6?[1,0]:[l/h,c/h],y=(1-d)*Ne.push*e.delta;s.x+=p*y,s.y+=m*y,a.x-=p*y,a.y-=m*y,o=!0}if(o)for(let r of t){let{minX:i,maxX:s,minY:a,maxY:n}=ji(r,e);r.x=Math.min(s,Math.max(i,r.x)),r.y=Math.min(n,Math.max(a,r.y))}return o}function Xi(t,e,o){let{isDead:r,deathStep:i,tankBottom:s,delta:a,speedMultiplier:n}=e;if(r){t.deathProgress=Math.min(1,(t.deathProgress||0)+i),t.y=Math.min(s-30,t.y+1.2*a);return}t.deathProgress=0,nt(t,e.nowMs);let l=(t.scare??0)>.05?null:Po(t.x,t.y,o);l?(t._baseVy===void 0&&(t._baseVy=t.vy),Math.abs(l.x-t.x)>6&&(t.dir=l.x<t.x?-1:1),t.vy=Math.max(-1.1,Math.min(1.1,(l.y-t.y)*.02)),t._seeking=!0):t._seeking&&(t._baseVy!==void 0&&(t.vy=t._baseVy),t._seeking=!1);let c=l?1.8:1,{minX:d,maxX:h,minY:p,maxY:m}=ji(t,e);t.x+=t.vx*t.dir*n*c*a,t.y+=t.vy*n*a;let y=t.kickX??0,x=t.kickY??0;if(y||x){t.x+=y*a,t.y+=x*a;let v=Math.pow(.93,a);t.kickX=y*v,t.kickY=x*v;let w=Math.hypot(t.kickX,t.kickY);t.scare=Math.min(1,w/8),w<.15&&(t.kickX=0,t.kickY=0,t.scare=0)}if(o.length>0){let v=t.x+t.dir*22*(t.scale||1.4);o.forEach(w=>{!w.eaten&&Math.hypot(w.x-v,w.y-t.y)<28&&(w.eaten=!0)})}t.x<d?(t.x=d,t.dir=1):t.x>h&&(t.x=h,t.dir=-1),t.y<p?(t.y=p,t.vy=Math.abs(t.vy)):t.y>m&&(t.y=m,t.vy=-Math.abs(t.vy))}var Ns=.2;function Ki(t,e){let{isDead:o,tankBottom:r,tankTop:i,waterSurfaceY:s,delta:a}=e;if(o){t.y=Math.min(r-10,t.y+1.5*a);return}if(t.type==="bottom")t.y=r-10,t.x+=t.vx*t.dir*a,t.x<100?(t.x=100,t.dir=1):t.x>920&&(t.x=920,t.dir=-1);else if(t.type==="glass_left"||t.type==="glass_right"){let n=Math.max(i+35,s+25);if(t.y<n){t.vy=Math.abs(t.vy),t.y=Math.min(n,t.y+Math.max(t.vy,Ns)*a);return}t.y+=t.vy*a,t.y<n?(t.y=n,t.vy=Math.abs(t.vy)):t.y>r-25&&(t.y=r-25,t.vy=-Math.abs(t.vy))}}var j={durationMs:1800,radius:520,ancistrusFactor:7,crawlerFactor:6,ancistrusTurn:6},Ue={speed:.8,turn:3,minTrip:140,maxTrip:420},Us=(t,e)=>((e-t)%360+540)%360-180,Ds=1.5,Hs=[[0,-21],[13,-19],[-13,-19],[15,0],[-15,0],[34,32],[-34,32],[19,55],[-19,55],[9,72],[-9,72]],qs=[[9,89],[-9,89],[0,84]],st={surfaceMargin:6,tailOut:16,floorMargin:4,rescue:12};function Ji(t,e){let o=t*Math.PI/180,[r,i]=[Math.sin(o),Math.cos(o)],s=([d,h])=>Ds*(d*r+h*i),a=Hs.map(s),n=qs.map(s),l=Math.max(e.waterSurfaceY+st.surfaceMargin-Math.min(...a),e.waterSurfaceY-st.tailOut-Math.min(...n)),c=e.tankBottom-st.floorMargin-Math.max(...a,...n);return{minY:l,maxY:c}}function er(t,e,o,r,i){let[s,a]=[90,934],n=i?Math.hypot(t.x-i.x,t.y-i.y):0,l=null;for(let c of[0,40,-40,80,-80,120,-120,160,180]){let d=o+c*Math.PI/180,h=Math.min(a,Math.max(s,t.x+Math.sin(d)*r)),p=t.y-Math.cos(d)*r,m=!0;for(let v=0;v<4&&m;v++){let w=Math.atan2(h-t.x,-(p-t.y))*180/Math.PI,S=Ji(w,e);S.minY>S.maxY?m=!1:p=Math.min(S.maxY,Math.max(S.minY,p))}if(!m)continue;let y=Math.hypot(h-t.x,p-t.y);if(y<60)continue;let x=i?Math.hypot(h-i.x,p-i.y)-n+y*.5-Math.abs(c)*.5:-Math.abs(y-r)-Math.abs(c)*.3;(!l||x>l.score)&&(l={x:h,y:p,score:x})}return l}function tr(t,e,o,r,i,s=Math.random){let a=t.x-e,n=t.y-o,l=Math.hypot(a,n);if(l>j.radius)return!1;let c=l<1?s()*2*Math.PI:Math.atan2(a,-n),d=300+200*(1-l/j.radius),h=er(t,i,c,d,{x:e,y:o});return h?(t.targetX=h.x,t.targetY=h.y):(t.targetX=t.x,t.targetY=t.y),t.state="moving",t.fleeUntil=r+j.durationMs,!0}function or(t,e,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,waterSurfaceY:a,delta:n,timestamp:l,userSpeed:c,nowMs:d}=e,h=(t.fleeUntil??0)>d;if(r){t.deathProgress=Math.min(1,(t.deathProgress||0)+i),t.y=Math.min(s-35,t.y+1.2*n);return}t.deathProgress=0,nt(t,d),t.heading=t.heading??0;let p={tankBottom:s,waterSurfaceY:a};if(t.idleUntil||(t.idleUntil=l+1e3+o()*2e3),t.state==="moving"){let x=t.targetX-t.x,v=t.targetY-t.y,w=Math.hypot(x,v),S=Math.atan2(x,-v)*180/Math.PI,M=(h?j.ancistrusTurn:Ue.turn)*n;t.heading+=Math.max(-M,Math.min(M,Us(t.heading,S)));let k=Math.min(w,Ue.speed*c*(h?j.ancistrusFactor:1)*n);t.x+=x/(w||1)*k,t.y+=v/(w||1)*k,Math.hypot(t.targetX-t.x,t.targetY-t.y)<1.5&&(t.state="idle",t.idleUntil=l+(h?2500:1200)+o()*2e3)}else if(l>=t.idleUntil){let x=o()*2*Math.PI,v=Ue.minTrip+o()*(Ue.maxTrip-Ue.minTrip),w=er(t,p,x,v);w?(t.state="moving",t.targetX=w.x,t.targetY=w.y):t.idleUntil=l+1500}let m=Ji(t.heading,p),y=m.minY>m.maxY?(m.minY+m.maxY)/2:Math.min(m.maxY,Math.max(m.minY,t.y));y!==t.y&&(t.y+=Math.sign(y-t.y)*Math.min(Math.abs(y-t.y),st.rescue*n))}function Zt(t,e,o,r,i){if(Math.hypot(t.x-e,t.y-o)>j.radius)return!1;let s=i.fleeMinX??i.minX,a=i.fleeMaxX??i.maxX,n=t.x===e?t.dir||1:Math.sign(t.x-e),l=n>0?a:s;return Math.abs(l-t.x)<8&&(l=n>0?s:a),t.targetX=l,t.state="moving",t.fleeUntil=r+j.durationMs,!0}var Qt={minX:560,maxX:740,fleeMinX:470,fleeMaxX:770,floorOffset:25,speed:.9,firstIdle:[1200,2e3],nextIdle:[1500,2500]},zt={minX:530,maxX:530,fleeMinX:450,fleeMaxX:610,floorOffset:14,speed:.5,firstIdle:[2e3,3e3],nextIdle:[2500,3500]};function Yt(t,e,o,r=Math.random){let{isDead:i,deathStep:s,tankBottom:a,delta:n,timestamp:l,userSpeed:c,nowMs:d}=e,h=(t.fleeUntil??0)>d;if(i){t.deathProgress=Math.min(1,(t.deathProgress||0)+s);return}t.deathProgress=0,nt(t,d),t.y=a-o.floorOffset;let p=0;if(t.idleUntil||(t.idleUntil=l+o.firstIdle[0]+r()*o.firstIdle[1]),t.state==="moving"){let m=t.targetX-t.x;t.dir=m<0?-1:1;let y=Math.sign(m)*Math.min(Math.abs(m),o.speed*c*(h?j.crawlerFactor:1)*n);t.x+=y,p=y,Math.abs(t.targetX-t.x)<1.5&&(t.state="idle",t.idleUntil=l+o.nextIdle[0]+r()*o.nextIdle[1])}else l>=t.idleUntil&&(t.state="moving",t.targetX=o.minX+r()*(o.maxX-o.minX));Di(t,p,t.state==="moving",n)}var q={speed:.9,hideStep:.03,idle:[1500,2500],hidden:[4e3,4e3],fleeHidden:[6e3,3e3],firstIdle:[1500,2e3],caveChance:.4};function De(t){return typeof t.s=="number"||(t.s=tt),t.s}function Gt(t,e){let{x:o,h:r}=Je(De(t)),i=o-t.x;return t.x=o,t.y=e-(r+30),i}function Vs(t,e){let o=et.filter(i=>Math.abs(i-t)>40);if(o.length>0&&e()<q.caveChance)return o[Math.min(o.length-1,Math.floor(e()*o.length))];let r=e()*ye;return Math.abs(r-t)>=40?r:t<ye/2?ye:0}function ir(t,e,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,delta:a,userSpeed:n,nowMs:l}=e,c=(t.fleeUntil??0)>l;if(t.hide=t.hide??0,r){t.deathProgress=Math.min(1,(t.deathProgress||0)+i),t.hide=Math.max(0,t.hide-q.hideStep*a),Gt(t,s);return}t.deathProgress=0,nt(t,l),Gt(t,s);let d=0;switch(t.idleUntil||(t.idleUntil=l+q.firstIdle[0]+o()*q.firstIdle[1]),t.state){case"moving":{let h=De(t),p=t.goalS??h,m=Math.sign(p-h)*Math.min(Math.abs(p-h),q.speed*n*(c?j.crawlerFactor:1)*a);t.s=h+m;let y=Gt(t,s);d=m,Math.abs(y)>.01&&(t.dir=y<0?-1:1),Math.abs(p-t.s)<.5&&(t.s=p,et.some(v=>Math.abs(v-p)<1)?t.state="hiding":(t.state="idle",t.idleUntil=l+q.idle[0]+o()*q.idle[1]));break}case"hiding":if(t.hide=Math.min(1,t.hide+q.hideStep*(c?2:1)*a),t.hide>=1){t.state="hidden";let[h,p]=c?q.fleeHidden:q.hidden;t.idleUntil=l+h+o()*p}break;case"hidden":l>=t.idleUntil&&(t.state="emerging");break;case"emerging":t.hide=Math.max(0,t.hide-q.hideStep*a),t.hide<=0&&(t.state="idle",t.idleUntil=l+600+o()*800);break;default:l>=t.idleUntil&&(t.state="moving",t.goalS=Vs(De(t),o))}t.targetX=Je(t.goalS??De(t)).x,Di(t,d,t.state==="moving",a)}function rr(t,e,o,r){if(Math.hypot(t.x-e,t.y-o)>j.radius)return!1;let i=De(t);if(t.fleeUntil=r+4e3,t.state==="hidden"||t.state==="hiding")return t.idleUntil=Math.max(t.idleUntil??0,r+q.fleeHidden[0]),!0;if(t.state==="emerging")return t.state="hiding",!0;let s=[...et].map(a=>{let n=Je(a).x,l=Math.sign(n-t.x)===Math.sign(e-t.x)&&Math.abs(e-t.x)<Math.abs(n-t.x);return{stop:a,cost:Math.abs(a-i)+(l?400:0)}}).sort((a,n)=>a.cost-n.cost);return t.goalS=s[0].stop,t.state=Math.abs(t.goalS-i)<.5?"hiding":"moving",!0}var ue=()=>Math.random(),jt=class extends Z{static get properties(){return{_hass:{type:Object,hasChanged:()=>!1},preview:{type:Boolean},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_goby:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array},_flowBubbles:{type:Array},_food:{type:Array},_ripples:{type:Array},_fpsInfo:{type:String},_announcement:{type:String},_biotopeNotice:{type:String}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(e,o,r){let i=Qo(e,o,r),s=i.entity||o.find(l=>l.includes("shower")||l.includes("hydrao"))||o.find(l=>l.startsWith("sensor."))||o[0]||"",a=i.temperature_entity||o.find(l=>l.includes("temperature")&&(l.includes("shower")||l.includes("hydrao")))||"",n=$;return{entity:s,temperature_entity:a,...i.comfort_temp_entity?{comfort_temp_entity:i.comfort_temp_entity}:{},title:n.title,theme:n.theme,aspect_ratio_width:n.aspect_ratio_width,aspect_ratio_height:n.aspect_ratio_height,fish_count:n.fish_count,target_budget:n.target_budget,survival_volume:n.survival_volume,temp_boiling_threshold:n.temp_boiling_threshold,temp_deadly_threshold:n.temp_deadly_threshold,algae_enabled:n.algae_enabled,algae_delay_hours:n.algae_delay_hours,algae_age:n.algae_age,fish_speed_multiplier:n.fish_speed_multiplier,fullscreen:n.fullscreen}}constructor(){super(),this._animationFrameId=null,this.preview=!1,this._deathProgress=0,this._flow=Xe(),this._flowIntensity=0,this._food=[],this._ripples=[],this._fpsInfo="",this._announcement="",this._announceFlip=!1,this._themeOverride=null,this._swipeStart=null,this._swipedAt=0,this._biotopeNotice="",this._noticeTimer=null,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=0,this._config=void 0,this._hass=void 0,this._viewport=null,this._resizeObserver=null,this._energyKwh=0,this._metrics=null,this._sensorLostSince=null,this._sensorTimer=null,this._metricsSignature="",this._onScreen=!0,this._pageVisible=typeof document>"u"||document.visibilityState!=="hidden",this._prefersReducedMotion=!1,this._intersectionObserver=null,this._motionQuery=null,this._onVisibilityChange=()=>{this._pageVisible=document.visibilityState!=="hidden",this._syncAnimation()},this._onMotionPreferenceChange=o=>{this._prefersReducedMotion=!!o.matches,this._syncAnimation()},this._lastTimestamp=0,this._lastFrameTs=0,this._animTime=0,this._ambientTime=0,this._lastAmbientTs=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=$.target_budget,this._cachedSurvivalVolume=$.survival_volume,this._cachedComfortMin=$.comfort_temp_min,this._lastTemperature=0,this._cachedHoursSinceLastShower=0,this._fishes=Ye(4,"freshwater");let e=qt();this._snails=e.snails,this._ancistrus=e.ancistrus,this._shrimp=e.shrimp,this._crab=e.crab,this._goby=e.goby,this._bubbles=e.bubbles,this._boilingBubbles=e.boilingBubbles,this._flowBubbles=e.flowBubbles}static get styles(){return _o}_t(e){return X(Q(this._hass),e)}get _themeKey(){return this._themeOverride||this._config?.theme||"freshwater"}_biotopeStorageKey(){return`shower-aquarium-card:biotope:${this._config?.entity}`}_restoreBiotope(){if(!this._config?.swipe_biotope)return null;try{let e=JSON.parse(window.localStorage.getItem(this._biotopeStorageKey())||"null");if(e&&e.base===this._config.theme&&e.chosen!==e.base&&_e.includes(e.chosen))return e.chosen}catch{}return null}_rememberBiotope(e){if(!this._isEditorPreview())try{window.localStorage.setItem(this._biotopeStorageKey(),JSON.stringify({base:this._config?.theme,chosen:e}))}catch{}}_onSwipeStart(e){this._swipeStart=this._config?.swipe_biotope?{x:e.clientX,y:e.clientY,t:Date.now()}:null}_onSwipeEnd(e){let o=this._swipeStart;if(this._swipeStart=null,!o)return;let r=vo(e.clientX-o.x,e.clientY-o.y,Date.now()-o.t);r!==0&&(this._swipedAt=Date.now(),this._switchBiotope(r))}_onSwipeCancel(){this._swipeStart=null}_switchBiotope(e){if(!this._config)return;let o=wo(this._themeKey,e);this._themeOverride=o===this._config.theme?null:o,this._rememberBiotope(o),this._fishes=Ye(this._config.fish_count,o);let r=qt();this._snails=r.snails,this._ancistrus=r.ancistrus,this._shrimp=r.shrimp,this._crab=r.crab,this._goby=r.goby,this._food=[],this._ripples=[];let i=this._t(`theme_${o}`);this._biotopeNotice=i,this._announce("aria_biotope",{name:i}),this._noticeTimer!==null&&clearTimeout(this._noticeTimer),this._noticeTimer=setTimeout(()=>{this._noticeTimer=null,this._biotopeNotice=""},2e3),this._onDataChanged()}_onBiotopeButton(){this._switchBiotope(1)}_getCanvasHeight(){return ko(this._config,this._viewport)}_updateCachedMetrics(){if(!this._hass||!this._config)return!1;let e=So(this._hass,this._config,this._metrics);this._metrics=e,this._cachedConsumedVolume=e.consumedVolume,this._cachedHoursSinceLastShower=e.hoursSinceLastShower,this._cachedTemperature=e.temperature,this._cachedTargetBudget=e.targetBudget,this._cachedSurvivalVolume=e.survivalVolume,this._cachedComfortMin=e.comfortMin,e.consumedVolume<=0?this._lastTemperature=0:e.temperature>0&&(this._lastTemperature=e.temperature),this._trackSensor(e.sensorMissing);let o=Ho(e,Q(this._hass)),r=o!==this._metricsSignature;return this._metricsSignature=o,r}_trackSensor(e){if(!e){this._sensorLostSince=null,this._clearSensorTimer();return}this._sensorLostSince===null&&(this._sensorLostSince=Date.now()),this._scheduleSensorTimer()}_scheduleSensorTimer(){if(this._sensorTimer!==null||this._sensorLostSince===null||!this.isConnected)return;let e=Math.max(0,St-(Date.now()-this._sensorLostSince));this._sensorTimer=setTimeout(()=>{this._sensorTimer=null,this.requestUpdate()},e)}_clearSensorTimer(){this._sensorTimer!==null&&(clearTimeout(this._sensorTimer),this._sensorTimer=null)}get _sensorLost(){return this._sensorLostSince!==null&&Date.now()-this._sensorLostSince>=St}setConfig(e){if(!e||typeof e.entity!="string"||!e.entity.trim())throw new Error("Please define a valid entity.");let{config:o,warnings:r}=Tt(ze(e));r.forEach(i=>console.warn(`[shower-aquarium-card] ${i}`)),this._config={...$,...o},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen"),this._themeOverride=this._restoreBiotope(),this._fishes=Ye(this._config.fish_count,this._themeKey),this._flow=Xe(),this._food=[],this._metrics=null,this._lastTemperature=0,this._sensorLostSince=null,this._clearSensorTimer(),this._updateCachedMetrics(),this._syncAnimation(),this.requestUpdate()}set hass(e){this._hass=e;let o=this._updateCachedMetrics();this._trackFlow(),o&&this._onDataChanged()}get _visible(){return this._onScreen&&this._pageVisible}get _motionAllowed(){return qo(this._prefersReducedMotion,this._config?.respect_reduced_motion)}shouldUpdate(){return this._visible}_onResize(e,o){if(!this._config?.fullscreen)return;let r=this._getCanvasHeight();this._viewport={width:e,height:o},this._getCanvasHeight()!==r&&this._onDataChanged()}_onDataChanged(){this._visible&&!this._motionAllowed&&this._settleScene(),this.requestUpdate()}_settleScene(){let e=this._tankState();if(!e)return;let{isDead:o}=e;this._food=[],this._ripples=[],this._lastTimestamp=0;let r=Go(o);for(let i=0;i<r;i++)this._updatePhysics(1e3+i*Vo);this._lastTimestamp=0}_syncAnimation(){if(!this.isConnected){this._stopAnimation();return}if(this._visible&&this._motionAllowed){this._startAnimation(),this.requestUpdate();return}this._stopAnimation(),this._visible&&(this._settleScene(),this.requestUpdate())}_trackFlow(){if(!this._hass||!this._config)return;let e=this._hass.states?.[this._config.entity]?.state;if(e===void 0||isNaN(parseFloat(e)))return;let o=this._cachedConsumedVolume,r=this._flow.lastVolume,i=this._config.cold_water_temp;r===null||o<r-1e-6?this._energyKwh=Ct(o,this._cachedTemperature,i):o>r+1e-6&&(this._energyKwh+=Ct(o-r,this._cachedTemperature,i)),this._flow=To(this._flow,o,Date.now())}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this._pageVisible=document.visibilityState!=="hidden",typeof IntersectionObserver=="function"&&(this._intersectionObserver=new IntersectionObserver(e=>{let o=e[e.length-1];!o||o.isIntersecting===this._onScreen||(this._onScreen=o.isIntersecting,this._syncAnimation())}),this._intersectionObserver.observe(this)),typeof ResizeObserver=="function"&&(this._resizeObserver=new ResizeObserver(e=>{let o=e[e.length-1];o&&this._onResize(o.contentRect.width,o.contentRect.height)}),this._resizeObserver.observe(this)),typeof window.matchMedia=="function"&&(this._motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this._prefersReducedMotion=!!this._motionQuery.matches,this._motionQuery.addEventListener?.("change",this._onMotionPreferenceChange)),this._scheduleSensorTimer(),this._syncAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._clearSensorTimer(),this._noticeTimer!==null&&(clearTimeout(this._noticeTimer),this._noticeTimer=null),document.removeEventListener("visibilitychange",this._onVisibilityChange),this._intersectionObserver?.disconnect(),this._intersectionObserver=null,this._resizeObserver?.disconnect(),this._resizeObserver=null,this._motionQuery?.removeEventListener?.("change",this._onMotionPreferenceChange),this._motionQuery=null,this._stopAnimation()}_sampleFps(e){this._fpsWindowStart||(this._fpsWindowStart=e);let o=e-this._fpsWindowStart;if(o<1e3)return;let r=Math.round(this._rafCount*1e3/o),i=Math.round(this._tickCount*1e3/o),s=this._config?.animation_quality||"max";this._fpsInfo=`v${Ze} \xB7 ${s} \xB7 display ${r}/s \xB7 drawn ${i}/s`,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=e,this.requestUpdate()}get _profile(){return No(this._config?.animation_quality)}_startAnimation(){if(!this._animationFrameId){this._lastTimestamp=0,this._lastFrameTs=0,this._fpsWindowStart=0,this._rafCount=0,this._tickCount=0;let e=o=>{this._rafCount++,Uo(o,this._lastFrameTs,this._profile.fps)&&(this._lastFrameTs=o,this._tickCount++,this._updatePhysics(o)),this._config?.show_fps&&this._sampleFps(o),this._animationFrameId=requestAnimationFrame(e)};this._animationFrameId=requestAnimationFrame(e)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(e){let o=this._config;if(!o)return;this._lastTimestamp||(this._lastTimestamp=e);let r=e-this._lastTimestamp,i=this._profile,s=Math.min(r/16.66,Do(i.fps));this._lastTimestamp=e,this._animTime=e*.0035,(!i.ambientHz||e-this._lastAmbientTs>=1e3/i.ambientHz)&&(this._ambientTime=this._animTime,this._lastAmbientTs=e);let a={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},n=Date.now(),l=Hi({timestamp:e,deltaMs:r,delta:s,nowMs:n,animTime:this._animTime,tank:je({config:o,metrics:a,canvasHeight:this._getCanvasHeight()}),userSpeed:o.fish_speed_multiplier,themeKey:this._themeKey}),{isDead:c}=l,d=!1;this._deathProgress=qi(this._deathProgress,c,l.deathStep);let h=this._motionAllowed,p=c||!h?0:Eo(this._flow,n);this._flowIntensity=Vi(this._flowIntensity,p,s),Lo(this._flow,n)&&(this._flow={...this._flow,showerActive:!1}),this._ripples.length>0&&(this._ripples=Gi(this._ripples,n),d=!0);let m=Zi(this._food,l);m.food!==this._food&&(this._food=m.food),m.changed&&(d=!0),Qi(this._flowBubbles,l,this._flowIntensity,i.flowBubbles,ue)&&(d=!0),this._flowIntensity>0&&(d=!0),this._fishes&&this._fishes.length>0&&(this._fishes.forEach(y=>Xi(y,l,this._food)),Wi(this._fishes,l),d=!0),this._snails&&this._snails.length>0&&(this._snails.forEach(y=>Ki(y,l)),d=!0),this._ancistrus&&(or(this._ancistrus,l,ue),d=!0),this._shrimp&&(Yt(this._shrimp,l,Qt,ue),d=!0),this._crab&&(ir(this._crab,l,ue),d=!0),this._goby&&(Yt(this._goby,l,zt,ue),d=!0),this._bubbles&&zi(this._bubbles,l)&&(d=!0),this._boilingBubbles&&Yi(this._boilingBubbles,l,ue)&&(d=!0),d&&this.requestUpdate()}_renderWaterSurface(e,o,r){return Wo(this,e,o,r)}_renderThemeDecoration(e,o,r=0){return ti(this,e,o,r)}_renderFishShape(e,o,r){return ai(this,e,o,r)}_renderAncistrus(e){return hi(this,e)}_renderShrimp(e){return ui(this,e)}_renderGoby(e){return Mi(this,e)}_renderCrab(e){return pi(this,e)}_renderAlgae(e,o){return oi(this,e,o)}_eventToSvgPoint(e){let o=e.currentTarget,r=o.getScreenCTM?o.getScreenCTM():null;if(!r)return null;let i=o.createSVGPoint();i.x=e.clientX,i.y=e.clientY;let s=i.matrixTransform(r.inverse());return{x:s.x,y:s.y}}_isEditorPreview(){if(this.preview)return!0;let e=this;for(;e;){let o=e,r=o.tagName?o.tagName.toLowerCase():"";if(r==="hui-card-preview"||r==="hui-dialog-edit-card"||r==="hui-dialog-suggest-card")return!0;e=o.parentNode||e.host||null}return!1}_tankState(){return this._config?je({config:this._config,metrics:{consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},canvasHeight:this._getCanvasHeight()}):null}_interactiveTank(){if(!this._hass||!this._motionAllowed)return null;let e=this._tankState();return e?e.isDead||e.waterRatio<=0?null:e:null}_dropFood(e,o){let r=Math.max(80,Math.min(944,e));this._food=[...this._food,...Io(r,o+2)].slice(-30)}_knockAt(e,o,r){let i=Date.now();this._ripples=[...this._ripples,{x:e,y:o,born:i}],(this._fishes||[]).forEach(s=>{let a=Oo(s.x,s.y,e,o);a&&(s.kickX=a.kx,s.kickY=a.ky,s.scare=a.scare,Math.abs(a.kx)>.5&&(s.dir=a.kx<0?-1:1),we(s,i,.5+.5*a.scare))}),this._ancistrus&&tr(this._ancistrus,e,o,i,r,ue)&&we(this._ancistrus,i),this._shrimp&&Zt(this._shrimp,e,o,i,Qt)&&we(this._shrimp,i),this._crab&&rr(this._crab,e,o,i)&&we(this._crab,i),this._goby&&Zt(this._goby,e,o,i,zt)&&we(this._goby,i)}_onTankTap(e){if(Date.now()-this._swipedAt<500)return;let o=this._interactiveTank();if(!o)return;let r=this._eventToSvgPoint(e);r&&(Ro(r.y,o.waterSurfaceY)==="feed"?this._dropFood(r.x,o.waterSurfaceY):this._knockAt(r.x,r.y,o),this.requestUpdate())}_onFeedButton(){let e=this._interactiveTank();e&&(this._dropFood(Re/2,e.waterSurfaceY),this._announce("aria_food_dropped"),this.requestUpdate())}_onKnockButton(){let e=this._interactiveTank();e&&(this._knockAt(Re/2,(e.waterSurfaceY+e.tankBottom)/2,e),this._announce("aria_knocked"),this.requestUpdate())}_announce(e,o={}){this._announceFlip=!this._announceFlip,this._announcement=Et(this._t(e),o)+(this._announceFlip?"\xA0":"")}_renderFlowBubbles(){return mi(this)}_renderFood(){return _i(this)}_renderRipples(){return gi(this)}_renderCostLabel(e){return bi(this,e)}_ariaLabel({currentVolume:e,currentTemp:o,targetBudget:r,isDead:i,isCritical:s,sensorLost:a=!1}){let n=Q(this._hass),l={consumed:P(e,n),target:P(r,n,0),temperature:P(o,n)},c=[Et(this._t(o>0?"aria_summary_temperature":"aria_summary"),l)];return i?c.push(this._t("aria_dead")):s&&c.push(this._t("aria_over_budget")),a&&c.push(`${this._t("label_sensor_unavailable")}.`),c.join(" ")}_renderFpsBadge(){return xi(this)}render(){if(!this._config||!this._hass)return N``;let e=!!this._config.fullscreen,o=this._getCanvasHeight(),r=o-35,i={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:s,currentTemp:a,targetBudget:n,boilTemp:l,deadlyTemp:c,waterRatio:d,tankBottom:h,waterSurfaceY:p,isDead:m,isBoiling:y,isCritical:x,isWarning:v}=je({config:this._config,metrics:i,canvasHeight:o}),w=this._motionAllowed&&!m&&d>0,S=Q(this._hass),M=this._sensorLost,k=this._ariaLabel({currentVolume:s,currentTemp:a,targetBudget:n,isDead:m,isCritical:x,sensorLost:M}),F=Math.max(0,n-s),L=this._themeKey,O=kt(L),K=y||x?"#ef4444":v?"#38bdf8":O.waterTop,U=y||x?"#991b1b":v?"#0284c7":O.waterBottom,V=!!(this._config.title&&this._config.title.trim().length>0),J=this._config.aspect_ratio_width,ee=this._config.aspect_ratio_height,te=Number(this._config.algae_age)||0,ve=te>0?te:this._cachedHoursSinceLastShower,at=a>=c?"#ef4444":a>=l?"#f59e0b":"var(--primary-text-color, #111827)",D=this._config.show_cost?Bo({volumeL:s,energyKwh:this._energyKwh,waterPricePerM3:this._config.water_price_per_m3,energyPricePerKwh:this._config.energy_price_per_kwh}):null;return N`
      <ha-card>
        ${!e&&V?N`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          ${Bi(this,{isFullscreen:e,canvasH:o,canvasBottom:r,ariaLabel:k,aspectWidth:J,aspectHeight:ee,themeKey:L,theme:O,waterColorStart:K,waterColorEnd:U,isBoiling:y,isDead:m,waterRatio:d,waterSurfaceY:p,tankBottom:h,effectiveAlgaeHours:ve,showReadings:s>0||this._isEditorPreview(),forceTemp:s<=0&&this._isEditorPreview(),displayedTemp:a>0?a:this._lastTemperature,currentVolume:s,targetBudget:n,comfortMin:this._cachedComfortMin,deadlyTemp:c,boilTemp:l,gaugeStyle:this._config.gauge_style,showBudget:this._config.show_budget,cost:D,lang:S,sensorLost:M,biotopeNotice:this._biotopeNotice})}

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

        ${e?"":Ni({currentVolume:s,displayedRemaining:F,targetBudget:n,currentTemp:a,tempTileColor:at,cost:D,lang:S,t:ar=>this._t(ar)})}
      </ha-card>
    `}getCardSize(){return 6}getGridOptions(){let e={columns:12,min_columns:6};return this._config?.fullscreen&&(e.rows=8,e.min_rows=4),e}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",jt);console.info(`%c SHOWER-AQUARIUM-CARD %c v${Ze} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");var He=window;He.customCards=He.customCards||[];var sr=He.customCards.findIndex(t=>t.type==="shower-aquarium-card"),nr={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${Ze})`,documentationURL:`${mo}#readme`};sr!==-1?He.customCards[sr]=nr:He.customCards.push(nr);export{jt as AquariumShowerCard};
