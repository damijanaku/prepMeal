using prepMeal.DTOs.Nutrition;

namespace prepMeal.DTOs.Ingredient;

public class IngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FoodGroup { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public NutritionDto? Nutrition { get; set; }
}