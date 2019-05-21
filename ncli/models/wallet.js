module.exports = (sequelize, Sequelize) => {
    return sequelize.define('wallet', {
        money: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: '금액'
        },
        desc: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment: '설명'
        },
        type: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            comment: 'TRUE면 수입 / FALSE면 지출'
        }
    }, {
        timestamps: true
    });
}