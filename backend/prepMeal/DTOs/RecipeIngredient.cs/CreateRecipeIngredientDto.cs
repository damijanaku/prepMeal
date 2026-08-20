namespace prepMeal.DTOs.RecipeIngredient;
public class CreateRecipeIngredientDto
{
    public int IngredientId { get; set; }
    public decimal Amount { get; set; }
    public string? Unit { get; set; } = "g";
}