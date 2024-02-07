const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const rendezVousSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Date requis"]
        },
        services: {
            type: Array,
            required: [true, "Services requis"]
        },
        clt_id: {
            type: String,
            required: [true, "Client ID requis"]
        },
        emp_id: {
            type: String,
            required: [true, "Employe ID requis"]
        }
    }
);

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;