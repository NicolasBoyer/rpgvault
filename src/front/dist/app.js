/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;let o$3 = class o{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),S$1=(s,n)=>{e$2?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$1.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window,r$1=e$1.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1 = class u extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return !1;this[d$1]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$2).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$2;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}};u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.6.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$1=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$1,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,e=[];let l,r=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let d,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(l=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=l?l:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,d=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,l=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";r+=u===f?s+h:v>=0?(e.push(d),s.slice(0,v)+o$1+s.slice(v)+n$1+w):s+n$1+(-2===v?(e.push(void 0),i):w);}return [P(t,r+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class N{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,d=0;const c=t.length-1,v=this.parts,[a,f]=V(t,i);if(this.el=N.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$1)){const s=f[d++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$1),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$1),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],u()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],u());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$1,t+1));)v.push({type:7,index:r}),t+=n$1.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=S(t,r._$AS(t,i.values),r,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,u=e[0];for(;void 0!==u;){if(l===u.index){let i;2===u.type?i=new R(n,n.nextSibling,this,t):1===u.type?i=new u.ctor(n,u.name,u.strings,this,t):6===u.type&&(i=new Z(n,this,t)),this._$AV.push(i),u=e[++h];}l!==(null==u?void 0:u.index)&&(n=C.nextNode(),l++);}return C.currentNode=r,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=N.createElement(P(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new M(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new R(this.k(u()),this.k(u()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class k{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=S(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name);}}class z extends k{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const B=i.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.7.5");const D=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new R(i.insertBefore(u(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.2");

class Dom {
    static newDom(element) {
        return this.setCurrent(element);
    }
    static setCurrent(element) {
        this.currentElement = element;
        return this;
    }
    static elt(name, classes = '') {
        const element = document.createElement(name);
        if (classes)
            element.className = classes;
        this.currentElement.appendChild(element);
        this.currentElement = element;
        return this;
    }
    static svg(name) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add(name);
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        svg.appendChild(use);
        use.setAttribute('href', `#${name}`);
        this.currentElement.appendChild(svg);
        this.currentElement = svg;
        return this;
    }
    static att(name, value) {
        if (value !== null)
            this.currentElement.setAttribute(name, value);
        return this;
    }
    static text(text) {
        if (text !== null)
            this.currentElement.appendChild(document.createTextNode(text));
        return this;
    }
    static listen(eventName, listener) {
        this.currentElement.addEventListener(eventName, listener, false);
        return this;
    }
    static up() {
        this.currentElement = this.currentElement.parentNode;
        if (!this.currentElement)
            this.currentElement = document.body;
        return this;
    }
    static clear() {
        this.currentElement.innerHTML = '';
        return this;
    }
    static current() {
        return this.currentElement;
    }
    static remove() {
        this.currentElement.remove();
    }
}

const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise
        .then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    })
        .catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);

/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
    }
    return wrap(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));

const indexedDBCaches = [];
class Caches {
    static async set(forceIndexedDb, ...args) {
        for (let i = 0; i < args.length; i++) {
            const maxStorageSize = 1024 * 1024 * 5 - JSON.stringify(sessionStorage).length;
            const storage = JSON.stringify(args[i + 1]);
            if (storage && storage.length >= maxStorageSize || forceIndexedDb) {
                const key = args[i];
                const db = await openDB(args[i], 1, { upgrade: (db) => db.createObjectStore(args[i]) });
                indexedDBCaches.push(key);
                const transaction = db.transaction(key, 'readwrite');
                const objectStore = transaction.objectStore(key);
                await objectStore.put(args[i + 1], key);
                db.close();
                return;
            }
            if (i % 2 === 0)
                sessionStorage.setItem(args[i], storage);
        }
    }
    static async get(...args) {
        let datas = [];
        for (const arg of args) {
            if (indexedDBCaches.includes(arg)) {
                const db = await openDB(arg, 1);
                datas.push(await db.transaction(arg).objectStore(arg).get(arg));
            }
            else
                datas.push(JSON.parse(sessionStorage.getItem(arg)));
        }
        datas = datas.filter((pEntry) => pEntry);
        return datas.length === 1 && datas.length === args.length ? datas[0] : datas.length && datas.length === args.length ? datas : null;
    }
}
window.addEventListener('beforeunload', () => indexedDBCaches.forEach((dbName) => deleteDB(dbName)));

class Utils {
    static helpers({ confirmMessage = '', cbConfirm = null, cbCancel = null, isConfirmInit = true, loaderVisible = false } = {}) {
        const confirm = cbConfirm;
        const cancel = cbCancel;
        D(x `
			<fs-loader ?visible="${loaderVisible}"></fs-loader>
			<fs-confirm .message="${confirmMessage}" ?open="${isConfirmInit ? !isConfirmInit : Math.random()}" @modalConfirm="${() => confirm()}" @modalCancel="${() => cancel()}"></fs-confirm>
		`, document.body);
    }
    static loader(visible) {
        this.helpers({ loaderVisible: visible });
    }
    static confirm(message, cbConfirm, cbCancel = null) {
        this.helpers({ confirmMessage: message, cbConfirm, cbCancel, isConfirmInit: false });
    }
    static toast(type, message) {
        const bd = Dom.newDom(document.body);
        bd.elt('fs-toast').att('type', type).att('message', message);
    }
    static async request(pUrl, pMethod = 'GET', pOptions = {}, pReturnType = '') {
        const response = await fetch(pUrl, { ...{ method: pMethod }, ...pOptions });
        if (pReturnType === 'status' && pMethod === 'HEAD')
            return response.status;
        if (response.status !== 200 && response.status !== 204) {
            console.error('Request failed : ' + response.status);
            console.log(response);
        }
        else {
            switch (pReturnType) {
                case 'blob':
                    return response.blob();
                case 'text':
                    return response.text();
                case 'response':
                    return response;
                default:
                    return response.json();
            }
        }
    }
    static async getFragmentHtml(pUrl) {
        const fragment = (await Caches.get(pUrl) || await Utils.request(pUrl, 'POST'));
        Caches.set(false, pUrl, fragment);
        return fragment;
    }
    static generateId() {
        return new Date().getTime();
    }
    static getMousePosition() {
        return { x: mouseX, y: mouseY };
    }
    static async getBase64FromFileReader(pFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.addEventListener('error', () => reject);
            reader.readAsDataURL(pFile);
        });
    }
    static slugify(pStr) {
        const a = 'ãàáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/-,:;';
        const b = 'aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh______';
        const p = new RegExp(a.split('').join('|'), 'g');
        return pStr.toString().toLowerCase()
            .replace(/\s+/g, '_')
            .replace(p, (c) => b.charAt(a.indexOf(c)))
            .replace(/&/g, '_and_')
            .replace(/[^\w\-]+/g, '')
            .replace(/--+/g, '_')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    static replaceChildren(pElement, ...pChildren) {
        if (pElement.replaceChildren)
            return pElement.replaceChildren(...pChildren);
        pElement.textContent = '';
        for (const child of pChildren) {
            pElement.appendChild(child);
        }
    }
    static urlToBase64(pUrl) {
        return new Promise(async (resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(await this.request(pUrl, 'GET', null, 'blob'));
        });
    }
    static async uploadFileAndGetUrl(pFile, pName = null) {
        const formData = new FormData();
        formData.append('file', pFile);
        if (pName)
            formData.append('public_id', pName);
        formData.append('upload_preset', 'sheetrpg');
        return (await Utils.request('https://api.cloudinary.com/v1_1/elendil/upload', 'POST', { body: formData }))?.secure_url;
    }
    static isValidHttpUrl(pStr) {
        const pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(pStr);
    }
}
let mouseX = 0;
let mouseY = 0;
document.body.addEventListener('pointermove', (pEvent) => {
    mouseX = pEvent.pageX + window.scrollX;
    mouseY = pEvent.pageY + window.scrollY;
});

