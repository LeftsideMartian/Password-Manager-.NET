using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetPass.DTO;

namespace NetPass.Models;

public class Login : Credential
{
    [MaxLength(100)]
    public required string Username { get; set; }
    [MaxLength(100)]
    public required string Password { get; set; }
}

public class LoginConfiguration :  IEntityTypeConfiguration<Login>{
    public void Configure(EntityTypeBuilder<Login> builder)
    {
        builder.ToTable("login");
    }
    
}