import { Dom } from './dom.js'

export class InputDrawer {
	static #mouse
	static #element
	static #bd
	static #offsetPosition
	static #callBack

	static init (pElement, pOffset, pCallBack) {
		this.#element = pElement
		this.#bd = Dom.newDom(pElement)
		this.#offsetPosition = pOffset
		this.#callBack = pCallBack
		this.#resetMousePosition()
		this.#element.addEventListener('pointerdown', this.#pointerDown)
		this.#element.addEventListener('pointermove', this.#pointerMove)
	}

	static #resetMousePosition () {
		this.#mouse = {
			x: 0,
			y: 0,
			startX: 0,
			startY: 0
		}
	}

	static #pointerDown () {
		InputDrawer.#element.addEventListener('click', InputDrawer.#pointerUp)
		InputDrawer.#mouse.startX = InputDrawer.#mouse.x
		InputDrawer.#mouse.startY = InputDrawer.#mouse.y
		InputDrawer.#bd.elt('div', 'rectangle').att('style', `left:${InputDrawer.#mouse.x}px;top:${InputDrawer.#mouse.y}px;cursor:crosshair;`)
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		InputDrawer.#mouse.x = pEvent.pageX + window.scrollX - InputDrawer.#offsetPosition.x
		InputDrawer.#mouse.y = pEvent.pageY + window.scrollY - InputDrawer.#offsetPosition.y
		if (pEvent.pressure !== 0) InputDrawer.#bd.att('style', `width:${Math.abs(InputDrawer.#mouse.x - InputDrawer.#mouse.startX)}px;height:${Math.abs(InputDrawer.#mouse.y - InputDrawer.#mouse.startY)}px;left:${(InputDrawer.#mouse.x - InputDrawer.#mouse.startX < 0) ? `${InputDrawer.#mouse.x}px` : `${InputDrawer.#mouse.startX}px`};top:${(InputDrawer.#mouse.y - InputDrawer.#mouse.startY < 0) ? `${InputDrawer.#mouse.y}px` : `${InputDrawer.#mouse.startY}px`}`)
	}

	static async #pointerUp (pEvent) {
		await InputDrawer.#callBack(InputDrawer.#mouse, pEvent)
		InputDrawer.#bd.current().remove()
		InputDrawer.#reset()
	}

	static #reset () {
		this.#resetMousePosition()
		this.#element.removeEventListener('pointerdown', this.#pointerDown)
		this.#element.removeEventListener('pointermove', this.#pointerMove)
		this.#element.removeEventListener('click', this.#pointerUp)
	}
}
