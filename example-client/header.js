// See: https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/
export class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <a class="usa-skipnav" href="#main-content">Skip to main content</a>
        <section class="usa-banner" aria-label="Official government website">
            <div class="usa-accordion">
                <header class="usa-banner__header">
                    <div class="usa-banner__inner">
                        <div class="grid-col-auto">
                            <img class="usa-banner__header-flag" src="assets/img/us_flag_small.png" alt="U.S. flag" />
                        </div>
                        <div class="grid-col-fill tablet:grid-col-auto">
                            <p class="usa-banner__header-text">
                                An official website of the United States government
                            </p>
                            <p class="usa-banner__header-action" aria-hidden="true">
                                Here’s how you know
                            </p>
                        </div>
                        <button class="usa-accordion__button usa-banner__button" aria-expanded="false"
                            aria-controls="gov-banner">
                            <span class="usa-banner__button-text">Here’s how you know</span>
                        </button>
                    </div>
                </header>
                <div class="usa-banner__content usa-accordion__content" id="gov-banner">
                    <div class="grid-row grid-gap-lg">
                        <div class="usa-banner__guidance tablet:grid-col-6">
                            <img class="usa-banner__icon usa-media-block__img" src="assets/img/icon-dot-gov.svg" role="img"
                                alt="" aria-hidden="true" />
                            <div class="usa-media-block__body">
                                <p>
                                    <strong> Official websites use .gov </strong>
                                    <br />
                                    A <strong>.gov</strong> website belongs to an official government
                                    organization in the United States.
                                </p>
                            </div>
                        </div>
                        <div class="usa-banner__guidance tablet:grid-col-6">
                            <img class="usa-banner__icon usa-media-block__img" src="assets/img/icon-https.svg" role="img"
                                alt="" aria-hidden="true" />
                            <div class="usa-media-block__body">
                                <p>
                                    <strong> Secure .gov websites use HTTPS </strong>
                                    <br />
                                    A <strong>lock</strong> (
                                    <span class="icon-lock"><svg xmlns="http://www.w3.org/2000/svg" width="52" height="64"
                                            viewBox="0 0 52 64" class="usa-banner__lock-image" role="img"
                                            aria-labelledby="banner-lock-title banner-lock-description" focusable="false">
                                            <title id="banner-lock-title">Lock</title>
                                            <desc id="banner-lock-description">A locked padlock</desc>
                                            <path fill="#000000" fill-rule="evenodd"
                                                d="M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26 0zm0 8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6.075-4.925-11-11-11z" />
                                        </svg></span>
                                    ) or <strong>https://</strong> means you’ve safely connected to
                                    the .gov website. Share sensitive information only on official,
                                    secure websites.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    
        <!--Logo and Title-->
        <div class="usa-overlay"></div>
        <header class="usa-header usa-header--extended">
            <div class="usa-navbar">
                <div class="usa-logo" id="extended-mega-logo">
                    <em class="usa-logo__text">
    
                        <a href="https://eventadmin.ussba.io/index.html" title="EventsAdmin.gov">
                            <img alt="SBA Logo" src="assets/img/ussba-logo-isolated.svg">
                        </a>
    
                        <a href="https://eventadmin.ussba.io/index.html" title="EventsAdmin.gov">
                            Events Administration
                        </a>
    
                    </em>
                </div>
                <button class="usa-menu-btn">Menu</button>
            </div>
            <nav aria-label="Primary navigation" class="usa-nav">
                <div class="usa-nav__inner">
                    <button class="usa-nav__close">
                        <img src="assets/img/usa-icons/close.svg" role="img" alt="Close" />
                    </button>
                    <!--Main Menu-->
                    <ul class="usa-nav__primary usa-accordion">
                        <li class="usa-nav__primary-item">
                            <a href="https://eventadmin.ussba.io/index.html" class="usa-nav__link">
                                <span> Home </span>
                            </a>
                        </li>
                        <li class="usa-nav__primary-item">
                            <a href="https://eventadmin.ussba.io/new.html" class="usa-nav__link">
                                <span> Create </span>
                            </a>
                        </li>
                        <li class="usa-nav__primary-item">
                            <a href="https://eventadmin.ussba.io/edit.html" class="usa-nav__link">
                                <span> Modify </span>
                            </a>
                        </li>
                        <li class="usa-nav__primary-item">
                            <a href="https://eventadmin.ussba.io/approve.html" class="usa-nav__link">
                                <span> Review </span>
                            </a>
                        </li>
    
                    </ul>
    
                    <!--Login/Logout Links-->
                    <div class="usa-nav__secondary">
                        <ul class="usa-nav__secondary-links">
                            <li class="usa-nav__secondary-item">
                                <a
                                    href="https://auth.ussba.io/login?client_id=2ua8n97ki6n13db5kp1pfcbpk2&response_type=code&scope=email+openid&redirect_uri=https://eventadmin.ussba.io/api/signin">Login</a>
                            </li>
                            <li class="usa-nav__secondary-item">
                                <a href="https://eventadmin.ussba.io/profile.html">Profile</a>
                            </li>
                        </ul>
                    </div>
            </nav>
            </div>
        </header>
        `;
    }
}

customElements.define('eventadmin-header', Header);