import { ShortcutManager } from './shortcutManager.js'
import States from '../components/sheet/states.js'
import Sheet from '../components/sheet/sheet.js'
import { Utils } from './utils.js'
import Datas from '../components/sheet/datas.js'
import View from '../components/sheet/view.js'
import { Caches } from './caches.js'
import { ElementMover } from './elementMover.js'
import { ElementResizer } from './elementResizer.js'
import { RPGVAULTElement, TCheckbox, TElement, TImage, TInput, TPosition } from '../types.js'
import { EElementType } from '../enum.js'
import { History } from './history.js'
import { KeyboardManager } from './keyboardManager.js'
import { Drawer } from './drawer.js'

export class ElementManager {
    // TODO peut etre réviser ce code pour etre sur qu'il est bien
    static selectedInfosElements: TElement[] = []
    static blockResetSelection = false
    static infosElements: TElement[] = []

    static init(): void {
        this.infosElements = (<TElement[]>Datas.sheet.inputs || []).concat(<TElement[]>Datas.sheet.images)?.concat(<TElement[]>Datas.sheet.checkboxes)
        if (States.editMode) {
            this.infosElements.forEach((pInfosElement: TElement): void => {
                if (pInfosElement) {
                    const htmlElement: RPGVAULTElement = <RPGVAULTElement>document.querySelector(`label[for='${pInfosElement.id}'], div[id='${pInfosElement.id}']`)
                    ElementMover.init(
                        htmlElement,
                        {
                            x: Sheet.containerLeft,
                            y: Sheet.containerTop,
                        },
                        (pMousePosition): void => {
                            if (pInfosElement.elementType === EElementType.input) {
                                History.execute(
                                    'moveInput',
                                    "Déplacement d'un input",
                                    Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TInput>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)],
                                    Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TInput>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y]
                                )
                            }
                            if (pInfosElement.elementType === EElementType.image) {
                                History.execute(
                                    'moveImage',
                                    "Déplacement d'une image",
                                    Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TImage>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)],
                                    Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TImage>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y]
                                )
                            }
                            if (pInfosElement.elementType === EElementType.checkbox) {
                                History.execute(
                                    'moveCheckbox',
                                    "Déplacement d'une checkbox",
                                    Datas.addCheckboxValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TCheckbox>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)],
                                    Datas.addCheckboxValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TCheckbox>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y]
                                )
                            }
                        }
                    )
                    ElementResizer.init(
                        htmlElement,
                        {
                            x: Sheet.containerLeft,
                            y: Sheet.containerTop,
                        },
                        (pMousePosition: TPosition): void => {
                            if (pInfosElement.elementType === EElementType.input) {
                                History.execute(
                                    'resizeInput',
                                    "Redimensionnement d'un input",
                                    Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [
                                        <TInput>pInfosElement,
                                        'x',
                                        Math.round(pMousePosition.x / Sheet.ratio),
                                        'y',
                                        Math.round(pMousePosition.y / Sheet.ratio),
                                        'width',
                                        Math.round(<number>pMousePosition.width / Sheet.ratio),
                                        'height',
                                        Math.round(<number>pMousePosition.height / Sheet.ratio),
                                    ],
                                    Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TInput>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y, 'width', pInfosElement.width, 'height', pInfosElement.height]
                                )
                            }
                            if (pInfosElement.elementType === EElementType.image) {
                                History.execute(
                                    'resizeImage',
                                    "Redimensionnement d'une image",
                                    Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [
                                        <TImage>pInfosElement,
                                        'x',
                                        Math.round(pMousePosition.x / Sheet.ratio),
                                        'y',
                                        Math.round(pMousePosition.y / Sheet.ratio),
                                        'width',
                                        Math.round(<number>pMousePosition.width / Sheet.ratio),
                                        'height',
                                        Math.round(<number>pMousePosition.height / Sheet.ratio),
                                    ],
                                    Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TImage>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y, 'width', pInfosElement.width, 'height', pInfosElement.height]
                                )
                            }
                            if (pInfosElement.elementType === EElementType.checkbox) {
                                History.execute(
                                    'resizeCheckbox',
                                    "Redimensionnement d'une checkbox",
                                    Datas.addCheckboxValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [
                                        <TCheckbox>pInfosElement,
                                        'x',
                                        Math.round(pMousePosition.x / Sheet.ratio),
                                        'y',
                                        Math.round(pMousePosition.y / Sheet.ratio),
                                        'width',
                                        Math.round(<number>pMousePosition.width / Sheet.ratio),
                                        'height',
                                        Math.round(<number>pMousePosition.height / Sheet.ratio),
                                    ],
                                    Datas.addCheckboxValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TCheckbox>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y, 'width', pInfosElement.width, 'height', pInfosElement.height]
                                )
                            }
                        }
                    )
                }
            })
        } else {
            document.querySelectorAll('[data-initialized]').forEach((pElement: Element): void => pElement.removeAttribute('data-initialized'))
            ElementMover.reset()
            ElementResizer.reset()
            ShortcutManager.reset()
        }
    }

    static deleteWithHistory(pInfosElement: TElement | null = null): void {
        const infosElements = pInfosElement ? [pInfosElement] : this.selectedInfosElements
        for (const infosElement of infosElements) {
            const selectedInfosElementId = infosElement.id
            switch (infosElement.elementType) {
                case EElementType.input:
                    History.execute(
                        'deleteInput',
                        "Suppression d'un input",
                        this.delete.bind(this) as unknown as (...args: unknown[]) => void,
                        [<TInput>infosElement],
                        ((): void => {
                            Datas.addInputValues(<TInput>infosElement)
                            Datas.deletedInputs = Datas.deletedInputs.filter((inputId: string): boolean => inputId !== selectedInfosElementId)
                        }) as unknown as (...args: unknown[]) => void,
                        [<TInput>infosElement]
                    )
                    break
                case EElementType.image:
                    History.execute(
                        'deleteImage',
                        "Suppression d'une image",
                        this.delete.bind(this) as unknown as (...args: unknown[]) => void,
                        [<TImage>infosElement],
                        ((): void => {
                            Datas.addImageValues(<TImage>infosElement)
                            Datas.deletedImages = Datas.deletedImages.filter((imageId: string): boolean => imageId !== selectedInfosElementId)
                        }) as unknown as (...args: unknown[]) => void,
                        [<TImage>infosElement]
                    )
                    break
                case EElementType.checkbox:
                    History.execute(
                        'deleteCheckbox',
                        "Suppression d'une checkbox",
                        this.delete.bind(this) as unknown as (...args: unknown[]) => void,
                        [<TCheckbox>infosElement],
                        ((): void => {
                            Datas.addCheckboxValues(<TCheckbox>infosElement)
                            Datas.deletedCheckboxes = Datas.deletedCheckboxes.filter((checkboxId: string): boolean => checkboxId !== selectedInfosElementId)
                        }) as unknown as (...args: unknown[]) => void,
                        [<TCheckbox>infosElement]
                    )
                    break
            }
        }
        States.isSaved = false
        View.render()
    }

    static async clone(pEvent: Event): Promise<void> {
        for (const { index, infosElement } of this.selectedInfosElements.map((infosElement, index): { index: number; infosElement: TElement } => ({ index, infosElement }))) {
            const clone: TElement = { ...infosElement, id: Utils.generateId().toString(), elementType: infosElement.elementType }
            switch (infosElement.elementType) {
                case EElementType.input:
                    History.execute('cloneInput', "Duplication d'un input", Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void, [<TInput>clone], this.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                        <TInput>clone,
                    ])
                    break
                case EElementType.image:
                    History.execute('cloneImage', "Duplication d'une image", Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void, [<TImage>clone], this.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                        <TImage>clone,
                    ])
                    break
                case EElementType.checkbox:
                    History.execute(
                        'cloneCheckbox',
                        "Duplication d'une checkbox",
                        Datas.addCheckboxValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                        [<TCheckbox>clone],
                        this.delete.bind(this) as unknown as (...args: unknown[]) => void,
                        [<TCheckbox>clone]
                    )
                    break
            }
            if (index === 1) this.blockResetSelection = true
            this.select(pEvent, clone)
        }
        this.blockResetSelection = false
    }

    static copy(): void {
        Caches.set(false, 'elementDatas', this.selectedInfosElements)
    }

    static cut(): void {
        Caches.set(false, 'elementDatas', this.selectedInfosElements)
        for (const infosElement of this.selectedInfosElements) {
            this.delete(infosElement)
        }
    }

    static async paste(pEvent: Event): Promise<void> {
        const mousePosition = Utils.getMousePosition()
        const selectedInfosElements = (await Caches.get('elementDatas')) as TElement[]
        for (const { index, selectedInfosElement } of selectedInfosElements.map((selectedInfosElement, index): { index: number; selectedInfosElement: TElement } => ({ index, selectedInfosElement }))) {
            const offsetX = selectedInfosElements.length ? selectedInfosElements[0].x - selectedInfosElement.x : 0
            const offsetY = selectedInfosElements.length ? selectedInfosElements[0].y - selectedInfosElement.y : 0
            const infosElement: TElement = {
                ...selectedInfosElement,
                x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio) + offsetX,
                y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio) + offsetY,
                id: Utils.generateId().toString(),
            }
            switch (selectedInfosElement.elementType) {
                case EElementType.input:
                    History.execute('pasteInput', 'Colle un input', Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void, [<TInput>infosElement], this.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                        <TInput>infosElement,
                    ])
                    break
                case EElementType.image:
                    History.execute('pasteImage', 'Colle une image', Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void, [<TImage>infosElement], this.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                        <TImage>infosElement,
                    ])
                    break
                case EElementType.checkbox:
                    History.execute(
                        'pasteCheckbox',
                        'Colle une checkbox',
                        Datas.addCheckboxValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                        [<TCheckbox>infosElement],
                        this.delete.bind(this) as unknown as (...args: unknown[]) => void,
                        [<TCheckbox>infosElement]
                    )
                    break
            }
            if (index === 1) this.blockResetSelection = true
            this.select(pEvent, infosElement)
        }
        this.blockResetSelection = false
    }

    static select(pEvent: Event | null = null, pInfosElement: TElement | null = null): void {
        if (States.editMode) {
            if (pEvent) pEvent.stopPropagation()
            if (pInfosElement) {
                console.log(pInfosElement)
                if (!KeyboardManager.isShiftDown && !this.blockResetSelection) this.selectedInfosElements = []
                if (this.selectedInfosElements.some((pSelectedInfosElement): boolean => pInfosElement.id === pSelectedInfosElement.id)) {
                    this.selectedInfosElements = this.selectedInfosElements.filter((pSelectedInfosElement): boolean => pInfosElement.id !== pSelectedInfosElement.id)
                } else this.selectedInfosElements.push(pInfosElement as TElement)
                const selectedElement = <RPGVAULTElement>document.querySelector(`label[for='${pInfosElement.id}'], div[id='${pInfosElement.id}']`)
                ElementResizer.resetHandler(selectedElement)
                ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent: KeyboardEvent): Promise<void> => this.clone(pEvent))
                ShortcutManager.set(selectedElement, ['Control', 'c'], (): void => this.copy())
                ShortcutManager.set(selectedElement, ['Control', 'x'], (): void => this.cut())
                ShortcutManager.set(document.body, ['Control', 'v'], (pEvent: KeyboardEvent): Promise<void> => this.paste(pEvent))
                ShortcutManager.set(selectedElement, ['Delete'], (): void => this.deleteWithHistory())
            } else {
                this.selectedInfosElements = []
            }
            View.render()
        }
    }

    static resetMarqueeSelect(): void {
        Drawer.init(<HTMLElement>Sheet.element.querySelector('.wrapper'), { x: Sheet.containerLeft, y: Sheet.containerTop }, async (pMousePosition, pEvent): Promise<void> => {
            const marqueeWidth = Math.abs(pMousePosition.x / Sheet.ratio - pMousePosition.startX / Sheet.ratio)
            const marqueeHeight = Math.abs(pMousePosition.y / Sheet.ratio - pMousePosition.startY / Sheet.ratio)
            // TODO revoir les width et height des sheet en number sur mongocompass
            // TODO pouvoir sélectionner dans tous les sens
            this.infosElements.forEach((pInfosElement: TElement): void => {
                if (
                    pInfosElement.x >= pMousePosition.startX / Sheet.ratio &&
                    pInfosElement.x + pInfosElement.width <= marqueeWidth + pMousePosition.startX / Sheet.ratio &&
                    pInfosElement.y >= pMousePosition.startY / Sheet.ratio &&
                    pInfosElement.y + pInfosElement.height <= marqueeHeight + pMousePosition.startY / Sheet.ratio
                ) {
                    this.blockResetSelection = true
                    this.select(pEvent, pInfosElement)
                }
            })
            this.blockResetSelection = false
        })
    }

    static delete(pInfosElement: TElement): void {
        const selectedInfosElementId = pInfosElement.id
        switch (pInfosElement.elementType) {
            case EElementType.input:
                Datas.sheet.inputs = Datas.sheet.inputs?.filter((input: TInput): boolean => input.id !== selectedInfosElementId)
                Datas.deletedInputs.push(selectedInfosElementId)
                break
            case EElementType.image:
                Datas.sheet.images = Datas.sheet.images?.filter((image: TImage): boolean => image.id !== selectedInfosElementId)
                Datas.deletedImages.push(selectedInfosElementId)
                break
            case EElementType.checkbox:
                Datas.sheet.checkboxes = Datas.sheet.checkboxes?.filter((checkbox: TCheckbox): boolean => checkbox.id !== selectedInfosElementId)
                Datas.deletedCheckboxes.push(selectedInfosElementId)
                break
        }
        States.isSaved = false
        View.render()
    }
}
