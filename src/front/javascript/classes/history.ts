import { THistory, THistoryEntry } from '../types.js'
import { ShortcutManager } from './shortcutManager.js'
import { ElementManager } from './elementManager.js'

export class History {
    private static position: number = 0
    private static savedPosition: number = 0
    private static undoQueue: THistory
    private static redoQueue: THistory

    static init(): void {
        this.undoQueue = []
        this.redoQueue = []
        ShortcutManager.set(document.body, ['Control', 'z'], (): void => this.undo())
        ShortcutManager.set(document.body, ['Control', 'y'], (): void => this.redo())
    }

    static execute(name: string, title: string, action: (...args: unknown[]) => void, args: unknown[], pastAction: (...args: unknown[]) => void, pastArgs: unknown[]): void {
        action(...args)
        this.resetQueue(this.redoQueue, { name, title, action, args })
        this.resetQueue(this.undoQueue, { name, title, action: pastAction, args: pastArgs })
        this.position++
    }

    static get(name?: string): THistory | THistoryEntry | undefined {
        return name ? this.undoQueue.find((pEntry): boolean => pEntry.name === name) : this.undoQueue
    }

    static resetSavedPosition(pPosition: number | null = null): void {
        this.savedPosition = pPosition || this.position
    }

    static reset(): void {
        const position = this.position < this.savedPosition ? this.position : this.savedPosition
        for (let i = position; i < (<THistory>this.get()).length; i++) {
            if (this.position < this.savedPosition) this.redo()
            else this.undo()
        }
    }

    private static resetQueue(history: THistory, entry: THistoryEntry): void {
        while (history[this.position]) {
            history.splice(this.position, 1)
        }
        history[this.position] = entry
    }

    private static undo(): void {
        if (this.position === 0) return
        this.position--
        const entry = this.undoQueue[this.position]
        entry.action(...entry.args)
        ElementManager.select()
    }

    private static redo(): void {
        if (this.position >= this.redoQueue.length) return
        const entry = this.redoQueue[this.position]
        entry.action(...entry.args)
        this.position++
    }

    // TODO histo bloc note + delete merde + bloc histo + test annule après un save IMPORTANT
}
