function test(a, b, callback) {
    console.log(a);
    console.log(b);
    if(callback != undefined) callback();
}



test('1', '2', function() {
    console.log('working');
})

test('1', '2');