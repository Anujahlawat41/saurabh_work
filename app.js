const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Candidate = require('./Models/candidate');
const multer = require('multer');
const path = require('path');

const app = express();

//  middleware
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://anujahlawat532:Admin%40123@cluster0.zgr8jhl.mongodb.net/mernstack_machine_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); //  saved in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with current timestamp
    }
});
const upload = multer({ storage: storage });

app.post('/api/candidates', async (req, res) => {
    try {
        const candidateData = req.body;

        // Check for "Same as Residential"
        if (candidateData.sameAsResidential) {
            candidateData.permanentAddress.street1 = candidateData.residentialAddress.street1;
            candidateData.permanentAddress.street2 = candidateData.residentialAddress.street2;
        }
        // Handle file upload
        if (req.files) {
            candidateData.documents = req.files.map(file => ({
                fileName: file.filename,
                fileType: file.mimetype,
                file: file.path
            }));
        }


        const candidate = new Candidate(candidateData);
        await candidate.save();

        res.status(201).json({ message: 'Candidate created successfully', candidate });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});