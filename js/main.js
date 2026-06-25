/* ============================================================
   main.js
   - 計測処理
   - RPM → 時速変換
   - 履歴保存
   - 比較ベンチ
   - カルテ
   ============================================================ */

/* ------------------------------
   グローバル変数
------------------------------ */
let currentRPM = 0;
let locked = false;

/* ------------------------------
   計測ボタン
------------------------------ */
document.getElementById("btnMeasure").addEventListener("click", () => {
    if (locked) return;

    // 仮のランダム計測（実機ではマイク入力）
    currentRPM = Math.floor(Math.random() * 30000) + 5000;

    updateDisplay();
});

/* ------------------------------
   ロック
------------------------------ */
document.getElementById("btnLock").addEventListener("click", () => {
    locked = !locked;
});

/* ------------------------------
   リセット
------------------------------ */
document.getElementById("btnReset").addEventListener("click", () => {
    currentRPM = 0;
    locked = false;
    updateDisplay();
});

/* ------------------------------
   表示更新
------------------------------ */
function updateDisplay() {
    document.getElementById("dispRPM").textContent = currentRPM;

    const kmh = rpmToKmh(currentRPM);
    document.getElementById("dispKmh").textContent = kmh.toFixed(2);
}

/* ------------------------------
   RPM → 時速変換
------------------------------ */
function rpmToKmh(rpm) {
    const gear = Number(document.getElementById("inputGear").value);
    const wheelRpm = rpm / gear;
    const wheelCirc = 0.083; // 83mm
    return wheelRpm * wheelCirc * 60 / 1000;
}

/* ------------------------------
   保存（履歴）
------------------------------ */
document.getElementById("btnSave").addEventListener("click", () => {
    if (currentRPM <= 0) {
        alert("計測値がありません");
        return;
    }

    const volt = Number(document.getElementById("inputVolt").value);
    const gear = Number(document.getElementById("inputGear").value);
    const kmh = rpmToKmh(currentRPM);

    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const dateStr = `${yy}${mm}${dd}`;

    const data = {
        date: dateStr,
        rpm: currentRPM,
        kmh: kmh,
        volt: volt,
        gear: gear
    };

    const list = JSON.parse(localStorage.getItem("rpm_history") || "[]");
    list.push(data);
    localStorage.setItem("rpm_history", JSON.stringify(list));

    alert("保存しました");
    buildHistoryTable();
    buildCompareTable();
});

/* ------------------------------
   履歴テーブル（表記名変更 + 電圧列移動）
------------------------------ */
function buildHistoryTable() {
    const table = document.getElementById("historyTable");
    const list = JSON.parse(localStorage.getItem("rpm_history") || "[]");

    let html = `
        <tr>
            <th>date</th>
            <th>モーター</th>
            <th>電圧</th>
            <th>MAX</th>
            <th>AVG</th>
            <th>TOP</th>
            <th>ギヤ比</th>
        </tr>
    `;

    list.forEach(d => {
        html += `
            <tr>
                <td>${d.date}</td>
                <td>—</td>
                <td>${d.volt}</td>
                <td>${d.rpm}</td>
                <td>${Math.floor(d.rpm * 0.92)}</td>
                <td>${d.kmh.toFixed(2)}</td>
                <td>${d.gear}</td>
            </tr>
        `;
    });

    table.innerHTML = html;
}

/* ------------------------------
   比較ベンチ（表記名変更 + 電圧列移動）
------------------------------ */
function buildCompareTable() {
    const table = document.getElementById("compareTable");
    const list = JSON.parse(localStorage.getItem("rpm_history") || "[]");

    let html = `
        <tr>
            <th>モーター</th>
            <th>電圧</th>
            <th>MAX</th>
            <th>AVG</th>
            <th>TOP</th>
            <th>ギヤ比</th>
        </tr>
    `;

    list.forEach(d => {
        html += `
            <tr>
                <td>—</td>
                <td>${d.volt}</td>
                <td>${d.rpm}</td>
                <td>${Math.floor(d.rpm * 0.92)}</td>
                <td>${d.kmh.toFixed(2)}</td>
                <td>${d.gear}</td>
            </tr>
        `;
    });

    table.innerHTML = html;
}

/* ------------------------------
   カルテ（レーダーチャート削除済）
------------------------------ */
function buildKarte() {
    const list = JSON.parse(localStorage.getItem("rpm_history") || "[]");
    if (list.length === 0) {
        document.getElementById("karteSummary").innerHTML = "データなし";
        return;
    }

    const last = list[list.length - 1];

    const html = `
        <p>date：${last.date}</p>
        <p>電圧：${last.volt} V</p>
        <p>MAX：${last.rpm}</p>
        <p>AVG：${Math.floor(last.rpm * 0.92)}</p>
        <p>TOP：${last.kmh.toFixed(2)} km/h</p>
        <p>ギヤ比：${last.gear}</p>
    `;

    document.getElementById("karteSummary").innerHTML = html;
}

/* ------------------------------
   初期化
------------------------------ */
window.addEventListener("load", () => {
    buildHistoryTable();
    buildCompareTable();
    buildKarte();
});
