import { sequelize} from "./index.js";
import { DataTypes, Model } from "sequelize";

class Candidate extends Model {}

Candidate.init(
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
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        cv: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },
    {
        sequelize,
        tableName: "candidates",
    }
    );

export default Candidate;