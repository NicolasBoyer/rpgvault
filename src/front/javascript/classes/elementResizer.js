export class ElementResizer {
	static #mouse
	static #element
	static #textZone
	static #offsetPosition
	static #callBack
	static isPointerDown = false
	static boxPositions = [
		{ class: 'leftTop' },
		{ class: 'leftCenter' },
		{ class: 'leftBottom' },
		{ class: 'centerTop' },
		{ class: 'centerBottom' },
		{ class: 'rightTop' },
		{ class: 'rightCenter' },
		{ class: 'rightBottom' }
	]

	static init (pElement, pOffset, pCallBack) {
		this.#element = pElement
		this.#textZone = this.#element.querySelector('input, textarea')
		this.#offsetPosition = pOffset
		this.#callBack = pCallBack
		this.#mouse = {
			x: 0,
			y: 0,
			translateX: 0,
			translateY: 0,
			originalX: 0,
			originalY: 0
		}
		window.addEventListener('resize', () => this.#resetHandler())
		this.#resetHandler()
		document.body.addEventListener('pointermove', this.#pointerMove)
		document.body.addEventListener('pointerup', this.#pointerUp)
	}

	static #resetHandler () {
		const boundingBox = this.#element.getBoundingClientRect()
		const boxSize = 15
		this.boxPositions = [
			{ top: 0, left: 0, class: 'leftTop' },
			{ top: boundingBox.height / 2, left: 0, class: 'leftCenter' },
			{ top: boundingBox.height, left: 0, class: 'leftBottom' },
			{ top: 0, left: boundingBox.width / 2, class: 'centerTop' },
			{ top: boundingBox.height, left: boundingBox.width / 2, class: 'centerBottom' },
			{ top: 0, left: boundingBox.width, class: 'rightTop' },
			{ top: boundingBox.height / 2, left: boundingBox.width, class: 'rightCenter' },
			{ top: boundingBox.height, left: boundingBox.width, class: 'rightBottom' }
		]
		for (const boxPosition of this.boxPositions) {
			const handler = document.querySelector(`.${boxPosition.class}`)
			if (handler) {
				handler.setAttribute('style', `top: ${boxPosition.top - boxSize / 2}px;left: ${boxPosition.left - boxSize / 2}px;width: ${boxSize}px;height: ${boxSize}px;border-radius: ${boxSize}px;`)
				handler.addEventListener('pointerdown', this.#pointerDown)
			}
		}
	}

	static async #pointerDown (pEvent) {
		ElementResizer.#mouse.originalX = pEvent.pageX
		ElementResizer.#mouse.originalY = pEvent.pageY
		ElementResizer.leftHorizontalMove = pEvent.target.className.includes('left')
		ElementResizer.rightHorizontalMove = pEvent.target.className.includes('right')
		ElementResizer.topVerticalMove = pEvent.target.className.includes('Top')
		ElementResizer.bottomVerticalMove = pEvent.target.className.includes('Bottom')
		ElementResizer.width = ElementResizer.#element.getBoundingClientRect().width
		ElementResizer.height = ElementResizer.#element.getBoundingClientRect().height
		ElementResizer.isPointerDown = true
		document.body.classList.add('isResizing')
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		ElementResizer.#mouse.x = pEvent.pageX - ElementResizer.#mouse.originalX
		ElementResizer.#mouse.y = pEvent.pageY - ElementResizer.#mouse.originalY
		const translate = ElementResizer.#element.style.translate.split(' ')
		ElementResizer.#mouse.translateX = parseInt(translate[0])
		ElementResizer.#mouse.translateY = parseInt(translate[1])
		if (pEvent.pressure !== 0 && ElementResizer.isPointerDown) {
			if (ElementResizer.leftHorizontalMove) {
				ElementResizer.#mouse.translateX = pEvent.pageX + window.scrollX - ElementResizer.#offsetPosition.x
				ElementResizer.#textZone.style.width = ElementResizer.width - ElementResizer.#mouse.x + 'px'
			}
			if (ElementResizer.rightHorizontalMove) ElementResizer.#textZone.style.width = ElementResizer.width + ElementResizer.#mouse.x + 'px'
			if (ElementResizer.topVerticalMove) {
				ElementResizer.#mouse.translateY = pEvent.pageY + window.scrollY - ElementResizer.#offsetPosition.y
				ElementResizer.#textZone.style.height = ElementResizer.height - ElementResizer.#mouse.y + 'px'
			}
			if (ElementResizer.bottomVerticalMove) ElementResizer.#textZone.style.height = ElementResizer.height + ElementResizer.#mouse.y + 'px'
			ElementResizer.#element.style.translate = `${ElementResizer.#mouse.translateX}px ${ElementResizer.#mouse.translateY}px`
			ElementResizer.#resetHandler()
		}
	}

	static async #pointerUp () {
		if (ElementResizer.isPointerDown) {
			await ElementResizer.#callBack({
				x: ElementResizer.#mouse.translateX,
				y: ElementResizer.#mouse.translateY,
				width: parseInt(ElementResizer.#textZone.style.width),
				height: parseInt(ElementResizer.#textZone.style.height)
			})
			ElementResizer.isPointerDown = false
			document.body.classList.remove('isResizing')
		}
	}
}
