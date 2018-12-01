using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Configurator.Models;

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
            List<Feature> f = new List<Feature>();
            f.Add(new Feature() { Module = "a", Functionality = "b" });
            f.Add(new Feature() { Module = "x", Functionality = "y" });
            return f;
        }
    }
}