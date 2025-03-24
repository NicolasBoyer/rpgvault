import '../../styles/loggedUser.css'
import { html, render } from 'lit'
import { User } from '../classes/user.js'

export default class LoggedUser extends HTMLElement {
    get list(): boolean {
        return this.hasAttribute('list')
    }

    async connectedCallback(): Promise<void> {
        await User.getCurrentUser()
        this.render()
        document.body.addEventListener('currentUserUpdated', (): void => this.render())
    }

    private render(): void {
        const list = html`
            <ul>
                <li>
                    <button @click="${(): void => User.getAccount()}" role="link" href="#">${User.currentUser?.firstName} ${User.currentUser?.lastName}</button>
                </li>
                <li>
                    <button class="logout" @click="${(): Promise<void> => User.logout()}" role="link">Se déconnecter</button>
                </li>
            </ul>
        `
        if (User.currentUser) {
            if (this.list) {
                render(list, this)
            } else {
                render(
                    html` <details class="dropdown">
                        <summary>
                            <svg>
                                <use href="#user"></use>
                            </svg>
                        </summary>
                        ${list}
                    </details>`,
                    this
                )
            }
        } else {
            render(
                html` <rv-link role="button" class="signup" href="/register">
                        <svg class="signup"><use href="#signup"></use></svg><span>S'enregistrer</span>
                    </rv-link>
                    <rv-link role="button" href="/login">
                        <svg class="login"><use href="#login"></use></svg><span>Se connecter</span>
                    </rv-link>`,
                this
            )
        }
    }
}
