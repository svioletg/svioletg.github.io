import { $, $all, json } from '../utils.js';
import { setup_tabs } from '../tabs.js';

(async function () {

const BOARD_DATA: { [key: string]: object } = await json('scoreboard-json/scoreboard-bcr5-feb01.json');

const CATEGORY_PREFIXES: object = {
    "b.": "Broken",
    "c.": "Crafted",
    "d.": "Killed by",
    "k.": "Killed",
    "u.": "Used",
    "m.": "Mined",
    "p.": "Picked Up",
    "q.": "Dropped",
}

const CATEGORY_PREFIX_REGEX: RegExp = new RegExp(`${Object.values(CATEGORY_PREFIXES).join('|')}`);

function get_standard_stats_map(): { [key: string]: string } {
    let obj_names: Array<string> = [];
    let trimmed_info: { [key: string]: string } = {};
    for (const[name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
        if (Object.keys(CATEGORY_PREFIXES).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
            let generic_name = name.split('.')[1];
            obj_names.push(generic_name);
            trimmed_info[generic_name] = obj_info.DisplayName.json_dict.text.replace(CATEGORY_PREFIX_REGEX, '').trim();
        }
    }

    obj_names = obj_names.sort();
    let alphabetical_info: { [key: string]: string } = {};
    for (let name of obj_names) {
        alphabetical_info[name] = trimmed_info[name];
    };

    return alphabetical_info;
}

// An objective's NAME is what you'd use in a command, e.g. m.oakLog
// An objective's TITLE is what Minecraft calls its "Display Name", e.g. "Oak Log Mined"
const STANDARD_STATS_BY_NAME: { [key: string]: string } = get_standard_stats_map();
const STANDARD_STATS_BY_TITLE: { [key: string]: string } = Object.fromEntries(Object.entries(STANDARD_STATS_BY_NAME).map(([k, v]) => [v, k]));

function get_custom_stats() {
    let custom_objectives: { [key: string]: string };
    for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
        if (name.startsWith('cu.')) {
            let title: string = obj_info.DisplayName.json_dict.text;
            custom_objectives[name] = title;
        }
    }

    let sorted_names: Array<string> = Object.keys(custom_objectives).sort();
    let sorted_custom_objectives = {};
    for (let name of sorted_names) {
        sorted_custom_objectives[name] = custom_objectives[name];
    }

    return sorted_custom_objectives;
}

const CUSTOM_STATS: { [key: string]: string } = get_custom_stats();

function find_close_stat_items(search: string): Array<string> {
    return Object.keys(STANDARD_STATS_BY_NAME).filter(item => {
        if (item) return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
    });
}

let suggestions_box: HTMLDivElement = $('div#stats-search-suggestions');
let stats_search_sub: HTMLDivElement = $('div#stats-search-input-sub');
let player_search_sub: HTMLDivElement = $('div#stats-player-input-sub');

function hide_suggestions() {
    if (!suggestions_box.classList.contains('off')) suggestions_box.classList.add('fade-out');
}

// Show and hide search suggestions depending on input box focus
let initial_search_focus: boolean = false;
$('input[name="object"]').addEventListener('focus', () => {
    initial_search_focus = true;
    if (suggestions_box.children.length > 0) {
        suggestions_box.classList.remove('off');
    }
});

$('input[name="object"]').addEventListener('blur', () => {
    setTimeout(() => {
        hide_suggestions();
    }, 100);
});
// TODO: Add search suggestions for player names
let last_search_value: string = '';
function refresh_search_suggestions(search_string: string): void {
    player_search_sub.style.setProperty('width', String($('input[name="player"]').offsetWidth) + 'px');
    stats_search_sub.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    suggestions_box.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    suggestions_box.style.setProperty('margin-top', String(stats_search_sub.offsetHeight) + 'px');
    search_string = search_string.toLowerCase();
    
    if (!initial_search_focus) return;
    if (search_string == last_search_value) return;

    if (search_string.length > 2) {
        let suggestions: Array<string> = find_close_stat_items(search_string);
        if (suggestions.length <= 1 && suggestions[0] == STANDARD_STATS_BY_TITLE[search_string]) {
            suggestions_box.innerHTML = '';
            hide_suggestions();
            return
        }
        suggestions_box.innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${STANDARD_STATS_BY_NAME[entry]}</button>` }).join('');
        suggestions_box.classList.remove('off');
    } else {
        suggestions_box.innerHTML = '';
        if (!suggestions_box.classList.contains('off')) suggestions_box.classList.add('fade-out');
    }

    $all('button.search-suggestion-entry').forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', () => {
            let search_input: HTMLInputElement = $('input[name="object"]');
            last_search_value = search_input.value = button.textContent;
        });
    });

    last_search_value = search_string;
}

const SEARCH_SUGGESTIONS_UPDATE_INTERVAL = setInterval(() => {
    refresh_search_suggestions($('input[name="object"]').value);
    // Validate input
    let player_input: HTMLInputElement = $('input[name="player"]');
    let search_input: HTMLInputElement = $('input[name="object"]');
    let stat_category: string = $('select#stats-categories').value;
    let category_name: string = CATEGORY_PREFIXES[stat_category];
    let objective_name: string = '';

    for (const [name, title] of Object.entries(STANDARD_STATS_BY_NAME)) {
        if (title == search_input.value) {
            objective_name = name;
        }
    }

    if (!BOARD_DATA.PlayerScores[player_input.value]) {
        player_search_sub.innerHTML = `Can't find player "${player_input.value}".`;
        player_search_sub.classList.add('invalid'); player_search_sub.classList.remove('off');
        search_input.classList.add('invalid');
    } else {
        player_search_sub.innerHTML = '';
        player_search_sub.classList.remove('invalid'); player_search_sub.classList.add('off');
        search_input.classList.remove('invalid');
    }
    
    let requested_objective: string = `${stat_category}${objective_name}`;
    if (!BOARD_DATA.Objectives[requested_objective]) {
        stats_search_sub.innerHTML = `No objective "${search_input.value}" found for category ${category_name}.`;
        stats_search_sub.classList.add('invalid'); stats_search_sub.classList.remove('off');
        search_input.classList.add('invalid');
    } else {
        stats_search_sub.innerHTML = '';
        stats_search_sub.classList.remove('invalid'); stats_search_sub.classList.add('off');
        search_input.classList.remove('invalid');
    }
}, 500);

$('div#stats-search-suggestions').addEventListener('animationend', () => {
    $('div#stats-search-suggestions').classList.add('off');
    $('div#stats-search-suggestions').classList.remove('fade-out');
});

// Request scores
function request_scores(player: string, category_prefix: string, objective_name: string): { [key: string]: { [key: string]: number } } {
    let every_player: boolean = player == '*';
    let every_category: boolean = category_prefix == 'all';
    let every_objective: boolean = objective_name == '*';
    
    if (!every_player && !BOARD_DATA.PlayerScores[player]) return undefined;

    let players: Array<string> = every_player ? Object.keys(BOARD_DATA.PlayerScores) : [player];
    let categories: Array<string> = every_category ? Object.keys(CATEGORY_PREFIXES) : [category_prefix];
    let objectives: Array<string> = every_objective ? Object.keys(STANDARD_STATS_BY_NAME) : [STANDARD_STATS_BY_TITLE[objective_name]];

    let results: { [key: string]: { [key: string]: number } };
    for (let p of players) {
        results[p] = {};
        for (let c of categories) {
            for (let o of objectives) {
                results[p][c + o] = BOARD_DATA.PlayerScores[p][c + o];
            }
        }
    }
    // let score: number = BOARD_DATA.PlayerScores[player][`${objective}`];
    return results;
}

$('button#search-button').addEventListener('click', () => {
    request_scores($('input[name="player"]').value, $('select#stats-categories').value, $('input[name="object"]').value);
});

// Build stats category selection
function build_stats_category_selection(): void {
    $('select#stats-categories').innerHTML += `<option value="all">All Categories</option>`;
    for (const [prefix, name] of Object.entries(CATEGORY_PREFIXES)) {
        $('select#stats-categories').innerHTML += `<option value="${prefix}">${name}</option>`
    }
}
build_stats_category_selection();

function build_custom_stats_selection(): void {
    for (let objective in CUSTOM_STATS) {
        $('select#stats-other').innerHTML += `<option value="${objective[1]}">${objective[0]}</option>\n`;
    };
}
build_custom_stats_selection();

setup_tabs();
})();