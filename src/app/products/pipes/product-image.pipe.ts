import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): any {

    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    const img = value.at(0);

    if (!img) {
      return './assets/imgs/placeholder.png';
    }


    return `${baseUrl}/files/product/${img}`;

  }
}
