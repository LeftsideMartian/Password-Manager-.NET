using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetPass.DTO.Credential.Login;
using NetPass.Services;

namespace NetPass.Controllers;


[ApiController]
[Authorize]
[Route("/credential")]
public class CredentialController(ICredentialService credentialService) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult CreateLogin([FromBody] CreateLoginRequest request) =>
        WithUser(userId =>
        {
            var created = credentialService.CreateLogin(request, userId);
            return CreatedAtAction(nameof(GetById), new { id = created.CredentialId }, created);
        });

    [HttpGet]
    public IActionResult GetAll() =>
        WithUser(userId => Ok(credentialService.GetAllCredentials(userId)));

    [HttpGet("{id:int}")]
    public IActionResult GetById([FromRoute] int id) =>
        WithUser(userId =>
        {
            var credential = credentialService.GetCredentialById(id, userId);
            return credential is null ? NotFound() : Ok(credential);
        });

    [HttpPut("{id:int}/login")]
    public IActionResult UpdateLogin([FromRoute] int id, [FromBody] CreateLoginRequest request) =>
        WithUser(userId =>
        {
            var updated = credentialService.UpdateLogin(id, request, userId);
            return updated is null ? NotFound() : Ok(updated);
        });

    [HttpDelete("{id:int}")]
    public IActionResult Delete([FromRoute] int id) =>
        WithUser(userId => credentialService.DeleteCredentialById(id, userId) ? NoContent() : NotFound());

    // Works out who is calling from the JWT, then runs the action for that user.
    private IActionResult WithUser(Func<int, IActionResult> action)
    {
        // The token stores the email; ASP.NET may rename the claim, so check both names.
        var email = (User.FindFirst(ClaimTypes.Email) ?? User.FindFirst(JwtRegisteredClaimNames.Email))?.Value;
        if (email is null) return Unauthorized();

        var userId = credentialService.GetUserId(email);
        return userId is null ? Unauthorized() : action(userId.Value);
    }
}