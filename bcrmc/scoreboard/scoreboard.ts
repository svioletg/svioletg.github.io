import {json} from '../utils.js';

(async function () {

console.log('SCOREBOARD.TS');
const data: object = await json('scoreboard-json/scoreboard-bcr5-feb01.json');
console.log(data);

});