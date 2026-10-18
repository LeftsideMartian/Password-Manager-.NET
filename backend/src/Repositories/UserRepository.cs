using Microsoft.EntityFrameworkCore;
using NetPass.Data;
using NetPass.Models;

namespace NetPass.Repositories;

public interface IUserRepository
{
    void Create(User user);
    User? GetByEmail(string email);
    void Update(User user);
    void Delete(User user);
} 

public class UserRepository(AppDbContext db) : IUserRepository
{
    public void Create(User user)
    {
        db.Users.Add(user);
        db.SaveChanges();
    }
    public User? GetByEmail(string email) =>
        db.Users.SingleOrDefault(user => user.Email == email);
    
    public void Update(User user)
    {
        throw new NotImplementedException();
    }
    public void Delete(User user) => db.Users.Remove(user);
}
