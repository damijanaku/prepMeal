using prepMeal.Controllers;
using prepMeal.DTOs.Nutrition;
using prepMeal.DTOs.Shared;

public class RecipeDto
{
    public int Id { get; set; }
    public string? Instructions { get; set; }
    public DateTime CreatedAt { get; set; }
    public AuthorDto Author { get; set; } = null!;
    public List<RecipeIngredientDto> Ingredients { get; set; } = new();
    public TotalMacrosDto TotalMacros { get; set; } = null!;
}