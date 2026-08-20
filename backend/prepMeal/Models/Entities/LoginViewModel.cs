using System.ComponentModel.DataAnnotations;

namespace prepMeal.Models;

public class LoginViewModel
{
    [Required]
    public string UsernameOrEmail { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}