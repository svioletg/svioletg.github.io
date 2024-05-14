import { $, $all } from './utils.js';
class Tab {
    constructor(element, group_id) {
        this.element = element;
        this.group_id = group_id;
        this.name = element.getAttribute('name');
    }
    ;
}
const TAB_CLICKED = new Event('tab-clicked');
let tab_groups = {};
let tab_controlled_elements = [];
let loaded_tab_content = {};
let active_tab;
let previous_tab;
export function new_tab_group_id() {
    let new_id = Math.random().toString(36).substring(2, 7);
    while (tab_groups.hasOwnProperty(new_id)) {
        new_id = Math.random().toString(36).substring(2, 7);
    }
    return new_id;
}
export function get_tab_group_id(element) {
    return element.getAttribute('tab-group-id');
}
export function $tab_group(group_id) {
    return $(`[tab-group-id="${group_id}"]`);
}
export function setup_tabs() {
    $all('button.tab').forEach((button) => {
        // Group tab buttons with the same parent
        if (!button.parentElement.hasAttribute('tab-group-id')) {
            button.parentElement.setAttribute('tab-group-id', new_tab_group_id());
            tab_groups[get_tab_group_id(button.parentElement)] = [];
            loaded_tab_content[get_tab_group_id(button.parentElement)] = null;
        }
        let group_id = get_tab_group_id(button.parentElement);
        let this_tab = new Tab(button, group_id);
        tab_groups[group_id].push(this_tab);
        // And keep track of what elements are being controlled by tab buttons
        if ($(`div[name=${button.name}]`)) {
            tab_controlled_elements.push($(`div[name=${button.name}]`));
        }
        else {
            console.warn(`Nothing is being controlled by tab button with name "${button.name}"`);
        }
        button.addEventListener('click', () => {
            if ((active_tab == this_tab) && (button.classList.contains('active'))) {
                return;
            }
            previous_tab = active_tab;
            active_tab = this_tab;
            document.dispatchEvent(TAB_CLICKED);
        });
    });
    document.addEventListener('tab-clicked', () => {
        tab_groups[active_tab.group_id].forEach((tab) => {
            tab.element.classList.remove('active');
        });
        active_tab.element.classList.add('active');
        // What, if anything, is currently loaded in the desired tab's group
        let loaded_active_group = loaded_tab_content[active_tab.group_id];
        if (loaded_active_group != null) {
            loaded_active_group.classList.add('off');
            loaded_tab_content[active_tab.group_id] = null;
            // i wrote this in a haze last night and it works but i dont remember how
            let previous_loaded_content = $(`div[name="${previous_tab.name}"]`);
            previous_loaded_content.classList.add('off');
            if (active_tab.group_id != previous_tab.group_id) {
                for (let tab of tab_groups[previous_tab.group_id]) {
                    tab.element.classList.remove('active');
                }
            }
            loaded_tab_content[previous_tab.group_id] = null;
        }
        let to_load = $(`div[name="${active_tab.name}"]`);
        to_load.classList.remove('off');
        loaded_tab_content[active_tab.group_id] = to_load;
    });
}
