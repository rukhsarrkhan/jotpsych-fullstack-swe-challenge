import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Container, Box, Button } from "@mui/material";

function Home() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      // get access token
      const token = localStorage.getItem("access_token");

      if (token) {
        const response = await fetch("http://localhost:3002/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography component="h2" variant="h4">
          Home
        </Typography>
        {username ? (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Welcome, {username}!
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Please{" "}
              <Button component={Link} to="/login" variant="contained">
                login
              </Button>{" "}
              or{" "}
              <Button component={Link} to="/register" variant="contained">
                register
              </Button>
              .
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
