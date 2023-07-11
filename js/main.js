import { showSearchStatus, printArtworks } from "./modules/dom.js";
import {
    results,
    fetchIds,
    fetchData,
    saveResults,
    loadResults,
    saveQueryAndStatus,
    loadQueryAndStatus,
} from "./modules/fetch.js";

let searchRunning = false; // This avoids new searches from being started until current is finished.

// Click and enter search events
document.querySelector("#search-button").addEventListener("click", startSearch);
document.querySelector("#search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startSearch();
    }
});

// Start search query from input
function startSearch() {
    const query = document.querySelector("#search-input").value;
    if (searchRunning === false && query.length > 0) {
        clearContent();
        controlSearchProcess(query);
    }
}

//Control search functions process

async function controlSearchProcess(query) {
    limitSearches(true);
    showSearchStatus(query, "loading");
    const entries = await fetchIds(query);
    if (entries.objectIDs === null) {
        showSearchStatus(query, "notFound");
        saveQueryAndStatus();
        saveResults();
        limitSearches(false);
        return;
    }
    await fetchData(entries);
    await printArtworks(results);
    showSearchStatus(query, "finished");
    saveQueryAndStatus();
    limitSearches(false);
}

// Avoid new searches until current search process has finished.
function limitSearches(value) {
    searchRunning = value;
    document
        .querySelector(".container-search")
        .classList.toggle("disabled", searchRunning);
    document.querySelector("#search-button").disabled = value;
    document.querySelector("#search-input").disabled = value;
}

// Clear previous loaded content when a new search is made

function clearContent() {
    results.splice(0);
    document.querySelector(".container-artworks").replaceChildren();
}

// print restored array from localStorage
function restoreContent() {
    printArtworks(loadResults());
    // results.push(loadResults());
}

// show previous status
function restoreQueryAndStatus() {
    document.querySelector(".status-message").textContent =
        loadQueryAndStatus();
}

// Call them only from other pages when turning back?
restoreContent();
restoreQueryAndStatus();

export function favEvent(artworks) {
    const favList = [];
    const favButtons = document.querySelectorAll(".favorite-button");
    for (const favButton of favButtons) {
        favButton.addEventListener("click", (e) => {
            e.target.classList.toggle("favorite-clicked");
            if (e.target.classList.contains("favorite-clicked")) {
                e.target.title = "Remove favorite";
            } else {
                e.target.title = "Add favorite";
            }
            const id = +e.target.parentNode.getAttribute("data-id");
            for (const artwork of artworks) {
                if (artwork.id === id) {
                    favList.push(artwork);
                }
            }
            console.log(favList);
        });
    }
}
