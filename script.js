const slider = document.querySelector('.slider');
const slides = Array.from(document.querySelectorAll('.slide'));
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let isTransitioning = false;

function updateSlider() {
    slides.forEach((slide, index) => {
        const cardOverlay = slide.querySelector('.card-overlay');
        const offset = (index - currentIndex + slides.length) % slides.length;
        
        slide.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
        
        if (offset === 0) {
            // 현재 슬라이드
            slide.style.transform = 'translateX(0%) scale(1)';
            slide.style.opacity = 1;
            slide.style.zIndex = 2;
            cardOverlay.style.opacity = 1;
        } else if (offset === 1) {
            // 오른쪽 슬라이드
            slide.style.transform = 'translateX(60%) scale(0.9)';
            slide.style.opacity = 0.5;
            slide.style.zIndex = 1;
            cardOverlay.style.opacity = 0;
        } else if (offset === slides.length - 1) {
            // 왼쪽 슬라이드
            slide.style.transform = 'translateX(-60%) scale(0.9)';
            slide.style.opacity = 0.5;
            slide.style.zIndex = 1;
            cardOverlay.style.opacity = 0;
        } else {
            // 다른 슬라이드들
            slide.style.transform = `translateX(${offset > 1 ? 100 : -100}%) scale(0.8)`;
            slide.style.opacity = 0;
            slide.style.zIndex = 0;
            cardOverlay.style.opacity = 0;
        }
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

document.addEventListener('DOMContentLoaded', () => {
    const tvThumbnail = document.getElementById('tv-thumbnail');
    const videoModal = document.getElementById('video-modal');
    const videoElement = videoModal.querySelector('video');
    const closeBtn = videoModal.querySelector('.close-btn');

    // TV 이미지 클릭 시 모달 열기
    tvThumbnail.addEventListener('click', () => {
        videoModal.style.display = 'flex';
        videoElement.play();
    });

    // 닫기 버튼 클릭 시 모달 닫기
    closeBtn.addEventListener('click', () => {
        videoModal.style.display = 'none';
        videoElement.pause();
        videoElement.currentTime = 0;
    });

    // 모달 외부 클릭 시 닫기
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            videoElement.pause();
            videoElement.currentTime = 0;
        }
    });
});