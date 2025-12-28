// Scrolling animation in JS
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize sections with fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Initialize skill cards with alternating side positions
    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.opacity = '0';
        if (index % 2 === 0) {
            card.style.transform = 'translateX(-100px)';
        } else {
            card.style.transform = 'translateX(100px)';
        }
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
});

// Scroll event listener for animations
window.addEventListener('scroll', () => {
    // Animate sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });

    // Animate skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
            card.style.transitionDelay = `${index * 0.1}s`;
        }
    });
});

// Certificate Slider Class
class CertificateSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.certificate-slide').length;
        this.isAutoPlay = true;
        this.autoPlayInterval = null;
        this.progressInterval = null;
        this.speed = 3000;
        this.speedOptions = [2000, 3000, 4000, 5000];
        this.currentSpeedIndex = 1;
        
        this.sliderTrack = document.getElementById('sliderTrack');
        this.certificatepreview = document.getElementById('certificatepreview');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progressFill = document.getElementById('progressFill');
        
        if (this.totalSlides > 0) {
            this.init();
        }
    }

    init() {
        this.createPreviewThumbnails();
        this.updateSlider();
        this.startAutoPlay();
        this.startProgressBar();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.sliderTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
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
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
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

    createPreviewThumbnails() {
        this.certificatepreview.innerHTML = '';
        const slides = document.querySelectorAll('.certificate-slide');
        
        slides.forEach((slide, index) => {
            const certCard = slide.querySelector('.certificate-card');
            const img = certCard.querySelector('.certificate-img');
            const imgSrc = img ? img.src : '';
            const titleElement = certCard.querySelector('.certificate-title');
            const title = titleElement ? titleElement.textContent : 'Certificate';
            
            const preview = document.createElement('div');
            preview.className = 'preview-thumbnail';
            if (index === 0) preview.classList.add('active');
            
            preview.innerHTML = `
                <img src="${imgSrc}" alt="${title}" class="preview-img">
                <div class="preview-overlay">
                    <span class="preview-title">${title}</span>
                </div>
            `;
            
            preview.addEventListener('click', () => this.goToSlide(index));
            this.certificatepreview.appendChild(preview);
        });
    }

    updateSlider() {
        const translateX = -this.currentSlide * 100;
        this.sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update preview thumbnails
        document.querySelectorAll('.preview-thumbnail').forEach((preview, index) => {
            preview.classList.toggle('active', index === this.currentSlide);
        });
        
        // Scroll active preview into view only if certificate section is visible
        const activePreview = document.querySelector('.preview-thumbnail.active');
        const certificateSection = document.getElementById('certificate');
        
        if (activePreview && certificateSection) {
            const rect = certificateSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            // Only scroll the thumbnail preview into view, not the page
            if (isVisible) {
                const previewContainer = this.certificatepreview;
                const previewRect = activePreview.getBoundingClientRect();
                const containerRect = previewContainer.getBoundingClientRect();
                
                // Scroll within the preview container only
                if (previewRect.left < containerRect.left || previewRect.right > containerRect.right) {
                    activePreview.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        }
        
        // Loading effect
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
        if (this.playPauseBtn) {
            this.playPauseBtn.textContent = this.isAutoPlay ? 'Pause Auto' : 'Play Auto';
            this.playPauseBtn.classList.toggle('active', !this.isAutoPlay);
        }
        
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
        if (speedBtn) {
            speedBtn.textContent = `Speed: ${this.speed / 1000}s`;
        }
        
        if (this.isAutoPlay) {
            this.startAutoPlay();
            this.startProgressBar();
        }
    }

    startProgressBar() {
        if (this.progressInterval) clearInterval(this.progressInterval);
        if (!this.isAutoPlay || !this.progressFill) return;
        
        let progress = 0;
        const increment = 100 / (this.speed / 50);
        
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
        if (this.progressFill) {
            this.progressFill.style.width = '0%';
        }
        if (this.isAutoPlay) {
            this.startProgressBar();
        }
    }
}

// Initialize slider when page loads
let slider;
document.addEventListener('DOMContentLoaded', () => {
    slider = new CertificateSlider();
    
    // Pause auto-play when hovering over slider
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer && slider) {
        sliderContainer.addEventListener('mouseenter', () => {
            if (slider.isAutoPlay) {
                slider.stopAutoPlay();
                slider.stopProgressBar();
            }
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            if (slider.isAutoPlay) {
                slider.startAutoPlay();
                slider.startProgressBar();
            }
        });
    }
});

// Global functions for button clicks
function nextSlide() {
    if (slider) slider.nextSlide();
}

function prevSlide() {
    if (slider) slider.prevSlide();
}

function toggleAutoPlay() {
    if (slider) slider.toggleAutoPlay();
}

function resetSlider() {
    if (slider) slider.resetSlider();
}

function changeSpeed() {
    if (slider) slider.changeSpeed();
}

// CV Download functionality
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfPath = './Lasintha_Erandika_CV.pdf';
            downloadCVWithFetch(pdfPath);
        });
        
        // Add click animation
        downloadBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
});

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
            
            window.URL.revokeObjectURL(url);
            showSuccessMessage('CV Downloaded Successfully!');
        })
        .catch(error => {
            console.error('Download failed:', error);
            showSuccessMessage('Something is wrong, we will fix this immediately.', 'error');
            window.open(pdfPath, '_blank');
        });
}

