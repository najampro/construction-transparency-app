// --- DOM ELEMENTS REFERENCE NODES ---
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

// --- 1. CLEAN RE-ENGINEERED AUTH LOGIC ---
if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            accountAuthModal.classList.add('active');
        } else {
            isLoggedIn = false;
            userDisplayName.textContent = "Guest Mode";
            authActionText.textContent = "Click to Login";
            authActionText.style.color = "#22d3ee";
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
        authActionText.style.color = "#f87171";
        avatarLetters.textContent = "N";
        accountAuthModal.classList.remove('active');
    });
}

// --- 2. SCREEN TAB INTERCHANGE SWITCHER ---
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
        
        // Remove active highlights from all menu nodes
        menuItems.forEach(i => i.style.background = "transparent", i => i.style.color = "#94a3b8");
        item.style.background = "#334155";
        item.style.color = "#fff";
        
        const targetPageId = item.getAttribute('data-target');
        pageContents.forEach(page => page.classList.remove('active'));
        
        const targetPage = document.getElementById(targetPageId);
        if(targetPage) targetPage.classList.add('active');
        
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
                <strong style="color: #fff; display:block; font-size:0.9rem;">${r.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Verification status recorded</span>
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
        alert("Log successfully pushed to Testing Reports Stream!");
    });
}
renderReports();

// --- 4. DATA MATRIX FOR DEEP CONSTRUCTION MICRO-PHASES ---
const milestonesWrapper = document.getElementById('milestones-wrapper');
if (milestonesWrapper) {
    const deepConstructionMatrix = [
        {
            category: "1. Substructure Groundwork",
            icon: "fa-compass",
            items: [
                { name: "Site Layout & Plot Marking", progress: 100, color: "#10b981", status: "completed" },
                { name: "Excavation & Earthwork Digging", progress: 100, color: "#10b981", status: "completed" },
                { name: "Termite Proofing & Lean Concrete Base", progress: 100, color: "#10b981", status: "completed" }
            ]
        },
        {
            category: "2. Foundation Structural Core",
            icon: "fa-cubes",
            items: [
                { name: "Footing Steel Mesh Rebars Box", progress: 90, color: "#f59e0b", status: "in-progress" },
                { name: "Plinth Beam Casting Concrete", progress: 60, color: "#f59e0b", status: "in-progress" },
                { name: "Damp Proof Course (DPC) Base", progress: 0, color: "#475569", status: "pending" }
            ]
        },
        {
            category: "3. Superstructure (Gray Shell)",
            icon: "fa-trowel-bricks",
            items: [
                { name: "Load-Bearing Brickwork Walls (GF)", progress: 40, color: "#f59e0b", status: "in-progress" },
                { name: "Lintel Beams & Door Shuttering", progress: 10, color: "#f59e0b", status: "in-progress" },
                { name: "Roof Slab (Lanter) Concrete Cast", progress: 0, color: "#475569", status: "pending" }
            ]
        },
        {
            category: "4. MEP Concealed Pipelines",
            icon: "fa-faucet-drip",
            items: [
                { name: "Concealed Wall Chipping (Electrical)", progress: 30, color: "#f59e0b", status: "in-progress" },
                { name: "Water Supply PPR Pipes Internal Layout", progress: 50, color: "#f59e0b", status: "in-progress" },
                { name: "Main Drainage & Sewerage Under-Floor", progress: 80, color: "#f59e0b", status: "in-progress" }
            ]
        },
        {
            category: "5. Internal Plastering & Wet Finishes",
            icon: "fa-border-all",
            items: [
                { name: "Cement Plastering (Walls/Ceilings)", progress: 0, color: "#475569", status: "pending" },
                { name: "Floor Screeding & Tile Bond Base", progress: 0, color: "#475569", status: "pending" },
                { name: "Main Elevation Front Design Work", progress: 0, color: "#475569", status: "pending" }
            ]
        },
        {
            category: "6. Trim Finishes & Automation Nodes",
            icon: "fa-robot",
            items: [
                { name: "Wall Putty & Primer Coats", progress: 0, color: "#475569", status: "pending" },
                { name: "Sanitary Ware & Switch Fittings", progress: 0, color: "#475569", status: "pending" },
                { name: "Smart Lock & n8n Automation Server", progress: 0, color: "#475569", status: "pending" }
            ]
        }
    ];

    milestonesWrapper.innerHTML = deepConstructionMatrix.map(phase => `
        <div class="phase-category-block">
            <div class="phase-category-title">
                <i class="fa-solid ${phase.icon}"></i> ${phase.category}
            </div>
            ${phase.items.map(m => `
                <div class="milestone-item ${m.status}">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
                        <span style="color:#e2e8f0; font-weight:500;">${m.name}</span>
                        <strong style="color:${m.progress > 0 ? '#22d3ee' : '#94a3b8'};">${m.progress}%</strong>
                    </div>
                    <div style="background:#0f172a; height:5px; border-radius:3px; overflow:hidden;">
                        <div style="background:${m.color}; width:${m.progress}%; height:100%;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// --- 5. SURVEILLANCE AUTOMATIC TAG TIMER ---
const cameraTags = ["CAM 01 — FOUNDATION AXIS", "CAM 02 — ROOF MESH VIEW", "CAM 03 — MATERIAL STORAGE"];
const cctvCameraTag = document.getElementById('cctv-camera-tag');
if (cctvCameraTag) {
    let index = 0;
    setInterval(() => {
        index = (index + 1) % cameraTags.length;
        cctvCameraTag.textContent = cameraTags[index];
    }, 4000);
}
