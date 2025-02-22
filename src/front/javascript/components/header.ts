import { html, render } from 'lit'

export default class Header extends HTMLElement {
    get src(): string | null {
        return this.getAttribute('src')
    }

    get alt(): string | null {
        return this.getAttribute('alt')
    }

    connectedCallback(): void {
        if (!document.body.classList.contains('home')) {
            return
        }
        this.render()
    }

    private render(): void {
        render(
            html`
                <div>
                    <div class="mainTitle">RPGVault</div>
                    <div class="tagline">Déverrouillez, Créez, Conquérez. Votre boîte à outils ultime pour des aventures épiques.</div>
                    <div class="image">
                        <img alt="${this.alt}" src="${this.src}" />
                    </div>
                </div>
            `,
            this
        )
    }
}
