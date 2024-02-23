const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

const compteSchema = new mongoose.Schema(
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

function hash(motdepasse){
    let hash = crypto.createHash('sha256');
    hash.update(`${motdepasse}-${process.env.PASSWORD_SALT}`);
    let hashed = hash.digest('hex');
    return hashed;
}

compteSchema.pre('save', function(next) {
    let motdepasse = this.motdepasse;
    this.motdepasse = hash(motdepasse);
    next();
});

compteSchema.pre('aggregate', function(next) {
    console.log(this.pipeline()[2]["$match"]["motdepasse"]);
    let motdepasse = this.pipeline()[2]["$match"]["motdepasse"];
    this.pipeline()[2]["$match"]["motdepasse"] = hash(motdepasse);
    console.log(this.pipeline()[2]["$match"]["motdepasse"]);
    next();
});

compteSchema.pre('updateOne', function(next) {
    let oldMotdepasse = this._update.motdepasse;
    this._update.motdepasse = hash(oldMotdepasse);
    next();
});

const Compte = mongoose.model('Compte', compteSchema);

module.exports = Compte;