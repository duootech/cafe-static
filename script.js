/* ==========================================================================
   CREMAFLOW INTERACTIVE LOGIC (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize functions
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initSectionObserver();
    initPOSSimulator();
    initSchedulerSimulator();
    initInventorySimulator();
    initRoleSwitcher();
    initLeadForm();
});

/* --- Toast Notification Helper --- */
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    // Set message
    const msgEl = toast.querySelector('.toast-message');
    const iconEl = toast.querySelector('.toast-icon');

    msgEl.textContent = message;
    iconEl.textContent = isSuccess ? '✓' : 'ℹ';

    if (!isSuccess) {
        toast.style.backgroundColor = 'var(--color-terracotta)';
    } else {
        toast.style.backgroundColor = 'var(--color-green)';
    }

    // Toggle class
    toast.classList.remove('hidden');

    // Clear previous timeout if any
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    // Hide after 3 seconds
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

/* --- Navbar Scroll State --- */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* --- Mobile Navigation Menu --- */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navLinks) return;

    // Toggle menu open
    mobileToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);

        // Animated hamburger look
        const bars = mobileToggle.querySelectorAll('.bar');
        if (isOpen) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                const bars = mobileToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });
}

/* --- Smooth Scrolling --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --- Highlight Nav link on Scroll --- */
function initSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-btn)');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-nav-link');
                        // Custom style helper for active dot/underline indicator
                        link.style.color = 'var(--color-green)';
                    } else {
                        link.classList.remove('active-nav-link');
                        link.style.color = '';
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* --- Interactive Mockup Simulator Showcase --- */
// Globals for Simulator Tabs
const tabButtons = document.querySelectorAll('.sim-tab-btn');
const screens = document.querySelectorAll('.sim-screen');
const roleBadge = document.getElementById('current-role-badge');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Update tabs active state
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update visible screens
        screens.forEach(scr => scr.classList.remove('active'));
        const activeScreen = document.getElementById(`screen-${targetTab}`);
        if (activeScreen) activeScreen.classList.add('active');

        // Update top-right role badge inside tablet header
        updateRoleBadgeByTab(targetTab);
    });
});

function updateRoleBadgeByTab(tabName) {
    if (!roleBadge) return;
    switch (tabName) {
        case 'pos':
            roleBadge.textContent = 'Barista Mode';
            roleBadge.style.backgroundColor = 'var(--color-green-tint)';
            roleBadge.style.color = 'var(--color-green)';
            break;
        case 'scheduler':
            roleBadge.textContent = 'Manager Mode';
            roleBadge.style.backgroundColor = 'var(--color-gold-tint)';
            roleBadge.style.color = 'var(--color-brown)';
            break;
        case 'inventory':
            roleBadge.textContent = 'Admin Mode';
            roleBadge.style.backgroundColor = 'var(--color-terracotta-tint)';
            roleBadge.style.color = 'var(--color-terracotta)';
            break;
        case 'analytics':
            roleBadge.textContent = 'Admin Mode';
            roleBadge.style.backgroundColor = 'var(--color-terracotta-tint)';
            roleBadge.style.color = 'var(--color-terracotta)';
            break;
        case 'roles':
            roleBadge.textContent = 'System Demo';
            roleBadge.style.backgroundColor = 'var(--bg-cream-dark)';
            roleBadge.style.color = 'var(--color-text-muted)';
            break;
    }
}


/* ==========================================
   SANDBOX TABS LOGIC
   ========================================== */

