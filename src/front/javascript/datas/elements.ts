import { TElement, TElements } from '../types.js'

export const elements = (pInfosElement: TElement, pFonts: { name: string; value: string }[] | undefined): TElements[] => [
    {
        id: 'id',
        type: 'hidden',
        name: 'id',
        value: <string>pInfosElement.id,
    },
    {
        id: 'type',
        type: 'select',
        name: 'Type',
        value: <string>pInfosElement.type,
        options: [
            {
                name: 'Texte court',
                value: 'text',
            },
            {
                name: 'Texte long',
                value: 'textarea',
            },
            {
                name: 'Nombre',
                value: 'number',
            },
        ],
    },
    {
        id: 'fontFamily',
        type: 'select',
        name: 'Police',
        value: <string>pInfosElement.fontFamily,
        options: pFonts,
    },
    {
        id: 'fontSize',
        type: 'number',
        name: 'Taille de la police',
        value: <number>pInfosElement.fontSize,
    },
    {
        id: 'color',
        type: 'color',
        name: 'Couleur de la police',
        value: <string>pInfosElement.color,
    },
    {
        id: 'textAlign',
        type: 'select',
        name: 'Alignement',
        value: <string>pInfosElement.textAlign,
        options: [
            {
                name: 'Gauche',
                value: 'left',
            },
            {
                name: 'Centré',
                value: 'center',
            },
            {
                name: 'Droite',
                value: 'right',
            },
            {
                name: 'Justifié',
                value: 'justify',
            },
        ],
    },
    {
        id: 'image',
        type: 'file',
        name: 'Image',
        value: <string | Blob | File>pInfosElement.file,
    },
    {
        id: 'width',
        type: 'number',
        name: 'Largeur',
        value: <number>pInfosElement.width,
    },
    {
        id: 'height',
        type: 'number',
        name: 'Hauteur',
        value: <number>pInfosElement.height,
    },
    {
        id: 'x',
        type: 'number',
        name: 'Abscisse',
        value: <number>pInfosElement.x,
    },
    {
        id: 'y',
        type: 'number',
        name: 'Ordonnée',
        value: <number>pInfosElement.y,
    },
    {
        id: 'writable',
        type: 'checkbox',
        name: 'Lecture seule',
        value: <boolean>pInfosElement.writable,
    },
]
