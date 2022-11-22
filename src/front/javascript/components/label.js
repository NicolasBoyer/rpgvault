import { html, render } from '../thirdParty/litHtml.js'

export default class Label extends HTMLElement {
	static get observedAttributes () { return ['value'] }

	get id () {
		return this.getAttribute('id')
	}

	set id (pValue) {
		this.setAttribute('id', pValue)
	}

	get name () {
		return this.getAttribute('name')
	}

	set name (pValue) {
		this.setAttribute('name', pValue)
	}

	get value () {
		return this.getAttribute('value')
	}

	set value (pValue) {
		this.setAttribute('value', pValue)
	}

	get type () {
		return this.getAttribute('type')
	}

	set type (pValue) {
		this.setAttribute('type', pValue)
	}

	get options () {
		return JSON.parse(this.getAttribute('options'))
	}

	set options (pValue) {
		this.setAttribute('options', pValue)
	}

	connectedCallback () {
		this.#render()
	}

	attributeChangedCallback (name, oldValue, newValue) {
		if (name === 'value' && oldValue !== newValue) {
			this.value = newValue
			this.#render()
		}
	}

	#render () {
		render(html`
			<label for="${this.id}" @click="${(pEvent) => pEvent.stopPropagation()}">
				<span>${this.name}</span>
				${this.type === 'select' ? html`
					<select id="${this.id}" title="${this.name}">
						<option value="" selected>Choisir un ${this.name}</option>
						${this.options?.map((pOption) => html`
							<option ?selected="${this.value === pOption.value}" value="${pOption.value}">${pOption.name}</option>
						`)}
					</select>
				` : html`
					<input type="${this.type}" id="${this.id}" name="${this.id}" value="${this.value}" title="${this.name}"/>
				`}
			</label>
		`, this)
	}
}
