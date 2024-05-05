var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { $, $all, json, to_camel } from '../utils.js';
(function () {
    return __awaiter(this, void 0, void 0, function () {
        function get_valid_stats_items() {
            var obj_names = [];
            var trimmed_info = {};
            for (var _i = 0, _a = Object.entries(BOARD_DATA.Objectives); _i < _a.length; _i++) {
                var _b = _a[_i], name_1 = _b[0], obj_info = _b[1];
                if (Object.keys(OBJ_PREFIXES).includes(name_1.split('.')[0] + '.') && !obj_names.includes(name_1.split('.')[1])) {
                    var generic_name = name_1.split('.')[1];
                    obj_names.push(generic_name);
                    trimmed_info[generic_name] = obj_info.DisplayName.json_dict.text.replace(OBJ_TYPE_REGEX, '').trim();
                }
            }
            obj_names = obj_names.sort();
            var alphabetical_info = {};
            obj_names.forEach(function (obj_name) {
                alphabetical_info[obj_name] = trimmed_info[obj_name];
            });
            return alphabetical_info;
        }
        function find_close_stat_items(search) {
            return Object.keys(STATS_ITEMS).filter(function (item) {
                if (item) {
                    return item.startsWith(to_camel(search));
                }
            });
        }
        function find_closest_stat_item(search) {
            return Object.keys(STATS_ITEMS).find(function (item) {
                if (item) {
                    return item.startsWith(to_camel(search));
                }
            });
        }
        function build_custom_stats_selection() {
            var custom_objectives = [];
            for (var _i = 0, _a = Object.entries(BOARD_DATA.Objectives); _i < _a.length; _i++) {
                var _b = _a[_i], name_2 = _b[0], obj_info = _b[1];
                if (name_2.startsWith('cu.')) {
                    var title = obj_info.DisplayName.json_dict.text;
                    custom_objectives.push([title, name_2]);
                }
            }
            var sorted_custom_objectives = custom_objectives.slice().sort(function (a, b) {
                return a[0].localeCompare(b[0]);
            });
            sorted_custom_objectives.forEach(function (objective) {
                $('select#stats-other').innerHTML += "<option value=\"".concat(objective[1], "\">").concat(objective[0], "</option>\n");
            });
        }
        var BOARD_DATA, OBJ_PREFIXES, OBJ_TYPE_REGEX, STATS_ITEMS, _i, _a, _b, prefix, name_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, json('scoreboard-json/scoreboard-bcr5-feb01.json')];
                case 1:
                    BOARD_DATA = _c.sent();
                    OBJ_PREFIXES = {
                        "b.": "Broken",
                        "c.": "Crafted",
                        "d.": "Killed By",
                        "k.": "Killed",
                        "u.": "Used",
                        "m.": "Mined",
                        "p.": "Picked Up",
                        "q.": "Dropped",
                    };
                    OBJ_TYPE_REGEX = new RegExp("".concat(Object.values(OBJ_PREFIXES).join('|')));
                    STATS_ITEMS = get_valid_stats_items();
                    console.log(STATS_ITEMS);
                    $('button#search-button').addEventListener('click', function () {
                        var stat_category = $('select#stats-categories').value;
                        console.log(stat_category);
                        var search_input = $('input[name="object"]');
                        var search_string = search_input.value;
                        console.log(find_close_stat_items(search_string));
                        var closest_stat_item = find_closest_stat_item(search_string);
                        if (closest_stat_item) {
                            var requested_objective = "".concat(stat_category).concat(closest_stat_item);
                            if (!BOARD_DATA.Objectives[requested_objective]) {
                                search_input.classList.add('invalid');
                                return;
                            }
                            ;
                            search_input.classList.remove('invalid');
                            search_input.setAttribute('stored_value', requested_objective);
                            search_input.value = STATS_ITEMS[closest_stat_item];
                        }
                    });
                    for (_i = 0, _a = Object.entries(OBJ_PREFIXES); _i < _a.length; _i++) {
                        _b = _a[_i], prefix = _b[0], name_3 = _b[1];
                        $('select#stats-categories').innerHTML += "<option value=\"".concat(prefix, "\">").concat(name_3, "</option>");
                    }
                    build_custom_stats_selection();
                    $all('button.tab').forEach(function (button) {
                        button.addEventListener('click', function () {
                            button.parentElement.querySelectorAll('button.tab').forEach(function (tab) {
                                tab.classList.remove('active');
                            });
                            button.classList.add('active');
                        });
                    });
                    $('button#search-type-stats').addEventListener('click', function () {
                        $('div#stats-type-selector').classList.remove('off');
                    });
                    $('button#search-type-other').addEventListener('click', function () {
                        $('div#stats-type-selector').classList.add('off');
                    });
                    $('button#stats-type-blocks-etc').addEventListener('click', function () {
                        $('div#stats-search-blocks-etc').classList.remove('off');
                        $('div#stats-search-other').classList.add('off');
                    });
                    $('button#stats-type-other-stats').addEventListener('click', function () {
                        $('div#stats-search-other').classList.remove('off');
                        $('div#stats-search-blocks-etc').classList.add('off');
                    });
                    return [2 /*return*/];
            }
        });
    });
})();
