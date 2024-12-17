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


document.addEventListener('DOMContentLoaded', () => {
    const letter2Trigger = document.getElementById('letter2-trigger');
    const mailModal = document.getElementById('mail-modal');
    const mailPages = mailModal.querySelectorAll('.mail-modal-content');
    const mailDots = mailModal.querySelectorAll('.mail-dot');
    const closeBtns = mailModal.querySelectorAll('.close-btn');
    
    let currentPageIndex = 0;
    let startX = 0;
    let isDragging = false;
    let modalWidth = 0;

    // letter2 이미지 클릭 시 모달 열기
    letter2Trigger.addEventListener('click', () => {
        mailModal.style.display = 'flex';
        modalWidth = mailPages[0].offsetWidth;
        
        // 초기 상태로 리셋
        mailPages.forEach((page, index) => {
            if (index === 0) {
                page.style.transform = 'translateX(0)';
                page.style.display = 'block';
            } else {
                page.style.transform = 'translateX(100%)';
                page.style.display = 'none';
            }
        });

        mailDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });

        currentPageIndex = 0;
    });

    // 닫기 버튼 클릭 시 모달 닫기
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mailModal.style.display = 'none';
        });
    });

    // 모달 외부 클릭 시 닫기
    mailModal.addEventListener('click', (e) => {
        if (e.target === mailModal) {
            mailModal.style.display = 'none';
        }
    });

    // 페이지네이션 닷 클릭 이벤트
    mailDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // 현재 페이지와 클릭된 페이지가 다를 때만 처리
            if (currentPageIndex !== index) {
                // 현재 페이지 숨기기
                mailPages[currentPageIndex].style.transform = index > currentPageIndex 
                    ? 'translateX(-100%)' 
                    : 'translateX(100%)';
                mailPages[currentPageIndex].style.display = 'none';

                // 새 페이지 표시
                mailPages[index].style.transform = 'translateX(0)';
                mailPages[index].style.display = 'block';

                // 닷 활성화 표시 변경
                mailDots[currentPageIndex].classList.remove('active');
                mailDots[index].classList.add('active');

                currentPageIndex = index;
            }
        });
    });

    // 터치/마우스 시작
    mailModal.addEventListener('mousedown', startDragging);
    mailModal.addEventListener('touchstart', startDragging);

    // 터치/마우스 이동
    mailModal.addEventListener('mousemove', drag);
    mailModal.addEventListener('touchmove', drag);

    // 터치/마우스 종료
    mailModal.addEventListener('mouseup', endDragging);
    mailModal.addEventListener('mouseleave', endDragging);
    mailModal.addEventListener('touchend', endDragging);

    function startDragging(e) {
        // 닫기 버튼 제외
        if (e.target.classList.contains('close-btn')) return;

        isDragging = true;
        startX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
    }

    function drag(e) {
        if (!isDragging) return;

        const currentX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX);
        const diffX = currentX - startX;

        // 현재 페이지와 다음/이전 페이지 transform 조정
        mailPages[currentPageIndex].style.transform = `translateX(${diffX}px)`;
        
        if (diffX > 0 && currentPageIndex > 0) {
            mailPages[currentPageIndex - 1].style.transform = `translateX(${diffX - modalWidth}px)`;
            mailPages[currentPageIndex - 1].style.display = 'block';
        } else if (diffX < 0 && currentPageIndex < mailPages.length - 1) {
            mailPages[currentPageIndex + 1].style.transform = `translateX(${modalWidth + diffX}px)`;
            mailPages[currentPageIndex + 1].style.display = 'block';
        }
    }

    function endDragging(e) {
        if (!isDragging) return;
        isDragging = false;

        const currentX = (e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX);
        const diffX = currentX - startX;
        const swipeThreshold = modalWidth * 0.3; // 30% 스와이프 시 페이지 전환

        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0 && currentPageIndex > 0) {
                // 왼쪽으로 스와이프 (이전 페이지)
                mailPages[currentPageIndex].style.transform = 'translateX(100%)';
                mailPages[currentPageIndex].style.display = 'none';
                mailPages[currentPageIndex - 1].style.transform = 'translateX(0)';
                mailPages[currentPageIndex - 1].style.display = 'block';
                
                mailDots[currentPageIndex].classList.remove('active');
                mailDots[currentPageIndex - 1].classList.add('active');
                
                currentPageIndex--;
            } else if (diffX < 0 && currentPageIndex < mailPages.length - 1) {
                // 오른쪽으로 스와이프 (다음 페이지)
                mailPages[currentPageIndex].style.transform = 'translateX(-100%)';
                mailPages[currentPageIndex].style.display = 'none';
                mailPages[currentPageIndex + 1].style.transform = 'translateX(0)';
                mailPages[currentPageIndex + 1].style.display = 'block';
                
                mailDots[currentPageIndex].classList.remove('active');
                mailDots[currentPageIndex + 1].classList.add('active');
                
                currentPageIndex++;
            }
        } else {
            // 페이지 복귀
            mailPages[currentPageIndex].style.transform = 'translateX(0)';
            
            if (currentPageIndex > 0) {
                mailPages[currentPageIndex - 1].style.transform = 'translateX(-100%)';
                mailPages[currentPageIndex - 1].style.display = 'none';
            }
            
            if (currentPageIndex < mailPages.length - 1) {
                mailPages[currentPageIndex + 1].style.transform = 'translateX(100%)';
                mailPages[currentPageIndex + 1].style.display = 'none';
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mailLetterBtns = document.querySelectorAll('.mail-letter-btn');
    const letterContentModal = document.getElementById('letter-content-modal');
    const letterContentImg = letterContentModal.querySelector('.letter-content-img');
    const letterContentCloseBtns = letterContentModal.querySelectorAll('.letter-content-close-btn');

    mailLetterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const letterNumber = btn.getAttribute('data-number');
            
            // 이미지 설정
            letterContentImg.src = `/img/letter/context/letter-context${letterNumber}.png`;
            
            // 닫기 버튼 처리
            letterContentCloseBtns.forEach(closeBtn => closeBtn.style.display = 'none');
            const correspondingCloseBtn = letterContentModal.querySelector(`.letter-content-close-btn${letterNumber}`);
            if (correspondingCloseBtn) {
                correspondingCloseBtn.style.display = 'block';
            }
            
            letterContentModal.style.display = 'flex';
        });
    });

    letterContentCloseBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            letterContentModal.style.display = 'none';
        });
    });

    letterContentModal.addEventListener('click', (e) => {
        if (e.target === letterContentModal) {
            letterContentModal.style.display = 'none';
        }
    });
});