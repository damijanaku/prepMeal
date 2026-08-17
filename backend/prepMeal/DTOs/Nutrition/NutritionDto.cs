namespace prepMeal.DTOs.Nutrition;

public class NutritionDto
{
    public decimal ServingSize { get; set; }
    public string ServingUnit { get; set; } = "g";
    public decimal Calories { get; set; }
    public decimal Carbs { get; set; }
    public decimal Sugar { get; set; }
    public decimal Fats { get; set; }
    public decimal SaturatedFats { get; set; }
    public decimal Protein { get; set; }
    public decimal? Sodium { get; set; }
}