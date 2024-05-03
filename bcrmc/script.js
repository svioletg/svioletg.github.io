// Add anchor tags to sections with <h2>
function create_section_anchors() {
    var tags_h2 = document.querySelectorAll('h2');
    tags_h2.forEach(function (tag) {
        tag.innerHTML += "<a href=\"#".concat(tag.id, "\" aria-label=\"Link to section ").concat(tag.id, "\">\n        <img title=\"Click to link to this section\" class=\"linker\" src=\"/bcrmc/i/chain_128x128_outline.png\">\n        </a>");
    });
}
create_section_anchors();