class Loader extends HTMLElement {
    static get observedAttributes() { return ['visible']; }
    get visible() {
        return this.hasAttribute('visible');
    }
    set visible(pValue) {
        if (pValue)
            this.setAttribute('visible', '');
        else
            this.removeAttribute('visible');
    }
    connectedCallback() {
        this.render();
        this.style.display = 'none';
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'visible' && oldValue !== newValue) {
            if (newValue === '') {
                this.style.display = '';
                setTimeout(() => this.render(), 20);
            }
            if (newValue === null) {
                this.style.display = 'none';
                setTimeout(() => this.render(), 20);
            }
        }
    }
    render() {
        D(x `<div class="spinner"></div>`, this);
    }
}

class ElementResizer {
    static init(pElement, pOffset, pCallback) {
        pElement.selector = pElement.querySelector('input, textarea') || pElement;
        this.elements[pElement.selector.id] = pElement;
        this.offsetPosition = pOffset;
        pElement.resizerCallback = pCallback;
        this.mouse = {
            x: 0,
            y: 0,
            translateX: 0,
            translateY: 0,
            originalX: 0,
            originalY: 0
        };
        this.selectedSelectorId = pElement.selector.id;
        window.addEventListener('resize', () => this.resetHandler(pElement));
        this.resetHandler(pElement);
        document.body.addEventListener('pointermove', this.pointerMove);
        document.body.addEventListener('pointerup', this.pointerUp);
    }
    static resetHandler(pElement) {
        const boundingBox = pElement.getBoundingClientRect();
        const boxSize = 15;
        const boxPositions = [
            { top: 0, left: 0, class: 'leftTop' },
            { top: boundingBox.height / 2, left: 0, class: 'leftCenter' },
            { top: boundingBox.height, left: 0, class: 'leftBottom' },
            { top: 0, left: boundingBox.width / 2, class: 'centerTop' },
            { top: boundingBox.height, left: boundingBox.width / 2, class: 'centerBottom' },
            { top: 0, left: boundingBox.width, class: 'rightTop' },
            { top: boundingBox.height / 2, left: boundingBox.width, class: 'rightCenter' },
            { top: boundingBox.height, left: boundingBox.width, class: 'rightBottom' }
        ];
        for (const boxPosition of boxPositions) {
            const handler = pElement.querySelector(`.${boxPosition.class}`);
            if (handler) {
                handler.setAttribute('style', `top: ${boxPosition.top - boxSize / 2}px;left: ${boxPosition.left - boxSize / 2}px;width: ${boxSize}px;height: ${boxSize}px;border-radius: ${boxSize}px;`);
                handler.addEventListener('pointerdown', this.pointerDown);
            }
        }
    }
    static pointerDown(pEvent) {
        ElementResizer.mouse.originalX = pEvent.pageX;
        ElementResizer.mouse.originalY = pEvent.pageY;
        const element = pEvent.target;
        ElementResizer.leftHorizontalMove = element.className.includes('left');
        ElementResizer.rightHorizontalMove = element.className.includes('right');
        ElementResizer.topVerticalMove = element.className.includes('Top');
        ElementResizer.bottomVerticalMove = element.className.includes('Bottom');
        ElementResizer.selectedSelectorId = (element.parentElement?.firstElementChild).id || element.parentElement.id;
        ElementResizer.width = ElementResizer.elements[ElementResizer.selectedSelectorId].getBoundingClientRect().width;
        ElementResizer.height = ElementResizer.elements[ElementResizer.selectedSelectorId].getBoundingClientRect().height;
        ElementResizer.isPointerDown = true;
        document.body.classList.add('isResizing');
    }
    static pointerMove(pEvent) {
        pEvent.returnValue = false;
        ElementResizer.mouse.x = pEvent.pageX - ElementResizer.mouse.originalX;
        ElementResizer.mouse.y = pEvent.pageY - ElementResizer.mouse.originalY;
        const element = ElementResizer.elements[ElementResizer.selectedSelectorId];
        const translate = new WebKitCSSMatrix(getComputedStyle(element).transform);
        ElementResizer.mouse.translateX = translate.m41;
        ElementResizer.mouse.translateY = translate.m42;
        if (pEvent.pressure !== 0 && ElementResizer.isPointerDown) {
            if (ElementResizer.leftHorizontalMove) {
                ElementResizer.mouse.translateX = pEvent.pageX + window.scrollX - ElementResizer.offsetPosition.x;
                element.selector.style.width = ElementResizer.width - ElementResizer.mouse.x + 'px';
            }
            if (ElementResizer.rightHorizontalMove)
                element.selector.style.width = ElementResizer.width + ElementResizer.mouse.x + 'px';
            if (ElementResizer.topVerticalMove) {
                ElementResizer.mouse.translateY = pEvent.pageY + window.scrollY - ElementResizer.offsetPosition.y;
                element.selector.style.height = ElementResizer.height - ElementResizer.mouse.y + 'px';
            }
            if (ElementResizer.bottomVerticalMove)
                element.selector.style.height = ElementResizer.height + ElementResizer.mouse.y + 'px';
            element.style.transform = `translate(${ElementResizer.mouse.translateX}px, ${ElementResizer.mouse.translateY}px)`;
            ElementResizer.resetHandler(element);
        }
    }
    static async pointerUp() {
        if (ElementResizer.isPointerDown) {
            const element = ElementResizer.elements[ElementResizer.selectedSelectorId];
            await element.resizerCallback({
                x: ElementResizer.mouse.translateX,
                y: ElementResizer.mouse.translateY,
                width: parseInt(element.selector.style.width),
                height: parseInt(element.selector.style.height)
            });
            ElementResizer.isPointerDown = false;
            document.body.classList.remove('isResizing');
        }
    }
}
ElementResizer.elements = {};
ElementResizer.isPointerDown = false;
ElementResizer.boxPositions = [
    { class: 'leftTop' },
    { class: 'leftCenter' },
    { class: 'leftBottom' },
    { class: 'centerTop' },
    { class: 'centerBottom' },
    { class: 'rightTop' },
    { class: 'rightCenter' },
    { class: 'rightBottom' }
];

class ShortcutManager {
    static set(pElement, pKeys, pAction) {
        this.shortCuts[pKeys.join()] = { element: pElement, keys: pKeys, action: pAction };
        pElement?.addEventListener('keydown', this.keyDown);
        pElement?.addEventListener('keyup', this.keyUp);
    }
    static keyDown(pEvent) {
        if (Object.keys(ShortcutManager.shortCuts).some((pKey) => pKey.split(',').includes(pEvent.key)) && States.editMode) {
            pEvent.preventDefault();
            ShortcutManager.keysPress[pEvent.key] = true;
            const shortcut = ShortcutManager.shortCuts[Object.keys(ShortcutManager.shortCuts).find((pKey) => pKey.split(',').sort().join() === Object.keys(ShortcutManager.keysPress).filter((pKey) => ShortcutManager.keysPress[pKey]).map((pKey) => pKey).sort().join())];
            if (!shortcut)
                return;
            shortcut.action(pEvent);
        }
    }
    static keyUp(pEvent) {
        ShortcutManager.keysPress[pEvent.key] = false;
    }
}
ShortcutManager.keysPress = {};
ShortcutManager.shortCuts = {};

