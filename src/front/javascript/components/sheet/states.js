import Datas from './datas.js'
import Input from './input.js'
import View from './view.js'
import { ElementResizer } from '../../classes/ElementResizer.js'
import { ElementMover } from '../../classes/ElementMover.js'

/**
 * Fonctions relatives au statut du composant
 */
export default class States {
	static editMode
	static isEditBlockHidden

	static displayEditMode (pValue) {
		Input.select()
		this.editMode = pValue
		Datas.changedInputs = []
		Datas.deletedInputs = []
		Datas.sheetProperties = []
		View.render()
	}

	static displayEditBlock (pValue) {
		if (ElementResizer.isResizing || ElementMover.isMoving) return
		this.isEditBlockHidden = !pValue
		View.render()
	}
}
