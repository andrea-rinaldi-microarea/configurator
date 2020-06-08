using System.Collections.Generic;

namespace Configurator.Models
 {
    public class DataSheetLineOption
    {
        public string edition {get;set;}
        public string availability {get;set;}
    }

    public class DataSheetLine
    {
        public string Topic { get; set; }
        public string Order { get; set; }
        public int Level { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public bool NotYetAvailable { get; set; }
        public string allowISO {get;set;}
        public string denyISO {get;set;}
        public List<DataSheetLineOption> options {get;set;} = new List<DataSheetLineOption>();
    }

    public class DataSheet
    {
        public string Name { get; set; }
        public DataSheetLine[] Lines { get; set; }
    }
 }