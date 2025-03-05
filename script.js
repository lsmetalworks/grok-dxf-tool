// Parts library with DXF generation
const partsLibrary = {
    bracket: {
        name: "L-Bracket",
        draw: (ctx, width, height, thickness) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(width - thickness, height);
            ctx.lineTo(width - thickness, thickness);
            ctx.lineTo(0, thickness);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        toDXF: (width, height, thickness) => {
            return [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "POLYLINE",
                "8", "0", // Layer
                "66", "1", // Vertices follow
                "0", "VERTEX",
                "8", "0",
                "10", "0.0", "20", "0.0", // (0, 0)
                "0", "VERTEX",
                "8", "0",
                "10", width.toString(), "20", "0.0", // (width, 0)
                "0", "VERTEX",
                "8", "0",
                "10", width.toString(), "20", height.toString(), // (width, height)
                "0", "VERTEX",
                "8", "0",
                "10", (width - thickness).toString(), "20", height.toString(), // (width-thickness, height)
                "0", "VERTEX",
                "8", "0",
                "10", (width - thickness).toString(), "20", thickness.toString(), // (width-thickness, thickness)
                "0", "VERTEX",
                "8", "0",
                "10", "0.0", "20", thickness.toString(), // (0, thickness)
                "0", "SEQEND",
                "0", "ENDSEC",
                "0", "EOF"
            ].join("\n");
        }
    },
    gear: {
        name: "Gear",
        draw: (ctx, width, height, thickness) => {
            const teeth = 8;
            const radius = Math.min(width, height) / 2;
            ctx.beginPath();
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i * Math.PI) / teeth;
                const r = i % 2 === 0 ? radius : radius * 0.8;
                ctx.lineTo(
                    200 + r * Math.cos(angle),
                    200 + r * Math.sin(angle)
                );
            }
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        toDXF: (width, height, thickness) => {
            const teeth = 8;
            const radius = Math.min(width, height) / 2;
            let dxf = ["0", "SECTION", "2", "ENTITIES", "0", "POLYLINE", "8", "0", "66", "1"];
            for (let i = 0; i < teeth * 2; i++) {
                const angle = (i * Math.PI) / teeth;
                const r = i % 2 === 0 ? radius : radius * 0.8;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
            }
            dxf.push("0", "SEQEND", "0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    },
    rectangle: {
        name: "Rectangle Plate",
        draw: (ctx, width, height, thickness) => {
            ctx.fillStyle = "#666";
            ctx.fillRect(0, 0, width, height);
        },
        toDXF: (width, height, thickness) => {
            return [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "POLYLINE",
                "8", "0",
                "66", "1",
                "0", "VERTEX",
                "8", "0",
                "10", "0.0", "20", "0.0", // (0, 0)
                "0", "VERTEX",
                "8", "0",
                "10", width.toString(), "20", "0.0", // (width, 0)
                "0", "VERTEX",
                "8", "0",
                "10", width.toString(), "20", height.toString(), // (width, height)
                "0", "VERTEX",
                "8", "0",
                "10", "0.0", "20", height.toString(), // (0, height)
                "0", "SEQEND",
                "0", "ENDSEC",
                "0", "EOF"
            ].join("\n");
        }
    }
};

// Event listeners for part selection
document.querySelectorAll("#parts-list li").forEach(item => {
    item.addEventListener("click", () => {
        const partType = item.getAttribute("data-part");
        document.getElementById("config-form").style.display = "block";
        document.getElementById("part-type").textContent = partsLibrary[partType].name;
        document.getElementById("width").value = "";
        document.getElementById("height").value = "";
        document.getElementById("thickness").value = "";
    });
});

// Preview the part on canvas
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) * 10;
    const height = parseFloat(document.getElementById("height").value) * 10;
    const thickness = parseFloat(document.getElementById("thickness").value) * 10;

    if (!width || !height || !thickness) {
        alert("Please enter all dimensions.");
        return;
    }

    const canvas = document.getElementById("part-preview");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        ctx.save();
        ctx.translate(200 - width / 2, 200 - height / 2);
        part.draw(ctx, width, height, thickness);
        ctx.restore();
    }
}

// Download DXF file
function downloadDXF() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const thickness = parseFloat(document.getElementById("thickness").value);

    if (!width || !height || !thickness) {
        alert("Please enter all dimensions and preview the part first.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = part.toDXF(width, height, thickness);
        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${partType.toLowerCase()}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
