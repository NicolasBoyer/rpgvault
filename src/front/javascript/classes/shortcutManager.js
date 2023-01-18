import States from '../components/sheet/states.js'

export class ShortcutManager {
	static #keysPress = {}
	static #shortCuts = {}

	static set (pElement, pKeys, pAction) {
		this.#shortCuts[pKeys.join()] = { element: pElement, keys: pKeys, action: pAction }
		pElement?.addEventListener('keydown', this.#keyDown)
		pElement?.addEventListener('keyup', this.#keyUp)
	}

	static #keyDown (pEvent) {
		if (Object.keys(ShortcutManager.#shortCuts).some((pKey) => pKey.split(',').includes(pEvent.key)) && States.editMode) {
			pEvent.preventDefault()
			ShortcutManager.#keysPress[pEvent.key] = true
			const shortcut = ShortcutManager.#shortCuts[Object.keys(ShortcutManager.#shortCuts).find((pKey) => pKey.split(',').sort().join() === Object.keys(ShortcutManager.#keysPress).filter((pKey) => ShortcutManager.#keysPress[pKey]).map((pKey) => pKey).sort().join())]
			if (!shortcut) return
			shortcut.action(pEvent)
		}
	}

	static #keyUp (pEvent) {
		ShortcutManager.#keysPress[pEvent.key] = false
	}
}
