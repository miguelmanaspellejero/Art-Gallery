const results = [];
let searchRunning = false; // This avoids new searches from being started until current is finished.

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
        limitSearches(false);
        return;
    }
    await loadObjectInfo(entries);
    await printContent();
    showSearchStatus(query, "finished");
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

// Update status of the search process and results.
function showSearchStatus(query, status) {
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

//  function to get array of ID results from search.
async function fetchIds(query) {
    // API url for searches. Only search ones that have images and are highlight. This gives a list of IDs.
    const searchUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=";
    const response = await fetch(searchUrl + query);
    const entries = await response.json();
    return entries;
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
        }
    }
}

// Print content in DOM
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
    results.splice(0);
    document.querySelector(".container-artworks").replaceChildren();
}
