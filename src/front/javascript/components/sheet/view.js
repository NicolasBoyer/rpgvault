import { html, render } from '../../thirdParty/litHtml.js'
import { inputs } from '../../datas/inputs.js'
import Datas from './datas.js'
import States from './states.js'
import Input from './input.js'
import Sheet from './sheet.js'
import { ElementResizer } from '../../classes/elementResizer.js'

/**
 * Fonctions de rendu du composant
 */
export default class View {
	static #editBlock () {
		return html`
			<article .hidden="${States.isEditBlockHidden}" class="editBlock">
				<button class="contrast" @click="${() => Sheet.editBackgroundImage()}">Image de fond</button>
				<button class="contrast" @click="${() => Sheet.changeBackgroundColor()}">Couleur du fond</button>
				<button class="contrast" @click="${() => Input.add()}">Ajouter un champ</button>
				<button class="contrast" @click="${() => Sheet.addFont()}">Ajouter une police</button>
				<button class="contrast" @click="${() => Sheet.deleteFont()}">Supprimer une police</button>
				<button class="contrast">Ajouter une image</button>
				<div>
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

	static #selectBlock (pInput) {
		return html`
			<article class="selectBlock">
				<a href="#" role="button" class="cloneInput" @click="${(pEvent) => Input.clone(pEvent, pInput)}" title="Dupliquer">
					<svg class="clone">
						<use href="#clone"></use>
					</svg>
				</a>
				<a href="#" role="button" class="deleteInput" @click="${() => Input.delete(pInput.id)}" title="Supprimer">
					<svg class="trash">
						<use href="#trash"></use>
					</svg>
				</a>
				${inputs(pInput, Datas.sheet.fonts.map((pFont) => ({ name: pFont.fontFamily, value: pFont.fontFamily }))).map((pEntry) => html`
					<fs-label
							id="${pEntry.id}"
							type="${pEntry.type}"
							name="${pEntry.name}"
							value="${pEntry.value}"
							@input="${(pEvent) => Datas.addInputValues(pInput, pEntry.id, pEvent.target.value)}"
							options="${JSON.stringify(pEntry.options)}"
					></fs-label>
				`)}
			</article>
		`
	}

	static render () {
		render(html`
			<style>
				${Datas.sheet.fonts.map(
			(pFont) => html`
					@import url(${pFont.fontUrl});
				`)}
			</style>
				<div style="position: relative;width: ${Sheet.containerWidth};height: ${Sheet.containerHeight};" class="wrapper ${States.editMode && 'editMode'}" @click="${(pEvent) => {
			if (States.editMode) Input.select(pEvent)
		}}">
				${States.editMode ? this.#editBlock() : html`
					<button class="edit contrast" @click="${() => States.displayEditMode(true)}">Éditer</button>
					<button class="notepad contrast">Bloc notes</button>
				`}
				${Datas.sheet.inputs?.map((pInput) => html`
							<label for="${pInput.id}" style="translate: ${pInput.x * Sheet.ratio}px ${pInput.y * Sheet.ratio}px;" class="${Input.selectedInput === pInput.id ? 'selected' : ''}">
								<span>${pInput.name}</span>
								${pInput.type === 'textarea' ? html`
									<textarea
											id="${pInput.id}"
											name="${pInput.name}"
											style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height * Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
											@change="${(pEvent) => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${States.editMode}"
											@click="${(pEvent) => Input.select(pEvent, pInput)}"
									>${pInput.value}</textarea>
								` : html`
									<input
											type="${pInput.type}"
											id="${pInput.id}"
											name="${pInput.name}"
											value="${pInput.value}"
											style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height * Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
											@change="${(pEvent) => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${States.editMode}"
											@click="${(pEvent) => Input.select(pEvent, pInput)}"
									/>
								`}
								${Input.selectedInput === pInput.id ? ElementResizer.boxPositions.map((pBoxPosition) => html`<div class="resizeHandler ${pBoxPosition.class}" />`) : ''}
							</label>
							${Input.selectedInput === pInput.id ? this.#selectBlock(pInput) : ''}
						`
		)}
			</div>
		`, Sheet.element)
	}
}
