const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const PORT = 5000;

app.use(express.json());

const db = new sqlite3.Database("/app/data/app.db");

db.run(`
    CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

app.get("/api/health", (req, res) => {

    res.json({
        message: "Backend is working successfully!"
    });

});

app.get("/api/visits", (req, res) => {

    db.run(
        "INSERT INTO visits DEFAULT VALUES",
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: error.message
                });
            }

            db.get(
                "SELECT COUNT(*) AS count FROM visits",
                (error, row) => {

                    if (error) {
                        return res.status(500).json({
                            error: error.message
                        });
                    }

                    res.json({
                        visits: row.count
                    });

                }
            );

        }
    );

});

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Backend running on port ${PORT}`);

});
