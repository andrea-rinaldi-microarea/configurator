import { DataSheetLine } from '../../../models/data-sheet';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'LineExcluded',
    pure: false
})
export class LineExcludedPipe implements PipeTransform {
    transform(lines: DataSheetLine[], show: boolean): any {
        if (!lines || show) {
            return lines;
        }
        return lines.filter(line => line.included);
    }
}