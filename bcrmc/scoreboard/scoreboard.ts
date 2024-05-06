import {$, $all, json, to_camel} from '../utils.js';

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

function find_close_stat_items(search: string): Array<string> {
    return Object.keys(STATS_ITEMS).filter(item => {
        if (item) { return item.toLowerCase().includes(search.replace(' ', '').toLowerCase()); }
    });
}

function find_closest_stat_item(search: string): string {
    return Object.keys(STATS_ITEMS).find(item => {
        if (item) { return item.toLowerCase().includes(search.replace(' ', '').toLowerCase()); }
    });
}

let _last_search_value: string = '';
function refresh_search_suggestions(search_string: string): void {
    if (search_string == _last_search_value) { return; }

    if (search_string.length > 2) {
        let suggestions: Array<string> = find_close_stat_items(search_string);
        $('div#stats-search-suggestions').innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${STATS_ITEMS[entry]}</button>` }).join('');
        $('div#stats-search-suggestions').classList.remove('off');
    } else {
        $('div#stats-search-suggestions').innerHTML = '';
        $('div#stats-search-suggestions').classList.add('off');
    }

    $('div#stats-search-suggestions').style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');

    $all('button.search-suggestion-entry').forEach(button => {
        button.addEventListener('click', () => {
            let search_input: HTMLInputElement = $('input[name="object"]');
            search_input.value = button.textContent;
        });
    });

    _last_search_value = search_string;
}

const TWO_SECOND_INTERVAL = setInterval(() => {
    refresh_search_suggestions($('input[name="object"]').value);
    // Validate input
    let search_input: HTMLInputElement = $('input[name="object"]');
    let stat_category: string = $('select#stats-categories').value;
    let objective_name: string = '';

    for (const [name, title] of Object.entries(STATS_ITEMS)) {
        if (title == search_input.value) {
            objective_name = name;
        }
    }

    let requested_objective: string = `${stat_category}${objective_name}`;
    if (!BOARD_DATA.Objectives[requested_objective]) {
        search_input.classList.add('invalid');
    } else {
        search_input.classList.remove('invalid');
    }
}, 2000);

$('input[name="object"]').addEventListener('focus', () => {
    $('div#stats-search-suggestions').classList.remove('off');
});

$('input[name="object"]').addEventListener('blur', () => {
    setTimeout(() => {
        $('div#stats-search-suggestions').classList.add('off');
    }, 100);
});

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

for (const [prefix, name] of Object.entries(OBJ_PREFIXES)) {
    $('select#stats-categories').innerHTML += `<option value="${prefix}">${name}</option>`
}

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

$all('button.tab').forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.querySelectorAll('button.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        button.classList.add('active');
    });
});

$('button#search-type-stats').addEventListener('click', () => {
    $('div#stats-type-selector').classList.remove('off');
})

$('button#search-type-other').addEventListener('click', () => {
    $('div#stats-type-selector').classList.add('off');
})

$('button#stats-type-blocks-etc').addEventListener('click', () => {
    $('div#stats-search-blocks-etc').classList.remove('off');
    $('div#stats-search-other').classList.add('off');
})

$('button#stats-type-other-stats').addEventListener('click', () => {
    $('div#stats-search-other').classList.remove('off');
    $('div#stats-search-blocks-etc').classList.add('off');
})

})();