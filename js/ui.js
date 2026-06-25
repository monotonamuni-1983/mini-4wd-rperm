/* ============================================================
   ui.js
   - ページ切り替え
   - 設定モーダル
   - プリセット名モーダル制御
   - 比較表生成
   - UI 初期化
   ============================================================ */

/* ------------------------------
   ページ切り替え
------------------------------ */
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    if (id === "page-history") {
        buildHistoryTable();
        buildCompareTable();
    }
    if (id === "page-karute") {
        buildKarte();
    }
}

/* ------------------------------
   設定モーダル
------------------------------ */
function openSettings() {
    document.getElementById("settingsModal").classList.add("active");
}
function closeSettings() {
    document.getElementById("settingsModal").classList.remove("active");
}

document.getElementById("settingsOk").addEventListener("click", () => {
    closeSettings();
});
document.getElementById("settingsCancel").addEventListener("click", () => {
    closeSettings();
});

/* ------------------------------
   プリセット名モーダル（UI 側）
------------------------------ */
function openPresetNameModalUI() {
    document.getElementById("presetNameModal").classList.add("active");
}
function closePresetNameModalUI() {
    document.getElementById("presetNameModal").classList.remove("active");
}

/* ------------------------------
   スライダーのリアルタイム表示
------------------------------ */
document.getElementById("inputVolt").addEventListener("input", e => {
    document.getElementById("dispVolt").textContent = e.target.value;
});
document.getElementById("inputGear").addEventListener("input", e => {
    document.getElementById("dispGear").textContent = e.target.value;
});

/* ------------------------------
   比較表（matrixTable）
------------------------------ */
function buildMatrixTable() {
    const table = document.getElementById("matrixTable");

    let html = `
        <tr>
            <th>電圧</th>
            <th>ギヤ比</th>
            <th>RPM</th>
            <th>TOP</th>
        </tr>
    `;

    for (let v = 3; v <= 10; v += 1) {
        for (let g = 3.5; g <= 5.0; g += 0.5) {
            const rpm = Math.floor(8000 * v);
            const kmh = (rpm / g) * 0.083 * 60 / 1000;

            html += `
                <tr>
                    <td>${v}</td>
                    <td>${g.toFixed(2)}</td>
                    <td>${rpm}</td>
                    <td>${kmh.toFixed(2)}</td>
                </tr>
            `;
        }
    }

    table.innerHTML = html;
}

/* ------------------------------
   初期化
------------------------------ */
window.addEventListener("load", () => {
    buildMatrixTable();
});
