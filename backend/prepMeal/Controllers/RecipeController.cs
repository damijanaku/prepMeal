using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prepMeal.Data;
using prepMeal.DTOs.Nutrition;
using prepMeal.DTOs.Recipe;
using prepMeal.DTOs.RecipeIngredient;
using prepMeal.DTOs.Shared;
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
            .ToListAsync();

        var result = recipes.Select(r => new RecipeDto
        {
            Id = r.Id,
            RecipeName = r.RecipeName,
            Instructions = r.Instructions,
            ImageUrl = r.ImageUrl,
            CreatedAt = r.CreatedAt,
            Author = new AuthorDto
            {
                Id = r.Author.Id,
                Name = r.Author.Name,
                Username = r.Author.Username
            },
            Ingredients = r.RecipeIngredients.Select(ri => new RecipeIngredientDto
            {
                Id = ri.Ingredient.Id,
                Name = ri.Ingredient.Name,
                FoodGroup = ri.Ingredient.FoodGroup.ToString(),
                Amount = ri.Amount,
                Unit = ri.Unit,
                Nutrition = ri.Ingredient.Nutrition != null ? new NutritionDto
                {
                    ServingSize = ri.Ingredient.Nutrition.ServingSize,
                    ServingUnit = ri.Ingredient.Nutrition.ServingUnit,
                    Calories = ri.Ingredient.Nutrition.Calories,
                    Carbs = ri.Ingredient.Nutrition.Carbs,
                    Sugar = ri.Ingredient.Nutrition.Sugar,
                    Fats = ri.Ingredient.Nutrition.Fats,
                    SaturatedFats = ri.Ingredient.Nutrition.SaturatedFats,
                    Protein = ri.Ingredient.Nutrition.Protein,
                    Sodium = ri.Ingredient.Nutrition.Sodium
                } : null
            }).ToList(),
            TotalMacros = new TotalMacrosDto
            {
                Calories = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Calories : 0),
                Protein = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Protein : 0),
                Carbs = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Carbs : 0),
                Fats = r.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Fats : 0)
            }
        }).ToList();

        return Ok(result);
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

        var result = new RecipeDto
        {
            Id = recipe.Id,
            RecipeName = recipe.RecipeName,
            Instructions = recipe.Instructions,
            ImageUrl = recipe.ImageUrl,
            CreatedAt = recipe.CreatedAt,
            Author = new AuthorDto
            {
                Id = recipe.Author.Id,
                Name = recipe.Author.Name,
                Username = recipe.Author.Username
            },
            Ingredients = recipe.RecipeIngredients.Select(ri => new RecipeIngredientDto
            {
                Id = ri.Ingredient.Id,
                Name = ri.Ingredient.Name,
                FoodGroup = ri.Ingredient.FoodGroup.ToString(),
                Amount = ri.Amount,
                Unit = ri.Unit,
                Nutrition = ri.Ingredient.Nutrition != null ? new NutritionDto
                {
                    ServingSize = ri.Ingredient.Nutrition.ServingSize,
                    ServingUnit = ri.Ingredient.Nutrition.ServingUnit,
                    Calories = ri.Ingredient.Nutrition.Calories,
                    Carbs = ri.Ingredient.Nutrition.Carbs,
                    Sugar = ri.Ingredient.Nutrition.Sugar,
                    Fats = ri.Ingredient.Nutrition.Fats,
                    SaturatedFats = ri.Ingredient.Nutrition.SaturatedFats,
                    Protein = ri.Ingredient.Nutrition.Protein,
                    Sodium = ri.Ingredient.Nutrition.Sodium
                } : null
            }).ToList(),
            TotalMacros = new TotalMacrosDto
            {
                Calories = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Calories : 0),
                Protein = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Protein : 0),
                Carbs = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Carbs : 0),
                Fats = recipe.RecipeIngredients.Sum(ri => ri.Ingredient.Nutrition != null && ri.Ingredient.Nutrition.ServingSize > 0 
                    ? (double)ri.Amount / (double)ri.Ingredient.Nutrition.ServingSize * (double)ri.Ingredient.Nutrition.Fats : 0)
            }
        };

        return Ok(result);
    }

