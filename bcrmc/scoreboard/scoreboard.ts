import { $, $all, json } from '../utils.js';
import { setup_tabs } from '../tabs.js';

(async function () {

const BOARD_DATA: { [key: string]: object } = await json('scoreboard-json/scoreboard-bcr5-feb01.json');

const PLAYERS: Array<string> = Object.keys(BOARD_DATA.PlayerScores);

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
            custom_objectives[name.split('cu.')[1]] = title;
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

function find_close_strings(search: string, options: Array<string>): Array<string> {
    return options.filter(item => {
        if (item) return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
    });
}

const ST_STATS: HTMLDivElement = $('div#standard-stats');
const CU_STATS: HTMLDivElement = $('div#custom-stats');

const ST_STATS_PLAYER_INPUT: HTMLInputElement = ST_STATS.querySelector('input[name="player"]');
const ST_STATS_PLAYER_SUB: HTMLDivElement = ST_STATS.querySelector('div[name="player"] div.text-input-sub');
const ST_STATS_PLAYER_SUGBOX: HTMLDivElement = ST_STATS.querySelector('div[name="player"] div.search-suggestions');

const ST_STATS_CAT_SELECTOR: HTMLSelectElement = ST_STATS.querySelector('select')

const ST_STATS_OBJ_INPUT: HTMLInputElement = ST_STATS.querySelector('input[name="object"]');
const ST_STATS_OBJ_SUB: HTMLDivElement = ST_STATS.querySelector('div[name="object"] div.text-input-sub');
const ST_STATS_OBJ_SUGBOX: HTMLDivElement = ST_STATS.querySelector('div[name="object"] div.search-suggestions');

const CU_STATS_PLAYER_INPUT: HTMLInputElement = CU_STATS.querySelector('input[name="player"]');
const CU_STATS_PLAYER_SUB: HTMLDivElement = CU_STATS.querySelector('div[name="player"] div.text-input-sub');
const CU_STATS_PLAYER_SUGBOX: HTMLDivElement = CU_STATS.querySelector('div[name="player"] div.search-suggestions');

const CU_STATS_OBJ_SELECTOR: HTMLSelectElement = CU_STATS.querySelector('select')

function fade_out(element: HTMLElement) {
    if (!element.classList.contains('off')) element.classList.add('fade-out');
}

// Show and hide search suggestions depending on input box focus
for (let [input, sugbox] of [
        [ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUGBOX],
        [ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUGBOX],
        [CU_STATS_PLAYER_INPUT, CU_STATS_PLAYER_SUGBOX]
    ]) {
    input.addEventListener('focus', () => {
        if (sugbox.children.length > 0) {
            sugbox.classList.remove('off');
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            fade_out(sugbox);
        }, 100);
    });
}

// TODO: Add search suggestions for player names
let last_search_value: string = '';

function refresh_search_suggestions(sugbox_parent: HTMLElement, search_string: string, search_options: Array<string>): void {
    let sugbox: HTMLElement = sugbox_parent.querySelector('div.search-suggestions');
    sugbox.style.setProperty('width', String(sugbox_parent.querySelector('input').offsetWidth) + 'px');
    // typescript complains about this if i don't specify <HTMLDivElement> i guess? but just using 'input' up there is fine. ok
    sugbox.style.setProperty('margin-top', String(sugbox_parent.querySelector<HTMLDivElement>('div.text-input-sub').offsetHeight) + 'px');
    
    search_string = search_string.toLowerCase();
    
    if (search_string == last_search_value) return;

    if (search_string.length > 2) {
        let suggestions: Array<string> = find_close_strings(search_string, search_options);
        if (suggestions.length <= 1) {
            sugbox.innerHTML = '';
            fade_out(sugbox);
            return;
        }
        sugbox.innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${entry}</button>` }).join('');
        sugbox.classList.remove('off');
    } else {
        sugbox.innerHTML = '';
        if (!sugbox.classList.contains('off')) sugbox.classList.add('fade-out');
    }

    for (let button of $all('button.search-suggestion-entry')) {
        button.addEventListener('click', () => {
            let search_input: HTMLInputElement = sugbox_parent.querySelector('input');
            last_search_value = search_input.value = button.textContent;
        });
    }

    last_search_value = search_string;
}

function validate_text_input(element: HTMLInputElement, sub_element: HTMLElement, sub_message: string, valid_options: Array<string>,
    other_conditions?: Array<boolean>): void {
    ST_STATS_PLAYER_SUB.style.setProperty('width', String($('input[name="player"]').offsetWidth) + 'px');
    ST_STATS_OBJ_SUB.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    sub_message = sub_message.replace(/%value%/g, element.value);
    let is_valid: boolean = (valid_options.includes(element.value) || element.value == '*') && (other_conditions ? other_conditions.every(Boolean) : true);
    if (is_valid) {
        sub_element.innerHTML = ''; sub_element.classList.remove('invalid'); sub_element.classList.add('off');
        element.classList.remove('invalid');
    } else {
        sub_element.innerHTML = sub_message; sub_element.classList.add('invalid'); sub_element.classList.remove('off');
        element.classList.add('invalid');
    }
}

setInterval(() => {
    refresh_search_suggestions(ST_STATS.querySelector('div[name="player"]'), ST_STATS_PLAYER_INPUT.value, PLAYERS);
    refresh_search_suggestions(ST_STATS.querySelector('div[name="object"]'), ST_STATS_OBJ_INPUT.value, Object.keys(STANDARD_STATS_BY_NAME));

    let st_category_value: string = ST_STATS_CAT_SELECTOR.value;
    let st_category_title: string = CATEGORY_PREFIXES[st_category_value];

    let st_obj_value: string = ST_STATS_OBJ_INPUT.value;
    let st_obj_name: string = STANDARD_STATS_BY_TITLE[st_obj_value];

    let objective_name: string = st_category_value + st_obj_name;

    validate_text_input(ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUB,
        'Can\'t find player "%value%"', PLAYERS
    );

    validate_text_input(ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUB,
        `No entry for "%value%" in category "${st_category_title}"`, Object.keys(STANDARD_STATS_BY_TITLE),
        [Object.keys(BOARD_DATA.Objectives).includes(objective_name)]
    );
}, 500);

for (let box of $all('div.search-suggestions')) {
    box.addEventListener('animationend', () => {
        box.classList.add('off');
        box.classList.remove('fade-out');
    });
}

// Request scores
function request_scores(player: string, category_prefix: string, objective_name: string): { [key: string]: { [key: string]: number } } {
    let every_player: boolean = player == '*';
    let every_category: boolean = category_prefix == 'all';
    let is_custom: boolean = category_prefix == 'cu.';
    let every_objective: boolean = objective_name == '*';
    
    if (!every_player && !BOARD_DATA.PlayerScores[player]) return undefined;

    let players: Array<string> = every_player ? PLAYERS : [player];
    let categories: Array<string> = every_category ? Object.keys(CATEGORY_PREFIXES) : [category_prefix];
    let objectives: Array<string> = every_objective ? Object.keys(STANDARD_STATS_BY_NAME)
        : is_custom ? Object.keys(CUSTOM_STATS)
        : [STANDARD_STATS_BY_TITLE[objective_name]];

    let results: { [key: string]: { [key: string]: number } };
    for (let p of players) {
        results[p] = {};
        for (let c of categories) {
            for (let o of objectives) {
                results[p][c + o] = BOARD_DATA.PlayerScores[p][c + o];
            }
        }
    }

    return results;
}

for (let button of $all('button[name="search-button"]')) {
    let section: HTMLElement = button.parentElement;
    let player_input: HTMLInputElement = section.querySelector('input[name="player"]');
    if (section.id == 'standard-stats') {
        let category_selector: HTMLSelectElement = section.querySelector('select');
        let object_input: HTMLInputElement = section.querySelector('input[name="object"]');
        button.addEventListener('click', () => {
            request_scores(player_input.value, category_selector.value, object_input.value);
        });
    } else if (section.id == 'custom-stats') {
        let objective_selector: HTMLSelectElement = section.querySelector('select');
        button.addEventListener('click', () => {
            request_scores(player_input.value, 'cu.', objective_selector.value);
        });
    }
}

// Build stats category selection
function build_stats_category_selection(): void {
    ST_STATS_CAT_SELECTOR.innerHTML += `<option value="all">All Categories</option>`;
    for (const [prefix, name] of Object.entries(CATEGORY_PREFIXES)) {
        ST_STATS_CAT_SELECTOR.innerHTML += `<option value="${prefix}">${name}</option>`
    }
}
build_stats_category_selection();

function build_custom_stats_selection(): void {
    for (const [name, title] of Object.entries(CUSTOM_STATS)) {
        CU_STATS_OBJ_SELECTOR.innerHTML += `<option value="${name}">${title}</option>\n`;
    };
}
build_custom_stats_selection();

setup_tabs();
})();