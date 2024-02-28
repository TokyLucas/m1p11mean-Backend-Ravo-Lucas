const mongoose = require('mongoose');
const { Schema } = mongoose;

const rendezVousSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Date requis"]
        },
        contact: {
            type: String
        },
        employe: { 
            type: Schema.Types.ObjectId, 
            ref: 'Employe' 
        },
        client: { 
            type: Schema.Types.ObjectId,
            ref: 'Client' 
        },
        services: [{
            type: Schema.Types.ObjectId, 
            ref: 'Service'  
        }],
        tachesEffectue: [{
            type: Schema.Types.ObjectId, 
            ref: 'Service'
        }],
        dejaPaye: {
            type: Boolean,
            default: false
        }
    }
);

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;