const db = require("../../models");
const Bookings = db.bookings;

// Create and Save a new booking
exports.create = (req, res) => {

  // Create a location
  const booking = {
    dateFrom: req.body.dateFrom,
    dateTO: req.body.dateTO,
    contractorsID: req.body.contractorsID,
    locationsID: req.body.locationsID
  };

  // Save booking in the database
  Bookings.create(booking)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the booking."
      });
    });
};

// Retrieve all bookings from the database.
exports.findAll = (req, res) => {

  Bookings.findAll({ where: {} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving all bookings."
      });
    });
};

// Find a single booking with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Bookings.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving booking with id=" + id
      });
    });
};

// Delete all bookings from the database.
exports.deleteAll = (req, res) => {
  Bookings.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} bookings were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all bookings."
      });
    });
};

// Delete a booking with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Bookings.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: `Bookings with ID: ${id} was deleted successfully!`
        });
      } else {
        res.send({
          message: `Cannot delete booking with id=${id}. Maybe booking was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete booking with id=" + id
      });
    });
};
