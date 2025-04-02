import '@picocss/pico'
import '@picocss/pico/css/pico.indigo.css'
import '../styles/variables.css'
import '../styles/main.css'
import { Utils } from './classes/utils.js'
import Loader from './components/loader.js'
import Sheet from './components/sheet/sheet.js'
import Confirm from './components/confirm.js'
import Login from './components/login.js'
import Label from './components/label.js'
import Sheets from './components/sheets.js'
import Link from './components/link.js'
import ResetPassword from './components/resetPassword.js'
import LoggedUser from './components/loggedUser.js'
import Register from './components/register.js'
import Header from './components/header.js'
import Home from './components/home.js'
import Menu from './components/menu.js'
import Error404 from './components/404.js'
import Toast from './components/toast.js'
import { KeyboardManager } from './classes/keyboardManager.js'

class App {
    constructor() {
        Utils.helpers()
        new KeyboardManager()
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
customElements.define('rv-loader', Loader)
customElements.define('rv-header', Header)
customElements.define('rv-home', Home)
customElements.define('rv-toast', Toast)
customElements.define('rv-confirm', Confirm)
customElements.define('rv-sheets', Sheets)
customElements.define('rv-sheet', Sheet)
customElements.define('rv-label', Label)
// customElements.define('rv-propose', Propose)
// customElements.define('rv-recipes', Recipes)
// customElements.define('rv-recipe', Recipe)
// customElements.define('rv-lists', Lists)
// customElements.define('rv-ingredients', Ingredients)
// customElements.define('rv-categories', Categories)
customElements.define('rv-login', Login)
// customElements.define('rv-loading-block', LoadingBlock)
// customElements.define('rv-animated-section', AnimatedSection)
// customElements.define('rv-dishes', Dishes)
customElements.define('rv-link', Link)
customElements.define('rv-logged-user', LoggedUser)
customElements.define('rv-reset-password', ResetPassword)
customElements.define('rv-signup', Register)
customElements.define('rv-menu', Menu)
customElements.define('rv-error-404', Error404)
