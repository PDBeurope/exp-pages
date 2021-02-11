import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'keysPipe'})
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        const keysAndValues = [];
        if (!value) {
            return keysAndValues;
        }
        const keyItems = Object.keys(value);
        if (keyItems) {
            for (let i = 0; i < keyItems.length; i++) {
                keysAndValues.push({key: keyItems[i], value: value[keyItems[i]]});
            }
        }
        return keysAndValues;
    }
}
