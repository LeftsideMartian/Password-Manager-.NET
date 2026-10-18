using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetPass.DTO;

namespace NetPass.Models;

public class SshKey : Credential
{
    [MaxLength(10000)]
    public required string Key { get; set; }
}

public class SshKeyConfiguration :  IEntityTypeConfiguration<SshKey>{
    public void Configure(EntityTypeBuilder<SshKey> builder)
    {
        builder.ToTable("ssh_key");
    }
    
}