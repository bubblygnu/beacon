/** @type {LH.Config.Json} */
// mobile 3G
const config = {
  extends: "lighthouse:default",
  settings: {
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.56,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4
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
