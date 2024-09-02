import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filteruser'
})
export class FilteruserPipe implements PipeTransform {

  transform(array:any[], keyword:string ):any[] {
    if(keyword || keyword == ''){
      return array;
    }
    return array.filter(user=>{
      return user.contact_name.toLowerCase().includes(keyword.toLowerCase()) || 
      user.email.toLowerCase().includes(keyword.toLowerCase())
    })
   
  }

}
