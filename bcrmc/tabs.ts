import { $, $all } from './utils.js'

let tab_groups: { [key: string]: Array<HTMLElement> } = {};
let tab_controlled_elements: Array<HTMLElement> = [];
let last_tab_clicked: HTMLButtonElement;
const TAB_CLICKED: Event = new Event('tab-clicked');

export function new_tab_group_id(): string {
    let new_id: string = Math.random().toString(36).substring(2,7);
    while (tab_groups.hasOwnProperty(new_id)) {
        new_id = Math.random().toString(36).substring(2,7);
    }
    return new_id;
}

export function tab_group_id(element: HTMLElement): string {
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
            tab_groups[tab_group_id(button.parentElement)] = [];
        }
        tab_groups[tab_group_id(button.parentElement)].push(button);

        // And keep track of what elements are being controlled by tab buttons
        if ($(`div[name=${button.name}]`)) {
            tab_controlled_elements.push($(`div[name=${button.name}]`));
        } else {
            console.warn(`Nothing is being controlled by tab button with name "${button.name}"`);
        }

        button.addEventListener('tab-clicked', () => {
            alert('tab-clicked received for button');
            button.classList.remove('active');
            if (button == last_tab_clicked) {
                button.classList.add('active');
            }
        });

        button.addEventListener('click', () => {
            alert('click received for button');
            last_tab_clicked = button;
            button.dispatchEvent(TAB_CLICKED);
        });
    });
    // TODO: this doesn't get captured!
    tab_controlled_elements.forEach((element: HTMLElement) => {
        console.log('adding a listener to', element);
        element.addEventListener('tab-clicked', () => {
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