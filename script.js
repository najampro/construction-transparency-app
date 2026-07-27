// ================= BUILDTRACK CORE SYSTEM ARCHITECTURE ENGINE =================

// 1. CLOUD STORAGE MATRIX INITIALIZATION (FIREBASE CONFIGURATION)
const firebaseConfig = {
    apiKey: "AIzaSyDADeAr1uYq9GhRTU6zMeW8Nl5HkFq4fB4",
    authDomain: "buildtrack-engine.firebaseapp.com",
    projectId: "buildtrack-engine",
    storageBucket: "buildtrack-engine.firebasestorage.app",
    messagingSenderId: "384871961234",
    appId: "1:384871961234:web:27b20b753f36e8a2728c4b",
    measurementId: "G-DTQJR1LP0X"
};

// Initialize Firebase Network Connectivity Safely
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
} else {
    console.warn("Firebase SDK not detected. Operating inside Local Sandbox Mode configuration.");
}

// 2. INTERNAL STATE ENGINE (RUNTIME APPLICATIVE MEMORY MATRIX)
let appState = {
    totalEscrowPool: 5000000,
    totalExpensesLogged: 0,
    progressPercentage: 16,
    isLoggedIn: false,
    currentCameraIndex: 0,
    currentPhaseIndex: 0 
};

// 6-POINT CONSTRUCTION PHASES SEQUENCE MATRIX ARRAY
const constructionPhases = [
    { name: "Phase 1: Excavation & Layout", targetProgress: 16, status: "In Progress" },
    { name: "Phase 2: Foundation Wall Pouring", targetProgress: 33, status: "Pending" },
    { name: "Phase 3: Plinth Beam & DPC Level", targetProgress: 50, status: "Pending" },
    { name: "Phase 4: Brickwork & Lintel Structure", targetProgress: 66, status: "Pending" },
    { name: "Phase 5: Roofing & Concrete Slab", targetProgress: 83, status: "Pending" },
    { name: "Phase 6: Finishing & Infrastructure", targetProgress: 100, status: "Pending" }
];

let reportsData = [];
let securityIncidents = [];
let workforceData = [];
let permitsData = [];
let labTestsData = [];
let dailyReportsData = [];
let machineryData = [];

