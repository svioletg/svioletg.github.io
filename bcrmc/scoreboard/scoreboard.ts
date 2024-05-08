import { $, $all, json } from '../utils.js';
import { setup_tabs } from '../tabs.js';

(async function () {

const BOARD_DATA: { [key: string]: object } = await json('scoreboard-json/scoreboard-bcr5-feb01.json');

const OBJ_PREFIXES: object = {
    "b.": "Broken",
    "c.": "Crafted",
    "d.": "Killed by",
    "k.": "Killed",
    "u.": "Used",
    "m.": "Mined",
    "p.": "Picked Up",
    "q.": "Dropped",
}

const OBJ_TYPE_REGEX: RegExp = new RegExp(`${Object.values(OBJ_PREFIXES).join('|')}`);

function get_valid_stats_items(): { [key: string]: string } {
    let obj_names: Array<string> = [];
    let trimmed_info: { [key: string]: string } = {};
    for (const[name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
        if (Object.keys(OBJ_PREFIXES).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
            let generic_name = name.split('.')[1];
            obj_names.push(generic_name);
            trimmed_info[generic_name] = obj_info.DisplayName.json_dict.text.replace(OBJ_TYPE_REGEX, '').trim();
        }
    }

    obj_names = obj_names.sort();
    let alphabetical_info: { [key: string]: string } = {};
    obj_names.forEach(obj_name => {
        alphabetical_info[obj_name] = trimmed_info[obj_name];
    });

    return alphabetical_info;
}

const STATS_ITEMS: { [key: string]: string } = get_valid_stats_items();
const STATS_ITEMS_BY_DNAME: { [key: string]: string } = Object.fromEntries(Object.entries(STATS_ITEMS).map(([k, v]) => [v, k]));

function find_close_stat_items(search: string): Array<string> {
    return Object.keys(STATS_ITEMS).filter(item => {
        if (item) return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
    });
}

function find_closest_stat_item(search: string): string | undefined {
    return Object.keys(STATS_ITEMS).find(item => {
        if (item) return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
    });
}

let suggestions_box: HTMLDivElement = $('div#stats-search-suggestions');
let stats_search_sub: HTMLDivElement = $('div#stats-search-input-sub');

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

let last_search_value: string = '';
function refresh_search_suggestions(search_string: string): void {
    stats_search_sub.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    suggestions_box.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
    suggestions_box.style.setProperty('margin-top', String(stats_search_sub.offsetHeight) + 'px');
    search_string = search_string.toLowerCase();
    
    if (!initial_search_focus) return;
    if (search_string == last_search_value) return;

    if (search_string.length > 2) {
        let suggestions: Array<string> = find_close_stat_items(search_string);
        console.log(suggestions.length, suggestions[0], search_string, STATS_ITEMS_BY_DNAME[search_string]);
        if (suggestions.length <= 1 && suggestions[0] == STATS_ITEMS_BY_DNAME[search_string]) {
            suggestions_box.innerHTML = '';
            hide_suggestions();
            return
        }
        suggestions_box.innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${STATS_ITEMS[entry]}</button>` }).join('');
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
    let search_input: HTMLInputElement = $('input[name="object"]');
    let stat_category: string = $('select#stats-categories').value;
    let category_name: string = OBJ_PREFIXES[stat_category];
    let objective_name: string = '';

    for (const [name, title] of Object.entries(STATS_ITEMS)) {
        if (title == search_input.value) {
            objective_name = name;
        }
    }

    let requested_objective: string = `${stat_category}${objective_name}`;
    if (!BOARD_DATA.Objectives[requested_objective]) {
        stats_search_sub.innerHTML = `No objective "${search_input.value}" found for category ${category_name}.`;
        stats_search_sub.classList.add('invalid');
        stats_search_sub.classList.remove('off');
        search_input.classList.add('invalid');
    } else {
        stats_search_sub.innerHTML = '';
        stats_search_sub.classList.remove('invalid');
        stats_search_sub.classList.add('off');
        search_input.classList.remove('invalid');
    }
}, 500);

$('div#stats-search-suggestions').addEventListener('animationend', () => {
    $('div#stats-search-suggestions').classList.add('off');
    $('div#stats-search-suggestions').classList.remove('fade-out');
});

function search_for_scores(): void {
    return;
}

$('button#search-button').addEventListener('click', () => {
    // TODO: will need redoing!
    let search_input: HTMLInputElement = $('input[name="object"]');
    let stat_category: string = $('select#stats-categories').value;
    let search_string: string = search_input.value;
    let closest_stat_item: string = find_closest_stat_item(search_string);
    if (closest_stat_item) {
        let requested_objective: string = `${stat_category}${closest_stat_item}`;
        if (!BOARD_DATA.Objectives[requested_objective]) {
            search_input.classList.add('invalid');
            return;
        }
        search_input.classList.remove('invalid');
        search_input.setAttribute('stored_value', requested_objective);
        search_input.value = STATS_ITEMS[closest_stat_item];
    }
});

// Build stats category selection
function build_stats_category_selection(): void {
    $('select#stats-categories').innerHTML += `<option value="all">All Categories</option>`;
    for (const [prefix, name] of Object.entries(OBJ_PREFIXES)) {
        $('select#stats-categories').innerHTML += `<option value="${prefix}">${name}</option>`
    }
}
build_stats_category_selection();

function build_custom_stats_selection(): void {
    let custom_objectives: Array<Array<string>> = []
    for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
        if (name.startsWith('cu.')) {
            let title: string = obj_info.DisplayName.json_dict.text;
            custom_objectives.push([title, name]);
        }
    }
    
    let sorted_custom_objectives = custom_objectives.slice().sort((a, b) => {
        return a[0].localeCompare(b[0]);
    });
    
    sorted_custom_objectives.forEach(objective => {
        $('select#stats-other').innerHTML += `<option value="${objective[1]}">${objective[0]}</option>\n`;
    });
}
build_custom_stats_selection();

setup_tabs();

})();