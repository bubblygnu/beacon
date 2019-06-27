#!/usr/bin/env node

const beacon = require(".");

const argv = process.argv.slice(2);

if (argv.length <= 0) {
  console.log("ERROR: no url supplied");
  return;
}
const args = {
  url: argv.shift(),
  mobile: true,
  runs: 10
};

for (let i = 0; i < argv.length; i++) {
  switch (argv[i]) {
    case "-d":
    case "--desktop":
      args["mobile"] = false;
      break;
    case "-r":
    case "--runs":
      if (isNaN(argv[i + 1])) {
        console.log(
          "ERROR: number of runs must be a number. Usage: e.g. beacon http://example.com --runs 10"
        );
        return;
      } else {
        args["runs"] = +argv[i + 1];
        i++;
        break;
      }
  }
}

console.log(
  `testing ${args.url} on ${args.mobile ? "mobile" : "desktop"} ${
    args.runs
  } times`
);

beacon.run(args.url, (isMobile = args.isMobile), (trialRuns = args.runs));
