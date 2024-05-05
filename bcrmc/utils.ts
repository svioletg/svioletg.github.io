export async function json(path: string) {
    let response = await fetch(path);
    let data = await response.json();
    return data;
}

export function $(query: string): any {
    return document.querySelector(query);
}

export function $all(query: string): NodeListOf<HTMLElement> {
    return document.querySelectorAll(query);
}

export function extract_number(input_string: string): number {
    return Number(input_string.match(/\d+/)[0]);
}

export function to_camel(input_string: string): string {
    let words: Array<string> = input_string.toLowerCase().split(' ');
    let camel_array: Array<string> = [];
    words.forEach(word => {
        camel_array.push(word[0].toUpperCase() + word.slice(1));
    });
    let camel_string: string = camel_array.join('');
    return camel_string[0].toLowerCase() + camel_string.slice(1);
}