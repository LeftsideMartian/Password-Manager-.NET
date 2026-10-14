namespace NetPass.DTO.Password;

public record GeneratePasswordRequest(string? Profile = null, int? Length = null);
