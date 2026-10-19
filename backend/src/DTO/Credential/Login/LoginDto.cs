using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.Login;

public record LoginDto(
    int CredentialId,
    string Name,
    string Category,
    string? Notes,
    string Username,
    string Password) : CredentialDto(CredentialId, Name, Category, Notes);
