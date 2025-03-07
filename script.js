// Parts library with trapezoid and common radius on short side
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
                    "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0",
                    "0", "VERTEX", "8", "0", "10", width.toString(), "20", height.toString(),
                    "0", "VERTEX", "8", "0", "10", "0.0", "20", height.toString(),
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
        name: "Trapezoid",
        draw: (ctx, width, height, holeSize, cornerRadius = 0) => {
            const r = cornerRadius * 10; // Canvas units
            const topWidth = width * 0.2; // Short top side (20% of base width)
            const topY = height; // Top at specified height
            const topLeftX = (width - topWidth) / 2;
            const topRightX = topLeftX + topWidth;

            ctx.beginPath();
            ctx.moveTo(0, 0); // Bottom-left

            console.log("Drawing trapezoid:", { width, height, r, topWidth, topY, topLeftX, topRightX });

            if (r > 0 && r <= topWidth / 2) { // Ensure radius fits within top width
                // Left arc center
                const leftCenterX = topLeftX + r;
                const leftCenterY = topY - r;
                const mLeft = (topY - r) / topLeftX; // Slope of left side

                // Left tangent points
                const aLeft = 1 + mLeft * mLeft;
                const bLeft = -2 * leftCenterX - 2 * mLeft * leftCenterY;
                const cLeft = leftCenterX * leftCenterX + leftCenterY * leftCenterY - r * r;
                const discLeft = bLeft * bLeft - 4 * aLeft * cLeft;

                // Right arc center
                const rightCenterX = topRightX - r;
                const rightCenterY = topY - r;
                const mRight = (topY - r) / (width - topRightX); // Slope of right side

                // Right tangent points
                const aRight = 1 + mRight * mRight;
                const bRight = -2 * rightCenterX + 2 * mRight * (rightCenterY - height);
                const cRight = rightCenterX * rightCenterX + (rightCenterY - height) * (rightCenterY - height) - r * r;
                const discRight = bRight * bRight - 4 * aRight * cRight;

                console.log("Arc calc:", { discLeft, discRight });

                if (discLeft >= 0 && discRight >= 0) {
                    const sqrtDiscLeft = Math.sqrt(discLeft);
                    const xLeft1 = (-bLeft - sqrtDiscLeft) / (2 * aLeft);
                    const xLeft2 = (-bLeft + sqrtDiscLeft) / (2 * aLeft);
                    const leftTangentXBottom = xLeft2; // Closer to base
                    const leftTangentYBottom = mLeft * leftTangentXBottom;
                    const leftTangentXTop = leftCenterX;
                    const leftTangentYTop = leftCenterY + r;

                    const sqrtDiscRight = Math.sqrt(discRight);
                    const xRight1 = (-bRight - sqrtDiscRight) / (2 * aRight);
                    const xRight2 = (-bRight + sqrtDiscRight) / (2 * aRight);
                    const rightTangentXBottom = xRight1; // Closer to base
                    const rightTangentYBottom = height - mRight * (width - rightTangentXBottom);
                    const rightTangentXTop = rightCenterX;
                    const rightTangentYTop = rightCenterY + r;

                    console.log("Tangent points:", {
                        leftTangentXBottom, leftTangentYBottom, leftTangentXTop, leftTangentYTop,
                        rightTangentXBottom, rightTangentYBottom, rightTangentXTop, rightTangentYTop
                    });

                    ctx.lineTo(leftTangentXBottom, leftTangentYBottom);
                    ctx.arc(leftCenterX, leftCenterY, r, Math.atan2(leftTangentYBottom - leftCenterY, leftTangentXBottom - leftCenterX), Math.PI / 2, false);
                    ctx.lineTo(rightTangentXTop, rightTangentYTop);
                    ctx.arc(rightCenterX, rightCenterY, r, Math.PI / 2, Math.atan2(rightTangentYBottom - rightCenterY, rightTangentXBottom - rightCenterX), false);
                    ctx.lineTo(width, 0);
                } else {
                    console.log("Invalid radius for tangency, using flat top:", { r, width, height });
                    ctx.lineTo(topLeftX, topY);
                    ctx.lineTo(topRightX, topY);
                    ctx.lineTo(width, 0);
                }
            } else {
                console.log("No radius or radius too large, flat top");
                ctx.lineTo(topLeftX, topY);
                ctx.lineTo(topRightX, topY);
                ctx.lineTo(width, 0);
            }

            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            if (holeSize > 0) {
                ctx.globalCompositeOperation = "destination-out";
                const holeRadius = (holeSize / 2) * 10;
                const centroidX = width / 2;
                const centroidY = height / 3;
                ctx.beginPath();
                ctx.arc(centroidX, centroidY, holeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = "source-over";
            }
        },
        toDXF: (width, height, holeSize, cornerRadius = 0) => {
            let dxf = [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "LWPOLYLINE",
                "5", "102",
                "100", "AcDbEntity",
                "8", "0",
                "100", "AcDbPolyline",
                "90", "6", // 6 vertices for trapezoid with arcs
                "70", "1",
                "43", "0.0"
            ];

            const r = cornerRadius; // DXF in inches
            const topWidth = width * 0.2;
            const topY = height;
            const topLeftX = (width - topWidth) / 2;
            const topRightX = topLeftX + topWidth;

            dxf.push("0", "VERTEX", "8", "0", "10", "0.0", "20", "0.0");

            if (r > 0 && r <= topWidth / 2) {
                const mLeft = (height - r) / topLeftX;
                const leftCenterX = topLeftX + r;
                const leftCenterY = topY - r;

                const aLeft = 1 + mLeft * mLeft;
                const bLeft = -2 * leftCenterX - 2 * mLeft * leftCenterY;
                const cLeft = leftCenterX * leftCenterX + leftCenterY * leftCenterY - r * r;
                const discLeft = bLeft * bLeft - 4 * aLeft * cLeft;

                const mRight = (height - r) / (width - topRightX);
                const rightCenterX = topRightX - r;
                const rightCenterY = topY - r;

                const aRight = 1 + mRight * mRight;
                const bRight = -2 * rightCenterX + 2 * mRight * (rightCenterY - height);
                const cRight = rightCenterX * rightCenterX + (rightCenterY - height) * (rightCenterY - height) - r * r;
                const discRight = bRight * bRight - 4 * aRight * cRight;

                if (discLeft >= 0 && discRight >= 0) {
                    const sqrtDiscLeft = Math.sqrt(discLeft);
                    const xLeft2 = (-bLeft + sqrtDiscLeft) / (2 * aLeft);
                    const leftTangentXBottom = xLeft2;
                    const leftTangentYBottom = mLeft * leftTangentXBottom;
                    const leftTangentXTop = leftCenterX;
                    const leftTangentYTop = leftCenterY + r;

                    const sqrtDiscRight = Math.sqrt(discRight);
                    const xRight1 = (-bRight - sqrtDiscRight) / (2 * aRight);
                    const rightTangentXBottom = xRight1;
                    const rightTangentYBottom = height - mRight * (width - rightTangentXBottom);
                    const rightTangentXTop = rightCenterX;
                    const rightTangentYTop = rightCenterY + r;

                    dxf.push("0", "VERTEX", "8", "0", "10", leftTangentXBottom.toString(), "20", leftTangentYBottom.toString());
                    dxf.push("0", "VERTEX", "8", "0", "10", leftTangentXTop.toString(), "20", leftTangentYTop.toString(), "42", "-0.78077640640441359");
                    dxf.push("0", "VERTEX", "8", "0", "10", rightTangentXTop.toString(), "20", rightTangentYTop.toString());
                    dxf.push("0", "VERTEX", "8", "0", "10", rightTangentXBottom.toString(), "20", rightTangentYBottom.toString(), "42", "-0.78077640640441359");
                } else {
                    dxf.push("0", "VERTEX", "8", "0", "10", topLeftX.toString(), "20", topY.toString());
                    dxf.push("0", "VERTEX", "8", "0", "10", topRightX.toString(), "20", topY.toString());
                }
            } else {
                dxf.push("0", "VERTEX", "8", "0", "10", topLeftX.toString(), "20", topY.toString());
                dxf.push("0", "VERTEX", "8", "0", "10", topRightX.toString(), "20", topY.toString());
            }

            dxf.push("0", "VERTEX", "8", "0", "10", width.toString(), "20", "0.0");
            dxf.push("0", "SEQEND", "0", "ENDSEC", "0", "EOF");

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
            document.getElementById("cornerRadius").value = "0";
            document.getElementById("holeInset").style.display = "none";
            document.getElementById("cornerRadius").style.display = "block";
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
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Trapezoid") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = (partType === "Holed Mounting Plate" || partType === "Trapezoid") ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    console.log("Previewing:", { partType, width, height, holeSize, holeInset, cornerRadius });

    if (!width || !height || ((partType === "Holed Mounting Plate" || partType === "Trapezoid") && (!holeSize || isNaN(holeSize))) || 
        (partType === "Holed Mounting Plate" && (!holeInset || isNaN(cornerRadius))) || 
        (partType === "Trapezoid" && (isNaN(cornerRadius)))) {
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
        ctx.translate(200 - width / 2, 200 - height); // Bottom-left at (x, 0), top at height
        try {
            if (partType === "Holed Mounting Plate") {
                part.draw(ctx, width, height, holeSize, holeInset, cornerRadius);
            } else if (partType === "Trapezoid") {
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
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Trapezoid") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = (partType === "Holed Mounting Plate" || partType === "Trapezoid") ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    if (!width || !height || ((partType === "Holed Mounting Plate" || partType === "Trapezoid") && (!holeSize || isNaN(holeSize))) || 
        (partType === "Holed Mounting Plate" && (!holeInset || isNaN(cornerRadius))) || 
        (partType === "Trapezoid" && (isNaN(cornerRadius)))) {
        alert("Please enter all required fields.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = partType === "Holed Mounting Plate" ? part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
                          partType === "Trapezoid" ? part.toDXF(width, height, holeSize, cornerRadius) :
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
