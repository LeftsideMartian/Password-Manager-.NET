using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetPass.DTO;

namespace NetPass.Models;

public class SharedLink
{
    public int LinkId { get; set; }
    public int SharedUserId { get; set; }
    public int CredentialId { get; set; }
    [MaxLength(1000)] //adjust to however long the max URL size should be
    public required string URL  { get; set; }
    public DateTime ExpiryDate  { get; set; }
    public int RemainingUses { get; set; }
}

public class SharedLinkConfiguration :  IEntityTypeConfiguration<SharedLink>{
    public void Configure(EntityTypeBuilder<SharedLink> builder)
    {
        builder.ToTable("shared_link");
        builder.HasKey(x => x.LinkId);
        
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.SharedUserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne<Credential>()
            .WithMany()
            .HasForeignKey(x => x.CredentialId)
            .OnDelete(DeleteBehavior.Cascade);
    }
    
}