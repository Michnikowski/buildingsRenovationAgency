const db = require("../models");
const Bookings = db.bookings;
const sequelize = db.Sequelize;
const Op = db.Sequelize.Op;

// top 5 contractors with all bookings
async function getTop5All(){
  const top5all = await Bookings.findAll({
    where: {},
    limit: 5,
    group: ['contractorsID', 'contractor.id'],
    include: [
      {model: db.contractors,
      attributes: ['contractorName']},
    ],
    attributes: [
      'contractorsID',
      [
        sequelize.fn('COUNT', sequelize.col('contractorsID')), 'contractorCount'
      ]
    ],
    order: sequelize.literal('COUNT("contractorsID") DESC'),
  })
  return JSON.parse(JSON.stringify(top5all));
}

 // top 5 contractors with upcoming bookings
async function getTop5Newest(){
  const top5newest = await Bookings.findAll({
    where: {
      dateFrom: {
        [Op.gte]: new Date()
      },
    },
    limit: 5,
    group: ['contractorsID', 'contractor.id'],
    include: [
      {model: db.contractors,
      attributes: ['contractorName']},
    ],
    attributes: [
      'contractorsID',
      [
        sequelize.fn('COUNT', sequelize.col('contractorsID')), 'contractorCount'
      ]
    ],
    order: sequelize.literal('COUNT("contractorsID") DESC'),
  })
    return JSON.parse(JSON.stringify(top5newest));
}

// top 5 locations with upcoming bookings
async function getTop5Locations(){
  const top5locations = await Bookings.findAll({
    where: {
      dateFrom: {
        [Op.gte]: new Date()
      },
    },
    limit: 5,
    include: [
      {model: db.contractors,
        attributes: ['contractorName']},
      {model: db.locations,
        attributes: ['country', 'city', 'streetName', 'streetNumber']},
    ],
    attributes: ['dateFrom'],
    order: [['dateFrom', 'ASC']],
  })
  return JSON.parse(JSON.stringify(top5locations));
}

exports.getHome = async (req, res) => {

  const baseURL = req.path;

  console.log(baseURL)

  const top5all = await getTop5All();
  const top5newest = await getTop5Newest();
  const top5locations = await getTop5Locations();

  Promise.all([top5all, top5newest, top5locations])

  .then(results => {
    res.render('home', {
      layout: 'index',
      top5all,
      top5newest,
      top5locations,
      baseURL
    })
  })

  .catch(err => {
    res.render('error',{
      layout: 'index',
      message: err.message || "Some error occurred while retrieving HOME."
    })
  })
};
