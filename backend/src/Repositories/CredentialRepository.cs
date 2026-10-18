using NetPass.Data;
using NetPass.Models;

namespace NetPass.Repositories;

public interface ICredentialRepository
{
    void Create(Credential credential);
    Credential? GetById(int credentialId);
    List<Credential> GetAllForUser(int userId);
    void Update(Credential credential);
    void Delete(Credential credential);
    int? GetUserIdByEmail(string email);
}

public class CredentialRepository(AppDbContext db) : ICredentialRepository
{
    public void Create(Credential credential)
    {
        db.Credentials.Add(credential);
        db.SaveChanges();
    }

    public Credential? GetById(int credentialId)
    {
        return db.Credentials.Find(credentialId);
    }

    public List<Credential> GetAllForUser(int userId)
    {
        return db.Credentials.Where(c => c.UserId == userId).ToList();
    }

    public void Update(Credential credential)
    {
        db.SaveChanges();
    }

    public void Delete(Credential credential)
    {
        db.Credentials.Remove(credential);
        db.SaveChanges();
    }

    public int? GetUserIdByEmail(string email)
    {
        return db.Users.Where(u => u.Email == email).Select(u => (int?)u.UserId).SingleOrDefault();
    }
}