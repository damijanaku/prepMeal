using Microsoft.EntityFrameworkCore;
using prepMeal.Models;
using prepMeal.Models.Enums;

namespace prepMeal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<Nutrition> Nutritions => Set<Nutrition>();
    public DbSet<RecipeIngredient> RecipeIngredients => Set<RecipeIngredient>(); 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Unique constraints
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Ingredient>()
            .HasOne(i => i.Nutrition)
            .WithOne(n => n.Ingredient)
            .HasForeignKey<Nutrition>(n => n.IngredientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RecipeIngredient>()
            .HasOne(ri => ri.Recipe)
            .WithMany(r => r.RecipeIngredients)
            .HasForeignKey(ri => ri.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RecipeIngredient>()
            .HasOne(ri => ri.Ingredient)
            .WithMany(i => i.RecipeIngredients)
            .HasForeignKey(ri => ri.IngredientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RecipeIngredient>()
            .Property(ri => ri.Unit)
            .HasDefaultValue("g")
            .HasMaxLength(20);

        modelBuilder.Entity<Ingredient>()
            .Property(i => i.FoodGroup)
            .HasConversion<string>()
            .HasSentinel(FoodGroup.Others);

        modelBuilder.Entity<Nutrition>()
            .Property(n => n.ServingSize)
            .HasPrecision(18, 2);

        modelBuilder.Entity<RecipeIngredient>()
            .Property(ri => ri.Amount)
            .HasPrecision(18, 2);
    }
}