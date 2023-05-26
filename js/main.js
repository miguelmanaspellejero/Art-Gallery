document.querySelector("#searchButton").addEventListener("click", () => {
    const query = document.querySelector("#searchInput").value;
    searchEntry(query);
});

const search =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?q=";

async function searchEntry(query) {
    const response = await fetch(search + query);
    const data = await response.json();
    loadInfo(data);
}

const url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

async function loadInfo(info) {
    const load = url + info.objectIDs[0];
    const response = await fetch(load);
    const data = await response.json();
    document.querySelector(".picture").src = data.primaryImage;
    document.querySelector("#title").innerText = data.title;
    document.querySelector("#author").innerText = data.artistDisplayName;
    document.querySelector("#year").innerText = data.objectDate;
}

searchEntry("van gogh");
