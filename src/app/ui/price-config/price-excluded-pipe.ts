import { Feature, FeatureOption } from '../../../models/Industry';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'PriceExcluded',
    pure: false
})
export class PriceExcludedPipe  implements PipeTransform {
    transform(features: Feature[], showAll: boolean, edition: string, country: string, optionals: boolean): any {
        if (!features) {
            return features;
        }
        return features.filter(feature => {
            if (!showAll && (!feature.included || !feature.isAvailable))
                return false;

            if (feature.allowISO != "" && !feature.allowISO.includes(country))
                return false;
            if (feature.denyISO != "" && feature.denyISO.includes(country))
                return false;

            var option : FeatureOption = feature.options.find(o => o.edition == edition);
            if (option && option.availability == "" && !showAll)
                return false;

            if (!optionals && option.availability != "always")
                return false;

            if (optionals && option.availability == "always")
                return false;

            return true;
        });
    }
}
