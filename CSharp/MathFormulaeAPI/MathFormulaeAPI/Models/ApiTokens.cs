using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MathFormulaeAPI.Models
{
    //this model holds token data information
    public class ApiTokens
    {
       

        private string _token;

        private DateTime _datecreated;
	    private DateTime _expirydate;
        private Guid _userid;
        private int _tokenid;
        [Key]
        public int tokenid { get => _tokenid; set => _tokenid = value; }
        public string Token { get => _token; set => _token = value; }
        public DateTime Datecreated { get => _datecreated; set => _datecreated = value; }
        public DateTime Expirydate { get => _expirydate; set => _expirydate = value; }
        public Guid Userid { get => _userid; set => _userid = value; }
    }
}
