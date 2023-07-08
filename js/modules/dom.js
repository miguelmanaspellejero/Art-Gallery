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
        ).href = `detail.html?id=${artwork.objectID}`;
        clone.querySelector(".picture").src = artwork.primaryImageSmall;
        clone.querySelector(".picture").alt = artwork.title;
        clone.querySelector(".title").textContent = artwork.title;
        clone.querySelector(".author").textContent = artwork.artistDisplayName;
        clone.querySelector(".year").textContent = artwork.objectDate;
        fragment.appendChild(clone);
    }
    document.querySelector(".container-artworks").appendChild(fragment);
}
