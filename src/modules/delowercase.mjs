import config from '../../config/index.mjs';
import fetch from "node-fetch";
import schedule from 'node-schedule';
import Debug from 'debug';

const url = config.get('commodity-names').url;
const debug = Debug('ed-commodities-api:delowercase');
const commoditiesMap = new Map();

const getCommoditiesMap = () => {
  return loadCommodities();
};

const loadCommodities = () => {
  commoditiesMap.clear();
  return fetch(url)
      .then(res => res.text())
      .then(body => {
        const rows = body.split('\r\n').slice(1);
        rows.forEach(row => {
          if (row !== "") {
            const elements = row.split(',');
            const key = elements[1].toLowerCase();
            const value = {
              name: elements[3],
              category: elements[2]
            };
            commoditiesMap.set(key, value);
          }
        });
        return commoditiesMap;
      });
};

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(4, 5)];
rule.hour = 15;
rule.minute = 0;
// eslint-disable-next-line no-unused-vars
const job = schedule.scheduleJob(rule, () => {
  debug("Reloading commodities names");
  return loadCommodities();
});

export default getCommoditiesMap;
