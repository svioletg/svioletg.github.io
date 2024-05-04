import {extract_number, json} from './utils.js';

(async function () {

const LATEST_SERVER: number = 5;

// Concatenation for readability, mainly
const FIGURE_TEMPLATE: string = `<figure style="background-image: url('/bcrmc/%SEASON%/jpg/%IMAGE%.jpg');">`+
    `<figcaption>%TITLE%<a href="/bcrmc/%SEASON%/png/%IMAGE%.png">[PNG]</a>`+
    `<br><sup>(from %AUTHOR%)</sup></figcaption></figure>`

const PHOTO_AUTHORS: { [key: string]: string } = {
    "desu": "Desu",
    "mar": "Mar",
    "vi": "Violet"
}

let PHOTO_TITLES: { [key: string]: { [key: string]: string } } = await json('/bcrmc/photo_titles.json');

function author_from_filename(filename: string): string {
    return PHOTO_AUTHORS[filename.split('-')[0]];
}

function create_figure(image_filename: string, image_title: string, server_season: string): string {
    let figure_string: string = FIGURE_TEMPLATE
        .replace(/%IMAGE%/g, image_filename)
        .replace(/%TITLE%/g, image_title)
        .replace(/%SEASON%/g, server_season)
        .replace(/%AUTHOR%/g, author_from_filename(image_filename));
    return figure_string;
}

function build_gallery(server_season: string): void {
    console.log('starting a build')
    let gallery_container: HTMLDivElement = document.querySelector('div#gallery-collection');
    let new_gallery: HTMLDivElement = document.createElement('div');
    new_gallery.classList.add('gallery', 'smaller');
    new_gallery.setAttribute('name', server_season);

    // Run through images
    console.log(typeof(PHOTO_TITLES[server_season]), PHOTO_TITLES[server_season]);
    for (const [key, value] of Object.entries(PHOTO_TITLES[server_season])) {
        console.log(key, value);
        console.log(new_gallery.innerHTML);
        let new_figure: string = create_figure(key, value, server_season);
        new_gallery.innerHTML += new_figure;
    }

    // Add it
    gallery_container.appendChild(new_gallery);
}

function add_gallery_nav_arrows(): void {
    let gallery_titles: NodeListOf<HTMLDivElement> = document.querySelectorAll('div.gallery-title');
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

function switch_gallery(season: string): void {
    // Swap page theme
    let body: HTMLBodyElement = document.querySelector('body');
    body.classList.remove(body.classList.toString());
    body.classList.add(season);

    // Make the gallery, if it doesn't exist
    if (!document.querySelector(`div.gallery[name="${season}"]`)) { 
        build_gallery(season);
    }

    // Change out stuff depending on the relevant server season
    ['div.gallery-title', 'div.gallery-maps', 'div.gallery-files', 'div.gallery'].forEach(selector => {
        let divs: NodeListOf<HTMLDivElement> = document.querySelectorAll(selector);
        divs.forEach(div => {
            div.classList.add('off');
        });
    });
    document.querySelectorAll(`div[name="${season}"]`).forEach(div => { div.classList.remove('off'); });
}

// Main
let params = new URLSearchParams(window.location.search);
let initial_season: string = params.get('season') || params.get('s') || `bcr${LATEST_SERVER}`;

add_gallery_nav_arrows();
switch_gallery(initial_season);

})();