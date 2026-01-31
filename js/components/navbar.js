// Navigation Component - EventHub

class Navbar {
    constructor() {
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const navbar = document.createElement('nav');
        navbar.className = 'navbar';
        navbar.innerHTML = `
            <div class="container">
                <div class="navbar-content">
                    <a href="#" class="navbar-brand" data-page="home">EventHub</a>
                    
                    <ul class="navbar-nav">
                        <li><a href="#" class="navbar-link" data-page="home">Home</a></li>
                        <li><a href="#" class="navbar-link" data-page="events">Events</a></li>
                        <li data-auth="signed-in" class="hidden">
                            <a href="#" class="navbar-link" data-page="my-events">My Events</a>
                        </li>
                        <li data-auth="signed-in" class="hidden">
                            <a href="#" class="navbar-link" data-page="create-event">Create Event</a>
                        </li>
                        <li data-auth="signed-out">
                            <a href="#" class="navbar-link" data-page="login">Login</a>
                        </li>
                        <li data-auth="signed-out">
                            <a href="#" class="navbar-link" data-page="register">Register</a>
                        </li>
                        <li data-auth="signed-in" class="hidden">
                            <a href="#" class="navbar-link" data-page="profile">
                                <span data-user>Profile</span>
                            </a>
                        </li>
                        <li data-auth="signed-in" class="hidden">
                            <button class="btn btn-secondary" id="signOutBtn">Sign Out</button>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        // Insert navbar at the beginning of body
        document.body.insertBefore(navbar, document.body.firstChild);
    }

    attachEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            if (e.target.dataset.page) {
                e.preventDefault();
                this.navigateTo(e.target.dataset.page);
            }
        });

        // Sign out button
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', async () => {
                await authService.signOut();
                this.navigateTo('home');
            });
        }
    }

    navigateTo(page) {
        // Update URL
        utils.setUrlParameter('page', page);
        
        // Load page content
        if (window.router) {
            window.router.loadPage(page);
        }

        // Update active nav link
        this.updateActiveLink(page);
    }

    updateActiveLink(activePage) {
        const navLinks = document.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            if (link.dataset.page === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize navbar
window.navbar = new Navbar();