import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { Recipe } from "@/utils/recipe";
import { useEffect, useState } from "react";
import { useApiClient } from "../../../utils/apiClient";

function EditRecipe() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { apiCall } = useApiClient();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const API_BASE_URL = 'http://localhost:5204';

    const updateRecipe = async () => {
        if (!recipe) return;

        setSaving(true);
        try {

            const updateData = {
                recipeName: recipe.recipeName,
                instructions: recipe.instructions,
                numberOfServings: recipe.numberOfServings,
                ingredients: recipe.ingredients.map(ingredient => ({
                    ingredientId: ingredient.id, 
                    amount: ingredient.amount,
                    unit: ingredient.unit || "g"
                }))
            };

            const response = await apiCall(`/api/recipe/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
                requiresAuth: true
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Recipe updated:', data);
            alert("Recipe updated successfully!");
            navigate(`/recipe/${id}`);
        } catch (error) {
            console.error("Error updating recipe:", error);
            alert(`Failed to update recipe: ${error instanceof Error ? error.message : "Please try again."}`);
        } finally {
            setSaving(false);
        }
    };

    const addIngredient = () => {
        if (!recipe) return;
        
        const newIngredient = {
            id: Date.now(), // Temporary ID for new ingredient
            name: "",
            foodGroup: "",
            amount: 0,
            unit: "g",
            nutrition: {
                servingSize: 0,
                servingUnit: "g",
                calories: 0,
                carbs: 0,
                sugar: 0,
                fats: 0,
                saturatedFats: 0,
                protein: 0,
                sodium: 0
            }
        };
        
        setRecipe({
            ...recipe,
            ingredients: [...recipe.ingredients, newIngredient]
        });
    };

    const removeIngredient = (ingredientId: number) => {
        if (!recipe) return;
        
        setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.filter(i => i.id !== ingredientId)
        });
    };

    const updateIngredient = (ingredientId: number, field: string, value: any) => {
        if (!recipe) return;
        
        setRecipe({
            ...recipe,
            ingredients: recipe.ingredients.map(i => 
                i.id === ingredientId ? { ...i, [field]: value } : i
            )
        });
    };

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
                {/* Button Container */}
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => navigate('/getrecipes')}
                        className="text-white hover:text-[#E55555] transition-colors flex items-center gap-2"
                    >
                        Back to Recipes
                    </button>
                    
                    <button 
                        onClick={updateRecipe}
                        disabled={saving}
                        className="text-white hover:text-[#E55555] transition-colors flex items-center gap-2"
                    >
                        Save Changes
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Image Section */}
                    <div className="w-full h-64 bg-gray-200 relative">
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
                        <div className="mb-4">
                            <input
                                type="text"
                                value={recipe.recipeName}
                                onChange={(e) => setRecipe({ ...recipe, recipeName: e.target.value })}
                                className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-[#E57373] outline-none pb-2"
                                placeholder="Recipe Name"
                            />
                        </div>

                        {/* Servings Info */}
                        <div className="mb-4">
                            <label className="block text-gray-600 font-medium mb-2">Number of Servings</label>
                            <input
                                type="number"
                                value={recipe.numberOfServings}
                                onChange={(e) => setRecipe({ ...recipe, numberOfServings: parseInt(e.target.value) || 1 })}
                                min="1"
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E57373]"
                            />
                        </div>

                        {/* Macros*/}
                        <div className="bg-gray-50 p-4 my-4 rounded">
                            <h3 className="font-semibold mb-2">Nutrition per serving (auto-calculated)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <p>Calories: {Math.round(recipe.totalMacros?.calories / recipe.numberOfServings)}</p>
                                <p>Protein: {Math.round(recipe.totalMacros?.protein / recipe.numberOfServings)}g</p>
                                <p>Carbs: {Math.round(recipe.totalMacros?.carbs / recipe.numberOfServings)}g</p>
                                <p>Fats: {Math.round(recipe.totalMacros?.fats / recipe.numberOfServings)}g</p>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold">Ingredients</h2>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="bg-[#E57373] text-white px-4 py-1 rounded hover:bg-[#E55555] transition-colors text-sm"
                                >
                                    + Add Ingredient
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {recipe.ingredients.map((ingredient) => (
                                    <li key={ingredient.id} className="border-b pb-2">
                                        <div className="flex gap-2 items-center flex-wrap">
                                            <input
                                                type="text"
                                                value={ingredient.name}
                                                onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                                                placeholder="Ingredient name"
                                                className="flex-1 min-w-[150px] px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E57373]"
                                            />
                                            <input
                                                type="number"
                                                value={ingredient.amount}
                                                onChange={(e) => updateIngredient(ingredient.id, 'amount', parseFloat(e.target.value) || 0)}
                                                placeholder="Amount"
                                                className="w-20 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E57373]"
                                            />
                                            <input
                                                type="text"
                                                value={ingredient.unit}
                                                onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                                                placeholder="Unit"
                                                className="w-16 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E57373]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(ingredient.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {recipe.ingredients.length === 0 && (
                                <p className="text-gray-500 text-sm mt-2">No ingredients added. Click "Add Ingredient" to add some.</p>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                            <textarea
                                value={recipe.instructions}
                                onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
                                placeholder="Enter recipe instructions..."
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E57373] resize-vertical"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditRecipe;