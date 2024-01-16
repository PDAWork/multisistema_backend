const model = require("../db/models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");


async function pay(req,res) {

}

async function getAllTariff(req, res) {
    const tariffQuery = await model.tariff.findAll();

    return  res.status(200).json(tariffQuery);
}


async function getTariffObject(req, res) {

}

async function getAllTariffObject(req,res) {

}

module.exports = {
    pay,
    getAllTariff,
    getTariffObject,
    getAllTariffObject
}