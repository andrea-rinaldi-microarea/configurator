import { Feature } from '../../../models/Industry';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'PriceExcluded',
    pure: false
})
export class PriceExcludedPipe  implements PipeTransform {
    transform(lines: Feature[], show: boolean): any {
        if (!lines || show) {
            return lines;
        }
        return lines.filter(line => line.included && line.isAvailable);
    }
}
