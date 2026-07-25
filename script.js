document.addEventListener("DOMContentLoaded", () => {
    
    // --- APP MEMORY DATA (IN-MEMORY DATABASE) ---
    let projectState = {
        escrowBalance: 4660000,
        totalProgress: 35,
        qualityScore: 98.9,
        // Grey Structure Phase Tracker Arrays
        milestones: [
            { id: 1, name: "Foundation & Excavation Footing", status: "completed", progress: 100 },
            { id: 2, name: "Plinth Beam Construction", status: "active", progress: 40 },
            { id: 3, name: "Pillar Columns & Brickwork", status: "pending", progress: 0 },
            { id: 4, name: "Slab Roofing Concrete Pour", status: "pending", progress: 0 }
        ],
        // Escrow Wallet & Quality Verification Feed Initial Logs
        logs: [
            {
                id: 1,
                date: "2026-07-25 14:22",
                title: "Mughal Steel Grade-60 Rebar Load Delivery",
                cost: 285000,
                status: "Lab Certified / Passed",
                desc: "Tensile testing report uploaded. Checked under site node criteria, load approved for Plinth development."
            }
        ]
    };

    // --- DOM CAPTURE NODES ---
    const milestoneContainer = document.getElementById("milestones-wrapper");
    const timelineContainer = document.getElementById("timeline-container");
    const balanceDisplay = document.getElementById("stat-escrow-balance");
    const progressDisplay = document.getElementById("stat-project-progress");
    const qualityDisplay = document.getElementById("stat-quality-index");
    
    const cctvImg = document.getElementById("cctv-stream-img");
    const cctvTag = document.getElementById("cctv-camera-tag");
    const logForm = document.getElementById("log-form");

    // --- CCTV FEED SIMULATION DATA ---
    const cctvSnapshots = [
        { label: "CAM 01 — FOUNDATION AXIS", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80" },
        { label: "CAM 02 — AGGREGATE STORAGE", url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" },
        { label: "CAM 03 — MATERIAL TESTING BED", url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80" }
    ];
    let activeCameraIdx = 0;

    // --- RENDER COMPONENT: PROGRESS MILESTONES ---
    function renderMilestones() {
        milestoneContainer.innerHTML = "";
        projectState.milestones.forEach(m => {
            const block = document.createElement("div");
            block.className = `milestone-item-bar ${m.status}`;
            block.innerHTML = `
                <div class="milestone-info">
                    <span>${m.name}</span>
                    <strong>${m.progress}%</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${m.status === 'active' ? 'current-glow' : ''}" style="width: ${m.progress}%;"></div>
                </div>
            `;
            milestoneContainer.appendChild(block);
        });
    }

    // --- RENDER COMPONENT: STREAM SUMMARY & WALLET TRACKS ---
    function renderAuditLogs() {
        timelineContainer.innerHTML = "";
        
        projectState.logs.forEach(log => {
            const node = `
                <div class="timeline-item">
                    <div class="timeline-date"><i class="fa-regular fa-clock"></i> ${log.date}</div>
                    <h3>${log.title}</h3>
                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span class="cost-tag">PKR ${log.cost.toLocaleString()}</span>
                        <span class="quality-indicator-stamp">${log.status}</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0; line-height: 1.45;">
                        ${log.desc}
                    </p>
                </div>
            `;
            timelineContainer.insertAdjacentHTML("afterbegin", node);
        });

        // Numeric calculations displays injection
        balanceDisplay.innerText = projectState.escrowBalance.toLocaleString();
        progressDisplay.innerText = projectState.totalProgress + "%";
        qualityDisplay.innerText = projectState.qualityScore + "%";
    }

    // --- ENGINE LOOP: CCTV SYSTEM ROTATION ---
    setInterval(() => {
        activeCameraIdx = (activeCameraIdx + 1) % cctvSnapshots.length;
        cctvImg.style.opacity = "0.3";
        setTimeout(() => {
            cctvImg.src = cctvSnapshots[activeCameraIdx].url;
            cctvTag.innerText = cctvSnapshots[activeCameraIdx].label;
            cctvImg.style.opacity = "0.85";
        }, 300);
    }, 4500);

    // --- FORM HANDLER: MATERIAL LOG ENTRY & ESCROW DEDUCTION ---
    logForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("material-name").value;
        const cost = parseInt(document.getElementById("material-cost").value);
        const quality = document.getElementById("material-quality").value;
        const desc = document.getElementById("receipt-text").value;

        if (cost > projectState.escrowBalance) {
            alert("Security Override: Requested log cost exceeds available Escrow Balance pools.");
            return;
        }

        // Mutation calculations logic
        projectState.escrowBalance -= cost;
        if (projectState.totalProgress < 95) projectState.totalProgress += 4;

        // Dynamic Tracker Bar Engine updates logic based on workflow action
        let plinthPhase = projectState.milestones.find(m => m.id === 2);
        if (plinthPhase && plinthPhase.progress < 100) {
            plinthPhase.progress += 15;
            if (plinthPhase.progress >= 100) {
                plinthPhase.progress = 100;
                plinthPhase.status = "completed";
                let columnPhase = projectState.milestones.find(m => m.id === 3);
                if (columnPhase) {
                    columnPhase.status = "active";
                    columnPhase.progress = 10;
                }
            }
        }

        // Log entry structure parsing
        const time = new Date().toISOString().replace('T', ' ').substring(0, 16);
        projectState.logs.push({ id: Date.now(), date: time, title: name, cost: cost, status: quality, desc: desc });

        renderMilestones();
        renderAuditLogs();
        logForm.reset();
    });

    // --- USER PROFILE SECURITY MODAL ENGINE ---
    const authTrigger = document.getElementById("auth-action-text");
    const authModal = document.getElementById("account-auth-modal");
    const closeAuthModal = document.getElementById("close-auth-modal");
    
    authTrigger.addEventListener("click", () => authModal.style.display = "flex");
    closeAuthModal.addEventListener("click", () => authModal.style.display = "none");
    
    document.getElementById("modal-auth-form").addEventListener("submit", (e) => {
        e.preventDefault();
        document.getElementById("user-display-name").innerText = "Najam Pro";
        document.getElementById("avatar-letters").innerText = "NP";
        document.getElementById("avatar-letters").classList.remove("guest-mode");
        authTrigger.innerText = "Secured Session ✓";
        authTrigger.style.color = "var(--neon-green)";
        authModal.style.display = "none";
    });

    // Initial system load run routines
    renderMilestones();
    renderAuditLogs();
});
