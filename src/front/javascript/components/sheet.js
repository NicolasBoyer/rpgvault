import { html, render } from '../thirdParty/litHtml.js'
import { Utils } from '../classes/utils.js'
import { InputDrawer } from '../classes/InputDrawer.js'
import { inputs } from '../datas/inputs.js'
import { ElementMover } from '../classes/ElementMover.js'

export default class Sheet extends HTMLElement {
	#sheet
	#imageWidth
	#imageHeight
	#containerWidth
	#containerHeight
	#ratio
	#id
	#editMode
	#isEditBlockHidden
	#containerLeft
	#containerTop
	#selectedInput
	#changedInputs
	#deletedInputs
	#isSaving = false

	// TODO voir si possible de casser un peu ce js en plusieurs peut etre avec une gestion du front et du save dans différents cichiers
	// TODO Comment gérer les fonts ?
	// TODO création des inputs par copier coller
	// TODO revoir le resize avec la souris sur les bords ? Avec des fleches sur les bords ?
	// TODO font family + color input + centrage ?
	// TODO ctrl c ctrl v ctrl d ctrl s manage shortcut
	// TODO gestion dépassement popup screen
	// TODO manager de shortcuts ?
	async connectedCallback () {
		const splitUrl = location.pathname.split('/')
		this.#sheet = await Utils.request('/db', 'POST', { body: `{ "getCollections": { "slug": "${splitUrl[splitUrl.length - 1]}" } }` })
		// TODO si pas de sheet retourner une 404
		this.#id = this.#sheet._id
		this.style.backgroundColor = this.#sheet.backgroundColor
		this.#setImage(this.#sheet.backgroundImage || '../../assets/default.jpg')
		window.addEventListener('resize', () => this.#resize())
	}

	#setImage (pImageSrc) {
		const image = new Image()
		image.onload = () => {
			this.#imageWidth = image.naturalWidth
			this.#imageHeight = image.naturalHeight
			this.#resize()
		}
		image.src = pImageSrc
		this.style.backgroundImage = `url(${image.src})`
	}

