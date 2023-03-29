import Datas from './datas.js'
import View from './view.js'
import { Utils } from '../../classes/utils.js'
import { html } from '../../thirdParty/litHtml.js'
import { ShortcutManager } from '../../classes/shortcutManager.js'
import States from './states.js'

/**
 * Fichier de lancement du composant et ensemble de fonctions des features du composant
 */
export default class Sheet extends HTMLElement {
	static #imageWidth
	static #imageHeight
	static element
	static containerWidth
	static containerHeight
	static ratio
	static containerLeft
	static containerTop

	async connectedCallback () {
		await Datas.init()
		Sheet.element = this
		this.style.backgroundColor = Datas.sheet.backgroundColor
		Sheet.setBackgroundImage(Datas.sheet.backgroundImage || '../../assets/default.jpg')
		window.addEventListener('resize', () => Sheet.resize())
		ShortcutManager.set(document.body, ['Control', 's'], async () => {
			await Datas.save()
			View.render()
		})
		ShortcutManager.set(document.body, ['Tab'], () => {
			States.interface = States.interface === 'hover' ? 'visible' : States.interface === 'visible' ? 'hidden' : 'hover'
			View.render()
		})
	}

	static setBackgroundImage (pImageSrc) {
		const image = new Image()
		image.onload = () => {
			this.#imageWidth = image.naturalWidth
			this.#imageHeight = image.naturalHeight
			this.resize()
		}
		image.src = pImageSrc
		this.element.style.backgroundImage = `url(${image.src})`
	}

	static resize () {
		const dims = document.body.getBoundingClientRect()
		this.element.style.width = `${dims.width}px`
		this.element.style.height = `${dims.height}px`
		const containerHeight = dims.width * this.#imageHeight / this.#imageWidth
		const isWidthResized = containerHeight < dims.height
		this.containerWidth = `${isWidthResized ? dims.width : this.#imageWidth * dims.height / this.#imageHeight}px`
		this.containerHeight = `${isWidthResized ? containerHeight : dims.height}px`
		this.ratio = isWidthResized ? dims.width / this.#imageWidth : dims.height / this.#imageHeight
		this.containerLeft = (dims.width - parseInt(this.containerWidth)) / 2
		this.containerTop = (dims.height - parseInt(this.containerHeight)) / 2
		View.render()
		setTimeout(() => Utils.loader(false))
	}

	static changeBackgroundColor () {
		States.displayEditBlock(false)
		let color
		Utils.confirm(html`
			<label for="color">
				<span>Choisissez une couleur</span>
				<input type="color" id="color" name="color" value="${Datas.sheet.backgroundColor || '#ffffff'}" @change="${async (pEvent) => {
			color = pEvent.target.value
		}}">
			</label>
		`, () => {
			this.element.style.backgroundColor = color
			Datas.sheet.backgroundColor = color
			Datas.sheetProperties.push({ setBackgroundColor: { color } })
			States.isSaved = false
			States.displayEditBlock(true)
			View.render()
		})
	}

	static editBackgroundImage () {
		States.displayEditBlock(false)
		let file
		Utils.confirm(html`
			<label for="file">
				<span>Choisissez un fichier</span>
				<input type="file" id="file" name="file" @change="${(pEvent) => {
			file = pEvent.target.files[0]
		}}">
			</label>
		`, async () => {
			this.setBackgroundImage(await Utils.getBase64FromFileReader(file))
			Datas.sheetProperties.push({ setBackgroundImage: { image: file } })
			States.isSaved = false
			States.displayEditBlock(true)
			View.render()
		})
	}

	static addFont () {
		States.displayEditBlock(false)
		let fontUrl
		let fontFamily
		let file
		Utils.confirm(html`
			<label for="file">
				<input accept=".ttf,.woff,.woff2,.eot" type="file" id="file" name="file" @change="${(pEvent) => {
			file = pEvent.target.files[0]
		}}">
			</label>
			<label for="fontFamily">
				<span>Nom de la police (font family)</span>
				<input type="text" id="fontFamily" name="fontFamily" @change="${async (pEvent) => {
			fontFamily = pEvent.target.value
		}}">
			</label>
		`, async () => {
			if (!Datas.sheet.fonts) Datas.sheet.fonts = []
			fontUrl = await Utils.getBase64FromFileReader(file)
			const font = { name: file.name, fontUrl, fontFamily }
			Datas.sheet.fonts.push(font)
			fontUrl = file
			Datas.sheetProperties.push({ setFont: font })
			States.isSaved = false
			States.displayEditBlock(true)
			View.render()
		})
	}

	static deleteFont () {
		States.displayEditBlock(false)
		let fonts = []
		Utils.confirm(html`
			<ul>
				${Datas.sheet.fonts.map((pFont) => html`
					<li>
						<label for="${pFont.fontFamily}">
							<input type="checkbox" id="${pFont.fontFamily}" name="${pFont.fontFamily}" value="${pFont.fontFamily}" @change="${(pEvent) => {
			const value = pFont.fontFamily
			if (pEvent.target.checked) fonts.push(value)
			else fonts = fonts.filter((pChoice) => pChoice !== value)
		}}">${pFont.fontFamily}</label>
					</li>
				`)}
			</ul>
		`, () => {
			fonts.forEach((pFontFamily) => {
				Datas.sheet.fonts = Datas.sheet.fonts.filter((pFont) => pFont.fontFamily !== pFontFamily)
			})
			Datas.sheetProperties.push({ deleteFont: { fonts: fonts } })
			States.isSaved = false
			States.displayEditBlock(true)
			View.render()
		})
	}

	static async printScreen () {
		const canvasSize = document.querySelector('fs-sheet > div').getBoundingClientRect()
		// eslint-disable-next-line no-undef
		html2canvas(document.querySelector('fs-sheet'), {
			width: canvasSize.width,
			height: canvasSize.height,
			x: canvasSize.x,
			y: canvasSize.y,
			ignoreElements: (element) => element.tagName === 'BUTTON' || element.tagName === 'FS-LINK',
			onclone: (clonedDocument) => {
				Array.from(clonedDocument.querySelectorAll('textarea')).forEach((textArea) => {
					const div = clonedDocument.createElement('div')
					div.innerText = textArea.value
					div.setAttribute('style', textArea.getAttribute('style'))
					textArea.style.display = 'none'
					textArea.parentElement.append(div)
				})
				Array.from(clonedDocument.querySelectorAll('input')).forEach((input) => {
					const div = clonedDocument.createElement('div')
					const span = clonedDocument.createElement('span')
					div.appendChild(span)
					span.innerText = input.value
					div.setAttribute('style', input.getAttribute('style'))
					div.style.display = 'flex'
					div.style.alignItems = 'center'
					div.style.justifyContent = div.style.textAlign
					input.style.display = 'none'
					input.parentElement.append(div)
				})
				Array.from(clonedDocument.querySelectorAll('div.image')).forEach((div) => {
					const divClone = clonedDocument.createElement('div')
					// eslint-disable-next-line no-undef
					const translate = new WebKitCSSMatrix(getComputedStyle(div).transform)
					divClone.appendChild(div.querySelector('div'))
					divClone.setAttribute('style', div.getAttribute('style'))
					divClone.style.transform = 'none'
					divClone.style.top = translate.m42 + 'px'
					divClone.style.left = translate.m41 + 'px'
					div.style.display = 'none'
					div.parentElement.append(divClone)
				})
			}
		}).then((canvas) => {
			const link = document.createElement('a')
			link.href = canvas.toDataURL()
			link.download = `${Utils.slugify(Datas.sheet.name)}.png`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		})
	}
}
