using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace MathFormulaeAPI.Models
{
    
    public class TokenContext: DbContext
    {
        public TokenContext(DbContextOptions<TokenContext> options) : base(options) { }
        public DbSet<ApiTokens> apiTokens { get; set; } = null!;

    }
}
