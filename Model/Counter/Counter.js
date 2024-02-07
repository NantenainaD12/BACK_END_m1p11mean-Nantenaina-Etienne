const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Création du schéma et du modèle pour le compteur
const CounterSchema = new Schema({
    _id: String,
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

// Fonction pour obtenir le prochain ID
async function getNextSequence(name) {
    let counter = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

// Exportation de la fonction getNextSequence
module.exports = getNextSequence;
