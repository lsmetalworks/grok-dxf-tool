// Parts library with circular bracket, 4-bolt pattern, adjustable perforated bracket, and mounting tab
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
            const inset = Math.min(radius - holeRadius, Math.max(holeRadius, radius - holeInset * 10));

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
    perforatedBracket: {
        name: "Perforated Mounting Bracket",
        draw: (ctx, width, height, holeSize, holeX, holeY) => {
            const vertices = [
                [12.51, 14.395],    // Top right
                [17.45, -13.855],   // Bottom right outer
                [16.06, -14.395],   // Bottom right inner
                [-16.06, -14.395],  // Bottom left inner
                [-17.45, -13.855],  // Bottom left outer
                [-12.51, 14.395]    // Top left
            ];

            ctx.beginPath();
            ctx.moveTo(vertices[0][0], vertices[0][1]);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i][0], vertices[i][1]);
            }
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            const [centerX, centerY] = calculateCentroid(vertices);
            ctx.globalCompositeOperation = "destination-out";
            const holeRadius = (holeSize / 2) * 10;
            const adjustedHoleX = centerX + holeX;
            const adjustedHoleY = centerY + holeY;
            ctx.beginPath();
            ctx.arc(adjustedHoleX * 10, adjustedHoleY * 10, holeRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";

            console.log("Hole position:", { adjustedHoleX, adjustedHoleY, holeRadius });
        },
        toDXF: (width, height, holeSize, holeX, holeY) => {
            const originalWidth = 34.9;
            const originalHeight = 28.79;
            const scaleX = width / originalWidth;
            const scaleY = height / originalHeight;

            let dxf = ["0", "SECTION", "2", "ENTITIES"];
            dxf.push(
                "0", "LWPOLYLINE", "8", "0",
                "90", "6", "70", "1"
            );
            const vertices = [
                [12.51, 2.19],
                [17.45, -26.06],
                [16.06, -26.60],
                [-16.06, -26.60],
                [-17.45, -26.06],
                [-12.51, 2.19]
            ];
            for (let v of vertices) {
                dxf.push("10", (v[0] * scaleX).toString(), "20", (v[1] * scaleY).toString());
            }
            dxf.push("0", "SEQEND");

            const [centerX, centerY] = calculateCentroid(vertices);
            const holeRadius = holeSize / 2;
            const adjustedHoleX = centerX + holeX;
            const adjustedHoleY = centerY + holeY;
            dxf.push(
                "0", "CIRCLE", "8", "0",
                "10", adjustedHoleX.toString(), "20", adjustedHoleY.toString(),
                "40", holeRadius.toString()
            );

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    },
    mountingTab: {
        name: "Radius Rollcage Mounting Tab",
        draw: (ctx, width, height, holeRadius, tabRadius, tabHeight, cornerRadius) => {
            const centerX = width / 2;
            const scale = 50; // 50px per inch (adjust if needed)

            // Calculate tab dimensions in canvas units
            const tabTopY = height / 2 - (tabRadius + tabHeight / 2) * (scale / 10); // Center vertically
            const scaledTabRadius = tabRadius * (scale / 10);
            const scaledTabHeight = tabHeight * (scale / 10);
            const scaledCornerRadius = Math.max(cornerRadius * (scale / 10), 1); // Ensure minimum radius
            const scaledHoleRadius = holeRadius * (scale / 10);

            // Draw tab body
            ctx.beginPath();
            const tabStartX = centerX + scaledTabRadius;
            ctx.moveTo(tabStartX, tabTopY);
            ctx.arc(centerX, tabTopY, scaledTabRadius, 0, Math.PI, true); // Top semicircle
            ctx.lineTo(centerX - scaledTabRadius, tabTopY + scaledTabHeight); // Left side
            ctx.arcTo(centerX - scaledTabRadius, tabTopY + scaledTabHeight + scaledCornerRadius,
                     centerX - scaledTabRadius + scaledCornerRadius, tabTopY + scaledTabHeight,
                     scaledCornerRadius); // Bottom-left corner (fixed Y to avoid overlap)
            ctx.arc(centerX, tabTopY + scaledTabHeight + scaledCornerRadius,
                    scaledTabRadius, Math.PI, 0, false); // Bottom arc
            ctx.arcTo(centerX + scaledTabRadius, tabTopY + scaledTabHeight + scaledCornerRadius,
                     centerX + scaledTabRadius, tabTopY + scaledTabHeight,
                     scaledCornerRadius); // Bottom-right corner
            ctx.lineTo(tabStartX, tabTopY); // Back to start
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            // Draw hole (constrained to top vertex of semicircle)
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(centerX, tabTopY, scaledHoleRadius, 0, 2 * Math.PI); // Hole at top vertex
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        },
        toDXF: (width, height, holeRadius, tabRadius, tabHeight, cornerRadius) => {
            let dxf = ["0", "SECTION", "2", "ENTITIES"];
            const centerX = width / 2;
            const centerY = height / 2;

            // Hole (at top vertex of semicircle)
            const tabTopY = centerY - (tabHeight + tabRadius); // Top of semicircle in inches
            dxf.push(
                "0", "CIRCLE",
                "8", "0",
                "10", centerX.toString(),
                "20", tabTopY.toString(),
                "40", holeRadius.toString()
            );

            // Tab body
            const steps = 12; // More steps for smoother arcs
            dxf.push("0", "LWPOLYLINE", "8", "0", "90", (steps * 2 + 4).toString(), "70", "1");
            dxf.push("10", (centerX + tabRadius).toString(), "20", tabTopY.toString()); // Start
            for (let i = 0; i <= steps; i++) {
                const angle = Math.PI * (i / steps);
                const x = centerX + tabRadius * Math.cos(angle);
                const y = tabTopY + tabRadius * Math.sin(angle);
                dxf.push("10", x.toString(), "20", y.toString());
            }
            dxf.push("10", (centerX - tabRadius).toString(), "20", (tabTopY + tabHeight).toString()); // Left bottom
            for (let i = 0; i <= steps; i++) {
                const angle = Math.PI + Math.PI * (i / steps);
                const x = centerX + tabRadius * Math.cos(angle);
                const y = tabTopY + tabHeight + cornerRadius * (1 - Math.cos(angle));
                dxf.push("10", x.toString(), "20", y.toString());
            }
            dxf.push("10", (centerX + tabRadius).toString(), "20", tabTopY.toString()); // Back to start
            dxf.push("0", "SEQEND");

            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    }
};

