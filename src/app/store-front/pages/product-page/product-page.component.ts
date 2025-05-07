import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { firstValueFrom, of } from 'rxjs';
import { ProductCarrouselComponent } from "../../../products/components/product-carrousel/product-carrousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarrouselComponent],
  templateUrl: './product-page.component.html',
  styles: ``
})
export class ProductPageComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  idSlug: string = this.activatedRoute.snapshot.params['idSlug'] || '';



  productService = inject(ProductsService);

  productResource = rxResource({
    request: () => ({ query: this.idSlug }),
    loader: ({ request }) => {
      const { query } = request;
      console.log(query);
      return this.productService.getProductsBySlug(query);
    }
  });

}
