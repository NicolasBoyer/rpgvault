import { html, TemplateResult } from 'lit'
import { HTMLElementEvent } from '../../types.js'
import Datas from './datas.js'
import { Utils } from '../../classes/utils.js'
import View from './view.js'

/**
 * Contient toutes les fonctions relatives au Notepad
 */
export default class Notepad {
    private static selectedTab = 0
    private static hoverTabTitle: number | boolean
    private static editTabTitle: number | boolean

    static init(): void {
        const notepadInput = <HTMLInputElement>document.querySelector('#editTitle')
        notepadInput?.focus()
        notepadInput?.select()
    }

    static render(): TemplateResult {
        return html`
            <article id="notepad" @click="${(pEvent: PointerEvent): void => pEvent.stopPropagation()}">
                <nav>
                    <ul>
                        ${Datas.sheet.notepad?.map(
                            (pEntry, pIndex): TemplateResult => html`
                                <li>
                                    <a
                                        @click="${(pEvent: PointerEvent & HTMLElementEvent<HTMLInputElement>): void => {
                                            pEvent.preventDefault()
                                            this.selectedTab = pIndex
                                            View.render()
                                        }}"
                                        @dblclick="${(pEvent: PointerEvent): void => {
                                            pEvent.preventDefault()
                                            this.editTabTitle = pIndex
                                            View.render()
                                        }}"
                                        @pointerenter="${(): void => {
                                            this.hoverTabTitle = pIndex
                                            View.render()
                                        }}"
                                        @pointerleave="${(): void => {
                                            this.hoverTabTitle = false
                                            View.render()
                                        }}"
                                        href="#"
                                        ?aria-current="${pIndex === this.selectedTab}"
                                        role="tab"
                                        >${this.editTabTitle === pIndex
                                            ? html`
                                                  <label for="editTitle"
                                                      ><input
                                                          @keyup="${(pEvent: KeyboardEvent & HTMLElementEvent<HTMLInputElement>): void => {
                                                              if (pEvent.key === 'Escape' || pEvent.key === 'Enter') {
                                                                  this.editTabTitle = false
                                                                  if (pEvent.key === 'Enter') Datas.saveNotepad(pIndex, { title: pEvent.target.value })
                                                                  View.render()
                                                              }
                                                          }}"
                                                          @blur="${(pEvent: PointerEvent & HTMLElementEvent<HTMLInputElement>): void => {
                                                              this.editTabTitle = false
                                                              if (pEvent.target.value !== pEntry.title) Datas.saveNotepad(pIndex, { title: pEvent.target.value })
                                                              View.render()
                                                          }}"
                                                          id="editTitle"
                                                          value="${pEntry.title}"
                                                          type="text"
                                                  /></label>
                                              `
                                            : pEntry.title}</a
                                    >${this.hoverTabTitle === pIndex && Datas.sheet.notepad!.length > 1
                                        ? html` <button
                                              title="Supprimer l'onglet"
                                              @pointerenter="${(): void => {
                                                  this.hoverTabTitle = pIndex
                                                  View.render()
                                              }}"
                                              @pointerleave="${(): void => {
                                                  this.hoverTabTitle = false
                                                  View.render()
                                              }}"
                                              @click="${(): void => {
                                                  if (this.selectedTab === pIndex) {
                                                      this.selectedTab = Datas.sheet.notepad![pIndex + 1] ? pIndex : pIndex - 1
                                                  }
                                                  Datas.saveNotepad(pIndex)
                                                  View.render()
                                              }}"
                                              class="removeTab"
                                          >
                                              <svg class="remove">
                                                  <use href="#remove"></use></svg
                                              ><span>Supprimer l'onglet</span>
                                          </button>`
                                        : ''}
                                </li>
                            `
                        )}
                        <li>
                            <button class="addTab outline secondary" @click="${(pEvent: PointerEvent): void => this.addTab(pEvent)}">
                                <svg class="add">
                                    <use href="#add"></use>
                                </svg>
                                <span>Ajouter un onglet</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                <section>
                    ${Datas.sheet.notepad?.map(
                        (pEntry, pIndex): TemplateResult => html`
                            <div role="tabpanel" ?hidden="${pIndex !== this.selectedTab}">
                                <textarea @change="${(pEvent: HTMLElementEvent<HTMLTextAreaElement>): Promise<void> => Datas.saveNotepad(pIndex, { content: pEvent.target.value })}">${pEntry.content}</textarea>
                            </div>
                        `
                    )}
                </section>
            </article>
        `
    }

    private static addTab(pEvent: PointerEvent): void {
        pEvent.preventDefault()
        let title: string = ''
        Utils.confirm(
            html`
                <label for="tabName"
                    ><span>Nom de l'onglet</span
                    ><input
                        type="text"
                        id="tabName"
                        name="Nom de l'onglet"
                        @change="${(pEVent: HTMLElementEvent<HTMLInputElement>): void => {
                            title = pEVent.target.value
                        }}"
                /></label>
            `,
            (): void => {
                const index = <number>Datas.sheet.notepad?.length
                Datas.saveNotepad(index, { title, content: '' })
                this.selectedTab = index
                View.render()
            }
        )
    }
}