class ElementMover {
    static init(pElement, pOffset, pCallback, pSelector = null) {
        const selector = pSelector || pElement.querySelector('input, textarea') || pElement;
        this.elements[selector.id] = pElement;
        this.offsetPosition = pOffset;
        pElement.moverCallback = pCallback;
        this.mouse = {
            x: 0,
            y: 0
        };
        ElementMover.selectedSelectorId = selector.id;
        document.body.addEventListener('pointermove', this.pointerMove);
        selector.addEventListener('pointerdown', this.pointerDown);
        selector.addEventListener('pointerup', this.pointerUp);
        ShortcutManager.set(pElement, ['ArrowUp'], () => this.moveByKey(0, -1));
        ShortcutManager.set(pElement, ['ArrowDown'], () => this.moveByKey(0, 1));
        ShortcutManager.set(pElement, ['ArrowRight'], () => this.moveByKey(1));
        ShortcutManager.set(pElement, ['ArrowLeft'], () => this.moveByKey(-1));
        ShortcutManager.set(pElement, ['Shift', 'ArrowUp'], () => this.moveByKey(0, -10));
        ShortcutManager.set(pElement, ['Shift', 'ArrowDown'], () => this.moveByKey(0, 10));
        ShortcutManager.set(pElement, ['Shift', 'ArrowRight'], () => this.moveByKey(10));
        ShortcutManager.set(pElement, ['Shift', 'ArrowLeft'], () => this.moveByKey(-10));
        ShortcutManager.set(pElement, ['Control', 'ArrowUp'], () => this.moveByKey(0, -50));
        ShortcutManager.set(pElement, ['Control', 'ArrowDown'], () => this.moveByKey(0, 50));
        ShortcutManager.set(pElement, ['Control', 'ArrowRight'], () => this.moveByKey(50));
        ShortcutManager.set(pElement, ['Control', 'ArrowLeft'], () => this.moveByKey(-50));
    }
    static async pointerDown(pEvent) {
        ElementMover.isPointerDown = true;
        document.body.classList.add('isMoving');
        ElementMover.selectedSelectorId = pEvent.currentTarget.id || pEvent.currentTarget.parentElement.id;
    }
    static pointerMove(pEvent) {
        if (States.isDrawing)
            return;
        pEvent.returnValue = false;
        const selectedElement = ElementMover.elements[ElementMover.selectedSelectorId];
        if (selectedElement) {
            const translate = new WebKitCSSMatrix(getComputedStyle(selectedElement).transform);
            ElementMover.offsetPosition = {
                x: ElementMover.offsetPosition.x + (ElementMover.mouse.x - translate.m41),
                y: ElementMover.offsetPosition.y + (ElementMover.mouse.y - translate.m42)
            };
            ElementMover.mouse.x = pEvent.pageX + window.scrollX - ElementMover.offsetPosition.x;
            ElementMover.mouse.y = pEvent.pageY + window.scrollY - ElementMover.offsetPosition.y;
            if (pEvent.pressure !== 0 && ElementMover.isPointerDown && !ElementResizer.isPointerDown) {
                selectedElement.classList.add('hasMoved');
                ElementMover.isMoving = true;
                selectedElement.style.transform = `translate(${ElementMover.mouse.x}px, ${ElementMover.mouse.y}px)`;
            }
        }
    }
    static pointerUp() {
        if (ElementMover.isMoving)
            ElementMover.elements[ElementMover.selectedSelectorId].moverCallback(ElementMover.mouse);
        if (ElementMover.isPointerDown) {
            ElementMover.isPointerDown = ElementMover.isMoving = false;
            document.body.classList.remove('isMoving');
        }
    }
    static moveByKey(pOffsetX, pOffsetY = 0) {
        const selectedElement = ElementMover.elements[ElementMover.selectedSelectorId];
        const translate = new WebKitCSSMatrix(getComputedStyle(selectedElement).transform);
        const translateX = translate.m41 + pOffsetX;
        const translateY = translate.m42 + pOffsetY;
        setTimeout(() => {
            selectedElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
        selectedElement.moverCallback({ x: translateX, y: translateY });
    }
}
ElementMover.elements = {};
ElementMover.isMoving = false;
ElementMover.isPointerDown = false;

class ElementManager {
    static init() {
        Datas.sheet.inputs?.concat(Datas.sheet.images).forEach((pElement) => {
            const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`);
            if (!selectedElement.getAttribute('data-movable')) {
                ElementMover.init(selectedElement, {
                    x: Sheet.containerLeft,
                    y: Sheet.containerTop
                }, (pMousePosition) => {
                    if (selectedElement.tagName === 'LABEL') {
                        Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio));
                    }
                    if (selectedElement.tagName === 'DIV') {
                        Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio));
                    }
                });
                ElementResizer.init(selectedElement, {
                    x: Sheet.containerLeft,
                    y: Sheet.containerTop
                }, (pMousePosition) => {
                    if (selectedElement.tagName === 'LABEL') {
                        Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio));
                    }
                    if (selectedElement.tagName === 'DIV') {
                        Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio));
                    }
                });
                selectedElement.setAttribute('data-movable', 'true');
            }
        });
    }
    static delete(pElementId) {
        const selectedElement = document.querySelector(`label[for='${pElementId}'], div[id='${pElementId}']`);
        if (selectedElement?.tagName === 'LABEL') {
            const index = Datas.sheet.inputs?.findIndex((input) => input.id === pElementId);
            if (index !== -1) {
                Datas.sheet.inputs?.splice(index, 1);
                Datas.deletedInputs.push(pElementId);
            }
        }
        if (selectedElement?.tagName === 'DIV') {
            const index = Datas.sheet.images?.findIndex((image) => image.id === pElementId);
            if (index !== -1) {
                Datas.sheet.images?.splice(index, 1);
                Datas.deletedImages.push(pElementId);
            }
        }
        States.isSaved = false;
        View.render();
    }
    static async clone(pEvent, pElement) {
        const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`);
        if (selectedElement?.tagName === 'LABEL') {
            Datas.addInputValues({ ...pElement, id: Utils.generateId().toString() });
        }
        if (selectedElement?.tagName === 'DIV') {
            await Datas.addImageValues({ ...pElement, id: Utils.generateId().toString() });
        }
        this.select(pEvent, pElement);
    }
    static copy(pElement) {
        Caches.set(false, 'elementDatas', pElement);
    }
    static async paste(pEvent, pElement) {
        const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`);
        const mousePosition = Utils.getMousePosition();
        const element = {
            ...(await Caches.get('elementDatas')),
            x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio),
            y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio),
            id: Utils.generateId().toString()
        };
        if (selectedElement?.tagName === 'LABEL') {
            Datas.addInputValues(element);
        }
        if (selectedElement?.tagName === 'DIV') {
            await Datas.addImageValues(element);
        }
        this.select(pEvent, element);
    }
    static select(pEvent = null, pElement = null) {
        if (States.editMode) {
            if (pEvent)
                pEvent.stopPropagation();
            this.selectedElementId = pElement?.id || null;
            View.render();
            if (pElement) {
                const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`);
                ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent) => this.clone(pEvent, pElement));
                ShortcutManager.set(selectedElement, ['Control', 'c'], () => this.copy(pElement));
                ShortcutManager.set(document.body, ['Control', 'v'], (pEvent) => this.paste(pEvent, pElement));
                ShortcutManager.set(selectedElement, ['Delete'], () => this.delete(this.selectedElementId));
            }
        }
    }
}

