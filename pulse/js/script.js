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

    // Modal

    $('[data-modal=consultation]').on('click', function() {
      $('.overlay, #consultation').fadeIn();
    });
    $('.modal__close').on('click', function() {
      $('.overlay, #consultation, #thanks, #order').fadeOut('slow');
    });

    $('.button-sm').each(function(i) {
      $(this).on('click', function (){
        $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
        $('.overlay, #order').fadeIn('slow');
      });
    });


    

    function validateForms(form){
      $(form).validate({
        rules: {
          name: {
            required: true,
            minlength: 2
          },
          phone: "required",
          email: {
            required: true,
            email: true
          }
        },
        
        messages: {
          name: {
            required: "Пожалуйста, введите свое имя",
            minlength: jQuery.validator.format("Введите {0} символов(а)")
          },
          phone: "Пожалуйста, введите свой номер телефона",
          email: {
            required: "Пожалуйста, введите свою почту",
            email: "Неправильно введен адрес почты"
          }
        }
      });
    }
    validateForms('#consultation-form');
    validateForms('#consultation form');
    validateForms('#order form');
    $('input[name=phone]').mask("+7 (999) 999-99-99");
    
    $('form').submit(function(e) {
      e.preventDefault();
      $.ajax({
        type:"POST",
        url: "js/mailer/smart.php",
        data: $(this).serialize()
      }).done(function() {
        $(this).find("input").val("");
        $('#consultation, #order').fadeOut();
        $('.overlay, #thanks').fadeIn('slow');

        $('form').trigger('reset');
      });
      return false;
    });
// smooth scroll

$(window).scroll(function() {
  if ($(this).scrollTop() > 1600) {
    $('.pageup').fadeIn();
  } else {
    $('.pageup').fadeOut();
  }
});

$("a[href=#up]").click(function () {
    var _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
    return false;
});
new WOW().init();
});