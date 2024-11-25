import AWS from "aws-sdk";
import deviceRoutes from "./routes/deviceRoutes.js"; // Updated route import
import express from "express";
import session from "express-session"; // Import session
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import routes from "./routes/routes.js"; // Import your routes

// Load environment variables
dotenv.config();

/* CONFIGURATIONS */
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    cors({
      origin: 'http://localhost:1337', // Replace with your frontend's URL
      methods: ['GET', 'POST', 'OPTIONS'], // Allow these HTTP methods
      credentials: true, // Allow cookies and credentials
    })
  );

// Configure session middleware
app.use(
    session({
        secret: "quokspie", 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set secure: true in production with HTTPS
    })
);

console.log("hello");

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.post("/register", routes.post_register); // Register route
app.post("/login", routes.post_login);
app.post("/logout", routes.post_logout);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        //* ADD DATA ONE TIME ONLY OR AS NEEDED
        //await mongoose.connection.db.dropDatabase();
        //KPI.insertMany(kpis);
        //Product.insertMany(products);
    })
    .catch((error) => console.log(`${error} did not connect`));

// AWS SDK Configuration for DynamoDB
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Route setup (pass DynamoDB client to deviceRoutes)
app.use("/api", deviceRoutes(dynamoDB));
