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
              data.docId = doc.id; // NEW: har entry ka unique cloud ID save — delete ke liye zaroori
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

// ================= ENTRY REVERSAL ENGINE (DELETE / CORRECTION MODULE) =================
// Maqsad: agar galat entry ho jaye to usay remove kar ke dobara sahi entry ki ja sakay.

// Chhota sa reusable delete button — sirf Supervisor Mode me nazar aata hai.
function buildDeleteButton(onclickExpression) {
    if (!appState.isLoggedIn) return ''; // Guest ko button hi nahi dikhega
    return `<button onclick="${onclickExpression}" title="Remove this entry"
        style="background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.35);
               color:#f87171; border-radius:6px; padding:5px 9px; cursor:pointer;
               font-size:0.75rem; line-height:1;">
        <i class="fa-solid fa-trash"></i>
    </button>`;
}

// Edit button — ye bhi sirf Supervisor Mode me nazar aata hai.
function buildEditButton(onclickExpression) {
    if (!appState.isLoggedIn) return '';
    return `<button onclick="${onclickExpression}" title="Edit this entry"
        style="background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.35);
               color:#fbbf24; border-radius:6px; padding:5px 9px; cursor:pointer;
               font-size:0.75rem; line-height:1; margin-right:2px;">
        <i class="fa-solid fa-pen"></i>
    </button>`;
}

// Second line of defense: chahe button kisi tarah click ho bhi jaye (ya console se function
// seedha call kiya jaye), asli kaam sirf logged-in supervisor ke liye chalega.
function requireSupervisorAccess() {
    if (!appState.isLoggedIn) {
        alert("Access Denied: Sirf logged-in Supervisor hi entries edit ya remove kar sakta hai. Pehle top-right se login karein.");
        return false;
    }
    return true;
}

// Login/logout hone par saari lists dobara draw karo taake edit/delete buttons
// foran nazar aayein ya ghayab ho jayein.
function renderAllLists() {
    renderReports();
    renderPhaseTracker();
    renderInvoices();
    renderWorkforceLog();
    renderPermits();
    renderLabTests();
    renderDailyReports();
    renderMachinery();
}

// --- LOCAL MODULE REGISTRY: aik jagah har module ka form, fields aur render function ---
// Is registry ki wajah se delete, edit aur submit — teeno ka logic aik hi generic code se chalta hai.
const LOCAL_MODULES = {
    workforce: {
        formId: 'workforce-form',
        pageId: 'page-workforce',
        data: () => workforceData,
        render: () => renderWorkforceLog(),
        fields: { name: 'worker-name', role: 'worker-role', wage: 'worker-wage', attendance: 'worker-attendance' },
        numericFields: ['wage']
    },
    permits: {
        formId: 'permit-form',
        pageId: 'page-permits',
        data: () => permitsData,
        render: () => renderPermits(),
        fields: { name: 'permit-name', authority: 'permit-authority', status: 'permit-status' },
        numericFields: []
    },
    labtests: {
        formId: 'labtest-form',
        pageId: 'page-labtests',
        data: () => labTestsData,
        render: () => renderLabTests(),
        fields: { name: 'labtest-name', material: 'labtest-material', result: 'labtest-result' },
        numericFields: []
    },
    dailyreports: {
        formId: 'dailyreport-form',
        pageId: 'page-reports',
        data: () => dailyReportsData,
        render: () => renderDailyReports(),
        fields: { weather: 'report-weather', workers: 'report-workers', summary: 'report-summary' },
        numericFields: ['workers'],
        autoDate: true
    },
    machinery: {
        formId: 'machinery-form',
        pageId: 'page-machinery',
        data: () => machineryData,
        render: () => renderMachinery(),
        fields: { name: 'machinery-name', category: 'machinery-category', status: 'machinery-status' },
        numericFields: []
    }
};

// Kaun si entry abhi edit ho rahi hai — ye do variables "edit mode" ka switch hain.
let editingExpense = null;   // { docId, index } ya null
let editingLocal = null;     // { key, index } ya null

// ================= PAGE ROUTING (GLOBAL — sidebar click aur edit-jump dono is se guzarte hain) =================
// Pehle ye routing logic sirf sidebar ke andar (DOMContentLoaded closure me) thi. Ab isay bahar
// nikala hai taake startEditExpense/startEditLocal bhi "sahi page par le jao" wala kaam kar sakein.
let navMenuItems = null;
let navPageContents = null;
let navCurrentViewTitle = null;
let navCurrentViewDesc = null;

