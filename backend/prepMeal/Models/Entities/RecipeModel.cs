using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using prepMeal.Models.Enums;

namespace prepMeal.Models;

public class Recipe
{
    [Key]
    public int Id { get; set; }

    public string RecipeName { get; set; } = string.Empty;

    public int AuthorId { get; set; }
    
    [ForeignKey(nameof(AuthorId))]
    public User Author { get; set; } = null!;

    public int NumberOfServings { get; set; } = 1;

    public string? Instructions { get; set; }

    public string? ImageUrl { get; set; }
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
    [JsonIgnore]
    public Ingredient Ingredient { get; set; } = null!;

    [Column(TypeName = "decimal(18,2)")]
    public decimal ServingSize { get; set; } = 100m;

    [MaxLength(20)]
    public string ServingUnit { get; set; } = "g";

    [Column(TypeName = "decimal(18,2)")]
    public decimal Calories { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Carbs { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Sugar { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Fats { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal SaturatedFats { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Protein { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Sodium { get; set; }
}

