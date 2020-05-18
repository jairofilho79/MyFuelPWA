module.exports.getText = async (page, selector) => {
  return await page.$eval(selector, el => el.textContent);
}

module.exports.getElement = async (page, selector) => {
  // return await page.$eval(selector, el => el !== null);
  return await page.$eval(selector, el => {
    try {
      return el.innerText
    } catch (e) {
      return null
    }
  });
}

module.exports.getElements = async (page, selector) => {
  // return await page.$eval(selector, el => el !== null);
  return await page.$$eval(selector, list => {
    return list.map(data => data.textContent)
  });
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
