namespace NetPass.DTO.Credential;

public record CreateCredentialRequest(
    string Name,
    string Username,
    string Password,
    string Category,
    string Note);
