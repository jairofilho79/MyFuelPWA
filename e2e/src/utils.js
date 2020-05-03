module.exports.getText = async (page, selector) => {
  return await page.$eval(selector, el => el.textContent);
}
module.exports.exists = async (page, selector) => {
  return await page.$eval(selector, el => el !== null);
}
module.exports.clearForm = async (page, selector) => {
  await page.evaluate(
    selector => document.querySelector(selector).reset(),
    selector
    );
}
module.exports.getUniqueString = (strLength=5) => {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, strLength);
}
