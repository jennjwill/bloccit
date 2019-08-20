"use strict";
module.exports = (sequelize, DataTypes) => {
  const Flair = sequelize.define(
    "Flair",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.belongsToMany(models.Post, {
      through: "FlairTags",

      foreignKey: "postId",
      onDelete: "CASCADE"
    });
  };
  return Flair;
};
