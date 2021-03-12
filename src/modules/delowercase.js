const config = require('../../config');
const fetch = require('node-fetch');
require('dotenv').config();
const url = config.get('commodity-names').url;

module.exports.getCommoditiesMap = () => {
  return  fetch(url)
      .then(res => res.text())
      .then(body => {
        const commoditiesJSON = JSON.parse(body);
        const commoditiesMap = new Map();

        commoditiesJSON.forEach(element =>{
          const lowercase = element.name.toLowerCase().replace(/ /g, '');
          const commodityEntry = {
            name: element.name,
            category: element.category
          }
          commoditiesMap.set(lowercase, commodityEntry)
        })
        return commoditiesMap;
      });
};
