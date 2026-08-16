using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prepMeal.Data;
using prepMeal.Models;

namespace prepMeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IngredientController : ControllerBase
{
    private readonly AppDbContext _context;

    public IngredientController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetIngredients()
    {
        var ingredients = await _context.Ingredients
            .AsNoTracking()
            .Select(i => new IngredientDto
            {
                Id = i.Id,
                Name = i.Name,
                Nutrition = i.Nutrition != null ? new NutritionDto
                {
                    ServingSize = i.Nutrition.ServingSize,
                    ServingUnit = i.Nutrition.ServingUnit,
                    Calories = i.Nutrition.Calories,
                    Carbs = i.Nutrition.Carbs,
                    Sugar = i.Nutrition.Sugar,
                    Fats = i.Nutrition.Fats,
                    SaturatedFats = i.Nutrition.SaturatedFats,
                    Protein = i.Nutrition.Protein,
                    Sodium = i.Nutrition.Sodium
                } : null
            })
            .ToListAsync();

        return Ok(ingredients);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetIngredient(int id)
    {
        var ingredient = await _context.Ingredients
            .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(i => new IngredientDto
            {
                Id = i.Id,
                Name = i.Name,
                Nutrition = i.Nutrition != null ? new NutritionDto
                {
                    ServingSize = i.Nutrition.ServingSize,
                    ServingUnit = i.Nutrition.ServingUnit,
                    Calories = i.Nutrition.Calories,
                    Carbs = i.Nutrition.Carbs,
                    Sugar = i.Nutrition.Sugar,
                    Fats = i.Nutrition.Fats,
                    SaturatedFats = i.Nutrition.SaturatedFats,
                    Protein = i.Nutrition.Protein,
                    Sodium = i.Nutrition.Sodium
                } : null
            })
            .FirstOrDefaultAsync();

        if (ingredient == null)
            return NotFound(new { message = "Ingredient not found" });

        return Ok(ingredient);
    }

    [HttpPost]
    public async Task<IActionResult> CreateIngredient([FromBody] CreateIngredientDto dto)
    {
        var ingredient = new Ingredient
        {
            Name = dto.Name,
            Nutrition = dto.Nutrition != null ? new Nutrition
            {
                Calories = dto.Nutrition.Calories,
                Carbs = dto.Nutrition.Carbs,
                Sugar = dto.Nutrition.Sugar,
                Fats = dto.Nutrition.Fats,
                SaturatedFats = dto.Nutrition.SaturatedFats,
                Protein = dto.Nutrition.Protein,
                Sodium = dto.Nutrition.Sodium
            } : null
        };

        _context.Ingredients.Add(ingredient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetIngredient), new { id = ingredient.Id }, ingredient);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIngredient(int id)
    {
        var ingredient = await _context.Ingredients.FindAsync(id);
        if (ingredient == null)
            return NotFound(new { message = "Ingredient not found" });

        _context.Ingredients.Remove(ingredient);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class IngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public NutritionDto? Nutrition { get; set; }
}

public class CreateIngredientDto
{
    public string Name { get; set; } = string.Empty;
    public CreateNutritionDto? Nutrition { get; set; }
}

public class CreateNutritionDto
{
    public decimal ServingSize { get; set; }
    public string ServingUnit { get; set; } = "g";
    public int Calories { get; set; }
    public int Carbs { get; set; }
    public int Sugar { get; set; }
    public int Fats { get; set; }
    public int SaturatedFats { get; set; }
    public int Protein { get; set; }
    public int? Sodium { get; set; }
}

public class NutritionDto
{
    public decimal ServingSize { get; set; }
    public string ServingUnit { get; set; } = "g";
    public int Calories { get; set; }
    public int Carbs { get; set; }
    public int Sugar { get; set; }
    public int Fats { get; set; }
    public int SaturatedFats { get; set; }
    public int Protein { get; set; }
    public int? Sodium { get; set; }
}