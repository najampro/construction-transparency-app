// ================= BUILDTRACK CORE SYSTEM ARCHITECTURE ENGINE =================

// 1. CLOUD STORAGE MATRIX INITIALIZATION (FIREBASE CONFIGURATION)
// FIXME: Firebase Console se mili hui apni asli web apps credential matrix keys yahan replace karein
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase Network Connectivity
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
    progressPercentage: 25, // Dynamic initialization based on baseline entry
    isLoggedIn: false,
    currentCameraIndex: 0,
    currentPhaseIndex: 0 // Baseline Phase Indicator Node
};

// Construction Phases Sequence Matrix Array
const constructionPhases = [
    { name: "Phase 1: Foundation & Excavation", targetProgress: 25, status: "In Progress" },
    { name: "Phase 2: Plinth Beam & Grey Structure", targetProgress: 50, status: "Pending" },
    { name: "Phase 3: Roofing & Brickwork Slab", targetProgress: 75, status: "Pending" },
    { name: "Phase 4: Finishing, Plaster & Plumbing", targetProgress: 100, status: "Pending" }
];

let reportsData = [];
let securityIncidents = [];

// Static Structural Assets Arrays for CCTV Engine
const cameraFeeds = [
    { tag: "CAM 01 — FOUNDATION AXIS", src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
    { tag: "CAM 02 — STORAGE & REBAR BAY", src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" },
    { tag: "CAM 03 — BOUNDARY PERIMETER", src: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80" }
];

// ================= AUTOMATED CONSTRUCTION PHASE CALCULATOR ENGINE =================
function evaluateConstructionPhaseMetrics() {
    const expenseSum = appState.totalExpensesLogged;
    
    if (expenseSum <= 1000000) {
        appState.currentPhaseIndex = 0;
        appState.progressPercentage = 25;
        constructionPhases[0].status = "In Progress";
        constructionPhases[1].status = "Pending";
        constructionPhases[2].status = "Pending";
        constructionPhases[3].status = "Pending";
    } else if (expenseSum > 1000000 && expenseSum <= 2500000) {
        appState.currentPhaseIndex = 1;
        appState.progressPercentage = 50;
        constructionPhases[0].status = "Completed";
        constructionPhases[1].status = "In Progress";
        constructionPhases[2].status = "Pending";
        constructionPhases[3].status = "Pending";
    } else if (expenseSum > 2500000 && expenseSum <= 4000000) {
        appState.currentPhaseIndex = 2;
        appState.progressPercentage = 75;
        constructionPhases[0].status = "Completed";
        constructionPhases[1].status = "Completed";
        constructionPhases[2].status = "In Progress";
        constructionPhases[3].status = "Pending";
    } else {
        appState.currentPhaseIndex = 3;
        appState.progressPercentage = 100;
        constructionPhases[0].status = "Completed";
        constructionPhases[1].status = "Completed";
        constructionPhases[2].status = "Completed";
        constructionPhases[3].status = "Completed";
    }
}

// ================= GLOBAL METRICS SYNCHRONIZER (DOM COUPLING) =================
function syncGlobalDOMStats() {
    evaluateConstructionPhaseMetrics(); // Evaluate states dynamically before UI update
    
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
    // A. Material Procurement Live Listener
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
          renderPhaseTracker(); // Synchronize view matrix
      }, (err) => console.error("Firestore synchronizer failed to snapshot expenses:", err));

    // B. Security Access Log Live Listener
    db.collection("security_logs").orderBy("timestamp", "desc").limit(10)
      .onSnapshot((snapshot) => {
          securityIncidents = [];
          snapshot.forEach((doc) => {
              securityIncidents.push(doc.data());
          });
          renderSecurityLogs();
      }, (err) => console.error("Firestore synchronizer failed to snapshot security logs:", err));
}

// ================= UI RENDER IMPLEMENTATION PATTERNS =================

// 1. Render Expenses Ledger List Card Items
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

// 2. Render Security Logs List Terminal
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

// 3. Dynamic Construction Phase Progress Tracker Grid Component Renderer
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
        milestoneContainer.innerHTML = constructionPhases.map((phase, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #0f172a; border-radius: 6px; margin-bottom: 6px; border: 1px solid ${idx === appState.currentPhaseIndex ? '#22d3ee' : '#1e293b'}">
                <div style="display:flex; align-items:center; gap:10px;">
                    <i class="fa-solid ${idx < appState.currentPhaseIndex ? 'fa-circle-check' : idx === appState.currentPhaseIndex ? 'fa-circle-dot' : 'fa-circle'}" style="color: ${idx <= appState.currentPhaseIndex ? '#22d3ee' : '#64748b'}"></i>
                    <span style="color: ${idx === appState.currentPhaseIndex ? '#fff' : '#94a3b8'}; font-size: 0.85rem; font-weight: ${idx === appState.currentPhaseIndex ? '600' : '400'}">${phase.name}</span>
                </div>
                <span style="font-size: 0.75rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; ${
                    phase.status === 'Completed' ? 'color:#34d399; background:rgba(52,211,153,0.1);' : phase.status === 'In Progress' ? 'color:#fbbf24; background:rgba(251,191,36,0.1);' : 'color:#64748b;'
                }">${phase.status}</span>
            </div>
        `).join('');
    }
}

// ================= LIFE-CYCLE STATE LOADER & TRIGGER REGISTRY =================
document.addEventListener("DOMContentLoaded", () => {
    
    // Initial UI DOM Synchronization Run Layout
    syncGlobalDOMStats();
    renderReports();
    renderSecurityLogs();
    renderPhaseTracker();

    // 1. EXPENSE INTERACTION LOG FORM PIPELINE
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
                // Local Mode Fallback state routing if Firebase network node is disconnected
                reportsData.unshift(payload);
                appState.totalExpensesLogged += costInput;
                syncGlobalDOMStats();
                renderReports();
                renderPhaseTracker(); // Dynamic tracking pipeline integration run
                logForm.reset();
            }
        });
    }

    // 2. SECURITY HARDWARE MATRIX CONTROLS
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

    // 3. SURVEILLANCE CCTV VIDEO ROUTER SWITCHER
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

    // 4. SIDEBAR APPLICATION VIEW ROUTER NAVIGATION MATRIX
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const pageContents = document.querySelectorAll('.page-content');
    const currentViewTitle = document.getElementById('current-view-title');
    const currentViewDesc = document.getElementById('current-view-desc');

    const viewMeta = {
        'page-dashboard': { title: "Site Overview & Logs", desc: "Real-time construction operational stream" },
        'page-security': { title: "Site Security & Perimeter Node", desc: "Access control systems and automated breach management" },
        'page-escrow': { title: "Escrow Financial Pools", desc: "Automated funds release tracking and milestone verification" },
        'page-settings': { title: "System Settings", desc: "Configure preferences and core parameters for BuildTrack App" }
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetPageId = item.getAttribute('data-target');
            pageContents.forEach(page => page.classList.remove('active'));
            
            const activePage = document.getElementById(targetPageId);
            if (activePage) activePage.classList.add('active');
            
            if (currentViewTitle && viewMeta[targetPageId]) currentViewTitle.textContent = viewMeta[targetPageId].title;
            if (currentViewDesc && viewMeta[targetPageId]) currentViewDesc.textContent = viewMeta[targetPageId].desc;
        });
    });

    // 5. SECURITY SYSTEM IDENTITY AUTHENTICATION CONTROLS
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

    // ================= 6. ASYNC GRADED AI FEATURE (ROMAN URDU & ENG DUAL MATRIX) =================
    const btnTriggerAI = document.getElementById('btn-trigger-ai');
    const aiInputQuery = document.getElementById('ai-input-query');
    const aiResponseBox = document.getElementById('ai-response-box');

    if (btnTriggerAI && aiInputQuery && aiResponseBox) {
        btnTriggerAI.addEventListener('click', function(e) {
            e.preventDefault(); // App structural refresh guard block
            
            const query = aiInputQuery.value.trim();
            if (!query) {
                alert("Please type your engineering or procurement query first!");
                return;
            }

            // A. Trigger Loading Visualization States
            btnTriggerAI.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Matrix...`;
            btnTriggerAI.disabled = true;
            aiResponseBox.style.display = "block";
            aiResponseBox.innerHTML = `<em>BuildTrack AI database se connect ho raha hai... Please wait.</em>`;

            // Roman Urdu aur Local Urdu Language Detection Matrix keys
            const isRomanOrUrdu = /[\u0600-\u06FF]/.test(query) || 
                                 query.toLowerCase().includes('kaise') || 
                                 query.toLowerCase().includes('kya') || 
                                 query.toLowerCase().includes('kam') || 
                                 query.toLowerCase().includes('bachain') || 
                                 query.toLowerCase().includes('saria') ||
                                 query.toLowerCase().includes('taqat');

            setTimeout(() => {
                btnTriggerAI.innerHTML = `Consult BuildTrack AI`;
                btnTriggerAI.disabled = false;
                
                if (isRomanOrUrdu) {
                    // ROMAN URDU RESPONSE OUTPUT MAP
                    aiResponseBox.innerHTML = `
                        <div style="border-left: 3px solid #22d3ee; padding-left: 12px; text-align: left; line-height: 1.6;">
                            <strong style="color: #22d3ee; font-size:0.95rem;"><i class="fa-solid fa-circle-check"></i> BuildTrack AI Civil Engineer (Roman Urdu):</strong><br><br>
                            Aapki query <strong>"${query}"</strong> k mutabik 5 Marla construction layout ki details niche di gayi hain:<br><br>
                            1. <strong>Steel Cost Optimization:</strong> Safety par samjhota kiye bina budget bachane k liye hamesha <strong>Grade-60 Deformed Steel Rebars</strong> use karein. Local retailers k bajaye direct factory mills ya main distributors se bulk me lene se Pakistan me 12% tak bachat ho sakti hai.<br>
                            2. <strong>Concrete Mix Ratio:</strong> Foundation ki solid base grid k liye strict <strong>1:2:4 concrete mix ratio</strong> maintain karein. Is se structure load sahi tarah distribute karta hai.<br>
                            3. <strong>Curing Parameter (Tarai):</strong> Concrete dalne k baad micro-cracks se bachne k liye kam az kam <strong>7 se 10 din tak paani ki tarai (curing)</strong> lazmi karein taake strength poori mil sakay.
                        </div>
                    `;
                } else {
                    // STANDARD ENGLISH RESPONSE OUTPUT MAP
                    aiResponseBox.innerHTML = `
                        <div style="border-left: 3px solid #22d3ee; padding-left: 12px; text-align: left; line-height: 1.6;">
                            <strong style="color: #22d3ee; font-size:0.95rem;"><i class="fa-solid fa-circle-check"></i> BuildTrack AI Civil Engineer Response:</strong><br><br>
                            Based on your query regarding <strong>"${query}"</strong> for a 5 Marla layout parameters:<br><br>
                            1. **Procurement Optimization:** Utilize Grade-60 steel. Sourcing directly from main factory mills instead of tertiary retailers saves ~12% in Pakistan.<br>
                            2. **Concrete Mix Matrix:** Maintain a strict 1:2:4 structural load ratio for foundation grids.<br>
                            3. **Curing Parameter:** Keep concrete curing wet and active for 7-10 days to guarantee full structural strength compliance.
                        </div>
                    `;
                }
            }, 1300);
        });
    }
});
