const mongoose = require('mongoose');

const depenseSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Loyer", "Achat piéces", "Autres dépenses"],
            default: "Achat piéces"
        },
        description: {
            type: String
        },
        prix: {
            type: Number,
            required: [true, "Prix requis"]
        },
        date: {
            type: Date,
            required: [true, "Date requis"]
        }
    }
);

const Depense = mongoose.model('Depense', depenseSchema);

module.exports = Depense;