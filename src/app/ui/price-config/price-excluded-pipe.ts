import { Feature, FeatureOption } from '../../../models/Industry';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'PriceExcluded',
    pure: false
})
export class PriceExcludedPipe  implements PipeTransform {
    transform(features: Feature[], show: boolean, edition: string, country: string): any {
        if (!features || show) {
            return features;
        }
        return features.filter(feature => {
            if (!feature.included || !feature.isAvailable)
                return false;

            if (feature.allowISO != "" && !feature.allowISO.includes(country))
                return false;
            if (feature.denyISO != "" && feature.denyISO.includes(country))
                return false;

            var option : FeatureOption = feature.options.find(o => o.edition == edition);
            if (option && option.availability == "")
                return false;

            return true;
        });
    }
}
