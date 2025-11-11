
  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
//   scrolling animation in js
   window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.75) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
            });
        });
     document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        class CertificateSlider {
            constructor() {
                this.currentSlide = 0;
                this.totalSlides = document.querySelectorAll('.certificate-slide').length;
                this.isAutoPlay = true;
                this.autoPlayInterval = null;
                this.speed = 8000; // 3 seconds
                this.speedOptions = [2000, 3000, 4000, 5000]; // 2s, 3s, 4s, 5s
                this.currentSpeedIndex = 1;
                
                this.sliderTrack = document.getElementById('sliderTrack');
                this.dotsContainer = document.getElementById('dotsContainer');
                this.playPauseBtn = document.getElementById('playPauseBtn');
                this.progressFill = document.getElementById('progressFill');
                
                this.init();
            }

            init() {
                this.createDots();
                this.updateSlider();
                this.startAutoPlay();
                this.startProgressBar();
                
                // Add keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prevSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                    if (e.key === ' ') {
                        e.preventDefault();
                        this.toggleAutoPlay();
                    }
                });

                // Add touch/swipe support
                let startX = 0;
                let endX = 0;
                
                this.sliderTrack.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });
                
                this.sliderTrack.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    this.handleSwipe();
                });
                
                // Mouse drag support
                let isDragging = false;
                
                this.sliderTrack.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    this.sliderTrack.style.cursor = 'grabbing';
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                });
                
                document.addEventListener('mouseup', (e) => {
                    if (!isDragging) return;
                    isDragging = false;
                    endX = e.clientX;
                    this.sliderTrack.style.cursor = 'grab';
                    this.handleSwipe();
                });
            }

            handleSwipe() {
                const swipeThreshold = 50;
                const diff = startX - endX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }

            createDots() {
                this.dotsContainer.innerHTML = '';
                for (let i = 0; i < this.totalSlides; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => this.goToSlide(i));
                    this.dotsContainer.appendChild(dot);
                }
            }

            updateSlider() {
                const translateX = -this.currentSlide * 100;
                this.sliderTrack.style.transform = `translateX(${translateX}%)`;
                
                // Update dots
                document.querySelectorAll('.dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentSlide);
                });
                
                // Add loading effect
                this.sliderTrack.classList.add('loading');
                setTimeout(() => {
                    this.sliderTrack.classList.remove('loading');
                }, 300);
            }

            nextSlide() {
                this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
                this.updateSlider();
                this.resetProgressBar();
            }

            prevSlide() {
                this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
                this.updateSlider();
                this.resetProgressBar();
            }

            goToSlide(index) {
                this.currentSlide = index;
                this.updateSlider();
                this.resetProgressBar();
            }

            startAutoPlay() {
                if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
                if (this.isAutoPlay) {
                    this.autoPlayInterval = setInterval(() => {
                        this.nextSlide();
                    }, this.speed);
                }
            }

            stopAutoPlay() {
                if (this.autoPlayInterval) {
                    clearInterval(this.autoPlayInterval);
                    this.autoPlayInterval = null;
                }
            }

            toggleAutoPlay() {
                this.isAutoPlay = !this.isAutoPlay;
                this.playPauseBtn.textContent = this.isAutoPlay ? 'Pause Auto' : 'Play Auto';
                this.playPauseBtn.classList.toggle('active', !this.isAutoPlay);
                
                if (this.isAutoPlay) {
                    this.startAutoPlay();
                    this.startProgressBar();
                } else {
                    this.stopAutoPlay();
                    this.stopProgressBar();
                }
            }

            resetSlider() {
                this.currentSlide = 0;
                this.updateSlider();
                this.resetProgressBar();
            }

            changeSpeed() {
                this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speedOptions.length;
                this.speed = this.speedOptions[this.currentSpeedIndex];
                
                const speedBtn = document.querySelector('.control-btn:last-child');
                speedBtn.textContent = `Speed: ${this.speed / 1000}s`;
                
                if (this.isAutoPlay) {
                    this.startAutoPlay();
                    this.startProgressBar();
                }
            }

            startProgressBar() {
                if (this.progressInterval) clearInterval(this.progressInterval);
                if (!this.isAutoPlay) return;
                
                let progress = 0;
                const increment = 100 / (this.speed / 50); // Update every 50ms
                
                this.progressInterval = setInterval(() => {
                    progress += increment;
                    this.progressFill.style.width = `${progress}%`;
                    
                    if (progress >= 100) {
                        progress = 0;
                    }
                }, 50);
            }

            stopProgressBar() {
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                    this.progressInterval = null;
                }
            }

            resetProgressBar() {
                this.progressFill.style.width = '0%';
                if (this.isAutoPlay) {
                    this.startProgressBar();
                }
            }
        }

        // Initialize slider when page loads
        let slider;
        document.addEventListener('DOMContentLoaded', () => {
            slider = new CertificateSlider();
        });

        // Global functions for button clicks
        function nextSlide() {
            slider.nextSlide();
        }

        function prevSlide() {
            slider.prevSlide();
        }

        function toggleAutoPlay() {
            slider.toggleAutoPlay();
        }

        function resetSlider() {
            slider.resetSlider();
        }

        function changeSpeed() {
            slider.changeSpeed();
        }

        // Pause auto-play when user hovers over the slider
        document.addEventListener('DOMContentLoaded', () => {
            const sliderContainer = document.querySelector('.slider-container');
            
            sliderContainer.addEventListener('mouseenter', () => {
                if (slider && slider.isAutoPlay) {
                    slider.stopAutoPlay();
                    slider.stopProgressBar();
                }
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                if (slider && slider.isAutoPlay) {
                    slider.startAutoPlay();
                    slider.startProgressBar();
                }
            });
        });



