const mongoose = require('mongoose');

const employeSchema = mongoose.Schema(
    {
        photoDeProfil: { type: String },
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

const Employe = mongoose.model('Employe', employeSchema);

module.exports = Employe;