	#resize () {
		const dims = document.body.getBoundingClientRect()
		this.style.width = `${dims.width}px`
		this.style.height = `${dims.height}px`
		const containerHeight = dims.width * this.#imageHeight / this.#imageWidth
		const isWidthResized = containerHeight < dims.height
		this.#containerWidth = `${isWidthResized ? dims.width : this.#imageWidth * dims.height / this.#imageHeight}px`
		this.#containerHeight = `${isWidthResized ? containerHeight : dims.height}px`
		this.#ratio = isWidthResized ? dims.width / this.#imageWidth : dims.height / this.#imageHeight
		this.#containerLeft = (dims.width - parseInt(this.#containerWidth)) / 2
		this.#containerTop = (dims.height - parseInt(this.#containerHeight)) / 2
		this.#render()
	}

	#displayEditMode (pValue) {
		this.#selectInput()
		this.#editMode = pValue
		this.#changedInputs = []
		this.#deletedInputs = []
		this.#render()
	}

	#displayEditBlock (pValue) {
		this.#isEditBlockHidden = !pValue
		this.#render()
	}

	async #changeAndSaveInput (pInput, ...args) {
		this.#changeInputValues(pInput, ...args)
		await this.#save(pInput)
	}

	#changeInputValues (pInput, ...args) {
		for (let i = 0; i < args.length; i++) {
			const value = args[i + 1]
			if (i % 2 === 0) pInput[args[i]] = Number(value) || value
		}
		let index
		if (this.#editMode) {
			index = this.#changedInputs.findIndex((input) => input.id === pInput.id)
			this.#changedInputs[index !== -1 ? index : this.#changedInputs.length || 0] = pInput
		}
		index = this.#sheet.inputs.findIndex((input) => input.id === pInput.id)
		this.#sheet.inputs[index !== -1 ? index : this.#sheet.inputs.length || 0] = pInput
		this.#render()
	}

	async #save (pInput) {
		this.#isSaving = true
		const body = []
		const inputs = pInput ? [pInput] : this.#changedInputs
		inputs.forEach((pInput) => {
			body.push({
				setInput: {
					id: this.#id,
					inputId: pInput.id,
					input: pInput
				}
			})
		})
		if (!pInput) {
			this.#deletedInputs.forEach((pInputId) => {
				body.push({
					deleteInput: {
						id: this.#id,
						inputId: pInputId
					}
				})
			})
		}
		await Utils.request('/db', 'POST', { body: JSON.stringify(body) })
		this.#isSaving = false
	}

	#changeBackgroundColor () {
		let color
		Utils.confirm(html`
			<label for="color">
				<span>Choisissez une couleur</span>
				<input type="color" id="color" name="color" value="${this.#sheet.backgroundColor}" @change="${async (pEvent) => {
					color = pEvent.target.value
				}}">
			</label>
		`, async () => {
			this.style.backgroundColor = color
			// TODO à passer dans le save ?
			await Utils.request('/db', 'POST', { body: `{ "setBackgroundColor": { "id": "${this.#id}", "color": "${color}" } }` })
		})
	}

	#editBackgroundImage () {
		let file
		Utils.confirm(html`
			<label for="file">
				<span>Choisissez un fichier</span>
				<input type="file" id="file" name="file" @change="${(pEvent) => {
					file = pEvent.target.files[0]
				}}">
			</label>
		`, async () => {
			const reader = new FileReader()
			reader.addEventListener('load', async () => {
				this.#setImage(reader.result)
				// TODO à passer dans le save ?
				await Utils.request('/db', 'POST', { body: `{ "setBackgroundImage": { "id": "${this.#id}", "image": "${reader.result}" } }` })
			})
			reader.readAsDataURL(file)
		})
	}

	#addInput () {
		this.#displayEditBlock(false)
		InputDrawer.init(this.querySelector('.wrapper'), { x: this.#containerLeft, y: this.#containerTop }, async (pMousePosition, pEvent) => {
			this.#displayEditBlock(true)
			const inputId = Utils.generateId().toString()
			const input = {
				id: inputId,
				type: 'text'
			}
			await this.#changeInputValues(input, 'x', Math.round(pMousePosition.startX / this.#ratio), 'y', Math.round(pMousePosition.startY / this.#ratio), 'width', Math.round(pMousePosition.x / this.#ratio - pMousePosition.startX / this.#ratio), 'height', Math.round(pMousePosition.y / this.#ratio - pMousePosition.startY / this.#ratio))
			this.#selectInput(pEvent, input)
		})
	}

	async #deleteInput (pInputId) {
		this.#sheet.inputs.splice(this.#sheet.inputs.findIndex((input) => input.id === pInputId), 1)
		this.#deletedInputs.push(pInputId)
		this.#render()
	}

	#cloneInput (pEvent, input) {
		this.#changeInputValues({ ...input, id: Utils.generateId().toString() })
		this.#selectInput(pEvent, input)
	}

	#selectInput (pEvent, pInput) {
		if (this.#editMode) {
			if (pEvent) pEvent.stopPropagation()
			if (pInput) {
				ElementMover.init(document.querySelector(`label[for='${pInput.id}']`), {
					x: this.#containerLeft,
					y: this.#containerTop
				}, (pMousePosition) => this.#changeInputValues(pInput, 'x', Math.round(pMousePosition.x / this.#ratio), 'y', Math.round(pMousePosition.y / this.#ratio)))
			}
			this.#selectedInput = pInput?.id
			this.#render()
		}
	}

	#render () {
		render(html`
			<div style="position: relative;width: ${this.#containerWidth};height: ${this.#containerHeight};" class="wrapper ${this.#editMode && 'editMode'}" @click="${(pEvent) => {
				if (this.#editMode) this.#selectInput(pEvent)
			}}">
				${this.#editMode ? html`
					<article .hidden="${this.#isEditBlockHidden}" class="editBlock">
						<button class="contrast" @click="${() => this.#editBackgroundImage()}">Image de fond</button>
						<button class="contrast" @click="${() => this.#changeBackgroundColor()}">Couleur du fond</button>
						<button class="contrast" @click="${() => this.#addInput()}">Ajouter un champ</button>
						<button class="contrast" @click="${() => {}}">Ajouter une police</button>
						<button class="contrast">Ajouter une image</button>
						<div>
							<button class="save" @click="${async () => {
								await this.#save()
								this.#displayEditMode(false)
							}}">Enregistrer et fermer
								<fs-loader ?visible="${this.#isSaving}"></fs-loader>
							</button>
						</div>
					</article>
				` : html`
					<button class="edit contrast" @click="${() => this.#displayEditMode(true)}">Éditer</button>
					<button class="notepad contrast">Bloc notes</button>
				`}
				${this.#sheet.inputs?.map(
						(pInput) => html`
							<label for="${pInput.id}" style="translate: ${pInput.x * this.#ratio}px ${pInput.y * this.#ratio}px;" class="${this.#selectedInput === pInput.id ? 'selected' : ''}">
								<span>${pInput.name}</span>
								${pInput.type === 'textarea' ? html`
									<textarea
											id="${pInput.id}"
											name="${pInput.name}"
											style="font-size: ${pInput.fontSize * this.#ratio}px;width: ${pInput.width * this.#ratio}px;height: ${pInput.height * this.#ratio}px;color: ${pInput.color};"
											@change="${(pEvent) => this.#changeAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${this.#editMode}"
											@click="${(pEvent) => this.#selectInput(pEvent, pInput)}"
											@keyup="${(pEvent) => {
												if (pEvent.key === 'Delete') {
													pEvent.stopPropagation()
													this.#deleteInput(pInput.id)
												}
											}}"
									>${pInput.value}</textarea>
								` : html`
									<input
											type="${pInput.type}"
											id="${pInput.id}"
											name="${pInput.name}"
											value="${pInput.value}"
											style="font-size: ${pInput.fontSize * this.#ratio}px;width: ${pInput.width * this.#ratio}px;height: ${pInput.height * this.#ratio}px;color: ${pInput.color};"
											@change="${(pEvent) => this.#changeAndSaveInput(pInput, 'value', pEvent.target.value)}"
											?readonly="${this.#editMode}"
											@click="${(pEvent) => this.#selectInput(pEvent, pInput)}"
											@keyup="${(pEvent) => {
												if (pEvent.key === 'Delete') {
													pEvent.stopPropagation()
													this.#deleteInput(pInput.id)
												}
											}}"
									/>
								`}
								${this.#selectedInput === pInput.id ? html`
									<article>
										<a href="#" role="button" class="cloneInput" @click="${(pEvent) => this.#cloneInput(pEvent, pInput)}" title="Dupliquer">
											<svg class="clone">
												<use href="#clone"></use>
											</svg>
										</a>
										<a href="#" role="button" class="deleteInput" @click="${(pEvent) => this.#deleteInput(pInput.id)}" title="Supprimer">
											<svg class="remove">
												<use href="#remove"></use>
											</svg>
										</a>
										${inputs(pInput).map((pEntry) => html`
											<fs-label
													id="${pEntry.id}"
													type="${pEntry.type}"
													name="${pEntry.name}"
													value="${pEntry.value}"
													@change="${(pEvent) => this.#changeInputValues(pInput, pEntry.id, pEvent.target.value)}"
													options="${JSON.stringify(pEntry.options)}"
											></fs-label>
										`)}
									</article>
								` : ''}
							</label>
						`
				)}
			</div>
		`, this)
	}
}
