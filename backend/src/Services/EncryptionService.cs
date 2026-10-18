using System.Security.Cryptography;
using System.Text;

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
        var base64Key = config["Encryption:Key"] ?? throw new Exception("Encryption service key is missing");
        _key = Convert.FromBase64String(base64Key);
    }
    
    public string EncryptString(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = _key;
        
        aes.GenerateIV();
        
        using var msEncrypt = new MemoryStream();
        
        msEncrypt.Write(aes.IV, 0, aes.IV.Length);
        
        using var encryptor = aes.CreateEncryptor();
        using var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
        
        byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
        csEncrypt.Write(plainTextBytes, 0, plainTextBytes.Length);
        csEncrypt.FlushFinalBlock();
        
        return Convert.ToBase64String(msEncrypt.ToArray());
    }

    public string DecryptString(string cipherText)
    {
        byte[] combinedBytes = Convert.FromBase64String(cipherText);

        if (combinedBytes.Length < 16)
        {
            throw new ArgumentException("invalid ciphertext length");
        }

        using var aes = Aes.Create();

        aes.Key = _key;
        
        byte[] iv = new byte[16];
        Array.Copy(combinedBytes, 0,iv, 0 ,16);
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor();

        using var msDecrypt = new MemoryStream(combinedBytes, 16, combinedBytes.Length - 16);
        using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
        using var srDecrypt = new StreamReader(csDecrypt);
        
        return srDecrypt.ReadToEnd();
    }
}