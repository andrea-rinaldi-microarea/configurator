 namespace Configurator.Models
 {
    public class DataSheetLine
    {
        public string Topic { get; set; }
        public bool Included {get; set;}
        public string Standard {get; set;}
        public string Premium {get; set;}
        public string Professional {get; set;}
        public string Enterprise {get; set;}
    }

    public class DataSheet
    {
        public string Name { get; set; }
        public DataSheetLine[] Lines { get; set; }
    }
 }