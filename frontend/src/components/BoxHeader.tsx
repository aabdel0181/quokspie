import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";

type Props = {
  title: string;
  sideText: string;
  subtitle?: string;
  icon?: React.ReactNode;
  fontSize?: string;
};

const BoxHeader = ({ icon, title, subtitle, sideText, fontSize }: Props) => {
  const { palette } = useTheme();
  return (
    <FlexBetween color={palette.grey[400]} margin="1.5rem 1rem 0 1rem">
      <FlexBetween>
        {icon}
        <Box width="100%">
          <Typography variant="h4" mb="-0.1rem" style={{ fontSize }}>
            {title}
          </Typography>
          <Typography variant="h6" style={{ fontSize }}>
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
        <Typography variant="h5" fontWeight="700" style={{ fontSize }} color={palette.secondary[500]}>
          {sideText}
        </Typography>
    </FlexBetween>
  );
};

export default BoxHeader;