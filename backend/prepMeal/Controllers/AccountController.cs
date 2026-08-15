using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using prepMeal.Models;
using prepMeal.Data;
using Microsoft.EntityFrameworkCore;

namespace prepMeal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _config;

    public AccountController(AppDbContext context, IPasswordHasher<User> passwordHasher, IConfiguration config)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (_context.Users.Any(u => u.Email == model.Email || u.Username == model.Username))
        {
            return BadRequest(new { message = "Username or Email already exists." });
        }

        var user = new User
        {
            Name = model.Name,
            Username = model.Username,
            Email = model.Email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);

        // 4. Save to database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully", userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // 1. Find the user by username or email
        var user = await _context.Users.FirstOrDefaultAsync(
            u => u.Email == model.UsernameOrEmail || u.Username == model.UsernameOrEmail
        );

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid username or email." });
        }

        // 2. Verify the password
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { message = "Invalid password." });
        }

        var jwtService = new JwtService(_config);
        var token = jwtService.GenerateToken(user);

        return Ok(new
        {
            token,
            user = new { user.Id, user.Name, user.Username, user.Email }
        });
    }
}