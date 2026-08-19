using prepMeal.Controllers;
using prepMeal.DTOs.Nutrition;
using prepMeal.DTOs.Shared;

public class RecipeDto
{
    public int Id { get; set; }
    public string RecipeName { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    public string ? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public AuthorDto Author { get; set; } = null!;
    public List<RecipeIngredientDto> Ingredients { get; set; } = new();
    public TotalMacrosDto TotalMacros { get; set; } = null!;
}