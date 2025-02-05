import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { html, TemplateResult } from 'lit'
import { ElementManager } from '../../classes/elementManager.js'
import { ElementMover } from '../../classes/elementMover.js'
import Input from './input.js'
import Image from './image.js'
import { elements } from '../../datas/elements.js'
import { HTMLElementEvent, SHEETRPGElement, TElement, TFont, THistory, TInput, TPosition } from '../../types.js'
import View from './view.js'
import { ShortcutManager } from '../../classes/shortcutManager.js'
import { EInterface } from '../../enum.js'
import { History } from '../../classes/history.js'

/**
 * Contient toutes les fonctions relatives à l'interface et son rendu
 */
export default class Interface {
    static viewBlock(): TemplateResult {
        return html`
            <div class="viewBlock">
                <a
                    href="#"
                    role="button"
                    class="viewSelection ${States.interface === EInterface.hover ? 'selected' : ''}"
                    @click="${(pEvent: PointerEvent): void => {
                        pEvent.preventDefault()
                        this.changeInterface(EInterface.hover)
                    }}"
                    title="Interface sur demande"
                >
                    <svg class="eye-plus">
                        <use href="#eye-plus"></use>
                    </svg>
                </a>
                <a
                    href="#"
                    role="button"
                    class="viewSelection ${States.interface === EInterface.movable ? 'selected' : ''}"
                    @click="${(pEvent: PointerEvent): void => {
                        pEvent.preventDefault()
                        this.changeInterface(EInterface.movable)
                    }}"
                    title="Interface toujours visible et déplaçable"
                >
                    <svg class="eye">
                        <use href="#eye"></use>
                    </svg>
                </a>
                <a
                    href="#"
                    role="button"
                    class="viewSelection ${States.interface === EInterface.hidden ? 'selected' : ''}"
                    @click="${(pEvent: PointerEvent): void => {
                        pEvent.preventDefault()
                        this.changeInterface(EInterface.hidden)
                    }}"
                    title="Interface cachée"
                >
                    <svg class="eye-blocked">
                        <use href="#eye-blocked"></use>
                    </svg>
                </a>
                <a
                    href="#"
                    role="button"
                    ?disabled="${States.isSaved}"
                    class="saveButton"
                    @click="${async (pEvent: PointerEvent): Promise<void> => {
                        pEvent.preventDefault()
                        await Datas.save()
                        View.render()
                    }}"
                    title="Sauvegarder"
                >
                    <svg class="floppy">
                        <use href="#floppy"></use>
                    </svg>
                </a>
            </div>
        `
    }

    static editBlock(): TemplateResult {
        setTimeout((): void => this.initializeMove(<SHEETRPGElement>document.querySelector('.editBlock')))
        const hasMoved = States.interface === 'movable' && Datas.sheet.ui && Datas.sheet.ui.editBlock
        return html`
            <article
                .hidden="${States.isEditBlockHidden}"
                class="editBlock${hasMoved ? ' hasMoved' : ''}"
                id="editBlock"
                style="${hasMoved ? `transform: translate(${Datas.sheet.ui?.editBlock.x}px, ${Datas.sheet.ui?.editBlock.y}px);` : ''}"
            >
                ${States.interface !== 'hidden' ? this.viewBlock() : ''}
                <button class="contrast" @click="${(): void => Sheet.editBackgroundImage()}">Image de fond</button>
                <button class="contrast" @click="${(): void => Sheet.changeBackgroundColor()}">Couleur du fond</button>
                <button class="contrast" @click="${(): void => Sheet.addFont()}">Ajouter une police</button>
                <button class="contrast" @click="${(): void => Sheet.deleteFont()}">Supprimer une police</button>
                <button
                    class="contrast"
                    @click="${(): void => {
                        // TODO ICI !!
                        // History.execute('addInput', 'Ajouter un champ', Input.add.bind(this) as unknown as (...args: unknown[]) => void, [], ElementManager.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                        //     <TInput>pInfosElement,
                        // ])
                        Input.add()
                    }}"
                >
                    Ajouter un champ
                </button>
                <button class="contrast" @click="${(): void => Image.add()}">Ajouter une image</button>
                <button
                    class="contrast"
                    @click="${(pEvent: PointerEvent): void => {
                        pEvent.stopPropagation()
                        States.displayHistory(!States.isHistoryBlockHidden)
                    }}"
                >
                    Historique
                </button>
                <div class="validBlock">
                    <button
                        @click="${(): void => {
                            History.reset()
                            States.displayEditMode(false)
                        }}"
                    >
                        Annuler
                    </button>
                    <button
                        class="save"
                        @click="${async (): Promise<void> => {
                            await Datas.save()
                            States.displayEditMode(false)
                        }}"
                    >
                        Enregistrer et fermer
                        <fs-loader ?visible="${Datas.isSaving}"></fs-loader>
                    </button>
                </div>
            </article>
        `
    }

