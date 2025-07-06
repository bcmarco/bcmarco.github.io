// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Order Modal System
const modal = document.getElementById('orderModal');
const orderForm = document.getElementById('orderForm');
let currentStep = 1;
let orderData = {
    service: '',
    platform: '',
    quantity: 0,
    price: 0,
    link: '',
    payment: 'paypal'
};

// PayPal configuration
const PAYPAL_CLIENT_ID = 'AQYaeY42FpLtEUNzecS445gVsPqyOF69ZX0P-grjT0ibNu8BrsrutoRAgB_mUngxnoDmGnTKPauigeaI';
const NOTIFICATION_EMAIL = 'buyznx@gmail.com';

// Pricing structure - Same prices for both platforms
const PRICING = {
    followers: {
        tiktok: [
            { amount: 1000, price: 4 },
            { amount: 2500, price: 10 },
            { amount: 5000, price: 15 },
            { amount: 10000, price: 30 },
            { amount: 25000, price: 70 },
            { amount: 50000, price: 125 }
        ],
        instagram: [
            { amount: 1000, price: 4 },
            { amount: 2500, price: 10 },
            { amount: 5000, price: 15 },
            { amount: 10000, price: 30 },
            { amount: 25000, price: 70 },
            { amount: 50000, price: 125 }
        ]
    },
    likes: {
        tiktok: [
            { amount: 1000, price: 1 },
            { amount: 2500, price: 2.50 },
            { amount: 5000, price: 4 },
            { amount: 10000, price: 6 },
            { amount: 25000, price: 12 },
            { amount: 50000, price: 20 }
        ],
        instagram: [
            { amount: 1000, price: 1 },
            { amount: 2500, price: 2.50 },
            { amount: 5000, price: 4 },
            { amount: 10000, price: 6 },
            { amount: 25000, price: 12 },
            { amount: 50000, price: 20 }
        ]
    },
    views: {
        tiktok: [
            { amount: 10000, price: 1 },
            { amount: 25000, price: 2 },
            { amount: 50000, price: 3 },
            { amount: 100000, price: 5 },
            { amount: 250000, price: 9 },
            { amount: 500000, price: 18 }
        ],
        instagram: [
            { amount: 10000, price: 1 },
            { amount: 25000, price: 2 },
            { amount: 50000, price: 3 },
            { amount: 100000, price: 5 },
            { amount: 250000, price: 9 },
            { amount: 500000, price: 18 }
        ]
    }
};

// Initialize order buttons
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        openOrderModal(service);
    });
});

// Open order modal
function openOrderModal(service) {
    orderData.service = service;
    modal.style.display = 'block';
    showStep(1);
}

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    resetModal();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        resetModal();
    }
});

// Platform selection
document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        orderData.platform = this.getAttribute('data-platform');
        
        setTimeout(() => {
            showQuantityOptions();
            showStep(2);
        }, 300);
    });
});

// Show quantity options
function showQuantityOptions() {
    const quantityContainer = document.getElementById('quantityOptions');
    const title = document.getElementById('quantityTitle');
    
    title.textContent = `Select ${orderData.service.charAt(0).toUpperCase() + orderData.service.slice(1)} Quantity`;
    
    const options = PRICING[orderData.service][orderData.platform];
    
    quantityContainer.innerHTML = options.map(option => `
        <button type="button" class="quantity-btn" data-quantity="${option.amount}" data-price="${option.price}">
            <div class="quantity-amount">${option.amount.toLocaleString()}</div>
            <div class="quantity-price">$${option.price}</div>
        </button>
    `).join('');
    
    // Add quantity selection listeners
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.quantity-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            orderData.quantity = parseInt(this.getAttribute('data-quantity'));
            orderData.price = parseInt(this.getAttribute('data-price'));
            
            setTimeout(() => {
                setupLinkStep();
                showStep(3);
            }, 300);
        });
    });
}

