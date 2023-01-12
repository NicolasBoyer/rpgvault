import { Utils } from '../../classes/utils.js'
import Datas from './datas.js'
import States from './states.js'
import View from './view.js'
import Sheet from './sheet.js'
import { Caches } from '../../classes/caches.js'
import { Drawer } from '../../classes/drawer.js'
import { html } from '../../thirdParty/litHtml.js'
import { ElementResizer } from '../../classes/elementResizer.js'
import { ElementMover } from '../../classes/elementMover.js'

/**
 * Contient toutes les fonctions relatives aux possibilités de l'image
 */
export default class Image {
	static selectedImage

	// TODO mutualiser input et image ? Faire un truc comme elementMover mais elementManager pour gérer paste etc ?
	// TODO mutualiser les addadats avec input ? Penser à save ...
	// TODO zoom sur image pour voir en grand
	// TODO revoir le code entre image et input
	// Virer le saut lors de la déselection image
	static add () {
		States.displayEditBlock(false)
		Drawer.init(Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent) => {
			States.displayEditBlock(true)
			const image = { id: Utils.generateId().toString() }
			let file
			Utils.confirm(html`
					<label for="file">
						<span>Choisissez un fichier</span>
						<input type="file" id="file" name="file" @change="${(pEvent) => {
				file = pEvent.target.files[0]
			}}">
					</label>
				`, () => {
				const reader = new FileReader()
				reader.addEventListener('load', () => {
					Datas.addImageValues(image, 'x', Math.round(pMousePosition.startX / Sheet.ratio), 'y', Math.round(pMousePosition.startY / Sheet.ratio), 'width', Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio), 'height', Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio), 'image', reader.result)
					this.select(pEvent, image)
					States.isSaved = false
				})
				reader.readAsDataURL(file)
				// View.render()
			})
			// await Datas.addInputValues(input, 'x', Math.round(pMousePosition.startX / Sheet.ratio), 'y', Math.round(pMousePosition.startY / Sheet.ratio), 'width', Math.round(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio), 'height', Math.round(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio))
			// this.select(pEvent, input)
		})
	}

	static delete (pInputId) {
		Datas.sheet.inputs.splice(Datas.sheet.inputs.findIndex((input) => input.id === pInputId), 1)
		Datas.deletedInputs.push(pInputId)
		States.isSaved = false
		View.render()
	}

	static clone (pEvent, input) {
		Datas.addImageValues({ ...input, id: Utils.generateId().toString() })
		this.select(pEvent, input)
	}

	static copy (pEvent, input) {
		Caches.set('inputDatas', input)
	}

	static paste (pEvent) {
		const mousePosition = Utils.getMousePosition()
		const input = { ...Caches.get('inputDatas'), x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio), y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio), id: Utils.generateId().toString() }
		Datas.addImageValues(input)
		this.select(pEvent, input)
	}

	static select (pEvent, pImage) {
		if (States.editMode) {
			if (pEvent) pEvent.stopPropagation()
			this.selectedImage = pImage?.id
			View.render()
			if (pImage) {
				const imageElement = document.querySelector(`div[id='${pImage.id}']`)
				console.log(imageElement)
				ElementMover.init(imageElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => Datas.addImageValues(pImage, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)))
				ElementResizer.init(imageElement, {
					x: Sheet.containerLeft,
					y: Sheet.containerTop
				}, (pMousePosition) => {
					Datas.addImageValues(pImage, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
				})
				// ShortcutManager.set(inputElement, ['Control', 'd'], (pEvent) => Input.clone(pEvent, pInput))
				// ShortcutManager.set(inputElement, ['Control', 'c'], (pEvent) => Input.copy(pEvent, pInput))
				// ShortcutManager.set(document.body, ['Control', 'v'], (pEvent) => Input.paste(pEvent))
				// ShortcutManager.set(inputElement, ['Delete'], () => Input.delete(this.selectedInput))
			}
		}
	}
}
