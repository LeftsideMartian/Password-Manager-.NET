namespace NetPass.DTO.User;

public record UserDto(int UserId, string FirstName, string LastName, string Email)
{
    public UserDto(Models.User user) : this(user.UserId, user.FirstName, user.LastName, user.Email) { }
}