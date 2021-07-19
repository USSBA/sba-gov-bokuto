// See: https://www.freecodecamp.org/news/reusable-html-components-how-to-reuse-a-header-and-footer-on-a-website/
export class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer class="usa-footer usa-footer--slim">
                <div class="grid-container usa-footer__return-to-top">
                    <a href="#">Return to top</a>
                </div>
                <div class="usa-footer__primary-section">
                <div class="usa-footer__primary-container grid-row">
                <div class="usa-footer__logo grid-row grid-gap-2">
                    <div class="grid-col-2">
                        <a href="https://eventadmin.ussba.io/index.html" title="EventsAdmin.gov">
                            <img class="usa-footer__logo-img" src="assets/lockups-isolated.svg" alt="SBA Logo" />
                        </a>
                    </div>

                    <div class="mobile-lg:grid-col-6">
                        <nav class="usa-footer__nav" aria-label="Footer navigation,">
                            <ul class="grid-row grid-gap">
                                <li class="
                                    mobile-lg:grid-col-6
                                    desktop:grid-col-2
                                    usa-footer__primary-content
                                ">
                                    <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/index.html">
                                        Home
                                    </a>
                                </li>

                                <li class="
                                    mobile-lg:grid-col-6
                                    desktop:grid-col-2
                                    usa-footer__primary-content
                                ">
                                    <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/new.html">
                                        Create
                                    </a>
                                </li>

                                <li class="
                                    mobile-lg:grid-col-6
                                    desktop:grid-col-2
                                    usa-footer__primary-content
                                ">
                                    <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/edit.html">
                                        Modify
                                    </a>
                                </li>
                                <li class="
                                    mobile-lg:grid-col-6
                                    desktop:grid-col-2
                                    usa-footer__primary-content                          ">
                                    <a class="usa-footer__primary-link" href="https://eventadmin.ussba.io/approve.html">
                                        Approve
                                    </a>
                                </li>


                                <div class="grid-col-3">
                                    <div class="usa-footer__contact-info grid-col-6">
                                        <a href="tel:1-800-827-5722"> 1-800-827-5722 </a>
                                    </div>
                                    <div class="usa-footer__contact-info grid-col-2">
                                        <a href="mailto:&lt;answerdesk@sba.gov&gt;">
                                            answerdesk@sba.gov
                                        </a>
                                    </div>
                                </div>
                            </ul>
                        </nav>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('eventadmin-footer', Footer);