import '../../../styles/sheet.css'
import Datas from './datas.js'
import View from './view.js'
import { Utils } from '../../classes/utils.js'
import { html, TemplateResult } from 'lit'
import { ShortcutManager } from '../../classes/shortcutManager.js'
import States from './states.js'
import { HTMLElementEvent, RPGVAULTElement, TFont } from '../../types.js'
import html2canvas from 'html2canvas'
import { User } from '../../classes/user.js'
// import {html2canvas} from 'html2canvas'

/**
 * Fichier de lancement du composant et ensemble de fonctions des features du composant
 */
export default class Sheet extends HTMLElement {
    static element: Sheet
    static containerWidth: string
    static containerHeight: string
    static ratio: number
    static containerLeft: number
    static containerTop: number
    private static imageWidth: number
    private static imageHeight: number

    static setStyle(): void {
        this.element.style.backgroundColor = <string>Datas.sheet.leafs[Datas.currentLeaf].backgroundColor || '#ffffff'
        Sheet.setBackgroundImage(Datas.sheet.leafs[Datas.currentLeaf].backgroundImage || '../../assets/default.jpg')
    }

    static setBackgroundImage(pImageSrc: string): void {
        const image = new Image()
        image.onload = (): void => {
            this.imageWidth = image.naturalWidth
            this.imageHeight = image.naturalHeight
            this.resize()
        }
        image.src = pImageSrc
        this.element.style.backgroundImage = `url(${image.src})`
    }

    static resize(): void {
        const dims = document.body.getBoundingClientRect()
        this.element.style.width = `${dims.width}px`
        this.element.style.height = `${dims.height}px`
        const containerHeight = (dims.width * this.imageHeight) / this.imageWidth
        const isWidthResized = containerHeight < dims.height
        this.containerWidth = `${isWidthResized ? dims.width : (this.imageWidth * dims.height) / this.imageHeight}px`
        this.containerHeight = `${isWidthResized ? containerHeight : dims.height}px`
        this.ratio = isWidthResized ? dims.width / this.imageWidth : dims.height / this.imageHeight
        this.containerLeft = (dims.width - parseInt(this.containerWidth)) / 2
        this.containerTop = (dims.height - parseInt(this.containerHeight)) / 2
        View.render()
        setTimeout((): void => Utils.loader(false))
        User.checkCurrentUserLogged()
    }

    static changeBackgroundColor(): void {
        States.displayEditBlock(false)
        let color: string
        Utils.confirm(
            html`
                <label for="color">
                    <span>Choisissez une couleur</span>
                    <input
                        type="color"
                        id="color"
                        name="color"
                        value="${Datas.sheet.leafs[Datas.currentLeaf].backgroundColor || '#ffffff'}"
                        @change="${async (pEvent: HTMLElementEvent<HTMLInputElement>): Promise<void> => {
                            color = pEvent.target.value
                        }}"
                    />
                </label>
            `,
            (): void => {
                this.element.style.backgroundColor = color
                Datas.sheet.leafs[Datas.currentLeaf].backgroundColor = color
                Datas.sheetProperties.push({ setBackgroundColor: { color, leafId: Datas.currentLeaf } })
                States.isSaved = false
                States.displayEditBlock(true)
                View.render()
            },
            (): void => States.displayEditBlock(true)
        )
    }

    static addLeaf(): void {
        States.displayEditBlock(false)
        Utils.confirm(
            html`<h3>Voulez-vous créer une nouvelle feuille ?</h3>`,
            async (): Promise<void> => {
                Datas.currentLeaf = Datas.currentLeaf + 1
                Datas.sheet.leafs[Datas.currentLeaf] = { id: Datas.currentLeaf }
                Datas.sheetProperties.push({ addLeaf: { leafId: Datas.currentLeaf } })
                this.setStyle()
                States.isSaved = false
                States.displayEditBlock(true)
                View.render()
                Utils.toast('success', 'Nouvelle feuille créée')
            },
            (): void => States.displayEditBlock(true)
        )
    }

    static editBackgroundImage(): void {
        States.displayEditBlock(false)
        let file: File
        Utils.confirm(
            html`
                <label for="file">
                    <span>Choisissez un fichier</span>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        @change="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => {
                            file = (pEvent.target.files as FileList)[0]
                        }}"
                    />
                </label>
            `,
            async (): Promise<void> => {
                this.setBackgroundImage(<string>await Utils.getBase64FromFileReader(file))
                Datas.sheetProperties.push({ setBackgroundImage: { image: file, leafId: Datas.currentLeaf } })
                States.isSaved = false
                States.displayEditBlock(true)
                View.render()
            },
            (): void => States.displayEditBlock(true)
        )
    }

