using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.PaymentCard;

public record CreatePaymentCardRequest(
    [Required, CreditCard] string CardNumber,
    [Required] DateOnly ExpiryDate,
    [Required, RegularExpression(@"^\d{3,4}$", ErrorMessage = "CCV must be 3 or 4 digits")] string Ccv,
    [StringLength(2000)] string? Notes);