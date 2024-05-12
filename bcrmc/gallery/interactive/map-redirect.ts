// Main
let params = new URLSearchParams(window.location.search);
let target_map: string = params.get('d') || 'overworld';

window.location.href = window.location.href.split('?')[0] + `${target_map}/`;