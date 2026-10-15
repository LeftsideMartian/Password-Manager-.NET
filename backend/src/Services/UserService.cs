using NetPass.DTO;
using NetPass.DTO.User;
using NetPass.Models;
using NetPass.Repositories;

namespace NetPass.Services;

public interface IUserService
{
    UserDto CreateUser(CreateUserRequest request);
    void ChangeUserPassword(ChangePasswordRequest request, int userId);
    void UpdateUserDetails(UpdateUserRequest request, int userId);
    void DeleteUser(int userId);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    public UserDto CreateUser(CreateUserRequest request)
    {
        User newUser = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Password = request.Password
        };
        
        // Return new user must have id filled out
        userRepository.Create(newUser);

        return new UserDto(newUser);
    }

    public void ChangeUserPassword(ChangePasswordRequest request, int userId)
    {
        throw new NotImplementedException();
    }

    public void UpdateUserDetails(UpdateUserRequest request, int userId)
    {
        throw new NotImplementedException();
    }

    public void DeleteUser(int userId)
    {
        throw new NotImplementedException();
    }
}