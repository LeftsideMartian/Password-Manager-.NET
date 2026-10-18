using Microsoft.EntityFrameworkCore;
using NetPass.DTO.Credential;
using NetPass.DTO.Credential.Login;
using NetPass.DTO.Credential.PaymentCard;
using NetPass.DTO.Credential.SSHKey;
using NetPass.Repositories;

namespace NetPass.Services;

public interface ICredentialService
{
    int? GetUserId(string email);
    CredentialDto CreateLogin(CreateLoginRequest request, int userId);
    CredentialDto CreateSshKey(CreateSshKeyRequest request, int userId);
    CredentialDto CreatePaymentCard(CreatePaymentCardRequest request, int userId);
    List<CredentialDto> GetAllCredentials(int userId);
    CredentialDto? GetCredentialById(int credentialId, int userId);
    CredentialDto? UpdateLogin(int credentialId, CreateLoginRequest request, int userId);
    CredentialDto? UpdateSshKey(int credentialId, CreateSshKeyRequest request, int userId);
    CredentialDto? UpdatePaymentCard(int credentialId, CreatePaymentCardRequest request, int userId);
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
            Notes = request.Notes,
            Username = request.Username,
            Password = encryptionService.EncryptString(request.Password)
        };
        
        repository.Create(login);
        return CredentialDto.FromModel(login, encryptionService);
    }

    public CredentialDto CreateSshKey(CreateSshKeyRequest request, int userId)
    {
        var SshKey = new Models.SshKey
        {
            UserId = userId,
            Notes = request.Notes,
            Key = encryptionService.EncryptString(request.Key)
        };
        repository.Create(SshKey);
        return CredentialDto.FromModel(SshKey, encryptionService);
    }

    public CredentialDto CreatePaymentCard(CreatePaymentCardRequest request, int userId)
    {
        var card = new Models.PaymentCard
        {
            UserId = userId,
            Notes = request.Notes,
            CardNumber = encryptionService.EncryptString(request.CardNumber),
            ExpiryDate = request.ExpiryDate,
            Cvv = encryptionService.EncryptString(request.Cvv)
        };
        repository.Create(card);
        return CredentialDto.FromModel(card, encryptionService);
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
        
        login.Username = request.Username;
        login.Password = encryptionService.EncryptString(request.Password);
        login.Notes = request.Notes;
        
        repository.Update(login);
        return CredentialDto.FromModel(login, encryptionService);
    }

    public CredentialDto? UpdateSshKey(int credentialId, CreateSshKeyRequest request, int userId)
    {
        var sshKey = FindOwned<Models.SshKey>(credentialId, userId);
        if (sshKey is null) return null;
        
        sshKey.Notes = request.Notes;
        sshKey.Key = encryptionService.EncryptString(request.Key);
        
        repository.Update(sshKey);
        return CredentialDto.FromModel(sshKey, encryptionService);
    }

    public CredentialDto? UpdatePaymentCard(int credentialId, CreatePaymentCardRequest request, int userId)
    {
        var card = FindOwned<Models.PaymentCard>(credentialId, userId);
        if (card is null) return null;
        
        card.Notes = request.Notes;
        card.CardNumber = encryptionService.EncryptString(request.CardNumber);
        card.ExpiryDate = request.ExpiryDate;
        card.Cvv = encryptionService.EncryptString(request.Cvv);
        
        repository.Update(card);
        return CredentialDto.FromModel(card, encryptionService);
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