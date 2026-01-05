// =========================
// GLOBAL ELEMENTS
// =========================
const chart = document.getElementById("chart");
const svg = document.getElementById("lines");
const modeToggle = document.getElementById("modeToggle"); // ON default (in HTML)

let activeNode = null;
let offsetX = 0;
let offsetY = 0;

// Zoom & pan
let scale = 1;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };

// =========================
// DEFAULT ALERT MESSAGE
// =========================
const DEFAULT_ALERT =
  "ትውልዲ ናይዚ ትመርጾ ዘለኻ ኣብ ትሕቲኡ ዘለዉ ወለዶ ጥራይ ኢዮም።";

// =========================
// IMAGE MODAL
// =========================
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".image-close");

function openImageInModal(src) {
  if (!src) return;
  modalImage.src = src;
  imageModal.style.display = "flex";
  imageModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  imageModal.style.display = "none";
  imageModal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}

modalClose.addEventListener("click", closeModal);
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// =========================
// NODE TARGETS
// NOTE: simon.html is in /pages, so images must be ../images/...
// HTML links that are also in /pages can be "filename.html"
// =========================
const nodeTargets = {
  // parents
  p2: { type: "html", url: "gebremariam.html" },
  p3: { type: "html", url: "nemariam.html" },
  p4: { type: "html", url: "ldu.html" },
  p5: { type: "html", url: "serhya.html" },
  p6: { type: "html", url: "tenay.html" },

  // children
  c1: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c2: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c3: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c4: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c5: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c6: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c7: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },

  // info images (modal)
  sc1: { type: "image", url: "../images/Teferi.jpg" },
  sc2: { type: "image", url: "../images/Chirum.png" },
  sc3: { type: "image", url: "../images/Tiemurtu.jpg" },
  sc4: { type: "image", url: "../images/Gumala.png" },
  sc5: { type: "image", url: "../images/info.png" },

  ss1: { type: "image", url: "../images/Gilay.png" },
  ss2: { type: "image", url: "../pages/Gilay.png" },
  ss3: { type: "image", url: "../images/Gilay.png" },
  ss4: { type: "image", url: "../images/Gilay.png" },

  sib1: { type: "image", url: "../images/info.png" },

  n1: { type: "image", url: "../images/Esiet.png" },
  n2: { type: "image", url: "../images/Esiet.png" },

  sse1: { type: "image", url: "../images/Andit.png" },
  sse2: { type: "image", url: "../images/Andit.png" },

  se1: { type: "image", url: "../images/Bieday.png" },
  se2: { type: "image", url: "../images/Bieday.png" },
  se3: { type: "image", url: "../images/Bieday.png" },

  k1: { type: "image", url: "../images/info.png" },

  // Optional: if you want root/p1 to show the alert instead of doing nothing:
  root: { type: "alert", message: DEFAULT_ALERT },
  p1: { type: "alert", message: DEFAULT_ALERT },

  // Optional: ss2 is currently a page in your old code; if you want:
  // ss2: { type: "html", url: "somepage.html" },
};

// =========================
// NODE CONNECTIONS
// =========================
const links = [
  ["root", "p1"], ["root", "p2"], ["root", "p3"], ["root", "p4"], ["root", "p5"], ["root", "p6"],
  ["p1", "c1"], ["p1", "c2"], ["p1", "c3"], ["p1", "c4"], ["p1", "c5"], ["p1", "c6"], ["p1", "c7"],
  ["c1", "sc1"], ["c1", "sc2"], ["c1", "sc3"], ["c1", "sc4"], ["c1", "sc5"],
  ["c2", "ss1"], ["c2", "ss2"], ["c2", "ss3"], ["c2", "ss4"],
  ["c3", "sib1"],
  ["c4", "n1"], ["c4", "n2"],
  ["c5", "sse1"], ["c5", "sse2"],
  ["c6", "se1"], ["c6", "se2"], ["c6", "se3"],
  ["c7", "k1"],
];

// Build child map for collapsible branches
const childrenMap = {};
links.forEach(([parent, child]) => {
  if (!childrenMap[parent]) childrenMap[parent] = [];
  childrenMap[parent].push(child);
});

// =========================
// SAVE & LOAD POSITIONS
// =========================
const originalPositions = {};

function savePositions() {
  const positions = {};
  document.querySelectorAll(".node").forEach(node => {
    positions[node.id] = { left: node.style.left, top: node.style.top };
  });
  localStorage.setItem("chartPositionsSimon", JSON.stringify(positions));
}

function loadPositions() {
  const saved = localStorage.getItem("chartPositionsSimon");
  if (!saved) return;

  const positions = JSON.parse(saved);
  Object.keys(positions).forEach(id => {
    const node = document.getElementById(id);
    if (node) {
      node.style.left = positions[id].left;
      node.style.top = positions[id].top;
    }
  });
}

