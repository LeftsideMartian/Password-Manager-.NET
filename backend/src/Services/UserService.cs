using NetPass.DTO;
using NetPass.DTO.User;
using NetPass.Models;
using NetPass.Repositories;

namespace NetPass.Services;

public interface IUserService
{
    Task<UserDto> CreateUserAsync(CreateUserRequest request);
    Task ChangeUserPasswordAsync(ChangePasswordRequest request, int userId);
    Task UpdateUserDetailsAsync(UpdateUserRequest request, int userId);
    Task DeleteUserAsync(int userId);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<UserDto> CreateUserAsync(CreateUserRequest request)
    {
        User newUser = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Password = request.Password
        };

        // UserId is automatically filled in by repository
        await userRepository.CreateAsync(newUser);

        return new UserDto(newUser);
    }

    public async Task ChangeUserPasswordAsync(ChangePasswordRequest request, int userId)
    {
        var user = await userRepository.FindUserAsync(userId);
        if (user is null) throw new InvalidOperationException();

        user.Password = request.newPassword;

        await userRepository.UpdateAsync(user);
    }

    public async Task UpdateUserDetailsAsync(UpdateUserRequest request, int userId)
    {
        var user = await userRepository.FindUserAsync(userId);
        if (user is null) throw new InvalidOperationException();

        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.Email = request.Email ?? user.Email;

        await userRepository.UpdateAsync(user);
    }

    public async Task DeleteUserAsync(int userId)
        => await userRepository.DeleteAsync(userId);
}
