import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useApiClient } from "../../../utils/apiClient";
import { useNavigate } from 'react-router-dom';
import { Recipe } from "../../../utils/recipe";

function GetAllRecipes() {
    const { apiCall } = useApiClient();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleViewRecipe = (recipeId: number) => {
        navigate(`/recipe/${recipeId}`);
    };

    const handleDeleteRecipe = async (recipeId: number, recipeName: string) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to delete "${recipeName}"? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(recipeId);
            
            const response = await apiCall(`/api/recipe/${recipeId}`, {
                method: 'DELETE',
                requiresAuth: true
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the deleted recipe from the state
            setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
            
            alert(`Recipe "${recipeName}" deleted successfully!`);
            
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const API_BASE_URL = 'http://localhost:5204';

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await apiCall('/api/recipe', {
                    method: 'GET',
                    requiresAuth: true
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
                setError("Failed to fetch recipes");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const getImageUrl = (recipe: Recipe) => {
        if (!recipe.imageUrl) {
            return '/placeholder-image.jpg';
        }
        if (recipe.imageUrl.startsWith('http')) {
            return recipe.imageUrl;
        }
        return `${API_BASE_URL}${recipe.imageUrl}`;
    };

    if (loading) {
        return (
            <div className="bg-[#FFC5BB] min-h-screen flex flex-col items-center justify-top pt-20">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600">Loading recipes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#FFC5BB] min-h-screen flex flex-col items-center justify-top pt-20">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFC5BB] min-h-screen flex flex-col items-center justify-top pt-20">
            <Navbar />
            <h1 className="text-3xl font-bold text-center mb-8">All Recipes</h1>
            
            <div className="w-full max-w-4xl px-4">
                {recipes.length === 0 ? (
                    <p className="text-center text-gray-600">No recipes found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recipes.map((recipe) => {
                            const imageSrc = getImageUrl(recipe);
                            
                            return (
                                <div key={recipe.id} className="bg-white rounded-lg shadow-md relative">
                                    {/* Delete Button  */}
                                    <button
                                        onClick={() => handleDeleteRecipe(recipe.id, recipe.recipeName)}
                                        disabled={deletingId === recipe.id}
                                        className="absolute -top-3 -right-3 z-50 
                                                 bg-white hover:bg-red-50 
                                                 rounded-full shadow-lg 
                                                 w-10 h-10 flex items-center justify-center
                                                 transition-all duration-200
                                                 hover:scale-110 hover:shadow-xl
                                                 focus:outline-none focus:ring-2 focus:ring-red-400
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Delete recipe"
                                        title="Delete recipe"
                                    >
                                        {deletingId === recipe.id ? (
                                            // Loading spinner while deleting
                                            <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <span className="text-xl"><img src="../assets/trash.png" alt="Delete" className="w-8 h-8 object-cover" /></span>
                                        )}
                                    </button>

                                    {/* Image Section */}
                                    <div className="w-full h-48 bg-gray-200 relative overflow-hidden rounded-t-lg">
                                        <img 
                                            src={imageSrc}
                                            alt={recipe.recipeName || "Recipe image"}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                // Fallback if image fails to load
                                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-2">
                                            {recipe.recipeName || "Untitled Recipe"}
                                        </h2>

                                        <p className="text-gray-600 mb-4">
                                            {recipe.totalMacros?.calories / recipe.numberOfServings ? 
                                                `${Math.round(recipe.totalMacros.calories / recipe.numberOfServings)} cal per serving` : 
                                                "No nutrition info"}
                                        </p>
                                        
                                        <button 
                                            onClick={() => handleViewRecipe(recipe.id)}
                                            className="w-full bg-[#E57373] text-white px-4 py-2 rounded hover:bg-[#E55555] transition-colors"
                                        >
                                            View Recipe
                                        </button>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GetAllRecipes;