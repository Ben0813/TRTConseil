import { sequelize } from "./index.js";
import { DataTypes, Model } from "sequelize";
import Recruiter from "./Recruiter.js"; 

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
        location: {
            type: DataTypes.STRING,
            allowNull: false,  
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_recruiter: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Recruiter,
                key: 'id'
            }
        },
    },
    {
        sequelize,
        tableName: "jobs",
    }
);

export default Job;
