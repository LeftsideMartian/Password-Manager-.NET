using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NetPass.DTO;

namespace NetPass.Models;

public class PaymentCard : Credential
{
    [MaxLength(100)]
    public required string CardNumber { get; set; }
    public required DateOnly ExpiryDate { get; set; }
    [MaxLength(100)]
    public required string Cvv { get; set; }
}

public class PaymentCardConfiguration :  IEntityTypeConfiguration<PaymentCard>{
    public void Configure(EntityTypeBuilder<PaymentCard> builder)
    {
        builder.ToTable("payment_card");
    }
    
}