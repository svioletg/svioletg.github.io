import { extract_number, json } from './utils.js';

(async function () {

const LATEST_SERVER: number = 6;

// Concatenation for readability, mainly
const FIGURE_TEMPLATE: string = `<figure style="background-image: url('/bcrmc/%SEASON%/jpg/%IMAGE%.jpg');">`+
    `<figcaption>%TITLE% %%HAS_PNG<a href="/bcrmc/%SEASON%/png/%IMAGE%.png">[PNG]</a>HAS_PNG%%`+
    `<br><sup>(from %AUTHOR%)</sup></figcaption></figure>`

const PHOTO_AUTHORS: { [key: string]: string } = {
    "desu": "Desu",
    "mar": "Mar",
    "vi": "Violet"
}

const PHOTO_TITLES: { [key: string]: object } = await json('/bcrmc/photo_titles.json');

function author_from_filename(filename: string): string {
    return PHOTO_AUTHORS[filename.split('-')[0]];
}

function create_figure(image_filename: string, image_title: string, server_season: string, has_png: boolean): string {
    let figure_string: string = FIGURE_TEMPLATE
        .replace(/%IMAGE%/g, image_filename)
        .replace(/%TITLE%/g, image_title)
        .replace(/%SEASON%/g, server_season)
        .replace(/%AUTHOR%/g, author_from_filename(image_filename))
        .replace(/%%HAS_PNG(.*)HAS_PNG%%/g, has_png ? '$1' : '');
    return figure_string;
}

function build_gallery(server_season: string): void {
    let gallery_container: HTMLDivElement = document.querySelector('div#gallery-collection');
    let new_gallery: HTMLDivElement = document.createElement('div');
    new_gallery.classList.add('gallery', 'smaller');
    new_gallery.setAttribute('name', server_season);

    // Run through images
    for (const [filename, attrs] of Object.entries(PHOTO_TITLES[server_season])) {
        let new_figure: string = create_figure(filename, attrs.title, server_season, attrs.has_png);
        new_gallery.innerHTML += new_figure;
    }

    // Add it
    gallery_container.appendChild(new_gallery);
}

function add_gallery_nav_arrows(): void {
    let gallery_titles: NodeListOf<HTMLDivElement> = document.querySelectorAll('div.historic-title');
    gallery_titles.forEach(title => {
        let current_page_name: string = title.getAttribute('name');
        let current_page_number: number = extract_number(current_page_name);

        let left_arrow: HTMLButtonElement = document.createElement('button');
        left_arrow.classList.add('bttn', 'arrow');
        left_arrow.addEventListener('click', () => { switch_gallery(`bcr${current_page_number - 1}`); })
        left_arrow.innerHTML = '&lt;';

        let right_arrow: HTMLButtonElement = document.createElement('button');
        right_arrow.classList.add('bttn', 'arrow');
        right_arrow.addEventListener('click', () => { switch_gallery(`bcr${current_page_number + 1}`); })
        right_arrow.innerHTML = '&gt;';

        title.insertBefore(left_arrow, title.querySelector('h2'));
        if (current_page_number == 1) {
            left_arrow.classList.add('hide');
        }

        title.appendChild(right_arrow);
        if (current_page_number == LATEST_SERVER) {
            right_arrow.classList.add('hide');
        }
    });
}

function update_heading_anchors(server_season: string): void {
    console.log(server_season);
    let heading_anchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a.heading-link');
    heading_anchors.forEach(a => {
        console.log(a.href);
        if (a.href.includes('?s=bcr')) {
            console.log('replacing', a.href);
            console.log(`?s=${server_season}`);
            a.href = a.href.replace(/\?s=bcr\d+/, `?s=${server_season}`);
            console.log(a.href);
        } else {
            let root: string = a.href.split('#')[0]
            let stem: string = a.href.split('#')[0]
            console.log(root, stem);
            a.href = root + `?s=${server_season}#` + stem
            console.log('new', a.href)
        }
    });
}

function switch_gallery(server_season: string): void {
    // Swap page theme
    let body: HTMLBodyElement = document.querySelector('body');
    body.classList.remove(body.classList.toString());
    body.classList.add(server_season);

    // Make the gallery, if it doesn't exist
    if (!document.querySelector(`div.gallery[name="${server_season}"]`)) {
        build_gallery(server_season);
    }

    // Change out stuff depending on the relevant server season
    ['div.historic-title', 'div.gallery-maps', 'div.gallery-files', 'div.gallery'].forEach(selector => {
        let divs: NodeListOf<HTMLDivElement> = document.querySelectorAll(selector);
        divs.forEach(div => {
            div.classList.add('off');
        });
    });
    document.querySelectorAll(`div[name="${server_season}"]`).forEach(div => { div.classList.remove('off'); });

    update_heading_anchors(server_season);
}

// Main
let params = new URLSearchParams(window.location.search);
let initial_season: string = params.get('s') || `bcr${LATEST_SERVER}`;

add_gallery_nav_arrows();
switch_gallery(initial_season);

})();