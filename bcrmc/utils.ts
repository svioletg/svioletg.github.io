export async function json(path: string) {
    let response = await fetch(path);
    let data = await response.json();
    return data;
}

export function extract_number(input_string: string): number {
    return Number(input_string.match(/\d+/)[0])
}