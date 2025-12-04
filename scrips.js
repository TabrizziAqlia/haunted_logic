// =======================================================
// GAME STATE
// =======================================================
let gameState = {
    currentLevel: 1,
    currentTask: 1,
    maxTasks: 3,
    health: 3,
    levelProgress: { 1: false, 2: false, 3: false } // Status penyelesaian level
};

// =======================================================
// LOGIKA PROPOSISIONAL INTI (Implementasi)
// =======================================================

const LOGIC_OPS = {
    // Negasi: NOT P
    '¬P': (p, q) => !p,
    // Konjungsi: P AND Q (Hanya True jika keduanya True)
    'P ∧ Q': (p, q) => p && q,
    // Disjungsi: P OR Q (True jika salah satu True)
    'P ∨ Q': (p, q) => p || q,
    // Implikasi: P -> Q (Hanya False jika P True dan Q False)
    'P → Q': (p, q) => (!p) || q, 
    // Biimplikasi: P <-> Q (True jika P dan Q sama nilainya)
    'P ↔ Q': (p, q) => p === q
};

// =======================================================
// STRUKTUR QUEST/TASK (Contoh Game Flow)
// =======================================================

// P: Lampu menyala (T/F), Q: Pintu terkunci (T/F), R: Ada suara (T/F)
// Aturan: SELAMAT JIKA hasil logika True (T)
const QUESTS = {
    1: [ // Level 1: Dasar (P & Q)
        {
            task: 1,
            title: "Kunci 1: Lampu & Pintu (Konjungsi)",
            narrative: "Kamu berada di lorong gelap. **Hanya lari jika Lampu menyala (P) DAN Pintu terkunci (Q).** Situasi saat ini: Lampu menyala (T), Pintu tidak terkunci (F).",
            propositions: { P: true, Q: false },
            logic: 'P ∧ Q',
            answer: LOGIC_OPS['P ∧ Q'](true, false) 
        },
        {
            task: 2,
            title: "Kunci 2: Pintu atau Suara (Disjungsi)",
            narrative: "Kamu dengar suara aneh (R: T) dan Pintunya tidak terkunci (Q: F). **Lari jika Pintu terkunci (Q) ATAU ada Suara (R).**",
            propositions: { Q: false, R: true },
            logic: 'Q ∨ R',
            answer: LOGIC_OPS['P ∨ Q'](false, true) // Menggunakan disjungsi
        },
        {
            task: 3,
            title: "Kunci 3: Keluar Cepat (Negasi)",
            narrative: "Hantu mendekat. Kamu hanya bisa selamat jika **Lampu TIDAK menyala (¬P)**. Situasi: Lampu menyala (P: T).",
            propositions: { P: true },
            logic: '¬P',
            answer: LOGIC_OPS['¬P'](true) 
        },
    ],
    2: [ // Level 2: Implikasi & Biimplikasi (P, Q)
        {
            task: 1,
            title: "Kunci 4: Jendela Tertutup (Implikasi)",
            narrative: "Hantu hanya mengejar **JIKA Pintu terkunci (P), MAKA Jendela Tertutup (Q)**. Situasi: Pintu terkunci (P: T), Jendela terbuka (Q: F). Pilih: Apakah Hantu mengejar (F) atau tidak (T)?",
            propositions: { P: true, Q: false },
            logic: 'P → Q',
            answer: LOGIC_OPS['P → Q'](true, false) // False
        },
        {
            task: 2,
            title: "Kunci 5: Ruangan Aman (Biimplikasi)",
            narrative: "Ruangan ini aman **JIKA dan HANYA JIKA Lampu Mati (P: F) dan Pintu Terbuka (Q: F)**. Situasi: Lampu Mati (P: F), Pintu Terbuka (Q: F).",
            propositions: { P: false, Q: false },
            logic: 'P ↔ Q',
            answer: LOGIC_OPS['P ↔ Q'](false, false) // True
        },
        {
            task: 3,
            title: "Kunci 6: Rantai Keputusan",
            narrative: "Implikasi Ganda: **(Pintu terkunci → Lampu menyala)**. Situasi: Pintu terkunci (P: T), Lampu menyala (Q: T).",
            propositions: { P: true, Q: true },
            logic: 'P → Q',
            answer: LOGIC_OPS['P → Q'](true, true) // True
        },
    ],
    3: [ // Level 3: Tautologi dan Kontradiksi (Membutuhkan kombinasi lebih kompleks)
        {
            task: 1,
            title: "Kunci 7: Tautologi Dasar",
            narrative: "Pilih aksi yang selalu benar: **P ∨ ¬P** (P: True)",
            propositions: { P: true },
            logic: 'P ∨ ¬P',
            answer: LOGIC_OPS['P ∨ Q'](true, !true) // Tautologi, harusnya True
        },
        // Tambahkan task lain di sini
    ]
};

