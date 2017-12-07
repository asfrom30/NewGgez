/* let changed but const is not */
let hi = 'hi';
hi = 'changed';

console.log(hi);

/* overwrite test */
let statusCode;

statusCode = statusCode | 500;
console.log('overwrite?')
console.log(statusCode);

statusCode = statusCode | 400;
console.log('overwrite?')
console.log(statusCode);


