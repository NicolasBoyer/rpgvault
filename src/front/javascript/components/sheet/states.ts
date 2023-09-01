import Datas from './datas.js'
import View from './view.js'
import {ElementResizer} from '../../classes/elementResizer.js'
import {ElementMover} from '../../classes/elementMover.js'
import {EInterface} from '../../enum.js'
import {ElementManager} from '../../classes/elementManager.js'
import {TElement} from '../../types.js'

/**
 * Fonctions relatives au statut du composant
 */
export default class States {
    static editMode: boolean
    static notepadMode: boolean
    static isEditBlockHidden: boolean
    static interface = EInterface.hover
    static isSaved = true
    static isDrawing: boolean = false
    static isZoomed: string | boolean = false

    static displayEditMode(pValue: boolean): void {
        this.editMode = pValue
        this.notepadMode = this.notepadMode && !pValue
        Datas.changedInputs = []
        Datas.changedImages = []
        Datas.deletedInputs = []
        Datas.deletedImages = []
        Datas.sheetProperties = []
        ElementManager.selectedInfosElement = null as unknown as TElement
        View.render()
    }

    static displayNotepadMode(pValue: boolean): void {
        this.notepadMode = pValue
        View.render()
    }

    static displayEditBlock(pValue: boolean): void {
        if (ElementResizer.isPointerDown || ElementMover.isPointerDown) return
        this.isEditBlockHidden = !pValue
        View.render()
    }
}
