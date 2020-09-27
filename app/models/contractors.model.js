module.exports = (sequelize, Sequelize) => {
  const Contractors = sequelize.define("contractors", {
    contractorName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    contractorOwe: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  return Contractors;
};
