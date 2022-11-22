import { Utils } from './utils.js'
import { mimetype } from './server.js'
import Database from './database.js'

export default class Routes {
	constructor (pServer) {
		this.routes = []

		this.request(pServer, '/', 'home.html', 'home', '', true)

		this.request(pServer, '/sheets/:id', 'sheet.html', 'sheet', '', true)

		// this.request(pServer, '/', 'sheet.html', 'sheet', '', true)

		pServer.get('/app/routes.json', async (req, res) => {
			res.end(JSON.stringify(this.routes))
		}, mimetype.JSON)

		// pServer.get('/app/ingredients.json', async (req, res) => {
		//	res.end(JSON.stringify(await Database.request({ getIngredients: {} })))
		// }, mimetype.JSON)

		pServer.post('/db', async (req, res) => {
			let body = ''
			req.on('data', (pChunk) => {
				body += pChunk
			})
			req.on('end', async () => res.end(JSON.stringify(await Database.request(JSON.parse(body)))))
		})

		pServer.post('/auth', async (req, res) => {
			let body = ''
			req.on('data', (pChunk) => {
				body += pChunk
			})
			req.on('end', async () => {
				const json = JSON.parse(body)
				const credentials = `${json.id}:${json.password}`
				if (await Database.auth(credentials)) res.writeHead(200, { 'Set-Cookie': `_ma=${Utils.crypt(credentials)}; expires=Tue, 19 Jan 2038 03:14:07 GMT` })
				res.end(JSON.stringify('{}'))
			})
		})
	}

	/**
	 * Permet de faire un GET et un POST en même temps sur un fichier
	 * GET : retourne une page html
	 * POST : retourne un JSON contenant un fragment html, une classe et un titre
	 */
	request (pServer, pPath, pFile, pClassName, pTitle, pAddSlashOnUrl, pLabel) {
		if (pLabel) {
			this.routes.push({
				path: pPath,
				className: pClassName,
				title: pTitle,
				label: pLabel
			})
		}

		if (pAddSlashOnUrl) {
			pServer.get(`${pPath}/`, async (req, res) => {
				res.end(await Utils.page(pFile, pClassName, pTitle))
			})
		}

		pServer.get(pPath, async (req, res) => {
			res.end(await Utils.page(pFile, pClassName, pTitle))
		})

		pServer.post(pPath, async (req, res) => {
			res.end(JSON.stringify({ text: await Utils.fragment(pFile), class: pClassName, title: pTitle }))
		})
	}
}
