function add_viewport_meta(header) {
    header.innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
}
function add_missing_header_data() {
    let header = document.getElementsByTagName("head")[0];
    if (!header.innerHTML.includes(`meta name="viewport"`)) {
        add_viewport_meta(header);
    }
}
add_missing_header_data();
