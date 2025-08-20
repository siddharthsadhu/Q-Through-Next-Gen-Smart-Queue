const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const queue_entries = sequelize.define(
    'queue_entries',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

joined_at: {
        type: DataTypes.DATE,

      },

status: {
        type: DataTypes.ENUM,

        values: [

"waiting",

"served",

"cancelled"

        ],

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

  queue_entries.associate = (db) => {

    db.queue_entries.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.queue_entries.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return queue_entries;
};

