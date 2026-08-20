import { useApiClient } from "../utils/apiClient";
import { useState } from "react";

function IngredientForm() {
    const [ingredientName, setIngredientName] = useState('');
    const [foodGroup, setFoodGroup] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [servingUnit, setServingUnit] = useState('');
    const [calories, setCalories] = useState('');
    const [carbs, setCarbs] = useState('');
    const [sugar, setSugar] = useState('');
    const [fats, setFats] = useState('');
    const [saturatedFats, setSaturatedFats] = useState('');
    const [protein, setProtein] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const { apiCall } = useApiClient();

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!ingredientName.trim()) {
            alert('Ingredient name is required');
            return;
        }

        setIsLoading(true); 
        try {
            const ingredientData = {
                name: ingredientName,
                foodGroup,
                nutrition: {
                    servingSize: Number(servingSize) || 0,
                    servingUnit,
                    calories: Number(calories) || 0,
                    carbs: Number(carbs) || 0,
                    sugar: Number(sugar) || 0,
                    fats: Number(fats) || 0,
                    saturatedFats: Number(saturatedFats) || 0,
                    protein: Number(protein) || 0
                }
            };

            const response = await apiCall('/api/ingredient', {
                method: 'POST',
                body: JSON.stringify(ingredientData),
                requiresAuth: true
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create ingredient');
            }

            const data = await response.json();
            console.log('Ingredient created:', data);

            setIngredientName('');
            setFoodGroup('');
            setServingSize('');
            setServingUnit('');
            setCalories('');
            setCarbs('');
            setSugar('');
            setFats('');
            setSaturatedFats('');
            setProtein('');

            alert('Ingredient created successfully!');

        } catch (error) {
            console.error('Error creating ingredient:', error);
            alert(error instanceof Error ? error.message : 'Failed to create ingredient. Please try again.');
        } finally {
            setIsLoading(false); 
        }
    }

    return (
        <div className="min-h-screen bg-[#FFC5BB] py-8">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#FBE9E7] p-8 rounded shadow-md">
                <h1 className="text-3xl font-bold text-center mb-8">Create Ingredient</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Ingredient Name *</label>
                        <input 
                            onChange={(e) => setIngredientName(e.target.value)} 
                            value={ingredientName}
                            type="text" 
                            id="name" 
                            name="name" 
                            className="w-full px-3 py-2 border rounded" 
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="foodGroup" className="block text-gray-700 font-bold mb-2">Food Group</label>
                        <input 
                            onChange={(e) => setFoodGroup(e.target.value)} 
                            value={foodGroup}
                            type="text" 
                            id="foodGroup" 
                            name="foodGroup" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="servingSize" className="block text-gray-700 font-bold mb-2">Serving Size</label>
                        <input 
                            onChange={(e) => setServingSize(e.target.value)} 
                            value={servingSize}
                            type="number" 
                            id="servingSize" 
                            name="servingSize" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="servingUnit" className="block text-gray-700 font-bold mb-2">Serving Unit</label>
                        <input 
                            onChange={(e) => setServingUnit(e.target.value)} 
                            value={servingUnit}
                            type="text" 
                            id="servingUnit" 
                            name="servingUnit" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="calories" className="block text-gray-700 font-bold mb-2">Calories</label>
                        <input 
                            onChange={(e) => setCalories(e.target.value)} 
                            value={calories}
                            type="number" 
                            id="calories" 
                            name="calories" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="carbs" className="block text-gray-700 font-bold mb-2">Carbs</label>
                        <input 
                            onChange={(e) => setCarbs(e.target.value)} 
                            value={carbs}
                            type="number" 
                            id="carbs" 
                            name="carbs" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sugar" className="block text-gray-700 font-bold mb-2">Sugars</label>
                        <input 
                            onChange={(e) => setSugar(e.target.value)} 
                            value={sugar}
                            type="number" 
                            id="sugar" 
                            name="sugar" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="fats" className="block text-gray-700 font-bold mb-2">Fats</label>
                        <input 
                            onChange={(e) => setFats(e.target.value)} 
                            value={fats}
                            type="number" 
                            id="fats" 
                            name="fats" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="saturatedfats" className="block text-gray-700 font-bold mb-2">Saturated Fats</label>
                        <input 
                            onChange={(e) => setSaturatedFats(e.target.value)} 
                            value={saturatedFats}
                            type="number" 
                            id="saturatedfats" 
                            name="saturatedfats" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="protein" className="block text-gray-700 font-bold mb-2">Protein</label>
                        <input 
                            onChange={(e) => setProtein(e.target.value)} 
                            value={protein}
                            type="number" 
                            id="protein" 
                            name="protein" 
                            className="w-full px-3 py-2 border rounded" 
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        type="submit" 
                        className="bg-[#EF9A9A] text-white px-8 py-2 rounded hover:bg-[#E57373] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Add Ingredient'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default IngredientForm;