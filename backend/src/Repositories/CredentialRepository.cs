using Microsoft.EntityFrameworkCore;
using NetPass.Data;
using NetPass.Models;

namespace NetPass.Repositories;

public interface ICredentialRepository
{
    void Add(Credential credential);
    IReadOnlyList<Credential> GetByUserId(int userId);
    void Update(Credential credential);
    void Delete(Credential credential);
}

public class CredentialRepository(AppDbContext db) : ICredentialRepository
{
    public void Add(Credential credential)
    {
        db.Credentials.Add(credential);
        db.SaveChanges();
    }

    public IReadOnlyList<Credential> GetByUserId(int userId) =>
        db.Credentials.AsNoTracking()
            .Where(credential => credential.UserId == userId)
            .OrderBy(credential => credential.Name)
            .ToList();

    public void Update(Credential credential)
    {
        throw new NotImplementedException();
    }

    public void Delete(Credential credential) => db.Credentials.Remove(credential);
}