    static addFont(): void {
        States.displayEditBlock(false)
        let fontUrl
        let fontFamily: string
        let file: File
        Utils.confirm(
            html`
                <label for="file">
                    <input
                        accept=".ttf,.woff,.woff2,.eot"
                        type="file"
                        id="file"
                        name="file"
                        @change="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => {
                            file = (pEvent.target.files as FileList)[0]
                        }}"
                    />
                </label>
                <label for="fontFamily">
                    <span>Nom de la police (font family)</span>
                    <input
                        type="text"
                        id="fontFamily"
                        name="fontFamily"
                        @change="${async (pEvent: HTMLElementEvent<HTMLInputElement>): Promise<void> => {
                            fontFamily = pEvent.target.value
                        }}"
                    />
                </label>
            `,
            async (): Promise<void> => {
                if (!Datas.sheet.leafs[0].fonts) Datas.sheet.leafs[Datas.currentLeaf].fonts = []
                fontUrl = await Utils.getBase64FromFileReader(file)
                const font: TFont = { name: file.name, fontUrl, fontFamily, leafId: Datas.currentLeaf }
                Datas.sheet.leafs[Datas.currentLeaf].fonts?.push(font)
                fontUrl = file
                Datas.sheetProperties.push({ setFont: font })
                States.isSaved = false
                States.displayEditBlock(true)
                View.render()
            },
            (): void => States.displayEditBlock(true)
        )
    }

    static deleteFont(): void {
        States.displayEditBlock(false)
        let fonts: string[] = []
        Utils.confirm(
            html`
                <ul>
                    ${Datas.sheet.leafs[Datas.currentLeaf].fonts?.map(
                        (pFont): TemplateResult => html`
                            <li>
                                <label for="${pFont.fontFamily}">
                                    <input
                                        type="checkbox"
                                        id="${pFont.fontFamily}"
                                        name="${pFont.fontFamily}"
                                        value="${pFont.fontFamily}"
                                        @change="${(pEvent: HTMLElementEvent<HTMLInputElement>): void => {
                                            const value = pFont.fontFamily
                                            if (pEvent.target.checked) fonts.push(value)
                                            else fonts = fonts.filter((pChoice): boolean => pChoice !== value)
                                        }}"
                                    />${pFont.fontFamily}</label
                                >
                            </li>
                        `
                    )}
                </ul>
            `,
            (): void => {
                fonts.forEach((pFontFamily): void => {
                    Datas.sheet.leafs[Datas.currentLeaf].fonts = Datas.sheet.leafs[Datas.currentLeaf].fonts?.filter((pFont): boolean => pFont.fontFamily !== pFontFamily)
                })
                Datas.sheetProperties.push({ deleteFont: { fonts: fonts, leafId: Datas.currentLeaf } })
                States.isSaved = false
                States.displayEditBlock(true)
                View.render()
            },
            (): void => States.displayEditBlock(true)
        )
    }

    static async printScreen(): Promise<void> {
        const canvasSize = document.querySelector('rv-sheet > div')?.getBoundingClientRect()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        html2canvas(<RPGVAULTElement>document.querySelector('rv-sheet'), {
            width: canvasSize?.width,
            height: canvasSize?.height,
            x: canvasSize?.x,
            y: canvasSize?.y,
            ignoreElements: (element: Element): boolean => element.tagName === 'BUTTON' || element.tagName === 'rv-LINK',
            onclone: (clonedDocument: Document): void => {
                Array.from(clonedDocument.querySelectorAll('textarea')).forEach((textArea): void => {
                    const div = clonedDocument.createElement('div')
                    div.innerText = textArea.value
                    div.setAttribute('style', <string>textArea.getAttribute('style'))
                    textArea.style.display = 'none'
                    textArea.parentElement?.append(div)
                })
                Array.from(clonedDocument.querySelectorAll('input')).forEach((input): void => {
                    const div = clonedDocument.createElement('div')
                    const span = clonedDocument.createElement('span')
                    div.appendChild(span)
                    span.innerText = input.value
                    div.setAttribute('style', <string>input.getAttribute('style'))
                    div.style.display = 'flex'
                    div.style.alignItems = 'center'
                    div.style.justifyContent = div.style.textAlign
                    input.style.display = 'none'
                    input.parentElement?.append(div)
                })
                Array.from(clonedDocument.querySelectorAll('div.image')).forEach((div): void => {
                    const divClone = clonedDocument.createElement('div')
                    const translate = new WebKitCSSMatrix(getComputedStyle(div).transform)
                    divClone.appendChild(<HTMLElement>div.querySelector('div'))
                    divClone.setAttribute('style', <string>div.getAttribute('style'))
                    divClone.style.transform = 'none'
                    divClone.style.top = translate.m42 + 'px'
                    divClone.style.left = translate.m41 + 'px'
                    ;(<HTMLElement>div).style.display = 'none'
                    div.parentElement?.append(divClone)
                })
            },
        }).then((canvas: HTMLCanvasElement): void => {
            const link = document.createElement('a')
            link.href = canvas.toDataURL()
            link.download = `${Utils.slugify(Datas.sheet.name)}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
    }

    async connectedCallback(): Promise<void> {
        await Datas.init()
        Sheet.element = this
        Sheet.setStyle()
        window.addEventListener('resize', (): void => Sheet.resize())
        ShortcutManager.set(document.body, ['Control', 's'], async (): Promise<void> => {
            await Datas.save()
            View.render()
        })
    }
}
