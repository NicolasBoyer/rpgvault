import '../../styles/404.css'
import { html, render } from 'lit'

type TCommands = {
    help: string
    exit: string
    report: string
    commands: string
    clear: string
}

enum TWindowSize {
    max,
    min,
    re,
}

export default class Error404 extends HTMLElement {
    private BLACKLISTED_KEY = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Alt', 'CapsLock', 'Control', 'Shift', 'Tab', 'Escape', 'NumLock']
    private COMMANDS: TCommands = {
        help: 'La page que vous souhaitez visiter n\'existe pas, ou elle a peut-être été supprimée, ou une mauvaise adresse a été saisie. Pour voir les commandes, entrez le mot <span class="red"> commands</span>',
        exit: '',
        report: "<span class='green'>\n" + 'Ce rapport de page a été envoyé avec succès au support.</span>',
        commands: 'Liste des commandes : <span class="red"> help</span>, <span class="red"> report</span>, <span class="red"> exit</span>, <span class="red"> clear</span>\n',
        clear: '',
    }
    private keyboard
    private str = ''

    constructor() {
        super()
        this.render()
        this.keyboard = this.querySelector('#Keyboard') as HTMLElement
        this.keyboard.focus()
        document.addEventListener('keydown', (event: KeyboardEvent): void => this.evalKey(event))
    }

    private interact(event: MouseEvent, windowSize: TWindowSize): void {
        event.preventDefault()
        switch (windowSize) {
            case TWindowSize.max:
                if (!document.body.classList.contains('max')) document.body.classList.add('max')
                else document.body.classList.remove('max')
                break
            case TWindowSize.min:
                if (document.body.classList.contains('max')) document.body.classList.add('min')
                else document.body.classList.add('min')
                break
            case TWindowSize.re:
                document.body.classList.remove('min')
                break
        }
    }

    private execute(input: string): void {
        const terminalOutput = this.querySelector('#code') as HTMLElement
        const terminal = this.querySelector('#Terminal') as HTMLElement
        let output
        if (input.length === 0) {
            return
        }
        if (!Object.keys(this.COMMANDS).includes(input)) {
            output = "<p>La commande saisie n'est pas correcte</p>"
        } else if (input === 'clear') {
            terminalOutput.innerHTML = ''
            return
        } else if (input === 'close' || input === 'exit') {
            location.href = '/'
            return
        } else if (input === 'report') {
            // window.open('mailto:test@example.com?subject=subject&body=body')
            terminalOutput.innerHTML = `${terminalOutput.innerHTML}<p>${this.COMMANDS[input]}</p>`
            return
        } else {
            output = this.COMMANDS[input as keyof TCommands]
        }
        terminalOutput.innerHTML = `${terminalOutput.innerHTML}<p class='out_code'>${output}</p>`
        terminal.scrollTop = terminalOutput.scrollHeight
    }

    private evalKey(event: KeyboardEvent): void {
        const userInput = this.querySelector('#userInput') as HTMLElement
        const currentKey = event.key
        this.keyboard.focus()
        this.keyboard.innerHTML = (event.target as HTMLInputElement).value
        if (this.BLACKLISTED_KEY.includes(currentKey)) {
            return
        }
        if (event.key === 'Enter') {
            this.execute(userInput.innerHTML)
            userInput.innerHTML = ''
            ;(event.target as HTMLInputElement).value = ''
            this.str = ''
        } else if (event.key === 'Backspace') {
            userInput.innerHTML = userInput.innerHTML.slice(0, userInput.innerHTML.length - 1)
            this.str = this.str.slice(0, this.str.length - 1)
        } else {
            if (screen.width < 991) this.str = currentKey
            else this.str += currentKey
            event.preventDefault()
            userInput.innerHTML = this.str
        }
    }

    private render(): void {
        render(
            html`
                <section>
                    <header>
                        <div><p>Terminal</p></div>
                        <div><p class="title_404">404</p></div>
                        <div class="menu">
                            <button id="min" @click="${(event: PointerEvent): void => this.interact(event, TWindowSize.min)}"></button>
                            <button id="max" @click="${(event: PointerEvent): void => this.interact(event, TWindowSize.max)}"></button>
                            <button
                                id="close"
                                @click="${(): void => {
                                    location.href = '/'
                                }}"
                            ></button>
                        </div>
                    </header>
                    <div class="Terminal_body" id="Terminal">
                        <p>Oops! Page non trouvée</p>
                        <br />
                        <p>Entrez <span class="red">help</span> pour obtenir de l'aide</p>
                        <br />
                        <div class="Terminal_code">
                            <div class="Terminal_line">
                                <div class="code" id="code"></div>
                                <span class="arrow">→</span><span class="user-input" id="userInput"></span> <label for="Keyboard"></label><input type="text" id="Keyboard" class="keyboard" />
                            </div>
                        </div>
                    </div>
                </section>

                <aside class="min_app" id="min_app">
                    <button @click="${(event: PointerEvent): void => this.interact(event, TWindowSize.re)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40">
                            <path fill="#CFD8DC" d="M41,6H7C6.4,6,6,6.4,6,7v35h36V7C42,6.4,41.6,6,41,6z" />
                            <path fill="#263238" d="M8 13H40V40H8z" />
                            <path fill="#90A4AE" d="M13.5 8A1.5 1.5 0 1 0 13.5 11 1.5 1.5 0 1 0 13.5 8zM9.5 8A1.5 1.5 0 1 0 9.5 11 1.5 1.5 0 1 0 9.5 8z" />
                            <g>
                                <path fill="#18FFFF" d="M18.5 26.5l-3.5-2V22l6 3.4v2.1L15 31v-2.5L18.5 26.5zM23 29H33V31H23z" />
                            </g>
                        </svg>
                    </button>
                </aside>
            `,
            this
        )
    }
}
