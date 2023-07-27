import {Utils} from '../classes/utils.js'
import {html, render, TemplateResult} from 'lit'
import {Caches} from '../classes/caches.js'
import {TSheet} from '../types.js'

// TODO système de folder ? A voir si besoin pas pour le moment
// TODO Suppr comment + pass sur ipad
// TODO permettre plusieurs utilisateurs
// TODO image comme un lien en choix si pas de place
// TODO parametre pour gérer zoom ou pas zoom
// TODO dupliquer avec aucun ékément avec aucun texte ?
// TODO améliorer notepade avec des onglets
// TODO anuler doit revenir en arrière sur les choix en réalité ajouter un historique
// TODO passer sous vitejs ?
// TODO finaliser elementManager
// TODO finir passage au typescript
// TODO pas de move sur tous les éléments quand on change d'interface
// TODO bug sur le ctrl d ctrl move parfois
// TODO ajouter possibilité de changer l'image
// TODO Ajouter une grille ?
// TODO ajouter masque mode cadre ?
export default class Home extends HTMLElement {
    private sheets: TSheet[] = []
    private editMode: string | null = null

    async connectedCallback(): Promise<void> {
        Utils.getFragmentHtml(location.pathname)
        Utils.loader(true)
        this.sheets = <TSheet[]>(await Caches.get('sheets') || await Utils.request('/db', 'POST', {body: '{ "getSheets": "" }'}))
        Caches.set(true, 'sheets', this.sheets)
        this.sheets = Array.isArray(this.sheets) ? this.sheets : Object.keys(this.sheets).length ? [this.sheets] : []
        this.render()
        window.addEventListener('resize', (): void => this.initParchment())
        setTimeout((): void => {
            this.initParchment()
            Utils.loader(false)
        })
    }

    private initParchment(): void {
        // TODO marche toujours pas sur ipad essayer un document.body.style.height = `${window.innerHeight}px` sur le body ou enlever le position abs sur le parchment ou ajouter height sur section ?
        if (!document.querySelector('#parchment')) return
        const main = <HTMLElement>document.querySelector('#main')
        main.style.height = ''
        document.body.style.height = ''
        const mainSize = main.getBoundingClientRect()
        if (mainSize.height <= window.innerHeight) {
            document.body.style.height = `${window.innerHeight}px`
            main.style.height = `${document.body.getBoundingClientRect().height - mainSize.top - parseInt(getComputedStyle(main).marginBottom)}px`
        }
        this.render()
    }

    private async saveSheet(sheet: TSheet): Promise<void> {
        if (!this.sheets.some((pSheet: TSheet): boolean => (pSheet.name.toLowerCase() === sheet.name.toLowerCase() || pSheet.slug === Utils.slugify(sheet.name)) && pSheet._id !== sheet.id)) {
            this.sheets = await Utils.request('/db', 'POST', {body: `{ "setSheet": ${JSON.stringify(sheet)} }`}) as TSheet[]
            Caches.set(true, 'sheets', this.sheets)
        } else Utils.toast('error', 'Une feuille de personnage portant le même nom ou la même url existe')
        this.resetMode()
        // try {
        //	autoAnimate(document.querySelector('ul'))
        // } catch (e) {
        //	// console.error(e)
        // }
    }

    private async editSheets(event: PointerEvent, id: string): Promise<void> {
        const target = <HTMLInputElement>event.target
        const input: HTMLInputElement = target.tagName === 'INPUT' ? target : target.closest('div')?.querySelector('input') as HTMLInputElement
        await this.saveSheet({name: input.value, id})
    }

    private addSheet(): void {
        let name: string
        Utils.confirm(html`
			<label for="name">
				<span>Choisissez un nom</span>
				<input type="text" id="name" name="name" @change="${async (pEvent: PointerEvent): Promise<void> => {
        name = (pEvent.target as HTMLInputElement).value
    }}"> 
			</label>
		`, async (): Promise<void> => {
            await this.saveSheet({name})
            this.initParchment()
        })
    }

    private removeSheet(id: string): void {
        Utils.confirm(html`<h3>Voulez-vous vraiment supprimer ?</h3>`, async (): Promise<void> => {
            this.sheets = await Utils.request('/db', 'POST', {body: `{ "removeSheet": { "id": "${id}" } }`}) as TSheet[]
            Caches.set(true, 'sheets', this.sheets)
            this.resetMode()
            this.initParchment()
            Utils.toast('success', 'Feuille de personnage supprimée')
        })
    }

    private clone(id: string): void {
        let name: string
        Utils.confirm(html`
			<label for="name">
				<span>Dupliquer la feuille de personnage</span>
				<input type="text" id="name" name="name" @change="${(pEvent: PointerEvent): void => {
        name = (<HTMLInputElement>pEvent.target).value
    }}"> 
			</label>
		`, async (): Promise<void> => {
            const sheet = <TSheet>this.sheets.find((pSheet): boolean => pSheet._id === id)
            sheet.name = name
            sheet.slug = Utils.slugify(name)
            delete sheet._id
            delete sheet.id
            await this.saveSheet(sheet)
            this.initParchment()
        })
    }

    private resetMode(): void {
        this.editMode = null
        this.render()
    }

    private resetHeight(): void {
        (document.querySelector('#main') as HTMLElement).style.height = ''
        document.body.style.height = ''
    }

    private render(): void {
        render(html`
			<div class="title">
				<h2>Vos feuilles de personnage</h2>
				<button type="button" class="add" @click="${(): void => this.addSheet()}">
					<svg class="add">
						<use href="#document"></use>
					</svg>
					<span>Ajouter une feuille</span> 
				</button>
			</div>
			<aside>
				<nav>
					<ul>
						${!this.sheets.length
        ? html`<li>Aucune feuille ...</li>`
        : this.sheets.map((pSheet): TemplateResult => {
            const id = pSheet._id as string
            const name = pSheet.name
            return html`
				<li>
					<div class="characterSheets">
						${this.editMode === id ? html`
							<input name="editSheet" required type="text" value="${name}" @keyup="${(pEvent: Event): void => {
    if ((<KeyboardEvent>pEvent).key === 'Enter') this.editSheets(<PointerEvent>pEvent, id)
    if ((<KeyboardEvent>pEvent).key === 'Escape') this.resetMode()
}}"/>
							<button class="valid" @click="${async (pEvent: PointerEvent): Promise<void> => await this.editSheets(pEvent, id)}">
								<svg class="valid">
									<use href="#valid"></use>
								</svg>
								<span>Valider</span>
							</button>
							<button type="button" class="undo" @click="${(): void => this.resetMode()}">
								<svg class="undo">
									<use href="#undo"></use>
								</svg>
								<span>Annuler</span>
							</button>
						` : html`
							<fs-link role="link" href="/sheets/${pSheet.slug}" @click="${(): void => this.resetHeight()}">
								<span>${name}</span>
							</fs-link>
							<button type="button" class="clone" @click="${(): void => this.clone(id)}">
								<svg class="clone">
									<use href="#documents"></use>
								</svg>
								<span>Dupliquer</span>
							</button>
							<button class="edit" @click="${(): void => {
        this.editMode = id
        this.render()
    }}">
								<svg class="edit">
									<use href="#pencil"></use>
								</svg>
								<span>Modifier</span>
							</button>
							<button type="button" class="remove" @click="${(): void => this.removeSheet(id)}">
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
