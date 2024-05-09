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
    let custom_objectives: { [key: string]: string } = {};
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

const ST_STATS_PLAYER_INPUT: HTMLInputElement = $('div#standard-stats input[name="player"]');
const ST_STATS_PLAYER_SUB: HTMLDivElement = $('div#standard-stats div[name="player"] div.text-input-sub');
const ST_STATS_PLAYER_SUGBOX: HTMLDivElement = $('div#standard-stats div[name="player"] div.search-suggestions');

const ST_STATS_OBJ_INPUT: HTMLInputElement = $('div#standard-stats input[name="object"]');
const ST_STATS_OBJ_SUB: HTMLDivElement = $('div#standard-stats div[name="object"] div.text-input-sub');
const ST_STATS_OBJ_SUGBOX: HTMLDivElement = $('div#standard-stats div[name="object"] div.search-suggestions');

const CU_STATS_PLAYER_INPUT: HTMLInputElement = $('div#custom-stats input[name="player"]');
const CU_STATS_PLAYER_SUB: HTMLDivElement = $('div#custom-stats div[name="player"] div.text-input-sub');
const CU_STATS_PLAYER_SUGBOX: HTMLDivElement = $('div#custom-stats div[name="player"] div.search-suggestions');

function hide_suggestions() {
    if (!ST_STATS_OBJ_SUGBOX.classList.contains('off')) ST_STATS_OBJ_SUGBOX.classList.add('fade-out');
}

// Show and hide search suggestions depending on input box focus
let initial_search_focus: boolean = false;
$('input[name="object"]').addEventListener('focus', () => {
    initial_search_focus = true;
    if (ST_STATS_OBJ_SUGBOX.children.length > 0) {
        ST_STATS_OBJ_SUGBOX.classList.remove('off');
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
    ST_STATS_PLAYER_SUB.style.setProperty('width', String($('input[name="player"]').offsetWidth) + 'px');
    ST_STATS_OBJ_SUB.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    ST_STATS_OBJ_SUGBOX.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    ST_STATS_OBJ_SUGBOX.style.setProperty('margin-top', String(ST_STATS_OBJ_SUB.offsetHeight) + 'px');
    search_string = search_string.toLowerCase();
    
    if (!initial_search_focus) return;
    if (search_string == last_search_value) return;

    if (search_string.length > 2) {
        let suggestions: Array<string> = find_close_stat_items(search_string);
        if (suggestions.length <= 1 && suggestions[0] == STANDARD_STATS_BY_TITLE[search_string]) {
            ST_STATS_OBJ_SUGBOX.innerHTML = '';
            hide_suggestions();
            return
        }
        ST_STATS_OBJ_SUGBOX.innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${STANDARD_STATS_BY_NAME[entry]}</button>` }).join('');
        ST_STATS_OBJ_SUGBOX.classList.remove('off');
    } else {
        ST_STATS_OBJ_SUGBOX.innerHTML = '';
        if (!ST_STATS_OBJ_SUGBOX.classList.contains('off')) ST_STATS_OBJ_SUGBOX.classList.add('fade-out');
    }

    $all('button.search-suggestion-entry').forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', () => {
            let search_input: HTMLInputElement = $('input[name="object"]');
            last_search_value = search_input.value = button.textContent;
        });
    });

    last_search_value = search_string;
}

function validate_text_input(element: HTMLInputElement, sub_element: HTMLElement, sub_message: string, valid_options: Array<string>): void {
    sub_message = sub_message.replace(/%value/g, element.value);
    if (!valid_options[element.value]) {
        sub_element.innerHTML = sub_message; sub_element.classList.add('invalid'); sub_element.classList.remove('off');
        element.classList.add('invalid');
    } else {
        sub_element.innerHTML = ''; sub_element.classList.remove('invalid'); sub_element.classList.add('off');
        element.classList.remove('invalid');
    }
}

const SEARCH_SUGGESTIONS_UPDATE_INTERVAL = setInterval(() => {
    refresh_search_suggestions($('input[name="object"]').value);
    // Validate input
    let stat_category: string = $('select#stats-categories').value;
    let category_name: string = CATEGORY_PREFIXES[stat_category];
    let objective_name: string = '';

    for (const [name, title] of Object.entries(STANDARD_STATS_BY_NAME)) {
        if (title == ST_STATS_OBJ_INPUT.value) {
            objective_name = name;
        }
    }

    validate_text_input(ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', Object.keys(BOARD_DATA.PlayerScores));
    
    // let requested_objective: string = `${stat_category}${objective_name}`;
    // if (!BOARD_DATA.Objectives[requested_objective]) {
    //     ST_STATS_OBJ_SUB.innerHTML = `No objective "${ST_STATS_OBJ_INPUT.value}" found for category ${category_name}.`;
    //     ST_STATS_OBJ_SUB.classList.add('invalid'); ST_STATS_OBJ_SUB.classList.remove('off');
    //     ST_STATS_OBJ_INPUT.classList.add('invalid');
    // } else {
    //     ST_STATS_OBJ_SUB.innerHTML = '';
    //     ST_STATS_OBJ_SUB.classList.remove('invalid'); ST_STATS_OBJ_SUB.classList.add('off');
    //     ST_STATS_OBJ_INPUT.classList.remove('invalid');
    // }
}, 500);

for (let box of $all('div.search-suggestions')) {
    box.addEventListener('animationend', () => {
        $('div.search-suggestions').classList.add('off');
        $('div.search-suggestions').classList.remove('fade-out');
    });
}

// Request scores
function request_custom_scores(player: string, objective_name: string) {

}

function request_standard_scores(player: string, category_prefix: string, objective_name: string): { [key: string]: { [key: string]: number } } {
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

for (let button of $all('button[name="search-button"]')) {
    let section: HTMLElement = button.parentElement;
    let player_input: HTMLInputElement = section.querySelector('input[name="player"]');
    let category_selector: HTMLSelectElement = section.querySelector('select');
    if (section.id == 'standard-stats') {
        let object_input: HTMLInputElement = section.querySelector('input[name="object"]');
        button.addEventListener('click', () => {
            request_scores(player_input.value, category_selector.value, object_input.value);
        });
    } else if (section.id == 'custom-stats') {
        button.addEventListener('click', () => {
            request_scores(player_input.value, category_selector.value, object_input.value);
        });
    }
}

// Build stats category selection
function build_stats_category_selection(): void {
    $('select#stats-categories').innerHTML += `<option value="all">All Categories</option>`;
    for (const [prefix, name] of Object.entries(CATEGORY_PREFIXES)) {
        $('select#stats-categories').innerHTML += `<option value="${prefix}">${name}</option>`
    }
}
build_stats_category_selection();

function build_custom_stats_selection(): void {
    for (const [name, title] of Object.entries(CUSTOM_STATS)) {
        $('select#stats-other').innerHTML += `<option value="${name}">${title}</option>\n`;
    };
}
build_custom_stats_selection();

setup_tabs();
})();