
exports.testB = testB;
exports.testA = testA;


function testA(){
    console.log('hello');
}

function testB(){
    testA();
    console.log('helloB')
}

