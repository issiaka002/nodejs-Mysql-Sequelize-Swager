// Importer le module express pour la création de l'application
const express = require('express');
// Importer le module bodyParser pour la gestion des données JSON
var bodyParser = require('body-parser');
// Créer une instance de l'application express
const app = express();
// Importer le module minimist pour la gestion des arguments de la ligne de commande
var argv = require('minimist')(process.argv.slice(2));
// Importer le module cors pour la gestion des requêtes cross-origin
var cors = require('cors');
// Importer le module mysql2 pour l'interaction avec la base de données MySQL
var mysql = require('mysql2');

// CONTROLLERS
// Importer le contrôleur utilisateurs
var utilisateursCtrl = require('./controllers/utilisateurs');

//CORS
// Utiliser le middleware CORS pour permettre les requêtes cross-origin
app.use(
    cors({
        credentials: true,
        origin: true
    })
);
app.options('*', cors());

// SWAGGER
// Configurer le middleware bodyParser pour la gestion des données JSON et URL-encoded
app.use(
    bodyParser.json({
        limit: '50mb'
    })
);
app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    })
);
// Configurer le middleware pour servir l'interface Swagger
var subpath = express();
app.use('', subpath);
var swagger = require('swagger-node-express').createNew(subpath);
app.use(express.static('swagger'));
// Configurer les informations de l'API Swagger
swagger.setApiInfo({
    title: 'CRUD API',
    description: 'CRUD API Description',
    termsOfServiceUrl: '',
    contact: 'aboubacar.ouattara19@inphb.ci',
    license: '',
    licenseUrl: ''
});
// Configurer les chemins Swagger
swagger.configureSwaggerPaths('', 'api-docs', '');
// Configurer l'URL de l'application et Swagger
var domain = 'localhost';
if (argv.domain !== undefined) domain = argv.domain;
else console.log('No --domain=xxx specified, taking default hostname "localhost".');
var port = 8080;
if (argv.port !== undefined) port = argv.port;
else console.log('No --port=xxx specified, taking default port ' + port + '.');
var applicationUrl = 'http://' + domain + ':' + port;
swagger.configure(applicationUrl, '1.0.0');

// MYSQL
// Configurer le middleware pour créer une connexion à la base de données MySQL et l'ajouter à la requête
app.use(function(req, res, next) {
    res.locals.connection = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ngolo_db',
        timezone: 'UTC+0'
    });
    next();
});
// Configurer la route racine pour servir la page Swagger
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/swagger/index.html');
});
// Configurer le contrôleur utilisateurs pour la route '/api/v1/utilisateurs'
app.use('/api/v1/utilisateurs', utilisateursCtrl);

// Démarrer le serveur sur le port 3000
app.listen(3000, function() {
    console.log('server running on port 3000', '');
});

// Configurer le moteur de vue EJS
app.set('view engine', 'ejs');
