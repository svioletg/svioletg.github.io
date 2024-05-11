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
        const PLAYERS = Object.keys(BOARD_DATA.PlayerScores);
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
                    custom_objectives[name.split('cu.')[1]] = title;
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
        function find_close_strings(search, options) {
            return options.filter(item => {
                if (item)
                    return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase());
            });
        }
        const ST_STATS = $('div#standard-stats');
        const CU_STATS = $('div#custom-stats');
        const ST_STATS_PLAYER_INPUT = ST_STATS.querySelector('input[name="player"]');
        const ST_STATS_PLAYER_SUB = ST_STATS.querySelector('div[name="player"] div.text-input-sub');
        const ST_STATS_PLAYER_SUGBOX = ST_STATS.querySelector('div[name="player"] div.search-suggestions');
        const ST_STATS_CAT_SELECTOR = ST_STATS.querySelector('select');
        const ST_STATS_OBJ_INPUT = ST_STATS.querySelector('input[name="object"]');
        const ST_STATS_OBJ_SUB = ST_STATS.querySelector('div[name="object"] div.text-input-sub');
        const ST_STATS_OBJ_SUGBOX = ST_STATS.querySelector('div[name="object"] div.search-suggestions');
        const CU_STATS_PLAYER_INPUT = CU_STATS.querySelector('input[name="player"]');
        const CU_STATS_PLAYER_SUB = CU_STATS.querySelector('div[name="player"] div.text-input-sub');
        const CU_STATS_PLAYER_SUGBOX = CU_STATS.querySelector('div[name="player"] div.search-suggestions');
        const CU_STATS_OBJ_SELECTOR = CU_STATS.querySelector('select');
        function fade_out(element) {
            if (!element.classList.contains('off'))
                element.classList.add('fade-out');
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
        let last_search_value = '';
        function refresh_search_suggestions(sugbox_parent, search_string, search_options) {
            let sugbox = sugbox_parent.querySelector('div.search-suggestions');
            sugbox.style.setProperty('width', String(sugbox_parent.querySelector('input').offsetWidth) + 'px');
            // typescript complains about this if i don't specify <HTMLDivElement> i guess? but just using 'input' up there is fine. ok
            sugbox.style.setProperty('margin-top', String(sugbox_parent.querySelector('div.text-input-sub').offsetHeight) + 'px');
            search_string = search_string.toLowerCase();
            if (search_string == last_search_value)
                return;
            if (search_string.length > 2) {
                let suggestions = find_close_strings(search_string, search_options);
                if (suggestions.length <= 1) {
                    sugbox.innerHTML = '';
                    fade_out(sugbox);
                    return;
                }
                sugbox.innerHTML = suggestions.map(entry => { return `<button class="search-suggestion-entry">${entry}</button>`; }).join('');
                sugbox.classList.remove('off');
            }
            else {
                sugbox.innerHTML = '';
                if (!sugbox.classList.contains('off'))
                    sugbox.classList.add('fade-out');
            }
            for (let button of $all('button.search-suggestion-entry')) {
                button.addEventListener('click', () => {
                    let search_input = sugbox_parent.querySelector('input');
                    last_search_value = search_input.value = button.textContent;
                });
            }
            last_search_value = search_string;
        }
        function validate_text_input(element, sub_element, sub_message, valid_options, other_conditions) {
            ST_STATS_PLAYER_SUB.style.setProperty('width', String($('input[name="player"]').offsetWidth) + 'px');
            ST_STATS_OBJ_SUB.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
            sub_message = sub_message.replace(/%value%/g, element.value);
            let is_valid = (valid_options.includes(element.value) || element.value == '*') && (other_conditions ? other_conditions.every(Boolean) : true);
            if (is_valid) {
                sub_element.innerHTML = '';
                sub_element.classList.remove('invalid');
                sub_element.classList.add('off');
                element.classList.remove('invalid');
            }
            else {
                sub_element.innerHTML = sub_message;
                sub_element.classList.add('invalid');
                sub_element.classList.remove('off');
                element.classList.add('invalid');
            }
        }
        setInterval(() => {
            refresh_search_suggestions(ST_STATS.querySelector('div[name="player"]'), ST_STATS_PLAYER_INPUT.value, PLAYERS);
            refresh_search_suggestions(ST_STATS.querySelector('div[name="object"]'), ST_STATS_OBJ_INPUT.value, Object.keys(STANDARD_STATS_BY_NAME));
            let st_category_value = ST_STATS_CAT_SELECTOR.value;
            let st_category_title = CATEGORY_PREFIXES[st_category_value];
            let st_obj_value = ST_STATS_OBJ_INPUT.value;
            let st_obj_name = STANDARD_STATS_BY_TITLE[st_obj_value];
            let objective_name = st_category_value + st_obj_name;
            validate_text_input(ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', PLAYERS);
            validate_text_input(ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUB, `No entry for "%value%" in category "${st_category_title}"`, Object.keys(STANDARD_STATS_BY_TITLE), [Object.keys(BOARD_DATA.Objectives).includes(objective_name)]);
        }, 500);
        for (let box of $all('div.search-suggestions')) {
            box.addEventListener('animationend', () => {
                box.classList.add('off');
                box.classList.remove('fade-out');
            });
        }
        // Request scores
        function request_scores(player, category_prefix, objective_name) {
            let every_player = player == '*';
            let every_category = category_prefix == 'all';
            let is_custom = category_prefix == 'cu.';
            let every_objective = objective_name == '*';
            if (!every_player && !BOARD_DATA.PlayerScores[player])
                return undefined;
            let players = every_player ? PLAYERS : [player];
            let categories = every_category ? Object.keys(CATEGORY_PREFIXES) : [category_prefix];
            let objectives = every_objective ? Object.keys(STANDARD_STATS_BY_NAME)
                : is_custom ? Object.keys(CUSTOM_STATS)
                    : [STANDARD_STATS_BY_TITLE[objective_name]];
            let results;
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
            let section = button.parentElement;
            let player_input = section.querySelector('input[name="player"]');
            if (section.id == 'standard-stats') {
                let category_selector = section.querySelector('select');
                let object_input = section.querySelector('input[name="object"]');
                button.addEventListener('click', () => {
                    request_scores(player_input.value, category_selector.value, object_input.value);
                });
            }
            else if (section.id == 'custom-stats') {
                let objective_selector = section.querySelector('select');
                button.addEventListener('click', () => {
                    request_scores(player_input.value, 'cu.', objective_selector.value);
                });
            }
        }
        // Build stats category selection
        function build_stats_category_selection() {
            ST_STATS_CAT_SELECTOR.innerHTML += `<option value="all">All Categories</option>`;
            for (const [prefix, name] of Object.entries(CATEGORY_PREFIXES)) {
                ST_STATS_CAT_SELECTOR.innerHTML += `<option value="${prefix}">${name}</option>`;
            }
        }
        build_stats_category_selection();
        function build_custom_stats_selection() {
            for (const [name, title] of Object.entries(CUSTOM_STATS)) {
                CU_STATS_OBJ_SELECTOR.innerHTML += `<option value="${name}">${title}</option>\n`;
            }
            ;
        }
        build_custom_stats_selection();
        setup_tabs();
    });
})();
