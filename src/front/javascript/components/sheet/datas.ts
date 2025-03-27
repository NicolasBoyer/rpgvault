import { Utils } from '../../classes/utils.js'
import States from './states.js'
import View from './view.js'
import { Caches } from '../../classes/caches.js'
import { TCheckbox, TElement, TImage, TInput, TSheet, TSheetProperties } from '../../types.js'
import { History } from '../../classes/history.js'

/**
 * Fonctions permettant de gérer les données.
 * Initialisation, Changement de valeurs ou enregistrement.
 */
export default class Datas {
    static sheet: TSheet
    static changedInputs: TInput[]
    static changedImages: TImage[]
    static changedCheckboxes: TCheckbox[]
    static deletedInputs: string[]
    static deletedImages: string[]
    static deletedCheckboxes: string[]
    static sheetProperties: TSheetProperties[]
    static isSaving = false
    private static id: string

    static async init(): Promise<void> {
        Utils.loader(true)
        const splitUrl = location.pathname.split('/')
        const sheets = <TSheet[]>((await Caches.get('sheets')) || (await Utils.request('/db', 'POST', { body: '{ "getSheets": "" }' })))
        Caches.set(true, 'sheets', sheets)
        this.sheet = sheets.length ? <TSheet>sheets.find((pSheet): boolean => pSheet.slug === splitUrl[splitUrl.length - 1]) : (sheets as unknown as TSheet)
        // TODO si pas de sheet retourner une 404
        this.id = <string>this.sheet._id
        this.sheet = <TSheet>((await Caches.get(this.id)) || this.sheet)
        await this.cacheResources()
    }

    static async addAndSaveInput(pInput: TInput, ...args: (keyof TInput | number | string)[]): Promise<void> {
        this.addInputValues(pInput, ...args)
        await this.save(pInput as TElement)
    }

    static async addAndSaveCheckbox(pCheckbox: TCheckbox, ...args: (keyof TCheckbox | boolean)[]): Promise<void> {
        await this.addCheckboxValues(pCheckbox, ...args)
        await this.save(pCheckbox as TElement)
    }

    static async saveNotepad(index: number, tab?: { title?: string; content?: string }): Promise<void> {
        if (!this.sheet.notepad![index]) this.sheet.notepad![index] = { title: '', content: '' }
        if (index && !tab) this.sheet.notepad = this.sheet.notepad!.filter((_pTab, pIndex): boolean => pIndex !== index)
        if (tab) {
            this.sheet.notepad![index].content = tab.content || this.sheet.notepad![index].content || ''
            this.sheet.notepad![index].title = tab.title || this.sheet.notepad![index].title || ''
        }
        this.sheetProperties = [{ setNotepad: { notepad: this.sheet.notepad } }]
        await this.save()
    }

