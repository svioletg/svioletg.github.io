import { $, $all } from './utils.js'

class Tab {
    public readonly name: string;

    constructor(public element: HTMLElement, public group_id: string) {
        this.name = element.getAttribute('name');
    };
}

const TAB_CLICKED: Event = new Event('tab-clicked');

let tab_groups: { [key: string]: Array<Tab> } = {};
let tab_controlled_elements: Array<HTMLElement> = [];
let loaded_tab_content: { [key: string]: HTMLElement } = {};
let active_tab: Tab;
let previous_tab: Tab;

export function new_tab_group_id(): string {
    let new_id: string = Math.random().toString(36).substring(2,7);
    while (tab_groups.hasOwnProperty(new_id)) {
        new_id = Math.random().toString(36).substring(2,7);
    }
    return new_id;
}

export function get_tab_group_id(element: HTMLElement): string {
    return element.getAttribute('tab-group-id');
}

export function $tab_group(group_id: string): HTMLElement {
    return $(`[tab-group-id="${group_id}"]`);
}

export function setup_tabs(): void {
    $all('button.tab').forEach((button: HTMLButtonElement) => {
        // Group tab buttons with the same parent
        if (!button.parentElement.hasAttribute('tab-group-id')) {
            button.parentElement.setAttribute('tab-group-id', new_tab_group_id());
            tab_groups[get_tab_group_id(button.parentElement)] = [];
            loaded_tab_content[get_tab_group_id(button.parentElement)] = null;
        }

        let group_id: string = get_tab_group_id(button.parentElement);
        let this_tab: Tab = new Tab(button, group_id);

        tab_groups[group_id].push(this_tab);

        // And keep track of what elements are being controlled by tab buttons
        if ($(`div[name=${button.name}]`)) {
            tab_controlled_elements.push($(`div[name=${button.name}]`));
        } else {
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
        tab_groups[active_tab.group_id].forEach((tab: Tab) => {
            tab.element.classList.remove('active');
        });

        active_tab.element.classList.add('active');
        // What, if anything, is currently loaded in the desired tab's group
        let loaded_active_group: HTMLElement = loaded_tab_content[active_tab.group_id];
        if (loaded_active_group != null) {
            loaded_active_group.classList.add('off');
            loaded_tab_content[active_tab.group_id] = null;

            let previous_loaded_content: HTMLElement = $(`div[name="${previous_tab.name}"]`);
            previous_loaded_content.classList.add('off');
            if (active_tab.group_id != previous_tab.group_id) {
                for (let tab of tab_groups[previous_tab.group_id]) {
                    tab.element.classList.remove('active');
                }
            }
            loaded_tab_content[previous_tab.group_id] = null;
        }

        let to_load: HTMLElement = $(`div[name="${active_tab.name}"]`);
        to_load.classList.remove('off');
        loaded_tab_content[active_tab.group_id] = to_load;
    });
}