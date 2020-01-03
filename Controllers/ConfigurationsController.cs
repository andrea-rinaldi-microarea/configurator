using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using Configurator.Models;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
                csv.Configuration.CultureInfo = CultureInfo.InvariantCulture;

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

        private string ConvertStoreFeatureOption(string option)
        {
            switch (option)
            {
                case "X": return "always"; 
                case "X/0": return "optional";
                case "max": return "always"; //@@TODO capire bene come gestire
                case "Nr-User": return "count";
                default: return ""; 
            }
        }

        [HttpPost("export")]
        public IActionResult Export([FromBody] Configuration configuration)
        {
            using(TextWriter writer = new StreamWriter($"data\\{configuration.Name}.json", false))
            {
                StoreConfiguration storeConfig = new StoreConfiguration();
                storeConfig.name = configuration.Name;
                foreach (var feat in configuration.Features)
                {
                    if (!feat.Available)
                        continue;

                    StoreFeature storeFeat = new StoreFeature();
                    if (feat.Module != "")
                    {
                        storeFeat.isModule = true;
                        storeFeat.description = feat.Module.TrimStart('_') + " " + feat.Functionality;
                    }
                    else
                    {
                        storeFeat.isModule = false;
                        storeFeat.description = feat.Functionality;
                    }
                    storeFeat.fragment = feat.Fragment;

                    storeFeat.options.Add(new StoreFeatureOption{ edition = "STD", availability = ConvertStoreFeatureOption(feat.Standard) });
                    storeFeat.options.Add(new StoreFeatureOption{ edition = "PRO", availability = ConvertStoreFeatureOption(feat.Professional) });
                    storeFeat.options.Add(new StoreFeatureOption{ edition = "ENT", availability = ConvertStoreFeatureOption(feat.Enterprise) });

                    storeConfig.features.Add(storeFeat);
                }
                string json = JsonConvert.SerializeObject(storeConfig, new JsonSerializerSettings{ Formatting = Formatting.Indented }); 
                writer.WriteLine(json);
            }
            return NoContent();
        }        
    }
}