// Exam Results Download functionality
document.addEventListener('DOMContentLoaded', () => {
    const downloadRBtn = document.getElementById('downloadRBtn');
    if (downloadRBtn) {
        downloadRBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const pdfPath = './Exam Results .pdf';
            downloadExamResults(pdfPath);
        });
    }
});

function downloadExamResults(pdfPath) {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Exam_Results.pdf';
    link.target = '_blank';
    
    fetch(pdfPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccessMessage('Exam Results Downloaded Successfully!');
            } else {
                downloadExamResultsWithFetch(pdfPath);
            }
        })
        .catch(() => {
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
            
            window.URL.revokeObjectURL(url);
            showSuccessMessage('Exam Results Downloaded Successfully!');
        })
        .catch(() => {
            window.open(pdfPath, '_blank');
        });
}

// Success message function
function showSuccessMessage(message, type = 'success') {
    const successMsg = document.getElementById('successMessage');
    if (!successMsg) return;
    
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

// Intersection Observer for mobile devices
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
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.project-card, .certificate-card, .badge-wrapper, .timeline-item').forEach(el => {
            observer.observe(el);
        });
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
            document.querySelectorAll('.skill-card').forEach(card => {
                this.observer.observe(card);
            });

            document.querySelectorAll('.certificate-card, .certificate-slide').forEach(cert => {
                this.observer.observe(cert);
            });

            document.querySelectorAll('.timeline-item').forEach(item => {
                this.observer.observe(item);
            });
        }, 500);
    }

    activateElement(element) {
        if (element.classList.contains('skill-card')) {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'mobilePulse 2s ease-in-out';
            }, 10);
        }
    }
}

// Initialize the mobile activator
let mobileActivator;
document.addEventListener('DOMContentLoaded', () => {
    mobileActivator = new MobileScrollActivator();
});



const badges = [
    "./badges/ccna badge.png",
    "./badges/ccna-switching-routing-and-wireless-essentials.1 (1).png",
    "./badges/computer-hardware-basics (1).png",
    "./badges/english-for-it-1 (1).png",
    "./badges/english-for-it-2 (1).png",
    "./badges/introduction-to-iot (1).png",
    "./badges/javascript-essentials-1.png",
    "./badges/networking-basics.png",
    "./badges/python-essentials-1.1 (1).png",
    "./badges/python-essentials-2 (1).png"
];

let autoplay = [];

