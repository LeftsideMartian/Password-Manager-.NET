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
    [HttpPost]
    public IActionResult Create([FromBody] CreateUserRequest request)
    {
        UserDto newUser = userService.CreateUser(request);

        return CreatedAtAction(nameof(GetById), new { id = newUser.UserId }, newUser);
    }

    [HttpGet("/user/{id:int}")]
    public IActionResult GetById([FromRoute] int id)
    {
        // var user = appDb.Users.Find(id);
        // return user is not null ? Ok(user) : NotFound();
        throw new NotImplementedException();
    }

    [HttpPost("/user/{id}/password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequest request, [FromRoute] int userId)
    {
        userService.ChangeUserPassword(request, userId);
        // Handle not found response if user does not exist
        return Ok();
    }
    
    [HttpPost("/user/{id}")]
    public IActionResult UpdateDetails([FromBody] UpdateUserRequest request, [FromRoute] int userId)
    {
        userService.UpdateUserDetails(request, userId);
        return Ok();
    }
    
    [HttpDelete("/user/{id}")]
    public IActionResult DeleteUser([FromRoute] int userId)
    {
        userService.DeleteUser(userId);
        return Ok();
    }
}
