import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarrouselComponent } from '@products/components/product-carrousel/product-carrousel.component';
import { Product } from '@products/interfaces/product-response.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarrouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();
  fb = inject(FormBuilder);
  route = inject(Router);
  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    tags: [''],
    images: [[]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],

  });

  saved = signal(false);
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  productService = inject(ProductsService);
  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') })
  }

  onSizeClick(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes })
  }



  async onSubmit() {
    const isVaild = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isVaild) return;
    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any), tags: formValue.tags?.toLowerCase().split(',').map(tag => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      );
      this.route.navigate(['/admin/products', product.id]);

    } else {
     await firstValueFrom(this.productService.updateProduct(this.product().id, productLike));
    }

    this.saved.set(true);
    setTimeout(() => {
      this.saved.set(false);
    }, 3000);

  }
}
