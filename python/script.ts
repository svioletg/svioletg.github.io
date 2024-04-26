const TERMINOLOGY: { [key: string]: string } = {
    'test': 'Test tooltip description.'
}

let tooltipTimeout: number | null = null;
let currentTooltip: HTMLDivElement | null = null;

const TERM_TAGS: NodeListOf<HTMLSpanElement> = document.querySelectorAll('span.term');

TERM_TAGS.forEach((tag: HTMLSpanElement) => {
    tag.addEventListener('mouseover', () => {
        createTooltip(tag);
    });

    tag.addEventListener('mouseout', () => {
        tooltipTimeout = setTimeout(destroyAllTooltips, 1000);
    });
});

function term_tip_template(description: string): HTMLDivElement {
    let template: HTMLDivElement = document.createElement("div");
    template.classList.add("tooltip");
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
