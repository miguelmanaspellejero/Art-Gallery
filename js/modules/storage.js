import { results } from "./fetch.js";

//LocalStorage functions to save and restore results from search and search query status
export function saveResults() {
    localStorage.setItem("savedResults", JSON.stringify(results));
}

export function loadResults() {
    return JSON.parse(localStorage.getItem("savedResults"));
}

export function saveQueryAndStatus() {
    localStorage.setItem(
        "statusMessage",
        document.querySelector(".status-message").textContent
    );
    // textContent to simplify process, since the message was already generated by showSearchStatus.
}

export function loadQueryAndStatus() {
    return localStorage.getItem("statusMessage");
}
