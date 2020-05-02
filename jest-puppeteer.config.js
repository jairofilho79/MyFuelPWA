module.exports = {
  launch: {
    headless: process.env.HEADLESS !== "false",
    devtools: process.env.HEADLESS === "false",
    slowMo: process.env.HEADLESS === "false" ? 40 : 0
  },
  browserContext: "default"
}
