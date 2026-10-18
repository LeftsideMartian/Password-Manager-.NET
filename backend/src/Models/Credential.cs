using System.ComponentModel.DataAnnotations;

namespace NetPass.Models;

public class Credential
{
    [Key]
    public int CredentialId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}