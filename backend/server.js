require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");



const app = express();

//Middleware to handle CORS
// Middleware to handle CORS (supports multiple origins)
const rawClientUrls = process.env.CLIENT_URL || "";
const allowedOrigins = rawClientUrls === "*" 
  ? "*" 
  : rawClientUrls.split(',').map(u => u.trim()).filter(Boolean);

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (e.g. curl, server-to-server)
    if (!origin) return callback(null, true);

    // allow all origins if wildcard specified
    if (allowedOrigins === "*") return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true, // set to true only if you need cookies/auth via cookies
  optionsSuccessStatus: 204
};

// enable CORS for all routes using the options
app.use(cors(corsOptions));
// explicitly handle preflight for all routes
app.options('*', cors(corsOptions));


app.use(express.json());

connectDB();

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/income",incomeRoutes)
app.use("/api/v1/expense",expenseRoutes)
app.use("/api/v1/dashboard",dashboardRoutes)


//Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`));

// after your other app.use(...) lines
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, ts: Date.now(), env: process.env.NODE_ENV || 'dev' });
});
