import { Utils } from '../../classes/utils.js'
import { Drawer } from '../../classes/drawer.js'
import Datas from './datas.js'
import States from './states.js'
import View from './view.js'
import Sheet from './sheet.js'
import { ElementResizer } from '../../classes/elementResizer.js'
import { ElementMover } from '../../classes/elementMover.js'
import { ShortcutManager } from '../../classes/shortcutManager.js'
import { Caches } from '../../classes/caches.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'input
 */
export default class Input {
	static selectedInput

	static add () {
		States.displayEditBlock(false)
		Drawer.init(Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent) => {
			States.displayEditBlock(true)
			const inputId = Utils.generateId().toString()
			const input = {
				id: inputId,
				type: 'text'
			}
			await Datas.addInputValues(input, 'x', Math.round(pMousePosition.startX / Sheet.ratio), 'y', Math.round(pMousePosition.startY / Sheet.ratio), 'width', Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio), 'height', Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio))
			this.select(pEvent, input)
		})
	}

	static delete (pInputId) {
		Datas.sheet.inputs.splice(Datas.sheet.inputs.findIndex((input) => input.id === pInputId), 1)
		Datas.deletedInputs.push(pInputId)
		States.isSaved = false
		View.render()
	}

	static clone (pEvent, input) {
		Datas.addInputValues({ ...input, id: Utils.generateId().toString() })
		this.select(pEvent, input)
	}

	static copy (pEvent, input) {
		Caches.set('inputDatas', input)
	}

	static paste (pEvent) {
		const mousePosition = Utils.getMousePosition()
		const input = { ...Caches.get('inputDatas'), x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio), y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio), id: Utils.generateId().toString() }
		Datas.addInputValues(input)
		this.select(pEvent, input)
	}

	static select (pEvent, pInput) {
		if (States.editMode) {
			if (pEvent) pEvent.stopPropagation()
			this.selectedInput = pInput?.id
			View.render()
			if (pInput) {
				const inputElement = document.querySelector(`label[for='${pInput.id}']`)
				ElementMover.init(inputElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => Datas.addInputValues(pInput, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)))
				ElementResizer.init(inputElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					Datas.addInputValues(pInput, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
				})
				ShortcutManager.set(inputElement, ['Control', 'd'], (pEvent) => Input.clone(pEvent, pInput))
				ShortcutManager.set(inputElement, ['Control', 'c'], (pEvent) => Input.copy(pEvent, pInput))
				ShortcutManager.set(document.body, ['Control', 'v'], (pEvent) => Input.paste(pEvent))
				ShortcutManager.set(inputElement, ['Delete'], () => Input.delete(this.selectedInput))
			}
		}
	}
}
