import { deleteDB, openDB } from '../thirdParty/idb.js'

const indexedDBCaches = []

export class Caches {
	static async set (...args) {
		for (let i = 0; i < args.length; i++) {
			const maxStorageSize = 1024 * 1024 * 5 - JSON.stringify(sessionStorage).length
			const storage = JSON.stringify(args[i + 1])
			if (storage && storage.length >= maxStorageSize) {
				const db = await openDB(args[i], 1, { upgrade: (db) => db.createObjectStore(args[i]) })
				indexedDBCaches.push(args[i])
				const transaction = db.transaction(args[i], 'readwrite')
				const objectStore = transaction.objectStore(args[i])
				await objectStore.put(args[i + 1], args[i])
				db.close()
				return
			}
			if (i % 2 === 0) sessionStorage.setItem(args[i], storage)
		}
	}

	static async get (...args) {
		try {
			let datas = []
			const databases = await indexedDB.databases()
			for (const arg of args) {
				if (databases.map((db) => db.name).includes(arg)) {
					const db = await openDB(arg, 1)
					datas.push(await db.transaction(arg).objectStore(arg).get(arg))
				} else datas.push(JSON.parse(sessionStorage.getItem(arg)))
			}
			datas = datas.filter((pEntry) => pEntry)
			return datas.length === 1 && datas.length === args.length ? datas[0] : datas.length && datas.length === args.length ? datas : null
		} catch (e) {
			alert(e)
		}
	}
}

// eslint-disable-next-line func-call-spacing
window.addEventListener('beforeunload', () => indexedDBCaches.forEach((dbName) => deleteDB(dbName)))

/**
	 * Polyfill for indexedDB.databases()
	 * Safari and some other older browsers that support indexedDB do NOT
	 * Support enumerating existing databases. This is problematic when it
	 * comes time to cleanup, otherwise we could litter their device with
	 * unreferenceable database handles forcing a nuclear browser clear all history.
	 */

// eslint-disable-next-line no-unexpected-multiline
(function () {
	if (window.indexedDB && typeof window.indexedDB.databases === 'undefined') {
		const LOCALSTORAGE_CACHE_KEY = 'indexedDBDatabases'

		// Store a key value map of databases
		const getFromStorage = () =>
			JSON.parse(window.localStorage[LOCALSTORAGE_CACHE_KEY] || '{}')

		// Write the database to local storage
		const writeToStorage = value =>
			(window.localStorage[LOCALSTORAGE_CACHE_KEY] = JSON.stringify(value))

		IDBFactory.prototype.databases = () =>
			Promise.resolve(
				Object.entries(getFromStorage()).reduce((acc, [name, version]) => {
					acc.push({ name, version })
					return acc
				}, [])
			)

		// Intercept the existing open handler to write our DBs names
		// and versions to localStorage
		const open = IDBFactory.prototype.open

		IDBFactory.prototype.open = function (...args) {
			const dbName = args[0]
			const version = args[1] || 1
			const existing = getFromStorage()
			writeToStorage({ ...existing, [dbName]: version })
			return open.apply(this, args)
		}

		// Intercept the existing deleteDatabase handler remove our
		// dbNames from localStorage
		const deleteDatabase = IDBFactory.prototype.deleteDatabase

		IDBFactory.prototype.deleteDatabase = function (...args) {
			const dbName = args[0]
			const existing = getFromStorage()
			delete existing[dbName]
			writeToStorage(existing)
			return deleteDatabase.apply(this, args)
		}
	}
})()
