import {Utils} from './utils.js'
import {mimetype, Server} from './server.js'
import Database from './database.js'
import http from 'http'

export default class Routes {
    routes: Record<string, string>[] = []

    constructor(pServer: Server) {
        this.request(pServer, '/', 'home.html', 'home', '', true)

        this.request(pServer, '/sheets/:id', 'sheet.html', 'sheet', '', true)

        pServer.get('/app/routes.json', async (_req?: http.IncomingMessage, res?: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }): Promise<void> => {
            res?.end(JSON.stringify(this.routes))
        }, mimetype.JSON)

        pServer.post('/db', async (_req?: http.IncomingMessage, res?: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }): Promise<void> => {
            let body = ''
            _req?.on('data', (pChunk: string): void => {
                body += pChunk
            })
            _req?.on('end', async (): Promise<http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }> => res!.end(JSON.stringify(await Database.request(JSON.parse(body)))))
        })

        pServer.post('/auth', async (_req?: http.IncomingMessage, res?: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }): Promise<void> => {
            let body = ''
            _req?.on('data', (pChunk: string): void => {
                body += pChunk
            })
            _req?.on('end', async (): Promise<void> => {
                const json = JSON.parse(body)
                const credentials = `${json.id}:${json.password}`
                if (await Database.auth(credentials)) res?.writeHead(200, {'Set-Cookie': `_ma=${Utils.crypt(credentials)}; expires=Tue, 19 Jan 2038 03:14:07 GMT`})
                res?.end(JSON.stringify('{}'))
            })
        })
    }

    /**
     * Permet de faire un GET et un POST en même temps sur un fichier
     * GET : retourne une page html
     * POST : retourne un JSON contenant un fragment html, une classe et un titre
     */
    private request(pServer: Server, pPath: string, pFile: string, pClassName: string, pTitle: string, pAddSlashOnUrl: boolean, pLabel = ''): void {
        if (pLabel) {
            this.routes.push({
                path: pPath,
                className: pClassName,
                title: pTitle,
                label: pLabel
            })
        }

        if (pAddSlashOnUrl) {
            pServer.get(`${pPath}/`, async (_req?: http.IncomingMessage, res?: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }): Promise<void> => {
                res?.end(await Utils.page(pFile, pClassName, pTitle))
            })
        }

        pServer.get(pPath, async (_req?: http.IncomingMessage, res?: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }): Promise<void> => {
            res?.end(await Utils.page(pFile, pClassName, pTitle))
        })

        pServer.post(pPath, async (_req?: http.IncomingMessage, res?: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }): Promise<void> => {
            res?.end(JSON.stringify({text: await Utils.fragment(pFile), class: pClassName, title: pTitle}))
        })
    }
}
