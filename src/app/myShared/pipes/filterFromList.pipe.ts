import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchpipe'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
debugger
    if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase();

    return value.filter(function(item){
        return item.RefDescription.startsWith(args);
    });
}

}