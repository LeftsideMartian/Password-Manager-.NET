using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.SSHKey;

public record CreateSshKeyRequest(
    [Required, StringLength(10000)] string Key,
    [StringLength(2000)] string? Notes);