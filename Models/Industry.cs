using System.Collections.Generic;

namespace Configurator.Models
 {
    public class FeatureOption
    {
        public string edition {get;set;}
        public string availability {get;set;}
    }

    public class Feature
    {
        public bool isModule {get;set;}
        public int level {get;set;}
        public string description {get;set;}
        public string fragment {get;set;}
        public bool isAvailable {get;set;}
        public string allowISO {get;set;}
        public string denyISO {get;set;}
        public string optionID {get;set;} = "";
        public List<FeatureOption> options {get;set;} = new List<FeatureOption>();
    }

    public class Industry
    {
        public string name {get; set;}
        public string industryCode {get;set;}
        public string version {get;set;}
        public string productID {get;set;}
        public string productName {get;set;}
        public List<Feature> features { get; set; } = new List<Feature>();
    }
 }