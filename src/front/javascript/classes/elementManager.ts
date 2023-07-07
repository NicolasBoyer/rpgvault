import {ShortcutManager} from './shortcutManager.js'
import States from '../components/sheet/states.js'
import Sheet from '../components/sheet/sheet.js'
import {Utils} from './utils.js'
import Datas from '../components/sheet/datas.js'
import View from '../components/sheet/view.js'
import {Caches} from './caches.js'
import {ElementMover} from './elementMover.js'
import {ElementResizer} from './elementResizer.js'
import {SHEETRPGElement, TElement, TImage, TInput, TPosition} from '../types.js'

export class ElementManager {
    // TODO a supprimer car le selected element change à chaque fois ou déclarer le selectedelement ailleur
    // static #elementType
    static selectedElementId: string | null

    static init(): void {
        (<TElement[]>Datas.sheet.inputs)?.concat(<TElement[]>Datas.sheet.images).forEach((pElement: TElement): void => {
            const selectedElement: SHEETRPGElement = <SHEETRPGElement>document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
            // TODO marche mais voir si on peut faire mieux l'idée ne passer qu'une fois
            if (!selectedElement.getAttribute('data-movable')) {
                ElementMover.init(selectedElement, {
                    x: Sheet.containerLeft,
                    y: Sheet.containerTop
                }, (pMousePosition): void => {
                    // TODO pb car à chaque déplacement crée une image
                    if (selectedElement.tagName === 'LABEL') {
                        Datas.addInputValues(<TInput>pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
                    }
                    if (selectedElement.tagName === 'div') {
                        Datas.addImageValues(<TImage>pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
                    }
                })
                // TODO la fonction est appelé à chaque render il faut donc soir la limiter avec une variable soit l'appeler à un endroit qui ne l'appelle qu'une fois
                // TODO ICI reste réparation de resizer et revues code comme move + changer ici le selected element qui n'est plus utilisé + voir si je déplace l'appel de cet init ailleurs ...
                // Problème une image est créé suite à chaque déplacement
                ElementResizer.init(selectedElement, {
                    x: Sheet.containerLeft,
                    y: Sheet.containerTop
                }, (pMousePosition: TPosition): void => {
                    if (selectedElement.tagName === 'input') {
                        Datas.addInputValues(<TInput>pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(<number>pMousePosition.width / Sheet.ratio), 'height', Math.round(<number>pMousePosition.height / Sheet.ratio))
                    }
                    if (selectedElement.tagName === 'image') {
                        Datas.addImageValues(<TImage>pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(<number>pMousePosition.width / Sheet.ratio), 'height', Math.round(<number>pMousePosition.height / Sheet.ratio))
                    }
                })
                selectedElement.setAttribute('data-movable', 'true')
            }
        })
    }

    static delete(pElementId: string): void {
        const selectedElement = document.querySelector(`label[for='${pElementId}'], div[id='${pElementId}']`)
        if (selectedElement?.tagName === 'LABEL') {
            const index = <number>Datas.sheet.inputs?.findIndex((input: TInput): boolean => input.id === pElementId)
            if (index !== -1) {
                Datas.sheet.inputs?.splice(index, 1)
                Datas.deletedInputs.push(pElementId)
            }
        }
        if (selectedElement?.tagName === 'div') {
            const index = <number>Datas.sheet.images?.findIndex((image: TImage): boolean => image.id === pElementId)
            if (index !== -1) {
                Datas.sheet.images?.splice(index, 1)
                Datas.deletedImages.push(pElementId)
            }
        }
        States.isSaved = false
        View.render()
    }

    static async clone(pEvent: Event, pElement: TElement): Promise<void> {
        const selectedElement: HTMLElement | null = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
        if (selectedElement?.tagName === 'LABEL') {
            Datas.addInputValues(<TInput>{...pElement, id: Utils.generateId().toString()})
        }
        if (selectedElement?.tagName === 'div') {
            await Datas.addImageValues(<TImage>{...pElement, id: Utils.generateId().toString()})
        }
        this.select(pEvent, pElement)
    }

    static copy(pElement: TElement): void {
        Caches.set(false, 'elementDatas', pElement)
    }

    static async paste(pEvent: Event, pElement: TElement): Promise<void> {
        const selectedElement: HTMLElement | null = document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
        const mousePosition = Utils.getMousePosition()
        const element: TElement = {
            ...<TElement>(await Caches.get('elementDatas')),
            x: Math.round((mousePosition.x - Sheet.containerLeft) / Sheet.ratio),
            y: Math.round((mousePosition.y - Sheet.containerTop) / Sheet.ratio),
            id: Utils.generateId().toString()
        }
        if (selectedElement?.tagName === 'LABEL') {
            Datas.addInputValues(<TInput>element)
        }
        if (selectedElement?.tagName === 'div') {
            await Datas.addImageValues(<TImage>element)
        }
        this.select(pEvent, element)
    }

    static select(pEvent: Event | null = null, pElement: TElement | null = null): void {
        if (States.editMode) {
            if (pEvent) pEvent.stopPropagation()
            // TODO à revoir au niveau des types
            // TODO aussi revue du code pour etre sur que les choix de type soit les bons
            // TODO bug lors du déplacement et du resize ne semble pas passer dans le addinput ou le addimage
            this.selectedElementId = pElement?.id || null
            View.render()
            if (pElement) {
                const selectedElement: HTMLElement = <HTMLElement>document.querySelector(`label[for='${pElement.id}'], div[id='${pElement.id}']`)
                // this.#elementType = selectedElement.tagName === 'LABEL' ? 'input' : 'image'
                // ElementMover.init(selectedElement, {
                //	x: Sheet.containerLeft,
                //	y: Sheet.containerTop
                // }, (pMousePosition) => {
                //	if (this.#elementType === 'input') {
                //		Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
                //	}
                //	if (this.#elementType === 'image') {
                //		Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio))
                //	}
                // })
                // ElementResizer.init(selectedElement, {
                //	x: Sheet.containerLeft,
                //	y: Sheet.containerTop
                // }, (pMousePosition) => {
                //	if (this.#elementType === 'input') {
                //		Datas.addInputValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
                //	}
                //	if (this.#elementType === 'image') {
                //		Datas.addImageValues(pElement, 'x', Math.round(pMousePosition.x / Sheet.ratio), 'y', Math.round(pMousePosition.y / Sheet.ratio), 'width', Math.round(pMousePosition.width / Sheet.ratio), 'height', Math.round(pMousePosition.height / Sheet.ratio))
                //	}
                // })
                ShortcutManager.set(selectedElement, ['Control', 'd'], (pEvent: KeyboardEvent): Promise<void> => this.clone(pEvent, pElement))
                ShortcutManager.set(selectedElement, ['Control', 'c'], (): void => this.copy(pElement))
                ShortcutManager.set(document.body, ['Control', 'v'], (pEvent: KeyboardEvent): Promise<void> => this.paste(pEvent, pElement))
                ShortcutManager.set(selectedElement, ['Delete'], (): void => this.delete(<string>this.selectedElementId))
            }
        }
    }
}
