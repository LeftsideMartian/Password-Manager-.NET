using System.Text.Json.Serialization;
using NetPass.DTO.Credential.Login;
using NetPass.DTO.Credential.PaymentCard;
using NetPass.DTO.Credential.SSHKey;
using NetPass.Services;

namespace NetPass.DTO.Credential;

[JsonPolymorphic(TypeDiscriminatorPropertyName =  "type")]
[JsonDerivedType(typeof(LoginDto), "login")]
[JsonDerivedType(typeof(SshKeyDto), "ssh_key")]
[JsonDerivedType(typeof(PaymentCardDto), "payment_card")]
public abstract record CredentialDto(int CredentialId, string? Notes)
{
    public static CredentialDto FromModel(Models.Credential credential, IEncryptionService encryptionService)
    {
        switch (credential)
        {
            case Models.Login login:
                return new LoginDto(
                    login.CredentialId,
                    login.Notes,
                    login.Username,
                    encryptionService.DecryptString(login.Password));
            
            case Models.SshKey sshKey:
                return new SshKeyDto(
                    sshKey.CredentialId,
                    sshKey.Notes,
                    encryptionService.DecryptString(sshKey.Key));
            
            case Models.PaymentCard paymentCard:
                return new PaymentCardDto(
                    paymentCard.CredentialId,
                    paymentCard.Notes,
                    encryptionService.DecryptString(paymentCard.CardNumber),
                    paymentCard.ExpiryDate,
                    encryptionService.DecryptString(paymentCard.Cvv));
            
            default:
                throw new ArgumentException($"Unknown credential type: {credential.GetType().Name}");
        }
    }
}