export class ElementResizer {
	static #mouse
	static #elements = []
	static #offsetPosition
	static #selectedSelectorId
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
		const selector = pElement.querySelector('input, textarea') || pElement
		if (this.#elements[selector.id]) return
		this.#elements[selector.id] = pElement
		this.#offsetPosition = pOffset
		pElement.callBack = pCallBack
		this.#mouse = {
			x: 0,
			y: 0,
			translateX: 0,
			translateY: 0,
			originalX: 0,
			originalY: 0
		}
		this.#selectedSelectorId = selector.id
		window.addEventListener('resize', () => this.#resetHandler(pElement))
		this.#resetHandler(pElement)
		document.body.addEventListener('pointermove', this.#pointerMove)
		document.body.addEventListener('pointerup', this.#pointerUp)
	}

	static #resetHandler (pElement) {
		const boundingBox = pElement.getBoundingClientRect()
		const boxSize = 15
		const boxPositions = [
			{ top: 0, left: 0, class: 'leftTop' },
			{ top: boundingBox.height / 2, left: 0, class: 'leftCenter' },
			{ top: boundingBox.height, left: 0, class: 'leftBottom' },
			{ top: 0, left: boundingBox.width / 2, class: 'centerTop' },
			{ top: boundingBox.height, left: boundingBox.width / 2, class: 'centerBottom' },
			{ top: 0, left: boundingBox.width, class: 'rightTop' },
			{ top: boundingBox.height / 2, left: boundingBox.width, class: 'rightCenter' },
			{ top: boundingBox.height, left: boundingBox.width, class: 'rightBottom' }
		]
		for (const boxPosition of boxPositions) {
			const handler = pElement.querySelector(`.${boxPosition.class}`)
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
		ElementResizer.#selectedSelectorId = pEvent.target.parentElement.firstElementChild.id
		ElementResizer.width = ElementResizer.#elements[ElementResizer.#selectedSelectorId].getBoundingClientRect().width
		ElementResizer.height = ElementResizer.#elements[ElementResizer.#selectedSelectorId].getBoundingClientRect().height
		ElementResizer.isPointerDown = true
		document.body.classList.add('isResizing')
	}

	static #pointerMove (pEvent) {
		pEvent.returnValue = false
		ElementResizer.#mouse.x = pEvent.pageX - ElementResizer.#mouse.originalX
		ElementResizer.#mouse.y = pEvent.pageY - ElementResizer.#mouse.originalY
		const element = ElementResizer.#elements[ElementResizer.#selectedSelectorId]
		// eslint-disable-next-line no-undef
		const translate = new WebKitCSSMatrix(getComputedStyle(element).transform)
		ElementResizer.#mouse.translateX = translate.m41
		ElementResizer.#mouse.translateY = translate.m42
		if (pEvent.pressure !== 0 && ElementResizer.isPointerDown) {
			if (ElementResizer.leftHorizontalMove) {
				ElementResizer.#mouse.translateX = pEvent.pageX + window.scrollX - ElementResizer.#offsetPosition.x
				element.firstElementChild.style.width = ElementResizer.width - ElementResizer.#mouse.x + 'px'
			}
			if (ElementResizer.rightHorizontalMove) element.firstElementChild.style.width = ElementResizer.width + ElementResizer.#mouse.x + 'px'
			if (ElementResizer.topVerticalMove) {
				ElementResizer.#mouse.translateY = pEvent.pageY + window.scrollY - ElementResizer.#offsetPosition.y
				element.firstElementChild.style.height = ElementResizer.height - ElementResizer.#mouse.y + 'px'
			}
			if (ElementResizer.bottomVerticalMove) element.firstElementChild.style.height = ElementResizer.height + ElementResizer.#mouse.y + 'px'
			element.style.transform = `translate(${ElementResizer.#mouse.translateX}px, ${ElementResizer.#mouse.translateY}px)`
			ElementResizer.#resetHandler(element)
		}
	}

	static async #pointerUp () {
		if (ElementResizer.isPointerDown) {
			const element = ElementResizer.#elements[ElementResizer.#selectedSelectorId]
			await element.callBack({
				x: ElementResizer.#mouse.translateX,
				y: ElementResizer.#mouse.translateY,
				width: parseInt(element.firstElementChild.style.width),
				height: parseInt(element.firstElementChild.style.height)
			})
			ElementResizer.isPointerDown = false
			document.body.classList.remove('isResizing')
		}
	}
}
