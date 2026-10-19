using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetPass.DTO;

namespace NetPass.Models;

public abstract class Credential
{
    public int CredentialId { get; set; }
    public int UserId { get; set; }
    [Required, MaxLength(200)]
    public required string Name { get; set; }
    [Required, MaxLength(100)]
    public required string Category { get; set; }
    [MaxLength(2000)]
    public string? Notes { get; set; }
}

public class CredentialConfiguration :  IEntityTypeConfiguration<Credential>{
    public void Configure(EntityTypeBuilder<Credential> builder)
    {
        builder.ToTable("credential");
        builder.UseTptMappingStrategy(); //each credential type gets its own table
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey("UserId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}