// =========================
// MODE UI (toggle)
// =========================
function applyModeUI() {
  const openMode = modeToggle.checked;
  document.querySelectorAll(".node").forEach(node => {
    node.classList.toggle("open-enabled", openMode);
    node.classList.toggle("drag-enabled", !openMode);
  });
}
modeToggle.addEventListener("change", applyModeUI);
applyModeUI();

// =========================
// CLICK HANDLER
// =========================
function handleNodeOpen(nodeId) {
  const target = nodeTargets[nodeId];
  if (!target) {
    alert(DEFAULT_ALERT);
    return;
  }

  if (target.type === "image") {
    openImageInModal(target.url);
  } else if (target.type === "html") {
    window.location.href = target.url; // same tab
  } else if (target.type === "alert") {
    alert(target.message || DEFAULT_ALERT);
  } else {
    alert(DEFAULT_ALERT);
  }
}

// =========================
// DRAGGING + CLICK + COLLAPSE
// =========================
document.querySelectorAll(".node").forEach(node => {

  node.addEventListener("mousedown", e => {
    // Dragging disabled when toggle is ON
    if (modeToggle.checked) return;

    activeNode = node;
    offsetX = e.clientX - node.offsetLeft;
    offsetY = e.clientY - node.offsetTop;
    node.style.cursor = "grabbing";
  });

  node.addEventListener("click", () => {
    // Click actions only when toggle is ON
    if (!modeToggle.checked) return;
    handleNodeOpen(node.id);
  });

  node.addEventListener("dblclick", () => toggleBranch(node.id));
});

document.addEventListener("mousemove", e => {
  if (!activeNode) return;

  activeNode.style.left = (e.clientX - offsetX) + "px";
  activeNode.style.top = (e.clientY - offsetY) + "px";

  savePositions();
  drawLines();
});

document.addEventListener("mouseup", () => {
  if (activeNode) activeNode.style.cursor = "grab";
  activeNode = null;
});

// =========================
// COLLAPSIBLE BRANCHES
// =========================
function toggleBranch(parentId) {
  const children = childrenMap[parentId];
  if (!children) return;

  children.forEach(childId => {
    const node = document.getElementById(childId);
    if (!node) return;

    const isHidden = node.style.display === "none";
    node.style.display = isHidden ? "block" : "none";
    toggleRecursive(childId, !isHidden);
  });

  drawLines();
}

function toggleRecursive(nodeId, show) {
  const kids = childrenMap[nodeId];
  if (!kids) return;

  kids.forEach(kid => {
    const node = document.getElementById(kid);
    if (!node) return;

    node.style.display = show ? "block" : "none";
    toggleRecursive(kid, show);
  });
}

// =========================
// ZOOM & PAN
// =========================
chart.addEventListener("wheel", e => {
  e.preventDefault();

  const zoomIntensity = 0.1;
  scale += e.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  scale = Math.min(Math.max(scale, 0.3), 3);

  chart.style.transform = `scale(${scale}) translate(${panOffset.x}px, ${panOffset.y}px)`;
});

chart.addEventListener("mousedown", e => {
  if (e.target.classList.contains("node")) return;

  isPanning = true;
  panStart.x = e.clientX - panOffset.x;
  panStart.y = e.clientY - panOffset.y;
});

document.addEventListener("mousemove", e => {
  if (!isPanning) return;

  panOffset.x = e.clientX - panStart.x;
  panOffset.y = e.clientY - panStart.y;

  chart.style.transform = `scale(${scale}) translate(${panOffset.x}px, ${panOffset.y}px)`;
});

document.addEventListener("mouseup", () => {
  isPanning = false;
});

// =========================
// DRAW CONNECTORS
// =========================
function drawLines() {
  svg.innerHTML = `
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
        <polygon points="0 0, 6 3, 0 6" fill="#333" />
      </marker>
    </defs>
  `;

  links.forEach(([from, to]) => {
    const a = document.getElementById(from);
    const b = document.getElementById(to);

    if (!a || !b || a.style.display === "none" || b.style.display === "none") return;

    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const cr = chart.getBoundingClientRect();

    const x1 = ar.left + ar.width / 2 - cr.left;
    const y1 = ar.top + ar.height - cr.top;

    const x2 = br.left + br.width / 2 - cr.left;
    const y2 = br.top - cr.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#333");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("marker-end", "url(#arrow)");

    svg.appendChild(line);
  });
}

// =========================
// RESET BUTTON (hidden by CSS)
// =========================
document.getElementById("resetLayout").addEventListener("click", () => {
  Object.keys(originalPositions).forEach(id => {
    const node = document.getElementById(id);
    if (node) {
      node.style.left = originalPositions[id].left;
      node.style.top = originalPositions[id].top;
      node.style.display = "block";
    }
  });

  localStorage.removeItem("chartPositionsSimon");

  scale = 1;
  panOffset = { x: 0, y: 0 };
  chart.style.transform = "scale(1) translate(0px, 0px)";

  drawLines();
});

// =========================
// INIT
// =========================
loadPositions();

document.querySelectorAll(".node").forEach(node => {
  originalPositions[node.id] = { left: node.style.left, top: node.style.top };
});

drawLines();
