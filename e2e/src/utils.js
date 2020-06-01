// module.exports.getText = async (page, selector) => {
//   return await page.$eval(selector, el => el.textContent);
// }

module.exports.getText = async (page, selector) => {
  // return await page.$eval(selector, el => el !== null);
  return await page.$eval(selector, el => {
    try {
      return el.innerText
    } catch (e) {
      return null
    }
  });
}

module.exports.getTexts = async (page, selector) => {
  // return await page.$eval(selector, el => el !== null);
  return await page.$$eval(selector, list => {
    return list.map(data => data.textContent)
  });
}

module.exports.clickElementByTextInside = async (page, selector, clickableName) => {
  await page.waitForSelector(selector);
  await page.$$eval(
    selector,
    (list, clickableName) => list.some(
      item => {
        if(item.textContent.includes(clickableName)) {
          item.click();
          return true;
        }
        return false;
      }),
    clickableName)
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
module.exports.getRandomNumber = (numberLength=2) => {
  return (Math.random()*(10**numberLength)).toFixed(0);
}
module.exports.getLicencePlate = () => {
  return module.exports.getUniqueString(3).toUpperCase() + '-' + module.exports.getRandomNumber(4);
}

module.exports.verifyToastMessage = async (page, expect, titleMessage) => {
  const title = '.toast-title';
  await page.waitForSelector(title);
  const titleText = await module.exports.getText(page, title);
  expect(titleText).toContain(titleMessage);
}
