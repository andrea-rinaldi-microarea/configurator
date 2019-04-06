import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Industry',
    pure: false
})
export class IndustryPipe implements PipeTransform {
    transform(industries: string[], current: number): any {
        if (!industries || current == null) {
            return industries;
        }
        return industries.filter(ind => ind != industries[current]);
    }
}
