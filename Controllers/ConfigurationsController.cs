using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Configurator.Models;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;

namespace Configurator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigurationsController : ControllerBase
    {
        // GET api/configurations/Production
        [HttpGet("{name}")]
        public ActionResult<List<Feature>> Get(string name)
        {
            if (!System.IO.File.Exists($"data\\{name}.csv"))
            {
                name = "FeaturesList";
            }
            List<Feature> features;
            using (TextReader reader = new StreamReader($"data\\{name}.csv")) {
                var csv = new CsvReader(reader);
                csv.Configuration.Encoding = Encoding.UTF8;
                csv.Configuration.Delimiter = ";";
                csv.Configuration.HeaderValidated = null;
                csv.Configuration.MissingFieldFound = null;

                csv.Configuration.BadDataFound = context =>
                {
                    Console.WriteLine( $"Bad data found on row '{context.RawRow}'" );
                };
                features = new List<Feature>(csv.GetRecords<Feature>());
            }
            return features;
        }

        [HttpPost("save")]
        public IActionResult Add([FromBody] Configuration configuration)
        {
            using(TextWriter writer = new StreamWriter($"data\\{configuration.Name}.csv", false))
            {
                var csv = new CsvWriter( writer );
                // csv.Configuration.Encoding = Encoding.UTF8;
                csv.Configuration.Delimiter = ";";
                csv.WriteRecords( configuration.Features );
            }
            return NoContent();
        }        
    }
}
