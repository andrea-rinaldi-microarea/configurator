 namespace Configurator.Models
 {
    public class Configuration
    {
        public string Name { get; set; }
        public string IndustryCode {get; set; }
        public string Version {get; set; }
        public string ProductID {get; set; }
        public string ProductName {get; set; }
        public Feature[] Features { get; set; }
    }
 }
 
