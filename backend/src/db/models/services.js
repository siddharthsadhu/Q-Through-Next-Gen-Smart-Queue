const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const services = sequelize.define(
    'services',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,

      },

price: {
        type: DataTypes.DECIMAL,

      },

description: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  services.associate = (db) => {

    db.services.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.services.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return services;
};

