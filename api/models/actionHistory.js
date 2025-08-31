const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActionHistory = sequelize.define(
  "ActionHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oldValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "action_history",
    timestamps: false,
  }
);

module.exports = ActionHistory;
