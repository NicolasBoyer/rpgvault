export const elements = (pElement, pFonts) => [
	{
		id: 'id',
		type: 'hidden',
		name: 'id',
		value: pElement.id
	},
	{
		id: 'name',
		type: 'text',
		name: 'Nom',
		value: pElement.name
	},
	{
		id: 'type',
		type: 'select',
		name: 'Type',
		value: pElement.type,
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
		value: pElement.fontFamily,
		options: pFonts
	},
	{
		id: 'fontSize',
		type: 'number',
		name: 'Taille de la police',
		value: pElement.fontSize
	},
	{
		id: 'color',
		type: 'color',
		name: 'Couleur de la police',
		value: pElement.color
	},
	{
		id: 'textAlign',
		type: 'select',
		name: 'Alignement',
		value: pElement.textAlign,
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
		value: pElement.width
	},
	{
		id: 'height',
		type: 'number',
		name: 'Hauteur',
		value: pElement.height
	},
	{
		id: 'x',
		type: 'number',
		name: 'Abscisse',
		value: pElement.x
	},
	{
		id: 'y',
		type: 'number',
		name: 'Ordonnée',
		value: pElement.y
	}
]
