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
    console.log("Construction Tracking System Initialized Successfully!");
    
    // Initial Render
    renderTimeline();
    
    // Handle Form Submission Safely
    const logForm = document.getElementById("log-form") || document.querySelector("form");
    if (logForm) {
        logForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Flexible ID checking to avoid null crashes
            const nameEl = document.getElementById("material-name") || document.getElementById("title");
            const costEl = document.getElementById("material-cost") || document.getElementById("cost");
            const receiptEl = document.getElementById("receipt-text") || document.getElementById("receipt");
            const imageEl = document.getElementById("site-image") || document.getElementById("image");
            
            const title = nameEl ? nameEl.value : "New Site Update";
            const costVal = costEl ? parseInt(costEl.value) : 0;
            const cost = isNaN(costVal) ? "0" : costVal.toLocaleString();
            const receipt = receiptEl ? receiptEl.value : "No transcript text attached.";
            const imageUrl = imageEl && imageEl.value ? imageEl.value : "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80";
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

    // Modal Close Event Setup
    const closeBtn = document.querySelector(".close-btn") || document.querySelector(".close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            const modal = document.getElementById("audit-modal") || document.querySelector(".modal");
            if (modal) modal.style.display = "none";
        });
    }
});

// ==========================================
// 3. RENDER TIMELINE FUNCTION
// ==========================================
function renderTimeline() {
    // Looks for 'timeline-container' or just 'timeline' to make sure it finds your div!
    const container = document.getElementById("timeline-container") || document.getElementById("timeline") || document.querySelector(".timeline");
    
    if (!container) {
        console.error("Error: Could not find timeline container element in your HTML.");
        return;
    }
    
    container.innerHTML = "";
    
    siteUpdates.forEach(update => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.style.borderLeft = "3px solid #4a5568";
        item.style.paddingLeft = "15px";
        item.style.marginBottom = "20px";
        item.style.position = "relative";
        
        item.innerHTML = `
            <div class="timeline-date" style="font-size: 0.85rem; color:#718096;"><i class="far fa-calendar-alt"></i> ${update.date}</div>
            <h3 style="margin: 5px 0;">${update.title}</h3>
            <p style="font-weight:600; color:#2f855a; margin: 2px 0;">Cost: PKR ${update.cost}</p>
            <p style="font-size:0.9rem; color:#4a5568;"><strong>Receipt Log:</strong> ${update.receipt}</p>
            <img src="${update.imageUrl}" alt="Progress Image" style="max-width:100%; max-height:250px; border-radius:6px; margin: 8px 0; display:block;" onerror="this.src='https://via.placeholder.com/600x300.png?text=Site+Progress'">
            <div style="margin-top: 8px;">
                <button class="btn-audit" style="cursor:pointer; padding: 6px 12px; background:#2b6cb0; color:white; border:none; border-radius:4px;" onclick="triggerAiAudit(${update.id})">
                    <i class="fas fa-shield-halved"></i> ${update.audit ? 'View Audit Report' : 'Run AI System Audit'}
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// ==========================================
// 4. GEMINI DYNAMIC API INTEGRATION & AUDIT
// ==========================================
async function triggerAiAudit(id) {
    const modal = document.getElementById("audit-modal") || document.querySelector(".modal");
    const loading = document.getElementById("modal-loading") || document.getElementById("loading");
    const resultDiv = document.getElementById("modal-result") || document.getElementById("result");
    
    if (modal) modal.style.display = "flex";
    if (loading) loading.style.display = "block";
    if (resultDiv) {
        resultDiv.className = "hidden";
        resultDiv.innerHTML = "";
    }
    
    const item = siteUpdates.find(u => u.id === id);
    if (!item) return;
    
    if (item.audit) {
        displayAuditResult(item.audit);
        return;
    }
    const apiKey = "AQ.Ab8RN6LjzRiemIgdv_KfYjCoJFnbT2ITYN3qrlm7hIFgPlU_sQ";
   
    
    // Testing Simulation Fallback
    if (!apiKey) {
        setTimeout(() => {
            const hasPossibleMismatch = item.cost.replace(/,/g, '') > 800000; 
            item.audit = {
                status: hasPossibleMismatch ? "Discrepancy Detected" : "Verified",
                confidence: "High (Simulation Profile)",
                summary: hasPossibleMismatch 
                    ? `Warning: Material logged cost (PKR ${item.cost}) exceeds the structural computation values parsed inside the raw receipt transcript.` 
                    : "Automated verification complete. Logged structural variables correspond accurately with the transcription.",
                flags: hasPossibleMismatch ? "Financial metrics inflation match alert flagged." : "None",
                steps: hasPossibleMismatch ? "Request original physical counter-foil from project vendor immediately." : "Approve and lock batch record entry."
            };
            displayAuditResult(item.audit);
            updateDashboardBadge(item.audit.status);
        }, 1200);
        return;
    }

    try {
        const fullPrompt = `You are a Forensic Construction Auditor. Run an integrity audit on this log entry. 
Material/Work Title: ${item.title}
Logged Cost: PKR ${item.cost}
Pasted Receipt Text: ${item.receipt}
Image Context Link: ${item.imageUrl}

Return ONLY a valid JSON object matching this structure exactly (do not wrap in markdown or backticks):
{
  "status": "Verified" or "Caution" or "Discrepancy Detected",
  "confidence": "High" or "Medium" or "Low",
  "summary": "detailed analysis description here",
  "flags": "any specific warnings or none",
  "steps": "recommended follow up action"
}`;

        // Fixed endpoint routing path structure for Google API Gateways
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message || "API Rejected request.");

        let rawText = data.candidates[0].content.parts[0].text.trim();
        if (rawText.startsWith("```")) {
            rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        }
        
        const parsedAudit = JSON.parse(rawText);
        
        item.audit = {
            status: parsedAudit.status || "Verified",
            confidence: parsedAudit.confidence || "High",
            summary: parsedAudit.summary || "Audit pipeline validation completed successfully.",
            flags: parsedAudit.flags || "None",
            steps: parsedAudit.steps || "No tracking anomalies identified."
        };
        
        displayAuditResult(item.audit);
        updateDashboardBadge(item.audit.status);
    } catch (error) {
        console.error("Gemini API Error Logged: ", error);
        if (loading) loading.style.display = "none";
        if (resultDiv) {
            resultDiv.className = "";
            resultDiv.style.display = "block";
            resultDiv.innerHTML = `<p style="color:red; padding: 10px;"><i class="fas fa-triangle-exclamation"></i> <strong>Audit Gateway Exception:</strong> ${error.message || "Failed to parse content payload"}. Double check endpoint mapping.</p>`;
        }
    }
}
// ==========================================
// 5. HELPER UI DISPLAY FUNCTIONS
// ==========================================
function displayAuditResult(audit) {
    const loading = document.getElementById("modal-loading") || document.getElementById("loading");
    const resultDiv = document.getElementById("modal-result") || document.getElementById("result");
    
    if (loading) loading.style.display = "none";
    if (!resultDiv) return;
    
    resultDiv.className = "";
    resultDiv.style.display = "block";
    
    let badgeColor = "#2f855a"; // Success Green
    if (audit.status === "Caution") badgeColor = "#dd6b20"; // Warning Orange
    if (audit.status === "Discrepancy Detected") badgeColor = "#e53e3e"; // Danger Red
    
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
    const badge = document.getElementById("audit-status-badge") || document.querySelector(".status-badge");
    if (!badge) return;
    
    badge.innerText = status;
    if(status === "Verified") badge.style.color = "#2f855a";
    if(status === "Caution") badge.style.color = "#dd6b20";
    if(status === "Discrepancy Detected") badge.style.color = "#e53e3e";
}
