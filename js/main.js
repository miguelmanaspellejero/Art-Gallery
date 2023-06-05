// Search query from input clicking button.
document.querySelector("#searchButton").addEventListener("click", () => {
    const query = document.querySelector("#searchInput").value;
    searchEntry(query);
});

// Search query from input by pressing Enter.
document.querySelector("#searchInput").addEventListener("keydown", (e) => {
    const query = document.querySelector("#searchInput").value;
    if (e.key === "Enter") {
        searchEntry(query);
    }
});

// API url for searches. Only search ones that have images. This gives a list of IDs.
const search =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=";

//  function to get array of results from search.
async function searchEntry(query) {
    const response = await fetch(search + query);
    const data = await response.json();
    loadInfo(data);
}

// API url for getting data from earch ID.
const url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

// function to load data from API Id entry and print on screen.
async function loadInfo(info) {
    const load = url + info.objectIDs[0]; // Show only first entry.
    const response = await fetch(load);
    const data = await response.json();
    // Only show results if image is in public domain an can be shown.
    if (data.isPublicDomain) {
        document.querySelector(".picture").src = data.primaryImage;
        document.querySelector("#title").innerText = data.title;
        document.querySelector("#author").innerText = data.artistDisplayName;
        document.querySelector("#year").innerText = data.objectDate;
    }
}

searchEntry("van gogh"); // initial call to show images at first load.
