'use strict';
document.addEventListener('DOMContentLoaded', () => {


    // tabs

    const tabs        = document.querySelectorAll('.tabheader__item'),
          tabsParent  = document.querySelector('.tabheader__items'),
          tabsContent = document.querySelectorAll('.tabcontent');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
       tabsContent[i].classList.add('show', 'fade');
       tabsContent[i].classList.remove('hide');
       tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        
        const target = event.target;
       
        if (target && target.classList.contains('tabheader__item')) {
            
            tabs.forEach((item, i) => {
                
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }     
    });
 

    //timer

    const deadline = '2022-03-23';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());
        const days    = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours   = Math.floor((t / 1000 / 60 / 60) % 24),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        }else {
            return num;
        }
    }

    function setClock (selector, endtime) {

        const timer   = document.querySelector(selector),
              days    = timer.querySelector('#days'),
              hours   = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds');

        const timeInterval = setInterval(updateClock, 1000);

        updateClock();

    function updateClock () {

        const t = getTimeRemaining(endtime);

            days.innerHTML    = getZero(t.days);
            hours.innerHTML   = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);


    // modal 
    const modalTrigger = document.querySelectorAll('[data-modal]');
    
    const modal = document.querySelector('.modal');
    
    modalTrigger.forEach(item => {
        item.addEventListener('click', openModal);
    });

    function closeModal () {
        modal.classList.add('hide');
        modal.classList.remove('show', 'fade');
        document.body.style.overflow = "";
    }
    function openModal () {
        modal.classList.add('show', 'fade');
        modal.classList.remove('hide');
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }   

    modal.addEventListener('click', event => {
        if(event.target === modal || event.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

     const modalTimerId = setTimeout(openModal, 50000);

     function showModalByScroll() {
         if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
             openModal();
             window.removeEventListener('scroll', showModalByScroll);
         }
     }

     window.addEventListener('scroll', showModalByScroll);


     // class

     const parent = document.querySelector(".menu__field .container"); 

     class MenuItem {
         constructor (src, alt, subtitle, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.classes = classes;
            this.price = price;
            this.calcPrice();
            this.parent = document.querySelector(parentSelector);
         }
         calcPrice() {
           this.price = this.price * 75;
         }
         build() {
             const div = document.createElement('div');

         
             this.classes.forEach(className => div.classList.add(className));
            if (!div.classList.contains('menu__item')) {
                this.div = 'menu__item';
                div.classList.add(this.div);
            }


             div.innerHTML = `<img src=${this.src} alt=${this.alt}>
             <h3 class="menu__item-subtitle">${this.subtitle}</h3>
             <div class="menu__item-descr">${this.descr}</div>
             <div class="menu__item-divider"></div>
             <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                 <div class="menu__item-total">
                    <span>${this.price}</span> руб/день
                </div>
             </div>`;
             this.parent.append(div);
         }
     }

     const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetc ${url}, status: ${res.status}`);
        }
        return res.json();
    };
    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuItem(img, altimg, title, descr, price, '.menu .container').build();
            });
        });
 

 
    //  Fetch

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/modal/spinner.svg',
        succes: 'Спасибо! Мы свяжемся с вами позже',
        failure: 'Произошла ошибка'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
        });
        return await res.json();
    };

    function bindPostData (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 10px auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));           
        
            postData(' http://localhost:3000/requests', json )
              .then(data => {
                console.log(data);
                showThanksMessage(message.succes);
                statusMessage.remove();
            }).catch(() => {
                showThanksMessage(message.failure);
            }).finally(() => {
                form.reset();
            });
   
        });
    }

    function showThanksMessage (message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        prevModalDialog.classList.remove('show');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div data-close="" class="modal__close">×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout( () => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));


// slider carousel

    const slides      = document.querySelectorAll('.offer__slide'),
        prev          = document.querySelector('.offer__slider-prev'),
        next          = document.querySelector('.offer__slider-next'),
        total         = document.querySelector('#total'),
        current       = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField   = document.querySelector('.offer__slider-inner'),
        widthStr      = window.getComputedStyle(slidesWrapper).width,   // "650px"
        width         = +widthStr.replace(/\D/g, '');           //650
   
    let sliderIndex = 1;
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${sliderIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = sliderIndex;
    }

        slidesField.style.width = 100 * slides.length + '%';
        slidesField.style.display = "flex";
        slidesField.style.transition = "0.5s all";

        slidesWrapper.style.overflow = 'hidden';

        slides.forEach(slide => {
            slide.style.width = widthStr;
        });    

        function moveCurrent (index) {
            if (slides.length < 10) {
                current.textContent = `0${index}`;
            } else {
                current.textContent = index;
            }
        }

        function moveDot (array, index) {
            array.forEach(dot => dot.style.opacity = '.5');
            array[index - 1].style.opacity = 1;
        }

    next.addEventListener('click', () => {

        if (offset == width * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += width;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
       
        if (sliderIndex == slides.length) {
            sliderIndex = 1;
        } else {
            sliderIndex++;
        }
        moveCurrent(sliderIndex);
        moveDot(dotsArr, sliderIndex);    
        });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = width * (slides.length - 1);
        } else {
            offset -= width;
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex == 1) {
            sliderIndex = slides.length;
        } else {
            sliderIndex--;
        }
        moveCurrent(sliderIndex);
        moveDot(dotsArr, sliderIndex);
        });

 // dots for slider

    const slider = document.querySelector('.offer__slider');

    slider.style.position = "relative";
    
    const dots = document.createElement('ol');
    const dotsArr = [];

    dots.classList.add('carousel-dots');
    dots.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(dots);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        dots.append(dot);
        dotsArr.push(dot);
    }
    
    dotsArr.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');
            sliderIndex = slideTo;
            offset = width * (slideTo - 1);
            slidesField.style.transform = `translateX(-${offset}px)`;

            moveCurrent(sliderIndex);
            moveDot(dotsArr, sliderIndex);

        });
    });

    // calc

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age,  ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function calcTotal () {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = "____";
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent =  Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function initLocalSettings (selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
                
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }
              

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '2px solid red';
            } else {
                input.style.border = 'none';
            }
            
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age    = +input.value;
                    break;
            }
        calcTotal();
        });
        
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});