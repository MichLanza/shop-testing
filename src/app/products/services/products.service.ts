import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product-response.interface';
import { environment } from 'src/environments/environment';
import { User } from '@auth/interfaces/user.interface';


const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Unisex,
  tags: [],
  images: [],
  user: {} as User
};

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }
    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender,
      }
    })
      .pipe(
        tap(resp => console.log(resp)),
        tap(resp => this.productsCache.set(key, resp)),
      );
  }
  getProductsBySlug(idSlug: string): Observable<Product> {
    const key = idSlug;
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(
        tap(resp => console.log(resp)),
        tap(resp => this.productCache.set(key, resp)),
      );
  }
  getProductsById(id: string): Observable<Product> {

    if (id === 'new') {
      return of(emptyProduct);
    }

    const key = id;
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
      .pipe(
        tap(resp => console.log(resp)),
        tap(resp => this.productCache.set(key, resp)),
      );
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList | undefined): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList)
      .pipe(
        map((imageNames) => ({
          ...productLike,
          images: [...currentImages, ...imageNames],
        })),
        switchMap((updatedProduct) =>
          this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product)),
      );


    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    //   .pipe(
    //     tap((product) => this.updateProductCache(product)),
    //   );

  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map(currentProduct => {
        return currentProduct.id === productId ? product : currentProduct;
      })

    });

  }


  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList)
      .pipe(
        map((imageNames) => ({
          ...productLike,
          images: [...currentImages, ...imageNames],
        })),
        switchMap((createProduct) =>
          this.http.post<Product>(`${baseUrl}/products`, createProduct)
        ),
        tap((product) => this.updateProductCache(product)),
      );
    // return this.http.post<Product>(`${baseUrl}/products`, productLike)
    //   .pipe(
    //     tap((product) => this.updateProductCache(product)),
    //   );

  }


  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables).pipe(
      tap((imagesNames) => {
        console.log(imagesNames);
      }),
    );

  }

  uploadImage(imageFile: File): Observable<string> {

    const fromData = new FormData();
    fromData.append('file', imageFile);
    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, fromData)
      .pipe(
        map(resp => resp.fileName)
      );

  }




}
