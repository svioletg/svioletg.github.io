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

function apply_correct_gallery_header_backgrounds()
{
    let tags_h2 = document.getElementsByTagName('h2');
    for (let i = 0; i < tags_h2.length; i++) 
    {
        let tag = tags_h2[i];
        switch (tag.id) {
            case '114':
                tag.style.backgroundImage = "url('i/slate_128x128.png')";
                break;
            case '115':
                tag.style.backgroundImage = "url('i/honeycomb_block_64x64_dark.png')";
                break;
            case '118':
                tag.style.backgroundImage = "url('i/slate_128x128.png')";
                break;
            case '119':
                tag.style.backgroundImage = "url('i/sculk_catalyst_top_128x128.png')";
                break;
            case '120':
                tag.style.backgroundImage = "url('i/cherry_planks_128x128.png')";
                break;
            default:
                break;
        }
    }
}

create_section_anchors();
apply_correct_gallery_header_backgrounds();