    static addInputValues(pInput: TInput, ...args: (number | string | boolean)[]): void {
        for (let i = 0; i < args.length; i++) {
            const value: string | number | boolean = args[i + 1]
            if (i % 2 === 0) (pInput as Record<string, typeof value>)[args[i] as keyof TInput] = value
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

    static async addImageValues(pImage: TImage, ...args: (File | number | string | boolean)[]): Promise<void> {
        for (let i = 0; i < args.length; i++) {
            const value: string | number | boolean | File = args[i + 1]
            if (i % 2 === 0) (pImage as Record<string, typeof value>)[args[i] as keyof TImage] = value
        }
        let index
        if (States.editMode) {
            index = this.changedImages.findIndex((image): boolean => image.id === pImage.id)
            if (index) delete pImage.image_url
            this.changedImages[index !== -1 ? index : this.changedImages.length || 0] = pImage
        }
        if (!this.sheet.images) this.sheet.images = []
        index = this.sheet.images.findIndex((image: TImage): boolean => image.id === pImage.id)
        if (pImage.file) pImage.image = await Utils.getBase64FromFileReader(pImage.file)
        this.sheet.images[index !== -1 ? index : this.sheet.images.length || 0] = pImage
        States.isSaved = false
        View.render()
    }

    static async addCheckboxValues(pCheckbox: TCheckbox, ...args: (File | number | string | boolean)[]): Promise<void> {
        for (let i = 0; i < args.length; i++) {
            const value: string | number | boolean | File = args[i + 1]
            if (i % 2 === 0) (pCheckbox as Record<string, typeof value>)[args[i] as keyof TCheckbox] = value
        }
        let index
        if (States.editMode) {
            index = this.changedCheckboxes.findIndex((checkbox: TCheckbox): boolean => checkbox.id === pCheckbox.id)
            if (index) delete pCheckbox.image_url
            this.changedCheckboxes[index !== -1 ? index : this.changedCheckboxes.length || 0] = pCheckbox
        }
        if (!this.sheet.checkboxes) this.sheet.checkboxes = []
        index = this.sheet.checkboxes.findIndex((checkbox: TCheckbox): boolean => checkbox.id === pCheckbox.id)
        if (pCheckbox.file) pCheckbox.image = await Utils.getBase64FromFileReader(pCheckbox.file)
        this.sheet.checkboxes[index !== -1 ? index : this.sheet.checkboxes.length || 0] = pCheckbox
        States.isSaved = false
        View.render()
    }

    static async save(pElement: TElement | null = null): Promise<void> {
        this.isSaving = true
        const body = []
        const inputs = pElement?.elementType === 'input' ? [pElement] : this.changedInputs
        inputs?.forEach((pInput: TInput): void => {
            body.push({
                setInput: {
                    id: this.id,
                    inputId: pInput.id,
                    input: pInput,
                },
            })
        })
        const checkboxes = pElement?.elementType === 'checkbox' ? [pElement] : this.changedCheckboxes
        for (const checkbox of checkboxes) {
            if (checkbox.file) {
                checkbox.image = await Utils.uploadFileAndGetUrl(checkbox.file)
                delete checkbox.file
            }
            if (checkbox.image_url) {
                checkbox.image = checkbox.image_url
                delete checkbox.image_url
            }
            body.push({
                setCheckbox: {
                    id: this.id,
                    checkboxId: checkbox.id,
                    checkbox: checkbox,
                },
            })
        }
        if (!pElement) {
            this.deletedInputs?.forEach((pInputId: string): void => {
                body.push({
                    deleteInput: {
                        id: this.id,
                        inputId: pInputId,
                    },
                })
            })
            if (this.changedImages) {
                for (const image of this.changedImages) {
                    if (image.file) {
                        image.image = await Utils.uploadFileAndGetUrl(image.file)
                        delete image.file
                    }
                    if (image.image_url) {
                        image.image = image.image_url
                        delete image.image_url
                    }
                    body.push({
                        setImage: {
                            id: this.id,
                            imageId: image.id,
                            image: image,
                        },
                    })
                }
            }
            this.deletedImages?.forEach((pImageId: string): void => {
                body.push({
                    deleteImage: {
                        id: this.id,
                        imageId: pImageId,
                    },
                })
            })
            this.deletedCheckboxes?.forEach((pCheckboxId: string): void => {
                body.push({
                    deleteCheckbox: {
                        id: this.id,
                        checkboxId: pCheckboxId,
                    },
                })
            })
            for (const property of this.sheetProperties) {
                const value = Object.values(property)[0]
                if (Object.keys(property)[0] === 'setBackgroundImage') (<Record<string, string | Blob>>value).image = await Utils.uploadFileAndGetUrl((<Record<string, string | Blob>>value).image as Blob)
                if (Object.keys(property)[0] === 'setFont') value.fontUrl = await Utils.uploadFileAndGetUrl(value.fontUrl as Blob, value.name as string)
                ;(<Record<string, string> | Record<string, string | Blob> | Record<string, string[]>>value).id = this.id
                body.push(property)
            }
        }
        const sheets = <TSheet[] | undefined>((await Utils.request('/db', 'POST', { body: JSON.stringify(body) })) as unknown as [TSheet[]]).pop()
        if (sheets) {
            this.sheet = <TSheet>sheets.find((pSheet): boolean => pSheet._id === this.id)
            await Caches.set(true, 'sheets', sheets)
            await this.cacheResources()
            this.changedInputs = []
            this.changedImages = []
            this.changedCheckboxes = []
            this.deletedInputs = []
            this.deletedImages = []
            this.deletedCheckboxes = []
            this.sheetProperties = []
            this.isSaving = false
            States.isSaved = true
            History.resetSavedPosition()
        }
    }

    private static async cacheResources(): Promise<void> {
        const cache = <TSheet>await Caches.get(this.id)
        if (Utils.isValidHttpUrl(<string>this.sheet.backgroundImage)) {
            this.sheet.backgroundImage_url = this.sheet.backgroundImage
            this.sheet.backgroundImage = cache?.backgroundImage || this.sheet.backgroundImage
            if ((cache?.backgroundImage !== this.sheet.backgroundImage && cache?.backgroundImage_url !== this.sheet.backgroundImage) || !cache) this.sheet.backgroundImage = <string>await Utils.urlToBase64(<string>this.sheet.backgroundImage)
        }
        if (this.sheet.images) {
            for (let i = 0; i < this.sheet.images.length; i++) {
                const image = this.sheet.images[i]
                if (Utils.isValidHttpUrl(<string>image.image)) {
                    image.image_url = image.image
                    const cacheImage = cache?.images && cache?.images[i]?.image
                    image.image = cacheImage && cacheImage === image.image ? cacheImage : image.image
                    if ((cacheImage !== image.image && cache?.images && cache?.images[i]?.image_url !== image.image) || !cache) image.image = await Utils.urlToBase64(<string>image.image)
                }
            }
        }
        if (this.sheet.fonts) {
            for (let i = 0; i < this.sheet.fonts.length; i++) {
                const font = this.sheet.fonts[i]
                if (Utils.isValidHttpUrl(<string>font.fontUrl)) {
                    font.fontUrl_url = font.fontUrl
                    font.fontUrl = (cache?.fonts && cache?.fonts[i]?.fontUrl_url) || font.fontUrl
                    if ((cache?.fonts && cache.fonts[i]?.fontUrl !== font.fontUrl && cache?.fonts[i]?.fontUrl_url !== font.fontUrl) || !cache) font.fontUrl = await Utils.urlToBase64(<string>font.fontUrl)
                }
            }
        }
        Caches.set(true, this.id, this.sheet)
    }
}
