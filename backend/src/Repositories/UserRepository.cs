using Microsoft.EntityFrameworkCore;
using NetPass.Data;
using NetPass.Models;

namespace NetPass.Repositories;

public interface IUserRepository
{
    Task CreateAsync(User user);
    Task<User?> FindUserAsync(int userId);
    Task<User?> FindUserAsync(string email);
    bool DoesUserExist(string email);
    Task UpdateAsync(User user);
    Task DeleteAsync(int userId);
}

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task CreateAsync(User user)
    {
        db.Users.Add(user);
        await db.SaveChangesAsync();
    }

    public bool DoesUserExist(string email) =>
        db.Users.AsNoTracking().SingleOrDefault(user => user.Email == email) is not null;

    public async Task<User?> FindUserAsync(int userId) => await db.Users.FindAsync(userId);
    public async Task<User?> FindUserAsync(string email) => await db.Users.FirstOrDefaultAsync(u => u.Email == email);
    public async Task UpdateAsync(User updatedUser)
    {
        db.Users.Update(updatedUser);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int userId) => await db.Users
        .Where(u => u.UserId == userId)
        .ExecuteDeleteAsync<User>();
}
