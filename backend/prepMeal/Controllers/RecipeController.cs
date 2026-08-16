using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prepMeal.Data;
using prepMeal.Models;

namespace prepMeal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipeController : ControllerBase
{
    private readonly AppDbContext _context;

    public RecipeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetRecipes()
    {
        var recipes = await _context.Recipes
            .Include(r => r.Author)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                    .ThenInclude(i => i.Nutrition)
            .Select(r => new
            {
                r.Id,
                r.Instructions,
                r.CreatedAt,
                Author = new { r.Author.Id, r.Author.Name, r.Author.Username },
                Ingredients = r.RecipeIngredients.Select(ri => new
                {
                    ri.Ingredient.Id,
                    ri.Ingredient.Name,
                    ri.Amount,
                    ri.Unit,
                    ri.Ingredient.Nutrition
                }),
                TotalMacros = new
                {
                    Calories = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                        ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Calories : 0),
                    Protein = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                        ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Protein : 0),
                    Carbs = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                        ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Carbs : 0),
                    Fats = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                        ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Fats : 0)
                }
            })
            .ToListAsync();

        return Ok(recipes);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetRecipe(int id)
    {
        var recipe = await _context.Recipes
            .Include(r => r.Author)
            .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.Ingredient)
                    .ThenInclude(i => i.Nutrition)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null)
            return NotFound(new { message = "Recipe not found" });

        var result = new
        {
            recipe.Id,
            recipe.Instructions,
            recipe.CreatedAt,
            Author = new { recipe.Author.Id, recipe.Author.Name, recipe.Author.Username },
            Ingredients = recipe.RecipeIngredients.Select(ri => new
            {
                ri.Ingredient.Id,
                ri.Ingredient.Name,
                ri.Amount,
                ri.Unit,
                ri.Ingredient.Nutrition
            }),
            TotalMacros = new
            {
                Calories = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Calories : 0),
                Protein = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Protein : 0),
                Carbs = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Carbs : 0),
                Fats = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * ri.Ingredient.Nutrition.Fats : 0)
            }
        };

        return Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateRecipe([FromBody] CreateRecipeDto dto)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.AuthorId);
        if (!userExists)
        {
            return BadRequest(new { message = "Author ID does not exist" });
        }

        var requestedIngredientIds = dto.Ingredients.Select(i => i.IngredientId).Distinct().ToList();
        var existingIngredientIds = await _context.Ingredients
            .Where(i => requestedIngredientIds.Contains(i.Id))
            .Select(i => i.Id)
            .ToListAsync();

        if (existingIngredientIds.Count != requestedIngredientIds.Count)
        {
            return BadRequest(new { message = "One or more Ingredient IDs do not exist." });
        }

        var recipe = new Recipe
        {
            AuthorId = dto.AuthorId,
            Instructions = dto.Instructions,
            RecipeIngredients = dto.Ingredients.Select(item => new RecipeIngredient
            {
                IngredientId = item.IngredientId,
                Amount = item.Amount,
                Unit = item.Unit ?? "g"
            }).ToList()
        };

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, new { recipe.Id, message = "Recipe created successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
        {
            return NotFound(new { message = "Recipe not found" });
        }

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateRecipeDto
{
    public int AuthorId { get; set; }
    public string? Instructions { get; set; }
    public List<CreateRecipeIngredientDto> Ingredients { get; set; } = new();
}

public class CreateRecipeIngredientDto
{
    public int IngredientId { get; set; }
    public decimal Amount { get; set; }
    public string? Unit { get; set; } = "g";
}