const cameraFeeds = [
    { tag: "CAM 01 — FOUNDATION AXIS", src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
    { tag: "CAM 02 — STORAGE & REBAR BAY", src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" },
    { tag: "CAM 03 — BOUNDARY PERIMETER", src: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80" }
];

// ================= AUTOMATED 6-PHASE CONSTRUCTION CALCULATOR ENGINE =================
function evaluateConstructionPhaseMetrics() {
    const expenseSum = appState.totalExpensesLogged;
    
    if (expenseSum <= 500000) {
        appState.currentPhaseIndex = 0;
        appState.progressPercentage = 16;
    } else if (expenseSum > 500000 && expenseSum <= 1200000) {
        appState.currentPhaseIndex = 1;
        appState.progressPercentage = 33;
    } else if (expenseSum > 1200000 && expenseSum <= 2200000) {
        appState.currentPhaseIndex = 2;
        appState.progressPercentage = 50;
    } else if (expenseSum > 2200000 && expenseSum <= 3200000) {
        appState.currentPhaseIndex = 3;
        appState.progressPercentage = 66;
    } else if (expenseSum > 3200000 && expenseSum <= 4200000) {
        appState.currentPhaseIndex = 4;
        appState.progressPercentage = 83;
    } else {
        appState.currentPhaseIndex = 5;
        appState.progressPercentage = 100;
    }

    constructionPhases.forEach((phase, idx) => {
        if (idx < appState.currentPhaseIndex) {
            phase.status = "Completed";
        } else if (idx === appState.currentPhaseIndex) {
            phase.status = "In Progress";
        } else {
            phase.status = "Pending";
        }
    });
}

// ================= GLOBAL METRICS SYNCHRONIZER (DOM COUPLING) =================
function syncGlobalDOMStats() {
    evaluateConstructionPhaseMetrics(); 
    const remainingBalance = appState.totalEscrowPool - appState.totalExpensesLogged;
    
    const balanceDOM = document.getElementById('stat-escrow-balance');
    const expenseDOM = document.getElementById('stat-total-expense');
    const progressDOM = document.getElementById('stat-total-progress');

    if (balanceDOM) balanceDOM.textContent = remainingBalance.toLocaleString();
    if (expenseDOM) expenseDOM.textContent = appState.totalExpensesLogged.toLocaleString();
    if (progressDOM) progressDOM.textContent = `${appState.progressPercentage}%`;
}

// ================= DYNAMIC DATA INGESTION NODES (REAL-TIME DB LISTENERS) =================
if (typeof db !== 'undefined') {
    db.collection("expenses").orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
          reportsData = [];
          let tempTotalCost = 0;
          snapshot.forEach((doc) => {
              const data = doc.data();
              reportsData.push(data);
              tempTotalCost += (parseInt(data.cost) || 0);
          });
          appState.totalExpensesLogged = tempTotalCost;
          syncGlobalDOMStats();
          renderReports();
          renderPhaseTracker();
          renderInvoices();
      }, (err) => console.error("Firestore sync failed:", err));

    db.collection("security_logs").orderBy("timestamp", "desc").limit(10)
      .onSnapshot((snapshot) => {
          securityIncidents = [];
          snapshot.forEach((doc) => {
              securityIncidents.push(doc.data());
          });
          renderSecurityLogs();
      }, (err) => console.error("Firestore security sync failed:", err));
}

// ================= UI RENDER IMPLEMENTATION PATTERNS =================

function renderReports() {
    const container = document.getElementById('material-reports-container');
    if (!container) return; 
    
    if (reportsData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No materials logged in cloud sequence yet.</p>`;
        return;
    }

    container.innerHTML = reportsData.map(r => `
        <div class="report-item ${r.type || 'passed'}">
            <div>
                <strong style="color: #fff; display:block; font-size:0.9rem;">${r.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Cloud Sync Verified</span>
            </div>
            <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                (r.type === 'passed' || r.status === 'Passed') ? 'background:rgba(16,185,129,0.15); color:#34d399;' : 'background:rgba(245,158,11,0.15); color:#fbbf24;'
            }">${r.status}</span>
        </div>
    `).join('');
}

function renderSecurityLogs() {
    const container = document.getElementById('security-incident-logs');
    if (!container) return; 
    
    if (securityIncidents.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">Security networks online. Ready.</p>`;
        return;
    }

    container.innerHTML = securityIncidents.map(i => `
        <div style="background:#0f172a; padding:12px; border-radius:6px; border:1px solid #334155; display:flex; gap:10px; font-size:0.85rem; margin-bottom: 8px; border-left: 4px solid ${
            i.type === 'success' ? '#10b981' : i.type === 'warning' ? '#f59e0b' : '#3b82f6'
        }">
            <span style="color:#22d3ee; font-family:monospace; font-weight:bold;">[${i.time || '00:00'}]</span>
            <span style="color:#e2e8f0;">${i.msg}</span>
        </div>
    `).join('');
}

function renderPhaseTracker() {
    const phaseTitleDOM = document.getElementById('active-phase-title');
    const phaseStatusDOM = document.getElementById('active-phase-status');
    const milestoneContainer = document.getElementById('milestone-phases-list');
    
    if (phaseTitleDOM && phaseStatusDOM) {
        const currentPhase = constructionPhases[appState.currentPhaseIndex];
        phaseTitleDOM.textContent = currentPhase.name;
        phaseStatusDOM.textContent = currentPhase.status;
        
        if (currentPhase.status === "In Progress") {
            phaseStatusDOM.style.color = "#fbbf24"; 
        } else if (currentPhase.status === "Completed") {
            phaseStatusDOM.style.color = "#34d399";
        } else {
            phaseStatusDOM.style.color = "#64748b";
        }
    }

    if (milestoneContainer) {
        milestoneContainer.innerHTML = constructionPhases.map((phase, idx) => {
            let iconClass = 'fa-circle';
            let iconColor = '#64748b';
            
            if (idx < appState.currentPhaseIndex) {
                iconClass = 'fa-circle-check';
                iconColor = '#34d399'; 
            } else if (idx === appState.currentPhaseIndex) {
                iconClass = 'fa-circle-dot';
                iconColor = '#22d3ee'; 
            }

            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #0f172a; border-radius: 6px; margin-bottom: 6px; border: 1px solid ${idx === appState.currentPhaseIndex ? '#22d3ee' : '#1e293b'}">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-solid ${iconClass}" style="color: ${iconColor}"></i>
                        <span style="color: ${idx === appState.currentPhaseIndex ? '#fff' : '#94a3b8'}; font-size: 0.85rem; font-weight: ${idx === appState.currentPhaseIndex ? '600' : '400'}">${phase.name}</span>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; ${
                        phase.status === 'Completed' ? 'color:#34d399; background:rgba(52,211,153,0.1);' : phase.status === 'In Progress' ? 'color:#fbbf24; background:rgba(251,191,36,0.1);' : 'color:#64748b;'
                    }">${phase.status}</span>
                </div>
            `;
        }).join('');
    }
}

// ================= INVOICES & PAYMENTS (AUTO-DERIVED FROM MATERIAL LEDGER) =================
function renderInvoices() {
    const container = document.getElementById('invoices-list-container');
    const totalDOM = document.getElementById('invoices-total-amount');
    const heldDOM = document.getElementById('invoices-held-count');
    if (!container) return;

    if (reportsData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No invoices yet — log a material on the Site Dashboard to generate one automatically.</p>`;
        if (totalDOM) totalDOM.textContent = "PKR 0";
        if (heldDOM) heldDOM.textContent = "0 Held";
        return;
    }

    let totalAmount = 0;
    let heldCount = 0;

    container.innerHTML = reportsData.map((r, idx) => {
        const isHeld = (r.status === 'Warning');
        if (isHeld) heldCount++;
        totalAmount += (parseInt(r.cost) || 0);
        const invoiceNo = `INV-${String(reportsData.length - idx).padStart(4, '0')}`;
        return `
            <div class="report-item">
                <div>
                    <strong style="color:#fff; display:block; font-size:0.9rem;">${invoiceNo} — ${r.name}</strong>
                    <span style="font-size:0.75rem; color:#94a3b8;">PKR ${Number(r.cost || 0).toLocaleString()}</span>
                </div>
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                    isHeld ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' : 'background:rgba(16,185,129,0.15); color:#34d399;'
                }">${isHeld ? 'Payment Held' : 'Paid'}</span>
            </div>`;
    }).join('');

    if (totalDOM) totalDOM.textContent = `PKR ${totalAmount.toLocaleString()}`;
    if (heldDOM) heldDOM.textContent = `${heldCount} Held`;
}

// ================= WORKFORCE & LABOR LOGS =================
function renderWorkforceLog() {
    const container = document.getElementById('workforce-log-container');
    const badge = document.getElementById('workforce-total-badge');
    if (!container) return;
    if (badge) badge.textContent = `${workforceData.length} workers`;

    if (workforceData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No attendance logged yet today.</p>`;
        return;
    }

    container.innerHTML = workforceData.map(w => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${w.name} <span style="color:#64748b; font-weight:400;">— ${w.role}</span></strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Daily Wage: PKR ${Number(w.wage).toLocaleString()}</span>
            </div>
            <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                w.attendance === 'Present' ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                w.attendance === 'Half Day' ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                'background:rgba(248,113,113,0.15); color:#f87171;'
            }">${w.attendance}</span>
        </div>
    `).join('');
}

// ================= PERMITS & NOCs =================
function renderPermits() {
    const container = document.getElementById('permits-list-container');
    if (!container) return;

    if (permitsData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No permits or NOCs logged yet.</p>`;
        return;
    }

    container.innerHTML = permitsData.map(p => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${p.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Authority: ${p.authority}</span>
            </div>
            <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                p.status === 'Approved' ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                p.status === 'Pending' ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                'background:rgba(248,113,113,0.15); color:#f87171;'
            }">${p.status}</span>
        </div>
    `).join('');
}

// ================= LAB TESTS & QUALITY =================
function renderLabTests() {
    const container = document.getElementById('labtests-list-container');
    if (!container) return;

    if (labTestsData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No lab tests logged yet.</p>`;
        return;
    }

    container.innerHTML = labTestsData.map(t => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${t.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Material: ${t.material}</span>
            </div>
            <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                t.result === 'Pass' ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                t.result === 'Pending' ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                'background:rgba(248,113,113,0.15); color:#f87171;'
            }">${t.result}</span>
        </div>
    `).join('');
}

// ================= DAILY SITE REPORTS =================
function renderDailyReports() {
    const container = document.getElementById('dailyreports-list-container');
    if (!container) return;

    if (dailyReportsData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No daily reports filed yet.</p>`;
        return;
    }

    container.innerHTML = dailyReportsData.map(r => `
        <div class="report-item" style="align-items:flex-start;">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${r.date} — ${r.weather}</strong>
                <span style="font-size:0.8rem; color:#94a3b8; display:block; margin-top:4px;">${r.summary}</span>
            </div>
            <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; background:rgba(34,211,238,0.15); color:#22d3ee; white-space:nowrap;">${r.workers} workers</span>
        </div>
    `).join('');
}

// ================= HEAVY MACHINERY & LOGISTICS =================
function renderMachinery() {
    const container = document.getElementById('machinery-list-container');
    if (!container) return;

    if (machineryData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No machinery or delivery entries logged yet.</p>`;
        return;
    }

    const goodStatuses = ['Operational', 'Delivered'];
    const warnStatuses = ['Idle', 'In Transit'];

    container.innerHTML = machineryData.map(m => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${m.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">${m.category}</span>
            </div>
            <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                goodStatuses.includes(m.status) ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                warnStatuses.includes(m.status) ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                'background:rgba(248,113,113,0.15); color:#f87171;'
            }">${m.status}</span>
        </div>
    `).join('');
}

// ================= EXPORT DAILY REPORT (CLIENT-SIDE FILE DOWNLOAD) =================
function exportDailyReport() {
    const now = new Date();
    const remainingBalance = appState.totalEscrowPool - appState.totalExpensesLogged;
    const lines = [];

    lines.push('===================================================');
    lines.push(' BUILDTRACK ENGINE — DAILY SITE REPORT');
    lines.push(` Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    lines.push('===================================================');
    lines.push('');

    lines.push('PROJECT STATUS');
    lines.push('--------------');
    lines.push(`Current Phase: ${constructionPhases[appState.currentPhaseIndex]?.name || 'N/A'}`);
    lines.push(`Overall Progress: ${appState.progressPercentage}%`);
    lines.push(`Escrow Pool: PKR ${appState.totalEscrowPool.toLocaleString()}`);
    lines.push(`Total Expenses Logged: PKR ${appState.totalExpensesLogged.toLocaleString()}`);
    lines.push(`Remaining Escrow Balance: PKR ${remainingBalance.toLocaleString()}`);
    lines.push('');

    lines.push('PHASE BREAKDOWN');
    lines.push('----------------');
    constructionPhases.forEach(p => lines.push(`${p.name} — ${p.status}`));
    lines.push('');

    lines.push('RECENT MATERIAL PROCUREMENT LOGS');
    lines.push('---------------------------------');
    if (reportsData.length === 0) {
        lines.push('No materials logged yet.');
    } else {
        reportsData.slice(0, 10).forEach(r => lines.push(`- ${r.name} — PKR ${Number(r.cost || 0).toLocaleString()} — ${r.status}`));
    }
    lines.push('');

    lines.push('WORKFORCE ON RECORD (this session)');
    lines.push('-----------------------------------');
    if (workforceData.length === 0) {
        lines.push('No workforce attendance logged yet.');
    } else {
        workforceData.forEach(w => lines.push(`- ${w.name} (${w.role}) — Wage PKR ${Number(w.wage).toLocaleString()} — ${w.attendance}`));
    }
    lines.push('');

    lines.push('RECENT SECURITY EVENTS');
    lines.push('-----------------------');
    if (securityIncidents.length === 0) {
        lines.push('No security events logged.');
    } else {
        securityIncidents.slice(0, 10).forEach(i => lines.push(`[${i.time || '--:--'}] ${i.msg}`));
    }
    lines.push('');

    lines.push('FILED DAILY SITE REPORTS');
    lines.push('--------------------------');
    if (dailyReportsData.length === 0) {
        lines.push('No daily reports filed this session.');
    } else {
        dailyReportsData.forEach(r => lines.push(`${r.date} — ${r.weather} — ${r.workers} workers — ${r.summary}`));
    }
    lines.push('');
    lines.push('===================================================');
    lines.push(' End of Report — BuildTrack Engine');
    lines.push('===================================================');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuildTrack-DailyReport-${now.toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ================= UI INTERACTION HELPERS (Sidebar Dropdown) =================
function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    const icon = element.querySelector('.submenu-icon');
    
    if (submenu.style.display === "flex") {
        submenu.style.display = "none";
        icon.style.transform = "rotate(0deg)";
        element.style.color = "var(--text-secondary)";
    } else {
        submenu.style.display = "flex";
        icon.style.transform = "rotate(180deg)";
        element.style.color = "var(--text-primary)";
    }
}

// ================= LIVE PROJECT CONTEXT SNAPSHOT (FOR AI GROUNDING) =================
function buildAIContext() {
    const remainingBalance = appState.totalEscrowPool - appState.totalExpensesLogged;
    return {
        escrowPoolTotal: appState.totalEscrowPool,
        totalExpensesLogged: appState.totalExpensesLogged,
        remainingEscrowBalance: remainingBalance,
        overallProgressPercent: appState.progressPercentage,
        currentActivePhase: constructionPhases[appState.currentPhaseIndex]?.name || "N/A",
        allPhases: constructionPhases.map(p => ({ name: p.name, status: p.status })),
        recentMaterialLogs: reportsData.slice(0, 6).map(r => ({
            name: r.name, cost: r.cost, qualityStatus: r.status
        })),
        recentSecurityEvents: securityIncidents.slice(0, 5).map(s => ({
            time: s.time, message: s.msg, type: s.type
        }))
    };
}

// ================= PROFESSIONAL AI ASSISTANT BRAIN (DEBUG MODE) =================
async function handleAIBrain(userInput) {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput, context: buildAIContext() })
        });
        
        if (!response.ok) {
            return `[SYSTEM ERROR ${response.status}]: Unable to connect to the backend server. If status is 404, please verify your endpoint routes. If status is 500, please verify GEMINI_API_KEY settings in Vercel and redeploy.`;
        }

        const data = await response.json();
        
        if (data.reply.includes("Error") || data.reply.includes("failed")) {
            return `[API ERROR]: ${data.reply} — Please check your Gemini API key credentials.`;
        }

        return data.reply;
        
    } catch (error) {
        console.error("AI API Error:", error);
        return `[CONNECTION ERROR]: ${error.message}. (Note: The AI Assistant requires a live server environment, such as a deployed Vercel instance, to communicate with the backend API).`;
    }
}

