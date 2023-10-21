import { sequelize } from "./index.js";
import { DataTypes, Model } from "sequelize";

class Job extends Model {}

Job.init(
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        titled: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_recrutor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "jobs",
    }
    );

export default Job;