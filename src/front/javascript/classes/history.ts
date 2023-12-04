import { THistory, THistoryEntry } from '../types.js'
import { ShortcutManager } from './shortcutManager.js'

export class History {
    private static savedPosition: number = 0
    private static position: number = 0
    private static history: THistory

    static init(): void {
        this.history = []
        this.resetSavedPosition(0)
        ShortcutManager.set(document.body, ['Control', 'z'], (): void => this.undo())
        ShortcutManager.set(document.body, ['Control', 'y'], (): void => this.redo())
    }

    static set(name: string, title: string, action: (...args: unknown[]) => void, ...args: unknown[]): THistory {
        while (this.history[this.position]) {
            this.history.splice(this.position, 1)
        }
        this.history[this.position] = { name, title, action, args }
        this.position++
        console.log(this.history)
        console.log(this.position)
        return this.history
    }

    static get(name?: string): THistory | THistoryEntry | undefined {
        return name ? this.history.find((pEntry): boolean => pEntry.name === name) : this.history
    }

    static resetSavedPosition(pPosition: number | null = null): void {
        this.savedPosition = pPosition || this.position
    }

    static reset(): void {
        for (let i = this.savedPosition; i < (<THistory>this.get()).length; i++) {
            // TODO ICI peut etre créer une fonction public qui met savedpos ) pos et pas passer pos ici et tester seulement icio
            // TODO marche mais le save pas enregistré sur l'annulation et enregistrement devrait désélectionner
            // TODO Le pb c que changedimages n'est pas changé donc on enregistre pas
            this.undo()
        }
    }

    private static undo(): void {
        // TODO histo bloc note + delete merde + bloc histo + test annule après un save IMPORTANT
        // document.body.dispatchEvent(new CustomEvent('historyChanged', { detail: structuredClone(this.movePosition(EHistoryPosition.down)?.refObject) }))
        if (this.position === 0) return
        this.position--
        const entry = this.history[this.position]
        entry?.action(...entry.args)
        console.log(entry)
        // if (this.history[this.position - 1]) {
        //     this.position--
        // }
        // document.body.dispatchEvent(new CustomEvent('historyChanged'))
    }

    private static redo(): void {
        // document.body.dispatchEvent(new CustomEvent('historyChanged', { detail: structuredClone(this.movePosition(EHistoryPosition.up)?.refObject) }))
        // if (this.position === 0) return
        this.position++
        const entry = this.history[this.position]
        entry?.action(...entry.args)
        console.log(entry)
    }

    // private static movePosition(historyPosition: EHistoryPosition): THistoryEntry | null {
    //     this.position = historyPosition === EHistoryPosition.up ? this.position + 1 : this.position - 1
    //     const entry = this.history[this.position]
    //     console.log(entry)
    //     if (!entry) {
    //         this.position = historyPosition === EHistoryPosition.up ? this.position - 1 : this.position + 1
    //         return null
    //     }
    //     return entry
    // }
}
