using System.ComponentModel.DataAnnotations;

namespace NetPass.DTO.Credential.PaymentCard;

public record PaymentCardDto(int CredentialId, string? Notes, string CardNumber, DateOnly ExpiryDate, string Cvv) : CredentialDto(CredentialId, Notes);