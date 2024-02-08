const mongoose = require('mongoose');
const { Schema } = mongoose;

const horaireDeTravailSchema = mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, "Date requis"]
        },
        heure_debut: {
            type: String, 
            required: [true, "Heure de debut requis"],
            match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Heure doit etre de la forme HH:mm"]
        },
        heure_fin: {
            type: String,
            required: [true, "Heure de fin requis"],
            match: [/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Heure doit etre de la forme HH:mm"]
        },
        employe: { 
            type: Schema.Types.ObjectId,
            ref: 'Employe' 
        }
    }
);

const HoraireDeTravail = mongoose.model('HoraireDeTravail', horaireDeTravailSchema);

module.exports = HoraireDeTravail;