class Drawer {
    static init(pElement, pOffset, pCallBack) {
        this.element = pElement;
        this.bd = Dom.newDom(pElement);
        this.offsetPosition = pOffset;
        this.callBack = pCallBack;
        this.resetMousePosition();
        this.element.addEventListener('pointerdown', this.pointerDown);
        this.element.addEventListener('pointermove', this.pointerMove);
        ShortcutManager.set(document.body, ['Escape'], () => {
            this.reset();
            States.displayEditBlock(true);
        });
    }
    static resetMousePosition() {
        this.mouse = {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        };
    }
    static pointerDown() {
        States.isDrawing = true;
        Drawer.element.addEventListener('click', Drawer.pointerUp);
        Drawer.mouse.startX = Drawer.mouse.x;
        Drawer.mouse.startY = Drawer.mouse.y;
        Drawer.bd.elt('div', 'rectangle').att('style', `left:${Drawer.mouse.x}px;top:${Drawer.mouse.y}px;cursor:crosshair;`);
    }
    static pointerMove(pEvent) {
        pEvent.returnValue = false;
        Drawer.mouse.x = pEvent.pageX + window.scrollX - Drawer.offsetPosition.x;
        Drawer.mouse.y = pEvent.pageY + window.scrollY - Drawer.offsetPosition.y;
        if (pEvent.pressure !== 0)
            Drawer.bd.att('style', `width:${Math.abs(Drawer.mouse.x - Drawer.mouse.startX)}px;height:${Math.abs(Drawer.mouse.y - Drawer.mouse.startY)}px;left:${(Drawer.mouse.x - Drawer.mouse.startX < 0) ? `${Drawer.mouse.x}px` : `${Drawer.mouse.startX}px`};top:${(Drawer.mouse.y - Drawer.mouse.startY < 0) ? `${Drawer.mouse.y}px` : `${Drawer.mouse.startY}px`}`);
    }
    static async pointerUp(pEvent) {
        ElementMover.isPointerDown = false;
        await Drawer.callBack(Drawer.mouse, pEvent);
        Drawer.bd.current().remove();
        Drawer.reset();
    }
    static reset() {
        States.isDrawing = false;
        this.resetMousePosition();
        this.element.removeEventListener('pointerdown', this.pointerDown);
        this.element.removeEventListener('pointermove', this.pointerMove);
        this.element.removeEventListener('click', this.pointerUp);
    }
}

class Input {
    static add() {
        States.displayEditBlock(false);
        Drawer.init(Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent) => {
            States.displayEditBlock(true);
            const inputId = Utils.generateId().toString();
            const input = {
                id: inputId,
                type: 'text'
            };
            await Datas.addInputValues(input, 'x', Math.round(pMousePosition.startX / Sheet.ratio), 'y', Math.round(pMousePosition.startY / Sheet.ratio), 'width', Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio), 'height', Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio));
            ElementManager.select(pEvent, input);
        });
    }
}

let Image$1 = class Image {
    static add() {
        States.displayEditBlock(false);
        Drawer.init(Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent) => {
            const image = { id: Utils.generateId().toString() };
            let file;
            Utils.confirm(x `
					<label for="file">
						<span>Choisissez un fichier</span>
						<input type="file" id="file" name="file" @change="${(pEvent) => {
                file = pEvent.target.files[0];
            }}">
					</label>
				`, async () => {
                await Datas.addImageValues(image, 'x', Math.round(pMousePosition.startX / Sheet.ratio), 'y', Math.round(pMousePosition.startY / Sheet.ratio), 'width', Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio), 'height', Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio), 'file', file);
                ElementManager.select(pEvent, image);
                States.displayEditBlock(true);
                States.isSaved = false;
            }, () => States.displayEditBlock(true));
        });
    }
};

const elements = (pElement, pFonts) => [
    {
        id: 'id',
        type: 'hidden',
        name: 'id',
        value: pElement.id
    },
    {
        id: 'type',
        type: 'select',
        name: 'Type',
        value: pElement.type,
        options: [
            {
                name: 'Texte court',
                value: 'text'
            }, {
                name: 'Texte long',
                value: 'textarea'
            }, {
                name: 'Nombre',
                value: 'number'
            }
        ]
    },
    {
        id: 'fontFamily',
        type: 'select',
        name: 'Police',
        value: pElement.fontFamily,
        options: pFonts
    },
    {
        id: 'fontSize',
        type: 'number',
        name: 'Taille de la police',
        value: pElement.fontSize
    },
    {
        id: 'color',
        type: 'color',
        name: 'Couleur de la police',
        value: pElement.color
    },
    {
        id: 'textAlign',
        type: 'select',
        name: 'Alignement',
        value: pElement.textAlign,
        options: [
            {
                name: 'Gauche',
                value: 'left'
            }, {
                name: 'Centré',
                value: 'center'
            }, {
                name: 'Droite',
                value: 'right'
            }, {
                name: 'Justifié',
                value: 'justify'
            }
        ]
    },
    {
        id: 'width',
        type: 'number',
        name: 'Largeur',
        value: pElement.width
    },
    {
        id: 'height',
        type: 'number',
        name: 'Hauteur',
        value: pElement.height
    },
    {
        id: 'x',
        type: 'number',
        name: 'Abscisse',
        value: pElement.x
    },
    {
        id: 'y',
        type: 'number',
        name: 'Ordonnée',
        value: pElement.y
    }
];

