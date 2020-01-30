 namespace Configurator.Models
 {
     public class CSVFeature
    {
        public string Module { get; set; }
        public string Functionality { get; set; }
        public string Tag {get; set;}
        public string Sbpk {get; set;}
        public string Adpk {get; set;}
        public string Trpk {get; set;}
        public string Fragment {get; set;}
        public string Base {get; set;}
        public string Professional {get; set;}
        public string Enterprise {get; set;}
    }

    public class CSVExport
    {
        public string Name { get; set; }
        public CSVFeature[] Features { get; set; }
    }
 }
 
