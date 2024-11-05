import express from "express";
import KPI from "../models/KPI.js";

const router = express.Router();

router.get("/kpis", async (req, res) => {
  console.log("Route handler reached");
  try {
    const kpis = await KPI.find();
    console.log("KPIs fetched:", kpis);
    res.status(200).json(kpis);
  } catch (error) {
    console.log("Error fetching KPIs:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
