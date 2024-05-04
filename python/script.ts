const COLLAPSE_BUTTONS: NodeListOf<HTMLButtonElement> = document.querySelectorAll('button.collapsible');
const TERM_TAGS: NodeListOf<HTMLSpanElement> = document.querySelectorAll('span.term');
const TERMINOLOGY: { [key: string]: string } = {
    'test': 'Test tooltip description.'
}

let tooltipTimeout: number | null = null;
let currentTooltip: HTMLDivElement | null = null;

function term_tip_template(description: string): HTMLDivElement {
    let template: HTMLDivElement = document.createElement('div');
    template.classList.add('tooltip');
    template.innerHTML = `${description}`;
    return template;
}

function destroyAllTooltips(): void {
    const tooltips: NodeListOf<HTMLDivElement> = document.querySelectorAll('.tooltip');
    tooltips.forEach((tooltip: HTMLDivElement) => {
        // TODO: Fade-out here
        tooltip.remove();
    });
}

function createTooltip(tag: HTMLSpanElement): void {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }

    if (currentTooltip) {
        currentTooltip.remove();
    }
    currentTooltip = term_tip_template(TERMINOLOGY[tag.id]);

    // Position the tooltip relative to the link
    let linkRect = tag.getBoundingClientRect();
    currentTooltip.style.top = `${linkRect.top + linkRect.height}px`;
    currentTooltip.style.left = `${linkRect.left}px`;

    // Append the tooltip to the body
    document.body.appendChild(currentTooltip);
}

function main(): void {
    // Add collapsing functionality
    COLLAPSE_BUTTONS.forEach((button: HTMLButtonElement) => {
        console.log(button);
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            let nextElement: Element | null = button.nextElementSibling;
            if (!nextElement) {
                console.log(`Couldn't find next element sibling for collapsible button ${button}.`);
            } else if (!(nextElement instanceof HTMLDivElement)) {
                console.log(`Next element sibling for collapsible button ${button} is not a div. Instead: ${nextElement}`);
            } else {
                let content: HTMLDivElement = nextElement;
                console.log(content);
                if (content.style.maxHeight) {
                    content.style.maxHeight = '0';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // Add description boxes to term elements
    TERM_TAGS.forEach((tag: HTMLSpanElement) => {
        tag.addEventListener('mouseover', () => {
            createTooltip(tag);
        });
    
        tag.addEventListener('mouseout', () => {
            tooltipTimeout = setTimeout(destroyAllTooltips, 1000);
        });
    });
}

main();