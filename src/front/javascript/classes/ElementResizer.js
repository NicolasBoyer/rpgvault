import { Dom } from './dom.js'

export class ElementResizer {
	static #mouse
	static #element
	static #selector
	static #offsetPosition
	static #callBack
	static #isPointerDown = false

	static init (pElement, pOffset, pCallBack) {
		this.#element = pElement
		this.#offsetPosition = pOffset
		this.#callBack = pCallBack
		this.#resetMousePosition()
		this.#createHandler()
		// this.#selector.addEventListener('pointerdown', this.#pointerDown)
		document.body.addEventListener('pointermove', this.#pointerMove)
	}

	static #resetMousePosition () {
		this.#mouse = {
			x: 0,
			y: 0,
			translateX: 0,
			translateY: 0,
			originalX: 0,
			originalY: 0
		}
	}

	static #createHandler () {
		const boundingBox = this.#element.getBoundingClientRect()
		const boxesSize = 20
		const offset = 10
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
			if (!document.querySelector(`.${pBox.class}`)) {
				bd.elt('div', `resizeHandler ${pBox.class}`).att('style', `position: absolute;top: ${pBox.top + pBox.offset.top}px;left: ${pBox.left + pBox.offset.left}px;width: ${boxesSize}px;height: ${boxesSize}px;border-radius: ${boxesSize}px;`).listen('pointerdown', this.#pointerDown).up()
			}
		})
	}

	static async #pointerDown (pEvent) {
		ElementResizer.#mouse.originalX = pEvent.pageX
		ElementResizer.#mouse.originalY = pEvent.pageY
		ElementResizer.#selector = pEvent.target
		ElementResizer.leftHorizontalMove = pEvent.target.className.includes('left')
		ElementResizer.rightHorizontalMove = pEvent.target.className.includes('right')
		ElementResizer.topVerticalMove = pEvent.target.className.includes('Top')
		ElementResizer.bottomVerticalMove = pEvent.target.className.includes('Bottom')
		// pEvent.target.addEventListener('pointerup', ElementResizer.#pointerUp)
		document.body.addEventListener('pointerup', ElementResizer.#pointerUp)
		ElementResizer.#isPointerDown = true

		ElementResizer.width = ElementResizer.#element.getBoundingClientRect().width
		ElementResizer.height = ElementResizer.#element.getBoundingClientRect().height
		// const translate = ElementResizer.#element.style.translate.split(' ')
		// ElementResizer.#mouse.translateX = parseInt(translate[0])
		// ElementResizer.#mouse.translateY = parseInt(translate[1])
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		ElementResizer.#mouse.x = pEvent.pageX - ElementResizer.#mouse.originalX
		ElementResizer.#mouse.y = pEvent.pageY - ElementResizer.#mouse.originalY
		const translate = ElementResizer.#element.style.translate.split(' ')
		// ElementResizer.#offsetPosition = {
		//	x: ElementResizer.#offsetPosition.x + (ElementResizer.#mouse.x - parseInt(translate[0])),
		//	y: ElementResizer.#offsetPosition.y + (ElementResizer.#mouse.y - parseInt(translate[1]))
		// }
		ElementResizer.#mouse.translateX = parseInt(translate[0])
		ElementResizer.#mouse.translateY = parseInt(translate[1])
		if (pEvent.pressure !== 0 && ElementResizer.#isPointerDown) {
			if (ElementResizer.leftHorizontalMove) {
				// TODO pb probable car mouvement après le clic dans certaines position + peut etre mutualisation possible avec move ?
				ElementResizer.#mouse.translateX = pEvent.pageX + window.scrollX + 20
				ElementResizer.#element.querySelector('input').style.width = ElementResizer.width - ElementResizer.#mouse.x + 'px'
			}
			if (ElementResizer.rightHorizontalMove) ElementResizer.#element.querySelector('input').style.width = ElementResizer.width + ElementResizer.#mouse.x + 'px'
			if (ElementResizer.topVerticalMove) {
				ElementResizer.#mouse.translateY = pEvent.pageY + window.scrollY + 20
				ElementResizer.#element.querySelector('input').style.height = ElementResizer.height - ElementResizer.#mouse.y + 'px'
			}
			if (ElementResizer.bottomVerticalMove) ElementResizer.#element.querySelector('input').style.height = ElementResizer.height + ElementResizer.#mouse.y + 'px'
			ElementResizer.#element.style.translate = `${ElementResizer.#mouse.translateX}px ${ElementResizer.#mouse.translateY}px`
		}
	}

	static async #pointerUp (pEvent) {
		await ElementResizer.#callBack({
			x: ElementResizer.#mouse.translateX,
			y: ElementResizer.#mouse.translateY,
			width: parseInt(ElementResizer.#element.querySelector('input').style.width),
			height: parseInt(ElementResizer.#element.querySelector('input').style.height)
		})
		// ElementResizer.#resetMousePosition()
		console.log(ElementResizer.#selector)
		document.body.removeEventListener('pointermove', ElementResizer.#pointerMove)
		document.body.removeEventListener('pointerup', ElementResizer.#pointerUp)
		ElementResizer.#selector.removeEventListener('pointerup', ElementResizer.#pointerUp)
		ElementResizer.#isPointerDown = false
	}
}
