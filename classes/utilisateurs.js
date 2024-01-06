/* jshint indent: 2 */

// Définition du modèle Sequelize pour la table 'utilisateurs'
module.exports = function(sequelize, DataTypes) {
	var utilisateurs = sequelize.define(
	  'utilisateurs',
	  {
		// Champ représentant la clé primaire de la table
		_id: {
		  type: DataTypes.INTEGER(11),
		  allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
		},
		// Champ représentant le nom de l'utilisateur
		name: {
		  type: DataTypes.STRING(150),
		  allowNull: false
		},
		// Champ représentant l'indicateur d'activation/désactivation de l'utilisateur
		is_active: {
		  type: DataTypes.BOOLEAN,
		  allowNull: false
		},
		// Champ représentant la clé étrangère liée à la table 'profiles'
		profileID: {
		  type: DataTypes.INTEGER(11),
		  allowNull: false,
		  primaryKey: true,
		  references: {
			model: 'profiles', 	// La table de référence
			key: 'profileID'    // La colonne de référence
		  }
		}
	  },
	  {
		// Options du modèle Sequelize
		timestamps: false,      // Activer l'ajout automatique des champs createdAt et updatedAt
		freezeTableName: true,   // Empêche Sequelize de modifier le nom de la table
		tableName: 'utilisateurs'  // Nom de la table dans la base de données
	  }
	);
  
	return utilisateurs;
  };
  