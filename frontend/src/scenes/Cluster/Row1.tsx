import React, { useState, useEffect } from "react";
import DashboardBox from "../../components/DashboardBox";
import { Box, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import BoxHeader from "../../components/BoxHeader";
import { Link } from "react-router-dom";

const Row1 = () => {
    const [selected, setSelected] = useState("dashboard");
    const [selectedOption, setSelectedOption] = useState("");
    const [latestMttf, setLatestMttf] = useState<number | null>(null);
    const [mttfHistory, setMttfHistory] = useState<number[]>([]);
    const [timestamp, setTimestamp] = useState<string | null>(null);

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        const fetchLatestMttf = async () => {
            try {
                const response = await fetch("http://localhost:9000/latest-mttf");
                if (response.ok) {
                    const data = await response.json();
                    const newMttf = data.mttf_overall;

                    setLatestMttf(newMttf);

                    // Update MTTF history (keep only the last 5 entries)
                    setMttfHistory((prevHistory) => {
                        const updatedHistory = [...prevHistory, newMttf];
                        return updatedHistory.slice(-30); // Keep only the last 30 values
                    });

                    setTimestamp(data.timestamp);
                } else {
                    console.error("Failed to fetch latest MTTF.");
                }
            } catch (error) {
                console.error("Error fetching latest MTTF:", error);
            }
        };

        fetchLatestMttf();
    }, []);

    // Calculate the average of the last 5 MTTF values
    const calculateAverage = () => {
        if (mttfHistory.length === 0) return null;
        const sum = mttfHistory.reduce((acc, value) => acc + value, 0);
        return (sum / mttfHistory.length).toFixed(2); // Rounded to 2 decimal places
    };

    return (
        <>
            <DashboardBox gridArea="a">
                <Box display="flex" justifyContent="flex-end">
                    <Select
                        value={selectedOption}
                        onChange={handleChange}
                        displayEmpty
                        fullWidth={false}
                        variant="outlined"
                        sx={{
                            width: "25%",
                            color: "white",
                            backgroundColor: "#48494E",
                            "& .MuiSelect-icon": { color: "white" },
                            "& .MuiSelect-select": { fontSize: "0.7rem" },
                            marginBottom: "-1rem",
                        }}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    backgroundColor: "#48494E",
                                    color: "white",
                                },
                            },
                        }}
                    >
                        <MenuItem value="" disabled sx={{ color: "gray" }}>
                            Select Individual GPU
                        </MenuItem>
                        <MenuItem value="option1">
                            <Link
                                to="/AhmedGPU"
                                onClick={() => setSelected("dashboard")}
                                style={{
                                    color: "white",
                                    textDecoration: "inherit",
                                    width: "100%",
                                    display: "block",
                                }}
                            >
                                Ahmed's GPU
                            </Link>
                        </MenuItem>
                        <MenuItem value="option2">
                            <Link
                                to="/TaruGPU"
                                onClick={() => setSelected("predictions")}
                                style={{
                                    color: "white",
                                    textDecoration: "inherit",
                                    width: "100%",
                                    display: "block",
                                }}
                            >
                                Taru's GPU
                            </Link>
                        </MenuItem>
                    </Select>
                </Box>
                <BoxHeader
                    title="MTTF Overall (Lifetime Left in Hours)"
                    subtitle={`Relative GPU cluster health ${
                        timestamp ? `as of ${new Date(timestamp).toLocaleString()}` : ""
                    }`}
                    sideText="+35%"
                    fontSize="1.25rem"
                />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    fontSize="1rem"
                    height="100%"
                    style={{ marginTop: "-60px" }}
                >
                    <h1 style={{ fontSize: "7rem", color: "white" }}>
                    {mttfHistory.length > 0 ? calculateAverage() : "Loading..."}
                    </h1>
                    {/* <h2 style={{ fontSize: "3rem", color: "lightgray" }}>
                        Avg: {mttfHistory.length > 0 ? calculateAverage() : "N/A"}
                    </h2> */}
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
