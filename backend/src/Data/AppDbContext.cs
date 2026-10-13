using Microsoft.EntityFrameworkCore;
using NetPass.Models;

namespace NetPass.Data;

// Tables register here!
public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
}
