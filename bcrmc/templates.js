// @ts-check

var TEMPLATES = {
    ".bcr6 h1.mc-head":
        `
        <img src="i/bcr.png" style="height: 1.5em; vertical-align: bottom;">
        <span>BCR-MC 6: </span>
        <span class="text-grad-bcr6">Tricky Trials</span>
        <img class="bcr6-icon" style="height: 1.5em; vertical-align: bottom;">
        <br><span style="font-size: 0.75em; vertical-align: top;">[ <span class="text-grad-bcr6"><a href="https://minecraft.wiki/w/Java_Edition_1.21">1.21</a></span> ]</span>
        `,
    "div.historic-title[name=bcr1]":
        `<h2 id="114">BCR-MC 1 - 1.14/1.15: Village & Pillage Update / Buzzy Bees Update<br><sup>Dec. 2019</sup></h2>`,
    "div.historic-title[name=bcr2]":
        `<h2 id="115">BCR-MC 2 - 1.15: Buzzy Bees Update<br><sup>Apr. 2020</sup></h2>`,
    "div.historic-title[name=bcr3]":
        `<h2 id="118">BCR-MC 3 - 1.18: Caves & Cliffs Update<br><sup>Dec. 1st, 2021 — Jan. 29th, 2022</sup></h2>`,
    "div.historic-title[name=bcr4]":
        `<h2 id="119">BCR-MC 4 - 1.19: The Wild Update<br><sup>Dec. 1st, 2022 — Jan. 31st 2023</sup></h2>`,
    "div.historic-title[name=bcr5]":
        `<h2 id="120">BCR-MC 5 - 1.20: Trails & Tales<br><sup>Dec. 1st, 2023 — Jan. 31st 2024</sup></h2>`,
    "div.historic-title[name=bcr6]":
        `<h2 id="121">BCR-MC 6 — 1.21: Tricky Trials<br><sup>Dec. 1st, 2024 — Jan. 31st 2025</sup></h2>`,
}

function render_templates() {
    for (const [key, value] of Object.entries(TEMPLATES)) {
        var elem = document.querySelector(key);
        if (elem) elem.innerHTML = value;
    }
}

render_templates();