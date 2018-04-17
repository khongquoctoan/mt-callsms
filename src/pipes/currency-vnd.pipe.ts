import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyVnd'
})
export class CurrencyVndPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return parseFloat(value).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
}
