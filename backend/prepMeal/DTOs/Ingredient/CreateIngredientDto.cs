using System.ComponentModel.DataAnnotations;
using prepMeal.DTOs.Nutrition;

namespace prepMeal.DTOs.Ingredient;

public class CreateIngredientDto
{
    public string Name { get; set; } = string.Empty;
    public string FoodGroup { get; set; } = "Other"; 
    public CreateNutritionDto? Nutrition { get; set; }
}
