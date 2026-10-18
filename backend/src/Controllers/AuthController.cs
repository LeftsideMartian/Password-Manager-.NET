using System.Security.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetPass.DTO.Auth;
using NetPass.Services;

namespace NetPass.Controllers;

[Controller]
[Authorize]
[Route("/auth")]
public class AuthController(IJwtService jwtService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
    {
        try
        {
            return Ok(await jwtService.AuthenticateAsync(request));
        }
        catch (AuthenticationException e)
        {
            Console.WriteLine(e);
            return Unauthorized();
        }
        catch (ArgumentNullException e)
        {
            Console.WriteLine(e);
            return BadRequest();
        }
        catch
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
