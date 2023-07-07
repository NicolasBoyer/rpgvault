import {html, render, TemplateResult} from 'lit'

export default class Label extends HTMLElement {
    static get observedAttributes(): [string] { return ['value'] }

    get name(): string | null {
        return this.getAttribute('name')
    }

    set name(pValue) {
        this.setAttribute('name', <string>pValue)
    }

    get value(): string | null {
        return this.getAttribute('value')
    }

    set value(pValue) {
        this.setAttribute('value', <string>pValue)
    }

    get type(): string | null {
        return this.getAttribute('type')
    }

    set type(pValue) {
        this.setAttribute('type', <string>pValue)
    }

    get options(): Record<string, unknown>[] {
        return JSON.parse(this.getAttribute('options') || '[]')
    }

    set options(pValue) {
        this.setAttribute('options', pValue as unknown as string)
    }

    connectedCallback(): void {
        this.render()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'value' && oldValue !== newValue) {
            this.value = newValue
            this.render()
        }
    }

    private render(): void {
        render(html`
			<label for="${this.id}" @click="${(pEvent: PointerEvent): void => pEvent.stopPropagation()}">
				<span>${this.name}</span>
				${this.type === 'select' ? html`
					<select id="${this.id}" title="${this.name}">
						<option value="" selected>Choisir un ${this.name}</option>
						${this.options?.map((pOption: Record<string, unknown>): TemplateResult => html`
							<option ?selected="${this.value === pOption.value}" value="${pOption.value}">${pOption.name}</option>
						`)}
					</select>
				` : html`
					<input type="${this.type}" id="${this.id}" name="${this.id}" value="${this.value}" title="${this.name}"/>
				`}
			</label>
		`, <HTMLElement | DocumentFragment>this)
    }
}
