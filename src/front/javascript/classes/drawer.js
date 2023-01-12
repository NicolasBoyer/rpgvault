import { Dom } from './dom.js'

export class Drawer {
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
		Drawer.#element.addEventListener('click', Drawer.#pointerUp)
		Drawer.#mouse.startX = Drawer.#mouse.x
		Drawer.#mouse.startY = Drawer.#mouse.y
		Drawer.#bd.elt('div', 'rectangle').att('style', `left:${Drawer.#mouse.x}px;top:${Drawer.#mouse.y}px;cursor:crosshair;`)
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		Drawer.#mouse.x = pEvent.pageX + window.scrollX - Drawer.#offsetPosition.x
		Drawer.#mouse.y = pEvent.pageY + window.scrollY - Drawer.#offsetPosition.y
		if (pEvent.pressure !== 0) Drawer.#bd.att('style', `width:${Math.abs(Drawer.#mouse.x - Drawer.#mouse.startX)}px;height:${Math.abs(Drawer.#mouse.y - Drawer.#mouse.startY)}px;left:${(Drawer.#mouse.x - Drawer.#mouse.startX < 0) ? `${Drawer.#mouse.x}px` : `${Drawer.#mouse.startX}px`};top:${(Drawer.#mouse.y - Drawer.#mouse.startY < 0) ? `${Drawer.#mouse.y}px` : `${Drawer.#mouse.startY}px`}`)
	}

	static async #pointerUp (pEvent) {
		await Drawer.#callBack(Drawer.#mouse, pEvent)
		Drawer.#bd.current().remove()
		Drawer.#reset()
	}

	static #reset () {
		this.#resetMousePosition()
		this.#element.removeEventListener('pointerdown', this.#pointerDown)
		this.#element.removeEventListener('pointermove', this.#pointerMove)
		this.#element.removeEventListener('click', this.#pointerUp)
	}
}
