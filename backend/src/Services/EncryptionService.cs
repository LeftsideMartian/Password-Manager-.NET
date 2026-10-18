namespace NetPass.Services;

public interface IEncryptionService
{
    string EncryptString(string plainText);
    string DecryptString(string cipherText);
}

public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration config)
    {
        throw  new NotImplementedException();
    }
    
    public string EncryptString(string plainText)
    {
        throw new NotImplementedException();
    }

    public string DecryptString(string cipherText)
    {
        throw new NotImplementedException();
    }
}