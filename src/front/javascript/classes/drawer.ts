import {Dom} from './dom.js'
import {TPosition} from '../types.js'
import States from '../components/sheet/states.js'
import {ElementMover} from './elementMover.js'
import {ShortcutManager} from './shortcutManager.js'

type Mouse = {
    x: number
    y: number
    startX: number
    startY: number
}

export class Drawer {
    private static mouse: Mouse
    private static element: HTMLElement
    private static bd: typeof Dom
    private static offsetPosition: TPosition
    private static callBack: (mouse: Mouse, event: MouseEvent) => Promise<void>

    static init(pElement: HTMLElement, pOffset: TPosition, pCallBack: (mouse: Mouse, event: MouseEvent) => Promise<void>): void {
        this.element = pElement
        this.bd = Dom.newDom(pElement)
        this.offsetPosition = pOffset
        this.callBack = pCallBack
        this.resetMousePosition()
        this.element.addEventListener('pointerdown', this.pointerDown)
        this.element.addEventListener('pointermove', this.pointerMove)
        ShortcutManager.set(document.body, ['Escape'], (): void => {
            this.reset()
            States.displayEditBlock(true)
        })
    }

    private static resetMousePosition(): void {
        this.mouse = {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0
        }
    }

    private static pointerDown(): void {
        States.isDrawing = true
        Drawer.element.addEventListener('click', Drawer.pointerUp)
        Drawer.mouse.startX = Drawer.mouse.x
        Drawer.mouse.startY = Drawer.mouse.y
        Drawer.bd.elt('div', 'rectangle').att('style', `left:${Drawer.mouse.x}px;top:${Drawer.mouse.y}px;cursor:crosshair;`)
    }

    private static pointerMove(pEvent: PointerEvent): void {
        pEvent.returnValue = false
        Drawer.mouse.x = pEvent.pageX + window.scrollX - Drawer.offsetPosition.x
        Drawer.mouse.y = pEvent.pageY + window.scrollY - Drawer.offsetPosition.y
        if (pEvent.pressure !== 0) Drawer.bd.att('style', `width:${Math.abs(Drawer.mouse.x - Drawer.mouse.startX)}px;height:${Math.abs(Drawer.mouse.y - Drawer.mouse.startY)}px;left:${(Drawer.mouse.x - Drawer.mouse.startX < 0) ? `${Drawer.mouse.x}px` : `${Drawer.mouse.startX}px`};top:${(Drawer.mouse.y - Drawer.mouse.startY < 0) ? `${Drawer.mouse.y}px` : `${Drawer.mouse.startY}px`}`)
    }

    private static async pointerUp(pEvent: MouseEvent): Promise<void> {
        ElementMover.isPointerDown = false
        await Drawer.callBack(Drawer.mouse, pEvent)
        Drawer.bd.current().remove()
        Drawer.reset()
    }

    private static reset(): void {
        States.isDrawing = false
        this.resetMousePosition()
        this.element.removeEventListener('pointerdown', this.pointerDown)
        this.element.removeEventListener('pointermove', this.pointerMove)
        this.element.removeEventListener('click', this.pointerUp)
    }
}
