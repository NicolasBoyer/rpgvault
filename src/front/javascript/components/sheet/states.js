import Datas from './datas.js'
import View from './view.js'
import { ElementResizer } from '../../classes/elementResizer.js'
import { ElementMover } from '../../classes/elementMover.js'
import { ElementManager } from '../../classes/elementManager.js'

/**
 * Fonctions relatives au statut du composant
 */
export default class States {
	static editMode
	static isEditBlockHidden
	static interface = 'hover'
	static isSaved = true

	static displayEditMode (pValue) {
		ElementManager.select()
		this.editMode = pValue
		Datas.changedInputs = []
		Datas.changedImages = []
		Datas.deletedInputs = []
		Datas.deletedImages = []
		Datas.sheetProperties = []
		View.render()
	}

	static displayEditBlock (pValue) {
		if (ElementResizer.isPointerDown || ElementMover.isPointerDown) return
		this.isEditBlockHidden = !pValue
		View.render()
	}
}
