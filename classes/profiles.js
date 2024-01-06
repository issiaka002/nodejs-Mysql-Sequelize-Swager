/* jshint indent: 2 */

// Définition du modèle Sequelize pour la table 'profiles'
module.exports = function(sequelize, DataTypes) {
	var profiles = sequelize.define(
	  'profiles',
	  {
		// Champ représentant la clé primaire de la table
		profileID: {
		  type: DataTypes.INTEGER(11),
		  allowNull: false,
		  primaryKey: true
		},
		// Champ représentant le nom du profil
		name: {
		  type: DataTypes.STRING(100),
		  allowNull: false
		}
	  },
	  {
		// Options du modèle Sequelize
		timestamps: false,      // Activer l'ajout automatique des champs createdAt et updatedAt
		freezeTableName: true,   // Empêche Sequelize de modifier le nom de la table
		tableName: 'profiles'    // Nom de la table dans la base de données
	  }
	);
  
	return profiles;
  };
  