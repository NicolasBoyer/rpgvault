import { html, render } from 'lit'
import { Utils } from '../classes/utils.js'

export default class Link extends HTMLElement {
    get href(): string | null {
        return this.getAttribute('href')
    }

    set href(pValue) {
        this.setAttribute('open', <string>pValue)
    }

    async connectedCallback(): Promise<void> {
        const children = Array.from(this.children)
        this.render()
        this.querySelector('slot')?.replaceWith(...children)
        const fragment = await Utils.getFragmentHtml(<string>this.href)
        this.addEventListener('click', (): void => {
            history.pushState({}, '', this.href)
            REPLACEZONE(fragment)
        })
    }

    private render(): void {
        render(html` <slot></slot> `, this)
    }
}

const REPLACEZONE = (pFragment: Record<string, string>): void => {
    const replacedZone = <HTMLElement>document.querySelector('[data-replaced-zone]')
    const headerBlock = <HTMLElement>document.querySelector('body > rv-header')
    const header = document.createRange().createContextualFragment(pFragment.header)
    const footerBlock = <HTMLElement>document.querySelector('body > footer')
    const footer = document.createRange().createContextualFragment(pFragment.footer)
    if (headerBlock) headerBlock.replaceWith(header)
    else replacedZone.before(header)
    replacedZone.replaceChildren(document.createRange().createContextualFragment(pFragment.text))
    if (footerBlock) footerBlock.replaceWith(footer)
    else replacedZone.after(footer)
    document.body.className = pFragment.class
    document.documentElement.setAttribute('data-theme', pFragment.theme)
    const title = document.querySelector('[data-replaced-title]')
    if (title) title.innerHTML = pFragment.title
}

window.addEventListener('popstate', async (): Promise<void> => REPLACEZONE(await Utils.getFragmentHtml(location.pathname)))
