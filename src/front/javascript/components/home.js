import { Utils } from '../classes/utils.js'
import { html, render } from '../thirdParty/litHtml.js'

// TODO ne pas oublier le notepad
// TODO faire en sorte que la création d'un même nom soit impossible
// TODO Graphisme
export default class Home extends HTMLElement {
	#sheets
	#editMode = null

	async connectedCallback () {
		// await Websocket.listen(
		//	async (event) => {
		//		this.#ingredients = JSON.parse(await event.data.text())
		//		this.#displayIngredients()
		//	},
		//	async () => {
		//		Commons.clearPropositionsOnBackgroundClick(() => this.#render())
		//		const response = Caches.get('listIngredients', 'categories', 'ingredients') || await Utils.request('/db', 'POST', {body: '[{ "getListIngredients": "" }, { "getCategories": "" }, { "getIngredients": "" }]'})
		//		Caches.set('listIngredients', response[0], 'categories', response[1], 'ingredients', response[2])
		//		this.#ingredients = response[0]
		//		this.#categories = response[1]
		//		Commons.savedIngredients = response[2]
		//		this.#recipeChoices = []
		//		this.#sendMessage()
		//		const cacheResponse = Caches.get('recipes', 'dishes') || await Utils.request('/db', 'POST', {body: '[{ "getRecipes": "" }, { "getDishes": "" }]'})
		//		Caches.set('recipes', cacheResponse[0], 'dishes', cacheResponse[1])
		//	}
		// )
		this.#sheets = await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' })
		this.#sheets = Array.isArray(this.#sheets) ? this.#sheets : Object.keys(this.#sheets).length ? [this.#sheets] : []
		this.#render()
		// const response = Caches.get('listIngredients', 'categories', 'ingredients') || await Utils.request('/db', 'POST', {body: '[{ "getListIngredients": "" }, { "getCategories": "" }, { "getIngredients": "" }]'})
		// Caches.set('listIngredients', response[0], 'categories', response[1], 'ingredients', response[2])
	}

	async #saveSheets (name, id) {
		// Caches.set('listIngredients', this.#ingredients)
		this.#sheets = await Utils.request('/db', 'POST', { body: `{ "setSheet": { "name": "${name}"${id ? `, "id": "${id}"` : ''} } }` })
		this.#resetMode()
		// try {
		//	autoAnimate(document.querySelector('ul'))
		// } catch (e) {
		//	// console.error(e)
		// }
	}

	async #editSheets (event, id) {
		const input = event.target.tagName === 'INPUT' ? event.target : event.target.previousElementSibling.querySelector('input')
		await this.#saveSheets(input.value, id)
	}

	#addSheet () {
		let name
		Utils.confirm(html`
			<label for="name">
				<span>Choisissez un nom</span>
				<input type="text" id="name" name="name" @change="${async (pEvent) => {
			name = pEvent.target.value
		}}">
			</label>
		`, async () => this.#saveSheets(name))
	}

	#removeSheet (id) {
		Utils.confirm(html`<h3>Voulez-vous vraiment supprimer ?</h3>`, async () => {
			this.#sheets = await Utils.request('/db', 'POST', { body: `{ "removeSheet": { "id": "${id}" } }` })
			// Caches.set('listIngredients', this.#ingredients)
			this.#resetMode()
			Utils.toast('success', 'Ingrédient supprimé')
		})
	}

	#resetMode () {
		this.#editMode = null
		this.#render()
	}

	#render () {
		render(html`
			<div class="title">
				<h2>Vos feuilles de personnage</h2>
				<button type="button" class="add" @click="${() => this.#addSheet()}">
					<svg class="add">
						<use href="#add"></use>
					</svg>
					<span>Ajouter une feuille</span>
				</button>
			</div>
			<aside>
				<nav>
					<ul>
						${!this.#sheets.length
			? html`<li>Aucune feuille ...</li>`
			: this.#sheets.map((pSheet) => {
				const id = pSheet._id
				const name = pSheet.name
				return html`
				<li>
					<div class="characterSheets">
						${this.#editMode === id ? html`
							<input name="editSheet" required type="text" value="${name}" @keyup="${(pEvent) => {
					if (pEvent.key === 'Enter') this.#editSheets(pEvent, id)
					if (pEvent.key === 'Escape') this.#resetMode()
				}}"/>
							<button class="valid" @click="${(pEvent) => this.#editSheets(pEvent, id)}">
								<svg class="valid">
									<use href="#valid"></use>
								</svg>
								<span>Valider</span>
							</button>
							<button type="button" class="undo" @click="${() => this.#resetMode()}">
								<svg class="undo">
									<use href="#undo"></use>
								</svg>
								<span>Annuler</span>
							</button>
						` : html`
							<a href="/sheets/${pSheet.slug}">
								<span>${name}</span>
							</a>
							<button class="edit" @click="${() => {
					this.#editMode = id
					this.#render()
				}}">
								<svg class="edit">
									<use href="#edit"></use>
								</svg>
								<span>Modifier</span>
							</button>
							<button type="button" class="remove" @click="${() => this.#removeSheet(id)}">
								<svg class="remove">
									<use href="#remove"></use>
								</svg>
								<span>Supprimer</span>
							</button>
						`}
					</div>
				</li>											
				`
			})}
					</ul>
				</nav>
			</aside>
		`, this)
	}
}
