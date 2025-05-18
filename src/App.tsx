import {
    Container,
} from "@mui/material";
import Coloring from "./components/Coloring/index.tsx";



function App() {

    return (
        <Container sx={{width: '100%', height: '100%'}}>
            <Coloring />
        </Container>
    );
}

export default App;