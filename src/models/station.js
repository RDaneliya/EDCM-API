'use strict';
const mongoose = require('../modules/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  commodities: [
    {
      buyPrice: Number,
      demand: Number,
      name: String,
      sellPrice: Number,
      stock: Number
    }
  ],
  stationName: {
    type: String,
    unique: true,
    required: true
  },
  systemName: {
    type: String,
    unique: false,
    required: true
  },
  timestamp: {
    type: String,
    unique: false,
    required: true
  }
}, { timestamps: false });

const Station = mongoose.model('Station', schema);

module.exports.getAllStationsNames = () => {
  return Station.find({}, { 'stationName': 1 });
};

module.exports.haveInfo = (stationName) => {
  return Station.findOne({ stationName: stationName });
};

module.exports.save = (data) => {
  const stationEntry = new Station({
    commodities: data.commodities,
    stationName: data.stationName,
    systemName: data.systemName,
    timestamp: data.timestamp
  });
  return stationEntry.save();
};

module.exports.updateOneUpsert = (data) => {
  return Station.updateOne(
      { stationName: data.stationName },
      { commodities: data.commodities, timestamp: data.timestamp, systemName: data.systemName },
      {upsert: true})
      .exec();
};