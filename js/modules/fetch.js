import { Artwork } from "./data.js";
import { saveResults } from "./storage.js";

export const results = [];

//  function to get array of ID results from search.
export async function fetchIds(query, filter) {
    // API url for searches. This gives a list of IDs. Only search paintings that have images and are highlight to reduce loading time.
    const idUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/search?";
    const medium = "medium=Paintings";
    const hasImages = "hasImages=true";
    const isHighlight = "isHighlight=true";
    let searchUrl;
    if (filter.length > 0) {
        searchUrl = `${idUrl}${medium}&${hasImages}&${filter}&q=`;
    } else {
        searchUrl = `${idUrl}${medium}&${hasImages}&${isHighlight}&q=`;
    }
    const response = await fetch(searchUrl + query);
    const entries = await response.json();
    return entries;
}

// function to load data from API for each Id entry. If the entry is in public domain, it pushes it to results.
export async function fetchData(entries) {
    const objectInfoUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/";
    for (const entry of entries.objectIDs) {
        const info = objectInfoUrl + entry;
        const response = await fetch(info);
        const data = await response.json();
        if (data.isPublicDomain) {
            results.push(
                new Artwork(
                    data.objectID,
                    data.primaryImageSmall,
                    data.primaryImage,
                    data.title,
                    data.artistDisplayName,
                    data.artistAlphaSort,
                    data.artistDisplayBio,
                    data.objectDate,
                    data.objectEndDate,
                    data.isHighlight,
                    data.department,
                    data.medium,
                    data.dimensions
                )
            );
        }
    }
    saveResults();
}
