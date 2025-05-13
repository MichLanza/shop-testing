import { Component, inject, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsTableComponent } from '@products/components/products-table/products-table.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {



  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  productLimit = signal(10);
  productResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage(),
      limit: this.productLimit(),
    }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: (request.page - 1) * 9,
        limit: request.limit,
      });
    },
  });

}