[HttpPost]
[Authorize]
public async Task<IActionResult> CreateRecipe([FromForm] CreateRecipeDto dto)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userIdClaim))
    {
        return Unauthorized(new { message = "User ID claim is missing" });
    }

    if (!int.TryParse(userIdClaim, out int userId))
    {
        return Unauthorized(new { message = "Invalid User ID claim" });
    }

    var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
    if (!userExists)
        return BadRequest(new { message = "Author ID does not exist" });

    // Parsing the ingredients JSON
    List<CreateRecipeIngredientDto> ingredients = new();
    try
    {
        ingredients = JsonSerializer.Deserialize<List<CreateRecipeIngredientDto>>(dto.Ingredients) ?? new();
    }
    catch (JsonException)
    {
        return BadRequest(new { message = "Invalid ingredients data format" });
    }

    if (!ingredients.Any())
    {
        return BadRequest(new { message = "At least one ingredient is required" });
    }

    var requestedIngredientIds = ingredients.Select(i => i.IngredientId).Distinct().ToList();
    var existingIngredientIds = await _context.Ingredients
        .Where(i => requestedIngredientIds.Contains(i.Id))
        .Select(i => i.Id)
        .ToListAsync();

    if (existingIngredientIds.Count != requestedIngredientIds.Count)
        return BadRequest(new { message = "One or more Ingredient IDs do not exist." });

    if (dto.Image == null || dto.Image.Length == 0)
    {
        return BadRequest(new { message = "Image is required for the recipe." });
    }

    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

    if (!Directory.Exists(uploadsFolder))
    {
        Directory.CreateDirectory(uploadsFolder);
    }

    // Generate unique filename to avoid conflicts
    var uniqueFileName = $"{Guid.NewGuid()}_{dto.Image.FileName}";
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await dto.Image.CopyToAsync(stream);
    }

    var recipe = new Recipe
    {
        AuthorId = userId,
        RecipeName = dto.RecipeName,
        Instructions = dto.Instructions,
        ImageUrl = $"/uploads/{uniqueFileName}",
        RecipeIngredients = ingredients.Select(item => new RecipeIngredient
        {
            IngredientId = item.IngredientId,
            Amount = item.Amount,
            Unit = item.Unit ?? "g"
        }).ToList()
    };

    _context.Recipes.Add(recipe);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, new { message = "Recipe created successfully", recipe.Id });
}

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateRecipe(int id, [FromBody] UpdateRecipeDto dto)
    {
        var recipe = await _context.Recipes
            .Include(r => r.RecipeIngredients)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null)
            return NotFound(new { message = "Recipe not found" });

        if (!string.IsNullOrEmpty(dto.Instructions))
            recipe.Instructions = dto.Instructions;

        if (dto.Ingredients != null && dto.Ingredients.Any())
        {
            var requestedIngredientIds = dto.Ingredients.Select(i => i.IngredientId).Distinct().ToList();
            var existingIngredientIds = await _context.Ingredients
                .Where(i => requestedIngredientIds.Contains(i.Id))
                .Select(i => i.Id)
                .ToListAsync();

            if (existingIngredientIds.Count != requestedIngredientIds.Count)
                return BadRequest(new { message = "One or more Ingredient IDs do not exist." });

            _context.RecipeIngredients.RemoveRange(recipe.RecipeIngredients);
            recipe.RecipeIngredients = dto.Ingredients.Select(item => new RecipeIngredient
            {
                IngredientId = item.IngredientId,
                Amount = item.Amount,
                Unit = item.Unit ?? "g"
            }).ToList();
        }

        recipe.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Recipe updated successfully", recipe.Id });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
            return NotFound(new { message = "Recipe not found" });

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}














