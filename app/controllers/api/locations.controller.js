const db = require("../../models");
const Locations = db.locations;

// Create and Save a new location
exports.create = (req, res) => {

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
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the location."
      });
    });
};

// Retrieve all locations from the database.
exports.findAll = (req, res) => {

  Locations.findAll({ where: {} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving all locations."
      });
    });
};

// Find a single location with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Locations.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving location with id=" + id
      });
    });
};

// Delete all locations from the database.
exports.deleteAll = (req, res) => {
  Locations.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Locations were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all locations."
      });
    });
};

// Delete a location with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Locations.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: `Location with ID: ${id} was deleted successfully!`
        });
      } else {
        res.send({
          message: `Cannot delete location with ID: ${id}. Maybe location was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete location with id=" + id
      });
    });
};
