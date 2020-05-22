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
        public ActionResult<List<ConfigurationFeature>> Get(string name)
        {
            if (!System.IO.File.Exists($"data\\{name}.csv"))
            {
                name = "FeaturesList";
            }
            List<ConfigurationFeature> features;
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
                features = new List<ConfigurationFeature>(csv.GetRecords<ConfigurationFeature>());
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
                case "PPT": return "PPT";
                default: return ""; 
            }
        }

        private bool isOptional(Feature feature)
        {
            for (int e = 0; e < feature.options.Count; e++)
            {
                if  (
                        feature.options[e].availability == "optional" || 
                        feature.options[e].availability == "count" || 
                        feature.options[e].availability == "PPT"
                    )
                    return true;
            }
            return false;
        }

        [HttpPost("export")]
        public IActionResult Export([FromBody] Configuration configuration)
        {
            System.IO.Directory.CreateDirectory("output");
            using(TextWriter writer = new StreamWriter($"output\\{configuration.Name}.json", false))
            {
                Industry industry = new Industry();
                industry.name = configuration.Name;
                industry.industryCode = configuration.IndustryCode;
                industry.version = configuration.Version;
                industry.productID = configuration.ProductID;
                industry.productName = configuration.ProductName;
                foreach (var feat in configuration.Features)
                {
                    if (!feat.Included)
                        continue;

                    Feature feature = new Feature();
                    if (feat.Module != "")
                    {
                        feature.isModule = true;
                        feature.description = feat.Module.TrimStart('_') + " " + feat.Functionality;
                    }
                    else
                    {
                        feature.isModule = false;
                        feature.description = feat.Functionality;
                    }
                    feature.fragment = feat.Fragment;
                    feature.isAvailable = !feat.NotYetAvailable;
                    feature.allowISO = feat.AllowISO;
                    feature.denyISO = feat.DenyISO;

                    feature.options.Add(new FeatureOption{ edition = "STD", availability = ConvertStoreFeatureOption(feat.Standard) });
                    feature.options.Add(new FeatureOption{ edition = "PRM", availability = ConvertStoreFeatureOption(feat.Premium) });
                    feature.options.Add(new FeatureOption{ edition = "PRO", availability = ConvertStoreFeatureOption(feat.Professional) });
                    feature.options.Add(new FeatureOption{ edition = "ENT", availability = ConvertStoreFeatureOption(feat.Enterprise) });

                    if (isOptional(feature)) {
                        feature.optionID = feat.Tag;
                    }
                    industry.features.Add(feature);
                }
                string json = JsonConvert.SerializeObject(industry, new JsonSerializerSettings{ Formatting = Formatting.Indented }); 
                writer.WriteLine(json);
            }
            return NoContent();
        }

        [HttpPost("csv-export")]
        public IActionResult CSVExport([FromBody] CSVExport csvExp)
        {
            System.IO.Directory.CreateDirectory("output");
            using(TextWriter writer = new StreamWriter($"output\\{csvExp.Name}.csv", false, Encoding.UTF8))
            {
                var csv = new CsvWriter( writer );
                csv.Configuration.Delimiter = ";";
                csv.WriteRecords( csvExp.Features );
            }
            return NoContent();
        }        


    }
}
