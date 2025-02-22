import { Utils } from '../classes/utils.js'
import { html, render, TemplateResult } from 'lit'
import { Caches } from '../classes/caches.js'
import { TSheet } from '../types.js'

// TODO système de folder ? A voir si besoin pas pour le moment
// TODO permettre plusieurs utilisateurs
// TODO image comme un lien en choix si pas de place
// TODO parametre pour gérer zoom ou pas zoom
// TODO dupliquer avec aucun ékément avec aucun texte ?
// TODO anuler doit revenir en arrière sur les choix en réalité ajouter un historique
// TODO ajouter possibilité de changer l'image
// TODO Ajouter une grille ?
// TODO ajouter masque mode cadre ?
// TODO Voir si normal que tout soit en statique
// TODO système de calque ou d'index
// TODO Avatar
export default class Sheets extends HTMLElement {
    private sheets: TSheet[] = []
    private editMode: string | null = null

    async connectedCallback(): Promise<void> {
        Utils.getFragmentHtml(location.pathname)
        Utils.loader(true)
        this.sheets = <TSheet[]>((await Caches.get('sheets')) || (await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' })))
        Caches.set(true, 'sheets', this.sheets)
        this.sheets = Array.isArray(this.sheets) ? this.sheets : Object.keys(this.sheets).length ? [this.sheets] : []
        this.render()
        setTimeout((): void => {
            Utils.loader(false)
        })
    }

    private async saveSheet(sheet: TSheet): Promise<void> {
        if (!this.sheets.some((pSheet: TSheet): boolean => (pSheet.name.toLowerCase() === sheet.name.toLowerCase() || pSheet.slug === Utils.slugify(sheet.name)) && pSheet._id !== sheet.id)) {
            this.sheets = (await Utils.request('/db', 'POST', { body: `{ "setSheet": ${JSON.stringify(sheet)} }` })) as TSheet[]
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
        const input: HTMLInputElement = target.tagName === 'INPUT' ? target : (target.closest('div')?.querySelector('input') as HTMLInputElement)
        await this.saveSheet({ name: input.value, id })
    }

    private addSheet(): void {
        let name: string
        Utils.confirm(
            html`
                <label for="name">
                    <h2>Choisissez un nom</h2>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        @change="${async (pEvent: PointerEvent): Promise<void> => {
                            name = (pEvent.target as HTMLInputElement).value
                        }}"
                    />
                </label>
            `,
            async (): Promise<void> => {
                await this.saveSheet({ name, notepad: [{ title: '', content: '' }] })
            }
        )
    }

    private removeSheet(id: string): void {
        Utils.confirm(html`<h3>Voulez-vous vraiment supprimer ?</h3>`, async (): Promise<void> => {
            this.sheets = (await Utils.request('/db', 'POST', { body: `{ "removeSheet": { "id": "${id}" } }` })) as TSheet[]
            this.sheets = Array.isArray(this.sheets) ? this.sheets : [this.sheets]
            Caches.set(true, 'sheets', this.sheets)
            this.resetMode()
            Utils.toast('success', 'Feuille de personnage supprimée')
        })
    }

    private clone(id: string): void {
        let name: string
        Utils.confirm(
            html`
                <label for="name">
                    <h2>Dupliquer la feuille de personnage</h2>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        @change="${(pEvent: PointerEvent): void => {
                            name = (<HTMLInputElement>pEvent.target).value
                        }}"
                    />
                </label>
            `,
            async (): Promise<void> => {
                const sheet = <TSheet>this.sheets.find((pSheet): boolean => pSheet._id === id)
                sheet.name = name
                sheet.slug = Utils.slugify(name)
                delete sheet._id
                delete sheet.id
                await this.saveSheet(sheet)
            }
        )
    }

    private resetMode(): void {
        this.editMode = null
        this.render()
    }

    private render(): void {
        render(
            html`
                <div class="title">
                    <h2>Forge de personnage</h2>
                    <button type="button" class="add" @click="${(): void => this.addSheet()}">
                        <svg class="add">
                            <use href="#add"></use>
                        </svg>
                        <span>Ajouter un personnage</span>
                    </button>
                </div>
                <div>
                    <ul>
                        ${!this.sheets.length
                            ? html`<li>Aucun personnage ...</li>`
                            : this.sheets.map((pSheet): TemplateResult => {
                                  const id = pSheet._id as string
                                  const name = pSheet.name
                                  return html`
                                      <li>
                                          <rv-link role='link' href='/sheets/${pSheet.slug}'">
                                              <article>
                                                  ${
                                                      this.editMode === id
                                                          ? html`
                                                                <fieldset role="group">
                                                                    <input
                                                                        name="editSheet"
                                                                        required
                                                                        type="text"
                                                                        value="${name}"
                                                                        @click="${(event: PointerEvent): void => event.stopPropagation()}"
                                                                        @keyup="${(event: Event): void => {
                                                                            if ((<KeyboardEvent>event).key === 'Enter') this.editSheets(<PointerEvent>event, id)
                                                                            if ((<KeyboardEvent>event).key === 'Escape') this.resetMode()
                                                                        }}"
                                                                    />
                                                                    <button
                                                                        class="valid"
                                                                        @click="${async (event: PointerEvent): Promise<void> => {
                                                                            event.stopPropagation()
                                                                            await this.editSheets(event, id)
                                                                        }}"
                                                                    >
                                                                        <svg class="valid">
                                                                            <use href="#valid"></use>
                                                                        </svg>
                                                                        <span>Valider</span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        class="undo"
                                                                        @click="${(event: PointerEvent): void => {
                                                                            event.stopPropagation()
                                                                            this.resetMode()
                                                                        }}"
                                                                    >
                                                                        <svg class="undo">
                                                                            <use href="#undo"></use>
                                                                        </svg>
                                                                        <span>Annuler</span>
                                                                    </button>
                                                                </fieldset>
                                                            `
                                                          : html`
                                                                <div class="title">
                                                                    <h3>${name}</h3>
                                                                    <button
                                                                        class="edit outline"
                                                                        @click="${(event: PointerEvent): void => {
                                                                            event.stopPropagation()
                                                                            this.editMode = id
                                                                            this.render()
                                                                        }}"
                                                                    >
                                                                        <svg class="edit">
                                                                            <use href="#pencil"></use>
                                                                        </svg>
                                                                        <span>Modifier</span>
                                                                    </button>
                                                                </div>
                                                            `
                                                  }
                                                  <div class='abstract'>Test de texte <button
                                                                        class='edit outline'
                                                                        @click='${(event: PointerEvent): void => {
                                                                            event.stopPropagation()
                                                                            this.editMode = id
                                                                            this.render()
                                                                        }}'
                                                                    >
                                                                        <svg class='edit'>
                                                                            <use href='#pencil'></use>
                                                                        </svg>
                                                                        <span>Modifier</span>
                                                                    </button></div>
                                                  <div class='illustration'>
                                                      <img src='assets/characterSheet.jpg' alt='' />
                                                      <button
                                                                        class='edit outline'
                                                                        @click='${(event: PointerEvent): void => {
                                                                            event.stopPropagation()
                                                                            this.editMode = id
                                                                            this.render()
                                                                        }}'
                                                                    >
                                                                        <svg class='edit'>
                                                                            <use href='#pencil'></use>
                                                                        </svg>
                                                                        <span>Modifier</span>
                                                                    </button>
                                                  </div>
                                              </article>
                                              <div class='buttons'>
                                                  <button
                                                      type='button'
                                                      class='outline clone'
                                                      @click='${(event: PointerEvent): void => {
                                                          event.stopPropagation()
                                                          this.clone(id)
                                                      }}'
                                                  >
                                                      <span>Dupliquer</span>
                                                  </button>
                                                  <button
                                                      type='button'
                                                      class='outline remove'
                                                      @click='${(event: PointerEvent): void => {
                                                          event.stopPropagation()
                                                          this.removeSheet(id)
                                                      }}'
                                                  >
                                                      <span>Supprimer</span>
                                                  </button>
                                              </div>
                                          </rv-link>
                                      </li>
                                  `
                              })}
                    </ul>
                </div>
            `,
            this
        )
    }
}
