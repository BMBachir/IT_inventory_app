import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Auth = sequelize.define("Auth", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    defaultValue: "user",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Auth;
