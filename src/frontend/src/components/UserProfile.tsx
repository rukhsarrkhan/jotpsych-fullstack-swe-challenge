import { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import APIService from "../services/APIService";

function UserProfile() {
  const [username, setUsername] = useState<string>("");
  const [motto, setMotto] = useState<string>("My motto goes here!");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const apiService = APIService.getInstance();
        const data = await apiService.request("/user", "GET", null, true);
        setUsername(data.username);
        setMotto(data.motto)
      } catch (error) {
        if (error instanceof Error) {
            setMessage(error.message);
          } else {
            setMessage("An unknown error occurred");
          }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          border: "1px solid #ccc",
          borderRadius: "8px",
          p: 4,
        }}
      >
        <Avatar sx={{ width: 64, height: 64, mb: 2 }}>A</Avatar>
        <Typography variant="h6">{username}</Typography>
        <Typography variant="h4" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
          {motto}
        </Typography>
        {message && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button
            variant="contained"
            color="success"
            component={Link}
            to="/record-motto"
            sx={{ mr: 2 }}
          >
            Record (New) Motto
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default UserProfile;
