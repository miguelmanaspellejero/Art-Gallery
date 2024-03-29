import {
    resetSortingAndFilters,
    showSearchStatus,
    printArtworks,
    showAll,
    showHighlightsOnly,
    controlHighlightFilter,
    restoreContent,
    restoreQuery,
} from "./modules/dom.js";
import { results, fetchIds, fetchData } from "./modules/fetch.js";
import {
    saveResults,
    loadResults,
    saveQuery,
    saveFavorites,
} from "./modules/storage.js";
import { printHeaderAndFooter } from "./modules/templates.js";

await printHeaderAndFooter();

let searchRunning = false; // This avoids new searches from being started until current is finished.

// Search status
export const searchStatus = {
    loading: Symbol(),
    notFound: Symbol(),
    finished: Symbol(),
};

// Load searches from other pages

function getSearchParameters() {
    const searchUrl = new URL(window.location.href);
    const query = searchUrl.searchParams.get("query");
    const filter = searchUrl.searchParams.get("filter");
    if (query) {
        clearContent();
        const filterValue = filter ? filter : ""; // Send empty string if there was no filter selected.
        controlSearchProcess(query, filterValue);
    } else {
        // Restore only when there's something in storage and we don't load from an outside search
        if (localStorage.getItem("savedResults")) {
            restoreContent();
            controlHighlightFilter();
        }
        if (localStorage.getItem("savedQuery")) {
            restoreQuery();
            // Make filter and sort options visible only when status showed results
        }
    }
}

getSearchParameters();

// Back to top button:

window.addEventListener("scroll", () => {
    document
        .querySelector(".back-to-top")
        .classList.toggle("display-flex", window.scrollY > 0);
});

// Click and enter search events
document.querySelector("#search-button").addEventListener("click", startSearch);
document.querySelector("#search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startSearch();
    }
});

// Start search query from input
function startSearch() {
    const query = document.querySelector("#search-input").value.trim();
    const filter = document.querySelector("#search-select").value;
    if (searchRunning === false && query.length > 0) {
        clearContent();
        controlSearchProcess(query, filter);
    }
}

//Control search functions process

async function controlSearchProcess(query, filter) {
    resetSortingAndFilters();
    limitSearches(true);
    showSearchStatus(query, searchStatus.loading);
    const entries = await fetchIds(query, filter);
    // Stop search if no results are found
    if (entries.objectIDs === null) {
        interruptSearch(query);
        return;
    }
    await fetchData(entries);
    // Stop search if no results are in public domain
    if (results.length === 0) {
        interruptSearch(query);
        return;
    }
    await printArtworks(results);
    showSearchStatus(query, searchStatus.finished, results);
    saveQuery(query);
    controlHighlightFilter();
    limitSearches(false);
}

function interruptSearch(query) {
    showSearchStatus(query, searchStatus.notFound);
    saveQuery(query);
    saveResults(results);
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
    document.querySelector("#search-select").disabled = value;
}

// Clear previous loaded content when a new search is made

function clearContent() {
    results.splice(0);
    document.querySelector(".container-artworks").replaceChildren();
}

// Filter by highlights event
document
    .querySelector("#highlight-checkbox")
    .addEventListener("change", (e) => {
        if (e.target.checked) {
            showHighlightsOnly();
        } else {
            showAll();
        }
    });

// Sorting events and function
document.querySelector("#sort-select").addEventListener("change", (e) => {
    const selection = e.target.value;
    const container = document.querySelector(".container-artworks");
    container.classList.toggle("sorting", selection !== "relevance");
    container.replaceChildren();
    document.querySelector("#highlight-checkbox").checked = false;
    if (selection === "relevance") {
        printArtworks(loadResults()); // Saved array with original order
    } else if (selection === "title") {
        printArtworks(
            // Modify original array so highlight filter keeps selected order.
            results.sort((a, b) => {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            })
        );
    } else if (selection === "title-reverse") {
        printArtworks(
            results.sort((a, b) => {
                if (a.title > b.title) {
                    return -1;
                }
                if (a.title < b.title) {
                    return 1;
                }
                return 0;
            })
        );
    } else if (selection === "artist") {
        printArtworks(
            results.sort((a, b) => {
                if (a.artistSort < b.artistSort) {
                    return -1;
                }
                if (a.artistSort > b.artistSort) {
                    return 1;
                }
                return 0;
            })
        );
    } else if (selection === "artist-reverse") {
        printArtworks(
            results.sort((a, b) => {
                if (a.artistSort > b.artistSort) {
                    return -1;
                }
                if (a.artistSort < b.artistSort) {
                    return 1;
                }
                return 0;
            })
        );
    } else if (selection === "date") {
        printArtworks(results.sort((a, b) => a.dateSort - b.dateSort));
    } else if (selection === "date-reverse") {
        printArtworks(results.sort((a, b) => b.dateSort - a.dateSort));
    }
});

export function favEvent(artworks) {
    const favButtons = document.querySelectorAll(".favorite-button");
    for (const favButton of favButtons) {
        favButton.addEventListener("click", (e) => {
            e.target.classList.toggle("favorite-clicked");
            if (e.target.classList.contains("favorite-clicked")) {
                e.target.title = "Remove favorite";
            } else {
                e.target.title = "Add favorite";
            }
            const id = +e.target.parentNode.dataset.id;
            for (const artwork of artworks) {
                if (artwork.id === id) {
                    artwork.isFavorite = !artwork.isFavorite;
                }
            }
            const favList = results.filter((result) => result.isFavorite);
            saveResults(results);
            saveFavorites(favList);
        });
    }
}
