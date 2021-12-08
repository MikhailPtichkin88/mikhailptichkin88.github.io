$(document).ready(function(){
    $('.carousel__inner').slick({
        
        speed: 500,
        slidesToShow: 1,
        // adaptiveHeight: true, 
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/slick-left.png" alt="#"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/slick-right.png" alt="#"></button>',
        responsive: [ {
            breakpoint: 992,
            settings: {
              dots: true,
              arrows: false,
              dotsClass: "carousel__dots",
              appendDots: '.dots-toolbar'
            }
        }
      ]
    });

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab-active)', function() {
      $(this)
        .addClass('catalog__tab-active').siblings().removeClass('catalog__tab-active')
        .closest('div.container').find('div.catalog__inner').removeClass('catalog__inner_active').eq($(this).index()).addClass('catalog__inner_active');
    });

    // $(".catalog-item__link").each(function(i) {
    //   $(this).on("click", function(e) {
    //     e.preventDefault();
    //     $(".catalog-item__content").eq(i).toggleClass("catalog-item__content_active");
    //     $(".catalog-item__list").eq(i).toggleClass("catalog-item__list_active")
    //   })
    // })

    // $(".catalog-item__back").each(function(i) {
    //   $(this).on("click", function(e) {
    //     e.preventDefault();
    //     $(".catalog-item__content").eq(i).toggleClass("catalog-item__content_active");
    //     $(".catalog-item__list").eq(i).toggleClass("catalog-item__list_active")
    //   })
    // })
    function toggleSlide(item) {
      $(item).each(function(i) {
        $(this).on("click", function(e) {
          e.preventDefault();
          $(".catalog-item__content").eq(i).toggleClass("catalog-item__content_active");
          $(".catalog-item__list").eq(i).toggleClass("catalog-item__list_active");
        });
      });
    }
    toggleSlide(".catalog-item__link");
    toggleSlide(".catalog-item__back");
  });