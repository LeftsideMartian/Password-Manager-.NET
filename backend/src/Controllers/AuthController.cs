using System.Security.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetPass.DTO.Auth;
using NetPass.Services;

namespace NetPass.Controllers;

[Controller]
[Authorize]
[Route("/login")]
public class AuthController(IJwtService jwtService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("/login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            return Ok(jwtService.Authenticate(request));
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
