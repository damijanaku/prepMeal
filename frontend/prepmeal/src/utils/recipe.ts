export interface Nutrition {
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

export interface Ingredient {
    id: number;
    name: string;
    foodGroup: string;
    amount: number;
    unit: string;
    nutrition: Nutrition;
}

export interface Recipe {
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