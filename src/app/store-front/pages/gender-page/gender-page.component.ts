import { map } from 'rxjs';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
  styles: ``
})
export class GenderPageComponent {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  gender = toSignal(this.route.params.pipe(
    map(({ gender }) => gender),
  ));

  productResource = rxResource({
    request: () => ({ gender : this.gender()}),
    loader: ({request}) => {
      const {gender} = request;
      return this.productsService.getProducts({gender});
    },
  });

}
