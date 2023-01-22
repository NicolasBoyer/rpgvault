import { html, render } from '../../thirdParty/litHtml.js'
import { elements } from '../../datas/elements.js'
import Datas from './datas.js'
import States from './states.js'
import Input from './input.js'
import Sheet from './sheet.js'
import { ElementResizer } from '../../classes/elementResizer.js'
import Image from './image.js'
import { ElementManager } from '../../classes/elementManager.js'

/**
 * Fonctions de rendu du composant
 */
export default class View {
	static #viewBlock () {
		return html`
			<div class="viewBlock">
				<a href="#" role="button" class="viewSelection ${States.interface === 'hover' ? 'selected' : ''}" @click="${() => {
			States.interface = 'hover'
		}}" title="Interface sur demande">
					<svg class="eye-plus">
						<use href="#eye-plus"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === 'visible' ? 'selected' : ''}" @click="${() => {
			States.interface = 'visible'
		}}" title="Interface toujours visible">
					<svg class="eye">
						<use href="#eye"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === 'hidden' ? 'selected' : ''}" @click="${() => {
			States.interface = 'hidden'
		}}" title="Interface cachée">
					<svg class="eye-blocked">
						<use href="#eye-blocked"></use>
					</svg>
				</a>
				<a href="#" role="button" ?disabled="${States.isSaved}" class="saveButton" @click="${async () => {
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

	static #editBlock () {
		return html`
			<article .hidden="${States.isEditBlockHidden}" class="editBlock">
				${States.interface !== 'hidden' ? this.#viewBlock() : ''}
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

	static #selectBlock (pElement) {
		return html`
			<article class="selectBlock">
				<a href="#" role="button" class="cloneInput" @click="${(pEvent) => ElementManager.clone(pEvent, pElement)}" title="Dupliquer (ctrl D)">
					<svg class="clone">
						<use href="#clone"></use>
					</svg>
				</a>
				<a href="#" role="button" class="deleteInput" @click="${() => ElementManager.delete(pElement.id)}" title="Supprimer (ctrl C)">
					<svg class="trash">
						<use href="#trash"></use>
					</svg>
				</a>
				${elements(pElement, Datas.sheet.fonts.map((pFont) => ({ name: pFont.fontFamily, value: pFont.fontFamily }))).filter((pEntry) => pElement.type || pElement.image && pElement[pEntry.id]).map((pEntry) => html`
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

	static render () {
		render(html`
			<style>
				${Datas.sheet.fonts?.filter((pFont) => pFont.type === 'google').map((pFont) => `@import url(${pFont.fontUrl});`)}
				${Datas.sheet.fonts?.filter((pFont) => pFont.type === 'file').map((pFont) => `
				@font-face {
				font-family: ${pFont.fontFamily};
				src: url(${pFont.fontUrl});
				}
				`)}
			</style>
				<div style="position: relative;width: ${Sheet.containerWidth};height: ${Sheet.containerHeight};" class="wrapper ${States.editMode && 'editMode'} ${States.interface || 'hover'}" @click="${(pEvent) => {
			if (States.editMode) ElementManager.select(pEvent)
		}}">
				${States.interface === 'hidden' ? this.#viewBlock() : ''}
				${States.editMode ? this.#editBlock() : html`
				`}
				${Datas.sheet.inputs?.map((pInput) => html`
							<label for="${pInput.id}" style="transform: translate(${pInput.x * Sheet.ratio}px, ${pInput.y * Sheet.ratio}px);" class="${ElementManager.selectedElementId === pInput.id ? 'selected' : ''}">
								<span>${pInput.name}</span>
								${pInput.type === 'textarea' ? html`
									<textarea
											id="${pInput.id}"
											name="${pInput.id}"
											style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height * Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
											@change="${(pEvent) => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${States.editMode}"
											@click="${(pEvent) => ElementManager.select(pEvent, pInput)}"
									>${pInput.value}</textarea>
								` : html`
									<input
											type="${pInput.type}"
											id="${pInput.id}"
											name="${pInput.id}"
											value="${pInput.value}"
											style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height * Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
											@change="${(pEvent) => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${States.editMode}"
											@click="${(pEvent) => ElementManager.select(pEvent, pInput)}"
									/>
								`}
								${ElementManager.selectedElementId === pInput.id ? ElementResizer.boxPositions.map((pBoxPosition) => html`<div class="resizeHandler ${pBoxPosition.class}" />`) : ''}
							</label>
							${ElementManager.selectedElementId === pInput.id ? this.#selectBlock(pInput) : ''}
						`
		)}
				${Datas.sheet.images?.map((pImage) => html`
							<div id="${pImage.id}" style="transform: translate(${pImage.x * Sheet.ratio}px, ${pImage.y * Sheet.ratio}px);width: ${pImage.width * Sheet.ratio}px;height: ${pImage.height * Sheet.ratio}px;" class="image ${ElementManager.selectedElementId === pImage.id ? 'selected' : ''} ${States.isZoomed === pImage.id ? 'isZoomed' : ''}" @click="${(pEvent) => {
				if (States.editMode) ElementManager.select(pEvent, pImage)
				else {
					if (!States.isZoomed) States.isZoomed = pImage.id
					else States.isZoomed = false
					View.render()
				}
			}}">
								<div style="background-image: url(${pImage.image})"></div>
								${ElementManager.selectedElementId === pImage.id ? ElementResizer.boxPositions.map((pBoxPosition) => html`<div class="resizeHandler ${pBoxPosition.class}" />`) : ''}
							</div>
							${ElementManager.selectedElementId === pImage.id ? this.#selectBlock(pImage) : ''}
						`
		)}
			</div>
		`, Sheet.element)
	}
}
