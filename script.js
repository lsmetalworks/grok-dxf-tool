// Parts library with new D-Shaped Bracket
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
                    200 + r * Math.cos(angle),
                    200 + r * Math.sin(angle)
                );
            }
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        toDXF: (width, height) => {
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
        draw: (ctx, width, height) => {
            ctx.fillStyle = "#666";
            ctx.fillRect(0, 0, width, height);
        },
        toDXF: (width, height) => {
            return [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "POLYLINE",
                "8", "0",
                "66", "1",
                "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0.0", "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                "0", "SEQEND",
                "0", "ENDSEC",
                "0", "EOF"
            ].join("\n");
        }
    },
    gusset: {
        name: "Triangle Gusset",
        draw: (ctx, width, height) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        toDXF: (width, height) => {
            return [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "POLYLINE",
                "8", "0",
                "66", "1",
                "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0",
                "0", "VERTEX", "8", "0", "10", "0.0", "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                "0", "SEQEND",
                "0", "ENDSEC",
                "0", "EOF"
            ].join("\n");
        }
    },
    holedPlate: {
        name: "Holed Mounting Plate",
        draw: (ctx, width, height, holeSize, holeInset, cornerRadius) => {
            ctx.beginPath();
            const r = cornerRadius * 10;
            ctx.moveTo(r, 0);
            ctx.lineTo(width - r, 0);
            ctx.arc(width - r, r, r, -Math.PI / 2, 0);
            ctx.lineTo(width, height - r);
            ctx.arc(width - r, height - r, r, 0, Math.PI / 2);
            ctx.lineTo(r, height);
            ctx.arc(r, height - r, r, Math.PI / 2, Math.PI);
            ctx.lineTo(0, r);
            ctx.arc(r, r, r, Math.PI, -Math.PI / 2);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            ctx.globalCompositeOperation = "destination-out";
            const holeRadius = (holeSize / 2) * 10;
            const inset = holeInset * 10;
            const holeCenters = [
                [inset, inset],
                [width - inset, inset],
                [width - inset, height - inset],
                [inset, height - inset]
            ];

            holeCenters.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = "source-over";
        },
        toDXF: (width, height, holeSize, holeInset, cornerRadius) => {
            const holeRadius = holeSize / 2;
            const inset = holeInset;
            let dxf = ["0", "SECTION", "2", "ENTITIES"];

            if (cornerRadius > 0) {
                const steps = 8;
                dxf.push("0", "POLYLINE", "8", "0", "66", "1");
                dxf.push("0", "VERTEX", "8", "0", "10", cornerRadius.toString(), "20", "0.0");
                for (let i = 0; i <= steps; i++) {
                    const angle = -Math.PI / 2 + (Math.PI / 2) * (i / steps);
                    const x = width - cornerRadius + cornerRadius * Math.cos(angle);
                    const y = cornerRadius + cornerRadius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", width.toString(), "20", cornerRadius.toString());
                for (let i = 0; i <= steps; i++) {
                    const angle = 0 + (Math.PI / 2) * (i / steps);
                    const x = width - cornerRadius + cornerRadius * Math.cos(angle);
                    const y = height - cornerRadius + cornerRadius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", (width - cornerRadius).toString(), "20", height.toString());
                for (let i = 0; i <= steps; i++) {
                    const angle = Math.PI / 2 + (Math.PI / 2) * (i / steps);
                    const x = cornerRadius + cornerRadius * Math.cos(angle);
                    const y = height - cornerRadius + cornerRadius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", "0.0", "20", (height - cornerRadius).toString());
                for (let i = 0; i <= steps; i++) {
                    const angle = Math.PI + (Math.PI / 2) * (i / steps);
                    const x = cornerRadius + cornerRadius * Math.cos(angle);
                    const y = cornerRadius + cornerRadius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", cornerRadius.toString(), "20", "0.0");
                dxf.push("0", "SEQEND");
            } else {
                dxf.push(
                    "0", "POLYLINE", "8", "0", "66", "1",
                    "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                    "0", "VERSEX", "8", "0", "10", width.toString(), "20", "0.0",
                    "0", "VERTEX", "8", "0", "10", width.toString(), "20", height.toString(),
                    "0", "VERTEX", "8", "0", "10", "0.0", "20", height.toString(),
                    "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                    "0", "SEQEND"
                );
            }

            const holeCenters = [
                [inset, inset],
                [width - inset, inset],
                [width - inset, height - inset],
                [inset, height - inset]
            ];
            holeCenters.forEach(([x, y]) => {
                dxf.push(
                    "0", "CIRCLE",
                    "8", "0",
                    "10", x.toString(), "20", y.toString(),
                    "40", holeRadius.toString()
                );
            });

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    },
    dBracket: {
        name: "D-Shaped Bracket",
        draw: (ctx, width, height, dHoleSize, dHoleCount) => {
            // D shape: flat bottom, semicircle on top
            ctx.beginPath();
            ctx.moveTo(0, 0); // Bottom-left
            ctx.lineTo(width, 0); // Bottom-right
            ctx.arc(width / 2, 0, width / 2, 0, Math.PI, true); // Semicircle, clockwise from right to left
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            // Holes along the radius side
            if (dHoleSize && dHoleCount) {
                ctx.globalCompositeOperation = "destination-out";
                const holeRadius = (dHoleSize / 2) * 10; // Scale for preview
                const centerX = width / 2;
                const centerY = 0;
                const radius = width / 2;
                const angleStep = Math.PI / (dHoleCount + 1); // Evenly spaced along semicircle

                for (let i = 1; i <= dHoleCount; i++) {
                    const angle = angleStep * i;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY - radius * Math.sin(angle); // Negative because y increases downward
                    ctx.beginPath();
                    ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalCompositeOperation = "source-over";
            }
        },
        toDXF: (width, height, dHoleSize, dHoleCount) => {
            let dxf = ["0", "SECTION", "2", "ENTITIES"];
            const steps = 16; // Points for semicircle

            // D shape outline
            dxf.push("0", "POLYLINE", "8", "0", "66", "1");
            dxf.push("0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0"); // Bottom-left
            dxf.push("0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0"); // Bottom-right
            const centerX = width / 2;
            const radius = width / 2;
            for (let i = 0; i <= steps; i++) { // Semicircle from right to left
                const angle = Math.PI * (i / steps);
                const x = centerX + radius * Math.cos(angle);
                const y = -radius * Math.sin(angle); // Negative y for DXF (upward)
                dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
            }
            dxf.push("0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0"); // Close
            dxf.push("0", "SEQEND");

            // Holes along the radius side
            if (dHoleSize && dHoleCount) {
                const holeRadius = dHoleSize / 2;
                const angleStep = Math.PI / (dHoleCount + 1);
                for (let i = 1; i <= dHoleCount; i++) {
                    const angle = angleStep * i;
                    const x = centerX + radius * Math.cos(angle);
                    const y = -radius * Math.sin(angle); // Negative y for DXF
                    dxf.push(
                        "0", "CIRCLE",
                        "8", "0",
                        "10", x.toString(), "20", y.toString(),
                        "40", holeRadius.toString()
                    );
                }
            }

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
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
        document.getElementById("hole-options").style.display = partType === "holedPlate" ? "block" : "none";
        document.getElementById("dBracket-options").style.display = partType === "dBracket" ? "block" : "none";
        if (partType === "holedPlate") {
            document.getElementById("holeSize").value = "0.25";
            document.getElementById("holeInset").value = "0.5";
            document.getElementById("cornerRadius").value = "0";
        } else if (partType === "dBracket") {
            document.getElementById("dHoleSize").value = "0.25";
            document.getElementById("dHoleCount").value = "3";
        }
    });
});

// Preview the part on canvas
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) * 10;
    const height = parseFloat(document.getElementById("height").value) * 10;
    const holeSize = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeSize").value || 0.25) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;
    const dHoleSize = partType === "D-Shaped Bracket" ? parseFloat(document.getElementById("dHoleSize").value || 0.25) : 0;
    const dHoleCount = partType === "D-Shaped Bracket" ? parseInt(document.getElementById("dHoleCount").value || 3) : 0;

    if (!width || !height || (partType === "Holed Mounting Plate" && (!holeSize || !holeInset || isNaN(cornerRadius))) || (partType === "D-Shaped Bracket" && (!dHoleSize || !dHoleCount))) {
        alert("Please enter all required fields.");
        return;
    }

    const canvas = document.getElementById("part-preview");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        ctx.save();
        ctx.translate(200 - width / 2, 200 - height / 2);
        if (partType === "Holed Mounting Plate") {
            part.draw(ctx, width, height, holeSize, holeInset, cornerRadius);
        } else if (partType === "D-Shaped Bracket") {
            part.draw(ctx, width, height, dHoleSize, dHoleCount);
        } else {
            part.draw(ctx, width, height);
        }
        ctx.restore();
    }
}

// Download DXF file
function downloadDXF() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const holeSize = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeSize").value || 0.25) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;
    const dHoleSize = partType === "D-Shaped Bracket" ? parseFloat(document.getElementById("dHoleSize").value || 0.25) : 0;
    const dHoleCount = partType === "D-Shaped Bracket" ? parseInt(document.getElementById("dHoleCount").value || 3) : 0;

    if (!width || !height || (partType === "Holed Mounting Plate" && (!holeSize || !holeInset || isNaN(cornerRadius))) || (partType === "D-Shaped Bracket" && (!dHoleSize || !dHoleCount))) {
        alert("Please enter all required fields.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = partType === "Holed Mounting Plate" ? part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
                          partType === "D-Shaped Bracket" ? part.toDXF(width, height, dHoleSize, dHoleCount) :
                          part.toDXF(width, height);
        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${partType.toLowerCase()}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
