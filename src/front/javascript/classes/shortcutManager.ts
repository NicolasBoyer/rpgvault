import States from '../components/sheet/states.js'

export class ShortcutManager {
    private static keysPress: Record<string, boolean> = {}
    private static shortCuts: Record<string, { element: HTMLElement; keys: string[]; action: (event: KeyboardEvent) => void }> = {}

    static set(pElement: HTMLElement, pKeys: string[], pAction: (event: KeyboardEvent) => void): void {
        this.shortCuts[pKeys.join()] = { element: pElement, keys: pKeys, action: pAction }
        pElement?.addEventListener('keydown', this.keyDown)
        pElement?.addEventListener('keyup', this.keyUp)
    }

    static reset(): void {
        Object.values(this.shortCuts).forEach((pShortcut): void => {
            pShortcut.element.removeEventListener('keydown', this.keyDown)
            pShortcut.element.removeEventListener('keyup', this.keyUp)
        })
    }

    private static keyDown(pEvent: KeyboardEvent): void {
        if (Object.keys(ShortcutManager.shortCuts).some((pKey): boolean => pKey.split(',').includes(pEvent.key)) && States.editMode && !ShortcutManager.keysPress[pEvent.key]) {
            pEvent.preventDefault()
            ShortcutManager.keysPress[pEvent.key] = true
            const shortcut =
                ShortcutManager.shortCuts[
                    Object.keys(ShortcutManager.shortCuts).find(
                        (pKey): boolean =>
                            pKey.split(',').sort().join() ===
                            Object.keys(ShortcutManager.keysPress)
                                .filter((pKey): boolean => ShortcutManager.keysPress[pKey])
                                .map((pKey): string => pKey)
                                .sort()
                                .join()
                    ) as string
                ]
            if (!shortcut) return
            shortcut.action(pEvent)
        }
    }

    private static keyUp(pEvent: KeyboardEvent): void {
        ShortcutManager.keysPress[pEvent.key] = false
    }
}
