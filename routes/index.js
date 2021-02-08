var express = require('express');
var router = express.Router();
const moment  = require('moment')
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('carsplates', 'root', '', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})

class Park extends Model {}
Park.init({
  id: {type:DataTypes.INTEGER, primaryKey:true},
  plate:DataTypes.STRING,
  dateSortie: DataTypes.TIME,
  dateEntree:DataTypes.TIME
}, { sequelize, modelName: 'park', tableName:"park", timestamps:false });

class Facture extends Model {}
Facture.init({
  id: {type:DataTypes.INTEGER, primaryKey:true},
  parkId:DataTypes.STRING,
  price: DataTypes.DOUBLE,
  datePayment:DataTypes.DATE
}, { sequelize, modelName: 'facture', tableName:"facture", timestamps:false });



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/parks', async (req, res, next) => {
  const parks = await Park.findAll()
  const parksMapped = parks.map(p => ({id:p.id, 
    plate:p.plate.replace('\n\f',''), 
    dateEntree : moment(p.dateEntree)
                .format("dddd, d/MM/YYYY hh:mm")
    .toString(), 
    dateSortie : p.dateSortie ?moment(p.dateSortie).format("dddd, d/MM/YYYY hh:mm").toString():'-'}))
  console.log(parksMapped)
  res.render('parks', { title: 'Parks', parks:parksMapped });
});

router.get('/factures', async (req, res, next) => {
  const factures = await Facture.findAll()
  const facturesMapped = factures.map(p => ({id:p.id, 
    price:p.price+ ' DH' , 
    parkId:p.parkId,
    datePayment : p.datePayment ?moment(p.datePayment).format("dddd, d/MM/YYYY hh:mm").toString():'-'}))
  res.render('factures', { title: 'Factures', factures:facturesMapped });
});


module.exports = router;
