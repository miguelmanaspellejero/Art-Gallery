// document.title =
showDetails();

async function showDetails() {
    const url = new URL(window.location.href);
    const image = url.searchParams.get("image");
    const title = url.searchParams.get("title");
    const author = url.searchParams.get("author");
    const year = url.searchParams.get("year");

    document.querySelector(".artwork-detail img").src = image;
}

document
    .querySelector("#button-back")
    .addEventListener("click", () => window.history.back());