// Setup link input step
function setupLinkStep() {
    const linkTitle = document.getElementById('linkTitle');
    const linkLabel = document.getElementById('linkLabel');
    const linkInput = document.getElementById('linkInput');
    const linkHelp = document.getElementById('linkHelp');
    
    if (orderData.service === 'followers') {
        linkTitle.textContent = `Enter Your ${orderData.platform.charAt(0).toUpperCase() + orderData.platform.slice(1)} Profile Link`;
        linkLabel.textContent = 'Profile URL:';
        linkInput.placeholder = orderData.platform === 'tiktok' ? 'https://www.tiktok.com/@username' : 'https://www.instagram.com/username/';
        linkHelp.textContent = 'Enter your profile URL to receive followers';
    } else {
        linkTitle.textContent = `Enter Your ${orderData.platform.charAt(0).toUpperCase() + orderData.platform.slice(1)} Post Link`;
        linkLabel.textContent = 'Post URL:';
        linkInput.placeholder = orderData.platform === 'tiktok' ? 'https://www.tiktok.com/@username/video/...' : 'https://www.instagram.com/p/...';
        linkHelp.textContent = `Enter the specific post URL to receive ${orderData.service}`;
    }
    
    updateOrderDisplay();
}

// Update order display
function updateOrderDisplay() {
    document.getElementById('selectedService').textContent = orderData.service.charAt(0).toUpperCase() + orderData.service.slice(1);
    document.getElementById('selectedPlatform').textContent = orderData.platform.charAt(0).toUpperCase() + orderData.platform.slice(1);
    document.getElementById('selectedQuantity').textContent = orderData.quantity.toLocaleString();
    document.getElementById('selectedPrice').textContent = `$${orderData.price}`;
}

// Navigation buttons
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });
});

document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep === 3) {
            const linkInput = document.getElementById('linkInput');
            if (linkInput.value.trim()) {
                orderData.link = linkInput.value.trim();
                setupPaymentStep();
                showStep(4);
            } else {
                alert('Please enter a valid link');
            }
        }
    });
});

// Setup payment step
function setupPaymentStep() {
    document.getElementById('summaryService').textContent = orderData.service.charAt(0).toUpperCase() + orderData.service.slice(1);
    document.getElementById('summaryPlatform').textContent = orderData.platform.charAt(0).toUpperCase() + orderData.platform.slice(1);
    document.getElementById('summaryQuantity').textContent = orderData.quantity.toLocaleString();
    document.getElementById('summaryLink').textContent = orderData.link;
    document.getElementById('summaryTotal').textContent = `$${orderData.price}`;
    
    setupPayPalButton();
    setupPaymentMethodToggle();
}

// Setup payment method toggle
function setupPaymentMethodToggle() {
    const paypalRadio = document.getElementById('paypal');
    const cashappRadio = document.getElementById('cashapp');
    const paypalContainer = document.getElementById('paypal-button-container');
    const cashAppBtn = document.getElementById('cashAppBtn');
    
    function togglePaymentMethod() {
        if (paypalRadio.checked) {
            paypalContainer.style.display = 'block';
            cashAppBtn.style.display = 'none';
            orderData.payment = 'paypal';
        } else if (cashappRadio.checked) {
            paypalContainer.style.display = 'none';
            cashAppBtn.style.display = 'block';
            orderData.payment = 'cashapp';
        }
    }
    
    paypalRadio.addEventListener('change', togglePaymentMethod);
    cashappRadio.addEventListener('change', togglePaymentMethod);
    
    // Initial setup
    togglePaymentMethod();
}

// Cash App payment handler
document.getElementById('cashAppBtn').addEventListener('click', handleCashAppPayment);

