function add_icon(header: HTMLHeadElement): void {
    header.innerHTML += `<link rel="icon" type="image/x-icon" href="/bcrmc/favicon.ico">`;
}

function add_viewport_meta(header: HTMLHeadElement): void {
    header.innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;
}

function main(): void {
    let header: HTMLHeadElement = document.getElementsByTagName("head")[0];
    console.log(header);
    if (!header.innerHTML.includes(`href="favicon.ico"`)) {
        console.log("Adding icon");
        add_icon(header);
    }

    if (!header.innerHTML.includes(`meta name="viewport"`)) {
        console.log("Adding viewport");
        add_viewport_meta(header);
    }
}

main()