const navViewMeta = {
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

// Sidebar ka data-target jis page par navigate karta hai
function activatePage(targetPageId) {
    if (!targetPageId) return;

    if (navMenuItems) {
        navMenuItems.forEach(i => i.classList.remove('active'));
        const matchingMenuItem = Array.from(navMenuItems).find(i => i.getAttribute('data-target') === targetPageId);
        if (matchingMenuItem) matchingMenuItem.classList.add('active');
    }

    if (navPageContents) navPageContents.forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(targetPageId);
    if (activePage) activePage.classList.add('active');

    if (navCurrentViewTitle && navViewMeta[targetPageId]) navCurrentViewTitle.textContent = navViewMeta[targetPageId].title;
    if (navCurrentViewDesc && navViewMeta[targetPageId]) navCurrentViewDesc.textContent = navViewMeta[targetPageId].desc;
}

// --- 1. MATERIAL / EXPENSE ENTRY DELETE (cloud + local dono modes) ---
async function deleteExpenseEntry(docId, fallbackIndex) {
    if (!requireSupervisorAccess()) return;
    if (!confirm("Kya aap ye entry remove karna chahte hain? Expense total aur phase progress dobara calculate ho jayega.")) return;

    if (editingExpense && editingExpense.index === fallbackIndex) cancelEditExpense();

    if (typeof db !== 'undefined' && docId) {
        try {
            await db.collection("expenses").doc(docId).delete();
            // onSnapshot listener khud hi totals aur UI refresh kar dega — manual render ki zaroorat nahi.
        } catch (err) {
            alert("Cloud delete failure: " + err.message);
        }
    } else {
        // Local Sandbox Mode: array se nikal kar total minus karo
        const removed = reportsData.splice(fallbackIndex, 1)[0];
        appState.totalExpensesLogged -= (parseInt(removed && removed.cost) || 0);
        if (appState.totalExpensesLogged < 0) appState.totalExpensesLogged = 0;

        syncGlobalDOMStats();   // totals + phase % dobara calculate
        renderReports();
        renderPhaseTracker();
        renderInvoices();
    }
}

// --- 2. GENERIC LOCAL LIST DELETE (workforce, permits, lab tests, reports, machinery) ---
function deleteLocalEntry(collectionKey, index) {
    if (!requireSupervisorAccess()) return;
    const mod = LOCAL_MODULES[collectionKey];
    if (!mod) return;
    if (!confirm("Kya aap ye entry remove karna chahte hain?")) return;

    // Agar wahi entry abhi edit ho rahi thi, to edit mode band kar do
    if (editingLocal && editingLocal.key === collectionKey && editingLocal.index === index) {
        cancelEditLocal();
    }

    mod.data().splice(index, 1); // index par mojood aik item nikal do
    mod.render();                // list dobara draw
}

// ================= EDIT MODE ENGINE (ENTRY CORRECTION WITHOUT RE-TYPING) =================

// Form ko "Add" se "Update" look me badalta hai + Cancel button lagata hai.
function setFormEditMode(formId, isEditing, onCancel) {
    const form = document.getElementById(formId);
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
    if (submitBtn) {
        if (isEditing) {
            // Asli label yaad rakho taake cancel par wapas laga sakein
            if (!submitBtn.dataset.originalLabel) submitBtn.dataset.originalLabel = submitBtn.innerHTML;
            submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update Entry`;
            submitBtn.style.background = "#f59e0b";
        } else {
            if (submitBtn.dataset.originalLabel) submitBtn.innerHTML = submitBtn.dataset.originalLabel;
            submitBtn.style.background = "";
        }
    }

    let cancelBtn = form.querySelector('.edit-cancel-btn');
    if (isEditing) {
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'edit-cancel-btn';
            cancelBtn.textContent = "Cancel Edit";
            cancelBtn.style.cssText = "margin-top:8px; width:100%; background:transparent; border:1px solid #475569; color:#94a3b8; padding:8px; border-radius:6px; cursor:pointer; font-size:0.8rem;";
            form.appendChild(cancelBtn);
        }
        cancelBtn.onclick = onCancel;
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (cancelBtn) {
        cancelBtn.remove();
    }
}

// --- EXPENSE / MATERIAL EDIT ---
function startEditExpense(docId, index) {
    if (!requireSupervisorAccess()) return;
    const entry = reportsData[index];
    if (!entry) return;

    // NEW: form 'page-dashboard' par hai — chahe aap kisi bhi page (Invoices, etc.) par ho,
    // pehle wahan jump karo warna form values chhupi hui screen par bharti rahengi.
    activatePage('page-dashboard');

    const nameDOM = document.getElementById('material-name');
    const costDOM = document.getElementById('material-cost');
    const qualityDOM = document.getElementById('material-quality');

    if (nameDOM) nameDOM.value = entry.name || '';
    if (costDOM) costDOM.value = entry.cost || 0;
    if (qualityDOM) qualityDOM.value = entry.status || qualityDOM.value;

    editingExpense = { docId: docId || null, index: index };
    setFormEditMode('log-form', true, cancelEditExpense);
}

function cancelEditExpense() {
    editingExpense = null;
    const form = document.getElementById('log-form');
    if (form) form.reset();
    setFormEditMode('log-form', false);
}

// --- LOCAL MODULES EDIT ---
function startEditLocal(collectionKey, index) {
    if (!requireSupervisorAccess()) return;
    const mod = LOCAL_MODULES[collectionKey];
    if (!mod) return;
    const entry = mod.data()[index];
    if (!entry) return;

    // NEW: har module ka apna page hai (Workforce, Permits, waghera) —
    // agar aap kisi doosre page par ho to pehle us module ke page par jump karo.
    activatePage(mod.pageId);

    // Har field ki purani value form me wapas bhar do
    Object.keys(mod.fields).forEach(dataKey => {
        const input = document.getElementById(mod.fields[dataKey]);
        if (input) input.value = entry[dataKey] !== undefined ? entry[dataKey] : '';
    });

    editingLocal = { key: collectionKey, index: index };
    setFormEditMode(mod.formId, true, cancelEditLocal);
}

function cancelEditLocal() {
    if (!editingLocal) return;
    const mod = LOCAL_MODULES[editingLocal.key];
    editingLocal = null;
    if (mod) {
        const form = document.getElementById(mod.formId);
        if (form) form.reset();
        setFormEditMode(mod.formId, false);
    }
}

// ================= UI RENDER IMPLEMENTATION PATTERNS =================

function renderReports() {
    const container = document.getElementById('material-reports-container');
    if (!container) return; 
    
    if (reportsData.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem; padding:10px;">No materials logged in cloud sequence yet.</p>`;
        return;
    }

    container.innerHTML = reportsData.map((r, idx) => `
        <div class="report-item ${r.type || 'passed'}">
            <div>
                <strong style="color: #fff; display:block; font-size:0.9rem;">${r.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">PKR ${Number(r.cost || 0).toLocaleString()} — Cloud Sync Verified</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                    (r.type === 'passed' || r.status === 'Passed') ? 'background:rgba(16,185,129,0.15); color:#34d399;' : 'background:rgba(245,158,11,0.15); color:#fbbf24;'
                }">${r.status}</span>
                ${buildEditButton(`startEditExpense('${r.docId || ''}', ${idx})`)}${buildDeleteButton(`deleteExpenseEntry('${r.docId || ''}', ${idx})`)}
            </div>
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
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                        isHeld ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' : 'background:rgba(16,185,129,0.15); color:#34d399;'
                    }">${isHeld ? 'Payment Held' : 'Paid'}</span>
                    ${buildEditButton(`startEditExpense('${r.docId || ''}', ${idx})`)}${buildDeleteButton(`deleteExpenseEntry('${r.docId || ''}', ${idx})`)}
                </div>
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

    container.innerHTML = workforceData.map((w, idx) => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${w.name} <span style="color:#64748b; font-weight:400;">— ${w.role}</span></strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Daily Wage: PKR ${Number(w.wage).toLocaleString()}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                    w.attendance === 'Present' ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                    w.attendance === 'Half Day' ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                    'background:rgba(248,113,113,0.15); color:#f87171;'
                }">${w.attendance}</span>
                ${buildEditButton(`startEditLocal('workforce', ${idx})`)}${buildDeleteButton(`deleteLocalEntry('workforce', ${idx})`)}
            </div>
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

    container.innerHTML = permitsData.map((p, idx) => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${p.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Authority: ${p.authority}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                    p.status === 'Approved' ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                    p.status === 'Pending' ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                    'background:rgba(248,113,113,0.15); color:#f87171;'
                }">${p.status}</span>
                ${buildEditButton(`startEditLocal('permits', ${idx})`)}${buildDeleteButton(`deleteLocalEntry('permits', ${idx})`)}
            </div>
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

    container.innerHTML = labTestsData.map((t, idx) => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${t.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">Material: ${t.material}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                    t.result === 'Pass' ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                    t.result === 'Pending' ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                    'background:rgba(248,113,113,0.15); color:#f87171;'
                }">${t.result}</span>
                ${buildEditButton(`startEditLocal('labtests', ${idx})`)}${buildDeleteButton(`deleteLocalEntry('labtests', ${idx})`)}
            </div>
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

    container.innerHTML = dailyReportsData.map((r, idx) => `
        <div class="report-item" style="align-items:flex-start;">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${r.date} — ${r.weather}</strong>
                <span style="font-size:0.8rem; color:#94a3b8; display:block; margin-top:4px;">${r.summary}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; background:rgba(34,211,238,0.15); color:#22d3ee; white-space:nowrap;">${r.workers} workers</span>
                ${buildEditButton(`startEditLocal('dailyreports', ${idx})`)}${buildDeleteButton(`deleteLocalEntry('dailyreports', ${idx})`)}
            </div>
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

    container.innerHTML = machineryData.map((m, idx) => `
        <div class="report-item">
            <div>
                <strong style="color:#fff; display:block; font-size:0.9rem;">${m.name}</strong>
                <span style="font-size:0.75rem; color:#94a3b8;">${m.category}</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:600; ${
                    goodStatuses.includes(m.status) ? 'background:rgba(16,185,129,0.15); color:#34d399;' :
                    warnStatuses.includes(m.status) ? 'background:rgba(245,158,11,0.15); color:#fbbf24;' :
                    'background:rgba(248,113,113,0.15); color:#f87171;'
                }">${m.status}</span>
                ${buildEditButton(`startEditLocal('machinery', ${idx})`)}${buildDeleteButton(`deleteLocalEntry('machinery', ${idx})`)}
            </div>
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

    // Global routing helpers (activatePage) ko in refs ka pata dedo taake
    // edit-jump (startEditExpense/startEditLocal) bhi inhi ko istemal kar sakein.
    navMenuItems = menuItems;
    navPageContents = pageContents;
    navCurrentViewTitle = currentViewTitle;
    navCurrentViewDesc = currentViewDesc;

    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPageId = item.getAttribute('data-target');
                activatePage(targetPageId); // ab poori routing logic yahi function karta hai
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
                type: qualityInput.toLowerCase().includes('warning') ? 'warning' : 'passed'
            };

            // ---------- UPDATE PATH (edit mode on hai) ----------
            if (editingExpense) {
                if (!requireSupervisorAccess()) { cancelEditExpense(); return; }
                if (typeof db !== 'undefined' && editingExpense.docId) {
                    try {
                        // .update() sirf ye fields badalta hai — timestamp waisa hi rehta hai
                        await db.collection("expenses").doc(editingExpense.docId).update(payload);
                        cancelEditExpense();
                    } catch (err) {
                        alert("Cloud update failure: " + err.message);
                    }
                } else {
                    const old = reportsData[editingExpense.index] || {};
                    reportsData[editingExpense.index] = Object.assign({}, old, payload);
                    // total ko poori list se dobara jorho — safest tareeqa
                    appState.totalExpensesLogged = reportsData.reduce((sum, r) => sum + (parseInt(r.cost) || 0), 0);
                    cancelEditExpense();
                    syncGlobalDOMStats();
                    renderReports();
                    renderPhaseTracker();
                    renderInvoices();
                }
                return;
            }

            // ---------- ADD PATH (normal nayi entry) ----------
            payload.timestamp = typeof firebase !== 'undefined' ? firebase.firestore.FieldValue.serverTimestamp() : new Date();

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

    // ---------- GENERIC FORM HANDLER FOR ALL LOCAL MODULES ----------
    // Pehle har module ka apna alag submit handler tha. Ab aik hi handler
    // LOCAL_MODULES registry padh kar sab ke liye add + update dono karta hai.
    Object.keys(LOCAL_MODULES).forEach(key => {
        const mod = LOCAL_MODULES[key];
        const form = document.getElementById(mod.formId);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Form ke inputs se aik object banao
            const entry = {};
            Object.keys(mod.fields).forEach(dataKey => {
                const input = document.getElementById(mod.fields[dataKey]);
                const raw = input ? input.value : '';
                entry[dataKey] = mod.numericFields.includes(dataKey) ? (parseInt(raw) || 0) : raw;
            });

            if (editingLocal && editingLocal.key === key) {
                if (!requireSupervisorAccess()) { cancelEditLocal(); return; }
                // UPDATE: purani entry ki jagah nayi values rakho (date jaisi auto fields bacha kar)
                const old = mod.data()[editingLocal.index] || {};
                mod.data()[editingLocal.index] = Object.assign({}, old, entry);
                cancelEditLocal();
            } else {
                // ADD: nayi entry list ke shuru me
                if (mod.autoDate) entry.date = new Date().toLocaleDateString();
                mod.data().unshift(entry);
                form.reset();
            }

            mod.render();
        });
    });

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

                // Logout ke waqt agar koi edit chal raha ho to cancel karo,
                // aur saari lists dobara draw karo taake edit/delete buttons ghayab ho jayein.
                if (editingExpense) cancelEditExpense();
                if (editingLocal) cancelEditLocal();
                renderAllLists();
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
                renderAllLists(); // login ho gaya — ab edit/delete buttons nazar aayein
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
