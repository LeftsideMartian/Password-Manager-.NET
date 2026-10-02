using Microsoft.EntityFrameworkCore;
using Passy.Models;

namespace Passy.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
}