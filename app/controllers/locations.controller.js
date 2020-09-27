const db = require("../models");
const Locations = db.locations;
const sequelize = db.Sequelize;

// Retrieve all locations from the database.
exports.findAll = (req, res) => {

  const params = {field, sort, page} = req.params;
  page = parseInt(page) || 1
  const limit = 10;
  const startIndex = (page -1) * limit;
  const endIndex = page * limit;
  const baseURL = req.baseUrl;
  let orderString = ''

  if(field === undefined){
    field = "country";
    sort = "ASC";
  }

  orderString = `lower("${field}") ${sort}`

  const sortFields = [
    { sortField: "country",
      tableHeader: "Country",
      activeSortOption: field === "country",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "city",
      tableHeader: "City",
      activeSortOption: field === "city",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "postalCode",
      tableHeader: "Postal code",
      activeSortOption: field === "postalCode",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "streetName",
      tableHeader: "Street name",
      activeSortOption: field === "streetName",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "streetNumber",
      tableHeader: "Street number",
      activeSortOption: field === "streetNumber",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
  ]

  Locations.findAndCountAll({
    where: {},
    limit: 10,
    offset: (page - 1) * 10,
    attributes: ['id', 'country', 'city', 'postalCode', 'streetName', 'streetNumber'],
    order: sequelize.literal(orderString),
  })
    .then(locations => {
      const locationsOBJ = JSON.parse(JSON.stringify(locations))
      const lastPage = Math.ceil(locationsOBJ.count / 10)
      const pages = [];

      for(let i = 1; i <= lastPage; i++){
        pages.push(
          {
            pageNumber: i,
            activePage: i === page
          }
        )
      }

      const total = locationsOBJ.count

      // pagination result
      const pagination = {};

      if(endIndex < total){
        pagination.next = {
          page: page +1,
          limit
        }
      }

      if(startIndex > 0){
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

      res.render('locations', {
        layout: 'index',
        locationsOBJ,
        pages,
        pagination,
        baseURL,
        page,
        sortFields
      });
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: err.message || "Some error occurred while retrieving all locations."
      })
    });
};

// create new location
exports.createLocation = (req, res) => {

  // Create a location
  const location = { country, city, postalCode, streetName, streetNumber } = req.body

  location.country = country.trim();
  location.city = city.trim();
  location.postalCode = postalCode.trim();
  location.streetName = streetName.trim();
  location.streetNumber = streetNumber.trim();

  // Save location in the database
  Locations.create(location)
    .then(data => {
      res.redirect('/locations/field/country/sort/ASC/page/1')
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: err.message || "Some error occurred while creating the location."
      })
    });
}

// Update a location by the id in the request
exports.editLocation = (req, res) => {

  const location = {country, city, postalCode, streetName, streetNumber} = req.body
  const params = {id} = req.params
  const refererURL = req.headers['referer']

  location.country = country.trim();
  location.city = city.trim();
  location.postalCode = postalCode.trim();
  location.streetName = streetName.trim();
  location.streetNumber = streetNumber.trim();

  id = parseInt(id)

  Locations.update(location, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.redirect(refererURL)
      } else {
        res.render('error',{
          layout: 'index',
          message: `Cannot update location with id=${id}. Maybe location was not found or req.body is empty!`
        })
      }
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: "Error updating location with id=" + id
      })
    });
};

// Delete a location with the specified id in the request
exports.deleteLocation = (req, res) => {

  const params = {id} = req.params;

  Locations.destroy({
      where: {
        id: parseInt(id)
      }
    })
    .then(num => {
      if (num === 1) {
        res.redirect('/locations/field/country/sort/ASC/page/1');
      } else {
        res.render('error',{
          layout: 'index',
          message: `Cannot delete location with ID: ${id}. Maybe loctation was not found!`
        })
      }
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: "Could not delete location with id=" + id
      })
    });
};
