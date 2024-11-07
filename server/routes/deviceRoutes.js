import express from "express";

const deviceRoutes = (dynamoDB) => {
    const router = express.Router();
    const TABLE_NAME = "senior_design_dummy";

    // GET endpoint to fetch all device data
    router.get("/devices", async (req, res) => {
        const params = {
            TableName: TABLE_NAME,
        };

        try {
            // Scan operation to get all items in the table
            const data = await dynamoDB.scan(params).promise();
            res.status(200).json(data.Items);
        } catch (error) {
            console.error("Error fetching device data:", error);
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};

export default deviceRoutes;