/* --- 1. POS Terminal Tab --- */
function initPOSSimulator() {
    let orderItems = []; // Array to hold {name, price, qty}

    const productButtons = document.querySelectorAll('.pos-item-card');
    const receiptList = document.getElementById('receipt-list');
    const subtotalEl = document.getElementById('pos-subtotal');
    const taxEl = document.getElementById('pos-tax');
    const totalEl = document.getElementById('pos-total');
    const checkoutBtn = document.getElementById('pos-checkout');
    const clearBtn = document.getElementById('clear-order');

    if (!productButtons.length) return;

    // Category Filtering logic
    const catButtons = document.querySelectorAll('.pos-cat-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            productButtons.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Apply initial filter (Coffee is active by default)
    const activeCatBtn = document.querySelector('.pos-cat-btn.active');
    if (activeCatBtn) {
        const initialCategory = activeCatBtn.getAttribute('data-category');
        productButtons.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === initialCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    productButtons.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));

            // Add or increment item
            const existingItem = orderItems.find(item => item.name === name);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                orderItems.push({ name, price, qty: 1 });
            }

            updateReceipt();
        });
    });

    clearBtn.addEventListener('click', () => {
        orderItems = [];
        updateReceipt();
        showToast('Order cleared');
    });

    checkoutBtn.addEventListener('click', () => {
        if (orderItems.length === 0) return;

        // Capture stats to show interaction changes on Analytics Tab
        const finalTotal = totalEl.textContent;

        // Checkout state representation
        checkoutBtn.textContent = 'Processing Transaction...';
        checkoutBtn.classList.add('disabled');
        checkoutBtn.disabled = true;

        setTimeout(() => {
            // Success State
            showToast(`Transaction complete: ${finalTotal}! Receipt printed.`);

            // Render simulation of print output inside receipt panel
            receiptList.innerHTML = `
                <div class="form-success-state" style="padding: 10px 0;">
                    <div class="success-icon" style="width:40px; height:40px; font-size:18px;">✓</div>
                    <strong style="color:var(--color-green); font-size:13px;">Sale Approved!</strong>
                    <p style="font-size:10px; margin-top:2px;">Ticket #2084 sent to Barista queue.</p>
                </div>
            `;

            // Update dummy analytics values in background
            updateAnalyticsSim(finalTotal);

            // Reset values
            orderItems = [];
            checkoutBtn.textContent = 'Complete Checkout';
            checkoutBtn.classList.add('disabled');
            checkoutBtn.disabled = true;
            subtotalEl.textContent = '$0.00';
            taxEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
        }, 1200);
    });

    function updateReceipt() {
        if (orderItems.length === 0) {
            // Show placeholder
            receiptList.innerHTML = `
                <div class="empty-receipt-placeholder">
                    <span class="placeholder-icon">📥</span>
                    <p>Click on menu items to start building an order.</p>
                </div>
            `;
            checkoutBtn.classList.add('disabled');
            checkoutBtn.disabled = true;
            subtotalEl.textContent = '$0.00';
            taxEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        // Render rows
        receiptList.innerHTML = '';
        let subtotal = 0;

        orderItems.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const row = document.createElement('div');
            row.className = 'receipt-row';
            row.innerHTML = `
                <div class="r-item-details">
                    <span class="r-item-qty">${item.qty}x</span>
                    <span class="r-item-name">${item.name}</span>
                </div>
                <span class="r-item-price">$${itemTotal.toFixed(2)}</span>
            `;
            receiptList.appendChild(row);
        });

        // Totals calculations
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${tax.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;

        checkoutBtn.classList.remove('disabled');
        checkoutBtn.disabled = false;
    }
}

