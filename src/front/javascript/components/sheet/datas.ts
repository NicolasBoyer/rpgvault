import {Utils} from '../../classes/utils.js'
import States from './states.js'
import View from './view.js'
import {Caches} from '../../classes/caches.js'
import {TImage, TInput, TSheet, TSheetProperties} from '../../types.js'

/**
 * Fonctions permettant de gérer les données.
 * Initialisation, Changement de valeurs ou enregistrement.
 */
export default class Datas {
    static sheet: TSheet
    static changedInputs: TInput[]
    static changedImages: TImage[]
    static deletedInputs: string[]
    static deletedImages: string[]
    static sheetProperties: TSheetProperties[]
    static isSaving = false
    private static id: string

    static async init(): Promise<void> {
        Utils.loader(true)
        const splitUrl = location.pathname.split('/')
        const sheets = <TSheet[]>(await Caches.get('sheets') || await Utils.request('/db', 'POST', {body: '{ "getSheets": "" }'}))
        Caches.set(true, 'sheets', sheets)
        this.sheet = <TSheet>sheets.find((pSheet): boolean => pSheet.slug === splitUrl[splitUrl.length - 1])
        // TODO si pas de sheet retourner une 404
        this.id = <string>this.sheet._id
        this.sheet = <TSheet>(await Caches.get(this.id) || this.sheet)
        await this.cacheResources()
    }

    static async addAndSaveInput(pInput: TInput, ...args: (keyof TInput)[]): Promise<void> {
        this.addInputValues(pInput, ...args)
        await this.save(pInput)
    }

    static async saveNotepad(text: string): Promise<void> {
        this.sheet.notepad = text
        this.sheetProperties = [{setNotepad: {text}}]
        await this.save()
    }

    static addInputValues(pInput: TInput, ...args: (keyof TInput)[]): void {
        for (let i = 0; i < args.length; i++) {
            const value: string | number = args[i + 1]
            if (i % 2 === 0) pInput[args[i]] = Number(value) || value
        }
        let index
        if (!this.sheet.inputs) this.sheet.inputs = []
        if (States.editMode) {
            index = this.changedInputs.findIndex((input: TInput): boolean => input.id === pInput.id)
            this.changedInputs[index !== -1 ? index : this.changedInputs.length || 0] = pInput
        }
        index = this.sheet.inputs.findIndex((input: TInput): boolean => input.id === pInput.id)
        this.sheet.inputs[index !== -1 ? index : this.sheet.inputs.length || 0] = pInput
        States.isSaved = false
        View.render()
    }

    static async addImageValues(pImage: TImage, ...args: (keyof TImage | File)[]): Promise<void> {
        for (let i = 0; i < args.length; i++) {
            const value: string | number | File = args[i + 1]
            if (i % 2 === 0) pImage[<string>args[i]] = Number(value) || value
        }
        let index
        if (States.editMode) {
            index = this.changedImages.findIndex((image): boolean => image.id === pImage.id)
            this.changedImages[index !== -1 ? index : this.changedImages.length || 0] = pImage
        }
        if (!this.sheet.images) this.sheet.images = []
        index = this.sheet.images.findIndex((image: TImage): boolean => image.id === pImage.id)
        if (pImage.file) pImage.image = await Utils.getBase64FromFileReader(pImage.file)
        this.sheet.images[index !== -1 ? index : this.sheet.images.length || 0] = pImage
        States.isSaved = false
        View.render()
    }

    private static async cacheResources(): Promise<void> {
        const cache = <TSheet>await Caches.get(this.id)
        if (Utils.isValidHttpUrl(<string>this.sheet.backgroundImage)) {
            this.sheet.backgroundImage_url = this.sheet.backgroundImage
            if (cache && cache?.backgroundImage !== this.sheet.backgroundImage || !cache) this.sheet.backgroundImage = <string>(await Utils.urlToBase64(<string>this.sheet.backgroundImage))
        }
        if (this.sheet.images) {
            for (let i = 0; i < this.sheet.images.length; i++) {
                const image = this.sheet.images[i]
                if (Utils.isValidHttpUrl(<string>image.image)) {
                    image.image_url = image.image
                    if (cache && cache.images && cache.images[i]?.image !== image.image || !cache) image.image = await Utils.urlToBase64(<string>image.image)
                }
            }
        }
        if (this.sheet.fonts) {
            for (let i = 0; i < this.sheet.fonts.length; i++) {
                const font = this.sheet.fonts[i]
                if (Utils.isValidHttpUrl(<string>font.fontUrl)) {
                    font.fontUrl_url = font.fontUrl
                    if (cache && cache.fonts && cache.fonts[i]?.fontUrl !== font.fontUrl || !cache) font.fontUrl = await Utils.urlToBase64(<string>font.fontUrl)
                }
            }
        }
        Caches.set(true, this.id, this.sheet)
    }

    static async save(pInput: TInput | null = null): Promise<void> {
        this.isSaving = true
        const body = []
        const inputs = pInput ? [pInput] : this.changedInputs
        inputs?.forEach((pInput: TInput): void => {
            body.push({
                setInput: {
                    id: this.id,
                    inputId: pInput.id,
                    input: pInput
                }
            })
        })
        if (!pInput) {
            this.deletedInputs?.forEach((pInputId: string): void => {
                body.push({
                    deleteInput: {
                        id: this.id,
                        inputId: pInputId
                    }
                })
            })
            if (this.changedImages) {
                for (const image of this.changedImages) {
                    if (image.file) {
                        image.image = await Utils.uploadFileAndGetUrl(image.file)
                        delete image.file
                    } else {
                        image.image = image.image_url
                        delete image.image_url
                    }
                    body.push({
                        setImage: {
                            id: this.id,
                            imageId: image.id,
                            image: image
                        }
                    })
                }
            }
            this.deletedImages?.forEach((pImageId: string): void => {
                body.push({
                    deleteImage: {
                        id: this.id,
                        imageId: pImageId
                    }
                })
            })
            for (const property of this.sheetProperties) {
                const value = Object.values(property)[0]
                if (Object.keys(property)[0] === 'setBackgroundImage') (<Record<string, string | Blob>>value).image = await Utils.uploadFileAndGetUrl((<Record<string, string | Blob>>value).image as Blob)
                if (Object.keys(property)[0] === 'setFont') value.fontUrl = await Utils.uploadFileAndGetUrl(value.fontUrl as Blob, value.name as string);
                (<Record<string, string> | Record<string, string | Blob> | Record<string, string[]>>value).id = this.id
                body.push(property)
            }
        }
        const sheets = <TSheet[] | undefined>(await Utils.request('/db', 'POST', {body: JSON.stringify(body)}) as unknown as [TSheet[]]).pop()
        if (sheets) {
            this.sheet = <TSheet>sheets.find((pSheet): boolean => pSheet._id === this.id)
            await Caches.set(true, 'sheets', sheets)
            await this.cacheResources()
            this.changedInputs = []
            this.changedImages = []
            this.deletedInputs = []
            this.deletedImages = []
            this.sheetProperties = []
            this.isSaving = false
            States.isSaved = true
        }
    }
}
