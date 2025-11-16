// ByteMarket - JavaScript Interativo

// Login/Register Form Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login tentativa:', { email, password });
            
            // Simulação de login bem-sucedido
            alert('Login realizado com sucesso!');
            // Redirecionar para o painel
            window.location.href = 'painel.html';
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
            
            if (password !== passwordConfirm) {
                alert('As senhas não coincidem!');
                return;
            }
            
            console.log('Registro tentativa:', { name, email, password });
            
            // Simulação de registro bem-sucedido
            alert('Conta criada com sucesso!');
            // Redirecionar para o painel
            window.location.href = 'painel.html';
        });
    }

    // Sell Form
    const sellForm = document.getElementById('sellForm');
    if (sellForm) {
        sellForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                type: document.getElementById('productType').value,
                title: document.getElementById('productTitle').value,
                description: document.getElementById('productDescription').value,
                price: document.getElementById('productPrice').value,
                category: document.getElementById('productCategory').value,
                tags: document.getElementById('productTags').value,
                demo: document.getElementById('productDemo').value,
                deliveryTime: document.getElementById('deliveryTime').value,
                includesSupport: document.getElementById('includesSupport').checked,
                includesUpdates: document.getElementById('includesUpdates').checked,
            };
            
            console.log('Produto cadastrado:', formData);
            alert('Produto cadastrado com sucesso!');
            window.location.href = 'painel.html';
        });
    }

    // File Upload Handlers
    const imageUploadArea = document.getElementById('imageUploadArea');
    const productImages = document.getElementById('productImages');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageUploadArea && productImages) {
        imageUploadArea.addEventListener('click', function() {
            productImages.click();
        });
        
        productImages.addEventListener('change', function(e) {
            imagePreview.innerHTML = '';
            const files = e.target.files;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('div');
                    img.style.cssText = 'width: 100px; height: 100px; background-size: cover; background-position: center; border-radius: 8px; background-image: url(' + e.target.result + ')';
                    imagePreview.appendChild(img);
                };
                
                reader.readAsDataURL(file);
            }
        });
    }

    const fileUploadArea = document.getElementById('fileUploadArea');
    const productFiles = document.getElementById('productFiles');
    const filePreview = document.getElementById('filePreview');
    
    if (fileUploadArea && productFiles) {
        fileUploadArea.addEventListener('click', function() {
            productFiles.click();
        });
        
        productFiles.addEventListener('change', function(e) {
            filePreview.innerHTML = '';
            const files = e.target.files;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileItem = document.createElement('div');
                fileItem.style.cssText = 'padding: 0.5rem 1rem; background: var(--light-bg); border-radius: 8px; font-size: 0.875rem;';
                fileItem.textContent = '📎 ' + file.name;
                filePreview.appendChild(fileItem);
            }
        });
    }

    // Social Login Buttons
    const googleButtons = document.querySelectorAll('.btn-google');
    googleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Login com Google - Funcionalidade em desenvolvimento');
        });
    });

    const githubButtons = document.querySelectorAll('.btn-github');
    githubButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Login com GitHub - Funcionalidade em desenvolvimento');
        });
    });

    // Filter checkboxes interaction
    const filterCheckboxes = document.querySelectorAll('.filters-sidebar input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log('Filtro alterado:', this.name, this.value, this.checked);
            // Aqui você implementaria a lógica de filtragem
        });
    });

    // Sort dropdown interaction
    const sortSelect = document.querySelector('.sort-options select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            console.log('Ordenação alterada:', this.value);
            // Aqui você implementaria a lógica de ordenação
        });
    }

    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchBar.value;
            console.log('Busca realizada:', searchTerm);
            // Aqui você implementaria a lógica de busca
            alert('Buscando por: ' + searchTerm);
        });
    }
    
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value;
                console.log('Busca realizada:', searchTerm);
                alert('Buscando por: ' + searchTerm);
            }
        });
    }

    // Product card interactions
    const productButtons = document.querySelectorAll('.product-card .btn-small');
    productButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h4').textContent;
            alert('Visualizando produto: ' + productTitle);
        });
    });

    // Category box interactions
    const categoryBoxes = document.querySelectorAll('.category-box');
    categoryBoxes.forEach(box => {
        box.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('span:last-child').textContent;
            console.log('Categoria selecionada:', category);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Form validation helpers
    const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.style.borderColor = 'var(--border-color)';
            }
        });
    });

    // Price input formatting
    const priceInputs = document.querySelectorAll('input[type="number"][step="0.01"]');
    priceInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        });
    });

    // Dashboard navigation (if on dashboard page)
    const dashboardNavItems = document.querySelectorAll('.dashboard-nav .nav-item:not(.logout)');
    dashboardNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                showDashboardSection(sectionId);
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.nav-item.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Deseja realmente sair?')) {
                alert('Logout realizado com sucesso!');
                window.location.href = 'index.html';
            }
        });
    }
});

// Dashboard section navigation
function showDashboardSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all nav items
    document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active to corresponding nav item
    const navItem = document.querySelector(`.dashboard-nav a[href="#${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-card, .service-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(el);
    });
});

console.log('ByteMarket - Sistema carregado com sucesso! 🚀');
