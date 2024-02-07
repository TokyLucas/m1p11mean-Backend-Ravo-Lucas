const mongoose = require('mongoose');
const { Schema } = mongoose;

const rendezVousSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Date requis"]
        },
        services: [{
            type: Schema.Types.ObjectId, 
            ref: 'Service'  
        }],
        employe: { 
            type: Schema.Types.ObjectId, 
            ref: 'Employe' 
        },
        client: { 
            type: Schema.Types.ObjectId,
            ref: 'Client' 
        }
    }
);

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;