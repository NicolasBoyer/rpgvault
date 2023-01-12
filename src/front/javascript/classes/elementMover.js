import { ShortcutManager } from './shortcutManager.js'
import { ElementResizer } from './elementResizer.js'

export class ElementMover {
	static #mouse
	static #element
	static #selector
	static #offsetPosition
	static #callBack
	static #isMoving = false
	static isPointerDown = false

	static init (pElement, pOffset, pCallBack) {
		this.#element = pElement
		this.#selector = this.#element.querySelector('input, textarea') || this.#element
		this.#offsetPosition = pOffset
		this.#callBack = pCallBack
		this.#mouse = {
			x: 0,
			y: 0
		}
		this.#selector.addEventListener('pointerdown', this.#pointerDown)
		this.#selector.addEventListener('pointerup', this.#pointerUp)
		document.body.addEventListener('pointermove', this.#pointerMove)
		ShortcutManager.set(this.#element, ['ArrowUp'], () => this.#moveByKey(0, -1))
		ShortcutManager.set(this.#element, ['ArrowDown'], () => this.#moveByKey(0, 1))
		ShortcutManager.set(this.#element, ['ArrowRight'], () => this.#moveByKey(1))
		ShortcutManager.set(this.#element, ['ArrowLeft'], () => this.#moveByKey(-1))
		ShortcutManager.set(this.#element, ['Shift', 'ArrowUp'], () => this.#moveByKey(0, -10))
		ShortcutManager.set(this.#element, ['Shift', 'ArrowDown'], () => this.#moveByKey(0, 10))
		ShortcutManager.set(this.#element, ['Shift', 'ArrowRight'], () => this.#moveByKey(10))
		ShortcutManager.set(this.#element, ['Shift', 'ArrowLeft'], () => this.#moveByKey(-10))
		ShortcutManager.set(this.#element, ['Control', 'ArrowUp'], () => this.#moveByKey(0, -50))
		ShortcutManager.set(this.#element, ['Control', 'ArrowDown'], () => this.#moveByKey(0, 50))
		ShortcutManager.set(this.#element, ['Control', 'ArrowRight'], () => this.#moveByKey(50))
		ShortcutManager.set(this.#element, ['Control', 'ArrowLeft'], () => this.#moveByKey(-50))
	}

	static async #pointerDown () {
		ElementMover.isPointerDown = true
		document.body.classList.add('isMoving')
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		const translate = ElementMover.#element.style.translate.split(' ')
		ElementMover.#offsetPosition = {
			x: ElementMover.#offsetPosition.x + (ElementMover.#mouse.x - parseInt(translate[0])),
			y: ElementMover.#offsetPosition.y + (ElementMover.#mouse.y - parseInt(translate[1]))
		}
		ElementMover.#mouse.x = pEvent.pageX + window.scrollX - ElementMover.#offsetPosition.x
		ElementMover.#mouse.y = pEvent.pageY + window.scrollY - ElementMover.#offsetPosition.y
		if (pEvent.pressure !== 0 && ElementMover.isPointerDown && !ElementResizer.isPointerDown) {
			ElementMover.#isMoving = true
			ElementMover.#element.style.translate = `${ElementMover.#mouse.x}px ${ElementMover.#mouse.y}px`
		}
	}

	static async #pointerUp () {
		if (ElementMover.#isMoving) await ElementMover.#callBack(ElementMover.#mouse)
		if (ElementMover.isPointerDown) {
			ElementMover.isPointerDown = ElementMover.#isMoving = false
			document.body.classList.remove('isMoving')
		}
	}

	static #moveByKey (pOffsetX, pOffsetY = 0) {
		const translate = ElementMover.#element.style.translate.split(' ')
		const translateX = parseInt(translate[0]) + pOffsetX
		const translateY = parseInt(translate[1]) + pOffsetY
		setTimeout(() => {
			ElementMover.#element.style.translate = `${translateX}px ${translateY}px`
		})
		ElementMover.#callBack({ x: translateX, y: translateY })
	}
}
