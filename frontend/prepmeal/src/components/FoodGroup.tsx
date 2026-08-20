import { useState } from "react";
import { useApiClient } from "../utils/apiClient";

interface Ingredient {
    id: number;
    name: string;
    foodGroup: string;  
    nutrition?: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
}

function FoodGroupList() {
    const { apiCall } = useApiClient();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedFoodGroup, setSelectedFoodGroup] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const foodGroups = [
        { name: "fruits" },
        { name: "vegetables" },
        { name: "grains" },
        { name: "proteinfoods" },
        { name: "dairy" },
        { name: "fatsandoils" },
        { name: "sweetsandsnacks" },
        { name: "beverages" },
    ];

    const fetchIngredientsByFoodGroup = async (foodGroup: string) => {
        setIsLoading(true);
        setError("");
        setSelectedFoodGroup(foodGroup);
        
        try {
            const response = await apiCall(`/api/ingredient?foodGroup=${foodGroup}`, {
                method: 'GET',
                requiresAuth: true 
            });
            const data = await response.json();
            setIngredients(data || []);
        } catch (error) {
            console.error(`Error fetching ingredients for ${foodGroup}:`, error);
            setError(`Failed to load ingredients for ${foodGroup}`);
            setIngredients([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 ">
            <div className="flex flex-wrap justify-center items-center gap-4 p-4 ">
                {foodGroups.map((group) => (
                    <button 
                        onClick={() => fetchIngredientsByFoodGroup(group.name)}
                        key={group.name} 
                        className={`flex items-center justify-center w-14 h-14 rounded-full cursor-pointer transition-all hover:scale-110 ${
                            selectedFoodGroup === group.name 
                                ? 'border-blue-500 shadow-lg' 
                                : 'border-gray-300'
                        }`}
                    >
                        <img 
                            src={`/assets/${group.name}.png`} 
                            alt={group.name} 
                            className="w-32 h-32 object-contain" 
                        />
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {error && (
                <div className="text-red-500 text-center py-4">
                    {error}
                </div>
            )}

            {!isLoading && !error && ingredients.length > 0 && (
                <div className="mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {ingredients.map((ingredient) => (
                            <IngredientCard key={ingredient.id} ingredient={ingredient} />
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && !error && ingredients.length === 0 && selectedFoodGroup && (
                <div className="text-center py-8 text-gray-500">
                    No ingredients found for {selectedFoodGroup}
                </div>
            )}
        </div>
    );
}

function IngredientCard({ ingredient }: { ingredient: Ingredient }) {
    return (
        <div className="bg-[#FBE9E7] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {ingredient.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                        {ingredient.foodGroup}
                    </span>
                </div>
                
                {ingredient.nutrition && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                        <div className="text-sm">
                            <span className="text-gray-500">Calories</span>
                            <p className="font-medium">{ingredient.nutrition.calories} kcal</p>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500">Protein</span>
                            <p className="font-medium">{ingredient.nutrition.protein}g</p>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500">Carbs</span>
                            <p className="font-medium">{ingredient.nutrition.carbs}g</p>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-500">Fats</span>
                            <p className="font-medium">{ingredient.nutrition.fats}g</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodGroupList;