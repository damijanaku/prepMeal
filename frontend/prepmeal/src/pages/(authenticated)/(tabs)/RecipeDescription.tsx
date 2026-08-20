import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiClient } from "../../../utils/apiClient";
import Navbar from "../../../components/Navbar";
import { Recipe } from "../../../utils/recipe";


function RecipeDescription() {
    const { id } = useParams<{ id: string }>(); // recipe ID from URL
    const navigate = useNavigate();
    const { apiCall } = useApiClient();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const API_BASE_URL = 'http://localhost:5204';

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            if (!id) {
                setError("Recipe ID not found");
                setLoading(false);
                return;
            }

            try {
                const response = await apiCall(`/api/recipe/${id}`, {
                    method: 'GET',
                    requiresAuth: true
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRecipe(data);
            } catch (error) {
                console.error("Error fetching recipe details:", error);
                setError("Failed to fetch recipe details");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

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
            <div className="bg-[#FFC5BB] min-h-screen flex flex-col items-center pt-20">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-600">Loading recipe details...</p>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="bg-[#FFC5BB] min-h-screen flex flex-col items-center pt-20">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-600">{error || "Recipe not found"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFC5BB] min-h-screen flex flex-col items-center pt-20">
            <Navbar />
            <div className="w-full max-w-4xl px-4">
                <button 
                    onClick={() => navigate('/getrecipes')}
                    className="mb-6 text-white hover:text-[#E55555]"
                >
                     Back to Recipes
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full h-64 bg-gray-200">
                        <img 
                            src={getImageUrl(recipe)}
                            alt={recipe.recipeName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            }}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">{recipe.recipeName}</h1>

                        {/* Servings Info */}
                        <div className="mb-4">
                            <p className="text-gray-600">
                                Servings: {recipe.numberOfServings}
                            </p>
                        </div>

                        {/* Macros */}
                        <div className="bg-gray-50 p-4 my-4 rounded">
                            <h3 className="font-semibold mb-2">Nutrition per serving</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <p>Calories: {Math.round(recipe.totalMacros?.calories / recipe.numberOfServings)}</p>
                                <p>Protein: {Math.round(recipe.totalMacros?.protein / recipe.numberOfServings)}g</p>
                                <p>Carbs: {Math.round(recipe.totalMacros?.carbs / recipe.numberOfServings)}g</p>
                                <p>Fats: {Math.round(recipe.totalMacros?.fats / recipe.numberOfServings)}g</p>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                            <ul className="space-y-2">
                                {recipe.ingredients.map((ingredient) => (
                                    <li key={ingredient.id} className="border-b pb-2">
                                        <span className="font-medium">{ingredient.name}</span>
                                        <span className="text-gray-600 ml-2">
                                            {ingredient.amount} {ingredient.unit}
                                        </span>
                                        <span className="text-gray-500 ml-2 text-sm">
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {recipe.instructions || "No instructions provided."}
                                </p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeDescription;