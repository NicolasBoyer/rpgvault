import Datas from './datas.js'
import View from './view.js'
import { Utils } from '../../classes/utils.js'
import { html } from '../../thirdParty/litHtml.js'

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

	// TODO création des inputs par copier coller
	// TODO revoir le resize avec la souris sur les bords ? Avec des fleches sur les bords ?
	// TODO default values
	// TODO ctrl c ctrl v ctrl d ctrl s manage shortcut
	// TODO manager de shortcuts ?
	// TODO bouton et shortcut cacher l'interface
	// TODO Interface cacher avec un shortcut
	// TODO ajout image
	async connectedCallback () {
		await Datas.init()
		Sheet.element = this
		this.style.backgroundColor = Datas.sheet.backgroundColor
		Sheet.setBackgroundImage(Datas.sheet.backgroundImage || '../../assets/default.jpg')
		window.addEventListener('resize', () => Sheet.resize())
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
	}

	static changeBackgroundColor () {
		let color
		Utils.confirm(html`
			<label for="color">
				<span>Choisissez une couleur</span>
				<input type="color" id="color" name="color" value="${Datas.sheet.backgroundColor}" @change="${async (pEvent) => {
					color = pEvent.target.value
				}}">
			</label>
		`, () => {
			this.element.style.backgroundColor = color
			Datas.sheet.backgroundColor = color
			Datas.sheetProperties.push({ setBackgroundColor: { color } })
		})
	}

	static editBackgroundImage () {
		let file
		Utils.confirm(html`
			<label for="file">
				<span>Choisissez un fichier</span>
				<input type="file" id="file" name="file" @change="${(pEvent) => {
					file = pEvent.target.files[0]
				}}">
			</label>
		`, () => {
			const reader = new FileReader()
			reader.addEventListener('load', async () => {
				this.setBackgroundImage(reader.result)
				Datas.sheet.backgroundImage = reader.result
				Datas.sheetProperties.push({ setBackgroundImage: { image: reader.result } })
			})
			reader.readAsDataURL(file)
		})
	}

	static addFont () {
		let fontUrl
		let fontFamily
		Utils.confirm(html`
			<label for="fontUrl">
				<span>Ajouter l'URL d'une police (import google)</span>
				<input type="text" id="fontUrl" name="fontUrl" @change="${async (pEvent) => {
					fontUrl = pEvent.target.value
				}}">
			</label>
			<label for="fontFamily">
				<span>Nom de la police (font family)</span>
				<input type="text" id="fontFamily" name="fontFamily" @change="${async (pEvent) => {
					fontFamily = pEvent.target.value
				}}">
			</label>
		`, () => {
			if (!Datas.sheet.fonts) Datas.sheet.fonts = []
			const font = { fontUrl, fontFamily }
			Datas.sheet.fonts.push(font)
			Datas.sheetProperties.push({ setFont: font })
			View.render()
		})
	}

	static deleteFont () {
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
			View.render()
		})
	}
}
