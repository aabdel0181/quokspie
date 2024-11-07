import express from "express";

const kpiRoutes = (dynamoDB) => {
    const router = express.Router();
    const TABLE_NAME = "Kpis";

    // GET endpoint to fetch all KPIs
    router.get("/kpis", async (req, res) => {
        const params = {
            TableName: TABLE_NAME,
        };

        try {
            // scan operation to get all items in table
            const data = await dynamoDB.scan(params).promise();
            res.status(200).json(data.Items);
        } catch (error) {
            console.error("Error fetching KPIs:", error);
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};

export default kpiRoutes;