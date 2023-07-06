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
export async function printContent() {
    const fragment = document.createDocumentFragment();
    const template = document.querySelector("#artworks").content;
    for (const result of results) {
        const clone = template.cloneNode(true);
        clone.querySelector(".picture").src = result.primaryImageSmall;
        clone.querySelector(".picture").alt = result.title;
        clone.querySelector(".title").textContent = result.title;
        clone.querySelector(".author").textContent = result.artistDisplayName;
        clone.querySelector(".year").textContent = result.objectDate;
        fragment.appendChild(clone);
    }
    document.querySelector(".container-artworks").appendChild(fragment);
}
