using Microsoft.AspNetCore.Mvc;
using Passy.Data;
using Passy.DTO;
using Passy.Models;

namespace Passy.Controllers;

[Route("/user")]
public class TestController(AppDbContext appDb) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var users = appDb.Users.ToList();
        return Ok(users);
    }

    [HttpGet("/user/{id:int}")]
    public IActionResult GetById([FromRoute] int id)
    {
        var user = appDb.Users.Find(id);
        return user is not null ? Ok(user) : NotFound();
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateUserRequest request)
    {
        User newUser = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Password = request.Password
        };

        appDb.Users.Add(newUser);
        appDb.SaveChanges();

        return Created();
    }
}