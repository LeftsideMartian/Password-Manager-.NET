using NetPass.DTO.Password;
using NetPass.Services;
using NUnit.Framework;

namespace NetPass.Tests.Services;

[TestFixture]
public sealed class PasswordGeneratorServiceTests
{
    private PasswordGeneratorService service = null!;

    [SetUp]
    public void SetUp()
    {
        service = new PasswordGeneratorService();
    }

    [Test]
    public void Generate_NullRequest_ThrowsArgumentNullException()
    {
        var exception = Assert.Throws<ArgumentNullException>(() => service.Generate(null!));

        Assert.That(exception!.ParamName, Is.EqualTo("request"));
    }

    [Test]
    public void Generate_DefaultRequest_ReturnsTwentyCharacterStrongPassword()
    {
        var response = service.Generate(new GeneratePasswordRequest());

        Assert.That(response.Profile, Is.EqualTo("Strong"));
        Assert.That(response.Password, Has.Length.EqualTo(20));
        Assert.That(response.Password, Does.Match("^[a-zA-Z0-9!@#$%^&*()\\-_=+\\[\\]{}:,.?]+$"));
    }

    [TestCase(12)]
    [TestCase(128)]
    public void Generate_StrongPasswordAtBoundaryLength_ReturnsRequestedLength(int length)
    {
        var response = service.Generate(new GeneratePasswordRequest("Strong", length));

        Assert.That(response.Profile, Is.EqualTo("Strong"));
        Assert.That(response.Password, Has.Length.EqualTo(length));
    }

    [TestCase(11)]
    [TestCase(129)]
    public void Generate_StrongPasswordOutsideAllowedLength_ThrowsArgumentException(int length)
    {
        var exception = Assert.Throws<ArgumentException>(
            () => service.Generate(new GeneratePasswordRequest("Strong", length)));

        Assert.That(exception!.Message, Does.Contain("between 12 and 128"));
    }

    [Test]
    public void Generate_EasyToTypeProfile_IgnoresRequestedLength()
    {
        var response = service.Generate(new GeneratePasswordRequest("EasyToType", 12));
        var parts = response.Password.Split('-');
        var capitalisedWords = parts[..3].Count(word => char.IsUpper(word[0])); // Count number of capitilised words

        Assert.That(response.Profile, Is.EqualTo("EasyToType"));
        Assert.That(parts, Has.Length.EqualTo(4));
        Assert.That(capitalisedWords, Is.EqualTo(1));
        Assert.That(parts[0], Does.Match("^[A-Za-z]+$"));
        Assert.That(parts[1], Does.Match("^[A-Za-z]+$"));
        Assert.That(parts[2], Does.Match("^[A-Za-z]+$"));
        Assert.That(parts[3], Does.Match("^[0-9]$"));
    }
}
