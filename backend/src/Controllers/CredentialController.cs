using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetPass.DTO.Credential;
using NetPass.Services;

namespace NetPass.Controllers;

[Authorize]
[ApiController]
[Route("/credential")]
public class CredentialController(ICredentialService credentialService) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        string? email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue("email");

        if (email is null)
            return Unauthorized();

        try
        {
            return Ok(credentialService.GetCredentials(email).Select(credential => new
            {
                credential.CredentialId,
                credential.Name,
                credential.Username,
                credential.Password,
                credential.Category,
                credential.Note,
                credential.UserId
            }));
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(exception.Message);
        }
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateCredentialRequest request)
    {
        string? email = User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue("email");

        if (email is null)
            return Unauthorized();

        try
        {
            var credential = credentialService.CreateCredential(request, email);
            return Ok(new
            {
                credential.CredentialId,
                credential.Name,
                credential.Username,
                credential.Category,
                credential.Note,
                credential.UserId
            });
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(exception.Message);
        }
    }
}
