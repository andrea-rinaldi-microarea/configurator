using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Configurator.Models;
using System.IO;
using CsvHelper;
using System.Text;
using System;

namespace Configurator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeaturesController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public ActionResult<List<Feature>> Get()
        {
            TextReader reader = new StreamReader("public\\FeaturesList.csv");
            var csvReader = new CsvReader(reader);
            csvReader.Configuration.HasHeaderRecord = false;
            csvReader.Configuration.Encoding = Encoding.UTF8;
            csvReader.Configuration.Delimiter = ";";
            csvReader.Configuration.BadDataFound = context =>
            {
                Console.WriteLine( $"Bad data found on row '{context.RawRow}'" );
            };
            var features = new List<Feature>(csvReader.GetRecords<Feature>());
            return features;
        }
    }
}