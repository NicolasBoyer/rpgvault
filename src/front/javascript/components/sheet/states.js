import Datas from './datas.js'
import Input from './input.js'
import View from './view.js'

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
		this.isEditBlockHidden = !pValue
		View.render()
	}
}
