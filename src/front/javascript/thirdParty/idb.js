/**
 * Bundled by jsDelivr using Rollup v2.74.1 and Terser v5.15.1.
 * Original file: /npm/idb@7.1.1/build/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let e, t; const n = new WeakMap(); const r = new WeakMap(); const o = new WeakMap(); const s = new WeakMap(); const a = new WeakMap(); let i = { get (e, t, n) { if (e instanceof IDBTransaction) { if (t === 'done') return r.get(e); if (t === 'objectStoreNames') return e.objectStoreNames || o.get(e); if (t === 'store') return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]) } return u(e[t]) }, set: (e, t, n) => (e[t] = n, !0), has: (e, t) => e instanceof IDBTransaction && (t === 'done' || t === 'store') || t in e }; function c (e) { return e !== IDBDatabase.prototype.transaction || 'objectStoreNames' in IDBTransaction.prototype ? (t || (t = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])).includes(e) ? function (...t) { return e.apply(l(this), t), u(n.get(this)) } : function (...t) { return u(e.apply(l(this), t)) } : function (t, ...n) { const r = e.call(l(this), t, ...n); return o.set(r, t.sort ? t.sort() : [t]), u(r) } } function d (t) { return typeof t === 'function' ? c(t) : (t instanceof IDBTransaction && (function (e) { if (r.has(e)) return; const t = new Promise((t, n) => { const r = () => { e.removeEventListener('complete', o), e.removeEventListener('error', s), e.removeEventListener('abort', s) }; const o = () => { t(), r() }; const s = () => { n(e.error || new DOMException('AbortError', 'AbortError')), r() }; e.addEventListener('complete', o), e.addEventListener('error', s), e.addEventListener('abort', s) }); r.set(e, t) }(t)), n = t, (e || (e = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])).some(e => n instanceof e) ? new Proxy(t, i) : t); var n } function u (e) { if (e instanceof IDBRequest) return (function (e) { const t = new Promise((t, n) => { const r = () => { e.removeEventListener('success', o), e.removeEventListener('error', s) }; const o = () => { t(u(e.result)), r() }; const s = () => { n(e.error), r() }; e.addEventListener('success', o), e.addEventListener('error', s) }); return t.then(t => { t instanceof IDBCursor && n.set(t, e) }).catch(() => {}), a.set(t, e), t }(e)); if (s.has(e)) return s.get(e); const t = d(e); return t !== e && (s.set(e, t), a.set(t, e)), t } const l = e => a.get(e); function f (e, t, { blocked: n, upgrade: r, blocking: o, terminated: s } = {}) { const a = indexedDB.open(e, t); const i = u(a); return r && a.addEventListener('upgradeneeded', e => { r(u(a.result), e.oldVersion, e.newVersion, u(a.transaction), e) }), n && a.addEventListener('blocked', e => n(e.oldVersion, e.newVersion, e)), i.then(e => { s && e.addEventListener('close', () => s()), o && e.addEventListener('versionchange', e => o(e.oldVersion, e.newVersion, e)) }).catch(() => {}), i } function p (e, { blocked: t } = {}) { const n = indexedDB.deleteDatabase(e); return t && n.addEventListener('blocked', e => t(e.oldVersion, e)), u(n).then(() => {}) } const D = ['get', 'getKey', 'getAll', 'getAllKeys', 'count']; const v = ['put', 'add', 'delete', 'clear']; const b = new Map(); function I (e, t) { if (!(e instanceof IDBDatabase) || t in e || typeof t !== 'string') return; if (b.get(t)) return b.get(t); const n = t.replace(/FromIndex$/, ''); const r = t !== n; const o = v.includes(n); if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !o && !D.includes(n)) return; const s = async function (e, ...t) { const s = this.transaction(e, o ? 'readwrite' : 'readonly'); let a = s.store; return r && (a = a.index(t.shift())), (await Promise.all([a[n](...t), o && s.done]))[0] }; return b.set(t, s), s }i = (e => ({ ...e, get: (t, n, r) => I(t, n) || e.get(t, n, r), has: (t, n) => !!I(t, n) || e.has(t, n) }))(i); export { p as deleteDB, f as openDB, l as unwrap, u as wrap }; export default null
// # sourceMappingURL=/sm/0ecc1ee212c4ceef77427983aa99400261b08fb9b998f490bf0d417faadfc3ab.map