class Interface {
    static initializeMove(pElement) {
        if (States.interface === 'visible' && States.editMode && pElement) {
            ElementMover.init(pElement, {
                x: Sheet.containerLeft,
                y: Sheet.containerTop
            }, (pMousePosition) => {
                console.log(pMousePosition);
            }, pElement);
        }
    }
    static viewBlock() {
        return x `
			<div class="viewBlock">
				<a href="#" role="button" class="viewSelection ${States.interface === 'hover' ? 'selected' : ''}" @click="${(pEvent) => {
            pEvent.preventDefault();
            States.interface = 'hover';
        }}" title="Interface sur demande">
					<svg class="eye-plus">
						<use href="#eye-plus"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === 'visible' ? 'selected' : ''}" @click="${(pEvent) => {
            pEvent.preventDefault();
            States.interface = 'visible';
        }}" title="Interface toujours visible">
					<svg class="eye">
						<use href="#eye"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === 'hidden' ? 'selected' : ''}" @click="${(pEvent) => {
            pEvent.preventDefault();
            States.interface = 'hidden';
        }}" title="Interface cachée">
					<svg class="eye-blocked">
						<use href="#eye-blocked"></use>
					</svg>
				</a>
				<a href="#" role="button" ?disabled="${States.isSaved}" class="saveButton" @click="${async (pEvent) => {
            pEvent.preventDefault();
            await Datas.save();
            View.render();
        }}" title="Sauvegarder">
					<svg class="floppy">
						<use href="#floppy"></use>
					</svg>
				</a>
			</div>
		`;
    }
    static editBlock() {
        if (States.interface === 'visible')
            setTimeout(() => this.initializeMove(document.querySelector('.editBlock')));
        return x `
			<article .hidden="${States.isEditBlockHidden}" class="editBlock" id="editBlock">
				${States.interface !== 'hidden' ? this.viewBlock() : ''}
				<button class="contrast" @click="${() => Sheet.editBackgroundImage()}">Image de fond</button>
				<button class="contrast" @click="${() => Sheet.changeBackgroundColor()}">Couleur du fond</button>
				<button class="contrast" @click="${() => Sheet.addFont()}">Ajouter une police</button>
				<button class="contrast" @click="${() => Sheet.deleteFont()}">Supprimer une police</button>
				<button class="contrast" @click="${() => Input.add()}">Ajouter un champ</button>
				<button class="contrast" @click="${() => Image$1.add()}">Ajouter une image</button>
				<div class="validBlock">
					<button @click="${() => {
            States.displayEditMode(false);
        }}">Annuler
					</button>
					<button class="save" @click="${async () => {
            await Datas.save();
            States.displayEditMode(false);
        }}">Enregistrer et fermer
						<fs-loader ?visible="${Datas.isSaving}"></fs-loader>
					</button>
				</div>
			</article>
		`;
    }
    static selectBlock(pElement) {
        if (States.interface === 'visible')
            setTimeout(() => this.initializeMove(document.querySelector('.selectBlock')));
        return x `
			<article id="selectBlock" class="selectBlock" @click="${(pEvent) => pEvent.stopPropagation()}">
				<a href="#" role="button" class="cloneInput" @click="${(pEvent) => {
            pEvent.preventDefault();
            ElementManager.clone(pEvent, pElement);
        }}" title="Dupliquer (ctrl D)">
					<svg class="clone">
						<use href="#clone"></use>
					</svg>
				</a>
				<a href="#" role="button" class="deleteInput" @click="${(pEvent) => {
            pEvent.preventDefault();
            ElementManager.delete(pElement.id);
        }}" title="Supprimer (Suppr)">
					<svg class="trash">
						<use href="#trash"></use>
					</svg>
				</a>
				${elements(pElement, Datas.sheet.fonts.map((pFont) => ({
            name: pFont.fontFamily,
            value: pFont.fontFamily
        }))).filter((pEntry) => pElement.type || pElement.image && pElement[pEntry.id]).map((pEntry) => x `
					<fs-label
							id="${pEntry.id}"
							type="${pEntry.type}"
							name="${pEntry.name}"
							value="${pEntry.value}"
							@input="${(pEvent) => Datas.addInputValues(pElement, pEntry.id, pEvent.target.value)}"
							options="${JSON.stringify(pEntry.options)}"
					></fs-label>
				`)}
			</article>
		`;
    }
}

class View {
    static render() {
        D(x `
			<style>
				${Datas.sheet.fonts?.map((pFont) => `
				@font-face {
				font-family: ${pFont.fontFamily};
				src: url(${pFont.fontUrl});
				}
				`)}
			</style>
		`, document.head);
        D(x `			
				<div style="position: relative;width: ${Sheet.containerWidth};height: ${Sheet.containerHeight};" class="wrapper ${States.editMode && 'editMode'} ${States.notepadMode && 'notepadMode'} ${States.interface || 'hover'}" @click="${(pEvent) => {
            if (States.editMode)
                ElementManager.select(pEvent);
            if (States.notepadMode)
                States.displayNotepadMode(false);
        }}">
				${States.interface === 'hidden' ? Interface.viewBlock() : ''}
				${States.editMode ? Interface.editBlock() : x `
					<fs-link role="button" class="home contrast" href="/">
						<svg class="home"> 
							<use href="#home"></use>
						</svg>
						<span>Accueil</span>
					</fs-link>
					<button class="edit contrast" @click="${() => States.displayEditMode(true)}">Éditer</button>
					<button class="notepad contrast ${States.notepadMode && 'selected'}" @click="${(pEvent) => {
            pEvent.stopPropagation();
            States.displayNotepadMode(!States.notepadMode);
        }}">Bloc notes</button>
					<button class="print contrast" @click="${() => Sheet.printScreen()}">
						<svg class="print"> 
							<use href="#print"></use>
						</svg>
						<span>Imprimer</span>
					</button>
					${States.notepadMode ? x `
					<article id="notepad" @click="${(pEvent) => pEvent.stopPropagation()}">
						<textarea @change="${(pEvent) => Datas.saveNotepad(pEvent.target.value)}">${Datas.sheet.notepad}</textarea>
					</article>
					` : ''}
				`}
				${Datas.sheet.inputs?.map((pInput) => x `
							<label for="${pInput.id}" style="transform: translate(${pInput.x * Sheet.ratio}px, ${pInput.y * Sheet.ratio}px);" class="${ElementManager.selectedElementId === pInput.id ? 'selected' : ''}">
								${pInput.type === 'textarea' ? x `
									<textarea
											id="${pInput.id}"
											name="${pInput.id}"
											style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height * Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
											@change="${(pEvent) => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${States.editMode}"
											@click="${(pEvent) => ElementManager.select(pEvent, pInput)}"
									>${pInput.value}</textarea>
								` : x `
									<input
											type="${pInput.type}"
											id="${pInput.id}"
											name="${pInput.id}"
											value="${pInput.value}"
											style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height * Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
											@change="${(pEvent) => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${States.editMode}"
											@click="${(pEvent) => ElementManager.select(pEvent, pInput)}"
									/>
								`}
								${ElementResizer.boxPositions.map((pBoxPosition) => x `<div .hidden="${ElementManager.selectedElementId !== pInput.id}" class="resizeHandler ${pBoxPosition.class}" />`)}
							</label>
							${ElementManager.selectedElementId === pInput.id ? Interface.selectBlock(pInput) : ''}
						`)}
				${Datas.sheet.images?.map((pImage) => x `
							<div id="${pImage.id}" style="transform: translate(${pImage.x * Sheet.ratio}px, ${pImage.y * Sheet.ratio}px);width: ${pImage.width * Sheet.ratio}px;height: ${pImage.height * Sheet.ratio}px;" class="image ${ElementManager.selectedElementId === pImage.id ? 'selected' : ''} ${States.isZoomed === pImage.id ? 'isZoomed' : ''}" @click="${(pEvent) => {
            if (States.editMode)
                ElementManager.select(pEvent, pImage);
            else {
                if (!States.isZoomed)
                    States.isZoomed = pImage.id;
                else
                    States.isZoomed = false;
                View.render();
            }
        }}">
								<div style="background-image: url(${pImage.image});"></div>
								${ElementResizer.boxPositions.map((pBoxPosition) => x `<div .hidden="${ElementManager.selectedElementId !== pImage.id}" class="resizeHandler ${pBoxPosition.class}" />`)}
							</div>
							${ElementManager.selectedElementId === pImage.id ? Interface.selectBlock(pImage) : ''}
						`)}
			</div>
		`, Sheet.element);
        ElementManager.init();
    }
}

class States {
    static displayEditMode(pValue) {
        ElementManager.select();
        this.editMode = pValue;
        this.notepadMode = this.notepadMode && !pValue;
        Datas.changedInputs = [];
        Datas.changedImages = [];
        Datas.deletedInputs = [];
        Datas.deletedImages = [];
        Datas.sheetProperties = [];
        View.render();
    }
    static displayNotepadMode(pValue) {
        this.notepadMode = pValue;
        View.render();
    }
    static displayEditBlock(pValue) {
        if (ElementResizer.isPointerDown || ElementMover.isPointerDown)
            return;
        this.isEditBlockHidden = !pValue;
        View.render();
    }
}
States.interface = 'hover';
States.isSaved = true;
States.isDrawing = false;
States.isZoomed = false;

