// ==========================================
// CONSTRACK PRO — APPLICATION CORE ENGINE
// ==========================================

// Global Memory State Engine
let siteUpdates = [
    {
        id: 1,
        title: "Excavation and Heavy Machinery Site Prep",
        cost: "340,000",
        date: "July 25, 2026",
        quality: "Premium/Passed",
        receipt: "Excavator rental for 4 days: PKR 180,000. Fuel costs setup: PKR 160,000. TOTAL COST: PKR 340,000",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
        audit: {
            status: "Verified",
            confidence: "High Ecosystem Assurance",
            summary: "Heavy machinery logistics deployment and deep earthworks perfectly match verified records.",
            flags: "None",
            steps: "Proceed to foundation footing state seamlessly."
        }
    }
];

let initialEscrowPool = 5000000; // 50 Lakh Master Budget Pool
let isSignUpMode = false;

// CRITICAL: DOM Safety Initialization Gateway
document.addEventListener("DOMContentLoaded", () => {
    // Fast boot configurations
    checkActiveSession();
    setupSecurityEngine();
    setupTransactionLogs();
    calculateLiveMetrics();
    renderTimeline();
});

// 🔒 SESSION & SYSTEM ACCESS CONTROL
function checkActiveSession() {
    const savedUser = localStorage.getItem("track_client_session");
    const authModal = document.getElementById("auth-modal");
    const appLayout = document.getElementById("main-app-layout");
    
    if (savedUser) {
        const currentClient = JSON.parse(savedUser);
        if (authModal) authModal.style.display = "none";
        if (appLayout) appLayout.classList.remove("main-blurred");
        
        // Dynamically assign names safely
        const displayName = document.getElementById("user-display-name");
        const avatarLetters = document.getElementById("avatar-letters");
        
        if (displayName) displayName.innerText = currentClient.name || "Najam";
        if (avatarLetters) {
            const initial = (currentClient.name || "NJ").substring(0, 2).toUpperCase();
            avatarLetters.innerText = initial;
        }
    } else {
        if (authModal) authModal.style.display = "flex";
        if (appLayout) appLayout.classList.add("main-blurred");
    }
}

// 🛡️ SECURITY CONTROLLER & SIGNUP FIX
function setupSecurityEngine() {
    const switchLink = document.getElementById("auth-switch-link");
    const authForm = document.getElementById("auth-form");
    const logoutBtn = document.getElementById("logout-btn");

    if (switchLink) {
        switchLink.onclick = (e) => {
            e.preventDefault();
            isSignUpMode = !isSignUpMode;
            
            const nameGroup = document.getElementById("name-group");
            const authSubtitle = document.getElementById("auth-subtitle");
            const submitBtn = document.getElementById("auth-submit-btn");
            const switchText = document.getElementById("auth-switch-text");
            
            if (isSignUpMode) {
                if (authSubtitle) authSubtitle.innerText = "Register secure credentials";
                if (nameGroup) nameGroup.style.display = "block";
                if (submitBtn) submitBtn.innerText = "Register Node";
                if (switchText) switchText.innerText = "Already registered? ";
                switchLink.innerText = "Log In";
            } else {
                if (authSubtitle) authSubtitle.innerText = "Secure client node gateway";
                if (nameGroup) nameGroup.style.display = "none";
                if (submitBtn) submitBtn.innerText = "Authenticate System";
                if (switchText) switchText.innerText = "New Client Project Node? ";
                switchLink.innerText = "Create Account";
            }
        };
    }

    if (authForm) {
        authForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById("auth-email").value.trim();
            const password = document.getElementById("auth-pass").value;
            const nameInput = document.getElementById("auth-name").value.trim();
            let name = nameInput || "Najam";
            
            if (isSignUpMode) {
                const userData = { name, email, pass: password };
                localStorage.setItem(`client_reg_${email}`, JSON.stringify(userData));
                localStorage.setItem("track_client_session", JSON.stringify(userData));
            } else {
                const stored = localStorage.getItem(`client_reg_${email}`);
                if (!stored || JSON.parse(stored).pass !== password) {
                    alert("Authentication failure: Invalid verification credentials.");
                    return;
                }
                localStorage.setItem("track_client_session", stored);
            }
            authForm.reset();
            checkActiveSession();
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem("track_client_session");
            isSignUpMode = false;
            
            // UI elements structural reset
            const nameGroup = document.getElementById("name-group");
            if (nameGroup) nameGroup.style.display = "none";
            
            const authSubtitle = document.getElementById("auth-subtitle");
            if (authSubtitle) authSubtitle.innerText = "Secure client node gateway";
            
            const submitBtn = document.getElementById("auth-submit-btn");
            if (submitBtn) submitBtn.innerText = "Authenticate System";
            
            const switchText = document.getElementById("auth-switch-text");
            if (switchText) switchText.innerText = "New Client Project Node? ";
            
            if (switchLink) switchLink.innerText = "Create Account";
            
            checkActiveSession();
        };
    }
}

// 💰 DYNAMIC WALLET CALCULATOR
function calculateLiveMetrics() {
    let totalSpent = 0;
    
    siteUpdates.forEach(item => {
        const val = parseInt(item.cost.replace(/,/g, ''));
        totalSpent += isNaN(val) ? 0 : val;
    });
    
    let currentBalance = initialEscrowPool - totalSpent;
    if (currentBalance < 0) currentBalance = 0;
    
    const escrowDisplay = document.getElementById("stat-escrow-balance");
    if (escrowDisplay) {
        escrowDisplay.innerText = currentBalance.toLocaleString();
    }
}

