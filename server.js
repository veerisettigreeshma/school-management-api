const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./db");
const calculateDistance = require("./distance");

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Add School API
app.post("/addSchool", (req, res) => {

  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const query =
    "INSERT INTO schools (name,address,latitude,longitude) VALUES (?,?,?,?)";

  db.query(query, [name, address, latitude, longitude], (err, result) => {

    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json({
      message: "School added successfully"
    });

  });

});


// List Schools API
app.get("/listSchools", (req, res) => {

  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  const query = "SELECT * FROM schools";

  db.query(query, (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    const schoolsWithDistance = results.map((school) => {

      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance
      };

    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);

  });

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});