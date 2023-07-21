export function sendSearch() {
    const query = document.querySelector("#search-input").value.trim();
    const filter = document.querySelector("#search-select").value;
    const filterParam = filter ? `&filter=${filter}` : "";
    const searchUrl = `index.html?query=${encodeURIComponent(
        query
    )}${filterParam}`;
    window.location.href = searchUrl;
}
