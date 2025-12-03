import { html, render, TemplateResult } from 'lit'
import Datas from './datas.js'
import States from './states.js'
import Sheet from './sheet.js'
import { ElementResizer } from '../../classes/elementResizer.js'
import { ElementManager } from '../../classes/elementManager.js'
import Interface from './interface.js'
import { HTMLElementEvent, TElement } from '../../types.js'
import { EInterface } from '../../enum.js'
import Notepad from './notepad.js'

/**
 * Fonctions de rendu du composant
 */
export default class View {
    static render(): void {
        render(
            html`
                <style>
                    ${Datas.sheet.leafs[Datas.currentLeaf].fonts?.map((pFont): TemplateResult => html` @font-face { font-family: ${pFont.fontFamily}; src: url(${pFont.fontUrl}); } `)}
                </style>
            `,
            document.head
        )
        render(
            html`
                <div
                    style="position: relative;width: ${Sheet.containerWidth};height: ${Sheet.containerHeight};"
                    class="wrapper ${States.editMode && 'editMode'} ${States.notepadMode && 'notepadMode'} ${States.interface || EInterface.hover}"
                    @click="${(pEvent: PointerEvent): void => {
                        if (States.editMode) ElementManager.select(pEvent)
                        if (States.notepadMode) States.displayNotepadMode(false)
                    }}"
                >
                    ${States.interface === 'hidden' ? Interface.viewBlock() : ''}
                    ${States.editMode
                        ? Interface.editBlock()
                        : html`
                              <button
                                  role="button"
                                  class="burger contrast ${States.sheetMainMenuOpened && 'selected'}"
                                  @click="${(pEvent: PointerEvent): void => {
                                      pEvent.stopPropagation()
                                      States.displaySheetMainMenu(!States.sheetMainMenuOpened)
                                  }}"
                              >
                                  <svg class="burger">
                                      <use href="#burger"></use>
                                  </svg>
                                  <span>Accueil</span>
                              </button>
                              ${States.sheetMainMenuOpened ? html`<rv-menu><rv-logged-user list></rv-logged-user></rv-menu>` : ''}
                              <button class="edit contrast" @click="${(): void => States.displayEditMode(true)}">
                                  <svg class="edit">
                                      <use href="#edit"></use></svg
                                  ><span>Éditer</span>
                              </button>
                              <button
                                  class="notepad contrast ${States.notepadMode && 'selected'}"
                                  @click="${(pEvent: PointerEvent): void => {
                                      pEvent.stopPropagation()
                                      States.displayNotepadMode(!States.notepadMode)
                                  }}"
                              >
                                  Bloc notes
                              </button>
                              ${Interface.leafBlock()}
                              <button class="print contrast" @click="${(): Promise<void> => Sheet.printScreen()}">
                                  <svg class="print">
                                      <use href="#print"></use>
                                  </svg>
                                  <span>Imprimer</span>
                              </button>
                              ${States.notepadMode ? Notepad.render() : ''}
                          `}
                    ${!States.isHistoryBlockHidden ? Interface.historyBlock() : ''}
                    ${Datas.sheet.leafs[Datas.currentLeaf].inputs?.map((pInput): TemplateResult => {
                        const isSelected = ElementManager.selectedInfosElements.some((pSelectedInfosElement): boolean => pSelectedInfosElement.id === pInput.id)
                        return html`
                            <label for="${pInput.id}" style="transform: translate(${pInput.x * Sheet.ratio}px, ${pInput.y * Sheet.ratio}px);" class="${isSelected ? 'selected' : ''}">
                                ${pInput.type === 'textarea'
                                    ? html`
                                          <textarea
                                              id="${pInput.id}"
                                              name="${pInput.id}"
                                              style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height *
                                              Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
                                              @change="${(pEvent: HTMLElementEvent<HTMLTextAreaElement>): Promise<void> => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
                                              ?readonly="${States.editMode || pInput.readonly}"
                                              @click="${(pEvent: PointerEvent): void => ElementManager.select(pEvent, <TElement>pInput)}"
                                          >
${pInput.value}</textarea
                                          >
                                      `
                                    : html`
                                          <input
                                              type="${pInput.type}"
                                              id="${pInput.id}"
                                              name="${pInput.id}"
                                              value="${pInput.value}"
                                              style="font-size: ${pInput.fontSize * Sheet.ratio}px;width: ${pInput.width * Sheet.ratio}px;height: ${pInput.height *
                                              Sheet.ratio}px;color: ${pInput.color};text-align: ${pInput.textAlign};font-family: ${pInput.fontFamily};"
                                              @change="${(pEvent: HTMLElementEvent<HTMLInputElement>): Promise<void> => Datas.addAndSaveInput(pInput, 'value', pEvent.target.value)}"
                                              ?readonly="${States.editMode || pInput.readonly}"
                                              @click="${(pEvent: PointerEvent): void => ElementManager.select(pEvent, <TElement>pInput)}"
                                          />
                                      `}
                                ${ElementResizer.boxPositions.map((pBoxPosition): TemplateResult => html`<div .hidden="${!isSelected}" class="resizeHandler ${pBoxPosition.class}" />`)}
                            </label>
                            ${isSelected ? Interface.selectBlock(<TElement>pInput) : ''}
                        `
                    })}
                    ${Datas.sheet.leafs[Datas.currentLeaf].images?.map((pImage): TemplateResult => {
                        const isSelected = ElementManager.selectedInfosElements.some((pSelectedInfosElement): boolean => pSelectedInfosElement.id === pImage.id)
                        return html`
                            <div
                                id="${pImage.id}"
                                style="transform: translate(${<number>pImage.x * Sheet.ratio}px, ${<number>pImage.y * Sheet.ratio}px);width: ${<number>pImage.width * Sheet.ratio}px;height: ${<number>pImage.height * Sheet.ratio}px;"
                                class="image ${isSelected ? 'selected' : ''} ${States.isZoomed === pImage.id ? 'isZoomed' : ''}"
                                @click="${(pEvent: PointerEvent): void => {
                                    if (States.editMode) ElementManager.select(pEvent, <TElement>pImage)
                                    else {
                                        if (!States.isZoomed) States.isZoomed = pImage.id
                                        else States.isZoomed = false
                                        View.render()
                                    }
                                }}"
                            >
                                <div style="background-image: url(${pImage.image});"></div>
                                ${ElementResizer.boxPositions.map((pBoxPosition): TemplateResult => html`<div .hidden="${!isSelected}" class="resizeHandler ${pBoxPosition.class}" />`)}
                            </div>
                            ${isSelected ? Interface.selectBlock(<TElement>pImage) : ''}
                        `
                    })}
                    ${Datas.sheet.leafs[Datas.currentLeaf].checkboxes?.map((pCheckbox): TemplateResult => {
                        const isSelected = ElementManager.selectedInfosElements.some((pSelectedInfosElement): boolean => pSelectedInfosElement.id === pCheckbox.id)
                        return html`
                            <div
                                id="${pCheckbox.id}"
                                style="transform: translate(${<number>pCheckbox.x * Sheet.ratio}px, ${<number>pCheckbox.y * Sheet.ratio}px);width: ${<number>pCheckbox.width * Sheet.ratio}px;height: ${<number>pCheckbox.height *
                                Sheet.ratio}px;"
                                class="checkbox ${isSelected ? 'selected' : ''} ${pCheckbox.checked ? 'isVisible' : ''}"
                                @click="${async (pEvent: PointerEvent): Promise<void> => {
                                    if (States.editMode) ElementManager.select(pEvent, <TElement>pCheckbox)
                                    else {
                                        pCheckbox.checked = !pCheckbox.checked
                                        await Datas.addAndSaveCheckbox(pCheckbox, 'checked', pCheckbox.checked)
                                        View.render()
                                    }
                                }}"
                            >
                                <div style="background-image: url(${pCheckbox.image});"></div>
                                ${ElementResizer.boxPositions.map((pBoxPosition): TemplateResult => html`<div .hidden="${!isSelected}" class="resizeHandler ${pBoxPosition.class}" />`)}
                            </div>
                            ${isSelected && ElementManager.selectedInfosElements.length === 1 ? Interface.selectBlock(<TElement>pCheckbox) : ''}
                        `
                    })}
                </div>
            `,
            Sheet.element
        )
        ElementManager.init()
        Notepad.init()
    }
}
