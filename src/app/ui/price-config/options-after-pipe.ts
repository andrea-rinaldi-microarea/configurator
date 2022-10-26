import { Pipe, PipeTransform } from "@angular/core";
import { Feature, FeatureOption } from "../../../models/Industry";

@Pipe({
    name: 'OptionsAfter',
    pure: false
})
export class OptionsAfterPipe   implements PipeTransform {
    transform(features: Feature[], edition: string): Feature[] {
        if (!features) {
            return features;
        }
        features.sort ( (f1: Feature, f2: Feature) => {
            var f1Option : FeatureOption = f1.options.find(o => o.edition == edition);
            var f2Option : FeatureOption = f2.options.find(o => o.edition == edition);
            if (f1Option.availability == "always" && f2Option.availability != "always") {
                return -1;
            } else if (f1Option.availability != "always" && f2Option.availability == "always") {
                return 1;
            } else {
                return 0;
            }
        });

        return features;
    }
}
