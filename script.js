// Parts library with corrected triangle apex radius
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
                    width / 2 + r * Math.cos(angle), // Center at (width/2, height/2)
                    height / 2 + r * Math.sin(angle)
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
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", yamage.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", cornerRadius.toString(), "20", "0.0");
                dxf.push("0", "SEQEND");
            } else {
                dxf.push(
                    "0", "POLYLINE", "8", "0", "66", "1",
                    "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                    "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0",
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
    triangle: {
        name: "Triangle",
        draw: (ctx, width, height, holeSize, cornerRadius = 0) => {
            const r = cornerRadius * 10;
            const apexX = width / 2;

            // Calculate arc center and tangent points
            const slope = height / (width / 2); // Slope of triangle sides
            const theta = Math.atan(slope); // Angle from horizontal
            const cy = r / Math.sin(theta); // Distance from apex to center along y-axis
            const centerX = apexX;
            const centerY = cy; // Center below apex in preview coords (y=0 at top)
            const tangentOffsetX = r * Math.cos(theta);
            const tangentOffsetY = r * Math.sin(theta);
            const leftTangentX = apexX - tangentOffsetX;
            const leftTangentY = centerY - tangentOffsetY;
            const rightTangentX = apexX + tangentOffsetX;
            const rightTangentY = centerY - tangentOffsetY;

            // Draw triangle with rounded apex
            ctx.beginPath();
            ctx.moveTo(0, height); // Bottom-left
            ctx.lineTo(leftTangentX, leftTangentY); // Up to left tangent point
            ctx.arc(centerX, centerY, r, Math.PI + theta, Math.PI - theta, false); // Arc around apex (clockwise)
            ctx.lineTo(width, height); // Down to bottom-right
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            // Optional hole at centroid
            if (holeSize > 0) {
                ctx.globalCompositeOperation = "destination-out";
                const holeRadius = (holeSize / 2) * 10;
                const centroidX = width / 2;
                const centroidY = height - (height / 3); // Centroid in flipped preview coords
                ctx.beginPath();
                ctx.arc(centroidX, centroidY, holeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = "source-over";
            }
        },
        toDXF: (width, height, holeSize, cornerRadius = 0) => {
            let dxf = ["0", "SECTION", "2", "ENTITIES"];
            const r = cornerRadius;
            const apexX = width / 2;

            // Calculate arc center and tangent points
            const slope = height / (width / 2);
            const theta = Math.atan(slope);
            const cy = r / Math.sin(theta); // Distance from apex to center
            const centerX = apexX;
            const centerY = height - cy; // Center below apex in DXF coords (y=0 at bottom)
            const tangentOffsetX = r * Math.cos(theta);
            const tangentOffsetY = r * Math.sin(theta);
            const leftTangentX = apexX - tangentOffsetX;
            const leftTangentY = centerY + tangentOffsetY;
            const rightTangentX = apexX + tangentOffsetX;
            const rightTangentY = centerY + tangentOffsetY;

            // Triangle outline with rounded apex
            const steps = 8;
            dxf.push("0", "POLYLINE", "8", "0", "66", "1");
            dxf.push("0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0"); // Bottom-left
            dxf.push("0", "VERTEX", "8", "0", "10", leftTangentX.toString(), "20", leftTangentY.toString()); // Left tangent
            // Arc from left to right tangent (clockwise)
            for (let i = 0; i <= steps; i++) {
                const angle = (Math.PI - theta) - (2 * theta * i / steps); // π - θ to π + θ clockwise
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
            }
            dxf.push("0", "VERTEX", "8", "0", "10", rightTangentX.toString(), "20", rightTangentY.toString()); // Right tangent
            dxf.push("0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0"); // Bottom-right
            dxf.push("0", "SEQEND");

            // Optional hole at centroid
            if (holeSize > 0) {
                const holeRadius = holeSize / 2;
                const centroidX = width / 2;
                const centroidY = height / 3; // Centroid in DXF coords (y=0 at bottom)
                dxf.push(
                    "0", "CIRCLE",
                    "8", "0",
                    "10", centroidX.toString(),
                    "20", centroidY.toString(),
                    "40", holeRadius.toString()
                );
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
        document.getElementById("hole-options").style.display = (partType === "holedPlate" || partType === "triangle") ? "block" : "none";
        if (partType === "holedPlate") {
            document.getElementById("holeSize").value = "0.25";
            document.getElementById("holeInset").value = "0.5";
            document.getElementById("cornerRadius").value = "0";
            document.getElementById("holeInset").style.display = "block";
            document.getElementById("cornerRadius").style.display = "block";
            document.getElementById("holeInset").previousElementSibling.style.display = "block";
            document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
        } else if (partType === "triangle") {
            document.getElementById("holeSize").value = "0.25";
            document.getElementById("cornerRadius").value = "0"; // Default radius
            document.getElementById("holeInset").style.display = "none";
            document.getElementById("cornerRadius").style.display = "block"; // Show radius input
            document.getElementById("holeInset").previousElementSibling.style.display = "none";
            document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
        }
    });
});

// Preview the part on canvas
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) * 10;
    const height = parseFloat(document.getElementById("height").value) * 10;
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Triangle") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = (partType === "Holed Mounting Plate" || partType === "Triangle") ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    console.log("Previewing:", { partType, width, height, holeSize, holeInset, cornerRadius });

    if (!width || !height || ((partType === "Holed Mounting Plate" || partType === "Triangle") && (!holeSize || isNaN(holeSize))) || 
        (partType === "Holed Mounting Plate" && (!holeInset || isNaN(cornerRadius))) || 
        (partType === "Triangle" && (isNaN(cornerRadius)))) {
        alert("Please enter all required fields. Check console for details.");
        console.log("Validation failed:", { width, height, holeSize, holeInset, cornerRadius });
        return;
    }

    const canvas = document.getElementById("part-preview");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        ctx.save();
        // Center and flip the y-axis
        const totalHeight = height;
        ctx.translate(200 - width / 2, 200 + totalHeight / 2); // Move origin to bottom-center
        ctx.scale(1, -1); // Flip y-axis so y increases upward
        try {
            if (partType === "Holed Mounting Plate") {
                part.draw(ctx, width, height, holeSize, holeInset, cornerRadius);
            } else if (partType === "Triangle") {
                part.draw(ctx, width, height, holeSize, cornerRadius);
            } else {
                part.draw(ctx, width, height);
            }
            console.log("Preview drawn successfully for", partType);
        } catch (error) {
            console.error("Error drawing preview:", error);
        }
        ctx.restore();
    } else {
        console.log("Part not found:", partType);
    }
}

// Download DXF file
function downloadDXF() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Triangle") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = (partType === "Holed Mounting Plate" || partType === "Triangle") ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    if (!width || !height || ((partType === "Holed Mounting Plate" || partType === "Triangle") && (!holeSize || isNaN(holeSize))) || 
        (partType === "Holed Mounting Plate" && (!holeInset || isNaN(cornerRadius))) || 
        (partType === "Triangle" && (isNaN(cornerRadius)))) {
        alert("Please enter all required fields.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = partType === "Holed Mounting Plate" ? part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
                          partType === "Triangle" ? part.toDXF(width, height, holeSize, cornerRadius) :
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