    static selectBlock(pInfosElement: TElement): TemplateResult {
        setTimeout((): void => this.initializeMove(<SHEETRPGElement>document.querySelector('.selectBlock')))
        const hasMoved = States.interface === 'movable' && Datas.sheet.ui && Datas.sheet.ui.selectBlock
        return html`
            <article
                id="selectBlock"
                class="selectBlock${hasMoved ? ' hasMoved' : ''}"
                @click="${(pEvent: PointerEvent): void => pEvent.stopPropagation()}"
                style="${hasMoved ? `transform: translate(${Datas.sheet.ui?.selectBlock.x}px, ${Datas.sheet.ui?.selectBlock.y}px);` : ''}"
            >
                <a
                    href="#"
                    role="button"
                    class="cloneInput"
                    @click="${(pEvent: PointerEvent): void => {
                        pEvent.preventDefault()
                        ElementManager.clone(pEvent)
                    }}"
                    title="Dupliquer (ctrl D)"
                >
                    <svg class="clone">
                        <use href="#clone"></use>
                    </svg>
                </a>
                <a
                    href="#"
                    role="button"
                    class="deleteInput"
                    @click="${(pEvent: PointerEvent): void => {
                        pEvent.preventDefault()
                        ElementManager.deleteWithHistory()
                    }}"
                    title="Supprimer (Suppr)"
                >
                    <svg class="trash">
                        <use href="#trash"></use>
                    </svg>
                </a>
                ${elements(
                    pInfosElement,
                    Datas.sheet.fonts &&
                        Datas.sheet.fonts.map((pFont: TFont): { name: string; value: string } => ({
                            name: pFont.fontFamily,
                            value: pFont.fontFamily,
                        }))
                )
                    .filter((pEntry): unknown => pInfosElement.type || (pInfosElement.image && pInfosElement[pEntry.id as keyof TElement]))
                    .map(
                        (pEntry): TemplateResult => html`
                            <fs-label
                                id="${pEntry.id}"
                                type="${pEntry.type}"
                                name="${pEntry.name}"
                                value="${pEntry.value}"
                                @input="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => {
                                    History.execute(
                                        pEntry.id,
                                        `${pEntry.name} - ${pEvent.target.value}`,
                                        Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                        [<TInput>pInfosElement, pEntry.id, pEvent.target.value],
                                        Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                        [<TInput>pInfosElement, pEntry.id, pInfosElement[pEntry.id as keyof TElement]]
                                    )
                                    View.render()
                                }}"
                                options="${JSON.stringify(pEntry.options)}"
                            ></fs-label>
                        `
                    )}
            </article>
        `
    }

    static historyBlock(): TemplateResult {
        setTimeout((): void => this.initializeMove(<SHEETRPGElement>document.querySelector('.historyBlock')))
        this.scrollHistoryBlockToBottom(<Element>document.querySelector('#historyBlock > main'))
        const hasMoved = States.interface === 'movable' && Datas.sheet.ui && Datas.sheet.ui.historyBlock
        return html`
            <article
                .hidden="${States.isHistoryBlockHidden}"
                class="historyBlock${hasMoved ? ' hasMoved' : ''}"
                id="historyBlock"
                style="${hasMoved ? `transform: translate(${Datas.sheet.ui?.historyBlock.x}px, ${Datas.sheet.ui?.historyBlock.y}px);` : ''}"
            >
                <header>Historique</header>
                <main>
                    ${(<THistory>History.get())?.map((pHistoryEntry, pIndex): TemplateResult => {
                        return html`<div>
                            <button class="${History.position < pIndex + 1 ? 'cancelable' : ''}" @click="${(): void => History.navigateFromPositionTo(pIndex + 1)}">${pHistoryEntry.title}</button>
                        </div>`
                    })}
                </main>
            </article>
        `
    }

    private static scrollHistoryBlockToBottom(pElement: Element): void {
        setTimeout((): void => pElement.scrollTo(0, <number>pElement.scrollHeight))
    }

    private static initializeMove(pElement: SHEETRPGElement): void {
        ShortcutManager.set(document.body, ['Tab'], (): void => {
            if (States.interface === EInterface.hover) this.changeInterface(EInterface.movable)
            else if (States.interface === EInterface.movable) this.changeInterface(EInterface.hidden)
            else if (States.interface === EInterface.hidden) this.changeInterface(EInterface.hover)
        })
        if (States.interface === EInterface.movable && States.editMode && pElement) {
            ElementMover.init(
                pElement,
                {
                    x: Sheet.containerLeft,
                    y: Sheet.containerTop,
                },
                (pMousePosition): void => {
                    States.isSaved = false
                    View.render()
                    const setUIBlocksPosition: Record<string, TPosition> = {}
                    setUIBlocksPosition[pElement.classList[0]] = pMousePosition
                    Datas.sheetProperties.push({
                        setUIBlocksPosition: setUIBlocksPosition,
                    })
                },
                pElement
            )
        } else ElementMover.resetElement('editBlock')
    }

    private static changeInterface(pInterface: EInterface): void {
        States.interface = pInterface
        Datas.sheetProperties.push({
            setUIBlocksInterface: { interface: States.interface },
        })
        States.isSaved = false
        View.render()
    }
}
