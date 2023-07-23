import {Utils} from '../../classes/utils.js'
import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import {Drawer} from '../../classes/drawer.js'
import {html} from 'lit'
import {ElementManager} from '../../classes/elementManager.js'
import {HTMLElementEvent, TImage} from '../../types.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'image
 */
export default class Image {
    static add(): void {
        States.displayEditBlock(false)
        Drawer.init(<HTMLElement>Sheet.element.querySelector('.wrapper'), {x: Sheet.containerLeft, y: Sheet.containerTop}, async (pMousePosition, pEvent): Promise<void> => {
            const image: TImage = {id: Utils.generateId().toString()}
            let file: File
            Utils.confirm(
                html`
					<label for="file">
						<span>Choisissez un fichier</span>
						<input type="file" id="file" name="file" @change="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => {
        file = (pEvent.target.files as FileList)[0]
    }}">
					</label>
				`,
                async (): Promise<void> => {
                    await Datas.addImageValues(image, 'x', Math.round(pMousePosition.startX / Sheet.ratio), 'y', Math.round(pMousePosition.startY / Sheet.ratio), 'width', Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio), 'height', Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio), 'file', file)
                    ElementManager.select(pEvent, image)
                    States.displayEditBlock(true)
                    States.isSaved = false
                }
            )
        })
    }
}