class Datas {
    static async init() {
        Utils.loader(true);
        const splitUrl = location.pathname.split('/');
        const sheets = (await Caches.get('sheets') || await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' }));
        Caches.set(true, 'sheets', sheets);
        this.sheet = sheets.find((pSheet) => pSheet.slug === splitUrl[splitUrl.length - 1]);
        this.id = this.sheet._id;
        this.sheet = (await Caches.get(this.id) || this.sheet);
        await this.cacheResources();
    }
    static async addAndSaveInput(pInput, ...args) {
        this.addInputValues(pInput, ...args);
        await this.save(pInput);
    }
    static async saveNotepad(text) {
        this.sheet.notepad = text;
        this.sheetProperties = [{ setNotepad: { text } }];
        await this.save();
    }
    static addInputValues(pInput, ...args) {
        for (let i = 0; i < args.length; i++) {
            const value = args[i + 1];
            if (i % 2 === 0)
                pInput[args[i]] = Number(value) || value;
        }
        let index;
        if (!this.sheet.inputs)
            this.sheet.inputs = [];
        if (States.editMode) {
            index = this.changedInputs.findIndex((input) => input.id === pInput.id);
            this.changedInputs[index !== -1 ? index : this.changedInputs.length || 0] = pInput;
        }
        index = this.sheet.inputs.findIndex((input) => input.id === pInput.id);
        this.sheet.inputs[index !== -1 ? index : this.sheet.inputs.length || 0] = pInput;
        States.isSaved = false;
        View.render();
    }
    static async addImageValues(pImage, ...args) {
        for (let i = 0; i < args.length; i++) {
            const value = args[i + 1];
            if (i % 2 === 0)
                pImage[args[i]] = Number(value) || value;
        }
        let index;
        if (States.editMode) {
            index = this.changedImages.findIndex((image) => image.id === pImage.id);
            this.changedImages[index !== -1 ? index : this.changedImages.length || 0] = pImage;
        }
        if (!this.sheet.images)
            this.sheet.images = [];
        index = this.sheet.images.findIndex((image) => image.id === pImage.id);
        if (pImage.file)
            pImage.image = await Utils.getBase64FromFileReader(pImage.file);
        this.sheet.images[index !== -1 ? index : this.sheet.images.length || 0] = pImage;
        States.isSaved = false;
        View.render();
    }
    static async cacheResources() {
        const cache = await Caches.get(this.id);
        if (Utils.isValidHttpUrl(this.sheet.backgroundImage)) {
            this.sheet.backgroundImage_url = this.sheet.backgroundImage;
            this.sheet.backgroundImage = cache?.backgroundImage || this.sheet.backgroundImage;
            if (cache?.backgroundImage !== this.sheet.backgroundImage && cache?.backgroundImage_url !== this.sheet.backgroundImage || !cache)
                this.sheet.backgroundImage = (await Utils.urlToBase64(this.sheet.backgroundImage));
        }
        if (this.sheet.images) {
            for (let i = 0; i < this.sheet.images.length; i++) {
                const image = this.sheet.images[i];
                if (Utils.isValidHttpUrl(image.image)) {
                    image.image_url = image.image;
                    image.image = cache?.images && cache?.images[i]?.image || image.image;
                    if (cache?.images && cache?.images[i]?.image !== image.image && cache?.images && cache?.images[i]?.image_url !== image.image || !cache)
                        image.image = await Utils.urlToBase64(image.image);
                }
            }
        }
        if (this.sheet.fonts) {
            for (let i = 0; i < this.sheet.fonts.length; i++) {
                const font = this.sheet.fonts[i];
                if (Utils.isValidHttpUrl(font.fontUrl)) {
                    font.fontUrl_url = font.fontUrl;
                    font.fontUrl = cache?.fonts && cache?.fonts[i]?.fontUrl_url || font.fontUrl;
                    if (cache?.fonts && cache.fonts[i]?.fontUrl !== font.fontUrl && cache?.fonts[i]?.fontUrl_url !== font.fontUrl || !cache)
                        font.fontUrl = await Utils.urlToBase64(font.fontUrl);
                }
            }
        }
        Caches.set(true, this.id, this.sheet);
    }
    static async save(pInput = null) {
        this.isSaving = true;
        const body = [];
        const inputs = pInput ? [pInput] : this.changedInputs;
        inputs?.forEach((pInput) => {
            body.push({
                setInput: {
                    id: this.id,
                    inputId: pInput.id,
                    input: pInput
                }
            });
        });
        if (!pInput) {
            this.deletedInputs?.forEach((pInputId) => {
                body.push({
                    deleteInput: {
                        id: this.id,
                        inputId: pInputId
                    }
                });
            });
            if (this.changedImages) {
                for (const image of this.changedImages) {
                    if (image.file) {
                        image.image = await Utils.uploadFileAndGetUrl(image.file);
                        delete image.file;
                    }
                    if (image.image_url) {
                        image.image = image.image_url;
                        delete image.image_url;
                    }
                    body.push({
                        setImage: {
                            id: this.id,
                            imageId: image.id,
                            image: image
                        }
                    });
                }
            }
            this.deletedImages?.forEach((pImageId) => {
                body.push({
                    deleteImage: {
                        id: this.id,
                        imageId: pImageId
                    }
                });
            });
            for (const property of this.sheetProperties) {
                const value = Object.values(property)[0];
                if (Object.keys(property)[0] === 'setBackgroundImage')
                    value.image = await Utils.uploadFileAndGetUrl(value.image);
                if (Object.keys(property)[0] === 'setFont')
                    value.fontUrl = await Utils.uploadFileAndGetUrl(value.fontUrl, value.name);
                value.id = this.id;
                body.push(property);
            }
        }
        const sheets = (await Utils.request('/db', 'POST', { body: JSON.stringify(body) })).pop();
        if (sheets) {
            this.sheet = sheets.find((pSheet) => pSheet._id === this.id);
            await Caches.set(true, 'sheets', sheets);
            await this.cacheResources();
            this.changedInputs = [];
            this.changedImages = [];
            this.deletedInputs = [];
            this.deletedImages = [];
            this.sheetProperties = [];
            this.isSaving = false;
            States.isSaved = true;
        }
    }
}
Datas.isSaving = false;

class Sheet extends HTMLElement {
    async connectedCallback() {
        await Datas.init();
        Sheet.element = this;
        this.style.backgroundColor = Datas.sheet.backgroundColor;
        Sheet.setBackgroundImage(Datas.sheet.backgroundImage || '../../assets/default.jpg');
        window.addEventListener('resize', () => Sheet.resize());
        ShortcutManager.set(document.body, ['Control', 's'], async () => {
            await Datas.save();
            View.render();
        });
        ShortcutManager.set(document.body, ['Tab'], () => {
            States.interface = States.interface === 'hover' ? 'visible' : States.interface === 'visible' ? 'hidden' : 'hover';
            View.render();
        });
    }
    static setBackgroundImage(pImageSrc) {
        const image = new Image();
        image.onload = () => {
            this.imageWidth = image.naturalWidth;
            this.imageHeight = image.naturalHeight;
            this.resize();
        };
        image.src = pImageSrc;
        this.element.style.backgroundImage = `url(${image.src})`;
    }
    static resize() {
        const dims = document.body.getBoundingClientRect();
        this.element.style.width = `${dims.width}px`;
        this.element.style.height = `${dims.height}px`;
        const containerHeight = dims.width * this.imageHeight / this.imageWidth;
        const isWidthResized = containerHeight < dims.height;
        this.containerWidth = `${isWidthResized ? dims.width : this.imageWidth * dims.height / this.imageHeight}px`;
        this.containerHeight = `${isWidthResized ? containerHeight : dims.height}px`;
        this.ratio = isWidthResized ? dims.width / this.imageWidth : dims.height / this.imageHeight;
        this.containerLeft = (dims.width - parseInt(this.containerWidth)) / 2;
        this.containerTop = (dims.height - parseInt(this.containerHeight)) / 2;
        View.render();
        setTimeout(() => Utils.loader(false));
    }
    static changeBackgroundColor() {
        States.displayEditBlock(false);
        let color;
        Utils.confirm(x `
			<label for="color">
				<span>Choisissez une couleur</span>
				<input type="color" id="color" name="color" value="${Datas.sheet.backgroundColor || '#ffffff'}" @change="${async (pEvent) => {
            color = pEvent.target.value;
        }}">
			</label>
		`, () => {
            this.element.style.backgroundColor = color;
            Datas.sheet.backgroundColor = color;
            Datas.sheetProperties.push({ setBackgroundColor: { color } });
            States.isSaved = false;
            States.displayEditBlock(true);
            View.render();
        }, () => States.displayEditBlock(true));
    }
    static editBackgroundImage() {
        States.displayEditBlock(false);
        let file;
        Utils.confirm(x `
			<label for="file">
				<span>Choisissez un fichier</span>
				<input type="file" id="file" name="file" @change="${(pEvent) => {
            file = pEvent.target.files[0];
        }}">
			</label>
		`, async () => {
            this.setBackgroundImage((await Utils.getBase64FromFileReader(file)));
            Datas.sheetProperties.push({ setBackgroundImage: { image: file } });
            States.isSaved = false;
            States.displayEditBlock(true);
            View.render();
        }, () => States.displayEditBlock(true));
    }
    static addFont() {
        States.displayEditBlock(false);
        let fontUrl;
        let fontFamily;
        let file;
        Utils.confirm(x `
			<label for="file">
				<input accept=".ttf,.woff,.woff2,.eot" type="file" id="file" name="file" @change="${(pEvent) => {
            file = pEvent.target.files[0];
        }}">
			</label>
			<label for="fontFamily">
				<span>Nom de la police (font family)</span>
				<input type="text" id="fontFamily" name="fontFamily" @change="${async (pEvent) => {
            fontFamily = pEvent.target.value;
        }}">
			</label>
		`, async () => {
            if (!Datas.sheet.fonts)
                Datas.sheet.fonts = [];
            fontUrl = await Utils.getBase64FromFileReader(file);
            const font = { name: file.name, fontUrl, fontFamily };
            Datas.sheet.fonts.push(font);
            fontUrl = file;
            Datas.sheetProperties.push({ setFont: font });
            States.isSaved = false;
            States.displayEditBlock(true);
            View.render();
        }, () => States.displayEditBlock(true));
    }
    static deleteFont() {
        States.displayEditBlock(false);
        let fonts = [];
        Utils.confirm(x `
			<ul>
				${Datas.sheet.fonts?.map((pFont) => x `
					<li>
						<label for="${pFont.fontFamily}">
							<input type="checkbox" id="${pFont.fontFamily}" name="${pFont.fontFamily}" value="${pFont.fontFamily}" @change="${(pEvent) => {
            const value = pFont.fontFamily;
            if (pEvent.target.checked)
                fonts.push(value);
            else
                fonts = fonts.filter((pChoice) => pChoice !== value);
        }}">${pFont.fontFamily}</label>
					</li>
				`)}
			</ul>
		`, () => {
            fonts.forEach((pFontFamily) => {
                Datas.sheet.fonts = Datas.sheet.fonts?.filter((pFont) => pFont.fontFamily !== pFontFamily);
            });
            Datas.sheetProperties.push({ deleteFont: { fonts: fonts } });
            States.isSaved = false;
            States.displayEditBlock(true);
            View.render();
        }, () => States.displayEditBlock(true));
    }
    static async printScreen() {
    }
}

