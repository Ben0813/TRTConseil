import { sequelize } from "./index.js";
import { DataTypes, Model } from "sequelize";

class Recruiter extends Model {}

Recruiter.init(
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
            },
    {   
        sequelize,
        tableName: "recruiters",
    }
    );  

export default Recruiter;

