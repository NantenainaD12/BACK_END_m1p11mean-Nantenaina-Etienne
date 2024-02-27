const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var employeeFields = new Schema({
    idEmploye: {
        type: Number,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mdp: {
        type: String,
        required: true
    },
    pdp: {
        type: String, // Utilisation d'un lien vers l'image du profil (String)
        required: true
    },
    horaireDebut: {
        type: String, 
        required: true
    },
    horaireFin: {
        type: String, 
        required: true
    },
    salaire: {
        type: Number 
    }
});
employeeFields.methods.authenticate = async function (mdp) {
    try {
        // Comparez le mot de passe fourni avec le hachage stocké dans la base de données
        const passwordsMatch = await bcrypt.compare(mdp, this.mdp);
        return passwordsMatch;
    } catch (error) {
        console.error('Erreur lors de la comparaison des mots de passe :', error);
        throw error;
    }
};



module.exports = mongoose.model('employes',employeeFields);
