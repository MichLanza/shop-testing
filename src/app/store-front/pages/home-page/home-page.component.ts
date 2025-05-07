import { Component, inject } from '@angular/core';
import {rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
  styles: ``
})
export class HomePageComponent {

  productsService = inject(ProductsService);


  productResource = rxResource({
    request: () => ({}),
    loader: ({request}) => {
      return this.productsService.getProducts({});
    },
  });

}
