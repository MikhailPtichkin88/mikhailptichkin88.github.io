document.addEventListener('DOMContentLoaded', () => {

    //slider
    const sliderWrapper = document.querySelector('.products__slider'),
          sliderInner   = document.querySelector('.products__slider-inner'),
          slides        = document.querySelectorAll('.products__slider-item'),
          prevArrow     = document.createElement('button'),
          nextArrow     = document.createElement('button'),
          total         = document.querySelector('#total'),
          current       = document.querySelector('#current'),
          dots          = document.querySelectorAll('.products__slider-dot');
          

    let   widthStr    = window.getComputedStyle(sliderWrapper).width,
          width       = +widthStr.slice(0, widthStr.length - 2),
          offset      = 0,
          sliderIndex = 1;

   
    prevArrow.classList.add('slider-btn', 'slider__btn-left', 'disabled');
    prevArrow.innerHTML = '<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 9L9 17"/></svg>';
    sliderWrapper.append(prevArrow);

    nextArrow.classList.add('slider-btn', 'slider__btn-right');
    nextArrow.innerHTML = '<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 17L9 9L1 1"/></svg>';
    sliderWrapper.append(nextArrow);


    if(slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${sliderIndex}`;
    } else {
        total.textContent = `${slides.length}`;
        current.textContent = `${sliderIndex}`;
    }  

    sliderInner.style.width = 100 * slides.length + '%';
    sliderInner.style.display = 'flex';
    sliderInner.style.transition = 'all 0.5s';
 
    sliderWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = widthStr;
    });

    nextArrow.addEventListener('click', () => {
        if(offset == width * (slides.length-1)){
            nextArrow.classList.add('disabled');
        } else {
        prevArrow.classList.remove('disabled');   
        offset += width;
        sliderInner.style.transform = `translateX(-${offset}px)`;
        sliderIndex++;
            if(offset == width * (slides.length-1)){
                nextArrow.classList.add('disabled');
            }
        }

        if(slides.length < 10) {
            current.textContent = `0${sliderIndex}`;
        } else {
            current.textContent = `${sliderIndex}`;
        }
        dots.forEach(dot => {
            dot.classList.remove('products__slider-dot--active');
        });
        dots[sliderIndex - 1].classList.add('products__slider-dot--active');
    });

    prevArrow.addEventListener('click', () => {
        if(offset == 0){
            prevArrow.classList.add('disabled');
        } else {
            nextArrow.classList.remove('disabled');
            offset -= width;
            sliderInner.style.transform = `translateX(-${offset}px)`;
            sliderIndex--;
            if(offset == 0){
                prevArrow.classList.add('disabled');
            }
        }
        if(slides.length < 10) {
            current.textContent = `0${sliderIndex}`;
        } else {
            current.textContent = `${sliderIndex}`;
        }
        dots.forEach(dot => {
            dot.classList.remove('products__slider-dot--active');
        });
        dots[sliderIndex - 1].classList.add('products__slider-dot--active');
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            let slideTo = e.target.getAttribute('data-slide-to');
            sliderIndex = slideTo;
            offset = width * (slideTo - 1);
            sliderInner.style.transform = `translateX(-${offset}px)`;

            if(slides.length < 10) {
                current.textContent = `0${slideTo}`;
            } else {
                current.textContent = `${slideTo}`;
            }

            dots.forEach(dot => {
                dot.classList.remove('products__slider-dot--active');
            });
            dots[slideTo - 1].classList.add('products__slider-dot--active');

            if(offset == 0){
                prevArrow.classList.add('disabled');
                nextArrow.classList.remove('disabled');
            } else if (offset == width * (slides.length-1)){
                nextArrow.classList.add('disabled');  
                prevArrow.classList.remove('disabled');  
            } else {
                prevArrow.classList.remove('disabled'); 
                nextArrow.classList.remove('disabled');
            }
        });
    });



//accordion
const questionTitle = document.querySelectorAll('.questions__item-title'),
      questionItem = document.querySelectorAll('.questions__item');

      questionTitle.forEach(item => {
          item.addEventListener('click', function (e)  {
            questionItem.forEach(title => {
              title.classList.remove('questions__item--active');
            });
            e.target.parentElement.classList.add('questions__item--active');
          });
      });
    
// Page scroll
new fullpage('#fullpage', {
    menu: '#header__nav',
    anchors: ['top', 'products', 'benefits', 'specification', 'questions', 'contacts'],
    sectionSelector: '.page-section',
    scrollOverflow: true
    
});

// Menu button humburger
const menuBtn = document.querySelector('.menu__btn'),
      menuList = document.querySelector('.menu__list'),  
      menuLinks = document.querySelectorAll('.menu__list-link');  

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('menu__btn--active');
    menuList.classList.toggle('menu__list--active');
});  

menuLinks.forEach(item => {
    item.addEventListener('click', () => {
        menuBtn.classList.remove('menu__btn--active');
        menuList.classList.remove('menu__list--active');
    });    
});       
     
});