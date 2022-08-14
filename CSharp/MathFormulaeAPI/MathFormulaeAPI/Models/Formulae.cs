using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MathFormulaeAPI.Models
{
    public class Formulae
    {
        private int _Id;
        private String _Name;
        private String _Description;
        private String _Author;
        private DateTime _DatePublished;

        public int Id { get => _Id; set => _Id = value; }
        public string Name { get => _Name; set => _Name = value; }
        public string Description { get => _Description; set => _Description = value; }
        public string Author { get => _Author; set => _Author = value; }
        public DateTime DatePublished { get => _DatePublished; set => _DatePublished = value; }
    }
}
