import { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { useApiClient } from "../../../utils/apiClient";

interface Ingredient {
    id: number;
    name: string;
}

interface SelectedIngredient extends Ingredient {
    amount: number;
    unit: string;
}

function CreateRecipes() {
    const [recipeName, setRecipeName] = useState<string>('');
    const [instructions, setInstructions] = useState<string>('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [servingSize, setServingSize] = useState<number>(1);
    const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
    const { apiCall } = useApiClient();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
    const [units, setUnits] = useState<{ [key: number]: string }>({});

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        getIngredients();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredIngredients(ingredients);
        } else {
            const filtered = ingredients.filter((ingredient: Ingredient) =>
                ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredIngredients(filtered);
        }
    }, [searchTerm, ingredients]);

    async function getIngredients(): Promise<void> {
        try {
            const response = await apiCall('/api/ingredient', {
                method: 'GET',
                requiresAuth: true
            });
            const data = await response.json();
            setIngredients(data || []);
            setFilteredIngredients(data || []);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    const handleAddIngredient = (ingredient: Ingredient): void => {
        if (!selectedIngredients.some((selected: SelectedIngredient) => selected.id === ingredient.id)) {
            const newIngredient: SelectedIngredient = {
                ...ingredient,
                amount: 0,
                unit: 'g'
            };
            setSelectedIngredients([...selectedIngredients, newIngredient]);
            setAmounts({ ...amounts, [ingredient.id]: 0 });
            setUnits({ ...units, [ingredient.id]: 'g' });
        }
        setSearchTerm('');
    };

    const handleAmountChange = (ingredientId: number, amount: number): void => {
        setAmounts({ ...amounts, [ingredientId]: amount });
        setSelectedIngredients(selectedIngredients.map(ing =>
            ing.id === ingredientId ? { ...ing, amount } : ing
        ));
    };

    const handleUnitChange = (ingredientId: number, unit: string): void => {
        setUnits({ ...units, [ingredientId]: unit });
        setSelectedIngredients(selectedIngredients.map(ing =>
            ing.id === ingredientId ? { ...ing, unit } : ing
        ));
    };

    const handleRemoveIngredient = (ingredientId: number): void => {
        setSelectedIngredients(selectedIngredients.filter(
            (ingredient: SelectedIngredient) => ingredient.id !== ingredientId
        ));
        const newAmounts = { ...amounts };
        delete newAmounts[ingredientId];
        setAmounts(newAmounts);

        const newUnits = { ...units };
        delete newUnits[ingredientId];
        setUnits(newUnits);
    };

    const toggleDropdown = (): void => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setSearchTerm('');
            setFilteredIngredients(ingredients);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (selectedIngredients.length === 0) {
            alert('Please select at least one ingredient');
            return;
        }

        const hasInvalidAmount = selectedIngredients.some(ing => ing.amount <= 0);
        if (hasInvalidAmount) {
            alert('Please enter a valid amount for all ingredients');
            return;
        }

        if (!file) {
            alert('Please upload an image for the recipe');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('RecipeName', recipeName);
            formData.append('Instructions', instructions || '');
            formData.append('Image', file);
            formData.append('NumberOfServings', servingSize.toString());
            const ingredientsData = selectedIngredients.map(ing => ({
                IngredientId: ing.id,
                Amount: ing.amount,
                Unit: ing.unit || 'g'
            }));
            formData.append('Ingredients', JSON.stringify(ingredientsData));

            await apiCall('/api/recipe', {
                method: 'POST',
                requiresAuth: true,
                body: formData,
                headers: {},
            });

            console.log('Recipe created successfully!');
            setRecipeName('');
            setInstructions('');
            setSelectedIngredients([]);
            setAmounts({});
            setUnits({});
            setFile(null);
            setIsDropdownOpen(false);
            alert('Recipe created successfully!');
        } catch (error: any) {
            console.error('Error creating recipe:', error);
            alert(`Error creating recipe: ${error.message || 'Please try again.'}`);
        }
    };

    return (
        <div className="flex bg-[#FFC5BB] flex-col items-center justify-center min-h-screen py-2">
            <Navbar />

            <div className="m-6 bg-[#FBE9E7] border-gray-300 rounded-lg p-6 shadow-md max-w-4xl w-full">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold mb-8">Create Recipe</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="recipeName" className="mb-1 block text-sm font-medium text-[#F28378]">
                                    Recipe Name
                                </label>
                                <input
                                    type="text"
                                    id="recipeName"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    placeholder="Enter recipe name"
                                    autoComplete="off"
                                    required
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
                                />
                            </div>

                            <div>
                                <label htmlFor="instructions" className="mb-1 block text-sm font-medium text-[#F28378]">
                                    Instructions
                                </label>
                                <textarea
                                    id="instructions"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Enter instructions"
                                    autoComplete="off"
                                    rows={6}
                                    required
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
                                />
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <label className="mb-1 block text-sm font-medium text-[#F28378]">
                                    Ingredients (Select multiple)
                                </label>

                                <div
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 cursor-pointer min-h-[42px] flex flex-wrap gap-1 hover:border-[#EF9A9A] transition-colors"
                                    onClick={toggleDropdown}
                                >
                                    {selectedIngredients.length > 0 ? (
                                        selectedIngredients.map((ingredient) => (
                                            <span
                                                key={ingredient.id}
                                                className="inline-flex items-center bg-[#EF9A9A] text-white px-2 py-2 rounded text-sm gap-2"
                                            >
                                                <span>{ingredient.name}</span>
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    step="0.1"
                                                    value={amounts[ingredient.id] || ''}
                                                    onChange={(e) => handleAmountChange(ingredient.id, parseFloat(e.target.value) || 0)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-16 bg-white text-gray-900 rounded px-2 py-0.5 text-sm"
                                                    placeholder="amount"
                                                />
                                                <select
                                                    value={units[ingredient.id] || 'g'}
                                                    onChange={(e) => handleUnitChange(ingredient.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-white text-gray-900 rounded px-1 py-0.5 text-sm"
                                                >
                                                    <option value="g">g</option>
                                                    <option value="kg">kg</option>
                                                    <option value="ml">ml</option>
                                                    <option value="L">L</option>
                                                    <option value="tsp">tsp</option>
                                                    <option value="tbsp">tbsp</option>
                                                    <option value="cup">cup</option>
                                                    <option value="oz">oz</option>
                                                    <option value="lb">lb</option>
                                                    <option value="piece">piece</option>
                                                    <option value="pinch">pinch</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveIngredient(ingredient.id);
                                                    }}
                                                    className="ml-1 hover:text-gray-200 focus:outline-none text-white font-bold"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">Click to select ingredients...</span>
                                    )}
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg w-full">
                                        <input
                                            type="text"
                                            placeholder="Search ingredients..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full border-b border-gray-200 px-3 py-2 focus:outline-none rounded-t-lg"
                                            autoFocus
                                        />

                                        <div className="max-h-48 overflow-y-auto">
                                            {filteredIngredients.length > 0 ? (
                                                filteredIngredients.map((ingredient) => {
                                                    const isSelected = selectedIngredients.some(
                                                        (selected) => selected.id === ingredient.id
                                                    );
                                                    return (
                                                        <div
                                                            key={ingredient.id}
                                                            onClick={() => handleAddIngredient(ingredient)}
                                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center transition-colors ${
                                                                isSelected ? 'bg-gray-50' : ''
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => {}}
                                                                className="mr-2 cursor-pointer"
                                                            />
                                                            <span className="flex-1">{ingredient.name}</span>
                                                            {isSelected && (
                                                                <span className="text-[#EF9A9A] font-bold">✓</span>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500 text-center">
                                                    No ingredients found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#F28378]">
                                    Upload photo of your food
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center hover:border-[#EF9A9A] transition-colors cursor-pointer ${file ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                                    onClick={handleUploadClick}
                                >
                                    <div className="flex flex-col items-center">
                                        <p>📷</p>
                                        <p className="text-gray-600">{file ? 'File selected' : 'Click or drag to upload'}</p>
                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                        {file && (
                                            <p className="text-sm text-green-600 mt-2 font-semibold">
                                                ✅ {file.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="servingSize" className="mb-1 block text-sm font-medium text-[#F28378]">
                                    Number of Servings
                                </label>
                                <input
                                    type="number"
                                    id="servingSize"
                                    value={servingSize}
                                    onChange={(e) => setServingSize(parseInt(e.target.value) || 1)}
                                    placeholder="Enter number of servings"
                                    autoComplete="off"
                                    min={1}
                                    required
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9A9A]"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-[#EF9A9A] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#F28378] transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Create Recipe
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateRecipes;