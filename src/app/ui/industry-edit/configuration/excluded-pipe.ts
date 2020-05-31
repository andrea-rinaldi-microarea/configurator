import { Pipe, PipeTransform } from '@angular/core';
import { Feature } from '../../../../models/Industry';

@Pipe({
    name: 'Excluded',
    pure: false
})
export class ExcludedPipe implements PipeTransform {
    transform(features: Feature[], show: boolean): any {
        if (!features || show) {
            return features;
        }
        return features.filter(feat => !feat.discontinued && feat.included);
    }
}