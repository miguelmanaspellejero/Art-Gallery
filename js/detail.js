fetchDetails();

async function fetchDetails() {
    const detailUrl = new URL(window.location.href);
    const id = detailUrl.searchParams.get("id");
    const objectInfoUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
    const response = await fetch(objectInfoUrl + id);
    const data = await response.json();
    printDetails(data);
}

function printDetails(data) {
    document.querySelector(".artwork-detail img").src = data.primaryImage;
    document.querySelector(".artwork-detail img").alt = data.title;
    document.querySelector(".detail-title").textContent = data.title;
    document.querySelector(".detail-author").textContent =
        data.artistDisplayName;
    document.querySelector(".detail-year").textContent = data.objectDate;
}

document
    .querySelector("#button-back")
    .addEventListener("click", () => window.history.back());
