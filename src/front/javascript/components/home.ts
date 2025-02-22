import { html, render, TemplateResult } from 'lit'

export default class Home extends HTMLElement {
    private datas = [
        {
            title: 'Forge de Personnage',
            tagline: 'Concevez, gérez et personnalisez vos héros',
            uri: '/sheets',
            illustration: 'assets/characterSheet.jpg',
            abstract: 'Créez et personnalisez votre fiche de personnage unique avec une multitude d’attributs, de compétences et d’apparences.',
        },
        {
            title: 'Bibliothèque du Savoir',
            tagline: 'Un univers visuel à portée de main',
            uri: '/library',
            illustration: 'assets/library.jpg',
            abstract: 'Stockez et classez vos illustrations, cartes et PNJ. Affichez vos visuels dans une visionneuse immersive pour enrichir vos parties.',
        },
        {
            title: 'Planificateur de Quêtes',
            tagline: 'Maîtrisez l’histoire, structurez vos aventures',
            uri: '/questPlanner',
            illustration: 'assets/questPlanner.jpg',
            abstract: 'Structurez vos intrigues avec une arborescence narrative, des notes dynamiques et une timeline interactive.',
        },
        {
            title: 'Hall des Héros',
            tagline: 'Jouez ensemble, partagez vos mondes',
            uri: '/hall',
            illustration: 'assets/hall.jpg',
            abstract: 'Créez des espaces privés pour vos groupes de joueurs, définissez les permissions et échangez facilement vos notes, scénarios et fiches.',
        },
        {
            title: 'Pacte des Voyageurs',
            tagline: 'Un serment sacré, un engagement pour l’aventure',
            uri: '/pact',
            illustration: 'assets/pact.jpg',
            abstract: 'Avant le voyage, les compagnons scellent un pacte sacré scelle les règles et promesses pour une quête harmonieuse.',
        },
    ]

    constructor() {
        super()
        this.render()
    }

    connectedCallback(): void {}

    private render(): void {
        render(
            html`
                <ul>
                    ${this.datas.map(
                        (card): TemplateResult =>
                            html`<li>
                                <a href="${card.uri}">
                                    <article>
                                        <div class="illustration">
                                            <img src="${card.illustration}" alt="" />
                                        </div>
                                        <div class="title">${card.title}</div>
                                        <div class="tagline">${card.tagline}</div>
                                        <div class="abstract">${card.abstract}</div>
                                        <div class="arrow">
                                            <svg>
                                                <use href="#arrow"></use>
                                            </svg>
                                        </div>
                                    </article>
                                </a>
                            </li>`
                    )}
                </ul>
            `,
            this
        )
    }
}
