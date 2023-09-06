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

export class ElementManager {
    static selectedInfosElement: TElement

    static init(): void {
        ;(<TElement[]>Datas.sheet.inputs)?.concat(<TElement[]>Datas.sheet.images).forEach((pInfosElement: TElement): void => {
            if (pInfosElement) {
                const htmlElement: SHEETRPGElement = <SHEETRPGElement>document.querySelector(`label[for='${pInfosElement.id}'], div[id='${pInfosElement.id}']`)
                if (!htmlElement.getAttribute('data-initialized')) {
                    ElementMover.init(
                        htmlElement,
                        {
                            x: Sheet.containerLeft,
                            y: Sheet.containerTop,
                        },
                        (pMousePosition): void => {
                            if (pInfosElement.elementType === EElementType.input) {
                                Datas.addInputValues(<TInput>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
                            }
                            if (pInfosElement.elementType === EElementType.image) {
                                Datas.addImageValues(<TImage>pInfosElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
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
                                Datas.addInputValues(
                                    <TInput>pInfosElement,
                                    'x',
                                    Math.round(pMousePosition.x / Sheet.ratio),
                                    'y',
                                    Math.round(pMousePosition.y / Sheet.ratio),
                                    'width',
                                    Math.round(<number>pMousePosition.width / Sheet.ratio),
                                    'height',
                                    Math.round(<number>pMousePosition.height / Sheet.ratio)
                                )
                            }
                            if (pInfosElement.elementType === EElementType.image) {
                                Datas.addImageValues(
                                    <TImage>pInfosElement,
                                    'x',
                                    Math.round(pMousePosition.x / Sheet.ratio),
                                    'y',
                                    Math.round(pMousePosition.y / Sheet.ratio),
                                    'width',
                                    Math.round(<number>pMousePosition.width / Sheet.ratio),
                                    'height',
                                    Math.round(<number>pMousePosition.height / Sheet.ratio)
                                )
                            }
                        }
                    )
                    htmlElement.setAttribute('data-initialized', 'true')
                }
            }
        })
    }

    static delete(): void {
        const selectedInfosElementId = this.selectedInfosElement.id
        switch (this.selectedInfosElement.elementType) {
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

    static async clone(pEvent: Event): Promise<void> {
        const clone: TElement = { ...this.selectedInfosElement, id: Utils.generateId().toString(), elementType: this.selectedInfosElement.elementType }
        switch (this.selectedInfosElement.elementType) {
            case EElementType.input:
                Datas.addInputValues(<TInput>clone)
                break
            case EElementType.image:
                await Datas.addImageValues(<TImage>clone)
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
                Datas.addInputValues(<TInput>infosElement)
                break
            case EElementType.image:
                await Datas.addImageValues(<TImage>infosElement)
                break
        }
        this.select(pEvent, infosElement)
    }

    static select(pEvent: Event | null = null, pInfosElement: TElement | null = null): void {
        if (States.editMode) {
            if (pEvent) pEvent.stopPropagation()
            // TODO aussi revue du code pour etre sur que les choix de type soit les bons
            this.selectedInfosElement = <TElement>pInfosElement
            View.render()
            if (pInfosElement) {
                const selectedElement: HTMLElement = <HTMLElement>document.querySelector(`label[for='${pInfosElement.id}'], div[id='${pInfosElement.id}']`)
                ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent: KeyboardEvent): Promise<void> => this.clone(pEvent))
                ShortcutManager.set(selectedElement, ['Control', 'c'], (): void => this.copy())
                ShortcutManager.set(document.body, ['Control', 'v'], (pEvent: KeyboardEvent): Promise<void> => this.paste(pEvent))
                ShortcutManager.set(selectedElement, ['Delete'], (): void => this.delete())
            }
        }
    }
}
