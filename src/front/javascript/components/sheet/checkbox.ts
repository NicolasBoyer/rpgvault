import { Utils } from '../../classes/utils.js'
import { Drawer } from '../../classes/drawer.js'
import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { ElementManager } from '../../classes/elementManager.js'
import { TElement, TCheckbox } from '../../types.js'
import { EElementType } from '../../enum.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'input
 */
export default class Checkbox {
    static add(): void {
        States.displayEditBlock(false)
        Drawer.init(<HTMLElement>Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent): Promise<void> => {
            States.displayEditBlock(true)
            const checkboxId = Utils.generateId().toString()
            const checkbox = {
                id: checkboxId,
                elementType: EElementType.checkbox,
                file: 'blop',
                color: '#00000',
                size: 10,
            }
            await Datas.addInputValues(
                <TCheckbox>checkbox,
                'x',
                Math.round(pMousePosition.startX / Sheet.ratio),
                'y',
                Math.round(pMousePosition.startY / Sheet.ratio),
                'width',
                Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio),
                'height',
                Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio)
            )
            ElementManager.select(pEvent, <TElement>checkbox)
        })
    }
}
