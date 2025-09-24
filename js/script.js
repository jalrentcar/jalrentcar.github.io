// Global Variables
let carsData = [];
let driversData = [];
let testimonialsData = [];

// DOM Content Loaded
$(document).ready(function() {
    initializeApp();
    setupEventListeners();
    loadPageSpecificContent();
});

// Initialize Application
function initializeApp() {
    loadJSONData();
    setupStickyNavbar();
    highlightActiveNavLink();
}

// Load JSON Data
function loadJSONData() {
    // Load Cars Data
    $.getJSON('assets/data/cars.json')
        .done(function(data) {
            carsData = data;
            if (typeof loadFeaturedCars === 'function') {
                loadFeaturedCars();
            }
            if (typeof loadAllCars === 'function') {
                loadAllCars();
            }
        })
        .fail(function() {
            console.log('Failed to load cars data');
        });

    // Load Drivers Data
    $.getJSON('assets/data/drivers.json')
        .done(function(data) {
            driversData = data;
            if (typeof loadDrivers === 'function') {
                loadDrivers();
            }
        })
        .fail(function() {
            console.log('Failed to load drivers data');
        });

    // Load Testimonials Data
    $.getJSON('assets/data/testimonials.json')
        .done(function(data) {
            testimonialsData = data;
            if (typeof loadTestimonials === 'function') {
                loadTestimonials();
            }
        })
        .fail(function() {
            console.log('Failed to load testimonials data');
        });
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu Toggle
    $('#mobile-menu-btn').on('click', function() {
        $('#mobile-menu').toggleClass('hidden');
    });

    // Search Form
    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        handleSearch();
    });

    // Smooth Scrolling for Anchor Links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 500);
        }
    });

    // Contact Form
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        handleContactForm();
    });

    // Booking Form
    $('#booking-form').on('submit', function(e) {
        e.preventDefault();
        handleBookingForm();
    });
}

// Sticky Navbar
function setupStickyNavbar() {
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('#navbar').addClass('shadow-lg').removeClass('shadow-lg');
        } else {
            $('#navbar').removeClass('shadow-lg').addClass('shadow-lg');
        }
    });
}

// Highlight Active Nav Link
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $('.nav-link').each(function() {
        const linkHref = $(this).attr('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            $(this).addClass('text-blue-600 font-semibold').removeClass('text-gray-700');
        }
    });
}

// Load Page Specific Content
function loadPageSpecificContent() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            loadHomepageContent();
            break;
        case 'cars.html':
            loadCarsPageContent();
            break;
        case 'drivers.html':
            loadDriversPageContent();
            break;
        case 'booking.html':
            loadBookingPageContent();
            break;
    }
}

// Homepage Content
function loadHomepageContent() {
    // Set current date for search form
    const today = new Date().toISOString().split('T')[0];
    $('input[type="date"]').attr('min', today).val(today);
}

// Load Featured Cars (Homepage)
function loadFeaturedCars() {
    const featuredCars = carsData.filter(car => car.featured).slice(0, 3);
    const container = $('#featured-cars');
    
    if (container.length === 0) return;
    
    container.empty();
    
    featuredCars.forEach(car => {
        const carCard = createCarCard(car);
        container.append(carCard);
    });
}

// Load All Cars (Cars Page)
function loadAllCars() {
    const container = $('#cars-container');
    if (container.length === 0) return;
    
    container.empty();
    
    carsData.forEach(car => {
        const carCard = createCarCard(car, true);
        container.append(carCard);
    });
}

