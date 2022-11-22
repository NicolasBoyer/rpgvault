export const inputs = (pInput) => [
	{
		id: 'id',
		type: 'hidden',
		name: 'id',
		value: pInput.id
	},
	{
		id: 'name',
		type: 'text',
		name: 'Nom',
		value: pInput.name
	},
	{
		id: 'type',
		type: 'select',
		name: 'Type',
		value: pInput.type,
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
		id: 'width',
		type: 'number',
		name: 'Largeur',
		value: pInput.width
	},
	{
		id: 'height',
		type: 'number',
		name: 'Hauteur',
		value: pInput.height
	},
	{
		id: 'fontFamily',
		type: 'text',
		name: 'Police',
		value: pInput.fontFamily
	},
	{
		id: 'fontSize',
		type: 'number',
		name: 'Taille de la police',
		value: pInput.fontSize
	},
	{
		id: 'x',
		type: 'number',
		name: 'Abscisse',
		value: pInput.x
	},
	{
		id: 'y',
		type: 'number',
		name: 'Ordonnée',
		value: pInput.y
	}
]
