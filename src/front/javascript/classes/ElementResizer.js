import { Dom } from './dom.js'

export class ElementResizer {
	static #mouse
	static #element
	static #selector
	static #offsetPosition
	static #callBack
	static #isPointerDown = false
	static #keysPress = {}

	static init (pElement, pOffset, pCallBack) {
		this.#element = pElement
		this.#offsetPosition = pOffset
		this.#callBack = pCallBack
		this.#resetMousePosition()
		this.#createHandler()
		// this.#selector.addEventListener('pointerdown', this.#pointerDown)
		// document.body.addEventListener('pointermove', this.#pointerMove)
		// this.#element.addEventListener('keydown', this.#keyDown)
		// this.#element.addEventListener('keyup', this.#keyUp)
	}

	static #resetMousePosition () {
		this.#mouse = {
			x: 0,
			y: 0
		}
	}

	static #createHandler () {
		const boundingBox = this.#element.getBoundingClientRect()
		const boxesSize = 10
		const offset = 5
		const boxes = [
			{ top: 0, left: 0, class: 'leftTop', offset: { top: -boxesSize, left: -boxesSize } },
			{ top: boundingBox.height / 2, left: 0, class: 'leftCenter', offset: { top: -offset, left: -boxesSize - offset } },
			{ top: boundingBox.height, left: 0, class: 'leftBottom', offset: { top: 0, left: -boxesSize } },
			{ top: 0, left: boundingBox.width / 2, class: 'centerTop', offset: { top: -boxesSize - offset, left: -boxesSize / 2 } },
			{ top: boundingBox.height, left: boundingBox.width / 2, class: 'centerBottom', offset: { top: offset, left: -boxesSize / 2 } },
			{ top: 0, left: boundingBox.width, class: 'rightTop', offset: { top: -boxesSize, left: 0 } },
			{ top: boundingBox.height / 2, left: boundingBox.width, class: 'rightCenter', offset: { top: -boxesSize / 2, left: offset } },
			{ top: boundingBox.height, left: boundingBox.width, class: 'rightBottom', offset: { top: 0, left: 0 } }
		]
		const bd = Dom.newDom(this.#element)
		boxes.forEach((pBox) => {
			bd.elt('div', `resizeHandler ${pBox.class}`).att('style', `position: absolute;top: ${pBox.top + pBox.offset.top}px;left: ${pBox.left + pBox.offset.left}px;width: ${boxesSize}px;height: ${boxesSize}px;border-radius: ${boxesSize}px;`).up()
		})
	}

	//
	// static async #pointerDown (pEvent) {
	//	ElementMover.#selector.addEventListener('pointerup', ElementMover.#pointerUp)
	//	ElementMover.#isPointerDown = true
	// }
	//
	// static #pointerMove (pEvent) {
	//	pEvent.returnValue = false
	//	const translate = ElementMover.#element.style.translate.split(' ')
	//	ElementMover.#offsetPosition = {
	//		x: ElementMover.#offsetPosition.x + (ElementMover.#mouse.x - parseInt(translate[0])),
	//		y: ElementMover.#offsetPosition.y + (ElementMover.#mouse.y - parseInt(translate[1]))
	//	}
	//	ElementMover.#mouse.x = pEvent.pageX + window.scrollX - ElementMover.#offsetPosition.x
	//	ElementMover.#mouse.y = pEvent.pageY + window.scrollY - ElementMover.#offsetPosition.y
	//	if (pEvent.pressure !== 0 && ElementMover.#isPointerDown) ElementMover.#element.style.translate = `${ElementMover.#mouse.x}px ${ElementMover.#mouse.y}px`
	// }
	//
	// static async #pointerUp () {
	//	await ElementMover.#callBack(ElementMover.#mouse)
	//	ElementMover.#resetMousePosition()
	//	document.body.removeEventListener('pointermove', ElementMover.#pointerMove)
	//	ElementMover.#selector.removeEventListener('pointerup', ElementMover.#pointerUp)
	//	ElementMover.#isPointerDown = false
	// }
	//
	// static #keyDown (pEvent) {
	//	ElementMover.#keysPress[pEvent.code] = true
	// }
	//
	// static #keyUp (pEvent) {
	//	const translate = ElementMover.#element.style.translate.split(' ')
	//	let translateX = parseInt(translate[0])
	//	let translateY = parseInt(translate[1])
	//	const offset = ElementMover.#keysPress.ShiftLeft ? 10 : ElementMover.#keysPress.ControlLeft ? 50 : 1
	//	if (pEvent.code === 'ArrowUp') translateY -= offset
	//	if (pEvent.code === 'ArrowDown') translateY += offset
	//	if (pEvent.code === 'ArrowRight') translateX += offset
	//	if (pEvent.code === 'ArrowLeft') translateX -= offset
	//	setTimeout(() => {
	//		ElementMover.#element.style.translate = `${translateX}px ${translateY}px`
	//	})
	//	ElementMover.#keysPress[pEvent.code] = false
	//	ElementMover.#callBack({ x: translateX, y: translateY })
	// }
}
