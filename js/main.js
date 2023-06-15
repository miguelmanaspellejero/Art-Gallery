// Search query from input clicking button.
document.querySelector("#searchButton").addEventListener("click", () => {
    clearContent();
    const query = document.querySelector("#searchInput").value;
    searchIds(query);
});

// Search query from input by pressing Enter.
document.querySelector("#searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        clearContent();
        const query = document.querySelector("#searchInput").value;
        searchIds(query);
    }
});

document.querySelector("#order").addEventListener("click", () => {});

// API url for searches. Only search ones that have images and are highlight. This gives a list of IDs.
const searchUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=";

//  function to get array of ID results from search.
async function searchIds(query) {
    const response = await fetch(searchUrl + query);
    const entries = await response.json();
    await loadObjectInfo(entries);
    printContent();
}

// API url for getting data from each ID.
const objectInfoUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

let results = [];

// function to load data from API for each Id entry. If the entry is in public domain, it pushes it to results.
async function loadObjectInfo(entries) {
    for (const entry of entries.objectIDs) {
        const info = objectInfoUrl + entry;
        const response = await fetch(info);
        const data = await response.json();
        if (data.isPublicDomain) {
            results.push(data);
            console.log(results);
        }
    }
}

function printContent() {
    const fragment = document.createDocumentFragment();
    const template = document.querySelector("#artwork").content;
    for (const result of results) {
        const clone = template.cloneNode(true);
        clone.querySelector(".picture").src = result.primaryImageSmall;
        clone.querySelector(".picture").alt = result.title;
        clone.querySelector(".title").innerText = result.title;
        clone.querySelector(".author").innerText = result.artistDisplayName;
        clone.querySelector(".year").innerText = result.objectDate;
        fragment.appendChild(clone);
    }
    document.querySelector("#container").appendChild(fragment);
}

searchIds("van gogh"); // initial call to show images at first load.

// Clear previous loaded content when a new search is made

function clearContent() {
    // Previous load function is not interrupted!!!.
    results = [];
    document.querySelector("#container").replaceChildren();
}
