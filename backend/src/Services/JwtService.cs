using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using NetPass.DTO.Auth;
using NetPass.Repositories;

namespace NetPass.Services;

public interface IJwtService
{
    LoginResponse? Authenticate(LoginRequest request);
}

public class JwtService(IUserRepository userRepo, IConfiguration config) : IJwtService
{
    public LoginResponse? Authenticate(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentNullException();

        if (!userRepo.DoesUserExist(request.Email))
        {
            throw new AuthenticationException();
        }

        var issuer = config["JwtSettings:Issuer"];
        var audience = config["JwtSettings:Audience"];
        var tokenLifetime = config.GetValue<int>("JwtConfig:TokenLifetime");
        var key = config["JwtSettings:Key"] ?? throw new InvalidOperationException("Missing Jwt Key");
        
        var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenLifetime);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([new Claim(JwtRegisteredClaimNames.Email, request.Email)]),
            Expires = tokenExpiryTimeStamp,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha512Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);
        var accessToken = tokenHandler.WriteToken(securityToken);

        return new LoginResponse(request.Email, accessToken,
            (int)tokenExpiryTimeStamp.Subtract(DateTime.UtcNow).TotalSeconds);
    }
}
