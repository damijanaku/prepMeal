using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prepMeal.Data;
using prepMeal.DTOs.Ingredient;
using prepMeal.DTOs.Nutrition;
using prepMeal.Models;
using prepMeal.Models.Enums;

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

    [HttpGet("foodgroups")]
    [Authorize] 
    public IActionResult GetFoodGroups()
    {
        var foodGroups = Enum.GetValues(typeof(FoodGroup))
            .Cast<FoodGroup>()
            .Select(fg => new 
            { 
                Value = fg.ToString(),
                DisplayName = fg.ToString() 
            })
            .ToList();

        return Ok(foodGroups);
    }

    [HttpGet]
    public async Task<IActionResult> GetIngredients([FromQuery] string? foodGroup)
    {
        if (string.IsNullOrEmpty(foodGroup))
        {
            var allIngredients = await _context.Ingredients
                .AsNoTracking()
                .Select(i => new IngredientDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    FoodGroup = i.FoodGroup.ToString(),
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

            return Ok(allIngredients);
        }

        // Filter by foodGroup if provided
        if (!Enum.TryParse<FoodGroup>(foodGroup, true, out var parsedFoodGroup))
        {
            return BadRequest(new { message = "Invalid food group. Valid values: Fruits, Vegetables, Grains, ProteinFoods, Dairy, FatsAndOils, SweetsAndSnacks, Beverages, Others" });
        }

        var ingredients = await _context.Ingredients
            .AsNoTracking()
            .Where(i => i.FoodGroup == parsedFoodGroup)
            .Select(i => new IngredientDto
            {
                Id = i.Id,
                Name = i.Name,
                FoodGroup = i.FoodGroup.ToString(),
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
                FoodGroup = i.FoodGroup.ToString(),
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
    [Authorize]
    public async Task<IActionResult> CreateIngredient([FromBody] CreateIngredientDto dto)
    {
        // Update the validation message to match your enum
        if (!Enum.TryParse<FoodGroup>(dto.FoodGroup, true, out var foodGroup))
        {
            return BadRequest(new { message = "Invalid food group. Valid values: Fruits, Vegetables, Grains, ProteinFoods, Dairy, FatsAndOils, SweetsAndSnacks, Beverages, Others" });
        }

        var ingredient = new Ingredient
        {
            Name = dto.Name,
            FoodGroup = foodGroup, // Set the food group
            Nutrition = dto.Nutrition != null ? new Nutrition
            {
                ServingSize = dto.Nutrition.ServingSize,
                ServingUnit = dto.Nutrition.ServingUnit,
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateIngredient(int id, [FromBody] UpdateIngredientDto dto)
    {
        var ingredient = await _context.Ingredients
            .Include(i => i.Nutrition)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (ingredient == null)
            return NotFound(new { message = "Ingredient not found" });

        // Update basic properties
        if (!string.IsNullOrEmpty(dto.Name))
            ingredient.Name = dto.Name;

        if (!string.IsNullOrEmpty(dto.FoodGroup))
        {
            if (!Enum.TryParse<FoodGroup>(dto.FoodGroup, true, out var foodGroup))
            {
                return BadRequest(new { message = "Invalid food group. Valid values: Fruits, Vegetables, Grains, ProteinFoods, Dairy, FatsAndOils, SweetsAndSnacks, Beverages, Others" });
            }
            ingredient.FoodGroup = foodGroup;
        }

        // Update nutrition if provided
        if (dto.Nutrition != null)
        {
            if (ingredient.Nutrition == null)
            {
                ingredient.Nutrition = new Nutrition();
            }

            ingredient.Nutrition.ServingSize = dto.Nutrition.ServingSize;
            ingredient.Nutrition.ServingUnit = dto.Nutrition.ServingUnit;
            ingredient.Nutrition.Calories = dto.Nutrition.Calories;
            ingredient.Nutrition.Carbs = dto.Nutrition.Carbs;
            ingredient.Nutrition.Sugar = dto.Nutrition.Sugar;
            ingredient.Nutrition.Fats = dto.Nutrition.Fats;
            ingredient.Nutrition.SaturatedFats = dto.Nutrition.SaturatedFats;
            ingredient.Nutrition.Protein = dto.Nutrition.Protein;
            ingredient.Nutrition.Sodium = dto.Nutrition.Sodium;
        }

        ingredient.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ingredient);
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