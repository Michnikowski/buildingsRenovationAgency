const db = require("../models");
const Bookings = db.bookings;
const Contractors = db.contractors;
const Locations = db.locations;
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;
const colors = require('colors');

async function getContractorsData(){
  const contractorData = await Contractors.findAll({
    attributes: ['id', 'contractorName'],
    order: sequelize.literal(`lower("contractorName") ASC`),
  })
    return JSON.parse(JSON.stringify(contractorData));
};

async function getLocationsData(){
  const locationData = await Locations.findAll({
    order: sequelize.literal(`lower("country") ASC, lower("city") ASC, lower("streetName") ASC`),
  })
    return JSON.parse(JSON.stringify(locationData));
};

async function getRecordsToRemove(dateFrom, dateTO, fieldName){
  const recordsToRemove = await Bookings.findAll({
    where: {
      [Op.or]: [
        {
          dateFrom: {
            [Op.gte]: dateFrom,
          },
          dateTO: {
            [Op.lte]: dateTO
          }
        },
        {
          dateFrom: {
            [Op.lte]: dateFrom
          },
          dateTO: {
            [Op.gte]: dateTO
          }
        },
        {
          dateFrom: {
            [Op.lte]: dateFrom
          },
          dateTO: {
            [Op.gte]: dateFrom
          }
        },
        {
          dateTO: {
            [Op.gte]: dateTO
          },
          dateFrom: {
            [Op.lte]: dateTO
          }
        }
      ]
    },
    group: [fieldName],
    attributes: [fieldName],
    order: [
      [fieldName, 'ASC'],
    ],
  })
    return JSON.parse(JSON.stringify(recordsToRemove));
}

let contractorsDataToRemove;
let locationsDataToRemove;

function convertObjectToSet(obj, propertyName){
  const set = new Set;

  for (const property in obj) {
    set.add(obj[property][propertyName]);
  };

  return set;
};

function removeFromObject(obj, set){
  for (const property in obj) {
    if (set.has(obj[property].id)){
      delete obj[property];
    }
  };

  return obj;
};

// Retrieve all bookings from the database.
exports.findAll = async (req, res) => {

  const body = {dateFrom, dateTO} = req.body
  const params = {field, sort, page, nextStep} = req.params;
  page = parseInt(page) || 1

  const refererURL = req.headers['referer']

  let contractorData;
  let locationData;
  let addNewBookingAlertEmpty;
  let addNewBookingAlertValue;
  let addNewBookingError = false;

  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const baseURL = req.baseUrl;

  let orderString = ''

  if(field === undefined){
    field = "dateFrom";
    sort = "ASC";
    orderString = `lower("${field}") ${sort}`
  }

  if(field === "contractorName"){
    orderString = `lower("contractor"."${field}") ${sort}`
  };

  if(field === "country" || field === "city"){
    orderString = `lower("location"."${field}") ${sort}`
  };

  if(field === "dateFrom"){
    orderString = `"${field}" ${sort}`
  };

  const sortFields = [
    { sortField: "contractorName",
      tableHeader: "Contractor",
      activeSortOption: field === "contractorName",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "country",
      tableHeader: "Country",
      activeSortOption: field === "country",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "city",
      tableHeader: "Address",
      activeSortOption: field === "city",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "dateFrom",
      tableHeader: "Duration",
      activeSortOption: field === "dateFrom",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
  ]

  // create new booking
  if(nextStep){

    // dates validation
    if(dateFrom === "" || dateTO === ""){
      addNewBookingAlertEmpty = true;
      nextStep = false;
      addNewBookingError = true;
    } else if(dateFrom > dateTO) {
      addNewBookingAlertValue = true;
      nextStep = false;
      addNewBookingError = true;
    } else {

      // generate available contractors and locations dropdown list
      // contractors list to remove
      contractorsDataToRemove = await getRecordsToRemove(dateFrom, dateTO, 'contractorsID');

      const contractorsToRemoveSet = convertObjectToSet(contractorsDataToRemove, 'contractorsID');

      // locations list to remove
      locationsDataToRemove = await getRecordsToRemove(dateFrom, dateTO, 'locationsID');

      const locationsToRemoveSet = convertObjectToSet(locationsDataToRemove, 'locationsID');

      // get contractor list
      contractorData = await getContractorsData();

      // get loctions list
      locationData = await getLocationsData();

      // remove from contractor contractorsToRemoveSet
      contractorData = removeFromObject(contractorData, contractorsToRemoveSet);

      // remove from locationData locationsToRemoveSet
      locationData = removeFromObject(locationData, locationsToRemoveSet);
    }
  };

  // table with data
  Bookings.findAndCountAll({
    where: {},
    limit: 10,
    attributes: ['id', 'dateFrom', 'dateTO', 'contractorsID', 'locationsID'],
    offset: (page - 1) * 10,
    include: [
      {model: db.contractors,
      attributes: ['contractorName']},
      {model: db.locations,
      attributes: ['country', 'city', 'postalCode', 'streetName', 'streetNumber']},
    ],
    order: sequelize.literal(orderString),

  })

    .then(bookings => {
      const bookingsOBJ = JSON.parse(JSON.stringify(bookings))
      const lastPage = Math.ceil(bookingsOBJ.count / 10)
      const pages = [];

      // pagnation partial array (_paginationPartial)
      for(let i = 1; i <= lastPage; i++){
        pages.push(
          {
            pageNumber: i,
            activePage: i === page
          }
        )
      }

      const total = bookingsOBJ.count

      // pagination result
      const pagination = {};

      if(endIndex < total){
        pagination.next = {
          page: page + 1,
          limit
        }
      }

      if(startIndex > 0){
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

      res.render('bookings', {
        layout: 'index',
        bookingsOBJ,
        pages,
        page,
        pagination,
        baseURL,
        contractorData,
        locationData,
        nextStep,
        dateFrom,
        dateTO,
        addNewBookingAlertEmpty,
        addNewBookingAlertValue,
        sortFields,
        addNewBookingError
      });
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: err.message || "Some error occurred while retrieving all bookings."
      })
    });
};

// create new booking
exports.createBooking = (req, res) => {

  // Create a location
  const booking = {
      dateFrom: req.body.dateFrom,
      dateTO: req.body.dateTO,
      contractorsID: parseInt(req.body.contractorsID),
      locationsID: parseInt(req.body.locationsID),
    };

  // Save booking in the database
  Bookings.create(booking)
    .then(data => {
      res.redirect('/bookings/field/dateFrom/sort/ASC/page/1')
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: err.message || "Some error occurred while creating the booking."
      })
    });
}

// Delete a booking with the specified id in the request
exports.deleteBooking = (req, res) => {

  const params = {id} = req.params;

  Bookings.destroy({
      where: {
        id: parseInt(id)
      }
    })
    .then(num => {
      if (num === 1) {
        res.redirect('/bookings/field/dateFrom/sort/ASC/page/1');
      } else {
        res.render('error',{
          layout: 'index',
          message: `Cannot delete booking with ID: ${id}. Maybe booking was not found!`
        })
      }
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: "Could not delete booking with id=" + id
      })
    });
};
