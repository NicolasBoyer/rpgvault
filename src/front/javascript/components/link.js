import { html, render } from '../thirdParty/litHtml.js'
import { Utils } from '../classes/utils.js'

export default class Link extends HTMLElement {
	get href () {
		return this.getAttribute('href')
	}

	set href (pValue) {
		this.setAttribute('open', pValue)
	}

	async connectedCallback () {
		const children = Array.from(this.children)
		this.#render()
		this.querySelector('slot')?.replaceWith(...children)
		const fragment = await Utils.getFragmentHtml(this.href)
		this.addEventListener('click', () => {
			history.pushState({}, '', this.href)
			REPLACEZONE(fragment)
		})
	}

	#render () {
		render(html`
			<slot></slot>
		`, this)
	}
}

const REPLACEZONE = (pFragment) => {
	Utils.replaceChildren(document.querySelector('[data-replaced-zone]'), document.createRange().createContextualFragment(pFragment.text))
	document.body.className = pFragment.class
	const title = document.querySelector('[data-replaced-title]')
	if (title) title.innerHTML = pFragment.title
}

window.addEventListener('popstate', async () => REPLACEZONE(await Utils.getFragmentHtml(location.pathname)))
