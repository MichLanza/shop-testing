import { map } from 'rxjs';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styles: ``
})
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  gender = toSignal(this.route.params.pipe(
    map(({ gender }) => gender),
  ));

  paginationService = inject(PaginationService);

  productResource = rxResource({
    request: () => ({
      gender : this.gender(),
      page : this.paginationService.currentPage()
    }),
    loader: ({request}) => {
      const {gender , page} = request;
      return this.productsService.getProducts({gender,  offset: (page -1)* 9,});
    },
  });
}
