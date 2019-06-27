const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");

const auditIds = [
  "first-meaningful-paint",
  "first-contentful-paint",
  "speed-index",
  "max-potential-fid",
  "interactive",
  "first-cpu-idle"
];

const run = async (url, isMobile, trialRuns) => {
  const results = [];

  for (let i = 0; i < trialRuns; i++) {
    console.log(`trial ${i + 1}/${trialRuns}`);
    const result = await runLighthouse(url, isMobile);

    if (result.success) {
      data = JSON.parse(result.message);

      const audits = {};
      for (let auditId of auditIds) {
        audits[auditId] = data["audits"][auditId];
      }
      const performanceScore = getPerformanceScore(data, audits);

      results.push({ ...audits, performanceScore });
    } else {
      console.log(result.message);
      return;
    }
  }

  const summary = {};
  for (let auditId of auditIds) {
    const { description, score, time } = getStatistics(
      results.map(r => r[auditId])
    );

    summary[description] = { score, time };
  }

  summary["Performance Score"] = getMean(
    results.map(r => r["performanceScore"])
  );

  console.log(summary);
};

const runLighthouse = async (url, isMobile) => {
  const config = isMobile
    ? path.join(__dirname, "mobileConfig")
    : path.join(__dirname, "desktopConfig");
  const { stderr, stdout } = await exec(
    `lighthouse ${url} --output json --quiet --chrome-flags="--headless" --config-path=${config}`,
    { maxBuffer: 1024 * 1000 }
  );
  if (stderr) {
    return { success: false, message: stderr };
  }
  return { success: true, message: stdout };
};

const getPerformanceScore = (data, audits) => {
  const weights = data["categories"]["performance"]["auditRefs"].filter(ar =>
    auditIds.includes(ar["id"])
  );
  const performanceScore =
    weights.reduce(
      (a, b) => ({
        ...b,
        weight: a["weight"] + b["weight"] * audits[b["id"]]["score"]
      }),
      { weight: 0 }
    ).weight / weights.map(w => w["weight"]).reduce((a, b) => a + b, 0);

  return performanceScore;
};

const getStatistics = results => {
  const description = results[0]["title"];
  const score = getMean(results.map(r => r["score"]));
  const time = getMean(results.map(r => r["numericValue"]));

  return { description, score, time };
};

const getMean = numbers => {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const std =
    numbers.length === 1
      ? 0
      : Math.sqrt(
          numbers.reduce((a, b) => a + (b - mean) * (b - mean), 0) /
            (numbers.length - 1)
        );
  if (mean < 10) {
    return `${Math.round(mean * 100) / 100} ± ${Math.round(std * 100) / 100}`;
  }
  return `${Math.round(mean)} ± ${Math.round(std)}`;
};

module.exports = { run };
