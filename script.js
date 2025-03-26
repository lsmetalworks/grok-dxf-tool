// Helper function to simplify part creation
function createPart(name, drawFn, dxfFn) {
  return {
    name,
    draw: drawFn,
    toDXF: dxfFn
  };
}

// Parts library with all shapes
const partsLibrary = {
    rectangle: createPart(
        "Rectangle Plate",
        (ctx, width, height) => {
            console.log("Drawing rectangle with:", { width, height });
            ctx.fillStyle = "#666";
            ctx.fillRect(0, 0, width, height);
        },
        (width, height) => {
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
    ),
    gusset: createPart(
        "Triangle Gusset",
        (ctx, width, height) => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();
        },
        (width, height) => {
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
    ),
    holedPlate: createPart(
        "Holed Mounting Plate",
        (ctx, width, height, holeSize, holeInset, cornerRadius) => {
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
        (width, height, holeSize, holeInset, cornerRadius) => {
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
    ),
    circleBracket: createPart(
        "Circular Bracket",
        (ctx, width, _unusedHeight, holeSize, holeInset) => {
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
        (width, _unusedHeight, holeSize, holeInset) => {
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
    ),
    // Updated Roll Cage Tab implementation
rollCageTab: createPart(
    "Roll Cage Tab",
    (ctx, width, height, holeSize) => {
        const scale = 10; // Inches to canvas units
        const svgWidth = 128.66476 / 25.4; // Convert SVG units to inches
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;

        // Calculate dimensions
        const tabWidth = width * scale;
        const tabHeight = (height || width * aspectRatio) * scale;
        const holeRadius = (holeSize / 2) * scale;
        const tabRadius = tabWidth / 2; // Top semicircle radius
        const cornerRadius = (4.8 / 25.4) * scale; // Bottom corner radius
        const centerX = tabWidth / 2;

        // Draw main body
        ctx.beginPath();
        // Start at bottom-left
        ctx.moveTo(0, tabHeight);
        // Bottom-left rounded corner
        ctx.arc(cornerRadius, tabHeight - cornerRadius, cornerRadius, Math.PI / 2, 0, true);
        // Bottom-right rounded corner
        ctx.arc(tabWidth - cornerRadius, tabHeight - cornerRadius, cornerRadius, Math.PI, 3 * Math.PI / 2, true);
        // Right side up to semicircle
        ctx.lineTo(tabWidth, tabRadius);
        // Top semicircle
        ctx.arc(centerX, tabRadius, tabRadius, 0, Math.PI, false);
        // Left side down to start point
        ctx.lineTo(0, tabHeight);
        ctx.closePath();
        ctx.fillStyle = "#666";
        ctx.fill();

        // Draw hole if specified
        if (holeSize > 0) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(centerX, tabRadius * 0.6, holeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        }
    },
    (width, height, holeSize) => {
        const svgWidth = 128.66476 / 25.4;
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;
        const tabHeight = height || width * aspectRatio;
        const tabRadius = width / 2;
        const cornerRadius = 4.8 / 25.4;
        const centerX = tabRadius;
        const holeY = tabRadius * 0.6;
        const holeRadius = holeSize / 2;
        const steps = 16;

        let dxf = ["0", "SECTION", "2", "ENTITIES"];

        // Main body polyline
        dxf.push("0", "POLYLINE", "8", "0", "66", "1");

        // Start at bottom-left
        dxf.push("0", "VERTEX", "8", "0", "10", "0", "20", tabHeight.toString());

        // Bottom-left arc
        for (let i = 0; i <= steps / 4; i++) {
            const angle = Math.PI / 2 - i * (Math.PI / 2) / (steps / 4);
            const x = cornerRadius + cornerRadius * Math.cos(angle);
            const y = tabHeight - cornerRadius + cornerRadius * Math.sin(angle);
            dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
        }

        // Bottom-right arc
        for (let i = 0; i <= steps / 4; i++) {
            const angle = Math.PI + i * (Math.PI / 2) / (steps / 4);
            const x = width - cornerRadius + cornerRadius * Math.cos(angle);
            const y = tabHeight - cornerRadius + cornerRadius * Math.sin(angle);
            dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
        }

        // Right side up
        dxf.push("0", "VERTEX", "8", "0", "10", width.toString(), "20", tabRadius.toString());

        // Top semicircle
        for (let i = 0; i <= steps / 2; i++) {
            const angle = -i * Math.PI / (steps / 2);
            const x = centerX + tabRadius * Math.cos(angle);
            const y = tabRadius + tabRadius * Math.sin(angle);
            dxf.push("0", "VERTEX", "8", "0", "10", x.toString(), "20", y.toString());
        }

        // Close the shape
        dxf.push("0", "VERTEX", "8", "0", "10", "0", "20", tabHeight.toString());
        dxf.push("0", "SEQEND");

        // Hole if specified
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
),
    flangedBracket: createPart(
        "Flanged Bracket (L-Shaped)",
        (ctx, width, height, thickness) => {
            ctx.fillStyle = "#666";
            // Vertical leg
            ctx.fillRect(0, 0, thickness * 10, height * 10);
            // Horizontal leg
            ctx.fillRect(0, height * 10 - thickness * 10, width * 10, thickness * 10);
        },
        (width, height, thickness = 0.25) => {
            return [
                "0", "SECTION", "2", "ENTITIES",
                // Vertical leg
                "0", "POLYLINE", "8", "0", "66", "1",
                "0", "VERTEX", "8", "0", "10", "0", "20", "0",
                "0", "VERTEX", "8", "0", "10", thickness.toString(), "20", "0",
                "0", "VERTEX", "8", "0", "10", thickness.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0", "20", height.toString(),
                "0", "SEQEND",
                // Horizontal leg
                "0", "POLYLINE", "8", "0", "66", "1",
                "0", "VERTEX", "8", "0", "10", "0", "20", (height-thickness).toString(),
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", (height-thickness).toString(),
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0", "20", height.toString(),
                "0", "SEQEND",
                "0", "ENDSEC", "0", "EOF"
            ].join("\n");
        }
    ),
    uChannel: createPart(
        "U-Channel",
        (ctx, width, height, thickness) => {
            ctx.fillStyle = "#666";
            // Bottom
            ctx.fillRect(0, 0, width * 10, thickness * 10);
            // Left side
            ctx.fillRect(0, 0, thickness * 10, height * 10);
            // Right side
            ctx.fillRect(width * 10 - thickness * 10, 0, thickness * 10, height * 10);
        },
        (width, height, thickness = 0.25) => {
            return [
                "0", "SECTION", "2", "ENTITIES",
                // Bottom
                "0", "POLYLINE", "8", "0", "66", "1",
                "0", "VERTEX", "8", "0", "10", "0", "20", "0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", thickness.toString(),
                "0", "VERTEX", "8", "0", "10", "0", "20", thickness.toString(),
                "0", "SEQEND",
                // Left side
                "0", "POLYLINE", "8", "0", "66", "1",
                "0", "VERTEX", "8", "0", "10", "0", "20", "0",
                "0", "VERTEX", "8", "0", "10", thickness.toString(), "20", "0",
                "0", "VERTEX", "8", "0", "10", thickness.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0", "20", height.toString(),
                "0", "SEQEND",
                // Right side
                "0", "POLYLINE", "8", "0", "66", "1",
                "0", "VERTEX", "8", "0", "10", (width-thickness).toString(), "20", "0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", (width-thickness).toString(), "20", height.toString(),
                "0", "SEQEND",
                "0", "ENDSEC", "0", "EOF"
            ].join("\n");
        }
    ),
    slottedHolePlate: createPart(
        "Slotted Hole Plate",
        (ctx, width, height, holeWidth, holeLength, holeInset) => {
            ctx.fillStyle = "#666";
            ctx.fillRect(0, 0, width * 10, height * 10);
            
            ctx.globalCompositeOperation = "destination-out";
            const centers = [
                [holeInset * 10, height * 10 / 2],
                [width * 10 - holeInset * 10, height * 10 / 2]
            ];
            
            centers.forEach(([x, y]) => {
                ctx.beginPath();
                // Draw rounded rectangle (slot)
                const radius = holeWidth * 10 / 2;
                ctx.moveTo(x - holeLength * 10 / 2 + radius, y - radius);
                ctx.lineTo(x + holeLength * 10 / 2 - radius, y - radius);
                ctx.arc(x + holeLength * 10 / 2 - radius, y, radius, -Math.PI/2, Math.PI/2);
                ctx.lineTo(x - holeLength * 10 / 2 + radius, y + radius);
                ctx.arc(x - holeLength * 10 / 2 + radius, y, radius, Math.PI/2, -Math.PI/2);
                ctx.closePath();
                ctx.fill();
            });
            
            ctx.globalCompositeOperation = "source-over";
        },
        (width, height, holeWidth = 0.25, holeLength = 1, holeInset = 0.5) => {
            const radius = holeWidth/2;
            const dxf = ["0", "SECTION", "2", "ENTITIES"];
            
            // Main plate
            dxf.push(
                "0", "POLYLINE", "8", "0", "66", "1",
                "0", "VERTEX", "8", "0", "10", "0", "20", "0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", "0",
                "0", "VERTEX", "8", "0", "10", width.toString(), "20", height.toString(),
                "0", "VERTEX", "8", "0", "10", "0", "20", height.toString(),
                "0", "SEQEND"
            );
            
            // Slots
            const centers = [
                [holeInset, height/2],
                [width - holeInset, height/2]
            ];
            
            centers.forEach(([x, y]) => {
                const steps = 8;
                dxf.push("0", "POLYLINE", "8", "0", "66", "1");
                
                // Start at top-left corner
                dxf.push("0", "VERTEX", "8", "0", "10", (x - holeLength/2 + radius).toString(), "20", (y - radius).toString());
                
                // Top line
                dxf.push("0", "VERTEX", "8", "0", "10", (x + holeLength/2 - radius).toString(), "20", (y - radius).toString());
                
                // Right semicircle
                for (let i = 0; i <= steps; i++) {
                    const angle = -Math.PI/2 + (Math.PI * i/steps);
                    const px = x + holeLength/2 - radius + radius * Math.cos(angle);
                    const py = y + radius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", px.toString(), "20", py.toString());
                }
                
                // Bottom line
                dxf.push("0", "VERTEX", "8", "0", "10", (x - holeLength/2 + radius).toString(), "20", (y + radius).toString());
                
                // Left semicircle
                for (let i = 0; i <= steps; i++) {
                    const angle = Math.PI/2 + (Math.PI * i/steps);
                    const px = x - holeLength/2 + radius + radius * Math.cos(angle);
                    const py = y + radius * Math.sin(angle);
                    dxf.push("0", "VERTEX", "8", "0", "10", px.toString(), "20", py.toString());
                }
                
                dxf.push("0", "SEQEND");
            });
            
            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    )
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
            const part = partsLibrary[partType];
            
            if (!part) {
                console.error(`Part type ${partType} not found in partsLibrary`);
                return;
            }

            configForm.style.display = "block";
            document.getElementById("part-type").textContent = part.name;
            
            // Reset all inputs
            document.getElementById("width").value = "";
            document.getElementById("height").value = "";
            
            // Show/hide height based on part type
            const isCircular = ["circleBracket", "flangedBracket"].includes(partType);
            heightInput.disabled = isCircular;
            heightInput.style.display = isCircular ? "none" : "block";
            heightInput.previousElementSibling.style.display = isCircular ? "none" : "block";

            // Configure hole options
            const holeOptions = document.getElementById("hole-options");
            const isHoledPart = ["holedPlate", "circleBracket", "rollCageTab", "slottedHolePlate"].includes(partType);
            holeOptions.style.display = isHoledPart ? "block" : "none";

            if (isHoledPart) {
                // Configure default values based on part type
                if (partType === "slottedHolePlate") {
                    document.getElementById("holeSize").value = "0.25";
                    document.getElementById("holeInset").value = "0.5";
                    document.getElementById("holeLength").value = "1.0";
                    document.getElementById("holeLength").style.display = "block";
                    document.getElementById("holeLength").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("holeSize").value = "0.25";
                    document.getElementById("holeInset").value = "0.5";
                    document.getElementById("holeLength").style.display = "none";
                    document.getElementById("holeLength").previousElementSibling.style.display = "none";
                }
                
                // Show/hide corner radius
                if (partType === "holedPlate") {
                    document.getElementById("cornerRadius").value = "0";
                    document.getElementById("cornerRadius").style.display = "block";
                    document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("cornerRadius").style.display = "none";
                    document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                }
                
                // Show/hide hole inset
                if (partType !== "rollCageTab") {
                    document.getElementById("holeInset").style.display = "block";
                    document.getElementById("holeInset").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("holeInset").style.display = "none";
                    document.getElementById("holeInset").previousElementSibling.style.display = "none";
                }
            }

            // Show/hide thickness for flanged/U-channel parts
            const thicknessControl = document.getElementById("thickness");
            if (thicknessControl) {
                if (["flangedBracket", "uChannel"].includes(partType)) {
                    thicknessControl.value = "0.25";
                    thicknessControl.style.display = "block";
                    thicknessControl.previousElementSibling.style.display = "block";
                } else {
                    thicknessControl.style.display = "none";
                    thicknessControl.previousElementSibling.style.display = "none";
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
    const holeSize = (["Holed Mounting Plate", "Circular Bracket", "Roll Cage Tab", "Slotted Hole Plate"].includes(partType)) ? 
        parseFloat(document.getElementById("holeSize").value) || 0 : 0;
    const holeInset = (["Holed Mounting Plate", "Circular Bracket", "Slotted Hole Plate"].includes(partType)) ? 
        parseFloat(document.getElementById("holeInset").value) || 0 : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? 
        parseFloat(document.getElementById("cornerRadius").value) || 0 : 0;
    const holeLength = partType === "Slotted Hole Plate" ? 
        parseFloat(document.getElementById("holeLength").value) || 1 : 0;
    const thickness = (["Flanged Bracket (L-Shaped)", "U-Channel"].includes(partType)) ?
        parseFloat(document.getElementById("thickness").value) || 0.25 : 0;

    // Adjust height for special cases
    let height = heightInput;
    if (partType === "Circular Bracket") {
        height = width;
    } else if (partType === "Roll Cage Tab") {
        const svgWidth = 128.66476 / 25.4;
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;
        height = (heightInput && heightInput > 0) ? heightInput : width * aspectRatio;
    }

    if (!validateInputs(partType, width, height, holeSize, holeInset, cornerRadius, holeLength, thickness)) return;

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
            } else if (partType === "Slotted Hole Plate") {
                part.draw(ctx, width, height, holeSize, holeLength, holeInset);
            } else if (["Flanged Bracket (L-Shaped)", "U-Channel"].includes(partType)) {
                part.draw(ctx, width, height, thickness);
            } else {
                part.draw(ctx, width, height);
            }
            console.log("Preview drawn successfully for", partType, "with scale:", scale, "width:", width, "height:", height);
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
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Roll Cage Tab" || partType === "Slotted Hole Plate") ? 
        parseFloat(document.getElementById("holeSize").value) || 0 : 0;
    const holeInset = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Slotted Hole Plate") ? 
        parseFloat(document.getElementById("holeInset").value) || 0 : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? 
        parseFloat(document.getElementById("cornerRadius").value) || 0 : 0;
    const holeLength = partType === "Slotted Hole Plate" ?
        parseFloat(document.getElementById("holeLength").value) || 1 : 0;

    let height = heightInput;
    if (partType === "Circular Bracket" || partType === "Flanged Bracket") {
        height = width;
    } else if (partType === "Roll Cage Tab") {
        const svgWidth = 128.66476 / 25.4;
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;
        height = (heightInput && heightInput > 0) ? heightInput : width * aspectRatio;
    }

    if (!validateInputs(partType, width, height, holeSize, holeInset, cornerRadius, holeLength)) return;

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = 
            partType === "Holed Mounting Plate" ? 
                part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
            partType === "Circular Bracket" ? 
                part.toDXF(width, height, holeSize, holeInset) :
            partType === "Roll Cage Tab" ?
                part.toDXF(width, height, holeSize) :
            partType === "Flanged Bracket" ?
                part.toDXF(width, height, holeSize) :
            partType === "U-Channel" ?
                part.toDXF(width, height, holeSize) :
            partType === "Slotted Hole Plate" ?
                part.toDXF(width, height, holeSize, holeLength, holeInset) :
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

function validateInputs(partType, width, height, holeSize, holeInset, cornerRadius, holeLength) {
    const errors = [];
    if (isNaN(width) || width <= 0) errors.push("Width must be a positive number");
    if (partType !== "Circular Bracket" && partType !== "Flanged Bracket" && partType !== "Roll Cage Tab" && (isNaN(height) || height <= 0)) 
        errors.push("Height must be a positive number");
    if ((partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Roll Cage Tab" || partType === "Slotted Hole Plate") && 
        (isNaN(holeSize) || holeSize <= 0)) 
        errors.push("Hole size must be a positive number");
    if ((partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Slotted Hole Plate") && 
        (isNaN(holeInset) || holeInset < 0)) 
        errors.push("Hole inset must be non-negative");
    if (partType === "Holed Mounting Plate" && (isNaN(cornerRadius) || cornerRadius < 0)) 
        errors.push("Corner radius must be non-negative");
    if (partType === "Slotted Hole Plate" && (isNaN(holeLength) || holeLength <= 0))
        errors.push("Slot length must be a positive number");

    if (errors.length) {
        alert("Validation errors:\n" + errors.join("\n"));
        return false;
    }
    return true;
}

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
            const part = partsLibrary[partType];
            
            if (!part) {
                console.error(`Part type ${partType} not found in partsLibrary`);
                return;
            }

            configForm.style.display = "block";
            document.getElementById("part-type").textContent = part.name;
            
            // Reset all inputs
            document.getElementById("width").value = "";
            document.getElementById("height").value = "";
            
            // Show/hide height based on part type
            const isCircular = partType === "circleBracket" || partType === "flangedBracket";
            heightInput.disabled = isCircular;
            heightInput.style.display = isCircular ? "none" : "block";
            heightInput.previousElementSibling.style.display = isCircular ? "none" : "block";

            // Configure hole options
            const holeOptions = document.getElementById("hole-options");
            const isHoledPart = ["holedPlate", "circleBracket", "rollCageTab", "slottedHolePlate"].includes(partType);
            holeOptions.style.display = isHoledPart ? "block" : "none";

            if (isHoledPart) {
                // Configure default values based on part type
                if (partType === "slottedHolePlate") {
                    document.getElementById("holeSize").value = "0.25";
                    document.getElementById("holeInset").value = "0.5";
                    document.getElementById("holeLength").value = "1.0";
                    document.getElementById("holeLength").style.display = "block";
                    document.getElementById("holeLength").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("holeSize").value = "0.25";
                    document.getElementById("holeInset").value = "0.5";
                    document.getElementById("holeLength").style.display = "none";
                    document.getElementById("holeLength").previousElementSibling.style.display = "none";
                }
                
                // Show/hide corner radius
                if (partType === "holedPlate") {
                    document.getElementById("cornerRadius").value = "0";
                    document.getElementById("cornerRadius").style.display = "block";
                    document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("cornerRadius").style.display = "none";
                    document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                }
                
                // Show/hide hole inset
                if (partType !== "rollCageTab") {
                    document.getElementById("holeInset").style.display = "block";
                    document.getElementById("holeInset").previousElementSibling.style.display = "block";
                } else {
                    document.getElementById("holeInset").style.display = "none";
                    document.getElementById("holeInset").previousElementSibling.style.display = "none";
                }
            } else {
                // Hide all hole-related inputs for non-holed parts
                document.getElementById("holeSize").style.display = "none";
                document.getElementById("holeSize").previousElementSibling.style.display = "none";
                document.getElementById("holeInset").style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "none";
                document.getElementById("holeLength").style.display = "none";
                document.getElementById("holeLength").previousElementSibling.style.display = "none";
                document.getElementById("cornerRadius").style.display = "none";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
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
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Roll Cage Tab" || partType === "Slotted Hole Plate") ? 
        parseFloat(document.getElementById("holeSize").value) || 0 : 0;
    const holeInset = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Slotted Hole Plate") ? 
        parseFloat(document.getElementById("holeInset").value) || 0 : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? 
        parseFloat(document.getElementById("cornerRadius").value) || 0 : 0;
    const holeLength = partType === "Slotted Hole Plate" ?
        parseFloat(document.getElementById("holeLength").value) || 1 : 0;

    // Adjust height for special cases
    let height = heightInput;
    if (partType === "Circular Bracket" || partType === "Flanged Bracket") {
        height = width;
    } else if (partType === "Roll Cage Tab") {
        const svgWidth = 128.66476 / 25.4;
        const svgHeight = 196.67934 / 25.4;
        const aspectRatio = svgHeight / svgWidth;
        height = (heightInput && heightInput > 0) ? heightInput : width * aspectRatio;
    }

    if (!validateInputs(partType, width, height, holeSize, holeInset, cornerRadius, holeLength)) return;

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
            } else if (partType === "Flanged Bracket") {
                part.draw(ctx, width, height, holeSize);
            } else if (partType === "U-Channel") {
                part.draw(ctx, width, height, holeSize);
            } else if (partType === "Slotted Hole Plate") {
                part.draw(ctx, width, height, holeSize, holeLength, holeInset);
            } else {
                part.draw(ctx, width, height);
            }
            console.log("Preview drawn successfully for", partType, "with scale:", scale, "width:", width, "height:", height);
        } catch (error) {
            console.error("Error drawing preview:", error);
            alert("Error generating preview. Check console for details.");
        }
        ctx.restore();
    } else {
        console.log("Part not found:", partType);
    }
}
