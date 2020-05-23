using System.IO;
using Configurator.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Configurator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataSheetController : ControllerBase
    {
        [HttpGet("{name}")]
        public ActionResult<DataSheet> Get(string name)
        {
            if (!System.IO.File.Exists($"data\\{name}-DataSheet.json"))
            {
                return new DataSheet();
            }
            using(TextReader reader = new StreamReader($"data\\{name}-DataSheet.json")) {
                var dataSheet = JsonConvert.DeserializeObject<DataSheet>(reader.ReadToEnd());
                return dataSheet;
            }
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] DataSheet dataSheet)
        {
            using(TextWriter writer = new StreamWriter($"data\\{dataSheet.Name}-DataSheet.json", false))
            {
                writer.Write(
                    JsonConvert.SerializeObject(
                        dataSheet, 
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