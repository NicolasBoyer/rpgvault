import { Utils } from '../../classes/utils.js'
import { Drawer } from '../../classes/drawer.js'
import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { ElementManager } from '../../classes/elementManager.js'
import { TElement, TCheckbox, HTMLElementEvent } from '../../types.js'
import { EElementType } from '../../enum.js'
import { html } from 'lit'

/**
 * Contient toutes les fonctions relatives aux possibilités de la checkbox
 */
export default class Checkbox {
    static add(): void {
        States.displayEditBlock(false)
        Drawer.init(<HTMLElement>Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent): Promise<void> => {
            const checkbox = {
                id: Utils.generateId().toString(),
                elementType: EElementType.checkbox,
                color: '#00000',
                checked: true,
            }
            let file: File
            Utils.confirm(
                html`
                    <label for="file">
                        <span>Choisissez une image</span>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept="image/png, image/jpeg, image/svg+xml"
                            @change="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => {
                                file = (pEvent.target.files as FileList)[0]
                            }}"
                        />
                    </label>
                `,
                async (): Promise<void> => {
                    await Datas.addCheckboxValues(
                        <TCheckbox>checkbox,
                        'x',
                        Math.round(pMousePosition.startX / Sheet.ratio),
                        'y',
                        Math.round(pMousePosition.startY / Sheet.ratio),
                        'width',
                        Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio),
                        'height',
                        Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio),
                        'file',
                        file
                    )
                    ElementManager.select(pEvent, <TElement>checkbox)
                    States.displayEditBlock(true)
                    States.isSaved = false
                },
                (): void => States.displayEditBlock(true)
            )
        })
    }
}
