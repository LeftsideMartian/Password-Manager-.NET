using System.Security.Cryptography;
using NetPass.DTO.Password;

namespace NetPass.Services;

public interface IPasswordGeneratorService
{
    GeneratePasswordResponse Generate(GeneratePasswordRequest request);
}

public sealed class PasswordGeneratorService : IPasswordGeneratorService
{
    private const string LowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    private const string UppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string Digits = "0123456789";
    private const string Symbols = "!@#$%^&*()-_=+[]{}:,.?";

    // Words generated using Claude.ai, removed words starting with 'x'
    private readonly string[] WordBank =
    [
        "apple", "animal", "answer", "arrow", "autumn",
        "banana", "bridge", "bottle", "brother", "button",
        "candle", "castle", "cloud", "chair", "coffee",
        "dance", "doctor", "dragon", "dream", "drum",
        "eagle", "earth", "engine", "elephant", "evening",
        "forest", "flower", "friend", "father", "fabric",
        "garden", "guitar", "ghost", "green", "glass",
        "house", "honey", "horse", "hammer", "harbor",
        "island", "insect", "iron", "ice", "image",
        "jacket", "jungle", "journey", "jelly", "jewel",
        "kitchen", "kite", "knife", "kingdom", "key",
        "lemon", "ladder", "lake", "lantern", "leaf",
        "mountain", "mirror", "music", "monkey", "market",
        "night", "needle", "nest", "number", "noodle",
        "ocean", "orange", "office", "olive", "orbit",
        "pencil", "planet", "pillow", "pocket", "pepper",
        "queen", "quiet", "quilt", "question", "quadrant",
        "river", "rabbit", "rocket", "ribbon", "radio",
        "sunset", "spoon", "silver", "school", "shadow",
        "table", "tiger", "train", "thunder", "teacher",
        "umbrella", "uncle", "unicorn", "universe", "upstairs",
        "valley", "violin", "village", "velvet", "vase",
        "window", "water", "winter", "wagon", "whistle",
        "yellow", "yard", "yogurt", "yacht", "yarn",
        "zebra", "zipper", "zero", "zone", "zigzag"
    ];

    public GeneratePasswordResponse Generate(GeneratePasswordRequest request)
    {
        var profile;
        var isEasyToType = false;

        if (request.Profile.Equals("EasyToType", StringComparison.OrdinalIgnoreCase))
        {
            profile = "EasyToType";
            isEasyToType = true;
        }
        else
        {
            profile = "Strong";
        }
        var length = request.Length ?? (isEasyToType ? 0 : 20);

        if (!isEasyToType && (length < 12 || length > 128))
        {
            throw new ArgumentException("Length must be between 12 and 128 for strong passwords.");
        }

        var password = isEasyToType
            ? GenerateEasyToTypePassword()
            : GenerateStrongPassword(length);

        return new GeneratePasswordResponse(
            password,
            isEasyToType ? "EasyToType" : "Strong",
            password.Length);
    }

    private static string GenerateStrongPassword(int length)
    {
        var characters = LowercaseLetters + UppercaseLetters + Digits + Symbols;
        var passwordCharacters = new char[length];
        for (var i = 0; i < passwordCharacters.Length; i++)
        {
            passwordCharacters[i] = GetRandomCharacter(characters);
        }
        return new string(passwordCharacters);
    }

    private static string GenerateEasyToTypePassword()
    {
        var words = new string[3];

        var capitalisedWordIndex = RandomNumberGenerator.GetInt32(words.Length);

        for(var i = 0; i < words.Length; i++)
        {
            if (i == capitalisedWordIndex)
            {
                // Capitlises one of the words to satisfy common password requirement
                var word = words[RandomNumberGenerator.GetInt32(words.Length)];
                words[i] = char.ToUpper(word[0]) + word[1..];
            }
            else
            {
                words[i] = WordBank[RandomNumberGenerator.GetInt32(WordBank.Length)];
            }
        }

        return $"{string.Join("-", words)}-{RandomNumberGenerator.GetInt32(10)}";
    }

    private static char GetRandomCharacter(string characters) =>
        characters[RandomNumberGenerator.GetInt32(characters.Length)];

}
