var Qe=globalThis,ze=Qe.ShadowRoot&&(Qe.ShadyCSS===void 0||Qe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ft=Symbol(),eo=new WeakMap,Se=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==ft)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o,o=this.t;if(ze&&t===void 0){let r=o!==void 0&&o.length===1;r&&(t=eo.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&eo.set(o,t))}return t}toString(){return this.cssText}},to=e=>new Se(typeof e=="string"?e:e+"",void 0,ft),ut=(e,...t)=>{let o=e.length===1?e[0]:t.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Se(o,e,ft)},oo=(e,t)=>{if(ze)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of t){let r=document.createElement("style"),i=Qe.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},pt=ze?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(let r of t.cssRules)o+=r.cssText;return to(o)})(e):e;var{is:_r,defineProperty:gr,getOwnPropertyDescriptor:$r,getOwnPropertyNames:yr,getOwnPropertySymbols:br,getPrototypeOf:xr}=Object,oe=globalThis,io=oe.trustedTypes,wr=io?io.emptyScript:"",vr=oe.reactiveElementPolyfillSupport,Ce=(e,t)=>e,mt={toAttribute(e,t){switch(t){case Boolean:e=e?wr:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},so=(e,t)=>!_r(e,t),ro={attribute:!0,type:String,converter:mt,reflect:!1,useDefault:!1,hasChanged:so};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),oe.litPropertyMetadata??(oe.litPropertyMetadata=new WeakMap);var W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=ro){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&gr(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){let{get:i,set:s}=$r(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:i,set(a){let n=i?.call(this);s?.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ro}static _$Ei(){if(this.hasOwnProperty(Ce("elementProperties")))return;let t=xr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ce("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ce("properties"))){let o=this.properties,r=[...yr(o),...br(o)];for(let i of r)this.createProperty(i,o[i])}let t=this[Symbol.metadata];if(t!==null){let o=litPropertyMetadata.get(t);if(o!==void 0)for(let[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[o,r]of this.elementProperties){let i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let o=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)o.unshift(pt(i))}else t!==void 0&&o.push(pt(t));return o}static _$Eu(t,o){let r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,o=this.constructor.elementProperties;for(let r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return oo(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:mt).toAttribute(o,r.type);this._$Em=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,o){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:mt;this._$Em=i;let n=a.fromAttribute(o,s.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,o,r,i=!1,s){if(t!==void 0){let a=this.constructor;if(i===!1&&(s=this[t]),r??(r=a.getPropertyOptions(t)),!((r.hasChanged??so)(s,o)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),s!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:a}=s,n=this[i];a!==!0||this._$AL.has(i)||n===void 0||this.C(i,void 0,s,n)}}let t=!1,o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(o)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(o)}willUpdate(t){}_$AE(t){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[Ce("elementProperties")]=new Map,W[Ce("finalized")]=new Map,vr?.({ReactiveElement:W}),(oe.reactiveElementVersions??(oe.reactiveElementVersions=[])).push("2.1.2");var Te=globalThis,no=e=>e,Ye=Te.trustedTypes,ao=Ye?Ye.createPolicy("lit-html",{createHTML:e=>e}):void 0,po="$lit$",ie=`lit$${Math.random().toFixed(9).slice(2)}$`,mo="?"+ie,Mr=`<${mo}>`,le=document,Ee=()=>le.createComment(""),Le=e=>e===null||typeof e!="object"&&typeof e!="function",wt=Array.isArray,kr=e=>wt(e)||typeof e?.[Symbol.iterator]=="function",_t=`[ 	
\f\r]`,Ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,lo=/-->/g,co=/>/g,ne=RegExp(`>|${_t}(?:([^\\s"'>=/]+)(${_t}*=${_t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ho=/'/g,fo=/"/g,_o=/^(?:script|style|textarea|title)$/i,vt=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),N=vt(1),u=vt(2),rn=vt(3),ce=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),uo=new WeakMap,ae=le.createTreeWalker(le,129);function go(e,t){if(!wt(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ao!==void 0?ao.createHTML(t):t}var Sr=(e,t)=>{let o=e.length-1,r=[],i,s=t===2?"<svg>":t===3?"<math>":"",a=Ae;for(let n=0;n<o;n++){let l=e[n],c,h,f=-1,p=0;for(;p<l.length&&(a.lastIndex=p,h=a.exec(l),h!==null);)p=a.lastIndex,a===Ae?h[1]==="!--"?a=lo:h[1]!==void 0?a=co:h[2]!==void 0?(_o.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=ne):h[3]!==void 0&&(a=ne):a===ne?h[0]===">"?(a=i??Ae,f=-1):h[1]===void 0?f=-2:(f=a.lastIndex-h[2].length,c=h[1],a=h[3]===void 0?ne:h[3]==='"'?fo:ho):a===fo||a===ho?a=ne:a===lo||a===co?a=Ae:(a=ne,i=void 0);let m=a===ne&&e[n+1].startsWith("/>")?" ":"";s+=a===Ae?l+Mr:f>=0?(r.push(c),l.slice(0,f)+po+l.slice(f)+ie+m):l+ie+(f===-2?n:m)}return[go(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},Fe=class e{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,a=0,n=t.length-1,l=this.parts,[c,h]=Sr(t,o);if(this.el=e.createElement(c,r),ae.currentNode=this.el.content,o===2||o===3){let f=this.el.content.firstChild;f.replaceWith(...f.childNodes)}for(;(i=ae.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(let f of i.getAttributeNames())if(f.endsWith(po)){let p=h[a++],m=i.getAttribute(f).split(ie),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:s,name:g[2],strings:m,ctor:g[1]==="."?$t:g[1]==="?"?yt:g[1]==="@"?bt:_e}),i.removeAttribute(f)}else f.startsWith(ie)&&(l.push({type:6,index:s}),i.removeAttribute(f));if(_o.test(i.tagName)){let f=i.textContent.split(ie),p=f.length-1;if(p>0){i.textContent=Ye?Ye.emptyScript:"";for(let m=0;m<p;m++)i.append(f[m],Ee()),ae.nextNode(),l.push({type:2,index:++s});i.append(f[p],Ee())}}}else if(i.nodeType===8)if(i.data===mo)l.push({type:2,index:s});else{let f=-1;for(;(f=i.data.indexOf(ie,f+1))!==-1;)l.push({type:7,index:s}),f+=ie.length-1}s++}}static createElement(t,o){let r=le.createElement("template");return r.innerHTML=t,r}};function me(e,t,o=e,r){if(t===ce)return t;let i=r!==void 0?o._$Co?.[r]:o._$Cl,s=Le(t)?void 0:t._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=me(e,i._$AS(e,t.values),i,r)),t}var gt=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:o},parts:r}=this._$AD,i=(t?.creationScope??le).importNode(o,!0);ae.currentNode=i;let s=ae.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Re(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new xt(s,this,t)),this._$AV.push(c),l=r[++n]}a!==l?.index&&(s=ae.nextNode(),a++)}return ae.currentNode=le,i}p(t){let o=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},Re=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,o=this._$AM;return o!==void 0&&t?.nodeType===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=me(this,t,o),Le(t)?t===T||t==null||t===""?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==ce&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==T&&Le(this._$AH)?this._$AA.nextSibling.data=t:this.T(le.createTextNode(t)),this._$AH=t}$(t){let{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Fe.createElement(go(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(o);else{let s=new gt(i,this),a=s.u(this.options);s.p(o),this.T(a),this._$AH=s}}_$AC(t){let o=uo.get(t.strings);return o===void 0&&uo.set(t.strings,o=new Fe(t)),o}k(t){wt(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,r,i=0;for(let s of t)i===o.length?o.push(r=new e(this.O(Ee()),this.O(Ee()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);t!==this._$AB;){let r=no(t).nextSibling;no(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},_e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=T}_$AI(t,o=this,r,i){let s=this.strings,a=!1;if(s===void 0)t=me(this,t,o,0),a=!Le(t)||t!==this._$AH&&t!==ce,a&&(this._$AH=t);else{let n=t,l,c;for(t=s[0],l=0;l<s.length-1;l++)c=me(this,n[r+l],o,l),c===ce&&(c=this._$AH[l]),a||(a=!Le(c)||c!==this._$AH[l]),c===T?t=T:t!==T&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},$t=class extends _e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===T?void 0:t}},yt=class extends _e{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==T)}},bt=class extends _e{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=me(this,t,o,0)??T)===ce)return;let r=this._$AH,i=t===T&&r!==T||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==T&&(r===T||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},xt=class{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){me(this,t)}};var Cr=Te.litHtmlPolyfillSupport;Cr?.(Fe,Re),(Te.litHtmlVersions??(Te.litHtmlVersions=[])).push("3.3.3");var $o=(e,t,o)=>{let r=o?.renderBefore??t,i=r._$litPart$;if(i===void 0){let s=o?.renderBefore??null;r._$litPart$=i=new Re(t.insertBefore(Ee(),s),s,void 0,o??{})}return i._$AI(e),i};var Oe=globalThis,Q=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;let t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$o(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ce}};Q._$litElement$=!0,Q.finalized=!0,Oe.litElementHydrateSupport?.({LitElement:Q});var Ar=Oe.litElementPolyfillSupport;Ar?.({LitElement:Q});(Oe.litElementVersions??(Oe.litElementVersions=[])).push("4.2.2");var je="0.8.84",yo="https://github.com/Adrien40/ha-shower-aquarium-card";var y=Object.freeze({title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:5,temp_boiling_threshold:40,temp_deadly_threshold:45,comfort_temp_min:33,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,show_cost:!1,water_price_per_m3:4.5,energy_price_per_kwh:.25,cold_water_temp:15,animation_quality:"max",creature_style:"flat",respect_reduced_motion:!0,show_fps:!1,gauge_style:"thermometer",show_budget:!1,swipe_biotope:!0,show_gauges:!1,show_tiles:!0});var bo=ut`
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
`;var xo={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche confort",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge actuel des algues",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)",field_animation_quality:"Qualit\xE9 d'animation",quality_max:"Maximale",quality_balanced:"\xC9quilibr\xE9e",quality_light:"L\xE9g\xE8re (Google Nest Hub)",helper_animation_quality:"L\xE9g\xE8re : 20 images/s et effets simplifi\xE9s, pour les \xE9crans peu puissants",field_respect_reduced_motion:"Suivre le mode \xAB mouvement r\xE9duit \xBB de l'appareil",field_show_fps:"Afficher les images par seconde (d\xE9bogage)",helper_show_fps:"Affichage de d\xE9bogage : indique une fois par seconde le nombre d'images dessin\xE9es.",helper_respect_reduced_motion:"Activ\xE9 : si votre tablette, t\xE9l\xE9phone ou ordinateur a le r\xE9glage \xAB r\xE9duire les animations \xBB (accessibilit\xE9), l'aquarium reste immobile. D\xE9sactiv\xE9 : l'aquarium s'anime toujours. Si vous ne voyez aucun mouvement, d\xE9sactivez cette option.",aria_summary:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L.",aria_summary_temperature:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L, eau \xE0 {temperature} \xB0C.",aria_dead:"Le bac est vide ou trop chaud : les animaux sont morts.",aria_over_budget:"Le volume cible est d\xE9pass\xE9.",section_aquarium:"Aquarium, animaux et algues",section_limits:"Limites (volume et temp\xE9rature)",section_cost:"Estimation du co\xFBt",section_display:"Affichage et performance",action_feed:"Nourrir les poissons",action_knock:"Taper sur la vitre",aria_actions:"Actions de l'aquarium",aria_food_dropped:"De la nourriture est tomb\xE9e dans le bac.",aria_knocked:"Vous avez tap\xE9 sur la vitre. Les poissons sont effray\xE9s.",field_comfort_temp_entity:"Entit\xE9 de temp\xE9rature de confort minimum (optionnel)",helper_comfort_temp_entity:"Temp\xE9rature minimale de confort, par exemple celle d'un pommeau Hydrao. Elle remplace la valeur ci-dessous.",field_comfort_temp:"Temp\xE9rature minimale de confort (\xB0C)",field_gauge_style:"Style des jauges",field_show_budget:"Afficher le budget sur la jauge de volume",option_gauge_thermometer:"Thermom\xE8tre et barre",option_gauge_arc:"Arcs ouverts",label_sensor_unavailable:"Capteur indisponible",helper_target_budget:"Utilis\xE9 seulement si l'entit\xE9 d'objectif ci-dessus est vide ou indisponible.",helper_fish_count:"Entre 1 et 10 : plus de poissons seraient \xE0 l'\xE9troit dans l'aquarium. Une valeur plus grande est ramen\xE9e \xE0 10.",helper_fish_speed:"Entre 0,2 et 3. Une valeur hors de cette plage est ramen\xE9e dedans.",field_creature_style:"Style des poissons et des autres \xEAtres vivants",option_creature_flat:"Plat et d\xE9taill\xE9",option_creature_cartoon:"Dessin anim\xE9",option_creature_realistic:"R\xE9aliste",helper_creature_style:"Le r\xE9aliste utilise des ombrages doux, que la qualit\xE9 d'animation l\xE9g\xE8re supprime",field_swipe_biotope:"Changer de biotope en glissant le doigt",helper_swipe_biotope:"Glissez horizontalement sur l'aquarium pour passer \xE0 l'eau douce, \xE0 l'eau de mer ou \xE0 l'eau froide. Le choix est gard\xE9 sur cet appareil ; changer le biotope dans cet \xE9diteur le remplace.",action_biotope:"Changer de biotope",aria_biotope:"Biotope : {name}.",helper_algae_age:"0 = automatique : l'\xE2ge suit le temps \xE9coul\xE9 depuis la derni\xE8re douche. Une valeur plus grande force l'\xE2ge des algues \xE0 cet instant, pour voir leur aspect.",field_show_gauges:"Afficher les jauges hors plein \xE9cran",helper_show_gauges:"Le thermom\xE8tre et le volume du plein \xE9cran s'affichent aussi sur l'aquarium du mode normal. Comme en plein \xE9cran, ils n'apparaissent qu'\xE0 partir du premier litre (toujours visibles dans l'aper\xE7u de l'\xE9diteur).",field_show_tiles:"Afficher les tuiles sous l'aquarium",helper_show_tiles:"Les tuiles Consomm\xE9, Restant, Objectif, Temp\xE9rature (et Co\xFBt) du mode normal. D\xE9cochez pour ne garder que l'aquarium. Sans effet en plein \xE9cran."};var wo={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Comfort shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Current algae age",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)",field_animation_quality:"Animation quality",quality_max:"Maximum",quality_balanced:"Balanced",quality_light:"Light (Google Nest Hub)",helper_animation_quality:"Light: 20 frames/s and simpler effects, for low-power screens",field_respect_reduced_motion:"Follow the device's reduced-motion setting",field_show_fps:"Show FPS (debug)",helper_show_fps:"Debug overlay: once per second, shows how many frames were drawn.",helper_respect_reduced_motion:'On: if your tablet, phone or computer has the "reduce motion" accessibility setting, the aquarium stays still. Off: the aquarium always animates. If you see no movement, turn this off.',aria_summary:"Shower aquarium: {consumed} L used out of {target} L.",aria_summary_temperature:"Shower aquarium: {consumed} L used out of {target} L, water at {temperature} \xB0C.",aria_dead:"The tank is empty or too hot: the animals have died.",aria_over_budget:"The target volume has been exceeded.",section_aquarium:"Aquarium, animals and algae",section_limits:"Limits (volume and temperature)",section_cost:"Cost estimate",section_display:"Display and performance",action_feed:"Feed the fish",action_knock:"Knock on the glass",aria_actions:"Aquarium actions",aria_food_dropped:"Fish food dropped into the tank.",aria_knocked:"You knocked on the glass. The fish are startled.",field_comfort_temp_entity:"Minimum comfort temperature entity (optional)",helper_comfort_temp_entity:"Minimum comfortable temperature, for example from a Hydrao showerhead. It replaces the value below.",field_comfort_temp:"Minimum comfort temperature (\xB0C)",field_gauge_style:"Gauge style",field_show_budget:"Show the budget on the volume gauge",option_gauge_thermometer:"Thermometer and bar",option_gauge_arc:"Open arcs",label_sensor_unavailable:"Sensor unavailable",helper_target_budget:"Only used when the target entity above is empty or unavailable.",helper_fish_count:"Between 1 and 10: more fish would be cramped in the tank. A higher value is brought back to 10.",helper_fish_speed:"Between 0.2 and 3. A value outside this range is brought back into it.",field_creature_style:"Look of the fish and the other living things",option_creature_flat:"Flat and detailed",option_creature_cartoon:"Cartoon",option_creature_realistic:"Realistic",helper_creature_style:"Realistic uses soft shading, which the light animation quality leaves out",field_swipe_biotope:"Swipe to change the biotope",helper_swipe_biotope:"Swipe sideways on the aquarium to go to freshwater, saltwater or coldwater. The choice is kept on this device; changing the biotope in this editor replaces it.",action_biotope:"Change biotope",aria_biotope:"Biotope: {name}.",helper_algae_age:"0 = automatic: the age follows the time since the last shower. A higher value sets the age of the algae at this very moment, to see how they look.",field_show_gauges:"Show the gauges outside fullscreen mode",helper_show_gauges:"The thermometer and the volume of fullscreen mode are also drawn on the aquarium of the normal mode. Like in fullscreen, they only appear from the first litre (always shown in the preview of the editor).",field_show_tiles:"Show the tiles under the aquarium",helper_show_tiles:"The Consumed, Remaining, Target, Temperature (and Cost) tiles of the normal mode. Untick to keep only the aquarium. No effect in fullscreen mode."};var Mt={fr:xo,en:wo};function z(e){return(e?.locale?.language||e?.language||"en").substring(0,2).toLowerCase()}function Lr(e){return e&&Mt[e]||Mt.en}function X(e,t){return Lr(e)[t]||Mt.en[t]||t}var At={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#dc2626","#f59e0b","#fef3c7","#cbd5e1"]}};function Et(e){return At[e]||At.freshwater}var Fr=["flat","cartoon","realistic"],Rr=["night_entity","night_lux_threshold","cost_in_fullscreen","bottom_design"];function Xe(e){let t={...e};for(let o of Rr)delete t[o];return t}var ge=["freshwater","saltwater","coldwater"];function So(e,t){let o=Math.max(0,ge.indexOf(e));return ge[(o+t+ge.length*2)%ge.length]}var kt={minDistance:60,maxDurationMs:900,horizontalRatio:1.6};function Co(e,t,o){return o>kt.maxDurationMs||Math.abs(e)<kt.minDistance||Math.abs(e)<Math.abs(t)*kt.horizontalRatio?0:e<0?1:-1}var Pe=1024,St=10,Ao=y.comfort_temp_min,Or=y.survival_volume,Lt=6e4,Pr=400,Br=2048,Ir=300,Nr=600,vo=(e,t=Pr)=>Math.max(t,Math.min(Br,Math.round(e)));function To(e,t){if(e?.fullscreen){let i=Number(t?.width),s=Number(t?.height);return i>0&&s>0&&Number.isFinite(i)&&Number.isFinite(s)?vo(Pe*s/i,Ir):Nr}let o=Number(e?.aspect_ratio_width)||y.aspect_ratio_width,r=Number(e?.aspect_ratio_height)||y.aspect_ratio_height;return vo(Pe*(r/o))}function Eo(e,t,o=null){let r={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(t?.target_budget)||y.target_budget,survivalVolume:Number(t?.survival_volume)||Or,comfortMin:Number(t?.comfort_temp_min)||Ao,sensorMissing:!1,lastReading:null};if(!e||!t)return r;let i=t.entity?e.states[t.entity]:void 0,s=i?parseFloat(i.state):NaN,a=o?.lastReading??null;r.sensorMissing=!(i&&!isNaN(s));let n=a;if(i&&!isNaN(s)){let l=Math.max(0,s),c=i.last_changed?new Date(i.last_changed).getTime():NaN,h=a!==null&&a.volume===l&&a.changedMs!==null;n={volume:l,changedMs:h?a.changedMs:Number.isFinite(c)?c:null}}if(n&&(r.consumedVolume=n.volume,r.lastReading=n,n.changedMs!==null&&(r.hoursSinceLastShower=Math.max(0,(Date.now()-n.changedMs)/(1e3*60*60)))),t.temperature_entity&&e.states[t.temperature_entity]){let l=parseFloat(e.states[t.temperature_entity].state);r.temperature=isNaN(l)?0:l}if(t.target_budget_entity&&e.states[t.target_budget_entity]){let l=parseFloat(e.states[t.target_budget_entity].state);l>0&&(r.targetBudget=l)}if(t.comfort_temp_entity&&e.states[t.comfort_temp_entity]){let l=parseFloat(e.states[t.comfort_temp_entity].state),c=Number(t.temp_boiling_threshold)||y.temp_boiling_threshold;l>0&&l<c&&(r.comfortMin=l)}return r}function Ur(e,t){return t==="saltwater"?e<2?0:e===2?1:e===3?3:Mo[(e-4)%Mo.length]:e%6}var We=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5],Mo=[4,2,5,6,2,5],ko={male:1.4,female:1.6},Dr=1.5,Hr=.6,qr=2;function Ke(e,t){let o=Et(t),r=Math.min(10,Math.max(1,Number(e)||4));return Array.from({length:r},(i,s)=>{let a=Ur(s,t),n=t==="saltwater"&&a===0,l=t==="freshwater"&&a===2,c=l?Hr:1,h=1.38-(We[s%We.length]-1.2)*.2,f=Math.random()*50-25,p=Math.random()*50-25;return{species:a,color:o.palette[s%o.palette.length],scale:(n?s===0?ko.male:ko.female:We[s%We.length]*(t==="saltwater"&&a===1?qr:1))*(l?Dr:1),phase:Math.random()*6.28,x:n?190+s*140:120+s*760/Math.max(1,r-1)+f,y:n?470:160+s%3*90+p,vx:h*(.8+Math.random()*.4)*c,vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5)*c,dir:Math.random()<.5?1:-1,deathProgress:0}})}function Je({config:e,metrics:t,canvasHeight:o}){let r=t.targetBudget,i=t.survivalVolume,s=r+i,a=t.consumedVolume,n=t.temperature,l=Number(e?.temp_boiling_threshold)||y.temp_boiling_threshold,c=Number(e?.temp_deadly_threshold)||y.temp_deadly_threshold,h=Math.max(0,s-a),f=s>0?Math.max(0,Math.min(1,h/s)):0,p=!!e?.fullscreen,m=p?0:15,g=p?o:o-35,x=g-m,v=g-f*x,w=n>=c&&n>0,S=h<=0,M=w||S,k=n>=l&&n>0,F=a>r&&!M,L=a>r*.7&&!F&&!M,O=Number(e?.fish_speed_multiplier)||y.fish_speed_multiplier,D=((F||k)&&!M?2:1)*O;return{targetBudget:r,survivalVolume:i,totalVolume:s,currentVolume:a,currentTemp:n,boilTemp:l,deadlyTemp:c,remainingVolumeInTank:h,waterRatio:f,tankTop:m,tankBottom:g,tankHeight:x,waterSurfaceY:v,isHeatDead:w,isWaterDead:S,isDead:M,isBoiling:k,isCritical:F,isWarning:L,speedMultiplier:D}}function Vr(e){let t=Math.max(St+10,Math.ceil((e+5)/10)*10),o=[];for(let r=St+10;r<=t;r+=10)o.push(r);return{min:St,max:t,ticks:o}}function Lo({currentTemp:e,currentVolume:t,targetBudget:o,comfortMin:r,deadlyTemp:i,boilTemp:s}){let a=Vr(i),n=p=>Math.max(0,Math.min(1,(p-a.min)/(a.max-a.min))),l=n(e),c=e>=i?"#ef4444":e>=s?"#f97316":e>=r?"#16a34a":"#0284c7",h=Math.max(0,Math.min(1,t/Math.max(1,o))),f=t>o?"#ef4444":t>o*.7?"#f59e0b":"#0284c7";return{tempFraction:l,tempColor:c,volFraction:h,volColor:f,scale:a,marks:[{fraction:n(r),color:"#16a34a"},{fraction:n(s),color:"#f97316"},{fraction:n(i),color:"#ef4444"}],ticks:a.ticks.map(n)}}var Fo=8e3,et=900;function tt(){return{lastVolume:null,lastIncreaseAt:0,target:0,showerActive:!1}}function Ro(e,t,o){if(e.lastVolume===null)return{...e,lastVolume:t};if(t<e.lastVolume-1e-6)return{...tt(),lastVolume:t};if(t>e.lastVolume+1e-6){let r=t-e.lastVolume,i=(o-e.lastIncreaseAt)/1e3,a=e.lastIncreaseAt>0&&i>.2&&i<=15?r/(i/60):null,n=a===null?.5:Math.max(.25,Math.min(1,a/10));return{lastVolume:t,lastIncreaseAt:o,target:n,showerActive:!0}}return e}function Oo(e,t){return e.lastIncreaseAt&&t-e.lastIncreaseAt<Fo?e.target:0}function Po(e,t){return e.showerActive&&e.lastIncreaseAt>0&&t-e.lastIncreaseAt>=Fo}function Bo(e,t=36){return e>.02?Math.min(t,Math.round(4+e*(t-4))):0}function Io(e,t,o=45){return e<=t+o?"feed":"knock"}function No(e,t,o,r,i=280,s=Math.random){let a=e-o,n=t-r,l=Math.hypot(a,n);if(l>i)return null;let c,h;if(l<1){let m=s()*Math.PI*2;c=Math.cos(m),h=Math.sin(m)}else c=a/l,h=n/l;let f=1-l/i,p=2+9*f;return{kx:c*p,ky:h*p*.6,scare:f}}function Uo(e,t,o,r=360){let i=null,s=r;for(let a of o){if(a.eaten)continue;let n=Math.hypot(a.x-e,a.y-t);n<s&&(s=n,i=a)}return i}var Ct={count:10,start:40,speed:3.4};function Do(e,t,o=Ct.count,r=Math.random){let i=["#f59e0b","#fbbf24","#fb923c","#facc15"];return Array.from({length:o},()=>{let s=(r()-.5)*2;return{x:e+s*Ct.start,y:t+r()*12,vx:s*Ct.speed+(r()-.5)*.8,vy:.4+r()*.55,phase:r()*Math.PI*2,r:3.4+r()*2,color:i[Math.floor(r()*i.length)],landedAt:0,eaten:!1}})}var Gr=4.186/3600;function Ft(e,t,o=15){return!(e>0)||!(t>o)?0:e*(t-o)*Gr}function Ho({volumeL:e,energyKwh:t,waterPricePerM3:o,energyPricePerKwh:r}){let i=Math.max(0,e||0)*(Number(o)||0)/1e3,s=Math.max(0,t||0)*(Number(r)||0);return{water:i,energy:s,total:i+s}}function ot(e,t="fr"){try{return new Intl.NumberFormat(t,{style:"currency",currency:"EUR"}).format(e)}catch{return`${e.toFixed(2)} \u20AC`}}var Tt={max:{fps:0,ambientHz:0,antialias:!0,flowBubbles:36,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0},balanced:{fps:30,ambientHz:0,antialias:!0,flowBubbles:24,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0},light:{fps:20,ambientHz:8,antialias:!1,flowBubbles:12,richSurface:!1,deathFilter:!1,doubleRipple:!1,shading:!1}};function qo(e){return e&&Tt[e]||Tt.max}function Vo(e,t,o){return!o||!t?!0:e-t>=1e3/o-2}function Go(e){return e?Math.max(2,1e3/e/16.66*1.6):2}function Zo(e,t){return[e.consumedVolume,e.temperature,e.targetBudget,e.survivalVolume,e.comfortMin,e.sensorMissing?1:0,Math.floor(e.hoursSinceLastShower),t].join("|")}function Rt(e){let t={...e};for(let o of jo){if(o.max===void 0)continue;let r=t[o.key];r!=null&&(t[o.key]=Ot({[o.key]:r}).config[o.key])}return t}function Qo(e,t=!0){return t===!1?!0:!e}var zo=40;function Yo(e){return e?120:2}var jo=[{key:"fish_count",fallback:y.fish_count,min:1,max:10,integer:!0},{key:"target_budget",fallback:y.target_budget,min:0,minExclusive:!0},{key:"survival_volume",fallback:y.survival_volume,min:0,minExclusive:!0},{key:"temp_boiling_threshold",fallback:y.temp_boiling_threshold,min:0,minExclusive:!0},{key:"temp_deadly_threshold",fallback:y.temp_deadly_threshold,min:0,minExclusive:!0},{key:"comfort_temp_min",fallback:y.comfort_temp_min,min:0,minExclusive:!0},{key:"algae_delay_hours",fallback:y.algae_delay_hours,min:0,minExclusive:!0},{key:"algae_age",fallback:y.algae_age,min:0},{key:"fish_speed_multiplier",fallback:y.fish_speed_multiplier,min:0,minExclusive:!0,clampMin:.2,max:3},{key:"aspect_ratio_width",fallback:y.aspect_ratio_width,min:0,minExclusive:!0},{key:"aspect_ratio_height",fallback:y.aspect_ratio_height,min:0,minExclusive:!0},{key:"water_price_per_m3",fallback:y.water_price_per_m3,min:0},{key:"energy_price_per_kwh",fallback:y.energy_price_per_kwh,min:0},{key:"cold_water_temp",fallback:y.cold_water_temp,min:-50}];function Ot(e){let t={...e},o=[];for(let n of Object.keys(t))(t[n]===null||t[n]===void 0)&&delete t[n];for(let n of jo){let l=t[n.key];if(l===void 0)continue;let c=typeof l=="string"&&l.trim()===""?NaN:Number(l);if(!(Number.isFinite(c)&&(n.minExclusive?c>n.min:c>=n.min))){o.push(`${n.key}: ${JSON.stringify(l)} is not valid, using ${n.fallback}`),t[n.key]=n.fallback;continue}n.integer&&(c=Math.round(c)),n.clampMin!==void 0&&c<n.clampMin&&(c=n.clampMin),n.max!==void 0&&c>n.max&&(c=n.max),c!==l&&(c!==Number(l)&&o.push(`${n.key}: ${JSON.stringify(l)} is out of range, using ${c}`),t[n.key]=c)}t.theme!==void 0&&!At[t.theme]&&(o.push(`theme: ${JSON.stringify(t.theme)} is unknown, using freshwater`),t.theme="freshwater"),t.animation_quality!==void 0&&!Tt[t.animation_quality]&&(o.push(`animation_quality: ${JSON.stringify(t.animation_quality)} is unknown, using max`),t.animation_quality="max"),t.gauge_style!==void 0&&t.gauge_style!=="thermometer"&&t.gauge_style!=="arc"&&(o.push(`gauge_style: ${JSON.stringify(t.gauge_style)} is unknown, using thermometer`),t.gauge_style="thermometer"),t.creature_style!==void 0&&!Fr.includes(t.creature_style)&&(o.push(`creature_style: ${JSON.stringify(t.creature_style)} is unknown, using ${y.creature_style}`),t.creature_style=y.creature_style),t.title!==void 0&&typeof t.title!="string"&&(o.push("title: must be text, ignoring it"),t.title="");let r=t.temp_boiling_threshold??y.temp_boiling_threshold,i=t.temp_deadly_threshold??y.temp_deadly_threshold;i<=r&&(t.temp_deadly_threshold=r+1,o.push(`temp_deadly_threshold: ${i} must be above temp_boiling_threshold (${r}), using ${r+1}`));let s=t.comfort_temp_min??Ao,a=t.temp_boiling_threshold??y.temp_boiling_threshold;return s>=a&&(t.comfort_temp_min=Math.max(1,a-1),o.push(`comfort_temp_min: ${s} must be below temp_boiling_threshold (${a}), using ${t.comfort_temp_min}`)),{config:t,warnings:o}}function Pt(e,t){return String(e).replace(/\{(\w+)\}/g,(o,r)=>r in t?String(t[r]):o)}function Be(e,t="en"){return Number.isInteger(e)?String(e):P(e,t,1)}function P(e,t="en",o=1){try{return new Intl.NumberFormat(t,{minimumFractionDigits:o,maximumFractionDigits:o}).format(e)}catch{return Number(e).toFixed(o)}}var Zr="hydrao_custom";function Wo(e,...t){let o=e&&typeof e.entities=="object"&&e.entities?e.entities:{},r=e&&typeof e.states=="object"&&e.states?e.states:{},i=[...new Set([...t.flatMap(l=>Array.isArray(l)?l:[]),...Object.keys(o),...Object.keys(r)])].sort(),s=(l,c,h,f)=>{let p=i.filter(g=>g.startsWith(`${l}.`)),m=p.find(g=>o[g]?.platform===Zr&&c.includes(o[g]?.translation_key??""));return m||p.find(g=>g.includes("hydrao")&&h.test(g)&&!(f&&f.test(g)))||""},a=/(total|cumul|comfort|confort|wasted|perdu|gaspill)/,n=/_minimum_comfort_temperature|_temperature_de_confort_minimum|_temperature_confort_minimum/;return{entity:s("sensor",["shower_volume_comfort"],/_(comfort_shower_volume|shower_comfort_volume|volume_douche_confort|volume_confort_douche|douche_confort)(_\d+)?$/,/(total|cumul|wasted|perdu|gaspill)/)||s("sensor",["shower_volume_raw"],/_(shower_volume|volume_douche)(_\d+)?$/,a),temperature_entity:s("sensor",["temperature"],/_temperature(_\d+)?$/),comfort_temp_entity:s("number",["comfort_temperature"],/_(minimum_comfort_temperature|temperature_de_confort_minimum|temperature_confort_minimum)(_\d+)?$/),target_budget_entity:s("sensor",["threshold_4"],/_(threshold|seuil)_4(_\d+)?$/,n)}}var Ko=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:y.theme,selector:{select:{options:[{value:"freshwater",label:"Freshwater (Tropical)"},{value:"saltwater",label:"Saltwater (Reef)"},{value:"coldwater",label:"Coldwater (Goldfish)"}]}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:y.target_budget,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{type:"expandable",name:"section_aquarium",flatten:!0,schema:[{name:"fish_count",default:y.fish_count,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"fish_speed_multiplier",default:y.fish_speed_multiplier,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"algae_enabled",default:y.algae_enabled,selector:{boolean:{}}},{name:"algae_delay_hours",default:y.algae_delay_hours,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:y.algae_age,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}}]},{type:"expandable",name:"section_limits",flatten:!0,schema:[{name:"survival_volume",default:y.survival_volume,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"comfort_temp_entity",selector:{entity:{domain:["sensor","number","input_number"]}}},{name:"comfort_temp_min",default:y.comfort_temp_min,selector:{number:{min:15,max:45,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_boiling_threshold",default:y.temp_boiling_threshold,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:y.temp_deadly_threshold,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_cost",flatten:!0,schema:[{name:"show_cost",default:y.show_cost,selector:{boolean:{}}},{name:"water_price_per_m3",default:y.water_price_per_m3,selector:{number:{min:0,max:30,step:.01,unit_of_measurement:"\u20AC/m\xB3",mode:"box"}}},{name:"energy_price_per_kwh",default:y.energy_price_per_kwh,selector:{number:{min:0,max:2,step:.001,unit_of_measurement:"\u20AC/kWh",mode:"box"}}},{name:"cold_water_temp",default:y.cold_water_temp,selector:{number:{min:0,max:30,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_display",flatten:!0,schema:[{name:"animation_quality",default:y.animation_quality,selector:{select:{options:[{value:"max",label:"Maximum"},{value:"balanced",label:"Balanced"},{value:"light",label:"Light (Google Nest Hub)"}]}}},{name:"creature_style",default:y.creature_style,selector:{select:{options:[{value:"flat",label:"Flat and detailed"},{value:"cartoon",label:"Cartoon"},{value:"realistic",label:"Realistic"}]}}},{name:"show_budget",default:y.show_budget,selector:{boolean:{}}},{name:"respect_reduced_motion",default:y.respect_reduced_motion,selector:{boolean:{}}},{name:"fullscreen",default:y.fullscreen,selector:{boolean:{}}},{name:"show_gauges",default:y.show_gauges,selector:{boolean:{}}},{name:"gauge_style",default:y.gauge_style,selector:{select:{options:[{value:"thermometer",label:"Thermometer and bar"},{value:"arc",label:"Open arcs"}]}}},{name:"show_tiles",default:y.show_tiles,selector:{boolean:{}}},{name:"swipe_biotope",default:y.swipe_biotope,selector:{boolean:{}}},{name:"show_fps",default:y.show_fps,selector:{boolean:{}}},{name:"aspect_ratio_width",default:y.aspect_ratio_width,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:y.aspect_ratio_height,selector:{number:{min:1,max:4e3,mode:"box"}}}]}];function Jo(e=Ko){return e.flatMap(t=>t.type==="expandable"?Jo(t.schema):[t])}var Xo={section_aquarium:"section_aquarium",section_limits:"section_limits",section_cost:"section_cost",section_display:"section_display"},Qr={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",comfort_temp_entity:"field_comfort_temp_entity",comfort_temp_min:"field_comfort_temp",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",show_cost:"field_show_cost",water_price_per_m3:"field_water_price",energy_price_per_kwh:"field_energy_price",cold_water_temp:"field_cold_water_temp",animation_quality:"field_animation_quality",respect_reduced_motion:"field_respect_reduced_motion",fullscreen:"field_fullscreen",show_fps:"field_show_fps",creature_style:"field_creature_style",gauge_style:"field_gauge_style",show_budget:"field_show_budget",swipe_biotope:"field_swipe_biotope",show_gauges:"field_show_gauges",show_tiles:"field_show_tiles",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},zr={fullscreen:"helper_fullscreen",creature_style:"helper_creature_style",target_budget:"helper_target_budget",fish_count:"helper_fish_count",fish_speed_multiplier:"helper_fish_speed",comfort_temp_entity:"helper_comfort_temp_entity",show_cost:"helper_show_cost",animation_quality:"helper_animation_quality",respect_reduced_motion:"helper_respect_reduced_motion",show_fps:"helper_show_fps",swipe_biotope:"helper_swipe_biotope",show_gauges:"helper_show_gauges",show_tiles:"helper_show_tiles",algae_age:"helper_algae_age"},Yr={theme:{freshwater:"theme_freshwater",saltwater:"theme_saltwater",coldwater:"theme_coldwater"},animation_quality:{max:"quality_max",balanced:"quality_balanced",light:"quality_light"},creature_style:{flat:"option_creature_flat",cartoon:"option_creature_cartoon",realistic:"option_creature_realistic"},gauge_style:{thermometer:"option_gauge_thermometer",arc:"option_gauge_arc"}},Bt=class extends Q{static get properties(){return{hass:{type:Object},_config:{type:Object}}}constructor(){super(),this.hass=void 0,this._config=void 0}setConfig(t){this._config=Xe(t)}_lang(){return z(this.hass)}_computeLabel(t){let o=Qr[t.name]||Xo[t.name];return o?X(this._lang(),o):t.name}_computeHelper(t){let o=zr[t.name];return o?X(this._lang(),o):""}_valueChanged(t){if(!this._config||!this.hass)return;let o=Rt({...t.detail.value});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}_schema(){let t=this._lang(),o=r=>{if(r.type==="expandable")return{...r,title:X(t,Xo[r.name]),schema:r.schema.map(o)};let i=Yr[r.name];return i?{...r,selector:{select:{options:r.selector.select.options.map(s=>({value:s.value,label:X(t,i[s.value])}))}}}:r};return Ko.map(o)}_formData(){return{...Object.fromEntries(Jo().filter(o=>o.default!==void 0).map(o=>[o.name,o.default])),...Rt(this._config)}}render(){return!this.hass||!this._config?N``:N`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${t=>this._computeLabel(t)}
        .computeHelper=${t=>this._computeHelper(t)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",Bt);function ei(e,t,o,r){let i=e._flowIntensity||0,s=3.5+i*6.5,a=90-i*35,l=(i>.05?e._animTime:e._ambientTime)*(1.6+i*2.4),c=e._profile.richSurface,h=c?16:28,f=w=>c?Math.sin(w/17+l*2.3)*i*2.4:0,p=[],m=[];for(let w=t;w<o;w+=h)p.push([w,r+Math.sin(w/a+l)*s+f(w)]),m.push([w,r+4+Math.sin(w/a+l+.6)*s*.7]);p.push([o,r+Math.sin(o/a+l)*s+f(o)]),m.push([o,r+4+Math.sin(o/a+l+.6)*s*.7]);let g=w=>`${w[0].toFixed(1)},${w[1].toFixed(1)}`,x=p.map(g).join(" L "),v=m.slice().reverse().map(g).join(" L ");return u`
    <path d="M ${x} L ${v} Z" fill="#ffffff" opacity="0.25" />
    <path d="M ${x}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
  `}var $e=e=>e??T;var A="#1e293b";function R(e){return e._config?.creature_style||"flat"}function B(e){return e._profile.shading}var $=(e,t,o,r)=>`M${e-o},${t} A${o},${r} 0 1,0 ${e+o},${t} A${o},${r} 0 1,0 ${e-o},${t} Z`,b=(e,t,o)=>$(e,t,o,o),C=e=>`M${e.trim().split(/\s+/).join(" L")} Z`,de=(e,t,o,r)=>`M${e},${t} L${o},${r}`,d=(e,t,o={})=>({d:e,fill:t,...o});function _(e,t=!1){return u`<path d="${e.d}" fill="${e.fill??"none"}" stroke="${$e(e.stroke??(t?A:void 0))}" stroke-width="${$e(e.sw??(t?1.6:void 0))}" stroke-linecap="${$e(e.lc)}" stroke-linejoin="round" opacity="${$e(e.op)}" />`}function U(e,t,o,r,i={}){let s=_(d(o,r,i),e==="cartoon");return e==="realistic"&&t?u`${s}<path d="${o}" fill="url(#shade)" opacity="${$e(i.op)}" />`:s}var I=Object.freeze({x0:776,x1:1010,height:254,ledge:190,ledgeFrom:880,ledgeTo:940}),he=Object.freeze([{x:372,h:24,cave:!0},{x:500,h:26,cave:!1},{x:650,h:26,cave:!1},{x:770,h:26,cave:!1},{x:884,h:22,cave:!0},{x:850,h:118,cave:!1},{x:880,h:190,cave:!1},{x:940,h:190,cave:!1}]),re=Object.freeze(he.reduce((e,t,o)=>{if(o===0)return[0];let r=he[o-1];return[...e,e[o-1]+Math.hypot(t.x-r.x,t.h-r.h)]},[])),ye=re[re.length-1];function it(e){let t=Math.max(0,Math.min(ye,e)),o=1;for(;o<re.length-1&&re[o]<t;)o++;let[r,i]=[he[o-1],he[o]],s=(t-re[o-1])/(re[o]-re[o-1]);return{x:r.x+(i.x-r.x)*s,h:r.h+(i.h-r.h)*s}}var rt=Object.freeze(re.filter((e,t)=>he[t].cave)),st=ye-(he[7].x-he[6].x)/2;function jr(e,t=0){let o=R(e),r=o==="cartoon"?1.4:o==="realistic"?.65:1,i=o==="cartoon"?1.5:o==="realistic"?.7:1,s=[{count:11,baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:16,baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],a=[];return s.forEach((n,l)=>{for(let c=0;c<n.count;c++){let h=c/(n.count-1),f=-90-n.spread/2+h*n.spread,p=(n.lenMin+(n.lenMax-n.lenMin)*(.5+.5*Math.sin(h*Math.PI)))*(1-.3*t),m=l*10+c*.7,g=Math.sin(e._ambientTime*n.speed+m)*9*(1-t),x=f*Math.PI/180,v=Math.cos(x)*n.baseR,w=Math.sin(x)*n.baseR,S=c*37%17-8,M=f+90+g;a.push(u`
        <g transform="translate(${v.toFixed(1)}, ${w.toFixed(1)}) rotate(${M.toFixed(1)})">
          <path d="M 0,0 Q ${S.toFixed(1)},${(-p*.55).toFixed(1)} 0,${(-p).toFixed(1)}" stroke="${n.color}" stroke-width="${(n.width*r).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.9" />
          <circle cx="0" cy="${(-p).toFixed(1)}" r="${(n.width*.9*i).toFixed(1)}" fill="${o==="realistic"?"#ffffff":n.tip}" />
        </g>
      `)}}),a}function Wr(e,t,o,r,i){let a=Array.from({length:8},(c,h)=>{let f=h/8*Math.PI*2+.18*Math.sin(i*1.3+h*2.1),p=1+.2*Math.sin(i*2.3+h*2.7)+.1*Math.sin(i*1.1+h*5.1);return{a:f,x:e+Math.cos(f)*o*p,y:t+Math.sin(f)*r*p}}),n=c=>`M${c.map(h=>`${h.x.toFixed(1)},${h.y.toFixed(1)}`).join(" L")} Z`,l=a.filter(c=>Math.sin(c.a)<.15);return{body:n(a),top:n(l)}}function Xr(e){let t=e-I.ledge,[o,r]=[I.ledgeFrom-30,I.ledgeTo+52];return`M${o+10},${t} L${r-10},${t} L${r},${t+12} L${r-6},${t+30} L${o+8},${t+30} L${o},${t+12} Z`}var ti=[[802,16,36,18,1,"#7d5c8f"],[862,30,58,32,2,"#8b6a9c"],[950,34,66,36,3,"#6d5280"],[1e3,46,34,48,4,"#7d5c8f"],[832,80,46,32,5,"#6d5280"],[906,94,54,34,6,"#8b6a9c"],[978,106,40,40,7,"#7d5c8f"],[920,146,64,30,8,"#6d5280"]],Kr=[[958,216,34,30,9,"#8b6a9c"],[998,198,24,36,10,"#7d5c8f"],[930,228,26,26,11,"#6d5280"]],Jr=[[322,26,38,26,21,"#7d5c8f"],[424,20,28,20,22,"#6d5280"],[314,70,30,36,23,"#8b6a9c"],[428,64,24,32,24,"#7d5c8f"],[372,110,68,30,25,"#6d5280"],[340,138,28,20,26,"#8b6a9c"],[404,134,26,18,27,"#7d5c8f"]],G={left:345,right:398,top:78},es=[[330,9,26,11,41,"#7d5c8f"],[352,20,14,10,42,"#8b6a9c"],[572,8,22,9,43,"#6d5280"],[716,11,32,13,44,"#8b6a9c"],[740,24,18,12,45,"#7d5c8f"],[610,6,12,6,46,"#6d5280"],[506,6,10,5,47,"#8b6a9c"]];function Ie(e,t,o,[r,i,s,a,n,l]){let c=o-i,{body:h,top:f}=Wr(r,c,s,a,n);return u`
    ${U(e,t,h,l)}
    ${e==="cartoon"?"":_(d(f,"#ffffff",{op:.15,stroke:"none"}))}
    ${e==="flat"?[[-.3,.1],[.25,.3],[-.05,.45]].map(([p,m])=>_(d(b(r+p*s,c+m*a,Math.max(1.4,s*.06)),"#3b2a4a",{op:.35,stroke:"none"}))):""}
  `}function oi(e,t,o,r){let i=t,s=R(e),a=B(e),n=(c,h,f)=>U(s,a,c,h,f===void 0?{}:{op:f}),l=(c,h,f,p)=>s==="flat"?c.map(([m,g])=>_(d(b(m,g,f),h,{op:p}))):"";return u`
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
        ${U(s,a,"M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z","#1d4ed8",{stroke:"#1e40af",sw:2})}
        <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="5" fill="#60a5fa" />
      </g>
      </g>
      <g id="live-rock">
        ${ti.slice(0,4).map(c=>Ie(s,a,i,c))}
        ${ti.slice(4).map(c=>Ie(s,a,i,c))}
        ${_(d($(884,i-52,36,22),"#0b0614",{stroke:"none",op:1}))}
        ${n(Xr(i),"#9a78ad")}
        ${s==="cartoon"?"":_(d(`M ${I.ledgeFrom-20},${i-I.ledge+3} L ${I.ledgeTo+44},${i-I.ledge+3}`,void 0,{stroke:"#ffffff",sw:1.6,op:.4,lc:"round"}))}
        ${Kr.map(c=>Ie(s,a,i,c))}
        ${s==="cartoon"?"":[[850,44,16,7],[942,108,18,8],[976,152,11,6],[812,74,12,6],[1002,200,9,7]].map(([c,h,f,p])=>_(d($(c,i-h,f,p),"#e879f9",{op:.32,stroke:"none"})))}
        ${s==="flat"?[[846,66],[972,158]].map(([c,h])=>u`${_(d(`M ${c},${i-h} L ${c},${i-h-9}`,void 0,{stroke:"#fb923c",sw:1.2,lc:"round"}))}${_(d(b(c,i-h-11,3.2),"#fb923c",{stroke:"none"}))}`):""}
      </g>
      <g id="live-rock-scattered">
        ${es.map(c=>Ie(s,a,i,c))}
      </g>
      <g id="anemone" style="${o}" transform="translate(260, ${i-17}) scale(1.4, 1.4)">
        ${jr(e,r)}
        ${n($(0,-16,30,11),"#86198f",.9)}
        ${n("M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z","#701a75")}
        ${n($(0,16,26,9),"#4a044e",.75)}
        ${s==="cartoon"?u`
              ${_(d(b(-8,3,3.6),"#ffffff",{stroke:A,sw:1.2}))}
              ${_(d(b(8,3,3.6),"#ffffff",{stroke:A,sw:1.2}))}
              ${_(d(b(-7.4,3.4,2),"#111827",{stroke:"none"}))}
              ${_(d(b(8.6,3.4,2),"#111827",{stroke:"none"}))}
              ${_(d("M -6,10 Q 0,16 6,10",void 0,{stroke:A,sw:1.5,lc:"round"}))}
              ${_(d($(-14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
              ${_(d($(14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
            `:""}
      </g>
      <g id="live-rock-2">
        ${Jr.map(c=>Ie(s,a,i,c))}
        ${s==="cartoon"?"":[[314,76,12,6],[404,140,14,6],[430,70,10,6]].map(([c,h,f,p])=>_(d($(c,i-h,f,p),"#e879f9",{op:.32,stroke:"none"})))}
        ${_(d(`M ${G.left},${i-4} L ${G.left},${i-44} Q ${G.left},${i-G.top} ${(G.left+G.right)/2},${i-G.top} Q ${G.right},${i-G.top} ${G.right},${i-44} L ${G.right},${i-4} Z`,"#0b0614",{stroke:"none",op:1}))}
      </g>
    </g>
  `}var ts=[[140,25,70,26,"#475569",1],[250,17,50,20,"#64748b",1],[860,20,75,28,"#334155",1],[760,15,46,18,"#64748b",1],[300,10,26,10,"#94a3b8",.85],[600,8,22,9,"#94a3b8",.8],[660,14,34,14,"#475569",.9]];function ii(e,t,o){return u`
    <g id="coldwater-decor">
      ${ts.map(([r,i,s,a,n,l])=>{let c=e-i;return u`
          ${U(t,o,$(r,c,s,a),n,{op:l})}
          ${_(d($(r-s*.3,c-a*.4,s*.35,a*.22),"#ffffff",{op:.22}))}
        `})}
    </g>
  `}function ri(e,t,o,r){let i=e,s=(n,l,c)=>U(o,r,n,l,c===void 0?{}:{op:c}),a=(n,l)=>o==="flat"?_(d(n,void 0,{stroke:"#052e16",sw:1.5,op:l,lc:"round"})):"";return u`
    <g id="freshwater-plants" style="${t}">
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
  `}function si(e,t,o,r=0){let i=o?e._getCanvasHeight():e._getCanvasHeight()-35,s=e._profile.deathFilter?`filter: grayscale(${(r*.85).toFixed(2)}) sepia(${(r*.5).toFixed(2)}) brightness(${(1-r*.45).toFixed(2)});`:`opacity: ${(1-r*.6).toFixed(2)};`;return t==="saltwater"?oi(e,i,s,r):t==="coldwater"?ii(i,R(e),B(e)):ri(i,s,R(e),B(e))}var os=[[70,70,.1,-1],[150,95,.25,1],[260,60,.05,1],[380,110,.4,-1],[470,65,.15,1],[560,90,.3,-1],[650,120,.5,1],[740,70,.1,-1],[830,100,.35,1],[920,80,.2,-1],[985,60,.6,-1],[40,55,.7,1]],is=[[-6,1,.15,"#3f6212"],[-2,.8,.35,"#4d7c0f"],[3,.65,-.1,"#365314"],[7,.5,.25,"#65a30d"]],It=(e,t,o)=>Math.sin(e/t)*.35+Math.sin(e/o+1.3)*.2,Nt=e=>`M${e.map(([t,o])=>`${t.toFixed(1)},${o.toFixed(1)}`).join(" L")} Z`,rs=8,Ne=new Map;function ss(e,t,o,r,i){let s=`${e}|${t}|${o}|${r}|${i}`,a=Ne.get(s);if(a)return a;let n=i-r,l=n*(.04+.16*e),c=[[t,i]];for(let x=t;x<=o;x+=8)c.push([x,i-l*(1+It(x,37,13))]);c.push([o,i]);let h=8+62*e,f=[[t,r]],p=[[o,r]];for(let x=r;x<=i;x+=8)f.push([t+h*(1+It(x,41,17)),x]),p.push([o-h*(1+It(x+90,41,17)),x]);f.push([t,i]),p.push([o,i]);let m=[];for(let[x,v,w,S]of os){let M=Math.min(1,(e-w)/.4);if(M<=0)continue;let k=Math.min(v*M,n*.3);for(let[F,L,O,K]of is){let D=x+F,q=D+S*k*(.2+O),J=i-k*L,ee=D+(q-D)*.3-S*5,te=i-k*L*.55;m.push({d:`M${D},${i} Q${ee.toFixed(1)},${te.toFixed(1)} ${q.toFixed(1)},${J.toFixed(1)}`,color:K})}}let g={bottom:Nt(c),leftWall:Nt(f),rightWall:Nt(p),strands:m};return Ne.size>=rs&&Ne.delete(Ne.keys().next().value),Ne.set(s,g),g}function ni(e,t,o){let r=e._config;if(!r)return u``;let i=r.algae_delay_hours,s=Number(r.algae_age)||0,a=s>0?s:t;if(!r.algae_enabled||a<i)return u``;let n=Math.round(Math.min(1,(a-i)/36)*1e3)/1e3,l=(.2+n*.78).toFixed(2),c=o?0:14,h=o?e._getCanvasHeight():e._getCanvasHeight()-35,f=ss(n,o?0:12,o?1024:1012,c,h);return u`
    <g id="algae-layer" opacity="${l}">
      <rect x="0" y="${c}" width="1024" height="${h-c}" fill="url(#algaeDots)" opacity="${(.15+n*.2).toFixed(2)}" />
      <path d="${f.bottom}" fill="#4d7c0f" fill-opacity="0.32" />
      <path d="${f.bottom}" fill="url(#algaeDots)" />
      <path d="${f.leftWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${f.leftWall}" fill="url(#algaeDots)" opacity="0.8" />
      <path d="${f.rightWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${f.rightWall}" fill="url(#algaeDots)" opacity="0.8" />
      ${f.strands.map(p=>u`<path d="${p.d}" fill="none" stroke="${p.color}" stroke-width="2.6" stroke-linecap="round" />`)}
    </g>
  `}var E=e=>({fins:[],marks:[],over:[],pec:null,...e}),Ut=(e,t,o)=>`M ${e},${o} Q ${e+6},${o-4} ${e+12},${o} T ${t},${o}`,ns=e=>E({fins:[d(C("5,-42 -10,-12 10,-12"),e,{op:.9}),d(C("0,42 -8,12 8,12"),e,{op:.9}),d(de(8,10,20,48),void 0,{stroke:"#ffffff",sw:2,lc:"round"})],tail:{at:[-22,0],mul:1,shapes:[d(C("0,0 -20,-14 -15,0 -20,14"),e)],rays:[[-20,-14],[-17,0],[-20,14]]},body:d(C("-20,0 5,-17 24,0 5,17"),e),marks:[d(de(3,-17,3,17),void 0,{stroke:"#0f172a",sw:3})],eye:{x:16,y:-3,r:3,iris:"#ef4444"},area:[3,0,12,10]}),as=()=>E({tail:{at:[-20,0],mul:1,shapes:[d(C("0,0 -14,-7 -12,0 -14,7"),"rgba(255,255,255,0.7)")],rays:[[-14,-7],[-12,0],[-14,7]]},body:d($(0,0,22,9),"#1e293b"),marks:[d("M 15,-2 L -17,-2",void 0,{stroke:"#06b6d4",sw:3.5,lc:"round"}),d("M 0,3 L -17,3",void 0,{stroke:"#ef4444",sw:3.5,lc:"round"})],eye:{x:14,y:-2,r:2.2,iris:"#38bdf8"},area:[0,0,22,9]}),ls=()=>E({fins:[d(b(2,0,24),"#b45309",{op:.75})],tail:{at:[-19,0],mul:1,shapes:[d("M 0,0 C -6,-8 -12,-7 -13,0 C -12,7 -6,8 0,0 Z","#c2410c",{op:.85})],rays:[[-12,-4],[-13,0],[-12,4]]},body:d(b(2,0,20),"#ea6a2a"),marks:[Ut(-14,18,-10),Ut(-14,18,-2),Ut(-14,18,6)].map(e=>d(e,void 0,{stroke:"#22d3ee",sw:1.8,op:.85,lc:"round"})),eye:{x:15,y:-3,r:2.6,iris:"#dc2626"},area:[2,0,14,14]}),cs=()=>E({fins:[d(C("-4,-6 4,-14 10,-6"),"#f97316",{op:.9})],tail:{at:[-16,0],mul:1,shapes:[d("M 0,0 C -8,-12 -22,-15 -29,-8 C -26,-3 -26,3 -29,8 C -22,15 -8,12 0,0 Z","#f97316",{op:.92}),d(b(-18,-6,2.2),"#1e3a8a",{op:.8}),d(b(-22,4,2.6),"#1e3a8a",{op:.8}),d(b(-14,5,1.6),"#1e3a8a",{op:.7})],rays:[[-29,-8],[-27,0],[-29,8]]},body:d($(0,0,17,7.5),"#38bdf8"),marks:[d($(-2,3.5,13,3),"#e0f2fe",{op:.55}),d($(5,-2.5,6,2.2),"#0ea5e9",{op:.5})],eye:{x:12,y:-2,r:2.2},area:[0,0,13,6]}),ds=()=>E({tail:{at:[-19,0],mul:1,shapes:[d(C("0,0 -12,-8 -9,0 -12,8"),"#fdba74",{op:.9})],rays:[[-12,-8],[-9,0],[-12,8]]},body:d($(0,0,19,10),"#fb923c"),marks:[d($(-1,6,13,3),"#fde68a",{op:.55}),d("M 6,-8.5 C 9,-4 9,4 6,8.5 C -2,8 -10,4 -16,1 C -10,-1 -2,-5 6,-8.5 Z","#111827")],eye:{x:13,y:-3,r:2.4,iris:"#fde68a"},area:[0,-1,14,7]}),hs=()=>E({fins:[d(C("-14,-12 -3,-22 8,-12"),"#f97316",{op:.85}),d(C("-16,12 -4,20 10,12"),"#f97316",{op:.85}),d("M 12,8 C 18,16 20,24 18,32",void 0,{stroke:"#f97316",sw:.9,lc:"round"})],tail:{at:[-21,0],mul:1,shapes:[d("M 0,0 C -8,-9 -14,-8 -15,0 C -14,8 -8,9 0,0 Z","#3b82f6",{op:.85})],rays:[[-13,-5],[-15,0],[-13,5]]},body:d($(0,0,21,14),"#3b82f6"),marks:[-12,-6,0,6,12].map((e,t)=>d(`M ${e-4},-12 L ${e+2},12`,void 0,{stroke:t%2?"#1d4ed8":"#f97316",sw:1.6,op:.85})),eye:{x:14,y:-4,r:2.8,iris:"#fef3c7"},area:[0,0,17,11]}),fs=()=>{let e=t=>d(t,"#ffffff",{stroke:"#0f172a",sw:1.4});return E({tail:{at:[-20,0],mul:1,shapes:[d("M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z","#ea580c",{stroke:"#0f172a",sw:1.4})],rays:[[-15,-6],[-17,0],[-15,6]]},body:d($(0,0,24,15),"#f97316"),marks:[e("M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z"),e("M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z"),e("M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z")],pec:{at:[3,3],shapes:[d($(0,6,6,10),"#f97316",{op:.9,stroke:"#0f172a",sw:1})]},eye:{x:15,y:-4,r:3.2},area:[0,0,22,13]})},us=()=>E({tail:{at:[-25,0],mul:1,shapes:[d(C("0,-2 -20,-13 -13,-2 -20,9 0,2"),"#f59e0b"),d(C("0,-2 -17,-10 -12,-2 -17,7 0,1"),"#fde047",{op:.85})],rays:[[-20,-13],[-13,-2],[-20,9]]},body:d("M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z","url(#tangBodyGrad)"),marks:[d("M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z","#0f172a",{op:.88})],over:[d(b(19,2,1.5),"#facc15",{op:.8})],eye:{x:18,y:-6,r:2.8,iris:"#0f172a",hl:"#93c5fd"},area:[-2,0,20,16]}),ps=()=>E({fins:[d("M -16,-8 C -8,-17 8,-16 14,-9 Z","#facc15",{op:.9})],tail:{at:[-22,0],mul:1,shapes:[d("M 0,0 C -8,-9 -14,-9 -15,0 C -14,9 -8,9 0,0 Z","#facc15")],rays:[[-13,-5],[-15,0],[-13,5]]},body:d($(0,0,22,10.5),"#facc15"),marks:[d("M -4,-10.3 A 22,10.5 0 0,1 22,0 A 22,10.5 0 0,1 -4,10.3 C 3,5 3,-5 -4,-10.3 Z","#7c3aed"),d("M 10,-3 L 22,-1",void 0,{stroke:"#1e1b4b",sw:1.4,lc:"round"})],eye:{x:16,y:-3,r:2.6,iris:"#fde68a"},area:[0,0,18,8]}),ms=()=>{let e=(t,o)=>d(t,void 0,{stroke:"#ea580c",sw:1.3,op:o});return E({tail:{at:[-22,0],mul:1,shapes:[d(C("0,0 -12,-9 -8,0 -12,9"),"#fbbf24",{op:.9})],rays:[[-12,-9],[-8,0],[-12,9]]},body:d($(0,0,23,20),"url(#butterflyBodyGrad)"),marks:[e(de(-14,-16,-8,17),.55),e(de(-6,-19,0,19),.55),e(de(2,-19,7,19),.55),e(de(10,-17,14,16),.5)],over:[d("M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z","#fbbf24"),d(b(-15,0,3),"#1f2937",{op:.8}),d(b(-15,0,1.6),"#fbbf24",{op:.9})],eye:{x:12.5,y:-4,r:2.6,iris:"#0f172a",hl:"#e2e8f0"},area:[0,0,20,17]})},_s=()=>E({fins:[d(C("-14,-15 0,-24 16,-12"),"#fde047",{op:.95}),d(C("-12,15 2,23 16,12"),"#fde047",{op:.95})],tail:{at:[-22,0],mul:1,shapes:[d(C("0,0 -12,-10 -8,0 -12,10"),"#fde047")],rays:[[-12,-10],[-8,0],[-12,10]]},body:d($(0,0,22,17),"#fde047"),marks:[d($(2,8,16,6),"#fef9c3",{op:.7})],over:[d("M 20,-3 Q 27,-1 28,0 Q 27,1 20,3 Z","#fde047"),d(b(-19,0,1.6),"#ffffff",{op:.9})],eye:{x:14,y:-5,r:2.6,iris:"#ffffff"},area:[0,0,17,14]}),gs=()=>E({fins:[d(C("-6,-7 4,-14 12,-7"),"#2dd4bf",{op:.9}),d(C("-8,7 0,12 8,7"),"#2dd4bf",{op:.9})],tail:{at:[-20,0],mul:1,shapes:[d(C("0,0 -14,-11 -9,0 -14,11"),"#2dd4bf")],rays:[[-14,-11],[-9,0],[-14,11]]},body:d($(0,0,20,8.5),"url(#chromisGrad)"),marks:[d($(0,4,15,2.6),"#e0f2fe",{op:.45})],eye:{x:14,y:-2,r:2.2},area:[0,0,16,7]}),$s=()=>E({fins:[d(C("-12,-8 4,-20 14,-8"),"#fb923c",{op:.9})],tail:{at:[-21,0],mul:1,shapes:[d("M 0,0 L -8,-10 L -18,-16 L -8,-3 L -7,0 L -8,3 L -18,16 L -8,10 Z","#fb923c")],rays:[[-18,-16],[-7,0],[-18,16]]},body:d($(0,0,21,9),"#f97316"),marks:[d($(0,4.5,15,3.6),"#f9a8d4",{op:.65})],eye:{x:15,y:-2,r:2.4,iris:"#fde68a"},area:[0,0,16,7]}),ys=e=>E({fins:[d("M -4,-20 C 2,-33 18,-31 21,-18 Z",e,{op:.8})],tail:{at:[-14,0],mul:1.1,shapes:[d("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z",e,{op:.88})],rays:[[-35,-11],[-43,17],[-21,34]]},body:d("M -14,4 C -16,-12 -4,-26 10,-22 C 22,-19 28,-8 27,2 C 26,12 18,18 8,18 C -4,18 -14,14 -14,4 Z",e),marks:[d($(4,9,12,6),"#ffffff",{op:.75}),d($(-4,-10,7,4),"#ffffff",{op:.55})],eye:{x:21,y:-3,r:3.4},area:[6,0,15,15]}),bs=e=>E({fins:[d(C("-4,-16 4,-25 14,-17"),e,{op:.85})],tail:{at:[-16,0],mul:1,shapes:[d("M 0,0 L -48,-19 L -30,-1 Z",e,{op:.92}),d("M 0,0 L -48,19 L -30,1 Z",e,{op:.8})],rays:[[-48,-19],[-48,19]]},body:d("M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z",e),marks:[d($(6,-5,10,4),"#ffffff",{op:.65}),d($(-3,5,8,3.5),"#ffffff",{op:.55})],eye:{x:20,y:-3,r:3},area:[6,0,17,13]}),xs=e=>E({tail:{at:[-14,0],mul:.8,shapes:[d("M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z",e,{op:.88})],rays:[[-30,-2],[-30,6]]},body:d(b(4,2,22),e),marks:[[-8,-4],[0,-12],[10,-10],[-10,6],[-2,0],[8,-2],[16,4],[-4,12],[6,10],[14,14]].map(([t,o])=>d(b(t,o,3.4),"#ffffff",{op:.32})),eye:{x:20,y:-1,r:3},area:[4,2,17,17]}),ws=()=>E({fins:[d("M -6,-15 C 0,-27 14,-26 15,-14 Z","#fecdd3",{op:.85})],tail:{at:[-15,0],mul:1,shapes:[d("M 0,0 C -8,-16 -24,-20 -38,-13 C -31,-7 -30,-2 -32,3 C -28,10 -36,15 -38,19 C -24,22 -8,16 0,0 Z","#fecdd3",{op:.88})],rays:[[-38,-13],[-32,3],[-38,19]]},body:d($(4,2,21,17),"#ffedd5"),marks:[d($(-2,-6,14,7),"#fdba74",{op:.55})],over:[[22,-6,6],[16,-13,6.5],[8,-15,6],[1,-12,5]].map(([e,t,o])=>d(b(e,t,o),"#dc2626")),eye:{x:22,y:0,r:3},area:[4,3,16,13]}),vs=()=>E({fins:[d("M -4,-18 C 2,-30 18,-28 20,-16 Z","#1f2937",{op:.85})],tail:{at:[-14,0],mul:1.1,shapes:[d("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z","#1f2937",{op:.9})],rays:[[-35,-11],[-43,17],[-21,34]]},body:d(b(6,1,21),"#111827"),marks:[d($(2,-9,12,5),"#475569",{op:.45})],over:[d($(23,-6,10.5,9),"#1f2937")],eye:{x:24,y:-6,r:6,iris:"#f59e0b"},area:[6,1,16,15]}),Ms=()=>E({fins:[d(C("-6,-14 4,-24 14,-14"),"#dbeafe",{op:.85})],tail:{at:[-20,0],mul:1,shapes:[d("M 0,0 C -10,-15 -28,-15 -34,-5 L -30,0 L -34,5 C -28,15 -10,15 0,0 Z","#dbeafe",{op:.85})],rays:[[-34,-5],[-30,0],[-34,5]]},body:d($(2,0,24,14),"#bfdbfe"),marks:[d($(-8,-4,9,6),"#f97316"),d($(9,4,6,4.5),"#dc2626"),d(b(2,-8,2.2),"#1e3a8a",{op:.75}),d(b(-2,7,1.8),"#111827",{op:.7}),d(b(14,-5,1.6),"#111827",{op:.7})],eye:{x:20,y:-3,r:3},area:[2,0,19,11]}),ai=[ns,as,ls,cs,ds,hs],li=[fs,us,ps,ms,_s,gs,$s],ci=[ys,bs,xs,ws,vs,Ms],na={freshwater:ai.length,saltwater:li.length,coldwater:ci.length};function di(e,t){let o=t.color||"#3b82f6",r=e==="saltwater"?li:e==="coldwater"?ci:ai,i=Math.abs(Math.trunc(Number(t.species)))||0;return r[i%r.length](o)}var nt=11,ks=2.399963,Ss=Array.from({length:nt},(e,t)=>{let o=Math.sqrt((t+.5)/nt)*.85,r=t*ks;return[o*Math.cos(r),o*Math.sin(r),.75+t*7%3*.3]});function Cs(e){return e>0?Math.min(nt,Math.ceil(e*nt)):0}function be(e,t,o,r=1.7){let i=Cs(e);if(i===0)return u``;let[s,a,n,l]=t,c=Math.min(1,.35+e);return u`
    <g class="stress-dots" pointer-events="none">
      ${Ss.slice(0,i).map(([h,f,p],m)=>{let g=.8+.2*Math.sin(o*5+m*1.7);return u`<circle cx="${(s+h*n).toFixed(1)}" cy="${(a+f*l).toFixed(1)}" r="${(r*p).toFixed(2)}" fill="#ffffff" fill-opacity="${(c*g).toFixed(2)}" stroke="#0f172a" stroke-opacity="${(.28*c).toFixed(2)}" stroke-width="0.4" />`})}
    </g>
  `}function As(e){let[t,o,r,i]=e,s=[],a=0;for(let n=o-i*.7;n<=o+i*.7;n+=5){for(let l=t-r*.8+a%2*3;l<=t+r*.8;l+=6)((l-t)/r)**2+((n-o)/i)**2<=.72&&s.push(`M${l.toFixed(1)},${n.toFixed(1)} q3,2.4 6,0`);a++}return s.join(" ")}function Ts(e,t){let o=t.iris??"#ffffff",r=t.hl??"#ffffff";if(e==="cartoon"){let i=t.r*2.1;return u`
      <circle cx="${t.x}" cy="${t.y}" r="${i}" fill="#ffffff" stroke="${A}" stroke-width="1.5" />
      <circle cx="${t.x+i*.12}" cy="${t.y+i*.1}" r="${i*.6}" fill="#111827" />
      <circle cx="${t.x+i*.3}" cy="${t.y-i*.28}" r="${i*.26}" fill="#ffffff" />
      <circle cx="${t.x-i*.12}" cy="${t.y+i*.3}" r="${i*.12}" fill="#ffffff" />
    `}return e==="realistic"?u`
      <circle cx="${t.x}" cy="${t.y}" r="${t.r*1.15}" fill="${o==="#ffffff"?"#fef3c7":o}" stroke="#111827" stroke-opacity="0.8" stroke-width="0.9" />
      <circle cx="${t.x+.4}" cy="${t.y}" r="${t.r*.62}" fill="#000000" />
      <circle cx="${t.x-t.r*.3}" cy="${t.y-t.r*.4}" r="${t.r*.28}" fill="${r}" />
    `:u`
    <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="${o}" />
    <circle cx="${t.x+1}" cy="${t.y}" r="${t.r*.48}" fill="#0f172a" />
    <circle cx="${t.x+.4}" cy="${t.y-t.r*.4}" r="${t.r*.2}" fill="${r}" />
  `}function Es(e,t,o){let[r,i,s,a]=o.area,n=o.eye;return e==="cartoon"?u`
      ${_(d($(n.x-n.r*.4,n.y+n.r*3.1,n.r*1.3,n.r*.8),"#fb7185",{op:.7,stroke:"none"}))}
      ${_(d(`M${n.x+n.r*.6},${n.y+n.r*2.7} q${n.r*1.2},${n.r*1.1} ${n.r*2.4},0`,void 0,{stroke:A,sw:1.3,lc:"round"}))}
    `:e==="realistic"?u`
      ${t?u`<path d="${o.body.d}" fill="url(#shade)" />`:""}
      ${_(d(As(o.area),void 0,{stroke:"#0f172a",sw:.8,op:.22}))}
      ${_(d($(r-s*.15,i-a*.62,s*.6,Math.max(1.4,a*.13)),"#ffffff",{op:.3}))}
    `:u`
    ${_(d($(r,i+a*.55,s*.85,a*.4),"#ffffff",{op:.14}))}
    ${_(d(`M${n.x-n.r*1.6},${n.y+n.r*.8} q${-n.r*.9},${n.r*2.2} 0,${n.r*4.4}`,void 0,{stroke:"#0f172a",sw:1,op:.22,lc:"round"}))}
  `}function Ls(e,t,o,r,i,s=0,a=0){let n=e==="cartoon",l=e==="cartoon"?[]:o.tail.rays,c=e==="realistic"?.32:.16;return u`
    ${o.fins.map(h=>_(h,n))}
    <g transform="translate(${o.tail.at[0]}, ${o.tail.at[1]}) rotate(${r*o.tail.mul})">
      ${o.tail.shapes.map(h=>_(h,n))}
      ${l.map(([h,f])=>_(d(`M0,0 L${h},${f}`,void 0,{stroke:"#0f172a",sw:.9,op:c})))}
    </g>
    ${_(o.body,n)}
    ${o.marks.map(h=>_(h,n))}
    ${Es(e,t,o)}
    ${o.over.map(h=>_(h,n))}
    ${be(s,o.area,a)}
    ${o.pec?u`<g transform="translate(${o.pec.at[0]}, ${o.pec.at[1]}) rotate(${i})">${o.pec.shapes.map(h=>_(h,n))}</g>`:""}
    ${Ts(e,o.eye)}
  `}function hi(e,t,o,r){let i=t.dir===-1,s=t.deathProgress||0,a=t.scale||1.4,n=(1-s).toFixed(2),l=s.toFixed(2),c=r?0:t.scare||0,h=r?0:Math.sin(e._animTime*(3.5*t.vx)+t.phase)*14*(1+.8*c),f=r?0:Math.sin(e._animTime*(4.5*t.vx)+t.phase)*10,p=r?0:t.stress||0,m=Ls(R(e),B(e),di(o,t),h,f,p,e._ambientTime);return u`
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
  `}function Dt(e,t){let o=`M${e[0]},${e[1]}`;for(let i of t)o+=` C${i.join(",")}`;let r=[e,...t.map(i=>[i[4],i[5]])];for(let i=t.length-1;i>=0;i--){let[s,a,n,l]=t[i];o+=` C${-n},${l} ${-s},${a} ${-r[i][0]},${r[i][1]}`}return`${o} Z`}function Ht(e,t,o){return{k:(s,a,n)=>U(e,t,s,a,{...e==="cartoon"?{}:o,...n===void 0?{}:{op:n}}),line:(s,a,n,l)=>_(d(s,void 0,{stroke:n,sw:a,op:l,lc:"round"}))}}var Fs=[[-24,8,"M -24,8 L -27,16 L -31,21"],[-16,9,"M -16,9 L -17,17 L -20,22"],[-8,9,"M -8,9 L -8,17 L -10,22"],[0,9,"M 0,9 L 1,17 L 0,22"]],Rs=[[22,-4,"M 22,-4 L 33,-11 L 42,-6","M 22,-4 L 33,-11"],[24,1,"M 24,1 L 36,1 L 44,7","M 24,1 L 36,1"],[22,7,"M 22,7 L 32,14 L 38,24","M 22,7 L 32,14"],[16,12,"M 16,12 L 22,22 L 25,32","M 16,12 L 22,22"]],xe=e=>u`${e}<g transform="scale(-1,1)">${e}</g>`;function Ue(e,t,o){return u`
    ${_(d(b(e,t,o),"#ffffff",{stroke:A,sw:1.2}))}
    ${_(d(b(e+o*.15,t+o*.1,o*.58),"#111827",{stroke:"none"}))}
    ${_(d(b(e+o*.32,t-o*.3,o*.24),"#ffffff",{stroke:"none"}))}
  `}function fi(e,t,o){let r=e==="cartoon",{k:i,line:s}=Ht(e,t,{stroke:"#0a0f14",sw:.8}),a=Array.from({length:18},(n,l)=>{let c=l/18*Math.PI*2,[h,f]=[Math.cos(c),Math.sin(c)];return`M${(h*6.5).toFixed(1)},${(f*5).toFixed(1)} L${(h*8.6).toFixed(1)},${(f*6.7).toFixed(1)}`}).join(" ");return u`
    ${i(Dt([0,73],[[3,75,8,80,9,89],[6,91,2,88,0,84]]),"#182026")}
    ${e==="cartoon"?"":xe(s("M 1,76 L 6,88 M 1,76 L 8,86",.7,"#64748b",.5))}
    ${xe(u`
      ${i("M 15,12 C 24,12 32,20 34,32 C 33,38 28,40 24,36 C 19,30 16,22 15,16 Z","#182026")}
      ${r?"":s("M 16,15 L 33,26 M 16,17 L 33,32 M 17,19 L 30,37 M 18,20 L 25,37",.7,"#64748b",.5)}
      ${s("M 15,12 C 24,12 31,19 34,31",1.5,"#64748b",.9)}
      ${i("M 9,38 C 15,40 20,47 19,55 C 16,57 12,53 10,48 Z","#182026")}
      ${r?"":s("M 10,41 L 18,52 M 11,43 L 15,54",.6,"#64748b",.5)}
      ${i("M 4,60 C 7,60 9,64 8,68 C 6,68 4,66 3,64 Z","#182026")}
    `)}
    ${i(Dt([0,-11],[[7,-11,13,-8,15,-1],[17,6,18,12,16,18],[14,28,11,42,8,56],[6,64,3,71,0,75]]),"#1e293b")}
    ${i(Dt([0,14],[[7,14,10,22,9,32],[8,44,6,56,4,66],[3,69,2,71,0,72]]),"#475569",.9)}
    ${e==="flat"?[[-3,24,1.2],[4,30,1],[-5,38,1.3],[3,46,1],[-3,54,1.2],[2,62,.9],[-1,32,.8],[5,52,.8]].map(([n,l,c])=>_(d(b(n,l,c),"#ffffff",{op:.7,stroke:"none"}))):""}
    ${e==="realistic"?xe(s("M 12,20 C 10,34 8,48 5,62",.9,"#0a0f14",.4)):""}
    ${xe(u`
      ${s("M 6,-8 C 9,-12 12,-14 13,-19",2.2,"#3b4a5f",1)}
      ${s("M 10,-14 C 13,-15 15,-17 16,-20",1.6,"#3b4a5f",1)}
      ${s("M 2.5,-10 C 3.5,-14 3,-18 1.5,-21",2.2,"#3b4a5f",1)}
    `)}
    <g transform="translate(0, 3) scale(${o},${o})">
      ${_(d($(0,0,9.2,7.2),"#64748b",{stroke:"#0a0f14",sw:.9}))}
      ${e==="cartoon"?"":s(a,.6,"#94a3b8",.7)}
      ${_(d($(0,0,6.3,4.8),"#334155",{stroke:"#0a0f14",sw:.7}))}
      ${_(d($(0,0,3.4,2.5),"#0f172a",{stroke:"none"}))}
    </g>
    ${r?u`${Ue(-9,-3,3.8)}${Ue(9,-3,3.8)}${_(d($(-13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}${_(d($(13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}`:xe(u`${_(d(b(12.3,-3,1.7),"#0a0f14",{stroke:"none"}))}${_(d(b(12.7,-3.5,.5),"#f1f5f9",{stroke:"none"}))}`)}
    ${e==="realistic"?_(d($(-4,34,2.4,14),"#ffffff",{op:.1,stroke:"none"})):""}
  `}function ui(e,t,o={}){let{phase:r=0,stride:i=0,time:s=0}=o,a=e==="cartoon",{k:n,line:l}=Ht(e,t,{stroke:"#7f1d1d",sw:.8}),[c,h,f]=[22,28,27],p=(M,k=f)=>[c+k*Math.cos(M*Math.PI/180),h+k*Math.sin(M*Math.PI/180)],m=[4,3,2,1,0].map(M=>{let k=-110+M*13,[F,L]=p(k),O=8-M*.8;return u`<g transform="rotate(${k} ${F.toFixed(1)} ${L.toFixed(1)})">${n($(Number(F.toFixed(1)),Number(L.toFixed(1)),O,6.6-M*.25),M%2?"#c81e1e":"#d42424")}</g>`}),g=[0,1,2,3,4].map(M=>{let k=-110+M*13,F=8-M*.8,[L,O]=p(k,f-F),[K,D]=p(k,f-F-4.5),q=.3*Math.sin(s*6+M*1.1),[J,ee]=[K-L,D-O],[te,Me]=[L+J*Math.cos(q)-ee*Math.sin(q),O+J*Math.sin(q)+ee*Math.cos(q)];return`M${L.toFixed(1)},${O.toFixed(1)} L${te.toFixed(1)},${Me.toFixed(1)}`}).join(" "),x=Fs.map(([M,k,F],L)=>u`<g transform="rotate(${(i*16*Math.sin(r+L*1.7)).toFixed(1)} ${M} ${k})">${l(F,1.6,"#7f1d1d",.85)}</g>`),[v,w]=p(-45);return u`
    ${x}
    ${l(g,1.3,"#7f1d1d",.7)}
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
    ${a?u`${Ue(-26,-12,5)}${_(d($(-22,-2,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${_(d("M -32,-4 Q -28,1 -23,-3",void 0,{stroke:A,sw:1.2,lc:"round"}))}`:u`
          ${_(d(b(-27,-13,3),"#0f172a",{stroke:"none"}))}
          ${_(d(b(-27.8,-14,.9),"#f1f5f9",{stroke:"none"}))}
        `}
    ${e==="flat"?[[-22,-7],[-14,-10],[-6,-10],[1,-7]].map(([M,k])=>_(d(b(M,k,1.5),"#fef2f2",{op:.9,stroke:"none"}))):""}
    ${e==="realistic"?_(d($(-8,-14,12,1.6),"#ffffff",{op:.35,stroke:"none"})):""}
  `}function pi(e,t,o={}){let{phase:r=0,stride:i=0}=o,s=e==="cartoon",{k:a,line:n}=Ht(e,t,{stroke:"#7c2d12",sw:.9}),l=c=>{let h=p=>(i*13*Math.sin(r+p*Math.PI+c*Math.PI)).toFixed(1),f=Rs.map(([p,m,g,x],v)=>u`
      <g transform="rotate(${h(v)} ${p} ${m})">
        ${n(g,s?3.2:2.6,"#7c2d12",1)}
        ${s?"":n(x,.8,"#f87171",.5)}
      </g>
    `);return u`
      ${f}
      <g transform="rotate(${(i*5*Math.sin(r*.7+c*1.3)).toFixed(1)} 20 -8)">
        ${n("M 20,-8 L 30,-17",s?4:3.4,"#7c2d12",1)}
        ${a("M 27,-19 C 25,-30 34,-36 41,-33 C 46,-30 45,-25 41,-24 C 45,-21 43,-16 38,-16 C 33,-16 29,-17 27,-19 Z","#ea580c")}
        ${a("M 31,-31 C 33,-40 42,-42 46,-37 C 42,-38 38,-36 36,-32 Z","#ea580c")}
        ${e==="cartoon"?"":_(d("M 36,-28 L 39,-31 L 40,-27 L 43,-29 M 34,-21 L 38,-22 L 38,-19 L 42,-20",void 0,{stroke:"#fef3c7",sw:.9,lc:"round",op:.8}))}
      </g>
    `};return u`
    ${l(0)}<g transform="scale(-1,1)">${l(1)}</g>
    ${a("M 0,-15 C 10,-16 20,-14 26,-8 L 30,-2 L 27,4 C 24,12 14,18 0,18 C -14,18 -24,12 -27,4 L -30,-2 L -26,-8 C -20,-14 -10,-16 0,-15 Z","#dc2626")}
    ${a("M 0,-11 C 9,-12 17,-10 22,-5 L 24,0 C 22,8 12,13 0,13 C -12,13 -22,8 -24,0 L -22,-5 C -17,-10 -9,-12 0,-11 Z","#ef4444",.55)}
    ${e==="cartoon"?"":u`
          ${n("M -14,-6 Q 0,-13 14,-6 M -16,2 Q 0,-4 16,2 M 0,-12 L 0,12",.9,"#7f1d1d",.4)}
          ${e==="flat"?[[-9,3,1.6],[9,4,1.6],[0,8,1.4],[6,-5,1.2],[-7,-4,1.2]].map(([c,h,f])=>_(d(b(c,h,f),"#fca5a5",{op:.85,stroke:"none"}))):""}
        `}
    ${xe(u`${n("M 6,-15 L 7,-21",1.4,"#7c2d12",1)}${s?"":_(d(b(7,-22,2.2),"#0f172a",{stroke:"none"}))}`)}
    ${s?u`${Ue(-7,-23,5)}${Ue(7,-23,5)}${_(d("M -6,8 Q 0,14 6,8",void 0,{stroke:A,sw:1.4,lc:"round"}))}${_(d($(-15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${_(d($(15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}`:""}
    ${e==="realistic"?_(d($(-7,-8,11,2.2),"#ffffff",{op:.3,stroke:"none"})):""}
  `}var mi=(e,t,o)=>({phase:e.walk||0,stride:t?0:e.stride||0,time:o}),qt=(e,t,o,r)=>be(t?0:e.stress||0,o,r,1.5);function _i(e,t){if(!e._ancistrus)return u``;let o=e._ancistrus,r=o.deathProgress||0,i=(1-r).toFixed(2),s=t?1:Number((1+Math.sin(e._ambientTime*1.6)*.07).toFixed(3)),a=R(e),n=B(e);return u`
    <g transform="translate(${o.x}, ${o.y}) rotate(${t?0:(o.heading??0).toFixed(1)}) scale(1.5,${t?-1.5:1.5})">
      <g opacity="${i}">
        ${fi(a,n,s)}
        ${qt(o,t,[0,30,11,38],e._ambientTime)}
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
  `}function gi(e,t){if(!e._shrimp)return u``;let o=e._shrimp,i=(1-(o.deathProgress||0)).toFixed(2),s=o.dir===-1?-1:1;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(${s*1.5}, ${t?-1.5:1.5})" opacity="${i}">
      ${ui(R(e),B(e),mi(o,t,e._ambientTime))}
      ${qt(o,t,[-4,-3,24,8],e._ambientTime)}
    </g>
  `}function $i(e,t){if(!e._crab)return u``;let o=e._crab,r=o.deathProgress||0,i=Math.max(0,Math.min(1,o.hide||0)),s=((1-r)*(1-i*.92)).toFixed(2),a=o.dir===-1?-1:1,n=Number((1.4*(1-i*.6)).toFixed(3)),l=i>.85&&!t?Math.min(1,(i-.85)/.15):0;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(${a*n}, ${t?-n:n})" opacity="${s}">
      ${pi(R(e),B(e),mi(o,t,e._ambientTime))}
      ${qt(o,t,[0,2,21,11],e._ambientTime)}
    </g>
    ${l>0?u`
          <g transform="translate(${o.x}, ${(o.y-22*n).toFixed(1)})" opacity="${l.toFixed(2)}">
            <circle cx="-6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="-5.4" cy="0.4" r="1.9" fill="#0f172a" />
            <circle cx="6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="6.6" cy="0.4" r="1.9" fill="#0f172a" />
          </g>
        `:""}
  `}function yi(e){return u`
    <g>
      ${e._flowBubbles.filter(t=>t.active).map(t=>u`<circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="${t.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`)}
    </g>
  `}function bi(e){return e._food.length?u`
    <g>
      ${e._food.map(t=>u`<ellipse cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" rx="${t.r.toFixed(1)}" ry="${(t.r*.6).toFixed(1)}" fill="${t.color}" stroke="#b45309" stroke-width="0.6" />`)}
    </g>
  `:u``}function xi(e){if(!e._ripples.length)return u``;let t=Date.now();return u`
    <g>
      ${e._ripples.map(o=>{let r=Math.min(1,(t-o.born)/et),i=(1-r).toFixed(2);return u`
          <circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(14+r*150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5-r*3).toFixed(1)}" stroke-opacity="${i}" />
          ${e._profile.doubleRipple?u`<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(6+r*90).toFixed(1)}" fill="#ffffff" fill-opacity="${(.28*(1-r)).toFixed(2)}" />`:""}
        `})}
    </g>
  `}function wi(e){return u`
    <g>
      ${e.map(t=>u`
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
        `)}
    </g>
  `}function vi(e){return u`
    <g>
      ${e.map(t=>u`
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
        `)}
    </g>
  `}function Mi(e,t){if(!t)return u``;let o=ot(t.total,z(e._hass));return u`
    <g transform="translate(512, 96)" pointer-events="none">
      <text font-family="system-ui, sans-serif" font-size="54" font-weight="800" text-anchor="middle" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${o}</text>
    </g>
  `}function ki(e){return!e._config?.show_fps||!e._fpsInfo?u``:u`
    <g pointer-events="none">
      <rect x="292" y="6" width="440" height="30" rx="8" fill="#000000" fill-opacity="0.72" />
      <text x="512" y="27" font-family="monospace" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${e._fpsInfo}</text>
    </g>
  `}function Si(e,t,o){if(!t)return u``;let r=o?112:24+(e._config?.show_fps?38:0),i=X(z(e._hass),"label_sensor_unavailable");return u`
    <g transform="translate(0, ${r})" pointer-events="none">
      <rect x="362" y="0" width="300" height="34" rx="17" fill="#000000" fill-opacity="0.72" />
      <path d="M383 25 L393 8 L403 25 Z" fill="#f59e0b" />
      <rect x="392" y="13" width="2" height="7" fill="#0f172a" />
      <circle cx="393" cy="22.4" r="1.3" fill="#0f172a" />
      <text x="416" y="23" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${i}</text>
    </g>
  `}function Ci(e,t){if(!e)return u``;let o=Math.max(260,e.length*22+70);return u`
    <g transform="translate(512, ${Math.round(t/2)})" pointer-events="none">
      <rect x="${-o/2}" y="-30" width="${o}" height="60" rx="30" fill="#000000" fill-opacity="0.72" />
      <text y="9" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">${e}</text>
    </g>
  `}function Os(e,t,o,r){let i=e==="cartoon",s=(l,c,h)=>U(e,t,l,c,{...i?{}:{stroke:"#a16207",sw:.7},...h===void 0?{}:{op:h}}),a=(l,c,h,f)=>_(d(l,void 0,{stroke:h,sw:c,op:f,lc:"round"}));return u`
    ${s("M -34,-1 C -40,-7 -47,-7 -49,-1 C -47,5 -40,6 -34,-1 Z","#fde68a")}
    ${s("M -28,-5 C -24,-13 -14,-15 -8,-11 L -10,-6 Z","#fde047",.9)}
    <g transform="rotate(${o.toFixed(2)} 2 -10)">
      ${s("M -6,-10 C -3,-26 8,-30 13,-23 C 12,-17 9,-12 7,-10 Z","#fde047",.95)}
      ${i?"":a("M -3,-13 C 0,-24 6,-27 11,-22",1.1,"#38bdf8",.8)}
    </g>
    ${s("M -34,-1 C -26,-6 -12,-11 6,-12 C 16,-12.5 26,-10 31,-5 C 34,-2 33,1 29,3 C 22,5.5 6,6 -10,4.5 C -24,3 -32,2 -34,-1 Z","#fde047")}
    ${_(d($(4,3,26,3.4),"#fef9c3",{op:.8,stroke:"none"}))}
    ${i?"":a("M -14,-9 L -15,4 M -2,-11 L -3,5 M 10,-11 L 9,5",2.4,"#fffbeb",.55)}
    ${i?"":[[22,-2,1.1],[17,-6,1],[26,-6,.9]].map(([l,c,h])=>_(d(b(l,c,h),"#38bdf8",{stroke:"none"})))}
    ${s("M 15,0 C 22,4 21,11 14,11 C 12,6 12,2 15,0 Z","#fde68a",.9)}
    ${a("M 17,-8 Q 13,-2 16,4",1+r*.3,"#a16207",.35)}
    ${i?u`
          ${_(d(b(25,-11,6),"#ffffff",{stroke:A,sw:1.3}))}
          ${_(d(b(26,-10.4,3.5),"#111827",{stroke:"none"}))}
          ${_(d(b(27.8,-12.6,1.4),"#ffffff",{stroke:"none"}))}
          ${_(d($(22,0,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
          ${a("M 32,0 Q 28,3.5 24,2",1.3,A,1)}
        `:u`
          ${_(d(b(25,-10,3.4),e==="realistic"?"#fef3c7":"#fffbeb",{stroke:"#111827",sw:.7,op:1}))}
          ${_(d(b(25.6,-10,1.8),"#0f172a",{stroke:"none"}))}
          ${_(d(b(24.6,-11,.6),"#ffffff",{stroke:"none"}))}
          ${a("M 33,0 Q 29,2 26,1",.9,"#a16207",.8)}
        `}
    ${e==="realistic"?_(d($(6,-8,14,1.6),"#ffffff",{op:.32,stroke:"none"})):""}
    ${e==="flat"?a("M -20,-6 Q -8,-9 4,-8",.8,"#a16207",.3):""}
  `}function Ps(e,t){return u`
    ${U(e,t,$(-44,4,20,7),"#d8b45f",{...e==="cartoon"?{}:{stroke:"#a16207",sw:.7},op:.95})}
    ${_(d($(-42,2.4,11,3.6),"#5b4423",{stroke:"none"}))}
  `}var Vt={slide:44,sink:38,sandLine:5};function Ai(e,t){if(!e._goby)return u``;let o=e._goby,i=(1-(o.deathProgress||0)).toFixed(2),s=t?0:Math.sin(e._ambientTime*1.4)*3,a=t?0:Math.sin(e._ambientTime*2.6),n=R(e),l=B(e),c=Math.max(0,Math.min(1,o.hide||0)),h=o.y+Vt.sandLine*1.3;return u`
    <g transform="translate(${o.x}, ${o.y}) scale(1.3, 1.3)">${Ps(n,l)}</g>
    ${c>0?u`<clipPath id="goby-sand"><rect x="-100" y="-100" width="2300" height="${(h+100).toFixed(1)}" /></clipPath>`:""}
    <g clip-path="${c>0?"url(#goby-sand)":"none"}">
      <g transform="translate(${o.x}, ${o.y}) scale(1.3, ${t?-1.3:1.3})" opacity="${i}">
        <g transform="translate(${(-c*Vt.slide).toFixed(1)}, ${(c*Vt.sink).toFixed(1)})">
          ${Os(n,l,s,a)}
          ${be(t?0:o.stress||0,[0,-3,27,6],e._ambientTime,1.5)}
        </g>
      </g>
    </g>
  `}var j="#0f172a",we="system-ui, sans-serif",se=62,Fi=30,Ri=92,fe=9,Bs=38,Ti=114,zt=12,Gt=Fi+Ri-1+zt,Zt=992,at=170,Y=62,Ei=10,Qt=270,lt=135,Is=102;function Ns(e,t,o){let r=s=>Ti-s*(Ti-Bs),i=r(t.tempFraction);return u`
    <g pointer-events="none">
      <rect x="${se-fe}" y="${Fi}" width="${fe*2}" height="${Ri}" rx="${fe}" fill="#ffffff" fill-opacity="0.9" stroke="${j}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${se}" cy="${Gt}" r="${zt}" fill="#ffffff" fill-opacity="0.9" stroke="${j}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${se}" cy="${Gt}" r="${zt-3.5}" fill="${t.tempColor}" />
      <rect x="${se-4.5}" y="${i}" width="9" height="${Gt-i}" fill="${t.tempColor}" />
      ${t.ticks.map(s=>u`<line x1="${se-fe}" y1="${r(s)}" x2="${se-fe-8}" y2="${r(s)}" stroke="${j}" stroke-opacity="0.45" stroke-width="2" />`)}
      ${t.marks.map(s=>u`<line x1="${se+fe}" y1="${r(s.fraction)}" x2="${se+fe+12}" y2="${r(s.fraction)}" stroke="${s.color}" stroke-width="3.5" stroke-linecap="round" />`)}
      <text x="106" y="96" font-family="${we}" font-size="54" font-weight="800" fill="${j}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${P(e,o)}°</text>
    </g>
  `}function Us(e,t,o,r,i){let s=o?u`<tspan dx="12" font-size="30" font-weight="700">/ ${Be(t,i)}</tspan><tspan dx="6" font-size="28" font-weight="800">L</tspan>`:u`<tspan dx="6" font-size="28" font-weight="800">L</tspan>`;return u`
    <g pointer-events="none">
      <text x="${Zt}" y="86" text-anchor="end" font-family="${we}" font-size="58" font-weight="800" fill="${j}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${P(e,i)}${s}</text>
      <rect x="${Zt-at}" y="104" width="${at}" height="9" rx="4.5" fill="${j}" fill-opacity="0.18" />
      <rect x="${Zt-at}" y="104" width="${(r.volFraction*at).toFixed(1)}" height="9" rx="4.5" fill="${r.volColor}" />
    </g>
  `}function Li(e,t,o,r,i=[]){let s=2*Math.PI*Y,a=Qt/360*s,n=(lt+t*Qt)*Math.PI/180,l=Y*Math.cos(n),c=Y*Math.sin(n);return u`
    <g transform="translate(${e}, ${Is})" pointer-events="none">
      <circle r="${Y+26}" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
      <circle r="${Y}" fill="none" stroke="rgba(15, 23, 42, 0.15)" stroke-width="${Ei}" stroke-linecap="round" stroke-dasharray="${a.toFixed(1)} ${s.toFixed(1)}" transform="rotate(${lt})" />
      <circle r="${Y}" fill="none" stroke="${o}" stroke-width="${Ei}" stroke-linecap="round" stroke-dasharray="${(t*a).toFixed(1)} ${s.toFixed(1)}" transform="rotate(${lt})" />
      ${i.map(h=>{let f=(lt+h.fraction*Qt)*Math.PI/180,[p,m]=[Math.cos(f),Math.sin(f)];return u`<line x1="${((Y+8)*p).toFixed(1)}" y1="${((Y+8)*m).toFixed(1)}" x2="${((Y+18)*p).toFixed(1)}" y2="${((Y+18)*m).toFixed(1)}" stroke="${h.color}" stroke-width="3.5" stroke-linecap="round" />`})}
      <circle cx="${l.toFixed(1)}" cy="${c.toFixed(1)}" r="8" fill="#ffffff" stroke="${o}" stroke-width="4" />
      ${r}
    </g>
  `}function Oi({style:e,currentTemp:t,currentVolume:o,targetBudget:r,comfortMin:i,deadlyTemp:s,boilTemp:a,showBudget:n,forceTemp:l=!1,lang:c}){let h=Lo({currentTemp:t,currentVolume:o,targetBudget:r,comfortMin:i,deadlyTemp:s,boilTemp:a}),f=t>0||l;if(e!=="arc")return u`
      ${f?Ns(t,h,c):""}
      ${Us(o,r,n,h,c)}
    `;let p=u`<text y="13" font-family="${we}" font-size="34" font-weight="800" fill="${j}" text-anchor="middle">${P(t,c)}°</text>`,m=n?u`
        <text y="4" font-family="${we}" font-size="34" font-weight="800" fill="${j}" text-anchor="middle">${P(o,c)}</text>
        <text y="30" font-family="${we}" font-size="20" font-weight="700" fill="${j}" text-anchor="middle">/ ${Be(r,c)} L</text>
      `:u`<text y="13" font-family="${we}" font-size="34" font-weight="800" fill="${j}" text-anchor="middle">${P(o,c)}<tspan dx="3" font-size="20" font-weight="800">L</tspan></text>`;return u`
    ${f?Li(102,h.tempFraction,h.tempColor,p,h.marks):""}
    ${Li(922,h.volFraction,h.volColor,m)}
  `}function Pi({isFullscreen:e,canvasH:t,canvasBottom:o,waterColorStart:r,waterColorEnd:i,isBoiling:s}){return u`
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
        ${e?u`<rect x="0" y="0" width="1024" height="${t}" />`:u`<rect x="12" y="14" width="1000" height="${o-14}" rx="18" ry="18" />`}
      </clipPath>
    </defs>
  `}function Bi({isFullscreen:e,canvasH:t,canvasBottom:o,tankBottom:r,theme:i}){return u`
    <rect
      x="${e?0:12}"
      y="${e?0:14}"
      width="${e?1024:1e3}"
      height="${e?t:o-14}"
      fill="${i.background}"
    />

    <path
      d="M ${e?0:12} ${r-60} Q 280 ${r-85}, 512 ${r-55} T ${e?1024:1012} ${r-60} L ${e?1024:1012} ${r} L ${e?0:12} ${r} Z"
      fill="${i.sandColor}"
    />
  `}function Ii(e,t){return e?u``:u`
    <rect x="12" y="14" width="1000" height="${t-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
    <rect x="4" y="${t}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
  `}var Ni=["turret","ramshorn","round"],Ds={turret:"#a8a29e",ramshorn:"#dc2626",round:"#d97706"},Ui="M -9,-0.5 C -9,-4 -6,-8 -3,-12 C 0,-8 2,-4 1.5,-0.5 Z",Hs="M -2.5,-4.5 a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0 a 3,3 0 0 1 6,0 a 4,4 0 0 1 -8,0";function qs(e,t,o,r){let i=o==="cartoon"?{stroke:A,sw:.5}:{},s=c=>o==="realistic"&&r?u`<path d="${c}" fill="url(#shade)" />`:"",a=(c,h,f)=>o==="cartoon"?"":_(d(c,void 0,{stroke:h,sw:.5,op:f,lc:"round"})),n=o==="realistic"?"#000000":"#ffffff",l=o==="realistic"?.28:.5;return e==="turret"?u`
      ${_(d(Ui,t,i))}
      ${s(Ui)}
      ${a("M -8.4,-3 Q -3.5,-1.2 1.2,-3 M -7.4,-6 Q -3.3,-4.4 0.2,-6 M -6,-9 Q -3.2,-7.8 -0.8,-9",n,l)}
    `:e==="ramshorn"?u`
      ${_(d(b(-2.5,-4.5,5),t,i))}
      ${s(b(-2.5,-4.5,5))}
      ${a(Hs,n,l+.15)}
    `:u`
    ${_(d(b(-3,-4,5.5),t,i))}
    ${s(b(-3,-4,5.5))}
    <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
    ${o==="flat"?a("M -6.5,-4 A 3.5,3.5 0 1 1 -3,-0.5 M -5,-4 A 2,2 0 1 1 -3,-2","#ffffff",.5):""}
    ${o==="realistic"?a("M -7,-4 A 4,4 0 1 1 -3,0 M -5.4,-4 A 2.4,2.4 0 1 1 -3,-1.6","#000000",.28):""}
  `}function Vs(e,t,o,r,i){let s=o==="cartoon"?{stroke:A,sw:.5}:{},a=Ds[i];return u`
    ${qs(i,e.color||"#854d0e",o,r)}
    ${t?"":u`
          ${_(d($(2,-1.5,5,2.2),a,s))}
          ${o==="realistic"&&r?u`<path d="${$(2,-1.5,5,2.2)}" fill="url(#shade)" />`:""}
          <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="${a}" stroke-width="0.8" />
          ${o==="cartoon"?u`${_(d(b(7.5,-5.7,1.5),"#ffffff",{stroke:A,sw:.5}))}${_(d(b(7.8,-5.6,.8),"#111827",{stroke:"none"}))}`:u`<circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />`}
        `}
  `}function Di(e,t,o,r,i){return u`
    <g>
      ${e.map((s,a)=>{let n=s.type==="glass_left"?90:s.type==="glass_right"?-90:0,l=t==="saltwater"?a%2===0?3.5:4.2:1.8;return u`
          <g transform="translate(${s.x}, ${s.y}) rotate(${o?0:n}) scale(${s.dir*l},${l})">
            ${Vs(s,o,r,i,Ni[a%Ni.length])}
          </g>
        `})}
    </g>
  `}function Hi(e,t){let{isFullscreen:o,canvasH:r,canvasBottom:i,ariaLabel:s,aspectWidth:a,aspectHeight:n,themeKey:l,theme:c,waterColorStart:h,waterColorEnd:f,isBoiling:p,isDead:m,waterRatio:g,waterSurfaceY:x,tankBottom:v,effectiveAlgaeHours:w,showReadings:S,forceTemp:M,displayedTemp:k,currentVolume:F,targetBudget:L,comfortMin:O,deadlyTemp:K,boilTemp:D,gaugeStyle:q,showBudget:J,cost:ee,lang:te,sensorLost:Me,biotopeNotice:ht,showGauges:ke,showCostLabel:Ze}=t;return N`
    <svg
      role="img"
      aria-label="${s}"
      @click=${V=>e._onTankTap(V)}
      @pointerdown=${V=>e._onSwipeStart(V)}
      @pointerup=${V=>e._onSwipeEnd(V)}
      @pointercancel=${()=>e._onSwipeCancel()}
      viewBox="0 0 1024 ${r}"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="${e._profile.antialias?"auto":"optimizeSpeed"}"
      style="${o?"width: 100%; height: 100%;":`aspect-ratio: ${a} /${n};`}"
    >
      ${Pi({isFullscreen:o,canvasH:r,canvasBottom:i,waterColorStart:h,waterColorEnd:f,isBoiling:p})}

      <g clip-path="url(#innerTankClip)">
        ${Bi({isFullscreen:o,canvasH:r,canvasBottom:i,tankBottom:v,theme:c})}

        ${e._renderThemeDecoration(l,o,e._deathProgress)}

        ${Di(e._snails,l,m,R(e),B(e))}

        ${g>0?u`
              <g>
                <rect
                  x="${o?0:12}"
                  y="${x-5}"
                  width="${o?1024:1e3}"
                  height="${v-x+5}"
                  fill="url(#waterGrad)"
                />
                ${e._renderWaterSurface(o?0:12,o?1024:1012,x)}
              </g>
            `:""}

        ${g>0&&!m?wi(e._bubbles):""}

        ${g>0&&!m?e._renderFlowBubbles():""}
        ${e._renderFood()}

        ${p&&g>0?vi(e._boilingBubbles):""}

        <g>
          ${(e._fishes||[]).map(V=>u`
              <g transform="translate(${V.x},${V.y})">
                ${e._renderFishShape(V,l,m)}
              </g>
            `)}
        </g>

        ${l==="freshwater"?e._renderAncistrus(m):""}
        ${l==="saltwater"?e._renderCrab(m):""}
        ${l==="saltwater"?e._renderShrimp(m):""}
        ${l==="saltwater"?e._renderGoby(m):""}
        ${e._renderAlgae(w,o)}
        ${e._renderRipples()}

        <!-- Modern Frosted Glass HUD Gauges -->
        ${ke&&S?Oi({style:q,currentTemp:k,currentVolume:F,targetBudget:L,comfortMin:O,deadlyTemp:K,boilTemp:D,showBudget:J,forceTemp:M,lang:te}):""}
        ${Ze&&S?e._renderCostLabel(ee):""}

        ${Ci(ht,r)}
        ${e._renderFpsBadge()}
        ${Si(e,Me,ke&&S)}
      </g>

      ${Ii(o,i)}
    </svg>
  `}function qi(e){let{currentVolume:t,displayedRemaining:o,targetBudget:r,currentTemp:i,tempTileColor:s,cost:a,lang:n,t:l}=e;return N`
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-value">${P(t,n)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_consumed")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${P(o,n)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_remaining")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${Be(r,n)} <span class="metric-unit">L</span></div>
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
              <div class="metric-value">${ot(a.total,n)}</div>
              <div class="metric-label">${l("label_cost")}</div>
            </div>
          `:""}
    </div>
  `}function Yt(e=()=>Math.random()){return{snails:[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],ancistrus:{x:70,y:340,targetX:70,targetY:340,heading:0,state:"idle",idleUntil:0,deathProgress:0},shrimp:{x:650,y:550,targetX:650,state:"idle",idleUntil:0,dir:-1,deathProgress:0},crab:{x:(I.ledgeFrom+I.ledgeTo)/2,y:565-(I.ledge+30),targetX:(I.ledgeFrom+I.ledgeTo)/2,s:st,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},goby:{x:530,y:551,targetX:530,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},bubbles:[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],boilingBubbles:Array.from({length:24},()=>({x:10+e()*1004,y:30+e()*540,vy:2.5+e()*3.5,vx:(e()-.5)*1.5,r:4+e()*8})),flowBubbles:Array.from({length:36},()=>({active:!1,x:512,baseX:512,y:0,vy:2,r:3,phase:0}))}}var Gs=4500,Zs=6e3,ct={keep:.96,minX:30,maxX:994},Qs=16.66,Vi=3500;function ve(e,t,o=1){e.stressUntil=t+Vi,e.stressPower=Math.max(0,Math.min(1,o))}function Ve(e,t){let o=(e.stressUntil??0)-t;return e.stress=o<=0?0:Math.min(1,o/Vi)*(e.stressPower??1),e.stress}var jt={rate:.25,maxStep:.9,ease:.15};function Gi(e,t,o,r){e.walk=(e.walk??0)+Math.min(jt.maxStep,Math.abs(t)*jt.rate);let i=e.stride??0;e.stride=i+((o?1:0)-i)*Math.min(1,jt.ease*r)}function Zi({timestamp:e,deltaMs:t,delta:o,nowMs:r,animTime:i,tank:s,userSpeed:a,themeKey:n}){let{tankTop:l,tankBottom:c,waterSurfaceY:h,waterRatio:f,isDead:p,isBoiling:m,speedMultiplier:g}=s;return{timestamp:e,deltaMs:t,delta:o,nowMs:r,animTime:i,userSpeed:a,themeKey:n,tankTop:l,tankBottom:c,waterSurfaceY:h,waterRatio:f,isDead:p,isBoiling:m,speedMultiplier:g,deathStep:(t||Qs)/Gs}}function Qi(e,t,o){return t?Math.min(1,(e||0)+o):0}function zi(e,t,o){let r=e+(t-e)*Math.min(1,.03*o);return r<.005&&t===0?0:r}function Yi(e,t){return e.filter(o=>t-o.born<et)}function ji(e,t){let{isDead:o,waterRatio:r,delta:i,animTime:s,waterSurfaceY:a,tankBottom:n,nowMs:l}=t;return o||r<=0?{food:[],changed:!1}:e.length===0?{food:e,changed:!1}:(e.forEach(c=>{if(c.landedAt)return;c.y+=c.vy*i;let h=c.vx??0,f=Math.pow(ct.keep,i);c.x+=h*(1-f)/(1-ct.keep)+Math.sin(s*1.5+c.phase)*.25*i,c.vx=h*f,c.x=Math.min(ct.maxX,Math.max(ct.minX,c.x)),c.y<a&&(c.y=a),c.y>=n-30&&(c.y=n-30,c.landedAt=l)}),{food:e.filter(c=>!c.eaten&&!(c.landedAt&&l-c.landedAt>Zs)),changed:!0})}function Wi(e,t,o,r,i=Math.random){let{waterRatio:s,isDead:a,tankBottom:n,waterSurfaceY:l,delta:c,animTime:h}=t,f=s>0&&!a?Bo(o,r):0,p=!1;return e.forEach((m,g)=>{if(!m.active){g<f&&(m.active=!0,m.baseX=512+(i()-.5)*90,m.x=m.baseX,m.y=n-10-i()*40,m.vy=1.8+i()*2.2+o*1.2,m.r=2+i()*4,m.phase=i()*Math.PI*2);return}m.y-=m.vy*c,m.x=m.baseX+Math.sin(h*2+m.phase)*6,(m.y<l+2||a)&&(m.active=!1),p=!0}),p}function Xi(e,t){let{waterRatio:o,isDead:r,delta:i,waterSurfaceY:s,tankBottom:a}=t;return!(o>0&&!r)||e.length===0?!1:(e.forEach(n=>{n.y-=n.vy*i,n.y<s&&(n.y=a-15)}),!0)}function Ki(e,t,o=Math.random){let{isBoiling:r,waterRatio:i,delta:s,waterSurfaceY:a,tankBottom:n}=t;return!(r&&i>0)||e.length===0?!1:(e.forEach(l=>{l.y-=l.vy*s,l.x+=l.vx*s,l.y<a&&(l.y=n-15,l.x=10+o()*1004)}),!0)}function Ji(e,t){let{tankBottom:o,tankTop:r,waterSurfaceY:i,themeKey:s}=t,a=s==="saltwater"&&e.species===0;return{minX:a?160:110,maxX:a?380:910,minY:a?Math.max(r+45,i+35,o-160):Math.max(r+45,i+35),maxY:o-45}}var De={rx:25,ry:16,factor:.85,push:1.4};function er(e,t){if(t.isDead)return!1;let o=!1;for(let r=0;r<e.length;r++)for(let i=r+1;i<e.length;i++){let s=e[r],a=e[i],n=(s.scale||1.4)+(a.scale||1.4),l=s.x-a.x,c=s.y-a.y,h=Math.hypot(l/(De.rx*De.factor*n),c/(De.ry*De.factor*n));if(h>=1)continue;let f=Math.hypot(l,c),[p,m]=f<1e-6?[1,0]:[l/f,c/f],g=(1-h)*De.push*t.delta;s.x+=p*g,s.y+=m*g,a.x-=p*g,a.y-=m*g,o=!0}if(o)for(let r of e){let{minX:i,maxX:s,minY:a,maxY:n}=Ji(r,t);r.x=Math.min(s,Math.max(i,r.x)),r.y=Math.min(n,Math.max(a,r.y))}return o}function tr(e,t,o){let{isDead:r,deathStep:i,tankBottom:s,delta:a,speedMultiplier:n}=t;if(r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.y=Math.min(s-30,e.y+1.2*a);return}e.deathProgress=0,Ve(e,t.nowMs);let l=(e.scare??0)>.05?null:Uo(e.x,e.y,o);l?(e._baseVy===void 0&&(e._baseVy=e.vy),Math.abs(l.x-e.x)>6&&(e.dir=l.x<e.x?-1:1),e.vy=Math.max(-1.1,Math.min(1.1,(l.y-e.y)*.02)),e._seeking=!0):e._seeking&&(e._baseVy!==void 0&&(e.vy=e._baseVy),e._seeking=!1);let c=l?1.8:1,{minX:h,maxX:f,minY:p,maxY:m}=Ji(e,t);e.x+=e.vx*e.dir*n*c*a,e.y+=e.vy*n*a;let g=e.kickX??0,x=e.kickY??0;if(g||x){e.x+=g*a,e.y+=x*a;let v=Math.pow(.93,a);e.kickX=g*v,e.kickY=x*v;let w=Math.hypot(e.kickX,e.kickY);e.scare=Math.min(1,w/8),w<.15&&(e.kickX=0,e.kickY=0,e.scare=0)}if(o.length>0){let v=e.x+e.dir*22*(e.scale||1.4);o.forEach(w=>{!w.eaten&&Math.hypot(w.x-v,w.y-e.y)<28&&(w.eaten=!0)})}e.x<h?(e.x=h,e.dir=1):e.x>f&&(e.x=f,e.dir=-1),e.y<p?(e.y=p,e.vy=Math.abs(e.vy)):e.y>m&&(e.y=m,e.vy=-Math.abs(e.vy))}var zs=.2;function or(e,t){let{isDead:o,tankBottom:r,tankTop:i,waterSurfaceY:s,delta:a}=t;if(o){e.y=Math.min(r-10,e.y+1.5*a);return}if(e.type==="bottom")e.y=r-10,e.x+=e.vx*e.dir*a,e.x<100?(e.x=100,e.dir=1):e.x>920&&(e.x=920,e.dir=-1);else if(e.type==="glass_left"||e.type==="glass_right"){let n=Math.max(i+35,s+25);if(e.y<n){e.vy=Math.abs(e.vy),e.y=Math.min(n,e.y+Math.max(e.vy,zs)*a);return}e.y+=e.vy*a,e.y<n?(e.y=n,e.vy=Math.abs(e.vy)):e.y>r-25&&(e.y=r-25,e.vy=-Math.abs(e.vy))}}var Z={durationMs:1800,radius:520,ancistrusFactor:7,crawlerFactor:6,ancistrusTurn:6},He={speed:.8,turn:3,minTrip:140,maxTrip:420},Ys=(e,t)=>((t-e)%360+540)%360-180,js=1.5,Ws=[[0,-21],[13,-19],[-13,-19],[15,0],[-15,0],[34,32],[-34,32],[19,55],[-19,55],[9,72],[-9,72]],Xs=[[9,89],[-9,89],[0,84]],dt={surfaceMargin:6,tailOut:16,floorMargin:4,rescue:12};function ir(e,t){let o=e*Math.PI/180,[r,i]=[Math.sin(o),Math.cos(o)],s=([h,f])=>js*(h*r+f*i),a=Ws.map(s),n=Xs.map(s),l=Math.max(t.waterSurfaceY+dt.surfaceMargin-Math.min(...a),t.waterSurfaceY-dt.tailOut-Math.min(...n)),c=t.tankBottom-dt.floorMargin-Math.max(...a,...n);return{minY:l,maxY:c}}function rr(e,t,o,r,i){let[s,a]=[90,934],n=i?Math.hypot(e.x-i.x,e.y-i.y):0,l=null;for(let c of[0,40,-40,80,-80,120,-120,160,180]){let h=o+c*Math.PI/180,f=Math.min(a,Math.max(s,e.x+Math.sin(h)*r)),p=e.y-Math.cos(h)*r,m=!0;for(let v=0;v<4&&m;v++){let w=Math.atan2(f-e.x,-(p-e.y))*180/Math.PI,S=ir(w,t);S.minY>S.maxY?m=!1:p=Math.min(S.maxY,Math.max(S.minY,p))}if(!m)continue;let g=Math.hypot(f-e.x,p-e.y);if(g<60)continue;let x=i?Math.hypot(f-i.x,p-i.y)-n+g*.5-Math.abs(c)*.5:-Math.abs(g-r)-Math.abs(c)*.3;(!l||x>l.score)&&(l={x:f,y:p,score:x})}return l}function sr(e,t,o,r,i,s=Math.random){let a=e.x-t,n=e.y-o,l=Math.hypot(a,n);if(l>Z.radius)return!1;let c=l<1?s()*2*Math.PI:Math.atan2(a,-n),h=300+200*(1-l/Z.radius),f=rr(e,i,c,h,{x:t,y:o});return f?(e.targetX=f.x,e.targetY=f.y):(e.targetX=e.x,e.targetY=e.y),e.state="moving",e.fleeUntil=r+Z.durationMs,!0}function nr(e,t,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,waterSurfaceY:a,delta:n,timestamp:l,userSpeed:c,nowMs:h}=t,f=(e.fleeUntil??0)>h;if(r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.y=Math.min(s-35,e.y+1.2*n);return}e.deathProgress=0,Ve(e,h),e.heading=e.heading??0;let p={tankBottom:s,waterSurfaceY:a};if(e.idleUntil||(e.idleUntil=l+1e3+o()*2e3),e.state==="moving"){let x=e.targetX-e.x,v=e.targetY-e.y,w=Math.hypot(x,v),S=Math.atan2(x,-v)*180/Math.PI,M=(f?Z.ancistrusTurn:He.turn)*n;e.heading+=Math.max(-M,Math.min(M,Ys(e.heading,S)));let k=Math.min(w,He.speed*c*(f?Z.ancistrusFactor:1)*n);e.x+=x/(w||1)*k,e.y+=v/(w||1)*k,Math.hypot(e.targetX-e.x,e.targetY-e.y)<1.5&&(e.state="idle",e.idleUntil=l+(f?2500:1200)+o()*2e3)}else if(l>=e.idleUntil){let x=o()*2*Math.PI,v=He.minTrip+o()*(He.maxTrip-He.minTrip),w=rr(e,p,x,v);w?(e.state="moving",e.targetX=w.x,e.targetY=w.y):e.idleUntil=l+1500}let m=ir(e.heading,p),g=m.minY>m.maxY?(m.minY+m.maxY)/2:Math.min(m.maxY,Math.max(m.minY,e.y));g!==e.y&&(e.y+=Math.sign(g-e.y)*Math.min(Math.abs(g-e.y),dt.rescue*n))}function ar(e,t,o,r,i){if(Math.hypot(e.x-t,e.y-o)>Z.radius)return!1;let s=i.fleeMinX??i.minX,a=i.fleeMaxX??i.maxX,n=e.x===t?e.dir||1:Math.sign(e.x-t),l=n>0?a:s;return Math.abs(l-e.x)<8&&(l=n>0?s:a),e.targetX=l,e.state="moving",e.fleeUntil=r+Z.durationMs,!0}var Xt={minX:560,maxX:740,fleeMinX:470,fleeMaxX:770,floorOffset:25,speed:.9,firstIdle:[1200,2e3],nextIdle:[1500,2500]};function lr(e,t,o,r=Math.random){let{isDead:i,deathStep:s,tankBottom:a,delta:n,timestamp:l,userSpeed:c,nowMs:h}=t,f=(e.fleeUntil??0)>h;if(i){e.deathProgress=Math.min(1,(e.deathProgress||0)+s);return}e.deathProgress=0,Ve(e,h),e.y=a-o.floorOffset;let p=0;if(e.idleUntil||(e.idleUntil=l+o.firstIdle[0]+r()*o.firstIdle[1]),e.state==="moving"){let m=e.targetX-e.x;e.dir=m<0?-1:1;let g=Math.sign(m)*Math.min(Math.abs(m),o.speed*c*(f?Z.crawlerFactor:1)*n);e.x+=g,p=g,Math.abs(e.targetX-e.x)<1.5&&(e.state="idle",e.idleUntil=l+o.nextIdle[0]+r()*o.nextIdle[1])}else l>=e.idleUntil&&(e.state="moving",e.targetX=o.minX+r()*(o.maxX-o.minX));Gi(e,p,e.state==="moving",n)}var H={speed:.9,hideStep:.03,idle:[1500,2500],hidden:[4e3,4e3],fleeHidden:[6e3,3e3],firstIdle:[1500,2e3],caveChance:.4};function qe(e){return typeof e.s=="number"||(e.s=st),e.s}function Wt(e,t){let{x:o,h:r}=it(qe(e)),i=o-e.x;return e.x=o,e.y=t-(r+30),i}function Ks(e,t){let o=rt.filter(i=>Math.abs(i-e)>40);if(o.length>0&&t()<H.caveChance)return o[Math.min(o.length-1,Math.floor(t()*o.length))];let r=t()*ye;return Math.abs(r-e)>=40?r:e<ye/2?ye:0}function cr(e,t,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,delta:a,userSpeed:n,nowMs:l}=t,c=(e.fleeUntil??0)>l;if(e.hide=e.hide??0,r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.hide=Math.max(0,e.hide-H.hideStep*a),Wt(e,s);return}e.deathProgress=0,Ve(e,l),Wt(e,s);let h=0;switch(e.idleUntil||(e.idleUntil=l+H.firstIdle[0]+o()*H.firstIdle[1]),e.state){case"moving":{let f=qe(e),p=e.goalS??f,m=Math.sign(p-f)*Math.min(Math.abs(p-f),H.speed*n*(c?Z.crawlerFactor:1)*a);e.s=f+m;let g=Wt(e,s);h=m,Math.abs(g)>.01&&(e.dir=g<0?-1:1),Math.abs(p-e.s)<.5&&(e.s=p,rt.some(v=>Math.abs(v-p)<1)?e.state="hiding":(e.state="idle",e.idleUntil=l+H.idle[0]+o()*H.idle[1]));break}case"hiding":if(e.hide=Math.min(1,e.hide+H.hideStep*(c?2:1)*a),e.hide>=1){e.state="hidden";let[f,p]=c?H.fleeHidden:H.hidden;e.idleUntil=l+f+o()*p}break;case"hidden":l>=e.idleUntil&&(e.state="emerging");break;case"emerging":e.hide=Math.max(0,e.hide-H.hideStep*a),e.hide<=0&&(e.state="idle",e.idleUntil=l+600+o()*800);break;default:l>=e.idleUntil&&(e.state="moving",e.goalS=Ks(qe(e),o))}e.targetX=it(e.goalS??qe(e)).x,Gi(e,h,e.state==="moving",a)}function dr(e,t,o,r){if(Math.hypot(e.x-t,e.y-o)>Z.radius)return!1;let i=qe(e);if(e.fleeUntil=r+4e3,e.state==="hidden"||e.state==="hiding")return e.idleUntil=Math.max(e.idleUntil??0,r+H.fleeHidden[0]),!0;if(e.state==="emerging")return e.state="hiding",!0;let s=[...rt].map(a=>{let n=it(a).x,l=Math.sign(n-e.x)===Math.sign(t-e.x)&&Math.abs(t-e.x)<Math.abs(n-e.x);return{stop:a,cost:Math.abs(a-i)+(l?400:0)}}).sort((a,n)=>a.cost-n.cost);return e.goalS=s[0].stop,e.state=Math.abs(e.goalS-i)<.5?"hiding":"moving",!0}var ue={floorOffset:14,hideStep:.08,emergeStep:.025,hidden:[4e3,3e3]};function hr(e,t,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,delta:a,nowMs:n}=t;if(e.hide=e.hide??0,e.y=s-ue.floorOffset,r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.hide=Math.max(0,e.hide-ue.hideStep*a);return}switch(e.deathProgress=0,Ve(e,n),e.state){case"hiding":e.hide=Math.min(1,e.hide+ue.hideStep*a),e.hide>=1&&(e.state="hidden",e.idleUntil=n+ue.hidden[0]+o()*ue.hidden[1]);break;case"hidden":n>=e.idleUntil&&(e.state="emerging");break;case"emerging":e.hide=Math.max(0,e.hide-ue.emergeStep*a),e.hide<=0&&(e.state="idle");break;default:break}}function fr(e,t,o,r){return Math.hypot(e.x-t,e.y-o)>Z.radius?!1:(e.state==="hidden"?e.idleUntil=Math.max(e.idleUntil??0,r+ue.hidden[0]):e.state!=="hiding"&&(e.state="hiding"),!0)}var pe=()=>Math.random(),Kt=class extends Q{static get properties(){return{_hass:{type:Object,hasChanged:()=>!1},preview:{type:Boolean},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_goby:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array},_flowBubbles:{type:Array},_food:{type:Array},_ripples:{type:Array},_fpsInfo:{type:String},_announcement:{type:String},_biotopeNotice:{type:String}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(t,o,r){let i=Wo(t,o,r),s=i.entity||o.find(l=>l.includes("shower")||l.includes("hydrao"))||o.find(l=>l.startsWith("sensor."))||o[0]||"",a=i.temperature_entity||o.find(l=>l.includes("temperature")&&(l.includes("shower")||l.includes("hydrao")))||"",n=y;return{entity:s,temperature_entity:a,...i.comfort_temp_entity?{comfort_temp_entity:i.comfort_temp_entity}:{},...i.target_budget_entity?{target_budget_entity:i.target_budget_entity}:{},title:n.title,theme:n.theme,aspect_ratio_width:n.aspect_ratio_width,aspect_ratio_height:n.aspect_ratio_height,fish_count:n.fish_count,target_budget:n.target_budget,survival_volume:n.survival_volume,temp_boiling_threshold:n.temp_boiling_threshold,temp_deadly_threshold:n.temp_deadly_threshold,algae_enabled:n.algae_enabled,algae_delay_hours:n.algae_delay_hours,algae_age:n.algae_age,fish_speed_multiplier:n.fish_speed_multiplier,fullscreen:n.fullscreen}}constructor(){super(),this._animationFrameId=null,this.preview=!1,this._deathProgress=0,this._flow=tt(),this._flowIntensity=0,this._food=[],this._ripples=[],this._fpsInfo="",this._announcement="",this._announceFlip=!1,this._themeOverride=null,this._swipeStart=null,this._swipedAt=0,this._biotopeNotice="",this._noticeTimer=null,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=0,this._config=void 0,this._hass=void 0,this._viewport=null,this._resizeObserver=null,this._energyKwh=0,this._metrics=null,this._sensorLostSince=null,this._sensorTimer=null,this._metricsSignature="",this._onScreen=!0,this._pageVisible=typeof document>"u"||document.visibilityState!=="hidden",this._prefersReducedMotion=!1,this._intersectionObserver=null,this._motionQuery=null,this._onVisibilityChange=()=>{this._pageVisible=document.visibilityState!=="hidden",this._syncAnimation()},this._onMotionPreferenceChange=o=>{this._prefersReducedMotion=!!o.matches,this._syncAnimation()},this._lastTimestamp=0,this._lastFrameTs=0,this._animTime=0,this._ambientTime=0,this._lastAmbientTs=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=y.target_budget,this._cachedSurvivalVolume=y.survival_volume,this._cachedComfortMin=y.comfort_temp_min,this._lastTemperature=0,this._cachedHoursSinceLastShower=0,this._fishes=Ke(4,"freshwater");let t=Yt();this._snails=t.snails,this._ancistrus=t.ancistrus,this._shrimp=t.shrimp,this._crab=t.crab,this._goby=t.goby,this._bubbles=t.bubbles,this._boilingBubbles=t.boilingBubbles,this._flowBubbles=t.flowBubbles}static get styles(){return bo}_t(t){return X(z(this._hass),t)}get _themeKey(){return this._themeOverride||this._config?.theme||"freshwater"}_biotopeStorageKey(){return`shower-aquarium-card:biotope:${this._config?.entity}`}_restoreBiotope(){if(!this._config?.swipe_biotope)return null;try{let t=JSON.parse(window.localStorage.getItem(this._biotopeStorageKey())||"null");if(t&&t.base===this._config.theme&&t.chosen!==t.base&&ge.includes(t.chosen))return t.chosen}catch{}return null}_rememberBiotope(t){if(!this._isEditorPreview())try{window.localStorage.setItem(this._biotopeStorageKey(),JSON.stringify({base:this._config?.theme,chosen:t}))}catch{}}_onSwipeStart(t){this._swipeStart=this._config?.swipe_biotope?{x:t.clientX,y:t.clientY,t:Date.now()}:null}_onSwipeEnd(t){let o=this._swipeStart;if(this._swipeStart=null,!o)return;let r=Co(t.clientX-o.x,t.clientY-o.y,Date.now()-o.t);r!==0&&(this._swipedAt=Date.now(),this._switchBiotope(r))}_onSwipeCancel(){this._swipeStart=null}_switchBiotope(t){if(!this._config)return;let o=So(this._themeKey,t);this._themeOverride=o===this._config.theme?null:o,this._rememberBiotope(o),this._fishes=Ke(this._config.fish_count,o);let r=Yt();this._snails=r.snails,this._ancistrus=r.ancistrus,this._shrimp=r.shrimp,this._crab=r.crab,this._goby=r.goby,this._food=[],this._ripples=[];let i=this._t(`theme_${o}`);this._biotopeNotice=i,this._announce("aria_biotope",{name:i}),this._noticeTimer!==null&&clearTimeout(this._noticeTimer),this._noticeTimer=setTimeout(()=>{this._noticeTimer=null,this._biotopeNotice=""},2e3),this._onDataChanged()}_onBiotopeButton(){this._switchBiotope(1)}_getCanvasHeight(){return To(this._config,this._viewport)}_updateCachedMetrics(){if(!this._hass||!this._config)return!1;let t=Eo(this._hass,this._config,this._metrics);this._metrics=t,this._cachedConsumedVolume=t.consumedVolume,this._cachedHoursSinceLastShower=t.hoursSinceLastShower,this._cachedTemperature=t.temperature,this._cachedTargetBudget=t.targetBudget,this._cachedSurvivalVolume=t.survivalVolume,this._cachedComfortMin=t.comfortMin,t.consumedVolume<=0?this._lastTemperature=0:t.temperature>0&&(this._lastTemperature=t.temperature),this._trackSensor(t.sensorMissing);let o=Zo(t,z(this._hass)),r=o!==this._metricsSignature;return this._metricsSignature=o,r}_trackSensor(t){if(!t){this._sensorLostSince=null,this._clearSensorTimer();return}this._sensorLostSince===null&&(this._sensorLostSince=Date.now()),this._scheduleSensorTimer()}_scheduleSensorTimer(){if(this._sensorTimer!==null||this._sensorLostSince===null||!this.isConnected)return;let t=Math.max(0,Lt-(Date.now()-this._sensorLostSince));this._sensorTimer=setTimeout(()=>{this._sensorTimer=null,this.requestUpdate()},t)}_clearSensorTimer(){this._sensorTimer!==null&&(clearTimeout(this._sensorTimer),this._sensorTimer=null)}get _sensorLost(){return this._sensorLostSince!==null&&Date.now()-this._sensorLostSince>=Lt}setConfig(t){if(!t||typeof t.entity!="string"||!t.entity.trim())throw new Error("Please define a valid entity.");let{config:o,warnings:r}=Ot(Xe(t));r.forEach(i=>console.warn(`[shower-aquarium-card] ${i}`)),this._config={...y,...o},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen"),this._themeOverride=this._restoreBiotope(),this._fishes=Ke(this._config.fish_count,this._themeKey),this._flow=tt(),this._food=[],this._metrics=null,this._lastTemperature=0,this._sensorLostSince=null,this._clearSensorTimer(),this._updateCachedMetrics(),this._syncAnimation(),this.requestUpdate()}set hass(t){this._hass=t;let o=this._updateCachedMetrics();this._trackFlow(),o&&this._onDataChanged()}get _visible(){return this._onScreen&&this._pageVisible}get _motionAllowed(){return Qo(this._prefersReducedMotion,this._config?.respect_reduced_motion)}shouldUpdate(){return this._visible}_onResize(t,o){if(!this._config?.fullscreen)return;let r=this._getCanvasHeight();this._viewport={width:t,height:o},this._getCanvasHeight()!==r&&this._onDataChanged()}_onDataChanged(){this._visible&&!this._motionAllowed&&this._settleScene(),this.requestUpdate()}_settleScene(){let t=this._tankState();if(!t)return;let{isDead:o}=t;this._food=[],this._ripples=[],this._lastTimestamp=0;let r=Yo(o);for(let i=0;i<r;i++)this._updatePhysics(1e3+i*zo);this._lastTimestamp=0}_syncAnimation(){if(!this.isConnected){this._stopAnimation();return}if(this._visible&&this._motionAllowed){this._startAnimation(),this.requestUpdate();return}this._stopAnimation(),this._visible&&(this._settleScene(),this.requestUpdate())}_trackFlow(){if(!this._hass||!this._config)return;let t=this._hass.states?.[this._config.entity]?.state;if(t===void 0||isNaN(parseFloat(t)))return;let o=this._cachedConsumedVolume,r=this._flow.lastVolume,i=this._config.cold_water_temp;r===null||o<r-1e-6?this._energyKwh=Ft(o,this._cachedTemperature,i):o>r+1e-6&&(this._energyKwh+=Ft(o-r,this._cachedTemperature,i)),this._flow=Ro(this._flow,o,Date.now())}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this._pageVisible=document.visibilityState!=="hidden",typeof IntersectionObserver=="function"&&(this._intersectionObserver=new IntersectionObserver(t=>{let o=t[t.length-1];!o||o.isIntersecting===this._onScreen||(this._onScreen=o.isIntersecting,this._syncAnimation())}),this._intersectionObserver.observe(this)),typeof ResizeObserver=="function"&&(this._resizeObserver=new ResizeObserver(t=>{let o=t[t.length-1];o&&this._onResize(o.contentRect.width,o.contentRect.height)}),this._resizeObserver.observe(this)),typeof window.matchMedia=="function"&&(this._motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this._prefersReducedMotion=!!this._motionQuery.matches,this._motionQuery.addEventListener?.("change",this._onMotionPreferenceChange)),this._scheduleSensorTimer(),this._syncAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._clearSensorTimer(),this._noticeTimer!==null&&(clearTimeout(this._noticeTimer),this._noticeTimer=null),document.removeEventListener("visibilitychange",this._onVisibilityChange),this._intersectionObserver?.disconnect(),this._intersectionObserver=null,this._resizeObserver?.disconnect(),this._resizeObserver=null,this._motionQuery?.removeEventListener?.("change",this._onMotionPreferenceChange),this._motionQuery=null,this._stopAnimation()}_sampleFps(t){this._fpsWindowStart||(this._fpsWindowStart=t);let o=t-this._fpsWindowStart;if(o<1e3)return;let r=Math.round(this._rafCount*1e3/o),i=Math.round(this._tickCount*1e3/o),s=this._config?.animation_quality||"max";this._fpsInfo=`v${je} \xB7 ${s} \xB7 display ${r}/s \xB7 drawn ${i}/s`,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=t,this.requestUpdate()}get _profile(){return qo(this._config?.animation_quality)}_startAnimation(){if(!this._animationFrameId){this._lastTimestamp=0,this._lastFrameTs=0,this._fpsWindowStart=0,this._rafCount=0,this._tickCount=0;let t=o=>{this._rafCount++,Vo(o,this._lastFrameTs,this._profile.fps)&&(this._lastFrameTs=o,this._tickCount++,this._updatePhysics(o)),this._config?.show_fps&&this._sampleFps(o),this._animationFrameId=requestAnimationFrame(t)};this._animationFrameId=requestAnimationFrame(t)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(t){let o=this._config;if(!o)return;this._lastTimestamp||(this._lastTimestamp=t);let r=t-this._lastTimestamp,i=this._profile,s=Math.min(r/16.66,Go(i.fps));this._lastTimestamp=t,this._animTime=t*.0035,(!i.ambientHz||t-this._lastAmbientTs>=1e3/i.ambientHz)&&(this._ambientTime=this._animTime,this._lastAmbientTs=t);let a={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},n=Date.now(),l=Zi({timestamp:t,deltaMs:r,delta:s,nowMs:n,animTime:this._animTime,tank:Je({config:o,metrics:a,canvasHeight:this._getCanvasHeight()}),userSpeed:o.fish_speed_multiplier,themeKey:this._themeKey}),{isDead:c}=l,h=!1;this._deathProgress=Qi(this._deathProgress,c,l.deathStep);let f=this._motionAllowed,p=c||!f?0:Oo(this._flow,n);this._flowIntensity=zi(this._flowIntensity,p,s),Po(this._flow,n)&&(this._flow={...this._flow,showerActive:!1}),this._ripples.length>0&&(this._ripples=Yi(this._ripples,n),h=!0);let m=ji(this._food,l);m.food!==this._food&&(this._food=m.food),m.changed&&(h=!0),Wi(this._flowBubbles,l,this._flowIntensity,i.flowBubbles,pe)&&(h=!0),this._flowIntensity>0&&(h=!0),this._fishes&&this._fishes.length>0&&(this._fishes.forEach(g=>tr(g,l,this._food)),er(this._fishes,l),h=!0),this._snails&&this._snails.length>0&&(this._snails.forEach(g=>or(g,l)),h=!0),this._ancistrus&&(nr(this._ancistrus,l,pe),h=!0),this._shrimp&&(lr(this._shrimp,l,Xt,pe),h=!0),this._crab&&(cr(this._crab,l,pe),h=!0),this._goby&&(hr(this._goby,l,pe),h=!0),this._bubbles&&Xi(this._bubbles,l)&&(h=!0),this._boilingBubbles&&Ki(this._boilingBubbles,l,pe)&&(h=!0),h&&this.requestUpdate()}_renderWaterSurface(t,o,r){return ei(this,t,o,r)}_renderThemeDecoration(t,o,r=0){return si(this,t,o,r)}_renderFishShape(t,o,r){return hi(this,t,o,r)}_renderAncistrus(t){return _i(this,t)}_renderShrimp(t){return gi(this,t)}_renderGoby(t){return Ai(this,t)}_renderCrab(t){return $i(this,t)}_renderAlgae(t,o){return ni(this,t,o)}_eventToSvgPoint(t){let o=t.currentTarget,r=o.getScreenCTM?o.getScreenCTM():null;if(!r)return null;let i=o.createSVGPoint();i.x=t.clientX,i.y=t.clientY;let s=i.matrixTransform(r.inverse());return{x:s.x,y:s.y}}_isEditorPreview(){if(this.preview)return!0;let t=this;for(;t;){let o=t,r=o.tagName?o.tagName.toLowerCase():"";if(r==="hui-card-preview"||r==="hui-dialog-edit-card"||r==="hui-dialog-suggest-card")return!0;t=o.parentNode||t.host||null}return!1}_tankState(){return this._config?Je({config:this._config,metrics:{consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},canvasHeight:this._getCanvasHeight()}):null}_interactiveTank(){if(!this._hass||!this._motionAllowed)return null;let t=this._tankState();return t?t.isDead||t.waterRatio<=0?null:t:null}_dropFood(t,o){let r=Math.max(80,Math.min(944,t));this._food=[...this._food,...Do(r,o+2)].slice(-30)}_knockAt(t,o,r){let i=Date.now();this._ripples=[...this._ripples,{x:t,y:o,born:i}],(this._fishes||[]).forEach(s=>{let a=No(s.x,s.y,t,o);a&&(s.kickX=a.kx,s.kickY=a.ky,s.scare=a.scare,Math.abs(a.kx)>.5&&(s.dir=a.kx<0?-1:1),ve(s,i,.5+.5*a.scare))}),this._ancistrus&&sr(this._ancistrus,t,o,i,r,pe)&&ve(this._ancistrus,i),this._shrimp&&ar(this._shrimp,t,o,i,Xt)&&ve(this._shrimp,i),this._crab&&dr(this._crab,t,o,i)&&ve(this._crab,i),this._goby&&fr(this._goby,t,o,i)&&ve(this._goby,i)}_onTankTap(t){if(Date.now()-this._swipedAt<500)return;let o=this._interactiveTank();if(!o)return;let r=this._eventToSvgPoint(t);r&&(Io(r.y,o.waterSurfaceY)==="feed"?this._dropFood(r.x,o.waterSurfaceY):this._knockAt(r.x,r.y,o),this.requestUpdate())}_onFeedButton(){let t=this._interactiveTank();t&&(this._dropFood(Pe/2,t.waterSurfaceY),this._announce("aria_food_dropped"),this.requestUpdate())}_onKnockButton(){let t=this._interactiveTank();t&&(this._knockAt(Pe/2,(t.waterSurfaceY+t.tankBottom)/2,t),this._announce("aria_knocked"),this.requestUpdate())}_announce(t,o={}){this._announceFlip=!this._announceFlip,this._announcement=Pt(this._t(t),o)+(this._announceFlip?"\xA0":"")}_renderFlowBubbles(){return yi(this)}_renderFood(){return bi(this)}_renderRipples(){return xi(this)}_renderCostLabel(t){return Mi(this,t)}_ariaLabel({currentVolume:t,currentTemp:o,targetBudget:r,isDead:i,isCritical:s,sensorLost:a=!1}){let n=z(this._hass),l={consumed:P(t,n),target:P(r,n,0),temperature:P(o,n)},c=[Pt(this._t(o>0?"aria_summary_temperature":"aria_summary"),l)];return i?c.push(this._t("aria_dead")):s&&c.push(this._t("aria_over_budget")),a&&c.push(`${this._t("label_sensor_unavailable")}.`),c.join(" ")}_renderFpsBadge(){return ki(this)}render(){if(!this._config||!this._hass)return N``;let t=!!this._config.fullscreen,o=this._getCanvasHeight(),r=o-35,i={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:s,currentTemp:a,targetBudget:n,boilTemp:l,deadlyTemp:c,waterRatio:h,tankBottom:f,waterSurfaceY:p,isDead:m,isBoiling:g,isCritical:x,isWarning:v}=Je({config:this._config,metrics:i,canvasHeight:o}),w=this._motionAllowed&&!m&&h>0,S=z(this._hass),M=this._sensorLost,k=this._ariaLabel({currentVolume:s,currentTemp:a,targetBudget:n,isDead:m,isCritical:x,sensorLost:M}),F=Math.max(0,n-s),L=this._themeKey,O=Et(L),K=g||x?"#ef4444":v?"#38bdf8":O.waterTop,D=g||x?"#991b1b":v?"#0284c7":O.waterBottom,q=!!(this._config.title&&this._config.title.trim().length>0),J=this._config.aspect_ratio_width,ee=this._config.aspect_ratio_height,te=Number(this._config.algae_age)||0,Me=te>0?te:this._cachedHoursSinceLastShower,ht=a>=c?"#ef4444":a>=l?"#f59e0b":"var(--primary-text-color, #111827)",ke=t||!!this._config.show_gauges,Ze=!t&&this._config.show_tiles!==!1,V=ke&&!Ze,Jt=this._config.show_cost?Ho({volumeL:s,energyKwh:this._energyKwh,waterPricePerM3:this._config.water_price_per_m3,energyPricePerKwh:this._config.energy_price_per_kwh}):null;return N`
      <ha-card>
        ${!t&&q?N`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          ${Hi(this,{isFullscreen:t,canvasH:o,canvasBottom:r,ariaLabel:k,aspectWidth:J,aspectHeight:ee,themeKey:L,theme:O,waterColorStart:K,waterColorEnd:D,isBoiling:g,isDead:m,waterRatio:h,waterSurfaceY:p,tankBottom:f,effectiveAlgaeHours:Me,showReadings:s>0||this._isEditorPreview(),forceTemp:s<=0&&this._isEditorPreview(),displayedTemp:a>0?a:this._lastTemperature,currentVolume:s,targetBudget:n,comfortMin:this._cachedComfortMin,deadlyTemp:c,boilTemp:l,gaugeStyle:this._config.gauge_style,showBudget:this._config.show_budget,cost:Jt,lang:S,sensorLost:M,biotopeNotice:this._biotopeNotice,showGauges:ke,showCostLabel:V})}

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

        ${Ze?qi({currentVolume:s,displayedRemaining:F,targetBudget:n,currentTemp:a,tempTileColor:ht,cost:Jt,lang:S,t:mr=>this._t(mr)}):""}
      </ha-card>
    `}getCardSize(){return 6}getGridOptions(){let t={columns:12,min_columns:6};return this._config?.fullscreen&&(t.rows=8,t.min_rows=4),t}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",Kt);console.info(`%c SHOWER-AQUARIUM-CARD %c v${je} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");var Ge=window;Ge.customCards=Ge.customCards||[];var ur=Ge.customCards.findIndex(e=>e.type==="shower-aquarium-card"),pr={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${je})`,documentationURL:`${yo}#readme`};ur!==-1?Ge.customCards[ur]=pr:Ge.customCards.push(pr);export{Kt as AquariumShowerCard};
