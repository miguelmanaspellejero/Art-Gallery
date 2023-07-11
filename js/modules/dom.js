import { favEvent } from "../main.js";
import { results } from "./fetch.js";

// Update status of the search process and results.
export function showSearchStatus(query, status) {
    const statusMessage = document.querySelector(".status-message");
    document
        .querySelector(".spinner")
        .classList.toggle("display-flex", status === "loading");
    document
        .querySelector(".loader")
        .classList.toggle("display-flex", status === "loading");
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
