import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./i18n/i18n"
import App from './App.tsx'
import {AuthProvider} from "./auth/AuthContext.tsx";
import "./styles/global.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
