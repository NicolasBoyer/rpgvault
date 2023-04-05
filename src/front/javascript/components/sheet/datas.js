import { Utils } from '../../classes/utils.js'
import States from './states.js'
import View from './view.js'
import { Caches } from '../../classes/caches.js'

/**
 * Fonctions permettant de gérer les données.
 * Initialisation, Changement de valeurs ou enregistrement.
 */
export default class Datas {
	static sheet
	static changedInputs
	static changedImages
	static deletedInputs
	static deletedImages
	static sheetProperties
	static isSaving = false
	static #id

	static async init () {
		Utils.loader(true)
		const splitUrl = location.pathname.split('/')
		const sheets = await Caches.get('sheets') || await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' })
		Caches.set(true, 'sheets', sheets)
		this.sheet = sheets.find((pSheet) => pSheet.slug === splitUrl[splitUrl.length - 1])
		// TODO si pas de sheet retourner une 404
		this.#id = this.sheet._id
		this.sheet = await Caches.get(this.#id) || this.sheet
		await this.#cacheResources()
	}

	static async addAndSaveInput (pInput, ...args) {
		this.addInputValues(pInput, ...args)
		await this.save(pInput)
	}

	static async saveNotepad (text) {
		this.sheet.notepad = text
		this.sheetProperties = [{ setNotepad: { text } }]
		await this.save()
	}

	static addInputValues (pInput, ...args) {
		for (let i = 0; i < args.length; i++) {
			const value = args[i + 1]
			if (i % 2 === 0) pInput[args[i]] = Number(value) || value
		}
		let index
		if (!this.sheet.inputs) this.sheet.inputs = []
		if (States.editMode) {
			index = this.changedInputs.findIndex((input) => input.id === pInput.id)
			this.changedInputs[index !== -1 ? index : this.changedInputs.length || 0] = pInput
		}
		index = this.sheet.inputs.findIndex((input) => input.id === pInput.id)
		this.sheet.inputs[index !== -1 ? index : this.sheet.inputs.length || 0] = pInput
		States.isSaved = false
		View.render()
	}

	static async addImageValues (pImage, ...args) {
		for (let i = 0; i < args.length; i++) {
			const value = args[i + 1]
			if (i % 2 === 0) pImage[args[i]] = Number(value) || value
		}
		let index
		if (States.editMode) {
			index = this.changedImages.findIndex((image) => image.id === pImage.id)
			this.changedImages[index !== -1 ? index : this.changedImages.length || 0] = pImage
		}
		if (!Datas.sheet.images) Datas.sheet.images = []
		index = this.sheet.images.findIndex((image) => image.id === pImage.id)
		if (pImage.file) pImage.image = await Utils.getBase64FromFileReader(pImage.file)
		this.sheet.images[index !== -1 ? index : this.sheet.images.length || 0] = pImage
		States.isSaved = false
		View.render()
	}

	static async #cacheResources () {
		const cache = await Caches.get(this.#id)
		if (Utils.isValidHttpUrl(this.sheet.backgroundImage)) {
			this.sheet.backgroundImage_url = this.sheet.backgroundImage
			if (cache && cache.backgroundImage_url !== this.sheet.backgroundImage || !cache) this.sheet.backgroundImage = await Utils.urlToBase64(this.sheet.backgroundImage)
		}
		for (let i = 0; i < this.sheet.images.length; i++) {
			const image = this.sheet.images[i]
			if (Utils.isValidHttpUrl(image.image)) {
				image.image_url = image.image
				if (cache && cache.images[i].image_url !== image.image || !cache) image.image = await Utils.urlToBase64(image.image)
			}
		}
		for (let i = 0; i < this.sheet.fonts.length; i++) {
			const font = this.sheet.fonts[i]
			if (Utils.isValidHttpUrl(font.fontUrl)) {
				font.fontUrl_url = font.fontUrl
				if (cache && cache.fonts[i].fontUrl_url !== font.fontUrl || !cache) font.fontUrl = await Utils.urlToBase64(font.fontUrl)
			}
		}
		Caches.set(true, this.#id, this.sheet)
	}

	static async save (pInput) {
		this.isSaving = true
		const body = []
		const inputs = pInput ? [pInput] : this.changedInputs
		inputs?.forEach((pInput) => {
			body.push({
				setInput: {
					id: this.#id,
					inputId: pInput.id,
					input: pInput
				}
			})
		})
		if (!pInput) {
			this.deletedInputs?.forEach((pInputId) => {
				body.push({
					deleteInput: {
						id: this.#id,
						inputId: pInputId
					}
				})
			})
			if (this.changedImages) {
				for (const image of this.changedImages) {
					if (image.file) {
						image.image = await Utils.uploadFileAndGetUrl(image.file)
						delete image.file
					} else {
						image.image = image.image_url
						delete image.image_url
					}
					body.push({
						setImage: {
							id: this.#id,
							imageId: image.id,
							image: image
						}
					})
				}
			}
			this.deletedImages?.forEach((pImageId) => {
				body.push({
					deleteImage: {
						id: this.#id,
						imageId: pImageId
					}
				})
			})
			for (const property of this.sheetProperties) {
				const value = Object.values(property)[0]
				if (Object.keys(property)[0] === 'setBackgroundImage') value.image = await Utils.uploadFileAndGetUrl(value.image)
				if (Object.keys(property)[0] === 'setFont') value.fontUrl = await Utils.uploadFileAndGetUrl(value.fontUrl, value.name)
				value.id = this.#id
				body.push(property)
			}
		}
		let sheets = await Utils.request('/db', 'POST', { body: JSON.stringify(body) })
		sheets = sheets.pop()
		this.sheet = sheets.find((pSheet) => pSheet._id === this.#id)
		await Caches.set(true, 'sheets', sheets)
		await this.#cacheResources()
		this.isSaving = false
		States.isSaved = true
	}
}
