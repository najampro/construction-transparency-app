// --- DOM ELEMENTS TARGETING ---
const loginTriggerBtn = document.getElementById('login-trigger-btn');
const accountAuthModal = document.getElementById('account-auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const modalAuthForm = document.getElementById('modal-auth-form');
const userDisplayName = document.getElementById('user-display-name');
const authActionText = document.getElementById('auth-action-text');
const avatarLetters = document.getElementById('avatar-letters');

const currentViewTitle = document.getElementById('current-view-title');
const currentViewDesc = document.getElementById('current-view-desc');
const logForm = document.getElementById('log-form');
const materialReportsContainer = document.getElementById('material-reports-container');

let isLoggedIn = false;

// --- 1. FIXED AUTH SWITCHER CONTROLLER ---
if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops event bubbling issues
        if (!isLoggedIn) {
            console.log("Opening Modal Matrix...");
            accountAuthModal.classList.add('active');
        } else {
            isLoggedIn = false;
            userDisplayName.textContent = "Guest Mode";
            authActionText.textContent = "Click to Login";
            authActionText.style.color = "cyan";
            avatarLetters.textContent = "G";
            alert("Logged out successfully.");
        }
    });
}

if (closeAuthModal) {
    closeAuthModal.addEventListener('click', (e) => {
        e.stopPropagation();
        accountAuthModal.classList.remove('active');
    });
}

if (modalAuthForm) {
    modalAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        isLoggedIn = true;
        userDisplayName.textContent = "Najam (Supervisor)";
        authActionText.textContent = "Click to Logout";
        authActionText.style.color = "#fc8181";
        avatarLetters.textContent = "N";
        accountAuthModal.classList.remove('active');
    });
}

// --- 2. MULTI-PAGE VIEW CONTROLLER ---
const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
const pageContents = document.querySelectorAll('.page-content');

const viewMeta = {
    'page-dashboard': { title: "Site Overview & Logs", desc: "Real-time construction operational stream" },
    'page-security': { title: "Site Security & Perimeter Node", desc: "Access control systems and automated breach management" },
    'page-escrow': { title: "Escrow Financial Pools", desc: "Automated funds release tracking and milestone verification" },
    'page-settings': { title: "System Settings", desc: "Configure preferences and core parameters for BuildTrack App" }
};

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = item.getAttribute('data-target');
        
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        pageContents.forEach(page => page.classList.remove('active'));
        document.getElementById(targetPageId).classList.add('active');
        
        currentViewTitle.textContent = viewMeta[targetPageId].title;
        currentViewDesc.textContent = viewMeta[targetPageId].desc;
    });
});

// --- 3. REPORTS AND EXPENSES PIPELINE ---
let reportsData = [
    { name: "Mughal Steel Grade 60 Rebar", status: "Lab Certified / Passed", type: "passed" },
    { name: "Lucky Cement Ordinary Portland", status: "Standard Inspection", type: "passed" }
];

function renderReports() {
    if (!materialReportsContainer) return;
    materialReportsContainer.innerHTML = reportsData.map(r => `
        <div class="report-item ${r.type}">
            <div>
                <strong style="color: #fff; display:block;">${r.name}</strong>
                <span style="font-size:0.85rem; color:#a0aec0;">Verification status recorded</span>
            </div>
            <span class="status-badge ${r.type === 'passed' ? 'status-ok' : 'status-pending'}">${r.status}</span>
        </div>
    `).join('');
}

if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('material-name').value;
        const qualityInput = document.getElementById('material-quality').value;
        
        const newReport = {
            name: nameInput,
            status: qualityInput,
            type: qualityInput.includes('Warning') ? 'warning' : 'passed'
        };
        
        reportsData.unshift(newReport);
        renderReports();
        logForm.reset();
        alert("Log pushed to Reports Stream!");
    });
}

renderReports();

// --- 4. MILESTONES RENDERER ---
const milestonesWrapper = document.getElementById('milestones-wrapper');
if (milestonesWrapper) {
    const milestones = [
        { name: "Excavation & Structural Footings", progress: 100, color: "#48bb78" },
        { name: "Plinth Beam Construction", progress: 75, color: "#38b2ac" }
    ];
    milestonesWrapper.innerHTML = milestones.map(m => `
        <div style="margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                <span>${m.name}</span><strong>${m.progress}%</strong>
            </div>
            <div style="background:#2d3748; height:8px; border-radius:4px; overflow:hidden;">
                <div style="background:${m.color}; width:${m.progress}%; height:100%;"></div>
            </div>
        </div>
    `).join('');
}
