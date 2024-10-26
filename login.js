const mysql = require("mysql2"); // Use mysql2 for compatibility
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const app = express();
// const login=require("./login.css")
const encoder = bodyParser.urlencoded({ extended: true }); // Use extended option for better parsing
const path = require('path');
app.use("/assets",express.static("assets")); 
app.use("/earth",express.static("earth")); 
const connection = mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "NORDOP777@m", 
    database: "nodejs"
});

// Connect to the database
connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected to database successfully");
});
 
app.get('/earth/about.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'earth', 'about.html'));
});

app.get('/earth/contactus.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'earth', 'contactus.html'));
});

// Serve the main login page
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Serve the registration page
app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html"); // Serve your registration form
});

// Handle user registration
app.post("/register", encoder, function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Hash the password before storing it
    bcrypt.hash(password, 10, function(err, hash) {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while hashing the password.");
        }

        // Store the new user in the database
        connection.query("INSERT INTO loginuser (user_name, user_pass) VALUES (?, ?)", [username, hash], function(error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("An error occurred while inserting the user.");
            }
            res.sendFile(__dirname + "/index.html"); // Inform the user of successful registration
        });
    });
});

// Handle login form submission
app.post("/", encoder, function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Query the database to find the user
    connection.query("SELECT * FROM loginuser WHERE user_name = ?", [username], function(error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("An error occurred while querying the database.");
        }

        if (results.length > 0) {
            const user = results[0];
            // Compare the entered password with the stored hash
            bcrypt.compare(password, user.user_pass, function(err, match) {
                if (err) {
                    console.error(err);
                    return res.status(500).send("An error occurred during password comparison.");
                }

                if (match) {
                    res.redirect("/welcome"); // Redirect to welcome route if passwords match
                } else {
                    res.redirect("/"); // Redirect back to login if passwords do not match
                }
            });
        } else {
            res.redirect("/"); // Redirect back to login if user not found
        }
    });
});

// Handle user details update
app.post("/update", encoder, function(req, res) {
    const username = req.body.username; // Assuming the username is sent in the form
    const newPassword = req.body.newPassword; // New password entered by the user

    // Hash the new password before updating it
    bcrypt.hash(newPassword, 10, function(err, hash) {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while hashing the new password.");
        }

        // Update the user in the database
        connection.query("UPDATE loginuser SET user_pass = ? WHERE user_name = ?", [hash, username], function(error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("An error occurred while updating the user.");
            }
            res.send("User details updated successfully!"); // Inform the user of successful update
        });
    });
});

// Serve the welcome page
app.get("/welcome", function(req, res) {
    res.sendFile(__dirname + "/welcome.html");
});

// Start the server
app.listen(4000, function() {
    console.log("Server is running on http://localhost:4000");
});
