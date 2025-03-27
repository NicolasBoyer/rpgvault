import Datas from './datas.js'
import View from './view.js'
import { ElementResizer } from '../../classes/elementResizer.js'
import { ElementMover } from '../../classes/elementMover.js'
import { EInterface } from '../../enum.js'
import { ElementManager } from '../../classes/elementManager.js'
import { TElement } from '../../types.js'
import { History } from '../../classes/history.js'

/**
 * Fonctions relatives au statut du composant
 */
export default class States {
    static editMode: boolean
    static notepadMode: boolean
    static sheetMainMenuOpened: boolean
    static isEditBlockHidden: boolean
    static interface = EInterface.hover
    static isSaved = true
    static isHistoryBlockHidden = true
    static isDrawing: boolean = false
    static isZoomed: string | boolean = false

    static displayEditMode(pValue: boolean): void {
        this.displaySheetMainMenu(false)
        this.editMode = pValue
        this.notepadMode = this.notepadMode && !pValue
        Datas.changedInputs = []
        Datas.changedImages = []
        Datas.changedCheckboxes = []
        Datas.deletedInputs = []
        Datas.deletedImages = []
        Datas.deletedCheckboxes = []
        Datas.sheetProperties = []
        ElementManager.selectedInfosElement = null as unknown as TElement
        this.isHistoryBlockHidden = true
        this.initHistory()
        View.render()
    }

    static displayNotepadMode(pValue: boolean): void {
        this.displaySheetMainMenu(false)
        this.notepadMode = pValue
        View.render()
    }

    static displaySheetMainMenu(pValue: boolean): void {
        this.sheetMainMenuOpened = pValue
        View.render()
    }

    static displayHistory(pValue: boolean): void {
        this.isHistoryBlockHidden = pValue
        View.render()
    }

    static displayEditBlock(pValue: boolean): void {
        if (ElementResizer.isPointerDown || ElementMover.isPointerDown) return
        this.isEditBlockHidden = !pValue
        View.render()
    }

    static initHistory(): void {
        if (!this.editMode) return
        History.init()
    }
}
