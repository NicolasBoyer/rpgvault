import { ShortcutManager } from './shortcutManager.js'
import { ElementResizer } from './elementResizer.js'

export class ElementMover {
	static #mouse
	static #elements = []
	static #selectedSelectorId
	static #offsetPosition
	static #isMoving = false
	static isPointerDown = false

	static init (pElement, pOffset, pCallBack, pSelector) {
		const selector = pSelector || pElement.querySelector('input, textarea') || pElement
		// TODO Sans doute à supprimer cette partie - le selectorid doit etre avant et les listener sont perdu pour les menu
		// if (this.#elements[selector.id]) return
		console.log(this.#elements)
		this.#elements[selector.id] = pElement
		this.#offsetPosition = pOffset
		pElement.callBack = pCallBack
		this.#mouse = {
			x: 0,
			y: 0
		}
		ElementMover.#selectedSelectorId = selector.id
		document.body.addEventListener('pointermove', this.#pointerMove)
		selector.addEventListener('pointerdown', this.#pointerDown)
		selector.addEventListener('pointerup', this.#pointerUp)
		ShortcutManager.set(pElement, ['ArrowUp'], () => this.#moveByKey(0, -1))
		ShortcutManager.set(pElement, ['ArrowDown'], () => this.#moveByKey(0, 1))
		ShortcutManager.set(pElement, ['ArrowRight'], () => this.#moveByKey(1))
		ShortcutManager.set(pElement, ['ArrowLeft'], () => this.#moveByKey(-1))
		ShortcutManager.set(pElement, ['Shift', 'ArrowUp'], () => this.#moveByKey(0, -10))
		ShortcutManager.set(pElement, ['Shift', 'ArrowDown'], () => this.#moveByKey(0, 10))
		ShortcutManager.set(pElement, ['Shift', 'ArrowRight'], () => this.#moveByKey(10))
		ShortcutManager.set(pElement, ['Shift', 'ArrowLeft'], () => this.#moveByKey(-10))
		ShortcutManager.set(pElement, ['Control', 'ArrowUp'], () => this.#moveByKey(0, -50))
		ShortcutManager.set(pElement, ['Control', 'ArrowDown'], () => this.#moveByKey(0, 50))
		ShortcutManager.set(pElement, ['Control', 'ArrowRight'], () => this.#moveByKey(50))
		ShortcutManager.set(pElement, ['Control', 'ArrowLeft'], () => this.#moveByKey(-50))
	}

	static async #pointerDown (pEvent) {
		ElementMover.isPointerDown = true
		document.body.classList.add('isMoving')
		ElementMover.#selectedSelectorId = pEvent.target?.id || pEvent.target.parentElement.id
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		const selectedElement = ElementMover.#elements[ElementMover.#selectedSelectorId]
		if (selectedElement) {
			// eslint-disable-next-line no-undef
			const translate = new WebKitCSSMatrix(getComputedStyle(selectedElement).transform)
			ElementMover.#offsetPosition = {
				x: ElementMover.#offsetPosition.x + (ElementMover.#mouse.x - translate.m41),
				y: ElementMover.#offsetPosition.y + (ElementMover.#mouse.y - translate.m42)
			}
			ElementMover.#mouse.x = pEvent.pageX + window.scrollX - ElementMover.#offsetPosition.x
			ElementMover.#mouse.y = pEvent.pageY + window.scrollY - ElementMover.#offsetPosition.y
			if (pEvent.pressure !== 0 && ElementMover.isPointerDown && !ElementResizer.isPointerDown) {
				selectedElement.classList.add('hasMoved')
				ElementMover.#isMoving = true
				selectedElement.style.transform = `translate(${ElementMover.#mouse.x}px, ${ElementMover.#mouse.y}px)`
			}
		}
	}

	static async #pointerUp () {
		if (ElementMover.#isMoving) await ElementMover.#elements[ElementMover.#selectedSelectorId].callBack(ElementMover.#mouse)
		if (ElementMover.isPointerDown) {
			ElementMover.isPointerDown = ElementMover.#isMoving = false
			document.body.classList.remove('isMoving')
		}
	}

	static #moveByKey (pOffsetX, pOffsetY = 0) {
		const selectedElement = ElementMover.#elements[ElementMover.#selectedSelectorId]
		console.log(selectedElement)
		// eslint-disable-next-line no-undef
		const translate = new WebKitCSSMatrix(getComputedStyle(selectedElement).transform)
		const translateX = translate.m41 + pOffsetX
		const translateY = translate.m42 + pOffsetY
		setTimeout(() => {
			selectedElement.style.transform = `translate(${translateX}px, ${translateY}px)`
		})
		selectedElement.callBack({ x: translateX, y: translateY })
	}
}