class Confirm extends HTMLElement {
    constructor() {
        super(...arguments);
        this.message = '';
    }
    static get observedAttributes() { return ['open']; }
    get open() {
        return this.hasAttribute('open');
    }
    set open(pValue) {
        if (pValue)
            this.setAttribute('open', '');
        else
            this.removeAttribute('open');
    }
    connectedCallback() {
        this.render();
        this.style.display = 'none';
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if ((name === 'open') && oldValue !== newValue) {
            this.style.display = '';
            setTimeout(() => this.render(), 50);
        }
    }
    closeDialog() {
        this.open = false;
        setTimeout(() => {
            this.style.display = 'none';
            this.message = '';
            this.render();
        }, 225);
    }
    render() {
        D(x `
						<dialog ?open="${this.open}"> 
								<article>
										${this.message} 
										<footer>
												<a role="button" class="secondary" @click="${(pEvent) => {
            pEvent.preventDefault();
            this.dispatchEvent(new CustomEvent('modalCancel'));
            this.closeDialog();
        }}">Cancel</a>
																	<a role="button" @click="${(pEvent) => {
            pEvent.preventDefault();
            this.dispatchEvent(new CustomEvent('modalConfirm'));
            this.closeDialog();
        }}">Confirm</a>
										</footer>
								</article>
						</dialog>
		`, this);
    }
}

