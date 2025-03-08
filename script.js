// Parts library with circular bracket and 4-bolt pattern
const partsLibrary = {
    gear: {
        name: "Gear",
        draw: (ctx, diameter, height) => {
            const radius = Math.min(diameter, height) / 2;
            ctx.beginPath();
            for (let i = 0; i < 16; i++) {
                const angle = (i * Math.PI) / 8;
                const r = i % 2 === 0 ? radius : radius * 0.8;
                ctx.lineTo(
                    diameter / 2 + r * Math.cos(angle),
                    height / 2 + r * Math.sin(angle)
                );
            }
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        toDXF: (diameter, height) => {
            const radius = Math.min(diameter, height) / 2;
            let dxf = ["0", "SECTION", "2", "ENTITIES", "0", "POLYLINE", "8", "0", "66", "1"];
            for (let i = 0; i < 16; i++) {
                const angle = (i * Math.PI) / 8;
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
        draw: (ctx, diameter, height) => {
            ctx.fillStyle = "#666";
            ctx.fillRect(0, 0, diameter, height);
        },
        toDXF: (diameter, height) => {
            return [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "POLYLINE",
                "8", "0",
                "66", "1",
                "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                "0", "VERTEX", "8", "0", "10", diameter.toString(), "20", "0.0",
                "0", "VERTEX", "8", "0", "10", diameter.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0.0", "20", height.toString(),
                "0", "SEQEND",
                "0", "ENDSEC",
                "0", "EOF"
            ].join("\n");
        }
    },
    gusset: {
        name: "Triangle Gusset",
        draw: (ctx, diameter, height) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(diameter, 0);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        toDXF: (diameter, height) => {
            return [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "POLYLINE",
                "8", "0",
                "66", "1",
                "0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0",
                "0", "VERTEX", "8", "0", "10", diameter.toString(), "20", "0.0",
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
        draw: (ctx, diameter, height, holeSize, holeInset, cornerRadius) => {
            ctx.beginPath();
            const r = cornerRadius * 10;
            ctx.moveTo(r, 0);
            ctx.lineTo(diameter - r, 0);
            ctx.arc(diameter - r, r, r, -Math.PI / 2, 0);
            ctx.lineTo(diameter, height - r);
            ctx.arc(diameter - r, height - r, r, 0, Math.PI / 2);
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
                [diameter - inset, inset],
                [diameter - inset, height - inset],
                [inset, height - inset]
            ];

            holeCenters.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = "source-over";
        },
        toDXF: (diameter, height, holeSize, holeInset, cornerRadius) => {
            const holeRadius = holeSize / 2;
            const inset = holeInset;
            let dxf = ["0", "SECTION", "2", "ENTITIES"];

            if (cornerRadius > 0) {
                const steps = 8;
                dxf.push("0", "POLYLINE", "8", "0", "66", "1");
                dxf.push("0", "VERTEX", "8", "0", "10", cornerRadius.toString(), "20", "0.0");
                for (let i = 0; i <= steps; i++) {
                    const angle = -Math.PI / 2 + (Math.PI / 2) * (i / steps);
                    const x = diameter - cornerRadius + cornerRadius * Math.cos(angle);
                    const y = cornerRadius + cornerRadius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", diameter.toString(), "20", cornerRadius.toString());
                for (let i = 0; i <= steps; i++) {
                    const angle = 0 + (Math.PI / 2) * (i / steps);
                    const x = diameter - cornerRadius + cornerRadius * Math.cos(angle);
                    const y = height - cornerRadius + cornerRadius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
                }
                dxf.push("0", "VERTEX", "8", "0", "10", (diameter - cornerRadius).toString(), "20", height.toString());
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
                    "0", "VERTEX", "8", "0", "10", diameter.toString(), "20", "0.0",
                    "0", "VERTEX", "8", "0", "10", diameter.toString(), "20", height.toString(),
                    "0", "VERTEX", "8", "0", "10", "0.0", "20", height.toString(),
                    "0", "SEQEND"
                );
            }

            const holeCenters = [
                [inset, inset],
                [diameter - inset, inset],
                [diameter - inset, height - inset],
                [inset, height - inset]
            ];
            holeCenters.forEach(([x, y]) => {
                dxf.push(
                    "0", "CIRCLE",
                    "8", "0",
                    "10", x.toString(),
                    "20", y.toString(),
                    "40", holeRadius.toString()
                );
            });

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    },
    triangle: {
        name: "Trapezoid",
        draw: (ctx, diameter, height, holeSize, cornerRadius = 0) => {
            const r = cornerRadius * 10;
            const topWidth = diameter * 0.2;
            const baseY = height;
            const topY = 0;
            const topLeftX = (diameter - topWidth) / 2;
            const topRightX = topLeftX + topWidth;

            ctx.beginPath();
            ctx.moveTo(0, baseY);

            console.log("Drawing trapezoid:", { diameter, height, r, topWidth, baseY, topY, topLeftX, topRightX });

            if (r > 0) {
                console.log("Applying radius:", r);
                const leftCenterX = topLeftX + r;
                const leftCenterY = topY - r;
                const leftTangentXSide = topLeftX;
                const leftTangentYSide = topY;
                const leftTangentXTop = leftCenterX;
                const leftTangentYTop = topY - r;

                const rightCenterX = topRightX - r;
                const rightCenterY = topY - r;
                const rightTangentXSide = topRightX;
                const rightTangentYSide = topY;
                const rightTangentXTop = rightCenterX;
                const rightTangentYTop = topY - r;

                console.log("Tangent points:", {
                    leftTangentXSide, leftTangentYSide, leftTangentXTop, leftTangentYTop,
                    rightTangentXSide, rightTangentYSide, rightTangentXTop, rightTangentYTop
                });

                ctx.lineTo(diameter, baseY);
                ctx.lineTo(rightTangentXSide, rightTangentYSide);
                ctx.arc(rightCenterX, rightCenterY, r, 0, Math.PI / 2, false);
                ctx.lineTo(leftTangentXSide, leftTangentYSide);
                ctx.arc(leftCenterX, leftCenterY, r, Math.PI / 2, Math.PI, false);
            } else {
                console.log("No radius, flat top");
                ctx.lineTo(diameter, baseY);
                ctx.lineTo(topRightX, topY);
                ctx.lineTo(topLeftX, topY);
            }

            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            if (holeSize > 0) {
                ctx.globalCompositeOperation = "destination-out";
                const holeRadius = (holeSize / 2) * 10;
                const centroidX = diameter / 2;
                const centroidY = height / 3;
                ctx.beginPath();
                ctx.arc(centroidX, centroidY, holeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = "source-over";
            }
        },
        toDXF: (diameter, height, holeSize, cornerRadius = 0) => {
            let dxf = [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "LWPOLYLINE",
                "8", "0",
                "66", "1"
            ];

            const r = cornerRadius;
            const topWidth = diameter * 0.2;
            const baseY = height;
            const topY = 0;
            const topLeftX = (diameter - topWidth) / 2;
            const topRightX = topLeftX + topWidth;

            dxf.push("0", "VERTEX", "8", "0", "10", "0.0", "20", baseY.toString());

            if (r > 0) {
                const leftCenterX = topLeftX + r;
                const leftCenterY = topY - r;
                const leftTangentXSide = topLeftX;
                const leftTangentYSide = topY;
                const leftTangentXTop = leftCenterX;
                const leftTangentYTop = topY - r;

                const rightCenterX = topRightX - r;
                const rightCenterY = topY - r;
                const rightTangentXSide = topRightX;
                const rightTangentYSide = topY;
                const rightTangentXTop = rightCenterX;
                const rightTangentYTop = topY - r;

                dxf.push("0", "VERTEX", "8", "0", "10", diameter.toString(), "20", baseY.toString());
                dxf.push("0", "VERTEX", "8", "0", "10", rightTangentXSide.toString(), "20", rightTangentYSide.toString());
                dxf.push("0", "VERTEX", "8", "0", "10", rightTangentXTop.toString(), "20", rightTangentYTop.toString(), "42", "-0.41421356237309515");
                dxf.push("0", "VERTEX", "8", "0", "10", leftTangentXSide.toString(), "20", leftTangentYSide.toString());
                dxf.push("0", "VERTEX", "8", "0", "10", leftTangentXTop.toString(), "20", leftTangentYTop.toString(), "42", "-0.41421356237309515");
            } else {
                dxf.push("0", "VERTEX", "8", "0", "10", diameter.toString(), "20", baseY.toString());
                dxf.push("0", "VERTEX", "8", "0", "10", topRightX.toString(), "20", topY.toString());
                dxf.push("0", "VERTEX", "8", "0", "10", topLeftX.toString(), "20", topY.toString());
            }

            dxf.push("0", "SEQEND", "0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    },
    circleBracket: {
        name: "Circular Bracket",
        draw: (ctx, diameter, _unusedHeight, holeSize) => {
            const radius = diameter / 2;
            const centerX = radius;
            const centerY = radius;
            const holeRadius = (holeSize / 2) * 10;
            const inset = radius * 0.7;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            if (holeSize > 0) {
                ctx.globalCompositeOperation = "destination-out";
                const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
                angles.forEach(angle => {
                    const holeX = centerX + inset * Math.cos(angle);
                    const holeY = centerY + inset * Math.sin(angle);
                    ctx.beginPath();
                    ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.globalCompositeOperation = "source-over";
            }

            console.log("Drawing circular bracket:", { diameter, holeSize, holeRadius, inset });
        },
        toDXF: (diameter, _unusedHeight, holeSize) => {
            const radius = diameter / 2;
            const centerX = radius;
            const centerY = radius;
            const holeRadius = holeSize / 2;
            const inset = radius * 0.7;

            let dxf = [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "CIRCLE",
                "8", "0",
                "10", centerX.toString(),
                "20", centerY.toString(),
                "40", radius.toString()
            ];

            if (holeSize > 0) {
                const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
                angles.forEach(angle => {
                    const holeX = centerX + inset * Math.cos(angle);
                    const holeY = centerY + inset * Math.sin(angle);
                    dxf.push(
                        "0", "CIRCLE",
                        "8", "0",
                        "10", holeX.toString(),
                        "20", holeY.toString(),
                        "40", holeRadius.toString()
                    );
                });
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
        document.getElementById("diameter").value = "";
        document.getElementById("hole-options").style.display = (partType === "holedPlate" || partType === "triangle" || partType === "circleBracket") ? "block" : "none";
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
            document.getElementById("cornerRadius").value = "0";
            document.getElementById("holeInset").style.display = "none";
            document.getElementById("cornerRadius").style.display = "block";
            document.getElementById("holeInset").previousElementSibling.style.display = "none";
            document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
        } else if (partType === "circleBracket") {
            document.getElementById("holeSize").value = "0.25";
            document.getElementById("holeInset").style.display = "none";
            document.getElementById("cornerRadius").style.display = "none";
            document.getElementById("holeInset").previousElementSibling.style.display = "none";
            document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
        }
        console.log("Part selected:", partType);
    });
});

// Preview the part on canvas
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const diameter = parseFloat(document.getElementById("diameter").value) * 10; // Canvas units
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Trapezoid" || partType === "Circular Bracket") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = (partType === "Holed Mounting Plate" || partType === "Trapezoid") ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    console.log("Previewing:", { partType, diameter, holeSize, holeInset, cornerRadius });

    // Validation: diameter is always required, height is not for circleBracket
    if (!diameter || 
        ((partType === "Holed Mounting Plate" || partType === "Trapezoid" || partType === "Circular Bracket") && (!holeSize || isNaN(holeSize))) || 
        (partType === "Holed Mounting Plate" && (!holeInset || isNaN(cornerRadius))) || 
        (partType === "Trapezoid" && isNaN(cornerRadius))) {
        alert("Please enter all required fields. Check console for details.");
        console.log("Validation failed:", { diameter, holeSize, holeInset, cornerRadius });
        return;
    }

    const canvas = document.getElementById("part-preview");
    if (!canvas) {
        console.error("Canvas element 'part-preview' not found!");
        return;
    }
    console.log("Canvas found:", { width: canvas.width, height: canvas.height });

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Failed to get 2D context from canvas!");
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        ctx.save();
        // Default height for non-circleBracket parts (kept for compatibility)
        const height = partType === "Circular Bracket" ? diameter : parseFloat(document.getElementById("diameter").value) * 10; // Use diameter as height for circleBracket
        const translateX = 200 - diameter / 2;
        const translateY = partType === "Trapezoid" ? 200 - height : 200 - diameter / 2;
        ctx.translate(translateX, translateY);
        console.log("Canvas translation:", { x: translateX, y: translateY });
        try {
            if (partType === "Holed Mounting Plate") {
                part.draw(ctx, diameter, height, holeSize, holeInset, cornerRadius);
            } else if (partType === "Trapezoid") {
                part.draw(ctx, diameter, height, holeSize, cornerRadius);
            } else if (partType === "Circular Bracket") {
                part.draw(ctx, diameter, height, holeSize);
            } else {
                part.draw(ctx, diameter, height);
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
    const diameter = parseFloat(document.getElementById("diameter").value); // DXF in inches
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Trapezoid" || partType === "Circular Bracket") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = (partType === "Holed Mounting Plate" || partType === "Trapezoid") ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    // Validation: diameter required, height not needed for circleBracket
    if (!diameter || 
        ((partType === "Holed Mounting Plate" || partType === "Trapezoid" || partType === "Circular Bracket") && (!holeSize || isNaN(holeSize))) || 
        (partType === "Holed Mounting Plate" && (!holeInset || isNaN(cornerRadius))) || 
        (partType === "Trapezoid" && isNaN(cornerRadius))) {
        alert("Please enter all required fields.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const height = partType === "Circular Bracket" ? diameter : parseFloat(document.getElementById("diameter").value); // Default height for DXF
        const dxfContent = partType === "Holed Mounting Plate" ? part.toDXF(diameter, height, holeSize, holeInset, cornerRadius) :
                          partType === "Trapezoid" ? part.toDXF(diameter, height, holeSize, cornerRadius) :
                          partType === "Circular Bracket" ? part.toDXF(diameter, height, holeSize) :
                          part.toDXF(diameter, height);
        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${partType.toLowerCase()}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
