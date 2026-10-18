using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetPass.DTO;
using NetPass.DTO.User;
using NetPass.Services;

namespace NetPass.Controllers;

[Authorize]
[Controller]
[Route("/user")]
public class UserController(IUserService userService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserRequest request)
    {
        UserDto newUser = await userService.CreateUserAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = newUser.UserId }, newUser);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById([FromRoute] int id)
    {
        // var user = appDb.Users.Find(id);
        // return user is not null ? Ok(user) : NotFound();
        throw new NotImplementedException();
    }

    [HttpPost("{userId:int}/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, [FromRoute] int userId)
    {
        await userService.ChangeUserPasswordAsync(request, userId);
        // Handle not found response if user does not exist
        return Ok();
    }
    
    [HttpPost("{userId:int}")]
    public async Task<IActionResult> UpdateDetails([FromBody] UpdateUserRequest request, [FromRoute] int userId)
    {
        await userService.UpdateUserDetailsAsync(request, userId);
        return Ok();
    }
    
    [HttpDelete("{userId:int}")]
    public async Task<IActionResult> DeleteUser([FromRoute] int userId)
    {
        await userService.DeleteUserAsync(userId);
        return Ok();
    }
}
