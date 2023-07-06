export const results = [];

//  function to get array of ID results from search.
export async function fetchIds(query) {
    // API url for searches. Only search ones that have images and are highlight. This gives a list of IDs.
    const searchUrl =
        "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=";
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
            results.push(data);
        }
    }
}
