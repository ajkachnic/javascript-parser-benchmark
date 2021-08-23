const fs = require("fs");
const c = require("ansi-colors");

const { parse: acornParse } = require("acorn");
const { parseScript: shiftParse } = require("shift-parser");
const { parse: babelParser } = require("@babel/parser");
const esprima = require("esprima");
const seafox = require("seafox");
const hermes = require("hermes-parser");
const meriyah = require("meriyah");

const runs = 2;

const verbose = true;

const benchParser = (str, parse) => {
  const times = [];

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    parse(str);
    times.push(performance.now() - start);
  }

  return times;
};

const loadTests = (tests) =>
  Object.entries(tests)
    .map(([name, path]) => {
      // TODO: Make asynchronus
      return [name, fs.readFileSync(path).toString()];
    })
    .reduce((obj, [name, file]) => ((obj[name] = file), obj), {});

const tests = loadTests({
  three: "tests/three.min.js",
  uppy: "tests/uppy.min.js",
  jquery: "tests/jquery-3.6.0.min.js",
});

const parsers = {
  acorn: (source) => acornParse(source, { ecmaVersion: "latest" }),
  babel: babelParser,
  esprima: esprima.parse,
  hermes: hermes.parse,
  meriyah: meriyah.parseScript,
  seafox: seafox.parseScript,
  shift: shiftParse,
};

const mean = (times) =>
  (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);

const range = (times) => {
  const { first, last } = times.reduce((range, value) => {
    if (range.first > value || range.first == undefined) {
      range.first = value;
    }
    if (range.last < value || range.last == undefined) {
      range.last = value;
    }
    return range;
  }, {});
  return { first, last };
};

const alignLeft = (items) => {
  const longest = items.reduce((l, x) => (x.length > l ? x.length : l), 0);
  return items.map((i) => i + " ".repeat(longest - i.length));
};

const alignRight = (items) => {
  const longest = items.reduce((l, x) => (x.length > l ? x.length : l), 0);
  return items.map((i) => " ".repeat(longest - i.length) + i);
};

const column = (table, n) => table.map((row) => row[n]);
const printResults = (results) => {
  // Sort results in order of successes, then failure
  const successes = results.filter((a) => a.success);

  const table = [];

  successes.map((result) => {
    const { first, last } = range(result.times);
    table.push([
      result.name,
      `${mean(result.times)}ms`,
      `${pad(first.toFixed(2), 8)}ms..${pad(last.toFixed(2), 8)}ms`,
    ]);
  });

  const names = alignLeft(column(table, 0));
  const means = alignRight(column(table, 1));
  const ranges = alignLeft(column(table, 2));
  const formatted = table.map((_, num) => {
    const name = c.bold.green(names[num]);
    const mean = `${c.cyan("mean")} ${means[num]}`;
    const range = `${c.cyan("range")} ${ranges[num]}`;
    return `${name} ${mean} ${range}`;
  });

  console.log(formatted.join("\n") + "\n");

  const failures = results.filter((a) => !a.success);
  const failureNames = alignLeft(failures.map((a) => a.name));
  failureNames.map((name) =>
    console.log(`${c.bold.red(name)} failed to parse`)
  );
};

const pad = (str, n) => " ".repeat(n - str.length) + str;

for (const [name, file] of Object.entries(tests)) {
  console.log(`${c.bold(name)}:`);
  const results = [];

  for (const [parserName, parser] of Object.entries(parsers)) {
    // const spaces = " ".repeat(longestName.length - parserName.length);
    try {
      const times = benchParser(file, parser);
      results.push({
        name: parserName,
        success: true,
        times,
      });
    } catch {
      results.push({
        name: parserName,
        success: false,
      });
    }
  }
  printResults(results);
}
