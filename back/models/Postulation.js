import	{ sequelize }	from	"./index.js";
import	{ DataTypes, Model }	from	"sequelize";

class	Postulation	extends	Model	{}

Postulation.init(
    {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        id_candidate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "candidates",
                key: "id",
            },
        },
        id_job: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "jobs",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "postulations",
    },
    );
    
    export default Postulation;