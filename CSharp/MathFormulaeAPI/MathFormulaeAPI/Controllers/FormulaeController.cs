using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MathFormulaeAPI.Models;

namespace MathFormulaeAPI.Controllers
{

    [Route("MathFormulaeAPI/[Controller]")]
    [ApiController]
    public class FormulaeController : ControllerBase
    {
        private readonly FormulaeContext _context;
        private readonly TokenContext _tokenContext;
        //initialize the api data
        public FormulaeController(FormulaeContext context,TokenContext tkncontext)
        {
            _context = context;
            _tokenContext = tkncontext;

        }
        //When this method is called it will get all formulaes from the api database
        [HttpGet("{token}")]
        public async Task<ActionResult<IEnumerable<Formulae>>> GetFormulaes(string token)
        {
            if (!tokenExists(token))
            {
               ModelState.AddModelError("ErrorMessage", "Token does not exist");
                return BadRequest(ModelState);
            }
            return await _context.Formulaes.ToListAsync();
        }
       //When this method is called it will get all formulaes with their specified order
       //accepted order is ascending and descending
        [HttpGet("{token}/{orderBy}/{order}")]
        public async Task<ActionResult<IEnumerable<Formulae>>> GetFormulaes1(string token,String orderBy,string order)
        {
            if (!tokenExists(token))
            {
                ModelState.AddModelError("ErrorMessage", "Token does not exist");
                return BadRequest(ModelState);
            }
            if (orderBy != null)
            {
                if(order==null)
                {
                    order = "";
                }
                switch (orderBy.ToLower())
                {
                    case "id":
                         if(order=="desc" || order=="descending")
                        {
                            return await _context.Formulaes.OrderByDescending(f => f.Id).ToListAsync();
                        }else if(order == "asc" || order == "ascending")
                        {
                            return await _context.Formulaes.OrderBy(f => f.Id).ToListAsync();
                        }
                        break;

                    case "date":
                        if (order == "desc" || order == "descending")
                        {
                            return await _context.Formulaes.OrderByDescending(f => f.DatePublished).ToListAsync();
                        }
                        else if (order == "asc" || order == "ascending")
                        {
                            return await _context.Formulaes.OrderBy(f => f.DatePublished).ToListAsync();
                        }
                        break;
                            
                }
            }
            return await _context.Formulaes.ToListAsync();
        }
        //When this method is called it will get all formulaes with their specified order
        //accepted order is ascending and descending
        // GET: MathFormulaeAPI/Formulae/5
        [HttpGet("{token}/{id}")]
        public async Task<ActionResult<Formulae>> GetFormulae(string token,int id)
        {
            if (!tokenExists(token))
            {
                ModelState.AddModelError("ErrorMessage", "Token does not exist");
                return BadRequest(ModelState);
            }

            var formulae = await _context.Formulaes.FindAsync(id);

            if (formulae == null)
            {
                return NotFound();
            }

            return formulae;
        }

        //When this method is called it will get formulae with specified id
        // PUT: MathFormulaeAPI/Formulae/5
        [HttpPut("{token}/{id}")]
        public async Task<IActionResult> PutFormulae(string token,int id, Formulae formulae)
        {

            if (!tokenExists(token))
            {
                ModelState.AddModelError("ErrorMessage", "Token does not exist");
                return BadRequest(ModelState);
            }

            if (id != formulae.Id)
            {
                return BadRequest();
            }
           
      
            _context.Entry(formulae).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FormulaeExists(id))
                {
                    return NotFound("Formulae not found");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        //When this method is called it will add new formulae to the api database
        // POST: MathFormulaeAPI/Formulae
        [HttpPost("{token}")]
        public async Task<ActionResult<Formulae>> PostFormulae(string token,Formulae formulae)
        {
            if (!tokenExists(token))
            {
                ModelState.AddModelError("ErrorMessage", "Token does not exist");
                return BadRequest(ModelState);
            }
            _context.Formulaes.Add(formulae);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFormulae", new {token=token, id = formulae.Id}, formulae);
        }
        //When this method is called it will delete formulae from the api database
        // DELETE: MathFormulaeAPI/Formulae/id
        [HttpDelete("{token}/{id}")] 

        public async Task<ActionResult<Formulae>> DeleteFormulae(string token,int id)
        {
            if(tokenExists(token))
            {

         
            var formulae = await _context.Formulaes.FindAsync(id);
            if (formulae == null)
            {
                return NotFound();
            }

            _context.Formulaes.Remove(formulae);
            await _context.SaveChangesAsync();

            return formulae;
            }else
            {
                ModelState.AddModelError("ErrorMessage", "Token does not exist");
                return BadRequest(ModelState);
            }
        }
        //check if the api exist from the list
        private bool FormulaeExists(int id)
        {
            return _context.Formulaes.Any(e => e.Id == id);
        }
        //check if token exist
        private bool tokenExists(string tkn)
        {
            return _tokenContext.apiTokens.Any((e => e.Token == tkn && e.Expirydate.Date>DateTime.Now.Date));
        }
    }
}
