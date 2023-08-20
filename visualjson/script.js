// @ts-check

/**
 * @description Returns an object containing JSON loaded from the given URL
 * @param   {string} url URL pointing to JSON file to be read
 * @returns {Promise<any>}
 */
async function json_from_file(url)
{
    return fetch(url)
        .then(response => response.json())
        .then(json => { return json });
}

/**
 * @description Recursively searches through an object, 
 *              building an array with smaller objects containing info of each key
 * @param   {object} obj Object to search
 * @returns {array}
 */
function array_from_object(obj)
{
    let glossary = [];
    for (let key in obj)
    {
        let value = obj[key];
        console.log(`key: ${key}`);
        console.log(`value: ${value}`);
        if (obj.hasOwnProperty(key))
        {
            switch (typeof(value)) {
                case 'object':
                    if (value instanceof Array)
                    {
                        console.log('array!')
                    }
                    else
                    { console.log('recursion!'); array_from_object(value); }
                    break;
                default:
                    console.log(`is ${value}`);
                    break;
            }
        }
        else
        {
            console.log(`!!!!!!!!!!!!!!!!!! no property: ${key}`);
        }
    }
    return glossary;
}

// Begin main script
(async () => {


let json_object = await json_from_file('./example.json');

console.log(array_from_object(json_object));

// End
})();