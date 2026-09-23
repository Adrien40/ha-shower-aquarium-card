var z=globalThis,q=z.ShadowRoot&&(z.ShadyCSS===void 0||z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol(),xt=new WeakMap,F=class{constructor(t,i,e){if(this._$cssResult$=!0,e!==tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o,i=this.t;if(q&&t===void 0){let e=i!==void 0&&i.length===1;e&&(t=xt.get(i)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&xt.set(i,t))}return t}toString(){return this.cssText}},vt=s=>new F(typeof s=="string"?s:s+"",void 0,tt),et=(s,...t)=>{let i=s.length===1?s[0]:t.reduce((e,r,o)=>e+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[o+1],s[0]);return new F(i,s,tt)},wt=(s,t)=>{if(q)s.adoptedStyleSheets=t.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(let i of t){let e=document.createElement("style"),r=z.litNonce;r!==void 0&&e.setAttribute("nonce",r),e.textContent=i.cssText,s.appendChild(e)}},it=q?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let i="";for(let e of t.cssRules)i+=e.cssText;return vt(i)})(s):s;var{is:Kt,defineProperty:Jt,getOwnPropertyDescriptor:te,getOwnPropertyNames:ee,getOwnPropertySymbols:ie,getPrototypeOf:re}=Object,A=globalThis,kt=A.trustedTypes,se=kt?kt.emptyScript:"",oe=A.reactiveElementPolyfillSupport,N=(s,t)=>s,rt={toAttribute(s,t){switch(t){case Boolean:s=s?se:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let i=s;switch(t){case Boolean:i=s!==null;break;case Number:i=s===null?null:Number(s);break;case Object:case Array:try{i=JSON.parse(s)}catch{i=null}}return i}},Ct=(s,t)=>!Kt(s,t),Mt={attribute:!0,type:String,converter:rt,reflect:!1,useDefault:!1,hasChanged:Ct};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),A.litPropertyMetadata??(A.litPropertyMetadata=new WeakMap);var k=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=Mt){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){let e=Symbol(),r=this.getPropertyDescriptor(t,e,i);r!==void 0&&Jt(this.prototype,t,r)}}static getPropertyDescriptor(t,i,e){let{get:r,set:o}=te(this.prototype,t)??{get(){return this[i]},set(a){this[i]=a}};return{get:r,set(a){let h=r?.call(this);o?.call(this,a),this.requestUpdate(t,h,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Mt}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let t=re(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let i=this.properties,e=[...ee(i),...ie(i)];for(let r of e)this.createProperty(r,i[r])}let t=this[Symbol.metadata];if(t!==null){let i=litPropertyMetadata.get(t);if(i!==void 0)for(let[e,r]of i)this.elementProperties.set(e,r)}this._$Eh=new Map;for(let[i,e]of this.elementProperties){let r=this._$Eu(i,e);r!==void 0&&this._$Eh.set(r,i)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let i=[];if(Array.isArray(t)){let e=new Set(t.flat(1/0).reverse());for(let r of e)i.unshift(it(r))}else t!==void 0&&i.push(it(t));return i}static _$Eu(t,i){let e=i.attribute;return e===!1?void 0:typeof e=="string"?e:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,i=this.constructor.elementProperties;for(let e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this._$AK(t,e)}_$ET(t,i){let e=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,e);if(r!==void 0&&e.reflect===!0){let o=(e.converter?.toAttribute!==void 0?e.converter:rt).toAttribute(i,e.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,i){let e=this.constructor,r=e._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let o=e.getPropertyOptions(r),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:rt;this._$Em=r;let h=a.fromAttribute(i,o.type);this[r]=h??this._$Ej?.get(r)??h,this._$Em=null}}requestUpdate(t,i,e,r=!1,o){if(t!==void 0){let a=this.constructor;if(r===!1&&(o=this[t]),e??(e=a.getPropertyOptions(t)),!((e.hasChanged??Ct)(o,i)||e.useDefault&&e.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,e))))return;this.C(t,i,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,i,{useDefault:e,reflect:r,wrapped:o},a){e&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??i??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||e||(i=void 0),this._$AL.set(t,i)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(i){Promise.reject(i)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[r,o]of e){let{wrapped:a}=o,h=this[r];a!==!0||this._$AL.has(r)||h===void 0||this.C(r,void 0,o,h)}}let t=!1,i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(i)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(i)}willUpdate(t){}_$AE(t){this._$EO?.forEach(i=>i.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(i=>this._$ET(i,this[i]))),this._$EM()}updated(t){}firstUpdated(t){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[N("elementProperties")]=new Map,k[N("finalized")]=new Map,oe?.({ReactiveElement:k}),(A.reactiveElementVersions??(A.reactiveElementVersions=[])).push("2.1.2");var O=globalThis,At=s=>s,G=O.trustedTypes,St=G?G.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ht="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Qt="?"+S,ae=`<${Qt}>`,P=document,B=()=>P.createComment(""),Z=s=>s===null||typeof s!="object"&&typeof s!="function",dt=Array.isArray,ne=s=>dt(s)||typeof s?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,Lt=/>/g,L=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Tt=/'/g,Pt=/"/g,Ft=/^(?:script|style|textarea|title)$/i,ht=s=>(t,...i)=>({_$litType$:s,strings:t,values:i}),M=ht(1),f=ht(2),xe=ht(3),R=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Rt=new WeakMap,T=P.createTreeWalker(P,129);function Nt(s,t){if(!dt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(t):t}var le=(s,t)=>{let i=s.length-1,e=[],r,o=t===2?"<svg>":t===3?"<math>":"",a=U;for(let h=0;h<i;h++){let n=s[h],c,p,d=-1,m=0;for(;m<n.length&&(a.lastIndex=m,p=a.exec(n),p!==null);)m=a.lastIndex,a===U?p[1]==="!--"?a=Et:p[1]!==void 0?a=Lt:p[2]!==void 0?(Ft.test(p[2])&&(r=RegExp("</"+p[2],"g")),a=L):p[3]!==void 0&&(a=L):a===L?p[0]===">"?(a=r??U,d=-1):p[1]===void 0?d=-2:(d=a.lastIndex-p[2].length,c=p[1],a=p[3]===void 0?L:p[3]==='"'?Pt:Tt):a===Pt||a===Tt?a=L:a===Et||a===Lt?a=U:(a=L,r=void 0);let u=a===L&&s[h+1].startsWith("/>")?" ":"";o+=a===U?n+ae:d>=0?(e.push(c),n.slice(0,d)+Ht+n.slice(d)+S+u):n+S+(d===-2?h:u)}return[Nt(s,o+(s[i]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),e]},D=class s{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let o=0,a=0,h=t.length-1,n=this.parts,[c,p]=le(t,i);if(this.el=s.createElement(c,e),T.currentNode=this.el.content,i===2||i===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=T.nextNode())!==null&&n.length<h;){if(r.nodeType===1){if(r.hasAttributes())for(let d of r.getAttributeNames())if(d.endsWith(Ht)){let m=p[a++],u=r.getAttribute(d).split(S),y=/([.?@])?(.*)/.exec(m);n.push({type:1,index:o,name:y[2],strings:u,ctor:y[1]==="."?at:y[1]==="?"?nt:y[1]==="@"?lt:Q}),r.removeAttribute(d)}else d.startsWith(S)&&(n.push({type:6,index:o}),r.removeAttribute(d));if(Ft.test(r.tagName)){let d=r.textContent.split(S),m=d.length-1;if(m>0){r.textContent=G?G.emptyScript:"";for(let u=0;u<m;u++)r.append(d[u],B()),T.nextNode(),n.push({type:2,index:++o});r.append(d[m],B())}}}else if(r.nodeType===8)if(r.data===Qt)n.push({type:2,index:o});else{let d=-1;for(;(d=r.data.indexOf(S,d+1))!==-1;)n.push({type:7,index:o}),d+=S.length-1}o++}}static createElement(t,i){let e=P.createElement("template");return e.innerHTML=t,e}};function H(s,t,i=s,e){if(t===R)return t;let r=e!==void 0?i._$Co?.[e]:i._$Cl,o=Z(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(s),r._$AT(s,i,e)),e!==void 0?(i._$Co??(i._$Co=[]))[e]=r:i._$Cl=r),r!==void 0&&(t=H(s,r._$AS(s,t.values),r,e)),t}var ot=class{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:i},parts:e}=this._$AD,r=(t?.creationScope??P).importNode(i,!0);T.currentNode=r;let o=T.nextNode(),a=0,h=0,n=e[0];for(;n!==void 0;){if(a===n.index){let c;n.type===2?c=new V(o,o.nextSibling,this,t):n.type===1?c=new n.ctor(o,n.name,n.strings,this,t):n.type===6&&(c=new ct(o,this,t)),this._$AV.push(c),n=e[++h]}a!==n?.index&&(o=T.nextNode(),a++)}return T.currentNode=P,r}p(t){let i=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(t,e,i),i+=e.strings.length-2):e._$AI(t[i])),i++}},V=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,e,r){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=e,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,i=this._$AM;return i!==void 0&&t?.nodeType===11&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=H(this,t,i),Z(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==R&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ne(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&Z(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){let{values:i,_$litType$:e}=t,r=typeof e=="number"?this._$AC(t):(e.el===void 0&&(e.el=D.createElement(Nt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===r)this._$AH.p(i);else{let o=new ot(r,this),a=o.u(this.options);o.p(i),this.T(a),this._$AH=o}}_$AC(t){let i=Rt.get(t.strings);return i===void 0&&Rt.set(t.strings,i=new D(t)),i}k(t){dt(this._$AH)||(this._$AH=[],this._$AR());let i=this._$AH,e,r=0;for(let o of t)r===i.length?i.push(e=new s(this.O(B()),this.O(B()),this,this.options)):e=i[r],e._$AI(o),r++;r<i.length&&(this._$AR(e&&e._$AB.nextSibling,r),i.length=r)}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){let e=At(t).nextSibling;At(t).remove(),t=e}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,e,r,o){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=i,this._$AM=r,this.options=o,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=v}_$AI(t,i=this,e,r){let o=this.strings,a=!1;if(o===void 0)t=H(this,t,i,0),a=!Z(t)||t!==this._$AH&&t!==R,a&&(this._$AH=t);else{let h=t,n,c;for(t=o[0],n=0;n<o.length-1;n++)c=H(this,h[e+n],i,n),c===R&&(c=this._$AH[n]),a||(a=!Z(c)||c!==this._$AH[n]),c===v?t=v:t!==v&&(t+=(c??"")+o[n+1]),this._$AH[n]=c}a&&!r&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},at=class extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},nt=class extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},lt=class extends Q{constructor(t,i,e,r,o){super(t,i,e,r,o),this.type=5}_$AI(t,i=this){if((t=H(this,t,i,0)??v)===R)return;let e=this._$AH,r=t===v&&e!==v||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,o=t!==v&&(e===v||r);r&&this.element.removeEventListener(this.name,this,e),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ct=class{constructor(t,i,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}};var ce=O.litHtmlPolyfillSupport;ce?.(D,V),(O.litHtmlVersions??(O.litHtmlVersions=[])).push("3.3.3");var Ut=(s,t,i)=>{let e=i?.renderBefore??t,r=e._$litPart$;if(r===void 0){let o=i?.renderBefore??null;e._$litPart$=r=new V(t.insertBefore(B(),o),o,void 0,i??{})}return r._$AI(s),r};var j=globalThis,w=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var i;let t=super.createRenderRoot();return(i=this.renderOptions).renderBefore??(i.renderBefore=t.firstChild),t}update(t){let i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ut(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};w._$litElement$=!0,w.finalized=!0,j.litElementHydrateSupport?.({LitElement:w});var de=j.litElementPolyfillSupport;de?.({LitElement:w});(j.litElementVersions??(j.litElementVersions=[])).push("4.2.2");var ft="0.4.0";var Ot=et`
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
`;var Bt={label_consumed:"Consomm\xE9",label_remaining:"Restant",label_target:"Objectif",label_temperature:"Temp\xE9rature",field_entity:"Entit\xE9 de volume de douche",field_temp_entity:"Entit\xE9 temp\xE9rature de l'eau (optionnel)",field_title:"Titre de la carte (laisser vide pour masquer)",theme_freshwater:"Eau douce (Tropical)",theme_saltwater:"Eau de mer (R\xE9cif)",theme_coldwater:"Eau froide (Poissons rouges)",field_theme:"Biotope de l'aquarium",field_fish_count:"Nombre de poissons",field_target_budget_entity:"Entit\xE9 d'objectif (volume d'eau max)",field_target_budget:"Objectif de la douche (L)",field_survival_volume:"Volume de survie des animaux",field_temp_boil:"Seuil d'\xE9bullition (\xB0C)",field_temp_deadly:"Seuil mortel de temp\xE9rature (\xB0C)",field_algae_enabled:"Activer l'accumulation d'algues",field_algae_delay:"D\xE9lai d'apparition des algues (heures)",field_algae_age:"\xC2ge des algues",field_fish_speed:"Vitesse des poissons",field_fullscreen:"Mode plein \xE9cran",helper_fullscreen:"Tablette, Nest Hub...",field_aspect_ratio_width:"Ratio - Largeur (ex : 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Hauteur (ex : 600, 9, 3)",label_cost:"Co\xFBt",field_night_entity:"Entit\xE9 du mode nuit (optionnel)",helper_night_entity:"sun.sun (nuit = sous l'horizon), un capteur binaire / bool\xE9en (on = nuit) ou un capteur de luminosit\xE9",field_night_lux:"Seuil de luminosit\xE9 nuit (lx)",field_show_cost:"Afficher le co\xFBt estim\xE9 de la douche",helper_show_cost:"Eau + \xE9nergie de chauffe, estim\xE9s d'apr\xE8s le volume et la temp\xE9rature",field_water_price:"Prix de l'eau (\u20AC/m\xB3)",field_energy_price:"Prix de l'\xE9nergie (\u20AC/kWh)",field_cold_water_temp:"Temp\xE9rature de l'eau froide (\xB0C)"};var Zt={label_consumed:"Consumed",label_remaining:"Remaining",label_target:"Target",label_temperature:"Temperature",field_entity:"Shower volume entity",field_temp_entity:"Water temperature entity (optional)",field_title:"Card title (leave empty to hide)",theme_freshwater:"Freshwater (Tropical)",theme_saltwater:"Saltwater (Reef)",theme_coldwater:"Coldwater (Goldfish)",field_theme:"Aquarium biotope",field_fish_count:"Number of fishes",field_target_budget_entity:"Target entity (max water volume)",field_target_budget:"Shower target budget (L)",field_survival_volume:"Survival volume for animals",field_temp_boil:"Boiling temperature threshold (\xB0C)",field_temp_deadly:"Deadly temperature threshold (\xB0C)",field_algae_enabled:"Enable dirty algae accumulation",field_algae_delay:"Algae accumulation delay (hours)",field_algae_age:"Algae age",field_fish_speed:"Fish speed",field_fullscreen:"Fullscreen mode",helper_fullscreen:"Tablet, Nest Hub...",field_aspect_ratio_width:"Ratio - Width (e.g. 1024, 16, 4)",field_aspect_ratio_height:"Ratio - Height (e.g. 600, 9, 3)",label_cost:"Cost",field_night_entity:"Night mode entity (optional)",helper_night_entity:"sun.sun (night = below horizon), a binary sensor / boolean (on = night) or an illuminance sensor",field_night_lux:"Night illuminance threshold (lx)",field_show_cost:"Show estimated shower cost",helper_show_cost:"Water + heating energy, estimated from volume and temperature",field_water_price:"Water price (\u20AC/m\xB3)",field_energy_price:"Energy price (\u20AC/kWh)",field_cold_water_temp:"Cold water temperature (\xB0C)"};var pt={fr:Bt,en:Zt};function Y(s){return(s?.locale?.language||s?.language||"en").substring(0,2).toLowerCase()}function pe(s){return pt[s]||pt.en}function I(s,t){return pe(s)[t]||pt.en[t]||t}var ue=[{name:"entity",required:!0,selector:{entity:{domain:"sensor"}}},{name:"temperature_entity",selector:{entity:{domain:"sensor"}}},{name:"title",selector:{text:{}}},{name:"theme",default:"freshwater",selector:{select:{options:[{value:"freshwater",label:"Eau douce (Tropical)"},{value:"saltwater",label:"Eau de mer (R\xE9cif)"},{value:"coldwater",label:"Eau froide (Poissons rouges)"}]}}},{name:"fish_count",default:4,selector:{number:{min:1,max:10,mode:"slider"}}},{name:"target_budget_entity",selector:{entity:{domain:["input_number","number","sensor"]}}},{name:"target_budget",default:50,selector:{number:{min:1,max:500,unit_of_measurement:"L",mode:"box"}}},{name:"survival_volume",default:10,selector:{number:{min:1,max:100,unit_of_measurement:"L",mode:"box"}}},{name:"temp_boiling_threshold",default:40,selector:{number:{min:25,max:60,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"temp_deadly_threshold",default:45,selector:{number:{min:30,max:70,unit_of_measurement:"\xB0C",mode:"box"}}},{name:"algae_enabled",default:!0,selector:{boolean:{}}},{name:"algae_delay_hours",default:12,selector:{number:{min:1,max:48,unit_of_measurement:"h",mode:"box"}}},{name:"algae_age",default:0,selector:{number:{min:0,max:48,unit_of_measurement:"h",mode:"slider"}}},{name:"fish_speed_multiplier",default:1.2,selector:{number:{min:.2,max:3,step:.1,mode:"slider"}}},{name:"fullscreen",default:!1,selector:{boolean:{}}},{name:"aspect_ratio_width",default:1024,selector:{number:{min:1,max:4e3,mode:"box"}}},{name:"aspect_ratio_height",default:600,selector:{number:{min:1,max:4e3,mode:"box"}}}],me={entity:"field_entity",temperature_entity:"field_temp_entity",title:"field_title",theme:"field_theme",fish_count:"field_fish_count",target_budget_entity:"field_target_budget_entity",target_budget:"field_target_budget",survival_volume:"field_survival_volume",temp_boiling_threshold:"field_temp_boil",temp_deadly_threshold:"field_temp_deadly",algae_enabled:"field_algae_enabled",algae_delay_hours:"field_algae_delay",algae_age:"field_algae_age",fish_speed_multiplier:"field_fish_speed",fullscreen:"field_fullscreen",aspect_ratio_width:"field_aspect_ratio_width",aspect_ratio_height:"field_aspect_ratio_height"},ut=class extends w{static get properties(){return{hass:{type:Object},_config:{type:Object}}}setConfig(t){this._config={...t}}_lang(){return Y(this.hass)}_computeLabel(t){let i=me[t.name];return i?I(this._lang(),i):t.name}_computeHelper(t){return t.name==="fullscreen"?I(this._lang(),"helper_fullscreen"):""}_valueChanged(t){if(!this._config||!this.hass)return;let i={...t.detail.value};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?M``:M`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ue}
        .computeLabel=${t=>this._computeLabel(t)}
        .computeHelper=${t=>this._computeHelper(t)}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}};customElements.get("shower-aquarium-card-editor")||customElements.define("shower-aquarium-card-editor",ut);var Dt={freshwater:{waterTop:"#38bdf8",waterBottom:"#0284c7",sandColor:"#fde68a",background:"#f0fdfa",palette:["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6","#84cc16"]},saltwater:{waterTop:"#06b6d4",waterBottom:"#0e7490",sandColor:"#fef08a",background:"#ecfeff",palette:["#f97316","#eab308","#3b82f6","#a855f7","#ec4899","#14b8a6","#06b6d4","#f43f5e","#84cc16","#6366f1"]},coldwater:{waterTop:"#67e8f9",waterBottom:"#0891b2",sandColor:"#cbd5e1",background:"#f8fafc",palette:["#ea580c","#f97316","#fb923c","#fdba74","#fbbf24","#d97706","#b45309","#78350f","#ffffff","#94a3b8"]}};function mt(s){return Dt[s]||Dt.freshwater}function Vt(s){let t=Number(s?.aspect_ratio_width)||1024,i=Number(s?.aspect_ratio_height)||600;return Math.max(400,Math.min(2048,Math.round(1024*(i/t))))}function jt(s,t){let i={consumedVolume:0,hoursSinceLastShower:0,temperature:0,targetBudget:Number(t?.target_budget)||50,survivalVolume:Number(t?.survival_volume)||10};if(!s||!t)return i;if(t.entity&&s.states[t.entity]){let e=s.states[t.entity],r=parseFloat(e.state);if(i.consumedVolume=isNaN(r)?0:Math.max(0,r),e.last_changed){let o=new Date(e.last_changed).getTime();i.hoursSinceLastShower=Math.max(0,(Date.now()-o)/(1e3*60*60))}}if(t.temperature_entity&&s.states[t.temperature_entity]){let e=parseFloat(s.states[t.temperature_entity].state);i.temperature=isNaN(e)?0:e}if(t.target_budget_entity&&s.states[t.target_budget_entity]){let e=parseFloat(s.states[t.target_budget_entity].state);isNaN(e)||(i.targetBudget=e)}return i}function _e(s,t){return t==="saltwater"?s<2?0:s===2?1:s===3?3:2:t==="coldwater"?s%3:s%4}var X=[1.35,1.65,1.2,1.85,1.45,1.6,1.25,1.75,1.3,1.5];function _t(s,t){let i=mt(t),e=Math.min(10,Math.max(1,Number(s)||4));return Array.from({length:e},(r,o)=>{let a=_e(o,t),h=t==="saltwater"&&a===0,n=1.38-(X[o%X.length]-1.2)*.2,c=Math.random()*50-25,p=Math.random()*50-25;return{species:a,color:i.palette[o%i.palette.length],scale:X[o%X.length],phase:Math.random()*6.28,x:h?190+o*140:120+o*760/Math.max(1,e-1)+c,y:h?470:160+o%3*90+p,vx:n*(.8+Math.random()*.4),vy:.45*(Math.random()<.5?1:-1)*(.7+Math.random()*.5),dir:Math.random()<.5?1:-1,deathProgress:0}})}function gt({config:s,metrics:t,canvasHeight:i}){let e=t.targetBudget,r=t.survivalVolume,o=e+r,a=t.consumedVolume,h=t.temperature,n=Number(s?.temp_boiling_threshold)||40,c=Number(s?.temp_deadly_threshold)||45,p=Math.max(0,o-a),d=o>0?Math.max(0,Math.min(1,p/o)):0,m=!!s?.fullscreen,u=m?0:15,y=m?600:i-35,g=y-u,l=y-d*g,$=h>=c&&h>0,_=p<=0,b=$||_,E=h>=n&&h>0,C=a>e&&!b,K=a>e*.7&&!C&&!b,J=Number(s?.fish_speed_multiplier)||1.2,W=((C||E)&&!b?2:1)*J;return{targetBudget:e,survivalVolume:r,totalVolume:o,currentVolume:a,currentTemp:h,boilTemp:n,deadlyTemp:c,remainingVolumeInTank:p,waterRatio:d,tankTop:u,tankBottom:y,tankHeight:g,waterSurfaceY:l,isHeatDead:$,isWaterDead:_,isDead:b,isBoiling:E,isCritical:C,isWarning:K,speedMultiplier:W}}function It({currentTemp:s,currentVolume:t,targetBudget:i,deadlyTemp:e,boilTemp:r}){let o=Math.max(0,Math.min(1,s/45)),a=s>=e?"#ef4444":s>=r?"#f97316":s>=38?"#f59e0b":"#0284c7",h=Math.max(0,Math.min(1,t/Math.max(1,i))),n=t>i?"#ef4444":t>i*.7?"#f59e0b":"#0284c7";return{tempFraction:o,tempColor:a,volFraction:h,volColor:n}}var yt=class extends w{static get properties(){return{_hass:{type:Object},_config:{type:Object},_fishes:{type:Array},_snails:{type:Array},_ancistrus:{type:Object},_shrimp:{type:Object},_crab:{type:Object},_bubbles:{type:Array},_boilingBubbles:{type:Array}}}static async getConfigElement(){return document.createElement("shower-aquarium-card-editor")}static getStubConfig(t,i){let e=i.find(o=>o.includes("shower")||o.includes("hydrao"))||i[0]||"",r=i.find(o=>o.includes("temperature")&&(o.includes("shower")||o.includes("hydrao")))||"";return{entity:e,temperature_entity:r,title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:10,temp_boiling_threshold:40,temp_deadly_threshold:45,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1}}constructor(){super(),this._animationFrameId=null,this._lastTimestamp=0,this._animTime=0,this._cachedConsumedVolume=0,this._cachedTemperature=0,this._cachedTargetBudget=50,this._cachedSurvivalVolume=10,this._cachedHoursSinceLastShower=0,this._fishes=_t(4,"freshwater"),this._snails=[{x:340,y:590,vx:.08,vy:0,dir:1,type:"bottom",color:"#854d0e"},{x:18,y:340,vx:0,vy:.07,dir:1,type:"glass_left",color:"#a16207"},{x:1006,y:220,vx:0,vy:-.06,dir:-1,type:"glass_right",color:"#78350f"}],this._ancistrus={x:70,y:340,targetY:340,state:"idle",idleUntil:0,deathProgress:0},this._shrimp={x:840,y:550,targetX:840,state:"idle",idleUntil:0,dir:-1,deathProgress:0},this._crab={x:350,y:555,targetX:350,state:"idle",idleUntil:0,dir:1,deathProgress:0},this._bubbles=[{x:180,y:560,vy:.9,r:4.5},{x:210,y:580,vy:1.1,r:3.5},{x:512,y:570,vy:.8,r:5},{x:820,y:580,vy:1,r:4},{x:845,y:550,vy:1.2,r:3}],this._boilingBubbles=Array.from({length:24},()=>({x:10+Math.random()*1004,y:30+Math.random()*540,vy:2.5+Math.random()*3.5,vx:(Math.random()-.5)*1.5,r:4+Math.random()*8}))}static get styles(){return Ot}_t(t){return I(Y(this._hass),t)}_getCanvasHeight(){return Vt(this._config)}_updateCachedMetrics(){if(!this._hass||!this._config)return;let t=jt(this._hass,this._config);this._cachedConsumedVolume=t.consumedVolume,this._cachedHoursSinceLastShower=t.hoursSinceLastShower,this._cachedTemperature=t.temperature,this._cachedTargetBudget=t.targetBudget,this._cachedSurvivalVolume=t.survivalVolume}setConfig(t){if(!t.entity)throw new Error("Please define a valid entity.");this._config={title:"",theme:"freshwater",aspect_ratio_width:1024,aspect_ratio_height:600,fish_count:4,target_budget:50,survival_volume:10,temp_boiling_threshold:40,temp_deadly_threshold:45,algae_enabled:!0,algae_delay_hours:12,algae_age:0,fish_speed_multiplier:1.2,fullscreen:!1,...t},this._config.fullscreen?this.setAttribute("fullscreen",""):this.removeAttribute("fullscreen");let i=this._config.theme||"freshwater",e=Number(this._config.fish_count)||4;this._fishes=_t(e,i),this._updateCachedMetrics(),this.requestUpdate()}set hass(t){this._hass=t,this._updateCachedMetrics()}connectedCallback(){super.connectedCallback(),this._startAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._stopAnimation()}_startAnimation(){if(!this._animationFrameId){let t=i=>{this._updatePhysics(i),this._animationFrameId=requestAnimationFrame(t)};this._animationFrameId=requestAnimationFrame(t)}}_stopAnimation(){this._animationFrameId&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null)}_updatePhysics(t){this._lastTimestamp||(this._lastTimestamp=t);let i=t-this._lastTimestamp,e=Math.min(i/16.66,2);this._lastTimestamp=t,this._animTime=t*.0035;let r={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{tankTop:o,tankBottom:a,waterSurfaceY:h,waterRatio:n,isDead:c,isBoiling:p,speedMultiplier:d}=gt({config:this._config,metrics:r,canvasHeight:this._getCanvasHeight()}),m=Number(this._config.fish_speed_multiplier)||1.2,u=(i||16.66)/4500,y=this._config.theme||"freshwater",g=!1;if(this._fishes&&this._fishes.length>0&&this._fishes.forEach(l=>{if(c){l.deathProgress=Math.min(1,(l.deathProgress||0)+u),l.y=Math.min(a-30,l.y+1.2*e),g=!0;return}l.deathProgress=0;let $=y==="saltwater"&&l.species===0,_=$?Math.max(o+45,h+35,a-160):Math.max(o+45,h+35),b=a-45,E=$?160:110,C=$?380:910;l.x+=l.vx*l.dir*d*e,l.y+=l.vy*d*e,l.x<E?(l.x=E,l.dir=1):l.x>C&&(l.x=C,l.dir=-1),l.y<_?(l.y=_,l.vy=Math.abs(l.vy)):l.y>b&&(l.y=b,l.vy=-Math.abs(l.vy)),g=!0}),this._snails&&this._snails.length>0&&this._snails.forEach(l=>{if(c){l.y=Math.min(a-10,l.y+1.5*e),g=!0;return}if(l.type==="bottom")l.x+=l.vx*l.dir*e,l.x<100?(l.x=100,l.dir=1):l.x>920&&(l.x=920,l.dir=-1);else if(l.type==="glass_left"||l.type==="glass_right"){let $=Math.max(o+35,h+25);l.y+=l.vy*e,l.y<$?(l.y=$,l.vy=Math.abs(l.vy)):l.y>a-25&&(l.y=a-25,l.vy=-Math.abs(l.vy))}g=!0}),this._ancistrus)if(c)this._ancistrus.deathProgress=Math.min(1,(this._ancistrus.deathProgress||0)+u),this._ancistrus.y=Math.min(a-35,this._ancistrus.y+1.2*e),g=!0;else{this._ancistrus.deathProgress=0;let l=Math.max(o+65,h+70),$=a-110;if(this._ancistrus.idleUntil||(this._ancistrus.idleUntil=t+2500+Math.random()*4e3),this._ancistrus.state==="moving"){let _=this._ancistrus.targetY-this._ancistrus.y,b=Math.sign(_)*Math.min(Math.abs(_),.7*m*e);this._ancistrus.y+=b,Math.abs(this._ancistrus.targetY-this._ancistrus.y)<1.5&&(this._ancistrus.state="idle",this._ancistrus.idleUntil=t+3e3+Math.random()*4e3)}else t>=this._ancistrus.idleUntil&&(this._ancistrus.state="moving",this._ancistrus.targetY=l+Math.random()*($-l));g=!0}if(this._shrimp)if(c)this._shrimp.deathProgress=Math.min(1,(this._shrimp.deathProgress||0)+u),g=!0;else{this._shrimp.deathProgress=0,this._shrimp.y=a-25;let l=740,$=940;if(this._shrimp.idleUntil||(this._shrimp.idleUntil=t+1200+Math.random()*2e3),this._shrimp.state==="moving"){let _=this._shrimp.targetX-this._shrimp.x;this._shrimp.dir=_<0?-1:1;let b=Math.sign(_)*Math.min(Math.abs(_),.9*m*e);this._shrimp.x+=b,Math.abs(this._shrimp.targetX-this._shrimp.x)<1.5&&(this._shrimp.state="idle",this._shrimp.idleUntil=t+1500+Math.random()*2500)}else t>=this._shrimp.idleUntil&&(this._shrimp.state="moving",this._shrimp.targetX=l+Math.random()*($-l));g=!0}if(this._crab)if(c)this._crab.deathProgress=Math.min(1,(this._crab.deathProgress||0)+u),g=!0;else{this._crab.deathProgress=0,this._crab.y=a-20;let l=240,$=460;if(this._crab.idleUntil||(this._crab.idleUntil=t+2e3+Math.random()*3e3),this._crab.state==="moving"){let _=this._crab.targetX-this._crab.x;this._crab.dir=_<0?-1:1;let b=Math.sign(_)*Math.min(Math.abs(_),.7*m*e);this._crab.x+=b,Math.abs(this._crab.targetX-this._crab.x)<1.5&&(this._crab.state="idle",this._crab.idleUntil=t+2500+Math.random()*3500)}else t>=this._crab.idleUntil&&(this._crab.state="moving",this._crab.targetX=l+Math.random()*($-l));g=!0}n>0&&!c&&this._bubbles&&this._bubbles.forEach(l=>{l.y-=l.vy*e,l.y<h&&(l.y=a-15),g=!0}),p&&n>0&&this._boilingBubbles&&this._boilingBubbles.forEach(l=>{l.y-=l.vy*e,l.x+=l.vx*e,l.y<h&&(l.y=a-15,l.x=10+Math.random()*1004),g=!0}),g&&this.requestUpdate()}_renderWaterSurface(t,i,e){let a=this._animTime*1.6,h=16,n=[],c=[];for(let u=t;u<i;u+=h)n.push([u,e+Math.sin(u/90+a)*3.5]),c.push([u,e+4+Math.sin(u/90+a+.6)*3.5*.7]);n.push([i,e+Math.sin(i/90+a)*3.5]),c.push([i,e+4+Math.sin(i/90+a+.6)*3.5*.7]);let p=u=>`${u[0].toFixed(1)},${u[1].toFixed(1)}`,d=n.map(p).join(" L "),m=c.slice().reverse().map(p).join(" L ");return f`
      <path d="M ${d} L ${m} Z" fill="#ffffff" opacity="0.25" />
      <path d="M ${d}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" stroke-linecap="round" />
    `}_renderAnemoneTentacles(){let t=[{count:11,baseR:20,lenMin:60,lenMax:95,spread:160,width:5,color:"#a21caf",tip:"#f0abfc",speed:.55},{count:16,baseR:22,lenMin:50,lenMax:88,spread:190,width:6.5,color:"#c026d3",tip:"#f5d0fe",speed:.68}],i=[];return t.forEach((e,r)=>{for(let o=0;o<e.count;o++){let a=o/(e.count-1),h=-90-e.spread/2+a*e.spread,n=e.lenMin+(e.lenMax-e.lenMin)*(.5+.5*Math.sin(a*Math.PI)),c=r*10+o*.7,p=Math.sin(this._animTime*e.speed+c)*9,d=h*Math.PI/180,m=Math.cos(d)*e.baseR,u=Math.sin(d)*e.baseR,y=o*37%17-8,g=h+90+p;i.push(f`
          <g transform="translate(${m.toFixed(1)}, ${u.toFixed(1)}) rotate(${g.toFixed(1)})">
            <path d="M 0,0 Q ${y.toFixed(1)},${(-n*.55).toFixed(1)} 0,${(-n).toFixed(1)}" stroke="${e.color}" stroke-width="${e.width}" stroke-linecap="round" fill="none" opacity="0.9" />
            <circle cx="0" cy="${(-n).toFixed(1)}" r="${(e.width*.9).toFixed(1)}" fill="${e.tip}" />
          </g>
        `)}}),i}_renderThemeDecoration(t,i){let e=i?600:this._getCanvasHeight()-35;return t==="saltwater"?f`
        <g id="reef-decor">
          <path d="M 60 ${e} Q 40 ${e-165}, 95 ${e-225} Q 120 ${e-275}, 85 ${e-335} Q 135 ${e-265}, 120 ${e-195} Q 150 ${e-135}, 115 ${e} Z" fill="#f43f5e" opacity="0.95" />
          <path d="M 115 ${e} Q 150 ${e-155}, 190 ${e-205} Q 215 ${e-245}, 190 ${e-295} Q 230 ${e-235}, 205 ${e-155} Q 180 ${e-105}, 155 ${e} Z" fill="#fb7185" opacity="0.9" />
          <g transform="translate(830, ${e})">
            <path d="M -80 0 Q -110 -90, -85 -160 Q -55 -90, -55 0 Z" fill="#c084fc" opacity="0.85" />
            <path d="M -55 0 Q -70 -120, -35 -185 Q -15 -120, -25 0 Z" fill="#a855f7" opacity="0.9" />
            <path d="M -25 0 Q -20 -135, 10 -205 Q 30 -130, 0 0 Z" fill="#d8b4fe" opacity="0.85" />
            <circle cx="0" cy="-20" r="60" fill="#7e22ce" opacity="0.75" />
          </g>
          <g transform="translate(190, ${e-70})">
            <path d="M 0,-42 C 6,-42 12,-18 16,-12 C 22,-8 44,-10 44,-4 C 44,2 26,10 22,16 C 18,22 28,42 22,46 C 16,50 8,30 0,26 C -8,30 -16,50 -22,46 C -28,42 -18,22 -22,16 C -26,10 -44,2 -44,-4 C -44,-10 -22,-8 -16,-12 C -12,-18 -6,-42 0,-42 Z" fill="#1d4ed8" stroke="#1e40af" stroke-width="2" />
            <path d="M 0,-34 L 0,18 M -35,-4 L 35,-4 M -18,36 L 18,36" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" opacity="0.75" />
            <circle cx="0" cy="0" r="5" fill="#60a5fa" />
          </g>
          <g id="live-rock" transform="translate(750, ${e})">
            <path d="M -25.5,-18.0 Q -25.5,-18.0 -30.2,-12.4 Q -34.9,-6.8 -43.4,-1.7 Q -52.0,3.3 -60.8,-1.6 Q -69.6,-6.4 -74.3,-12.2 Q -79.0,-18.0 -75.4,-24.5 Z" fill="#8b6a9c" />
            <path d="M 60.3,-38.0 Q 60.3,-38.0 57.1,-25.7 Q 53.9,-13.4 42.9,-0.9 Q 31.9,11.5 11.6,8.1 Q -8.7,4.7 -24.7,0.1 Q -40.8,-4.6 -51.6,-14.8 Z" fill="#6d5280" />
          </g>
          <g id="live-rock-2" transform="translate(420, ${e})">
            <path d="M 41.8,-26.0 Q 41.8,-26.0 37.1,-16.4 Q 32.4,-6.8 19.8,-2.1 Q 7.2,2.6 -3.0,-3.6 Q -13.2,-9.9 -23.4,-13.6 Q -33.5,-17.4 -32.1,-25.6 Q -30.6,-33.9 -24.0,-40.5 Q -17.3,-47.1 -6.3,-46.0 Q 4.7,-44.9 13.2,-41.9 Q 21.7,-38.9 31.8,-32.4 Z" fill="#6d5280" />
          </g>
          <g id="anemone" transform="translate(260, ${e-17}) scale(1.4, 1.4)">
            ${this._renderAnemoneTentacles()}
            <ellipse cx="0" cy="-16" rx="30" ry="11" fill="#86198f" opacity="0.9" />
            <path d="M -22,-5 C -26,3 -23,12 -15,17 C -7,21 7,21 15,17 C 23,12 26,3 22,-5 C 14,-14 -14,-14 -22,-5 Z" fill="#701a75" />
            <ellipse cx="0" cy="16" rx="26" ry="9" fill="#4a044e" opacity="0.75" />
          </g>
        </g>
      `:t==="coldwater"?f`
        <g id="coldwater-decor">
          <ellipse cx="140" cy="${e-25}" rx="70" ry="26" fill="#475569" />
          <ellipse cx="250" cy="${e-17}" rx="50" ry="20" fill="#64748b" />
          <ellipse cx="860" cy="${e-20}" rx="75" ry="28" fill="#334155" />
          <ellipse cx="760" cy="${e-15}" rx="46" ry="18" fill="#64748b" />
          <ellipse cx="300" cy="${e-10}" rx="26" ry="10" fill="#94a3b8" opacity="0.85" />
          <ellipse cx="600" cy="${e-8}" rx="22" ry="9" fill="#94a3b8" opacity="0.8" />
          <ellipse cx="660" cy="${e-14}" rx="34" ry="14" fill="#475569" opacity="0.9" />
        </g>
      `:f`
      <g id="freshwater-plants">
        <path d="M 45 ${e} Q 65 ${e-75}, 115${e-60} Q 155 ${e-85}, 200${e-50} Q 240 ${e-70}, 285${e} Z" fill="#15803d" />
        <path d="M 75 ${e} Q 95 ${e-60}, 135${e-55} Q 170 ${e-75}, 210${e-40} Q 250 ${e-50}, 270${e} Z" fill="#22c55e" opacity="0.85" />
        <circle cx="110" cy="${e-55}" r="11" fill="#4ade80" opacity="0.7" />
        <circle cx="170" cy="${e-63}" r="12" fill="#4ade80" opacity="0.7" />
        <path d="M 120 ${e} Q 140 ${e-105}, 160${e-155} Q 165 ${e-205}, 145${e-265}" stroke="#14532d" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 145 ${e-265} Q 105${e-305}, 85 ${e-280} C 70${e-250}, 110 ${e-220}, 145${e-265} Z" fill="#166534" />
        <path d="M 145 ${e-265} Q 185${e-315}, 215 ${e-295} C 230${e-270}, 190 ${e-230}, 145${e-265} Z" fill="#15803d" />
        <path d="M 880 ${e} Q 920 ${e-195}, 870${e-355} Q 845 ${e-195}, 860${e} Z" fill="#16a34a" opacity="0.9" />
        <path d="M 920 ${e} Q 960 ${e-215}, 930${e-375} Q 895 ${e-205}, 900${e} Z" fill="#22c55e" opacity="0.8" />
      </g>
    `}_renderFishShape(t,i,e){let r=t.dir===-1,o=t.deathProgress||0,a=t.scale||1.4,h=(1-o).toFixed(2),n=o.toFixed(2),c=e?0:Math.sin(this._animTime*(3.5*t.vx)+t.phase)*14,p=e?0:Math.sin(this._animTime*(4.5*t.vx)+t.phase)*10,d;return i==="saltwater"?t.species===0?d=f`
          <g transform="translate(-20, 0) rotate(${c})">
            <path d="M 0,0 C -12,-14 -18,-9 -20,0 C -18,9 -12,14 0,0 Z" fill="#ea580c" stroke="#0f172a" stroke-width="1.4" />
          </g>
          <ellipse cx="0" cy="0" rx="24" ry="15" fill="#f97316" />
          <path d="M 14,-12 Q 16,0, 14,12 L 9,12 Q 11,0, 9,-12 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -2,-15 Q 0,0, -2,15 L -7,15 Q -5,0, -7,-15 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <path d="M -16,-11 Q -15,0, -16,11 L -20,11 Q -19,0, -20,-11 Z" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
          <circle cx="15" cy="-4" r="3.2" fill="#ffffff" /><circle cx="16" cy="-4" r="1.6" fill="#0f172a" />
          <g transform="translate(3, 3) rotate(${p})">
            <ellipse cx="0" cy="6" rx="6" ry="10" fill="#f97316" opacity="0.9" stroke="#0f172a" stroke-width="1" />
          </g>
        `:t.species===1?d=f`
          <g transform="translate(-25, 0) rotate(${c})">
            <polygon points="0,-2 -20,-13 -13,-2 -20,9 0,2" fill="#f59e0b" />
            <polygon points="0,-2 -17,-10 -12,-2 -17,7 0,1" fill="#fde047" opacity="0.85" />
          </g>
          <path d="M 0,-20 C 14,-20 24,-10 25,0 C 24,10 14,20 0,20 C -16,19 -26,10 -26,0 C -26,-10 -16,-19 0,-20 Z" fill="url(#tangBodyGrad)" />
          <path d="M -19,-10 C -5,-17 9,-15 14,-5 C 10,1 7,9 11,15 C 1,16 -11,12 -18,3 C -21,-1 -21,-6 -19,-10 Z" fill="#0f172a" opacity="0.88" />
          <circle cx="19" cy="2" r="1.5" fill="#facc15" opacity="0.8" />
          <circle cx="18" cy="-6" r="2.8" fill="#0f172a" /><circle cx="18.6" cy="-6.6" r="0.9" fill="#93c5fd" />
        `:t.species===3?d=f`
          <g transform="translate(-22, 0) rotate(${c})">
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
        `:d=f`
          <g transform="translate(-20, 0) rotate(${c})">
            <polygon points="0,0 -22,-14 -17,0 -22,14" fill="${t.color}" />
          </g>
          <polygon points="2,-28 -8,-10 8,-10" fill="${t.color}" opacity="0.9" />
          <polygon points="0,28 -6,10 6,10" fill="${t.color}" opacity="0.9" />
          <ellipse cx="0" cy="0" rx="24" ry="19" fill="${t.color}" />
          <path d="M -6,-14 L -6,14" stroke="#ffffff" stroke-width="3.5" />
          <path d="M 6,-16 L 6,16" stroke="#ffffff" stroke-width="3.5" />
          <circle cx="15" cy="-5" r="3.2" fill="#ffffff" /><circle cx="16" cy="-5" r="1.5" fill="#0f172a" />
        `:i==="coldwater"?t.species===0?d=f`
          <g transform="translate(-14, 0) rotate(${c*1.1})">
            <path d="M -1,-3 C -10,-12 -24,-15 -35,-11 C -28,-6 -25,-1 -26,4 C -33,6 -40,10 -43,17 C -33,17 -26,14 -21,10 C -23,18 -25,27 -21,34 C -14,28 -10,21 -7,15 C -4,21 2,25 10,25 C 6,16 1,8 -1,-3 Z" fill="${t.color}" opacity="0.88" />
          </g>
          <circle cx="10" cy="0" r="19" fill="${t.color}" />
          <ellipse cx="6" cy="-6" rx="12" ry="7" fill="#ffffff" opacity="0.4" />
          <circle cx="21" cy="-2" r="3.6" fill="#ffffff" /><circle cx="22.2" cy="-2" r="1.8" fill="#0f172a" />
        `:t.species===1?d=f`
          <g transform="translate(-16, 0) rotate(${c})">
            <path d="M 0,0 L -48,-19 L -30,-1 Z" fill="${t.color}" opacity="0.92" />
            <path d="M 0,0 L -48,19 L -30,1 Z" fill="${t.color}" opacity="0.8" />
          </g>
          <path d="M -14,0 C -14,-11 -6,-19 8,-19 C 20,-19 27,-11 27,0 C 27,10 20,17 8,17 C -6,17 -14,10 -14,0 Z" fill="${t.color}" />
          <circle cx="20" cy="-3" r="3" fill="#ffffff" /><circle cx="21" cy="-3" r="1.5" fill="#0f172a" />
        `:d=f`
          <g transform="translate(-14,0) rotate(${c*.8})">
            <path d="M 0,0 C -9,-12 -23,-12 -30,-2 C -22,2 -22,2 -30,6 C -23,14 -9,12 0,0 Z" fill="${t.color}" opacity="0.88" />
          </g>
          <circle cx="4" cy="2" r="22" fill="${t.color}" />
          <circle cx="20" cy="-1" r="3" fill="#ffffff" /><circle cx="21.2" cy="-1" r="1.5" fill="#0f172a" />
        `:t.species===0?d=f`
          <polygon points="5,-42 -10,-12 10,-12" fill="${t.color}" opacity="0.9" />
          <polygon points="0,42 -8,12 8,12" fill="${t.color}" opacity="0.9" />
          <line x1="8" y1="10" x2="20" y2="48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          <g transform="translate(-22, 0) rotate(${c})">
            <polygon points="0,0 -20,-14 -15,0 -20,14" fill="${t.color}" />
          </g>
          <polygon points="-20,0 5,-17 24,0 5,17" fill="${t.color}" />
          <line x1="3" y1="-17" x2="3" y2="17" stroke="#0f172a" stroke-width="3" />
          <circle cx="16" cy="-3" r="3.0" fill="#ef4444" /><circle cx="17" cy="-3" r="1.4" fill="#0f172a" />
        `:t.species===1?d=f`
          <g transform="translate(-20, 0) rotate(${c})">
            <polygon points="0,0 -14,-7 -12,0 -14,7" fill="rgba(255,255,255,0.7)" />
          </g>
          <ellipse cx="0" cy="0" rx="22" ry="9" fill="#1e293b" />
          <path d="M 15,-2 L -17,-2" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />
          <path d="M 0,3 L -17,3" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
          <circle cx="14" cy="-2" r="2.2" fill="#38bdf8" /><circle cx="15" cy="-2" r="0.9" fill="#0f172a" />
        `:d=f`
          <g transform="translate(-22, 0) rotate(${c})">
            <polygon points="0,0 -19,-12 -16,0 -19,12" fill="${t.color}" />
          </g>
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="${t.color}" />
          <circle cx="14" cy="-4" r="3.2" fill="#ffffff" /><circle cx="15" cy="-4" r="1.5" fill="#0f172a" />
        `,f`
      <g transform="scale(${r?-a:a}, ${e?-a:a})">
        <g opacity="${h}">${d}</g>${o>0?f`
              <g opacity="${n}">
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
    `}_renderAncistrus(t){if(!this._ancistrus)return f``;let i=this._ancistrus,e=i.deathProgress||0,r=(1-e).toFixed(2),o=t?1:(1+Math.sin(this._animTime*1.6)*.07).toFixed(3),a="#182026",h="#1e293b",n="#0a0f14",c="#475569";return f`
      <g transform="translate(${i.x}, ${i.y}) scale(1.5,${t?-1.5:1.5})">
        <g opacity="${r}">
          <!-- Left Pectoral Fin with spine ray -->
          <path d="M -12,6 C -24,10 -30,18 -26,26 C -20,26 -14,20 -9,14 Z" fill="${a}" stroke="${n}" stroke-width="0.8" />
          <line x1="-12" y1="8" x2="-24" y2="24" stroke="${c}" stroke-width="1.4" stroke-linecap="round" />

          <!-- Right Pectoral Fin with spine ray -->
          <path d="M 12,6 C 24,10 30,18 26,26 C 20,26 14,20 9,14 Z" fill="${a}" stroke="${n}" stroke-width="0.8" />
          <line x1="12" y1="8" x2="24" y2="24" stroke="${c}" stroke-width="1.4" stroke-linecap="round" />

          <!-- Pelvic Fins -->
          <path d="M -7,30 C -15,36 -15,44 -7,42 Z" fill="${a}" stroke="${n}" stroke-width="0.6" />
          <path d="M 7,30 C 15,36 15,44 7,42 Z" fill="${a}" stroke="${n}" stroke-width="0.6" />

          <!-- Streamlined Body (Model 5 base) -->
          <path d="M -12,0 C -15,16 -14,34 -9,52 L -3,74 L 3,74 L 9,52 C 14,34 15,16 12,0 C 9,-8 -9,-8 -12,0 Z" fill="${h}" stroke="${n}" stroke-width="1.1" />

          <!-- White micro-dots on body -->
          <circle cx="0" cy="20" r="1.0" fill="#ffffff" opacity="0.9" />
          <circle cx="-4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="4" cy="30" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="0" cy="42" r="0.8" fill="#ffffff" opacity="0.8" />
          <circle cx="-3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />
          <circle cx="3" cy="54" r="0.7" fill="#ffffff" opacity="0.7" />

          <!-- Straight brush bristles / tentacles on snout (Model 5) -->
          <line x1="-10" y1="-5" x2="-14" y2="-17" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="-7" y1="-6" x2="-9" y2="-21" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="-3" y1="-7" x2="-4" y2="-24" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="0" y1="-8" x2="0" y2="-25" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="3" y1="-7" x2="4" y2="-24" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="7" y1="-6" x2="9" y2="-21" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />
          <line x1="10" y1="-5" x2="14" y2="-17" stroke="${n}" stroke-width="1.4" stroke-linecap="round" />

          <!-- Recessed Sucker Mouth inside body -->
          <g transform="translate(0, 3) scale(${o},${o})">
            <ellipse cx="0" cy="0" rx="7.4" ry="5.6" fill="#334155" stroke="${n}" stroke-width="0.9" />
            <ellipse cx="0" cy="0" rx="4.8" ry="3.6" fill="#0f172a" />
            <ellipse cx="0" cy="0" rx="2.2" ry="1.5" fill="#475569" />
          </g>
        </g>

        ${e>0?f`
              <g opacity="${e.toFixed(2)}">
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
    `}_renderShrimp(t){if(!this._shrimp)return f``;let i=this._shrimp,r=(1-(i.deathProgress||0)).toFixed(2),o=i.dir===-1?-1:1;return f`
      <g transform="translate(${i.x}, ${i.y}) scale(${o*1.5}, ${t?-1.5:1.5})" opacity="${r}">
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
    `}_renderCrab(t){if(!this._crab)return f``;let i=this._crab,r=(1-(i.deathProgress||0)).toFixed(2),o=i.dir===-1?-1:1;return f`
      <g transform="translate(${i.x}, ${i.y}) scale(${o*1.4}, ${t?-1.4:1.4})" opacity="${r}">
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
    `}_renderAlgae(t,i){let e=Number(this._config.algae_delay_hours)||12,r=Number(this._config.algae_age)||0,o=r>0?r:t;if(!this._config.algae_enabled||o<e)return f``;let h=(.2+Math.min(1,(o-e)/36)*.78).toFixed(2),n=i?0:14,c=i?600:this._getCanvasHeight()-35;return f`
      <g id="algae-layer" opacity="${h}">
        <rect x="0" y="${n}" width="1024" height="${c-n}" fill="url(#algaeDots)" />
      </g>
    `}_renderStatusPanel(t,i,e,r,o){let h=2*Math.PI*74,n=9,c=102,{tempFraction:p,tempColor:d,volFraction:m,volColor:u}=It({currentTemp:t,currentVolume:i,targetBudget:e,deadlyTemp:r,boilTemp:o}),y=102,g=t>0,l=(p*h).toFixed(1),$=922,_=(m*h).toFixed(1);return f`
      <!-- Left Gauge: Water Temperature -->
      ${g?f`
            <g transform="translate(${y}, ${c})">
              <!-- Frosted glass backdrop disk -->
              <circle r="${88}" fill="rgba(255, 255, 255, 0.65)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
              <!-- Track background ring -->
              <circle r="${74}" fill="none" stroke="rgba(15, 23, 42, 0.1)" stroke-width="${n}" />
              <!-- Animated progress arc -->
              <circle
                r="${74}"
                fill="none"
                stroke="${d}"
                stroke-width="${n}"
                stroke-linecap="round"
                stroke-dasharray="${l} ${h.toFixed(1)}"
                transform="rotate(-90)"
              />
              <!-- Central temperature number -->
              <text y="10" font-family="system-ui, sans-serif" font-size="46" font-weight="900" fill="#0f172a" text-anchor="middle">
                ${t.toFixed(1)}°
              </text>
              <!-- Sleek bottom sub-badge -->
              <rect x="-24" y="24" width="48" height="20" rx="10" fill="rgba(15, 23, 42, 0.08)" />
              <text y="38" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle" letter-spacing="0.8">
                °C
              </text>
            </g>
          `:""}

      <!-- Right Gauge: Consumed Water Volume -->
      <g transform="translate(${$},${c})">
        <!-- Frosted glass backdrop disk -->
        <circle r="${88}" fill="rgba(255, 255, 255, 0.65)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />
        <!-- Track background ring -->
        <circle r="${74}" fill="none" stroke="rgba(15, 23, 42, 0.1)" stroke-width="${n}" />
        <!-- Animated progress arc -->
        <circle
          r="${74}"
          fill="none"
          stroke="${u}"
          stroke-width="${n}"
          stroke-linecap="round"
          stroke-dasharray="${_}${h.toFixed(1)}"
          transform="rotate(-90)"
        />
        <!-- Central volume number -->
        <text y="10" font-family="system-ui, sans-serif" font-size="46" font-weight="900" fill="#0f172a" text-anchor="middle">
          ${i.toFixed(1)}
        </text>
        <!-- Sleek bottom target sub-badge -->
        <rect x="-32" y="24" width="64" height="20" rx="10" fill="rgba(15, 23, 42, 0.08)" />
        <text y="38" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="#334155" text-anchor="middle" letter-spacing="0.5">
          / ${e} L
        </text>
      </g>
    `}render(){if(!this._config||!this._hass)return M``;let t=!!this._config.fullscreen,i=this._getCanvasHeight(),e=i-35,r={consumedVolume:this._cachedConsumedVolume,temperature:this._cachedTemperature,targetBudget:this._cachedTargetBudget,survivalVolume:this._cachedSurvivalVolume},{currentVolume:o,currentTemp:a,targetBudget:h,boilTemp:n,deadlyTemp:c,waterRatio:p,tankBottom:d,waterSurfaceY:m,isDead:u,isBoiling:y,isCritical:g,isWarning:l}=gt({config:this._config,metrics:r,canvasHeight:i}),$=Math.max(0,h-o),_=this._config.theme||"freshwater",b=mt(_),E=y||g?"#ef4444":l?"#38bdf8":b.waterTop,C=y||g?"#991b1b":l?"#0284c7":b.waterBottom,K=!!(this._config.title&&this._config.title.trim().length>0),J=Number(this._config.aspect_ratio_width)||1024,$t=Number(this._config.aspect_ratio_height)||600,W=Number(this._config.algae_age)||0,qt=W>0?W:this._cachedHoursSinceLastShower,Gt=a>=c?"#ef4444":a>=n?"#f59e0b":"var(--primary-text-color, #111827)";return M`
      <ha-card>
        ${!t&&K?M`<div class="card-header"><span class="card-title">${this._config.title}</span></div>`:""}

        <div class="aquarium-container">
          <svg
            viewBox="0 0 1024 ${t?600:i}"
            preserveAspectRatio="${t?"none":"xMidYMid meet"}"
            style="${t?"width: 100%; height: 100%;":`aspect-ratio: ${J} /${$t};`}"
          >
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
                <stop offset="10%" stop-color="#ffffff" stop-opacity="0.02" />
                <stop offset="90%" stop-color="#ffffff" stop-opacity="0.02" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
              </linearGradient>

              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${E}" stop-opacity="${y?"0.5":"0.25"}" />
                <stop offset="100%" stop-color="${C}" stop-opacity="${y?"0.75":"0.45"}" />
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
                ${t?f`<rect x="0" y="0" width="1024" height="600" />`:f`<rect x="12" y="14" width="1000" height="${e-14}" rx="18" ry="18" />`}
              </clipPath>
            </defs>

            <g clip-path="url(#innerTankClip)">
              <rect
                x="${t?0:12}"
                y="${t?0:14}"
                width="${t?1024:1e3}"
                height="${t?600:e-14}"
                fill="${b.background}"
              />

              <path
                d="M ${t?0:12} ${d-60} Q 280 ${d-85}, 512 ${d-55} T ${t?1024:1012} ${d-60} L ${t?1024:1012} ${d} L ${t?0:12} ${d} Z"
                fill="${b.sandColor}"
              />

              ${this._renderThemeDecoration(_,t)}

              <g>
                ${this._snails.map((x,Yt)=>{let Xt=x.type==="glass_left"?90:x.type==="glass_right"?-90:0,bt=_==="saltwater"?Yt%2===0?3.5:4.2:1.8;return f`
                    <g transform="translate(${x.x}, ${x.y}) rotate(${Xt}) scale(${x.dir*bt},${bt})">
                      <circle cx="-3" cy="-4" r="5.5" fill="${x.color}" />
                      <path d="M -3,-4 A 3 3 0 0 1 -1,-2" stroke="#ffffff" stroke-width="0.8" fill="none" />
                      <ellipse cx="2" cy="-1.5" rx="5" ry="2.2" fill="#d97706" />
                      <line x1="5" y1="-2.5" x2="7.5" y2="-5.5" stroke="#d97706" stroke-width="0.8" />
                      <circle cx="7.5" cy="-5.5" r="0.6" fill="#111827" />
                    </g>
                  `})}
              </g>

              ${p>0?f`
                    <g>
                      <rect
                        x="${t?0:12}"
                        y="${m-5}"
                        width="${t?1024:1e3}"
                        height="${d-m+5}"
                        fill="url(#waterGrad)"
                      />
                      ${this._renderWaterSurface(t?0:12,t?1024:1012,m)}
                    </g>
                  `:""}

              ${p>0&&!u?f`
                    <g>
                      ${this._bubbles.map(x=>f`
                          <circle cx="${x.x}" cy="${x.y}" r="${x.r}" fill="#ffffff" opacity="0.6" stroke="rgba(255,255,255,0.8)" stroke-width="0.8" />
                        `)}
                    </g>
                  `:""}

              ${y&&p>0?f`
                    <g>
                      ${this._boilingBubbles.map(x=>f`
                          <circle cx="${x.x}" cy="${x.y}" r="${x.r}" fill="#fef08a" opacity="0.75" stroke="#ffffff" stroke-width="1.2" />
                        `)}
                    </g>
                  `:""}

              <g>
                ${(this._fishes||[]).map(x=>f`
                    <g transform="translate(${x.x},${x.y})">
                      ${this._renderFishShape(x,_,u)}
                    </g>
                  `)}
              </g>

              ${_==="freshwater"?this._renderAncistrus(u):""}
              ${_==="saltwater"?this._renderShrimp(u):""}
              ${_==="saltwater"?this._renderCrab(u):""}
              ${this._renderAlgae(qt,t)}

              <!-- Modern Frosted Glass HUD Gauges -->
              ${t?this._renderStatusPanel(a,o,h,c,n):""}
            </g>

            ${t?"":f`
                  <rect x="12" y="14" width="1000" height="${e-14}" rx="18" ry="18" fill="url(#glassGrad)" stroke="#94a3b8" stroke-width="3" />
                  <rect x="4" y="${e}" width="1016" height="14" rx="4" ry="4" fill="#1e293b" />
                `}
          </svg>
        </div>

        ${t?"":M`
              <div class="metrics-grid">
                <div class="metric-box">
                  <div class="metric-value">${o.toFixed(1)} <span class="metric-unit">L</span></div>
                  <div class="metric-label">${this._t("label_consumed")}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-value">${$.toFixed(1)} <span class="metric-unit">L</span></div>
                  <div class="metric-label">${this._t("label_remaining")}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-value">${h} <span class="metric-unit">L</span></div>
                  <div class="metric-label">${this._t("label_target")}</div>
                </div>
                ${a>0?M`
                      <div class="metric-box">
                        <div
                          class="metric-value"
                          style="color: ${Gt};"
                        >
                          ${a.toFixed(1)} <span class="metric-unit">°C</span>
                        </div>
                        <div class="metric-label">${this._t("label_temperature")}</div>
                      </div>
                    `:""}
              </div>
            `}
      </ha-card>
    `}getCardSize(){return 6}};customElements.get("shower-aquarium-card")||customElements.define("shower-aquarium-card",yt);console.info(`%c SHOWER-AQUARIUM-CARD %c v${ft} `,"color: white; background: #0284c7; font-weight: 700; border-radius: 3px 0 0 3px; padding: 2px 6px;","color: #0284c7; background: #e0f2fe; font-weight: 700; border-radius: 0 3px 3px 0; padding: 2px 6px;");window.customCards=window.customCards||[];var Wt=window.customCards.findIndex(s=>s.type==="shower-aquarium-card"),zt={type:"shower-aquarium-card",name:"Shower Aquarium Card",preview:!0,description:`An animated aquarium dashboard card reflecting shower water usage. (v${ft})`};Wt!==-1?window.customCards[Wt]=zt:window.customCards.push(zt);
