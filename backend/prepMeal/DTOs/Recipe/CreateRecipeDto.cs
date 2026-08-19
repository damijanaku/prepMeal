using prepMeal.DTOs.RecipeIngredient;

namespace prepMeal.DTOs.Recipe;

public class CreateRecipeDto
{
    public string RecipeName { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    public IFormFile? Image { get; set; }
    public string Ingredients { get; set; } = string.Empty; 
}