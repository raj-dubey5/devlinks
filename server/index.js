require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes")
const linkRoutes = require("./routes/linkRoutes")
const profileRoutes = require("./routes/profileRoutes");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://devlinks-raj.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/profile", profileRoutes);
connectDB();

app.get("/", (req, res) => {
    res.json({ message: "DevLinks API is running" });
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
})