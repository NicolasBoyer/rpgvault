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
	static images
	static isSaving = false
	static #id

	static async init () {
		Utils.loader(true)
		const splitUrl = location.pathname.split('/')
		const sheets = await Caches.get('sheets') || await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' })
		Caches.set('sheets', sheets)
		this.sheet = sheets.find((pSheet) => pSheet.slug === splitUrl[splitUrl.length - 1])
		// TODO si pas de sheet retourner une 404
		this.#id = this.sheet._id
		this.images = await Caches.get('images') || {}
		await this.cacheImages()
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

	static addImageValues (pImage, ...args) {
		for (let i = 0; i < args.length; i++) {
			const value = args[i + 1]
			if (i % 2 === 0) pImage[args[i]] = Number(value) || value
		}
		let index
		if (!this.images[this.#id].images) this.images[this.#id].images = []
		if (States.editMode) {
			index = this.changedImages.findIndex((image) => image.id === pImage.id)
			this.changedImages[index !== -1 ? index : this.changedImages.length || 0] = pImage
		}
		index = this.images[this.#id].images.findIndex((image) => image.id === pImage.id)
		this.images[this.#id].images[index !== -1 ? index : this.images[this.#id].images.length || 0] = pImage
		States.isSaved = false
		View.render()
	}

	static async cacheImages () {
		if (!this.images[this.#id]) this.images[this.#id] = {}
		if (this.sheet.backgroundImage && (!this.images[this.#id].backgroundImage || this.images[this.#id].backgroundImageUrl !== this.sheet.backgroundImage)) {
			this.images[this.#id].backgroundImageUrl = this.sheet.backgroundImage
			this.images[this.#id].backgroundImage = await Utils.urlToBase64(this.sheet.backgroundImage)
		}
		if (!this.images[this.#id].images) this.images[this.#id].images = []
		for (const image of this.sheet.images) {
			image.imageUrl = image.image
			image.image = await Utils.urlToBase64(image.image)
			const index = this.images[this.#id].images.findIndex((pImage) => pImage.id === image.id)
			if (index === -1) this.images[this.#id].images.push(image)
			else this.images[this.#id].images[index] = image
		}
		Caches.set('images', this.images)
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
			for (const image of this.changedImages) {
				image.image = image.imageUrl || await Utils.uploadImageAndGetUrl(image.file)
				delete image.file
				delete image.imageUrl
				body.push({
					setImage: {
						id: this.#id,
						imageId: image.id,
						image: image
					}
				})
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
				if (Object.keys(property)[0] === 'setBackgroundImage') value.image = await Utils.uploadImageAndGetUrl(value.image)
				value.id = this.#id
				body.push(property)
			}
		}
		let sheets = await Utils.request('/db', 'POST', { body: JSON.stringify(body) })
		sheets = sheets.pop()
		this.sheet = sheets.find((pSheet) => pSheet._id === this.#id)
		await Caches.set('sheets', sheets)
		await this.cacheImages()
		this.isSaving = false
		States.isSaved = true
	}
}
