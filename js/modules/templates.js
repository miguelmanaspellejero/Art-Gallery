export async function printHeaderAndFooter() {
    const templates = document.createElement("template");
    const response = await fetch("templates.html");
    templates.innerHTML = await response.text();
    const footer = templates.content.querySelector("#footer").content;
    document.querySelector("footer").appendChild(footer);
    const header = templates.content.querySelector("#header").content;
    document.querySelector(".header-top").appendChild(header);
}
