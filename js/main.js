const query = document.querySelector("#searchInput").value;

// Search query from input clicking button.
document.querySelector("#searchButton").addEventListener("click", () => {
    searchIds(query);
});

// Search query from input by pressing Enter.
document.querySelector("#searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchIds(query);
    }
});

// API url for searches. Only search ones that have images. This gives a list of IDs.
const searchUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=";

//  function to get array of ID results from search.
async function searchIds(query) {
    const response = await fetch(searchUrl + query);
    const entries = await response.json();
    loadObjectInfo(entries);
}

// API url for getting data from each ID.
const objectInfoUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

const results = [];

// function to load data from API for each Id entry. If the entry is in public domain, it pushes it to results.
async function loadObjectInfo(entries) {
    for (const entry of entries.objectIDs) {
        const info = objectInfoUrl + entry;
        const response = await fetch(info);
        const data = await response.json();
        if (data.isPublicDomain) {
            results.push(data);
            printContent(data);
        }
    }
}

function printContent(data) {
    const templateCard = document.querySelector(".resultCard");
    const clone = templateCard.content.cloneNode(true);
    clone.querySelector(".picture").src = data.primaryImage;
    clone.querySelector(".title").innerText = data.title;
    clone.querySelector(".author").innerText = data.artistDisplayName;
    clone.querySelector(".year").innerText = data.objectDate;
    document.querySelector("#container").appendChild(clone);
}

searchIds("van gogh"); // initial call to show images at first load.
