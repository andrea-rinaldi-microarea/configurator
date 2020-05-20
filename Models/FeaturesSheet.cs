 namespace Configurator.Models
 {
    public class FeaturesSheetLine
    {
        public string Topic { get; set; }
        public bool Included {get; set;}
        public string Standard {get; set;}
        public string Premium {get; set;}
        public string Professional {get; set;}
        public string Enterprise {get; set;}
    }

    public class FeaturesSheet
    {
        public string Name { get; set; }
        public FeaturesSheetLine[] Lines { get; set; }
    }
 }