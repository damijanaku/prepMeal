
using prepMeal.DTOs.RecipeIngredient;

namespace prepMeal.DTOs.Recipe;
public class UpdateRecipeDto
{
    public string? Instructions { get; set; }
    public List<CreateRecipeIngredientDto>? Ingredients { get; set; }
}