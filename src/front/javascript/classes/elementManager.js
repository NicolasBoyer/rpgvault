import { ShortcutManager } from './shortcutManager.js'
import { ElementResizer } from './elementResizer.js'
import States from '../components/sheet/states.js'
import Sheet from '../components/sheet/sheet.js'
import { Utils } from './utils.js'
import Datas from '../components/sheet/datas.js'
import View from '../components/sheet/view.js'
import { Caches } from './caches.js'
import { ElementMover } from './elementMover.js'

export class ElementManager {
	static #elementType
	static selectedElementId

	static delete (pElementId) {
		if (this.#elementType === 'input') {
			const index = Datas.sheet.inputs.findIndex((input) => input.id === pElementId)
			if (index !== -1) {
				Datas.sheet.inputs.splice(index, 1)
				Datas.deletedInputs.push(pElementId)
			}
		}
		if (this.#elementType === 'image') {
			const index = Datas.sheet.images.findIndex((image) => image.id === pElementId)
			if (index !== -1) {
				Datas.sheet.images.splice(index, 1)
				Datas.deletedImages.push(pElementId)
			}
		}
		States.isSaved = false
		View.render()
	}

	static clone (pEvent, pElement) {
		if (this.#elementType === 'input') {
			Datas.addInputValues({ ...pElement, id: Utils.generateId().toString() })
		}
		if (this.#elementType === 'image') {
			Datas.addImageValues({ ...pElement, id: Utils.generateId().toString() })
		}
		this.select(pEvent, pElement)
	}

	static copy (pEvent, pElement) {
		Caches.set('elementDatas', pElement)
	}

	static async paste (pEvent) {
		const mousePosition = Utils.getMousePosition()
		const element = { ...(await Caches.get('elementDatas')), x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio), y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio), id: Utils.generateId().toString() }
		if (this.#elementType === 'input') {
			Datas.addInputValues(element)
		}
		if (this.#elementType === 'image') {
			Datas.addImageValues(element)
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
				this.#elementType = selectedElement.tagName === 'LABEL' ? 'input' : 'image'
				ElementMover.init(selectedElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					if (this.#elementType === 'input') {
						Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
					}
					if (this.#elementType === 'image') {
						Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
					}
				})
				ElementResizer.init(selectedElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					if (this.#elementType === 'input') {
						Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
					}
					if (this.#elementType === 'image') {
						Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
					}
				})
				ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent) => this.clone(pEvent, pElement))
				ShortcutManager.set(selectedElement, ['Control', 'c'], (pEvent) => this.copy(pEvent, pElement))
				ShortcutManager.set(document.body, ['Control', 'v'], (pEvent) => this.paste(pEvent))
				ShortcutManager.set(selectedElement, ['Delete'], () => this.delete(this.selectedElementId))
			}
		}
	}
}
