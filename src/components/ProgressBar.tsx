import React from "react";
import { LinearProgress, Typography } from "@mui/material";

const progress = 50; // Example value, replace with your logic or prop

<LinearProgress
  variant="determinate"
  value={progress}
  sx={{
    height: 8,
    borderRadius: 6,
    background: "#212d23",
    "& .MuiLinearProgress-bar": {
      background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
    },
  }}
/>;
<Typography
  align="center"
  mt={1}
  fontWeight={700}
  fontSize="1.1rem"
  sx={{ color: "#151d18", textShadow: "0 2px 8px #0008" }}
>
  {1}/{10} từ hôm nay
</Typography>;
