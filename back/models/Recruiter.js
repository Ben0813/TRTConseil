import { sequelize } from "./index.js";
import { DataTypes, Model } from "sequelize";

class Recruiter extends Model {}

Recruiter.init(
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        company: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        adress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
            },
    {   
        sequelize,
        tableName: "recruiters",
    }
    );  

export default Recruiter;

