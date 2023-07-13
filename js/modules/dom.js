import { favEvent } from "../main.js";
import { results } from "./fetch.js";
import { loadResults, loadQueryAndStatus } from "./storage.js";

// Update status of the search process and results.
export function showSearchStatus(query, status) {
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
        statusMessage.textContent = `Showing ${results.length} results for "${query}"`;
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
function restoreQueryAndStatus() {
    document.querySelector(".status-message").textContent =
        loadQueryAndStatus();
}

// Restore only when there's something in storage

if (localStorage.getItem("savedResults")) {
    restoreContent();
}
if (localStorage.getItem("statusMessage")) {
    restoreQueryAndStatus();
    // Make filter and sort options visible only when status showed results
    if (localStorage.getItem("statusMessage").startsWith("Showing")) {
        document
            .querySelector(".container-sort")
            .classList.add("visibility-visible");
    }
}
