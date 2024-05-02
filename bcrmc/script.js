// Add anchor tags to sections with <h2>
function create_section_anchors()
{
    let tags_h2 = document.getElementsByTagName('h2');
    for (let i = 0; i < tags_h2.length; i++)
    {
        let tag = tags_h2[i];
        tag.innerHTML += `<a href="#${tag.id}" aria-label="Link to section ${tag.id}">
        <img title="Click to link to this section" class="linker" src="i/chain_128x128_outline.png">
        </a>`;
    }
}

create_section_anchors();
