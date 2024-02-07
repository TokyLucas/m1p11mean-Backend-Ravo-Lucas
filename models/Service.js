const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, "Nom requis"]
        }
    }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;