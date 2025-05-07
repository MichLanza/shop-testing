import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import 'swiper/css';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';


@Component({
  selector: 'product-carrousel',
  imports: [ ProductImagePipe],
  templateUrl: './product-carrousel.component.html',
  styles: `
  .swiper {
  width: 100%;
  height: 500px;
}
`
})
export class ProductCarrouselComponent implements AfterViewInit {


  swiperDiv = viewChild.required<ElementRef>('swiperDiv')
  images = input.required<string[]>();

  ngAfterViewInit(): void {

    const element = this.swiperDiv().nativeElement;
    if (!element) return;


    const swiper = new Swiper(element, {
      direction: 'horizontal',
      loop: true,

      modules:[
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
}
