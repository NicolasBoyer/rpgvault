import { ShortcutManager } from './shortcutManager.js'
import States from '../components/sheet/states.js'
import Sheet from '../components/sheet/sheet.js'
import { Utils } from './utils.js'
import Datas from '../components/sheet/datas.js'
import View from '../components/sheet/view.js'
import { Caches } from './caches.js'
import { ElementMover } from './elementMover.js'
import { ElementResizer } from './elementResizer.js'
import { SHEETRPGElement, TElement, TImage, TInput, TPosition } from '../types.js'
import { EElementType } from '../enum.js'
import { History } from './history.js'

export class ElementManager {
    // TODO peut etre réviser ce code pour etre sur qu'il est bien
    static selectedInfosElement: TElement

    static init(): void {
        if (States.editMode) {
            ;(<TElement[]>Datas.sheet.inputs)?.concat(<TElement[]>Datas.sheet.images).forEach((pInfosElement: TElement): void => {
                if (pInfosElement) {
                    const htmlElement: SHEETRPGElement = <SHEETRPGElement>document.querySelector(`label[for='${pInfosElement.id}'], div[id='${pInfosElement.id}']`)
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
                                    'Déplacement d\'un input',
                                    Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TInput>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)],
                                    Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TInput>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y]
                                )
                            }
                            if (pInfosElement.elementType === EElementType.image) {
                                History.execute(
                                    'moveImage',
                                    'Déplacement d\'une image',
                                    Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TImage>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio)],
                                    Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void,
                                    [<TImage>pInfosElement, 'x', pInfosElement.x, 'y', pInfosElement.y]
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
                                    'Redimensionnement d\'un input',
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
                                    'Redimensionnement d\'une image',
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
        const infosElement = pInfosElement || this.selectedInfosElement
        const selectedInfosElementId = infosElement.id
        switch (infosElement.elementType) {
            case EElementType.input:
                History.execute(
                    'deleteInput',
                    'Suppression d\'un input',
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
                    'Suppression d\'une image',
                    this.delete.bind(this) as unknown as (...args: unknown[]) => void,
                    [<TImage>infosElement],
                    ((): void => {
                        Datas.addImageValues(<TImage>infosElement)
                        Datas.deletedImages = Datas.deletedImages.filter((imageId: string): boolean => imageId !== selectedInfosElementId)
                    }) as unknown as (...args: unknown[]) => void,
                    [<TImage>infosElement]
                )
                break
        }
        States.isSaved = false
        View.render()
    }

    static async clone(pEvent: Event): Promise<void> {
        const clone: TElement = { ...this.selectedInfosElement, id: Utils.generateId().toString(), elementType: this.selectedInfosElement.elementType }
        switch (this.selectedInfosElement.elementType) {
            case EElementType.input:
                History.execute('cloneInput', 'Duplication d\'un input', Datas.addInputValues.bind(Datas) as unknown as (...args: unknown[]) => void, [<TInput>clone], this.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                    <TInput>clone,
                ])
                break
            case EElementType.image:
                History.execute('cloneImage', 'Duplication d\'une image', Datas.addImageValues.bind(Datas) as unknown as (...args: unknown[]) => void, [<TImage>clone], this.delete.bind(this) as unknown as (...args: unknown[]) => void, [
                    <TImage>clone,
                ])
                break
        }
        this.select(pEvent, clone)
    }

    static copy(): void {
        Caches.set(false, 'elementDatas', this.selectedInfosElement)
    }

    static async paste(pEvent: Event): Promise<void> {
        const mousePosition = Utils.getMousePosition()
        const infosElement: TElement = {
            ...(<TElement>await Caches.get('elementDatas')),
            x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio),
            y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio),
            id: Utils.generateId().toString(),
            elementType: this.selectedInfosElement.elementType,
        }
        switch (this.selectedInfosElement.elementType) {
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
        }
        this.select(pEvent, infosElement)
    }

    static select(pEvent: Event | null = null, pInfosElement: TElement | null = null): void {
        if (States.editMode) {
            if (pEvent) pEvent.stopPropagation()
            this.selectedInfosElement = <TElement>pInfosElement
            if (pInfosElement) {
                const selectedElement = <SHEETRPGElement>document.querySelector(`label[for='${pInfosElement.id}'], div[id='${pInfosElement.id}']`)
                ElementResizer.resetHandler(selectedElement)
                ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent: KeyboardEvent): Promise<void> => this.clone(pEvent))
                ShortcutManager.set(selectedElement, ['Control', 'c'], (): void => this.copy())
                ShortcutManager.set(document.body, ['Control', 'v'], (pEvent: KeyboardEvent): Promise<void> => this.paste(pEvent))
                ShortcutManager.set(selectedElement, ['Delete'], (): void => this.deleteWithHistory())
            }
            View.render()
        }
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
        }
        States.isSaved = false
        View.render()
    }
}
