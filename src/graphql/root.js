const Station = require('../models/station');

module.exports = {
  station: (args, context, info) => {
    const queriedFields = info.fieldNodes[0].selectionSet.selections;
    const projection = formProjection(queriedFields);

    return Station.findOne({ stationName: args.stationName }, projection)
      .then(res => {
        return res._doc;
      });
  },

  stations: (args, context, info) => {
    const queriedFields = info.fieldNodes[0].selectionSet.selections;
    const projection = formProjection(queriedFields);

    return Station.find({}, projection)
      .limit(args.count)
      .then(res => {
        return res.map(element => {
          return element._doc;
        });
      });
  },

  // eslint-disable-next-line no-unused-vars
  maxBuyPriceStations: (args, context, info) => {
    return Station.findMaxBuyPrice(args.commodityName, args.limit)
      .then(res => {
        res.map(element => {
          element.commodities = [element.commodities];
        });
        return res;
      });
  },

  // eslint-disable-next-line no-unused-vars
  minBuyPriceStations: (args, context, info) => {
    return Station.findMinBuyPrice(args.commodityName, args.limit)
      .then(res => {
        res.map(element => {
          element.commodities = [element.commodities];
        });
        return res;
      });
  },

  // eslint-disable-next-line no-unused-vars
  maxSellPriceStations: (args, context, info) => {
    return Station.findMaxSellPrice(args.commodityName, args.limit)
      .then(res => {
        res.map(element => {
          element.commodities = [element.commodities];
        });
        return res;
      });
  },

  // eslint-disable-next-line no-unused-vars
  minSellPriceStations: (args, context, info) => {
    return Station.findMinSellPrice(args.commodityName, args.limit)
      .then(res => {
        res.map(element => {
          element.commodities = [element.commodities];
        });
        return res;
      });
  }
};


const formProjection = (queriedFields) => {
  const projection = {
    stationName: 0,
    systemName: 0,
    timestamp: 0,
    commodities: 0
  };
  queriedFields.forEach(element => {
    switch (element.name.value) {
      case 'stationName':
        projection.stationName = 1;
        break;
      case 'systemName':
        projection.systemName = 1;
        break;
      case 'timestamp':
        projection.timestamp = 1;
        break;
      case 'commodities':
        projection.commodities = 1;
        break;
    }
  });

  for (let field in projection) {
    if (projection[field] === 0) {
      delete projection[field];
    }
  }

  return projection;
};
