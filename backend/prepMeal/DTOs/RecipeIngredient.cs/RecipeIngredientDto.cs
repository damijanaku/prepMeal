using prepMeal.DTOs.Nutrition;

public class RecipeIngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FoodGroup { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Unit { get; set; } = string.Empty;
    public NutritionDto? Nutrition { get; set; }
}