// ================= LIFE-CYCLE STATE LOADER & TRIGGER REGISTRY =================
document.addEventListener("DOMContentLoaded", () => {
    
    // Page Routing
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item[data-target]');
    const pageContents = document.querySelectorAll('.page-content');
    const currentViewTitle = document.getElementById('current-view-title');
    const currentViewDesc = document.getElementById('current-view-desc');

    const viewMeta = {
        'page-dashboard': { title: "Site Overview & Logs", desc: "Real-time construction operational stream" },
        'page-security': { title: "Site Security & Perimeter Node", desc: "Access control systems and automated breach management" },
        'page-escrow': { title: "Escrow Financial Pools", desc: "Automated funds release tracking and milestone verification" },
        'page-invoices': { title: "Invoices & Payments", desc: "Auto-generated payables from the material procurement ledger" },
        'page-workforce': { title: "Workforce & Labor Logs", desc: "Daily attendance and wage tracking for site labor" },
        'page-permits': { title: "Permits & NOCs", desc: "Regulatory approvals and no-objection certificate register" },
        'page-labtests': { title: "Lab Tests & Quality", desc: "Material quality verification and lab test results" },
        'page-reports': { title: "Daily Site Reports", desc: "Field reports covering weather, manpower, and site progress" },
        'page-machinery': { title: "Heavy Machinery & Logistics", desc: "Equipment status and incoming delivery tracking" },
        'page-settings': { title: "System Settings", desc: "Configure preferences and core parameters for BuildTrack App" }
    };

    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const targetPageId = item.getAttribute('data-target');
                if(!targetPageId) return;

                pageContents.forEach(page => page.classList.remove('active'));
                const activePage = document.getElementById(targetPageId);
                if (activePage) activePage.classList.add('active');
                
                if (currentViewTitle && viewMeta[targetPageId]) currentViewTitle.textContent = viewMeta[targetPageId].title;
                if (currentViewDesc && viewMeta[targetPageId]) currentViewDesc.textContent = viewMeta[targetPageId].desc;
            });
        });
    }

    evaluateConstructionPhaseMetrics();
    syncGlobalDOMStats();
    renderReports();
    renderSecurityLogs();
    renderPhaseTracker();
    renderInvoices();
    renderWorkforceLog();
    renderPermits();
    renderLabTests();
    renderDailyReports();
    renderMachinery();

    // Form Submissions
    const logForm = document.getElementById('log-form');
    if (logForm) {
        logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('material-name').value;
            const costInput = parseInt(document.getElementById('material-cost').value) || 0;
            const qualityInput = document.getElementById('material-quality').value;
            
            const payload = {
                name: nameInput,
                cost: costInput,
                status: qualityInput,
                type: qualityInput.toLowerCase().includes('warning') ? 'warning' : 'passed',
                timestamp: typeof firebase !== 'undefined' ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
            };

            if (typeof db !== 'undefined') {
                try {
                    await db.collection("expenses").add(payload);
                    logForm.reset();
                } catch (err) {
                    alert("Cloud structural write failure: " + err.message);
                }
            } else {
                reportsData.unshift(payload);
                appState.totalExpensesLogged += costInput;
                syncGlobalDOMStats();
                renderReports();
                renderPhaseTracker();
                renderInvoices();
                logForm.reset();
            }
        });
    }

    // Workforce & Labor Log Form
    const workforceForm = document.getElementById('workforce-form');
    if (workforceForm) {
        workforceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            workforceData.unshift({
                name: document.getElementById('worker-name').value,
                role: document.getElementById('worker-role').value,
                wage: parseInt(document.getElementById('worker-wage').value) || 0,
                attendance: document.getElementById('worker-attendance').value
            });
            renderWorkforceLog();
            workforceForm.reset();
        });
    }

    // Permits & NOCs Form
    const permitForm = document.getElementById('permit-form');
    if (permitForm) {
        permitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            permitsData.unshift({
                name: document.getElementById('permit-name').value,
                authority: document.getElementById('permit-authority').value,
                status: document.getElementById('permit-status').value
            });
            renderPermits();
            permitForm.reset();
        });
    }

    // Lab Tests & Quality Form
    const labtestForm = document.getElementById('labtest-form');
    if (labtestForm) {
        labtestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            labTestsData.unshift({
                name: document.getElementById('labtest-name').value,
                material: document.getElementById('labtest-material').value,
                result: document.getElementById('labtest-result').value
            });
            renderLabTests();
            labtestForm.reset();
        });
    }

    // Daily Site Reports Form
    const dailyReportForm = document.getElementById('dailyreport-form');
    if (dailyReportForm) {
        dailyReportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            dailyReportsData.unshift({
                date: new Date().toLocaleDateString(),
                weather: document.getElementById('report-weather').value,
                workers: parseInt(document.getElementById('report-workers').value) || 0,
                summary: document.getElementById('report-summary').value
            });
            renderDailyReports();
            dailyReportForm.reset();
        });
    }

    // Heavy Machinery & Logistics Form
    const machineryForm = document.getElementById('machinery-form');
    if (machineryForm) {
        machineryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            machineryData.unshift({
                name: document.getElementById('machinery-name').value,
                category: document.getElementById('machinery-category').value,
                status: document.getElementById('machinery-status').value
            });
            renderMachinery();
            machineryForm.reset();
        });
    }

    // Export Daily Report Button
    const btnExportReport = document.getElementById('btn-export-report');
    if (btnExportReport) {
        btnExportReport.addEventListener('click', exportDailyReport);
    }

    // Security Logic
    async function pushSecurityLog(messageStr, typeStr) {
        const timeNow = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const logPayload = {
            time: timeNow,
            msg: messageStr,
            type: typeStr,
            timestamp: typeof firebase !== 'undefined' ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
        };

        if (typeof db !== 'undefined') {
            await db.collection("security_logs").add(logPayload);
        } else {
            securityIncidents.unshift(logPayload);
            renderSecurityLogs();
        }
    }

    const barrierToggle = document.getElementById('gate-barrier-toggle');
    const laserToggle = document.getElementById('perimeter-laser-toggle');

    if(barrierToggle) {
        barrierToggle.addEventListener('change', (e) => {
            const msg = e.target.checked ? "Remote Command: RFID Vehicle Barrier OPEN" : "Remote Command: RFID Vehicle Barrier SECURED";
            pushSecurityLog(msg, e.target.checked ? 'warning' : 'info');
        });
    }

    if(laserToggle) {
        laserToggle.addEventListener('change', (e) => {
            const msg = e.target.checked ? "Perimeter Laser Array ACTIVE" : "CRITICAL WARNING: Perimeter Array BYPASSED";
            pushSecurityLog(msg, e.target.checked ? 'success' : 'warning');
        });
    }

    // CCTV logic
    const cctvChannelSelect = document.getElementById('cctv-channel-select');
    const cctvCameraTag = document.getElementById('cctv-camera-tag');
    const cctvMainFeed = document.getElementById('cctv-main-feed');

    if (cctvChannelSelect && cctvMainFeed && cctvCameraTag) {
        cctvChannelSelect.addEventListener('change', (e) => {
            const index = parseInt(e.target.value);
            appState.currentCameraIndex = index;
            cctvCameraTag.textContent = cameraFeeds[index].tag;
            cctvMainFeed.style.filter = "brightness(0.3) blur(2px)";
            setTimeout(() => {
                cctvMainFeed.src = cameraFeeds[index].src;
                cctvMainFeed.style.filter = "brightness(0.85) blur(0px)";
            }, 200);
        });
    }

   // Auth logic
    const loginTriggerBtn = document.getElementById('login-trigger-btn');
    const accountAuthModal = document.getElementById('account-auth-modal');
    const closeAuthModal = document.getElementById('close-auth-modal');
    const modalAuthForm = document.getElementById('modal-auth-form');
    const userDisplayName = document.getElementById('user-display-name');
    const authActionText = document.getElementById('auth-action-text');
    const avatarLetters = document.getElementById('avatar-letters');

    if (loginTriggerBtn) {
        loginTriggerBtn.addEventListener('click', () => {
            if (!appState.isLoggedIn) {
                if (accountAuthModal) accountAuthModal.classList.add('active');
            } else {
                appState.isLoggedIn = false;
                if (userDisplayName) userDisplayName.textContent = "Guest Mode";
                if (authActionText) {
                    authActionText.textContent = "Click to Login";
                    authActionText.style.color = "#22d3ee";
                }
                if (avatarLetters) avatarLetters.textContent = "G";
            }
        });
    }
    
    if (closeAuthModal && accountAuthModal) {
        closeAuthModal.addEventListener('click', () => accountAuthModal.classList.remove('active'));
    }
    
    if (modalAuthForm) {
        modalAuthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const pinInput = document.getElementById('auth-pin-input');
            const enteredPassword = pinInput.value;
            const correctPassword = "1234";

            if (enteredPassword === correctPassword) {
                appState.isLoggedIn = true;
                if (userDisplayName) userDisplayName.textContent = "Supervisor Mode";
                if (authActionText) {
                    authActionText.textContent = "Click to Logout";
                    authActionText.style.color = "#f87171";
                }
                if (avatarLetters) avatarLetters.textContent = "S";
                if (accountAuthModal) accountAuthModal.classList.remove('active');
                
                pinInput.value = "";
            } else {
                alert("Access Denied: The PIN entered is incorrect. Please try again.");
                pinInput.value = "";
            }
        });
    }

    // AI Logic Integrator
    const btnTriggerAI = document.getElementById('btn-trigger-ai');
    const aiInputQuery = document.getElementById('ai-input-query');
    const aiResponseBox = document.getElementById('ai-response-box');

    if (btnTriggerAI && aiInputQuery && aiResponseBox) {
        btnTriggerAI.addEventListener('click', async function(e) {
            e.preventDefault(); 
            const query = aiInputQuery.value.trim();
            if (!query) return alert("Please enter a question or query for the AI Assistant.");

            btnTriggerAI.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Matrix...`;
            btnTriggerAI.disabled = true;
            aiResponseBox.style.display = "block";
            aiResponseBox.innerHTML = `<em>Connecting to operational database... Please wait.</em>`;

            const aiReply = await handleAIBrain(query);

            btnTriggerAI.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Consult AI`;
            btnTriggerAI.disabled = false;
            
            aiResponseBox.innerHTML = `
                <div style="border-left: 3px solid #22d3ee; padding-left: 12px; text-align: left; line-height: 1.6;">
                    <strong style="color: #22d3ee; font-size:0.95rem;"><i class="fa-solid fa-robot"></i> BuildTrack AI:</strong><br><br>
                    ${aiReply}
                </div>`;
        });
    }
});
