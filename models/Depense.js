const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
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

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;