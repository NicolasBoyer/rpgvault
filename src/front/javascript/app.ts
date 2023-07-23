import {Utils} from './classes/utils.js'
import Loader from './components/loader.js'
import Sheet from './components/sheet/sheet.js'
import Confirm from './components/confirm.js'
import Login from './components/login.js'
import Label from './components/label.js'
import Home from './components/home.js'
import Link from './components/link.js'

class App {
    constructor() {
        Utils.helpers()
        // this.wakeLock()
        // Websocket.init()
        if (location.href.charAt(location.href.length - 1) === '/') history.replaceState({}, '', location.href.replace(/\/$/, ''))
    }

    // private async wakeLock(): Promise<void> {
    //     let wakeLock: WakeLockSentinel | null = null
    //     const requestWakeLock = async (): Promise<void> => {
    //         try {
    //             wakeLock = await navigator.wakeLock.request()
    //         } catch (err: unknown) {
    //             if (err instanceof Error) {
    //                 console.error(`${err.name}, ${err.message}`)
    //             }
    //         }
    //     }
    //     document.addEventListener('visibilitychange', async (): Promise<void> => {
    //         if (wakeLock !== null && document.visibilityState === 'movable') {
    //             await requestWakeLock()
    //         }
    //     })
    //     await requestWakeLock()
    // }
}

new App()
customElements.define('fs-loader', Loader)
// customElements.define('fs-header', Header)
// customElements.define('fs-toast', Toast)
customElements.define('fs-confirm', Confirm)
customElements.define('fs-home', Home)
customElements.define('fs-sheet', Sheet)
customElements.define('fs-label', Label)
// customElements.define('fs-propose', Propose)
// customElements.define('fs-recipes', Recipes)
// customElements.define('fs-recipe', Recipe)
// customElements.define('fs-lists', Lists)
// customElements.define('fs-ingredients', Ingredients)
// customElements.define('fs-categories', Categories)
customElements.define('fs-login', Login)
// customElements.define('fs-loading-block', LoadingBlock)
// customElements.define('fs-animated-section', AnimatedSection)
// customElements.define('fs-dishes', Dishes)
customElements.define('fs-link', Link)
// customElements.define('fs-menu', Menu)