// Function to calculate the centroid of a polygon
function calculateCentroid(vertices) {
    let area = 0;
    let cx = 0;
    let cy = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
        const x0 = vertices[i][0];
        const y0 = vertices[i][1];
        const x1 = vertices[(i + 1) % n][0];
        const y1 = vertices[(i + 1) % n][1];
        const a = x0 * y1 - x1 * y0;
        area += a;
        cx += (x0 + x1) * a;
        cy += (y0 + y1) * a;
    }

    area /= 2;
    cx /= (6 * area);
    cy /= (6 * area);
    return [cx, cy];
}

// Centralized input validation aligned with HTML constraints
function validateInputs(partType, width, height, holeSize, holeInset, cornerRadius, holeX, holeY, tabRadius, tabHeight) {
    const errors = [];
    if (partType !== "Radius Rollcage Mounting Tab") {
        if (!width || width < 0.1) errors.push("Width must be at least 0.1 inches.");
        if (partType !== "Circular Bracket" && (!height || height < 0.1)) errors.push("Height must be at least 0.1 inches.");
        if (["Holed Mounting Plate", "Circular Bracket", "Perforated Mounting Bracket"].includes(partType)) {
            if (!holeSize || holeSize < 0.1) errors.push("Hole size must be at least 0.1 inches.");
            if (holeSize > 10) errors.push("Hole size cannot exceed 10 inches.");
            if (holeSize > Math.min(width, height)) errors.push("Hole size cannot exceed part dimensions.");
        }
        if (["Holed Mounting Plate", "Circular Bracket"].includes(partType)) {
            if (holeInset < 0.25) errors.push("Hole offset must be at least 0.25 inches.");
        }
        if (partType === "Holed Mounting Plate") {
            if (cornerRadius < 0) errors.push("Corner radius cannot be negative.");
            if (cornerRadius > 1) errors.push("Corner radius cannot exceed 1 inch.");
        }
        if (partType === "Perforated Mounting Bracket" && (isNaN(holeX) || isNaN(holeY))) errors.push("Hole X and Y must be valid numbers.");
    }
    if (partType === "Radius Rollcage Mounting Tab") {
        if (!tabRadius || tabRadius < 0.1) errors.push("Tab radius must be at least 0.1 inches.");
        if (!tabHeight || tabHeight < 0.1) errors.push("Tab height must be at least 0.1 inches.");
        if (cornerRadius < 0) errors.push("Tab corner radius cannot be negative.");
        if (holeSize / 2 > tabRadius) errors.push("Hole radius cannot exceed tab radius.");
    }
    return errors.length ? errors.join("\n") : null;
}

