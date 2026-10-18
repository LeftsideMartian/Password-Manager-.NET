using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.Login;

public record CreateLoginRequest(
    [Required, StringLength(200)] string Username,
    [Required, StringLength(200)] string Password,
    [StringLength(2000)] string? Notes);