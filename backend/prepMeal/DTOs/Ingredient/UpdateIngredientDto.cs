using prepMeal.DTOs.Nutrition;
namespace prepMeal.DTOs.Ingredient;
public class UpdateIngredientDto
{
    public string? Name { get; set; }
    public string? FoodGroup { get; set; } 
    public int NumberOfServings { get; set; } = 1;
    public CreateNutritionDto? Nutrition { get; set; }
}