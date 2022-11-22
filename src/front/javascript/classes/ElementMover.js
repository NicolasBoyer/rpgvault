export class ElementMover {
	static #mouse
	static #element
	static #selector
	static #offsetPosition
	static #callBack
	static #isPointerDown = false
	static #keysPress = {}

	static init (pElement, pOffset, pCallBack) {
		this.#element = pElement
		this.#selector = this.#element.querySelector('input, textarea')
		this.#offsetPosition = pOffset
		this.#callBack = pCallBack
		this.#resetMousePosition()
		this.#selector.addEventListener('pointerdown', this.#pointerDown)
		document.body.addEventListener('pointermove', this.#pointerMove)
		this.#element.addEventListener('keydown', this.#keyDown)
		this.#element.addEventListener('keyup', this.#keyUp)
	}

	static #resetMousePosition () {
		this.#mouse = {
			x: 0,
			y: 0
		}
	}

	static async #pointerDown (pEvent) {
		ElementMover.#selector.addEventListener('pointerup', ElementMover.#pointerUp)
		ElementMover.#isPointerDown = true
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
		if (pEvent.pressure !== 0 && ElementMover.#isPointerDown) ElementMover.#element.style.translate = `${ElementMover.#mouse.x}px ${ElementMover.#mouse.y}px`
	}

	static async #pointerUp () {
		await ElementMover.#callBack(ElementMover.#mouse)
		ElementMover.#resetMousePosition()
		document.body.removeEventListener('pointermove', ElementMover.#pointerMove)
		ElementMover.#selector.removeEventListener('pointerup', ElementMover.#pointerUp)
		ElementMover.#isPointerDown = false
	}

	static #keyDown (pEvent) {
		ElementMover.#keysPress[pEvent.code] = true
	}

	static #keyUp (pEvent) {
		const translate = ElementMover.#element.style.translate.split(' ')
		let translateX = parseInt(translate[0])
		let translateY = parseInt(translate[1])
		const offset = ElementMover.#keysPress.ShiftLeft ? 10 : ElementMover.#keysPress.ControlLeft ? 50 : 1
		if (pEvent.code === 'ArrowUp') translateY -= offset
		if (pEvent.code === 'ArrowDown') translateY += offset
		if (pEvent.code === 'ArrowRight') translateX += offset
		if (pEvent.code === 'ArrowLeft') translateX -= offset
		setTimeout(() => {
			ElementMover.#element.style.translate = `${translateX}px ${translateY}px`
		})
		ElementMover.#keysPress[pEvent.code] = false
		ElementMover.#callBack({ x: translateX, y: translateY })
	}
}
