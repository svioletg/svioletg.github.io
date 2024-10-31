function enable_simple_css() {
    document.querySelector('#css-simplified').rel = 'stylesheet';
}

function disable_simple_css() {
    document.querySelector('#css-simplified').rel = 'stylesheet alternate';
}

function toggle_simple_css() {
    if (document.querySelector('#css-simplified').rel === 'stylesheet') {
        console.log('disabling');
        disable_simple_css();
    } else {
        console.log('enabling');
        enable_simple_css();
    }
}

if (!document.querySelector('#css-simplified')) {
    document.querySelector('head').innerHTML +=
        `<link rel="stylesheet alternate" type="text/css" href="/bcrmc/bcrmc-simplified.css" id="css-simplified">`;
}

if (!document.querySelector('#simple-css-toggle')) {
    document.querySelector('body').innerHTML = `
    <div id="simple-css-toggle" style="position: fixed; top: 0; left: 0; z-index: 100; width: 10%">
        <button style="width: 100%; font-size: 1em;" onclick="toggle_simple_css()">Toggle Simplified CSS</button>
    </div>
    ` + document.querySelector('body').innerHTML;
}