function createSliders() {
    const container = document.getElementById("badge-sliders-container");
    container.innerHTML = "";
    autoplay.forEach(clearInterval);
    autoplay = [];

    const isMobile = window.innerWidth < 480;
    const sliders = isMobile ? 2 : 4;
    const perSlider = isMobile ? 5 : 3;
    const perSlide = isMobile ? 2 : 1;

    for (let s = 0; s < sliders; s++) {
        const start = s * perSlider;
        const imgs = badges.slice(start, start + perSlider);

        const wrapper = document.createElement("div");
        wrapper.className = "badge-slider-wrapper1";

        const slides = Math.ceil(imgs.length / perSlide);

        wrapper.innerHTML = `
            <div class="badge-slider-container">
                <div class="badge-slider-track" data-slider="${s}">
                    ${Array.from({ length: slides }, (_, i) => {
                        const chunk = imgs.slice(i * perSlide, i * perSlide + perSlide);
                        return `
                            <div class="badge-slide">
                                ${chunk.map(src => `
                                    <div class="badge-image-card">
                                        <img src="${src}" loading="lazy">
                                    </div>
                                `).join("")}
                            </div>`;
                    }).join("")}
                </div>
            </div>
            <div class="badge-dots" data-slider="${s}">
                ${Array.from({ length: slides }, (_, i) =>
                    `<div class="badge-dot ${i === 0 ? "active" : ""}" data-slide="${i}"></div>`
                ).join("")}
            </div>
        `;

        container.appendChild(wrapper);
    }

    initSliders();
}

function initSliders() {
    const sliders = document.querySelectorAll(".badge-slider-track");

    sliders.forEach((track, index) => {
        let current = 0;
        const dots = document.querySelectorAll(`.badge-dots[data-slider="${index}"] .badge-dot`);
        const slides = track.children.length;

        function update() {
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle("active", i === current));
        }

        autoplay[index] = setInterval(() => {
            current = (current + 1) % slides;
            update();
        }, 3000);

        dots.forEach(dot => {
            dot.onclick = () => {
                current = Number(dot.dataset.slide);
                update();
            };
        });

        update();
    });
}