// Setup PayPal button
function setupPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = '';
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: orderData.price.toString()
                    },
                    description: `${orderData.quantity} ${orderData.service} for ${orderData.platform}`,
                    custom_id: `${orderData.service}-${orderData.platform}-${Date.now()}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                const orderInfo = {
                    transactionId: details.id,
                    customerEmail: details.payer.email_address,
                    customerName: details.payer.name.given_name + ' ' + details.payer.name.surname,
                    platform: orderData.platform.charAt(0).toUpperCase() + orderData.platform.slice(1),
                    service: `${orderData.quantity} ${orderData.service}`,
                    targetLink: orderData.link,
                    amount: `$${orderData.price}`,
                    paymentMethod: 'PayPal',
                    orderDate: new Date().toLocaleString(),
                    status: 'Payment Confirmed'
                };

                sendOrderNotification(orderInfo);

                alert(`🚀 Payment Successful!\n\nTransaction ID: ${details.id}\nService: ${orderData.quantity} ${orderData.service}\nPlatform: ${orderData.platform.charAt(0).toUpperCase() + orderData.platform.slice(1)}\nLink: ${orderData.link}\n\n⚠️ IMPORTANT: You MUST fill out our order form to receive your items!\n📋 Go to: https://docs.google.com/forms/d/e/1FAIpQLScg3Wu4gU7EqWU5PheUOrAUxYXLVHjmMtzT0YMUveSw8GQM6Q/viewform\n\nWithout completing this form, we cannot process your order.\nDelivery: 24-48 hours after form submission.`);

                console.log('Order completed:', orderData);
                console.log('PayPal transaction:', details);

                modal.style.display = 'none';
                resetModal();
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            alert('Payment error occurred. Please try again.');
        }
    }).render('#paypal-button-container');
}

// Handle Cash App payment
function handleCashAppPayment() {
    alert(`💰 Cash App Payment Instructions\n\nTo complete your order with Cash App:\n\n📱 Follow us on Instagram: @buyznx\n💬 Send us a DM with your order details\n💵 We'll accept your Cash App payment there\n\n⚠️ IMPORTANT: After payment, you MUST fill out our order form:\n📋 https://docs.google.com/forms/d/e/1FAIpQLScg3Wu4gU7EqWU5PheUOrAUxYXLVHjmMtzT0YMUveSw8GQM6Q/viewform\n\nOrder Details:\n• ${orderData.quantity} ${orderData.service}\n• Platform: ${orderData.platform}\n• Amount: $${orderData.price}\n• Link: ${orderData.link}\n\nWithout completing this form, we cannot process your order.\nDelivery: 24 hours after payment + form submission.`);

    console.log('Cash App order:', orderData);

    modal.style.display = 'none';
    resetModal();
}

// Send order notification
function sendOrderNotification(orderInfo) {
    const emailSubject = `New Order Received - ${orderInfo.service} for ${orderInfo.platform}`;
    const emailBody = `
🎉 NEW ORDER RECEIVED! 🎉

Order Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Transaction ID: ${orderInfo.transactionId}
💰 Amount Paid: ${orderInfo.amount}
📅 Order Date: ${orderInfo.orderDate}
💳 Payment Method: ${orderInfo.paymentMethod}
✅ Status: ${orderInfo.status}

Customer Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${orderInfo.customerName}
📧 Email: ${orderInfo.customerEmail}

Service Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Platform: ${orderInfo.platform}
📦 Service: ${orderInfo.service}
🔗 Target Link: ${orderInfo.targetLink}

⚡ ACTION REQUIRED: Process this order and deliver within 24-48 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This notification was sent automatically from buyznx.com
    `.trim();

    // Send email using mailto
    const mailtoLink = `mailto:${NOTIFICATION_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    try {
        window.open(mailtoLink, '_blank');
    } catch (error) {
        console.error('Could not open email client:', error);
    }

    console.log('ORDER NOTIFICATION:', orderInfo);
}



// Show specific step
function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
    document.getElementById(`step${step}`).classList.remove('hidden');
    currentStep = step;
}

// Reset modal
function resetModal() {
    currentStep = 1;
    orderData = {
        service: '',
        platform: '',
        quantity: 0,
        price: 0,
        link: '',
        payment: 'paypal'
    };
    
    document.querySelectorAll('.platform-btn, .quantity-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.getElementById('linkInput').value = '';
    document.getElementById('paypal').checked = true;
    document.getElementById('cashapp').checked = false;
}

// Counter animation function
function animateCounter(element, target) {
    let start = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stat numbers when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('K')) {
                    animateCounter(stat, parseInt(text) * 1000);
                } else if (text.includes('%')) {
                    animateCounter(stat, parseInt(text));
                } else {
                    stat.textContent = text;
                }
            });
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection); 
}
