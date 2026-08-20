import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/(authenticated)/dashboard';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute'; 
import Ingredients from './pages/(authenticated)/(tabs)/ingredients';
import CreateIngredient from './pages/(authenticated)/(tabs)/createingredient';
import CreateRecipes from './pages/(authenticated)/(tabs)/createrecipes';
import GetAllRecipes from './pages/(authenticated)/(tabs)/recipes';
import RecipeDescription from './pages/(authenticated)/(tabs)/RecipeDescription';
import EditRecipe from './pages/(authenticated)/(tabs)/editrecipe';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ingredients"
            element={
              <ProtectedRoute>
                <Ingredients />
              </ProtectedRoute>
            }
          />

          <Route
            path="/createingredient"
            element={
              <ProtectedRoute>
                <CreateIngredient />
              </ProtectedRoute>
            }
          />

          <Route
            path="/createrecipes"
            element={
              <ProtectedRoute>
                <CreateRecipes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/getrecipes"
            element={
              <ProtectedRoute>
                <GetAllRecipes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipe/:id"  
            element={
                <ProtectedRoute>
                    <RecipeDescription />
                </ProtectedRoute>
            }
          />

          <Route
            path="/recipe/edit/:id"
            element={
              <ProtectedRoute>
                <EditRecipe />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;