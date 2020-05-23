using System.IO;
using Configurator.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Configurator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IndustryController : ControllerBase
    {
        [HttpGet("{name}")]
        public ActionResult<Industry> Get(string name)
        {
            if (!System.IO.File.Exists($"data\\{name}.json"))
            {
                return new Industry();
            }
            using(TextReader reader = new StreamReader($"data\\{name}.json")) {
                var industry = JsonConvert.DeserializeObject<Industry>(reader.ReadToEnd());
                return industry;
            }
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Industry industry)
        {
            int f = 0;
            while (f < industry.features.Count)
            {
                if(!industry.features[f].isAvailable)
                    industry.features.RemoveAt(f);
                else   
                    f++;
            }
            using(TextWriter writer = new StreamWriter($"data\\{industry.name}.json", false))
            {
                writer.Write(
                    JsonConvert.SerializeObject(
                        industry, 
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