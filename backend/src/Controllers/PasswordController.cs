using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetPass.DTO.Password;
using NetPass.Services;

namespace NetPass.Controllers;

[Authorize]
[ApiController]
[Route("/password")]
public class PasswordController(IPasswordGeneratorService passwordGeneratorService) : ControllerBase
{
    [HttpPost("generate")]
    public ActionResult<GeneratePasswordResponse> Generate([FromBody] GeneratePasswordRequest request)
    {
        try
        {
            return Ok(passwordGeneratorService.Generate(request));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }
}
