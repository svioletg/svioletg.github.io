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
        const CATEGORY_PREFIXES = {
            "b.": "Broken",
            "c.": "Crafted",
            "d.": "Killed by",
            "k.": "Killed",
            "u.": "Used",
            "m.": "Mined",
            "p.": "Picked Up",
            "q.": "Dropped",
        };
        const CATEGORY_PREFIX_REGEX = new RegExp(`${Object.values(CATEGORY_PREFIXES).join('|')}`);
        function get_standard_stats_map() {
            let obj_names = [];
            let trimmed_info = {};
            for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
                if (Object.keys(CATEGORY_PREFIXES).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
                    let generic_name = name.split('.')[1];
                    obj_names.push(generic_name);
                    trimmed_info[generic_name] = obj_info.DisplayName.json_dict.text.replace(CATEGORY_PREFIX_REGEX, '').trim();
                }
            }
            obj_names = obj_names.sort();
            let alphabetical_info = {};
            for (let name of obj_names) {
                alphabetical_info[name] = trimmed_info[name];
            }
            ;
            return alphabetical_info;
        }
        // An objective's NAME is what you'd use in a command, e.g. m.oakLog
        // An objective's TITLE is what Minecraft calls its "Display Name", e.g. "Oak Log Mined"
        const STANDARD_STATS_BY_NAME = get_standard_stats_map();
        const STANDARD_STATS_BY_TITLE = Object.fromEntries(Object.entries(STANDARD_STATS_BY_NAME).map(([k, v]) => [v, k]));
        function get_custom_stats() {
            let custom_objectives = {};
            for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
                if (name.startsWith('cu.')) {
                    let title = obj_info.DisplayName.json_dict.text;
                    custom_objectives[name] = title;
                }
            }
            let sorted_names = Object.keys(custom_objectives).sort();
            let sorted_custom_objectives = {};
            for (let name of sorted_names) {
                sorted_custom_objectives[name] = custom_objectives[name];
            }
            return sorted_custom_objectives;
        }
        const CUSTOM_STATS = get_custom_stats();
        function find_close_stat_items(search) {
            return Object.keys(STANDARD_STATS_BY_NAME).filter(item => {
                if (item)
                    return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
            });
        }
        const ST_STATS_PLAYER_INPUT = $('div#standard-stats input[name="player"]');
        const ST_STATS_PLAYER_SUB = $('div#standard-stats div[name="player"] div.text-input-sub');
        const ST_STATS_PLAYER_SUGBOX = $('div#standard-stats div[name="player"] div.search-suggestions');
        const ST_STATS_OBJ_INPUT = $('div#standard-stats input[name="object"]');
        const ST_STATS_OBJ_SUB = $('div#standard-stats div[name="object"] div.text-input-sub');
        const ST_STATS_OBJ_SUGBOX = $('div#standard-stats div[name="object"] div.search-suggestions');
        const CU_STATS_PLAYER_INPUT = $('div#custom-stats input[name="player"]');
        const CU_STATS_PLAYER_SUB = $('div#custom-stats div[name="player"] div.text-input-sub');
        const CU_STATS_PLAYER_SUGBOX = $('div#custom-stats div[name="player"] div.search-suggestions');
        function hide_suggestions() {
            if (!ST_STATS_OBJ_SUGBOX.classList.contains('off'))
                ST_STATS_OBJ_SUGBOX.classList.add('fade-out');
        }
        // Show and hide search suggestions depending on input box focus
        let initial_search_focus = false;
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
        let last_search_value = '';
        function refresh_search_suggestions(search_string) {
            ST_STATS_PLAYER_SUB.style.setProperty('width', String($('input[name="player"]').offsetWidth) + 'px');
            ST_STATS_OBJ_SUB.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
            ST_STATS_OBJ_SUGBOX.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
            ST_STATS_OBJ_SUGBOX.style.setProperty('margin-top', String(ST_STATS_OBJ_SUB.offsetHeight) + 'px');
            search_string = search_string.toLowerCase();
            if (!initial_search_focus)
                return;
            if (search_string == last_search_value)
                return;
            if (search_string.length > 2) {
                let suggestions = find_close_stat_items(search_string);
                if (suggestions.length <= 1 && suggestions[0] == STANDARD_STATS_BY_TITLE[search_string]) {
                    ST_STATS_OBJ_SUGBOX.innerHTML = '';
                    hide_suggestions();
                    return;
                }
                ST_STATS_OBJ_SUGBOX.innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${STANDARD_STATS_BY_NAME[entry]}</button>`; }).join('');
                ST_STATS_OBJ_SUGBOX.classList.remove('off');
            }
            else {
                ST_STATS_OBJ_SUGBOX.innerHTML = '';
                if (!ST_STATS_OBJ_SUGBOX.classList.contains('off'))
                    ST_STATS_OBJ_SUGBOX.classList.add('fade-out');
            }
            $all('button.search-suggestion-entry').forEach((button) => {
                button.addEventListener('click', () => {
                    let search_input = $('input[name="object"]');
                    last_search_value = search_input.value = button.textContent;
                });
            });
            last_search_value = search_string;
        }
        function validate_text_input(element, sub_element, sub_message, valid_options) {
            sub_message = sub_message.replace(/%value/g, element.value);
            if (!valid_options[element.value]) {
                sub_element.innerHTML = sub_message;
                sub_element.classList.add('invalid');
                sub_element.classList.remove('off');
                element.classList.add('invalid');
            }
            else {
                sub_element.innerHTML = '';
                sub_element.classList.remove('invalid');
                sub_element.classList.add('off');
                element.classList.remove('invalid');
            }
        }
        const SEARCH_SUGGESTIONS_UPDATE_INTERVAL = setInterval(() => {
            refresh_search_suggestions($('input[name="object"]').value);
            // Validate input
            let stat_category = $('select#stats-categories').value;
            let category_name = CATEGORY_PREFIXES[stat_category];
            let objective_name = '';
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
        function request_scores(player, category_prefix, objective_name) {
            let every_player = player == '*';
            let every_category = category_prefix == 'all';
            let every_objective = objective_name == '*';
            if (!every_player && !BOARD_DATA.PlayerScores[player])
                return undefined;
            let players = every_player ? Object.keys(BOARD_DATA.PlayerScores) : [player];
            let categories = every_category ? Object.keys(CATEGORY_PREFIXES) : [category_prefix];
            let objectives = every_objective ? Object.keys(STANDARD_STATS_BY_NAME) : [STANDARD_STATS_BY_TITLE[objective_name]];
            let results;
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
        function build_stats_category_selection() {
            $('select#stats-categories').innerHTML += `<option value="all">All Categories</option>`;
            for (const [prefix, name] of Object.entries(CATEGORY_PREFIXES)) {
                $('select#stats-categories').innerHTML += `<option value="${prefix}">${name}</option>`;
            }
        }
        build_stats_category_selection();
        function build_custom_stats_selection() {
            for (const [name, title] of Object.entries(CUSTOM_STATS)) {
                $('select#stats-other').innerHTML += `<option value="${name}">${title}</option>\n`;
            }
            ;
        }
        build_custom_stats_selection();
        setup_tabs();
    });
})();