// =======================================================
// FUNGSI UTAMA GAME
// =======================================================

function updateUI() {
    const healthBar = '❤️'.repeat(gameState.health) + '💀'.repeat(3 - gameState.health);
    const currentQuest = QUESTS[gameState.currentLevel] ? QUESTS[gameState.currentLevel][gameState.currentTask - 1] : null;
    
    // Update Menu (Unlock Level)
    document.getElementById('level-2-btn').disabled = !gameState.levelProgress[1];
    document.getElementById('level-3-btn').disabled = !gameState.levelProgress[2];

    if (!currentQuest) {
        // Tampilkan layar kemenangan
        document.getElementById('game-content-area').innerHTML = `
            <h2>🏆 SELAMAT! KAMU BERHASIL! 🏆</h2>
            <p>Kamu telah menyelesaikan semua level Logika Proposisional dan berhasil keluar dari rumah hantu. Logikamu sangat kuat!</p>
            <p>Klik 'Restart Game' untuk mencoba lagi.</p>
        `;
        return;
    }

    // Tampilkan Konten Task
    document.getElementById('game-content-area').innerHTML = `
        <div class="status-bar">
            <span>Level: ${gameState.currentLevel} / 3</span>
            <span>Task: ${gameState.currentTask} / ${gameState.maxTasks}</span>
            <span class="health">Health: ${healthBar}</span>
        </div>

        <h2>Task ${currentQuest.task}: ${currentQuest.title}</h2>
        <div class="logika-highlight">
            <p>🔑 Logika Kunci: **${currentQuest.logic}**</p>
        </div>
        <p>${currentQuest.narrative}</p>

        <h3>Pilih Hasil Logika untuk Selamat:</h3>
        <div class="options-container">
            <button onclick="checkAnswer(true)">True (T) / Selamat</button>
            <button onclick="checkAnswer(false)">False (F) / Gagal</button>
        </div>

        <div id="feedback-area" class="feedback default">Pilih salah satu jawaban di atas!</div>
    `;

    // Render MathJax (Notasi Logika)
    if (window.MathJax) {
        window.MathJax.typeset();
    }
}

function checkAnswer(userAnswer) {
    const currentQuest = QUESTS[gameState.currentLevel][gameState.currentTask - 1];
    const feedbackArea = document.getElementById('feedback-area');

    if (userAnswer === currentQuest.answer) {
        // Jawaban Benar
        feedbackArea.className = "feedback correct";
        feedbackArea.innerHTML = `✅ **BENAR!** ${userAnswer ? 'Lari' : 'Jangan Lari'} adalah keputusan yang tepat. Level Up!`;
        
        // Lanjut ke Task berikutnya setelah jeda
        setTimeout(() => nextTask(), 1500);

    } else {
        // Jawaban Salah
        gameState.health--;
        feedbackArea.className = "feedback wrong";
        feedbackArea.innerHTML = `❌ **SALAH!** Itu adalah keputusan yang salah. Kamu kehilangan 1 Health.`;
        
        if (gameState.health <= 0) {
            // Game Over
            setTimeout(() => gameOver(), 1500);
        } else {
            // Update UI setelah Health berkurang
            setTimeout(() => updateUI(), 1000); 
        }
    }
}

function nextTask() {
    gameState.currentTask++;
    if (gameState.currentTask > gameState.maxTasks) {
        // Level Selesai
        gameState.levelProgress[gameState.currentLevel] = true;
        gameState.currentLevel++;
        gameState.currentTask = 1;

        if (gameState.currentLevel <= 3) {
            alert(`Level ${gameState.currentLevel - 1} Selesai! Selamat datang di Level ${gameState.currentLevel}.`);
        }
    }
    updateUI();
}

function startGame(level) {
    // Reset state jika pindah level
    gameState.currentLevel = level;
    gameState.currentTask = 1;
    updateUI();
}

function gameOver() {
    document.getElementById('game-content-area').innerHTML = `
        <h2>☠️ GAME OVER ☠️</h2>
        <p>Logikamu gagal. Hantu menangkapmu.</p>
        <button onclick="location.reload()">Coba Lagi (Restart)</button>
    `;
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateUI);
