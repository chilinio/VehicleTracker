import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom CSS variables for the Auto Extreme site
const style = document.createElement('style');
style.textContent = `
  :root {
    --primary: 358 77% 59%;
    --dark: 214 48% 23%;
    --light: 97 36% 96%;
    --accent: 203 36% 44%;
    --secondary: 187 47% 76%;
    
    --font-sans: 'Inter', sans-serif;
    --font-display: 'Montserrat', sans-serif;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
