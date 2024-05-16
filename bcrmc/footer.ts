const FOOTER: HTMLElement = document.querySelector('footer');

const CONTENT: HTMLDivElement = FOOTER.appendChild(document.createElement('div'));

let footer_html: string = `
    <hr>
    <div>
    <p>{ Website written by <a href="https://github.com/svioletg">Seth "Violet" Gibbs</a> }</p>
    <p>{ If you're having any problems with the site, you can <a href="https://github.com/svioletg/svioletg.github.io/issues">submit an issue</a>
    if you have a GitHub account, or let me know directly. }</p>
    </div>
    <hr>
`;

CONTENT.innerHTML = footer_html;