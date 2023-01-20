import { Utils } from '../../classes/utils.js'
import States from './states.js'
import View from './view.js'

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
		const splitUrl = location.pathname.split('/')
		this.sheet = await Utils.request('/db', 'POST', { body: `{ "getSheets": { "slug": "${splitUrl[splitUrl.length - 1]}" } }` })
		// TODO si pas de sheet retourner une 404
		this.#id = this.sheet._id
	}

	static async addAndSaveInput (pInput, ...args) {
		this.addInputValues(pInput, ...args)
		await this.save(pInput)
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
		if (!this.sheet.images) this.sheet.images = []
		if (States.editMode) {
			index = this.changedImages.findIndex((image) => image.id === pImage.id)
			this.changedImages[index !== -1 ? index : this.changedImages.length || 0] = pImage
		}
		index = this.sheet.images.findIndex((image) => image.id === pImage.id)
		this.sheet.images[index !== -1 ? index : this.sheet.images.length || 0] = pImage
		States.isSaved = false
		View.render()
	}

	static async save (pInput) {
		this.isSaving = true
		const body = []
		const inputs = pInput ? [pInput] : this.changedInputs
		inputs.forEach((pInput) => {
			body.push({
				setInput: {
					id: this.#id,
					inputId: pInput.id,
					input: pInput
				}
			})
		})
		if (!pInput) {
			this.deletedInputs.forEach((pInputId) => {
				body.push({
					deleteInput: {
						id: this.#id,
						inputId: pInputId
					}
				})
			})
			this.changedImages.forEach((pImage) => {
				body.push({
					setImage: {
						id: this.#id,
						imageId: pImage.id,
						image: pImage
					}
				})
			})
			this.deletedImages.forEach((pImageId) => {
				body.push({
					deleteImage: {
						id: this.#id,
						imageId: pImageId
					}
				})
			})
			this.sheetProperties.forEach((pProperty) => {
				Object.values(pProperty)[0].id = this.#id
				body.push(pProperty)
			})
		}
		await Utils.request('/db', 'POST', { body: JSON.stringify(body) })
		this.isSaving = false
		States.isSaved = true
	}
}
