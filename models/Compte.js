const mongoose = require('mongoose');
const { Schema } = mongoose;

const compteSchema = mongoose.Schema(
    {
        login: {
            type: String,
            required: [true, "Login requis"]
        },
        motdepasse: {
            type: String,
            required: [true, "Mot de passe requis"],
            minLength: 8
        },
        typeUser: {
            type: String,
            enum: ["Client", "Employe", "Manager"],
            default: "Client"
        },
        userId: {
            type: Schema.Types.ObjectId,
            refPath: 'typeUser',
        },
    }
);

const Compte = mongoose.model('Compte', compteSchema);

module.exports = Compte;