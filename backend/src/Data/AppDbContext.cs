using Microsoft.EntityFrameworkCore;
using NetPass.Models;

namespace NetPass.Data;

// Tables register here!
public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Credential> Credentials { get; set; }
    public DbSet<Login> Logins { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
