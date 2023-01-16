import { Utils } from '../../classes/utils.js'
import { Drawer } from '../../classes/drawer.js'
import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { ElementManager } from '../../classes/elementManager.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'input
 */
export default class Input {
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
			ElementManager.select(pEvent, input)
		})
	}
}
