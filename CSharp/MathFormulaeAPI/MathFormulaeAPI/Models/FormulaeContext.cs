using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace MathFormulaeAPI.Models
{
    public class FormulaeContext: DbContext
    {
            public FormulaeContext(DbContextOptions<FormulaeContext> options) : base(options) { }
            public DbSet<Formulae> Formulaes { get; set; } = null!;
       
    }

}

