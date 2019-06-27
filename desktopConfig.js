/** @type {LH.Config.Json} */

const config = {
  extends: "lighthouse:default",
  settings: {
    throttlingMethod: "provided",
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1
    },
    onlyCategories: ["performance"],
    onlyAudits: [
      "first-meaningful-paint",
      "first-contentful-paint",
      "speed-index",
      "max-potential-fid",
      "interactive",
      "first-cpu-idle"
    ]
  }
};

module.exports = config;
