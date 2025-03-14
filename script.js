// Parts library with circular bracket, 4-bolt pattern, and roll cage tab
const partsLibrary = {
    rectangle: {
        name: "Rectangle Plate",
        draw: (ctx, width, height) => {
            console.log("Drawing rectangle with:", { width, height });
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
                    "10", x.toString(),
                    "20", y.toString(),
                    "40", holeRadius.toString()
                );
            });

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    },
    circleBracket: {
        name: "Circular Bracket",
        draw: (ctx, width, _unusedHeight, holeSize, holeInset) => {
            const radius = width / 2;
            const centerX = radius;
            const centerY = radius;
            const holeRadius = (holeSize / 2) * 10;
            const inset = (radius - holeInset * 10);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            if (holeSize > 0 && holeInset >= 0 && inset >= holeRadius) {
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

            console.log("Drawing circular bracket:", { width, holeSize, holeInset, holeRadius, inset });
        },
        toDXF: (width, _unusedHeight, holeSize, holeInset) => {
            const radius = width / 2;
            const centerX = radius;
            const centerY = radius;
            const holeRadius = holeSize / 2;
            const inset = radius - holeInset;

            let dxf = [
                "0", "SECTION",
                "2", "ENTITIES",
                "0", "CIRCLE",
                "8", "0",
                "10", centerX.toString(),
                "20", centerY.toString(),
                "40", radius.toString()
            ];

            if (holeSize > 0 && holeInset >= 0 && inset >= holeRadius) {
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
    },
    rollCageTab: {
        name: "Roll Cage Tab",
        draw: (ctx, width, height, holeSize) => {
            const scale = 10; // Inches to canvas units
            const svgWidth = 128.66476 / 25.4; // Convert SVG units to inches
            const svgHeight = 196.67934 / 25.4;
            const aspectRatio = svgHeight / svgWidth;

            // Use user-provided height if valid, otherwise calculate based on aspect ratio
            const adjustedHeight = isNaN(height / scale) || height / scale <= 0 ? width * aspectRatio : height / scale;
            const adjustedWidth = width * scale;
            const adjustedTabHeight = adjustedHeight * scale;

            const holeRadius = (holeSize / 2) * scale;
            const tabRadius = adjustedWidth / 2; // Top semicircle radius
            const cornerRadius = (4.8 / 25.4) * scale; // Bottom corner radius from SVG
            const centerX = adjustedWidth / 2;

            // Draw main body (start from bottom center, build upward and back down)
            ctx.beginPath();
            // Start at bottom center (adjusted for SVG transform)
            ctx.moveTo(centerX, adjustedTabHeight);
            // Bottom-left arc (from bottom center to left side)
            ctx.arc(centerX - tabRadius + cornerRadius, adjustedTabHeight - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
            // Left side up to top-left of semicircle
            ctx.lineTo(centerX - tabRadius, tabRadius);
            // Top semicircle (left to right, counterclockwise)
            ctx.arc(centerX, tabRadius, tabRadius, Math.PI, 0, false);
            // Right side down to bottom-right arc
            ctx.lineTo(centerX + tabRadius, adjustedTabHeight - cornerRadius);
            // Bottom-right arc (from right side to bottom center)
            ctx.arc(centerX + tabRadius - cornerRadius, adjustedTabHeight - cornerRadius, cornerRadius, Math.PI / 2, 0, true);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            // Draw hole
            if (holeSize > 0) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(centerX, tabRadius * 0.5, holeRadius, 0, Math.PI * 2); // Hole near top center
                ctx.fill();
                ctx.globalCompositeOperation = "source-over";
            }

            console.log("Drawing roll cage tab:", { width, height: adjustedHeight, holeSize });
        },
        toDXF: (width, height, holeSize) => {
            const svgWidth = 128.66476 / 25.4;
            const svgHeight = 196.67934 / 25.4;
            const aspectRatio = svgHeight / svgWidth;
            const adjustedHeight = isNaN(height) || height <= 0 ? width * aspectRatio : height;

            const tabRadius = width / 2;
            const cornerRadius = 4.8 / 25.4;
            const centerX = tabRadius;
            const holeY = tabRadius * 0.5;
            const holeRadius = holeSize / 2;
            const steps = 16;

            let dxf = ["0", "SECTION", "2", "ENTITIES"];

            // Main body polyline
            dxf.push("0", "POLYLINE", "8", "0", "66", "1");

            // Start at bottom center
            dxf.push("0", "VERTEX", "8", "0", "10", centerX.toString(), "20", adjustedHeight.toString());

            // Bottom-left arc
            for (let i = 0; i <= steps / 4; i++) {
                const angle = i * (Math.PI / 2) / (steps / 4);
                const x = centerX - tabRadius + cornerRadius + cornerRadius * Math.cos(angle);
                const y = adjustedHeight - cornerRadius + cornerRadius * Math.sin(angle);
                dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
            }

            // Left side up
            dxf.push("0", "VERTEX", "8", "0", "10", (centerX - tabRadius).toString(), "20", tabRadius.toString());

            // Top semicircle (left to right)
            for (let i = 0; i <= steps / 2; i++) {
                const angle = Math.PI + i * Math.PI / (steps / 2);
                const x = centerX + tabRadius * Math.cos(angle);
                const y = tabRadius + tabRadius * Math.sin(angle);
                dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
            }

            // Right side down
            dxf.push("0", "VERTEX", "8", "0", "10", (centerX + tabRadius).toString(), "20", (adjustedHeight - cornerRadius).toString());

            // Bottom-right arc
            for (let i = 0; i <= steps / 4; i++) {
                const angle = Math.PI / 2 - i * (Math.PI / 2) / (steps / 4);
                const x = centerX + tabRadius - cornerRadius + cornerRadius * Math.cos(angle);
                const y = adjustedHeight - cornerRadius + cornerRadius * Math.sin(angle);
                dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
            }

            dxf.push("0", "SEQEND");

            // Hole
            if (holeSize > 0) {
                dxf.push(
                    "0", "CIRCLE",
                    "8", "0",
                    "10", centerX.toString(),
                    "20", holeY.toString(),
                    "40", holeRadius.toString()
                );
            }

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    }
};

// DOM event listeners
document.addEventListener("DOMContentLoaded", () => {
    const partItems = document.querySelectorAll("#parts-list li");
    const configForm = document.getElementById("config-form");
    const heightInput = document.getElementById("height");

    if (!partItems.length) {
        console.error("No parts list items found");
        return;
    }

    if (!configForm) {
        console.error("Config form not found");
        return;
    }

    partItems.forEach(item => {
        item.addEventListener("click", () => {
            const partType = item.getAttribute("data-part");
            if (!partsLibrary[partType]) {
                console.error(`Part type ${partType} not found in partsLibrary`);
                return;
            }

            configForm.style.display = "block";
            document.getElementById("part-type").textContent = partsLibrary[partType].name;
            document.getElementById("width").value = "";
            document.getElementById("height").value = "";
            
            const isCircular = partType === "circleBracket";
            heightInput.disabled = isCircular;
            heightInput.style.display = isCircular ? "none" : "block";
            heightInput.previousElementSibling.style.display = isCircular ? "none" : "block";

            const holeOptions = document.getElementById("hole-options");
            const isHoledPart = partType === "holedPlate" || partType === "circleBracket" || partType === "rollCageTab";
            holeOptions.style.display = isHoledPart ? "block" : "none";

            if (isHoledPart) {
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                if (partType === "holedPlate") {
                    document.getElementById("cornerRadius").value = "0";
                    document.getElementById("cornerRadius").style.display = "block";
                    document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("cornerRadius").style.display = "none";
                    document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                }
                if (partType !== "rollCageTab") {
                    document.getElementById("holeInset").style.display = "block";
                    document.getElementById("holeInset").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("holeInset").style.display = "none";
                    document.getElementById("holeInset").previousElementSibling.style.display = "none";
                }
            }
        });
    });

    document.getElementById("preview-btn").addEventListener("click", previewPart);
    document.getElementById("download-btn").addEventListener("click", downloadDXF);
});

function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) * 10 || 20; // Default to 2 inches (20 units) if empty
    const heightInput = parseFloat(document.getElementById("height").value) * 10 || null;
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Roll Cage Tab") ? 
        parseFloat(document.getElementById("holeSize").value) || 0 : 0;
    const holeInset = (partType === "Holed Mounting Plate" || partType === "Circular Bracket") ? 
        parseFloat(document.getElementById("holeInset").value) || 0 : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? 
        parseFloat(document.getElementById("cornerRadius").value) || 0 : 0;

    // Adjust height for Roll Cage Tab to maintain aspect ratio if not provided
    let height = heightInput;
    if (partType === "Circular Bracket") {
        height = width;
    } else if (partType === "Roll Cage Tab") {
        const svgWidth = 128.66476 / 25.4;
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;
        height = heightInput || width * aspectRatio;
    }

    if (!validateInputs(partType, width, height, holeSize, holeInset, cornerRadius)) return;

    const canvas = document.getElementById("part-preview");
    if (!canvas) {
        console.error("Canvas element 'part-preview' not found!");
        return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Failed to get 2D context from canvas!");
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const part = Object.values(partsLibrary).find(p => p.name === partType);
    
    if (part) {
        ctx.save();
        
        const padding = 0.8;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const partWidth = width;
        const partHeight = height;
        
        const scaleX = (canvasWidth * padding) / partWidth;
        const scaleY = (canvasHeight * padding) / partHeight;
        const scale = Math.min(scaleX, scaleY);
        
        const scaledWidth = partWidth * scale;
        const scaledHeight = partHeight * scale;
        const translateX = (canvasWidth - scaledWidth) / 2;
        const translateY = (canvasHeight - scaledHeight) / 2;

        ctx.translate(translateX, translateY);
        ctx.scale(scale, scale);

        try {
            if (partType === "Holed Mounting Plate") {
                part.draw(ctx, width, height, holeSize, holeInset, cornerRadius);
            } else if (partType === "Circular Bracket") {
                part.draw(ctx, width, height, holeSize, holeInset);
            } else if (partType === "Roll Cage Tab") {
                part.draw(ctx, width, height, holeSize);
            } else {
                part.draw(ctx, width, height);
            }
            console.log("Preview drawn successfully for", partType, "with scale:", scale);
        } catch (error) {
            console.error("Error drawing preview:", error);
            alert("Error generating preview. Check console for details.");
        }
        ctx.restore();
    } else {
        console.log("Part not found:", partType);
    }
}

function downloadDXF() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) || 2; // Default to 2 inches if empty
    const heightInput = parseFloat(document.getElementById("height").value) || null;
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Roll Cage Tab") ? 
        parseFloat(document.getElementById("holeSize").value) || 0 : 0;
    const holeInset = (partType === "Holed Mounting Plate" || partType === "Circular Bracket") ? 
        parseFloat(document.getElementById("holeInset").value) || 0 : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? 
        parseFloat(document.getElementById("cornerRadius").value) || 0 : 0;

    let height = heightInput;
    if (partType === "Circular Bracket") {
        height = width;
    } else if (partType === "Roll Cage Tab") {
        const svgWidth = 128.66476 / 25.4;
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;
        height = heightInput || width * aspectRatio;
    }

    if (!validateInputs(partType, width, height, holeSize, holeInset, cornerRadius)) return;

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = partType === "Holed Mounting Plate" ? 
            part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
            partType === "Circular Bracket" ? 
            part.toDXF(width, height, holeSize, holeInset) :
            partType === "Roll Cage Tab" ?
            part.toDXF(width, height, holeSize) :
            part.toDXF(width, height);
        
        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${partType.replace(/\s+/g, '_').toLowerCase()}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function validateInputs(partType, width, height, holeSize, holeInset, cornerRadius) {
    const errors = [];
    if (isNaN(width) || width <= 0) errors.push("Width must be a positive number");
    if (partType !== "Circular Bracket" && partType !== "Roll Cage Tab" && (isNaN(height) || height <= 0)) 
        errors.push("Height must be a positive number");
    if ((partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Roll Cage Tab") && 
        (isNaN(holeSize) || holeSize <= 0)) 
        errors.push("Hole size must be a positive number");
    if ((partType === "Holed Mounting Plate" || partType === "Circular Bracket") && 
        (isNaN(holeInset) || holeInset < 0)) 
        errors.push("Hole inset must be non-negative");
    if (partType === "Holed Mounting Plate" && (isNaN(cornerRadius) || cornerRadius < 0)) 
        errors.push("Corner radius must be non-negative");

    if (errors.length) {
        alert("Validation errors:\n" + errors.join("\n"));
        return false;
    }
    return true;
}
