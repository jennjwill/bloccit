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
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Flair.associate = function(models) {
    // associations can be defined here
    Flair.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE" //check n:m and tag table info on seqeulize to figure out associations etc 8/19jw
    });
  };
  return Flair;
};
