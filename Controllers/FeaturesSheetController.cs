using System.IO;
using Configurator.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Configurator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeaturesSheetController : ControllerBase
    {
        [HttpGet("{name}")]
        public ActionResult<FeaturesSheet> Get(string name)
        {
            if (!System.IO.File.Exists($"data\\{name}.json"))
            {
                return new FeaturesSheet();
            }
            using(TextReader reader = new StreamReader($"data\\{name}.json")) {
                var featureSheet = JsonConvert.DeserializeObject<FeaturesSheet>(reader.ReadToEnd());
                return featureSheet;
            }
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] FeaturesSheet featureSheet)
        {
            using(TextWriter writer = new StreamWriter($"data\\{featureSheet.Name}.json", false))
            {
                writer.Write(
                    JsonConvert.SerializeObject(
                        featureSheet, 
                        Formatting.Indented,
                        new JsonSerializerSettings {
                            NullValueHandling = NullValueHandling.Ignore
                    })
                );
                writer.Close();
            }
            return NoContent();
        }
    }
}