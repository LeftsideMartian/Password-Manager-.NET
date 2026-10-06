namespace NetPass.DTO;

public record CreateUserRequest(string FirstName, string LastName, string Email, string Password);