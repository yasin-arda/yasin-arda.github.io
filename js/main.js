const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-navigation");
const header = document.querySelector(".site-header");
const headerInner = document.querySelector(".header-inner");

const mobileNavigationQuery = window.matchMedia("(max-width: 1120px)");

const languageSwitch = navigation?.querySelector(".language-switch-link") || null;
let languageSwitchPlaceholder = null;

if (languageSwitch && navigation && headerInner && menuButton) {
    languageSwitchPlaceholder = document.createComment("language-switch-position");
    languageSwitch.before(languageSwitchPlaceholder);
}


/* =========================================================
   RESPONSIVER HEADER
   ========================================================= */

function syncLanguageSwitchPosition() {
    if (!languageSwitch || !languageSwitchPlaceholder || !headerInner || !menuButton) {
        return;
    }

    if (mobileNavigationQuery.matches) {
        /*
           Auf Laptop / Tablet / Mobile bleibt DE bzw. EN immer
           sichtbar und sitzt direkt vor dem Menü-Button.
        */
        if (languageSwitch.parentElement !== headerInner) {
            headerInner.insertBefore(languageSwitch, menuButton);
        }
    } else {
        /*
           Auf großem Desktop gehört der Sprachlink wieder
           an seine ursprüngliche Stelle in die Navigation.
        */
        if (languageSwitch.parentElement !== navigation) {
            languageSwitchPlaceholder.after(languageSwitch);
        }
    }
}


/* =========================================================
   MOBILE HAUPTNAVIGATION
   ========================================================= */

function closeProjectDropdowns() {
    document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
        dropdown.classList.remove("is-open");

        const trigger = dropdown.querySelector(".nav-dropdown-trigger");
        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
        }
    });
}


function closeMainNavigation() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    closeProjectDropdowns();
}


if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        const willOpen = !isOpen;

        menuButton.setAttribute("aria-expanded", String(willOpen));
        navigation.classList.toggle("is-open", willOpen);

        if (!willOpen) {
            closeProjectDropdowns();
        }
    });


    /*
       Auf Desktop bleibt "Projekte" ein normaler Link mit Hover-Dropdown.
       Auf kleinen Viewports wird derselbe Link zum Auf-/Zuklappen genutzt.
       Die Projektübersicht bleibt über "Alle Projekte ansehen" erreichbar.
    */
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {

        const trigger = dropdown.querySelector(".nav-dropdown-trigger");

        if (!trigger) return;

        trigger.setAttribute("aria-expanded", "false");

        trigger.addEventListener("click", (event) => {

            if (!mobileNavigationQuery.matches) {
                return;
            }

            event.preventDefault();

            const willOpen = !dropdown.classList.contains("is-open");

            closeProjectDropdowns();

            dropdown.classList.toggle("is-open", willOpen);
            trigger.setAttribute("aria-expanded", String(willOpen));
        });
    });


    navigation.querySelectorAll("a").forEach((link) => {

        if (link.classList.contains("nav-dropdown-trigger")) {
            return;
        }

        link.addEventListener("click", () => {
            if (mobileNavigationQuery.matches) {
                closeMainNavigation();
            }
        });
    });
}


/* ESC schließt Menü und Projekt-Untermenü */
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMainNavigation();
    }
});


/*
   Beim Wechsel zwischen Desktop und Mobile wird ein eventuell
   geöffnetes Mobilmenü sauber zurückgesetzt.
*/
function handleNavigationBreakpointChange() {
    syncLanguageSwitchPosition();

    if (!mobileNavigationQuery.matches) {
        closeMainNavigation();
    }
}

syncLanguageSwitchPosition();

if (typeof mobileNavigationQuery.addEventListener === "function") {
    mobileNavigationQuery.addEventListener("change", handleNavigationBreakpointChange);
} else if (typeof mobileNavigationQuery.addListener === "function") {
    mobileNavigationQuery.addListener(handleNavigationBreakpointChange);
}


/* =========================================================
   STICKY HEADER
   ========================================================= */

function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });


/* =========================================================
   REVEAL-ANIMATIONEN
   ========================================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.14 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}
