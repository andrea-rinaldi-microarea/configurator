import { Feature } from '../../../../models/feature';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Functionality',
    pure: false
})
export class FunctionalityPipe implements PipeTransform {
    transform(features: Feature[], show: boolean): any {
        if (!features || show) {
            return features;
        }
        return features.filter(feat => feat.module != "");
    }
}