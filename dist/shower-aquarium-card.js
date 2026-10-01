var We=globalThis,Ye=We.ShadowRoot&&(We.ShadyCSS===void 0||We.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,gt=Symbol(),so=new WeakMap,Ce=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==gt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o,o=this.t;if(Ye&&t===void 0){let r=o!==void 0&&o.length===1;r&&(t=so.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&so.set(o,t))}return t}toString(){return this.cssText}},no=e=>new Ce(typeof e=="string"?e:e+"",void 0,gt),$t=(e,...t)=>{let o=e.length===1?e[0]:t.reduce((r,i,s)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Ce(o,e,gt)},ao=(e,t)=>{if(Ye)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(let o of t){let r=document.createElement("style"),i=We.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},yt=Ye?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(let r of t.cssRules)o+=r.cssText;return no(o)})(e):e;var{is:Ci,defineProperty:Ai,getOwnPropertyDescriptor:Ti,getOwnPropertyNames:Ei,getOwnPropertySymbols:Li,getPrototypeOf:Fi}=Object,ee=globalThis,lo=ee.trustedTypes,Ri=lo?lo.emptyScript:"",Oi=ee.reactiveElementPolyfillSupport,Ae=(e,t)=>e,bt={toAttribute(e,t){switch(t){case Boolean:e=e?Ri:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},ho=(e,t)=>!Ci(e,t),co={attribute:!0,type:String,converter:bt,reflect:!1,useDefault:!1,hasChanged:ho};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ee.litPropertyMetadata??(ee.litPropertyMetadata=new WeakMap);var X=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=co){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&Ai(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){let{get:i,set:s}=Ti(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:i,set(n){let a=i?.call(this);s?.call(this,n),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??co}static _$Ei(){if(this.hasOwnProperty(Ae("elementProperties")))return;let t=Fi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ae("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ae("properties"))){let o=this.properties,r=[...Ei(o),...Li(o)];for(let i of r)this.createProperty(i,o[i])}let t=this[Symbol.metadata];if(t!==null){let o=litPropertyMetadata.get(t);if(o!==void 0)for(let[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[o,r]of this.elementProperties){let i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let o=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)o.unshift(yt(i))}else t!==void 0&&o.push(yt(t));return o}static _$Eu(t,o){let r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,o=this.constructor.elementProperties;for(let r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ao(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:bt).toAttribute(o,r.type);this._$Em=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,o){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:bt;this._$Em=i;let a=n.fromAttribute(o,s.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,o,r,i=!1,s){if(t!==void 0){let n=this.constructor;if(i===!1&&(s=this[t]),r??(r=n.getPropertyOptions(t)),!((r.hasChanged??ho)(s,o)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:n}=s,a=this[i];n!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,s,a)}}let t=!1,o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(o)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(o)}willUpdate(t){}_$AE(t){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};X.elementStyles=[],X.shadowRootOptions={mode:"open"},X[Ae("elementProperties")]=new Map,X[Ae("finalized")]=new Map,Oi?.({ReactiveElement:X}),(ee.reactiveElementVersions??(ee.reactiveElementVersions=[])).push("2.1.2");var Ee=globalThis,fo=e=>e,Xe=Ee.trustedTypes,uo=Xe?Xe.createPolicy("lit-html",{createHTML:e=>e}):void 0,yo="$lit$",te=`lit$${Math.random().toFixed(9).slice(2)}$`,bo="?"+te,Ii=`<${bo}>`,ne=document,Le=()=>ne.createComment(""),Fe=e=>e===null||typeof e!="object"&&typeof e!="function",Ct=Array.isArray,Bi=e=>Ct(e)||typeof e?.[Symbol.iterator]=="function",xt=`[ 	
\f\r]`,Te=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,po=/-->/g,mo=/>/g,ie=RegExp(`>|${xt}(?:([^\\s"'>=/]+)(${xt}*=${xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_o=/'/g,go=/"/g,xo=/^(?:script|style|textarea|title)$/i,At=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),D=At(1),f=At(2),En=At(3),ae=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),$o=new WeakMap,se=ne.createTreeWalker(ne,129);function wo(e,t){if(!Ct(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return uo!==void 0?uo.createHTML(t):t}var Ni=(e,t)=>{let o=e.length-1,r=[],i,s=t===2?"<svg>":t===3?"<math>":"",n=Te;for(let a=0;a<o;a++){let l=e[a],c,d,u=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===Te?d[1]==="!--"?n=po:d[1]!==void 0?n=mo:d[2]!==void 0?(xo.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=ie):d[3]!==void 0&&(n=ie):n===ie?d[0]===">"?(n=i??Te,u=-1):d[1]===void 0?u=-2:(u=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?ie:d[3]==='"'?go:_o):n===go||n===_o?n=ie:n===po||n===mo?n=Te:(n=ie,i=void 0);let p=n===ie&&e[a+1].startsWith("/>")?" ":"";s+=n===Te?l+Ii:u>=0?(r.push(c),l.slice(0,u)+yo+l.slice(u)+te+p):l+te+(u===-2?a:p)}return[wo(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},Re=class e{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,n=0,a=t.length-1,l=this.parts,[c,d]=Ni(t,o);if(this.el=e.createElement(c,r),se.currentNode=this.el.content,o===2||o===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=se.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(yo)){let m=d[n++],p=i.getAttribute(u).split(te),_=/([.?@])?(.*)/.exec(m);l.push({type:1,index:s,name:_[2],strings:p,ctor:_[1]==="."?vt:_[1]==="?"?Mt:_[1]==="@"?kt:_e}),i.removeAttribute(u)}else u.startsWith(te)&&(l.push({type:6,index:s}),i.removeAttribute(u));if(xo.test(i.tagName)){let u=i.textContent.split(te),m=u.length-1;if(m>0){i.textContent=Xe?Xe.emptyScript:"";for(let p=0;p<m;p++)i.append(u[p],Le()),se.nextNode(),l.push({type:2,index:++s});i.append(u[m],Le())}}}else if(i.nodeType===8)if(i.data===bo)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(te,u+1))!==-1;)l.push({type:7,index:s}),u+=te.length-1}s++}}static createElement(t,o){let r=ne.createElement("template");return r.innerHTML=t,r}};function me(e,t,o=e,r){if(t===ae)return t;let i=r!==void 0?o._$Co?.[r]:o._$Cl,s=Fe(t)?void 0:t._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=me(e,i._$AS(e,t.values),i,r)),t}var wt=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:o},parts:r}=this._$AD,i=(t?.creationScope??ne).importNode(o,!0);se.currentNode=i;let s=se.nextNode(),n=0,a=0,l=r[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Oe(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new St(s,this,t)),this._$AV.push(c),l=r[++a]}n!==l?.index&&(s=se.nextNode(),n++)}return se.currentNode=ne,i}p(t){let o=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},Oe=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,o=this._$AM;return o!==void 0&&t?.nodeType===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=me(this,t,o),Fe(t)?t===C||t==null||t===""?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==ae&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Bi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==C&&Fe(this._$AH)?this._$AA.nextSibling.data=t:this.T(ne.createTextNode(t)),this._$AH=t}$(t){let{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Re.createElement(wo(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(o);else{let s=new wt(i,this),n=s.u(this.options);s.p(o),this.T(n),this._$AH=s}}_$AC(t){let o=$o.get(t.strings);return o===void 0&&$o.set(t.strings,o=new Re(t)),o}k(t){Ct(this._$AH)||(this._$AH=[],this._$AR());let o=this._$AH,r,i=0;for(let s of t)i===o.length?o.push(r=new e(this.O(Le()),this.O(Le()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);t!==this._$AB;){let r=fo(t).nextSibling;fo(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},_e=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=C}_$AI(t,o=this,r,i){let s=this.strings,n=!1;if(s===void 0)t=me(this,t,o,0),n=!Fe(t)||t!==this._$AH&&t!==ae,n&&(this._$AH=t);else{let a=t,l,c;for(t=s[0],l=0;l<s.length-1;l++)c=me(this,a[r+l],o,l),c===ae&&(c=this._$AH[l]),n||(n=!Fe(c)||c!==this._$AH[l]),c===C?t=C:t!==C&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},vt=class extends _e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}},Mt=class extends _e{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==C)}},kt=class extends _e{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=me(this,t,o,0)??C)===ae)return;let r=this._$AH,i=t===C&&r!==C||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==C&&(r===C||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},St=class{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){me(this,t)}};var Pi=Ee.litHtmlPolyfillSupport;Pi?.(Re,Oe),(Ee.litHtmlVersions??(Ee.litHtmlVersions=[])).push("3.3.3");var vo=(e,t,o)=>{let r=o?.renderBefore??t,i=r._$litPart$;if(i===void 0){let s=o?.renderBefore??null;r._$litPart$=i=new Oe(t.insertBefore(Le(),s),s,void 0,o??{})}return i._$AI(e),i};var Ie=globalThis,z=class extends X{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;let t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){let o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=vo(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ae}};z._$litElement$=!0,z.finalized=!0,Ie.litElementHydrateSupport?.({LitElement:z});var Ui=Ie.litElementPolyfillSupport;Ui?.({LitElement:z});(Ie.litElementVersions??(Ie.litElementVersions=[])).push("4.2.2");var Ke="0.8.87",Mo="https://github.com/Adrien40/ha-shower-aquarium-card";var y=Object.freeze({title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:5,temp_boiling_threshold:40,temp_deadly_threshold:45,comfort_temp_min:33,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,show_cost:!1,water_price_per_m3:4.5,energy_price_per_kwh:.25,cold_water_temp:15,animation_quality:"max",creature_style:"flat",respect_reduced_motion:!0,show_fps:!1,gauge_style:"thermometer",show_budget:!1,swipe_biotope:!0,show_gauges:!1,show_tiles:!0,use_threshold_colors:!0});var ko=$t`
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
`;var So={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche confort",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge actuel des algues",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)",field_animation_quality:"Qualit\xE9 d'animation",quality_max:"Maximale",quality_balanced:"\xC9quilibr\xE9e",quality_light:"L\xE9g\xE8re (Google Nest Hub)",helper_animation_quality:"L\xE9g\xE8re : 20 images/s et effets simplifi\xE9s, pour les \xE9crans peu puissants",field_respect_reduced_motion:"Suivre le mode \xAB mouvement r\xE9duit \xBB de l'appareil",field_show_fps:"Afficher les images par seconde (d\xE9bogage)",helper_show_fps:"Affichage de d\xE9bogage : indique une fois par seconde le nombre d'images dessin\xE9es.",helper_respect_reduced_motion:"Activ\xE9 : si votre tablette, t\xE9l\xE9phone ou ordinateur a le r\xE9glage \xAB r\xE9duire les animations \xBB (accessibilit\xE9), l'aquarium reste immobile. D\xE9sactiv\xE9 : l'aquarium s'anime toujours. Si vous ne voyez aucun mouvement, d\xE9sactivez cette option.",aria_summary:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L.",aria_summary_temperature:"Aquarium de douche : {consumed} L utilis\xE9s sur {target} L, eau \xE0 {temperature} \xB0C.",aria_dead:"Le bac est vide ou trop chaud : les animaux sont morts.",aria_over_budget:"Le volume cible est d\xE9pass\xE9.",section_aquarium:"Aquarium, animaux et algues",section_limits:"Limites (volume et temp\xE9rature)",section_cost:"Estimation du co\xFBt",section_display:"Affichage et performance",action_feed:"Nourrir les poissons",action_knock:"Taper sur la vitre",aria_actions:"Actions de l'aquarium",aria_food_dropped:"De la nourriture est tomb\xE9e dans le bac.",aria_knocked:"Vous avez tap\xE9 sur la vitre. Les poissons sont effray\xE9s.",field_comfort_temp_entity:"Entit\xE9 de temp\xE9rature de confort minimum (optionnel)",helper_comfort_temp_entity:"Temp\xE9rature minimale de confort, par exemple celle d'un pommeau Hydrao. Elle remplace la valeur ci-dessous.",field_comfort_temp:"Temp\xE9rature minimale de confort (\xB0C)",field_gauge_style:"Style des jauges",field_show_budget:"Afficher le budget sur la jauge de volume",option_gauge_thermometer:"Thermom\xE8tre et barre",option_gauge_arc:"Arcs ouverts",label_sensor_unavailable:"Capteur indisponible",helper_target_budget:"Utilis\xE9 seulement si l'entit\xE9 d'objectif ci-dessus est vide ou indisponible.",helper_fish_count:"Entre 1 et 10 : plus de poissons seraient \xE0 l'\xE9troit dans l'aquarium. Une valeur plus grande est ramen\xE9e \xE0 10.",helper_fish_speed:"Entre 0,2 et 3. Une valeur hors de cette plage est ramen\xE9e dedans.",field_creature_style:"Style des poissons et des autres \xEAtres vivants",option_creature_flat:"Plat et d\xE9taill\xE9",option_creature_cartoon:"Dessin anim\xE9",option_creature_realistic:"R\xE9aliste",helper_creature_style:"Le r\xE9aliste utilise des ombrages doux, que la qualit\xE9 d'animation l\xE9g\xE8re supprime",field_swipe_biotope:"Changer de biotope en glissant le doigt",helper_swipe_biotope:"Glissez horizontalement sur l'aquarium pour passer \xE0 l'eau douce, \xE0 l'eau de mer ou \xE0 l'eau froide. Le choix est gard\xE9 sur cet appareil ; changer le biotope dans cet \xE9diteur le remplace.",action_biotope:"Changer de biotope",aria_biotope:"Biotope : {name}.",helper_algae_age:"0 = automatique : l'\xE2ge suit le temps \xE9coul\xE9 depuis la derni\xE8re douche. Une valeur plus grande force l'\xE2ge des algues \xE0 cet instant, pour voir leur aspect.",field_show_gauges:"Afficher les jauges hors plein \xE9cran",helper_show_gauges:"Le thermom\xE8tre et le volume du plein \xE9cran s'affichent aussi sur l'aquarium du mode normal. Comme en plein \xE9cran, ils n'apparaissent qu'\xE0 partir du premier litre (toujours visibles dans l'aper\xE7u de l'\xE9diteur).",field_show_tiles:"Afficher les tuiles sous l'aquarium",helper_show_tiles:"Les tuiles Consomm\xE9, Restant, Objectif, Temp\xE9rature (et Co\xFBt) du mode normal. D\xE9cochez pour ne garder que l'aquarium. Sans effet en plein \xE9cran.",field_use_threshold_colors:"La jauge de volume prend les couleurs des seuils du pommeau",helper_use_threshold_colors:"Le volume prend la couleur du seuil atteint : chaque couleur reste active tant que son seuil n'est pas d\xE9pass\xE9, et apr\xE8s le seuil 4 la couleur du seuil 4 clignote. Il faut les entit\xE9s des seuils 1 \xE0 3 ci-dessous et l'entit\xE9 d'objectif (seuil 4) ; sinon les couleurs habituelles sont utilis\xE9es.",field_threshold_1_entity:"Entit\xE9 seuil 1 (couleur et litres)",field_threshold_2_entity:"Entit\xE9 seuil 2 (couleur et litres)",field_threshold_3_entity:"Entit\xE9 seuil 3 (couleur et litres)",helper_threshold_entities:"Les capteurs \xAB Seuil 1 \xE0 3 \xBB de Hydrao Custom : leur \xE9tat donne les litres et leur attribut color_hex la couleur. Le seuil 4 est l'entit\xE9 d'objectif plus haut."};var Co={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Comfort shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Current algae age",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)",field_animation_quality:"Animation quality",quality_max:"Maximum",quality_balanced:"Balanced",quality_light:"Light (Google Nest Hub)",helper_animation_quality:"Light: 20 frames/s and simpler effects, for low-power screens",field_respect_reduced_motion:"Follow the device's reduced-motion setting",field_show_fps:"Show FPS (debug)",helper_show_fps:"Debug overlay: once per second, shows how many frames were drawn.",helper_respect_reduced_motion:'On: if your tablet, phone or computer has the "reduce motion" accessibility setting, the aquarium stays still. Off: the aquarium always animates. If you see no movement, turn this off.',aria_summary:"Shower aquarium: {consumed} L used out of {target} L.",aria_summary_temperature:"Shower aquarium: {consumed} L used out of {target} L, water at {temperature} \xB0C.",aria_dead:"The tank is empty or too hot: the animals have died.",aria_over_budget:"The target volume has been exceeded.",section_aquarium:"Aquarium, animals and algae",section_limits:"Limits (volume and temperature)",section_cost:"Cost estimate",section_display:"Display and performance",action_feed:"Feed the fish",action_knock:"Knock on the glass",aria_actions:"Aquarium actions",aria_food_dropped:"Fish food dropped into the tank.",aria_knocked:"You knocked on the glass. The fish are startled.",field_comfort_temp_entity:"Minimum comfort temperature entity (optional)",helper_comfort_temp_entity:"Minimum comfortable temperature, for example from a Hydrao showerhead. It replaces the value below.",field_comfort_temp:"Minimum comfort temperature (\xB0C)",field_gauge_style:"Gauge style",field_show_budget:"Show the budget on the volume gauge",option_gauge_thermometer:"Thermometer and bar",option_gauge_arc:"Open arcs",label_sensor_unavailable:"Sensor unavailable",helper_target_budget:"Only used when the target entity above is empty or unavailable.",helper_fish_count:"Between 1 and 10: more fish would be cramped in the tank. A higher value is brought back to 10.",helper_fish_speed:"Between 0.2 and 3. A value outside this range is brought back into it.",field_creature_style:"Look of the fish and the other living things",option_creature_flat:"Flat and detailed",option_creature_cartoon:"Cartoon",option_creature_realistic:"Realistic",helper_creature_style:"Realistic uses soft shading, which the light animation quality leaves out",field_swipe_biotope:"Swipe to change the biotope",helper_swipe_biotope:"Swipe sideways on the aquarium to go to freshwater, saltwater or coldwater. The choice is kept on this device; changing the biotope in this editor replaces it.",action_biotope:"Change biotope",aria_biotope:"Biotope: {name}.",helper_algae_age:"0 = automatic: the age follows the time since the last shower. A higher value sets the age of the algae at this very moment, to see how they look.",field_show_gauges:"Show the gauges outside fullscreen mode",helper_show_gauges:"The thermometer and the volume of fullscreen mode are also drawn on the aquarium of the normal mode. Like in fullscreen, they only appear from the first litre (always shown in the preview of the editor).",field_show_tiles:"Show the tiles under the aquarium",helper_show_tiles:"The Consumed, Remaining, Target, Temperature (and Cost) tiles of the normal mode. Untick to keep only the aquarium. No effect in fullscreen mode.",field_use_threshold_colors:"The volume gauge takes the colours of the showerhead's thresholds",helper_use_threshold_colors:"The volume takes the colour of the threshold it has reached: each colour stays active until its threshold is passed, and after threshold 4 the colour of threshold 4 blinks. It needs the entities of thresholds 1 to 3 below and the target entity (threshold 4); without them the usual colours are used.",field_threshold_1_entity:"Threshold 1 entity (colour and litres)",field_threshold_2_entity:"Threshold 2 entity (colour and litres)",field_threshold_3_entity:"Threshold 3 entity (colour and litres)",helper_threshold_entities:'The "Threshold 1 to 3" sensors of Hydrao Custom: their state gives the litres and their color_hex attribute the colour. Threshold 4 is the target entity above.'};var Tt={fr:So,en:Co};function Z(e){return(e?.locale?.language||e?.language||"en").substring(0,2).toLowerCase()}function qi(e){return e&&Tt[e]||Tt.en}function K(e,t){return qi(e)[t]||Tt.en[t]||t}var Rt={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#dc2626","#f59e0b","#fef3c7","#cbd5e1"]}};function It(e){return Rt[e]||Rt.freshwater}var Vi=["flat","cartoon","realistic"],Gi=["night_entity","night_lux_threshold","cost_in_fullscreen","bottom_design"];function et(e){let t={...e};for(let o of Gi)delete t[o];return t}var ge=["freshwater","saltwater","coldwater"];function Lo(e,t){let o=Math.max(0,ge.indexOf(e));return ge[(o+t+ge.length*2)%ge.length]}var Et={minDistance:60,maxDurationMs:900,horizontalRatio:1.6};function Fo(e,t,o){return o>Et.maxDurationMs||Math.abs(e)<Et.minDistance||Math.abs(e)<Math.abs(t)*Et.horizontalRatio?0:e<0?1:-1}var Be=1024,Lt=10,Ro=y.comfort_temp_min,zi=y.survival_volume,Bt=6e4,Zi=400,ji=2048,Qi=300,Wi=600,Ao=(e,t=Zi)=>Math.max(t,Math.min(ji,Math.round(e)));function Oo(e,t){if(e?.fullscreen){let i=Number(t?.width),s=Number(t?.height);return i>0&&s>0&&Number.isFinite(i)&&Number.isFinite(s)?Ao(Be*s/i,Qi):Wi}let o=Number(e?.aspect_ratio_width)||y.aspect_ratio_width,r=Number(e?.aspect_ratio_height)||y.aspect_ratio_height;return Ao(Be*(r/o))}function Io(e,t,o=null){let r={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(t?.target_budget)||y.target_budget,survivalVolume:Number(t?.survival_volume)||zi,comfortMin:Number(t?.comfort_temp_min)||Ro,sensorMissing:!1,lastReading:null,tiers:null};if(!e||!t)return r;let i=t.entity?e.states[t.entity]:void 0,s=i?parseFloat(i.state):NaN,n=o?.lastReading??null;r.sensorMissing=!(i&&!isNaN(s));let a=n;if(i&&!isNaN(s)){let l=Math.max(0,s),c=i.last_changed?new Date(i.last_changed).getTime():NaN,d=n!==null&&n.volume===l&&n.changedMs!==null;a={volume:l,changedMs:d?n.changedMs:Number.isFinite(c)?c:null}}if(a&&(r.consumedVolume=a.volume,r.lastReading=a,a.changedMs!==null&&(r.hoursSinceLastShower=Math.max(0,(Date.now()-a.changedMs)/(1e3*60*60)))),t.temperature_entity&&e.states[t.temperature_entity]){let l=parseFloat(e.states[t.temperature_entity].state);r.temperature=isNaN(l)?0:l}if(t.target_budget_entity&&e.states[t.target_budget_entity]){let l=parseFloat(e.states[t.target_budget_entity].state);l>0&&(r.targetBudget=l)}if(t.comfort_temp_entity&&e.states[t.comfort_temp_entity]){let l=parseFloat(e.states[t.comfort_temp_entity].state),c=Number(t.temp_boiling_threshold)||y.temp_boiling_threshold;l>0&&l<c&&(r.comfortMin=l)}return r.tiers=t.use_threshold_colors===!1?null:Xi(e,t)??o?.tiers??null,r}function Yi(e){let t=e?.color_hex;if(typeof t=="string"&&/^#[0-9a-f]{6}$/i.test(t.trim()))return t.trim().toLowerCase();let o=e?.color_rgb,r=Array.isArray(o)?o:typeof o=="string"?o.split(","):[];if(r.length!==3)return null;let i=r.map(s=>typeof s=="string"&&s.trim()===""?NaN:Number(s));return i.every(s=>Number.isInteger(s)&&s>=0&&s<=255)?`#${i.map(s=>s.toString(16).padStart(2,"0")).join("")}`:null}function Xi(e,t){let o=[t.threshold_1_entity,t.threshold_2_entity,t.threshold_3_entity,t.target_budget_entity],r=[];for(let i of o){let s=i?e.states[i]:void 0,n=s?parseFloat(s.state):NaN,a=s?Yi(s.attributes):null;if(!(n>0)||!a)return null;r.push({limit:n,color:a})}for(let i=1;i<r.length;i++)if(!(r[i].limit>r[i-1].limit))return null;return r}function Bo(e,t){if(!t||t.length===0)return null;let o=t.findIndex(r=>e<=r.limit);return o===-1?{color:t[t.length-1].color,blinking:!0,index:t.length-1}:{color:t[o].color,blinking:!1,index:o}}function Ki(e,t){return t==="saltwater"?e<2?0:e===2?1:e===3?3:To[(e-4)%To.length]:e%6}var Je=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5],To=[4,2,5,6,2,5],Eo={male:1.4,female:1.6},Ji=1.5,es=.6,ts=2;function tt(e,t){let o=It(t),r=Math.min(10,Math.max(1,Number(e)||4));return Array.from({length:r},(i,s)=>{let n=Ki(s,t),a=t==="saltwater"&&n===0,l=t==="freshwater"&&n===2,c=l?es:1,d=1.38-(Je[s%Je.length]-1.2)*.2,u=Math.random()*50-25,m=Math.random()*50-25;return{species:n,color:o.palette[s%o.palette.length],scale:(a?s===0?Eo.male:Eo.female:Je[s%Je.length]*(t==="saltwater"&&n===1?ts:1))*(l?Ji:1),phase:Math.random()*6.28,x:a?190+s*140:120+s*760/Math.max(1,r-1)+u,y:a?470:160+s%3*90+m,vx:d*(.8+Math.random()*.4)*c,vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5)*c,dir:Math.random()<.5?1:-1,deathProgress:0}})}function ot({config:e,metrics:t,canvasHeight:o}){let r=t.targetBudget,i=t.survivalVolume,s=r+i,n=t.consumedVolume,a=t.temperature,l=Number(e?.temp_boiling_threshold)||y.temp_boiling_threshold,c=Number(e?.temp_deadly_threshold)||y.temp_deadly_threshold,d=Math.max(0,s-n),u=s>0?Math.max(0,Math.min(1,d/s)):0,m=!!e?.fullscreen,p=m?0:15,_=m?o:o-35,x=_-p,v=_-u*x,w=a>=c&&a>0,M=d<=0,A=w||M,L=a>=l&&a>0,B=n>r&&!A,U=n>r*.7&&!B&&!A,Y=Number(e?.fish_speed_multiplier)||y.fish_speed_multiplier,G=((B||L)&&!A?2:1)*Y;return{targetBudget:r,survivalVolume:i,totalVolume:s,currentVolume:n,currentTemp:a,boilTemp:l,deadlyTemp:c,remainingVolumeInTank:d,waterRatio:u,tankTop:p,tankBottom:_,tankHeight:x,waterSurfaceY:v,isHeatDead:w,isWaterDead:M,isDead:A,isBoiling:L,isCritical:B,isWarning:U,speedMultiplier:G}}function os(e){let t=Math.max(Lt+10,Math.ceil((e+5)/10)*10),o=[];for(let r=Lt+10;r<=t;r+=10)o.push(r);return{min:Lt,max:t,ticks:o}}function No({currentTemp:e,currentVolume:t,targetBudget:o,comfortMin:r,deadlyTemp:i,boilTemp:s,tier:n=null}){let a=os(i),l=p=>Math.max(0,Math.min(1,(p-a.min)/(a.max-a.min))),c=l(e),d=e>=i?"#ef4444":e>=s?"#f97316":e>=r?"#16a34a":"#0284c7",u=Math.max(0,Math.min(1,t/Math.max(1,o))),m=n?n.color:t>o?"#ef4444":t>o*.7?"#f59e0b":"#0284c7";return{tempFraction:c,tempColor:d,volFraction:u,volColor:m,volBlink:!!n?.blinking,scale:a,marks:[{fraction:l(r),color:"#16a34a"},{fraction:l(s),color:"#f97316"},{fraction:l(i),color:"#ef4444"}],ticks:a.ticks.map(l)}}var Po=8e3,rt=900;function it(){return{lastVolume:null,lastIncreaseAt:0,target:0,showerActive:!1}}function Uo(e,t,o){if(e.lastVolume===null)return{...e,lastVolume:t};if(t<e.lastVolume-1e-6)return{...it(),lastVolume:t};if(t>e.lastVolume+1e-6){let r=t-e.lastVolume,i=(o-e.lastIncreaseAt)/1e3,n=e.lastIncreaseAt>0&&i>.2&&i<=15?r/(i/60):null,a=n===null?.5:Math.max(.25,Math.min(1,n/10));return{lastVolume:t,lastIncreaseAt:o,target:a,showerActive:!0}}return e}function Do(e,t){return e.lastIncreaseAt&&t-e.lastIncreaseAt<Po?e.target:0}function Ho(e,t){return e.showerActive&&e.lastIncreaseAt>0&&t-e.lastIncreaseAt>=Po}function qo(e,t=36){return e>.02?Math.min(t,Math.round(4+e*(t-4))):0}function Vo(e,t,o=45){return e<=t+o?"feed":"knock"}function Go(e,t,o,r,i=280,s=Math.random){let n=e-o,a=t-r,l=Math.hypot(n,a);if(l>i)return null;let c,d;if(l<1){let p=s()*Math.PI*2;c=Math.cos(p),d=Math.sin(p)}else c=n/l,d=a/l;let u=1-l/i,m=2+9*u;return{kx:c*m,ky:d*m*.6,scare:u}}function zo(e,t,o,r=360){let i=null,s=r;for(let n of o){if(n.eaten)continue;let a=Math.hypot(n.x-e,n.y-t);a<s&&(s=a,i=n)}return i}var Ft={count:10,start:40,speed:3.4};function Zo(e,t,o=Ft.count,r=Math.random){let i=["#f59e0b","#fbbf24","#fb923c","#facc15"];return Array.from({length:o},()=>{let s=(r()-.5)*2;return{x:e+s*Ft.start,y:t+r()*12,vx:s*Ft.speed+(r()-.5)*.8,vy:.4+r()*.55,phase:r()*Math.PI*2,r:3.4+r()*2,color:i[Math.floor(r()*i.length)],landedAt:0,eaten:!1}})}var rs=4.186/3600;function Nt(e,t,o=15){return!(e>0)||!(t>o)?0:e*(t-o)*rs}function jo({volumeL:e,energyKwh:t,waterPricePerM3:o,energyPricePerKwh:r}){let i=Math.max(0,e||0)*(Number(o)||0)/1e3,s=Math.max(0,t||0)*(Number(r)||0);return{water:i,energy:s,total:i+s}}function st(e,t="fr"){try{return new Intl.NumberFormat(t,{style:"currency",currency:"EUR"}).format(e)}catch{return`${e.toFixed(2)} \u20AC`}}var Ot={max:{fps:0,ambientHz:0,antialias:!0,flowBubbles:36,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0,tentacles:1},balanced:{fps:30,ambientHz:0,antialias:!0,flowBubbles:24,richSurface:!0,deathFilter:!0,doubleRipple:!0,shading:!0,tentacles:1},light:{fps:20,ambientHz:8,antialias:!1,flowBubbles:12,richSurface:!1,deathFilter:!1,doubleRipple:!1,shading:!1,tentacles:.6}};function Qo(e){return e&&Ot[e]||Ot.max}function Wo(e,t,o){return!o||!t?!0:e-t>=1e3/o-2}function Yo(e){return e?Math.max(2,1e3/e/16.66*1.6):2}function Xo(e,t){return[e.consumedVolume,e.temperature,e.targetBudget,e.survivalVolume,e.comfortMin,e.sensorMissing?1:0,Math.floor(e.hoursSinceLastShower),e.tiers?e.tiers.map(o=>`${o.limit}${o.color}`).join(","):"",t].join("|")}function Pt(e){let t={...e};for(let o of tr){if(o.max===void 0)continue;let r=t[o.key];r!=null&&(t[o.key]=Ut({[o.key]:r}).config[o.key])}return t}function Ko(e,t=!0){return t===!1?!0:!e}var Jo=40;function er(e){return e?120:2}var tr=[{key:"fish_count",fallback:y.fish_count,min:1,max:10,integer:!0},{key:"target_budget",fallback:y.target_budget,min:0,minExclusive:!0},{key:"survival_volume",fallback:y.survival_volume,min:0,minExclusive:!0},{key:"temp_boiling_threshold",fallback:y.temp_boiling_threshold,min:0,minExclusive:!0},{key:"temp_deadly_threshold",fallback:y.temp_deadly_threshold,min:0,minExclusive:!0},{key:"comfort_temp_min",fallback:y.comfort_temp_min,min:0,minExclusive:!0},{key:"algae_delay_hours",fallback:y.algae_delay_hours,min:0,minExclusive:!0},{key:"algae_age",fallback:y.algae_age,min:0},{key:"fish_speed_multiplier",fallback:y.fish_speed_multiplier,min:0,minExclusive:!0,clampMin:.2,max:3},{key:"aspect_ratio_width",fallback:y.aspect_ratio_width,min:0,minExclusive:!0},{key:"aspect_ratio_height",fallback:y.aspect_ratio_height,min:0,minExclusive:!0},{key:"water_price_per_m3",fallback:y.water_price_per_m3,min:0},{key:"energy_price_per_kwh",fallback:y.energy_price_per_kwh,min:0},{key:"cold_water_temp",fallback:y.cold_water_temp,min:-50}];function Ut(e){let t={...e},o=[];for(let a of Object.keys(t))(t[a]===null||t[a]===void 0)&&delete t[a];for(let a of tr){let l=t[a.key];if(l===void 0)continue;let c=typeof l=="string"&&l.trim()===""?NaN:Number(l);if(!(Number.isFinite(c)&&(a.minExclusive?c>a.min:c>=a.min))){o.push(`${a.key}: ${JSON.stringify(l)} is not valid, using ${a.fallback}`),t[a.key]=a.fallback;continue}a.integer&&(c=Math.round(c)),a.clampMin!==void 0&&c<a.clampMin&&(c=a.clampMin),a.max!==void 0&&c>a.max&&(c=a.max),c!==l&&(c!==Number(l)&&o.push(`${a.key}: ${JSON.stringify(l)} is out of range, using ${c}`),t[a.key]=c)}t.theme!==void 0&&!Rt[t.theme]&&(o.push(`theme: ${JSON.stringify(t.theme)} is unknown, using freshwater`),t.theme="freshwater"),t.animation_quality!==void 0&&!Ot[t.animation_quality]&&(o.push(`animation_quality: ${JSON.stringify(t.animation_quality)} is unknown, using max`),t.animation_quality="max"),t.gauge_style!==void 0&&t.gauge_style!=="thermometer"&&t.gauge_style!=="arc"&&(o.push(`gauge_style: ${JSON.stringify(t.gauge_style)} is unknown, using thermometer`),t.gauge_style="thermometer"),t.creature_style!==void 0&&!Vi.includes(t.creature_style)&&(o.push(`creature_style: ${JSON.stringify(t.creature_style)} is unknown, using ${y.creature_style}`),t.creature_style=y.creature_style),t.title!==void 0&&typeof t.title!="string"&&(o.push("title: must be text, ignoring it"),t.title="");let r=t.temp_boiling_threshold??y.temp_boiling_threshold,i=t.temp_deadly_threshold??y.temp_deadly_threshold;i<=r&&(t.temp_deadly_threshold=r+1,o.push(`temp_deadly_threshold: ${i} must be above temp_boiling_threshold (${r}), using ${r+1}`));let s=t.comfort_temp_min??Ro,n=t.temp_boiling_threshold??y.temp_boiling_threshold;return s>=n&&(t.comfort_temp_min=Math.max(1,n-1),o.push(`comfort_temp_min: ${s} must be below temp_boiling_threshold (${n}), using ${t.comfort_temp_min}`)),{config:t,warnings:o}}function Dt(e,t){return String(e).replace(/\{(\w+)\}/g,(o,r)=>r in t?String(t[r]):o)}function Ne(e,t="en"){return Number.isInteger(e)?String(e):O(e,t,1)}function O(e,t="en",o=1){try{return new Intl.NumberFormat(t,{minimumFractionDigits:o,maximumFractionDigits:o}).format(e)}catch{return Number(e).toFixed(o)}}var is="hydrao_custom";function or(e,...t){let o=e&&typeof e.entities=="object"&&e.entities?e.entities:{},r=e&&typeof e.states=="object"&&e.states?e.states:{},i=[...new Set([...t.flatMap(l=>Array.isArray(l)?l:[]),...Object.keys(o),...Object.keys(r)])].sort(),s=(l,c,d,u)=>{let m=i.filter(_=>_.startsWith(`${l}.`)),p=m.find(_=>o[_]?.platform===is&&c.includes(o[_]?.translation_key??""));return p||m.find(_=>_.includes("hydrao")&&d.test(_)&&!(u&&u.test(_)))||""},n=/(total|cumul|comfort|confort|wasted|perdu|gaspill)/,a=/_minimum_comfort_temperature|_temperature_de_confort_minimum|_temperature_confort_minimum/;return{entity:s("sensor",["shower_volume_comfort"],/_(comfort_shower_volume|shower_comfort_volume|volume_douche_confort|volume_confort_douche|douche_confort)(_\d+)?$/,/(total|cumul|wasted|perdu|gaspill)/)||s("sensor",["shower_volume_raw"],/_(shower_volume|volume_douche)(_\d+)?$/,n),temperature_entity:s("sensor",["temperature"],/_temperature(_\d+)?$/),comfort_temp_entity:s("number",["comfort_temperature"],/_(minimum_comfort_temperature|temperature_de_confort_minimum|temperature_confort_minimum)(_\d+)?$/),target_budget_entity:s("sensor",["threshold_4"],/_(threshold|seuil)_4(_\d+)?$/,a),threshold_1_entity:s("sensor",["threshold_1"],/_(threshold|seuil)_1(_\d+)?$/),threshold_2_entity:s("sensor",["threshold_2"],/_(threshold|seuil)_2(_\d+)?$/),threshold_3_entity:s("sensor",["threshold_3"],/_(threshold|seuil)_3(_\d+)?$/)}}var ir=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:y.theme,selector:{select:{options:[{value:"freshwater",label:"Freshwater (Tropical)"},{value:"saltwater",label:"Saltwater (Reef)"},{value:"coldwater",label:"Coldwater (Goldfish)"}]}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:y.target_budget,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{type:"expandable",name:"section_aquarium",flatten:!0,schema:[{name:"fish_count",default:y.fish_count,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"fish_speed_multiplier",default:y.fish_speed_multiplier,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"algae_enabled",default:y.algae_enabled,selector:{boolean:{}}},{name:"algae_delay_hours",default:y.algae_delay_hours,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:y.algae_age,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}}]},{type:"expandable",name:"section_limits",flatten:!0,schema:[{name:"survival_volume",default:y.survival_volume,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"comfort_temp_entity",selector:{entity:{domain:["sensor","number","input_number"]}}},{name:"use_threshold_colors",default:y.use_threshold_colors,selector:{boolean:{}}},{name:"threshold_1_entity",selector:{entity:{domain:"sensor"}}},{name:"threshold_2_entity",selector:{entity:{domain:"sensor"}}},{name:"threshold_3_entity",selector:{entity:{domain:"sensor"}}},{name:"comfort_temp_min",default:y.comfort_temp_min,selector:{number:{min:15,max:45,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_boiling_threshold",default:y.temp_boiling_threshold,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:y.temp_deadly_threshold,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_cost",flatten:!0,schema:[{name:"show_cost",default:y.show_cost,selector:{boolean:{}}},{name:"water_price_per_m3",default:y.water_price_per_m3,selector:{number:{min:0,max:30,step:.01,unit_of_measurement:"\u20AC/m\xB3",mode:"box"}}},{name:"energy_price_per_kwh",default:y.energy_price_per_kwh,selector:{number:{min:0,max:2,step:.001,unit_of_measurement:"\u20AC/kWh",mode:"box"}}},{name:"cold_water_temp",default:y.cold_water_temp,selector:{number:{min:0,max:30,unit_of_measurement:"\xB0C",mode:"box"}}}]},{type:"expandable",name:"section_display",flatten:!0,schema:[{name:"animation_quality",default:y.animation_quality,selector:{select:{options:[{value:"max",label:"Maximum"},{value:"balanced",label:"Balanced"},{value:"light",label:"Light (Google Nest Hub)"}]}}},{name:"creature_style",default:y.creature_style,selector:{select:{options:[{value:"flat",label:"Flat and detailed"},{value:"cartoon",label:"Cartoon"},{value:"realistic",label:"Realistic"}]}}},{name:"show_budget",default:y.show_budget,selector:{boolean:{}}},{name:"respect_reduced_motion",default:y.respect_reduced_motion,selector:{boolean:{}}},{name:"fullscreen",default:y.fullscreen,selector:{boolean:{}}},{name:"show_gauges",default:y.show_gauges,selector:{boolean:{}}},{name:"gauge_style",default:y.gauge_style,selector:{select:{options:[{value:"thermometer",label:"Thermometer and bar"},{value:"arc",label:"Open arcs"}]}}},{name:"show_tiles",default:y.show_tiles,selector:{boolean:{}}},{name:"swipe_biotope",default:y.swipe_biotope,selector:{boolean:{}}},{name:"show_fps",default:y.show_fps,selector:{boolean:{}}},{name:"aspect_ratio_width",default:y.aspect_ratio_width,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:y.aspect_ratio_height,selector:{number:{min:1,max:4e3,mode:"box"}}}]}];function sr(e=ir){return e.flatMap(t=>t.type==="expandable"?sr(t.schema):[t])}var rr={section_aquarium:"section_aquarium",section_limits:"section_limits",section_cost:"section_cost",section_display:"section_display"},ss={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",comfort_temp_entity:"field_comfort_temp_entity",comfort_temp_min:"field_comfort_temp",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",show_cost:"field_show_cost",water_price_per_m3:"field_water_price",energy_price_per_kwh:"field_energy_price",cold_water_temp:"field_cold_water_temp",animation_quality:"field_animation_quality",respect_reduced_motion:"field_respect_reduced_motion",fullscreen:"field_fullscreen",show_fps:"field_show_fps",creature_style:"field_creature_style",gauge_style:"field_gauge_style",show_budget:"field_show_budget",swipe_biotope:"field_swipe_biotope",show_gauges:"field_show_gauges",use_threshold_colors:"field_use_threshold_colors",threshold_1_entity:"field_threshold_1_entity",threshold_2_entity:"field_threshold_2_entity",threshold_3_entity:"field_threshold_3_entity",show_tiles:"field_show_tiles",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},ns={fullscreen:"helper_fullscreen",creature_style:"helper_creature_style",target_budget:"helper_target_budget",fish_count:"helper_fish_count",fish_speed_multiplier:"helper_fish_speed",comfort_temp_entity:"helper_comfort_temp_entity",show_cost:"helper_show_cost",animation_quality:"helper_animation_quality",respect_reduced_motion:"helper_respect_reduced_motion",show_fps:"helper_show_fps",swipe_biotope:"helper_swipe_biotope",show_gauges:"helper_show_gauges",use_threshold_colors:"helper_use_threshold_colors",threshold_1_entity:"helper_threshold_entities",show_tiles:"helper_show_tiles",algae_age:"helper_algae_age"},as={theme:{freshwater:"theme_freshwater",saltwater:"theme_saltwater",coldwater:"theme_coldwater"},animation_quality:{max:"quality_max",balanced:"quality_balanced",light:"quality_light"},creature_style:{flat:"option_creature_flat",cartoon:"option_creature_cartoon",realistic:"option_creature_realistic"},gauge_style:{thermometer:"option_gauge_thermometer",arc:"option_gauge_arc"}},Ht=class extends z{static get properties(){return{hass:{type:Object},_config:{type:Object}}}constructor(){super(),this.hass=void 0,this._config=void 0}setConfig(t){this._config=et(t)}_lang(){return Z(this.hass)}_computeLabel(t){let o=ss[t.name]||rr[t.name];return o?K(this._lang(),o):t.name}_computeHelper(t){let o=ns[t.name];return o?K(this._lang(),o):""}_valueChanged(t){if(!this._config||!this.hass)return;let o=Pt({...t.detail.value});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0}))}_schema(){let t=this._lang(),o=r=>{if(r.type==="expandable")return{...r,title:K(t,rr[r.name]),schema:r.schema.map(o)};let i=as[r.name];return i?{...r,selector:{select:{options:r.selector.select.options.map(s=>({value:s.value,label:K(t,i[s.value])}))}}}:r};return ir.map(o)}_formData(){return{...Object.fromEntries(sr().filter(o=>o.default!==void 0).map(o=>[o.name,o.default])),...Pt(this._config)}}render(){return!this.hass||!this._config?D``:D`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${this._schema()}
        .computeLabel=${t=>this._computeLabel(t)}
        .computeHelper=${t=>this._computeHelper(t)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",Ht);function ar(e,t,o,r){let i=`${t}|${o}|${r}|${e._flowIntensity||0}|${(e._flowIntensity||0)>.05?e._animTime:e._ambientTime}|${e._profile.richSurface}`,s=nr.get(e);if(s&&s.key===i)return s.strip;let n=ls(e,t,o,r);return nr.set(e,{key:i,strip:n}),n}var nr=new WeakMap;function ls(e,t,o,r){let i=e._flowIntensity||0,s=3.5+i*6.5,n=90-i*35,l=(i>.05?e._animTime:e._ambientTime)*(1.6+i*2.4),c=e._profile.richSurface,d=c?16:28,u=w=>c?Math.sin(w/17+l*2.3)*i*2.4:0,m=[],p=[];for(let w=t;w<o;w+=d)m.push([w,r+Math.sin(w/n+l)*s+u(w)]),p.push([w,r+4+Math.sin(w/n+l+.6)*s*.7]);m.push([o,r+Math.sin(o/n+l)*s+u(o)]),p.push([o,r+4+Math.sin(o/n+l+.6)*s*.7]);let _=w=>`${w[0].toFixed(1)},${w[1].toFixed(1)}`,x=m.map(_).join(" L "),v=p.slice().reverse().map(_).join(" L ");return f`
    <path d="M ${x} L ${v} Z" fill="#ffffff" opacity="0.25" />
    <path d="M ${x}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
  `}var R=e=>e??C;var S="#1e293b";function F(e){return e._config?.creature_style||"flat"}function I(e){return e._profile.shading}var $=(e,t,o,r)=>`M${e-o},${t} A${o},${r} 0 1,0 ${e+o},${t} A${o},${r} 0 1,0 ${e-o},${t} Z`,b=(e,t,o)=>$(e,t,o,o),k=e=>`M${e.trim().split(/\s+/).join(" L")} Z`,le=(e,t,o,r)=>`M${e},${t} L${o},${r}`,h=(e,t,o={})=>({d:e,fill:t,...o});function g(e,t=!1){return f`<path d="${e.d}" fill="${e.fill??"none"}" stroke="${R(e.stroke??(t?S:void 0))}" stroke-width="${R(e.sw??(t?1.6:void 0))}" stroke-linecap="${R(e.lc)}" stroke-linejoin="round" opacity="${R(e.op)}" />`}function N(e,t,o,r,i={}){let s=g(h(o,r,i),e==="cartoon");return e==="realistic"&&t?f`${s}<path d="${o}" fill="url(#shade)" opacity="${R(i.op)}" />`:s}function j(e,t,o,r,i){if(!(i>0))return;let s=Math.min(1,i);return`translate(${e} ${t}) rotate(${(o*s).toFixed(1)}) scale(1 ${(1-r*s).toFixed(3)}) translate(${-e} ${-t})`}var cs=600,$e=new Map;function T(e,t){if($e.has(e))return $e.get(e);let o=t();for($e.set(e,o);$e.size>cs;)$e.delete($e.keys().next().value);return o}var P=Object.freeze({x0:776,x1:1010,height:254,ledge:190,ledgeFrom:880,ledgeTo:940}),J=Object.freeze([{x:500,h:26,cave:!1},{x:650,h:26,cave:!1},{x:770,h:26,cave:!1},{x:884,h:22,cave:!0},{x:850,h:118,cave:!1},{x:880,h:190,cave:!1},{x:940,h:190,cave:!1}]),oe=Object.freeze(J.reduce((e,t,o)=>{if(o===0)return[0];let r=J[o-1];return[...e,e[o-1]+Math.hypot(t.x-r.x,t.h-r.h)]},[])),ye=oe[oe.length-1];function qt(e){let t=Math.max(0,Math.min(ye,e)),o=1;for(;o<oe.length-1&&oe[o]<t;)o++;let[r,i]=[J[o-1],J[o]],s=(t-oe[o-1])/(oe[o]-oe[o-1]);return{x:r.x+(i.x-r.x)*s,h:r.h+(i.h-r.h)*s}}var nt=Object.freeze(oe.filter((e,t)=>J[t].cave)),at=ye-(J[J.length-1].x-J[J.length-2].x)/2;function hs(e,t=0){let o=`${e._ambientTime}|${t}|${F(e)}|${Vt(e)}`,r=lr.get(e);if(r&&r.key===o)return r.parts;let i=ds(e,t);return lr.set(e,{key:o,parts:i}),i}var lr=new WeakMap;function Vt(e){return e._profile?.tentacles??1}function ds(e,t){let o=F(e),r=o==="cartoon"?1.4:o==="realistic"?.65:1,i=o==="cartoon"?1.5:o==="realistic"?.7:1,s=[{count:Math.max(2,Math.round(11*Vt(e))),baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:Math.max(2,Math.round(16*Vt(e))),baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],n=[];return s.forEach((a,l)=>{for(let c=0;c<a.count;c++){let d=c/(a.count-1),u=-90-a.spread/2+d*a.spread,m=(a.lenMin+(a.lenMax-a.lenMin)*(.5+.5*Math.sin(d*Math.PI)))*(1-.3*t),p=l*10+c*.7,_=Math.sin(e._ambientTime*a.speed+p)*9*(1-t),x=u*Math.PI/180,v=Math.cos(x)*a.baseR,w=Math.sin(x)*a.baseR,M=c*37%17-8,L=(u<-90?-1:1)*(118+c%4*7),B=u+90+_,U=B+(L-B)*t;n.push(f`
        <g transform="translate(${v.toFixed(1)}, ${w.toFixed(1)}) rotate(${U.toFixed(1)})">
          <path d="M 0,0 Q ${M.toFixed(1)},${(-m*.55).toFixed(1)} 0,${(-m).toFixed(1)}" stroke="${a.color}" stroke-width="${(a.width*r).toFixed(1)}" stroke-linecap="round" fill="none" opacity="0.9" />
          <circle cx="0" cy="${(-m).toFixed(1)}" r="${(a.width*.9*i).toFixed(1)}" fill="${o==="realistic"?"#ffffff":a.tip}" />
        </g>
      `)}}),n}function fs(e,t,o,r,i){return T(`chunk|${e}|${t}|${o}|${r}|${i}`,()=>us(e,t,o,r,i))}function us(e,t,o,r,i){let n=Array.from({length:8},(c,d)=>{let u=d/8*Math.PI*2+.18*Math.sin(i*1.3+d*2.1),m=1+.2*Math.sin(i*2.3+d*2.7)+.1*Math.sin(i*1.1+d*5.1);return{a:u,x:e+Math.cos(u)*o*m,y:t+Math.sin(u)*r*m}}),a=c=>`M${c.map(d=>`${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(" L")} Z`,l=n.filter(c=>Math.sin(c.a)<.15);return{body:a(n),top:a(l)}}function ps(e){let t=e-P.ledge,[o,r]=[P.ledgeFrom-30,P.ledgeTo+52];return`M${o+10},${t} L${r-10},${t} L${r},${t+12} L${r-6},${t+30} L${o+8},${t+30} L${o},${t+12} Z`}var cr=[[802,16,36,18,1,"#7d5c8f"],[862,30,58,32,2,"#8b6a9c"],[950,34,66,36,3,"#6d5280"],[1e3,46,34,48,4,"#7d5c8f"],[832,80,46,32,5,"#6d5280"],[906,94,54,34,6,"#8b6a9c"],[978,106,40,40,7,"#7d5c8f"],[920,146,64,30,8,"#6d5280"]],ms=[[958,216,34,30,9,"#8b6a9c"],[998,198,24,36,10,"#7d5c8f"],[930,228,26,26,11,"#6d5280"]],_s=[[572,8,22,9,43,"#6d5280"],[716,11,32,13,44,"#8b6a9c"],[740,24,18,12,45,"#7d5c8f"],[610,6,12,6,46,"#6d5280"],[506,6,10,5,47,"#8b6a9c"]];function lt(e,t,o,[r,i,s,n,a,l]){let c=o-i,{body:d,top:u}=fs(r,c,s,n,a);return f`
    ${N(e,t,d,l)}
    ${e==="cartoon"?"":g(h(u,"#ffffff",{op:.15,stroke:"none"}))}
    ${e==="flat"?[[-.3,.1],[.25,.3],[-.05,.45]].map(([m,p])=>g(h(b(r+m*s,c+p*n,Math.max(1.4,s*.06)),"#3b2a4a",{op:.35,stroke:"none"}))):""}
  `}function hr(e,t,o,r){let i=t,s=F(e),n=I(e),a=(c,d,u)=>N(s,n,c,d,u===void 0?{}:{op:u}),l=(c,d,u,m)=>s==="flat"?c.map(([p,_])=>g(h(b(p,_,u),d,{op:m}))):"";return f`
    <g id="reef-decor">
      <g style="${o}">
      ${T(`corals|${s}|${n}|${i}|${r>0?r.toFixed(3):0}`,()=>f`
      <g transform="${R(j(88,i,-16,.6,r))}">
      ${a(`M 60 ${i} Q 40 ${i-165}, 95 ${i-225} Q 120 ${i-275}, 85 ${i-335} Q 135 ${i-265}, 120 ${i-195} Q 150 ${i-135}, 115 ${i} Z`,"#f43f5e",.95)}
      ${l([[88,i-40],[80,i-110],[98,i-190],[105,i-240],[92,i-300]],"#ffe4e6",3,.55)}
      </g>
      <g transform="${R(j(160,i,14,.55,r))}">
      ${a(`M 115 ${i} Q 150 ${i-155}, 190 ${i-205} Q 215 ${i-245}, 190 ${i-295} Q 230 ${i-235}, 205 ${i-155} Q 180 ${i-105}, 155 ${i} Z`,"#fb7185",.9)}
      ${l([[135,i-40],[160,i-120],[185,i-190],[196,i-250]],"#ffe4e6",3,.55)}
      </g>
      <g transform="translate(690, ${i})">
        <g transform="${R(j(-40,0,12,.55,r))}">
        ${a("M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z","#c084fc",.85)}
        ${a("M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z","#a855f7",.9)}
        ${a("M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z","#d8b4fe",.85)}
        ${a(b(0,-20,60),"#7e22ce",.75)}
        </g>
      </g>
      <g transform="translate(190, ${i-70})">
        <g transform="${R(j(0,46,0,.4,r))}">
        ${N(s,n,"M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z","#1d4ed8",{stroke:"#1e40af",sw:2})}
        <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="0" cy="0" r="5" fill="#60a5fa" />
        </g>
      </g>
      
      `)}
      </g>
      ${T(`live-rock|${s}|${n}|${i}`,()=>f`
      <g id="live-rock">
        ${cr.slice(0,4).map(c=>lt(s,n,i,c))}
        ${cr.slice(4).map(c=>lt(s,n,i,c))}
        ${g(h($(884,i-52,36,22),"#0b0614",{stroke:"none",op:1}))}
        ${a(ps(i),"#9a78ad")}
        ${s==="cartoon"?"":g(h(`M ${P.ledgeFrom-20},${i-P.ledge+3} L ${P.ledgeTo+44},${i-P.ledge+3}`,void 0,{stroke:"#ffffff",sw:1.6,op:.4,lc:"round"}))}
        ${ms.map(c=>lt(s,n,i,c))}
        ${s==="cartoon"?"":[[850,44,16,7],[942,108,18,8],[976,152,11,6],[812,74,12,6],[1002,200,9,7]].map(([c,d,u,m])=>g(h($(c,i-d,u,m),"#e879f9",{op:.32,stroke:"none"})))}
        ${s==="flat"?[[846,66],[972,158]].map(([c,d])=>f`${g(h(`M ${c},${i-d} L ${c},${i-d-9}`,void 0,{stroke:"#fb923c",sw:1.2,lc:"round"}))}${g(h(b(c,i-d-11,3.2),"#fb923c",{stroke:"none"}))}`):""}
      </g>
      `)}
      ${T(`live-rock-scattered|${s}|${n}|${i}`,()=>f`
      <g id="live-rock-scattered">
        ${_s.map(c=>lt(s,n,i,c))}
      </g>
      `)}
      <g id="anemone" style="${o}" transform="translate(260, ${i-17}) scale(1.4, 1.4)">
        <g transform="${R(j(0,22,0,.3,r))}">
        ${hs(e,r)}
        ${T(`anemone-body|${s}|${n}`,()=>f`
        ${a($(0,-16,30,11),"#86198f",.9)}
        ${a("M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z","#701a75")}
        ${a($(0,16,26,9),"#4a044e",.75)}
        ${s==="cartoon"?f`
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
  `}var gs=[[140,25,70,26,"#475569",1],[250,17,50,20,"#64748b",1],[860,20,75,28,"#334155",1],[760,15,46,18,"#64748b",1],[300,10,26,10,"#94a3b8",.85],[600,8,22,9,"#94a3b8",.8],[660,14,34,14,"#475569",.9]];function dr(e,t,o){return T(`coldwater|${e}|${t}|${o}`,()=>$s(e,t,o))}function $s(e,t,o){return f`
    <g id="coldwater-decor">
      ${gs.map(([r,i,s,n,a,l])=>{let c=e-i;return f`
          ${N(t,o,$(r,c,s,n),a,{op:l})}
          ${g(h($(r-s*.3,c-n*.4,s*.35,n*.22),"#ffffff",{op:.22}))}
        `})}
    </g>
  `}function fr(e,t,o,r,i=0){return T(`freshwater|${e}|${t}|${o}|${r}|${i>0?i.toFixed(3):0}`,()=>ys(e,t,o,r,i))}function ys(e,t,o,r,i){let s=e,n=(l,c,d)=>N(o,r,l,c,d===void 0?{}:{op:d}),a=(l,c)=>o==="flat"?g(h(l,void 0,{stroke:"#052e16",sw:1.5,op:c,lc:"round"})):"";return f`
    <g id="freshwater-plants" style="${t}">
      <g transform="${R(j(165,s,-4,.55,i))}">
      ${n(`M 45 ${s} Q 65 ${s-75}, 115 ${s-60} Q 155 ${s-85}, 200 ${s-50} Q 240 ${s-70}, 285 ${s} Z`,"#15803d")}
      ${n(`M 75 ${s} Q 95 ${s-60}, 135 ${s-55} Q 170 ${s-75}, 210 ${s-40} Q 250 ${s-50}, 270 ${s} Z`,"#22c55e",.85)}
      ${n(b(110,s-55,11),"#4ade80",.7)}
      ${n(b(170,s-63,12),"#4ade80",.7)}
      </g>
      <g transform="${R(j(120,s,72,.25,i))}">
      <path d="M 120 ${s} Q 140 ${s-105}, 160 ${s-155} Q 165 ${s-205}, 145 ${s-265}" stroke="${o==="cartoon"?S:"#14532d"}" stroke-width="${o==="cartoon"?10:8}" fill="none" stroke-linecap="round" />
      ${o==="cartoon"?f`<path d="M 120 ${s} Q 140 ${s-105}, 160 ${s-155} Q 165 ${s-205}, 145 ${s-265}" stroke="#14532d" stroke-width="6" fill="none" stroke-linecap="round" />`:""}
      ${n(`M 145 ${s-265} Q 105 ${s-305}, 85 ${s-280} C 70 ${s-250}, 110 ${s-220}, 145 ${s-265} Z`,"#166534")}
      ${n(`M 145 ${s-265} Q 185 ${s-315}, 215 ${s-295} C 230 ${s-270}, 190 ${s-230}, 145 ${s-265} Z`,"#15803d")}
      ${a(`M 145 ${s-265} Q 110 ${s-278}, 90 ${s-276}`,.4)}
      ${a(`M 145 ${s-265} Q 185 ${s-285}, 212 ${s-291}`,.4)}
      </g>
      <g transform="${R(j(890,s,-68,.3,i))}">
      ${n(`M 880 ${s} Q 920 ${s-195}, 870 ${s-355} Q 845 ${s-195}, 860 ${s} Z`,"#16a34a",.9)}
      ${n(`M 920 ${s} Q 960 ${s-215}, 930 ${s-375} Q 895 ${s-205}, 900 ${s} Z`,"#22c55e",.8)}
      ${a(`M 870 ${s} Q 885 ${s-190}, 870 ${s-350}`,.3)}
      ${a(`M 910 ${s} Q 940 ${s-205}, 930 ${s-370}`,.3)}
      </g>
    </g>
  `}function ur(e,t,o,r=0){let i=o?e._getCanvasHeight():e._getCanvasHeight()-35,s=e._profile.deathFilter?`filter: grayscale(${(r*.85).toFixed(2)}) sepia(${(r*.5).toFixed(2)}) brightness(${(1-r*.45).toFixed(2)});`:`opacity: ${(1-r*.6).toFixed(2)};`;return t==="saltwater"?hr(e,i,s,r):t==="coldwater"?dr(i,F(e),I(e)):fr(i,s,F(e),I(e),r)}var bs=[[70,70,.1,-1],[150,95,.25,1],[260,60,.05,1],[380,110,.4,-1],[470,65,.15,1],[560,90,.3,-1],[650,120,.5,1],[740,70,.1,-1],[830,100,.35,1],[920,80,.2,-1],[985,60,.6,-1],[40,55,.7,1]],xs=[[-6,1,.15,"#3f6212"],[-2,.8,.35,"#4d7c0f"],[3,.65,-.1,"#365314"],[7,.5,.25,"#65a30d"]],Gt=(e,t,o)=>Math.sin(e/t)*.35+Math.sin(e/o+1.3)*.2,zt=e=>`M${e.map(([t,o])=>`${t.toFixed(1)},${o.toFixed(1)}`).join(" L")} Z`,ws=8,Pe=new Map;function vs(e,t,o,r,i){let s=`${e}|${t}|${o}|${r}|${i}`,n=Pe.get(s);if(n)return n;let a=i-r,l=a*(.04+.16*e),c=[[t,i]];for(let x=t;x<=o;x+=8)c.push([x,i-l*(1+Gt(x,37,13))]);c.push([o,i]);let d=8+62*e,u=[[t,r]],m=[[o,r]];for(let x=r;x<=i;x+=8)u.push([t+d*(1+Gt(x,41,17)),x]),m.push([o-d*(1+Gt(x+90,41,17)),x]);u.push([t,i]),m.push([o,i]);let p=[];for(let[x,v,w,M]of bs){let A=Math.min(1,(e-w)/.4);if(A<=0)continue;let L=Math.min(v*A,a*.3);for(let[B,U,Y,fe]of xs){let G=x+B,ue=G+M*L*(.2+Y),Me=i-L*U,ke=G+(ue-G)*.3-M*5,pe=i-L*U*.55;p.push({d:`M${G},${i} Q${ke.toFixed(1)},${pe.toFixed(1)} ${ue.toFixed(1)},${Me.toFixed(1)}`,color:fe})}}let _={bottom:zt(c),leftWall:zt(u),rightWall:zt(m),strands:p};return Pe.size>=ws&&Pe.delete(Pe.keys().next().value),Pe.set(s,_),_}function pr(e,t,o){let r=e._config;if(!r)return f``;let i=r.algae_delay_hours,s=Number(r.algae_age)||0,n=s>0?s:t;if(!r.algae_enabled||n<i)return f``;let a=Math.round(Math.min(1,(n-i)/36)*1e3)/1e3,l=(.2+a*.78).toFixed(2),c=o?0:14,d=o?e._getCanvasHeight():e._getCanvasHeight()-35,u=vs(a,o?0:12,o?1024:1012,c,d);return f`
    <g id="algae-layer" opacity="${l}">
      <rect x="0" y="${c}" width="1024" height="${d-c}" fill="url(#algaeDots)" opacity="${(.15+a*.2).toFixed(2)}" />
      <path d="${u.bottom}" fill="#4d7c0f" fill-opacity="0.32" />
      <path d="${u.bottom}" fill="url(#algaeDots)" />
      <path d="${u.leftWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${u.leftWall}" fill="url(#algaeDots)" opacity="0.8" />
      <path d="${u.rightWall}" fill="#4d7c0f" fill-opacity="0.24" />
      <path d="${u.rightWall}" fill="url(#algaeDots)" opacity="0.8" />
      ${u.strands.map(m=>f`<path d="${m.d}" fill="none" stroke="${m.color}" stroke-width="2.6" stroke-linecap="round" />`)}
    </g>
  `}var E=e=>({fins:[],marks:[],over:[],pec:null,...e}),Zt=(e,t,o)=>`M ${e},${o} Q ${e+6},${o-4} ${e+12},${o} T ${t},${o}`,Ms=e=>E({fins:[h(k("5,-42 -10,-12 10,-12"),e,{op:.9}),h(k("0,42 -8,12 8,12"),e,{op:.9}),h(le(8,10,20,48),void 0,{stroke:"#ffffff",sw:2,lc:"round"})],tail:{at:[-22,0],mul:1,shapes:[h(k("0,0 -20,-14 -15,0 -20,14"),e)],rays:[[-20,-14],[-17,0],[-20,14]]},body:h(k("-20,0 5,-17 24,0 5,17"),e),marks:[h(le(3,-17,3,17),void 0,{stroke:"#0f172a",sw:3})],eye:{x:16,y:-3,r:3,iris:"#ef4444"},area:[3,0,12,10]}),ks=()=>E({tail:{at:[-20,0],mul:1,shapes:[h(k("0,0 -14,-7 -12,0 -14,7"),"rgba(255,255,255,0.7)")],rays:[[-14,-7],[-12,0],[-14,7]]},body:h($(0,0,22,9),"#1e293b"),marks:[h("M 15,-2 L -17,-2",void 0,{stroke:"#06b6d4",sw:3.5,lc:"round"}),h("M 0,3 L -17,3",void 0,{stroke:"#ef4444",sw:3.5,lc:"round"})],eye:{x:14,y:-2,r:2.2,iris:"#38bdf8"},area:[0,0,22,9]}),Ss=()=>E({fins:[h(b(2,0,24),"#b45309",{op:.75})],tail:{at:[-19,0],mul:1,shapes:[h("M 0,0 C -6,-8 -12,-7 -13,0 C -12,7 -6,8 0,0 Z","#c2410c",{op:.85})],rays:[[-12,-4],[-13,0],[-12,4]]},body:h(b(2,0,20),"#ea6a2a"),marks:[Zt(-14,18,-10),Zt(-14,18,-2),Zt(-14,18,6)].map(e=>h(e,void 0,{stroke:"#22d3ee",sw:1.8,op:.85,lc:"round"})),eye:{x:15,y:-3,r:2.6,iris:"#dc2626"},area:[2,0,14,14]}),Cs=()=>E({fins:[h(k("-4,-6 4,-14 10,-6"),"#f97316",{op:.9})],tail:{at:[-16,0],mul:1,shapes:[h("M 0,0 C -8,-12 -22,-15 -29,-8 C -26,-3 -26,3 -29,8 C -22,15 -8,12 0,0 Z","#f97316",{op:.92}),h(b(-18,-6,2.2),"#1e3a8a",{op:.8}),h(b(-22,4,2.6),"#1e3a8a",{op:.8}),h(b(-14,5,1.6),"#1e3a8a",{op:.7})],rays:[[-29,-8],[-27,0],[-29,8]]},body:h($(0,0,17,7.5),"#38bdf8"),marks:[h($(-2,3.5,13,3),"#e0f2fe",{op:.55}),h($(5,-2.5,6,2.2),"#0ea5e9",{op:.5})],eye:{x:12,y:-2,r:2.2},area:[0,0,13,6]}),As=()=>E({tail:{at:[-19,0],mul:1,shapes:[h(k("0,0 -12,-8 -9,0 -12,8"),"#fdba74",{op:.9})],rays:[[-12,-8],[-9,0],[-12,8]]},body:h($(0,0,19,10),"#fb923c"),marks:[h($(-1,6,13,3),"#fde68a",{op:.55}),h("M 6,-8.5 C 9,-4 9,4 6,8.5 C -2,8 -10,4 -16,1 C -10,-1 -2,-5 6,-8.5 Z","#111827")],eye:{x:13,y:-3,r:2.4,iris:"#fde68a"},area:[0,-1,14,7]}),Ts=()=>E({fins:[h(k("-14,-12 -3,-22 8,-12"),"#f97316",{op:.85}),h(k("-16,12 -4,20 10,12"),"#f97316",{op:.85}),h("M 12,8 C 18,16 20,24 18,32",void 0,{stroke:"#f97316",sw:.9,lc:"round"})],tail:{at:[-21,0],mul:1,shapes:[h("M 0,0 C -8,-9 -14,-8 -15,0 C -14,8 -8,9 0,0 Z","#3b82f6",{op:.85})],rays:[[-13,-5],[-15,0],[-13,5]]},body:h($(0,0,21,14),"#3b82f6"),marks:[-12,-6,0,6,12].map((e,t)=>h(`M ${e-4},-12 L ${e+2},12`,void 0,{stroke:t%2?"#1d4ed8":"#f97316",sw:1.6,op:.85})),eye:{x:14,y:-4,r:2.8,iris:"#fef3c7"},area:[0,0,17,11]}),Es=()=>{let e=t=>h(t,"#ffffff",{stroke:"#0f172a",sw:1.4});return E({tail:{at:[-20,0],mul:1,shapes:[h("M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z","#ea580c",{stroke:"#0f172a",sw:1.4})],rays:[[-15,-6],[-17,0],[-15,6]]},body:h($(0,0,24,15),"#f97316"),marks:[e("M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z"),e("M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z"),e("M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z")],pec:{at:[3,3],shapes:[h($(0,6,6,10),"#f97316",{op:.9,stroke:"#0f172a",sw:1})]},eye:{x:15,y:-4,r:3.2},area:[0,0,22,13]})},Ls=()=>E({tail:{at:[-25,0],mul:1,shapes:[h(k("0,-2 -20,-13 -13,-2 -20,9 0,2"),"#f59e0b"),h(k("0,-2 -17,-10 -12,-2 -17,7 0,1"),"#fde047",{op:.85})],rays:[[-20,-13],[-13,-2],[-20,9]]},body:h("M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z","url(#tangBodyGrad)"),marks:[h("M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z","#0f172a",{op:.88})],over:[h(b(19,2,1.5),"#facc15",{op:.8})],eye:{x:18,y:-6,r:2.8,iris:"#0f172a",hl:"#93c5fd"},area:[-2,0,20,16]}),Fs=()=>E({fins:[h("M -16,-8 C -8,-17 8,-16 14,-9 Z","#facc15",{op:.9})],tail:{at:[-22,0],mul:1,shapes:[h("M 0,0 C -8,-9 -14,-9 -15,0 C -14,9 -8,9 0,0 Z","#facc15")],rays:[[-13,-5],[-15,0],[-13,5]]},body:h($(0,0,22,10.5),"#facc15"),marks:[h("M -4,-10.3 A 22,10.5 0 0,1 22,0 A 22,10.5 0 0,1 -4,10.3 C 3,5 3,-5 -4,-10.3 Z","#7c3aed"),h("M 10,-3 L 22,-1",void 0,{stroke:"#1e1b4b",sw:1.4,lc:"round"})],eye:{x:16,y:-3,r:2.6,iris:"#fde68a"},area:[0,0,18,8]}),Rs=()=>{let e=(t,o)=>h(t,void 0,{stroke:"#ea580c",sw:1.3,op:o});return E({tail:{at:[-22,0],mul:1,shapes:[h(k("0,0 -12,-9 -8,0 -12,9"),"#fbbf24",{op:.9})],rays:[[-12,-9],[-8,0],[-12,9]]},body:h($(0,0,23,20),"url(#butterflyBodyGrad)"),marks:[e(le(-14,-16,-8,17),.55),e(le(-6,-19,0,19),.55),e(le(2,-19,7,19),.55),e(le(10,-17,14,16),.5)],over:[h("M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z","#fbbf24"),h(b(-15,0,3),"#1f2937",{op:.8}),h(b(-15,0,1.6),"#fbbf24",{op:.9})],eye:{x:12.5,y:-4,r:2.6,iris:"#0f172a",hl:"#e2e8f0"},area:[0,0,20,17]})},Os=()=>E({fins:[h(k("-14,-15 0,-24 16,-12"),"#fde047",{op:.95}),h(k("-12,15 2,23 16,12"),"#fde047",{op:.95})],tail:{at:[-22,0],mul:1,shapes:[h(k("0,0 -12,-10 -8,0 -12,10"),"#fde047")],rays:[[-12,-10],[-8,0],[-12,10]]},body:h($(0,0,22,17),"#fde047"),marks:[h($(2,8,16,6),"#fef9c3",{op:.7})],over:[h("M 20,-3 Q 27,-1 28,0 Q 27,1 20,3 Z","#fde047"),h(b(-19,0,1.6),"#ffffff",{op:.9})],eye:{x:14,y:-5,r:2.6,iris:"#ffffff"},area:[0,0,17,14]}),Is=()=>E({fins:[h(k("-6,-7 4,-14 12,-7"),"#2dd4bf",{op:.9}),h(k("-8,7 0,12 8,7"),"#2dd4bf",{op:.9})],tail:{at:[-20,0],mul:1,shapes:[h(k("0,0 -14,-11 -9,0 -14,11"),"#2dd4bf")],rays:[[-14,-11],[-9,0],[-14,11]]},body:h($(0,0,20,8.5),"url(#chromisGrad)"),marks:[h($(0,4,15,2.6),"#e0f2fe",{op:.45})],eye:{x:14,y:-2,r:2.2},area:[0,0,16,7]}),Bs=()=>E({fins:[h(k("-12,-8 4,-20 14,-8"),"#fb923c",{op:.9})],tail:{at:[-21,0],mul:1,shapes:[h("M 0,0 L -8,-10 L -18,-16 L -8,-3 L -7,0 L -8,3 L -18,16 L -8,10 Z","#fb923c")],rays:[[-18,-16],[-7,0],[-18,16]]},body:h($(0,0,21,9),"#f97316"),marks:[h($(0,4.5,15,3.6),"#f9a8d4",{op:.65})],eye:{x:15,y:-2,r:2.4,iris:"#fde68a"},area:[0,0,16,7]}),Ns=e=>E({fins:[h("M -4,-20 C 2,-33 18,-31 21,-18 Z",e,{op:.8})],tail:{at:[-14,0],mul:1.1,shapes:[h("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z",e,{op:.88})],rays:[[-35,-11],[-43,17],[-21,34]]},body:h("M -14,4 C -16,-12 -4,-26 10,-22 C 22,-19 28,-8 27,2 C 26,12 18,18 8,18 C -4,18 -14,14 -14,4 Z",e),marks:[h($(4,9,12,6),"#ffffff",{op:.75}),h($(-4,-10,7,4),"#ffffff",{op:.55})],eye:{x:21,y:-3,r:3.4},area:[6,0,15,15]}),Ps=e=>E({fins:[h(k("-4,-16 4,-25 14,-17"),e,{op:.85})],tail:{at:[-16,0],mul:1,shapes:[h("M 0,0 L -48,-19 L -30,-1 Z",e,{op:.92}),h("M 0,0 L -48,19 L -30,1 Z",e,{op:.8})],rays:[[-48,-19],[-48,19]]},body:h("M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z",e),marks:[h($(6,-5,10,4),"#ffffff",{op:.65}),h($(-3,5,8,3.5),"#ffffff",{op:.55})],eye:{x:20,y:-3,r:3},area:[6,0,17,13]}),Us=e=>E({tail:{at:[-14,0],mul:.8,shapes:[h("M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z",e,{op:.88})],rays:[[-30,-2],[-30,6]]},body:h(b(4,2,22),e),marks:[[-8,-4],[0,-12],[10,-10],[-10,6],[-2,0],[8,-2],[16,4],[-4,12],[6,10],[14,14]].map(([t,o])=>h(b(t,o,3.4),"#ffffff",{op:.32})),eye:{x:20,y:-1,r:3},area:[4,2,17,17]}),Ds=()=>E({fins:[h("M -6,-15 C 0,-27 14,-26 15,-14 Z","#fecdd3",{op:.85})],tail:{at:[-15,0],mul:1,shapes:[h("M 0,0 C -8,-16 -24,-20 -38,-13 C -31,-7 -30,-2 -32,3 C -28,10 -36,15 -38,19 C -24,22 -8,16 0,0 Z","#fecdd3",{op:.88})],rays:[[-38,-13],[-32,3],[-38,19]]},body:h($(4,2,21,17),"#ffedd5"),marks:[h($(-2,-6,14,7),"#fdba74",{op:.55})],over:[[22,-6,6],[16,-13,6.5],[8,-15,6],[1,-12,5]].map(([e,t,o])=>h(b(e,t,o),"#dc2626")),eye:{x:22,y:0,r:3},area:[4,3,16,13]}),Hs=()=>E({fins:[h("M -4,-18 C 2,-30 18,-28 20,-16 Z","#1f2937",{op:.85})],tail:{at:[-14,0],mul:1.1,shapes:[h("M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z","#1f2937",{op:.9})],rays:[[-35,-11],[-43,17],[-21,34]]},body:h(b(6,1,21),"#111827"),marks:[h($(2,-9,12,5),"#475569",{op:.45})],over:[h($(23,-6,10.5,9),"#1f2937")],eye:{x:24,y:-6,r:6,iris:"#f59e0b"},area:[6,1,16,15]}),qs=()=>E({fins:[h(k("-6,-14 4,-24 14,-14"),"#dbeafe",{op:.85})],tail:{at:[-20,0],mul:1,shapes:[h("M 0,0 C -10,-15 -28,-15 -34,-5 L -30,0 L -34,5 C -28,15 -10,15 0,0 Z","#dbeafe",{op:.85})],rays:[[-34,-5],[-30,0],[-34,5]]},body:h($(2,0,24,14),"#bfdbfe"),marks:[h($(-8,-4,9,6),"#f97316"),h($(9,4,6,4.5),"#dc2626"),h(b(2,-8,2.2),"#1e3a8a",{op:.75}),h(b(-2,7,1.8),"#111827",{op:.7}),h(b(14,-5,1.6),"#111827",{op:.7})],eye:{x:20,y:-3,r:3},area:[2,0,19,11]}),mr=[Ms,ks,Ss,Cs,As,Ts],_r=[Es,Ls,Fs,Rs,Os,Is,Bs],gr=[Ns,Ps,Us,Ds,Hs,qs],Oa={freshwater:mr.length,saltwater:_r.length,coldwater:gr.length};function $r(e,t){let o=t.color||"#3b82f6",r=e==="saltwater"?_r:e==="coldwater"?gr:mr,i=Math.abs(Math.trunc(Number(t.species)))||0;return T(`fish|${e==="saltwater"||e==="coldwater"?e:"freshwater"}|${i%r.length}|${o}`,()=>r[i%r.length](o))}var Vs=f``,ct=11,Gs=2.399963,zs=Array.from({length:ct},(e,t)=>{let o=Math.sqrt((t+.5)/ct)*.85,r=t*Gs;return[o*Math.cos(r),o*Math.sin(r),.75+t*7%3*.3]});function Zs(e){return e>0?Math.min(ct,Math.ceil(e*ct)):0}function be(e,t,o,r=1.7){let i=Zs(e);if(i===0)return Vs;let[s,n,a,l]=t,c=Math.min(1,.35+e);return f`
    <g class="stress-dots" pointer-events="none">
      ${zs.slice(0,i).map(([d,u,m],p)=>{let _=.8+.2*Math.sin(o*5+p*1.7);return f`<circle cx="${(s+d*a).toFixed(1)}" cy="${(n+u*l).toFixed(1)}" r="${(r*m).toFixed(2)}" fill="#ffffff" fill-opacity="${(c*_).toFixed(2)}" stroke="#0f172a" stroke-opacity="${(.28*c).toFixed(2)}" stroke-width="0.4" />`})}
    </g>
  `}function js(e){return T(`scales|${e.join(",")}`,()=>Qs(e))}function Qs(e){let[t,o,r,i]=e,s=[],n=0;for(let a=o-i*.7;a<=o+i*.7;a+=5){for(let l=t-r*.8+n%2*3;l<=t+r*.8;l+=6)((l-t)/r)**2+((a-o)/i)**2<=.72&&s.push(`M${l.toFixed(1)},${a.toFixed(1)} q3,2.4 6,0`);n++}return s.join(" ")}function Ws(e,t){let o=t.iris??"#ffffff",r=t.hl??"#ffffff";if(e==="cartoon"){let i=t.r*2.1;return f`
      <circle cx="${t.x}" cy="${t.y}" r="${i}" fill="#ffffff" stroke="${S}" stroke-width="1.5" />
      <circle cx="${t.x+i*.12}" cy="${t.y+i*.1}" r="${i*.6}" fill="#111827" />
      <circle cx="${t.x+i*.3}" cy="${t.y-i*.28}" r="${i*.26}" fill="#ffffff" />
      <circle cx="${t.x-i*.12}" cy="${t.y+i*.3}" r="${i*.12}" fill="#ffffff" />
    `}return e==="realistic"?f`
      <circle cx="${t.x}" cy="${t.y}" r="${t.r*1.15}" fill="${o==="#ffffff"?"#fef3c7":o}" stroke="#111827" stroke-opacity="0.8" stroke-width="0.9" />
      <circle cx="${t.x+.4}" cy="${t.y}" r="${t.r*.62}" fill="#000000" />
      <circle cx="${t.x-t.r*.3}" cy="${t.y-t.r*.4}" r="${t.r*.28}" fill="${r}" />
    `:f`
    <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="${o}" />
    <circle cx="${t.x+1}" cy="${t.y}" r="${t.r*.48}" fill="#0f172a" />
    <circle cx="${t.x+.4}" cy="${t.y-t.r*.4}" r="${t.r*.2}" fill="${r}" />
  `}function Ys(e,t,o){let[r,i,s,n]=o.area,a=o.eye;return e==="cartoon"?f`
      ${g(h($(a.x-a.r*.4,a.y+a.r*3.1,a.r*1.3,a.r*.8),"#fb7185",{op:.7,stroke:"none"}))}
      ${g(h(`M${a.x+a.r*.6},${a.y+a.r*2.7} q${a.r*1.2},${a.r*1.1} ${a.r*2.4},0`,void 0,{stroke:S,sw:1.3,lc:"round"}))}
    `:e==="realistic"?f`
      ${t?f`<path d="${o.body.d}" fill="url(#shade)" />`:""}
      ${g(h(js(o.area),void 0,{stroke:"#0f172a",sw:.8,op:.22}))}
      ${g(h($(r-s*.15,i-n*.62,s*.6,Math.max(1.4,n*.13)),"#ffffff",{op:.3}))}
    `:f`
    ${g(h($(r,i+n*.55,s*.85,n*.4),"#ffffff",{op:.14}))}
    ${g(h(`M${a.x-a.r*1.6},${a.y+a.r*.8} q${-a.r*.9},${a.r*2.2} 0,${a.r*4.4}`,void 0,{stroke:"#0f172a",sw:1,op:.22,lc:"round"}))}
  `}function Xs(e,t,o,r,i,s=0,n=0){let a=Ks(e,t,o);return f`
    ${a.fins}
    <g transform="translate(${o.tail.at[0]}, ${o.tail.at[1]}) rotate(${r*o.tail.mul})">
      ${a.tail}
    </g>
    ${a.body}
    ${be(s,o.area,n)}
    ${o.pec?f`<g transform="translate(${o.pec.at[0]}, ${o.pec.at[1]}) rotate(${i})">${a.pec}</g>`:""}
    ${a.eye}
  `}function Ks(e,t,o){let r=yr.get(o);r||yr.set(o,r=new Map);let i=`${e}|${t}`,s=r.get(i);if(!s){let n=e==="cartoon",a=e==="cartoon"?[]:o.tail.rays,l=e==="realistic"?.32:.16;s={fins:f`${o.fins.map(c=>g(c,n))}`,tail:f`
        ${o.tail.shapes.map(c=>g(c,n))}
        ${a.map(([c,d])=>g(h(`M0,0 L${c},${d}`,void 0,{stroke:"#0f172a",sw:.9,op:l})))}
      `,body:f`
        ${g(o.body,n)}
        ${o.marks.map(c=>g(c,n))}
        ${Ys(e,t,o)}
        ${o.over.map(c=>g(c,n))}
      `,pec:o.pec?f`${o.pec.shapes.map(c=>g(c,n))}`:f``,eye:Ws(e,o.eye)},r.set(i,s)}return s}var yr=new WeakMap;function br(e,t,o,r){let i=t.dir===-1,s=t.deathProgress||0,n=t.scale||1.4,a=(1-s).toFixed(2),l=s.toFixed(2),c=r?0:t.scare||0,d=r?0:Math.sin(e._animTime*(3.5*t.vx)+t.phase)*14*(1+.8*c),u=r?0:Math.sin(e._animTime*(4.5*t.vx)+t.phase)*10,m=r?0:t.stress||0,p=Xs(F(e),I(e),$r(o,t),d,u,m,e._ambientTime);return f`
    <g transform="scale(${i?-n:n}, ${r?-n:n})">
      <g opacity="${a}">${p}</g>${s>0?f`
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
  `}function jt(e,t){let o=`M${e[0]},${e[1]}`;for(let i of t)o+=` C${i.join(",")}`;let r=[e,...t.map(i=>[i[4],i[5]])];for(let i=t.length-1;i>=0;i--){let[s,n,a,l]=t[i];o+=` C${-a},${l} ${-s},${n} ${-r[i][0]},${r[i][1]}`}return`${o} Z`}function De(e,t,o){return{k:(s,n,a)=>N(e,t,s,n,{...e==="cartoon"?{}:o,...a===void 0?{}:{op:a}}),line:(s,n,a,l)=>g(h(s,void 0,{stroke:a,sw:n,op:l,lc:"round"}))}}var Js=[[-24,8,"M -24,8 L -27,16 L -31,21"],[-16,9,"M -16,9 L -17,17 L -20,22"],[-8,9,"M -8,9 L -8,17 L -10,22"],[0,9,"M 0,9 L 1,17 L 0,22"]],en=[[22,-4,"M 22,-4 L 33,-11 L 42,-6","M 22,-4 L 33,-11"],[24,1,"M 24,1 L 36,1 L 44,7","M 24,1 L 36,1"],[22,7,"M 22,7 L 32,14 L 38,24","M 22,7 L 32,14"],[16,12,"M 16,12 L 22,22 L 25,32","M 16,12 L 22,22"]],xe=e=>f`${e}<g transform="scale(-1,1)">${e}</g>`;function Ue(e,t,o){return f`
    ${g(h(b(e,t,o),"#ffffff",{stroke:S,sw:1.2}))}
    ${g(h(b(e+o*.15,t+o*.1,o*.58),"#111827",{stroke:"none"}))}
    ${g(h(b(e+o*.32,t-o*.3,o*.24),"#ffffff",{stroke:"none"}))}
  `}function xr(e,t,o){let r=T(`ancistrus|${e}|${t}`,()=>tn(e,t));return f`${r.before}<g transform="translate(0, 3) scale(${o},${o})">${r.mouth}</g>${r.after}`}function tn(e,t){let o=e==="cartoon",{k:r,line:i}=De(e,t,{stroke:"#0a0f14",sw:.8}),s=Array.from({length:18},(c,d)=>{let u=d/18*Math.PI*2,[m,p]=[Math.cos(u),Math.sin(u)];return`M${(m*6.5).toFixed(1)},${(p*5).toFixed(1)} L${(m*8.6).toFixed(1)},${(p*6.7).toFixed(1)}`}).join(" "),n=f`
    ${r(jt([0,73],[[3,75,8,80,9,89],[6,91,2,88,0,84]]),"#182026")}
    ${e==="cartoon"?"":xe(i("M 1,76 L 6,88 M 1,76 L 8,86",.7,"#64748b",.5))}
    ${xe(f`
      ${r("M 15,12 C 24,12 32,20 34,32 C 33,38 28,40 24,36 C 19,30 16,22 15,16 Z","#182026")}
      ${o?"":i("M 16,15 L 33,26 M 16,17 L 33,32 M 17,19 L 30,37 M 18,20 L 25,37",.7,"#64748b",.5)}
      ${i("M 15,12 C 24,12 31,19 34,31",1.5,"#64748b",.9)}
      ${r("M 9,38 C 15,40 20,47 19,55 C 16,57 12,53 10,48 Z","#182026")}
      ${o?"":i("M 10,41 L 18,52 M 11,43 L 15,54",.6,"#64748b",.5)}
      ${r("M 4,60 C 7,60 9,64 8,68 C 6,68 4,66 3,64 Z","#182026")}
    `)}
    ${r(jt([0,-11],[[7,-11,13,-8,15,-1],[17,6,18,12,16,18],[14,28,11,42,8,56],[6,64,3,71,0,75]]),"#1e293b")}
    ${r(jt([0,14],[[7,14,10,22,9,32],[8,44,6,56,4,66],[3,69,2,71,0,72]]),"#475569",.9)}
    ${e==="flat"?[[-3,24,1.2],[4,30,1],[-5,38,1.3],[3,46,1],[-3,54,1.2],[2,62,.9],[-1,32,.8],[5,52,.8]].map(([c,d,u])=>g(h(b(c,d,u),"#ffffff",{op:.7,stroke:"none"}))):""}
    ${e==="realistic"?xe(i("M 12,20 C 10,34 8,48 5,62",.9,"#0a0f14",.4)):""}
    ${xe(f`
      ${i("M 6,-8 C 9,-12 12,-14 13,-19",2.2,"#3b4a5f",1)}
      ${i("M 10,-14 C 13,-15 15,-17 16,-20",1.6,"#3b4a5f",1)}
      ${i("M 2.5,-10 C 3.5,-14 3,-18 1.5,-21",2.2,"#3b4a5f",1)}
    `)}
  `,a=f`
      ${g(h($(0,0,9.2,7.2),"#64748b",{stroke:"#0a0f14",sw:.9}))}
      ${e==="cartoon"?"":i(s,.6,"#94a3b8",.7)}
      ${g(h($(0,0,6.3,4.8),"#334155",{stroke:"#0a0f14",sw:.7}))}
      ${g(h($(0,0,3.4,2.5),"#0f172a",{stroke:"none"}))}
  `,l=f`
    ${o?f`${Ue(-9,-3,3.8)}${Ue(9,-3,3.8)}${g(h($(-13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}${g(h($(13,9,2.8,1.8),"#fb7185",{op:.65,stroke:"none"}))}`:xe(f`${g(h(b(12.3,-3,1.7),"#0a0f14",{stroke:"none"}))}${g(h(b(12.7,-3.5,.5),"#f1f5f9",{stroke:"none"}))}`)}
    ${e==="realistic"?g(h($(-4,34,2.4,14),"#ffffff",{op:.1,stroke:"none"})):""}
  `;return{before:n,mouth:a,after:l}}function wr(e,t,o={}){let{phase:r=0,stride:i=0,time:s=0}=o,{line:n}=De(e,t,{stroke:"#7f1d1d",sw:.8}),a=vr,l=Qt[2],c=[0,1,2,3,4].map(u=>{let m=-110+u*13,p=8-u*.8,[_,x]=a(m,l-p),[v,w]=a(m,l-p-4.5),M=.3*Math.sin(s*6+u*1.1),[A,L]=[v-_,w-x],[B,U]=[_+A*Math.cos(M)-L*Math.sin(M),x+A*Math.sin(M)+L*Math.cos(M)];return`M${_.toFixed(1)},${x.toFixed(1)} L${B.toFixed(1)},${U.toFixed(1)}`}).join(" "),d=Js.map(([u,m,p],_)=>f`<g transform="rotate(${(i*16*Math.sin(r+_*1.7)).toFixed(1)} ${u} ${m})">${n(p,1.6,"#7f1d1d",.85)}</g>`);return f`
    ${d}
    ${n(c,1.3,"#7f1d1d",.7)}
    ${T(`shrimp|${e}|${t}`,()=>on(e,t))}
  `}var Qt=[22,28,27];function vr(e,t=Qt[2]){let[o,r]=Qt;return[o+t*Math.cos(e*Math.PI/180),r+t*Math.sin(e*Math.PI/180)]}function on(e,t){let o=e==="cartoon",{k:r,line:i}=De(e,t,{stroke:"#7f1d1d",sw:.8}),s=vr,n=[4,3,2,1,0].map(d=>{let u=-110+d*13,[m,p]=s(u),_=8-d*.8;return f`<g transform="rotate(${u} ${m.toFixed(1)} ${p.toFixed(1)})">${r($(Number(m.toFixed(1)),Number(p.toFixed(1)),_,6.6-d*.25),d%2?"#c81e1e":"#d42424")}</g>`}),[a,l]=s(-45);return f`
    <g transform="translate(${a.toFixed(1)} ${l.toFixed(1)}) rotate(${45})">
      ${r("M 0,-2.4 C 5,-9.5 11,-10.5 14,-7 C 11,-3.2 6,-1 0,0 Z","#dc2626")}
      ${r("M 0,2.4 C 5,9.5 11,10.5 14,7 C 11,3.2 6,1 0,0 Z","#dc2626")}
      ${r("M 0,-3 C 6,-3 11,-1.6 15,0 C 11,1.6 6,3 0,3 Z","#ef4444")}
      ${o?"":i("M 2,-1.5 L 12,-7 M 2,0 L 13,0 M 2,1.5 L 12,7",.7,"#7f1d1d",.5)}
    </g>
    ${n}
    ${r("M -34,-3 C -34,-11 -25,-16 -12,-16 C 0,-16 10,-12 13,-4 C 15,1 12,6 6,8 L -14,8 C -27,8 -34,3 -34,-3 Z","#dc2626")}
    ${o?"":i("M -28,-12 C -18,-17 -2,-17 8,-14 C 12,-14 14,-12 16,-9",2.2,"#fef2f2",.85)}
    ${r("M -33,-9 L -50,-13 L -35,-3 Z","#dc2626")}
    ${i("M -32,-12 Q -60,-24 -88,-30 M -30,-9 Q -54,-12 -80,-10",1.1,"#fef9c3",.9)}
    ${i("M -33,-9 Q -44,-8 -50,-2",1,"#fef9c3",.8)}
    ${o?f`${Ue(-26,-12,5)}${g(h($(-22,-2,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${g(h("M -32,-4 Q -28,1 -23,-3",void 0,{stroke:S,sw:1.2,lc:"round"}))}`:f`
          ${g(h(b(-27,-13,3),"#0f172a",{stroke:"none"}))}
          ${g(h(b(-27.8,-14,.9),"#f1f5f9",{stroke:"none"}))}
        `}
    ${e==="flat"?[[-22,-7],[-14,-10],[-6,-10],[1,-7]].map(([d,u])=>g(h(b(d,u,1.5),"#fef2f2",{op:.9,stroke:"none"}))):""}
    ${e==="realistic"?g(h($(-8,-14,12,1.6),"#ffffff",{op:.35,stroke:"none"})):""}
  `}function Mr(e,t,o={}){let{phase:r=0,stride:i=0}=o,s=e==="cartoon",{k:n,line:a}=De(e,t,{stroke:"#7c2d12",sw:.9}),l=T(`crab-claw|${e}|${t}`,()=>f`
        ${a("M 20,-8 L 30,-17",s?4:3.4,"#7c2d12",1)}
        ${n("M 27,-19 C 25,-30 34,-36 41,-33 C 46,-30 45,-25 41,-24 C 45,-21 43,-16 38,-16 C 33,-16 29,-17 27,-19 Z","#ea580c")}
        ${n("M 31,-31 C 33,-40 42,-42 46,-37 C 42,-38 38,-36 36,-32 Z","#ea580c")}
        ${e==="cartoon"?"":g(h("M 36,-28 L 39,-31 L 40,-27 L 43,-29 M 34,-21 L 38,-22 L 38,-19 L 42,-20",void 0,{stroke:"#fef3c7",sw:.9,lc:"round",op:.8}))}
      `),c=d=>{let u=p=>(i*13*Math.sin(r+p*Math.PI+d*Math.PI)).toFixed(1),m=en.map(([p,_,x,v],w)=>f`
      <g transform="rotate(${u(w)} ${p} ${_})">
        ${a(x,s?3.2:2.6,"#7c2d12",1)}
        ${s?"":a(v,.8,"#f87171",.5)}
      </g>
    `);return f`
      ${m}
      <g transform="rotate(${(i*5*Math.sin(r*.7+d*1.3)).toFixed(1)} 20 -8)">${l}</g>
    `};return f`
    ${c(0)}<g transform="scale(-1,1)">${c(1)}</g>
    ${T(`crab-body|${e}|${t}`,()=>rn(e,t))}
  `}function rn(e,t){let o=e==="cartoon",{k:r,line:i}=De(e,t,{stroke:"#7c2d12",sw:.9});return f`
    ${r("M 0,-15 C 10,-16 20,-14 26,-8 L 30,-2 L 27,4 C 24,12 14,18 0,18 C -14,18 -24,12 -27,4 L -30,-2 L -26,-8 C -20,-14 -10,-16 0,-15 Z","#dc2626")}
    ${r("M 0,-11 C 9,-12 17,-10 22,-5 L 24,0 C 22,8 12,13 0,13 C -12,13 -22,8 -24,0 L -22,-5 C -17,-10 -9,-12 0,-11 Z","#ef4444",.55)}
    ${e==="cartoon"?"":f`
          ${i("M -14,-6 Q 0,-13 14,-6 M -16,2 Q 0,-4 16,2 M 0,-12 L 0,12",.9,"#7f1d1d",.4)}
          ${e==="flat"?[[-9,3,1.6],[9,4,1.6],[0,8,1.4],[6,-5,1.2],[-7,-4,1.2]].map(([s,n,a])=>g(h(b(s,n,a),"#fca5a5",{op:.85,stroke:"none"}))):""}
        `}
    ${xe(f`${i("M 6,-15 L 7,-21",1.4,"#7c2d12",1)}${o?"":g(h(b(7,-22,2.2),"#0f172a",{stroke:"none"}))}`)}
    ${o?f`${Ue(-7,-23,5)}${Ue(7,-23,5)}${g(h("M -6,8 Q 0,14 6,8",void 0,{stroke:S,sw:1.4,lc:"round"}))}${g(h($(-15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}${g(h($(15,6,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}`:""}
    ${e==="realistic"?g(h($(-7,-8,11,2.2),"#ffffff",{op:.3,stroke:"none"})):""}
  `}var kr=(e,t,o)=>({phase:e.walk||0,stride:t?0:e.stride||0,time:o}),Wt=(e,t,o,r)=>be(t?0:e.stress||0,o,r,1.5);function Sr(e,t){if(!e._ancistrus)return f``;let o=e._ancistrus,r=o.deathProgress||0,i=(1-r).toFixed(2),s=t?1:Number((1+Math.sin(e._ambientTime*1.6)*.07).toFixed(3)),n=F(e),a=I(e);return f`
    <g transform="translate(${o.x}, ${o.y}) rotate(${t?0:(o.heading??0).toFixed(1)}) scale(1.5,${t?-1.5:1.5})">
      <g opacity="${i}">
        ${xr(n,a,s)}
        ${Wt(o,t,[0,30,11,38],e._ambientTime)}
      </g>

      ${r>0?f`
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
  `}function Cr(e,t){if(!e._shrimp)return f``;let o=e._shrimp,i=(1-(o.deathProgress||0)).toFixed(2),s=o.dir===-1?-1:1;return f`
    <g transform="translate(${o.x}, ${o.y}) scale(${s*1.5}, ${t?-1.5:1.5})" opacity="${i}">
      ${wr(F(e),I(e),kr(o,t,e._ambientTime))}
      ${Wt(o,t,[-4,-3,24,8],e._ambientTime)}
    </g>
  `}function Ar(e,t){if(!e._crab)return f``;let o=e._crab,r=o.deathProgress||0,i=Math.max(0,Math.min(1,o.hide||0)),s=((1-r)*(1-i*.92)).toFixed(2),n=o.dir===-1?-1:1,a=Number((1.4*(1-i*.6)).toFixed(3)),l=i>.85&&!t?Math.min(1,(i-.85)/.15):0;return f`
    <g transform="translate(${o.x}, ${o.y}) scale(${n*a}, ${t?-a:a})" opacity="${s}">
      ${Mr(F(e),I(e),kr(o,t,e._ambientTime))}
      ${Wt(o,t,[0,2,21,11],e._ambientTime)}
    </g>
    ${l>0?f`
          <g transform="translate(${o.x}, ${(o.y-22*a).toFixed(1)})" opacity="${l.toFixed(2)}">
            <circle cx="-6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="-5.4" cy="0.4" r="1.9" fill="#0f172a" />
            <circle cx="6" cy="0" r="3.6" fill="#f8fafc" /><circle cx="6.6" cy="0.4" r="1.9" fill="#0f172a" />
          </g>
        `:""}
  `}function Tr(e){return f`
    <g>
      ${e._flowBubbles.filter(t=>t.active).map(t=>f`<circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="${t.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`)}
    </g>
  `}function Er(e){return e._food.length?f`
    <g>
      ${e._food.map(t=>f`<ellipse cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" rx="${t.r.toFixed(1)}" ry="${(t.r*.6).toFixed(1)}" fill="${t.color}" stroke="#b45309" stroke-width="0.6" />`)}
    </g>
  `:f``}function Lr(e){if(!e._ripples.length)return f``;let t=Date.now();return f`
    <g>
      ${e._ripples.map(o=>{let r=Math.min(1,(t-o.born)/rt),i=(1-r).toFixed(2);return f`
          <circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(14+r*150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5-r*3).toFixed(1)}" stroke-opacity="${i}" />
          ${e._profile.doubleRipple?f`<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${(6+r*90).toFixed(1)}" fill="#ffffff" fill-opacity="${(.28*(1-r)).toFixed(2)}" />`:""}
        `})}
    </g>
  `}function Fr(e){return f`
    <g>
      ${e.map(t=>f`
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
        `)}
    </g>
  `}function Rr(e){return f`
    <g>
      ${e.map(t=>f`
          <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
        `)}
    </g>
  `}function Or(e,t){if(!t)return f``;let o=st(t.total,Z(e._hass));return f`
    <g transform="translate(512, 96)" pointer-events="none">
      <text font-family="system-ui, sans-serif" font-size="54" font-weight="800" text-anchor="middle" fill="#0f172a" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${o}</text>
    </g>
  `}function Ir(e){return!e._config?.show_fps||!e._fpsInfo?f``:f`
    <g pointer-events="none">
      <rect x="292" y="6" width="440" height="30" rx="8" fill="#000000" fill-opacity="0.72" />
      <text x="512" y="27" font-family="monospace" font-size="17" font-weight="700" fill="#ffffff" text-anchor="middle">${e._fpsInfo}</text>
    </g>
  `}function Br(e,t,o){if(!t)return f``;let r=o?112:24+(e._config?.show_fps?38:0),i=K(Z(e._hass),"label_sensor_unavailable");return f`
    <g transform="translate(0, ${r})" pointer-events="none">
      <rect x="362" y="0" width="300" height="34" rx="17" fill="#000000" fill-opacity="0.72" />
      <path d="M383 25 L393 8 L403 25 Z" fill="#f59e0b" />
      <rect x="392" y="13" width="2" height="7" fill="#0f172a" />
      <circle cx="393" cy="22.4" r="1.3" fill="#0f172a" />
      <text x="416" y="23" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${i}</text>
    </g>
  `}function Nr(e,t){if(!e)return f``;let o=Math.max(260,e.length*22+70);return f`
    <g transform="translate(512, ${Math.round(t/2)})" pointer-events="none">
      <rect x="${-o/2}" y="-30" width="${o}" height="60" rx="30" fill="#000000" fill-opacity="0.72" />
      <text y="9" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" text-anchor="middle">${e}</text>
    </g>
  `}function sn(e,t,o,r){let i=e==="cartoon",s=(l,c,d)=>N(e,t,l,c,{...i?{}:{stroke:"#a16207",sw:.7},...d===void 0?{}:{op:d}}),n=(l,c,d,u)=>g(h(l,void 0,{stroke:d,sw:c,op:u,lc:"round"}));return f`
    ${s("M -34,-1 C -40,-7 -47,-7 -49,-1 C -47,5 -40,6 -34,-1 Z","#fde68a")}
    ${s("M -28,-5 C -24,-13 -14,-15 -8,-11 L -10,-6 Z","#fde047",.9)}
    <g transform="rotate(${o.toFixed(2)} 2 -10)">
      ${s("M -6,-10 C -3,-26 8,-30 13,-23 C 12,-17 9,-12 7,-10 Z","#fde047",.95)}
      ${i?"":n("M -3,-13 C 0,-24 6,-27 11,-22",1.1,"#38bdf8",.8)}
    </g>
    ${s("M -34,-1 C -26,-6 -12,-11 6,-12 C 16,-12.5 26,-10 31,-5 C 34,-2 33,1 29,3 C 22,5.5 6,6 -10,4.5 C -24,3 -32,2 -34,-1 Z","#fde047")}
    ${g(h($(4,3,26,3.4),"#fef9c3",{op:.8,stroke:"none"}))}
    ${i?"":n("M -14,-9 L -15,4 M -2,-11 L -3,5 M 10,-11 L 9,5",2.4,"#fffbeb",.55)}
    ${i?"":[[22,-2,1.1],[17,-6,1],[26,-6,.9]].map(([l,c,d])=>g(h(b(l,c,d),"#38bdf8",{stroke:"none"})))}
    ${s("M 15,0 C 22,4 21,11 14,11 C 12,6 12,2 15,0 Z","#fde68a",.9)}
    ${n("M 17,-8 Q 13,-2 16,4",1+r*.3,"#a16207",.35)}
    ${i?f`
          ${g(h(b(25,-11,6),"#ffffff",{stroke:S,sw:1.3}))}
          ${g(h(b(26,-10.4,3.5),"#111827",{stroke:"none"}))}
          ${g(h(b(27.8,-12.6,1.4),"#ffffff",{stroke:"none"}))}
          ${g(h($(22,0,3.4,2),"#fb7185",{op:.75,stroke:"none"}))}
          ${n("M 32,0 Q 28,3.5 24,2",1.3,S,1)}
        `:f`
          ${g(h(b(25,-10,3.4),e==="realistic"?"#fef3c7":"#fffbeb",{stroke:"#111827",sw:.7,op:1}))}
          ${g(h(b(25.6,-10,1.8),"#0f172a",{stroke:"none"}))}
          ${g(h(b(24.6,-11,.6),"#ffffff",{stroke:"none"}))}
          ${n("M 33,0 Q 29,2 26,1",.9,"#a16207",.8)}
        `}
    ${e==="realistic"?g(h($(6,-8,14,1.6),"#ffffff",{op:.32,stroke:"none"})):""}
    ${e==="flat"?n("M -20,-6 Q -8,-9 4,-8",.8,"#a16207",.3):""}
  `}function nn(e,t){return f`
    ${N(e,t,$(-44,4,20,7),"#d8b45f",{...e==="cartoon"?{}:{stroke:"#a16207",sw:.7},op:.95})}
    ${g(h($(-42,2.4,11,3.6),"#5b4423",{stroke:"none"}))}
  `}var He={slide:-68,sink:3,tilt:78,head:[26,-4],sandLine:5};function an(e){let[t,o]=He.head;return`translate(${(e*He.slide).toFixed(1)}, ${(e*He.sink).toFixed(1)}) rotate(${(-e*He.tilt).toFixed(1)} ${t} ${o})`}function ln(e,t){return N(e,t,"M -64,4 A 20,7 0 0,0 -24,4 Z","#d8b45f",{...e==="cartoon"?{}:{stroke:"none"},op:.95})}function Pr(e,t){if(!e._goby)return f``;let o=e._goby,i=(1-(o.deathProgress||0)).toFixed(2),s=t?0:Math.sin(e._ambientTime*1.4)*3,n=t?0:Math.sin(e._ambientTime*2.6),a=F(e),l=I(e),c=Math.max(0,Math.min(1,o.hide||0)),d=o.y+He.sandLine*1.3;return f`
    <g transform="translate(${o.x}, ${o.y}) scale(1.3, 1.3)">${nn(a,l)}</g>
    ${c>0?f`<clipPath id="goby-sand"><rect x="-100" y="-100" width="2300" height="${(d+100).toFixed(1)}" /></clipPath>`:""}
    <g clip-path="${c>0?"url(#goby-sand)":"none"}">
      <g transform="translate(${o.x}, ${o.y}) scale(1.3, ${t?-1.3:1.3})" opacity="${i}">
        <g transform="${an(c)}">
          ${sn(a,l,s,n)}
          ${be(t?0:o.stress||0,[0,-3,27,6],e._ambientTime,1.5)}
        </g>
      </g>
    </g>
    ${c>0?f`<g transform="translate(${o.x}, ${o.y}) scale(1.3, 1.3)">${ln(a,l)}</g>`:""}
  `}var W="#0f172a",we="system-ui, sans-serif",re=62,qr=30,Vr=92,ce=9,cn=38,Ur=114,Jt=12,Yt=qr+Vr-1+Jt,Xt=992,ht=170,Q=62,Dr=10,Kt=270,dt=135,hn=102;function dn(e,t,o){let r=s=>Ur-s*(Ur-cn),i=r(t.tempFraction);return f`
    <g pointer-events="none">
      <rect x="${re-ce}" y="${qr}" width="${ce*2}" height="${Vr}" rx="${ce}" fill="#ffffff" fill-opacity="0.9" stroke="${W}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${re}" cy="${Yt}" r="${Jt}" fill="#ffffff" fill-opacity="0.9" stroke="${W}" stroke-opacity="0.35" stroke-width="1.5" />
      <circle cx="${re}" cy="${Yt}" r="${Jt-3.5}" fill="${t.tempColor}" />
      <rect x="${re-4.5}" y="${i}" width="9" height="${Yt-i}" fill="${t.tempColor}" />
      ${t.ticks.map(s=>f`<line x1="${re-ce}" y1="${r(s)}" x2="${re-ce-8}" y2="${r(s)}" stroke="${W}" stroke-opacity="0.45" stroke-width="2" />`)}
      ${t.marks.map(s=>f`<line x1="${re+ce}" y1="${r(s.fraction)}" x2="${re+ce+12}" y2="${r(s.fraction)}" stroke="${s.color}" stroke-width="3.5" stroke-linecap="round" />`)}
      <text x="106" y="96" font-family="${we}" font-size="54" font-weight="800" fill="${W}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${O(e,o)}°</text>
    </g>
  `}function Gr(e,t){return e.volBlink&&t?"threshold-blink":""}function fn(e,t,o,r,i,s){let n=o?f`<tspan dx="12" font-size="30" font-weight="700">/ ${Ne(t,i)}</tspan><tspan dx="6" font-size="28" font-weight="800">L</tspan>`:f`<tspan dx="6" font-size="28" font-weight="800">L</tspan>`;return f`
    <g pointer-events="none">
      <text x="${Xt}" y="86" text-anchor="end" font-family="${we}" font-size="58" font-weight="800" fill="${W}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${O(e,i)}${n}</text>
      <rect x="${Xt-ht}" y="104" width="${ht}" height="9" rx="4.5" fill="${W}" fill-opacity="0.18" />
      <rect class="${Gr(r,s)}" x="${Xt-ht}" y="104" width="${(r.volFraction*ht).toFixed(1)}" height="9" rx="4.5" fill="${r.volColor}" />
    </g>
  `}function Hr(e,t,o,r,i=[],s=""){let n=2*Math.PI*Q,a=Kt/360*n,l=(dt+t*Kt)*Math.PI/180,c=Q*Math.cos(l),d=Q*Math.sin(l);return f`
    <g transform="translate(${e}, ${hn})" pointer-events="none">
      <circle r="${Q+26}" fill="rgba(255, 255, 255, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
      <circle r="${Q}" fill="none" stroke="rgba(15, 23, 42, 0.15)" stroke-width="${Dr}" stroke-linecap="round" stroke-dasharray="${a.toFixed(1)} ${n.toFixed(1)}" transform="rotate(${dt})" />
      <circle class="${s}" r="${Q}" fill="none" stroke="${o}" stroke-width="${Dr}" stroke-linecap="round" stroke-dasharray="${(t*a).toFixed(1)} ${n.toFixed(1)}" transform="rotate(${dt})" />
      ${i.map(u=>{let m=(dt+u.fraction*Kt)*Math.PI/180,[p,_]=[Math.cos(m),Math.sin(m)];return f`<line x1="${((Q+8)*p).toFixed(1)}" y1="${((Q+8)*_).toFixed(1)}" x2="${((Q+18)*p).toFixed(1)}" y2="${((Q+18)*_).toFixed(1)}" stroke="${u.color}" stroke-width="3.5" stroke-linecap="round" />`})}
      <circle class="${s}" cx="${c.toFixed(1)}" cy="${d.toFixed(1)}" r="8" fill="#ffffff" stroke="${o}" stroke-width="4" />
      ${r}
    </g>
  `}function zr({style:e,currentTemp:t,currentVolume:o,targetBudget:r,comfortMin:i,deadlyTemp:s,boilTemp:n,showBudget:a,forceTemp:l=!1,lang:c,volumeTier:d=null,animate:u=!0}){let m=No({currentTemp:t,currentVolume:o,targetBudget:r,comfortMin:i,deadlyTemp:s,boilTemp:n,tier:d}),p=t>0||l;if(e!=="arc")return f`
      ${p?dn(t,m,c):""}
      ${fn(o,r,a,m,c,u)}
    `;let _=f`<text y="13" font-family="${we}" font-size="34" font-weight="800" fill="${W}" text-anchor="middle">${O(t,c)}°</text>`,x=a?f`
        <text y="4" font-family="${we}" font-size="34" font-weight="800" fill="${W}" text-anchor="middle">${O(o,c)}</text>
        <text y="30" font-family="${we}" font-size="20" font-weight="700" fill="${W}" text-anchor="middle">/ ${Ne(r,c)} L</text>
      `:f`<text y="13" font-family="${we}" font-size="34" font-weight="800" fill="${W}" text-anchor="middle">${O(o,c)}<tspan dx="3" font-size="20" font-weight="800">L</tspan></text>`;return f`
    ${p?Hr(102,m.tempFraction,m.tempColor,_,m.marks):""}
    ${Hr(922,m.volFraction,m.volColor,x,[],Gr(m,u))}
  `}function Zr({isFullscreen:e,canvasH:t,canvasBottom:o,waterColorStart:r,waterColorEnd:i,isBoiling:s}){return f`
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
        ${e?f`<rect x="0" y="0" width="1024" height="${t}" />`:f`<rect x="12" y="14" width="1000" height="${o-14}" rx="18" ry="18" />`}
      </clipPath>
    </defs>
  `}function jr({isFullscreen:e,canvasH:t,canvasBottom:o,tankBottom:r,theme:i}){return f`
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
  `}function Qr(e,t){return e?f``:f`
    <rect x="12" y="14" width="1000" height="${t-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
    <rect x="4" y="${t}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
  `}var Wr=["turret","ramshorn","round"],un={turret:"#a8a29e",ramshorn:"#dc2626",round:"#d97706"},Yr="M -9,-0.5 C -9,-4 -6,-8 -3,-12 C 0,-8 2,-4 1.5,-0.5 Z",pn="M -2.5,-4.5 a 1,1 0 0 1 2,0 a 2,2 0 0 1 -4,0 a 3,3 0 0 1 6,0 a 4,4 0 0 1 -8,0";function mn(e,t,o,r){let i=o==="cartoon"?{stroke:S,sw:.5}:{},s=c=>o==="realistic"&&r?f`<path d="${c}" fill="url(#shade)" />`:"",n=(c,d,u)=>o==="cartoon"?"":g(h(c,void 0,{stroke:d,sw:.5,op:u,lc:"round"})),a=o==="realistic"?"#000000":"#ffffff",l=o==="realistic"?.28:.5;return e==="turret"?f`
      ${g(h(Yr,t,i))}
      ${s(Yr)}
      ${n("M -8.4,-3 Q -3.5,-1.2 1.2,-3 M -7.4,-6 Q -3.3,-4.4 0.2,-6 M -6,-9 Q -3.2,-7.8 -0.8,-9",a,l)}
    `:e==="ramshorn"?f`
      ${g(h(b(-2.5,-4.5,5),t,i))}
      ${s(b(-2.5,-4.5,5))}
      ${n(pn,a,l+.15)}
    `:f`
    ${g(h(b(-3,-4,5.5),t,i))}
    ${s(b(-3,-4,5.5))}
    <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
    ${o==="flat"?n("M -6.5,-4 A 3.5,3.5 0 1 1 -3,-0.5 M -5,-4 A 2,2 0 1 1 -3,-2","#ffffff",.5):""}
    ${o==="realistic"?n("M -7,-4 A 4,4 0 1 1 -3,0 M -5.4,-4 A 2.4,2.4 0 1 1 -3,-1.6","#000000",.28):""}
  `}function _n(e,t,o,r,i){let s=o==="cartoon"?{stroke:S,sw:.5}:{},n=un[i];return f`
    ${mn(i,e.color||"#854d0e",o,r)}
    ${t?"":f`
          ${g(h($(2,-1.5,5,2.2),n,s))}
          ${o==="realistic"&&r?f`<path d="${$(2,-1.5,5,2.2)}" fill="url(#shade)" />`:""}
          <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="${n}" stroke-width="0.8" />
          ${o==="cartoon"?f`${g(h(b(7.5,-5.7,1.5),"#ffffff",{stroke:S,sw:.5}))}${g(h(b(7.8,-5.6,.8),"#111827",{stroke:"none"}))}`:f`<circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />`}
        `}
  `}function Xr(e,t,o,r,i){return f`
    <g>
      ${e.map((s,n)=>{let a=s.type==="glass_left"?90:s.type==="glass_right"?-90:0,l=t==="saltwater"?n%2===0?3.5:4.2:1.8;return f`
          <g transform="translate(${s.x}, ${s.y}) rotate(${o?0:a}) scale(${s.dir*l},${l})">
            ${_n(s,o,r,i,Wr[n%Wr.length])}
          </g>
        `})}
    </g>
  `}function Kr(e,t){let{isFullscreen:o,canvasH:r,canvasBottom:i,ariaLabel:s,aspectWidth:n,aspectHeight:a,themeKey:l,theme:c,waterColorStart:d,waterColorEnd:u,isBoiling:m,isDead:p,waterRatio:_,waterSurfaceY:x,tankBottom:v,effectiveAlgaeHours:w,showReadings:M,forceTemp:A,displayedTemp:L,currentVolume:B,targetBudget:U,comfortMin:Y,deadlyTemp:fe,boilTemp:G,gaugeStyle:ue,showBudget:Me,cost:ke,lang:pe,sensorLost:pt,biotopeNotice:mt,showGauges:Se,showCostLabel:je,volumeTier:_t,animate:Qe}=t;return D`
    <svg
      role="img"
      aria-label="${s}"
      @click=${H=>e._onTankTap(H)}
      @pointerdown=${H=>e._onSwipeStart(H)}
      @pointerup=${H=>e._onSwipeEnd(H)}
      @pointercancel=${()=>e._onSwipeCancel()}
      viewBox="0 0 1024 ${r}"
      preserveAspectRatio="xMidYMid meet"
      shape-rendering="${e._profile.antialias?"auto":"optimizeSpeed"}"
      style="${o?"width: 100%; height: 100%;":`aspect-ratio: ${n} /${a};`}"
    >
      ${Zr({isFullscreen:o,canvasH:r,canvasBottom:i,waterColorStart:d,waterColorEnd:u,isBoiling:m})}

      <g clip-path="url(#innerTankClip)">
        ${jr({isFullscreen:o,canvasH:r,canvasBottom:i,tankBottom:v,theme:c})}

        ${e._renderThemeDecoration(l,o,e._deathProgress)}

        ${Xr(e._snails,l,p,F(e),I(e))}

        ${_>0?f`
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

        ${_>0&&!p?Fr(e._bubbles):""}

        ${_>0&&!p?e._renderFlowBubbles():""}
        ${e._renderFood()}

        ${m&&_>0?Rr(e._boilingBubbles):""}

        <g>
          ${(e._fishes||[]).map(H=>f`
              <g transform="translate(${H.x},${H.y})">
                ${e._renderFishShape(H,l,p)}
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
        ${Se&&M?zr({style:ue,currentTemp:L,currentVolume:B,targetBudget:U,comfortMin:Y,deadlyTemp:fe,boilTemp:G,showBudget:Me,forceTemp:A,lang:pe,volumeTier:_t,animate:Qe}):""}
        ${je&&M?e._renderCostLabel(ke):""}

        ${Nr(mt,r)}
        ${e._renderFpsBadge()}
        ${Br(e,pt,Se&&M)}
      </g>

      ${Qr(o,i)}
    </svg>
  `}function Jr(e){let{currentVolume:t,displayedRemaining:o,targetBudget:r,currentTemp:i,tempTileColor:s,volumeTier:n,animate:a,cost:l,lang:c,t:d}=e;return D`
    <div class="metrics-grid">
      <div class="metric-box">
        <div class="metric-value ${n?.blinking&&a?"threshold-blink":""}" style="${n?`color: ${n.color};`:""}">${O(t,c)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${d("label_consumed")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${O(o,c)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${d("label_remaining")}</div>
      </div>
      <div class="metric-box">
        <div class="metric-value">${Ne(r,c)} <span class="metric-unit">L</span></div>
        <div class="metric-label">${d("label_target")}</div>
      </div>
      ${i>0?D`
            <div class="metric-box">
              <div
                class="metric-value"
                style="color: ${s};"
              >
                ${O(i,c)} <span class="metric-unit">°C</span>
              </div>
              <div class="metric-label">${d("label_temperature")}</div>
            </div>
          `:""}
      ${l?D`
            <div class="metric-box">
              <div class="metric-value">${st(l.total,c)}</div>
              <div class="metric-label">${d("label_cost")}</div>
            </div>
          `:""}
    </div>
  `}function eo(e=()=>Math.random()){return{snails:[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],ancistrus:{x:70,y:340,targetX:70,targetY:340,heading:0,state:"idle",idleUntil:0,deathProgress:0},shrimp:{x:650,y:550,targetX:650,state:"idle",idleUntil:0,dir:-1,deathProgress:0},crab:{x:(P.ledgeFrom+P.ledgeTo)/2,y:565-(P.ledge+30),targetX:(P.ledgeFrom+P.ledgeTo)/2,s:at,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},goby:{x:530,y:551,targetX:530,hide:0,state:"idle",idleUntil:0,dir:1,deathProgress:0},bubbles:[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],boilingBubbles:Array.from({length:24},()=>({x:10+e()*1004,y:30+e()*540,vy:2.5+e()*3.5,vx:(e()-.5)*1.5,r:4+e()*8})),flowBubbles:Array.from({length:36},()=>({active:!1,x:512,baseX:512,y:0,vy:2,r:3,phase:0}))}}var gn=4500,$n=6e3,ft={keep:.96,minX:30,maxX:994},yn=16.66,ei=3500;function ve(e,t,o=1){e.stressUntil=t+ei,e.stressPower=Math.max(0,Math.min(1,o))}function ze(e,t){let o=(e.stressUntil??0)-t;return e.stress=o<=0?0:Math.min(1,o/ei)*(e.stressPower??1),e.stress}var to={rate:.25,maxStep:.9,ease:.15};function ti(e,t,o,r){e.walk=(e.walk??0)+Math.min(to.maxStep,Math.abs(t)*to.rate);let i=e.stride??0;e.stride=i+((o?1:0)-i)*Math.min(1,to.ease*r)}function oi({timestamp:e,deltaMs:t,delta:o,nowMs:r,animTime:i,tank:s,userSpeed:n,themeKey:a}){let{tankTop:l,tankBottom:c,waterSurfaceY:d,waterRatio:u,isDead:m,isBoiling:p,speedMultiplier:_}=s;return{timestamp:e,deltaMs:t,delta:o,nowMs:r,animTime:i,userSpeed:n,themeKey:a,tankTop:l,tankBottom:c,waterSurfaceY:d,waterRatio:u,isDead:m,isBoiling:p,speedMultiplier:_,deathStep:(t||yn)/gn}}function ri(e,t,o){return t?Math.min(1,(e||0)+o):0}function ii(e,t,o){let r=e+(t-e)*Math.min(1,.03*o);return r<.005&&t===0?0:r}function si(e,t){return e.filter(o=>t-o.born<rt)}function ni(e,t){let{isDead:o,waterRatio:r,delta:i,animTime:s,waterSurfaceY:n,tankBottom:a,nowMs:l}=t;return o||r<=0?{food:[],changed:!1}:e.length===0?{food:e,changed:!1}:(e.forEach(c=>{if(c.landedAt)return;c.y+=c.vy*i;let d=c.vx??0,u=Math.pow(ft.keep,i);c.x+=d*(1-u)/(1-ft.keep)+Math.sin(s*1.5+c.phase)*.25*i,c.vx=d*u,c.x=Math.min(ft.maxX,Math.max(ft.minX,c.x)),c.y<n&&(c.y=n),c.y>=a-30&&(c.y=a-30,c.landedAt=l)}),{food:e.filter(c=>!c.eaten&&!(c.landedAt&&l-c.landedAt>$n)),changed:!0})}function ai(e,t,o,r,i=Math.random){let{waterRatio:s,isDead:n,tankBottom:a,waterSurfaceY:l,delta:c,animTime:d}=t,u=s>0&&!n?qo(o,r):0,m=!1;return e.forEach((p,_)=>{if(!p.active){_<u&&(p.active=!0,p.baseX=512+(i()-.5)*90,p.x=p.baseX,p.y=a-10-i()*40,p.vy=1.8+i()*2.2+o*1.2,p.r=2+i()*4,p.phase=i()*Math.PI*2);return}p.y-=p.vy*c,p.x=p.baseX+Math.sin(d*2+p.phase)*6,(p.y<l+2||n)&&(p.active=!1),m=!0}),m}function li(e,t){let{waterRatio:o,isDead:r,delta:i,waterSurfaceY:s,tankBottom:n}=t;return!(o>0&&!r)||e.length===0?!1:(e.forEach(a=>{a.y-=a.vy*i,a.y<s&&(a.y=n-15)}),!0)}function ci(e,t,o=Math.random){let{isBoiling:r,waterRatio:i,delta:s,waterSurfaceY:n,tankBottom:a}=t;return!(r&&i>0)||e.length===0?!1:(e.forEach(l=>{l.y-=l.vy*s,l.x+=l.vx*s,l.y<n&&(l.y=a-15,l.x=10+o()*1004)}),!0)}function hi(e,t){let{tankBottom:o,tankTop:r,waterSurfaceY:i,themeKey:s}=t,n=s==="saltwater"&&e.species===0;return{minX:n?160:110,maxX:n?380:910,minY:n?Math.max(r+45,i+35,o-160):Math.max(r+45,i+35),maxY:o-45}}var qe={rx:25,ry:16,factor:.85,push:1.4};function di(e,t){if(t.isDead)return!1;let o=!1;for(let r=0;r<e.length;r++)for(let i=r+1;i<e.length;i++){let s=e[r],n=e[i],a=(s.scale||1.4)+(n.scale||1.4),l=s.x-n.x,c=s.y-n.y,d=Math.hypot(l/(qe.rx*qe.factor*a),c/(qe.ry*qe.factor*a));if(d>=1)continue;let u=Math.hypot(l,c),[m,p]=u<1e-6?[1,0]:[l/u,c/u],_=(1-d)*qe.push*t.delta;s.x+=m*_,s.y+=p*_,n.x-=m*_,n.y-=p*_,o=!0}if(o)for(let r of e){let{minX:i,maxX:s,minY:n,maxY:a}=hi(r,t);r.x=Math.min(s,Math.max(i,r.x)),r.y=Math.min(a,Math.max(n,r.y))}return o}function fi(e,t,o){let{isDead:r,deathStep:i,tankBottom:s,delta:n,speedMultiplier:a}=t;if(r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.y=Math.min(s-30,e.y+1.2*n);return}e.deathProgress=0,ze(e,t.nowMs);let l=(e.scare??0)>.05?null:zo(e.x,e.y,o);l?(e._baseVy===void 0&&(e._baseVy=e.vy),Math.abs(l.x-e.x)>6&&(e.dir=l.x<e.x?-1:1),e.vy=Math.max(-1.1,Math.min(1.1,(l.y-e.y)*.02)),e._seeking=!0):e._seeking&&(e._baseVy!==void 0&&(e.vy=e._baseVy),e._seeking=!1);let c=l?1.8:1,{minX:d,maxX:u,minY:m,maxY:p}=hi(e,t);e.x+=e.vx*e.dir*a*c*n,e.y+=e.vy*a*n;let _=e.kickX??0,x=e.kickY??0;if(_||x){e.x+=_*n,e.y+=x*n;let v=Math.pow(.93,n);e.kickX=_*v,e.kickY=x*v;let w=Math.hypot(e.kickX,e.kickY);e.scare=Math.min(1,w/8),w<.15&&(e.kickX=0,e.kickY=0,e.scare=0)}if(o.length>0){let v=e.x+e.dir*22*(e.scale||1.4);o.forEach(w=>{!w.eaten&&Math.hypot(w.x-v,w.y-e.y)<28&&(w.eaten=!0)})}e.x<d?(e.x=d,e.dir=1):e.x>u&&(e.x=u,e.dir=-1),e.y<m?(e.y=m,e.vy=Math.abs(e.vy)):e.y>p&&(e.y=p,e.vy=-Math.abs(e.vy))}var bn=.2;function ui(e,t){let{isDead:o,tankBottom:r,tankTop:i,waterSurfaceY:s,delta:n}=t;if(o){e.y=Math.min(r-10,e.y+1.5*n);return}if(e.type==="bottom")e.y=r-10,e.x+=e.vx*e.dir*n,e.x<100?(e.x=100,e.dir=1):e.x>920&&(e.x=920,e.dir=-1);else if(e.type==="glass_left"||e.type==="glass_right"){let a=Math.max(i+35,s+25);if(e.y<a){e.vy=Math.abs(e.vy),e.y=Math.min(a,e.y+Math.max(e.vy,bn)*n);return}e.y+=e.vy*n,e.y<a?(e.y=a,e.vy=Math.abs(e.vy)):e.y>r-25&&(e.y=r-25,e.vy=-Math.abs(e.vy))}}var V={durationMs:1800,radius:520,ancistrusFactor:7,crawlerFactor:6,ancistrusTurn:6},Ve={speed:.8,turn:3,minTrip:140,maxTrip:420},xn=(e,t)=>((t-e)%360+540)%360-180,wn=1.5,vn=[[0,-21],[13,-19],[-13,-19],[15,0],[-15,0],[34,32],[-34,32],[19,55],[-19,55],[9,72],[-9,72]],Mn=[[9,89],[-9,89],[0,84]],ut={surfaceMargin:6,tailOut:16,floorMargin:4,rescue:12};function pi(e,t){let o=e*Math.PI/180,[r,i]=[Math.sin(o),Math.cos(o)],s=([d,u])=>wn*(d*r+u*i),n=vn.map(s),a=Mn.map(s),l=Math.max(t.waterSurfaceY+ut.surfaceMargin-Math.min(...n),t.waterSurfaceY-ut.tailOut-Math.min(...a)),c=t.tankBottom-ut.floorMargin-Math.max(...n,...a);return{minY:l,maxY:c}}function mi(e,t,o,r,i){let[s,n]=[90,934],a=i?Math.hypot(e.x-i.x,e.y-i.y):0,l=null;for(let c of[0,40,-40,80,-80,120,-120,160,180]){let d=o+c*Math.PI/180,u=Math.min(n,Math.max(s,e.x+Math.sin(d)*r)),m=e.y-Math.cos(d)*r,p=!0;for(let v=0;v<4&&p;v++){let w=Math.atan2(u-e.x,-(m-e.y))*180/Math.PI,M=pi(w,t);M.minY>M.maxY?p=!1:m=Math.min(M.maxY,Math.max(M.minY,m))}if(!p)continue;let _=Math.hypot(u-e.x,m-e.y);if(_<60)continue;let x=i?Math.hypot(u-i.x,m-i.y)-a+_*.5-Math.abs(c)*.5:-Math.abs(_-r)-Math.abs(c)*.3;(!l||x>l.score)&&(l={x:u,y:m,score:x})}return l}function _i(e,t,o,r,i,s=Math.random){let n=e.x-t,a=e.y-o,l=Math.hypot(n,a);if(l>V.radius)return!1;let c=l<1?s()*2*Math.PI:Math.atan2(n,-a),d=300+200*(1-l/V.radius),u=mi(e,i,c,d,{x:t,y:o});return u?(e.targetX=u.x,e.targetY=u.y):(e.targetX=e.x,e.targetY=e.y),e.state="moving",e.fleeUntil=r+V.durationMs,!0}function gi(e,t,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,waterSurfaceY:n,delta:a,timestamp:l,userSpeed:c,nowMs:d}=t,u=(e.fleeUntil??0)>d;if(r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.y=Math.min(s-35,e.y+1.2*a);return}e.deathProgress=0,ze(e,d),e.heading=e.heading??0;let m={tankBottom:s,waterSurfaceY:n};if(e.idleUntil||(e.idleUntil=l+1e3+o()*2e3),e.state==="moving"){let x=e.targetX-e.x,v=e.targetY-e.y,w=Math.hypot(x,v),M=Math.atan2(x,-v)*180/Math.PI,A=(u?V.ancistrusTurn:Ve.turn)*a;e.heading+=Math.max(-A,Math.min(A,xn(e.heading,M)));let L=Math.min(w,Ve.speed*c*(u?V.ancistrusFactor:1)*a);e.x+=x/(w||1)*L,e.y+=v/(w||1)*L,Math.hypot(e.targetX-e.x,e.targetY-e.y)<1.5&&(e.state="idle",e.idleUntil=l+(u?2500:1200)+o()*2e3)}else if(l>=e.idleUntil){let x=o()*2*Math.PI,v=Ve.minTrip+o()*(Ve.maxTrip-Ve.minTrip),w=mi(e,m,x,v);w?(e.state="moving",e.targetX=w.x,e.targetY=w.y):e.idleUntil=l+1500}let p=pi(e.heading,m),_=p.minY>p.maxY?(p.minY+p.maxY)/2:Math.min(p.maxY,Math.max(p.minY,e.y));_!==e.y&&(e.y+=Math.sign(_-e.y)*Math.min(Math.abs(_-e.y),ut.rescue*a))}function $i(e,t,o,r,i){if(Math.hypot(e.x-t,e.y-o)>V.radius)return!1;let s=i.fleeMinX??i.minX,n=i.fleeMaxX??i.maxX,a=e.x===t?e.dir||1:Math.sign(e.x-t),l=a>0?n:s;return Math.abs(l-e.x)<8&&(l=a>0?s:n),e.targetX=l,e.state="moving",e.fleeUntil=r+V.durationMs,!0}var ro={minX:560,maxX:740,fleeMinX:470,fleeMaxX:770,floorOffset:25,speed:.9,firstIdle:[1200,2e3],nextIdle:[1500,2500]};function yi(e,t,o,r=Math.random){let{isDead:i,deathStep:s,tankBottom:n,delta:a,timestamp:l,userSpeed:c,nowMs:d}=t,u=(e.fleeUntil??0)>d;if(i){e.deathProgress=Math.min(1,(e.deathProgress||0)+s);return}e.deathProgress=0,ze(e,d),e.y=n-o.floorOffset;let m=0;if(e.idleUntil||(e.idleUntil=l+o.firstIdle[0]+r()*o.firstIdle[1]),e.state==="moving"){let p=e.targetX-e.x;e.dir=p<0?-1:1;let _=Math.sign(p)*Math.min(Math.abs(p),o.speed*c*(u?V.crawlerFactor:1)*a);e.x+=_,m=_,Math.abs(e.targetX-e.x)<1.5&&(e.state="idle",e.idleUntil=l+o.nextIdle[0]+r()*o.nextIdle[1])}else l>=e.idleUntil&&(e.state="moving",e.targetX=o.minX+r()*(o.maxX-o.minX));ti(e,m,e.state==="moving",a)}var q={speed:.9,hideStep:.03,idle:[1500,2500],hidden:[4e3,4e3],fleeHidden:[6e3,3e3],firstIdle:[1500,2e3],caveChance:.4};function Ge(e){return typeof e.s=="number"||(e.s=at),e.s}function oo(e,t){let{x:o,h:r}=qt(Ge(e)),i=o-e.x;return e.x=o,e.y=t-(r+30),i}function kn(e,t){let o=nt.filter(i=>Math.abs(i-e)>40);if(o.length>0&&t()<q.caveChance)return o[Math.min(o.length-1,Math.floor(t()*o.length))];let r=t()*ye;return Math.abs(r-e)>=40?r:e<ye/2?ye:0}function bi(e,t,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,delta:n,userSpeed:a,nowMs:l}=t,c=(e.fleeUntil??0)>l;if(e.hide=e.hide??0,r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.hide=Math.max(0,e.hide-q.hideStep*n),oo(e,s);return}e.deathProgress=0,ze(e,l),oo(e,s);let d=0;switch(e.idleUntil||(e.idleUntil=l+q.firstIdle[0]+o()*q.firstIdle[1]),e.state){case"moving":{let u=Ge(e),m=e.goalS??u,p=Math.sign(m-u)*Math.min(Math.abs(m-u),q.speed*a*(c?V.crawlerFactor:1)*n);e.s=u+p;let _=oo(e,s);d=p,Math.abs(_)>.01&&(e.dir=_<0?-1:1),Math.abs(m-e.s)<.5&&(e.s=m,nt.some(v=>Math.abs(v-m)<1)?e.state="hiding":(e.state="idle",e.idleUntil=l+q.idle[0]+o()*q.idle[1]));break}case"hiding":if(e.hide=Math.min(1,e.hide+q.hideStep*(c?2:1)*n),e.hide>=1){e.state="hidden";let[u,m]=c?q.fleeHidden:q.hidden;e.idleUntil=l+u+o()*m}break;case"hidden":l>=e.idleUntil&&(e.state="emerging");break;case"emerging":e.hide=Math.max(0,e.hide-q.hideStep*n),e.hide<=0&&(e.state="idle",e.idleUntil=l+600+o()*800);break;default:l>=e.idleUntil&&(e.state="moving",e.goalS=kn(Ge(e),o))}e.targetX=qt(e.goalS??Ge(e)).x,ti(e,d,e.state==="moving",n)}function xi(e,t,o,r){if(Math.hypot(e.x-t,e.y-o)>V.radius)return!1;let i=Ge(e);if(e.fleeUntil=r+4e3,e.state==="hidden"||e.state==="hiding")return e.idleUntil=Math.max(e.idleUntil??0,r+q.fleeHidden[0]),!0;if(e.state==="emerging")return e.state="hiding",!0;let[s]=nt;return e.goalS=s,e.state=Math.abs(e.goalS-i)<.5?"hiding":"moving",!0}var he={floorOffset:14,hideStep:.08,emergeStep:.025,hidden:[4e3,3e3]};function wi(e,t,o=Math.random){let{isDead:r,deathStep:i,tankBottom:s,delta:n,nowMs:a}=t;if(e.hide=e.hide??0,e.y=s-he.floorOffset,r){e.deathProgress=Math.min(1,(e.deathProgress||0)+i),e.hide=Math.max(0,e.hide-he.hideStep*n);return}switch(e.deathProgress=0,ze(e,a),e.state){case"hiding":e.hide=Math.min(1,e.hide+he.hideStep*n),e.hide>=1&&(e.state="hidden",e.idleUntil=a+he.hidden[0]+o()*he.hidden[1]);break;case"hidden":a>=e.idleUntil&&(e.state="emerging");break;case"emerging":e.hide=Math.max(0,e.hide-he.emergeStep*n),e.hide<=0&&(e.state="idle");break;default:break}}function vi(e,t,o,r){return Math.hypot(e.x-t,e.y-o)>V.radius?!1:(e.state==="hidden"?e.idleUntil=Math.max(e.idleUntil??0,r+he.hidden[0]):e.state!=="hiding"&&(e.state="hiding"),!0)}var de=()=>Math.random(),io=class extends z{static get properties(){return{_hass:{type:Object,hasChanged:()=>!1},preview:{type:Boolean},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_goby:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array},_flowBubbles:{type:Array},_food:{type:Array},_ripples:{type:Array},_fpsInfo:{type:String},_announcement:{type:String},_biotopeNotice:{type:String}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(t,o,r){let i=or(t,o,r),s=i.entity||o.find(l=>l.includes("shower")||l.includes("hydrao"))||o.find(l=>l.startsWith("sensor."))||o[0]||"",n=i.temperature_entity||o.find(l=>l.includes("temperature")&&(l.includes("shower")||l.includes("hydrao")))||"",a=y;return{entity:s,temperature_entity:n,...i.comfort_temp_entity?{comfort_temp_entity:i.comfort_temp_entity}:{},...i.target_budget_entity?{target_budget_entity:i.target_budget_entity}:{},...i.threshold_1_entity?{threshold_1_entity:i.threshold_1_entity}:{},...i.threshold_2_entity?{threshold_2_entity:i.threshold_2_entity}:{},...i.threshold_3_entity?{threshold_3_entity:i.threshold_3_entity}:{},title:a.title,theme:a.theme,aspect_ratio_width:a.aspect_ratio_width,aspect_ratio_height:a.aspect_ratio_height,fish_count:a.fish_count,target_budget:a.target_budget,survival_volume:a.survival_volume,temp_boiling_threshold:a.temp_boiling_threshold,temp_deadly_threshold:a.temp_deadly_threshold,algae_enabled:a.algae_enabled,algae_delay_hours:a.algae_delay_hours,algae_age:a.algae_age,fish_speed_multiplier:a.fish_speed_multiplier,fullscreen:a.fullscreen}}constructor(){super(),this._animationFrameId=null,this.preview=!1,this._deathProgress=0,this._flow=it(),this._flowIntensity=0,this._food=[],this._ripples=[],this._fpsInfo="",this._announcement="",this._announceFlip=!1,this._themeOverride=null,this._swipeStart=null,this._swipedAt=0,this._biotopeNotice="",this._noticeTimer=null,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=0,this._config=void 0,this._hass=void 0,this._viewport=null,this._resizeObserver=null,this._energyKwh=0,this._metrics=null,this._sensorLostSince=null,this._sensorTimer=null,this._metricsSignature="",this._onScreen=!0,this._pageVisible=typeof document>"u"||document.visibilityState!=="hidden",this._prefersReducedMotion=!1,this._intersectionObserver=null,this._motionQuery=null,this._onVisibilityChange=()=>{this._pageVisible=document.visibilityState!=="hidden",this._syncAnimation()},this._onMotionPreferenceChange=o=>{this._prefersReducedMotion=!!o.matches,this._syncAnimation()},this._lastTimestamp=0,this._lastFrameTs=0,this._animTime=0,this._ambientTime=0,this._lastAmbientTs=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=y.target_budget,this._cachedSurvivalVolume=y.survival_volume,this._cachedComfortMin=y.comfort_temp_min,this._lastTemperature=0,this._cachedHoursSinceLastShower=0,this._cachedTiers=null,this._fishes=tt(4,"freshwater");let t=eo();this._snails=t.snails,this._ancistrus=t.ancistrus,this._shrimp=t.shrimp,this._crab=t.crab,this._goby=t.goby,this._bubbles=t.bubbles,this._boilingBubbles=t.boilingBubbles,this._flowBubbles=t.flowBubbles}static get styles(){return ko}_t(t){return K(Z(this._hass),t)}get _themeKey(){return this._themeOverride||this._config?.theme||"freshwater"}_biotopeStorageKey(){return`shower-aquarium-card:biotope:${this._config?.entity}`}_restoreBiotope(){if(!this._config?.swipe_biotope)return null;try{let t=JSON.parse(window.localStorage.getItem(this._biotopeStorageKey())||"null");if(t&&t.base===this._config.theme&&t.chosen!==t.base&&ge.includes(t.chosen))return t.chosen}catch{}return null}_rememberBiotope(t){if(!this._isEditorPreview())try{window.localStorage.setItem(this._biotopeStorageKey(),JSON.stringify({base:this._config?.theme,chosen:t}))}catch{}}_onSwipeStart(t){this._swipeStart=this._config?.swipe_biotope?{x:t.clientX,y:t.clientY,t:Date.now()}:null}_onSwipeEnd(t){let o=this._swipeStart;if(this._swipeStart=null,!o)return;let r=Fo(t.clientX-o.x,t.clientY-o.y,Date.now()-o.t);r!==0&&(this._swipedAt=Date.now(),this._switchBiotope(r))}_onSwipeCancel(){this._swipeStart=null}_switchBiotope(t){if(!this._config)return;let o=Lo(this._themeKey,t);this._themeOverride=o===this._config.theme?null:o,this._rememberBiotope(o),this._fishes=tt(this._config.fish_count,o);let r=eo();this._snails=r.snails,this._ancistrus=r.ancistrus,this._shrimp=r.shrimp,this._crab=r.crab,this._goby=r.goby,this._food=[],this._ripples=[];let i=this._t(`theme_${o}`);this._biotopeNotice=i,this._announce("aria_biotope",{name:i}),this._noticeTimer!==null&&clearTimeout(this._noticeTimer),this._noticeTimer=setTimeout(()=>{this._noticeTimer=null,this._biotopeNotice=""},2e3),this._onDataChanged()}_onBiotopeButton(){this._switchBiotope(1)}_getCanvasHeight(){return Oo(this._config,this._viewport)}_updateCachedMetrics(){if(!this._hass||!this._config)return!1;let t=Io(this._hass,this._config,this._metrics);this._metrics=t,this._cachedConsumedVolume=t.consumedVolume,this._cachedHoursSinceLastShower=t.hoursSinceLastShower,this._cachedTemperature=t.temperature,this._cachedTargetBudget=t.targetBudget,this._cachedSurvivalVolume=t.survivalVolume,this._cachedComfortMin=t.comfortMin,this._cachedTiers=t.tiers,t.consumedVolume<=0?this._lastTemperature=0:t.temperature>0&&(this._lastTemperature=t.temperature),this._trackSensor(t.sensorMissing);let o=Xo(t,Z(this._hass)),r=o!==this._metricsSignature;return this._metricsSignature=o,r}_trackSensor(t){if(!t){this._sensorLostSince=null,this._clearSensorTimer();return}this._sensorLostSince===null&&(this._sensorLostSince=Date.now()),this._scheduleSensorTimer()}_scheduleSensorTimer(){if(this._sensorTimer!==null||this._sensorLostSince===null||!this.isConnected)return;let t=Math.max(0,Bt-(Date.now()-this._sensorLostSince));this._sensorTimer=setTimeout(()=>{this._sensorTimer=null,this.requestUpdate()},t)}_clearSensorTimer(){this._sensorTimer!==null&&(clearTimeout(this._sensorTimer),this._sensorTimer=null)}get _sensorLost(){return this._sensorLostSince!==null&&Date.now()-this._sensorLostSince>=Bt}setConfig(t){if(!t||typeof t.entity!="string"||!t.entity.trim())throw new Error("Please define a valid entity.");let{config:o,warnings:r}=Ut(et(t));r.forEach(i=>console.warn(`[shower-aquarium-card] ${i}`)),this._config={...y,...o},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen"),this._themeOverride=this._restoreBiotope(),this._fishes=tt(this._config.fish_count,this._themeKey),this._flow=it(),this._food=[],this._metrics=null,this._lastTemperature=0,this._sensorLostSince=null,this._clearSensorTimer(),this._updateCachedMetrics(),this._syncAnimation(),this.requestUpdate()}set hass(t){this._hass=t;let o=this._updateCachedMetrics();this._trackFlow(),o&&this._onDataChanged()}get _visible(){return this._onScreen&&this._pageVisible}get _motionAllowed(){return Ko(this._prefersReducedMotion,this._config?.respect_reduced_motion)}shouldUpdate(){return this._visible}_onResize(t,o){if(!this._config?.fullscreen)return;let r=this._getCanvasHeight();this._viewport={width:t,height:o},this._getCanvasHeight()!==r&&this._onDataChanged()}_onDataChanged(){this._visible&&!this._motionAllowed&&this._settleScene(),this.requestUpdate()}_settleScene(){let t=this._tankState();if(!t)return;let{isDead:o}=t;this._food=[],this._ripples=[],this._lastTimestamp=0;let r=er(o);for(let i=0;i<r;i++)this._updatePhysics(1e3+i*Jo);this._lastTimestamp=0}_syncAnimation(){if(!this.isConnected){this._stopAnimation();return}if(this._visible&&this._motionAllowed){this._startAnimation(),this.requestUpdate();return}this._stopAnimation(),this._visible&&(this._settleScene(),this.requestUpdate())}_trackFlow(){if(!this._hass||!this._config)return;let t=this._hass.states?.[this._config.entity]?.state;if(t===void 0||isNaN(parseFloat(t)))return;let o=this._cachedConsumedVolume,r=this._flow.lastVolume,i=this._config.cold_water_temp;r===null||o<r-1e-6?this._energyKwh=Nt(o,this._cachedTemperature,i):o>r+1e-6&&(this._energyKwh+=Nt(o-r,this._cachedTemperature,i)),this._flow=Uo(this._flow,o,Date.now())}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibilityChange),this._pageVisible=document.visibilityState!=="hidden",typeof IntersectionObserver=="function"&&(this._intersectionObserver=new IntersectionObserver(t=>{let o=t[t.length-1];!o||o.isIntersecting===this._onScreen||(this._onScreen=o.isIntersecting,this._syncAnimation())}),this._intersectionObserver.observe(this)),typeof ResizeObserver=="function"&&(this._resizeObserver=new ResizeObserver(t=>{let o=t[t.length-1];o&&this._onResize(o.contentRect.width,o.contentRect.height)}),this._resizeObserver.observe(this)),typeof window.matchMedia=="function"&&(this._motionQuery=window.matchMedia("(prefers-reduced-motion: reduce)"),this._prefersReducedMotion=!!this._motionQuery.matches,this._motionQuery.addEventListener?.("change",this._onMotionPreferenceChange)),this._scheduleSensorTimer(),this._syncAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._clearSensorTimer(),this._noticeTimer!==null&&(clearTimeout(this._noticeTimer),this._noticeTimer=null),document.removeEventListener("visibilitychange",this._onVisibilityChange),this._intersectionObserver?.disconnect(),this._intersectionObserver=null,this._resizeObserver?.disconnect(),this._resizeObserver=null,this._motionQuery?.removeEventListener?.("change",this._onMotionPreferenceChange),this._motionQuery=null,this._stopAnimation()}_sampleFps(t){this._fpsWindowStart||(this._fpsWindowStart=t);let o=t-this._fpsWindowStart;if(o<1e3)return;let r=Math.round(this._rafCount*1e3/o),i=Math.round(this._tickCount*1e3/o),s=this._config?.animation_quality||"max";this._fpsInfo=`v${Ke} \xB7 ${s} \xB7 display ${r}/s \xB7 drawn ${i}/s`,this._rafCount=0,this._tickCount=0,this._fpsWindowStart=t,this.requestUpdate()}get _profile(){return Qo(this._config?.animation_quality)}_startAnimation(){if(!this._animationFrameId){this._lastTimestamp=0,this._lastFrameTs=0,this._fpsWindowStart=0,this._rafCount=0,this._tickCount=0;let t=o=>{this._rafCount++,Wo(o,this._lastFrameTs,this._profile.fps)&&(this._lastFrameTs=o,this._tickCount++,this._updatePhysics(o)),this._config?.show_fps&&this._sampleFps(o),this._animationFrameId=requestAnimationFrame(t)};this._animationFrameId=requestAnimationFrame(t)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(t){let o=this._config;if(!o)return;this._lastTimestamp||(this._lastTimestamp=t);let r=t-this._lastTimestamp,i=this._profile,s=Math.min(r/16.66,Yo(i.fps));this._lastTimestamp=t,this._animTime=t*.0035,(!i.ambientHz||t-this._lastAmbientTs>=1e3/i.ambientHz)&&(this._ambientTime=this._animTime,this._lastAmbientTs=t);let n={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},a=Date.now(),l=oi({timestamp:t,deltaMs:r,delta:s,nowMs:a,animTime:this._animTime,tank:ot({config:o,metrics:n,canvasHeight:this._getCanvasHeight()}),userSpeed:o.fish_speed_multiplier,themeKey:this._themeKey}),{isDead:c}=l,d=!1;this._deathProgress=ri(this._deathProgress,c,l.deathStep);let u=this._motionAllowed,m=c||!u?0:Do(this._flow,a);this._flowIntensity=ii(this._flowIntensity,m,s),Ho(this._flow,a)&&(this._flow={...this._flow,showerActive:!1}),this._ripples.length>0&&(this._ripples=si(this._ripples,a),d=!0);let p=ni(this._food,l);p.food!==this._food&&(this._food=p.food),p.changed&&(d=!0),ai(this._flowBubbles,l,this._flowIntensity,i.flowBubbles,de)&&(d=!0),this._flowIntensity>0&&(d=!0),this._fishes&&this._fishes.length>0&&(this._fishes.forEach(_=>fi(_,l,this._food)),di(this._fishes,l),d=!0),this._snails&&this._snails.length>0&&(this._snails.forEach(_=>ui(_,l)),d=!0),this._ancistrus&&(gi(this._ancistrus,l,de),d=!0),this._shrimp&&(yi(this._shrimp,l,ro,de),d=!0),this._crab&&(bi(this._crab,l,de),d=!0),this._goby&&(wi(this._goby,l,de),d=!0),this._bubbles&&li(this._bubbles,l)&&(d=!0),this._boilingBubbles&&ci(this._boilingBubbles,l,de)&&(d=!0),d&&this.requestUpdate()}_renderWaterSurface(t,o,r){return ar(this,t,o,r)}_renderThemeDecoration(t,o,r=0){return ur(this,t,o,r)}_renderFishShape(t,o,r){return br(this,t,o,r)}_renderAncistrus(t){return Sr(this,t)}_renderShrimp(t){return Cr(this,t)}_renderGoby(t){return Pr(this,t)}_renderCrab(t){return Ar(this,t)}_renderAlgae(t,o){return pr(this,t,o)}_eventToSvgPoint(t){let o=t.currentTarget,r=o.getScreenCTM?o.getScreenCTM():null;if(!r)return null;let i=o.createSVGPoint();i.x=t.clientX,i.y=t.clientY;let s=i.matrixTransform(r.inverse());return{x:s.x,y:s.y}}_isEditorPreview(){if(this.preview)return!0;let t=this;for(;t;){let o=t,r=o.tagName?o.tagName.toLowerCase():"";if(r==="hui-card-preview"||r==="hui-dialog-edit-card"||r==="hui-dialog-suggest-card")return!0;t=o.parentNode||t.host||null}return!1}_tankState(){return this._config?ot({config:this._config,metrics:{consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},canvasHeight:this._getCanvasHeight()}):null}_interactiveTank(){if(!this._hass||!this._motionAllowed)return null;let t=this._tankState();return t?t.isDead||t.waterRatio<=0?null:t:null}_dropFood(t,o){let r=Math.max(80,Math.min(944,t));this._food=[...this._food,...Zo(r,o+2)].slice(-30)}_knockAt(t,o,r){let i=Date.now();this._ripples=[...this._ripples,{x:t,y:o,born:i}],(this._fishes||[]).forEach(s=>{let n=Go(s.x,s.y,t,o);n&&(s.kickX=n.kx,s.kickY=n.ky,s.scare=n.scare,Math.abs(n.kx)>.5&&(s.dir=n.kx<0?-1:1),ve(s,i,.5+.5*n.scare))}),this._ancistrus&&_i(this._ancistrus,t,o,i,r,de)&&ve(this._ancistrus,i),this._shrimp&&$i(this._shrimp,t,o,i,ro)&&ve(this._shrimp,i),this._crab&&xi(this._crab,t,o,i)&&ve(this._crab,i),this._goby&&vi(this._goby,t,o,i)&&ve(this._goby,i)}_onTankTap(t){if(Date.now()-this._swipedAt<500)return;let o=this._interactiveTank();if(!o)return;let r=this._eventToSvgPoint(t);r&&(Vo(r.y,o.waterSurfaceY)==="feed"?this._dropFood(r.x,o.waterSurfaceY):this._knockAt(r.x,r.y,o),this.requestUpdate())}_onFeedButton(){let t=this._interactiveTank();t&&(this._dropFood(Be/2,t.waterSurfaceY),this._announce("aria_food_dropped"),this.requestUpdate())}_onKnockButton(){let t=this._interactiveTank();t&&(this._knockAt(Be/2,(t.waterSurfaceY+t.tankBottom)/2,t),this._announce("aria_knocked"),this.requestUpdate())}_announce(t,o={}){this._announceFlip=!this._announceFlip,this._announcement=Dt(this._t(t),o)+(this._announceFlip?"\xA0":"")}_renderFlowBubbles(){return Tr(this)}_renderFood(){return Er(this)}_renderRipples(){return Lr(this)}_renderCostLabel(t){return Or(this,t)}_ariaLabel({currentVolume:t,currentTemp:o,targetBudget:r,isDead:i,isCritical:s,sensorLost:n=!1}){let a=Z(this._hass),l={consumed:O(t,a),target:O(r,a,0),temperature:O(o,a)},c=[Dt(this._t(o>0?"aria_summary_temperature":"aria_summary"),l)];return i?c.push(this._t("aria_dead")):s&&c.push(this._t("aria_over_budget")),n&&c.push(`${this._t("label_sensor_unavailable")}.`),c.join(" ")}_renderFpsBadge(){return Ir(this)}render(){if(!this._config||!this._hass)return D``;let t=!!this._config.fullscreen,o=this._getCanvasHeight(),r=o-35,i={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:s,currentTemp:n,targetBudget:a,boilTemp:l,deadlyTemp:c,waterRatio:d,tankBottom:u,waterSurfaceY:m,isDead:p,isBoiling:_,isCritical:x,isWarning:v}=ot({config:this._config,metrics:i,canvasHeight:o}),w=this._motionAllowed&&!p&&d>0,M=Z(this._hass),A=this._sensorLost,L=this._ariaLabel({currentVolume:s,currentTemp:n,targetBudget:a,isDead:p,isCritical:x,sensorLost:A}),B=Math.max(0,a-s),U=this._themeKey,Y=It(U),fe=_||x?"#ef4444":v?"#38bdf8":Y.waterTop,G=_||x?"#991b1b":v?"#0284c7":Y.waterBottom,ue=!!(this._config.title&&this._config.title.trim().length>0),Me=this._config.aspect_ratio_width,ke=this._config.aspect_ratio_height,pe=Number(this._config.algae_age)||0,pt=pe>0?pe:this._cachedHoursSinceLastShower,mt=n>=c?"#ef4444":n>=l?"#f59e0b":"var(--primary-text-color, #111827)",Se=t||!!this._config.show_gauges,je=!t&&this._config.show_tiles!==!1,_t=Se&&!je,Qe=this._config.use_threshold_colors===!1?null:Bo(s,this._cachedTiers),H=this._config.show_cost?jo({volumeL:s,energyKwh:this._energyKwh,waterPricePerM3:this._config.water_price_per_m3,energyPricePerKwh:this._config.energy_price_per_kwh}):null;return D`
      <ha-card>
        ${!t&&ue?D`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          ${Kr(this,{isFullscreen:t,canvasH:o,canvasBottom:r,ariaLabel:L,aspectWidth:Me,aspectHeight:ke,themeKey:U,theme:Y,waterColorStart:fe,waterColorEnd:G,isBoiling:_,isDead:p,waterRatio:d,waterSurfaceY:m,tankBottom:u,effectiveAlgaeHours:pt,showReadings:s>0||this._isEditorPreview(),forceTemp:s<=0&&this._isEditorPreview(),displayedTemp:n>0?n:this._lastTemperature,currentVolume:s,targetBudget:a,comfortMin:this._cachedComfortMin,deadlyTemp:c,boilTemp:l,gaugeStyle:this._config.gauge_style,showBudget:this._config.show_budget,cost:H,lang:M,sensorLost:A,biotopeNotice:this._biotopeNotice,showGauges:Se,showCostLabel:_t,volumeTier:Qe,animate:this._motionAllowed})}

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

        ${je?Jr({currentVolume:s,displayedRemaining:B,targetBudget:a,currentTemp:n,tempTileColor:mt,volumeTier:Qe,animate:this._motionAllowed,cost:H,lang:M,t:Si=>this._t(Si)}):""}
      </ha-card>
    `}getCardSize(){return 6}getGridOptions(){let t={columns:12,min_columns:6};return this._config?.fullscreen&&(t.rows=8,t.min_rows=4),t}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",io);console.info(`%c SHOWER-AQUARIUM-CARD %c v${Ke} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");var Ze=window;Ze.customCards=Ze.customCards||[];var Mi=Ze.customCards.findIndex(e=>e.type==="shower-aquarium-card"),ki={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${Ke})`,documentationURL:`${Mo}#readme`};Mi!==-1?Ze.customCards[Mi]=ki:Ze.customCards.push(ki);export{io as AquariumShowerCard};
