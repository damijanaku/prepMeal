
using prepMeal.DTOs.RecipeIngredient;

namespace prepMeal.DTOs.Recipe;
public class UpdateRecipeDto
{
    public string? RecipeName { get; set; }
    public string? Instructions { get; set; }
    public List<CreateRecipeIngredientDto>? Ingredients { get; set; }
}