import { sequelize } from "./index.js";
import { DataTypes, Model } from "sequelize";
import Recruiter from "./Recruiter.js"; 

class Job extends Model {}

Job.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        id_recruiter: {
            type: DataTypes.UUID,
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
