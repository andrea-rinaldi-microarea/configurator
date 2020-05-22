 namespace Configurator.Models
 {
     public class ConfigurationFeature
    {
        public string Module { get; set; }
        public string Functionality { get; set; }
        public string Tag {get; set;}
        public bool Discontinued {get; set;}
        public string Fragment {get; set;}
        public string AllowISO {get; set;}
        public string DenyISO {get; set;}
        public string Standard {get; set;}
        public string Premium {get; set;}
        public string Professional {get; set;}
        public string Enterprise {get; set;}
        public bool Included {get; set;}
        public bool NotYetAvailable {get; set;}
    }

    public class Configuration
    {
        public string Name { get; set; }
        public string IndustryCode {get; set; }
        public string Version {get; set; }
        public string ProductID {get; set; }
        public string ProductName {get; set; }
        public ConfigurationFeature[] Features { get; set; }
    }
 }
 
