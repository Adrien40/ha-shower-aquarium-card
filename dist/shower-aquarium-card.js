var Le=globalThis,Fe=Le.ShadowRoot&&(Le.ShadyCSS===void 0||Le.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ge=Symbol(),At=new WeakMap,me=class{constructor(e,r,i){if(this._$cssResult$=!0,i!==Ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o,r=this.t;if(Fe&&e===void 0){let i=r!==void 0&&r.length===1;i&&(e=At.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&At.set(r,e))}return e}toString(){return this.cssText}},Et=t=>new me(typeof t=="string"?t:t+"",void 0,Ge),ze=(t,...e)=>{let r=t.length===1?t[0]:e.reduce((i,o,s)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[s+1],t[0]);return new me(r,t,Ge)},Tt=(t,e)=>{if(Fe)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(let r of e){let i=document.createElement("style"),o=Le.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=r.cssText,t.appendChild(i)}},je=Fe?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(let i of e.cssRules)r+=i.cssText;return Et(r)})(t):t;var{is:Lo,defineProperty:Fo,getOwnPropertyDescriptor:Ro,getOwnPropertyNames:Po,getOwnPropertySymbols:Oo,getPrototypeOf:Io}=Object,z=globalThis,Lt=z.trustedTypes,No=Lt?Lt.emptyScript:"",Bo=z.reactiveElementPolyfillSupport,_e=(t,e)=>t,We={toAttribute(t,e){switch(e){case Boolean:t=t?No:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Rt=(t,e)=>!Lo(t,e),Ft={attribute:!0,type:String,converter:We,reflect:!1,useDefault:!1,hasChanged:Rt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),z.litPropertyMetadata??(z.litPropertyMetadata=new WeakMap);var Q=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Ft){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){let i=Symbol(),o=this.getPropertyDescriptor(e,i,r);o!==void 0&&Fo(this.prototype,e,o)}}static getPropertyDescriptor(e,r,i){let{get:o,set:s}=Ro(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:o,set(n){let a=o?.call(this);s?.call(this,n),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ft}static _$Ei(){if(this.hasOwnProperty(_e("elementProperties")))return;let e=Io(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_e("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_e("properties"))){let r=this.properties,i=[...Po(r),...Oo(r)];for(let o of i)this.createProperty(o,r[o])}let e=this[Symbol.metadata];if(e!==null){let r=litPropertyMetadata.get(e);if(r!==void 0)for(let[i,o]of r)this.elementProperties.set(i,o)}this._$Eh=new Map;for(let[r,i]of this.elementProperties){let o=this._$Eu(r,i);o!==void 0&&this._$Eh.set(o,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let r=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let o of i)r.unshift(je(o))}else e!==void 0&&r.push(je(e));return r}static _$Eu(e,r){let i=r.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,r=this.constructor.elementProperties;for(let i of r.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Tt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,r,i){this._$AK(e,i)}_$ET(e,r){let i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:We).toAttribute(r,i.type);this._$Em=e,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,r){let i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let s=i.getPropertyOptions(o),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:We;this._$Em=o;let a=n.fromAttribute(r,s.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(e,r,i,o=!1,s){if(e!==void 0){let n=this.constructor;if(o===!1&&(s=this[e]),i??(i=n.getPropertyOptions(e)),!((i.hasChanged??Rt)(s,r)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,r,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(r=void 0),this._$AL.set(e,r)),o===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[o,s]of i){let{wrapped:n}=s,a=this[o];n!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,s,a)}}let e=!1,r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach(r=>r.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[_e("elementProperties")]=new Map,Q[_e("finalized")]=new Map,Bo?.({ReactiveElement:Q}),(z.reactiveElementVersions??(z.reactiveElementVersions=[])).push("2.1.2");var $e=globalThis,Pt=t=>t,Re=$e.trustedTypes,Ot=Re?Re.createPolicy("lit-html",{createHTML:t=>t}):void 0,Dt="$lit$",j=`lit$${Math.random().toFixed(9).slice(2)}$`,qt="?"+j,Uo=`<${qt}>`,ee=document,ye=()=>ee.createComment(""),be=t=>t===null||typeof t!="object"&&typeof t!="function",rt=Array.isArray,Ho=t=>rt(t)||typeof t?.[Symbol.iterator]=="function",Xe=`[ 	
\f\r]`,ge=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,It=/-->/g,Nt=/>/g,K=RegExp(`>|${Xe}(?:([^\\s"'>=/]+)(${Xe}*=${Xe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Bt=/'/g,Ut=/"/g,Vt=/^(?:script|style|textarea|title)$/i,ot=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),O=ot(1),u=ot(2),cs=ot(3),te=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Ht=new WeakMap,J=ee.createTreeWalker(ee,129);function Zt(t,e){if(!rt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ot!==void 0?Ot.createHTML(e):e}var Do=(t,e)=>{let r=t.length-1,i=[],o,s=e===2?"<svg>":e===3?"<math>":"",n=ge;for(let a=0;a<r;a++){let l=t[a],d,f,h=-1,p=0;for(;p<l.length&&(n.lastIndex=p,f=n.exec(l),f!==null);)p=n.lastIndex,n===ge?f[1]==="!--"?n=It:f[1]!==void 0?n=Nt:f[2]!==void 0?(Vt.test(f[2])&&(o=RegExp("</"+f[2],"g")),n=K):f[3]!==void 0&&(n=K):n===K?f[0]===">"?(n=o??ge,h=-1):f[1]===void 0?h=-2:(h=n.lastIndex-f[2].length,d=f[1],n=f[3]===void 0?K:f[3]==='"'?Ut:Bt):n===Ut||n===Bt?n=K:n===It||n===Nt?n=ge:(n=K,o=void 0);let m=n===K&&t[a+1].startsWith("/>")?" ":"";s+=n===ge?l+Uo:h>=0?(i.push(d),l.slice(0,h)+Dt+l.slice(h)+j+m):l+j+(h===-2?a:m)}return[Zt(t,s+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},xe=class t{constructor({strings:e,_$litType$:r},i){let o;this.parts=[];let s=0,n=0,a=e.length-1,l=this.parts,[d,f]=Do(e,r);if(this.el=t.createElement(d,i),J.currentNode=this.el.content,r===2||r===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=J.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(Dt)){let p=f[n++],m=o.getAttribute(h).split(j),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:s,name:g[2],strings:m,ctor:g[1]==="."?Ke:g[1]==="?"?Je:g[1]==="@"?et:de}),o.removeAttribute(h)}else h.startsWith(j)&&(l.push({type:6,index:s}),o.removeAttribute(h));if(Vt.test(o.tagName)){let h=o.textContent.split(j),p=h.length-1;if(p>0){o.textContent=Re?Re.emptyScript:"";for(let m=0;m<p;m++)o.append(h[m],ye()),J.nextNode(),l.push({type:2,index:++s});o.append(h[p],ye())}}}else if(o.nodeType===8)if(o.data===qt)l.push({type:2,index:s});else{let h=-1;for(;(h=o.data.indexOf(j,h+1))!==-1;)l.push({type:7,index:s}),h+=j.length-1}s++}}static createElement(e,r){let i=ee.createElement("template");return i.innerHTML=e,i}};function ce(t,e,r=t,i){if(e===te)return e;let o=i!==void 0?r._$Co?.[i]:r._$Cl,s=be(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(t),o._$AT(t,r,i)),i!==void 0?(r._$Co??(r._$Co=[]))[i]=o:r._$Cl=o),o!==void 0&&(e=ce(t,o._$AS(t,e.values),o,i)),e}var Ye=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:r},parts:i}=this._$AD,o=(e?.creationScope??ee).importNode(r,!0);J.currentNode=o;let s=J.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let d;l.type===2?d=new we(s,s.nextSibling,this,e):l.type===1?d=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(d=new tt(s,this,e)),this._$AV.push(d),l=i[++a]}n!==l?.index&&(s=J.nextNode(),n++)}return J.currentNode=ee,o}p(e){let r=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,r),r+=i.strings.length-2):i._$AI(e[r])),r++}},we=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,i,o){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ce(this,e,r),be(e)?e===A||e==null||e===""?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==te&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ho(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&be(this._$AH)?this._$AA.nextSibling.data=e:this.T(ee.createTextNode(e)),this._$AH=e}$(e){let{values:r,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=xe.createElement(Zt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(r);else{let s=new Ye(o,this),n=s.u(this.options);s.p(r),this.T(n),this._$AH=s}}_$AC(e){let r=Ht.get(e.strings);return r===void 0&&Ht.set(e.strings,r=new xe(e)),r}k(e){rt(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,i,o=0;for(let s of e)o===r.length?r.push(i=new t(this.O(ye()),this.O(ye()),this,this.options)):i=r[o],i._$AI(s),o++;o<r.length&&(this._$AR(i&&i._$AB.nextSibling,o),r.length=o)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){let i=Pt(e).nextSibling;Pt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},de=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,i,o,s){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=r,this._$AM=o,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}_$AI(e,r=this,i,o){let s=this.strings,n=!1;if(s===void 0)e=ce(this,e,r,0),n=!be(e)||e!==this._$AH&&e!==te,n&&(this._$AH=e);else{let a=e,l,d;for(e=s[0],l=0;l<s.length-1;l++)d=ce(this,a[i+l],r,l),d===te&&(d=this._$AH[l]),n||(n=!be(d)||d!==this._$AH[l]),d===A?e=A:e!==A&&(e+=(d??"")+s[l+1]),this._$AH[l]=d}n&&!o&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ke=class extends de{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}},Je=class extends de{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}},et=class extends de{constructor(e,r,i,o,s){super(e,r,i,o,s),this.type=5}_$AI(e,r=this){if((e=ce(this,e,r,0)??A)===te)return;let i=this._$AH,o=e===A&&i!==A||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==A&&(i===A||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},tt=class{constructor(e,r,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ce(this,e)}};var qo=$e.litHtmlPolyfillSupport;qo?.(xe,we),($e.litHtmlVersions??($e.litHtmlVersions=[])).push("3.3.3");var Qt=(t,e,r)=>{let i=r?.renderBefore??e,o=i._$litPart$;if(o===void 0){let s=r?.renderBefore??null;i._$litPart$=o=new we(e.insertBefore(ye(),s),s,void 0,r??{})}return o._$AI(t),o};var ve=globalThis,H=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;let e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Qt(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return te}};H._$litElement$=!0,H.finalized=!0,ve.litElementHydrateSupport?.({LitElement:H});var Vo=ve.litElementPolyfillSupport;Vo?.({LitElement:H});(ve.litElementVersions??(ve.litElementVersions=[])).push("4.2.2");var Pe="0.8.80",Gt="https://github.com/Adrien40/ha-shower-aquarium-card";var y=Object.freeze({title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:5,temp_boiling_threshold:40,temp_deadly_threshold:45,comfort_temp_min:33,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,show_cost:!1,water_price_per_m3:4.5,energy_price_per_kwh:.25,cold_water_temp:15,animation_quality:"max",creature_style:"flat",respect_reduced_motion:!0,show_fps:!1,gauge_style:"thermometer",show_budget:!1});var zt=ze`
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
    touch-action: manipulation;
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
`;var jt={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge actuel des algues (maintenant)",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)",field_animation_quality:"Qualit\xE9 d'animation",quality_max:"Maximale",quality_balanced:"\xC9quilibr\xE9e",quality_light:"L\xE9g\xE8re (Google Nest Hub)",helper_animation_quality:"L\xE9g\xE8re : 20 images/s et effets simplifi\xE9s, pour les \xE9crans peu puissants",field_respect_reduced_motion:"Suivre le mode \xAB mouvement r\xE9duit \xBB de l'appareil",field_show_fps:"Afficher les images par seconde (d\xE9bogage)",helper_show_fps:"Affichage de d\xE9bogage : indique une fois par seconde le nombre d'images dessin\xE9es.",helper_respect_reduced_motion:"Activ\xE9 : si votre tablette, t\xE9l\xE9phone ou ordinateur a le r\xE9glage \xAB r\xE9duire les animations \xBB (accessibilit\xE9), l'aquarium reste immobile. D\xE9sactiv\xE9 : l'aquarium s'anime toujours. Si vous ne voyez aucun mouvement, d\xE9sactivez cette option.",aria_summary:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L.",aria_summary_temperature:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L, eau \xE0 {temperature} \xB0C.",aria_dead:"Le bac est vide ou trop chaud : les animaux sont morts.",aria_over_budget:"Le volume cible est d\xE9pass\xE9.",section_aquarium:"Aquarium, animaux et algues",section_limits:"Limites (volume et temp\xE9rature)",section_cost:"Estimation du co\xFBt",section_display:"Affichage et performance",action_feed:"Nourrir les poissons",action_knock:"Taper sur la vitre",aria_actions:"Actions de l'aquarium",aria_food_dropped:"De la nourriture est tomb\xE9e dans le bac.",aria_knocked:"Vous avez tap\xE9 sur la vitre. Les poissons sont effray\xE9s.",field_comfort_temp_entity:"Entit\xE9 de temp\xE9rature de confort minimum (optionnel)",helper_comfort_temp_entity:"Temp\xE9rature minimale de confort, par exemple celle d'un pommeau Hydrao. Elle remplace la valeur ci-dessous.",field_comfort_temp:"Temp\xE9rature minimale de confort (\xB0C)",field_gauge_style:"Style des jauges (plein \xE9cran)",field_show_budget:"Afficher le budget sur la jauge de volume",option_gauge_thermometer:"Thermom\xE8tre et barre",option_gauge_arc:"Arcs ouverts",label_sensor_unavailable:"Capteur indisponible",helper_target_budget:"Utilis\xE9 seulement si l'entit\xE9 d'objectif ci-dessus est vide ou indisponible.",helper_fish_count:"Entre 1 et 10 : plus de poissons seraient \xE0 l'\xE9troit dans l'aquarium. Une valeur plus grande est ramen\xE9e \xE0 10.",helper_fish_speed:"Entre 0,2 et 3. Une valeur hors de cette plage est ramen\xE9e dedans.",field_creature_style:"Style des poissons et des autres \xEAtres vivants",option_creature_flat:"Plat et d\xE9taill\xE9",option_creature_cartoon:"Dessin anim\xE9",option_creature_realistic:"R\xE9aliste",helper_creature_style:"Le r\xE9aliste utilise des ombrages doux, que la qualit\xE9 d'animation l\xE9g\xE8re supprime"};var Wt={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Current algae age (right now)",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)",field_animation_quality:"Animation quality",quality_max:"Maximum",quality_balanced:"Balanced",quality_light:"Light (Google Nest Hub)",helper_animation_quality:"Light: 20 frames/s and simpler effects, for low-power screens",field_respect_reduced_motion:"Follow the device's reduced-motion setting",field_show_fps:"Show FPS (debug)",helper_show_fps:"Debug overlay: once per second, shows how many frames were drawn.",helper_respect_reduced_motion:'On: if your tablet, phone or computer has the "reduce motion" accessibility setting, the aquarium stays still. Off: the aquarium always animates. If you see no movement, turn this off.',aria_summary:"Shower aquarium: {consumed} L used out of {target} L.",aria_summary_temperature:"Shower aquarium: {consumed} L used out of {target} L, water at {temperature} \xB0C.",aria_dead:"The tank is empty or too hot: the animals have died.",aria_over_budget:"The target volume has been exceeded.",section_aquarium:"Aquarium, animals and algae",section_limits:"Limits (volume and temperature)",section_cost:"Cost estimate",section_display:"Display and performance",action_feed:"Feed the fish",action_knock:"Knock on the glass",aria_actions:"Aquarium actions",aria_food_dropped:"Fish food dropped into the tank.",aria_knocked:"You knocked on the glass. The fish are startled.",field_comfort_temp_entity:"Minimum comfort temperature entity (optional)",helper_comfort_temp_entity:"Minimum comfortable temperature, for example from a Hydrao showerhead. It replaces the value below.",field_comfort_temp:"Minimum comfort temperature (\xB0C)",field_gauge_style:"Gauge style (fullscreen)",field_show_budget:"Show the budget on the volume gauge",option_gauge_thermometer:"Thermometer and bar",option_gauge_arc:"Open arcs",label_sensor_unavailable:"Sensor unavailable",helper_target_budget:"Only used when the target entity above is empty or unavailable.",helper_fish_count:"Between 1 and 10: more fish would be cramped in the tank. A higher value is brought back to 10.",helper_fish_speed:"Between 0.2 and 3. A value outside this range is brought back into it.",field_creature_style:"Look of the fish and the other living things",option_creature_flat:"Flat and detailed",option_creature_cartoon:"Cartoon",option_creature_realistic:"Realistic",helper_creature_style:"Realistic uses soft shading, which the light animation quality leaves out"};var it={fr:jt,en:Wt};function D(t){return(t?.locale?.language||t?.language||"en").substring(0,2).toLowerCase()}function Go(t){return t&&it[t]||it.en}function G(t,e){return Go(t)[e]||it.en[e]||e}var nt={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#dc2626","#f59e0b","#fef3c7","#cbd5e1"]}};function lt(t){return nt[t]||nt.freshwater}var zo=["flat","cartoon","realistic"],jo=["night_entity","night_lux_threshold","cost_in_fullscreen","bottom_design"];function Ie(t){let e={...t};for(let r of jo)delete e[r];return e}var ke=1024,st=10,Jt=y.comfort_temp_min,Wo=y.survival_volume,ct=6e4,Xo=400,Yo=2048,Ko=300,Jo=600,Xt=(t,e=Xo)=>Math.max(e,Math.min(Yo,Math.round(t)));function er(t,e){if(t?.fullscreen){let o=Number(e?.width),s=Number(e?.height);return o>0&&s>0&&Number.isFinite(o)&&Number.isFinite(s)?Xt(ke*s/o,Ko):Jo}let r=Number(t?.aspect_ratio_width)||y.aspect_ratio_width,i=Number(t?.aspect_ratio_height)||y.aspect_ratio_height;return Xt(ke*(i/r))}function tr(t,e,r=null){let i={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(e?.target_budget)||y.target_budget,survivalVolume:Number(e?.survival_volume)||Wo,comfortMin:Number(e?.comfort_temp_min)||Jt,sensorMissing:!1,lastReading:null};if(!t||!e)return i;let o=e.entity?t.states[e.entity]:void 0,s=o?parseFloat(o.state):NaN,n=r?.lastReading??null;i.sensorMissing=!(o&&!isNaN(s));let a=n;if(o&&!isNaN(s)){let l=Math.max(0,s),d=o.last_changed?new Date(o.last_changed).getTime():NaN,f=n!==null&&n.volume===l&&n.changedMs!==null;a={volume:l,changedMs:f?n.changedMs:Number.isFinite(d)?d:null}}if(a&&(i.consumedVolume=a.volume,i.lastReading=a,a.changedMs!==null&&(i.hoursSinceLastShower=Math.max(0,(Date.now()-a.changedMs)/(1e3*60*60)))),e.temperature_entity&&t.states[e.temperature_entity]){let l=parseFloat(t.states[e.temperature_entity].state);i.temperature=isNaN(l)?0:l}if(e.target_budget_entity&&t.states[e.target_budget_entity]){let l=parseFloat(t.states[e.target_budget_entity].state);l>0&&(i.targetBudget=l)}if(e.comfort_temp_entity&&t.states[e.comfort_temp_entity]){let l=parseFloat(t.states[e.comfort_temp_entity].state),d=Number(e.temp_boiling_threshold)||y.temp_boiling_threshold;l>0&&l<d&&(i.comfortMin=l)}return i}function ei(t,e){return e==="saltwater"?t<2?0:t===2?1:t===3?3:Yt[(t-4)%Yt.length]:t%6}var Oe=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5],Yt=[4,2,5,6,2,5],Kt={male:1.4,female:1.6},ti=1.5,ri=.6,oi=2;function dt(t,e){let r=lt(e),i=Math.min(10,Math.max(1,Number(t)||4));return Array.from({length:i},(o,s)=>{let n=ei(s,e),a=e==="saltwater"&&n===0,l=e==="freshwater"&&n===2,d=l?ri:1,f=1.38-(Oe[s%Oe.length]-1.2)*.2,h=Math.random()*50-25,p=Math.random()*50-25;return{species:n,color:r.palette[s%r.palette.length],scale:(a?s===0?Kt.male:Kt.female:Oe[s%Oe.length]*(e==="saltwater"&&n===1?oi:1))*(l?ti:1),phase:Math.random()*6.28,x:a?190+s*140:120+s*760/Math.max(1,i-1)+h,y:a?470:160+s%3*90+p,vx:f*(.8+Math.random()*.4)*d,vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5)*d,dir:Math.random()<.5?1:-1,deathProgress:0}})}function Ne({config:t,metrics:e,canvasHeight:r}){let i=e.targetBudget,o=e.survivalVolume,s=i+o,n=e.consumedVolume,a=e.temperature,l=Number(t?.temp_boiling_threshold)||y.temp_boiling_threshold,d=Number(t?.temp_deadly_threshold)||y.temp_deadly_threshold,f=Math.max(0,s-n),h=s>0?Math.max(0,Math.min(1,f/s)):0,p=!!t?.fullscreen,m=p?0:15,g=p?r:r-35,b=g-m,v=g-h*b,w=a>=d&&a>0,k=f<=0,M=w||k,P=a>=l&&a>0,I=n>i&&!M,N=n>i*.7&&!I&&!M,Z=Number(t?.fish_speed_multiplier)||y.fish_speed_multiplier,U=((I||P)&&!M?2:1)*Z;return{targetBudget:i,survivalVolume:o,totalVolume:s,currentVolume:n,currentTemp:a,boilTemp:l,deadlyTemp:d,remainingVolumeInTank:f,waterRatio:h,tankTop:m,tankBottom:g,tankHeight:b,waterSurfaceY:v,isHeatDead:w,isWaterDead:k,isDead:M,isBoiling:P,isCritical:I,isWarning:N,speedMultiplier:U}}function ii(t){let e=Math.max(st+10,Math.ceil((t+5)/10)*10),r=[];for(let i=st+10;i<=e;i+=10)r.push(i);return{min:st,max:e,ticks:r}}function rr({currentTemp:t,currentVolume:e,targetBudget:r,comfortMin:i,deadlyTemp:o,boilTemp:s}){let n=ii(o),a=p=>Math.max(0,Math.min(1,(p-n.min)/(n.max-n.min))),l=a(t),d=t>=o?"#ef4444":t>=s?"#f97316":t>=i?"#16a34a":"#0284c7",f=Math.max(0,Math.min(1,e/Math.max(1,r))),h=e>r?"#ef4444":e>r*.7?"#f59e0b":"#0284c7";return{tempFraction:l,tempColor:d,volFraction:f,volColor:h,scale:n,marks:[{fraction:a(i),color:"#16a34a"},{fraction:a(s),color:"#f97316"},{fraction:a(o),color:"#ef4444"}],ticks:n.ticks.map(a)}}var or=8e3,Be=900;function Ue(){return{lastVolume:null,lastIncreaseAt:0,target:0,showerActive:!1}}function ir(t,e,r){if(t.lastVolume===null)return{...t,lastVolume:e};if(e<t.lastVolume-1e-6)return{...Ue(),lastVolume:e};if(e>t.lastVolume+1e-6){let i=e-t.lastVolume,o=(r-t.lastIncreaseAt)/1e3,n=t.lastIncreaseAt>0&&o>.2&&o<=15?i/(o/60):null,a=n===null?.5:Math.max(.25,Math.min(1,n/10));return{lastVolume:e,lastIncreaseAt:r,target:a,showerActive:!0}}return t}function sr(t,e){return t.lastIncreaseAt&&e-t.lastIncreaseAt<or?t.target:0}function nr(t,e){return t.showerActive&&t.lastIncreaseAt>0&&e-t.lastIncreaseAt>=or}function ar(t,e=36){return t>.02?Math.min(e,Math.round(4+t*(e-4))):0}function lr(t,e,r=45){return t<=e+r?"feed":"knock"}function cr(t,e,r,i,o=280,s=Math.random){let n=t-r,a=e-i,l=Math.hypot(n,a);if(l>o)return null;let d,f;if(l<1){let m=s()*Math.PI*2;d=Math.cos(m),f=Math.sin(m)}else d=n/l,f=a/l;let h=1-l/o,p=2+9*h;return{kx:d*p,ky:f*p*.6,scare:h}}function dr(t,e,r,i=360){let o=null,s=i;for(let n of r){if(n.eaten)continue;let a=Math.hypot(n.x-t,n.y-e);a<s&&(s=a,o=n)}return o}function fr(t,e,r=6,i=Math.random){let o=["#f59e0b","#fbbf24","#fb923c","#facc15"];return Array.from({length:r},()=>({x:t+(i()-.5)*70,y:e+i()*12,vy:.45+i()*.4,phase:i()*Math.PI*2,r:3.4+i()*2,color:o[Math.floor(i()*o.length)],landedAt:0,eaten:!1}))}var si=4.186/3600;function ft(t,e,r=15){return!(t>0)||!(e>r)?0:t*(e-r)*si}function hr({volumeL:t,energyKwh:e,waterPricePerM3:r,energyPricePerKwh:i}){let o=Math.max(0,t||0)*(Number(r)||0)/1e3,s=Math.max(0,e||0)*(Number(i)||0);return{water:o,energy:s,total:o+s}}function He(t,e="fr"){try{return new Intl.NumberFormat(e,{style:"currency",currency:"EUR"}).format(t)}catch{return`${t.toFixed(2)} \u20AC`}}var at={max:{fps:0,ambientHz:0,antialias:!0,flowBubbles:36,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0},balanced:{fps:30,ambientHz:0,antialias:!0,flowBubbles:24,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0},light:{fps:20,ambientHz:8,antialias:!1,flowBubbles:12,richSurface:!1,deathFilter:!1,doubleRipple:!1,shading:!1}};function ur(t){return t&&at[t]||at.max}function pr(t,e,r){return!r||!e?!0:t-e>=1e3/r-2}function mr(t){return t?Math.max(2,1e3/t/16.66*1.6):2}function _r(t,e){return[t.consumedVolume,t.temperature,t.targetBudget,t.survivalVolume,t.comfortMin,t.sensorMissing?1:0,Math.floor(t.hoursSinceLastShower),e].join("|")}function ht(t){let e={...t};for(let r of br){if(r.max===void 0)continue;let i=e[r.key];i!=null&&(e[r.key]=ut({[r.key]:i}).config[r.key])}return e}function gr(t,e=!0){return e===!1?!0:!t}var $r=40;function yr(t){return t?120:2}var br=[{key:"fish_count",fallback:y.fish_count,min:1,max:10,integer:!0},{key:"target_budget",fallback:y.target_budget,min:0,minExclusive:!0},{key:"survival_volume",fallback:y.survival_volume,min:0,minExclusive:!0},{key:"temp_boiling_threshold",fallback:y.temp_boiling_threshold,min:0,minExclusive:!0},{key:"temp_deadly_threshold",fallback:y.temp_deadly_threshold,min:0,minExclusive:!0},{key:"comfort_temp_min",fallback:y.comfort_temp_min,min:0,minExclusive:!0},{key:"algae_delay_hours",fallback:y.algae_delay_hours,min:0,minExclusive:!0},{key:"algae_age",fallback:y.algae_age,min:0},{key:"fish_speed_multiplier",fallback:y.fish_speed_multiplier,min:0,minExclusive:!0,clampMin:.2,max:3},{key:"aspect_ratio_width",fallback:y.aspect_ratio_width,min:0,minExclusive:!0},{key:"aspect_ratio_height",fallback:y.aspect_ratio_height,min:0,minExclusive:!0},{key:"water_price_per_m3",fallback:y.water_price_per_m3,min:0},{key:"energy_price_per_kwh",fallback:y.energy_price_per_kwh,min:0},{key:"cold_water_temp",fallback:y.cold_water_temp,min:-50}];function ut(t){let e={...t},r=[];for(let a of Object.keys(e))(e[a]===null||e[a]===void 0)&&delete e[a];for(let a of br){let l=e[a.key];if(l===void 0)continue;let d=typeof l=="string"&&l.trim()===""?NaN:Number(l);if(!(Number.isFinite(d)&&(a.minExclusive?d>a.min:d>=a.min))){r.push(`${a.key}: ${JSON.stringify(l)} is not valid, using ${a.fallback}`),e[a.key]=a.fallback;continue}a.integer&&(d=Math.round(d)),a.clampMin!==void 0&&d<a.clampMin&&(d=a.clampMin),a.max!==void 0&&d>a.max&&(d=a.max),d!==l&&(d!==Number(l)&&r.push(`${a.key}: ${JSON.stringify(l)} is out of range, using ${d}`),e[a.key]=d)}e.theme!==void 0&&!nt[e.theme]&&(r.push(`theme: ${JSON.stringify(e.theme)} is unknown, using freshwater`),e.theme="freshwater"),e.animation_quality!==void 0&&!at[e.animation_quality]&&(r.push(`animation_quality: ${JSON.stringify(e.animation_quality)} is unknown, using max`),e.animation_quality="max"),e.gauge_style!==void 0&&e.gauge_style!=="thermometer"&&e.gauge_style!=="arc"&&(r.push(`gauge_style: ${JSON.stringify(e.gauge_style)} is unknown, using thermometer`),e.gauge_style="thermometer"),e.creature_style!==void 0&&!zo.includes(e.creature_style)&&(r.push(`creature_style: ${JSON.stringify(e.creature_style)} is unknown, using ${y.creature_style}`),e.creature_style=y.creature_style),e.title!==void 0&&typeof e.title!="string"&&(r.push("title: must be text, ignoring it"),e.title="");let i=e.temp_boiling_threshold??y.temp_boiling_threshold,o=e.temp_deadly_threshold??y.temp_deadly_threshold;o<=i&&(e.temp_deadly_threshold=i+1,r.push(`temp_deadly_threshold: ${o} must be above temp_boiling_threshold (${i}), using ${i+1}`));let s=e.comfort_temp_min??Jt,n=e.temp_boiling_threshold??y.temp_boiling_threshold;return s>=n&&(e.comfort_temp_min=Math.max(1,n-1),r.push(`comfort_temp_min: ${s} must be below temp_boiling_threshold (${n}), using ${e.comfort_temp_min}`)),{config:e,warnings:r}}function xr(t,e){return String(t).replace(/\{(\w+)\}/g,(r,i)=>i in e?String(e[i]):r)}function Me(t,e="en"){return Number.isInteger(t)?String(t):F(t,e,1)}function F(t,e="en",r=1){try{return new Intl.NumberFormat(e,{minimumFractionDigits:r,maximumFractionDigits:r}).format(t)}catch{return Number(t).toFixed(r)}}var ni="hydrao_custom";function wr(t,e){let r=t&&typeof t.entities=="object"&&t.entities?t.entities:{},i=Array.isArray(e)&&e.length?e:Object.keys(r),o=(s,n,a)=>{let l=i.filter(h=>h.startsWith(`${s}.`)),d=l.find(h=>r[h]?.platform===ni&&r[h]?.translation_key===n);if(d)return d;let f=/(total|cumul|comfort|confort|wasted|perdu|gaspill)/;return l.find(h=>h.includes("hydrao")&&a.test(h)&&!f.test(h.replace(/_minimum_comfort_temperature|_temperature_de_confort_minimum|_temperature_confort_minimum/,"")))||""};return{entity:o("sensor","shower_volume_raw",/_(shower_volume|volume_douche)(_\d+)?$/),temperature_entity:o("sensor","temperature",/_temperature(_\d+)?$/),comfort_temp_entity:o("number","comfort_temperature",/_(minimum_comfort_temperature|temperature_de_confort_minimum|temperature_confort_minimum)(_\d+)?$/)}}var kr=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:y.theme,selector:{select:{options:[{value:"freshwater",label:"Freshwater (Tropical)"},{value:"saltwater",label:"Saltwater (Reef)"},{value:"coldwater",label:"Coldwater (Goldfish)"}]}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:y.target_budget,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{type:"expandable",name:"section_aquarium",flatten:!0,schema:[{name:"fish_count",default:y.fish_count,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"fish_speed_multiplier",default:y.fish_speed_multiplier,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"algae_enabled",default:y.algae_enabled,selector:{boolean:{}}},{name:"algae_delay_hours",default:y.algae_delay_hours,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:y.algae_age,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}}]},{type:"expandable",name:"section_limits",flatten:!0,schema:[{name:"survival_volume",default:y.survival_volume,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"comfort_temp_entity",selector:{entity:{domain:["sensor","number","input_number"]}}},{name:"comfort_temp_min",default:y.comfort_temp_min,selector:{number:{min:15,max:45,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_boiling_threshold",default:y.temp_boiling_threshold,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:y.temp_deadly_threshold,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_cost",flatten:!0,schema:[{name:"show_cost",default:y.show_cost,selector:{boolean:{}}},{name:"water_price_per_m3",default:y.water_price_per_m3,selector:{number:{min:0,max:30,step:.01,unit_of_measurement:"\u20AC/m\xB3",mode:"box"}}},{name:"energy_price_per_kwh",default:y.energy_price_per_kwh,selector:{number:{min:0,max:2,step:.001,unit_of_measurement:"\u20AC/kWh",mode:"box"}}},{name:"cold_water_temp",default:y.cold_water_temp,selector:{number:{min:0,max:30,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_display",flatten:!0,schema:[{name:"animation_quality",default:y.animation_quality,selector:{select:{options:[{value:"max",label:"Maximum"},{value:"balanced",label:"Balanced"},{value:"light",label:"Light (Google Nest Hub)"}]}}},{name:"creature_style",default:y.creature_style,selector:{select:{options:[{value:"flat",label:"Flat and detailed"},{value:"cartoon",label:"Cartoon"},{value:"realistic",label:"Realistic"}]}}},{name:"show_budget",default:y.show_budget,selector:{boolean:{}}},{name:"respect_reduced_motion",default:y.respect_reduced_motion,selector:{boolean:{}}},{name:"fullscreen",default:y.fullscreen,selector:{boolean:{}}},{name:"gauge_style",default:y.gauge_style,selector:{select:{options:[{value:"thermometer",label:"Thermometer and bar"},{value:"arc",label:"Open arcs"}]}}},{name:"show_fps",default:y.show_fps,selector:{boolean:{}}},{name:"aspect_ratio_width",default:y.aspect_ratio_width,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:y.aspect_ratio_height,selector:{number:{min:1,max:4e3,mode:"box"}}}]}];function Mr(t=kr){return t.flatMap(e=>e.type==="expandable"?Mr(e.schema):[e])}var vr={section_aquarium:"section_aquarium",section_limits:"section_limits",section_cost:"section_cost",section_display:"section_display"},ai={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",comfort_temp_entity:"field_comfort_temp_entity",comfort_temp_min:"field_comfort_temp",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",show_cost:"field_show_cost",water_price_per_m3:"field_water_price",energy_price_per_kwh:"field_energy_price",cold_water_temp:"field_cold_water_temp",animation_quality:"field_animation_quality",respect_reduced_motion:"field_respect_reduced_motion",fullscreen:"field_fullscreen",show_fps:"field_show_fps",creature_style:"field_creature_style",gauge_style:"field_gauge_style",show_budget:"field_show_budget",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},li={fullscreen:"helper_fullscreen",creature_style:"helper_creature_style",target_budget:"helper_target_budget",fish_count:"helper_fish_count",fish_speed_multiplier:"helper_fish_speed",comfort_temp_entity:"helper_comfort_temp_entity",show_cost:"helper_show_cost",animation_quality:"helper_animation_quality",respect_reduced_motion:"helper_respect_reduced_motion",show_fps:"helper_show_fps"},ci={theme:{freshwater:"theme_freshwater",saltwater:"theme_saltwater",coldwater:"theme_coldwater"},animation_quality:{max:"quality_max",balanced:"quality_balanced",light:"quality_light"},creature_style:{flat:"option_creature_flat",cartoon:"option_creature_cartoon",realistic:"option_creature_realistic"},gauge_style:{thermometer:"option_gauge_thermometer",arc:"option_gauge_arc"}},pt=class extends H{static get properties(){return{hass:{type:Object},_config:{type:Object}}}constructor(){super(),this.hass=void 0,this._config=void 0}setConfig(e){this._config=Ie(e)}_lang(){return D(this.hass)}_computeLabel(e){let r=ai[e.name]||vr[e.name];return r?G(this._lang(),r):e.name}_computeHelper(e){let r=li[e.name];return r?G(this._lang(),r):""}_valueChanged(e){if(!this._config||!this.hass)return;let r=ht({...e.detail.value});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}_schema(){let e=this._lang(),r=i=>{if(i.type==="expandable")return{...i,title:G(e,vr[i.name]),schema:i.schema.map(r)};let o=ci[i.name];return o?{...i,selector:{select:{options:i.selector.select.options.map(s=>({value:s.value,label:G(e,o[s.value])}))}}}:i};return kr.map(r)}_formData(){return{...Object.fromEntries(Mr().filter(r=>r.default!==void 0).map(r=>[r.name,r.default])),...ht(this._config)}}render(){return!this.hass||!this._config?O``:O`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${e=>this._computeLabel(e)}
        .computeHelper=${e=>this._computeHelper(e)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",pt);function Cr(t,e,r,i){let o=t._flowIntensity||0,s=3.5+o*6.5,n=90-o*35,l=(o>.05?t._animTime:t._ambientTime)*(1.6+o*2.4),d=t._profile.richSurface,f=d?16:28,h=w=>d?Math.sin(w/17+l*2.3)*o*2.4:0,p=[],m=[];for(let w=e;w<r;w+=f)p.push([w,i+Math.sin(w/n+l)*s+h(w)]),m.push([w,i+4+Math.sin(w/n+l+.6)*s*.7]);p.push([r,i+Math.sin(r/n+l)*s+h(r)]),m.push([r,i+4+Math.sin(r/n+l+.6)*s*.7]);let g=w=>`${w[0].toFixed(1)},${w[1].toFixed(1)}`,b=p.map(g).join(" L "),v=m.slice().reverse().map(g).join(" L ");return u`
    <path d="M ${b} L ${v} Z" fill="#ffffff" opacity="0.25" />
    <path d="M ${b}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
  `}var fe=t=>t??A;var S="#1e293b";function L(t){return t._config?.creature_style||"flat"}function R(t){return t._profile.shading}var $=(t,e,r,i)=>`M${t-r},${e} A${r},${i} 0 1,0 ${t+r},${e} A${r},${i} 0 1,0 ${t-r},${e} Z`,x=(t,e,r)=>$(t,e,r,r),C=t=>`M${t.trim().split(/\s+/).join(" L")} Z`,re=(t,e,r,i)=>`M${t},${e} L${r},${i}`,c=(t,e,r={})=>({d:t,fill:e,...r});function _(t,e=!1){return u`<path d="${t.d}" fill="${t.fill??"none"}" stroke="${fe(t.stroke??(e?S:void 0))}" stroke-width="${fe(t.sw??(e?1.6:void 0))}" stroke-linecap="${fe(t.lc)}" stroke-linejoin="round" opacity="${fe(t.op)}" />`}function B(t,e,r,i,o={}){let s=_(c(r,i,o),t==="cartoon");return t==="realistic"&&e?u`${s}<path d="${r}" fill="url(#shade)" opacity="${fe(o.op)}" />`:s}var T=Object.freeze({x0:776,x1:1010,height:254,ledge:190,ledgeFrom:880,ledgeTo:940});function di(t,e=0){let r=L(t),i=r==="cartoon"?1.4:r==="realistic"?.65:1,o=r==="cartoon"?1.5:r==="realistic"?.7:1,s=[{count:11,baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:16,baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],n=[];return s.forEach((a,l)=>{for(let d=0;d<a.count;d++){let f=d/(a.count-1),h=-90-a.spread/2+f*a.spread,p=(a.lenMin+(a.lenMax-a.lenMin)*(.5+.5*Math.sin(f*Math.PI)))*(1-.3*e),m=l*10+d*.7,g=Math.sin(t._ambientTime*a.speed+m)*9*(1-e),b=h*Math.PI/180,v=Math.cos(b)*a.baseR,w=Math.sin(b)*a.baseR,k=d*37%17-8,M=h+90+g;n.push(u`
        <g transform="translate(${v.toFixed(1)}, ${w.toFixed(1)}) rotate(${M.toFixed(1)})">
          <path d="M 0,0 Q ${k.toFixed(1)},${(-p*.55).toFixed(1)} 0,${(-p).toFixed(1)}" stroke="${a.color}" stroke-width="${(a.width*i).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.9" />
          <circle cx="0" cy="${(-p).toFixed(1)}" r="${(a.width*.9*o).toFixed(1)}" fill="${r==="realistic"?"#ffffff":a.tip}" />
        </g>
      `)}}),n}function fi(t,e,r,i,o){let n=Array.from({length:8},(d,f)=>{let h=f/8*Math.PI*2+.18*Math.sin(o*1.3+f*2.1),p=1+.2*Math.sin(o*2.3+f*2.7)+.1*Math.sin(o*1.1+f*5.1);return{a:h,x:t+Math.cos(h)*r*p,y:e+Math.sin(h)*i*p}}),a=d=>`M${d.map(f=>`${f.x.toFixed(1)},${f.y.toFixed(1)}`).join(" L")} Z`,l=n.filter(d=>Math.sin(d.a)<.15);return{body:a(n),top:a(l)}}function hi(t){let e=t-T.ledge,[r,i]=[T.ledgeFrom-30,T.ledgeTo+52];return`M${r+10},${e} L${i-10},${e} L${i},${e+12} L${i-6},${e+30} L${r+8},${e+30} L${r},${e+12} Z`}var Sr=[[802,16,36,18,1,"#7d5c8f"],[862,30,58,32,2,"#8b6a9c"],[950,34,66,36,3,"#6d5280"],[1e3,46,34,48,4,"#7d5c8f"],[832,80,46,32,5,"#6d5280"],[906,94,54,34,6,"#8b6a9c"],[978,106,40,40,7,"#7d5c8f"],[920,146,64,30,8,"#6d5280"]],ui=[[958,216,34,30,9,"#8b6a9c"],[998,198,24,36,10,"#7d5c8f"],[930,228,26,26,11,"#6d5280"]],pi=[[420,12,34,16,12,"#8b6a9c"],[448,26,22,20,13,"#6d5280"],[398,24,20,16,14,"#7d5c8f"]];function Ar(t,e,r,i){let o=e,s=L(t),n=R(t),a=(f,h,p)=>B(s,n,f,h,p===void 0?{}:{op:p}),l=(f,h,p,m)=>s==="flat"?f.map(([g,b])=>_(c(x(g,b,p),h,{op:m}))):"",d=(f,h,p,m,g,b)=>{let{body:v,top:w}=fi(f,h,p,m,g);return u`
      ${a(v,b)}
      ${s==="cartoon"?"":_(c(w,"#ffffff",{op:.15,stroke:"none"}))}
      ${s==="flat"?[[-.3,.1],[.25,.3],[-.05,.45]].map(([k,M])=>_(c(x(f+k*p,h+M*m,Math.max(1.4,p*.06)),"#3b2a4a",{op:.35,stroke:"none"}))):""}
    `};return u`
    <g id="reef-decor">
      <g style="${r}">
      ${a(`M 60 ${o} Q 40 ${o-165}, 95 ${o-225} Q 120 ${o-275}, 85 ${o-335} Q 135 ${o-265}, 120 ${o-195} Q 150 ${o-135}, 115 ${o} Z`,"#f43f5e",.95)}
      ${a(`M 115 ${o} Q 150 ${o-155}, 190 ${o-205} Q 215 ${o-245}, 190 ${o-295} Q 230 ${o-235}, 205 ${o-155} Q 180 ${o-105}, 155 ${o} Z`,"#fb7185",.9)}
      ${l([[88,o-40],[80,o-110],[98,o-190],[105,o-240],[92,o-300]],"#ffe4e6",3,.55)}
      ${l([[135,o-40],[160,o-120],[185,o-190],[196,o-250]],"#ffe4e6",3,.55)}
      <g transform="translate(690, ${o})">
        ${a("M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z","#c084fc",.85)}
        ${a("M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z","#a855f7",.9)}
        ${a("M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z","#d8b4fe",.85)}
        ${a(x(0,-20,60),"#7e22ce",.75)}
      </g>
      <g transform="translate(190, ${o-70})">
        ${B(s,n,"M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z","#1d4ed8",{stroke:"#1e40af",sw:2})}
        <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="5" fill="#60a5fa" />
      </g>
      </g>
      <g id="live-rock">
        ${Sr.slice(0,4).map(([f,h,p,m,g,b])=>d(f,o-h,p,m,g,b))}
        ${Sr.slice(4).map(([f,h,p,m,g,b])=>d(f,o-h,p,m,g,b))}
        ${a($(884,o-60,22,12),"#1f1230",.6)}
        ${a(hi(o),"#9a78ad")}
        ${s==="cartoon"?"":_(c(`M ${T.ledgeFrom-20},${o-T.ledge+3} L ${T.ledgeTo+44},${o-T.ledge+3}`,void 0,{stroke:"#ffffff",sw:1.6,op:.4,lc:"round"}))}
        ${ui.map(([f,h,p,m,g,b])=>d(f,o-h,p,m,g,b))}
        ${s==="cartoon"?"":[[850,44,16,7],[942,108,18,8],[976,152,11,6],[812,74,12,6],[1002,200,9,7]].map(([f,h,p,m])=>_(c($(f,o-h,p,m),"#e879f9",{op:.32,stroke:"none"})))}
        ${s==="flat"?[[846,66],[972,158]].map(([f,h])=>u`${_(c(`M ${f},${o-h} L ${f},${o-h-9}`,void 0,{stroke:"#fb923c",sw:1.2,lc:"round"}))}${_(c(x(f,o-h-11,3.2),"#fb923c",{stroke:"none"}))}`):""}
      </g>
      <g id="live-rock-2">
        ${pi.map(([f,h,p,m,g,b])=>d(f,o-h,p,m,g,b))}
        ${s==="cartoon"?"":_(c($(432,o-22,12,5),"#e879f9",{op:.32,stroke:"none"}))}
      </g>
      <g id="anemone" style="${r}" transform="translate(260, ${o-17}) scale(1.4, 1.4)">
        ${di(t,i)}
        ${a($(0,-16,30,11),"#86198f",.9)}
        ${a("M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z","#701a75")}
        ${a($(0,16,26,9),"#4a044e",.75)}
        ${s==="cartoon"?u`
              ${_(c(x(-8,3,3.6),"#ffffff",{stroke:S,sw:1.2}))}
              ${_(c(x(8,3,3.6),"#ffffff",{stroke:S,sw:1.2}))}
              ${_(c(x(-7.4,3.4,2),"#111827",{stroke:"none"}))}
              ${_(c(x(8.6,3.4,2),"#111827",{stroke:"none"}))}
              ${_(c("M -6,10 Q 0,16 6,10",void 0,{stroke:S,sw:1.5,lc:"round"}))}
              ${_(c($(-14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
              ${_(c($(14,8,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
            `:""}
      </g>
    </g>
  `}var mi=[[140,25,70,26,"#475569",1],[250,17,50,20,"#64748b",1],[860,20,75,28,"#334155",1],[760,15,46,18,"#64748b",1],[300,10,26,10,"#94a3b8",.85],[600,8,22,9,"#94a3b8",.8],[660,14,34,14,"#475569",.9]];function Er(t,e,r){return u`
    <g id="coldwater-decor">
      ${mi.map(([i,o,s,n,a,l])=>{let d=t-o;return u`
          ${B(e,r,$(i,d,s,n),a,{op:l})}
          ${_(c($(i-s*.3,d-n*.4,s*.35,n*.22),"#ffffff",{op:.22}))}
        `})}
    </g>
  `}function Tr(t,e,r,i){let o=t,s=(a,l,d)=>B(r,i,a,l,d===void 0?{}:{op:d}),n=(a,l)=>r==="flat"?_(c(a,void 0,{stroke:"#052e16",sw:1.5,op:l,lc:"round"})):"";return u`
    <g id="freshwater-plants" style="${e}">
      ${s(`M 45 ${o} Q 65 ${o-75}, 115 ${o-60} Q 155 ${o-85}, 200 ${o-50} Q 240 ${o-70}, 285 ${o} Z`,"#15803d")}
      ${s(`M 75 ${o} Q 95 ${o-60}, 135 ${o-55} Q 170 ${o-75}, 210 ${o-40} Q 250 ${o-50}, 270 ${o} Z`,"#22c55e",.85)}
      ${s(x(110,o-55,11),"#4ade80",.7)}
      ${s(x(170,o-63,12),"#4ade80",.7)}
      <path d="M 120 ${o} Q 140 ${o-105}, 160 ${o-155} Q 165 ${o-205}, 145 ${o-265}" stroke="${r==="cartoon"?S:"#14532d"}" stroke-width="${r==="cartoon"?10:8}" fill="none" stroke-linecap="round" />
      ${r==="cartoon"?u`<path d="M 120 ${o} Q 140 ${o-105}, 160 ${o-155} Q 165 ${o-205}, 145 ${o-265}" stroke="#14532d" stroke-width="6" fill="none" stroke-linecap="round" />`:""}
      ${s(`M 145 ${o-265} Q 105 ${o-305}, 85 ${o-280} C 70 ${o-250}, 110 ${o-220}, 145 ${o-265} Z`,"#166534")}
      ${s(`M 145 ${o-265} Q 185 ${o-315}, 215 ${o-295} C 230 ${o-270}, 190 ${o-230}, 145 ${o-265} Z`,"#15803d")}
      ${n(`M 145 ${o-265} Q 110 ${o-278}, 90 ${o-276}`,.4)}
      ${n(`M 145 ${o-265} Q 185 ${o-285}, 212 ${o-291}`,.4)}
      ${s(`M 880 ${o} Q 920 ${o-195}, 870 ${o-355} Q 845 ${o-195}, 860 ${o} Z`,"#16a34a",.9)}
      ${s(`M 920 ${o} Q 960 ${o-215}, 930 ${o-375} Q 895 ${o-205}, 900 ${o} Z`,"#22c55e",.8)}
      ${n(`M 870 ${o} Q 885 ${o-190}, 870 ${o-350}`,.3)}
      ${n(`M 910 ${o} Q 940 ${o-205}, 930 ${o-370}`,.3)}
    </g>
  `}function Lr(t,e,r,i=0){let o=r?t._getCanvasHeight():t._getCanvasHeight()-35,s=t._profile.deathFilter?`filter: grayscale(${(i*.85).toFixed(2)}) sepia(${(i*.5).toFixed(2)}) brightness(${(1-i*.45).toFixed(2)});`:`opacity: ${(1-i*.6).toFixed(2)};`;return e==="saltwater"?Ar(t,o,s,i):e==="coldwater"?Er(o,L(t),R(t)):Tr(o,s,L(t),R(t))}var _i=[[70,70,.1,-1],[150,95,.25,1],[260,60,.05,1],[380,110,.4,-1],[470,65,.15,1],[560,90,.3,-1],[650,120,.5,1],[740,70,.1,-1],[830,100,.35,1],[920,80,.2,-1],[985,60,.6,-1],[40,55,.7,1]],gi=[[-6,1,.15,"#3f6212"],[-2,.8,.35,"#4d7c0f"],[3,.65,-.1,"#365314"],[7,.5,.25,"#65a30d"]],mt=(t,e,r)=>Math.sin(t/e)*.35+Math.sin(t/r+1.3)*.2,_t=t=>`M${t.map(([e,r])=>`${e.toFixed(1)},${r.toFixed(1)}`).join(" L")} Z`,$i=8,Ce=new Map;function yi(t,e,r,i,o){let s=`${t}|${e}|${r}|${i}|${o}`,n=Ce.get(s);if(n)return n;let a=o-i,l=a*(.04+.16*t),d=[[e,o]];for(let b=e;b<=r;b+=8)d.push([b,o-l*(1+mt(b,37,13))]);d.push([r,o]);let f=8+62*t,h=[[e,i]],p=[[r,i]];for(let b=i;b<=o;b+=8)h.push([e+f*(1+mt(b,41,17)),b]),p.push([r-f*(1+mt(b+90,41,17)),b]);h.push([e,o]),p.push([r,o]);let m=[];for(let[b,v,w,k]of _i){let M=Math.min(1,(t-w)/.4);if(M<=0)continue;let P=Math.min(v*M,a*.3);for(let[I,N,Z,ne]of gi){let U=b+I,ae=U+k*P*(.2+Z),ue=o-P*N,pe=U+(ae-U)*.3-k*5,le=o-P*N*.55;m.push({d:`M${U},${o} Q${pe.toFixed(1)},${le.toFixed(1)} ${ae.toFixed(1)},${ue.toFixed(1)}`,color:ne})}}let g={bottom:_t(d),leftWall:_t(h),rightWall:_t(p),strands:m};return Ce.size>=$i&&Ce.delete(Ce.keys().next().value),Ce.set(s,g),g}function Fr(t,e,r){let i=t._config;if(!i)return u``;let o=i.algae_delay_hours,s=Number(i.algae_age)||0,n=s>0?s:e;if(!i.algae_enabled||n<o)return u``;let a=Math.round(Math.min(1,(n-o)/36)*1e3)/1e3,l=(.2+a*.78).toFixed(2),d=r?0:14,f=r?t._getCanvasHeight():t._getCanvasHeight()-35,h=yi(a,r?0:12,r?1024:1012,d,f);return u`
    <g id="algae-layer" opacity="${l}">
      <rect x="0" y="${d}" width="1024" height="${f-d}" fill="url(#algaeDots)" opacity="${(.15+a*.2).toFixed(2)}" />
      <path d="${h.bottom}" fill="#4d7c0f" fill-opacity="0.32" />
      <path d="${h.bottom}" fill="url(#algaeDots)" />
      <path d="${h.leftWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${h.leftWall}" fill="url(#algaeDots)" opacity="0.8" />
      <path d="${h.rightWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${h.rightWall}" fill="url(#algaeDots)" opacity="0.8" />
      ${h.strands.map(p=>u`<path d="${p.d}" fill="none" stroke="${p.color}" stroke-width="2.6" stroke-linecap="round" />`)}
    </g>
  `}var E=t=>({fins:[],marks:[],over:[],pec:null,...t}),gt=(t,e,r)=>`M ${t},${r} Q ${t+6},${r-4} ${t+12},${r} T ${e},${r}`,bi=t=>E({fins:[c(C("5,-42 -10,-12 10,-12"),t,{op:.9}),c(C("0,42 -8,12 8,12"),t,{op:.9}),c(re(8,10,20,48),void 0,{stroke:"#ffffff",sw:2,lc:"round"})],tail:{at:[-22,0],mul:1,shapes:[c(C("0,0 -20,-14 -15,0 -20,14"),t)],rays:[[-20,-14],[-17,0],[-20,14]]},body:c(C("-20,0 5,-17 24,0 5,17"),t),marks:[c(re(3,-17,3,17),void 0,{stroke:"#0f172a",sw:3})],eye:{x:16,y:-3,r:3,iris:"#ef4444"},area:[3,0,12,10]}),xi=()=>E({tail:{at:[-20,0],mul:1,shapes:[c(C("0,0 -14,-7 -12,0 -14,7"),"rgba(255,255,255,0.7)")],rays:[[-14,-7],[-12,0],[-14,7]]},body:c($(0,0,22,9),"#1e293b"),marks:[c("M 15,-2 L -17,-2",void 0,{stroke:"#06b6d4",sw:3.5,lc:"round"}),c("M 0,3 L -17,3",void 0,{stroke:"#ef4444",sw:3.5,lc:"round"})],eye:{x:14,y:-2,r:2.2,iris:"#38bdf8"},area:[0,0,22,9]}),wi=()=>E({fins:[c(x(2,0,24),"#b45309",{op:.75})],tail:{at:[-19,0],mul:1,shapes:[c("M 0,0 C -6,-8 -12,-7 -13,0 C -12,7 -6,8 0,0 Z","#c2410c",{op:.85})],rays:[[-12,-4],[-13,0],[-12,4]]},body:c(x(2,0,20),"#ea6a2a"),marks:[gt(-14,18,-10),gt(-14,18,-2),gt(-14,18,6)].map(t=>c(t,void 0,{stroke:"#22d3ee",sw:1.8,op:.85,lc:"round"})),eye:{x:15,y:-3,r:2.6,iris:"#dc2626"},area:[2,0,14,14]}),vi=()=>E({fins:[c(C("-4,-6 4,-14 10,-6"),"#f97316",{op:.9})],tail:{at:[-16,0],mul:1,shapes:[c("M 0,0 C -8,-12 -22,-15 -29,-8 C -26,-3 -26,3 -29,8 C -22,15 -8,12 0,0 Z","#f97316",{op:.92}),c(x(-18,-6,2.2),"#1e3a8a",{op:.8}),c(x(-22,4,2.6),"#1e3a8a",{op:.8}),c(x(-14,5,1.6),"#1e3a8a",{op:.7})],rays:[[-29,-8],[-27,0],[-29,8]]},body:c($(0,0,17,7.5),"#38bdf8"),marks:[c($(-2,3.5,13,3),"#e0f2fe",{op:.55}),c($(5,-2.5,6,2.2),"#0ea5e9",{op:.5})],eye:{x:12,y:-2,r:2.2},area:[0,0,13,6]}),ki=()=>E({tail:{at:[-19,0],mul:1,shapes:[c(C("0,0 -12,-8 -9,0 -12,8"),"#fdba74",{op:.9})],rays:[[-12,-8],[-9,0],[-12,8]]},body:c($(0,0,19,10),"#fb923c"),marks:[c($(-1,6,13,3),"#fde68a",{op:.55}),c("M 6,-8.5 C 9,-4 9,4 6,8.5 C -2,8 -10,4 -16,1 C -10,-1 -2,-5 6,-8.5 Z","#111827")],eye:{x:13,y:-3,r:2.4,iris:"#fde68a"},area:[0,-1,14,7]}),Mi=()=>E({fins:[c(C("-14,-12 -3,-22 8,-12"),"#f97316",{op:.85}),c(C("-16,12 -4,20 10,12"),"#f97316",{op:.85}),c("M 12,8 C 18,16 20,24 18,32",void 0,{stroke:"#f97316",sw:.9,lc:"round"})],tail:{at:[-21,0],mul:1,shapes:[c("M 0,0 C -8,-9 -14,-8 -15,0 C -14,8 -8,9 0,0 Z","#3b82f6",{op:.85})],rays:[[-13,-5],[-15,0],[-13,5]]},body:c($(0,0,21,14),"#3b82f6"),marks:[-12,-6,0,6,12].map((t,e)=>c(`M ${t-4},-12 L ${t+2},12`,void 0,{stroke:e%2?"#1d4ed8":"#f97316",sw:1.6,op:.85})),eye:{x:14,y:-4,r:2.8,iris:"#fef3c7"},area:[0,0,17,11]}),Ci=()=>{let t=e=>c(e,"#ffffff",{stroke:"#0f172a",sw:1.4});return E({tail:{at:[-20,0],mul:1,shapes:[c("M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z","#ea580c",{stroke:"#0f172a",sw:1.4})],rays:[[-15,-6],[-17,0],[-15,6]]},body:c($(0,0,24,15),"#f97316"),marks:[t("M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z"),t("M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z"),t("M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z")],pec:{at:[3,3],shapes:[c($(0,6,6,10),"#f97316",{op:.9,stroke:"#0f172a",sw:1})]},eye:{x:15,y:-4,r:3.2},area:[0,0,22,13]})},Si=()=>E({tail:{at:[-25,0],mul:1,shapes:[c(C("0,-2 -20,-13 -13,-2 -20,9 0,2"),"#f59e0b"),c(C("0,-2 -17,-10 -12,-2 -17,7 0,1"),"#fde047",{op:.85})],rays:[[-20,-13],[-13,-2],[-20,9]]},body:c("M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z","url(#tangBodyGrad)"),marks:[c("M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z","#0f172a",{op:.88})],over:[c(x(19,2,1.5),"#facc15",{op:.8})],eye:{x:18,y:-6,r:2.8,iris:"#0f172a",hl:"#93c5fd"},area:[-2,0,20,16]}),Ai=()=>E({fins:[c("M -16,-8 C -8,-17 8,-16 14,-9 Z","#facc15",{op:.9})],tail:{at:[-22,0],mul:1,shapes:[c("M 0,0 C -8,-9 -14,-9 -15,0 C -14,9 -8,9 0,0 Z","#facc15")],rays:[[-13,-5],[-15,0],[-13,5]]},body:c($(0,0,22,10.5),"#facc15"),marks:[c("M -4,-10.3 A 22,10.5 0 0,1 22,0 A 22,10.5 0 0,1 -4,10.3 C 3,5 3,-5 -4,-10.3 Z","#7c3aed"),c("M 10,-3 L 22,-1",void 0,{stroke:"#1e1b4b",sw:1.4,lc:"round"})],eye:{x:16,y:-3,r:2.6,iris:"#fde68a"},area:[0,0,18,8]}),Ei=()=>{let t=(e,r)=>c(e,void 0,{stroke:"#ea580c",sw:1.3,op:r});return E({tail:{at:[-22,0],mul:1,shapes:[c(C("0,0 -12,-9 -8,0 -12,9"),"#fbbf24",{op:.9})],rays:[[-12,-9],[-8,0],[-12,9]]},body:c($(0,0,23,20),"url(#butterflyBodyGrad)"),marks:[t(re(-14,-16,-8,17),.55),t(re(-6,-19,0,19),.55),t(re(2,-19,7,19),.55),t(re(10,-17,14,16),.5)],over:[c("M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z","#fbbf24"),c(x(-15,0,3),"#1f2937",{op:.8}),c(x(-15,0,1.6),"#fbbf24",{op:.9})],eye:{x:12.5,y:-4,r:2.6,iris:"#0f172a",hl:"#e2e8f0"},area:[0,0,20,17]})},Ti=()=>E({fins:[c(C("-14,-15 0,-24 16,-12"),"#fde047",{op:.95}),c(C("-12,15 2,23 16,12"),"#fde047",{op:.95})],tail:{at:[-22,0],mul:1,shapes:[c(C("0,0 -12,-10 -8,0 -12,10"),"#fde047")],rays:[[-12,-10],[-8,0],[-12,10]]},body:c($(0,0,22,17),"#fde047"),marks:[c($(2,8,16,6),"#fef9c3",{op:.7})],over:[c("M 20,-3 Q 27,-1 28,0 Q 27,1 20,3 Z","#fde047"),c(x(-19,0,1.6),"#ffffff",{op:.9})],eye:{x:14,y:-5,r:2.6,iris:"#ffffff"},area:[0,0,17,14]}),Li=()=>E({fins:[c(C("-6,-7 4,-14 12,-7"),"#2dd4bf",{op:.9}),c(C("-8,7 0,12 8,7"),"#2dd4bf",{op:.9})],tail:{at:[-20,0],mul:1,shapes:[c(C("0,0 -14,-11 -9,0 -14,11"),"#2dd4bf")],rays:[[-14,-11],[-9,0],[-14,11]]},body:c($(0,0,20,8.5),"url(#chromisGrad)"),marks:[c($(0,4,15,2.6),"#e0f2fe",{op:.45})],eye:{x:14,y:-2,r:2.2},area:[0,0,16,7]}),Fi=()=>E({fins:[c(C("-12,-8 4,-20 14,-8"),"#fb923c",{op:.9})],tail:{at:[-21,0],mul:1,shapes:[c("M 0,0 L -8,-10 L -18,-16 L -8,-3 L -7,0 L -8,3 L -18,16 L -8,10 Z","#fb923c")],rays:[[-18,-16],[-7,0],[-18,16]]},body:c($(0,0,21,9),"#f97316"),marks:[c($(0,4.5,15,3.6),"#f9a8d4",{op:.65})],eye:{x:15,y:-2,r:2.4,iris:"#fde68a"},area:[0,0,16,7]}),Ri=t=>E({fins:[c("M -4,-20 C 2,-33 18,-31 21,-18 Z",t,{op:.8})],tail:{at:[-14,0],mul:1.1,shapes:[c("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z",t,{op:.88})],rays:[[-35,-11],[-43,17],[-21,34]]},body:c("M -14,4 C -16,-12 -4,-26 10,-22 C 22,-19 28,-8 27,2 C 26,12 18,18 8,18 C -4,18 -14,14 -14,4 Z",t),marks:[c($(4,9,12,6),"#ffffff",{op:.75}),c($(-4,-10,7,4),"#ffffff",{op:.55})],eye:{x:21,y:-3,r:3.4},area:[6,0,15,15]}),Pi=t=>E({fins:[c(C("-4,-16 4,-25 14,-17"),t,{op:.85})],tail:{at:[-16,0],mul:1,shapes:[c("M 0,0 L -48,-19 L -30,-1 Z",t,{op:.92}),c("M 0,0 L -48,19 L -30,1 Z",t,{op:.8})],rays:[[-48,-19],[-48,19]]},body:c("M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z",t),marks:[c($(6,-5,10,4),"#ffffff",{op:.65}),c($(-3,5,8,3.5),"#ffffff",{op:.55})],eye:{x:20,y:-3,r:3},area:[6,0,17,13]}),Oi=t=>E({tail:{at:[-14,0],mul:.8,shapes:[c("M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z",t,{op:.88})],rays:[[-30,-2],[-30,6]]},body:c(x(4,2,22),t),marks:[[-8,-4],[0,-12],[10,-10],[-10,6],[-2,0],[8,-2],[16,4],[-4,12],[6,10],[14,14]].map(([e,r])=>c(x(e,r,3.4),"#ffffff",{op:.32})),eye:{x:20,y:-1,r:3},area:[4,2,17,17]}),Ii=()=>E({fins:[c("M -6,-15 C 0,-27 14,-26 15,-14 Z","#fecdd3",{op:.85})],tail:{at:[-15,0],mul:1,shapes:[c("M 0,0 C -8,-16 -24,-20 -38,-13 C -31,-7 -30,-2 -32,3 C -28,10 -36,15 -38,19 C -24,22 -8,16 0,0 Z","#fecdd3",{op:.88})],rays:[[-38,-13],[-32,3],[-38,19]]},body:c($(4,2,21,17),"#ffedd5"),marks:[c($(-2,-6,14,7),"#fdba74",{op:.55})],over:[[22,-6,6],[16,-13,6.5],[8,-15,6],[1,-12,5]].map(([t,e,r])=>c(x(t,e,r),"#dc2626")),eye:{x:22,y:0,r:3},area:[4,3,16,13]}),Ni=()=>E({fins:[c("M -4,-18 C 2,-30 18,-28 20,-16 Z","#1f2937",{op:.85})],tail:{at:[-14,0],mul:1.1,shapes:[c("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z","#1f2937",{op:.9})],rays:[[-35,-11],[-43,17],[-21,34]]},body:c(x(6,1,21),"#111827"),marks:[c($(2,-9,12,5),"#475569",{op:.45})],over:[c($(23,-6,10.5,9),"#1f2937")],eye:{x:24,y:-6,r:6,iris:"#f59e0b"},area:[6,1,16,15]}),Bi=()=>E({fins:[c(C("-6,-14 4,-24 14,-14"),"#dbeafe",{op:.85})],tail:{at:[-20,0],mul:1,shapes:[c("M 0,0 C -10,-15 -28,-15 -34,-5 L -30,0 L -34,5 C -28,15 -10,15 0,0 Z","#dbeafe",{op:.85})],rays:[[-34,-5],[-30,0],[-34,5]]},body:c($(2,0,24,14),"#bfdbfe"),marks:[c($(-8,-4,9,6),"#f97316"),c($(9,4,6,4.5),"#dc2626"),c(x(2,-8,2.2),"#1e3a8a",{op:.75}),c(x(-2,7,1.8),"#111827",{op:.7}),c(x(14,-5,1.6),"#111827",{op:.7})],eye:{x:20,y:-3,r:3},area:[2,0,19,11]}),Rr=[bi,xi,wi,vi,ki,Mi],Pr=[Ci,Si,Ai,Ei,Ti,Li,Fi],Or=[Ri,Pi,Oi,Ii,Ni,Bi],hn={freshwater:Rr.length,saltwater:Pr.length,coldwater:Or.length};function Ir(t,e){let r=e.color||"#3b82f6",i=t==="saltwater"?Pr:t==="coldwater"?Or:Rr,o=Math.abs(Math.trunc(Number(e.species)))||0;return i[o%i.length](r)}function Ui(t){let[e,r,i,o]=t,s=[],n=0;for(let a=r-o*.7;a<=r+o*.7;a+=5){for(let l=e-i*.8+n%2*3;l<=e+i*.8;l+=6)((l-e)/i)**2+((a-r)/o)**2<=.72&&s.push(`M${l.toFixed(1)},${a.toFixed(1)} q3,2.4 6,0`);n++}return s.join(" ")}function Hi(t,e){let r=e.iris??"#ffffff",i=e.hl??"#ffffff";if(t==="cartoon"){let o=e.r*2.1;return u`
      <circle cx="${e.x}" cy="${e.y}" r="${o}" fill="#ffffff" stroke="${S}" stroke-width="1.5" />
      <circle cx="${e.x+o*.12}" cy="${e.y+o*.1}" r="${o*.6}" fill="#111827" />
      <circle cx="${e.x+o*.3}" cy="${e.y-o*.28}" r="${o*.26}" fill="#ffffff" />
      <circle cx="${e.x-o*.12}" cy="${e.y+o*.3}" r="${o*.12}" fill="#ffffff" />
    `}return t==="realistic"?u`
      <circle cx="${e.x}" cy="${e.y}" r="${e.r*1.15}" fill="${r==="#ffffff"?"#fef3c7":r}" stroke="#111827" stroke-opacity="0.8" stroke-width="0.9" />
      <circle cx="${e.x+.4}" cy="${e.y}" r="${e.r*.62}" fill="#000000" />
      <circle cx="${e.x-e.r*.3}" cy="${e.y-e.r*.4}" r="${e.r*.28}" fill="${i}" />
    `:u`
    <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="${r}" />
    <circle cx="${e.x+1}" cy="${e.y}" r="${e.r*.48}" fill="#0f172a" />
    <circle cx="${e.x+.4}" cy="${e.y-e.r*.4}" r="${e.r*.2}" fill="${i}" />
  `}function Di(t,e,r){let[i,o,s,n]=r.area,a=r.eye;return t==="cartoon"?u`
      ${_(c($(a.x-a.r*.4,a.y+a.r*3.1,a.r*1.3,a.r*.8),"#fb7185",{op:.7,stroke:"none"}))}
      ${_(c(`M${a.x+a.r*.6},${a.y+a.r*2.7} q${a.r*1.2},${a.r*1.1} ${a.r*2.4},0`,void 0,{stroke:S,sw:1.3,lc:"round"}))}
    `:t==="realistic"?u`
      ${e?u`<path d="${r.body.d}" fill="url(#shade)" />`:""}
      ${_(c(Ui(r.area),void 0,{stroke:"#0f172a",sw:.8,op:.22}))}
      ${_(c($(i-s*.15,o-n*.62,s*.6,Math.max(1.4,n*.13)),"#ffffff",{op:.3}))}
    `:u`
    ${_(c($(i,o+n*.55,s*.85,n*.4),"#ffffff",{op:.14}))}
    ${_(c(`M${a.x-a.r*1.6},${a.y+a.r*.8} q${-a.r*.9},${a.r*2.2} 0,${a.r*4.4}`,void 0,{stroke:"#0f172a",sw:1,op:.22,lc:"round"}))}
  `}function qi(t,e,r,i,o){let s=t==="cartoon",n=t==="cartoon"?[]:r.tail.rays,a=t==="realistic"?.32:.16;return u`
    ${r.fins.map(l=>_(l,s))}
    <g transform="translate(${r.tail.at[0]}, ${r.tail.at[1]}) rotate(${i*r.tail.mul})">
      ${r.tail.shapes.map(l=>_(l,s))}
      ${n.map(([l,d])=>_(c(`M0,0 L${l},${d}`,void 0,{stroke:"#0f172a",sw:.9,op:a})))}
    </g>
    ${_(r.body,s)}
    ${r.marks.map(l=>_(l,s))}
    ${Di(t,e,r)}
    ${r.over.map(l=>_(l,s))}
    ${r.pec?u`<g transform="translate(${r.pec.at[0]}, ${r.pec.at[1]}) rotate(${o})">${r.pec.shapes.map(l=>_(l,s))}</g>`:""}
    ${Hi(t,r.eye)}
  `}function Nr(t,e,r,i){let o=e.dir===-1,s=e.deathProgress||0,n=e.scale||1.4,a=(1-s).toFixed(2),l=s.toFixed(2),d=i?0:e.scare||0,f=i?0:Math.sin(t._animTime*(3.5*e.vx)+e.phase)*14*(1+.8*d),h=i?0:Math.sin(t._animTime*(4.5*e.vx)+e.phase)*10,p=qi(L(t),R(t),Ir(r,e),f,h);return u`
    <g transform="scale(${o?-n:n}, ${i?-n:n})">
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
  `}function $t(t,e){let r=`M${t[0]},${t[1]}`;for(let o of e)r+=` C${o.join(",")}`;let i=[t,...e.map(o=>[o[4],o[5]])];for(let o=e.length-1;o>=0;o--){let[s,n,a,l]=e[o];r+=` C${-a},${l} ${-s},${n} ${-i[o][0]},${i[o][1]}`}return`${r} Z`}function yt(t,e,r){return{k:(s,n,a)=>B(t,e,s,n,{...t==="cartoon"?{}:r,...a===void 0?{}:{op:a}}),line:(s,n,a,l)=>_(c(s,void 0,{stroke:a,sw:n,op:l,lc:"round"}))}}var oe=t=>u`${t}<g transform="scale(-1,1)">${t}</g>`;function Se(t,e,r){return u`
    ${_(c(x(t,e,r),"#ffffff",{stroke:S,sw:1.2}))}
    ${_(c(x(t+r*.15,e+r*.1,r*.58),"#111827",{stroke:"none"}))}
    ${_(c(x(t+r*.32,e-r*.3,r*.24),"#ffffff",{stroke:"none"}))}
  `}function Br(t,e,r){let i=t==="cartoon",{k:o,line:s}=yt(t,e,{stroke:"#0a0f14",sw:.8}),n=Array.from({length:18},(a,l)=>{let d=l/18*Math.PI*2,[f,h]=[Math.cos(d),Math.sin(d)];return`M${(f*6.5).toFixed(1)},${(h*5).toFixed(1)} L${(f*8.6).toFixed(1)},${(h*6.7).toFixed(1)}`}).join(" ");return u`
    ${o($t([0,73],[[3,75,8,80,9,89],[6,91,2,88,0,84]]),"#182026")}
    ${t==="cartoon"?"":oe(s("M 1,76 L 6,88 M 1,76 L 8,86",.7,"#64748b",.5))}
    ${oe(u`
      ${o("M 15,12 C 24,12 32,20 34,32 C 33,38 28,40 24,36 C 19,30 16,22 15,16 Z","#182026")}
      ${i?"":s("M 16,15 L 33,26 M 16,17 L 33,32 M 17,19 L 30,37 M 18,20 L 25,37",.7,"#64748b",.5)}
      ${s("M 15,12 C 24,12 31,19 34,31",1.5,"#64748b",.9)}
      ${o("M 9,38 C 15,40 20,47 19,55 C 16,57 12,53 10,48 Z","#182026")}
      ${i?"":s("M 10,41 L 18,52 M 11,43 L 15,54",.6,"#64748b",.5)}
      ${o("M 4,60 C 7,60 9,64 8,68 C 6,68 4,66 3,64 Z","#182026")}
    `)}
    ${o($t([0,-11],[[7,-11,13,-8,15,-1],[17,6,18,12,16,18],[14,28,11,42,8,56],[6,64,3,71,0,75]]),"#1e293b")}
    ${o($t([0,14],[[7,14,10,22,9,32],[8,44,6,56,4,66],[3,69,2,71,0,72]]),"#475569",.9)}
    ${t==="flat"?[[-3,24,1.2],[4,30,1],[-5,38,1.3],[3,46,1],[-3,54,1.2],[2,62,.9],[-1,32,.8],[5,52,.8]].map(([a,l,d])=>_(c(x(a,l,d),"#ffffff",{op:.7,stroke:"none"}))):""}
    ${t==="realistic"?oe(s("M 12,20 C 10,34 8,48 5,62",.9,"#0a0f14",.4)):""}
    ${oe(u`
      ${s("M 6,-8 C 9,-12 12,-14 13,-19",2.2,"#3b4a5f",1)}
      ${s("M 10,-14 C 13,-15 15,-17 16,-20",1.6,"#3b4a5f",1)}
      ${s("M 2.5,-10 C 3.5,-14 3,-18 1.5,-21",2.2,"#3b4a5f",1)}
    `)}
    <g transform="translate(0, 3) scale(${r},${r})">
      ${_(c($(0,0,9.2,7.2),"#64748b",{stroke:"#0a0f14",sw:.9}))}
      ${t==="cartoon"?"":s(n,.6,"#94a3b8",.7)}
      ${_(c($(0,0,6.3,4.8),"#334155",{stroke:"#0a0f14",sw:.7}))}
      ${_(c($(0,0,3.4,2.5),"#0f172a",{stroke:"none"}))}
    </g>
    ${i?u`${Se(-9,-3,3.8)}${Se(9,-3,3.8)}${_(c($(-13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}${_(c($(13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}`:oe(u`${_(c(x(12.3,-3,1.7),"#0a0f14",{stroke:"none"}))}${_(c(x(12.7,-3.5,.5),"#f1f5f9",{stroke:"none"}))}`)}
    ${t==="realistic"?_(c($(-4,34,2.4,14),"#ffffff",{op:.1,stroke:"none"})):""}
  `}function Ur(t,e){let r=t==="cartoon",{k:i,line:o}=yt(t,e,{stroke:"#7f1d1d",sw:.8}),[s,n,a]=[22,28,27],l=(g,b=a)=>[s+b*Math.cos(g*Math.PI/180),n+b*Math.sin(g*Math.PI/180)],d=[4,3,2,1,0].map(g=>{let b=-110+g*13,[v,w]=l(b),k=8-g*.8;return u`<g transform="rotate(${b} ${v.toFixed(1)} ${w.toFixed(1)})">${i($(Number(v.toFixed(1)),Number(w.toFixed(1)),k,6.6-g*.25),g%2?"#c81e1e":"#d42424")}</g>`}),f=[0,1,2,3,4].map(g=>{let b=-110+g*13,v=8-g*.8,[w,k]=l(b,a-v),[M,P]=l(b,a-v-4.5);return`M${w.toFixed(1)},${k.toFixed(1)} L${M.toFixed(1)},${P.toFixed(1)}`}).join(" "),[h,p]=l(-45);return u`
    ${o("M -24,8 L -27,16 L -31,21 M -16,9 L -17,17 L -20,22 M -8,9 L -8,17 L -10,22 M 0,9 L 1,17 L 0,22",1.6,"#7f1d1d",.85)}
    ${o(f,1.3,"#7f1d1d",.7)}
    <g transform="translate(${h.toFixed(1)} ${p.toFixed(1)}) rotate(${45})">
      ${i("M 0,-2.4 C 5,-9.5 11,-10.5 14,-7 C 11,-3.2 6,-1 0,0 Z","#dc2626")}
      ${i("M 0,2.4 C 5,9.5 11,10.5 14,7 C 11,3.2 6,1 0,0 Z","#dc2626")}
      ${i("M 0,-3 C 6,-3 11,-1.6 15,0 C 11,1.6 6,3 0,3 Z","#ef4444")}
      ${r?"":o("M 2,-1.5 L 12,-7 M 2,0 L 13,0 M 2,1.5 L 12,7",.7,"#7f1d1d",.5)}
    </g>
    ${d}
    ${i("M -34,-3 C -34,-11 -25,-16 -12,-16 C 0,-16 10,-12 13,-4 C 15,1 12,6 6,8 L -14,8 C -27,8 -34,3 -34,-3 Z","#dc2626")}
    ${r?"":o("M -28,-12 C -18,-17 -2,-17 8,-14 C 12,-14 14,-12 16,-9",2.2,"#fef2f2",.85)}
    ${i("M -33,-9 L -50,-13 L -35,-3 Z","#dc2626")}
    ${o("M -32,-12 Q -60,-24 -88,-30 M -30,-9 Q -54,-12 -80,-10",1.1,"#fef9c3",.9)}
    ${o("M -33,-9 Q -44,-8 -50,-2",1,"#fef9c3",.8)}
    ${r?u`${Se(-26,-12,5)}${_(c($(-22,-2,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${_(c("M -32,-4 Q -28,1 -23,-3",void 0,{stroke:S,sw:1.2,lc:"round"}))}`:u`
          ${_(c(x(-27,-13,3),"#0f172a",{stroke:"none"}))}
          ${_(c(x(-27.8,-14,.9),"#f1f5f9",{stroke:"none"}))}
        `}
    ${t==="flat"?[[-22,-7],[-14,-10],[-6,-10],[1,-7]].map(([g,b])=>_(c(x(g,b,1.5),"#fef2f2",{op:.9,stroke:"none"}))):""}
    ${t==="realistic"?_(c($(-8,-14,12,1.6),"#ffffff",{op:.35,stroke:"none"})):""}
  `}function Hr(t,e){let r=t==="cartoon",{k:i,line:o}=yt(t,e,{stroke:"#7c2d12",sw:.9});return u`
    ${oe(u`
      ${(n=>o("M 22,-4 L 33,-11 L 42,-6 M 24,1 L 36,1 L 44,7 M 22,7 L 32,14 L 38,24 M 16,12 L 22,22 L 25,32",n,"#7c2d12",1))(r?3.2:2.6)}
      ${r?"":o("M 22,-4 L 33,-11 M 24,1 L 36,1 M 22,7 L 32,14 M 16,12 L 22,22",.8,"#f87171",.5)}
      ${o("M 20,-8 L 30,-17",r?4:3.4,"#7c2d12",1)}
      ${i("M 27,-19 C 25,-30 34,-36 41,-33 C 46,-30 45,-25 41,-24 C 45,-21 43,-16 38,-16 C 33,-16 29,-17 27,-19 Z","#ea580c")}
      ${i("M 31,-31 C 33,-40 42,-42 46,-37 C 42,-38 38,-36 36,-32 Z","#ea580c")}
      ${t==="cartoon"?"":_(c("M 36,-28 L 39,-31 L 40,-27 L 43,-29 M 34,-21 L 38,-22 L 38,-19 L 42,-20",void 0,{stroke:"#fef3c7",sw:.9,lc:"round",op:.8}))}
    `)}
    ${i("M 0,-15 C 10,-16 20,-14 26,-8 L 30,-2 L 27,4 C 24,12 14,18 0,18 C -14,18 -24,12 -27,4 L -30,-2 L -26,-8 C -20,-14 -10,-16 0,-15 Z","#dc2626")}
    ${i("M 0,-11 C 9,-12 17,-10 22,-5 L 24,0 C 22,8 12,13 0,13 C -12,13 -22,8 -24,0 L -22,-5 C -17,-10 -9,-12 0,-11 Z","#ef4444",.55)}
    ${t==="cartoon"?"":u`
          ${o("M -14,-6 Q 0,-13 14,-6 M -16,2 Q 0,-4 16,2 M 0,-12 L 0,12",.9,"#7f1d1d",.4)}
          ${t==="flat"?[[-9,3,1.6],[9,4,1.6],[0,8,1.4],[6,-5,1.2],[-7,-4,1.2]].map(([n,a,l])=>_(c(x(n,a,l),"#fca5a5",{op:.85,stroke:"none"}))):""}
        `}
    ${oe(u`${o("M 6,-15 L 7,-21",1.4,"#7c2d12",1)}${r?"":_(c(x(7,-22,2.2),"#0f172a",{stroke:"none"}))}`)}
    ${r?u`${Se(-7,-23,5)}${Se(7,-23,5)}${_(c("M -6,8 Q 0,14 6,8",void 0,{stroke:S,sw:1.4,lc:"round"}))}${_(c($(-15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${_(c($(15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}`:""}
    ${t==="realistic"?_(c($(-7,-8,11,2.2),"#ffffff",{op:.3,stroke:"none"})):""}
  `}function Dr(t,e){if(!t._ancistrus)return u``;let r=t._ancistrus,i=r.deathProgress||0,o=(1-i).toFixed(2),s=e?1:Number((1+Math.sin(t._ambientTime*1.6)*.07).toFixed(3)),n=L(t),a=R(t);return u`
    <g transform="translate(${r.x}, ${r.y}) rotate(${e?0:(r.heading??0).toFixed(1)}) scale(1.5,${e?-1.5:1.5})">
      <g opacity="${o}">
        ${Br(n,a,s)}
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
  `}function qr(t,e){if(!t._shrimp)return u``;let r=t._shrimp,o=(1-(r.deathProgress||0)).toFixed(2),s=r.dir===-1?-1:1;return u`
    <g transform="translate(${r.x}, ${r.y}) scale(${s*1.5}, ${e?-1.5:1.5})" opacity="${o}">
      ${Ur(L(t),R(t))}
    </g>
  `}function Vr(t,e){if(!t._crab)return u``;let r=t._crab,o=(1-(r.deathProgress||0)).toFixed(2),s=r.dir===-1?-1:1;return u`
    <g transform="translate(${r.x}, ${r.y}) scale(${s*1.4}, ${e?-1.4:1.4})" opacity="${o}">
      ${Hr(L(t),R(t))}
    </g>
  `}function Zr(t){return u`
    <g>
      ${t._flowBubbles.filter(e=>e.active).map(e=>u`<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="${e.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`)}
    </g>
  `}function Qr(t){return t._food.length?u`
    <g>
      ${t._food.map(e=>u`<ellipse cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" rx="${e.r.toFixed(1)}" ry="${(e.r*.6).toFixed(1)}" fill="${e.color}" stroke="#b45309" stroke-width="0.6" />`)}
    </g>
  `:u``}function Gr(t){if(!t._ripples.length)return u``;let e=Date.now();return u`
    <g>
      ${t._ripples.map(r=>{let i=Math.min(1,(e-r.born)/Be),o=(1-i).toFixed(2);return u`
          <circle cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="${(14+i*150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5-i*3).toFixed(1)}" stroke-opacity="${o}" />
          ${t._profile.doubleRipple?u`<circle cx="${r.x.toFixed(1)}" cy="${r.y.toFixed(1)}" r="${(6+i*90).toFixed(1)}" fill="#ffffff" fill-opacity="${(.28*(1-i)).toFixed(2)}" />`:""}
        `})}
    </g>
  `}function zr(t){return u`
    <g>
      ${t.map(e=>u`
          <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
        `)}
    </g>
  `}function jr(t){return u`
    <g>
      ${t.map(e=>u`
          <circle cx="${e.x}" cy="${e.y}" r="${e.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
        `)}
    </g>
  `}function Wr(t,e){if(!e)return u``;let r=He(e.total,D(t._hass));return u`
    <g transform="translate(512, 96)" pointer-events="none">
      <text font-family="system-ui, sans-serif" font-size="54" font-weight="800" text-anchor="middle" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${r}</text>
    </g>
  `}function Xr(t){return!t._config?.show_fps||!t._fpsInfo?u``:u`
    <g pointer-events="none">
      <rect x="292" y="6" width="440" height="30" rx="8" fill="#000000" fill-opacity="0.72" />
      <text x="512" y="27" font-family="monospace" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${t._fpsInfo}</text>
    </g>
  `}function Yr(t,e,r){if(!e)return u``;let i=r?112:24+(t._config?.show_fps?38:0),o=G(D(t._hass),"label_sensor_unavailable");return u`
    <g transform="translate(0, ${i})" pointer-events="none">
      <rect x="362" y="0" width="300" height="34" rx="17" fill="#000000" fill-opacity="0.72" />
      <path d="M383 25 L393 8 L403 25 Z" fill="#f59e0b" />
      <rect x="392" y="13" width="2" height="7" fill="#0f172a" />
      <circle cx="393" cy="22.4" r="1.3" fill="#0f172a" />
      <text x="416" y="23" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${o}</text>
    </g>
  `}function Vi(t,e,r,i){let o=t==="cartoon",s=(l,d,f)=>B(t,e,l,d,{...o?{}:{stroke:"#a16207",sw:.7},...f===void 0?{}:{op:f}}),n=(l,d,f,h)=>_(c(l,void 0,{stroke:f,sw:d,op:h,lc:"round"}));return u`
    ${s($(-44,4,20,7),"#d8b45f",.95)}
    ${_(c($(-42,2.4,11,3.6),"#5b4423",{stroke:"none"}))}
    ${s("M -34,-1 C -40,-7 -47,-7 -49,-1 C -47,5 -40,6 -34,-1 Z","#fde68a")}
    ${s("M -28,-5 C -24,-13 -14,-15 -8,-11 L -10,-6 Z","#fde047",.9)}
    <g transform="rotate(${r.toFixed(2)} 2 -10)">
      ${s("M -6,-10 C -3,-26 8,-30 13,-23 C 12,-17 9,-12 7,-10 Z","#fde047",.95)}
      ${o?"":n("M -3,-13 C 0,-24 6,-27 11,-22",1.1,"#38bdf8",.8)}
    </g>
    ${s("M -34,-1 C -26,-6 -12,-11 6,-12 C 16,-12.5 26,-10 31,-5 C 34,-2 33,1 29,3 C 22,5.5 6,6 -10,4.5 C -24,3 -32,2 -34,-1 Z","#fde047")}
    ${_(c($(4,3,26,3.4),"#fef9c3",{op:.8,stroke:"none"}))}
    ${o?"":n("M -14,-9 L -15,4 M -2,-11 L -3,5 M 10,-11 L 9,5",2.4,"#fffbeb",.55)}
    ${o?"":[[22,-2,1.1],[17,-6,1],[26,-6,.9]].map(([l,d,f])=>_(c(x(l,d,f),"#38bdf8",{stroke:"none"})))}
    ${s("M 15,0 C 22,4 21,11 14,11 C 12,6 12,2 15,0 Z","#fde68a",.9)}
    ${n("M 17,-8 Q 13,-2 16,4",1+i*.3,"#a16207",.35)}
    ${o?u`
          ${_(c(x(25,-11,6),"#ffffff",{stroke:S,sw:1.3}))}
          ${_(c(x(26,-10.4,3.5),"#111827",{stroke:"none"}))}
          ${_(c(x(27.8,-12.6,1.4),"#ffffff",{stroke:"none"}))}
          ${_(c($(22,0,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
          ${n("M 32,0 Q 28,3.5 24,2",1.3,S,1)}
        `:u`
          ${_(c(x(25,-10,3.4),t==="realistic"?"#fef3c7":"#fffbeb",{stroke:"#111827",sw:.7,op:1}))}
          ${_(c(x(25.6,-10,1.8),"#0f172a",{stroke:"none"}))}
          ${_(c(x(24.6,-11,.6),"#ffffff",{stroke:"none"}))}
          ${n("M 33,0 Q 29,2 26,1",.9,"#a16207",.8)}
        `}
    ${t==="realistic"?_(c($(6,-8,14,1.6),"#ffffff",{op:.32,stroke:"none"})):""}
    ${t==="flat"?n("M -20,-6 Q -8,-9 4,-8",.8,"#a16207",.3):""}
  `}function Kr(t,e){if(!t._goby)return u``;let r=t._goby,o=(1-(r.deathProgress||0)).toFixed(2),s=e?0:Math.sin(t._ambientTime*1.4)*3,n=e?0:Math.sin(t._ambientTime*2.6);return u`
    <g transform="translate(${r.x}, ${r.y}) scale(1.3, ${e?-1.3:1.3})" opacity="${o}">
      ${Vi(L(t),R(t),s,n)}
    </g>
  `}var V="#0f172a",he="system-ui, sans-serif",W=62,Zi=30,Qi=92,ie=9,Gi=38,Jr=114,bt=138,eo=17,xt=992,De=170,q=62,to=10,wt=270,qe=135,zi=102;function ji(t,e,r){let i=s=>Jr-s*(Jr-Gi),o=i(e.tempFraction);return u`
    <g pointer-events="none">
      <rect x="${W-ie}" y="${Zi}" width="${ie*2}" height="${Qi}" rx="${ie}" fill="#ffffff" fill-opacity="0.9" stroke="${V}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${W}" cy="${bt}" r="${eo}" fill="#ffffff" fill-opacity="0.9" stroke="${V}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${W}" cy="${bt}" r="${eo-4}" fill="${e.tempColor}" />
      <rect x="${W-4.5}" y="${o}" width="9" height="${bt-o}" fill="${e.tempColor}" />
      ${e.ticks.map(s=>u`<line x1="${W-ie}" y1="${i(s)}" x2="${W-ie-8}" y2="${i(s)}" stroke="${V}" stroke-opacity="0.45" stroke-width="2" />`)}
      ${e.marks.map(s=>u`<line x1="${W+ie}" y1="${i(s.fraction)}" x2="${W+ie+12}" y2="${i(s.fraction)}" stroke="${s.color}" stroke-width="3.5" stroke-linecap="round" />`)}
      <text x="106" y="96" font-family="${he}" font-size="54" font-weight="800" fill="${V}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${F(t,r)}°</text>
    </g>
  `}function Wi(t,e,r,i,o){let s=r?u`<tspan dx="12" font-size="30" font-weight="700">/ ${Me(e,o)}</tspan><tspan dx="6" font-size="28" font-weight="800">L</tspan>`:u`<tspan dx="6" font-size="28" font-weight="800">L</tspan>`;return u`
    <g pointer-events="none">
      <text x="${xt}" y="86" text-anchor="end" font-family="${he}" font-size="58" font-weight="800" fill="${V}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${F(t,o)}${s}</text>
      <rect x="${xt-De}" y="104" width="${De}" height="9" rx="4.5" fill="${V}" fill-opacity="0.18" />
      <rect x="${xt-De}" y="104" width="${(i.volFraction*De).toFixed(1)}" height="9" rx="4.5" fill="${i.volColor}" />
    </g>
  `}function ro(t,e,r,i,o=[]){let s=2*Math.PI*q,n=wt/360*s,a=(qe+e*wt)*Math.PI/180,l=q*Math.cos(a),d=q*Math.sin(a);return u`
    <g transform="translate(${t}, ${zi})" pointer-events="none">
      <circle r="${q+26}" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
      <circle r="${q}" fill="none" stroke="rgba(15, 23, 42, 0.15)" stroke-width="${to}" stroke-linecap="round" stroke-dasharray="${n.toFixed(1)} ${s.toFixed(1)}" transform="rotate(${qe})" />
      <circle r="${q}" fill="none" stroke="${r}" stroke-width="${to}" stroke-linecap="round" stroke-dasharray="${(e*n).toFixed(1)} ${s.toFixed(1)}" transform="rotate(${qe})" />
      ${o.map(f=>{let h=(qe+f.fraction*wt)*Math.PI/180,[p,m]=[Math.cos(h),Math.sin(h)];return u`<line x1="${((q+8)*p).toFixed(1)}" y1="${((q+8)*m).toFixed(1)}" x2="${((q+18)*p).toFixed(1)}" y2="${((q+18)*m).toFixed(1)}" stroke="${f.color}" stroke-width="3.5" stroke-linecap="round" />`})}
      <circle cx="${l.toFixed(1)}" cy="${d.toFixed(1)}" r="8" fill="#ffffff" stroke="${r}" stroke-width="4" />
      ${i}
    </g>
  `}function oo({style:t,currentTemp:e,currentVolume:r,targetBudget:i,comfortMin:o,deadlyTemp:s,boilTemp:n,showBudget:a,forceTemp:l=!1,lang:d}){let f=rr({currentTemp:e,currentVolume:r,targetBudget:i,comfortMin:o,deadlyTemp:s,boilTemp:n}),h=e>0||l;if(t!=="arc")return u`
      ${h?ji(e,f,d):""}
      ${Wi(r,i,a,f,d)}
    `;let p=u`<text y="13" font-family="${he}" font-size="34" font-weight="800" fill="${V}" text-anchor="middle">${F(e,d)}°</text>`,m=a?u`
        <text y="4" font-family="${he}" font-size="34" font-weight="800" fill="${V}" text-anchor="middle">${F(r,d)}</text>
        <text y="30" font-family="${he}" font-size="20" font-weight="700" fill="${V}" text-anchor="middle">/ ${Me(i,d)} L</text>
      `:u`<text y="13" font-family="${he}" font-size="34" font-weight="800" fill="${V}" text-anchor="middle">${F(r,d)}<tspan dx="3" font-size="20" font-weight="800">L</tspan></text>`;return u`
    ${h?ro(102,f.tempFraction,f.tempColor,p,f.marks):""}
    ${ro(922,f.volFraction,f.volColor,m)}
  `}function io({isFullscreen:t,canvasH:e,canvasBottom:r,waterColorStart:i,waterColorEnd:o,isBoiling:s}){return u`
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
        <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
      </linearGradient>

      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${i}" stop-opacity="${s?"0.5":"0.25"}" />
        <stop offset="100%" stop-color="${o}" stop-opacity="${s?"0.75":"0.45"}" />
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
        ${t?u`<rect x="0" y="0" width="1024" height="${e}" />`:u`<rect x="12" y="14" width="1000" height="${r-14}" rx="18" ry="18" />`}
      </clipPath>
    </defs>
  `}function so({isFullscreen:t,canvasH:e,canvasBottom:r,tankBottom:i,theme:o}){return u`
    <rect
      x="${t?0:12}"
      y="${t?0:14}"
      width="${t?1024:1e3}"
      height="${t?e:r-14}"
      fill="${o.background}"
    />

    <path
      d="M ${t?0:12} ${i-60} Q 280 ${i-85}, 512 ${i-55} T ${t?1024:1012} ${i-60} L ${t?1024:1012} ${i} L ${t?0:12} ${i} Z"
      fill="${o.sandColor}"
    />
  `}function no(t,e){return t?u``:u`
    <rect x="12" y="14" width="1000" height="${e-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
    <rect x="4" y="${e}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
  `}var ao=["turret","ramshorn","round"],Xi={turret:"#a8a29e",ramshorn:"#dc2626",round:"#d97706"},lo="M -9,-0.5 C -9,-4 -6,-8 -3,-12 C 0,-8 2,-4 1.5,-0.5 Z",Yi="M -2.5,-4.5 a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0 a 3,3 0 0 1 6,0 a 4,4 0 0 1 -8,0";function Ki(t,e,r,i){let o=r==="cartoon"?{stroke:S,sw:.5}:{},s=d=>r==="realistic"&&i?u`<path d="${d}" fill="url(#shade)" />`:"",n=(d,f,h)=>r==="cartoon"?"":_(c(d,void 0,{stroke:f,sw:.5,op:h,lc:"round"})),a=r==="realistic"?"#000000":"#ffffff",l=r==="realistic"?.28:.5;return t==="turret"?u`
      ${_(c(lo,e,o))}
      ${s(lo)}
      ${n("M -8.4,-3 Q -3.5,-1.2 1.2,-3 M -7.4,-6 Q -3.3,-4.4 0.2,-6 M -6,-9 Q -3.2,-7.8 -0.8,-9",a,l)}
    `:t==="ramshorn"?u`
      ${_(c(x(-2.5,-4.5,5),e,o))}
      ${s(x(-2.5,-4.5,5))}
      ${n(Yi,a,l+.15)}
    `:u`
    ${_(c(x(-3,-4,5.5),e,o))}
    ${s(x(-3,-4,5.5))}
    <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
    ${r==="flat"?n("M -6.5,-4 A 3.5,3.5 0 1 1 -3,-0.5 M -5,-4 A 2,2 0 1 1 -3,-2","#ffffff",.5):""}
    ${r==="realistic"?n("M -7,-4 A 4,4 0 1 1 -3,0 M -5.4,-4 A 2.4,2.4 0 1 1 -3,-1.6","#000000",.28):""}
  `}function Ji(t,e,r,i,o){let s=r==="cartoon"?{stroke:S,sw:.5}:{},n=Xi[o];return u`
    ${Ki(o,t.color||"#854d0e",r,i)}
    ${e?"":u`
          ${_(c($(2,-1.5,5,2.2),n,s))}
          ${r==="realistic"&&i?u`<path d="${$(2,-1.5,5,2.2)}" fill="url(#shade)" />`:""}
          <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="${n}" stroke-width="0.8" />
          ${r==="cartoon"?u`${_(c(x(7.5,-5.7,1.5),"#ffffff",{stroke:S,sw:.5}))}${_(c(x(7.8,-5.6,.8),"#111827",{stroke:"none"}))}`:u`<circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />`}
        `}
  `}function co(t,e,r,i,o){return u`
    <g>
      ${t.map((s,n)=>{let a=s.type==="glass_left"?90:s.type==="glass_right"?-90:0,l=e==="saltwater"?n%2===0?3.5:4.2:1.8;return u`
          <g transform="translate(${s.x}, ${s.y}) rotate(${r?0:a}) scale(${s.dir*l},${l})">
            ${Ji(s,r,i,o,ao[n%ao.length])}
          </g>
        `})}
    </g>
  `}function fo(t,e){let{isFullscreen:r,canvasH:i,canvasBottom:o,ariaLabel:s,aspectWidth:n,aspectHeight:a,themeKey:l,theme:d,waterColorStart:f,waterColorEnd:h,isBoiling:p,isDead:m,waterRatio:g,waterSurfaceY:b,tankBottom:v,effectiveAlgaeHours:w,showReadings:k,forceTemp:M,displayedTemp:P,currentVolume:I,targetBudget:N,comfortMin:Z,deadlyTemp:ne,boilTemp:U,gaugeStyle:ae,showBudget:ue,cost:pe,lang:le,sensorLost:Qe}=e;return O`
    <svg
      role="img"
      aria-label="${s}"
      @click=${Y=>t._onTankTap(Y)}
      viewBox="0 0 1024 ${i}"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="${t._profile.antialias?"auto":"optimizeSpeed"}"
      style="${r?"width: 100%; height: 100%;":`aspect-ratio: ${n} /${a};`}"
    >
      ${io({isFullscreen:r,canvasH:i,canvasBottom:o,waterColorStart:f,waterColorEnd:h,isBoiling:p})}

      <g clip-path="url(#innerTankClip)">
        ${so({isFullscreen:r,canvasH:i,canvasBottom:o,tankBottom:v,theme:d})}

        ${t._renderThemeDecoration(l,r,t._deathProgress)}

        ${co(t._snails,l,m,L(t),R(t))}

        ${g>0?u`
              <g>
                <rect
                  x="${r?0:12}"
                  y="${b-5}"
                  width="${r?1024:1e3}"
                  height="${v-b+5}"
                  fill="url(#waterGrad)"
                />
                ${t._renderWaterSurface(r?0:12,r?1024:1012,b)}
              </g>
            `:""}

        ${g>0&&!m?zr(t._bubbles):""}

        ${g>0&&!m?t._renderFlowBubbles():""}
        ${t._renderFood()}

        ${p&&g>0?jr(t._boilingBubbles):""}

        <g>
          ${(t._fishes||[]).map(Y=>u`
              <g transform="translate(${Y.x},${Y.y})">
                ${t._renderFishShape(Y,l,m)}
              </g>
            `)}
        </g>

        ${l==="freshwater"?t._renderAncistrus(m):""}
        ${l==="saltwater"?t._renderShrimp(m):""}
        ${l==="saltwater"?t._renderCrab(m):""}
        ${l==="saltwater"?t._renderGoby(m):""}
        ${t._renderAlgae(w,r)}
        ${t._renderRipples()}

        <!-- Modern Frosted Glass HUD Gauges -->
        ${r&&k?oo({style:ae,currentTemp:P,currentVolume:I,targetBudget:N,comfortMin:Z,deadlyTemp:ne,boilTemp:U,showBudget:ue,forceTemp:M,lang:le}):""}
        ${r&&k?t._renderCostLabel(pe):""}

        ${t._renderFpsBadge()}
        ${Yr(t,Qe,r&&k)}
      </g>

      ${no(r,o)}
    </svg>
  `}function ho(t){let{currentVolume:e,displayedRemaining:r,targetBudget:i,currentTemp:o,tempTileColor:s,cost:n,lang:a,t:l}=t;return O`
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-value">${F(e,a)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_consumed")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${F(r,a)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_remaining")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${Me(i,a)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${l("label_target")}</div>
      </div>
      ${o>0?O`
            <div class="metric-box">
              <div
                class="metric-value"
                style="color: ${s};"
              >
                ${F(o,a)} <span class="metric-unit">°C</span>
              </div>
              <div class="metric-label">${l("label_temperature")}</div>
            </div>
          `:""}
      ${n?O`
            <div class="metric-box">
              <div class="metric-value">${He(n.total,a)}</div>
              <div class="metric-label">${l("label_cost")}</div>
            </div>
          `:""}
    </div>
  `}function uo(t=()=>Math.random()){return{snails:[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],ancistrus:{x:70,y:340,targetX:70,targetY:340,heading:0,state:"idle",idleUntil:0,deathProgress:0},shrimp:{x:840,y:550,targetX:840,state:"idle",idleUntil:0,dir:-1,deathProgress:0},crab:{x:(T.ledgeFrom+T.ledgeTo)/2,y:565-(T.ledge+30),targetX:(T.ledgeFrom+T.ledgeTo)/2,state:"idle",idleUntil:0,dir:1,deathProgress:0},goby:{x:530,y:551,targetX:530,state:"idle",idleUntil:0,dir:1,deathProgress:0},bubbles:[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],boilingBubbles:Array.from({length:24},()=>({x:10+t()*1004,y:30+t()*540,vy:2.5+t()*3.5,vx:(t()-.5)*1.5,r:4+t()*8})),flowBubbles:Array.from({length:36},()=>({active:!1,x:512,baseX:512,y:0,vy:2,r:3,phase:0}))}}var es=4500,ts=6e3,rs=16.66;function po({timestamp:t,deltaMs:e,delta:r,nowMs:i,animTime:o,tank:s,userSpeed:n,themeKey:a}){let{tankTop:l,tankBottom:d,waterSurfaceY:f,waterRatio:h,isDead:p,isBoiling:m,speedMultiplier:g}=s;return{timestamp:t,deltaMs:e,delta:r,nowMs:i,animTime:o,userSpeed:n,themeKey:a,tankTop:l,tankBottom:d,waterSurfaceY:f,waterRatio:h,isDead:p,isBoiling:m,speedMultiplier:g,deathStep:(e||rs)/es}}function mo(t,e,r){return e?Math.min(1,(t||0)+r):0}function _o(t,e,r){let i=t+(e-t)*Math.min(1,.03*r);return i<.005&&e===0?0:i}function go(t,e){return t.filter(r=>e-r.born<Be)}function $o(t,e){let{isDead:r,waterRatio:i,delta:o,animTime:s,waterSurfaceY:n,tankBottom:a,nowMs:l}=e;return r||i<=0?{food:[],changed:!1}:t.length===0?{food:t,changed:!1}:(t.forEach(d=>{d.landedAt||(d.y+=d.vy*o,d.x+=Math.sin(s*1.5+d.phase)*.25*o,d.y<n&&(d.y=n),d.y>=a-30&&(d.y=a-30,d.landedAt=l))}),{food:t.filter(d=>!d.eaten&&!(d.landedAt&&l-d.landedAt>ts)),changed:!0})}function yo(t,e,r,i,o=Math.random){let{waterRatio:s,isDead:n,tankBottom:a,waterSurfaceY:l,delta:d,animTime:f}=e,h=s>0&&!n?ar(r,i):0,p=!1;return t.forEach((m,g)=>{if(!m.active){g<h&&(m.active=!0,m.baseX=512+(o()-.5)*90,m.x=m.baseX,m.y=a-10-o()*40,m.vy=1.8+o()*2.2+r*1.2,m.r=2+o()*4,m.phase=o()*Math.PI*2);return}m.y-=m.vy*d,m.x=m.baseX+Math.sin(f*2+m.phase)*6,(m.y<l+2||n)&&(m.active=!1),p=!0}),p}function bo(t,e){let{waterRatio:r,isDead:i,delta:o,waterSurfaceY:s,tankBottom:n}=e;return!(r>0&&!i)||t.length===0?!1:(t.forEach(a=>{a.y-=a.vy*o,a.y<s&&(a.y=n-15)}),!0)}function xo(t,e,r=Math.random){let{isBoiling:i,waterRatio:o,delta:s,waterSurfaceY:n,tankBottom:a}=e;return!(i&&o>0)||t.length===0?!1:(t.forEach(l=>{l.y-=l.vy*s,l.x+=l.vx*s,l.y<n&&(l.y=a-15,l.x=10+r()*1004)}),!0)}function wo(t,e){let{tankBottom:r,tankTop:i,waterSurfaceY:o,themeKey:s}=e,n=s==="saltwater"&&t.species===0;return{minX:n?160:110,maxX:n?380:910,minY:n?Math.max(i+45,o+35,r-160):Math.max(i+45,o+35),maxY:r-45}}var Ae={rx:25,ry:16,factor:.85,push:1.4};function vo(t,e){if(e.isDead)return!1;let r=!1;for(let i=0;i<t.length;i++)for(let o=i+1;o<t.length;o++){let s=t[i],n=t[o],a=(s.scale||1.4)+(n.scale||1.4),l=s.x-n.x,d=s.y-n.y,f=Math.hypot(l/(Ae.rx*Ae.factor*a),d/(Ae.ry*Ae.factor*a));if(f>=1)continue;let h=Math.hypot(l,d),[p,m]=h<1e-6?[1,0]:[l/h,d/h],g=(1-f)*Ae.push*e.delta;s.x+=p*g,s.y+=m*g,n.x-=p*g,n.y-=m*g,r=!0}if(r)for(let i of t){let{minX:o,maxX:s,minY:n,maxY:a}=wo(i,e);i.x=Math.min(s,Math.max(o,i.x)),i.y=Math.min(a,Math.max(n,i.y))}return r}function ko(t,e,r){let{isDead:i,deathStep:o,tankBottom:s,delta:n,speedMultiplier:a}=e;if(i){t.deathProgress=Math.min(1,(t.deathProgress||0)+o),t.y=Math.min(s-30,t.y+1.2*n);return}t.deathProgress=0;let l=(t.scare??0)>.05?null:dr(t.x,t.y,r);l?(t._baseVy===void 0&&(t._baseVy=t.vy),Math.abs(l.x-t.x)>6&&(t.dir=l.x<t.x?-1:1),t.vy=Math.max(-1.1,Math.min(1.1,(l.y-t.y)*.02)),t._seeking=!0):t._seeking&&(t._baseVy!==void 0&&(t.vy=t._baseVy),t._seeking=!1);let d=l?1.8:1,{minX:f,maxX:h,minY:p,maxY:m}=wo(t,e);t.x+=t.vx*t.dir*a*d*n,t.y+=t.vy*a*n;let g=t.kickX??0,b=t.kickY??0;if(g||b){t.x+=g*n,t.y+=b*n;let v=Math.pow(.93,n);t.kickX=g*v,t.kickY=b*v;let w=Math.hypot(t.kickX,t.kickY);t.scare=Math.min(1,w/8),w<.15&&(t.kickX=0,t.kickY=0,t.scare=0)}if(r.length>0){let v=t.x+t.dir*22*(t.scale||1.4);r.forEach(w=>{!w.eaten&&Math.hypot(w.x-v,w.y-t.y)<28&&(w.eaten=!0)})}t.x<f?(t.x=f,t.dir=1):t.x>h&&(t.x=h,t.dir=-1),t.y<p?(t.y=p,t.vy=Math.abs(t.vy)):t.y>m&&(t.y=m,t.vy=-Math.abs(t.vy))}var os=.2;function Mo(t,e){let{isDead:r,tankBottom:i,tankTop:o,waterSurfaceY:s,delta:n}=e;if(r){t.y=Math.min(i-10,t.y+1.5*n);return}if(t.type==="bottom")t.y=i-10,t.x+=t.vx*t.dir*n,t.x<100?(t.x=100,t.dir=1):t.x>920&&(t.x=920,t.dir=-1);else if(t.type==="glass_left"||t.type==="glass_right"){let a=Math.max(o+35,s+25);if(t.y<a){t.vy=Math.abs(t.vy),t.y=Math.min(a,t.y+Math.max(t.vy,os)*n);return}t.y+=t.vy*n,t.y<a?(t.y=a,t.vy=Math.abs(t.vy)):t.y>i-25&&(t.y=i-25,t.vy=-Math.abs(t.vy))}}var X={durationMs:1800,radius:520,ancistrusFactor:7,crawlerFactor:6,ancistrusTurn:6};function Co(t,e,r,i,o,s=Math.random){let n=t.x-e,a=t.y-r,l=Math.hypot(n,a);if(l>X.radius)return!1;let d=l<1?s()*2*Math.PI:Math.atan2(n,-a),f=300+200*(1-l/X.radius);return t.targetX=Math.min(934,Math.max(90,t.x+Math.sin(d)*f)),t.targetY=Math.min(o.tankBottom-110,Math.max(Math.max(o.tankTop+65,o.waterSurfaceY+70),t.y-Math.cos(d)*f)),t.state="moving",t.fleeUntil=i+X.durationMs,!0}function Ve(t,e,r,i,o){if(Math.hypot(t.x-e,t.y-r)>X.radius)return!1;let s=o.fleeMinX??o.minX,n=o.fleeMaxX??o.maxX,a=t.x===e?t.dir||1:Math.sign(t.x-e),l=a>0?n:s;return Math.abs(l-t.x)<8&&(l=a>0?s:n),t.targetX=l,t.state="moving",t.fleeUntil=i+X.durationMs,!0}var Ee={speed:.8,turn:3,minTrip:140,maxTrip:420},is=(t,e)=>((e-t)%360+540)%360-180;function So(t,e,r=Math.random){let{isDead:i,deathStep:o,tankBottom:s,tankTop:n,waterSurfaceY:a,delta:l,timestamp:d,userSpeed:f,nowMs:h}=e,p=(t.fleeUntil??0)>h;if(i){t.deathProgress=Math.min(1,(t.deathProgress||0)+o),t.y=Math.min(s-35,t.y+1.2*l);return}t.deathProgress=0,t.heading=t.heading??0;let m=90,g=934,b=Math.max(n+65,a+70),v=s-110;if(t.idleUntil||(t.idleUntil=d+1e3+r()*2e3),t.state==="moving"){let w=t.targetX-t.x,k=t.targetY-t.y,M=Math.hypot(w,k),P=Math.atan2(w,-k)*180/Math.PI,I=(p?X.ancistrusTurn:Ee.turn)*l;t.heading+=Math.max(-I,Math.min(I,is(t.heading,P)));let N=Math.min(M,Ee.speed*f*(p?X.ancistrusFactor:1)*l);t.x+=w/(M||1)*N,t.y+=k/(M||1)*N,Math.hypot(t.targetX-t.x,t.targetY-t.y)<1.5&&(t.state="idle",t.idleUntil=d+(p?2500:1200)+r()*2e3)}else if(d>=t.idleUntil){t.state="moving";let w=r()*2*Math.PI,k=Ee.minTrip+r()*(Ee.maxTrip-Ee.minTrip);t.targetX=Math.min(g,Math.max(m,t.x+Math.sin(w)*k)),t.targetY=Math.min(v,Math.max(b,t.y-Math.cos(w)*k))}}var vt={minX:560,maxX:740,floorOffset:25,speed:.9,firstIdle:[1200,2e3],nextIdle:[1500,2500]},kt={minX:T.ledgeFrom,maxX:T.ledgeTo,floorOffset:T.ledge+30,speed:.5,firstIdle:[2e3,3e3],nextIdle:[2500,3500]},Mt={minX:530,maxX:530,fleeMinX:450,fleeMaxX:610,floorOffset:14,speed:.5,firstIdle:[2e3,3e3],nextIdle:[2500,3500]};function Ze(t,e,r,i=Math.random){let{isDead:o,deathStep:s,tankBottom:n,delta:a,timestamp:l,userSpeed:d,nowMs:f}=e,h=(t.fleeUntil??0)>f;if(o){t.deathProgress=Math.min(1,(t.deathProgress||0)+s);return}if(t.deathProgress=0,t.y=n-r.floorOffset,t.idleUntil||(t.idleUntil=l+r.firstIdle[0]+i()*r.firstIdle[1]),t.state==="moving"){let p=t.targetX-t.x;t.dir=p<0?-1:1;let m=Math.sign(p)*Math.min(Math.abs(p),r.speed*d*(h?X.crawlerFactor:1)*a);t.x+=m,Math.abs(t.targetX-t.x)<1.5&&(t.state="idle",t.idleUntil=l+r.nextIdle[0]+i()*r.nextIdle[1])}else l>=t.idleUntil&&(t.state="moving",t.targetX=r.minX+i()*(r.maxX-r.minX))}var se=()=>Math.random(),Ct=class extends H{static get properties(){return{_hass:{type:Object,hasChanged:()=>!1},preview:{type:Boolean},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_goby:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array},_flowBubbles:{type:Array},_food:{type:Array},_ripples:{type:Array},_fpsInfo:{type:String},_announcement:{type:String}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(e,r){let i=wr(e,r),o=i.entity||r.find(a=>a.includes("shower")||a.includes("hydrao"))||r[0]||"",s=i.temperature_entity||r.find(a=>a.includes("temperature")&&(a.includes("shower")||a.includes("hydrao")))||"",n=y;return{entity:o,temperature_entity:s,...i.comfort_temp_entity?{comfort_temp_entity:i.comfort_temp_entity}:{},title:n.title,theme:n.theme,aspect_ratio_width:n.aspect_ratio_width,aspect_ratio_height:n.aspect_ratio_height,fish_count:n.fish_count,target_budget:n.target_budget,survival_volume:n.survival_volume,temp_boiling_threshold:n.temp_boiling_threshold,temp_deadly_threshold:n.temp_deadly_threshold,algae_enabled:n.algae_enabled,algae_delay_hours:n.algae_delay_hours,algae_age:n.algae_age,fish_speed_multiplier:n.fish_speed_multiplier,fullscreen:n.fullscreen}}constructor(){super(),this._animationFrameId=null,this.preview=!1,this._deathProgress=0,this._flow=Ue(),this._flowIntensity=0,this._food=[],this._ripples=[],this._fpsInfo="",this._announcement="",this._announceFlip=!1,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=0,this._config=void 0,this._hass=void 0,this._viewport=null,this._resizeObserver=null,this._energyKwh=0,this._metrics=null,this._sensorLostSince=null,this._sensorTimer=null,this._metricsSignature="",this._onScreen=!0,this._pageVisible=typeof document>"u"||document.visibilityState!=="hidden",this._prefersReducedMotion=!1,this._intersectionObserver=null,this._motionQuery=null,this._onVisibilityChange=()=>{this._pageVisible=document.visibilityState!=="hidden",this._syncAnimation()},this._onMotionPreferenceChange=r=>{this._prefersReducedMotion=!!r.matches,this._syncAnimation()},this._lastTimestamp=0,this._lastFrameTs=0,this._animTime=0,this._ambientTime=0,this._lastAmbientTs=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=y.target_budget,this._cachedSurvivalVolume=y.survival_volume,this._cachedComfortMin=y.comfort_temp_min,this._lastTemperature=0,this._cachedHoursSinceLastShower=0,this._fishes=dt(4,"freshwater");let e=uo();this._snails=e.snails,this._ancistrus=e.ancistrus,this._shrimp=e.shrimp,this._crab=e.crab,this._goby=e.goby,this._bubbles=e.bubbles,this._boilingBubbles=e.boilingBubbles,this._flowBubbles=e.flowBubbles}static get styles(){return zt}_t(e){return G(D(this._hass),e)}_getCanvasHeight(){return er(this._config,this._viewport)}_updateCachedMetrics(){if(!this._hass||!this._config)return!1;let e=tr(this._hass,this._config,this._metrics);this._metrics=e,this._cachedConsumedVolume=e.consumedVolume,this._cachedHoursSinceLastShower=e.hoursSinceLastShower,this._cachedTemperature=e.temperature,this._cachedTargetBudget=e.targetBudget,this._cachedSurvivalVolume=e.survivalVolume,this._cachedComfortMin=e.comfortMin,e.consumedVolume<=0?this._lastTemperature=0:e.temperature>0&&(this._lastTemperature=e.temperature),this._trackSensor(e.sensorMissing);let r=_r(e,D(this._hass)),i=r!==this._metricsSignature;return this._metricsSignature=r,i}_trackSensor(e){if(!e){this._sensorLostSince=null,this._clearSensorTimer();return}this._sensorLostSince===null&&(this._sensorLostSince=Date.now()),this._scheduleSensorTimer()}_scheduleSensorTimer(){if(this._sensorTimer!==null||this._sensorLostSince===null||!this.isConnected)return;let e=Math.max(0,ct-(Date.now()-this._sensorLostSince));this._sensorTimer=setTimeout(()=>{this._sensorTimer=null,this.requestUpdate()},e)}_clearSensorTimer(){this._sensorTimer!==null&&(clearTimeout(this._sensorTimer),this._sensorTimer=null)}get _sensorLost(){return this._sensorLostSince!==null&&Date.now()-this._sensorLostSince>=ct}setConfig(e){if(!e||typeof e.entity!="string"||!e.entity.trim())throw new Error("Please define a valid entity.");let{config:r,warnings:i}=ut(Ie(e));i.forEach(o=>console.warn(`[shower-aquarium-card] ${o}`)),this._config={...y,...r},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen"),this._fishes=dt(this._config.fish_count,this._config.theme),this._flow=Ue(),this._food=[],this._metrics=null,this._lastTemperature=0,this._sensorLostSince=null,this._clearSensorTimer(),this._updateCachedMetrics(),this._syncAnimation(),this.requestUpdate()}set hass(e){this._hass=e;let r=this._updateCachedMetrics();this._trackFlow(),r&&this._onDataChanged()}get _visible(){return this._onScreen&&this._pageVisible}get _motionAllowed(){return gr(this._prefersReducedMotion,this._config?.respect_reduced_motion)}shouldUpdate(){return this._visible}_onResize(e,r){if(!this._config?.fullscreen)return;let i=this._getCanvasHeight();this._viewport={width:e,height:r},this._getCanvasHeight()!==i&&this._onDataChanged()}_onDataChanged(){this._visible&&!this._motionAllowed&&this._settleScene(),this.requestUpdate()}_settleScene(){let e=this._tankState();if(!e)return;let{isDead:r}=e;this._food=[],this._ripples=[],this._lastTimestamp=0;let i=yr(r);for(let o=0;o<i;o++)this._updatePhysics(1e3+o*$r);this._lastTimestamp=0}_syncAnimation(){if(!this.isConnected){this._stopAnimation();return}if(this._visible&&this._motionAllowed){this._startAnimation(),this.requestUpdate();return}this._stopAnimation(),this._visible&&(this._settleScene(),this.requestUpdate())}_trackFlow(){if(!this._hass||!this._config)return;let e=this._hass.states?.[this._config.entity]?.state;if(e===void 0||isNaN(parseFloat(e)))return;let r=this._cachedConsumedVolume,i=this._flow.lastVolume,o=this._config.cold_water_temp;i===null||r<i-1e-6?this._energyKwh=ft(r,this._cachedTemperature,o):r>i+1e-6&&(this._energyKwh+=ft(r-i,this._cachedTemperature,o)),this._flow=ir(this._flow,r,Date.now())}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this._pageVisible=document.visibilityState!=="hidden",typeof IntersectionObserver=="function"&&(this._intersectionObserver=new IntersectionObserver(e=>{let r=e[e.length-1];!r||r.isIntersecting===this._onScreen||(this._onScreen=r.isIntersecting,this._syncAnimation())}),this._intersectionObserver.observe(this)),typeof ResizeObserver=="function"&&(this._resizeObserver=new ResizeObserver(e=>{let r=e[e.length-1];r&&this._onResize(r.contentRect.width,r.contentRect.height)}),this._resizeObserver.observe(this)),typeof window.matchMedia=="function"&&(this._motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this._prefersReducedMotion=!!this._motionQuery.matches,this._motionQuery.addEventListener?.("change",this._onMotionPreferenceChange)),this._scheduleSensorTimer(),this._syncAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._clearSensorTimer(),document.removeEventListener("visibilitychange",this._onVisibilityChange),this._intersectionObserver?.disconnect(),this._intersectionObserver=null,this._resizeObserver?.disconnect(),this._resizeObserver=null,this._motionQuery?.removeEventListener?.("change",this._onMotionPreferenceChange),this._motionQuery=null,this._stopAnimation()}_sampleFps(e){this._fpsWindowStart||(this._fpsWindowStart=e);let r=e-this._fpsWindowStart;if(r<1e3)return;let i=Math.round(this._rafCount*1e3/r),o=Math.round(this._tickCount*1e3/r),s=this._config?.animation_quality||"max";this._fpsInfo=`v${Pe} \xB7 ${s} \xB7 display ${i}/s \xB7 drawn ${o}/s`,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=e,this.requestUpdate()}get _profile(){return ur(this._config?.animation_quality)}_startAnimation(){if(!this._animationFrameId){this._lastTimestamp=0,this._lastFrameTs=0,this._fpsWindowStart=0,this._rafCount=0,this._tickCount=0;let e=r=>{this._rafCount++,pr(r,this._lastFrameTs,this._profile.fps)&&(this._lastFrameTs=r,this._tickCount++,this._updatePhysics(r)),this._config?.show_fps&&this._sampleFps(r),this._animationFrameId=requestAnimationFrame(e)};this._animationFrameId=requestAnimationFrame(e)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(e){let r=this._config;if(!r)return;this._lastTimestamp||(this._lastTimestamp=e);let i=e-this._lastTimestamp,o=this._profile,s=Math.min(i/16.66,mr(o.fps));this._lastTimestamp=e,this._animTime=e*.0035,(!o.ambientHz||e-this._lastAmbientTs>=1e3/o.ambientHz)&&(this._ambientTime=this._animTime,this._lastAmbientTs=e);let n={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},a=Date.now(),l=po({timestamp:e,deltaMs:i,delta:s,nowMs:a,animTime:this._animTime,tank:Ne({config:r,metrics:n,canvasHeight:this._getCanvasHeight()}),userSpeed:r.fish_speed_multiplier,themeKey:r.theme||"freshwater"}),{isDead:d}=l,f=!1;this._deathProgress=mo(this._deathProgress,d,l.deathStep);let h=this._motionAllowed,p=d||!h?0:sr(this._flow,a);this._flowIntensity=_o(this._flowIntensity,p,s),nr(this._flow,a)&&(this._flow={...this._flow,showerActive:!1}),this._ripples.length>0&&(this._ripples=go(this._ripples,a),f=!0);let m=$o(this._food,l);m.food!==this._food&&(this._food=m.food),m.changed&&(f=!0),yo(this._flowBubbles,l,this._flowIntensity,o.flowBubbles,se)&&(f=!0),this._flowIntensity>0&&(f=!0),this._fishes&&this._fishes.length>0&&(this._fishes.forEach(g=>ko(g,l,this._food)),vo(this._fishes,l),f=!0),this._snails&&this._snails.length>0&&(this._snails.forEach(g=>Mo(g,l)),f=!0),this._ancistrus&&(So(this._ancistrus,l,se),f=!0),this._shrimp&&(Ze(this._shrimp,l,vt,se),f=!0),this._crab&&(Ze(this._crab,l,kt,se),f=!0),this._goby&&(Ze(this._goby,l,Mt,se),f=!0),this._bubbles&&bo(this._bubbles,l)&&(f=!0),this._boilingBubbles&&xo(this._boilingBubbles,l,se)&&(f=!0),f&&this.requestUpdate()}_renderWaterSurface(e,r,i){return Cr(this,e,r,i)}_renderThemeDecoration(e,r,i=0){return Lr(this,e,r,i)}_renderFishShape(e,r,i){return Nr(this,e,r,i)}_renderAncistrus(e){return Dr(this,e)}_renderShrimp(e){return qr(this,e)}_renderGoby(e){return Kr(this,e)}_renderCrab(e){return Vr(this,e)}_renderAlgae(e,r){return Fr(this,e,r)}_eventToSvgPoint(e){let r=e.currentTarget,i=r.getScreenCTM?r.getScreenCTM():null;if(!i)return null;let o=r.createSVGPoint();o.x=e.clientX,o.y=e.clientY;let s=o.matrixTransform(i.inverse());return{x:s.x,y:s.y}}_isEditorPreview(){if(this.preview)return!0;let e=this;for(;e;){let r=e,i=r.tagName?r.tagName.toLowerCase():"";if(i==="hui-card-preview"||i==="hui-dialog-edit-card"||i==="hui-dialog-suggest-card")return!0;e=r.parentNode||e.host||null}return!1}_tankState(){return this._config?Ne({config:this._config,metrics:{consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},canvasHeight:this._getCanvasHeight()}):null}_interactiveTank(){if(!this._hass||!this._motionAllowed)return null;let e=this._tankState();return e?e.isDead||e.waterRatio<=0?null:e:null}_dropFood(e,r){let i=Math.max(80,Math.min(944,e));this._food=[...this._food,...fr(i,r+2)].slice(-30)}_knockAt(e,r,i){let o=Date.now();this._ripples=[...this._ripples,{x:e,y:r,born:o}],(this._fishes||[]).forEach(s=>{let n=cr(s.x,s.y,e,r);n&&(s.kickX=n.kx,s.kickY=n.ky,s.scare=n.scare,Math.abs(n.kx)>.5&&(s.dir=n.kx<0?-1:1))}),this._ancistrus&&Co(this._ancistrus,e,r,o,i,se),this._shrimp&&Ve(this._shrimp,e,r,o,vt),this._crab&&Ve(this._crab,e,r,o,kt),this._goby&&Ve(this._goby,e,r,o,Mt)}_onTankTap(e){let r=this._interactiveTank();if(!r)return;let i=this._eventToSvgPoint(e);i&&(lr(i.y,r.waterSurfaceY)==="feed"?this._dropFood(i.x,r.waterSurfaceY):this._knockAt(i.x,i.y,r),this.requestUpdate())}_onFeedButton(){let e=this._interactiveTank();e&&(this._dropFood(ke/2,e.waterSurfaceY),this._announce("aria_food_dropped"),this.requestUpdate())}_onKnockButton(){let e=this._interactiveTank();e&&(this._knockAt(ke/2,(e.waterSurfaceY+e.tankBottom)/2,e),this._announce("aria_knocked"),this.requestUpdate())}_announce(e){this._announceFlip=!this._announceFlip,this._announcement=this._t(e)+(this._announceFlip?"\xA0":"")}_renderFlowBubbles(){return Zr(this)}_renderFood(){return Qr(this)}_renderRipples(){return Gr(this)}_renderCostLabel(e){return Wr(this,e)}_ariaLabel({currentVolume:e,currentTemp:r,targetBudget:i,isDead:o,isCritical:s,sensorLost:n=!1}){let a=D(this._hass),l={consumed:F(e,a),target:F(i,a,0),temperature:F(r,a)},d=[xr(this._t(r>0?"aria_summary_temperature":"aria_summary"),l)];return o?d.push(this._t("aria_dead")):s&&d.push(this._t("aria_over_budget")),n&&d.push(`${this._t("label_sensor_unavailable")}.`),d.join(" ")}_renderFpsBadge(){return Xr(this)}render(){if(!this._config||!this._hass)return O``;let e=!!this._config.fullscreen,r=this._getCanvasHeight(),i=r-35,o={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:s,currentTemp:n,targetBudget:a,boilTemp:l,deadlyTemp:d,waterRatio:f,tankBottom:h,waterSurfaceY:p,isDead:m,isBoiling:g,isCritical:b,isWarning:v}=Ne({config:this._config,metrics:o,canvasHeight:r}),w=this._motionAllowed&&!m&&f>0,k=D(this._hass),M=this._sensorLost,P=this._ariaLabel({currentVolume:s,currentTemp:n,targetBudget:a,isDead:m,isCritical:b,sensorLost:M}),I=Math.max(0,a-s),N=this._config.theme||"freshwater",Z=lt(N),ne=g||b?"#ef4444":v?"#38bdf8":Z.waterTop,U=g||b?"#991b1b":v?"#0284c7":Z.waterBottom,ae=!!(this._config.title&&this._config.title.trim().length>0),ue=this._config.aspect_ratio_width,pe=this._config.aspect_ratio_height,le=Number(this._config.algae_age)||0,Qe=le>0?le:this._cachedHoursSinceLastShower,Y=n>=d?"#ef4444":n>=l?"#f59e0b":"var(--primary-text-color, #111827)",St=this._config.show_cost?hr({volumeL:s,energyKwh:this._energyKwh,waterPricePerM3:this._config.water_price_per_m3,energyPricePerKwh:this._config.energy_price_per_kwh}):null;return O`
      <ha-card>
        ${!e&&ae?O`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          ${fo(this,{isFullscreen:e,canvasH:r,canvasBottom:i,ariaLabel:P,aspectWidth:ue,aspectHeight:pe,themeKey:N,theme:Z,waterColorStart:ne,waterColorEnd:U,isBoiling:g,isDead:m,waterRatio:f,waterSurfaceY:p,tankBottom:h,effectiveAlgaeHours:Qe,showReadings:s>0||this._isEditorPreview(),forceTemp:s<=0&&this._isEditorPreview(),displayedTemp:n>0?n:this._lastTemperature,currentVolume:s,targetBudget:a,comfortMin:this._cachedComfortMin,deadlyTemp:d,boilTemp:l,gaugeStyle:this._config.gauge_style,showBudget:this._config.show_budget,cost:St,lang:k,sensorLost:M})}

          <!-- The same two actions as a tap on the tank, for the keyboard and screen readers. -->
          <div class="keyboard-actions" role="group" aria-label="${this._t("aria_actions")}">
            <button type="button" class="kb-button" ?disabled=${!w} @click=${()=>this._onFeedButton()}>
              ${this._t("action_feed")}
            </button>
            <button type="button" class="kb-button" ?disabled=${!w} @click=${()=>this._onKnockButton()}>
              ${this._t("action_knock")}
            </button>
          </div>
          <div class="sr-only" role="status" aria-live="polite">${this._announcement}</div>
        </div>

        ${e?"":ho({currentVolume:s,displayedRemaining:I,targetBudget:a,currentTemp:n,tempTileColor:Y,cost:St,lang:k,t:To=>this._t(To)})}
      </ha-card>
    `}getCardSize(){return 6}getGridOptions(){let e={columns:12,min_columns:6};return this._config?.fullscreen&&(e.rows=8,e.min_rows=4),e}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",Ct);console.info(`%c SHOWER-AQUARIUM-CARD %c v${Pe} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");var Te=window;Te.customCards=Te.customCards||[];var Ao=Te.customCards.findIndex(t=>t.type==="shower-aquarium-card"),Eo={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${Pe})`,documentationURL:`${Gt}#readme`};Ao!==-1?Te.customCards[Ao]=Eo:Te.customCards.push(Eo);export{Ct as AquariumShowerCard};
