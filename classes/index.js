'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../_config/configuration.json')[env];
var db = {};

// Initialiser l'objet Sequelize
if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    var sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

// Lire tous les fichiers du répertoire actuel (modèles Sequelize)
fs.readdirSync(__dirname)
    .filter(file => {
        // Filtre les fichiers qui ne commencent pas par un point, ne sont pas le fichier actuel (index.js), et se terminent par '.js'
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        // Importer chaque modèle Sequelize dans la base de données
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

// Associer les modèles s'ils ont une fonction 'associate'
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Ajouter les instances de Sequelize à l'objet db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Exporter l'objet db
module.exports = db;
