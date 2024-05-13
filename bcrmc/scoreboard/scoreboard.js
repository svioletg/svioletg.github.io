var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { $, $all, json, reverse_object } from '../utils.js';
import { setup_tabs } from '../tabs.js';
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const SCOREBOARD_TABLE = $('table.scoreboard');
        const BOARD_DATA = yield json('scoreboard-json/scoreboard-bcr5-feb01.json');
        const PLAYERS = Object.keys(BOARD_DATA.PlayerScores);
        const CATEGORIES_BY_PREFIX = {
            "b.": "Broken",
            "c.": "Crafted",
            "d.": "Killed by",
            "k.": "Killed",
            "u.": "Used",
            "m.": "Mined",
            "p.": "Picked Up",
            "q.": "Dropped",
        };
        const CATEGORIES_BY_TITLE = reverse_object(CATEGORIES_BY_PREFIX);
        const CATEGORY_PREFIX_REGEX = new RegExp(`${Object.values(CATEGORIES_BY_PREFIX).join('|')}`);
        function get_standard_stats_map() {
            let obj_names = [];
            let trimmed_info = {};
            for (const [name, obj_info] of Object.entries(BOARD_DATA.Objectives)) {
                if (Object.keys(CATEGORIES_BY_PREFIX).includes(name.split('.')[0] + '.') && !obj_names.includes(name.split('.')[1])) {
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
        const STANDARD_STATS_BY_TITLE = reverse_object(STANDARD_STATS_BY_NAME);
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
            return options.filter(item => { if (item)
                return item.toLowerCase().includes(search.replace(/ /g, '').toLowerCase()); });
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
        let focus_state = {};
        function new_focus_state_id() {
            let new_id = Math.random().toString(36).substring(2, 7);
            while (focus_state.hasOwnProperty(new_id)) {
                new_id = Math.random().toString(36).substring(2, 7);
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
                focus_state[SUGBOX_FOCUS_ID] = true;
            });
            // TODO: this only works on one of them? sure. i dont care rn
            input.addEventListener('blur', () => {
                focus_state[INPUT_FOCUS_ID] = false;
                setTimeout(() => {
                    // If we've now focused the box itself, say by pressing tab, don't get rid of it yet
                    if (focus_state[SUGBOX_FOCUS_ID])
                        return;
                    fade_out(sugbox);
                }, 100);
            });
            sugbox.addEventListener('blur', () => {
                focus_state[SUGBOX_FOCUS_ID] = false;
            });
        }
        // TODO: Add search suggestions for player names
        let last_search_value = '';
        function refresh_search_suggestions(sugbox_parent, search_string, search_options) {
            let sugbox = sugbox_parent.querySelector('div.search-suggestions');
            let input = sugbox_parent.querySelector('input');
            sugbox.style.setProperty('width', String(input.offsetWidth) + 'px');
            // typescript complains about this if i don't specify <HTMLDivElement> i guess? but just using 'input' up there is fine. ok
            sugbox.style.setProperty('margin-top', String(sugbox_parent.querySelector('div.text-input-sub').offsetHeight) + 'px');
            if (search_string == last_search_value)
                return;
            if (search_string.length > 2) {
                let suggestions = find_close_strings(search_string, search_options);
                if (suggestions.length <= 0) {
                    sugbox.innerHTML = '';
                    fade_out(sugbox);
                    return;
                }
                let new_html = suggestions.map(entry => { return `<button class="search-suggestion-entry">${entry}</button>`; }).join('');
                // Avoid changing the contents if they're going to be the same
                // Resets the :hover CSS property otherwise, can look weird
                if (sugbox.innerHTML != new_html)
                    sugbox.innerHTML = new_html;
                if (focus_state[input.getAttribute('fstate-id')])
                    sugbox.classList.remove('off');
            }
            else {
                sugbox.innerHTML = '';
                if (!sugbox.classList.contains('off'))
                    sugbox.classList.add('fade-out');
            }
            for (let button of sugbox.querySelectorAll('button.search-suggestion-entry')) {
                button.addEventListener('click', () => {
                    let search_input = input;
                    last_search_value = search_input.value = button.textContent;
                });
            }
            last_search_value = search_string;
        }
        function validate_text_input(element, sub_element, sub_message, valid_options, other_conditions) {
            ST_STATS_PLAYER_SUB.style.setProperty('width', String($('input[name="player"]').offsetWidth) + 'px');
            ST_STATS_OBJ_SUB.style.setProperty('width', String($('input[name="object"]').offsetWidth) + 'px');
            sub_message = sub_message.replace(/%value%/g, element.value);
            let is_valid = (valid_options.includes(element.value) || element.value == '*')
                && (other_conditions ? other_conditions.every(Boolean) : true);
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
        for (let box of $all('div.search-suggestions')) {
            box.addEventListener('animationend', () => {
                box.classList.add('off');
                box.classList.remove('fade-out');
            });
        }
        function request_scores(player, category_prefix, objective_name) {
            let every_player = player == '*';
            let every_category = category_prefix == 'all';
            let is_custom = category_prefix == 'cu.';
            let every_objective = objective_name == '*';
            if (!every_player && !BOARD_DATA.PlayerScores[player])
                return undefined;
            let players = every_player ? PLAYERS : [player];
            let categories = every_category ? Object.keys(CATEGORIES_BY_PREFIX) : [category_prefix];
            let objectives = every_objective ? Object.keys(STANDARD_STATS_BY_NAME)
                : is_custom ? Object.keys(CUSTOM_STATS)
                    : [STANDARD_STATS_BY_TITLE[objective_name]];
            let results = {};
            for (let p of players) {
                results[p] = {};
                for (let c of categories) {
                    for (let o of objectives) {
                        let score = BOARD_DATA.PlayerScores[p][c + o];
                        if (!score)
                            continue;
                        results[p][c + o] = score;
                    }
                }
            }
            return results;
        }
        function scores_as_csv(score_results) {
            let csv = [];
            for (const [player, scores] of Object.entries(score_results)) {
                for (const [obj, score] of Object.entries(scores)) {
                    let category_title = CATEGORIES_BY_PREFIX[obj.split('.')[0] + '.'];
                    let objective_title = STANDARD_STATS_BY_NAME[obj.split('.')[1]];
                    csv.push(`${player},${category_title} ${objective_title},${score}`);
                }
            }
            return csv;
        }
        function csv_blob(csv) {
            const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
            return blob;
        }
        function prompt_blob(blob) {
            let link = window.URL.createObjectURL(blob);
            window.location.href = link;
        }
        function build_and_show_results_table(results) {
            const csv = scores_as_csv(results);
            let scoreboard_html = `
    <tr>
        <th>Player</th>
        <th>Objective</th>
        <th>Score</th>
    </tr>
    `;
            SCOREBOARD_TABLE.innerHTML = scoreboard_html + '<p>Building...</p>';
            $('div#search-results').classList.remove('off');
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
            SCOREBOARD_TABLE.innerHTML = scoreboard_html;
            $('div#search-results a#csv-download').addEventListener('click', () => {
                prompt_blob(csv_blob(csv));
            });
        }
        for (let button of $all('button[name="search-button"]')) {
            let section = button.parentElement;
            let player_input = section.querySelector('input[name="player"]');
            if (section.id == 'standard-stats') {
                let category_selector = section.querySelector('select');
                let object_input = section.querySelector('input[name="object"]');
                button.addEventListener('click', () => {
                    let results = request_scores(player_input.value, category_selector.value, object_input.value);
                    build_and_show_results_table(results);
                });
            }
            else if (section.id == 'custom-stats') {
                let objective_selector = section.querySelector('select');
                button.addEventListener('click', () => {
                    let results = request_scores(player_input.value, 'cu.', objective_selector.value);
                    build_and_show_results_table(results);
                });
            }
        }
        // Build stats category selection
        function build_stats_category_selection() {
            ST_STATS_CAT_SELECTOR.innerHTML += `<option value="all">All Categories</option>`;
            for (const [prefix, name] of Object.entries(CATEGORIES_BY_PREFIX)) {
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
        setInterval(() => {
            refresh_search_suggestions(ST_STATS.querySelector('div[name="player"]'), ST_STATS_PLAYER_INPUT.value, PLAYERS);
            refresh_search_suggestions(ST_STATS.querySelector('div[name="object"]'), ST_STATS_OBJ_INPUT.value, Object.keys(STANDARD_STATS_BY_TITLE));
            refresh_search_suggestions(CU_STATS.querySelector('div[name="player"]'), CU_STATS_PLAYER_INPUT.value, PLAYERS);
            let st_category_value = ST_STATS_CAT_SELECTOR.value;
            let st_category_title = CATEGORIES_BY_PREFIX[st_category_value];
            let st_obj_value = ST_STATS_OBJ_INPUT.value;
            let st_obj_name = STANDARD_STATS_BY_TITLE[st_obj_value];
            let objective_name = st_category_value + st_obj_name;
            validate_text_input(ST_STATS_PLAYER_INPUT, ST_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', PLAYERS);
            validate_text_input(CU_STATS_PLAYER_INPUT, CU_STATS_PLAYER_SUB, 'Can\'t find player "%value%"', PLAYERS);
            validate_text_input(ST_STATS_OBJ_INPUT, ST_STATS_OBJ_SUB, `No entry for "%value%" in category "${st_category_title}"`, Object.keys(STANDARD_STATS_BY_TITLE), [(st_obj_value == '*' || st_category_value == 'all') || Object.keys(BOARD_DATA.Objectives).includes(objective_name)]);
        }, 500);
    });
})();
