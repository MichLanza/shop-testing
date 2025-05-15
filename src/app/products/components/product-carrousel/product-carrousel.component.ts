import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import 'swiper/css';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';


@Component({
  selector: 'product-carrousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carrousel.component.html',
  styles: `
  .swiper {
  width: 100%;
  height: 500px;
}
`
})
export class ProductCarrouselComponent implements AfterViewInit, OnChanges {


  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  images = input.required<string[]>();
   swiper : Swiper | undefined = undefined;
  ngAfterViewInit(): void {
    this.swiperInit();
  }


  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;


    this.swiper = new Swiper(element, {
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation, Pagination
      ],
      pagination: {
        el: '.swiper-pagination',
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) return;
    if (!this.swiper) return;

    this.swiper.destroy(true,true);

    const paginationEl: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 100);

  }




}
