using System.ComponentModel.DataAnnotations;

namespace prepMeal.Models;

public class RegisterViewModel
{
    public string Name { get; set; } = string.Empty;
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string username { get; set; } = string.Empty;

    [DataType(DataType.Password)]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string password { get; set; } = string.Empty;

    [DataType(DataType.Password)]
    [Compare("password", ErrorMessage = "Passwords do not match.")]
    public string confirmPassword { get; set; } = string.Empty;
}