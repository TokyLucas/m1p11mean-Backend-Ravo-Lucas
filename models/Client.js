const mongoose = require('mongoose');

const clientSchema = mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, "Nom requis"]
        },
        prenom: {
            type: String,
            required: [true, "Prénom requis"]
        },
        dateDeNaissance: {
            type: Date,
            required: [true, "Date requis"]
        },
        sexe: {
            type: String,
            enum: ["Homme", "Femme"],
            default: "Homme"
        }
    }
);

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;