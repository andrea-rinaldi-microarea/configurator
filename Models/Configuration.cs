 namespace Configurator.Models
 {
    public class Configuration
    {
        public string Name { get; set; }
        public string IndustryCode {get; set; }
        public string Version {get; set; }
        public Feature[] Features { get; set; }
    }
 }
 
