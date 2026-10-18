using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.Login;

public record LoginDto(int CredentialId, string? Notes, string username, string password) : CredentialDto(CredentialId, Notes);
