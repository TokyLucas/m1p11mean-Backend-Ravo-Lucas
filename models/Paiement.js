const mongoose = require('mongoose');
const { Schema } = mongoose;

const paiementSchema = mongoose.Schema(
    {
        cardNumber: {
            type: String,
            required: [true, "Nom requis"]
        },
        cvv: {
            type: String,
            required: [false, ""]
        },
        expirationDate: {
            type: Date,
            required: [true, "Date requis"]
        },
        montant : {
            type: Number,
            required: [true, "Date requis"]
        },
        rendezVous: {
            type: Schema.Types.ObjectId, 
            ref: 'RendezVous'
        }
    }
);

const Paiement = mongoose.model('Paiement', paiementSchema);

module.exports = Paiement;