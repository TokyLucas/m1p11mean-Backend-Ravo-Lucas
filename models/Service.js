const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, "Nom requis"]
        },
        prix: {
            type: Number,
            required: [true, "Prix requis"]
        },
        duree: {
            type: Number,
            required: [true, "Durée requis"]
        },
        commission: {
            type: Number,
            required: [true, "Commission requis"]
        }
    }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;