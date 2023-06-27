let results = [];

// Click and enter search events
document.querySelector("#search-button").addEventListener("click", startSearch);
document.querySelector("#search-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startSearch();
    }
});

// Start search query from input
function startSearch() {
    const query = document.querySelector("#search-input").value;
    // clearContent();
    showStatus(query, "loading");
    searchIds(query);
}

function showStatus(query, status) {
    const statusMessage = document.querySelector(".status-message");
    if (status === "loading") {
        statusMessage.textContent = "Loading ...";
    } else if (status === "finished") {
        statusMessage.textContent = `Showing ${results.length} results for "${query}"`;
    } else if (status === "notFound") {
        statusMessage.textContent = `No results matching "${query}"`;
    }
}

//  function to get array of ID results from search.
async function searchIds(query) {
    // API url for searches. Only search ones that have images and are highlight. This gives a list of IDs.
    const searchUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=";
    const response = await fetch(searchUrl + query);
    const entries = await response.json();
    if (entries.objectIDs === null) {
        showStatus(query, "notFound");
    }
    await loadObjectInfo(entries);
    await printContent();
    showStatus(query, "finished");
}

// function to load data from API for each Id entry. If the entry is in public domain, it pushes it to results.
async function loadObjectInfo(entries) {
    const objectInfoUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
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

async function printContent() {
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

// Clear previous loaded content when a new search is made

function clearContent() {
    // Previous load function is not interrupted!!!.
    results = [];
    document.querySelector(".container-artworks").replaceChildren();
}
