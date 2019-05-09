module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "t_node_comments",
    {
      comment: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("now()")
      }
    },
    {
      timestamps: false
    }
  );
};
