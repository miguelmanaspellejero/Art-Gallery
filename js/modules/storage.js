import { results } from "./fetch.js";

//LocalStorage functions to save and restore results from search and search query status
export function saveResults() {
    localStorage.setItem("savedResults", JSON.stringify(results));
}

export function loadResults() {
    return JSON.parse(localStorage.getItem("savedResults"));
}

export function saveQuery(query) {
    localStorage.setItem("savedQuery", query);
}

export function loadQuery() {
    return localStorage.getItem("savedQuery");
}
