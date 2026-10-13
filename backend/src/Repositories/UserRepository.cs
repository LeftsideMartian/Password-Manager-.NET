using Microsoft.EntityFrameworkCore;
using NetPass.Data;
using NetPass.Models;

namespace NetPass.Repositories;

public interface IUserRepository
{
    void Create(User user);
    bool DoesUserExist(string email);
    void Update(User user);
    void Delete(User user);
} 

public class UserRepository(AppDbContext db) : IUserRepository
{
    public void Create(User user) => db.Users.Add(user);

    public bool DoesUserExist(string email) =>
        db.Users.AsNoTracking().SingleOrDefault(user => user.Email == email) is not null;
    
    public void Update(User user)
    {
        throw new NotImplementedException();
    }

    public void Delete(User user) => db.Users.Remove(user);
}
