// See: https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/
export class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `

<footer>
        <div class="grid-container usa-footer__return-to-top">
            <a href="#">Return to top</a>
        </div>
        <div class="usa-footer__primary-section">
            <div class="usa-footer__primary-container grid-row">
                <div class="mobile-lg:grid-col-8">
                    <nav class="usa-footer__nav" aria-label="Footer navigation,">
                        <ul class="grid-row grid-gap">
                            <li class="
                mobile-lg:grid-col-6
                desktop:grid-col-auto
                usa-footer__primary-content
              ">
                                <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/index.html">
                                    Home
                                </a>
                            </li>

                            <li class="
                mobile-lg:grid-col-6
                desktop:grid-col-auto
                usa-footer__primary-content
              ">
                                <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/new.html">
                                    Create
                                </a>
                            </li>

                            <li class="
                            mobile-lg:grid-col-6
                desktop:grid-col-auto
                usa-footer__primary-content              
                ">
                                <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/edit.html">
                                    Modify
                                </a>
                            </li>
                            <li class="
                            mobile-lg:grid-col-6
                            desktop:grid-col-auto
                            usa-footer__primary-content                          ">
                                <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/approve.html">
                                    Approve
                                </a>
                            </li>

                            </li>
                        </ul>
                    </nav>
                </div>
                <div class="mobile-lg:grid-col-4">
                    <address class="usa-footer__address">
                        <div class="grid-row grid-gap">
                            <div class="grid-col-auto mobile-lg:grid-col-12 desktop:grid-col-auto">
                                <div class="usa-footer__contact-info">
                                    <a href="tel:1-800-827-5722"> 1-800-827-5722 </a>
                                </div>
                            </div>
                            <div class="grid-col-auto mobile-lg:grid-col-12 desktop:grid-col-auto">
                                <div class="usa-footer__contact-info">
                                    <a href="mailto:&lt;answerdesk@sba.gov&gt;">
                                        answerdesk@sba.gov
                                    </a>
                                </div>
                            </div>
                        </div>
                    </address>
                </div>
            </div>
        </div>
        <div class="usa-footer__secondary-section">
            <div class="grid-container">
                <div class="usa-footer__logo grid-row grid-gap-2">
                    <div class="grid-col-auto">
                        <a href="https://eventadmin.ussba.io/index.html" title="EventsAdmin.gov">
                        <img class="usa-footer__logo-img" src="assets/lockups-isolated.svg" alt="SBA Logo" />
                        </a>
                    </div>
                    <div class="grid-col-auto">
                        <a href="https://eventadmin.ussba.io/index.html" title="EventsAdmin.gov">
                        <p class="usa-footer__logo-heading">EventsAdmin.gov</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `;
    }
}

customElements.define('eventadmin-footer', Footer);