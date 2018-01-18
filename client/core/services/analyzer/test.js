
function divide(numerator, denominator){
    if(numerator == undefined || denominator == undefined) return undefined;

    return numerator/denominator;
}

console.log(divide(1, 3));
Number.is
const result = Number.isNumber(divide(1,3));
console.log(result);