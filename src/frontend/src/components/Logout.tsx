import React, { useState } from "react";
import { Button, Typography, Container, Box } from "@mui/material";

function Logout() {
  const [message, setMessage] = useState<string>("");

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    setMessage("Logout successful");
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Logout
        </Typography>
        <Button
          onClick={handleLogout}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Logout
        </Button>
        {message && (
          <Typography color="error" variant="body2">
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Logout;
