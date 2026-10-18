using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.SSHKey;

public record SshKeyDto(int CredentialId, string? Notes, string Key) :  CredentialDto(CredentialId, Notes);