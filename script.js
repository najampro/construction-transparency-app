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

// --- 1. AUTH CONTROLLER ---
if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
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

// --- 4. DEEP MICRO-PHASE CONSTRUCTION BUILD ENGINE ---
const milestonesWrapper = document.getElementById('milestones-wrapper');
if (milestonesWrapper) {
    const deepConstructionMatrix = [
        {
            category: "1. Substructure Groundwork",
            icon: "fa-compass",
            items: [
                { name: "Site Layout, Plot Marking & Demarcation", progress: 100, color: "#48bb78", status: "completed" },
                { name: "Excavation & Earthwork Digging", progress: 100, color: "#48bb78", status: "completed" },
                { name: "Termite Proofing Treatment & Lean Concrete Base", progress: 100, color: "#48bb78", status: "completed" }
            ]
        },
        {
            category: "2. Foundation Structural Core",
            icon: "fa-cubes",
            items: [
                { name: "Footing Steel Mesh Rebars & Box Laying", progress: 90, color: "#38b2ac", status: "in-progress" },
                { name: "Plinth Beam Casting & R.C.C Pouring", progress: 60, color: "#38b2ac", status: "in-progress" },
                { name: "Damp Proof Course (DPC) & Bitumen Layer", progress: 0, color: "#4a5568", status: "pending" }
            ]
        },
        {
            category: "3. Superstructure (Gray Shell)",
            icon: "fa-trowel-bricks",
            items: [
                { name: "Load-Bearing Brickwork Walls (Ground Floor)", progress: 40, color: "#ecc94b", status: "in-progress" },
                { name: "Lintel Beams & Door Frame Shuttering Fixation", progress: 10, color: "#ecc94b", status: "in-progress" },
                { name: "Roof Slab (Lanter) Casting & Shuttering Support", progress: 0, color: "#4a5568", status: "pending" }
            ]
        },
        {
            category: "4. MEP Concealed Pipelines",
            icon: "fa-faucet-drip",
            items: [
                { name: "Concealed Conduit Wall Chipping (Electrical)", progress: 30, color: "#ecc94b", status: "in-progress" },
                { name: "Water Supply PPR Pipes Internal Laying", progress: 50, color: "#38b2ac", status: "in-progress" },
                { name: "Main Drainage & Under-Floor Sewerage Lines", progress: 80, color: "#38b2ac", status: "in-progress" }
            ]
        },
        {
            category: "5. Internal Plastering & Wet Finishes",
            icon: "fa-border-all",
            items: [
                { name: "Cement Plastering (Walls & Ceilings)", progress: 0, color: "#4a5568", status: "pending" },
                { name: "Floor Screeding & Tile Bond Layout Base", progress: 0, color: "#4a5568", status: "pending" },
                { name: "Main Elevation Front Design Plasterwork", progress: 0, color: "#4a5568", status: "pending" }
            ]
        },
        {
            category: "6. Trim Finishes & Automation Nodes",
            icon: "fa-robot",
            items: [
                { name: "Wall Putty & Primer Base Coat Application", progress: 0, color: "#4a5568", status: "pending" },
                { name: "Sanitary Ware & Switch Plates Installation", progress: 0, color: "#4a5568", status: "pending" },
                { name: "Smart Gate Lock & n8n Automation Server Node", progress: 0, color: "#4a5568", status: "pending" }
            ]
        }
    ];

    // Generate deep operational layout nodes
    milestonesWrapper.innerHTML = deepConstructionMatrix.map(phase => `
        <div class="phase-category-block">
            <div class="phase-category-title">
                <i class="fa-solid ${phase.icon}"></i> ${phase.category}
            </div>
            ${phase.items.map(m => `
                <div class="milestone-item ${m.status}">
                    <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                        <span style="color:#e2e8f0; font-weight:500;">${m.name}</span>
                        <strong style="color:${m.progress > 0 ? '#38b2ac' : '#718096'};">${m.progress}%</strong>
                    </div>
                    <div style="background:#111827; height:5px; border-radius:3px; overflow:hidden;">
                        <div style="background:${m.color}; width:${m.progress}%; height:100%; transition: width 0.8s ease;"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}
