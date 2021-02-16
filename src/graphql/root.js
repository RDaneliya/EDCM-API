const Station = require('../models/station');

module.exports = {
  station: (args, context, info) => {
    const queriedFields = info.fieldNodes[0].selectionSet.selections;
    const projection = formProjection(queriedFields);

    return Station.findOne({stationName: args.stationName}, projection).then(res => {
      return res._doc;
    });
  },
  stations: (args, context, info) => {
    const queriedFields = info.fieldNodes[0].selectionSet.selections;
    const projection = formProjection(queriedFields);

    return Station.find({}, projection).limit(args.count).then(res => {
      return res.map(element => {
        return element._doc;
      });
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
      case "stationName":
        projection.stationName = 1;
        break;
      case "systemName":
        projection.systemName = 1;
        break;
      case "timestamp":
        projection.timestamp = 1;
        break;
      case "commodities":
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