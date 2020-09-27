const db = require("../../models");
const Contractors = db.contractors;

// Create and Save a new contractor
exports.create = (req, res) => {

  // Create a contractor
  const contractor = { contractorName, contractorOwe } = req.body

  contractor.contractorOwe = contractorOwe.trim()
  contractor.contractorName = contractorName.trim()

  // Save contractor in the database
  Contractors.create(contractor)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the contractor."
      });
    });
};

// Retrieve all contractors from the database.
exports.findAll = (req, res) => {

  Contractors.findAll({
      where: {}
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving all contractors."
      });
    });
};

// Find a single contractor with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Contractors.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving contractor with id=" + id
      });
    });
};

// Delete all contractors from the database.
exports.deleteAll = (req, res) => {
  Contractors.destroy({
      where: {},
      truncate: false
    })
    .then(nums => {
      res.send({
        message: `${nums} contractors were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all contractors."
      });
    });
};

// Delete a contractor with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Contractors.destroy({
      where: {
        id: id
      }
    })
    .then(num => {
      if (num === 1) {
        res.send({
          message: `Contractor with ID: ${id} was deleted successfully!`
        });
      } else {
        res.send({
          message: `Cannot delete contractor with ID: ${id}. Maybe contractor was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete contractor with id=" + id
      });
    });
};
