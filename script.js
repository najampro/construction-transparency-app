// ================= BUILDTRACK CORE SYSTEM ARCHITECTURE ENGINE =================

// 1. CLOUD STORAGE MATRIX INITIALIZATION (FIREBASE CONFIGURATION)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
                logForm.reset();
            }
        });
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
            appState.isLoggedIn = true;
            if (userDisplayName) userDisplayName.textContent = "Najam (Supervisor)";
            if (authActionText) {
                authActionText.textContent = "Click to Logout";
                authActionText.style.color = "#f87171";
            }
            if (avatarLetters) avatarLetters.textContent = "N";
            if (accountAuthModal) accountAuthModal.classList.remove('active');
            
            const pinInput = document.getElementById('auth-pin-input');
            if (pinInput) pinInput.value = "";
        });
    }

    // AI Logic
    const btnTriggerAI = document.getElementById('btn-trigger-ai');
    const aiInputQuery = document.getElementById('ai-input-query');
    const aiResponseBox = document.getElementById('ai-response-box');

    if (btnTriggerAI && aiInputQuery && aiResponseBox) {
        btnTriggerAI.addEventListener('click', function(e) {
            e.preventDefault(); 
            const query = aiInputQuery.value.trim();
            if (!query) return alert("Please type your query first!");

            btnTriggerAI.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Matrix...`;
            btnTriggerAI.disabled = true;
            aiResponseBox.style.display = "block";
            aiResponseBox.innerHTML = `<em>Connecting database... Please wait.</em>`;

            const isRomanOrUrdu = /[\u0600-\u06FF]/.test(query) || 
                                 query.toLowerCase().includes('kaise') || 
                                 query.toLowerCase().includes('kya') || 
                                 query.toLowerCase().includes('kam');

            setTimeout(() => {
                btnTriggerAI.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Consult AI`;
                btnTriggerAI.disabled = false;
                
                if (isRomanOrUrdu) {
                    aiResponseBox.innerHTML = `
                        <div style="border-left: 3px solid #22d3ee; padding-left: 12px; text-align: left; line-height: 1.6;">
                            <strong style="color: #22d3ee; font-size:0.95rem;"><i class="fa-solid fa-circle-check"></i> BuildTrack AI (Roman Urdu):</strong><br><br>
                            Aapki query <strong>"${query}"</strong> k mutabik cost optimization k liye <strong>Grade-60 Steel</strong> behtareen hai aur direct factory mills se lena 12% tak bachat dega.
                        </div>`;
                } else {
                    aiResponseBox.innerHTML = `
                        <div style="border-left: 3px solid #22d3ee; padding-left: 12px; text-align: left; line-height: 1.6;">
                            <strong style="color: #22d3ee; font-size:0.95rem;"><i class="fa-solid fa-circle-check"></i> BuildTrack AI Response:</strong><br><br>
                            For <strong>"${query}"</strong>: Direct bulk mill procurement saves 12% on Grade-60 deformed steel rebars.
                        </div>`;
                }
            }, 1000);
        });
    }
});
