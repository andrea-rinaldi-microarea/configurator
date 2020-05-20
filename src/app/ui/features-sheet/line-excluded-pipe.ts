import { FeaturesSheetLine } from '../../../models/features-sheet';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'LineExcluded',
    pure: false
})
export class LineExcludedPipe implements PipeTransform {
    transform(lines: FeaturesSheetLine[], show: boolean): any {
        if (!lines || show) {
            return lines;
        }
        return lines.filter(line => line.included);
    }
}