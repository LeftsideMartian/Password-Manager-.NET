namespace NetPass.DTO.Auth;

public record LoginResponse(string Email, string Token, int ExpiresIn);
