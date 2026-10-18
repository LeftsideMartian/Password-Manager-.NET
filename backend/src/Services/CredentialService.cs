using NetPass.DTO.Credential;
using NetPass.Models;
using NetPass.Repositories;

namespace NetPass.Services;

public interface ICredentialService
{
    Credential CreateCredential(CreateCredentialRequest request, string email);
    IReadOnlyList<Credential> GetCredentials(string email);
}

public class CredentialService(
    ICredentialRepository credentialRepository,
    IUserRepository userRepository) : ICredentialService
{
    public Credential CreateCredential(CreateCredentialRequest request, string email)
    {
        User user = userRepository.GetByEmail(email)
            ?? throw new KeyNotFoundException("Authenticated user was not found.");

        Credential credential = new()
        {
            Name = request.Name,
            Username = request.Username,
            Password = request.Password,
            Category = request.Category,
            Note = request.Note,
            UserId = user.UserId
        };

        credentialRepository.Add(credential);
        return credential;
    }

    public IReadOnlyList<Credential> GetCredentials(string email)
    {
        User user = userRepository.GetByEmail(email)
            ?? throw new KeyNotFoundException("Authenticated user was not found.");

        return credentialRepository.GetByUserId(user.UserId);
    }
}
