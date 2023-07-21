import { printHeaderAndFooter } from "./modules/templates.js";
import { loadFavorites } from "./modules/storage.js";
import sendSearch from "./modules/search.js";

await printHeaderAndFooter();
document.querySelector(".link-favorites").classList.add("active-link"); // Style link to show current page status

// Click and enter search events
document.querySelector("#search-button").addEventListener("click", sendSearch);
document.querySelector("#search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendSearch();
    }
});

if (loadFavorites().length > 0) {
    printFavorites();
    printFavStatus();
} else {
    printNoFavoritesMessage();
}

function printFavorites() {
    const favorites = loadFavorites();
    const favFragment = document.createDocumentFragment();
    const template = document.querySelector("#favorite-artworks").content;
    const slideFragment = document.createDocumentFragment();
    for (const favorite of favorites) {
        // Print images from template
        const clone = template.cloneNode(true);
        const favImage = clone.querySelector(".favorite-image");
        favImage.id = favorite.id;
        favImage.src = favorite.imageLarge;
        favImage.alt = favorite.title;
        favImage.addEventListener("click", () => {
            window.location.href = `detail.html?id=${favorite.id}`;
        });
        favFragment.appendChild(clone);
        // Create links with ids to navigate the slider
        const slideLink = document.createElement("a");
        slideLink.href = "#" + favorite.id;
        slideFragment.append(slideLink);
    }
    document.querySelector(".slider-nav").appendChild(slideFragment);
    document.querySelector(".container-favorites").appendChild(favFragment);
}

function printFavStatus() {
    document.querySelector(".status-message").textContent = `Showing ${
        loadFavorites().length
    } favorites in your collection`;
}

function printNoFavoritesMessage() {
    document
        .querySelector(".no-favorites-message")
        .classList.add("display-flex");
}
