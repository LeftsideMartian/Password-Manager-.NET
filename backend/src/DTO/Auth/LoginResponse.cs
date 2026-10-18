namespace NetPass.DTO.Auth;

public record LoginResponse(string Email, string FirstName, string Token, int ExpiresIn);
