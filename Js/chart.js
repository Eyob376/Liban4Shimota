// =========================
// GLOBAL ELEMENTS
// =========================
const chart = document.getElementById("chart");
const svg = document.getElementById("lines");
const modeToggle = document.getElementById("modeToggle"); // ON=Open, OFF=Drag

// Modal elements
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".image-close");

// Drag
let activeNode = null;
let offsetX = 0;
let offsetY = 0;

// Drag threshold (prevents accidental drag and broken clicks)
let downX = 0;
let downY = 0;
let moved = false;
const DRAG_THRESHOLD = 6;

// Zoom & pan
let scale = 1;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };

// Use unique storage key so it doesn't conflict with simon.html
const STORAGE_KEY = "chartPositions_weledo";

// =========================
// MODAL FUNCTIONS
// =========================
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
// NODE TARGETS (YOUR LIST)
// =========================
const nodeTargets = {
  root: { type: "alert", message: "ትውልዲ ናይዚ ትመርጾ ዘለኻ ኣብ ትሕቲኡ ዘለዉ ወለዶ ጥራይ ኢዮም።" },

  p1: { type: "html", url: "pages/xegaw.html" },
  p2: { type: "alert", message: "ትውልዲ ናይዚ ትመርጾ ዘለኻ ኣብ ትሕቲኡ ዘለዉ ወለዶ ጥራይ ኢዮም።" },
  p3: { type: "html", url: "pages/esha.html" },
  p4: { type: "html", url: "pages/hane.html" },

  c1: { type: "image", url: "images/info.png" },
  c2: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  c3: { type: "image", url: "images/info.png" },

  sc1:{ type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  sc2:{ type: "image", url: "images/info.png" },

  sib:{ type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },

  ss1:{ type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  ss2:{ type: "image", url: "images/info.png" },

  n1: { type: "html", url: "pages/hidrinkiel.html" },
  n2: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  n3: { type: "html", url: "pages/teklenkiel.html" },

  se1: { type: "html", url: "pages/simon.html" },
  se2: { type: "html", url: "pages/simon.html" },
  se3: { type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  se4: { type: "html", url: "pages/simon.html" },
  se5: { type: "html", url: "pages/simon.html" },

  sse1:{ type: "html", url: "pages/anday.html" },
  sse2:{ type: "html", url: "pages/tekliya.html" },
  sse3:{ type: "alert", message: "ትውልዲ ናይዚ ወለዶ'ዚ ኣብ ትሕቲኡ ዘለዉ ጥራይ ኢዮም።" },
  sse4:{ type: "html", url: "pages/raesat.html" },
  sse5:{ type: "html", url: "pages/weldu.html" },
  sse6:{ type: "html", url: "pages/debesay.html" },

  k1: { type: "html", url: "pages/weldu.html" },
  k2: { type: "html", url: "pages/tabot.html" },
  k3: { type: "html", url: "pages/simon.html" },
  k4: { type: "html", url: "pages/kueta.html" },
  k5: { type: "html", url: "pages/golom.html" },
  k6: { type: "html", url: "pages/awanet.html" },
  k7: { type: "image", url: "images/info.png" },
  k8: { type: "image", url: "images/info.png" },
};

// =========================
// NODE CONNECTIONS
// =========================
const links = [
  ["root", "p1"], ["root", "p2"], ["root", "p3"], ["root", "p4"],
  ["p2", "c1"], ["p2", "c2"], ["p2", "c3"],
  ["c2", "sc1"], ["c2", "sc2"],
  ["sc1", "sib"],
  ["sib", "ss1"], ["sib", "ss2"],
  ["ss1", "n1"], ["ss1", "n2"], ["ss1", "n3"],
  ["n2", "se1"], ["n2", "se2"], ["n2", "se3"], ["n2", "se4"], ["n2", "se5"],
  ["se3", "sse1"], ["se3", "sse2"], ["se3", "sse3"], ["se3", "sse4"], ["se3", "sse5"], ["se3", "sse6"],
  ["sse3", "k1"], ["sse3", "k2"], ["sse3", "k3"], ["sse3", "k4"], ["sse3", "k5"], ["sse3", "k6"], ["sse3", "k7"], ["sse3", "k8"]
];

// =========================
// CHILD MAP (collapse)
// =========================
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

function loadPositions() {
  const saved = localStorage.getItem(STORAGE_KEY);
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
// MODE UI
// =========================
function applyModeUI() {
  const openMode = modeToggle.checked;
  document.querySelectorAll(".node").forEach(node => {
    node.classList.toggle("open-enabled", openMode);
    node.classList.toggle("drag-enabled", !openMode);
  });
}
modeToggle.addEventListener("change", applyModeUI);
modeToggle.checked = true; // always ON by default
applyModeUI();

// =========================
// NODE ACTION
// =========================
function handleNodeAction(nodeId) {
  const target = nodeTargets[nodeId];
  if (!target) return;

  if (target.type === "image") {
    openImageInModal(target.url);
  } else if (target.type === "html") {
    window.location.href = target.url;
  } else if (target.type === "alert") {
    alert(target.message);
  }
}

// =========================
// DRAG + CLICK
// =========================
document.querySelectorAll(".node").forEach(node => {

  node.addEventListener("mousedown", (e) => {
    if (modeToggle.checked) return; // Open mode => no drag

    activeNode = node;
    offsetX = e.clientX - node.offsetLeft;
    offsetY = e.clientY - node.offsetTop;

    downX = e.clientX;
    downY = e.clientY;
    moved = false;

    node.style.cursor = "grabbing";
  });

  node.addEventListener("click", (e) => {
    if (!modeToggle.checked) return; // Drag mode => no click open
    if (moved) return;              // if drag happened, ignore click
    handleNodeAction(node.id);
  });

  node.addEventListener("dblclick", () => toggleBranch(node.id));
});

document.addEventListener("mousemove", (e) => {
  if (!activeNode) return;

  const dx = Math.abs(e.clientX - downX);
  const dy = Math.abs(e.clientY - downY);
  if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) moved = true;

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
chart.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomIntensity = 0.1;
  scale += e.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  scale = Math.min(Math.max(scale, 0.3), 3);

  chart.style.transform = `scale(${scale}) translate(${panOffset.x}px, ${panOffset.y}px)`;
});

chart.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("node")) return;

  isPanning = true;
  panStart.x = e.clientX - panOffset.x;
  panStart.y = e.clientY - panOffset.y;
});

document.addEventListener("mousemove", (e) => {
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

  localStorage.removeItem(STORAGE_KEY);

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
