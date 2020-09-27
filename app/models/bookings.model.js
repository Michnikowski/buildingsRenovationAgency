module.exports = (sequelize, Sequelize) => {
  const Bookings = sequelize.define("bookings", {
    dateFrom: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    dateTO: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    contractorsID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    },
    locationsID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    }
  });

  return Bookings;
};