class Login extends HTMLElement {
    connectedCallback() {
        this.render();
        this.setFormListener();
    }
    setFormListener() {
        const form = this.querySelector('form');
        form?.addEventListener('submit', async (pEvent) => {
            pEvent.preventDefault();
            await Utils.request('/auth', 'POST', { body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
            location.href = '/';
        });
    }
    render() {
        D(x `
					<form>
						<label>
							<span>Identifiant</span>
							<input name="id" required type="text">
						</label>
						<label>
							<span>Mot de passe</span>
							<input name="password" required type="password">
						</label>
						<button type="submit">
							<span>Envoyer</span>
						</button>
					</form>
		`, this);
    }
}

class Label extends HTMLElement {
    static get observedAttributes() { return ['value']; }
    get name() {
        return this.getAttribute('name');
    }
    set name(pValue) {
        this.setAttribute('name', pValue);
    }
    get value() {
        return this.getAttribute('value');
    }
    set value(pValue) {
        this.setAttribute('value', pValue);
    }
    get type() {
        return this.getAttribute('type');
    }
    set type(pValue) {
        this.setAttribute('type', pValue);
    }
    get options() {
        return JSON.parse(this.getAttribute('options') || '[]');
    }
    set options(pValue) {
        this.setAttribute('options', pValue);
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            this.value = newValue;
            this.render();
        }
    }
    render() {
        D(x `
			<label for="${this.id}" @click="${(pEvent) => pEvent.stopPropagation()}">
				<span>${this.name}</span>
				${this.type === 'select' ? x `
					<select id="${this.id}" title="${this.name}">
						<option value="" selected>Choisir un ${this.name}</option>
						${this.options?.map((pOption) => x `
							<option ?selected="${this.value === pOption.value}" value="${pOption.value}">${pOption.name}</option>
						`)}
					</select>
				` : x `
					<input type="${this.type}" id="${this.id}" name="${this.id}" value="${this.value}" title="${this.name}"/>
				`}
			</label>
		`, this);
    }
}

class Home extends HTMLElement {
    constructor() {
        super(...arguments);
        this.sheets = [];
        this.editMode = null;
    }
    async connectedCallback() {
        Utils.getFragmentHtml(location.pathname);
        Utils.loader(true);
        this.sheets = (await Caches.get('sheets') || await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' }));
        Caches.set(true, 'sheets', this.sheets);
        this.sheets = Array.isArray(this.sheets) ? this.sheets : Object.keys(this.sheets).length ? [this.sheets] : [];
        this.render();
        window.addEventListener('resize', () => this.initParchment());
        setTimeout(() => {
            this.initParchment();
            Utils.loader(false);
        });
    }
    initParchment() {
        if (!document.querySelector('#parchment'))
            return;
        const main = document.querySelector('#main');
        main.style.height = '';
        document.body.style.height = '';
        const mainSize = main.getBoundingClientRect();
        if (mainSize.height <= window.innerHeight) {
            document.body.style.height = `${window.innerHeight}px`;
            main.style.height = `${document.body.getBoundingClientRect().height - mainSize.top - parseInt(getComputedStyle(main).marginBottom)}px`;
        }
        this.render();
    }
    async saveSheet(sheet) {
        if (!this.sheets.some((pSheet) => (pSheet.name.toLowerCase() === sheet.name.toLowerCase() || pSheet.slug === Utils.slugify(sheet.name)) && pSheet._id !== sheet.id)) {
            this.sheets = await Utils.request('/db', 'POST', { body: `{ "setSheet": ${JSON.stringify(sheet)} }` });
            Caches.set(true, 'sheets', this.sheets);
        }
        else
            Utils.toast('error', 'Une feuille de personnage portant le même nom ou la même url existe');
        this.resetMode();
    }
    async editSheets(event, id) {
        const target = event.target;
        const input = target.tagName === 'INPUT' ? target : target.closest('div')?.querySelector('input');
        await this.saveSheet({ name: input.value, id });
    }
    addSheet() {
        let name;
        Utils.confirm(x `
			<label for="name">
				<span>Choisissez un nom</span>
				<input type="text" id="name" name="name" @change="${async (pEvent) => {
            name = pEvent.target.value;
        }}"> 
			</label>
		`, async () => {
            await this.saveSheet({ name });
            this.initParchment();
        });
    }
    removeSheet(id) {
        Utils.confirm(x `<h3>Voulez-vous vraiment supprimer ?</h3>`, async () => {
            this.sheets = await Utils.request('/db', 'POST', { body: `{ "removeSheet": { "id": "${id}" } }` });
            Caches.set(true, 'sheets', this.sheets);
            this.resetMode();
            this.initParchment();
            Utils.toast('success', 'Feuille de personnage supprimée');
        });
    }
    clone(id) {
        let name;
        Utils.confirm(x `
			<label for="name">
				<span>Dupliquer la feuille de personnage</span>
				<input type="text" id="name" name="name" @change="${(pEvent) => {
            name = pEvent.target.value;
        }}"> 
			</label>
		`, async () => {
            const sheet = this.sheets.find((pSheet) => pSheet._id === id);
            sheet.name = name;
            sheet.slug = Utils.slugify(name);
            delete sheet._id;
            delete sheet.id;
            await this.saveSheet(sheet);
            this.initParchment();
        });
    }
    resetMode() {
        this.editMode = null;
        this.render();
    }
    resetHeight() {
        document.querySelector('#main').style.height = '';
        document.body.style.height = '';
    }
    render() {
        D(x `
			<div class="title">
				<h2>Vos feuilles de personnage</h2>
				<button type="button" class="add" @click="${() => this.addSheet()}">
					<svg class="add">
						<use href="#document"></use>
					</svg>
					<span>Ajouter une feuille</span> 
				</button>
			</div>
			<aside>
				<nav>
					<ul>
						${!this.sheets.length
            ? x `<li>Aucune feuille ...</li>`
            : this.sheets.map((pSheet) => {
                const id = pSheet._id;
                const name = pSheet.name;
                return x `
				<li>
					<div class="characterSheets">
						${this.editMode === id ? x `
							<input name="editSheet" required type="text" value="${name}" @keyup="${(pEvent) => {
                    if (pEvent.key === 'Enter')
                        this.editSheets(pEvent, id);
                    if (pEvent.key === 'Escape')
                        this.resetMode();
                }}"/>
							<button class="valid" @click="${async (pEvent) => await this.editSheets(pEvent, id)}">
								<svg class="valid">
									<use href="#valid"></use>
								</svg>
								<span>Valider</span>
							</button>
							<button type="button" class="undo" @click="${() => this.resetMode()}">
								<svg class="undo">
									<use href="#undo"></use>
								</svg>
								<span>Annuler</span>
							</button>
						` : x `
							<fs-link role="link" href="/sheets/${pSheet.slug}" @click="${() => this.resetHeight()}">
								<span>${name}</span>
							</fs-link>
							<button type="button" class="clone" @click="${() => this.clone(id)}">
								<svg class="clone">
									<use href="#documents"></use>
								</svg>
								<span>Dupliquer</span>
							</button>
							<button class="edit" @click="${() => {
                    this.editMode = id;
                    this.render();
                }}">
								<svg class="edit">
									<use href="#pencil"></use>
								</svg>
								<span>Modifier</span>
							</button>
							<button type="button" class="remove" @click="${() => this.removeSheet(id)}">
								<svg class="remove">
									<use href="#bin"></use>
								</svg>
								<span>Supprimer</span>
							</button>
						`}
					</div>
				</li>											
				`;
            })}
					</ul>
				</nav>
			</aside>
		`, this);
    }
}

class Link extends HTMLElement {
    get href() {
        return this.getAttribute('href');
    }
    set href(pValue) {
        this.setAttribute('open', pValue);
    }
    async connectedCallback() {
        const children = Array.from(this.children);
        this.render();
        this.querySelector('slot')?.replaceWith(...children);
        const fragment = await Utils.getFragmentHtml(this.href);
        this.addEventListener('click', () => {
            history.pushState({}, '', this.href);
            REPLACEZONE(fragment);
        });
    }
    render() {
        D(x `
			<slot></slot>
		`, this);
    }
}
const REPLACEZONE = (pFragment) => {
    Utils.replaceChildren(document.querySelector('[data-replaced-zone]'), document.createRange().createContextualFragment(pFragment.text));
    document.body.className = pFragment.class;
    const title = document.querySelector('[data-replaced-title]');
    if (title)
        title.innerHTML = pFragment.title;
};
window.addEventListener('popstate', async () => REPLACEZONE(await Utils.getFragmentHtml(location.pathname)));

class App {
    constructor() {
        Utils.helpers();
        if (location.href.charAt(location.href.length - 1) === '/')
            history.replaceState({}, '', location.href.replace(/\/$/, ''));
    }
}
new App();
customElements.define('fs-loader', Loader);
customElements.define('fs-confirm', Confirm);
customElements.define('fs-home', Home);
customElements.define('fs-sheet', Sheet);
customElements.define('fs-label', Label);
customElements.define('fs-login', Login);
customElements.define('fs-link', Link);
//# sourceMappingURL=app.js.map
