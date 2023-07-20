import { favEvent } from "../main.js";
import { results } from "./fetch.js";
import { loadResults, loadQuery } from "./storage.js";

// Update status of the search process and results.
export function showSearchStatus(query, status, results) {
    // Change display visibility of status elements
    document
        .querySelector(".container-sort")
        .classList.toggle("visibility-visible", status === "finished");
    document
        .querySelector(".spinner")
        .classList.toggle("display-flex", status === "loading");
    document
        .querySelector(".loader")
        .classList.toggle("display-flex", status === "loading");
    document
        .querySelector(".container-sort")
        .classList.toggle("display-flex", status === "finished");

    // Create and print status message;
    const statusMessage = document.querySelector(".status-message");
    if (status === "loading") {
        statusMessage.textContent = "Loading";
    } else if (status === "finished") {
        statusMessage.textContent =
            results.length > 1
                ? `Showing ${results.length} results for "${query}"`
                : `Showing 1 result for "${query}"`;
    } else if (status === "notFound") {
        statusMessage.textContent = `No results matching "${query}"`;
    }
}

// Print content in DOM
export async function printArtworks(artworks) {
    const fragment = document.createDocumentFragment();
    const template = document.querySelector("#artworks").content;
    for (const artwork of artworks) {
        const clone = template.cloneNode(true);
        clone.querySelector(
            ".detail-link"
        ).href = `detail.html?id=${artwork.id}`;
        clone.querySelector(".image").src = artwork.image;
        clone.querySelector(".image").alt = artwork.title;
        clone
            .querySelector(".favorite-button")
            .setAttribute("data-id", artwork.id);
        if (artwork.isFavorite) {
            clone
                .querySelector(".favorite-button span")
                .classList.add("favorite-clicked");
            clone.querySelector(".favorite-button").title = "Remove favorite";
        }
        clone.querySelector(".title").textContent = artwork.title;
        clone.querySelector(".artist").textContent = artwork.artist;
        clone.querySelector(".date").textContent = artwork.date;
        fragment.appendChild(clone);
    }
    document.querySelector(".container-artworks").appendChild(fragment);
    favEvent(artworks);
}

// print restored array from localStorage
function restoreContent() {
    const restoredResults = loadResults();
    results.push(...restoredResults);
    printArtworks(results);
}

// show previous status
function restoreQuery() {
    if (results.length === 0) {
        showSearchStatus(loadQuery(), "notFound");
    } else {
        showSearchStatus(loadQuery(), "finished", results);
    }
}

// Restore only when there's something in storage

if (localStorage.getItem("savedResults")) {
    restoreContent();
}
if (localStorage.getItem("savedQuery")) {
    restoreQuery();
    // Make filter and sort options visible only when status showed results
}

// Filter results status

export function resetSortingAndFilters() {
    document.querySelector("#highlight-checkbox").checked = false;
    document.querySelector("#sort-select").value = "relevance";
    document.querySelector(".container-artworks").classList.remove("sorting");
}

export function controlHighlightFilter() {
    const container = document.querySelector(".container-checkbox");
    const checkbox = document.querySelector("#highlight-checkbox");
    const highlights = results.filter((result) => result.highlight);
    // Disable checkbox filter when all results are highlights or when there are none.
    if (results.length === highlights.length || highlights.length === 0) {
        checkbox.disabled = true;
        container.classList.add("disabled");
    } else {
        checkbox.disabled = false;
        container.classList.remove("disabled");
    }
}

// Reset filters on start
controlHighlightFilter();
resetSortingAndFilters();

export function showAll() {
    document.querySelector(".container-artworks").replaceChildren();
    printArtworks(results);
    showSearchStatus(loadQuery(), "finished", results);
}

export function showHighlightsOnly() {
    const highlights = results.filter((result) => result.highlight);
    document.querySelector(".container-artworks").replaceChildren();
    printArtworks(highlights);
    showSearchStatus(loadQuery(), "finished", highlights);
}