createSliders();
window.addEventListener("resize", () => setTimeout(createSliders, 250));





   const projectsData = {
            portfolio: {
                title: "Personal Portfolio Website",
                category: "Web Development",
                date: "2025",
                status: "Completed",
                tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
                images: [
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23001122'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EHomepage%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23112233'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EAbout Section%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23223344'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EProjects Gallery%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23334455'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EContact Form%3C/text%3E%3C/svg%3E"
                ],
                description: "A modern, fully responsive personal portfolio website designed to showcase my skills, projects, and professional achievements. Built with clean code and modern design principles.",
                features: [
                    "Fully responsive design that works on all devices",
                    "Smooth scroll animations and transitions",
                    "Interactive project showcase with filtering",
                    "Contact form with validation",
                    "Dark theme with glassmorphism effects"
                ],
                challenges: "The main challenge was creating smooth animations without impacting performance and ensuring the site works perfectly across all browsers and devices.",
                links: {
                    live: "#",
                    github: "https://github.com/lasintha-git"
                }
            },
            network: {
                title: "Enterprise Network Infrastructure",
                category: "Networking",
                date: "2025",
                status: "Completed",
                tech: ["Cisco", "VLAN", "Routing Protocols", "Security"],
                images: [
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23001122'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3ENetwork Topology%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23112233'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EVLAN Config%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23223344'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3ESecurity Setup%3C/text%3E%3C/svg%3E"
                ],
                description: "Designed and implemented a comprehensive enterprise-level network infrastructure for a medium-sized organization, incorporating advanced security measures and redundancy.",
                features: [
                    "Configured multiple VLANs for department segregation",
                    "Implemented OSPF routing protocol for efficient traffic management",
                    "Set up firewall rules and access control lists (ACLs)",
                    "Configured redundant links using spanning tree protocol",
                    "Implemented QoS for prioritizing critical traffic"
                ],
                challenges: "Balancing security requirements with network performance while ensuring seamless communication between departments was the primary challenge.",
                links: {
                    documentation: "#"
                }
            },
            automation: {
                title: "Network Automation Scripts",
                category: "Python",
                date: "2025",
                status: "In Progress",
                tech: ["Python", "Netmiko", "Automation", "SSH"],
                images: [
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23001122'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EScript Dashboard%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23112233'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EConfig Backup%3C/text%3E%3C/svg%3E",
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23223344'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%2300ccff' font-size='48'%3EReport Generation%3C/text%3E%3C/svg%3E"
                ],
                description: "Collection of Python scripts designed to automate routine network administration tasks, including configuration backups and automated reporting.",
                features: [
                    "Automated configuration backup for multiple network devices",
                    "SSH-based device connectivity using Netmiko",
                    "Scheduled report generation with network statistics",
                    "Error handling and logging mechanisms",
                    "Support for multiple vendor platforms"
                ],
                challenges: "Managing different device types and ensuring script reliability across various network equipment was challenging. Implementing proper error handling for connection failures was crucial.",
                links: {
                    github: "https://github.com/lasintha-git"
                }
            }
        };

        let currentProject = null;
        let currentImageIndex = 0;

        // Filter functionality
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Modal functionality
        const modal = document.getElementById('projectModal');
        const modalClose = document.querySelector('.modal-close');

        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                openModal(projectId);
            });
        });

        modalClose.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        function openModal(projectId) {
            currentProject = projectsData[projectId];
            currentImageIndex = 0;
            
            document.getElementById('modalTitle').textContent = currentProject.title;
            
            // Modal meta
            const metaHTML = `
                <span class="project-date"><i class="far fa-calendar"></i> ${currentProject.date}</span>
                <span class="project-status status-${currentProject.status === 'Completed' ? 'completed' : 'progress'}">${currentProject.status}</span>
                <span class="project-date"><i class="fas fa-folder"></i> ${currentProject.category}</span>
            `;
            document.getElementById('modalMeta').innerHTML = metaHTML;
            
            // Setup gallery
            setupGallery();
            
            // Project details
            const detailsHTML = `
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Overview</h3>
                    <p>${currentProject.description}</p>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-list-check"></i> Key Features</h3>
                    <ul>
                        ${currentProject.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-wrench"></i> Technologies Used</h3>
                    <div class="project-tech">
                        ${currentProject.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-lightbulb"></i> Challenges & Solutions</h3>
                    <p>${currentProject.challenges}</p>
                </div>
            `;
            document.getElementById('projectDetails').innerHTML = detailsHTML;
            
            // Action buttons
            let actionsHTML = '';
            if (currentProject.links.live) {
                actionsHTML += `<a href="${currentProject.links.live}" class="action-btn btn-primary" target="_blank"><i class="fas fa-external-link-alt"></i> View Live</a>`;
            }
            if (currentProject.links.github) {
                actionsHTML += `<a href="${currentProject.links.github}" class="action-btn btn-secondary" target="_blank"><i class="fab fa-github"></i> View Code</a>`;
            }
            if (currentProject.links.documentation) {
                actionsHTML += `<a href="${currentProject.links.documentation}" class="action-btn btn-secondary" target="_blank"><i class="fas fa-book"></i> Documentation</a>`;
            }
            document.getElementById('modalActions').innerHTML = actionsHTML;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function setupGallery() {
            const images = currentProject.images;
            
            document.getElementById('mainImage').src = images[0];
            document.getElementById('currentImageIndex').textContent = 1;
            document.getElementById('totalImages').textContent = images.length;
            
            // Setup thumbnails
            const thumbnailGallery = document.getElementById('thumbnailGallery');
            thumbnailGallery.innerHTML = '';
            
            images.forEach((img, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
                thumbnail.innerHTML = `<img src="${img}" alt="Thumbnail ${index + 1}">`;
                thumbnail.addEventListener('click', () => changeImage(index));
                thumbnailGallery.appendChild(thumbnail);
            });
            
            // Navigation buttons
            document.getElementById('prevImage').addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                updateImage();
            });
            
            document.getElementById('nextImage').addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                updateImage();
            });
        }

        function changeImage(index) {
            currentImageIndex = index;
            updateImage();
        }

        function updateImage() {
            const images = currentProject.images;
            document.getElementById('mainImage').src = images[currentImageIndex];
            document.getElementById('currentImageIndex').textContent = currentImageIndex + 1;
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentImageIndex);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowLeft') {
                    document.getElementById('prevImage').click();
                } else if (e.key === 'ArrowRight') {
                    document.getElementById('nextImage').click();
                }
            }
        });
