import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { html } from '../../thirdParty/litHtml.js'
import { ElementManager } from '../../classes/elementManager.js'
import { ElementMover } from '../../classes/elementMover.js'
import Input from './input.js'
import Image from './image.js'
import { elements } from '../../datas/elements.js'

/**
 * Contient toutes les fonctions relatives à l'interface et son rendu
 */
export default class Interface {
	static #initializeMove (pElement) {
		if (States.interface === 'visible' && States.editMode && pElement) {
			ElementMover.init(pElement, {
				x: Sheet.containerLeft,
				y: Sheet.containerTop
			}, (pMousePosition) => {
				console.log(pMousePosition)
				// if (this.#elementType === 'input') {
				//	Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
				// }
				// if (this.#elementType === 'image') {
				//	Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
				// }
			}, pElement)
		}
	}

	static viewBlock () {
		return html`
			<div class="viewBlock">
				<a href="#" role="button" class="viewSelection ${States.interface === 'hover' ? 'selected' : ''}" @click="${(pEvent) => {
			pEvent.preventDefault()
			States.interface = 'hover'
		}}" title="Interface sur demande">
					<svg class="eye-plus">
						<use href="#eye-plus"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === 'visible' ? 'selected' : ''}" @click="${(pEvent) => {
			pEvent.preventDefault()
			States.interface = 'visible'
		}}" title="Interface toujours visible">
					<svg class="eye">
						<use href="#eye"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === 'hidden' ? 'selected' : ''}" @click="${(pEvent) => {
			pEvent.preventDefault()
			States.interface = 'hidden'
		}}" title="Interface cachée">
					<svg class="eye-blocked">
						<use href="#eye-blocked"></use>
					</svg>
				</a>
				<a href="#" role="button" ?disabled="${States.isSaved}" class="saveButton" @click="${async (pEvent) => {
			pEvent.preventDefault()
			await Datas.save()
			this.render()
		}}" title="Sauvegarder">
					<svg class="floppy">
						<use href="#floppy"></use>
					</svg>
				</a>
			</div>
		`
	}

	static editBlock () {
		if (States.interface === 'visible') setTimeout(() => this.#initializeMove(document.querySelector('.editBlock')))
		return html`
			<article .hidden="${States.isEditBlockHidden}" class="editBlock" id="editBlock">
				${States.interface !== 'hidden' ? this.viewBlock() : ''}
				<button class="contrast" @click="${() => Sheet.editBackgroundImage()}">Image de fond</button>
				<button class="contrast" @click="${() => Sheet.changeBackgroundColor()}">Couleur du fond</button>
				<button class="contrast" @click="${() => Sheet.addFont()}">Ajouter une police</button>
				<button class="contrast" @click="${() => Sheet.deleteFont()}">Supprimer une police</button>
				<button class="contrast" @click="${() => Input.add()}">Ajouter un champ</button>
				<button class="contrast" @click="${() => Image.add()}">Ajouter une image</button>
				<div class="validBlock">
					<button @click="${() => {
			States.displayEditMode(false)
		}}">Annuler
					</button>
					<button class="save" @click="${async () => {
			await Datas.save()
			States.displayEditMode(false)
		}}">Enregistrer et fermer
						<fs-loader ?visible="${Datas.isSaving}"></fs-loader>
					</button>
				</div>
			</article>
		`
	}

	static selectBlock (pElement) {
		if (States.interface === 'visible') setTimeout(() => this.#initializeMove(document.querySelector('.selectBlock')))
		return html`
			<article id="selectBlock" class="selectBlock" @click="${(pEvent) => pEvent.stopPropagation()}">
				<a href="#" role="button" class="cloneInput" @click="${(pEvent) => {
			pEvent.preventDefault()
			ElementManager.clone(pEvent, pElement)
		}}" title="Dupliquer (ctrl D)">
					<svg class="clone">
						<use href="#clone"></use>
					</svg>
				</a>
				<a href="#" role="button" class="deleteInput" @click="${(pEvent) => {
			pEvent.preventDefault()
			ElementManager.delete(pElement.id)
		}}" title="Supprimer (Suppr)">
					<svg class="trash">
						<use href="#trash"></use>
					</svg>
				</a>
				${elements(pElement, Datas.sheet.fonts?.map((pFont) => ({ name: pFont.fontFamily, value: pFont.fontFamily }))).filter((pEntry) => pElement.type || pElement.image && pElement[pEntry.id]).map((pEntry) => html`
					<fs-label
							id="${pEntry.id}"
							type="${pEntry.type}"
							name="${pEntry.name}"
							value="${pEntry.value}"
							@input="${(pEvent) => Datas.addInputValues(pElement, pEntry.id, pEvent.target.value)}"
							options="${JSON.stringify(pEntry.options)}"
					></fs-label>
				`)}
			</article>
		`
	}
}
