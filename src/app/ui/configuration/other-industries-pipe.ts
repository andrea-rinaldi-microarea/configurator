import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'OtherIndustries',
    pure: false
})
export class OtherIndustries implements PipeTransform {
    transform(industries: string[], current: number): any {
        if (!industries || current == null) {
            return industries;
        }
        return industries.filter(ind => ind != industries[current]);
    }
}
