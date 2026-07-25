// ==========================================
// 1. INITIAL MOCK DATA (Project Base Logs)
// ==========================================
let siteUpdates = [
    {
        id: 1,
        title: "Excavation and Heavy Machinery Site Prep",
        cost: "340,000",
        date: "July 25, 2026",
        receipt: "Excavator rental for 4 days: PKR 180,000. Fuel costs and manual labor dump setup: PKR 160,000.",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
        audit: {
            status: "Verified",
            confidence: "High",
            summary: "Heavy machinery deployment and deep earthworks match the logged logistics cost metrics.",
            flags: "None",
            steps: "Proceed to foundation footing concreting."
        }
    }
];

// ==========================================
// 2. DOM CONTENT LOADED (Initialization)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("System Initialized Successfully in Offline Simulation Mode!");
    
    // Initial Render
    renderTimeline();
    
    // Handle Form Submission
    const logForm = document.getElementById("log-form");
    if (logForm) {
        logForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const title = document.getElementById("material-name").value;
            const costVal = parseInt(document.getElementById("material-cost").value);
            const cost = isNaN(costVal) ? "0" : costVal.toLocaleString();
            const receipt = document.getElementById("receipt-text").value;
            
            // Image handling with fallback
            const imageInput = document.getElementById("site-image").value;
            const imageUrl = imageInput ? imageInput : "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80";
            
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            
            const newUpdate = {
                id: Date.now(),
                title,
                cost,
                date,
                receipt,
                imageUrl,
                audit: null
            };
            
            siteUpdates.unshift(newUpdate);
            renderTimeline();
            logForm.reset();
        });
    }

    // Modal Close Action
    const closeBtn = document.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("audit-modal").style.display = "none";
        });
    }
});

// ==========================================
// 3. RENDER TIMELINE FUNCTION
// ==========================================
function renderTimeline() {
    const container = document.getElementById("timeline-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    siteUpdates.forEach(update => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.style.borderLeft = "3px solid #4a5568";
        item.style.paddingLeft = "15px";
        item.style.marginBottom = "20px";
        
        item.innerHTML = `
            <div style="font-size: 0.85rem; color:#718096;"><i class="far fa-calendar-alt"></i> ${update.date}</div>
            <h3 style="margin: 5px 0;">${update.title}</h3>
            <p style="font-weight:600; color:#2f855a; margin: 2px 0;">Cost: PKR ${update.cost}</p>
            <p style="font-size:0.9rem; color:#4a5568;"><strong>Receipt Log:</strong> ${update.receipt}</p>
            <img src="${update.imageUrl}" alt="Progress Image" style="max-width:100%; max-height:250px; border-radius:6px; margin: 8px 0; display:block;">
            <div style="margin-top: 8px;">
                <button style="cursor:pointer; padding: 6px 12px; background:#2b6cb0; color:white; border:none; border-radius:4px;" onclick="triggerAiAudit(${update.id})">
                    <i class="fas fa-shield-halved"></i> ${update.audit ? 'View Audit Report' : 'Run AI System Audit'}
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// ==========================================
// 4. OFFLINE SIMULATION AUDIT (No API Key Needed)
// ==========================================
function triggerAiAudit(id) {
    const modal = document.getElementById("audit-modal");
    const loading = document.getElementById("modal-loading");
    const resultDiv = document.getElementById("modal-result");
    
    modal.style.display = "flex";
    loading.style.display = "block";
    resultDiv.style.display = "none";
    
    const item = siteUpdates.find(u => u.id === id);
    if (!item) return;
    
    // Agar pehle se audit ho chuka hai, to direct report dikhao
    if (item.audit) {
        displayAuditResult(item.audit);
        return;
    }

    // AI ka intezar karne ka effect (1.5 seconds delay)
    setTimeout(() => {
        const numericCost = parseInt(item.cost.replace(/,/g, ''));
        
        // Logic: Agar cost 5,00,000 se zyada hogi to Discrepancy (Error) dega, warna Verified dega
        const hasIssue = numericCost > 500000; 
        
        item.audit = {
            status: hasIssue ? "Discrepancy Detected" : "Verified",
            confidence: "High (System Simulation)",
            summary: hasIssue 
                ? "Warning: The logged cost exceeds the standard market metrics based on the receipt data provided." 
                : "Automated verification complete. Logged material quantities and costs align perfectly with market standards.",
            flags: hasIssue ? "Cost inflation detected. Possible over-billing." : "None",
            steps: hasIssue ? "Request original physical counter-foil from project vendor immediately." : "Approve and lock batch record entry."
        };
        
        displayAuditResult(item.audit);
        updateDashboardBadge(item.audit.status);
        renderTimeline(); // Button ka text update karne ke liye
    }, 1500);
}

// ==========================================
// 5. HELPER UI DISPLAY FUNCTIONS
// ==========================================
function displayAuditResult(audit) {
    const loading = document.getElementById("modal-loading");
    const resultDiv = document.getElementById("modal-result");
    
    loading.style.display = "none";
    resultDiv.style.display = "block";
    
    let badgeColor = "#2f855a"; // Green
    if (audit.status === "Caution") badgeColor = "#dd6b20"; // Orange
    if (audit.status === "Discrepancy Detected") badgeColor = "#e53e3e"; // Red
    
    resultDiv.innerHTML = `
        <div style="margin: 1rem 0; display:flex; justify-content:space-between; align-items:center;">
            <strong>Integrity Check:</strong> 
            <span style="background:${badgeColor}; color:white; padding:4px 8px; border-radius:4px; font-size:0.85rem; font-weight:bold;">${audit.status}</span>
        </div>
        <p><strong>Confidence Rating:</strong> ${audit.confidence}</p>
        <p style="margin: 0.8rem 0; padding:10px; background:#f7fafc; border-left:4px solid #4a5568; font-size:0.95rem;">
            <strong>Analysis Summary:</strong> ${audit.summary}
        </p>
        <p style="color:#c53030;"><strong>Flags Raised:</strong> ${audit.flags}</p>
        <p style="margin-top:0.5rem; color:#2b6cb0;"><strong>Next Steps:</strong> ${audit.steps}</p>
    `;
}

function updateDashboardBadge(status) {
    const badge = document.getElementById("audit-status-badge");
    if (!badge) return;
    
    badge.innerText = status;
    if(status === "Verified") badge.style.color = "#2f855a";
    if(status === "Caution") badge.style.color = "#dd6b20";
    if(status === "Discrepancy Detected") badge.style.color = "#e53e3e";
}
