export type TSheet = {
    _id?: string
    id?: string
    name: string
    slug?: string
    notepad?: TTab[]
    inputs?: TInput[]
    images?: TImage[]
    fonts?: TFont[]
    backgroundColor?: string
    backgroundImage?: string
    backgroundImage_url?: string
    ui?: Record<string, TPosition>
}

export type TTab = { title: string; content: string }

export type TSheetProperties = {
    setBackgroundColor?: Record<string, string>
    setBackgroundImage?: Record<string, Blob | string>
    setFont?: TFont
    deleteFont?: Record<string, string[]>
    setNotepad?: Record<string, Record<string, string>[] | undefined>
    setUIBlocksPosition?: Record<string, TPosition>
    setUIBlocksInterface?: Record<string, string>
}

export type TInput = {
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    value: string
    textAlign: string
    color: string
    fontSize: number
    fontFamily: string
    elementType: string
}

export type TImage = {
    id: string
    x: number
    y: number
    width: number
    height: number
    image: string | ArrayBuffer | null
    file?: Blob | File
    image_url?: string | ArrayBuffer | null
    elementType: string
}

export type TFont = {
    fontFamily: string
    name: string
    fontUrl?: string | ArrayBuffer | null
    fontUrl_url?: string | ArrayBuffer | null
}

export type TElement = TInput & TImage

export type TElements = {
    id: string
    type: string
    name: string
    value: number | string
    options?: {
        name: string
        value: string
    }[]
}

export type TPosition = {
    x: number
    y: number
    width?: number
    height?: number
}

export type SHEETRPGElement = HTMLElement & {
    moverCallback: (position: TPosition) => void
    resizerCallback: (position: TPosition) => void
    selector: HTMLElement
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T
}
