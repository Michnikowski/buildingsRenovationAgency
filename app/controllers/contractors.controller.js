const db = require("../models");
const Contractors = db.contractors;
const sequelize = db.Sequelize;

// Retrieve all contractors from the database.
exports.findAll = (req, res) => {

  const params = {field, sort, page} = req.params
  page = parseInt(page) || 1
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const baseURL = req.baseUrl;
  let orderString = ''

  if(field === undefined){
    field = "contractorName";
    sort = "ASC";
  }

  orderString = `lower("${field}") ${sort}`

  const sortFields = [
    { sortField: "contractorName",
      tableHeader: "Contractor name",
      activeSortOption: field === "contractorName",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    },
    { sortField: "contractorOwe",
      tableHeader: "Contractor owner",
      activeSortOption: field === "contractorOwe",
      sortOption: sort,
      pageNumber: page,
      baseURL: baseURL
    }
  ]

  Contractors.findAndCountAll({
      where: {},
      limit: limit,
      offset: (page - 1) * 10,
      attributes: ['id', 'contractorName', 'contractorOwe'],
      order: sequelize.literal(orderString),
    })
    .then(contractors => {
      const contractorsOBJ = JSON.parse(JSON.stringify(contractors))
      const lastPage = Math.ceil(contractorsOBJ.count / 10)
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

      const total = contractorsOBJ.count

      // pagination result
      const pagination = {};

      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit
        }
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

      res.render('contractors', {
        layout: 'index',
        contractorsOBJ,
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
        message: err.message || "Some error occurred while retrieving all contractors."
      })
    });
};

// create new contractor
exports.createContractor = (req, res) => {

  // Create a contractor
  const contractor = { contractorName, contractorOwe } = req.body

  contractor.contractorOwe = contractorOwe.trim()
  contractor.contractorName = contractorName.trim()

  // Save contractors in the database
  Contractors.create(contractor)
    .then(data => {
      res.redirect('/contractors/field/contractorName/sort/ASC/page/1')
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: err.message || "Some error occurred while creating the contractor."
      })
    });
}

// Update a contractor by the id in the request
exports.editContractor = (req, res) => {

  const contractor = {contractorName, contractorOwe} = req.body
  const params = {id} = req.params
  const refererURL = req.headers['referer']

  contractor.contractorOwe = contractorOwe.trim()
  contractor.contractorName = contractorName.trim()

  id = parseInt(id)

  Contractors.update(contractor, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.redirect(refererURL)
      } else {
        res.render('error',{
          layout: 'index',
          message: `Cannot update contractor with id=${id}. Maybe contractor was not found or req.body is empty!`
        })
      }
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: "Error updating contractor with id=" + id
      })
    });
};

// Delete a contractor with the specified id in the request
exports.deleteContractor = (req, res) => {

  const params = {id} = req.params;

  Contractors.destroy({
      where: {
        id: parseInt(id)
      }
    })
    .then(num => {
      if (num === 1) {
        res.redirect('/contractors/field/contractorName/sort/ASC/page/1');
      } else {
        res.render('error',{
          layout: 'index',
          message: `Cannot delete contractor with ID: ${id}. Maybe contractor was not found!`
        })
      }
    })
    .catch(err => {
      res.render('error',{
        layout: 'index',
        message: "Could not delete contractor with id=" + id
      })
    });
};
