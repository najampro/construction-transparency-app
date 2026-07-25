// --- DOM ELEMENTS REFERENCE ---
const authActionText = document.getElementById('auth-action-text');
const accountAuthModal = document.getElementById('account-auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const modalAuthForm = document.getElementById('modal-auth-form');
const userDisplayName = document.getElementById('user-display-name');
const avatarLetters = document.getElementById('avatar-letters');

// --- 1. LOGIN & LOGOUT DYNAMIC LOGIC ---
let isLoggedIn = false;

// Modal Open/Close & Logout Handle
authActionText.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
        // Agar login nahi hai, toh modal kholo
        accountAuthModal.classList.add('active');
    } else {
        // Agar pehle se login hai, toh click karne par LOGOUT kar do
        isLoggedIn = false;
        userDisplayName.textContent = "Guest Mode";
        authActionText.textContent = "Click to Login";
        authActionText.style.color = "var(--accent)"; // Reset to original accent color
        avatarLetters.textContent = "G";
        avatarLetters.classList.add('guest-mode');
        alert("Session cleared. You have logged out successfully.");
    }
});

// Close Modal Button
closeAuthModal.addEventListener('click', () => {
    accountAuthModal.classList.remove('active');
});

// Handle Form Submit (Verification)
modalAuthForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // State change to Logged In
    isLoggedIn = true;
    userDisplayName.textContent = "Najam (Supervisor)";
    authActionText.textContent = "Click to Logout";
    authActionText.style.color = "#fc8181"; // Logout text ko danger/red shade dena
    avatarLetters.textContent = "N";
    avatarLetters.classList.remove('guest-mode');
    
    // Hide Modal
    accountAuthModal.classList.remove('active');
});


// --- 2. SIDEBAR NAVIGATION SWITCHER (TABS CLICK) ---
const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Pehle sabse 'active' class remove karo
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Sirf click hone waale item par 'active' class lagao
        item.classList.add('active');
        
        // Visual indicator ke user ne switch kiya hai
        const tabName = item.textContent.trim();
        console.log(`Switched view to: ${tabName}`);
        
        // Note: Yahan aap future mein alag alag screens show/hide karne ka code likh sakte hain
    });
});


// --- 3. DYNAMIC CCTV STREAM SIMULATOR ---
const cameraTags = [
    "CAM 01 — FOUNDATION AXIS",
    "CAM 02 — ROOF MESH VIEW",
    "CAM 03 — MATERIAL STORAGE",
    "CAM 04 — MAIN GATE AUDIT"
];

const cctvCameraTag = document.getElementById('cctv-camera-tag');
const cctvStreamImg = document.getElementById('cctv-stream-img');

// Har 5 seconds baad camera name automatic simulate hoga
if (cctvCameraTag) {
    let camIndex = 0;
    setInterval(() => {
        camIndex = (camIndex + 1) % cameraTags.length;
        cctvCameraTag.textContent = cameraTags[camIndex];
    }, 5000);
}
