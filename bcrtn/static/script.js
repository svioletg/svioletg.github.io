const BODY = document.querySelector("body");
const ARTICLE = document.querySelector("article");
const STYLESHEETS = Object.fromEntries(Array.from(document.querySelectorAll("link[rel='stylesheet']"))
    .filter((tag) => { return tag.id.trim() != ""; })
    .map((tag) => { return [tag.id, tag]; }));
const STYLE_SELECT_BUTTONS = Array.from(document.querySelectorAll("button.btn-style-selector"));
const DIM_SCREEN_OVERLAY = document.querySelector("div#dim-screen-overlay");
const MODAL_DIALOG = document.querySelector("dialog");
const MODAL_DIALOG_CONTENT = MODAL_DIALOG.querySelector("div#dialog-content");
const CLOSE_MODAL_BUTTON = document.querySelector("button.close-modal-button");
const TOONAMI_SHEET_DL_LINK = document.querySelector("a#sheet-dl-link");
//
//
//
function set_stylesheet(theme) {
    if (!Object.keys(STYLESHEETS).includes(theme)) {
        return;
    }
    Object.values(STYLESHEETS).forEach((tag) => { tag.disabled = true; });
    STYLE_SELECT_BUTTONS.forEach((j) => { j.classList.remove("toggle-on"); });
    STYLESHEETS[theme].disabled = false;
}
STYLE_SELECT_BUTTONS.forEach((tag) => {
    tag.addEventListener('styleChanged', (event) => { console.log(event); });
    tag.onclick = (event) => {
        set_stylesheet(`${tag.attributes["name"].value}`);
        tag.classList.add("toggle-on");
    };
});
MODAL_DIALOG.onbeforetoggle = (event) => {
    BODY.classList.add("frozen");
    DIM_SCREEN_OVERLAY.classList.remove("overlay-disabled");
    MODAL_DIALOG.classList.add("open");
};
MODAL_DIALOG.onclose = (event) => {
    BODY.classList.remove("frozen");
    DIM_SCREEN_OVERLAY.classList.add("overlay-disabled");
    MODAL_DIALOG.classList.remove("open");
};
CLOSE_MODAL_BUTTON.onclick = (event) => { MODAL_DIALOG.close(); MODAL_DIALOG_CONTENT.innerHTML = ''; };
function on_sheet_dl_select_change(tag) {
    TOONAMI_SHEET_DL_LINK.href = tag.value;
}
document.querySelectorAll("button.expand-autolist").forEach((bttn) => {
    bttn.onclick = (event) => {
        let target = document.querySelector(`[name=${bttn.attributes["name"].value}]`);
        MODAL_DIALOG_CONTENT.innerHTML =
            `<${target.tagName} start="${target.attributes["start"].value}">${target.innerHTML}</${target.tagName}>`;
        MODAL_DIALOG.show();
    };
});
document.querySelectorAll("hl1").forEach(el => {
    el.outerHTML = `<span class="hl-colored">${el.innerHTML}</span>`;
});
document.querySelectorAll("hl2").forEach(el => {
    el.outerHTML = `<span class="hl-underline">${el.innerHTML}</span>`;
});
//
//
//
let url_params = new URLSearchParams(window.location.search);
set_stylesheet(url_params.get("theme"));
