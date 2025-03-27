import { Utils } from '../../classes/utils.js'
import { Drawer } from '../../classes/drawer.js'
import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { ElementManager } from '../../classes/elementManager.js'
import { TElement, TInput } from '../../types.js'
import { EElementType } from '../../enum.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'input
 */
export default class Input {
    static add(): void {
        States.displayEditBlock(false)
        Drawer.init(<HTMLElement>Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent): Promise<void> => {
            States.displayEditBlock(true)
            const inputId = Utils.generateId().toString()
            const input = {
                id: inputId,
                type: 'text',
                elementType: EElementType.input,
                textAlign: 'left',
                color: '#000000',
                fontSize: 10,
                fontFamily: 'inherit',
            }
            await Datas.addInputValues(
                <TInput>input,
                'x',
                Math.round(pMousePosition.startX / Sheet.ratio),
                'y',
                Math.round(pMousePosition.startY / Sheet.ratio),
                'width',
                Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio),
                'height',
                Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio)
            )
            ElementManager.select(pEvent, <TElement>input)
        })
    }
}
