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
		const fragment = await Caches.get(pUrl) || await Utils.request(pUrl, 'POST')
		Caches.set(false, pUrl, fragment)
		return fragment
	}

	static generateId () {
		return new Date().getTime()
	}

	static getMousePosition () {
		return { x: mouseX, y: mouseY }
	}

	static async getBase64FromFileReader (pFile) {
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

	static replaceChildren (pElement, ...pChildren) {
		if (pElement.replaceChildren) return pElement.replaceChildren(...pChildren)
		pElement.textContent = ''
		for (const child of pChildren) {
			pElement.appendChild(child)
		}
	}

	static urlToBase64 (pUrl) {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise(async (resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result)
			reader.readAsDataURL(await this.request(pUrl, 'GET', null, 'blob'))
		})
	}

	static async uploadFileAndGetUrl (pFile, pName) {
		const formData = new FormData()
		formData.append('file', pFile)
		if (pName) formData.append('public_id', pName)
		formData.append('upload_preset', 'sheetrpg')
		return (await Utils.request('https://api.cloudinary.com/v1_1/elendil/upload', 'POST', { body: formData })).url
	}

	static isValidHttpUrl (pStr) {
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', // fragment locator
			'i'
		)
		return pattern.test(pStr)
	}
}

let mouseX = 0
let mouseY = 0
document.body.addEventListener('pointermove', (pEvent) => {
	mouseX = pEvent.pageX + window.scrollX
	mouseY = pEvent.pageY + window.scrollY
})
