var TERMINOLOGY = {
    'test': 'Test tooltip description.'
};
var tooltipTimeout = null;
var currentTooltip = null;
var TERM_TAGS = document.querySelectorAll('span.term');
TERM_TAGS.forEach(function (tag) {
    tag.addEventListener('mouseover', function () {
        createTooltip(tag);
    });
    tag.addEventListener('mouseout', function () {
        tooltipTimeout = setTimeout(destroyAllTooltips, 1000);
    });
});
function term_tip_template(description) {
    var template = document.createElement("div");
    template.classList.add("tooltip");
    template.innerHTML = "".concat(description);
    return template;
}
function destroyAllTooltips() {
    var tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(function (tooltip) {
        // while (tooltip.style.getPropertyValue('opacity') !== '0') {
        //     let currentOpacity: number = parseFloat(tooltip.style.getPropertyValue('opacity'));
        //     tooltip.style.setProperty('opacity', String(currentOpacity - 1));
        // }
        tooltip.remove();
    });
}
function createTooltip(tag) {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    if (currentTooltip) {
        currentTooltip.remove();
    }
    currentTooltip = term_tip_template(TERMINOLOGY[tag.id]);
    // Position the tooltip relative to the link
    var linkRect = tag.getBoundingClientRect();
    currentTooltip.style.top = "".concat(linkRect.top + linkRect.height, "px");
    currentTooltip.style.left = "".concat(linkRect.left, "px");
    // Append the tooltip to the body
    document.body.appendChild(currentTooltip);
}
