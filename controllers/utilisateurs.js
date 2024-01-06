// Importer le module express pour la création de routes
var express = require('express');
// Créer un router express pour définir les routes
var router = express.Router();
// Importer le modèle défini dans le fichier 'index.js' situé dans le dossier 'classes'
var model = require('../classes/index');
// Importer un utilitaire pour la gestion des transactions dans le fichier 'transaction.js' situé dans le dossier '_utils'
var trans = require('../_utils/transaction');
// Associer le modèle au module de transaction
trans.setModel(model);
// Importer le module Sequelize pour interagir avec la base de données relationnelle
var sequelize = require('sequelize');

// Définir une route pour récupérer des utilisateurs
router.get('/', function(req, res, next) {
    // Récupérer les paramètres de requête
    var vm = req.query;
    // Initialiser un tableau pour construire la clause WHERE
    let and = [];
    // Ajouter des conditions à la clause WHERE en fonction des paramètres de requête
    if (vm._id)
        and.push(sequelize.where(sequelize.col('_id'), parseInt(vm._id)));
    if (vm.profileID)
        and.push(
            sequelize.where(sequelize.col('profileID'), parseInt(vm.profileID))
        );
    if (vm.name)
        and.push(
            sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
                [sequelize.Op.like]: `%${vm.name.toLowerCase()}%`
            })
        );
    if (vm.is_active != null)
        and.push(
            sequelize.where(
                sequelize.col('is_active'),
                vm.is_active == 'true' ? 1 : 0
            )
        );
    console.log('get => vm', vm);
    // Rechercher les utilisateurs en fonction des conditions définies
    model.utilisateurs
        .findAll({
            attributes: ['_id', 'name', 'is_active', 'profileID'],
            where: {
                $and: and
            },
            order: [['name', 'ASC']]
        })
        .then(result => {
            // Envoyer la réponse avec les utilisateurs récupérés
            res.send(200, result);
        });
});

// Définir une route pour ajouter un utilisateur
router.post('/', function(req, res, next) {
    let vm = req.body;

    // Vérifier si le profil existe
    model.profiles
        .findOne({
            where: {
                profileID: vm.profileID
            }
        })
        .then(data => {
            if (!data) {
                res.send(400, 'Profile not found');
                return;
            }

            // Vérifier s'il existe un autre utilisateur avec le même nom
            model.utilisateurs
                .findOne({
                    where: {
                        $and: [
                            sequelize.where(
                                sequelize.fn('lower', sequelize.col('name')),
                                sequelize.fn('lower', vm.name)
                            )
                        ]
                    }
                })
                .then(data => {
                    if (data) {
                        res.send(400, 'There is another user with this name');
                        return;
                    }

                    // Exécuter la transaction pour créer un utilisateur
                    return trans.execTrans(res, t => {
                        return model.utilisateurs
                            .create(vm, {
                                transaction: t
                            })
                            .then(user => {
                                res.send(200, user);
                            });
                    });
                });
        });
});

// Définir une route pour mettre à jour un utilisateur
router.put('/', function(req, res, next) {
    let vm = req.body;

    // Vérifier si l'utilisateur existe
    model.utilisateurs
        .findOne({
            where: {
                _id: vm._id
            }
        })
        .then(data => {
            if (!data) {
                res.send(400, 'User not found');
                return;
            }

            // Vérifier si le profil existe
            model.profiles
                .findOne({
                    where: {
                        profileID: vm.profileID
                    }
                })
                .then(data => {
                    if (!data) {
                        res.send(400, 'Profile not found');
                        return;
                    }

                    // Vérifier s'il existe un autre utilisateur avec le même nom
                    model.utilisateurs
                        .findOne({
                            where: {
                                $and: [
                                    sequelize.where(
                                        sequelize.fn('lower', sequelize.col('name')),
                                        sequelize.fn('lower', vm.name)
                                    ),
                                    sequelize.where(sequelize.col('_id'), {$not: vm._id})
                                ]
                            }
                        })
                        .then(data => {
                            if (data) {
                                res.send(400, 'There is another user with this name');
                                return;
                            }

                            // Exécuter la transaction pour mettre à jour l'utilisateur
                            return trans.execTrans(res, t => {
                                return model.utilisateurs
                                    .update(
                                        {
                                            name: vm.name,
                                            is_active: vm.is_active == 'true' ? 1 : 0
                                        },
                                        {
                                            where: {
                                                _id: vm._id
                                            },
                                            transaction: t,
                                            individualHooks: true
                                        }
                                    )
                                    .then(user => {
                                        res.send(200);
                                    });
                            });
                        });
                });
        });
});

// Définir une route pour supprimer un utilisateur
router.delete('/', function(req, res, next) {
    var vm = req.query;

    // Vérifier si l'utilisateur existe
    model.utilisateurs
        .findOne({
            where: {
                _id: vm._id
            }
        })
        .then(data => {
            if (!data) {
                res.send(400, 'User not found');
                return;
            }

            // Exécuter la transaction pour supprimer l'utilisateur
            return trans.execTrans(res, t => {
                return model.utilisateurs
                    .destroy(
                        {
                            where: {
                                _id: vm._id
                            }
                        },
                        {
                            transaction: t
                        }
                    )
                    .then(result => {
                        res.send(200);
                    });
            });
        });
});

// Exporter le router express pour être utilisé dans d'autres parties de l'application
module.exports = router;