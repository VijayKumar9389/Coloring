import { Container, Card, CardActionArea, CardContent, Typography, Grid } from "@mui/material";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Coloring from "./pages/Coloring/index.tsx";
import Drawing from "./pages/Drawing";
import AnimatedPicture from "./pages/AnimatedPicture/AnimatedPicture.tsx";

const activities = [
    { label: "Coloring", path: "/coloring", description: "Create and customize colors" },
    { label: "Drawing", path: "/drawing", description: "Draw freely on canvas" },
    { label: "Animated Picture", path: "/animated-picture", description: "Touch picture to make parts fall" },
];

const ActivitySelector = () => {
    const navigate = useNavigate();

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4} justifyContent="center">
                {activities.map(({ label, path, description }) => (
                    <Grid key={path} xs={12} sm={6} md={4}>
                        <Card>
                            <CardActionArea onClick={() => navigate(path)}>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        {label}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Container sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                <Routes>
                    {/* Home page shows the activity selector as a card list */}
                    <Route path="/" element={<ActivitySelector />} />

                    {/* Routes for activities */}
                    <Route path="/coloring" element={<Coloring />} />
                    <Route path="/drawing" element={<Drawing />} />
                    <Route path="/animated-picture" element={<AnimatedPicture />} />

                    {/* Redirect to home if no match */}

                    {/* Redirect unknown routes to home */}
                    <Route path="*" element={<ActivitySelector />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;