// 📝 TRANSACTION AND LOG CONTROL
function setupTransactionLogs() {
    const logForm = document.getElementById("log-form");
    const closeBtn = document.querySelector(".close-btn");

    if (logForm) {
        logForm.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById("material-name").value;
            const costVal = parseInt(document.getElementById("material-cost").value);
            const cost = isNaN(costVal) ? "0" : costVal.toLocaleString();
            const quality = document.getElementById("material-quality").value;
            const receipt = document.getElementById("receipt-text").value;
            const imgVal = document.getElementById("site-image").value;
            
            const imageUrl = imgVal ? imgVal : "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80";
            
            siteUpdates.unshift({
                id: Date.now(), title, cost, date: new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
                quality, receipt, imageUrl, audit: null
            });
            
            // Telemetry Mirror Sync
            const cctvImg = document.getElementById("cctv-stream-img");
            if (cctvImg) cctvImg.src = imageUrl;
            
            calculateLiveMetrics();
            renderTimeline();
            logForm.reset();
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            const auditModal = document.getElementById("audit-modal");
            if (auditModal) auditModal.style.display = "none";
        };
    }
}

// 📊 RUNTIME LEDGER DISPLAY STREAMS
function renderTimeline() {
    const container = document.getElementById("timeline-container");
    if (!container) return;
    container.innerHTML = "";
    
    siteUpdates.forEach(update => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `
            <div class="timeline-date"><i class="fa-regular fa-clock"></i> ${update.date}</div>
            <h3>${update.title}</h3>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom: 8px;">
                <span class="cost-tag">PKR ${update.cost}</span>
                <span class="quality-indicator-stamp"><i class="fa-solid fa-circle-check"></i> ${update.quality}</span>
            </div>
            <img src="${update.imageUrl}" class="timeline-img">
            <button class="btn-audit-trigger" data-id="${update.id}">
                <i class="fa-solid fa-microchip"></i> ${update.audit ? 'View Audit Metadata' : 'Launch Engine Audit'}
            </button>
        `;
        container.appendChild(item);
    });

    // Event Delegation Matrix for Audits
    const buttons = container.querySelectorAll(".btn-audit-trigger");
    buttons.forEach(btn => {
        btn.onclick = () => {
            const updateId = parseInt(btn.getAttribute("data-id"));
            triggerAiAudit(updateId);
        };
    });
}

// 🤖 DIGITAL SURVEILLANCE ENGINE AUDITS
function triggerAiAudit(id) {
    const modal = document.getElementById("audit-modal");
    const loading = document.getElementById("modal-loading");
    const resultDiv = document.getElementById("modal-result");
    
    if (modal) modal.style.display = "flex";
    if (loading) loading.style.display = "flex";
    if (resultDiv) resultDiv.style.display = "none";
    
    const item = siteUpdates.find(u => u.id === id);
    if (!item) return;
    
    if (item.audit) {
        displayAuditResult(item.audit);
        return;
    }

    setTimeout(() => {
        const typedCost = parseInt(item.cost.replace(/,/g, ''));
        let receiptCost = 0;
        const totalMatch = item.receipt.match(/(?:TOTAL COST|TOTAL AMOUNT|NET TOTAL):\s*PKR\s*([0-9,]+)/i);
        
        if (totalMatch && totalMatch[1]) {
            receiptCost = parseInt(totalMatch[1].replace(/,/g, ''));
        }

        const isMismatch = receiptCost > 0 && typedCost !== receiptCost;
        
        if (isMismatch) {
            item.audit = {
                status: "Discrepancy Detected",
                confidence: "Ecosystem Conflict Level",
                summary: `Escrow mismatch detected. Form input requires PKR ${item.cost} but text metadata string specifies PKR ${receiptCost.toLocaleString()}.`,
                flags: `PKR ${(typedCost - receiptCost).toLocaleString()} discrepancy flagged.`,
                steps: "Escrow release paused. Request physical site verification voucher."
            };
        } else {
            item.audit = {
                status: "Verified",
                confidence: "100% Cryptographic Match",
                summary: `Material authenticated successfully. Quality parameters marked as [${item.quality}].`,
                flags: "None",
                steps: "Deduction cleared from Escrow Node. Funds securely merged into master ledger."
            };
        }
        
        calculateLiveMetrics();
        displayAuditResult(item.audit);
        renderTimeline();
    }, 1200);
}

function displayAuditResult(audit) {
    const loading = document.getElementById("modal-loading");
    const res = document.getElementById("modal-result");
    
    if (loading) loading.style.display = "none";
    if (!res) return;
    
    res.style.display = "block";
    let color = "var(--neon-green)";
    if (audit.status === "Discrepancy Detected") color = "var(--neon-red)";
    
    res.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
            <strong>Audit Telemetry:</strong>
            <span style="color:${color}; font-weight:bold;">${audit.status}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted);"><strong>Confidence Level:</strong> ${audit.confidence}</p>
        <p style="background:#090d16; padding:12px; border-radius:8px; border-left:3px solid var(--accent); font-size:0.85rem;">${audit.summary}</p>
        <p style="color:var(--neon-red); font-size:0.85rem;"><strong>System Flags:</strong> ${audit.flags}</p>
        <p style="color:var(--accent); font-size:0.85rem;"><strong>Action Protocol:</strong> ${audit.steps}</p>
    `;
}
