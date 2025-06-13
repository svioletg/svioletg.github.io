const TABLE_OF_CONTENTS = document.querySelector("ol#toc");
// Construct table of contents from headers
document.querySelectorAll("h2").forEach((tag) => {
    if (tag.classList.contains("no-toc"))
        return;
    if (tag.id === "") {
        tag.id = tag.textContent.toLowerCase().replace(/\s/g, "-");
    }
    TABLE_OF_CONTENTS.innerHTML += `<li><a href="#${tag.id}">${tag.textContent}</a></li>`;
});
// Process <icon> tags
document.querySelectorAll("icon").forEach((tag) => {
    if (tag.attributes.getNamedItem("name") === null)
        return;
    let name = tag.attributes.getNamedItem("name").value;
    let content = "";
    switch (name) {
        case "info":
            content = `<img class="inline info" src="i/info.svg" alt="An italic letter I on a circle, an information symbol">`;
            break;
        default:
            break;
    }
    tag.outerHTML = content;
});
// Process literal code blocks
const RGX_SEP_CONTENT = RegExp(/(\s*)\S+/);
document.querySelectorAll("blockquote.code").forEach((tag) => {
    tag.innerHTML = tag.innerHTML
        .trim()
        .replace(/\n/g, "<br>")
        .replace(/\s/g, "&nbsp;");
});
