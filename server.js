const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 8000;
const csvWriter = require("csv-writer")
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const writer = csvWriter.createObjectCsvWriter({
    path: "data.csv",
    header: [
        { id: "name", title: "Name" },
        { id: "visualization_type", title: "Visualization Type" },
        { id: "trial_number", title: "Trial Number" },
        { id: "actual_percent_diff", title: "Actual Percent Diff" },
        { id: "reported_percent_diff", title: "Reported Percent Diff" }
    ]
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/downloaddata", (req, res) => {
    res.download(path.join(__dirname, "data.csv"));
});
app.post( "/submit", (req, res) => {
        const { name, visualization_type, trial_number, actual_percent_diff, reported_percent_diff } = req.body;
        writer.writeRecords([{ name, visualization_type, trial_number, actual_percent_diff, reported_percent_diff }])
            .then(() => res.status(200).send("Form submitted successfully"))
            .catch(err => res.status(500).send("Error writing to CSV"));
    }
);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});