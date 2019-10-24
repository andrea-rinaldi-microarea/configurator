import { Feature } from '../../../models/feature';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Excluded',
    pure: false
})
export class ExcludedPipe implements PipeTransform {
    transform(features: Feature[], show: boolean): any {
        if (!features || show) {
            return features;
        }
        return features.filter(feat => !feat.discontinued && feat.available);
    }
}