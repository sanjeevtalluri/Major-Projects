const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
    id: {
        type: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})
ForgotPasswordRequest.beforeCreate((forgotPasswordRequest, _) => {
    return forgotPasswordRequest.id = uuidv4();
});

module.exports = ForgotPasswordRequest;
