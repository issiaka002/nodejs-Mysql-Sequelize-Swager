// Activer le mode strict pour un meilleur contrôle du code
'use strict';

// Définir la fonction constructeur du module Transaction
var Transaction = function() {
    // Initialiser le modèle à une valeur vide
    this.model = {};
};

// Définir une méthode pour définir le modèle dans l'instance de Transaction
Transaction.prototype.setModel = function(model) {
    // Affecter le modèle passé en argument à l'instance de Transaction
    this.model = model;
};

// Définir une méthode pour exécuter une transaction
Transaction.prototype.execTrans = function(res, func) {
    // Utiliser la méthode de transaction de Sequelize pour démarrer une transaction
    return this.model.sequelize
        .transaction({
            autocommit: false
        })
        .then(function(t) {
            t.trace_model = res.trace_model;
            return func(t)
                .then(function() {
                    // Si tout se passe bien, valider la transaction
                    t.commit();
                })
                .catch(function(error) {
                    // En cas d'erreur, envoyer une réponse HTTP 500 avec l'erreur
                    console.error('error transaction', error);
                    res.send(500, error);
                    // Rejeter la transaction
                    return t.rollback();
                });
        });
};

// Exporter une instance unique de Transaction pour une utilisation dans d'autres fichiers
module.exports = new Transaction();
