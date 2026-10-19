using NetPass.DTO.Credential;
using NetPass.DTO.Credential.Login;
using NetPass.Repositories;

namespace NetPass.Services;

public interface ICredentialService
{
    int? GetUserId(string email);
    CredentialDto CreateLogin(CreateLoginRequest request, int userId);
    List<CredentialDto> GetAllCredentials(int userId);
    CredentialDto? GetCredentialById(int credentialId, int userId);
    CredentialDto? UpdateLogin(int credentialId, CreateLoginRequest request, int userId);
    bool DeleteCredentialById(int credentialId,int userId);
    
}

public class CredentialService(ICredentialRepository repository, IEncryptionService encryptionService) : ICredentialService
{
    public int? GetUserId(string email)
    {
        return repository.GetUserIdByEmail(email);
    }
    
    public CredentialDto CreateLogin(CreateLoginRequest request, int userId)
    {
        var login = new Models.Login
        {
            UserId = userId,
            Name = request.Name,
            Category = request.Category,
            Notes = request.Notes,
            Username = request.Username,
            Password = encryptionService.EncryptString(request.Password)
        };
        
        repository.Create(login);
        return CredentialDto.FromModel(login, encryptionService);
    }
    public List<CredentialDto> GetAllCredentials(int userId)
    {
        return repository.GetAllForUser(userId).Select(c => CredentialDto.FromModel(c, encryptionService)).ToList();
    }

    public CredentialDto? GetCredentialById(int credentialId, int userId)
    {
        var credential = FindOwned<Models.Credential>(credentialId, userId);
        return credential == null ? null : CredentialDto.FromModel(credential, encryptionService);
    }

    public CredentialDto? UpdateLogin(int credentialId, CreateLoginRequest request, int userId)
    {
        var login = FindOwned<Models.Login>(credentialId, userId);
        if (login is null) return null;
        
        login.Name = request.Name;
        login.Category = request.Category;
        login.Username = request.Username;
        login.Password = encryptionService.EncryptString(request.Password);
        login.Notes = request.Notes;
        
        repository.Update(login);
        return CredentialDto.FromModel(login, encryptionService);
    }

    public bool DeleteCredentialById(int credentialId, int userId)
    {
        var credential = FindOwned<Models.Credential>(credentialId, userId);
        if (credential is null) return false;
        
        repository.Delete(credential);
        return true;
    }
    
    private T? FindOwned<T>(int credentialId, int userId) where T : Models.Credential =>
        repository.GetById(credentialId) is T credential && credential.UserId == userId ? credential : null;
}