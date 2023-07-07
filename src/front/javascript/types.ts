export type TSheet = {
	_id?: string
	id?: string
	name: string
	slug?: string
	notepad?: string
	inputs?: TInput[]
	images?: TImage[]
	fonts?: TFont[]
	backgroundColor?: string
	backgroundImage?: string
	backgroundImage_url?: string
}

export type TSheetProperties = {
	setBackgroundColor?: Record<string, string>
	setBackgroundImage?: Record<string, Blob | string>
	setFont?: TFont
	deleteFont?: Record<string, string[]>
	setNotepad?: Record<string, string>
}

export type TInput = {
	[key: string]: unknown
	id: string
	type: string
	x: number
	y: number
	width: number
	height: number
	value: string
	fontFamily: string
	textAlign: string
	color: string
	fontSize: number
	image?: never
	file?: never
	image_url?: never
	name?: never
	fontUrl?: never
	fontUrl_url?: never
}

export type TImage = {
	[key: string]: unknown
	id: string
	type?: never
	x?: number
	y?: number
	width?: number
	height?: number
	value?: never
	fontFamily?: never
	textAlign?: never
	color?: never
	fontSize?: never
	image?: string | ArrayBuffer | null
	file?: Blob | File
	image_url?: string | ArrayBuffer | null
	name?: never
	fontUrl?: never
	fontUrl_url?: never
}

export type TFont = {
	[key: string]: unknown
	id?: never
	type?: string
	x?: never
	y?: never
	width?: never
	height?: never
	value?: never
	fontFamily: string
	textAlign?: never
	color?: never
	fontSize?: never
	image?: never
	file?: never
	image_url?: never
	name: string
	fontUrl: string | ArrayBuffer | null
	fontUrl_url?: string | ArrayBuffer | null
}

export type TElement = TInput | TImage

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
	callback: (position: TPosition) => void
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
	target: T;
}
