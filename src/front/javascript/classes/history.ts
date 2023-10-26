import { THistory, THistoryEntry } from '../types.js'
import { ShortcutManager } from './shortcutManager.js'
import { EHistoryPosition } from '../enum.js'

export class History {
    private static history: THistory
    private static position: number = -1

    static init(refObject: Record<string, unknown>): void {
        this.history = []
        this.set('init', refObject)
        ShortcutManager.set(document.body, ['Control', 'z'], (): void => this.undo())
        ShortcutManager.set(document.body, ['Control', 'y'], (): void => this.redo())
    }

    static set(name: string, refObject: Record<string, unknown>): THistory {
        this.position++
        while (this.history[this.position]) {
            this.history.splice(this.position, 1)
        }
        this.history[this.position] = { name, refObject: structuredClone(refObject) }
        return this.history
    }

    static get(name?: string): THistory | THistoryEntry | undefined {
        return name ? this.history.find((pEntry): boolean => pEntry.name === name) : this.history
    }

    private static undo(): void {
        // TODO voir si possible de rendre la selection dans l'historique + histo bloc note + annule reset l'histo au premier + delete merde
        document.body.dispatchEvent(new CustomEvent('historyChanged', { detail: structuredClone(this.movePosition(EHistoryPosition.down)?.refObject) }))
    }

    private static redo(): void {
        document.body.dispatchEvent(new CustomEvent('historyChanged', { detail: structuredClone(this.movePosition(EHistoryPosition.up)?.refObject) }))
    }

    private static movePosition(historyPosition: EHistoryPosition): THistoryEntry | null {
        this.position = historyPosition === EHistoryPosition.up ? this.position + 1 : this.position - 1
        const entry = this.history[this.position]
        if (!entry) {
            this.position = historyPosition === EHistoryPosition.up ? this.position - 1 : this.position + 1
            return null
        }
        return entry
    }
}