// Create Car Card
function createCarCard(car, detailed = false) {
    const availabilityBadge = car.available 
        ? '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>'
        : '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Not Available</span>';
    
    const features = car.features.map(feature => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${feature}</span>`).join('');
    
    return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden car-card">
            <img src="${car.image}" alt="${car.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold">${car.name}</h3>
                    ${availabilityBadge}
                </div>
                <p class="text-gray-600 mb-3">${car.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${features}
                </div>
                <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div><i class="fas fa-users mr-1"></i>${car.seats} Seats</div>
                    <div><i class="fas fa-cog mr-1"></i>${car.transmission}</div>
                    <div><i class="fas fa-gas-pump mr-1"></i>${car.fuel}</div>
                    <div><i class="fas fa-star mr-1 text-yellow-500"></i>${car.rating}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-2xl font-bold text-blue-600">NPR ${car.pricePerDay.toLocaleString()}<span class="text-sm text-gray-500">/day</span></div>
                    ${car.available 
                        ? `<a href="booking.html?car=${car.id}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Book Now</a>`
                        : '<button class="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed" disabled>Not Available</button>'
                    }
                </div>
            </div>
        </div>
    `;
}

// Load Drivers
function loadDrivers() {
    const container = $('#drivers-container');
    if (container.length === 0) return;
    
    container.empty();
    
    driversData.forEach(driver => {
        const driverCard = createDriverCard(driver);
        container.append(driverCard);
    });
}

// Create Driver Card
function createDriverCard(driver) {
    const availabilityBadge = driver.available 
        ? '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>'
        : '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Busy</span>';
    
    const languages = driver.languages.join(', ');
    const specialties = driver.specialties.join(', ');
    
    return `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="${driver.photo}" alt="${driver.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold">${driver.name}</h3>
                    ${availabilityBadge}
                </div>
                <p class="text-gray-600 mb-3">${driver.description}</p>
                <div class="space-y-2 mb-4 text-sm text-gray-600">
                    <div><i class="fas fa-calendar mr-2"></i>${driver.experience} years experience</div>
                    <div><i class="fas fa-language mr-2"></i>${languages}</div>
                    <div><i class="fas fa-star mr-2"></i>Specialties: ${specialties}</div>
                    <div><i class="fas fa-star mr-2 text-yellow-500"></i>${driver.rating} Rating</div>
                </div>
                <div class="flex justify-between items-center">
                    <a href="tel:${driver.phone}" class="text-blue-600 hover:text-blue-700">
                        <i class="fas fa-phone mr-1"></i>${driver.phone}
                    </a>
                    ${driver.available 
                        ? `<a href="booking.html?driver=${driver.id}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Book Driver</a>`
                        : '<button class="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed" disabled>Not Available</button>'
                    }
                </div>
            </div>
        </div>
    `;
}

// Load Testimonials
function loadTestimonials() {
    const container = $('#testimonials');
    if (container.length === 0) return;
    
    container.empty();
    
    const displayTestimonials = testimonialsData.slice(0, 3);
    
    displayTestimonials.forEach(testimonial => {
        const testimonialCard = createTestimonialCard(testimonial);
        container.append(testimonialCard);
    });
}

// Create Testimonial Card
function createTestimonialCard(testimonial) {
    const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
    
    return `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center mb-4">
                <img src="${testimonial.photo}" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover mr-4">
                <div>
                    <h4 class="font-bold">${testimonial.name}</h4>
                    <p class="text-sm text-gray-600">${testimonial.country}</p>
                </div>
            </div>
            <div class="text-yellow-500 mb-3">${stars}</div>
            <p class="text-gray-600 mb-3">"${testimonial.comment}"</p>
            <div class="text-sm text-gray-500">
                <span class="font-semibold">${testimonial.service}</span> • ${new Date(testimonial.date).toLocaleDateString()}
            </div>
        </div>
    `;
}

// Handle Search
function handleSearch() {
    const formData = {
        location: $('#search-form select:eq(0)').val(),
        date: $('#search-form input[type="date"]').val(),
        carType: $('#search-form select:eq(1)').val()
    };
    
    // Redirect to cars page with search parameters
    const params = new URLSearchParams(formData);
    window.location.href = `cars.html?${params.toString()}`;
}

// Handle Contact Form
function handleContactForm() {
    const formData = {
        name: $('#contact-form input[name="name"]').val(),
        email: $('#contact-form input[name="email"]').val(),
        subject: $('#contact-form input[name="subject"]').val(),
        message: $('#contact-form textarea[name="message"]').val()
    };
    
    // Simulate form submission
    alert('Thank you for your message! We will get back to you soon.');
    $('#contact-form')[0].reset();
}

// Handle Booking Form
function handleBookingForm() {
    const formData = {
        name: $('#booking-form input[name="name"]').val(),
        email: $('#booking-form input[name="email"]').val(),
        phone: $('#booking-form input[name="phone"]').val(),
        car: $('#booking-form select[name="car"]').val(),
        driver: $('#booking-form select[name="driver"]').val(),
        startDate: $('#booking-form input[name="startDate"]').val(),
        endDate: $('#booking-form input[name="endDate"]').val(),
        service: $('#booking-form select[name="service"]').val()
    };
    
    // Store in localStorage (simulate API call)
    const bookingId = 'BOOK-' + Date.now();
    localStorage.setItem(bookingId, JSON.stringify({...formData, bookingId, status: 'pending'}));
    
    alert(`Booking confirmed! Your booking ID is: ${bookingId}`);
    $('#booking-form')[0].reset();
}

// Car Filtering (for cars.html)
function filterCars(category = 'all') {
    let filteredCars = carsData;
    
    if (category !== 'all') {
        filteredCars = carsData.filter(car => car.category.toLowerCase() === category.toLowerCase());
    }
    
    const container = $('#cars-container');
    container.empty();
    
    filteredCars.forEach(car => {
        const carCard = createCarCard(car, true);
        container.append(carCard);
    });
}

// Initialize Cars Page
function loadCarsPageContent() {
    // Setup filter buttons
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('bg-blue-600 text-white').addClass('bg-gray-200 text-gray-700');
        $(this).removeClass('bg-gray-200 text-gray-700').addClass('bg-blue-600 text-white');
        
        const category = $(this).data('filter');
        filterCars(category);
    });
    
    // Handle URL parameters for search
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('carType') && urlParams.get('carType') !== 'Any Type') {
        filterCars(urlParams.get('carType'));
    }
}

// Initialize Drivers Page
function loadDriversPageContent() {
    // Any drivers page specific functionality
}

// Initialize Booking Page
function loadBookingPageContent() {
    // Populate car and driver dropdowns
    populateBookingSelects();
    
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('car')) {
        $('#booking-form select[name="car"]').val(urlParams.get('car'));
    }
    if (urlParams.has('driver')) {
        $('#booking-form select[name="driver"]').val(urlParams.get('driver'));
    }
}

// Populate Booking Form Selects
function populateBookingSelects() {
    const carSelect = $('#booking-form select[name="car"]');
    const driverSelect = $('#booking-form select[name="driver"]');
    
    if (carSelect.length && carsData.length) {
        carSelect.empty().append('<option value="">Select a Car</option>');
        carsData.filter(car => car.available).forEach(car => {
            carSelect.append(`<option value="${car.id}">${car.name} - NPR ${car.pricePerDay}/day</option>`);
        });
    }
    
    if (driverSelect.length && driversData.length) {
        driverSelect.empty().append('<option value="">Select a Driver (Optional)</option>');
        driversData.filter(driver => driver.available).forEach(driver => {
            driverSelect.append(`<option value="${driver.id}">${driver.name} - ${driver.experience} years exp.</option>`);
        });
    }
}

// Utility Functions
function formatCurrency(amount) {
    return `NPR ${amount.toLocaleString()}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Animation Helpers
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