// Ensure DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, setting up event listeners");

    const partItems = document.querySelectorAll("#parts-list li");
    if (partItems.length === 0) {
        console.error("No elements found with selector '#parts-list li'. Check HTML structure.");
        alert("Parts list not found. Please ensure the HTML includes a #parts-list with list items.");
        return;
    }
    console.log("Found parts-list items:", partItems.length);

    partItems.forEach(item => {
        item.addEventListener("click", () => {
            console.log("Click event triggered on:", item.textContent);
            const partType = item.getAttribute("data-part");
            console.log("Clicked part:", partType);
            const configForm = document.getElementById("config-form");
            if (!configForm) {
                console.error("Config form not found!");
                return;
            }
            configForm.style.display = "block";
            document.getElementById("part-type").textContent = partsLibrary[partType]?.name || "Unknown Part";

            // Show/hide base inputs
            document.getElementById("width").parentElement.style.display = partType !== "mountingTab" ? "block" : "none";
            document.getElementById("height").parentElement.style.display = (partType !== "circleBracket" && partType !== "mountingTab") ? "block" : "none";

            document.getElementById("hole-options").style.display = (partType === "holedPlate" || partType === "circleBracket" || partType === "perforatedBracket" || partType === "mountingTab") ? "block" : "none";
            document.getElementById("mounting-tab-options").style.display = partType === "mountingTab" ? "block" : "none";

            if (partType === "holedPlate") {
                document.getElementById("width").value = "1";
                document.getElementById("height").value = "1";
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("holeInset").style.display = "block";
                document.getElementById("cornerRadius").style.display = "block";
                document.getElementById("holeX").style.display = "none";
                document.getElementById("holeY").style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "block";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
                document.getElementById("holeX").previousElementSibling.style.display = "none";
                document.getElementById("holeY").previousElementSibling.style.display = "none";
            } else if (partType === "circleBracket") {
                document.getElementById("width").value = "1";
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("holeInset").style.display = "block";
                document.getElementById("cornerRadius").style.display = "none";
                document.getElementById("holeX").style.display = "none";
                document.getElementById("holeY").style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "block";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                document.getElementById("holeX").previousElementSibling.style.display = "none";
                document.getElementById("holeY").previousElementSibling.style.display = "none";
            } else if (partType === "perforatedBracket") {
                document.getElementById("width").value = "1";
                document.getElementById("height").value = "1";
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("holeX").value = "0";
                document.getElementById("holeY").value = "0";
                document.getElementById("holeInset").style.display = "none";
                document.getElementById("cornerRadius").style.display = "none";
                document.getElementById("holeX").style.display = "block";
                document.getElementById("holeY").style.display = "block";
                document.getElementById("holeInset").previousElementSibling.style.display = "none";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                document.getElementById("holeX").previousElementSibling.style.display = "block";
                document.getElementById("holeY").previousElementSibling.style.display = "block";
            } else if (partType === "mountingTab") {
                document.getElementById("holeSize").value = "1.88"; // 2 * 0.94 (default hole diameter)
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("holeX").value = "0";
                document.getElementById("holeY").value = "0";
                document.getElementById("holeRadius").value = "0.94";
                document.getElementById("tabRadius").value = "1.89";
                document.getElementById("tabHeight").value = "5.81";
                document.getElementById("tabCornerRadius").value = "0.19";
                document.getElementById("width").value = ""; // Clear width
                document.getElementById("height").value = ""; // Clear height
                document.getElementById("holeSize").style.display = "none"; // Hide hole diameter
                document.getElementById("holeInset").style.display = "none";
                document.getElementById("cornerRadius").style.display = "none";
                document.getElementById("holeX").style.display = "none";
                document.getElementById("holeY").style.display = "none";
                document.getElementById("holeSize").previousElementSibling.style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "none";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                document.getElementById("holeX").previousElementSibling.style.display = "none";
                document.getElementById("holeY").previousElementSibling.style.display = "none";
            } else {
                document.getElementById("width").value = "1";
                document.getElementById("height").value = "1";
                document.getElementById("hole-options").style.display = "none";
            }
            console.log("Part selected:", partType);
            previewPart(); // Auto-preview on selection
        });
    });
});

