// JavaScript para o site interativo PDCA - Evento Atron 25 anos

document.addEventListener('DOMContentLoaded', function () {
    // Carregar o SVG do PDCA no container de animação
    const pdcaContainer = document.getElementById('pdca-animation');
    fetch('pdca_diagram.svg')
        .then(response => response.text())
        .then(svgContent => {
            pdcaContainer.innerHTML = svgContent;
            // Iniciar animação após carregar
            initPDCAAnimation();
        })
        .catch(error => {
            console.error('Erro ao carregar o SVG:', error);
            // Fallback para caso de erro
            pdcaContainer.innerHTML = '<img src="pdca_diagram.svg" alt="Ciclo PDCA" style="width: 100%; height: 100%;">';
        });

    // Configurar o indicador de progresso
    setupProgressIndicator();

    // Configurar o botão de voltar ao topo
    setupBackToTopButton();

    // Adicionar efeitos de scroll para elementos
    setupScrollEffects();

    // Adicionar interatividade aos cards
    setupCardInteractions();
});

// Animação do diagrama PDCA e adição de interatividade
function initPDCAAnimation() {
    // Referências aos elementos SVG (assumindo que o SVG foi carregado)
    const svg = document.querySelector('#pdca-animation svg');
    if (!svg) return;

    // Adicionar classe para iniciar animação
    svg.classList.add('loaded');

    // Adicionar interatividade às seções do PDCA
    setupPDCAInteractivity(svg);

    // Animação de rotação suave
    let rotation = 0;
    const rotationSpeed = 0.05;
    let animationFrameId;

    function rotatePDCA() {
        rotation += rotationSpeed;
        if (rotation >= 360) rotation = 0;

        // Aplicar rotação apenas ao círculo central para efeito sutil
        const centerCircle = svg.querySelector('circle:nth-of-type(2)');
        if (centerCircle) {
            centerCircle.style.transform = `rotate(${rotation}deg)`;
            centerCircle.style.transformOrigin = 'center';
        }

        animationFrameId = requestAnimationFrame(rotatePDCA);
    }

    // Iniciar animação
    rotatePDCA();

    // Parar animação quando o usuário rola para fora da seção hero
    window.addEventListener('scroll', function () {
        const heroSection = document.getElementById('hero');
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

        if (window.scrollY > heroBottom) {
            cancelAnimationFrame(animationFrameId);
        } else if (!animationFrameId) {
            rotatePDCA();
        }
    });
}

// Configurar interatividade para as seções do PDCA
function setupPDCAInteractivity(svg) {
    // Mapeamento de IDs das seções do SVG para IDs das seções da página
    const sectionMapping = {
        'plan-section': 'plan',
        'do-section': 'do',
        'check-section': 'check',
        'act-section': 'act'
    };

    // Adicionar eventos de clique para cada seção do PDCA
    Object.keys(sectionMapping).forEach(sectionId => {
        const element = svg.getElementById(sectionId);
        if (element) {
            // Adicionar efeito de hover
            element.addEventListener('mouseenter', function () {
                element.style.opacity = '0.9';
                element.style.transform = 'scale(1.02)';
                element.style.transformOrigin = 'center';
                element.style.transition = 'all 0.3s ease';
            });

            element.addEventListener('mouseleave', function () {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            });

            // Adicionar evento de clique para navegação
            element.addEventListener('click', function () {
                const targetSection = document.getElementById(sectionMapping[sectionId]);
                if (targetSection) {
                    // Rolar suavemente até a seção correspondente
                    targetSection.scrollIntoView({ behavior: 'smooth' });

                    // Adicionar efeito de destaque na seção de destino
                    targetSection.classList.add('highlight-section');
                    setTimeout(() => {
                        targetSection.classList.remove('highlight-section');
                    }, 1500);
                }
            });
        }
    });

    // Adicionar tooltip para melhorar a usabilidade
    const tooltip = document.createElement('div');
    tooltip.className = 'pdca-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.padding = '5px 10px';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.color = 'white';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '14px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);

    // Mostrar tooltip ao passar o mouse sobre as seções
    Object.keys(sectionMapping).forEach(sectionId => {
        const element = svg.getElementById(sectionId);
        if (element) {
            element.addEventListener('mousemove', function (e) {
                const sectionName = sectionId.split('-')[0].toUpperCase();
                tooltip.textContent = `Ir para ${sectionName}`;
                tooltip.style.display = 'block';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY + 10) + 'px';
            });

            element.addEventListener('mouseleave', function () {
                tooltip.style.display = 'none';
            });
        }
    });
}

