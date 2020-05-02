module.exports.getText = async (page, selector) => {
  return await page.$eval(selector, el => el.textContent);
}
module.exports.exists = async (page, selector) => {
  return await page.$eval(selector, el => el !== null);
}
