import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper: Smart contextual fallback when GEMINI_API_KEY is not yet attached or during quota limits
  function getPedagogicalFallbackResponse(missionId: number, query: string): string {
    const q = query.toLowerCase();

    if (missionId === 1) {
      if (q.includes('rumus') || q.includes('hitung') || q.includes('formula') || q.includes('matematika')) {
        return "Wahai cucunda, peganglah teguh hukum pengenceran: **M₁ × V₁ = M₂ × V₂**. Kepekatan awal (M₁) dikali volume larutan pekat yang cucunda ambil (V₁), nilainya akan selalu sama dengan kepekatan akhir (M₂) dikali volume total ramuan (V₂). Ingatlah, air murni yang ditambahkan adalah selisih antara V₂ dengan V₁.";
      }
      if (q.includes('kenapa') || q.includes('mengapa') || q.includes('bahaya') || q.includes('lambung') || q.includes('pekat')) {
        return "Duhai cucunda, ekstrak daun sambiloto induk memiliki kadar 2.0 M yang terlampau pekat dan asam. Jika diminum langsung, zat aktif asam andrografolat dapat melukai lambung penduduk desa. Kita harus menurunkannya hingga tepat 0.50 M dengan volume total 100 mL agar menjadi obat yang menyehatkan tanpa merusak.";
      }
      if (q.includes('berapa') || q.includes('takaran') || q.includes('jawaban') || q.includes('angka') || q.includes('ml')) {
        return "Hehe, Nenek tidak boleh membocorkan takaran pasti ya cucunda! Nalar dan tangan cucunda sendirilah yang harus mengukurnya di kuali. Gunakan rumus M₁ × V₁ = M₂ × V₂ dengan data M₁ = 2.0 M, M₂ = 0.50 M, dan V₂ = 100 mL. Hitunglah berapa V₁ ekstrak sambiloto dan berapa sisa air murninya!";
      }
      return "Wahai cucunda, pada Misi 1 ini intinya adalah **Pengenceran Larutan**. Jumlah mol zat aktif di dalam daun sambiloto tidak berkurang saat ditambah air murni (n₁ = n₂), melainkan ruang pelarutnya yang meluas sehingga kepekatannya berkurang. Cobalah hitung dan racik di kuali!";
    }

    if (missionId === 2) {
      if (q.includes('rumus') || q.includes('hitung') || q.includes('titik netral') || q.includes('reaksi')) {
        return "Wahai cucunda, pada reaksi netralisasi berlaku kesetaraan mol ion: **a × M_A × V_A = b × M_B × V_B**, di mana 'a' adalah valensi asam sitrat dan 'b' adalah valensi basa abu kayu. Ketika jumlah mol ion H⁺ tepat sama dengan mol ion OH⁻, ramuan akan mencapai titik netral sempurna (pH = 7).";
      }
      if (q.includes('warna') || q.includes('indikator') || q.includes('hijau') || q.includes('kuning') || q.includes('merah')) {
        return "Perhatikanlah mata air indikator alami kita cucunda: jika ramuan masih terlalu asam (kelebihan asam sitrat jeruk), warnanya akan merah muda jingga. Jika terlalu basa (kelebihan abu kayu), warnanya berubah menjadi biru tua keunguan. Warna **hijau zamrud jernih** menandakan pH tepat netral 7!";
      }
      if (q.includes('berapa') || q.includes('takaran') || q.includes('jawaban') || q.includes('ml')) {
        return "Cucunda yang cerdik, seorang tabib sejati menguji racikannya dengan perhitungan cermat. Nenek tidak boleh memberi tahu angka mililiternya secara cuma-cuma. Masukkan asam jeruk 0.20 M (30 mL) ke dalam rumus netralisasi untuk mencari volume basa abu kayu 0.10 M yang seimbang!";
      }
      return "Duhai anak muda, Misi 2 melatih keahlian cucunda dalam **Netralisasi Asam-Basa**. Asam sitrat dari perasan jeruk purut berpadu dengan kalium karbonat dari abu kayu menghasilkan air dan garam obat penawar racun. Pastikan ion H⁺ dan OH⁻ seimbang sempurna.";
    }

    if (missionId === 3) {
      if (q.includes('telang') || q.includes('warna') || q.includes('indikator') || q.includes('antosianin')) {
        return "Kembang telang mengandung pigmen alami antosianin yang amat peka terhadap derajat keasaman (pH). Di lingkungan asam getah belimbing ia berwarna merah keunguan, pada **titik ekuivalen netral** berubah menjadi **biru toska anggun**, dan jika kelebihan basa kapur sirih ia akan berubah menjadi kuning kehijauan.";
      }
      if (q.includes('rumus') || q.includes('titrasi') || q.includes('konsentrasi') || q.includes('molaritas')) {
        return "Dalam titrasi analitis ini, gunakan prinsip kesetaraan mol saat titik ekuivalen: **M_asam × V_asam = M_basa × V_basa**. Basa kapur sirih Ca(OH)₂ adalah larutan standar yang telah diketahui kepekatannya. Dari volume basa yang terpakai hingga warna berubah menjadi biru toska, cucunda dapat menentukan konsentrasi getah belimbing!";
      }
      return "Wahai cucunda, Misi 3 menguji kemahiran cucunda dalam **Titrasi Asam-Basa & Indikator Alami**. Teteskan larutan standar secara perlahan ke dalam kuali hingga mencapai titik akhir titrasi yang ditandai dengan perubahan warna stabil.";
    }

    if (missionId === 4) {
      if (q.includes('rumus') || q.includes('stoikiometri') || q.includes('pereaksi') || q.includes('pembatas')) {
        return "Pada sintesis ramuan pamungkas ini, reaksi antara asam fenolat eugenol (cengkeh) dan ekstrak basa bunga lawang berlangsung dalam perbandingan stoikiometri mol 1:1. Jika ada reagen yang berlebih, ia akan menjadi sisa yang mengotori khasiat ramuan. Keduanya harus tepat habis bereaksi menjadi kompleks garam emas!";
      }
      if (q.includes('warna') || q.includes('kristal') || q.includes('emas') || q.includes('indikator')) {
        return "Cucunda yang berbakti, ramuan pamungkas yang murni akan memancarkan kilau **kuning keemasan (Golden Elixir)** tanpa ada endapan keruh asam maupun sisa basa. Itulah tanda reaksi stoikiometri telah tuntas 100%.";
      }
      return "Wahai cucunda, Misi 4 adalah puncak pembuktian ilmu kimia cucunda: **Stoikiometri Larutan Presisi**. Hitung mol reagen A dan sesuaikan dengan mol reagen B agar tidak ada pereaksi pembatas maupun pereaksi sisa.";
    }

    return "Wahai cucunda, tanyakanlah apa yang masih membingungkan di benakmu mengenai konsep asam-basa, pengenceran, atau reaksi kimia ramuan ini. Nenek siap membimbing akal dan nalarmu!";
  }

  // API Route: AI Consultation with Nenek Kebayan
  app.post("/api/consultation", async (req, res) => {
    const { missionId, missionTitle, topic, messages } = req.body;
    const studentLastQuery = (messages && messages.length > 0)
      ? messages[messages.length - 1].content
      : "";

    // Lazy initialize Gemini AI with current environment key
    const currentApiKey = process.env.GEMINI_API_KEY;

    if (currentApiKey && currentApiKey.trim().length > 0 && currentApiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = new GoogleGenAI({
          apiKey: currentApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // Strict System Instruction according to PRD & User Specifications
        const systemInstruction = `
Kamu adalah Nenek Kebayan, seorang tabib herbal Melayu yang bijak, ramah, bersahaja, berwibawa, dan sangat menguasai ilmu kimia analitis SMA Kelas XI serta kearifan herbal nusantara.
Gunakan gaya bahasa Melayu tradisional yang santun, hangat, dan memanggil murid dengan sebutan "Cucunda", "Wahai cucunda", atau "Anak muda".

Saat ini murid sedang berada di:
- Misi: ${missionId} (${missionTitle})
- Topik Pembelajaran: ${topic}

KONTEKS ILMIAH & HERBAL UNTUK MISI INI:
- Misi 1 (Sambiloto & Pengenceran Molaritas): Daun sambiloto (Andrographis paniculata) mengandung zat aktif asam andrografolat yang sangat pekat. Jika ekstrak induk pekat (2.0 M) langsung diminum tanpa diencerkan, kadar asam dan zat aktifnya terlalu tinggi dan dapat melukai lambung. Oleh sebab itu berlaku hukum pengenceran (M1 * V1 = M2 * V2) di mana penambahan air murni tidak mengubah jumlah mol zat terlarut (n1 = n2), melainkan memperbesar volume larutan sehingga konsentrasinya turun menjadi dosis aman (0.50 M, volume total 100 mL).
- Misi 2 (Jeruk Purut & Abu Kayu / Netralisasi Asam-Basa): Asam sitrat dari jeruk purut (asam, ion H+) dinetralkan dengan basa kalium karbonat/hidroksida dari abu kayu (basa, ion OH-). Reaksi netralisasi H+ + OH- -> H2O menghasilkan garam dan air. Pada titik netral (pH = 7, indikator hijau zamrud), jumlah mol H+ tepat sama dengan mol OH- (a * MA * VA = b * MB * VB).
- Misi 3 (Getah Belimbing Asam & Basa Kapur Sirih / Titrasi & Indikator Telang): Menentukan konsentrasi asam getah belimbing yang belum diketahui melalui titrasi dengan larutan standar basa kapur sirih (Ca(OH)2). Titik ekuivalen dicapai ketika mol asam tepat habis bereaksi dengan mol basa (MA * VA = MB * VB). Pigmen antosianin bunga telang bertindak sebagai indikator alami: merah muda ungu (asam) -> biru toska (ekuivalen/netral) -> hijau kekuningan (basa).
- Misi 4 (Minyak Cengkeh Asam Fenolat & Bunga Lawang / Stoikiometri Presisi): Reaksi stoikiometri asam fenolat eugenol dengan ekstrak basa bunga lawang dalam rasio stoikiometri 1:1 membentuk kompleks garam fenolat emas tanpa sisa asam atau basa berbahaya.

ATURAN KETAT DAN MUTLAK:
1. BATASAN TOPIK (STRICT TOPIC): Kamu HANYA boleh menjawab pertanyaan yang berkaitan langsung dengan materi kimia pada Misi ${missionId} (${topic}) seperti konsep konsentrasi larutan (Molaritas, pengenceran M1*V1 = M2*V2), reaksi netralisasi asam-basa, titrasi, titik ekuivalen, titik akhir titrasi, dan indikator warna.
2. JIKA DI LUAR TOPIK: Jika murid bertanya hal lain di luar materi kimia/ramuan misi ini (seperti game lain, politik, coding, curhat umum, atau sains lain yang tak relevan), TOLAK DENGAN HALUS dan gunakan peribahasa atau nasihat Melayu yang mengarahkan kembali ke ramuan dan materi kimia yang sedang dipelajari.
3. BATASAN JAWABAN EKSPERIMEN (CRITICAL ANTI-CHEAT): JANGAN PERNAH SEKALI-KALI memberikan jawaban angka pasti, takaran mililiter (ml) tepat, atau nilai rahasia reagen yang harus dimasukkan ke dalam kuali eksperimen!
   - Jangan sebut "Tuang 25 ml", atau "Pilih nilai 30 ml".
   - Murid HARUS menguji dan menghitung takarannya sendiri di laboratorium.
   - Jelaskan konsep kimianya, rumusnya, hubungan mol sebelum dan sesudah reaksi/pengenceran, atau bagaimana ciri perubahan warna indikator ketika asam bertemu basa.
4. FORMAT PENJELASAN: Buat jawaban padat, mudah dipahami siswa SMA kelas XI, maksimal 2-3 paragraf singkat, ramah, dan beri semangat agar cucunda berani mencoba di kuali racikan.
`;

        // Construct conversational contents for Gemini
        const conversationHistory = (messages || []).map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: conversationHistory,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const replyText = response.text;
        if (replyText && replyText.trim().length > 0) {
          return res.json({ reply: replyText, isAIPowered: true });
        }
      } catch (err: unknown) {
        console.warn("Gemini API call failed, switching to pedagogical knowledge base:", err);
      }
    }

    // Fallback response when key is unconfigured or quota/network error
    const fallbackReply = getPedagogicalFallbackResponse(Number(missionId) || 1, studentLastQuery);
    return res.json({
      reply: fallbackReply,
      isAIPowered: false,
    });
  });

  // Vite middleware for development or Static server for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Laboratorium Nenek Kebayan server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
