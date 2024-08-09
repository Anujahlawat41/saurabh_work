const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    residentialAddress: {
        street1: { type: String, required: true },
        street2: { type: String },
    },
    permanentAddress: {
        street1: { type: String, required: function() { return !this.sameAsResidential; }},
        street2: { type: String },
    },
    sameAsResidential: { type: Boolean, required: true },
    documents: [
        {
            fileName: { type: String, required: true },
            fileType: { type: String, required: true },
            file: { type: String, required: true }
        }
    ]
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
