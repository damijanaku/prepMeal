import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useApiClient } from "../../../utils/apiClient";
import { useNavigate } from 'react-router-dom';

interface Nutrition {
    servingSize: number;
    servingUnit: string;
    calories: number;
    carbs: number;
    sugar: number;
    fats: number;
    saturatedFats: number;
    protein: number;
    sodium: number;
}

interface Ingredient {
    id: number;
    name: string;
    foodGroup: string;
    amount: number;
    unit: string;
    nutrition: Nutrition;
}

interface Recipe {
    id: number;
    recipeName: string;
    instructions: string;
    imageUrl: string | null;
    numberOfServings: number;
    createdAt: string;
    ingredients: Ingredient[];
    totalMacros: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
}

function GetAllRecipes() {
    const { apiCall } = useApiClient();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleViewRecipe = (recipeId: number) => {
        navigate(`/recipe/${recipeId}`);
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
            return '/placeholder-image.jpg'; // Your placeholder image
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
                            //  Use imageUrl from API response
                            const imageSrc = getImageUrl(recipe);
                            
                            return (
                                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    {/* Image Section */}
                                    <div className="w-full h-48 bg-gray-200 relative">
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
                                            {recipe.totalMacros?.calories / recipe.numberOfServings ? `${Math.round(recipe.totalMacros.calories / recipe.numberOfServings)} cal` : "No instructions provided."}
                                        </p>
                                        
                                        {/* View Recipe Button */}
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