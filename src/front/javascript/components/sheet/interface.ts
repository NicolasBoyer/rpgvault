import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import {html, TemplateResult} from 'lit'
import {ElementManager} from '../../classes/elementManager.js'
import {ElementMover} from '../../classes/elementMover.js'
import Input from './input.js'
import Image from './image.js'
import {elements} from '../../datas/elements.js'
import {HTMLElementEvent, SHEETRPGElement, TElement, TFont, TInput, TPosition} from '../../types.js'
import View from './view.js'
import {ShortcutManager} from '../../classes/shortcutManager.js'
import {EInterface} from '../../enum.js'

/**
 * Contient toutes les fonctions relatives à l'interface et son rendu
 */
export default class Interface {
    private static initializeMove(pElement: SHEETRPGElement): void {
        ShortcutManager.set(document.body, ['Tab'], (): void => {
            if (States.interface === EInterface.hover) this.changeInterface(EInterface.movable)
            else if (States.interface === EInterface.movable) this.changeInterface(EInterface.hidden)
            else if (States.interface === EInterface.hidden) this.changeInterface(EInterface.hover)
        })
        if (States.interface === EInterface.movable && States.editMode && pElement) {
            ElementMover.init(pElement, {
                x: Sheet.containerLeft,
                y: Sheet.containerTop
            }, (pMousePosition): void => {
                States.isSaved = false
                View.render()
                const setUIBlocksPosition: Record<string, TPosition> = {}
                setUIBlocksPosition[pElement.classList[0]] = pMousePosition
                Datas.sheetProperties.push({setUIBlocksPosition: setUIBlocksPosition})
            }, pElement)
        }
    }

    static viewBlock(): TemplateResult {
        return html`
			<div class="viewBlock">
				<a href="#" role="button" class="viewSelection ${States.interface === EInterface.hover ? 'selected' : ''}" @click="${(pEvent: PointerEvent): void => {
    pEvent.preventDefault()
    this.changeInterface(EInterface.hover)
}}" title="Interface sur demande">
					<svg class="eye-plus">
						<use href="#eye-plus"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === EInterface.movable ? 'selected' : ''}" @click="${(pEvent: PointerEvent): void => {
    pEvent.preventDefault()
    this.changeInterface(EInterface.movable)
}}" title="Interface toujours visible et déplaçable">
					<svg class="eye">
						<use href="#eye"></use>
					</svg>
				</a>
				<a href="#" role="button" class="viewSelection ${States.interface === EInterface.hidden ? 'selected' : ''}" @click="${(pEvent: PointerEvent): void => {
    pEvent.preventDefault()
    this.changeInterface(EInterface.hidden)
}}" title="Interface cachée">
					<svg class="eye-blocked">
						<use href="#eye-blocked"></use>
					</svg>
				</a>
				<a href="#" role="button" ?disabled="${States.isSaved}" class="saveButton" @click="${async (pEvent: PointerEvent): Promise<void> => {
    pEvent.preventDefault()
    await Datas.save()
    View.render()
}}" title="Sauvegarder">
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
			<article .hidden="${States.isEditBlockHidden}" class="editBlock${hasMoved ? ' hasMoved' : ''}" id="editBlock" style="${hasMoved ? `transform: translate(${Datas.sheet.ui?.editBlock.x}px, ${Datas.sheet.ui?.editBlock.y}px);` : ''}">
				${States.interface !== 'hidden' ? this.viewBlock() : ''}
				<button class="contrast" @click="${(): void => Sheet.editBackgroundImage()}">Image de fond</button>
				<button class="contrast" @click="${(): void => Sheet.changeBackgroundColor()}">Couleur du fond</button>
				<button class="contrast" @click="${(): void => Sheet.addFont()}">Ajouter une police</button>
				<button class="contrast" @click="${(): void => Sheet.deleteFont()}">Supprimer une police</button>
				<button class="contrast" @click="${(): void => Input.add()}">Ajouter un champ</button>
				<button class="contrast" @click="${(): void => Image.add()}">Ajouter une image</button>
				<div class="validBlock">
					<button @click="${(): void => {
        States.displayEditMode(false)
    }}">Annuler
					</button>
					<button class="save" @click="${async (): Promise<void> => {
        await Datas.save()
        States.displayEditMode(false)
    }}">Enregistrer et fermer
						<fs-loader ?visible="${Datas.isSaving}"></fs-loader>
					</button>
				</div>
			</article>
		`
    }

    static selectBlock(pElement: TElement): TemplateResult {
        setTimeout((): void => this.initializeMove(<SHEETRPGElement>document.querySelector('.selectBlock')))
        const hasMoved = States.interface === 'movable' && Datas.sheet.ui && Datas.sheet.ui.selectBlock
        return html`
			<article id="selectBlock" class="selectBlock${hasMoved ? ' hasMoved' : ''}" @click="${(pEvent: PointerEvent): void => pEvent.stopPropagation()}" style="${hasMoved ? `transform: translate(${Datas.sheet.ui?.selectBlock.x}px, ${Datas.sheet.ui?.selectBlock.y}px);` : ''}">
				<a href="#" role="button" class="cloneInput" @click="${(pEvent: PointerEvent): void => {
        pEvent.preventDefault()
        ElementManager.clone(pEvent, pElement)
    }}" title="Dupliquer (ctrl D)">
					<svg class="clone">
						<use href="#clone"></use>
					</svg>
				</a>
				<a href="#" role="button" class="deleteInput" @click="${(pEvent: PointerEvent): void => {
        pEvent.preventDefault()
        ElementManager.delete(pElement.id)
    }}" title="Supprimer (Suppr)">
					<svg class="trash">
						<use href="#trash"></use>
					</svg>
				</a>
				${elements(pElement, Datas.sheet.fonts!.map((pFont: TFont): { name: string, value: string } => ({
    name: pFont.fontFamily,
    value: pFont.fontFamily
}))).filter((pEntry): unknown => pElement.type || pElement.image && pElement[pEntry.id]).map((pEntry): TemplateResult => html`
					<fs-label
							id="${pEntry.id}"
							type="${pEntry.type}"
							name="${pEntry.name}"
							value="${pEntry.value}"
							@input="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => Datas.addInputValues(<TInput>pElement, pEntry.id, pEvent.target.value)}"
							options="${JSON.stringify(pEntry.options)}"
					></fs-label>
				`)}
			</article>
		`
    }

    private static changeInterface(pInterface: EInterface): void {
        if (pInterface !== EInterface.movable) ElementMover.reset()
        States.interface = pInterface
        Datas.sheetProperties.push({setUIBlocksInterface: {interface: States.interface}})
        States.isSaved = false
        View.render()
    }
}
