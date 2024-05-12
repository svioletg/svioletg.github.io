// Main
var params = new URLSearchParams(window.location.search);
var target_map = params.get('d') || 'overworld';
window.location.href = window.location.href.split('?')[0] + "".concat(target_map, "/");
