const LATEST_SERVER: number = 5;

// Concatenation for readability, mainly
class ServerInfo {
    title: string;
    dates: string;
    done: boolean;
    world_link: string;
    map_folder_link: string;
}

const SERVERS: { [key: string]: object } = {
    "bcr1": {
        "title": "BCR-MC 1 — 1.14/1.15: Village & Pillage / Buzzy Bees",
        "dates": "Dec. 2019",
        "done": true
    },
    "bcr2": {
        "title": "BCR-MC 2 — 1.15: Buzzy Bees",
        "dates": "Apr. 2020",
        "done": true
    },
    "bcr3": {
        "title": "BCR-MC 3 — 1.18: Caves & Cliffs",
        "dates": "Dec. 1st, 2021 — Jan. 29th, 2022",
        "done": true
    },
    "bcr4": {
        "title": "BCR-MC 4 — 1.19: The Wild Update",
        "dates": "Dec. 1st, 2022 — Jan. 31st, 2023",
        "done": true
    },
    "bcr5": {
        "title": "BCR-MC 5 — 1.20: Trails & Tales",
        "dates": "Dec. 1st, 2023 — Jan. 31st, 2024",
        "done": true
    }
}

const FIGURE_TEMPLATE: string = `<figure style="background-image: url('jpg/%IMAGE%.jpg');">`+
    `<figcaption>%TITLE%<a href="png/%IMAGE%.png">[PNG]</a>`+
    `<br><sup>(from %AUTHOR%)</sup></figcaption></figure>`

const PHOTO_AUTHORS: { [key: string]: string } = {
    "desu": "Desu",
    "mar": "Mar",
    "vi": "Violet"
}

const PHOTO_TITLES: { [key: string]: object } = {
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
}

function create_figure(image_name: string, server_season: number): string {
    let figure_string: string = FIGURE_TEMPLATE
        .replace('%IMAGE%', image_name)
        .replace('%TITLE%', PHOTO_TITLES[`bcr${server_season}`][image_name])
        .replace('%AUTHOR%', PHOTO_AUTHORS[image_name.split('-')[0]])
    return figure_string
}

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