Sentiment = require('../Sentiment/index');

var sentiment = new Sentiment();
var result = sentiment.analyze('Cats are stupid.');
console.dir(result);    

result = sentiment.analyze('Cats are stupid. But dogs are more awesome.');
console.dir(result);


// {
//     score: -2,
//     comparative: -0.6666666666666666,
//     calculation: [ { stupid: -2 } ],
//     tokens: [ 'cats', 'are', 'stupid' ],
//     words: [ 'stupid' ],
//     positive: [],
//     negative: [ 'stupid' ]
//   }
