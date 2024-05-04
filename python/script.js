var COLLAPSE_BUTTONS = document.querySelectorAll('button.collapsible');
var TERM_TAGS = document.querySelectorAll('span.term');
var TERMINOLOGY = {
    'test': 'Test tooltip description.'
};
var tooltipTimeout = null;
var currentTooltip = null;
function term_tip_template(description) {
    var template = document.createElement('div');
    template.classList.add('tooltip');
    template.innerHTML = "".concat(description);
    return template;
}
function destroyAllTooltips() {
    var tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(function (tooltip) {
        // TODO: Fade-out here
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
function main() {
    // Add collapsing functionality
    COLLAPSE_BUTTONS.forEach(function (button) {
        console.log(button);
        button.addEventListener('click', function () {
            button.classList.toggle('active');
            var nextElement = button.nextElementSibling;
            if (!nextElement) {
                console.log("Couldn't find next element sibling for collapsible button ".concat(button, "."));
            }
            else if (!(nextElement instanceof HTMLDivElement)) {
                console.log("Next element sibling for collapsible button ".concat(button, " is not a div. Instead: ").concat(nextElement));
            }
            else {
                var content = nextElement;
                console.log(content);
                if (content.style.maxHeight) {
                    content.style.maxHeight = '0';
                }
                else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });
    // Add description boxes to term elements
    TERM_TAGS.forEach(function (tag) {
        tag.addEventListener('mouseover', function () {
            createTooltip(tag);
        });
        tag.addEventListener('mouseout', function () {
            tooltipTimeout = setTimeout(destroyAllTooltips, 1000);
        });
    });
}
main();
