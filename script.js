// Parts library with circular bracket, 4-bolt pattern, and perforated bracket
const partsLibrary = {
    gear: {
        name: "Gear",
        draw: (ctx, width, height) => {
            const radius = Math.min(width, height) / 2;
            ctx.beginPath();
            for (let i = 0; i < 16; i++) {
                const angle = (i * Math.PI) / 8;
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
            const radius = Math.min(width, height) / 2;
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
    perforatedBracket: {
        name: "Perforated Mounting Bracket",
        draw: (ctx, width, height, holeSize) => {
            ctx.beginPath();
            
            // Draw main polyline shape
            const vertices = [
                [12.51, 2.19],
                [17.45, -26.06],
                [16.06, -26.60],
                [-16.06, -26.60],
                [-17.45, -26.06],
                [-12.51, 2.19]
            ];
            ctx.moveTo(vertices[0][0] * 10, vertices[0][1] * 10);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i][0] * 10, vertices[i][1] * 10);
            }
            ctx.closePath();
            ctx.fillStyle = "#666";
            ctx.fill();

            // Center hole from DXF circle
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(0, 0, 4.76 * 10, 0, Math.PI * 2); // Fixed radius of 4.76 inches (47.6 canvas units)
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        },
        toDXF: (width, height, holeSize) => {
            let dxf = ["0", "SECTION", "2", "ENTITIES"];
            
            // Define DXF polyline
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
                dxf.push("10", v[0].toString(), "20", v[1].toString());
            }
            dxf.push("0", "SEQEND");
            
            // Center hole
            dxf.push(
                "0", "CIRCLE", "8", "0",
                "10", "0", "20", "0",
                "40", "4.76"
            );
            
            dxf.push("0", "ENDSEC", "0", "EOF");
            return dxf.join("\n");
        }
    }
};

// Ensure DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, setting up event listeners");

    const partItems = document.querySelectorAll("#parts-list li");
    console.log("Found parts-list items:", partItems.length);

    if (partItems.length === 0) {
        console.error("No elements found with selector '#parts-list li'. Check HTML structure.");
        return;
    }

    partItems.forEach(item => {
        item.addEventListener("click", () => {
            const partType = item.getAttribute("data-part");
            console.log("Clicked part:", partType);
            const configForm = document.getElementById("config-form");
            if (!configForm) {
                console.error("Config form not found!");
                return;
            }
            configForm.style.display = "block";
            document.getElementById("part-type").textContent = partsLibrary[partType].name;
            document.getElementById("width").value = "";
            document.getElementById("height").value = "";
            document.getElementById("hole-options").style.display = (partType === "holedPlate" || partType === "circleBracket" || partType === "perforatedBracket") ? "block" : "none";
            if (partType === "holedPlate") {
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("holeInset").style.display = "block";
                document.getElementById("cornerRadius").style.display = "block";
                document.getElementById("tubeDiameter").style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "block";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "block";
                document.getElementById("tubeDiameter").previousElementSibling.style.display = "none";
            } else if (partType === "circleBracket") {
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("cornerRadius").style.display = "none";
                document.getElementById("holeInset").style.display = "block";
                document.getElementById("tubeDiameter").style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "block";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                document.getElementById("tubeDiameter").previousElementSibling.style.display = "none";
            } else if (partType === "perforatedBracket") {
                document.getElementById("holeSize").value = "0.25";
                document.getElementById("holeInset").value = "0.5";
                document.getElementById("cornerRadius").value = "0";
                document.getElementById("holeInset").style.display = "none";
                document.getElementById("cornerRadius").style.display = "none";
                document.getElementById("tubeDiameter").style.display = "none";
                document.getElementById("holeInset").previousElementSibling.style.display = "none";
                document.getElementById("cornerRadius").previousElementSibling.style.display = "none";
                document.getElementById("tubeDiameter").previousElementSibling.style.display = "none";
            }
            console.log("Part selected:", partType);
        });
    });
});

// Preview the part on canvas
function previewPart() {
    const partType = document.getElementById("part-type").textContent;
    const width = parseFloat(document.getElementById("width").value) * 10; // Canvas units
    const height = partType !== "Circular Bracket" ? parseFloat(document.getElementById("height").value) * 10 : width;
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Perforated Mounting Bracket") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = (partType === "Holed Mounting Plate" || partType === "Circular Bracket") ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    console.log("Previewing:", { partType, width, height, holeSize, holeInset, cornerRadius });

    if (!width || 
        (partType !== "Circular Bracket" && (!height || isNaN(height))) || 
        ((partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Perforated Mounting Bracket") && (!holeSize || isNaN(holeSize))) || 
        ((partType === "Holed Mounting Plate" || partType === "Circular Bracket") && (!holeInset || isNaN(holeInset))) || 
        (partType === "Holed Mounting Plate" && isNaN(cornerRadius))) {
        alert("Please enter all required fields. Check console for details.");
        console.log("Validation failed:", { width, height, holeSize, holeInset, cornerRadius });
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
        const translateX = 200 - width / 2; // Center horizontally
        // Adjust translation for perforatedBracket to align bottom with canvas y=200
        const translateY = partType === "Circular Bracket" ? 200 - width / 2 : 
                          partType === "Perforated Mounting Bracket" ? 200 - (-26.60 * 10) : // Bottom at -26.60 * 10
                          200 - height; // Bottom for others
        ctx.translate(translateX, translateY);
        console.log("Canvas translation:", { x: translateX, y: translateY });
        try {
            if (partType === "Holed Mounting Plate") {
                part.draw(ctx, width, height, holeSize, holeInset, cornerRadius);
            } else if (partType === "Circular Bracket") {
                part.draw(ctx, width, height, holeSize, holeInset);
            } else if (partType === "Perforated Mounting Bracket") {
                part.draw(ctx, width, height, holeSize);
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
    const width = parseFloat(document.getElementById("width").value); // DXF in inches
    const height = partType !== "Circular Bracket" ? parseFloat(document.getElementById("height").value) : width;
    const holeSize = (partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Perforated Mounting Bracket") ? parseFloat(document.getElementById("holeSize").value || 0) : 0;
    const holeInset = (partType === "Holed Mounting Plate" || partType === "Circular Bracket") ? parseFloat(document.getElementById("holeInset").value || 0.5) : 0;
    const cornerRadius = partType === "Holed Mounting Plate" ? parseFloat(document.getElementById("cornerRadius").value || 0) : 0;

    if (!width || 
        (partType !== "Circular Bracket" && (!height || isNaN(height))) || 
        ((partType === "Holed Mounting Plate" || partType === "Circular Bracket" || partType === "Perforated Mounting Bracket") && (!holeSize || isNaN(holeSize))) || 
        ((partType === "Holed Mounting Plate" || partType === "Circular Bracket") && (!holeInset || isNaN(holeInset))) || 
        (partType === "Holed Mounting Plate" && isNaN(cornerRadius))) {
        alert("Please enter all required fields.");
        return;
    }

    const part = Object.values(partsLibrary).find(p => p.name === partType);
    if (part) {
        const dxfContent = partType === "Holed Mounting Plate" ? part.toDXF(width, height, holeSize, holeInset, cornerRadius) :
                          partType === "Circular Bracket" ? part.toDXF(width, height, holeSize, holeInset) :
                          partType === "Perforated Mounting Bracket" ? part.toDXF(width, height, holeSize) :
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
