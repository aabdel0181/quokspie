import express from "express";

const productRoutes = (dynamoDB) => {
    const router = express.Router();
    const TABLE_NAME = "Products";

    // GET endpoint to fetch all products
    router.get("/products", async (req, res) => {
        const params = {
            TableName: TABLE_NAME,
        };

        try {
            // scan op to get all items in table
            const data = await dynamoDB.scan(params).promise();
            res.status(200).json(data.Items);
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};

export default productRoutes;