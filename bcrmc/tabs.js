import { $, $all } from './utils.js';
var tab_groups = {};
var tab_controlled_elements = [];
var last_tab_clicked;
var TAB_CLICKED = new Event('tab-clicked');
export function new_tab_group_id() {
    var new_id = Math.random().toString(36).substring(2, 7);
    while (tab_groups.hasOwnProperty(new_id)) {
        new_id = Math.random().toString(36).substring(2, 7);
    }
    return new_id;
}
export function tab_group_id(element) {
    return element.getAttribute('tab-group-id');
}
export function $tab_group(group_id) {
    return $("[tab-group-id=\"".concat(group_id, "\"]"));
}
export function setup_tabs() {
    $all('button.tab').forEach(function (button) {
        // Group tab buttons with the same parent
        if (!button.parentElement.hasAttribute('tab-group-id')) {
            button.parentElement.setAttribute('tab-group-id', new_tab_group_id());
            tab_groups[tab_group_id(button.parentElement)] = [];
        }
        tab_groups[tab_group_id(button.parentElement)].push(button);
        // And keep track of what elements are being controlled by tab buttons
        if ($("div[name=".concat(button.name, "]"))) {
            tab_controlled_elements.push($("div[name=".concat(button.name, "]")));
        }
        else {
            console.warn("Nothing is being controlled by tab button with name \"".concat(button.name, "\""));
        }
        button.addEventListener('tab-clicked', function () {
            alert('tab-clicked received for button');
            button.classList.remove('active');
            if (button == last_tab_clicked) {
                button.classList.add('active');
            }
        });
        button.addEventListener('click', function () {
            alert('click received for button');
            last_tab_clicked = button;
            $('div').dispatchEvent(TAB_CLICKED);
        });
    });
    tab_controlled_elements.forEach(function (element) {
        console.log('adding a listener to', element);
        element.addEventListener('tab-clicked', function () {
            alert('tab-clicked received for element');
            element.classList.add('off');
            // If the name attribute of a button and tab-controlled element match, show the element
            if (element.getAttribute('name') == last_tab_clicked.name) {
                element.classList.remove('off');
            }
        });
    });
    console.log(tab_groups);
    console.log(tab_controlled_elements);
}
