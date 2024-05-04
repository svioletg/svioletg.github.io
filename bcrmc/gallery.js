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
import { extract_number, json } from './utils.js';
(function () {
    return __awaiter(this, void 0, void 0, function () {
        function author_from_filename(filename) {
            return PHOTO_AUTHORS[filename.split('-')[0]];
        }
        function create_figure(image_filename, image_title, server_season) {
            var figure_string = FIGURE_TEMPLATE
                .replace(/%IMAGE%/g, image_filename)
                .replace(/%TITLE%/g, image_title)
                .replace(/%SEASON%/g, server_season)
                .replace(/%AUTHOR%/g, author_from_filename(image_filename));
            return figure_string;
        }
        function build_gallery(server_season) {
            var gallery_container = document.querySelector('div#gallery-collection');
            var new_gallery = document.createElement('div');
            new_gallery.classList.add('gallery', 'smaller');
            new_gallery.setAttribute('name', server_season);
            // Run through images
            for (var _i = 0, _a = Object.entries(PHOTO_TITLES[server_season]); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                var new_figure = create_figure(key, value, server_season);
                new_gallery.innerHTML += new_figure;
            }
            // Add it
            gallery_container.appendChild(new_gallery);
        }
        function add_gallery_nav_arrows() {
            var gallery_titles = document.querySelectorAll('div.gallery-title');
            gallery_titles.forEach(function (title) {
                var current_page_name = title.getAttribute('name');
                var current_page_number = extract_number(current_page_name);
                var left_arrow = document.createElement('button');
                left_arrow.classList.add('bttn', 'arrow');
                left_arrow.addEventListener('click', function () { switch_gallery("bcr".concat(current_page_number - 1)); });
                left_arrow.innerHTML = '&lt;';
                var right_arrow = document.createElement('button');
                right_arrow.classList.add('bttn', 'arrow');
                right_arrow.addEventListener('click', function () { switch_gallery("bcr".concat(current_page_number + 1)); });
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
        }
        function update_heading_anchors(server_season) {
            console.log(server_season);
            var heading_anchors = document.querySelectorAll('a.heading-link');
            heading_anchors.forEach(function (a) {
                console.log(a.href);
                if (a.href.includes('?s=bcr')) {
                    console.log('replacing', a.href);
                    console.log("?s=".concat(server_season));
                    a.href = a.href.replace(/\?s=bcr\d+/, "?s=".concat(server_season));
                    console.log(a.href);
                }
                else {
                    var root = a.href.split('#')[0];
                    var stem = a.href.split('#')[0];
                    console.log(root, stem);
                    a.href = root + "?s=".concat(server_season, "#") + stem;
                    console.log('new', a.href);
                }
            });
        }
        function switch_gallery(server_season) {
            // Swap page theme
            var body = document.querySelector('body');
            body.classList.remove(body.classList.toString());
            body.classList.add(server_season);
            // Make the gallery, if it doesn't exist
            if (!document.querySelector("div.gallery[name=\"".concat(server_season, "\"]"))) {
                build_gallery(server_season);
            }
            // Change out stuff depending on the relevant server season
            ['div.gallery-title', 'div.gallery-maps', 'div.gallery-files', 'div.gallery'].forEach(function (selector) {
                var divs = document.querySelectorAll(selector);
                divs.forEach(function (div) {
                    div.classList.add('off');
                });
            });
            document.querySelectorAll("div[name=\"".concat(server_season, "\"]")).forEach(function (div) { div.classList.remove('off'); });
            update_heading_anchors(server_season);
        }
        var LATEST_SERVER, FIGURE_TEMPLATE, PHOTO_AUTHORS, PHOTO_TITLES, params, initial_season;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    LATEST_SERVER = 5;
                    FIGURE_TEMPLATE = "<figure style=\"background-image: url('/bcrmc/%SEASON%/jpg/%IMAGE%.jpg');\">" +
                        "<figcaption>%TITLE%<a href=\"/bcrmc/%SEASON%/png/%IMAGE%.png\">[PNG]</a>" +
                        "<br><sup>(from %AUTHOR%)</sup></figcaption></figure>";
                    PHOTO_AUTHORS = {
                        "desu": "Desu",
                        "mar": "Mar",
                        "vi": "Violet"
                    };
                    return [4 /*yield*/, json('/bcrmc/photo_titles.json')];
                case 1:
                    PHOTO_TITLES = _a.sent();
                    params = new URLSearchParams(window.location.search);
                    initial_season = params.get('s') || "bcr".concat(LATEST_SERVER);
                    add_gallery_nav_arrows();
                    switch_gallery(initial_season);
                    return [2 /*return*/];
            }
        });
    });
})();
