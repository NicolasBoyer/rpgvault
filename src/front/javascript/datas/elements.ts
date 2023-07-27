import {TElement, TElements, TFont} from '../types.js'

export const elements = (pElement: TElement | TFont, pFonts: { name: string, value: string }[] | undefined): TElements[] => [
    {
        id: 'id',
        type: 'hidden',
        name: 'id',
        value: <string>pElement.id
    },
    {
        id: 'type',
        type: 'select',
        name: 'Type',
        value: <string>pElement.type,
        options: [
            {
                name: 'Texte court',
                value: 'text'
            }, {
                name: 'Texte long',
                value: 'textarea'
            }, {
                name: 'Nombre',
                value: 'number'
            }
        ]
    },
    {
        id: 'fontFamily',
        type: 'select',
        name: 'Police',
        value: <string>pElement.fontFamily,
        options: pFonts
    },
    {
        id: 'fontSize',
        type: 'number',
        name: 'Taille de la police',
        value: <number>pElement.fontSize
    },
    {
        id: 'color',
        type: 'color',
        name: 'Couleur de la police',
        value: <string>pElement.color
    },
    {
        id: 'textAlign',
        type: 'select',
        name: 'Alignement',
        value: <string>pElement.textAlign,
        options: [
            {
                name: 'Gauche',
                value: 'left'
            }, {
                name: 'Centré',
                value: 'center'
            }, {
                name: 'Droite',
                value: 'right'
            }, {
                name: 'Justifié',
                value: 'justify'
            }
        ]
    },
    {
        id: 'width',
        type: 'number',
        name: 'Largeur',
        value: <number>pElement.width
    },
    {
        id: 'height',
        type: 'number',
        name: 'Hauteur',
        value: <number>pElement.height
    },
    {
        id: 'x',
        type: 'number',
        name: 'Abscisse',
        value: <number>pElement.x
    },
    {
        id: 'y',
        type: 'number',
        name: 'Ordonnée',
        value: <number>pElement.y
    }
]
