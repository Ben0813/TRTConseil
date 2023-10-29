import { sequelize } from "./index.js";
import { DataTypes, Model } from "sequelize";

class Administrator extends Model {}

Administrator.init(
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
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        
    },
    {
        sequelize,
        tableName: "administrators",
    }
    );

export default Administrator;