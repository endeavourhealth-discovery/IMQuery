
const utils = {
    "toTitleCase": toTitleCase,
}


// checks if a path exists - e.g. for template matching
function toTitleCase(phrase: string): string {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


export { utils };


