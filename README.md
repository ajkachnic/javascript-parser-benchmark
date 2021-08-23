# javascript-parser-benchmark

A benchmark of popular JavaScript parsing tools

## Contestants

- [`acorn`](https://github.com/acornjs/acorn)
- [`@babel/parser](https://babeljs.io/docs/en/babel-parser/)
- [`esprima`](https://github.com/jQuery/esprima)
- [`hermes-parser`](https://github.com/facebook/hermes/tree/main/tools/hermes-parser/js/hermes-parser)
- [`meriyah`](https://github.com/meriyah/meriyah/)
- [`seafox`](https://github.com/KFlash/seafox)
- [`shift-parser`](https://github.com/shapesecurity/shift-parser-js)
- ~~[`recast`](https://github.com/benjamn/recast)~~ Recast was easily 30x slower than all the other parsers, so I took it out, so I wouldn't have to wait for it

## Results

![https://ninja.dog/Ra7bmo.png](A table of the results drawn in the terminal, with `meriyah` winning in every category)

## Running the benchmark

To run it on your own machine:

- Clone the repo
- Run `npm install` (or use your package manager of choice)
- Run `node bench.js`
- Wait a bit
