const LATEST_SERVER: number = 5;

function add_gallery_nav_arrows(): void {
    let gallery_title: HTMLDivElement = document.querySelector('div#gallery-title');
    console.log(gallery_title);
    console.log(gallery_title.getAttribute('name'));
    console.log(gallery_title.getAttribute('name').match(/\d+/));
    let current_page_number: number = Number(gallery_title.getAttribute('name').match(/\d+/)[0])

    let left_arrow: HTMLAnchorElement = document.createElement('a');
    left_arrow.classList.add('bttn', 'arrow');
    left_arrow.href = `/bcrmc/bcr${current_page_number - 1}/gallery`;
    left_arrow.text = '<';

    let right_arrow: HTMLAnchorElement = document.createElement('a');
    right_arrow.classList.add('bttn', 'arrow');
    right_arrow.href = `/bcrmc/bcr${current_page_number + 1}/gallery`;
    right_arrow.text = '>';
    
    gallery_title.insertBefore(left_arrow, gallery_title.querySelector('h2'));
    if (current_page_number == 1) {
        left_arrow.classList.add('hide');
    }
    
    gallery_title.appendChild(right_arrow);
    if (current_page_number == LATEST_SERVER) {
        right_arrow.classList.add('hide');
    }
}

add_gallery_nav_arrows();