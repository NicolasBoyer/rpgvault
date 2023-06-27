import { ShortcutManager } from './shortcutManager.js'
import States from '../components/sheet/states.js'
import Sheet from '../components/sheet/sheet.js'
import { Utils } from './utils.js'
import Datas from '../components/sheet/datas.js'
import View from '../components/sheet/view.js'
import { Caches } from './caches.js'
import { ElementMover } from './elementMover.js'
import { ElementResizer } from './elementResizer.js'

export class ElementManager {
	// TODO a supprimer car le selected element change à chaque fois ou déclarer le selectedelement ailleur
	// static #elementType
	static selectedElementId

	static init () {
		Datas.sheet.inputs?.concat(Datas.sheet.images).forEach((pElement) => {
			const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
			// TODO marche mais voir si on peut faire mieux l'idée ne passer qu'une fois
			if (!selectedElement.getAttribute('data-movable')) {
				ElementMover.init(selectedElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					// TODO pb car à chaque déplacement crée une image
					if (selectedElement.tagName === 'LABEL') {
						Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
					}
					if (selectedElement.tagName === 'div') {
						Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
					}
				})
				// TODO la fonction est appelé à chaque render il faut donc soir la limiter avec une variable soit l'appeler à un endroit qui ne l'appelle qu'une fois
				// TODO ICI reste réparation de resizer et revues code comme move + changer ici le selected element qui n'est plus utilisé + voir si je déplace l'appel de cet init ailleurs ...
				// Problème une image est créé suite à chaque déplacement
				ElementResizer.init(selectedElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					if (selectedElement.tagName === 'input') {
						Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
					}
					if (selectedElement.tagName === 'image') {
						Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
					}
				})
				selectedElement.setAttribute('data-movable', 'true')
			}
		})
	}

	static delete (pElementId) {
		const selectedElement = document.querySelector(`label[for='${pElementId}'], div[id='${pElementId}']`)
		if (selectedElement?.tagName === 'LABEL') {
			const index = Datas.sheet.inputs.findIndex((input) => input.id === pElementId)
			if (index !== -1) {
				Datas.sheet.inputs.splice(index, 1)
				Datas.deletedInputs.push(pElementId)
			}
		}
		if (selectedElement?.tagName === 'div') {
			const index = Datas.sheet.images.findIndex((image) => image.id === pElementId)
			if (index !== -1) {
				Datas.sheet.images.splice(index, 1)
				Datas.deletedImages.push(pElementId)
			}
		}
		States.isSaved = false
		View.render()
	}

	static async clone (pEvent, pElement) {
		const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
		if (selectedElement.tagName === 'LABEL') {
			Datas.addInputValues({ ...pElement, id: Utils.generateId().toString() })
		}
		if (selectedElement.tagName === 'div') {
			await Datas.addImageValues({ ...pElement, id: Utils.generateId().toString() })
		}
		this.select(pEvent, pElement)
	}

	static copy (pEvent, pElement) {
		Caches.set(false, 'elementDatas', pElement)
	}

	static async paste (pEvent) {
		const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
		const mousePosition = Utils.getMousePosition()
		const element = { ...(await Caches.get('elementDatas')), x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio), y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio), id: Utils.generateId().toString() }
		if (selectedElement.tagName === 'LABEL') {
			Datas.addInputValues(element)
		}
		if (selectedElement.tagName === 'div') {
			await Datas.addImageValues(element)
		}
		this.select(pEvent, element)
	}

	static select (pEvent, pElement) {
		if (States.editMode) {
			if (pEvent) pEvent.stopPropagation()
			this.selectedElementId = pElement?.id
			View.render()
			if (pElement) {
				const selectedElement = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
				// this.#elementType = selectedElement.tagName === 'LABEL' ? 'input' : 'image'
				// ElementMover.init(selectedElement, {
				//	x: Sheet.containerLeft,
				//	y: Sheet.containerTop
				// }, (pMousePosition) => {
				//	if (this.#elementType === 'input') {
				//		Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
				//	}
				//	if (this.#elementType === 'image') {
				//		Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
				//	}
				// })
				// ElementResizer.init(selectedElement, {
				//	x: Sheet.containerLeft,
				//	y: Sheet.containerTop
				// }, (pMousePosition) => {
				//	if (this.#elementType === 'input') {
				//		Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
				//	}
				//	if (this.#elementType === 'image') {
				//		Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
				//	}
				// })
				ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent) => this.clone(pEvent, pElement))
				ShortcutManager.set(selectedElement, ['Control', 'c'], (pEvent) => this.copy(pEvent, pElement))
				ShortcutManager.set(document.body, ['Control', 'v'], (pEvent) => this.paste(pEvent))
				ShortcutManager.set(selectedElement, ['Delete'], () => this.delete(this.selectedElementId))
			}
		}
	}
}