// Preview the part on canvas
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    // Map UI part names to library keys
    const partTypeKey = partType.toLowerCase().replace(/\s+/g, '');
    const partKeyMap = {
        rectangleplate: 'rectangle',
        trianglegusset: 'gusset',
        holedmountingplate: 'holedPlate',
        circularbracket: 'circleBracket',
        perforatedmountingbracket: 'perforatedBracket',
        radiusrollcagemountingtab: 'mountingTab'
    };
    const libraryKey = partKeyMap[partTypeKey] || partTypeKey;

    const width = parseFloat(document.getElementById("width").value) || (libraryKey === "mountingTab" ? (2 * parseFloat(document.getElementById("tabRadius").value) || 3.78) : 10); // Default to tab width if empty
    const height = libraryKey !== "circleBracket" ? (parseFloat(document.getElementById("height").value) || (libraryKey === "mountingTab" ? (parseFloat(document.getElementById("tabHeight").value) + parseFloat(document.getElementById("tabRadius").value) || 7.7) : 10)) : width;
    const holeSize = (libraryKey === "holedPlate" || libraryKey === "circleBracket" || libraryKey === "perforatedBracket" || libraryKey === "mountingTab") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = (libraryKey === "holedPlate" || libraryKey === "circleBracket") ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = libraryKey === "holedPlate" ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;
    const holeX = libraryKey === "perforatedBracket" ? parseFloat(document.getElementById("holeX").value || 0) : 0;
    const holeY = libraryKey === "perforatedBracket" ? parseFloat(document.getElementById("holeY").value || 0) : 0;
    const tabRadius = libraryKey === "mountingTab" ? parseFloat(document.getElementById("tabRadius").value || 1.89) : 0;
    const tabHeight = libraryKey === "mountingTab" ? parseFloat(document.getElementById("tabHeight").value || 5.81) : 0;
    const tabCornerRadius = libraryKey === "mountingTab" ? parseFloat(document.getElementById("tabCornerRadius").value || 0.19) : 0;

    console.log("Previewing:", { partType, libraryKey, width, height, holeSize, holeInset, cornerRadius, holeX, holeY, tabRadius, tabHeight, tabCornerRadius });

    const validationError = validateInputs(partType, width / 10, height / 10, holeSize, holeInset, cornerRadius, holeX, holeY, tabRadius, tabHeight);
    if (validationError) {
        alert(`Invalid input:\n${validationError}\nCheck console for details.`);
        console.log("Validation failed:", { width, height, holeSize, holeInset, cornerRadius, holeX, holeY, tabRadius, tabHeight });
        return;
    }

    const canvas = document.getElementById("part-preview");
    if (!canvas) {
        console.error("Canvas element 'part-preview' not found!");
        return;
    }

    const canvasSize = 400;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Failed to get 2D context from canvas!");
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const maxDimension = libraryKey === "mountingTab" ? Math.max(tabRadius * 2, tabHeight + tabRadius) * 10 : Math.max(width, height);
    const scale = (canvasSize - padding) / maxDimension;
    const scaledWidth = (libraryKey === "mountingTab" ? tabRadius * 2 : width) * scale;
    const scaledHeight = (libraryKey === "mountingTab" ? (tabHeight + tabRadius) : height) * scale;

    let translateX = (canvasSize - scaledWidth) / 2;
    let translateY = (canvasSize - scaledHeight) / 2;
    if (libraryKey === "perforatedBracket") {
        const centroid = calculateCentroid([
            [12.51, 14.395], [17.45, -13.855], [16.06, -14.395],
            [-16.06, -14.395], [-17.45, -13.855], [-12.51, 14.395]
        ]);
        translateX -= centroid[0] * scale;
        translateY -= centroid[1] * scale;
    }

    const part = partsLibrary[libraryKey];
    if (part) {
        ctx.save();
        ctx.translate(translateX, translateY);
        ctx.scale(scale, scale);
        console.log("Canvas setup:", { scale, scaledWidth, scaledHeight, translateX, translateY });

        try {
            if (libraryKey === "holedPlate") {
                part.draw(ctx, width, height, holeSize, holeInset, cornerRadius);
            } else if (libraryKey === "circleBracket") {
                part.draw(ctx, width, height, holeSize, holeInset);
            } else if (libraryKey === "perforatedBracket") {
                part.draw(ctx, width, height, holeSize, holeX, holeY);
            } else if (libraryKey === "mountingTab") {
                part.draw(ctx, scaledWidth, scaledHeight, holeSize / 2, tabRadius, tabHeight, tabCornerRadius);
            } else {
                part.draw(ctx, width, height);
            }
            console.log("Preview drawn successfully for", partType);
        } catch (error) {
            console.error("Error drawing preview:", error);
            alert("Failed to draw preview. Check console for details.");
        }
        ctx.restore();
    } else {
        console.log("Part not found:", partType, "Library key:", libraryKey);
    }
}

