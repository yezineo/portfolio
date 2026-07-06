// 햄버거 메뉴
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open');
});

// 기타농산물 - 슬라이더
const swiper = new Swiper('.g-slider', {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
        768: {
            slidesPerView: 4,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 5,
            spaceBetween: 30,
        },
    },
    pagination: {
        el: '.products-grid .swiper-pagination',
    },
    navigation: {
         nextEl: '.progrid-wrap .swiper-button-next',
         prevEl: '.progrid-wrap .swiper-button-prev',
    },
});

// 리뷰 섹션 - 슬라이더
const reviewSwiper = new Swiper('.r-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 4000,                      // 4초마다 넘김
        disableOnInteraction: false,      // 조작해도 자동재생 유지
        pauseOnMouseEnter: true,          // 마우스 올리면 멈춤
    },
    pagination: {
        el: '.review-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.review-wrap-next',
        prevEl: '.review-wrap-prev',
    },
});

// aos 스크립트 라이브러리
AOS.init({
    duration: 1000,
    delay: 200
});
