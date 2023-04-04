import { Utils } from '../classes/utils.js'
import { html, render } from '../thirdParty/litHtml.js'
import { Caches } from '../classes/caches.js'

// TODO système de folder ? A voir si besoin pas pour le moment
// TODO Suppr comment + pass sur ipad
// TODO permettre plusieurs utilisateurs
// TODO image comme un lien en choix si pas de place
// TODO permettre le déplacement des zones d'édition
// TODO chargement des police quand note enregistré pas normal
// TODO parametre pour gérer zoom ou pas zoom
// TODO dupliquer avec aucun ékément avec aucun texte ?
export default class Home extends HTMLElement {
	#sheets
	#editMode = null

	async connectedCallback () {
		Utils.getFragmentHtml(location.pathname)
		Utils.loader(true)
		this.#sheets = await Caches.get('sheets') || await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' })
		Caches.set(true, 'sheets', this.#sheets)
		this.#sheets = Array.isArray(this.#sheets) ? this.#sheets : Object.keys(this.#sheets).length ? [this.#sheets] : []
		this.#render()
		window.addEventListener('resize', () => this.#initParchment())
		setTimeout(() => {
			this.#initParchment()
			Utils.loader(false)
		})
	}

	#initParchment () {
		// TODO marche toujours pas sur ipad essayer un document.body.style.height = `${window.innerHeight}px` sur le body ou enlever le position abs sur le parchment ou ajouter height sur section ?
		if (!document.querySelector('#parchment')) return
		const main = document.querySelector('#main')
		main.style.height = ''
		document.body.style.height = ''
		const mainSize = main.getBoundingClientRect()
		if (mainSize.height <= window.innerHeight) {
			document.body.style.height = `${window.innerHeight}px`
			main.style.height = `${document.body.getBoundingClientRect().height - mainSize.top - parseInt(getComputedStyle(main).marginBottom)}px`
		}
		this.#render()
	}

	async #saveSheet (sheet) {
		if (!this.#sheets.some((pSheet) => (pSheet.name.toLowerCase() === sheet.name.toLowerCase() || pSheet.slug === Utils.slugify(sheet.name)) && pSheet._id !== sheet.id)) {
			this.#sheets = await Utils.request('/db', 'POST', { body: `{ "setSheet": ${JSON.stringify(sheet)} }` })
			Caches.set(true, 'sheets', this.#sheets)
		} else Utils.toast('error', 'Une feuille de personnage portant le même nom ou la même url existe')
		this.#resetMode()
		// try {
		//	autoAnimate(document.querySelector('ul'))
		// } catch (e) {
		//	// console.error(e)
		// }
	}

	async #editSheets (event, id) {
		const input = event.target.tagName === 'INPUT' ? event.target : event.target.closest('div').querySelector('input')
		await this.#saveSheet({ name: input.value, id })
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
		`, async () => {
			await this.#saveSheet({ name })
			this.#initParchment()
		})
	}

	#removeSheet (id) {
		Utils.confirm(html`<h3>Voulez-vous vraiment supprimer ?</h3>`, async () => {
			this.#sheets = await Utils.request('/db', 'POST', { body: `{ "removeSheet": { "id": "${id}" } }` })
			Caches.set(true, 'sheets', this.#sheets)
			this.#resetMode()
			this.#initParchment()
			Utils.toast('success', 'Feuille de personnage supprimée')
		})
	}

	#clone (id) {
		let name
		Utils.confirm(html`
			<label for="name">
				<span>Dupliquer la feuille de personnage</span>
				<input type="text" id="name" name="name" @change="${async (pEvent) => {
			name = pEvent.target.value
		}}"> 
			</label>
		`, async () => {
			const sheet = this.#sheets.find((pSheet) => pSheet._id === id)
			sheet.name = name
			sheet.slug = Utils.slugify(name)
			delete sheet._id
			delete sheet.id
			await this.#saveSheet(sheet)
			this.#initParchment()
		})
	}

	#resetMode () {
		this.#editMode = null
		this.#render()
	}

	#resetHeight () {
		document.querySelector('#main').style.height = ''
		document.body.style.height = ''
	}

	#render () {
		render(html`
			<div class="title">
				<h2>Vos feuilles de personnage</h2>
				<button type="button" class="add" @click="${() => this.#addSheet()}">
					<svg class="add">
						<use href="#document"></use>
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
							<fs-link role="link" href="/sheets/${pSheet.slug}" @click="${() => { this.#resetHeight() }}">
								<span>${name}</span>
							</fs-link>
							<button type="button" class="clone" @click="${() => this.#clone(id)}">
								<svg class="clone">
									<use href="#documents"></use>
								</svg>
								<span>Dupliquer</span>
							</button>
							<button class="edit" @click="${() => {
					this.#editMode = id
					this.#render()
				}}">
								<svg class="edit">
									<use href="#pencil"></use>
								</svg>
								<span>Modifier</span>
							</button>
							<button type="button" class="remove" @click="${() => this.#removeSheet(id)}">
								<svg class="remove">
									<use href="#bin"></use>
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