// Function to update analytics when POS transaction finishes
function updateAnalyticsSim(cashAddedStr) {
    const cashVal = parseFloat(cashAddedStr.replace('$', ''));
    if (isNaN(cashVal)) return;

    // Update net sales card in analytics panel
    const analyticsSales = document.getElementById('analytics-sales-val');
    const analyticsTrans = document.getElementById('analytics-trans-val');

    if (analyticsSales && analyticsTrans) {
        const currentSales = parseFloat(analyticsSales.textContent.replace('$', '').replace(',', ''));
        const currentTrans = parseInt(analyticsTrans.textContent);

        const newSales = currentSales + cashVal;
        const newTrans = currentTrans + 1;

        analyticsSales.textContent = `$${newSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        analyticsTrans.textContent = newTrans.toString();
    }
}


/* --- 2. Shift Scheduler Tab --- */
function initSchedulerSimulator() {
    const claimBtn = document.querySelector('.btn-claim-shift');
    const publishBtn = document.getElementById('btn-add-shift');
    const claimableShift = document.getElementById('claimable-shift');

    if (!claimBtn || !publishBtn) return;

    claimBtn.addEventListener('click', () => {
        // Switch shift card to claimed state
        claimableShift.className = 'shift-card barista-shift';
        claimableShift.style.textAlign = 'left';
        claimableShift.style.alignItems = 'stretch';
        claimableShift.style.justifyContent = 'flex-start';
        claimableShift.style.padding = '10px';
        claimableShift.style.border = 'none';
        claimableShift.style.borderLeft = '3.5px solid #3B82F6';

        claimableShift.innerHTML = `
            <span class="shift-time">06:00 AM - 02:00 PM</span>
            <strong class="shift-name">You (Barista)</strong>
            <span class="shift-role">Barista</span>
        `;

        showToast('Shift claimed successfully!');
    });

    publishBtn.addEventListener('click', () => {
        publishBtn.textContent = 'Published ✓';
        publishBtn.style.backgroundColor = 'var(--color-green-light)';
        publishBtn.disabled = true;
        showToast('Schedules successfully synced to employee mobile devices!');
    });
}


/* --- 3. Inventory Tracker Tab --- */
function initInventorySimulator() {
    const reorderBtns = document.querySelectorAll('.btn-reorder');
    const invSummary = document.getElementById('inv-summary');

    let warningCount = 2;

    reorderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemKey = btn.getAttribute('data-item');

            // Check if already ordered
            if (btn.classList.contains('reorder-ok') && btn.textContent !== 'Reorder') return;

            // Trigger visual ordering update
            btn.textContent = 'Ordered ✓';
            btn.style.backgroundColor = 'transparent';
            btn.style.border = '1.5px solid var(--color-green)';
            btn.style.color = 'var(--color-green)';
            btn.disabled = true;

            // Fill meter bar to full and remove warnings
            let itemRow, meter, stats;
            if (itemKey === 'beans') {
                itemRow = document.getElementById('inv-beans');
                meter = document.getElementById('beans-meter');
                stats = document.getElementById('beans-stats');
                if (stats) stats.textContent = '12.0 kg left (Restocking)';
            } else if (itemKey === 'oat') {
                itemRow = document.getElementById('inv-oat');
                meter = document.getElementById('oat-meter');
                stats = document.getElementById('oat-stats');
                if (stats) stats.textContent = '24.0 Liters left (Restocking)';
            }

            if (itemRow && meter) {
                itemRow.classList.remove('row-warning');
                itemRow.style.borderLeft = '1px solid rgba(74, 55, 40, 0.05)';
                meter.className = 'inv-meter good-meter';
                meter.style.width = '100%';
            }

            // Decrement warnings counter
            warningCount = Math.max(0, warningCount - 1);
            if (invSummary) {
                if (warningCount > 0) {
                    invSummary.textContent = `${warningCount} Low Stock Warnings`;
                } else {
                    invSummary.textContent = 'All Ingredients In Stock';
                    invSummary.style.backgroundColor = 'var(--color-green-tint)';
                    invSummary.style.color = 'var(--color-green)';
                }
            }

            const itemName = itemKey === 'beans' ? 'Espresso Beans' : (itemKey === 'oat' ? 'Oat Milk' : 'Restock item');
            showToast(`Reorder placed for ${itemName}! Delivery arriving soon.`);
        });
    });
}


/* --- 4. Role Switcher Tab --- */
function initRoleSwitcher() {
    const roleCards = document.querySelectorAll('.role-demo-card');

    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const role = card.getAttribute('data-role');

            // Set active card styles
            roleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Trigger mockup header badge update
            if (roleBadge) {
                let badgeText = 'System Demo';
                let bg = 'var(--bg-cream-dark)';
                let textCol = 'var(--color-text-muted)';

                if (role === 'barista') {
                    badgeText = 'Barista Mode';
                    bg = 'var(--color-green-tint)';
                    textCol = 'var(--color-green)';
                } else if (role === 'manager') {
                    badgeText = 'Manager Mode';
                    bg = 'var(--color-gold-tint)';
                    textCol = 'var(--color-brown)';
                } else if (role === 'admin') {
                    badgeText = 'Admin Mode';
                    bg = 'var(--color-terracotta-tint)';
                    textCol = 'var(--color-terracotta)';
                }

                roleBadge.textContent = badgeText;
                roleBadge.style.backgroundColor = bg;
                roleBadge.style.color = textCol;
            }

            showToast(`Dashboard view filtered by role: ${role.toUpperCase()}`);
        });
    });
}


/* --- 5. Contact Lead Form --- */
// function initLeadForm() {
//     const form = document.getElementById('lead-form');
//     const formSuccess = document.getElementById('form-success');
//     const submitBtn = document.getElementById('btn-submit-lead');
//     const resetBtn = document.getElementById('btn-reset-form');

//     if (!form || !formSuccess) return;

//     form.addEventListener('submit', (e) => {
//         e.preventDefault();

//         // Trigger validation checks
//         const isValid = validateForm();
//         if (!isValid) return;

//         // Visual submitting loading states
//         const btnText = submitBtn.querySelector('.btn-text-content');
//         const spinner = submitBtn.querySelector('.loader-spinner');

//         submitBtn.disabled = true;
//         if (btnText && spinner) {
//             btnText.textContent = 'Submitting Request...';
//             spinner.classList.remove('hidden');
//         }

//         // Simulate API network submission delay
//         setTimeout(() => {
//             // Hide Form Panel, reveal Success State panel
//             form.classList.add('hidden');
//             formSuccess.classList.remove('hidden');

//             // Re-enable button variables in background for reset loop
//             submitBtn.disabled = false;
//             if (btnText && spinner) {
//                 btnText.textContent = 'Request Custom Proposal';
//                 spinner.classList.add('hidden');
//             }

//             showToast('Proposal request submitted successfully!');
//         }, 1500);
//     });

//     // Form inputs error clearing listener
//     form.querySelectorAll('input, select, textarea').forEach(input => {
//         input.addEventListener('input', () => {
//             const formGroup = input.parentElement;
//             if (formGroup && formGroup.classList.contains('has-error')) {
//                 formGroup.classList.remove('has-error');
//             }
//         });
//     });

//     // Reset loop button action
//     resetBtn.addEventListener('click', () => {
//         form.reset();
//         formSuccess.classList.add('hidden');
//         form.classList.remove('hidden');
//     });

//     function validateForm() {
//         let isFormValid = true;

//         const nameInput = document.getElementById('form-name');
//         const emailInput = document.getElementById('form-email');
//         const typeSelect = document.getElementById('form-type');

//         // 1. Name Check
//         if (!nameInput.value.trim()) {
//             toggleInputError(nameInput, true);
//             isFormValid = false;
//         } else {
//             toggleInputError(nameInput, false);
//         }

//         // 2. Email Check
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
//             toggleInputError(emailInput, true);
//             isFormValid = false;
//         } else {
//             toggleInputError(emailInput, false);
//         }

//         // 3. Select Dropdown Check
//         if (!typeSelect.value) {
//             toggleInputError(typeSelect, true);
//             isFormValid = false;
//         } else {
//             toggleInputError(typeSelect, false);
//         }

//         return isFormValid;
//     }

//     function toggleInputError(inputEl, isError) {
//         const formGroup = inputEl.parentElement;
//         if (!formGroup) return;

//         if (isError) {
//             formGroup.classList.add('has-error');
//         } else {
//             formGroup.classList.remove('has-error');
//         }
//     }
// }

function initLeadForm() {
    const form = document.getElementById("lead-form");
    const formSuccess = document.getElementById("form-success");
    const submitBtn = document.getElementById("btn-submit-lead");
    const resetBtn = document.getElementById("btn-reset-form");

    if (!form || !formSuccess || !submitBtn || !resetBtn) return;

    const API_URL = "https://duootech.in/api/contact";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) return;

        const btnText = submitBtn.querySelector(".btn-text-content");
        const spinner = submitBtn.querySelector(".loader-spinner");

        // Get form values
        const formData = {
            name: document.getElementById("form-name").value.trim(),
            email: document.getElementById("form-email").value.trim(),
            phone: document.getElementById("form-phone").value.trim(),
            cafe: document.getElementById("form-cafe").value,
            message: document.getElementById("form-message").value.trim(),
        };

        try {
            // Loading state
            submitBtn.disabled = true;

            if (btnText && spinner) {
                btnText.textContent = "Submitting Request...";
                spinner.classList.remove("hidden");
            }

            // API Request
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    name: formData?.name,
                    phoneNo: formData?.phone,
                    email: formData?.email,
                    projectName: "Cafefy",
                    message: formData?.cafe + " - " + formData?.message,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit your request."
                );
            }

            // Success
            form.classList.add("hidden");
            formSuccess.classList.remove("hidden");

            showToast(
                result.message || "Proposal request submitted successfully!"
            );

        } catch (error) {
            console.error("Lead submission error:", error);

            showToast(
                error.message ||
                "Something went wrong. Please try again later."
            );

        } finally {
            // Reset loading state
            submitBtn.disabled = false;

            if (btnText && spinner) {
                btnText.textContent = "Request Custom Proposal";
                spinner.classList.add("hidden");
            }
        }
    });

    // Remove error when user starts typing
    form.querySelectorAll("input, select, textarea").forEach((input) => {
        input.addEventListener("input", () => {
            const formGroup = input.parentElement;

            if (formGroup?.classList.contains("has-error")) {
                formGroup.classList.remove("has-error");
            }
        });

        // Important for select dropdown
        input.addEventListener("change", () => {
            const formGroup = input.parentElement;

            if (formGroup?.classList.contains("has-error")) {
                formGroup.classList.remove("has-error");
            }
        });
    });

    // Reset form
    resetBtn.addEventListener("click", () => {
        form.reset();

        // Remove validation errors
        form.querySelectorAll(".form-group").forEach((group) => {
            group.classList.remove("has-error");
        });

        formSuccess.classList.add("hidden");
        form.classList.remove("hidden");
    });

    function validateForm() {
        let isFormValid = true;

        const nameInput = document.getElementById("form-name");
        const emailInput = document.getElementById("form-email");
        const typeSelect = document.getElementById("form-type");

        // Name
        if (!nameInput.value.trim()) {
            toggleInputError(nameInput, true);
            isFormValid = false;
        } else {
            toggleInputError(nameInput, false);
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailInput.value.trim() ||
            !emailRegex.test(emailInput.value.trim())
        ) {
            toggleInputError(emailInput, true);
            isFormValid = false;
        } else {
            toggleInputError(emailInput, false);
        }

        // Venue type
        // if (!typeSelect.value) {
        //     toggleInputError(typeSelect, true);
        //     isFormValid = false;
        // } else {
        //     toggleInputError(typeSelect, false);
        // }

        return isFormValid;
    }

    function toggleInputError(inputEl, isError) {
        const formGroup = inputEl.parentElement;

        if (!formGroup) return;

        formGroup.classList.toggle("has-error", isError);
    }
}
