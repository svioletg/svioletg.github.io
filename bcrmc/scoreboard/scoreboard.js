var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $, $all, json } from '../utils.js';
import { setup_tabs } from '../tabs.js';
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const BOARD_DATA = yield json('scoreboard-json/scoreboard-bcr5-feb01.json');
        const OBJ_PREFIXES = {
            "b.": "Broken",
            "c.": "Crafted",
            "d.": "Killed by",
            "k.": "Killed",
            "u.": "Used",
            "m.": "Mined",
            "p.": "Picked Up",
            "q.": "Dropped",
        };
        const OBJ_TYPE_REGEX = new RegExp(`${Object.values(OBJ_PREFIXES).join('|')}`);
        function get_valid_stats_items() {
            let obj_names = [];
            let trimmed_info = {};
            for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
                if (Object.keys(OBJ_PREFIXES).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
                    let generic_name = name.split('.')[1];
                    obj_names.push(generic_name);
                    trimmed_info[generic_name] = obj_info.DisplayName.json_dict.text.replace(OBJ_TYPE_REGEX, '').trim();
                }
            }
            obj_names = obj_names.sort();
            let alphabetical_info = {};
            obj_names.forEach(obj_name => {
                alphabetical_info[obj_name] = trimmed_info[obj_name];
            });
            return alphabetical_info;
        }
        const STATS_ITEMS = get_valid_stats_items();
        function find_close_stat_items(search) {
            return Object.keys(STATS_ITEMS).filter(item => {
                if (item) {
                    return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
                }
            });
        }
        function find_closest_stat_item(search) {
            return Object.keys(STATS_ITEMS).find(item => {
                if (item) {
                    return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
                }
            });
        }
        let last_search_value = '';
        function refresh_search_suggestions(search_string) {
            if (search_string == last_search_value) {
                return;
            }
            if (search_string.length > 2) {
                let suggestions = find_close_stat_items(search_string);
                if (suggestions.length == 0) {
                    $('div#stats-search-suggestions').innerHTML = '';
                    $('div#stats-search-suggestions').classList.add('off');
                    return;
                }
                $('div#stats-search-suggestions').innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${STATS_ITEMS[entry]}</button>`; }).join('');
                $('div#stats-search-suggestions').classList.remove('off');
            }
            else {
                $('div#stats-search-suggestions').innerHTML = '';
                $('div#stats-search-suggestions').classList.add('off');
            }
            $('div#stats-search-suggestions').style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
            $all('button.search-suggestion-entry').forEach((button) => {
                button.addEventListener('click', () => {
                    let search_input = $('input[name="object"]');
                    last_search_value = search_input.value = button.textContent;
                });
            });
            last_search_value = search_string;
        }
        const SEARCH_SUGGESTIONS_UPDATE_INTERVAL = setInterval(() => {
            refresh_search_suggestions($('input[name="object"]').value);
            // Validate input
            let search_input = $('input[name="object"]');
            let stat_category = $('select#stats-categories').value;
            let objective_name = '';
            for (const [name, title] of Object.entries(STATS_ITEMS)) {
                if (title == search_input.value) {
                    objective_name = name;
                }
            }
            let requested_objective = `${stat_category}${objective_name}`;
            if (!BOARD_DATA.Objectives[requested_objective]) {
                // TODO: Add a tooltip explaining the invalidity
                search_input.classList.add('invalid');
            }
            else {
                search_input.classList.remove('invalid');
            }
        }, 1000);
        // Show and hide search suggestions depending on input box focus
        $('input[name="object"]').addEventListener('focus', () => {
            if ($('div#stats-search-suggestions').children.length > 0) {
                $('div#stats-search-suggestions').classList.remove('off');
            }
        });
        $('input[name="object"]').addEventListener('blur', () => {
            setTimeout(() => {
                $('div#stats-search-suggestions').classList.add('off');
            }, 100);
        });
        $('button#search-button').addEventListener('click', () => {
            // TODO: will need redoing!
            let search_input = $('input[name="object"]');
            let stat_category = $('select#stats-categories').value;
            let search_string = search_input.value;
            let closest_stat_item = find_closest_stat_item(search_string);
            if (closest_stat_item) {
                let requested_objective = `${stat_category}${closest_stat_item}`;
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
            $('select#stats-categories').innerHTML += `<option value="${prefix}">${name}</option>`;
        }
        function build_custom_stats_selection() {
            let custom_objectives = [];
            for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
                if (name.startsWith('cu.')) {
                    let title = obj_info.DisplayName.json_dict.text;
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
    });
})();
