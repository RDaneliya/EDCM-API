'use strict';
const mongoose = require('../modules/mongoose');
const Schema = mongoose.Schema;

const validators = {
  validator: (field) => field != null
};

const commodity = new Schema({
  name: {
    type: String,
    required: true
  },
  buyPrice: Number,
  sellPrice: Number,
  stock: Number,
  demand: Number
});

const ecomomy = new Schema({
  name: String,
  proportion: Number
});

const station = new Schema({
  commodities: {
    type: [
      commodity
    ]
  },
  economies: {
    type: [
      ecomomy
    ]
  },
  prohibited: {
    type: [
      String
    ]
  },
  stationName: {
    type: String,
    unique: false,
    required: true,
    validate: validators
  },
  systemName: {
    type: String,
    unique: false,
    required: true,
    validate: validators
  },
  timestamp: {
    type: Date,
    unique: false,
    required: true,
    validate: validators
  }
}, { timestamps: false });

const Station = mongoose.model('Station', station);
module.exports = Station;

module.exports.updateOneUpsert = (data) => {
  const stationDoc = new Station(data);
  delete stationDoc._doc._id;
  stationDoc.validate()
      .then(() => {
        Station.updateOne({ stationName: stationDoc._doc.stationName },
            stationDoc,
            {
              upsert: true,
              useFindAndModify: true
            })
            .exec();
      });
};

module.exports.findMaxBuyPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return Station.aggregate([
    {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        }
      }
    }, {
      '$unwind': {
        'path': '$commodities',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        },
        'commodities.buyPrice': {
          '$gt': 0
        }
      }
    }, {
      '$sort': {
        'commodities.buy': -1
      }
    }, {
      '$limit': limit
    }
  ]);
};

module.exports.findMinBuyPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return Station.aggregate([
    {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        }
      }
    }, {
      '$unwind': {
        'path': '$commodities',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        },
        'commodities.buyPrice': {
          '$gt': 0
        }
      }
    }, {
      '$sort': {
        'commodities.buy': 1
      }
    }, {
      '$limit': limit
    }
  ]);
};

module.exports.findMaxSellPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return Station.aggregate([
    {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        }
      }
    }, {
      '$unwind': {
        'path': '$commodities',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        }
      }
    }, {
      '$sort': {
        'commodities.sellPrice': -1
      }
    }, {
      '$limit': limit
    }
  ]);
};

module.exports.findMinSellPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return Station.aggregate([
    {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        }
      }
    }, {
      '$unwind': {
        'path': '$commodities',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$match': {
        'commodities.name': {
          '$regex': new RegExp(`^${pureName}$`, 'i')
        },
        'commodities.sellPrice': {
          '$gt': 0
        }
      }
    }, {
      '$sort': {
        'commodities.sellPrice': 1
      }
    }, {
      '$limit': limit
    }
  ]);
};

const removeSymbols = (commodityName) => {
  return commodityName.replace(/[^a-zA-Z\d\s]/g, '');
};
