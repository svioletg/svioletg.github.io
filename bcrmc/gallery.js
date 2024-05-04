var LATEST_SERVER = 5;
// Concatenation for readability, mainly
var FIGURE_TEMPLATE = "<figure style=\"background-image: url('jpg/%IMAGE%.jpg');\">" +
    "<figcaption>%TITLE%<a href=\"png/%IMAGE%.png\">[PNG]</a>" +
    "<br><sup>(from %AUTHOR%)</sup></figcaption></figure>";
var PHOTO_AUTHORS = {
    "desu": "Desu",
    "mar": "Mar",
    "vi": "Violet"
};
var PHOTO_TITLES = {
    "bcr1": {
        "desu-violetleghouse": "Violet and Leg's House at Daytime",
        "mar-townsunrise": "Central Town at Sunrise",
        "mar-towersunrise": "Mar's Tower at Sunrise",
        "vi-townbridge": "Central Town from the Bridge at Night",
        "vi-towntower": "Central Town with Tower in the Background",
        "desu-boat": "Boat Ride",
        "desu-chestsdesert": "Chests in Desert",
        "desu-hillside": "Hillside by River",
        "desu-togetherminecart": "Minecart Experiment"
    },
    "bcr2": {
        "vi-vihousenight": "Violet's House at Night",
        "vi-townvalleyday": "Town Valley at Daytime",
        "vi-alliumrock": "Allium on a Rock Formation at Daytime",
        "desu-foggytown": "View of Cabin ",
        "desu-loandistance": "Loan Entering Town",
        "desu-marcave": "Mar's Mountainside Home",
        "desu-mesacabin": "Evan's Mesa Lodging",
        "desu-roofedforest": "Mushroom Forest"
    },
    "bcr3": {
        "mar-postdragon": "Post",
        "vi-exposedcavenight": "Inside of Exposed Cave at Night",
        "vi-conservatory": "The Altuo Conservatory",
        "mar-beachhousenight": "Mar's Beach House at Night in the Snow",
        "mar-lighthouserain": "Rodanthe Lighthouse at Night in the Rain",
        "mar-endermanledge": "Enderman Standing on a Ledge in the Nether",
        "desu-floatingrock": "Large Mountain",
        "vi-observatory1": "Natty's Observatory ",
        "vi-observatory2": "Natty's Observatory ",
        "vi-northaltuo": "Northern Altuo at Sunrise",
        "vi-northaltuonight": "Northern Altuo at Night With the Moon Overhead",
        "desu-altuofromwest": "Altuo Peninsula from the West",
        "desu-deepslatecave": "Deepslate Cave",
        "desu-discfarm": "Music Disc Farm",
        "desu-dripstonecave": "Dripstone Cave",
        "desu-fishing": "Mar ",
        "desu-marglass": "Mar Through Spyglass",
        "desu-melonfarm": "Desu's Pumpkin",
        "desu-mountainhouse": "Desu's In",
        "desu-northtown": "North Hillside Altuo",
        "desu-observatoryint1": "Altuo Observatory ",
        "desu-observatoryint2": "Altuo Observatory ",
        "desu-snowing": "Altuo in Winter",
        "desu-towerglass": "Altuo Tower Through Spyglass",
        "desu-townhallconstruction": "Construction of Town Hall",
        "desu-townsideboard": "Altuo Townside Bulletin Board",
        "desu-virecords": "Violet's Disc Collection"
    },
    "bcr4": {
        "vi-southgeminisunrise": "Sunrise in South Gemini City",
        "vi-geminihouses": "Mar",
        "mar-bocchi": "Mar's Melted Bocchi",
        "mar-lushgodrays": "Lush Cave With Godrays",
        "desu-beegarden": "Mar's Bee Garden",
        "desu-castlein": "Gemini Outskirts Fort ",
        "desu-castleout": "Gemini Outskirts Fort ",
        "desu-dhousein": "Desu's House ",
        "desu-dhouseout": "Desu's House ",
        "desu-ekhouse1": "Evan",
        "desu-ekhouse2": "Evan",
        "desu-ekhouse3": "Evan",
        "desu-marhousein": "Mar's House ",
        "desu-marhouseout": "Mar's House ",
        "desu-cactusfarm": "Desu's Cactus Farm",
        "desu-netherroof": "Top Of The Nether",
        "desu-postoffice": "Gemini Post Office",
        "desu-pyramidgarden": "Roof of the Pyramid ",
        "desu-pyramidsuiteEV": "Evan's Pyramid Suite",
        "desu-pyramidsuiteDM": "Desu",
        "vi-andrehouse1": "Andre's House ",
        "vi-andrehouse2": "Andre's House ",
        "vi-andrehouse3": "Andre's House ",
        "vi-beegarden": "Mar's Bee Garden At Dusk",
        "vi-conservatoryfar": "Gemini Conservatory From Afar",
        "vi-dragondeath": "Death of the Ender Dragon",
        "vi-end": "The End",
        "vi-endfruits": "End Island With Chorus Fruits",
        "vi-farmedge": "Edge of the Gemini Farm",
        "vi-mesaview1": "Painted Desert",
        "vi-mesaview2": "Painted Desert",
        "vi-nightmesa": "The Mesa at Night",
        "vi-oceantemple": "Entrance of an Ocean Monument",
        "vi-plainsmesa": "Plains with Mesas in the Distance",
        "vi-pyramidsunset": "Evan's Inverted Pyramid at Sunset",
        "vi-vhousefromfarm": "Violet's House Viewed from the Farm",
        "vi-conservatoryinside": "Gemini Conservatory ",
        "vi-marbrewinside": "Mar's Brewery ",
        "vi-pyramidnightclose": "Evan's Pyramid at Night",
        "vi-pyramidnightfar": "Evan's Pyramid at Night ",
        "desu-bakeryext": "Mar's Bakery ",
        "desu-bakeryint": "Mar's Bakery ",
        "desu-brewext": "Mar's Brewery ",
        "desu-brewint": "Mar's Brewery ",
        "desu-cactusfarmext": "Desu's Cactus Farm ",
        "desu-christmastree": "Gemini Town Christmas Tree",
        "desu-conservatorybasement": "Gemini Conservatory ",
        "desu-conservatorybasement2": "Gemini Conservatory ",
        "desu-conservatoryext": "Gemini Conservatory ",
        "desu-geminilighthouse": "Gemini Lighthouse",
        "desu-hollowstronghold": "Hollowed",
        "desu-mesaspire": "Spire in the Mesa",
        "desu-nattyworm": "Natty's Beetlejuice Worm",
        "desu-pixelart": "Mesa Art ",
        "desu-vhouseext": "Violet's House ",
        "desu-vhouseint": "Violet's House ",
        "vi-serverclosing": "Last Second on the Server"
    },
    "bcr5": {
        "mar-creeperblossomtree": "Creeper in Cherry Tree",
        "mar-dripstones": "Dripstone Cavern in Hazy Light",
        "mar-nightlavariver": "Midnight River Bank with Flowing Lava",
        "mar-postoffice": "Town Post Office",
        "mar-vhousefromdistance": "Violet's House ",
        "vi-sunsetvalley": "Town Valley at Sunset",
        "vi-vhouseconstruction": "Violet's House Under Construction",
        "vi-vhousefinished": "Violet's Finished House ",
        "desu-harukeishrine": "Hakurei Shrine",
        "desu-mushroomisland": "Giant Mushroom Island Panorama",
        "desu-postoffice": "Cerise Post Office",
        "desu-twilightbarroom": "The Twilight Bar Room",
        "mar-deepslatelavashaft": "Mineshaft in Deepslate with Lava Flow",
        "mar-desumarhousefront": "Desu ",
        "mar-desumarhousefrontdaylight": "Desu ",
        "mar-desumarhouseroof": "Desu ",
        "mar-mushroomisland": "Giant Mushroom Island Panorama ",
        "mar-twilightbarroom": "The Twilight Bar Room at Night",
        "vi-bridgeatenight": "Cerise Bridge at Night",
        "vi-bridgeatsunrise": "Cerise Bridge at Sunrise",
        "vi-bridgeawayfromtown": "On the Cerise Bridge Looking Toward West Hill",
        "vi-bridgefrombelowangle": "Cerise Bridge from Below",
        "vi-bridgefrombelowzoom": "Cerise Bridge from Below ",
        "vi-bridgefrombelowzoomangle": "Cerise Bridge from Below ",
        "vi-mansion": "Mansion in the North Side of Cerise",
        "desu-dragondeath": "Death of the Ender Dragon",
        "desu-enderfarm": "Endermen Farm",
        "desu-skaletonfarmentrance": "SKAleton Farm Entrance",
        "desu-skaletonfarminterior": "SKAleton Farm Interior",
        "desu-xmastree": "Cerise Xmas Tree",
        "mar-beefarm": "Mar's Bee Farm",
        "mar-beerose": "Bees Around a Rose",
        "mar-icespike": "Ice Spikes in Rain",
        "vi-menorah": "Menorah at Sunset"
    }
};
function extract_number(input_string) {
    return Number(input_string.match(/\d+/)[0]);
}
function create_figure(image_name, server_season) {
    var figure_string = FIGURE_TEMPLATE
        .replace('%IMAGE%', image_name)
        .replace('%TITLE%', PHOTO_TITLES["bcr".concat(server_season)][image_name])
        .replace('%AUTHOR%', PHOTO_AUTHORS[image_name.split('-')[0]]);
    return figure_string;
}
function add_gallery_nav_arrows() {
    var gallery_titles = document.querySelectorAll('div.gallery-title');
    gallery_titles.forEach(function (title) {
        var current_page_name = title.getAttribute('name');
        var current_page_number = extract_number(current_page_name);
        var left_arrow = document.createElement('button');
        left_arrow.classList.add('bttn', 'arrow');
        left_arrow.addEventListener('click', function () { switch_gallery("bcr".concat(current_page_number - 1)); });
        left_arrow.innerHTML = '&lt;';
        var right_arrow = document.createElement('button');
        right_arrow.classList.add('bttn', 'arrow');
        right_arrow.addEventListener('click', function () { switch_gallery("bcr".concat(current_page_number + 1)); });
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
// TODO: switch_gallery()
function switch_gallery(season) {
    // Swap page theme
    var body = document.querySelector('body');
    body.classList.remove(body.classList.toString());
    body.classList.add(season);
    // Change out title, maps, and files
    ['div.gallery-title', 'div.gallery-maps', 'div.gallery-files'].forEach(function (selector) {
        console.log(selector);
        var divs = document.querySelectorAll(selector);
        console.log(divs);
        divs.forEach(function (div) {
            console.log(div);
            div.classList.add('off');
        });
    });
    document.querySelectorAll("div[name=\"".concat(season, "\"]")).forEach(function (div) { div.classList.remove('off'); });
}
// Main
add_gallery_nav_arrows();
switch_gallery("bcr".concat(LATEST_SERVER));
