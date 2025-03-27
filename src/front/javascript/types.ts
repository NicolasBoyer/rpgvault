import http from 'http'
import { JwtPayload } from 'jsonwebtoken'

export type TSheet = {
    _id?: string
    id?: string
    name: string
    description?: string
    illustration?: string
    slug?: string
    notepad?: TTab[]
    inputs?: TInput[]
    images?: TImage[]
    checkboxes?: TCheckbox[]
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
    selected?: boolean
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
    selected?: boolean
}

export type TCheckbox = {
    id: string
    x: number
    y: number
    width: number
    height: number
    image: string | ArrayBuffer | null
    file?: Blob | File
    image_url?: string | ArrayBuffer | null
    color: string
    elementType: string
    checked: boolean
    selected?: boolean
}

export type TFont = {
    fontFamily: string
    name: string
    fontUrl?: string | ArrayBuffer | null
    fontUrl_url?: string | ArrayBuffer | null
}

export type TElement = TInput & TImage & TCheckbox

export type TElements = {
    id: string
    type: string
    name: string
    value: number | string | Blob | File
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

export type RPGVAULTElement = HTMLElement & {
    moverCallback: (position: TPosition) => void
    resizerCallback: (position: TPosition) => void
    selector: HTMLElement
    hasMoved?: boolean
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T
}

export type THistoryEntry = {
    name: string
    title: string
    action: (...args: unknown[]) => void
    args: unknown[]
}

export type THistory = THistoryEntry[]

export type TRoute = {
    path: string
    className: string
    title: string
    label: string
}

export type TIncomingMessage = http.IncomingMessage & {
    params: Record<string, string>
    user?: string | JwtPayload
}

export type TValidateReturn = {
    success: boolean
    message?: string
    token?: string
}

export type TUser = {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    roles: { db: string; permissions: string[] }[]
    userDbName: string
}
