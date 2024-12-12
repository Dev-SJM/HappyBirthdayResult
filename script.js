const slider = document.querySelector('.slider');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let isTransitioning = false;

function updateSlider() {
    slides.forEach((slide, index) => {
        const offset = (index - currentIndex + slides.length) % slides.length;
        
        slide.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
        slide.style.transform = `
            translateX(${offset === 0 ? 0 : offset === 1 ? 80 : -80}%)
            scale(${offset === 0 ? 1 : 0.9})
        `;
        slide.style.opacity = offset === 0 ? 1 : 0.3;  // 투명도를 0.5에서 0.3으로 변경
        slide.style.zIndex = offset === 0 ? 1 : 0;
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function handleSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    updateSlider();

    setTimeout(() => {
        isTransitioning = false;
    }, 700);
}

// 버튼 클릭 이벤트
document.querySelector('.prev').addEventListener('click', () => handleSlide(-1));
document.querySelector('.next').addEventListener('click', () => handleSlide(1));

// 도트 클릭 이벤트
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isTransitioning) return;
        const direction = index - currentIndex;
        handleSlide(direction);
    });
});

// 초기 상태 설정
updateSlider();