// Add anchor tags to sections with <h2>
function create_section_anchors(): void {
    let tags_h2: NodeListOf<HTMLHeadingElement> = document.querySelectorAll('h2');
    tags_h2.forEach(tag => {
        // Make auto IDs if one isn't already set
        if (!tag.id) {
            tag.id = tag.textContent.replace(/ /, '-').toLowerCase();
        }
        tag.innerHTML += `<a class="heading-link" href="#${tag.id}" aria-label="Link to section ${tag.id}">
        <img title="Click to link to this section" class="linker" src="/bcrmc/i/chain_128x128_outline.png">
        </a>`;
    });
}

create_section_anchors();