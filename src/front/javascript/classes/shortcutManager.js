export class ShortcutManager {
	static #keysPress = {}
	static #shortCuts = {}

	static set (pElement, pKeys, pAction) {
		this.#shortCuts[pKeys.join()] = { element: pElement, keys: pKeys, action: pAction }
		pElement?.addEventListener('keydown', this.#keyDown)
		pElement?.addEventListener('keyup', this.#keyUp)
	}

	static #keyDown (pEvent) {
		pEvent.preventDefault()
		ShortcutManager.#keysPress[pEvent.key] = true
	}

	static #keyUp (pEvent) {
		const shortcut = ShortcutManager.#shortCuts[Object.keys(ShortcutManager.#keysPress).filter((pKey) => ShortcutManager.#keysPress[pKey]).map((pKey) => pKey).join()]
		ShortcutManager.#keysPress[pEvent.key] = false
		if (!shortcut) return
		shortcut.action(pEvent)
	}
}
