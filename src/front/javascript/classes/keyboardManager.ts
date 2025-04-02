export class KeyboardManager {
    static isShiftDown: boolean = false
    static isCtrlDown: boolean = false

    constructor() {
        document.body.addEventListener('keydown', KeyboardManager.keyDown)
        document.body.addEventListener('keyup', KeyboardManager.keyUp)
    }

    static reset(): void {
        document.body.removeEventListener('keydown', this.keyDown)
        document.body.removeEventListener('keyup', this.keyUp)
    }

    private static keyDown(pEvent: KeyboardEvent): void {
        KeyboardManager.isShiftDown = pEvent.shiftKey
        KeyboardManager.isCtrlDown = pEvent.ctrlKey
    }

    private static keyUp(pEvent: KeyboardEvent): void {
        KeyboardManager.isShiftDown = pEvent.shiftKey
        KeyboardManager.isCtrlDown = pEvent.ctrlKey
    }
}
