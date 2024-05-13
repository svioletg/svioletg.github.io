import { $, $all, json, reverse_object } from '../utils.js';
import { setup_tabs } from '../tabs.js';

(async function () {

const BOARD_DATA: { [key: string]: object } = await json('scoreboard-json/scoreboard-bcr5-feb01.json');

const PLAYERS: Array<string> = Object.keys(BOARD_DATA.PlayerScores);

const CATEGORIES_BY_PREFIX: { [key: string]: string } = {
    "b.": "Broken",
    "c.": "Crafted",
    "d.": "Killed by",
    "k.": "Killed",
    "u.": "Used",
    "m.": "Mined",
    "p.": "Picked Up",
    "q.": "Dropped",
}

const CATEGORIES_BY_TITLE: { [key: string]: string } = reverse_object(CATEGORIES_BY_PREFIX);

const CATEGORY_PREFIX_REGEX: RegExp = new RegExp(`${Object.values(CATEGORIES_BY_PREFIX).join('|')}`);

function get_standard_stats_map(): { [key: string]: string } {
    let obj_names: Array<string> = [];
    let trimmed_info: { [key: string]: string } = {};
    for (const[name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
        if (Object.keys(CATEGORIES_BY_PREFIX).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
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
const STANDARD_STATS_BY_TITLE: { [key: string]: string } = reverse_object(STANDARD_STATS_BY_NAME);

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
    return options.filter(item => { if (item) return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase()); });
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
let focus_state: { [key: string]: boolean } = {};

function new_focus_state_id(): string {
    let new_id: string = Math.random().toString(36).substring(2,7);
    while (focus_state.hasOwnProperty(new_id)) {
        new_id = Math.random().toString(36).substring(2,7);
    }
    return new_id;
}

for (const [input, sugbox] of [
        [ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUGBOX],
        [ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUGBOX],
        [CU_STATS_PLAYER_INPUT, CU_STATS_PLAYER_SUGBOX]
    ]) {
    const INPUT_FOCUS_ID = new_focus_state_id();
    input.setAttribute('fstate-id', INPUT_FOCUS_ID);
    focus_state[INPUT_FOCUS_ID] = false;

    const SUGBOX_FOCUS_ID = new_focus_state_id();
    sugbox.setAttribute('fstate-id', SUGBOX_FOCUS_ID);
    focus_state[SUGBOX_FOCUS_ID] = false;

    
    input.addEventListener('focus', () => {
        focus_state[INPUT_FOCUS_ID] = true;
        if (sugbox.children.length > 0) {
            sugbox.classList.remove('off');
        }
    });
    sugbox.addEventListener('focus', () => {
        alert('!');
        focus_state[SUGBOX_FOCUS_ID] = true;
    });
    // TODO: this only works on one of them? sure. i dont care rn

    input.addEventListener('blur', () => {
        focus_state[INPUT_FOCUS_ID] = false;
        setTimeout(() => {
            // If we've now focused the box itself, say by pressing tab, don't get rid of it yet
            if (focus_state[SUGBOX_FOCUS_ID]) return;
            fade_out(sugbox);
        }, 100);
    });
    sugbox.addEventListener('blur', () => {
        focus_state[SUGBOX_FOCUS_ID] = false;
    });
}

// TODO: Add search suggestions for player names
let last_search_value: string = '';

function refresh_search_suggestions(sugbox_parent: HTMLElement, search_string: string, search_options: Array<string>): void {
    let sugbox: HTMLElement = sugbox_parent.querySelector('div.search-suggestions');
    let input: HTMLInputElement = sugbox_parent.querySelector('input');
    sugbox.style.setProperty('width', String(input.offsetWidth) + 'px');
    // typescript complains about this if i don't specify <HTMLDivElement> i guess? but just using 'input' up there is fine. ok
    sugbox.style.setProperty('margin-top', String(sugbox_parent.querySelector<HTMLDivElement>('div.text-input-sub').offsetHeight) + 'px');
        
    if (search_string == last_search_value) return;

    if (search_string.length > 2) {
        let suggestions: Array<string> = find_close_strings(search_string, search_options);
        if (suggestions.length <= 0) {
            sugbox.innerHTML = '';
            fade_out(sugbox);
            return;
        }
        let new_html: string = suggestions.map(entry => { return `<button class="search-suggestion-entry">${entry}</button>` }).join('')
        // Avoid changing the contents if they're going to be the same
        // Resets the :hover CSS property otherwise, can look weird
        if (sugbox.innerHTML != new_html) sugbox.innerHTML = new_html;
        if (focus_state[input.getAttribute('fstate-id')]) sugbox.classList.remove('off');
    } else {
        sugbox.innerHTML = '';
        if (!sugbox.classList.contains('off')) sugbox.classList.add('fade-out');
    }

    for (let button of sugbox.querySelectorAll('button.search-suggestion-entry')) {
        button.addEventListener('click', () => {
            let search_input: HTMLInputElement = input;
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

for (let box of $all('div.search-suggestions')) {
    box.addEventListener('animationend', () => {
        box.classList.add('off');
        box.classList.remove('fade-out');
    });
}

// Request scores
type ScoreSearchResults = { [key: string]: { [key: string]: number } };
function request_scores(player: string, category_prefix: string, objective_name: string): ScoreSearchResults {
    let every_player: boolean = player == '*';
    let every_category: boolean = category_prefix == 'all';
    let is_custom: boolean = category_prefix == 'cu.';
    let every_objective: boolean = objective_name == '*';

    
    if (!every_player && !BOARD_DATA.PlayerScores[player]) return undefined;

    let players: Array<string> = every_player ? PLAYERS : [player];
    let categories: Array<string> = every_category ? Object.keys(CATEGORIES_BY_PREFIX) : [category_prefix];
    let objectives: Array<string> = every_objective ? Object.keys(STANDARD_STATS_BY_NAME)
        : is_custom ? Object.keys(CUSTOM_STATS)
        : [STANDARD_STATS_BY_TITLE[objective_name]];

    let results: ScoreSearchResults = {};
    for (let p of players) {
        results[p] = {};
        for (let c of categories) {
            for (let o of objectives) {
                let score: number = BOARD_DATA.PlayerScores[p][c + o];
                if (!score) continue;
                results[p][c + o] = score;
            }
        }
    }

    return results;
}

function scores_as_csv(score_results: ScoreSearchResults): Array<string> {
    let csv: Array<string> = [];
    for (const [player, scores] of Object.entries(score_results)) {
        for (const [obj, score] of Object.entries(scores)) {
            let category: string = CATEGORIES_BY_PREFIX[obj.split('.')[0] + '.'];
            csv.push(`${player},${category},${score}`);
        }
    }
    return csv;
}

function build_results_table(results: ScoreSearchResults): void {
    const csv = scores_as_csv(results);
    let scoreboard_html: string = ''; 
    for (const line of csv) {
        let [player, category, score] = line.split(',');
        scoreboard_html += `
        <tr>
            <th>Player</th>
            <th>Objective</th>
            <th>Score</th>
        </tr>

        <tr>
            <td>${player}</td>
            <td>${category}</td>
            <td>${score}</td>
        </tr>
        `;
    }
    $('table.scoreboard').innerHTML = scoreboard_html;
}

for (let button of $all('button[name="search-button"]')) {
    let section: HTMLElement = button.parentElement;
    let player_input: HTMLInputElement = section.querySelector('input[name="player"]');

    if (section.id == 'standard-stats') {
        let category_selector: HTMLSelectElement = section.querySelector('select');
        let object_input: HTMLInputElement = section.querySelector('input[name="object"]');

        button.addEventListener('click', () => {
            let results = request_scores(player_input.value, category_selector.value, object_input.value);
            build_results_table(results);
            $('div#search-results').classList.remove('off');
        });
    } else if (section.id == 'custom-stats') {
        let objective_selector: HTMLSelectElement = section.querySelector('select');

        button.addEventListener('click', () => {
            let results = request_scores(player_input.value, 'cu.', objective_selector.value);
            build_results_table(results);
            $('div#search-results').classList.remove('off');
        });
    }
}

// Build stats category selection
function build_stats_category_selection(): void {
    ST_STATS_CAT_SELECTOR.innerHTML += `<option value="all">All Categories</option>`;
    for (const [prefix, name] of Object.entries(CATEGORIES_BY_PREFIX)) {
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

setInterval(() => {
    refresh_search_suggestions(ST_STATS.querySelector('div[name="player"]'), ST_STATS_PLAYER_INPUT.value, PLAYERS);
    refresh_search_suggestions(ST_STATS.querySelector('div[name="object"]'), ST_STATS_OBJ_INPUT.value, Object.keys(STANDARD_STATS_BY_TITLE));
    refresh_search_suggestions(CU_STATS.querySelector('div[name="player"]'), CU_STATS_PLAYER_INPUT.value, PLAYERS);

    let st_category_value: string = ST_STATS_CAT_SELECTOR.value;
    let st_category_title: string = CATEGORIES_BY_PREFIX[st_category_value];

    let st_obj_value: string = ST_STATS_OBJ_INPUT.value;
    let st_obj_name: string = STANDARD_STATS_BY_TITLE[st_obj_value];

    let objective_name: string = st_category_value + st_obj_name;

    validate_text_input(ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', PLAYERS);
    validate_text_input(CU_STATS_PLAYER_INPUT, CU_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', PLAYERS);
    validate_text_input(ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUB,
        `No entry for "%value%" in category "${st_category_title}"`, Object.keys(STANDARD_STATS_BY_TITLE),
        [st_obj_value == '*' || Object.keys(BOARD_DATA.Objectives).includes(objective_name)]
    );
}, 500);

})();