var et=globalThis,it=et.ShadowRoot&&(et.ShadyCSS===void 0||et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nt=Symbol(),Lt=new WeakMap,D=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==nt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(it&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=Lt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Lt.set(e,t))}return t}toString(){return this.cssText}},Tt=s=>new D(typeof s=="string"?s:s+"",void 0,nt),lt=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((r,i,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[o+1],s[0]);return new D(e,s,nt)},Pt=(s,t)=>{if(it)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),i=et.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,s.appendChild(r)}},ct=it?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return Tt(e)})(s):s;var{is:ve,defineProperty:Me,getOwnPropertyDescriptor:Ce,getOwnPropertyNames:Ae,getOwnPropertySymbols:Se,getPrototypeOf:Ee}=Object,F=globalThis,Ft=F.trustedTypes,Le=Ft?Ft.emptyScript:"",Te=F.reactiveElementPolyfillSupport,Z=(s,t)=>s,ht={toAttribute(s,t){switch(t){case Boolean:s=s?Le:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},Rt=(s,t)=>!ve(s,t),Nt={attribute:!0,type:String,converter:ht,reflect:!1,useDefault:!1,hasChanged:Rt};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),F.litPropertyMetadata??(F.litPropertyMetadata=new WeakMap);var T=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&Me(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){let{get:i,set:o}=Ce(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let c=i?.call(this);o?.call(this,n),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Nt}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;let t=Ee(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){let e=this.properties,r=[...Ae(e),...Se(e)];for(let i of r)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)e.unshift(ct(i))}else t!==void 0&&e.push(ct(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:ht).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=r.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ht;this._$Em=i;let c=n.fromAttribute(e,o.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,r,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),r??(r=n.getPropertyOptions(t)),!((r.hasChanged??Rt)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:o},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,o]of r){let{wrapped:n}=o,c=this[i];n!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[Z("elementProperties")]=new Map,T[Z("finalized")]=new Map,Te?.({ReactiveElement:T}),(F.reactiveElementVersions??(F.reactiveElementVersions=[])).push("2.1.2");var j=globalThis,Ht=s=>s,rt=j.trustedTypes,Ot=rt?rt.createPolicy("lit-html",{createHTML:s=>s}):void 0,qt="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,Dt="?"+N,Pe=`<${Dt}>`,O=document,z=()=>O.createComment(""),W=s=>s===null||typeof s!="object"&&typeof s!="function",gt=Array.isArray,Fe=s=>gt(s)||typeof s?.[Symbol.iterator]=="function",dt=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ut=/-->/g,Bt=/>/g,R=RegExp(`>|${dt}(?:([^\\s"'>=/]+)(${dt}*=${dt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),It=/'/g,Qt=/"/g,Zt=/^(?:script|style|textarea|title)$/i,yt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),S=yt(1),d=yt(2),ze=yt(3),U=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Vt=new WeakMap,H=O.createTreeWalker(O,129);function Gt(s,t){if(!gt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ot!==void 0?Ot.createHTML(t):t}var Ne=(s,t)=>{let e=s.length-1,r=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=G;for(let c=0;c<e;c++){let l=s[c],f,h,u=-1,p=0;for(;p<l.length&&(n.lastIndex=p,h=n.exec(l),h!==null);)p=n.lastIndex,n===G?h[1]==="!--"?n=Ut:h[1]!==void 0?n=Bt:h[2]!==void 0?(Zt.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=R):h[3]!==void 0&&(n=R):n===R?h[0]===">"?(n=i??G,u=-1):h[1]===void 0?u=-2:(u=n.lastIndex-h[2].length,f=h[1],n=h[3]===void 0?R:h[3]==='"'?Qt:It):n===Qt||n===It?n=R:n===Ut||n===Bt?n=G:(n=R,i=void 0);let _=n===R&&s[c+1].startsWith("/>")?" ":"";o+=n===G?l+Pe:u>=0?(r.push(f),l.slice(0,u)+qt+l.slice(u)+N+_):l+N+(u===-2?c:_)}return[Gt(s,o+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},X=class s{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let o=0,n=0,c=t.length-1,l=this.parts,[f,h]=Ne(t,e);if(this.el=s.createElement(f,r),H.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=H.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(qt)){let p=h[n++],_=i.getAttribute(u).split(N),m=/([.?@])?(.*)/.exec(p);l.push({type:1,index:o,name:m[2],strings:_,ctor:m[1]==="."?ut:m[1]==="?"?pt:m[1]==="@"?_t:Q}),i.removeAttribute(u)}else u.startsWith(N)&&(l.push({type:6,index:o}),i.removeAttribute(u));if(Zt.test(i.tagName)){let u=i.textContent.split(N),p=u.length-1;if(p>0){i.textContent=rt?rt.emptyScript:"";for(let _=0;_<p;_++)i.append(u[_],z()),H.nextNode(),l.push({type:2,index:++o});i.append(u[p],z())}}}else if(i.nodeType===8)if(i.data===Dt)l.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(N,u+1))!==-1;)l.push({type:7,index:o}),u+=N.length-1}o++}}static createElement(t,e){let r=O.createElement("template");return r.innerHTML=t,r}};function I(s,t,e=s,r){if(t===U)return t;let i=r!==void 0?e._$Co?.[r]:e._$Cl,o=W(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(s),i._$AT(s,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=i:e._$Cl=i),i!==void 0&&(t=I(s,i._$AS(s,t.values),i,r)),t}var ft=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);H.currentNode=i;let o=H.nextNode(),n=0,c=0,l=r[0];for(;l!==void 0;){if(n===l.index){let f;l.type===2?f=new Y(o,o.nextSibling,this,t):l.type===1?f=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(f=new mt(o,this,t)),this._$AV.push(f),l=r[++c]}n!==l?.index&&(o=H.nextNode(),n++)}return H.currentNode=O,i}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},Y=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=I(this,t,e),W(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==U&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Fe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&W(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=X.createElement(Gt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new ft(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=Vt.get(t.strings);return e===void 0&&Vt.set(t.strings,e=new X(t)),e}k(t){gt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let o of t)i===e.length?e.push(r=new s(this.O(z()),this.O(z()),this,this.options)):r=e[i],r._$AI(o),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=Ht(t).nextSibling;Ht(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,o){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=w}_$AI(t,e=this,r,i){let o=this.strings,n=!1;if(o===void 0)t=I(this,t,e,0),n=!W(t)||t!==this._$AH&&t!==U,n&&(this._$AH=t);else{let c=t,l,f;for(t=o[0],l=0;l<o.length-1;l++)f=I(this,c[r+l],e,l),f===U&&(f=this._$AH[l]),n||(n=!W(f)||f!==this._$AH[l]),f===w?t=w:t!==w&&(t+=(f??"")+o[l+1]),this._$AH[l]=f}n&&!i&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ut=class extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},pt=class extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},_t=class extends Q{constructor(t,e,r,i,o){super(t,e,r,i,o),this.type=5}_$AI(t,e=this){if((t=I(this,t,e,0)??w)===U)return;let r=this._$AH,i=t===w&&r!==w||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==w&&(r===w||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},mt=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){I(this,t)}};var Re=j.litHtmlPolyfillSupport;Re?.(X,Y),(j.litHtmlVersions??(j.litHtmlVersions=[])).push("3.3.3");var jt=(s,t,e)=>{let r=e?.renderBefore??t,i=r._$litPart$;if(i===void 0){let o=e?.renderBefore??null;r._$litPart$=i=new Y(t.insertBefore(z(),o),o,void 0,e??{})}return i._$AI(s),i};var K=globalThis,E=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=jt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};E._$litElement$=!0,E.finalized=!0,K.litElementHydrateSupport?.({LitElement:E});var He=K.litElementPolyfillSupport;He?.({LitElement:E});(K.litElementVersions??(K.litElementVersions=[])).push("4.2.2");var xt="0.4.3";var zt=lt`
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
`;var Wt={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge des algues",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_night_entity:"Entit\xE9 du mode nuit (optionnel)",helper_night_entity:"sun.sun (nuit = sous l'horizon), un capteur binaire / bool\xE9en (on = nuit) ou un capteur de luminosit\xE9",field_night_lux:"Seuil de luminosit\xE9 nuit (lx)",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)",field_animation_quality:"Qualit\xE9 d'animation",quality_max:"Maximale",quality_balanced:"\xC9quilibr\xE9e",quality_light:"L\xE9g\xE8re (Google Nest Hub)",helper_animation_quality:"L\xE9g\xE8re : 20 images/s et effets simplifi\xE9s, pour les \xE9crans peu puissants",field_cost_fullscreen:"Afficher le co\xFBt en mode plein \xE9cran"};var Xt={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Algae age",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_night_entity:"Night mode entity (optional)",helper_night_entity:"sun.sun (night = below horizon), a binary sensor / boolean (on = night) or an illuminance sensor",field_night_lux:"Night illuminance threshold (lx)",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)",field_animation_quality:"Animation quality",quality_max:"Maximum",quality_balanced:"Balanced",quality_light:"Light (Google Nest Hub)",helper_animation_quality:"Light: 20 frames/s and simpler effects, for low-power screens",field_cost_fullscreen:"Show cost in fullscreen mode"};var bt={fr:Wt,en:Xt};function V(s){return(s?.locale?.language||s?.language||"en").substring(0,2).toLowerCase()}function Be(s){return bt[s]||bt.en}function C(s,t){return Be(s)[t]||bt.en[t]||t}var Ie=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:"freshwater",selector:{select:{options:[{value:"freshwater",label:"Eau douce (Tropical)"},{value:"saltwater",label:"Eau de mer (R\xE9cif)"},{value:"coldwater",label:"Eau froide (Poissons rouges)"}]}}},{name:"fish_count",default:4,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:50,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{name:"survival_volume",default:10,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"temp_boiling_threshold",default:40,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:45,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"algae_enabled",default:!0,selector:{boolean:{}}},{name:"algae_delay_hours",default:12,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:0,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}},{name:"fish_speed_multiplier",default:1.2,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"night_entity",selector:{entity:{domain:["sun","sensor","binary_sensor","input_boolean"]}}},{name:"night_lux_threshold",default:20,selector:{number:{min:1,max:1e3,unit_of_measurement:"lx",mode:"box"}}},{name:"show_cost",default:!1,selector:{boolean:{}}},{name:"cost_in_fullscreen",default:!1,selector:{boolean:{}}},{name:"water_price_per_m3",default:4.5,selector:{number:{min:0,max:30,step:.01,unit_of_measurement:"\u20AC/m\xB3",mode:"box"}}},{name:"energy_price_per_kwh",default:.25,selector:{number:{min:0,max:2,step:.001,unit_of_measurement:"\u20AC/kWh",mode:"box"}}},{name:"cold_water_temp",default:15,selector:{number:{min:0,max:30,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"animation_quality",default:"max",selector:{select:{options:[{value:"max",label:"Maximale"},{value:"balanced",label:"\xC9quilibr\xE9e"},{value:"light",label:"L\xE9g\xE8re (Google Nest Hub)"}]}}},{name:"fullscreen",default:!1,selector:{boolean:{}}},{name:"aspect_ratio_width",default:1024,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:600,selector:{number:{min:1,max:4e3,mode:"box"}}}],Qe={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",night_entity:"field_night_entity",night_lux_threshold:"field_night_lux",show_cost:"field_show_cost",cost_in_fullscreen:"field_cost_fullscreen",water_price_per_m3:"field_water_price",energy_price_per_kwh:"field_energy_price",cold_water_temp:"field_cold_water_temp",animation_quality:"field_animation_quality",fullscreen:"field_fullscreen",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},$t=class extends E{static get properties(){return{hass:{type:Object},_config:{type:Object}}}setConfig(t){this._config={...t}}_lang(){return V(this.hass)}_computeLabel(t){let e=Qe[t.name];return e?C(this._lang(),e):t.name}_computeHelper(t){let e=this._lang();switch(t.name){case"fullscreen":return C(e,"helper_fullscreen");case"night_entity":return C(e,"helper_night_entity");case"show_cost":return C(e,"helper_show_cost");case"animation_quality":return C(e,"helper_animation_quality");default:return""}}_valueChanged(t){if(!this._config||!this.hass)return;let e={...t.detail.value};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}_schema(){let t=this._lang();return Ie.map(e=>e.name==="animation_quality"?{...e,selector:{select:{options:[{value:"max",label:C(t,"quality_max")},{value:"balanced",label:C(t,"quality_balanced")},{value:"light",label:C(t,"quality_light")}]}}}:e)}render(){return!this.hass||!this._config?S``:S`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${t=>this._computeLabel(t)}
        .computeHelper=${t=>this._computeHelper(t)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",$t);var Yt={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#b45309","#78350f","#ffffff","#94a3b8"]}};function wt(s){return Yt[s]||Yt.freshwater}function Jt(s){let t=Number(s?.aspect_ratio_width)||1024,e=Number(s?.aspect_ratio_height)||600;return Math.max(400,Math.min(2048,Math.round(1024*(e/t))))}function te(s,t){let e={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(t?.target_budget)||50,survivalVolume:Number(t?.survival_volume)||10};if(!s||!t)return e;if(t.entity&&s.states[t.entity]){let r=s.states[t.entity],i=parseFloat(r.state);if(e.consumedVolume=isNaN(i)?0:Math.max(0,i),r.last_changed){let o=new Date(r.last_changed).getTime();e.hoursSinceLastShower=Math.max(0,(Date.now()-o)/(1e3*60*60))}}if(t.temperature_entity&&s.states[t.temperature_entity]){let r=parseFloat(s.states[t.temperature_entity].state);e.temperature=isNaN(r)?0:r}if(t.target_budget_entity&&s.states[t.target_budget_entity]){let r=parseFloat(s.states[t.target_budget_entity].state);isNaN(r)||(e.targetBudget=r)}return e}function Ve(s,t){return t==="saltwater"?s<2?0:s===2?1:s===3?3:2:t==="coldwater"?s%3:s%4}var st=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5];function kt(s,t){let e=wt(t),r=Math.min(10,Math.max(1,Number(s)||4));return Array.from({length:r},(i,o)=>{let n=Ve(o,t),c=t==="saltwater"&&n===0,l=1.38-(st[o%st.length]-1.2)*.2,f=Math.random()*50-25,h=Math.random()*50-25;return{species:n,color:e.palette[o%e.palette.length],scale:st[o%st.length],phase:Math.random()*6.28,x:c?190+o*140:120+o*760/Math.max(1,r-1)+f,y:c?470:160+o%3*90+h,vx:l*(.8+Math.random()*.4),vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5),dir:Math.random()<.5?1:-1,deathProgress:0}})}function ot({config:s,metrics:t,canvasHeight:e}){let r=t.targetBudget,i=t.survivalVolume,o=r+i,n=t.consumedVolume,c=t.temperature,l=Number(s?.temp_boiling_threshold)||40,f=Number(s?.temp_deadly_threshold)||45,h=Math.max(0,o-n),u=o>0?Math.max(0,Math.min(1,h/o)):0,p=!!s?.fullscreen,_=p?0:15,m=p?600:e-35,k=m-_,g=m-u*k,y=c>=f&&c>0,M=h<=0,v=y||M,L=c>=l&&c>0,a=n>r&&!v,$=n>r*.7&&!a&&!v,b=Number(s?.fish_speed_multiplier)||1.2,B=((a||L)&&!v?2:1)*b;return{targetBudget:r,survivalVolume:i,totalVolume:o,currentVolume:n,currentTemp:c,boilTemp:l,deadlyTemp:f,remainingVolumeInTank:h,waterRatio:u,tankTop:_,tankBottom:m,tankHeight:k,waterSurfaceY:g,isHeatDead:y,isWaterDead:M,isDead:v,isBoiling:L,isCritical:a,isWarning:$,speedMultiplier:B}}function ee({currentTemp:s,currentVolume:t,targetBudget:e,deadlyTemp:r,boilTemp:i}){let o=Math.max(0,Math.min(1,s/45)),n=s>=r?"#ef4444":s>=i?"#f97316":s>=38?"#f59e0b":"#0284c7",c=Math.max(0,Math.min(1,t/Math.max(1,e))),l=t>e?"#ef4444":t>e*.7?"#f59e0b":"#0284c7";return{tempFraction:o,tempColor:n,volFraction:c,volColor:l}}var ie=8e3,vt=7e3,Mt=900;function at(){return{lastVolume:null,lastIncreaseAt:0,target:0,showerActive:!1}}function re(s,t,e){if(s.lastVolume===null)return{...s,lastVolume:t};if(t<s.lastVolume-1e-6)return{...at(),lastVolume:t};if(t>s.lastVolume+1e-6){let r=t-s.lastVolume,i=(e-s.lastIncreaseAt)/1e3,n=s.lastIncreaseAt>0&&i>.2&&i<=15?r/(i/60):null,c=n===null?.5:Math.max(.25,Math.min(1,n/10));return{lastVolume:t,lastIncreaseAt:e,target:c,showerActive:!0}}return s}function se(s,t){return s.lastIncreaseAt&&t-s.lastIncreaseAt<ie?s.target:0}function oe(s,t){return s.showerActive&&s.lastIncreaseAt>0&&t-s.lastIncreaseAt>=ie}function ae(s,t,e){return!e&&s>0&&s<=t}function ne(s,t=36){return s>.02?Math.min(t,Math.round(4+s*(t-4))):0}function le(s,t,e=45){return s<=t+e?"feed":"knock"}function ce(s,t,e,r,i=280,o=Math.random){let n=s-e,c=t-r,l=Math.hypot(n,c);if(l>i)return null;let f,h;if(l<1){let _=o()*Math.PI*2;f=Math.cos(_),h=Math.sin(_)}else f=n/l,h=c/l;let u=1-l/i,p=2+9*u;return{kx:f*p,ky:h*p*.6,scare:u}}function he(s,t,e,r=360){let i=null,o=r;for(let n of e){if(n.eaten)continue;let c=Math.hypot(n.x-s,n.y-t);c<o&&(o=c,i=n)}return i}function de(s,t,e=6,r=Math.random){let i=["#f59e0b","#fbbf24","#fb923c","#facc15"];return Array.from({length:e},()=>({x:s+(r()-.5)*70,y:t+r()*12,vy:.45+r()*.4,phase:r()*Math.PI*2,r:3.4+r()*2,color:i[Math.floor(r()*i.length)],landedAt:0,eaten:!1}))}function fe(s=42,t=Math.random){let e=["#fde047","#fbbf24","#f59e0b","#fcd34d"];return Array.from({length:s},()=>({x:60+t()*904,r:3+t()*6,speed:70+t()*110,delay:t()*2.6,phase:t()*Math.PI*2,color:e[Math.floor(t()*e.length)]}))}function ue(s){let t=Math.max(0,Math.min(1,s/900)),e=2.2;return 1+(e+1)*Math.pow(t-1,3)+e*Math.pow(t-1,2)}function pe(s){let t=vt-1400;return s<=t?1:Math.max(0,1-(s-t)/1400)}function _e(s,t,e=20){if(!s||!t||t.state===void 0)return!1;let r=String(s).split(".")[0],i=String(t.state);if(r==="sun")return i==="below_horizon";if(r==="binary_sensor"||r==="input_boolean"||r==="switch")return i==="on";if(r==="sensor"){let o=parseFloat(i);return!isNaN(o)&&o<e}return!1}var qe=4.186/3600;function Ct(s,t,e=15){return!(s>0)||!(t>e)?0:s*(t-e)*qe}function me({volumeL:s,energyKwh:t,waterPricePerM3:e,energyPricePerKwh:r}){let i=Math.max(0,s||0)*(Number(e)||0)/1e3,o=Math.max(0,t||0)*(Number(r)||0);return{water:i,energy:o,total:i+o}}function At(s,t="fr"){try{return new Intl.NumberFormat(t,{style:"currency",currency:"EUR"}).format(s)}catch{return`${s.toFixed(2)} \u20AC`}}var Kt={max:{fps:0,ambientHz:0,antialias:!0,flowBubbles:36,celebrationParticles:42,celebrationHighlights:!0,richSurface:!0,deathFilter:!0,nightGlow:!0,doubleRipple:!0},balanced:{fps:30,ambientHz:0,antialias:!0,flowBubbles:24,celebrationParticles:30,celebrationHighlights:!0,richSurface:!0,deathFilter:!0,nightGlow:!0,doubleRipple:!0},light:{fps:20,ambientHz:8,antialias:!1,flowBubbles:12,celebrationParticles:15,celebrationHighlights:!1,richSurface:!1,deathFilter:!1,nightGlow:!1,doubleRipple:!1}};function ge(s){return Kt[s]||Kt.max}function ye(s,t,e){return!e||!t?!0:s-t>=1e3/e-2}function xe(s){return s?Math.max(2,1e3/s/16.66*1.6):2}var St=class extends E{static get properties(){return{_hass:{type:Object},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array},_flowBubbles:{type:Array},_food:{type:Array},_ripples:{type:Array},_celebration:{type:Object},_nightProgress:{type:Number}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(t,e){let r=e.find(o=>o.includes("shower")||o.includes("hydrao"))||e[0]||"",i=e.find(o=>o.includes("temperature")&&(o.includes("shower")||o.includes("hydrao")))||"";return{entity:r,temperature_entity:i,title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:10,temp_boiling_threshold:40,temp_deadly_threshold:45,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1}}constructor(){super(),this._animationFrameId=null,this._deathProgress=0,this._flow=at(),this._flowIntensity=0,this._food=[],this._ripples=[],this._celebration=null,this._isNight=!1,this._nightProgress=0,this._energyKwh=0,this._flowBubbles=Array.from({length:36},()=>({active:!1,x:512,baseX:512,y:0,vy:2,r:3,phase:0})),this._lastTimestamp=0,this._lastFrameTs=0,this._animTime=0,this._ambientTime=0,this._lastAmbientTs=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=50,this._cachedSurvivalVolume=10,this._cachedHoursSinceLastShower=0,this._fishes=kt(4,"freshwater"),this._snails=[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],this._ancistrus={x:70,y:340,targetY:340,state:"idle",idleUntil:0,deathProgress:0},this._shrimp={x:840,y:550,targetX:840,state:"idle",idleUntil:0,dir:-1,deathProgress:0},this._crab={x:350,y:555,targetX:350,state:"idle",idleUntil:0,dir:1,deathProgress:0},this._bubbles=[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],this._boilingBubbles=Array.from({length:24},()=>({x:10+Math.random()*1004,y:30+Math.random()*540,vy:2.5+Math.random()*3.5,vx:(Math.random()-.5)*1.5,r:4+Math.random()*8}))}static get styles(){return zt}_t(t){return C(V(this._hass),t)}_getCanvasHeight(){return Jt(this._config)}_updateCachedMetrics(){if(!this._hass||!this._config)return;let t=te(this._hass,this._config);this._cachedConsumedVolume=t.consumedVolume,this._cachedHoursSinceLastShower=t.hoursSinceLastShower,this._cachedTemperature=t.temperature,this._cachedTargetBudget=t.targetBudget,this._cachedSurvivalVolume=t.survivalVolume,this._isNight=_e(this._config.night_entity,this._hass.states?.[this._config.night_entity],Number(this._config.night_lux_threshold)||20)}setConfig(t){if(!t.entity)throw new Error("Please define a valid entity.");this._config={title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:10,temp_boiling_threshold:40,temp_deadly_threshold:45,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,night_lux_threshold:20,show_cost:!1,cost_in_fullscreen:!1,water_price_per_m3:4.5,energy_price_per_kwh:.25,cold_water_temp:15,animation_quality:"max",...t},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen");let e=this._config.theme||"freshwater",r=Number(this._config.fish_count)||4;this._fishes=kt(r,e),this._flow=at(),this._food=[],this._celebration=null,this._updateCachedMetrics(),this.requestUpdate()}set hass(t){this._hass=t,this._updateCachedMetrics(),this._trackFlow()}_trackFlow(){if(!this._hass||!this._config)return;let t=this._hass.states?.[this._config.entity]?.state;if(t===void 0||isNaN(parseFloat(t)))return;let e=this._cachedConsumedVolume,r=this._flow.lastVolume,i=Number.isFinite(Number(this._config.cold_water_temp))?Number(this._config.cold_water_temp):15;r===null||e<r-1e-6?this._energyKwh=Ct(e,this._cachedTemperature,i):e>r+1e-6&&(this._energyKwh+=Ct(e-r,this._cachedTemperature,i)),this._flow=re(this._flow,e,Date.now())}connectedCallback(){super.connectedCallback(),this._startAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._stopAnimation()}get _profile(){return ge(this._config?.animation_quality)}_startAnimation(){if(!this._animationFrameId){let t=e=>{ye(e,this._lastFrameTs,this._profile.fps)&&(this._lastFrameTs=e,this._updatePhysics(e)),this._animationFrameId=requestAnimationFrame(t)};this._animationFrameId=requestAnimationFrame(t)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(t){this._lastTimestamp||(this._lastTimestamp=t);let e=t-this._lastTimestamp,r=this._profile,i=Math.min(e/16.66,xe(r.fps));this._lastTimestamp=t,this._animTime=t*.0035,(!r.ambientHz||t-this._lastAmbientTs>=1e3/r.ambientHz)&&(this._ambientTime=this._animTime,this._lastAmbientTs=t);let o={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{tankTop:n,tankBottom:c,waterSurfaceY:l,waterRatio:f,isDead:h,isBoiling:u,speedMultiplier:p}=ot({config:this._config,metrics:o,canvasHeight:this._getCanvasHeight()}),_=Number(this._config.fish_speed_multiplier)||1.2,m=(e||16.66)/4500,k=this._config.theme||"freshwater",g=!1;this._deathProgress=h?Math.min(1,(this._deathProgress||0)+m):0;let y=Date.now(),M=this._isNight?1:0;this._nightProgress!==M&&(this._nightProgress+=(M-this._nightProgress)*Math.min(1,.04*i),Math.abs(M-this._nightProgress)<.005&&(this._nightProgress=M),g=!0);let v=h?0:se(this._flow,y);this._flowIntensity+=(v-this._flowIntensity)*Math.min(1,.03*i),this._flowIntensity<.005&&v===0&&(this._flowIntensity=0),oe(this._flow,y)&&(ae(o.consumedVolume,o.targetBudget,h)&&(this._celebration={start:y,particles:fe(r.celebrationParticles)}),this._flow={...this._flow,showerActive:!1}),this._celebration&&((h||y-this._celebration.start>=vt)&&(this._celebration=null),g=!0),this._ripples.length>0&&(this._ripples=this._ripples.filter(a=>y-a.born<Mt),g=!0),h||f<=0?this._food=[]:this._food.length>0&&(this._food.forEach(a=>{a.landedAt||(a.y+=a.vy*i,a.x+=Math.sin(this._animTime*1.5+a.phase)*.25*i,a.y<l&&(a.y=l),a.y>=c-30&&(a.y=c-30,a.landedAt=y))}),this._food=this._food.filter(a=>!a.eaten&&!(a.landedAt&&y-a.landedAt>6e3)),g=!0);let L=f>0&&!h?ne(this._flowIntensity,r.flowBubbles):0;if(this._flowBubbles.forEach((a,$)=>{if(!a.active){$<L&&(a.active=!0,a.baseX=512+(Math.random()-.5)*90,a.x=a.baseX,a.y=c-10-Math.random()*40,a.vy=1.8+Math.random()*2.2+this._flowIntensity*1.2,a.r=2+Math.random()*4,a.phase=Math.random()*Math.PI*2);return}a.y-=a.vy*i,a.x=a.baseX+Math.sin(this._animTime*2+a.phase)*6,(a.y<l+2||h)&&(a.active=!1),g=!0}),this._flowIntensity>0&&(g=!0),this._fishes&&this._fishes.length>0&&this._fishes.forEach(a=>{if(h){a.deathProgress=Math.min(1,(a.deathProgress||0)+m),a.y=Math.min(c-30,a.y+1.2*i),g=!0;return}a.deathProgress=0;let $=k==="saltwater"&&a.species===0,b=a.scare>.05?null:he(a.x,a.y,this._food);b?(a._baseVy===void 0&&(a._baseVy=a.vy),Math.abs(b.x-a.x)>6&&(a.dir=b.x<a.x?-1:1),a.vy=Math.max(-1.1,Math.min(1.1,(b.y-a.y)*.02)),a._seeking=!0):a._seeking&&(a._baseVy!==void 0&&(a.vy=a._baseVy),a._seeking=!1);let A=b?1.8:1,B=$?Math.max(n+45,l+35,c-160):Math.max(n+45,l+35),q=c-45,J=$?160:110,tt=$?380:910;if(a.x+=a.vx*a.dir*p*A*i,a.y+=a.vy*p*i,a.kickX||a.kickY){a.x+=a.kickX*i,a.y+=a.kickY*i;let P=Math.pow(.93,i);a.kickX*=P,a.kickY*=P;let x=Math.hypot(a.kickX,a.kickY);a.scare=Math.min(1,x/8),x<.15&&(a.kickX=0,a.kickY=0,a.scare=0)}if(this._food.length>0){let P=a.x+a.dir*22*(a.scale||1.4);this._food.forEach(x=>{!x.eaten&&Math.hypot(x.x-P,x.y-a.y)<28&&(x.eaten=!0)})}a.x<J?(a.x=J,a.dir=1):a.x>tt&&(a.x=tt,a.dir=-1),a.y<B?(a.y=B,a.vy=Math.abs(a.vy)):a.y>q&&(a.y=q,a.vy=-Math.abs(a.vy)),g=!0}),this._snails&&this._snails.length>0&&this._snails.forEach(a=>{if(h){a.y=Math.min(c-10,a.y+1.5*i),g=!0;return}if(a.type==="bottom")a.x+=a.vx*a.dir*i,a.x<100?(a.x=100,a.dir=1):a.x>920&&(a.x=920,a.dir=-1);else if(a.type==="glass_left"||a.type==="glass_right"){let $=Math.max(n+35,l+25);a.y+=a.vy*i,a.y<$?(a.y=$,a.vy=Math.abs(a.vy)):a.y>c-25&&(a.y=c-25,a.vy=-Math.abs(a.vy))}g=!0}),this._ancistrus)if(h)this._ancistrus.deathProgress=Math.min(1,(this._ancistrus.deathProgress||0)+m),this._ancistrus.y=Math.min(c-35,this._ancistrus.y+1.2*i),g=!0;else{this._ancistrus.deathProgress=0;let a=Math.max(n+65,l+70),$=c-110;if(this._ancistrus.idleUntil||(this._ancistrus.idleUntil=t+2500+Math.random()*4e3),this._ancistrus.state==="moving"){let b=this._ancistrus.targetY-this._ancistrus.y,A=Math.sign(b)*Math.min(Math.abs(b),.7*_*i);this._ancistrus.y+=A,Math.abs(this._ancistrus.targetY-this._ancistrus.y)<1.5&&(this._ancistrus.state="idle",this._ancistrus.idleUntil=t+3e3+Math.random()*4e3)}else t>=this._ancistrus.idleUntil&&(this._ancistrus.state="moving",this._ancistrus.targetY=a+Math.random()*($-a));g=!0}if(this._shrimp)if(h)this._shrimp.deathProgress=Math.min(1,(this._shrimp.deathProgress||0)+m),g=!0;else{this._shrimp.deathProgress=0,this._shrimp.y=c-25;let a=740,$=940;if(this._shrimp.idleUntil||(this._shrimp.idleUntil=t+1200+Math.random()*2e3),this._shrimp.state==="moving"){let b=this._shrimp.targetX-this._shrimp.x;this._shrimp.dir=b<0?-1:1;let A=Math.sign(b)*Math.min(Math.abs(b),.9*_*i);this._shrimp.x+=A,Math.abs(this._shrimp.targetX-this._shrimp.x)<1.5&&(this._shrimp.state="idle",this._shrimp.idleUntil=t+1500+Math.random()*2500)}else t>=this._shrimp.idleUntil&&(this._shrimp.state="moving",this._shrimp.targetX=a+Math.random()*($-a));g=!0}if(this._crab)if(h)this._crab.deathProgress=Math.min(1,(this._crab.deathProgress||0)+m),g=!0;else{this._crab.deathProgress=0,this._crab.y=c-20;let a=240,$=460;if(this._crab.idleUntil||(this._crab.idleUntil=t+2e3+Math.random()*3e3),this._crab.state==="moving"){let b=this._crab.targetX-this._crab.x;this._crab.dir=b<0?-1:1;let A=Math.sign(b)*Math.min(Math.abs(b),.7*_*i);this._crab.x+=A,Math.abs(this._crab.targetX-this._crab.x)<1.5&&(this._crab.state="idle",this._crab.idleUntil=t+2500+Math.random()*3500)}else t>=this._crab.idleUntil&&(this._crab.state="moving",this._crab.targetX=a+Math.random()*($-a));g=!0}f>0&&!h&&this._bubbles&&this._bubbles.forEach(a=>{a.y-=a.vy*i,a.y<l&&(a.y=c-15),g=!0}),u&&f>0&&this._boilingBubbles&&this._boilingBubbles.forEach(a=>{a.y-=a.vy*i,a.x+=a.vx*i,a.y<l&&(a.y=c-15,a.x=10+Math.random()*1004),g=!0}),g&&this.requestUpdate()}_renderWaterSurface(t,e,r){let i=this._flowIntensity||0,o=3.5+i*6.5,n=90-i*35,l=(i>.05?this._animTime:this._ambientTime)*(1.6+i*2.4),f=this._profile.richSurface,h=f?16:28,u=y=>f?Math.sin(y/17+l*2.3)*i*2.4:0,p=[],_=[];for(let y=t;y<e;y+=h)p.push([y,r+Math.sin(y/n+l)*o+u(y)]),_.push([y,r+4+Math.sin(y/n+l+.6)*o*.7]);p.push([e,r+Math.sin(e/n+l)*o+u(e)]),_.push([e,r+4+Math.sin(e/n+l+.6)*o*.7]);let m=y=>`${y[0].toFixed(1)},${y[1].toFixed(1)}`,k=p.map(m).join(" L "),g=_.slice().reverse().map(m).join(" L ");return d`
      <path d="M ${k} L ${g} Z" fill="#ffffff" opacity="0.25" />
      <path d="M ${k}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
    `}_renderAnemoneTentacles(t=0){let e=[{count:11,baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:16,baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],r=[];return e.forEach((i,o)=>{for(let n=0;n<i.count;n++){let c=n/(i.count-1),l=-90-i.spread/2+c*i.spread,f=(i.lenMin+(i.lenMax-i.lenMin)*(.5+.5*Math.sin(c*Math.PI)))*(1-.3*t),h=o*10+n*.7,u=Math.sin(this._ambientTime*i.speed+h)*9*(1-t),p=l*Math.PI/180,_=Math.cos(p)*i.baseR,m=Math.sin(p)*i.baseR,k=n*37%17-8,g=l+90+u;r.push(d`
          <g transform="translate(${_.toFixed(1)}, ${m.toFixed(1)}) rotate(${g.toFixed(1)})">
            <path d="M 0,0 Q ${k.toFixed(1)},${(-f*.55).toFixed(1)} 0,${(-f).toFixed(1)}" stroke="${i.color}" stroke-width="${i.width}" stroke-linecap="round" fill="none" opacity="0.9" />
            <circle cx="0" cy="${(-f).toFixed(1)}" r="${(i.width*.9).toFixed(1)}" fill="${i.tip}" />
          </g>
        `)}}),r}_renderThemeDecoration(t,e,r=0){let i=e?600:this._getCanvasHeight()-35,o=this._profile.deathFilter?`filter: grayscale(${(r*.85).toFixed(2)}) sepia(${(r*.5).toFixed(2)}) brightness(${(1-r*.45).toFixed(2)});`:`opacity: ${(1-r*.6).toFixed(2)};`;return t==="saltwater"?d`
        <g id="reef-decor">
          <g style="${o}">
          <path d="M 60 ${i} Q 40 ${i-165}, 95 ${i-225} Q 120 ${i-275}, 85 ${i-335} Q 135 ${i-265}, 120 ${i-195} Q 150 ${i-135}, 115 ${i} Z" fill="#f43f5e" opacity="0.95" />
          <path d="M 115 ${i} Q 150 ${i-155}, 190 ${i-205} Q 215 ${i-245}, 190 ${i-295} Q 230 ${i-235}, 205 ${i-155} Q 180 ${i-105}, 155 ${i} Z" fill="#fb7185" opacity="0.9" />
          <g transform="translate(830, ${i})">
            <path d="M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z" fill="#c084fc" opacity="0.85" />
            <path d="M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z" fill="#a855f7" opacity="0.9" />
            <path d="M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z" fill="#d8b4fe" opacity="0.85" />
            <circle cx="0" cy="-20" r="60" fill="#7e22ce" opacity="0.75" />
          </g>
          <g transform="translate(190, ${i-70})">
            <path d="M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" />
            <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
            <circle cx="0" cy="0" r="5" fill="#60a5fa" />
          </g>
          </g>
          <g id="live-rock" transform="translate(750, ${i})">
            <path d="M -25.5,-18.0 Q -25.5,-18.0 -30.2,-12.4 Q -34.9,-6.8 -43.4,-1.7 Q -52.0,3.3 -60.8,-1.6 Q -69.6,-6.4 -74.3,-12.2 Q -79.0,-18.0 -75.4,-24.5 Z" fill="#8b6a9c" />
            <path d="M 60.3,-38.0 Q 60.3,-38.0 57.1,-25.7 Q 53.9,-13.4 42.9,-0.9 Q 31.9,11.5 11.6,8.1 Q -8.7,4.7 -24.7,0.1 Q -40.8,-4.6 -51.6,-14.8 Z" fill="#6d5280" />
          </g>
          <g id="live-rock-2" transform="translate(420, ${i})">
            <path d="M 41.8,-26.0 Q 41.8,-26.0 37.1,-16.4 Q 32.4,-6.8 19.8,-2.1 Q 7.2,2.6 -3.0,-3.6 Q -13.2,-9.9 -23.4,-13.6 Q -33.5,-17.4 -32.1,-25.6 Q -30.6,-33.9 -24.0,-40.5 Q -17.3,-47.1 -6.3,-46.0 Q 4.7,-44.9 13.2,-41.9 Q 21.7,-38.9 31.8,-32.4 Z" fill="#6d5280" />
          </g>
          <g id="anemone" style="${o}" transform="translate(260, ${i-17}) scale(1.4, 1.4)">
            ${this._renderAnemoneTentacles(r)}
            <ellipse cx="0" cy="-16" rx="30" ry="11" fill="#86198f" opacity="0.9" />
            <path d="M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z" fill="#701a75" />
            <ellipse cx="0" cy="16" rx="26" ry="9" fill="#4a044e" opacity="0.75" />
          </g>
        </g>
      `:t==="coldwater"?d`
        <g id="coldwater-decor">
          <ellipse cx="140" cy="${i-25}" rx="70" ry="26" fill="#475569" />
          <ellipse cx="250" cy="${i-17}" rx="50" ry="20" fill="#64748b" />
          <ellipse cx="860" cy="${i-20}" rx="75" ry="28" fill="#334155" />
          <ellipse cx="760" cy="${i-15}" rx="46" ry="18" fill="#64748b" />
          <ellipse cx="300" cy="${i-10}" rx="26" ry="10" fill="#94a3b8" opacity="0.85" />
          <ellipse cx="600" cy="${i-8}" rx="22" ry="9" fill="#94a3b8" opacity="0.8" />
          <ellipse cx="660" cy="${i-14}" rx="34" ry="14" fill="#475569" opacity="0.9" />
        </g>
      `:d`
      <g id="freshwater-plants" style="${o}">
        <path d="M 45 ${i} Q 65 ${i-75}, 115 ${i-60} Q 155 ${i-85}, 200 ${i-50} Q 240 ${i-70}, 285 ${i} Z" fill="#15803d" />
        <path d="M 75 ${i} Q 95 ${i-60}, 135 ${i-55} Q 170 ${i-75}, 210 ${i-40} Q 250 ${i-50}, 270 ${i} Z" fill="#22c55e" opacity="0.85" />
        <circle cx="110" cy="${i-55}" r="11" fill="#4ade80" opacity="0.7" />
        <circle cx="170" cy="${i-63}" r="12" fill="#4ade80" opacity="0.7" />
        <path d="M 120 ${i} Q 140 ${i-105}, 160 ${i-155} Q 165 ${i-205}, 145 ${i-265}" stroke="#14532d" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 145 ${i-265} Q 105 ${i-305}, 85 ${i-280} C 70 ${i-250}, 110 ${i-220}, 145 ${i-265} Z" fill="#166534" />
        <path d="M 145 ${i-265} Q 185 ${i-315}, 215 ${i-295} C 230 ${i-270}, 190 ${i-230}, 145 ${i-265} Z" fill="#15803d" />
        <path d="M 880 ${i} Q 920 ${i-195}, 870 ${i-355} Q 845 ${i-195}, 860 ${i} Z" fill="#16a34a" opacity="0.9" />
        <path d="M 920 ${i} Q 960 ${i-215}, 930 ${i-375} Q 895 ${i-205}, 900 ${i} Z" fill="#22c55e" opacity="0.8" />
      </g>
    `}_renderFishShape(t,e,r){let i=t.dir===-1,o=t.deathProgress||0,n=t.scale||1.4,c=(1-o).toFixed(2),l=o.toFixed(2),f=r?0:t.scare||0,h=r?0:Math.sin(this._animTime*(3.5*t.vx)+t.phase)*14*(1+.8*f),u=r?0:Math.sin(this._animTime*(4.5*t.vx)+t.phase)*10,p;return e==="saltwater"?t.species===0?p=d`
          <g transform="translate(-20, 0) rotate(${h})">
            <path d="M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z" fill="#ea580c" stroke="#0f172a" stroke-width="1.4" />
          </g>
          <ellipse cx="0" cy="0" rx="24" ry="15" fill="#f97316" />
          <path d="M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <circle cx="15" cy="-4" r="3.2" fill="#ffffff" /><circle cx="16" cy="-4" r="1.6" fill="#0f172a" />
          <g transform="translate(3, 3) rotate(${u})">
            <ellipse cx="0" cy="6" rx="6" ry="10" fill="#f97316" opacity="0.9" stroke="#0f172a" stroke-width="1" />
          </g>
        `:t.species===1?p=d`
          <g transform="translate(-25, 0) rotate(${h})">
            <polygon points="0,-2 -20,-13 -13,-2 -20,9 0,2" fill="#f59e0b" />
            <polygon points="0,-2 -17,-10 -12,-2 -17,7 0,1" fill="#fde047" opacity="0.85" />
          </g>
          <path d="M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z" fill="url(#tangBodyGrad)" />
          <path d="M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z" fill="#0f172a" opacity="0.88" />
          <circle cx="19" cy="2" r="1.5" fill="#facc15" opacity="0.8" />
          <circle cx="18" cy="-6" r="2.8" fill="#0f172a" /><circle cx="18.6" cy="-6.6" r="0.9" fill="#93c5fd" />
        `:t.species===3?p=d`
          <g transform="translate(-22, 0) rotate(${h})">
            <path d="M 0,0 L -12,-9 L -8,0 L -12,9 Z" fill="#fbbf24" opacity="0.9" />
          </g>
          <ellipse cx="0" cy="0" rx="23" ry="20" fill="url(#butterflyBodyGrad)" />
          <path d="M -14,-16 L -8,17" stroke="#ea580c" stroke-width="1.3" opacity="0.55" />
          <path d="M -6,-19 L 0,19" stroke="#ea580c" stroke-width="1.3" opacity="0.55" />
          <path d="M 2,-19 L 7,19" stroke="#ea580c" stroke-width="1.3" opacity="0.55" />
          <path d="M 10,-17 L 14,16" stroke="#ea580c" stroke-width="1.3" opacity="0.5" />
          <path d="M 18,-3 Q 26,-1 27,0 Q 26,1 18,3 Z" fill="#fbbf24" />
          <circle cx="-15" cy="0" r="3" fill="#1f2937" opacity="0.8" />
          <circle cx="-15" cy="0" r="1.6" fill="#fbbf24" opacity="0.9" />
          <circle cx="12.5" cy="-4" r="2.6" fill="#0f172a" /><circle cx="13.2" cy="-4.6" r="0.8" fill="#e2e8f0" />
        `:p=d`
          <g transform="translate(-20, 0) rotate(${h})">
            <polygon points="0,0 -22,-14 -17,0 -22,14" fill="${t.color}" />
          </g>
          <polygon points="2,-28 -8,-10 8,-10" fill="${t.color}" opacity="0.9" />
          <polygon points="0,28 -6,10 6,10" fill="${t.color}" opacity="0.9" />
          <ellipse cx="0" cy="0" rx="24" ry="19" fill="${t.color}" />
          <path d="M -6,-14 L -6,14" stroke="#ffffff" stroke-width="3.5" />
          <path d="M 6,-16 L 6,16" stroke="#ffffff" stroke-width="3.5" />
          <circle cx="15" cy="-5" r="3.2" fill="#ffffff" /><circle cx="16" cy="-5" r="1.5" fill="#0f172a" />
        `:e==="coldwater"?t.species===0?p=d`
          <g transform="translate(-14, 0) rotate(${h*1.1})">
            <path d="M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z" fill="${t.color}" opacity="0.88" />
          </g>
          <circle cx="10" cy="0" r="19" fill="${t.color}" />
          <ellipse cx="6" cy="-6" rx="12" ry="7" fill="#ffffff" opacity="0.4" />
          <circle cx="21" cy="-2" r="3.6" fill="#ffffff" /><circle cx="22.2" cy="-2" r="1.8" fill="#0f172a" />
        `:t.species===1?p=d`
          <g transform="translate(-16, 0) rotate(${h})">
            <path d="M 0,0 L -48,-19 L -30,-1 Z" fill="${t.color}" opacity="0.92" />
            <path d="M 0,0 L -48,19 L -30,1 Z" fill="${t.color}" opacity="0.8" />
          </g>
          <path d="M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z" fill="${t.color}" />
          <circle cx="20" cy="-3" r="3" fill="#ffffff" /><circle cx="21" cy="-3" r="1.5" fill="#0f172a" />
        `:p=d`
          <g transform="translate(-14,0) rotate(${h*.8})">
            <path d="M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z" fill="${t.color}" opacity="0.88" />
          </g>
          <circle cx="4" cy="2" r="22" fill="${t.color}" />
          <circle cx="20" cy="-1" r="3" fill="#ffffff" /><circle cx="21.2" cy="-1" r="1.5" fill="#0f172a" />
        `:t.species===0?p=d`
          <polygon points="5,-42 -10,-12 10,-12" fill="${t.color}" opacity="0.9" />
          <polygon points="0,42 -8,12 8,12" fill="${t.color}" opacity="0.9" />
          <line x1="8" y1="10" x2="20" y2="48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          <g transform="translate(-22, 0) rotate(${h})">
            <polygon points="0,0 -20,-14 -15,0 -20,14" fill="${t.color}" />
          </g>
          <polygon points="-20,0 5,-17 24,0 5,17" fill="${t.color}" />
          <line x1="3" y1="-17" x2="3" y2="17" stroke="#0f172a" stroke-width="3" />
          <circle cx="16" cy="-3" r="3.0" fill="#ef4444" /><circle cx="17" cy="-3" r="1.4" fill="#0f172a" />
        `:t.species===1?p=d`
          <g transform="translate(-20, 0) rotate(${h})">
            <polygon points="0,0 -14,-7 -12,0 -14,7" fill="rgba(255,255,255,0.7)" />
          </g>
          <ellipse cx="0" cy="0" rx="22" ry="9" fill="#1e293b" />
          <path d="M 15,-2 L -17,-2" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />
          <path d="M 0,3 L -17,3" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
          <circle cx="14" cy="-2" r="2.2" fill="#38bdf8" /><circle cx="15" cy="-2" r="0.9" fill="#0f172a" />
        `:p=d`
          <g transform="translate(-22, 0) rotate(${h})">
            <polygon points="0,0 -19,-12 -16,0 -19,12" fill="${t.color}" />
          </g>
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="${t.color}" />
          <circle cx="14" cy="-4" r="3.2" fill="#ffffff" /><circle cx="15" cy="-4" r="1.5" fill="#0f172a" />
        `,d`
      <g transform="scale(${i?-n:n}, ${r?-n:n})">
        <g opacity="${c}">${p}</g>${o>0?d`
              <g opacity="${l}">
                <!-- Fish Spine -->
                <line x1="-28" y1="0" x2="16" y2="0" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
                <!-- Fish Ribs / Arêtes -->
                <path d="M -20,-8 L -16,0 L -20,8 M -12,-11 L -8,0 L -12,11 M -4,-12 L 0,0 L -4,12 M 4,-10 L 8,0 L 4,10" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" fill="none" />
                <!-- Tail fin rays -->
                <path d="M -28,0 L -36,-10 M -28,0 L -38,0 M -28,0 L -36,10" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" />
                <!-- Skull -->
                <path d="M 12,-9 C 24,-9 27,0 25,9 C 18,9 14,5 12,0 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
                <circle cx="18" cy="-2" r="2.8" fill="#0f172a" />
              </g>
            `:""}
      </g>
    `}_renderAncistrus(t){if(!this._ancistrus)return d``;let e=this._ancistrus,r=e.deathProgress||0,i=(1-r).toFixed(2),o=t?1:(1+Math.sin(this._ambientTime*1.6)*.07).toFixed(3),n="#182026",c="#1e293b",l="#0a0f14",f="#475569";return d`
      <g transform="translate(${e.x}, ${e.y}) scale(1.5,${t?-1.5:1.5})">
        <g opacity="${i}">
          <!-- Left Pectoral Fin with spine ray -->
          <path d="M -12,6 C -24,10 -30,18 -26,26 C -20,26 -14,20 -9,14 Z" fill="${n}" stroke="${l}" stroke-width="0.8" />
          <line x1="-12" y1="8" x2="-24" y2="24" stroke="${f}" stroke-width="1.4" stroke-linecap="round" />

          <!-- Right Pectoral Fin with spine ray -->
          <path d="M 12,6 C 24,10 30,18 26,26 C 20,26 14,20 9,14 Z" fill="${n}" stroke="${l}" stroke-width="0.8" />
          <line x1="12" y1="8" x2="24" y2="24" stroke="${f}" stroke-width="1.4" stroke-linecap="round" />

          <!-- Pelvic Fins -->
          <path d="M -7,30 C -15,36 -15,44 -7,42 Z" fill="${n}" stroke="${l}" stroke-width="0.6" />
          <path d="M 7,30 C 15,36 15,44 7,42 Z" fill="${n}" stroke="${l}" stroke-width="0.6" />

          <!-- Streamlined Body (Model 5 base) -->
          <path d="M -12,0 C -15,16 -14,34 -9,52 L -3,74 L 3,74 L 9,52 C 14,34 15,16 12,0 C 9,-8 -9,-8 -12,0 Z" fill="${c}" stroke="${l}" stroke-width="1.1" />

          <!-- White micro-dots on body -->
          <circle cx="0" cy="20" r="1.0" fill="#ffffff" opacity="0.9" />
          <circle cx="-4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="0" cy="42" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="-3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />
          <circle cx="3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />

          <!-- Straight brush bristles / tentacles on snout (Model 5) -->
          <line x1="-10" y1="-5" x2="-14" y2="-17" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="-7" y1="-6" x2="-9" y2="-21" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="-3" y1="-7" x2="-4" y2="-24" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="0" y1="-8" x2="0" y2="-25" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="3" y1="-7" x2="4" y2="-24" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="7" y1="-6" x2="9" y2="-21" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="10" y1="-5" x2="14" y2="-17" stroke="${l}" stroke-width="1.4" stroke-linecap="round" />

          <!-- Recessed Sucker Mouth inside body -->
          <g transform="translate(0, 3) scale(${o},${o})">
            <ellipse cx="0" cy="0" rx="7.4" ry="5.6" fill="#334155" stroke="${l}" stroke-width="0.9" />
            <ellipse cx="0" cy="0" rx="4.8" ry="3.6" fill="#0f172a" />
            <ellipse cx="0" cy="0" rx="2.2" ry="1.5" fill="#475569" />
          </g>
        </g>

        ${r>0?d`
              <g opacity="${r.toFixed(2)}">
                <!-- Main Ancistrus Spine -->
                <line x1="0" y1="-15" x2="0" y2="70" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round" />
                <!-- Ancistrus Ribs / Arêtes -->
                <path d="M -12,10 L 0,16 L 12,10 M -14,24 L 0,30 L 14,24 M -12,38 L 0,44 L 12,38 M -9,52 L 0,56 L 9,52 M -6,64 L 0,66 L 6,64" stroke="#f1f5f9" stroke-width="1.8" stroke-linecap="round" fill="none" />
                <!-- Sucker disc bone -->
                <ellipse cx="0" cy="-6" rx="8" ry="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1" />
                <circle cx="-3" cy="-7" r="1.5" fill="#0f172a" />
                <circle cx="3" cy="-7" r="1.5" fill="#0f172a" />
              </g>
            `:""}
      </g>
    `}_renderShrimp(t){if(!this._shrimp)return d``;let e=this._shrimp,i=(1-(e.deathProgress||0)).toFixed(2),o=e.dir===-1?-1:1;return d`
      <g transform="translate(${e.x}, ${e.y}) scale(${o*1.5}, ${t?-1.5:1.5})" opacity="${i}">
        <path d="M -6,10 L -8,16" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 0,12 L -1,18" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 6,13 L 6,19" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 12,12 L 13,18" stroke="#450a0a" stroke-width="1" stroke-linecap="round" opacity="0.7" />
        <path d="M 20,14 L 32,6 L 34,14 L 32,23 L 20,18 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
        <path d="M -30,-10 C -20,-16 -6,-16 4,-10 C 12,-6 16,-2 20,6 C 23,11 23,15 19,16 C 8,17 -2,15 -10,10 C -18,5 -24,-2 -30,-10 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="0.9" />
        <circle cx="-22" cy="-8" r="1.5" fill="#fef2f2" />
        <circle cx="-14" cy="-11" r="1.4" fill="#fef2f2" />
        <circle cx="-6" cy="-10" r="1.5" fill="#fef2f2" />
        <circle cx="1" cy="-7" r="1.3" fill="#fef2f2" />
        <path d="M -30,-9 Q -40,-10 -46,-4 Q -40,0 -32,-4 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="0.7" />
        <path d="M -30,-11 Q -60,-24 -88,-30" stroke="#fef9c3" stroke-width="1.1" fill="none" stroke-linecap="round" />
        <path d="M -28,-8 Q -54,-12 -80,-10" stroke="#fef9c3" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.85" />
        <circle cx="-27" cy="-13" r="1.9" fill="#0f172a" /><circle cx="-27.6" cy="-13.6" r="0.6" fill="#f1f5f9" />
      </g>
    `}_renderCrab(t){if(!this._crab)return d``;let e=this._crab,i=(1-(e.deathProgress||0)).toFixed(2),o=e.dir===-1?-1:1;return d`
      <g transform="translate(${e.x}, ${e.y}) scale(${o*1.4}, ${t?-1.4:1.4})" opacity="${i}">
        <path d="M -14,-2 L -26,-10 L -34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -15,4 L -28,4 L -36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -13,10 L -24,16 L -30,24" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M -8,14 L -16,24 L -20,32" stroke="#7c2d12" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M 14,-2 L 26,-10 L 34,-8" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 15,4 L 28,4 L 36,9" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 13,10 L 24,16 L 30,24" stroke="#7c2d12" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <path d="M 8,14 L 16,24 L 20,32" stroke="#7c2d12" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M -12,-8 L -22,-18 Q -30,-22 -34,-16 Q -28,-12 -20,-10 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
        <path d="M 12,-8 L 22,-18 Q 30,-22 34,-16 Q 28,-12 20,-10 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1" />
        <path d="M -20,-10 C -24,-2 -24,8 -18,14 C -10,19 10,19 18,14 C 24,8 24,-2 20,-10 C 14,-16 -14,-16 -20,-10 Z" fill="#dc2626" stroke="#ea580c" stroke-width="1.2" />
        <ellipse cx="0" cy="-2" rx="15" ry="10" fill="#f87171" opacity="0.35" />
        <path d="M -6,-13 L -7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
        <path d="M 6,-13 L 7,-19" stroke="#9a3412" stroke-width="1.4" stroke-linecap="round" />
        <circle cx="-7.2" cy="-20" r="2" fill="#0f172a" /><circle cx="7.2" cy="-20" r="2" fill="#0f172a" />
      </g>
    `}_renderAlgae(t,e){let r=Number(this._config.algae_delay_hours)||12,i=Number(this._config.algae_age)||0,o=i>0?i:t;if(!this._config.algae_enabled||o<r)return d``;let c=(.2+Math.min(1,(o-r)/36)*.78).toFixed(2),l=e?0:14,f=e?600:this._getCanvasHeight()-35;return d`
      <g id="algae-layer" opacity="${c}">
        <rect x="0" y="${l}" width="1024" height="${f-l}" fill="url(#algaeDots)" />
      </g>
    `}_eventToSvgPoint(t){let e=t.currentTarget,r=e.getScreenCTM?e.getScreenCTM():null;if(!r)return null;let i=e.createSVGPoint();i.x=t.clientX,i.y=t.clientY;let o=i.matrixTransform(r.inverse());return{x:o.x,y:o.y}}_onTankTap(t){if(!this._config||!this._hass)return;let e=this._eventToSvgPoint(t);if(!e)return;let r={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{waterRatio:i,waterSurfaceY:o,isDead:n}=ot({config:this._config,metrics:r,canvasHeight:this._getCanvasHeight()});if(!(n||i<=0)){if(le(e.y,o)==="feed"){let c=Math.max(80,Math.min(944,e.x));this._food=[...this._food,...de(c,o+2)].slice(-30)}else this._ripples=[...this._ripples,{x:e.x,y:e.y,born:Date.now()}],(this._fishes||[]).forEach(c=>{let l=ce(c.x,c.y,e.x,e.y);l&&(c.kickX=l.kx,c.kickY=l.ky,c.scare=l.scare,Math.abs(l.kx)>.5&&(c.dir=l.kx<0?-1:1))});this.requestUpdate()}}_renderFlowBubbles(){return d`
      <g>
        ${this._flowBubbles.filter(t=>t.active).map(t=>d`<circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="${t.r.toFixed(1)}" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2" />`)}
      </g>
    `}_renderFood(){return this._food.length?d`
      <g>
        ${this._food.map(t=>d`<ellipse cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" rx="${t.r.toFixed(1)}" ry="${(t.r*.6).toFixed(1)}" fill="${t.color}" stroke="#b45309" stroke-width="0.6" />`)}
      </g>
    `:d``}_renderRipples(){if(!this._ripples.length)return d``;let t=Date.now();return d`
      <g>
        ${this._ripples.map(e=>{let r=Math.min(1,(t-e.born)/Mt),i=(1-r).toFixed(2);return d`
            <circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="${(14+r*150).toFixed(1)}" fill="none" stroke="#ffffff" stroke-width="${(5-r*3).toFixed(1)}" stroke-opacity="${i}" />
            ${this._profile.doubleRipple?d`<circle cx="${e.x.toFixed(1)}" cy="${e.y.toFixed(1)}" r="${(6+r*90).toFixed(1)}" fill="#ffffff" fill-opacity="${(.28*(1-r)).toFixed(2)}" />`:""}
          `})}
      </g>
    `}_renderCelebration(t,e,r){let i=this._celebration;if(!i)return d``;let o=Date.now()-i.start,n=pe(o).toFixed(2),c=ue(o),l=(e+r)/2,f=o/1e3,h=Math.min(t,r-60);return d`
      <g id="celebration" opacity="${n}" pointer-events="none">
        ${i.particles.map(u=>{let p=f-u.delay;if(p<=0)return d``;let _=r-12-p*u.speed;if(_<h)return d``;let m=u.x+Math.sin(f*2+u.phase)*12;return d`
            <circle cx="${m.toFixed(1)}" cy="${_.toFixed(1)}" r="${u.r.toFixed(1)}" fill="${u.color}" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.8" stroke-width="1" />
            ${this._profile.celebrationHighlights?d`<circle cx="${(m-u.r*.3).toFixed(1)}" cy="${(_-u.r*.3).toFixed(1)}" r="${(u.r*.28).toFixed(1)}" fill="#ffffff" fill-opacity="0.9" />`:""}
          `})}
        <g transform="translate(512, ${l.toFixed(1)}) scale(${(c*2.2).toFixed(3)}) rotate(${(Math.sin(f*2.5)*4).toFixed(1)})">
          <circle r="34" fill="#fde047" fill-opacity="0.28" />
          <path d="M -22,-30 H 22 V -8 C 22,8 10,16 0,16 C -10,16 -22,8 -22,-8 Z" fill="#fbbf24" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />
          <path d="M -22,-24 H -33 C -33,-8 -28,-2 -20,0 M 22,-24 H 33 C 33,-8 28,-2 20,0" fill="none" stroke="#b45309" stroke-width="3" stroke-linecap="round" />
          <rect x="-4" y="16" width="8" height="14" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
          <rect x="-17" y="30" width="34" height="8" rx="3" fill="#fbbf24" stroke="#b45309" stroke-width="2" />
          <path d="M 0,-24 L 3.4,-15.5 L 12.5,-15 L 5.5,-9 L 7.8,0 L 0,-5 L -7.8,0 L -5.5,-9 L -12.5,-15 L -3.4,-15.5 Z" fill="#fff7ed" stroke="#b45309" stroke-width="1" stroke-linejoin="round" />
        </g>
      </g>
    `}_renderNightOverlay(t,e){let r=this._nightProgress;if(!(r>.01))return d``;let i=e+46,o=this._profile.nightGlow;return d`
      <g id="night-overlay" opacity="${r.toFixed(3)}" pointer-events="none">
        ${o?d`
              <defs>
                <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#dbeafe" stop-opacity="0.55" />
                  <stop offset="100%" stop-color="#dbeafe" stop-opacity="0" />
                </radialGradient>
                <mask id="moonMask">
                  <rect x="-30" y="-30" width="60" height="60" fill="#ffffff" />
                  <circle cx="7" cy="-4" r="13" fill="#000000" />
                </mask>
              </defs>
            `:""}
        <rect x="0" y="0" width="1024" height="${t}" fill="#0b1740" fill-opacity="0.6" />
        ${o?d`
              <ellipse cx="300" cy="${i}" rx="250" ry="200" fill="url(#moonGlow)" />
              <g transform="translate(300, ${i})">
                <circle r="26" fill="#e0f2fe" fill-opacity="0.22" />
                <circle r="15" fill="#f1f5f9" mask="url(#moonMask)" />
              </g>
            `:d`<circle cx="300" cy="${i}" r="13" fill="#f1f5f9" fill-opacity="0.9" />`}
      </g>
    `}_renderCostPill(t,e){if(!t)return d``;let r=At(t.total,V(this._hass));return d`
      <g transform="translate(512, ${e-34})" pointer-events="none">
        <rect x="-64" y="-19" width="128" height="38" rx="19" fill="#ffffff" fill-opacity="0.85" stroke="#94a3b8" stroke-width="1.5" />
        <text y="7" font-family="system-ui, sans-serif" font-size="21" font-weight="800" fill="#0f172a" text-anchor="middle">${r}</text>
      </g>
    `}_renderStatusPanel(t,e,r,i,o){let c=2*Math.PI*74,l=9,f=102,{tempFraction:h,tempColor:u,volFraction:p,volColor:_}=ee({currentTemp:t,currentVolume:e,targetBudget:r,deadlyTemp:i,boilTemp:o}),m=102,k=t>0,g=(h*c).toFixed(1),y=922,M=(p*c).toFixed(1);return d`
      <!-- Left Gauge: Water Temperature -->
      ${k?d`
            <g transform="translate(${m}, ${f})">
              <!-- Frosted glass backdrop disk -->
              <circle r="${88}" fill="rgba(255, 255, 255, 0.65)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
              <!-- Track background ring -->
              <circle r="${74}" fill="none" stroke="rgba(15, 23, 42, 0.1)" stroke-width="${l}" />
              <!-- Animated progress arc -->
              <circle
                r="${74}"
                fill="none"
                stroke="${u}"
                stroke-width="${l}"
                stroke-linecap="round"
                stroke-dasharray="${g} ${c.toFixed(1)}"
                transform="rotate(-90)"
              />
              <!-- Central temperature number -->
              <text y="16" font-family="system-ui, sans-serif" font-size="46" font-weight="900" fill="#0f172a" text-anchor="middle">${t.toFixed(1)}°</text>
            </g>
          `:""}

      <!-- Right Gauge: Consumed Water Volume -->
      <g transform="translate(${y},${f})">
        <!-- Frosted glass backdrop disk -->
        <circle r="${88}" fill="rgba(255, 255, 255, 0.65)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
        <!-- Track background ring -->
        <circle r="${74}" fill="none" stroke="rgba(15, 23, 42, 0.1)" stroke-width="${l}" />
        <!-- Animated progress arc -->
        <circle
          r="${74}"
          fill="none"
          stroke="${_}"
          stroke-width="${l}"
          stroke-linecap="round"
          stroke-dasharray="${M} ${c.toFixed(1)}"
          transform="rotate(-90)"
        />
        <!-- Central volume number -->
        <text y="16" font-family="system-ui, sans-serif" font-size="46" font-weight="900" fill="#0f172a" text-anchor="middle">${e.toFixed(1)}<tspan dx="4" font-size="26" font-weight="800">L</tspan></text>
      </g>
    `}render(){if(!this._config||!this._hass)return S``;let t=!!this._config.fullscreen,e=this._getCanvasHeight(),r=e-35,i={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:o,currentTemp:n,targetBudget:c,boilTemp:l,deadlyTemp:f,waterRatio:h,tankTop:u,tankBottom:p,waterSurfaceY:_,isDead:m,isBoiling:k,isCritical:g,isWarning:y}=ot({config:this._config,metrics:i,canvasHeight:e}),M=Math.max(0,c-o),v=this._config.theme||"freshwater",L=wt(v),a=k||g?"#ef4444":y?"#38bdf8":L.waterTop,$=k||g?"#991b1b":y?"#0284c7":L.waterBottom,b=!!(this._config.title&&this._config.title.trim().length>0),A=Number(this._config.aspect_ratio_width)||1024,B=Number(this._config.aspect_ratio_height)||600,q=Number(this._config.algae_age)||0,J=q>0?q:this._cachedHoursSinceLastShower,tt=n>=f?"#ef4444":n>=l?"#f59e0b":"var(--primary-text-color, #111827)",P=this._config.show_cost?me({volumeL:o,energyKwh:this._energyKwh,waterPricePerM3:this._config.water_price_per_m3,energyPricePerKwh:this._config.energy_price_per_kwh}):null;return S`
      <ha-card>
        ${!t&&b?S`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          <svg
            @click=${x=>this._onTankTap(x)}
            viewBox="0 0 1024 ${t?600:e}"
            preserveAspectRatio="${t?"none":"xMidYMid meet"}"
            shape-rendering="${this._profile.antialias?"auto":"optimizeSpeed"}"
            style="${t?"width: 100%; height: 100%;":`aspect-ratio: ${A} /${B};`}"
          >
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
                <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
                <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
              </linearGradient>

              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${a}" stop-opacity="${k?"0.5":"0.25"}" />
                <stop offset="100%" stop-color="${$}" stop-opacity="${k?"0.75":"0.45"}" />
              </linearGradient>

              <linearGradient id="tangBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1e3a8a" />
                <stop offset="55%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#60a5fa" />
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
                ${t?d`<rect x="0" y="0" width="1024" height="600" />`:d`<rect x="12" y="14" width="1000" height="${r-14}" rx="18" ry="18" />`}
              </clipPath>
            </defs>

            <g clip-path="url(#innerTankClip)">
              <rect
                x="${t?0:12}"
                y="${t?0:14}"
                width="${t?1024:1e3}"
                height="${t?600:r-14}"
                fill="${L.background}"
              />

              <path
                d="M ${t?0:12} ${p-60} Q 280 ${p-85}, 512 ${p-55} T ${t?1024:1012} ${p-60} L ${t?1024:1012} ${p} L ${t?0:12} ${p} Z"
                fill="${L.sandColor}"
              />

              ${this._renderThemeDecoration(v,t,this._deathProgress)}

              <g>
                ${this._snails.map((x,we)=>{let ke=x.type==="glass_left"?90:x.type==="glass_right"?-90:0,Et=v==="saltwater"?we%2===0?3.5:4.2:1.8;return d`
                    <g transform="translate(${x.x}, ${x.y}) rotate(${m?0:ke}) scale(${x.dir*Et},${Et})">
                      <circle cx="-3" cy="-4" r="5.5" fill="${x.color}" />
                      <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
                      ${m?"":d`
                            <ellipse cx="2" cy="-1.5" rx="5" ry="2.2" fill="#d97706" />
                            <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="#d97706" stroke-width="0.8" />
                            <circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />
                          `}
                    </g>
                  `})}
              </g>

              ${h>0?d`
                    <g>
                      <rect
                        x="${t?0:12}"
                        y="${_-5}"
                        width="${t?1024:1e3}"
                        height="${p-_+5}"
                        fill="url(#waterGrad)"
                      />
                      ${this._renderWaterSurface(t?0:12,t?1024:1012,_)}
                    </g>
                  `:""}

              ${h>0&&!m?d`
                    <g>
                      ${this._bubbles.map(x=>d`
                          <circle cx="${x.x}" cy="${x.y}" r="${x.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
                        `)}
                    </g>
                  `:""}

              ${h>0&&!m?this._renderFlowBubbles():""}
              ${this._renderFood()}

              ${k&&h>0?d`
                    <g>
                      ${this._boilingBubbles.map(x=>d`
                          <circle cx="${x.x}" cy="${x.y}" r="${x.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
                        `)}
                    </g>
                  `:""}

              <g>
                ${(this._fishes||[]).map(x=>d`
                    <g transform="translate(${x.x},${x.y})">
                      ${this._renderFishShape(x,v,m)}
                    </g>
                  `)}
              </g>

              ${v==="freshwater"?this._renderAncistrus(m):""}
              ${v==="saltwater"?this._renderShrimp(m):""}
              ${v==="saltwater"?this._renderCrab(m):""}
              ${this._renderAlgae(J,t)}
              ${this._renderRipples()}

              <!-- Modern Frosted Glass HUD Gauges -->
              ${t?this._renderStatusPanel(n,o,c,f,l):""}
              ${t&&this._config.cost_in_fullscreen?this._renderCostPill(P,600):""}

              ${this._renderNightOverlay(t?600:e,u)}
              ${this._renderCelebration(_,u,p)}
            </g>

            ${t?"":d`
                  <rect x="12" y="14" width="1000" height="${r-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
                  <rect x="4" y="${r}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
                `}
          </svg>
        </div>

        ${t?"":S`
              <div class="metrics-grid">
                <div class="metric-box">
                  <div class="metric-value">${o.toFixed(1)} <span class="metric-unit">L</span></div>
                  <div class="metric-label">${this._t("label_consumed")}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-value">${M.toFixed(1)} <span class="metric-unit">L</span></div>
                  <div class="metric-label">${this._t("label_remaining")}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-value">${c} <span class="metric-unit">L</span></div>
                  <div class="metric-label">${this._t("label_target")}</div>
                </div>
                ${n>0?S`
                      <div class="metric-box">
                        <div
                          class="metric-value"
                          style="color: ${tt};"
                        >
                          ${n.toFixed(1)} <span class="metric-unit">°C</span>
                        </div>
                        <div class="metric-label">${this._t("label_temperature")}</div>
                      </div>
                    `:""}
                ${P?S`
                      <div class="metric-box">
                        <div class="metric-value">${At(P.total,V(this._hass))}</div>
                        <div class="metric-label">${this._t("label_cost")}</div>
                      </div>
                    `:""}
              </div>
            `}
      </ha-card>
    `}getCardSize(){return 6}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",St);console.info(`%c SHOWER-AQUARIUM-CARD %c v${xt} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");window.customCards=window.customCards||[];var be=window.customCards.findIndex(s=>s.type==="shower-aquarium-card"),$e={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${xt})`};be!==-1?window.customCards[be]=$e:window.customCards.push($e);