// CV Download functionality
document.getElementById('downloadBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const pdfPath = './lasintha.pdf'; // CV file path
    downloadCVFromGitHub(pdfPath);
});

function downloadCVFromGitHub(pdfPath) {
    // Add loading state
    const downloadBtn = document.getElementById('downloadBtn');
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    downloadBtn.style.pointerEvents = 'none';
    
    // Method 1: Try direct download first
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Lasintha_Erandika_CV.pdf';
    link.target = '_blank';
    
    // Test if file exists first
    fetch(pdfPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // File exists, proceed with download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccessMessage('CV Download Started!');
            } else {
                throw new Error('PDF file not found');
            }
        })
        .catch(error => {
            console.log('Direct download failed, trying fetch method...');
            // Fallback: Use fetch method
            downloadCVWithFetch(pdfPath);
        })
        .finally(() => {
            // Restore button after a delay
            setTimeout(() => {
                downloadBtn.innerHTML = originalContent;
                downloadBtn.style.pointerEvents = 'auto';
            }, 2000);
        });
}

function downloadCVWithFetch(pdfPath) {
    fetch(pdfPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Lasintha_Erandika_CV.pdf';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(url);
            showSuccessMessage('CV Downloaded Successfully!');
        })
        .catch(error => {
            console.error('Download failed:', error);
            showSuccessMessage('PDF file not found. Please check the file path.', 'error');
            
            // Fallback: Try to open PDF in new tab
            window.open(pdfPath, '_blank');
        });
}

// Exam Results Download functionality (with different function names)
document.getElementById('downloadRBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const pdfPath = './Exam Results .pdf'; // Exam results file path
    downloadExamResults(pdfPath);
});

function downloadExamResults(pdfPath) {
    // Method 1: Direct download
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Exam_Results.pdf';
    link.target = '_blank';
    
    // Test if file exists
    fetch(pdfPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // File exists, download it
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Fallback: Use fetch method
                downloadExamResultsWithFetch(pdfPath);
            }
        })
        .catch(error => {
            // Fallback: Use fetch method
            downloadExamResultsWithFetch(pdfPath);
        });
}

function downloadExamResultsWithFetch(pdfPath) {
    fetch(pdfPath)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Exam_Results.pdf';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            // Final fallback: Open in new tab
            window.open(pdfPath, '_blank');
        });
}

// Success message function (shared by both)
function showSuccessMessage(message, type = 'success') {
    const successMsg = document.getElementById('successMessage');
    
    if (type === 'error') {
        successMsg.style.background = 'rgba(255, 0, 0, 0.9)';
        successMsg.textContent = '⚠️ ' + message;
    } else {
        successMsg.style.background = 'rgba(0, 255, 0, 0.9)';
        successMsg.textContent = '✅ ' + message;
    }
    
    successMsg.classList.add('show');
    
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 3000);
}

// Add click animation for CV download button
document.getElementById('downloadBtn').addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
});
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements on mobile devices
if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    document.querySelectorAll('.project-card, .certificate-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}



// Mobile Scroll Activation System
class MobileScrollActivator {
    constructor() {
        this.isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        this.observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        if (this.isMobile) {
            this.init();
        }
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('scroll-active');
                        this.activateElement(entry.target);
                    }, 100);
                }
            });
        }, this.observerOptions);

        this.startObserving();
    }

    startObserving() {
        setTimeout(() => {
            // Observe your existing elements
            document.querySelectorAll('.project-card').forEach(card => {
                this.observer.observe(card);
            });

            // document.querySelectorAll('.badge-wrapper').forEach(badge => {
            //     this.observer.observe(badge);
            // });

            document.querySelectorAll('.certificate-card, .certificate-slide').forEach(cert => {
                this.observer.observe(cert);
            });

            document.querySelectorAll('.timeline-item').forEach(item => {
                this.observer.observe(item);
            });
        }, 500);
    }

    activateElement(element) {
        if (element.classList.contains('project-card')) {
            // Add pulse effect to project cards
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'mobilePulse 2s ease-in-out';
            }, 10);
        }
    }
}

// Initialize the mobile activator
let mobileActivator;
document.addEventListener('DOMContentLoaded', function() {
    mobileActivator = new MobileScrollActivator();
});