using prepMeal.DTOs.RecipeIngredient;

namespace prepMeal.DTOs.Recipe;
public class CreateRecipeDto
{
    public int AuthorId { get; set; }
    public string? Instructions { get; set; }
    public List<CreateRecipeIngredientDto> Ingredients { get; set; } = new();
}