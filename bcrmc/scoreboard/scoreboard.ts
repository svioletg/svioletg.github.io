import { LATEST_SERVER } from '../consts.js';
import { setup_tabs } from '../tabs.js';
import { $, $all, extract_number, humanize_number, json, reverse_object } from '../utils.js';

(async function () {

const URL_PARAMS: URLSearchParams = new URLSearchParams(window.location.search);

const SERVER: string = URL_PARAMS.get('s') ?? 'bcr' + LATEST_SERVER.toString();
const SCOREBOARD_JSON_FORMAT: string = SERVER >= 'bcr6' ? 'new-svg' : 'old-res';

const SCOREBOARD_FILES: { [key: string]: string } = {
    'bcr1': 'scoreboard-json/scoreboard-empty.json',
    'bcr2': 'scoreboard-json/scoreboard-empty.json',
    'bcr3': 'scoreboard-json/scoreboard-empty.json',
    'bcr4': 'scoreboard-json/scoreboard-empty.json',
    'bcr5': 'scoreboard-json/scoreboard-bcr5-feb01.json',
    'bcr6': 'scoreboard-json/6test.json',
}
const SCOREBOARD_JSON_URL: string = `/bcrmc/scoreboard/${SCOREBOARD_FILES[SERVER]}`;

$('a#board-json-dl').href = SCOREBOARD_JSON_URL;

const NO_SCORES_CONTAINER: HTMLDivElement = $('div#no-scores-container');
const SCOREBOARD_CONTAINER: HTMLDivElement = $('div#scoreboard-container');
const SCOREBOARD_TABLE: HTMLTableElement = $('table.scoreboard');

const BOARD_DATA: { [key: string]: object } = await json(SCOREBOARD_FILES[SERVER]);

if (Object.keys(BOARD_DATA.PlayerScores).length == 0) {
    SCOREBOARD_CONTAINER.classList.add('off'); NO_SCORES_CONTAINER.classList.remove('off');
}

const PLAYERS: Array<string> = Object.keys(BOARD_DATA.PlayerScores);

const EST_OBJECTIVE_COUNT: number = PLAYERS.map(player => Object.keys(BOARD_DATA.PlayerScores[player]).length).reduce(
    (acc, val) => {return acc + val}, 0
);

const CUSTOM_STAT_PREFIX: string = SCOREBOARD_JSON_FORMAT == 'new-svg' ? 'custom.' : 'cu.';

const CATEGORY_PREFIX_FORMATS: { [key: string]: { [key: string]: string } } = {
    "old-res": {
        "b.": "Broken",
        "c.": "Crafted",
        "d.": "Killed by",
        "k.": "Killed",
        "u.": "Used",
        "m.": "Mined",
        "p.": "Picked Up",
        "q.": "Dropped",
    },
    "new-svg": {
        "broken.": "Broken",
        "crafted.": "Crafted",
        "killed_by.": "Killed by",
        "killed.": "Killed",
        "used.": "Used",
        "mined.": "Mined",
        "picked_up.": "Picked Up",
        "dropped.": "Dropped",
    }
}

const CATEGORIES_BY_PREFIX: { [key: string]: string } = CATEGORY_PREFIX_FORMATS[SCOREBOARD_JSON_FORMAT];

const CATEGORIES_BY_TITLE: { [key: string]: string } = reverse_object(CATEGORIES_BY_PREFIX);

const CATEGORY_PREFIX_REGEX: RegExp = new RegExp(`${Object.values(CATEGORIES_BY_PREFIX).join('|')}`);

function get_standard_stats_map(): { [key: string]: string } {
    let obj_names: Array<string> = [];
    let trimmed_info: { [key: string]: string } = {};
    for (const[name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
        if (Object.keys(CATEGORIES_BY_PREFIX).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
            let generic_name = name.split('.')[1];
            obj_names.push(generic_name);

            var nameroot = "";
            if (!("json_dict" in obj_info.DisplayName)) {
                nameroot = obj_info.DisplayName.text;
            } else {
                nameroot = obj_info.DisplayName.json_dict.text;
            }

            trimmed_info[generic_name] = nameroot.replace(CATEGORY_PREFIX_REGEX, '').replace('"', '').trim();
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
        if (name.startsWith(CUSTOM_STAT_PREFIX)) {
            let title: string;
            if (!("json_dict" in obj_info.DisplayName)) {
                title = obj_info.DisplayName.text;
            } else {
                title = obj_info.DisplayName.json_dict.text;
            }
            custom_objectives[name.split(CUSTOM_STAT_PREFIX)[1]] = title;
        }
    }

    let sorted_names: Array<string> = Object.keys(custom_objectives).sort();
    let sorted_custom_objectives = {};
    for (let name of sorted_names) {
        sorted_custom_objectives[name] = custom_objectives[name];
    }

    return sorted_custom_objectives;
}

const CUSTOM_STATS_BY_NAME: { [key: string]: string } = get_custom_stats();
const CUSTOM_STATS_BY_TITLE: { [key: string]: string } = reverse_object(CUSTOM_STATS_BY_NAME);

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

const CU_STATS_OBJ_SELECTOR: HTMLSelectElement = CU_STATS.querySelector('select');

const SEARCH_RESULTS_CONTAINER: HTMLDivElement = $('div#search-results');

function fade_out(element: HTMLElement) {
    if (!element.classList.contains('off')) element.classList.add('fade-out');
}

function add_scoreboard_nav_arrows(): void {
    let board_titles: NodeListOf<HTMLDivElement> = document.querySelectorAll('div.historic-title');
    board_titles.forEach(title => {
        let current_page_name: string = title.getAttribute('name');
        let current_page_number: number = extract_number(current_page_name);

        let left_arrow: HTMLButtonElement = document.createElement('button');
        left_arrow.classList.add('bttn', 'arrow');
        left_arrow.addEventListener('click', () => { window.location.href = `?s=bcr${current_page_number - 1}`; })
        left_arrow.innerHTML = '&lt;';

        let right_arrow: HTMLButtonElement = document.createElement('button');
        right_arrow.classList.add('bttn', 'arrow');
        right_arrow.addEventListener('click', () => { window.location.href = `?s=bcr${current_page_number + 1}`; })
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
    let body: HTMLBodyElement = document.querySelector('body');
    body.classList.remove(body.classList.toString());
    body.classList.add(SERVER);

    $(`div.historic-title[name="${SERVER}"]`).classList.remove('off');
}

add_scoreboard_nav_arrows();

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
        focus_state[SUGBOX_FOCUS_ID] = true;
    });

    // TODO: this only works on one of them? sure. i dont care rn
    // TODO: i dont remember what i meant by this ^

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


    let is_valid: boolean = (
            valid_options.includes(element.value)
            || (filter_with_wildcard(element.value, valid_options).length > 0)
            || element.value == '*'
        ) && (other_conditions ? other_conditions.every(Boolean) : true);

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

function filter_with_wildcard(input_string: string, source_array: Array<string>): Array<string> {
    const reg = new RegExp('^' + input_string.replace('*', '.*'), 'i');
    return source_array.filter(input_string => input_string.match(reg));
}

// Request scores
type ScoreSearchResults = { [key: string]: { [key: string]: number } };
function request_scores(player: string, category_prefix: string, requested_obj: string): ScoreSearchResults {
    const every_player: boolean = player == '*';
    const every_category: boolean = category_prefix == 'all';
    const every_objective: boolean = requested_obj == '*';
    const is_custom: boolean = category_prefix == CUSTOM_STAT_PREFIX;

    if (!every_player && !BOARD_DATA.PlayerScores[player]) return undefined;

    let players: Array<string> = every_player ? PLAYERS : [player];
    let categories: Array<string> = every_category ? Object.keys(CATEGORIES_BY_PREFIX) : [category_prefix];
    let objectives: Array<string> = every_objective ? Object.keys(STANDARD_STATS_BY_NAME)
        : is_custom ? [requested_obj]
        : requested_obj.includes('*') ? filter_with_wildcard(requested_obj, Object.keys(STANDARD_STATS_BY_TITLE))
        : [STANDARD_STATS_BY_TITLE[requested_obj]];

    let results: ScoreSearchResults = {};
    for (const p of players) {
        results[p] = {};
        for (const cat of categories) {
            for (let obj of objectives) {
                obj = STANDARD_STATS_BY_TITLE[obj] ?? obj;
                let score: number = BOARD_DATA.PlayerScores[p][cat + obj];
                if (!score) continue;
                results[p][cat + obj] = score;
            }
        }
    }

    return results;
}

function scores_as_csv(score_results: ScoreSearchResults): Array<string> {
    let csv: Array<string> = [];
    // let csv: Array<string> = ['Player,Objective,Score'];
    for (const [player, scores] of Object.entries(score_results)) {
        for (const [obj, score] of Object.entries(scores)) {
            const is_custom: boolean = obj.startsWith(CUSTOM_STAT_PREFIX);
            let category_title: string = is_custom ? '' : CATEGORIES_BY_PREFIX[obj.split('.')[0] + '.'];
            let objective_title: string = is_custom ? CUSTOM_STATS_BY_NAME[obj.split('.')[1]] : STANDARD_STATS_BY_NAME[obj.split('.')[1]];
            let full_objective: string = is_custom ? objective_title : `${category_title} ${objective_title}`;
            csv.push(`${player},${full_objective},${score}`);
        }
    }
    return csv;
}

function csv_blob(csv: Array<string>): Blob {
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    return blob;
}

function prompt_blob(blob: Blob): void {
    let link = window.URL.createObjectURL(blob);
    window.location.href = link;
}

function build_and_show_results_table(results: ScoreSearchResults): void {
    const csv_dl: HTMLAnchorElement = SEARCH_RESULTS_CONTAINER.querySelector('a#csv-download');
    SEARCH_RESULTS_CONTAINER.classList.remove('off');

    const csv = scores_as_csv(results);
    if (csv.length == 0) {
        SEARCH_RESULTS_CONTAINER.querySelector('p').innerHTML = `Nothing found.<br>
            <sup>Nothing could be found for that player, category, and object combination.</sup>`;
        csv_dl.classList.add('disabled');
        return;
    }

    SEARCH_RESULTS_CONTAINER.querySelector('p').innerHTML = `Found ${csv.length} results!`;
    let scoreboard_html: string = `
        <thead>
            <tr>
                <th>Player</th>
                <th>Objective</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
    `;

    SCOREBOARD_TABLE.innerHTML = scoreboard_html + '<p>Building...</p>';
    for (let n = 0; n < csv.length; n++) {
        const line = csv[n];
        let [player, category, score] = line.split(',');
        scoreboard_html += `
            <tr name="${n}">
                <td name="0">${player}</td>
                <td name="1">${category}</td>
                <td name="2">${score}</td>
            </tr>
        `;
    }
    scoreboard_html += '</tbody>';
    SCOREBOARD_TABLE.innerHTML = scoreboard_html;

    csv_dl.addEventListener('click', () => {
        prompt_blob(csv_blob(csv));
    });
    csv_dl.classList.remove('disabled');
}

for (let button of $all('button[name="search-button"]')) {
    let section: HTMLElement = button.parentElement;
    let player_input: HTMLInputElement = section.querySelector('input[name="player"]');

    if (section.id == 'standard-stats') {
        let category_selector: HTMLSelectElement = section.querySelector('select');
        let object_input: HTMLInputElement = section.querySelector('input[name="object"]');

        button.addEventListener('click', () => {
            let results = request_scores(player_input.value, category_selector.value, object_input.value);
            build_and_show_results_table(results);
        });
    } else if (section.id == 'custom-stats') {
        let objective_selector: HTMLSelectElement = section.querySelector('select');

        button.addEventListener('click', () => {
            let results = request_scores('*', CUSTOM_STAT_PREFIX, objective_selector.value);
            build_and_show_results_table(results);
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
    for (const [name, title] of Object.entries(CUSTOM_STATS_BY_NAME)) {
        CU_STATS_OBJ_SELECTOR.innerHTML += `<option value="${name}">${title}</option>\n`;
    };
}
build_custom_stats_selection();

setup_tabs();
setInterval(() => {
    refresh_search_suggestions(ST_STATS.querySelector('div[name="player"]'), ST_STATS_PLAYER_INPUT.value, PLAYERS);
    refresh_search_suggestions(ST_STATS.querySelector('div[name="object"]'), ST_STATS_OBJ_INPUT.value, Object.keys(STANDARD_STATS_BY_TITLE));

    let player_input_value: string = ST_STATS_PLAYER_INPUT.value;
    let st_category_value: string = ST_STATS_CAT_SELECTOR.value;
    let st_category_title: string = CATEGORIES_BY_PREFIX[st_category_value];

    let st_obj_value: string = ST_STATS_OBJ_INPUT.value;
    let st_obj_name: string = STANDARD_STATS_BY_TITLE[st_obj_value];

    let objective_name: string = st_category_value + st_obj_name;

    if (player_input_value == '*' && st_category_value == 'all' && st_obj_value == '*') {
        SEARCH_RESULTS_CONTAINER.querySelector('p').innerHTML = `<sub>
            <span style="color: rgb(255, 127, 127);">
                This search will return all statistic entries in the scoreboard, which is
                <em>roughly ${humanize_number(EST_OBJECTIVE_COUNT)}</em>.
                <br>This may take a long time to search, and the page may freeze while doing so.
            </span>
        </sub>`;
    }

    validate_text_input(ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', PLAYERS);
    validate_text_input(ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUB,
        `No entry for "%value%" in category "${st_category_title}"`, Object.keys(STANDARD_STATS_BY_TITLE),
        [(st_obj_value.includes('*') || st_category_value == 'all') || Object.keys(BOARD_DATA.Objectives).includes(objective_name)]
    );
}, 500);


})();