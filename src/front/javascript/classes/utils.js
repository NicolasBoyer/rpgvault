import { html, render } from '../thirdParty/litHtml.js'
import { Dom } from './dom.js'
import { Caches } from './caches.js'

export class Utils {
	static helpers ({ confirmMessage = '', cbConfirm = null, isConfirmInit = true, loaderVisible = false } = {}) {
		render(html`
			<fs-loader ?visible="${loaderVisible}"></fs-loader>
			<fs-confirm .message="${confirmMessage}" ?open="${isConfirmInit ? !isConfirmInit : Math.random()}" @modalConfirm="${() => cbConfirm()}"></fs-confirm>
		`, document.body)
	}

	static loader (visible) {
		this.helpers({ loaderVisible: visible })
	}

	static confirm (message, cbConfirm, isInit) {
		this.helpers({ confirmMessage: message, cbConfirm, isConfirmInit: false })
	}

	static toast (type, message) {
		const bd = Dom.newDom(document.body)
		bd.elt('fs-toast').att('type', type).att('message', message)
	}

	static async request (pUrl, pMethod = 'GET', pOptions, pReturnType) {
		const response = await fetch(pUrl, { ...{ method: pMethod }, ...pOptions })
		if (pReturnType === 'status' && pMethod === 'HEAD') return response.status
		if (response.status !== 200 && response.status !== 204) {
			// eslint-disable-next-line no-console
			console.error('Request failed : ' + response.status)
			// eslint-disable-next-line no-console
			console.log(response)
		} else {
			switch (pReturnType) {
				case 'blob':
					return response.blob()
				case 'text':
					return response.text()
				case 'response':
					return response
				default:
					return response.json()
			}
		}
	}

	static async getFragmentHtml (pUrl) {
		const fragment = Caches.get(pUrl) || await Utils.request(pUrl, 'POST')
		Caches.set(pUrl, fragment)
		return fragment
	}

	static generateId () {
		return new Date().getTime()
	}

	static getMousePosition () {
		return { x: mouseX, y: mouseY }
	}

	static async getFileFromFileReader (pFile) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.addEventListener('load', () => resolve(reader.result))
			reader.addEventListener('error', () => reject)
			reader.readAsDataURL(pFile)
		})
	}

	static slugify (pStr) {
		const a = 'ãàáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/-,:;'
		const b = 'aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh______'
		const p = new RegExp(a.split('').join('|'), 'g')

		return pStr.toString().toLowerCase()
			.replace(/\s+/g, '_') // Replace spaces with _
			.replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special chars
			.replace(/&/g, '_and_') // Replace & with 'and'
			// eslint-disable-next-line no-useless-escape
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			// eslint-disable-next-line no-useless-escape
			.replace(/--+/g, '_') // Replace multiple - with single _
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, '') // Trim - from end of text
	}
}

let mouseX = 0
let mouseY = 0
document.body.addEventListener('pointermove', (pEvent) => {
	mouseX = pEvent.pageX + window.scrollX
	mouseY = pEvent.pageY + window.scrollY
})
