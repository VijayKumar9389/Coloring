import {
    Container,
} from "@mui/material";
import Coloring from "./components/Coloring/Coloring.tsx";



function App() {

    return (
        <Container maxWidth="md" sx={{mt: 4}}>
            <Coloring />
        </Container>
    );
}

export default App;