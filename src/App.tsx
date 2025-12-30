import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PersonaProtectedRoute from './components/PersonaProtectedRoute'
import Layout from './components/layout/Layout'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import PersonaManagement from './pages/PersonaManagement'
import PlaceholderPage from "./pages/PlaceholderPage.tsx";
import {Home} from "lucide-react";
import InventoryDashboard from "./pages/InventoryDashboard.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <InventoryDashboard/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />



                    <Route path="/management/properties" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PlaceholderPage title={"Das"} description={""} icon={Home}/>
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />




                    <Route path="/persona-management" element={
                        <ProtectedRoute>
                            <PersonaProtectedRoute>
                                <Layout>
                                    <PersonaManagement />
                                </Layout>
                            </PersonaProtectedRoute>
                        </ProtectedRoute>
                    } />

                    {/* Redirect root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App