// Download DXF file
function downloadDXF() {
    const partType = document.getElementById("part-type").textContent;
    const partTypeKey = partType.toLowerCase().replace(/\s+/g, '');
    const partKeyMap = {
        rectangleplate: 'rectangle',
        trianglegusset: 'gusset',
        holedmountingplate: 'holedPlate',
        circularbracket: 'circleBracket',
        perforatedmountingbracket: 'perforatedBracket',
        radiusrollcagemountingtab: 'mountingTab'
    };
    const libraryKey = partKeyMap[partTypeKey] || partTypeKey;

    const width = parseFloat(document.getElementById("width").value) || (libraryKey === "mountingTab" ? (2 * parseFloat(document.getElementById("tabRadius").value) || 3.78) : 1);
    const height = libraryKey !== "circleBracket" ? (parseFloat(document.getElementById("height").value) || (libraryKey === "mountingTab" ? (parseFloat(document.getElementById("tabHeight").value) + parseFloat(document.getElementById("tabRadius").value) || 7.7) : 1)) : width;
    const holeSize = (libraryKey === "holedPlate" || libraryKey === "circleBracket" || libraryKey === "perforatedBracket" || libraryKey === "mountingTab") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = (libraryKey === "holedPlate" || libraryKey === "circleBracket") ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = libraryKey === "holedPlate" ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;
    const holeX = libraryKey === "perforatedBracket" ? parseFloat(document.getElementById("holeX").value || 0) : 0;
    const holeY = libraryKey === "perforatedBracket" ? parseFloat(document.getElementById("holeY").value || 0) : 0;
    const tabRadius = libraryKey === "mountingTab" ? parseFloat(document.getElementById("tabRadius").value || 1.89) : 0;
    const tabHeight = libraryKey === "mountingTab" ? parseFloat(document.getElementById("tabHeight").value || 5.81) : 0;
    const tabCornerRadius = libraryKey === "mountingTab" ? parseFloat(document.getElementById("tabCornerRadius").value || 0.19) : 0;

    const validationError = validateInputs(partType, width, height, holeSize, holeInset, cornerRadius, holeX, holeY, tabRadius, tabHeight);
    if (validationError) {
        alert(`Invalid input:\n${validationError}`);
        return;
    }

    const part = partsLibrary[libraryKey];
    if (part) {
        const dxfContent = libraryKey === "holedPlate" ? part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
                          libraryKey === "circleBracket" ? part.toDXF(width, height, holeSize, holeInset) :
                          libraryKey === "perforatedBracket" ? part.toDXF(width, height, holeSize, holeX, holeY) :
                          libraryKey === "mountingTab" ? part.toDXF(tabRadius * 2, tabHeight + tabRadius, holeSize / 2, tabRadius, tabHeight, tabCornerRadius) :
                          part.toDXF(width, height);
        const blob = new Blob([dxfContent], { type: "application/dxf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${partType.toLowerCase().replace(/\s+/g, '-')}.dxf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.error("Part not found for DXF download:", partType, "Library key:", libraryKey);
    }
}
