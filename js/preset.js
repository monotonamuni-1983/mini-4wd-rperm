/* ============================================================
   preset.js
   - プリセット保存
   - プリセット読み込み
   - プリセット名変更（専用モーダル）
   - 8文字制限（B‑1：再入力ループ）
   ============================================================ */

/* ------------------------------
   プリセット名入力モーダル
------------------------------ */
function openPresetNameModal(defaultValue = "") {
    const modal = document.getElementById("presetNameModal");
    const input = document.getElementById("presetNameInput");

    input.value = defaultValue;
    modal.classList.add("active");
    input.focus();
}

function closePresetNameModal() {
    document.getElementById("presetNameModal").classList.remove("active");
}

/* ------------------------------
   名前入力（8文字以内になるまで再入力）
------------------------------ */
function requestPresetName(defaultValue = "") {
    return new Promise(resolve => {
        openPresetNameModal(defaultValue);

        const okBtn = document.getElementById("presetNameOk");
        const cancelBtn = document.getElementById("presetNameCancel");
        const input = document.getElementById("presetNameInput");

        function okHandler() {
            const name = input.value.trim();

            if (name.length === 0) {
                alert("名前を入力してください");
                return;
            }
            if (name.length > 8) {
                alert("8文字以内で入力してください");
                return;
            }

            cleanup();
            closePresetNameModal();
            resolve(name);
        }

        function cancelHandler() {
            cleanup();
            closePresetNameModal();
            resolve(null);
        }

        function cleanup() {
            okBtn.removeEventListener("click", okHandler);
            cancelBtn.removeEventListener("click", cancelHandler);
        }

        okBtn.addEventListener("click", okHandler);
        cancelBtn.addEventListener("click", cancelHandler);
    });
}

/* ------------------------------
   プリセット保存
------------------------------ */
document.getElementById("presetSaveBtn").addEventListener("click", async () => {
    const slot = Number(document.getElementById("presetSelect").value);

    const name = await requestPresetName("");
    if (!name) return;

    savePreset(slot, name);
    loadPresetSelect();
});

/* ------------------------------
   プリセット削除
------------------------------ */
document.getElementById("presetDeleteBtn").addEventListener("click", () => {
    const slot = Number(document.getElementById("presetSelect").value);
    const key = `rpm_preset_${slot}`;

    if (!localStorage.getItem(key)) {
        alert("データがありません");
        return;
    }

    if (!confirm("このプリセットを削除しますか？")) return;

    localStorage.removeItem(key);
    loadPresetSelect();
});

/* ------------------------------
   プリセット名変更
------------------------------ */
document.getElementById("presetRenameBtn").addEventListener("click", async () => {
    const slot = Number(document.getElementById("presetSelect").value);
    const key = `rpm_preset_${slot}`;
    const saved = JSON.parse(localStorage.getItem(key) || "{}");

    const newName = await requestPresetName(saved.label || `P${slot}`);
    if (!newName) return;

    saved.label = newName;
    localStorage.setItem(key, JSON.stringify(saved));
    loadPresetSelect();
});

/* ------------------------------
   プリセット保存処理
------------------------------ */
function savePreset(slot, label) {
    const key = `rpm_preset_${slot}`;

    const data = {
        label: label,
        volt: Number(document.getElementById("inputVolt").value),
        gear: Number(document.getElementById("inputGear").value),
        poles: Number(document.getElementById("inputPoles").value)
    };

    localStorage.setItem(key, JSON.stringify(data));
}

/* ------------------------------
   プリセット読み込み
------------------------------ */
document.getElementById("presetSelect").addEventListener("change", () => {
    const slot = Number(document.getElementById("presetSelect").value);
    loadPreset(slot);
});

function loadPreset(slot) {
    const key = `rpm_preset_${slot}`;
    const data = JSON.parse(localStorage.getItem(key) || "null");

    if (!data) return;

    document.getElementById("inputVolt").value = data.volt;
    document.getElementById("dispVolt").textContent = data.volt;

    document.getElementById("inputGear").value = data.gear;
    document.getElementById("dispGear").textContent = data.gear;

    document.getElementById("inputPoles").value = data.poles;
}

/* ------------------------------
   プリセット一覧の更新
------------------------------ */
function loadPresetSelect() {
    const sel = document.getElementById("presetSelect");
    sel.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const key = `rpm_preset_${i}`;
        const saved = JSON.parse(localStorage.getItem(key) || "null");

        const label = saved ? saved.label : `P${i}`;
        sel.innerHTML += `<option value="${i}">${label}</option>`;
    }
}

/* ------------------------------
   初期化
------------------------------ */
window.addEventListener("load", () => {
    loadPresetSelect();
});
