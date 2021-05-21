import mongoose from '../modules/mongoose.mjs';

const Schema = mongoose.Schema;

const commodity = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false
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
  },
  systemName: {
    type: String,
    unique: false,
    required: true,
  },
  timestamp: {
    type: Date,
    unique: false,
    required: true,
  }
}, {
  collection: 'Stations',
  timestamps: false
});

const StationModel = mongoose.model('Station', station);

const findOne = (query, projection) => {
  return StationModel.findOne(query, projection);
};

const findAll = (query, projection) => {
  return StationModel.find(query, projection);
};

const updateOneUpsert = (data) => {
  const stationDoc = new StationModel(data);
  delete stationDoc._doc._id;
  StationModel.updateOne({ stationName: stationDoc._doc.stationName },
      stationDoc,
      {
        upsert: true,
        useFindAndModify: true
      })
      .exec();
};

const findMaxBuyPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return StationModel.aggregate([
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
        'commodities.buyPrice': -1
      }
    }, {
      '$limit': limit
    }
  ]);
};

const findMinBuyPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return StationModel.aggregate([
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
        'commodities.buyPrice': 1
      }
    }, {
      '$limit': limit
    }
  ]);
};

const findMaxSellPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return StationModel.aggregate([
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

const findMinSellPrice = (commodityName, limit) => {
  const pureName = removeSymbols(commodityName);
  return StationModel.aggregate([
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

const getCommodityInfo = (commodityName) => {
  const pureName = removeSymbols(commodityName);
  return StationModel.aggregate([
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
      '$project': {
        'commodities': 1
      }
    }, {
      '$group': {
        '_id': '$commodities.name',
        'commodities': {
          '$push': {
            'name': '$commodities.name',
            'buyPrice': '$commodities.buyPrice',
            'sellPrice': '$commodities.sellPrice',
            'stock': '$commodities.stock',
            'demand': '$commodities.demand'
          }
        }
      }
    }, {
      '$project': {
        'name': '$_id',
        'maxBuyPrice': {
          '$max': '$commodities.buyPrice'
        },
        'minBuyPrice': {
          $ifNull: [
            {
              $min: {
                $filter: {
                  input: '$commodities.buyPrice',
                  cond: { $gt: ['$$this', 0] }
                }
              }
            },
            0
          ]
        },
        'maxSellPrice': {
          '$max': '$commodities.sellPrice'
        },
        'minSellPrice': {
          '$min': {
            '$filter': {
              'input': '$commodities.sellPrice',
              'cond': {
                '$gt': [
                  '$$this', 0
                ]
              }
            }
          }
        }
      }
    }
  ]);
};

const getAllCommoditiesInfo = () => {
  return StationModel.aggregate([
    {
      '$unwind': {
        'path': '$commodities',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$project': {
        'commodities': 1
      }
    }, {
      '$group': {
        '_id': '$commodities.name',
        'commodities': {
          '$push': {
            'name': '$commodities.name',
            'buyPrice': '$commodities.buyPrice',
            'sellPrice': '$commodities.sellPrice',
            'stock': '$commodities.stock',
            'demand': '$commodities.demand'
          }
        }
      }
    }, {
      '$project': {
        'name': '$_id',
        'maxBuyPrice': {
          '$max': '$commodities.buyPrice'
        },
        'minBuyPrice': {
          '$ifNull': [
            {
              '$min': {
                '$filter': {
                  'input': '$commodities.buyPrice',
                  'cond': {
                    '$gt': [
                      '$$this', 0
                    ]
                  }
                }
              }
            }, 0
          ]
        },
        'maxSellPrice': {
          '$max': '$commodities.sellPrice'
        },
        'minSellPrice': {
          '$ifNull': [
            {
              '$min': {
                '$filter': {
                  'input': '$commodities.sellPrice',
                  'cond': {
                    '$gt': [
                      '$$this', 0
                    ]
                  }
                }
              }
            }, 0
          ]
        }
      }
    }
  ]);
};


const removeSymbols = (commodityName) => {
  return commodityName.replace(/[^a-zA-Z\d\s]/g, '');
};

export {
  findOne,
  findAll,
  updateOneUpsert,
  findMaxBuyPrice,
  findMinBuyPrice,
  findMaxSellPrice,
  findMinSellPrice,
  getCommodityInfo,
  getAllCommoditiesInfo
};
