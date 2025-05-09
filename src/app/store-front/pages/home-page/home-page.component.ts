import { Component, inject } from '@angular/core';
import {rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styles: ``
})
export class HomePageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);


  productResource = rxResource({
    request: () => ({page: this.paginationService.currentPage()}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: (request.page -1)* 9,
      });
    },
  });

}
