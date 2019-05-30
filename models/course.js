'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: {
                msg: 'Course title required'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        validate: {
            notEmpty: {
                msg: 'Description required'
            }
        }
    },
    estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true
    }
  }, {});
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Course;
};