 namespace Configurator.Models
 {
    public class Feature
    {
        public string Module { get; set; }
        public string Functionality { get; set; }
        public string Tag {get; set;}
        public bool Discontinued {get; set;}
        public bool Standard {get; set;}
        public bool Professional {get; set;}
        public bool Enterprise {get; set;}
        public bool Unavailable {get; set;}
    }
 }
 
