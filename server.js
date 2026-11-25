const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.dbURI);

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const dataSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true
    },
    visualization_type:{
        type:Number,
        required:true
    },
    trial_number:{
        type:Number,
        required:true
    },
    actual_percent_diff:{
        type:Number,
        required:true
    },
    reported_percent_diff:{
        type:Number,
        required:true
    }
})
const Data = mongoose.model("Data", dataSchema);
module.exports = Data;
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post( "/submit", (req, res) => {
        const { name, visualization_type, trial_number, actual_percent_diff, reported_percent_diff } = req.body;
        const newData = new Data({ name, visualization_type, trial_number, actual_percent_diff, reported_percent_diff });
        newData.save()
            .then(() => res.status(200).send("Form submitted successfully"))
            .catch(err => res.status(500).send("Error writing to MongoDB"));
    }
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});