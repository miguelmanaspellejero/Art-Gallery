import { Artwork } from "./modules/data.js";
import { printHeaderAndFooter } from "./modules/templates.js";

await printHeaderAndFooter();
fetchDetails();

async function fetchDetails() {
    const detailUrl = new URL(window.location.href);
    const id = detailUrl.searchParams.get("id");
    const objectInfoUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
    const response = await fetch(objectInfoUrl + id);
    let details = await response.json();
    details = new Artwork(
        details.objectID,
        details.primaryImageSmall,
        details.primaryImage,
        details.title,
        details.artistDisplayName,
        details.artistAlphaSort,
        details.artistDisplayBio,
        details.objectDate,
        details.objectEndDate,
        details.isHighlight,
        details.department,
        details.medium,
        details.dimensions
    );
    printDetails(details);
}

function printDetails(details) {
    document.title = details.title;
    document.querySelector(".image-link").href = details.imageLarge;
    document.querySelector(".detail-image").src = details.imageLarge;
    document.querySelector(".detail-image").alt = details.title;
    document.querySelector(".detail-title").textContent = details.title;
    document.querySelector(".detail-artist").textContent = details.artist;
    document.querySelector(".detail-date").textContent = details.date;
    document.querySelector(".detail-artist-bio").textContent =
        details.artistBio;
    document.querySelector(".detail-department").textContent =
        details.department;
    document.querySelector(".detail-medium").textContent = details.medium;
    document.querySelector(".detail-dimensions").textContent =
        details.dimensions;
}

document
    .querySelector("#button-back")
    .addEventListener("click", () => window.history.back());
