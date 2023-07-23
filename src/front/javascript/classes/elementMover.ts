import {ShortcutManager} from './shortcutManager.js'
import {ElementResizer} from './elementResizer.js'
import {SHEETRPGElement, TPosition} from '../types.js'
import States from '../components/sheet/states.js'

export class ElementMover {
    private static mouse: TPosition
    private static elements: Record<string, SHEETRPGElement> = {}
    private static selectedSelectorId: string
    private static offsetPosition: TPosition
    private static isMoving = false
    static isPointerDown = false

    static init(pElement: SHEETRPGElement, pOffset: TPosition, pCallback: (position: TPosition) => void, pSelector: HTMLElement | null = null): void {
        const selector = pSelector || pElement.querySelector('input, textarea') || pElement
        this.elements[selector.id] = pElement
        this.offsetPosition = pOffset
        pElement.moverCallback = pCallback
        this.mouse = {
            x: 0,
            y: 0
        }
        ElementMover.selectedSelectorId = selector.id
        document.body.addEventListener('pointermove', this.pointerMove)
        selector.addEventListener('pointerdown', this.pointerDown)
        selector.addEventListener('pointerup', this.pointerUp)
        ShortcutManager.set(pElement, ['ArrowUp'], (): void => this.moveByKey(0, -1))
        ShortcutManager.set(pElement, ['ArrowDown'], (): void => this.moveByKey(0, 1))
        ShortcutManager.set(pElement, ['ArrowRight'], (): void => this.moveByKey(1))
        ShortcutManager.set(pElement, ['ArrowLeft'], (): void => this.moveByKey(-1))
        ShortcutManager.set(pElement, ['Shift', 'ArrowUp'], (): void => this.moveByKey(0, -10))
        ShortcutManager.set(pElement, ['Shift', 'ArrowDown'], (): void => this.moveByKey(0, 10))
        ShortcutManager.set(pElement, ['Shift', 'ArrowRight'], (): void => this.moveByKey(10))
        ShortcutManager.set(pElement, ['Shift', 'ArrowLeft'], (): void => this.moveByKey(-10))
        ShortcutManager.set(pElement, ['Control', 'ArrowUp'], (): void => this.moveByKey(0, -50))
        ShortcutManager.set(pElement, ['Control', 'ArrowDown'], (): void => this.moveByKey(0, 50))
        ShortcutManager.set(pElement, ['Control', 'ArrowRight'], (): void => this.moveByKey(50))
        ShortcutManager.set(pElement, ['Control', 'ArrowLeft'], (): void => this.moveByKey(-50))
    }

    private static async pointerDown(pEvent: PointerEvent): Promise<void> {
        ElementMover.isPointerDown = true
        document.body.classList.add('isMoving')
        ElementMover.selectedSelectorId = (<HTMLInputElement>pEvent.currentTarget).id || (<HTMLElement>(<HTMLInputElement>pEvent.currentTarget).parentElement).id
    }

    private static pointerMove(pEvent: PointerEvent): void {
        if (States.isDrawing) return
        pEvent.returnValue = false
        const selectedElement = ElementMover.elements[ElementMover.selectedSelectorId]
        if (selectedElement) {
            // eslint-disable-next-line no-undef
            const translate = new WebKitCSSMatrix(getComputedStyle(selectedElement).transform)
            ElementMover.offsetPosition = {
                x: ElementMover.offsetPosition.x + (ElementMover.mouse.x - translate.m41),
                y: ElementMover.offsetPosition.y + (ElementMover.mouse.y - translate.m42)
            }
            ElementMover.mouse.x = pEvent.pageX + window.scrollX - ElementMover.offsetPosition.x
            ElementMover.mouse.y = pEvent.pageY + window.scrollY - ElementMover.offsetPosition.y
            if (pEvent.pressure !== 0 && ElementMover.isPointerDown && !ElementResizer.isPointerDown) {
                selectedElement.classList.add('hasMoved')
                ElementMover.isMoving = true
                selectedElement.style.transform = `translate(${ElementMover.mouse.x}px, ${ElementMover.mouse.y}px)`
            }
        }
    }

    private static pointerUp(): void {
        if (ElementMover.isMoving) ElementMover.elements[ElementMover.selectedSelectorId].moverCallback(ElementMover.mouse)
        if (ElementMover.isPointerDown) {
            ElementMover.isPointerDown = ElementMover.isMoving = false
            document.body.classList.remove('isMoving')
        }
    }

    private static moveByKey(pOffsetX: number, pOffsetY = 0): void {
        const selectedElement = ElementMover.elements[ElementMover.selectedSelectorId]
        const translate = new WebKitCSSMatrix(getComputedStyle(selectedElement).transform)
        const translateX = translate.m41 + pOffsetX
        const translateY = translate.m42 + pOffsetY
        setTimeout((): void => {
            selectedElement.style.transform = `translate(${translateX}px, ${translateY}px)`
        })
        selectedElement.moverCallback({x: translateX, y: translateY})
    }
}
