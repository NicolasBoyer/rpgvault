import {SHEETRPGElement, TPosition} from '../types.js'

type Mouse = {
    x: number
    y: number
    translateX: number
    translateY: number
    originalX: number
    originalY: number
}

export class ElementResizer {
    private static mouse: Mouse
    private static elements: Record<string, SHEETRPGElement> = {}
    private static offsetPosition: TPosition
    private static selectedSelectorId: string
    private static leftHorizontalMove: boolean
    private static rightHorizontalMove: boolean
    private static topVerticalMove: boolean
    private static bottomVerticalMove: boolean
    private static width: number
    private static height: number
    static isPointerDown = false
    static boxPositions = [
        {class: 'leftTop'},
        {class: 'leftCenter'},
        {class: 'leftBottom'},
        {class: 'centerTop'},
        {class: 'centerBottom'},
        {class: 'rightTop'},
        {class: 'rightCenter'},
        {class: 'rightBottom'}
    ]

    static init(pElement: SHEETRPGElement, pOffset: TPosition, pCallback: (position: TPosition) => void): void {
        pElement.selector = pElement.querySelector('input, textarea') || pElement
        if (this.elements[pElement.selector.id]) return
        this.elements[pElement.selector.id] = pElement
        this.offsetPosition = pOffset
        pElement.resizerCallback = pCallback
        this.mouse = {
            x: 0,
            y: 0,
            translateX: 0,
            translateY: 0,
            originalX: 0,
            originalY: 0
        }
        this.selectedSelectorId = pElement.selector.id
        window.addEventListener('resize', (): void => this.resetHandler(pElement))
        this.resetHandler(pElement)
        document.body.addEventListener('pointermove', this.pointerMove)
        document.body.addEventListener('pointerup', this.pointerUp)
    }

    private static resetHandler(pElement: SHEETRPGElement): void {
        const boundingBox = pElement.getBoundingClientRect()
        const boxSize = 15
        const boxPositions = [
            {top: 0, left: 0, class: 'leftTop'},
            {top: boundingBox.height / 2, left: 0, class: 'leftCenter'},
            {top: boundingBox.height, left: 0, class: 'leftBottom'},
            {top: 0, left: boundingBox.width / 2, class: 'centerTop'},
            {top: boundingBox.height, left: boundingBox.width / 2, class: 'centerBottom'},
            {top: 0, left: boundingBox.width, class: 'rightTop'},
            {top: boundingBox.height / 2, left: boundingBox.width, class: 'rightCenter'},
            {top: boundingBox.height, left: boundingBox.width, class: 'rightBottom'}
        ]
        for (const boxPosition of boxPositions) {
            const handler: HTMLElement | null = pElement.querySelector(`.${boxPosition.class}`)
            if (handler) {
                handler.setAttribute('style', `top: ${boxPosition.top - boxSize / 2}px;left: ${boxPosition.left - boxSize / 2}px;width: ${boxSize}px;height: ${boxSize}px;border-radius: ${boxSize}px;`)
                handler.addEventListener('pointerdown', this.pointerDown)
            }
        }
    }

    private static pointerDown(pEvent: PointerEvent): void {
        ElementResizer.mouse.originalX = pEvent.pageX
        ElementResizer.mouse.originalY = pEvent.pageY
        const element = <HTMLElement>pEvent.target
        ElementResizer.leftHorizontalMove = element.className.includes('left')
        ElementResizer.rightHorizontalMove = element.className.includes('right')
        ElementResizer.topVerticalMove = element.className.includes('Top')
        ElementResizer.bottomVerticalMove = element.className.includes('Bottom')
        ElementResizer.selectedSelectorId = (<HTMLElement>element.parentElement?.firstElementChild).id || (<HTMLElement>element.parentElement).id
        ElementResizer.width = ElementResizer.elements[ElementResizer.selectedSelectorId].getBoundingClientRect().width
        ElementResizer.height = ElementResizer.elements[ElementResizer.selectedSelectorId].getBoundingClientRect().height
        ElementResizer.isPointerDown = true
        document.body.classList.add('isResizing')
    }

    private static pointerMove(pEvent: PointerEvent): void {
        pEvent.returnValue = false
        ElementResizer.mouse.x = pEvent.pageX - ElementResizer.mouse.originalX
        ElementResizer.mouse.y = pEvent.pageY - ElementResizer.mouse.originalY
        const element = ElementResizer.elements[ElementResizer.selectedSelectorId]
        const translate = new WebKitCSSMatrix(getComputedStyle(element).transform)
        ElementResizer.mouse.translateX = translate.m41
        ElementResizer.mouse.translateY = translate.m42
        if (pEvent.pressure !== 0 && ElementResizer.isPointerDown) {
            if (ElementResizer.leftHorizontalMove) {
                ElementResizer.mouse.translateX = pEvent.pageX + window.scrollX - ElementResizer.offsetPosition.x
                element.selector.style.width = ElementResizer.width - ElementResizer.mouse.x + 'px'
            }
            if (ElementResizer.rightHorizontalMove) element.selector.style.width = ElementResizer.width + ElementResizer.mouse.x + 'px'
            if (ElementResizer.topVerticalMove) {
                ElementResizer.mouse.translateY = pEvent.pageY + window.scrollY - ElementResizer.offsetPosition.y
                element.selector.style.height = ElementResizer.height - ElementResizer.mouse.y + 'px'
            }
            if (ElementResizer.bottomVerticalMove) element.selector.style.height = ElementResizer.height + ElementResizer.mouse.y + 'px'
            element.style.transform = `translate(${ElementResizer.mouse.translateX}px, ${ElementResizer.mouse.translateY}px)`
            ElementResizer.resetHandler(element)
        }
    }

    private static async pointerUp(): Promise<void> {
        if (ElementResizer.isPointerDown) {
            const element = ElementResizer.elements[ElementResizer.selectedSelectorId]
            await element.resizerCallback({
                x: ElementResizer.mouse.translateX,
                y: ElementResizer.mouse.translateY,
                width: parseInt(element.selector.style.width),
                height: parseInt(element.selector.style.height)
            })
            ElementResizer.isPointerDown = false
            document.body.classList.remove('isResizing')
        }
    }
}
