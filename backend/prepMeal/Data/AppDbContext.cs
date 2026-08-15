using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace prepMeal.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Define a DBSet for the User model
    public DbSet<prepMeal.Models.User> Users { get; set; } = null!;
}