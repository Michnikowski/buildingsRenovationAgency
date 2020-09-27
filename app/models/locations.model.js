module.exports = (sequelize, Sequelize) => {
  const Locations = sequelize.define("locations", {
    country: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    postalCode: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    streetName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    streetNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    indexes: [
      { fields: ['country', 'city', 'postalCode', 'streetName', 'streetNumber'], unique: true }
    ]
  });

  return Locations;
};
