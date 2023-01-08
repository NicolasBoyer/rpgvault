import { Utils } from '../../classes/utils.js'
import { InputDrawer } from '../../classes/InputDrawer.js'
import { ElementMover } from '../../classes/ElementMover.js'
import Datas from './datas.js'
import States from './states.js'
import View from './view.js'
import Sheet from './sheet.js'
import { ElementResizer } from '../../classes/ElementResizer.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'input
 */
export default class Input {
	static selectedInput

	static add () {
		States.displayEditBlock(false)
		InputDrawer.init(Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent) => {
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
		View.render()
	}

	static clone (pEvent, input) {
		Datas.addInputValues({ ...input, id: Utils.generateId().toString() })
		this.select(pEvent, input)
	}

	static select (pEvent, pInput) {
		if (States.editMode) {
			if (pEvent) pEvent.stopPropagation()
			this.selectedInput = pInput?.id
			View.render()
			if (pInput) {
				ElementMover.init(document.querySelector(`label[for='${pInput.id}']`), {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => Datas.addInputValues(pInput, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)))
				ElementResizer.init(document.querySelector(`label[for='${pInput.id}']`), {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					console.log(pMousePosition)
					Datas.addInputValues(pInput, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
				})
			}
		}
	}
}
