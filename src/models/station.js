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

const station = new Schema({
  commodities: [
    commodity
  ],
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
    type: String,
    unique: false,
    required: true,
    validate: validators
  }
}, {timestamps: false});

const Station = mongoose.model('Station', station);

module.exports.updateOneUpsert = (data) => {
  const stationDoc = new Station(data);
  delete stationDoc._doc._id;
  stationDoc.validate()
      .then(() => {
        Station.updateOne({
              stationName: stationDoc._doc.stationName
            },
            stationDoc,
            {
              upsert: true,
              useFindAndModify: true
            })
            .exec();
      });
};