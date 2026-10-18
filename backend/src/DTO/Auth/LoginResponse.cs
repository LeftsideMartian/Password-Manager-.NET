namespace NetPass.DTO.Auth;

public record LoginResponse(Models.User user, string Token, int ExpiresIn);