// Configurar o indicador de progresso
function setupProgressIndicator() {
    const progressBar = document.querySelector('.progress-bar');

    window.addEventListener('scroll', function () {
        // Calcular a porcentagem de rolagem
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);

        // Atualizar a barra de progresso
        progressBar.style.height = scrollPercentRounded + '%';

        // Destacar a seção atual no menu de navegação
        highlightCurrentSection();
    });
}

// Destacar a seção atual no menu de navegação
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSectionId = '';

    // Encontrar a seção atual baseada na posição de rolagem
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= (sectionTop - 100) && window.scrollY < (sectionTop + sectionHeight - 100)) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Atualizar classes ativas no menu
    navLinks.forEach(link => {
        link.classList.remove('active');

        if (link.getAttribute('href') === '#' + currentSectionId) {
            link.classList.add('active');
        }
    });
}

// Configurar o botão de voltar ao topo
function setupBackToTopButton() {
    const backToTopButton = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

// Configurar efeitos de scroll para elementos
function setupScrollEffects() {
    // Detectar elementos que devem animar ao entrar na viewport
    const animatedElements = document.querySelectorAll('.section-title, .section-subtitle, .card, .intro-text p, .conclusion-text p');

    // Função para verificar se um elemento está na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }

    // Função para adicionar classe de animação aos elementos visíveis
    function handleScrollAnimation() {
        animatedElements.forEach(el => {
            if (isElementInViewport(el) && !el.classList.contains('animated')) {
                el.classList.add('animated');
            }
        });
    }

    // Adicionar listener de scroll
    window.addEventListener('scroll', handleScrollAnimation);

    // Verificar elementos visíveis no carregamento inicial
    handleScrollAnimation();

    // Efeito parallax para seções
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;

        // Aplicar efeito parallax ao hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }

        // Efeito sutil de parallax para outras seções
        document.querySelectorAll('.section-content').forEach(content => {
            const section = content.closest('section');
            const sectionTop = section.offsetTop;
            const sectionPosition = scrollPosition - sectionTop;

            if (sectionPosition > -window.innerHeight && sectionPosition < window.innerHeight) {
                content.style.transform = `translateY(${sectionPosition * 0.05}px)`;
            }
        });
    });
}

// Configurar interatividade para os cards
function setupCardInteractions() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Efeito de hover 3D
        card.addEventListener('mousemove', function (e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Calcular rotação baseada na posição do mouse (efeito sutil)
            const rotateY = mouseX * 0.01;
            const rotateX = -mouseY * 0.01;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        // Resetar transformação quando o mouse sai
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 300);
        });

        // Efeito de clique para expandir (opcional)
        card.addEventListener('click', function () {
            // Toggle classe expandida
            card.classList.toggle('expanded');
        });
    });
}

// Adicionar estilos CSS dinâmicos para animações
function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Animações para elementos */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animated {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        /* Atraso para elementos em sequência */
        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
        .card:nth-child(5) { animation-delay: 0.5s; }
        .card:nth-child(6) { animation-delay: 0.6s; }
        
        /* Estilo para links ativos no menu */
        .nav-links a.active {
            opacity: 1;
            font-weight: 500;
        }
        
        /* Estilo para cards expandidos */
        .card.expanded {
            transform: scale(1.05);
            z-index: 10;
        }
        
        /* Animação para o SVG do PDCA */
        #pdca-animation svg {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        #pdca-animation svg.loaded {
            opacity: 1;
            transform: scale(1);
        }
        
        /* Efeito de destaque para seções ao navegar pelo PDCA */
        .highlight-section {
            animation: highlight-pulse 1.5s ease;
        }
        
        @keyframes highlight-pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
            50% { box-shadow: 0 0 30px 10px rgba(0, 122, 255, 0.3); }
            100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
        }
    `;

    document.head.appendChild(styleElement);
}

// Chamar função para adicionar estilos dinâmicos
addDynamicStyles();
