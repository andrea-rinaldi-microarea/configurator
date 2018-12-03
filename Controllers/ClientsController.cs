using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using CsvHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Configurator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public ActionResult<List<object>> Get()
        {
            TextReader reader = new StreamReader("public\\clients-all.csv");
            var csvReader = new CsvReader(reader);
            // csvReader.Configuration.HasHeaderRecord = false;
            csvReader.Configuration.Encoding = Encoding.UTF8;
            csvReader.Configuration.Delimiter = ";";
            csvReader.Configuration.BadDataFound = context =>
            {
                Console.WriteLine( $"Bad data found on row '{context.RawRow}'" );
            };
            var clients = new List<object>(csvReader.GetRecords<object>());
            return clients;
        }

        // POST api/clients/upload
        [HttpPost("upload")]
        public IActionResult Upload()
        {
            using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            {  
                string content = reader.ReadToEnd();
            }

            return NoContent();
        }

    }
    
}