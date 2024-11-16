var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function json(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(path);
        let data = yield response.json();
        return data;
    });
}
export function $(query) {
    return document.querySelector(query);
}
export function $all(query) {
    return document.querySelectorAll(query);
}
export function extract_number(input_string) {
    return Number(input_string.match(/\d+/)[0]);
}
export function humanize_number(num) {
    const abbrevs = ['', '', '', 'k', 'm', ' billion', 'trillion'];
    const digits = num.toString().length - 1;
    return (num / Math.pow(10, digits)).toPrecision(2).toString() + abbrevs[digits];
}
export function reverse_object(source_object) {
    return Object.fromEntries(Object.entries(source_object).map(([k, v]) => [v, k]));
}
export function to_camel(input_string) {
    let words = input_string.toLowerCase().split(' ');
    let camel_array = [];
    words.forEach(word => {
        camel_array.push(word[0].toUpperCase() + word.slice(1));
    });
    let camel_string = camel_array.join('');
    return camel_string[0].toLowerCase() + camel_string.slice(1);
}
