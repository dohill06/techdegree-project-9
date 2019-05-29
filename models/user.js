'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'First name is required'
                },
                isAlpha: true,
                len: [2, 20]
            }
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Last name is required'
                },
                isAlpha: true,
                len: [2, 20]
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Email is required'
                },
                isEmail: {
                    msg: 'Valid email address is required'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'A password is required'
                }
            }
        }
    }, {});
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: 'userId'
        });
    };
    return User;
};