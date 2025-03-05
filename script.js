// Parts library with corrected D Bracket scaling for width and height
const partsLibrary = {
    gear: {
        name: "Gear",
        draw: (ctx, width, height) => {
            const teeth = 8;
            const radius = Math.min(width, height) / 2;
            ctx.beginPath();
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i * Math.PI) / teeth;
                const r = i % 2 === 0 ? radius : radius * 0.8;
                ctx.lineTo(
                    width / 2 + r * Math.cos(angle),
                    height / 2 + r * Math.sin(angle)
                );
            }
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        }
    },
    dBracket: {
        name: "D Bracket",
        draw: (ctx, width, height, holeSize) => {
            ctx.beginPath();
            ctx.moveTo(0, height); 
            ctx.lineTo(width, height); 
            ctx.arc(width / 2, height - width / 2, width / 2, 0, Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
            
            // Cut out hole
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(width / 2, height - width / 2, holeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        }
    }
};

// Event listener for part selection
document.querySelectorAll("#parts-list li").forEach(item => {
    item.addEventListener("click", () => {
        const partType = item.dataset.part;
        if (!partsLibrary[partType]) return;

        document.getElementById("config-form").style.display = "block";
        document.getElementById("part-type").textContent = partsLibrary[partType].name;
        document.getElementById("hole-options").style.display = partType === "dBracket" ? "block" : "none";
    });
});

// Preview function
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) * 10;
    const height = parseFloat(document.getElementById("height").value) * 10;
    const holeSize = partType === "D Bracket" ? parseFloat(document.getElementById("holeSize").value || 0.25) * 10 : 0;

    if (isNaN(width) || isNaN(height) || (partType === "D Bracket" && isNaN(holeSize))) {
        alert("Please enter valid numeric values.");
        return;
    }

    const canvas = document.getElementById("part-preview");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        ctx.save();
        ctx.translate(200 - width / 2, 200 - height / 2);
        try {
            if (partType === "D Bracket") {
                part.draw(ctx, width, height, holeSize);
            } else {
                part.draw(ctx, width, height);
            }
        } catch (error) {
            console.error("Error drawing preview:", error);
        }
        ctx.restore();
    }
}

// Download DXF function
function downloadDXF() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const holeSize = partType === "D Bracket" ? parseFloat(document.getElementById("holeSize").value || 0.25) : 0;

    if (isNaN(width) || isNaN(height) || (partType === "D Bracket" && isNaN(holeSize))) {
        alert("Please enter all required fields.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = partType === "D Bracket" ? part.toDXF(width, height, holeSize) : part.toDXF(width, height);
        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${partType.replace(/\s+/g, "_").toLowerCase()}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
