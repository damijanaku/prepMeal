using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prepMeal.Models;

public class Recipe
{
    [Key]
    public int Id { get; set; }

    public int AuthorId { get; set; }
    
    [ForeignKey(nameof(AuthorId))]
    public User Author { get; set; } = null!;

    public string? Instructions { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
}

public class Ingredient
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public FoodGroup FoodGroup { get; set; } = FoodGroup.Others;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Nutrition? Nutrition { get; set; }
    public ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
}

public class RecipeIngredient
{
    [Key]
    public int Id { get; set;}

    public int RecipeId { get; set;}
    
    [ForeignKey(nameof(RecipeId))]
    public Recipe Recipe { get; set; } = null!;

    public int IngredientId { get; set;}

    [ForeignKey(nameof(IngredientId))]
    public Ingredient Ingredient { get; set; } = null!;

    // Amount used in specific recipe
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = "g";


}

public class Nutrition
{
    [Key]
    public int Id { get; set; }

    public int IngredientId { get; set; }

    [ForeignKey(nameof(IngredientId))]
    public Ingredient Ingredient { get; set; } = null!;

    [Column(TypeName = "decimal(18,2)")]
    public decimal ServingSize { get; set; } = 100m; // Default serving size in grams

    [MaxLength(20)]
    public string ServingUnit { get; set; } = "g"; // Default serving unit
    public int Calories { get; set; }
    public int Carbs { get; set; }
    public int Sugar { get; set; }
    public int Fats { get; set; }
    public int SaturatedFats { get; set; }
    public int Protein { get; set; }
    public int? Sodium { get; set; }
}

public enum FoodGroup
{
    Fruits,
    Vegetables,
    Grains,
    ProteinFoods,
    Dairy,
    FatsAndOils,
    SweetsAndSnacks,
    Beverages,
    Others
}