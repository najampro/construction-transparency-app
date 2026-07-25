// Mock Data Initially loaded for evaluation
let siteUpdates = [
    {
        id: 1,
        title: "Foundation Footing Concreting",
        cost: "580,000",
        date: "July 24, 2026",
        receipt: "Lucky Cement: 120 Bags billed at PKR 1250 each. Total: 150,000. Premix aggregates: 430,000.",
        imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80",
        audit: {
            status: "Verified",
            confidence: "High",
            summary: "The visual volume of structural footing aligns precisely with the 120 bags of cement allocation logged in the ledger system.",
            flags: "None",
            steps: "Proceed to plinth beam assembly verification phase."
        }
    }
];

document.addEventListener("DOMContentLoaded", () => {
    renderTimeline();
    
    // Handle Form Submission
    document.getElementById("log-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("material-name").value;
        const cost = parseInt(document.getElementById("material-cost").value).toLocaleString();
        const receipt = document.getElementById("receipt-text").value;
        const imageUrl = document.getElementById("site-image").value;
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const newUpdate = {
            id: Date.now(),
            title,
            cost,
            date,
            receipt,
            imageUrl,
            audit: null // Will be generated via AI Audit request
        };
        
        siteUpdates.unshift(newUpdate);
        renderTimeline();
        document.getElementById("log-form").reset();
    });

    // Close Modal Event
    document.querySelector(".close-btn").addEventListener("click", () => {
        document.getElementById("audit-modal").style.display = "none";
    });
});

// Render Timeline Dynamically
function renderTimeline() {
    const container = document.getElementById("timeline-container");
    container.innerHTML = "";
    
    siteUpdates.forEach(update => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-date"><i class="far fa-calendar-alt"></i> ${update.date}</div>
            <h3 style="margin-top:0.2rem;">${update.title}</h3>
            <p style="font-weight:600; color:#2f855a;">Cost allocated: PKR ${update.cost}</p>
            <p style="font-size:0.9rem; color:#4a5568; margin: 0.5rem 0;"><strong>Receipt Transcript:</strong> ${update.receipt}</p>
            <img src="${update.imageUrl}" alt="Site progress" class="timeline-img" onerror="this.src='https://via.placeholder.com/600x300.png?text=Construction+Site+Progress'">
            <div>
                <button class="btn-audit" onclick="triggerAiAudit(${update.id})">
                    <i class="fas fa-shield-halved"></i> ${update.audit ? 'View Audit Report' : 'Run AI System Audit'}
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Trigger Gemini API Audit
async function triggerAiAudit(id) {
    const modal = document.getElementById("audit-modal");
    const loading = document.getElementById("modal-loading");
    const resultDiv = document.getElementById("modal-result");
    
    modal.style.display = "flex";
    loading.style.display = "block";
    resultDiv.className = "hidden";
    
    const item = siteUpdates.find(u => u.id === id);
    
    // Check if audit already exists to save API tokens
    if (item.audit) {
        displayAuditResult(item.audit);
        return;
    }
    
    const apiKey = document.getElementById("gemini-key").value;
    if (!apiKey) {
        // Fallback simulation if no API key is provided yet
        setTimeout(() => {
            item.audit = {
                status: "Caution",
                confidence: "Medium",
                summary: "Automated simulation check: Materials listed are standard, but without a direct API payload token, high precision checking is limited.",
                flags: "Missing visual pattern validation profile.",
                steps: "Provide active API configuration string inside the dashboard deck."
            };
            displayAuditResult(item.audit);
            updateDashboardBadge("Caution");
        }, 1500);
        return;
    }

    try {
        const systemPrompt = `You are an expert Forensic Construction Auditor. Analyze the provided receipt logs and verify if it matches basic construction standards. Return a strict JSON object with fields: status ("Verified", "Caution", or "Discrepancy Detected"), confidence, summary, flags, and steps.`;
        const userPrompt = `Material Title: ${item.title}. Billed Cost: PKR ${item.cost}. Receipt/Invoice Content: ${item.receipt}. Reference Site Photo Link: ${item.imageUrl}.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }]
            })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        
        // Clean markdown backticks out of the response string if JSON block is given
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedAudit = JSON.parse(cleanJson);
        
        item.audit = {
            status: parsedAudit.status || "Verified",
            confidence: parsedAudit.confidence || "High",
            summary: parsedAudit.summary || parsedAudit.audit_summary || "Audit processing completed.",
            flags: parsedAudit.flags ? parsedAudit.flags.toString() : "None",
            steps: parsedAudit.steps || parsedAudit.recommended_next_steps ? parsedAudit.recommended_next_steps.toString() : "No urgent anomalies flagged."
        };
        
        displayAuditResult(item.audit);
        updateDashboardBadge(item.audit.status);
    } catch (error) {
        loading.style.display = "none";
        resultDiv.className = "";
        resultDiv.innerHTML = `<p style="color:red;"><i class="fas fa-triangle-exclamation"></i> Error communicating with Gemini API Engine. Check your network configuration and API key rules.</p>`;
    }
}

function displayAuditResult(audit) {
    document.getElementById("modal-loading").style.display = "none";
    const resultDiv = document.getElementById("modal-result");
    resultDiv.className = "";
    
    let badgeClass = "badge-success";
    if (audit.status === "Caution") badgeClass = "badge-warning";
    if (audit.status === "Discrepancy Detected") badgeClass = "badge-danger";
    
    resultDiv.innerHTML = `
        <div style="margin: 1rem 0; display:flex; justify-content:space-between; align-items:center;">
            <strong>Integrity Check:</strong> 
            <span class="badge ${badgeClass}">${audit.status}</span>
        </div>
        <p><strong>Confidence Rating:</strong> ${audit.confidence}</p>
        <p style="margin: 0.8rem 0; padding:0.5rem; background:#f7fafc; border-left:4px solid #4a5568;">
            <strong>Analysis Summary:</strong> ${audit.summary}
        </p>
        <p style="color:#c53030;"><strong>Anomalies/Flags Raised:</strong> ${audit.flags}</p>
        <p style="margin-top:0.5rem; color:#2b6cb0;"><strong>Next Corrective Action Steps:</strong> ${audit.steps}</p>
    `;
}

function updateDashboardBadge(status) {
    const badge = document.getElementById("audit-status-badge");
    badge.innerText = status;
    const parentCard = badge.closest(".card");
    
    if(status === "Verified") badge.style.color = "var(--success)";
    if(status === "Caution") badge.style.color = "var(--warning)";
    if(status === "Discrepancy Detected") badge.style.color = "var(--danger)";
}
