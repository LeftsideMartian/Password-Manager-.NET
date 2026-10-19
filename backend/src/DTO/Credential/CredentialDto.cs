using System.Text.Json.Serialization;
using NetPass.DTO.Credential.Login;
using NetPass.Services;

namespace NetPass.DTO.Credential;

[JsonPolymorphic(TypeDiscriminatorPropertyName =  "type")]
[JsonDerivedType(typeof(LoginDto), "login")]
public abstract record CredentialDto(
    int CredentialId,
    string Name,
    string Category,
    string? Notes)
{
    public static CredentialDto FromModel(Models.Credential credential, IEncryptionService encryptionService)
    {
        switch (credential)
        {
            case Models.Login login:
                return new LoginDto(
                    login.CredentialId,
                    login.Name,
                    login.Category,
                    login.Notes,
                    login.Username,
                    encryptionService.DecryptString(login.Password));

            default:
                throw new ArgumentException($"Unknown credential type: {credential.GetType().Name}");
        }
    }
}