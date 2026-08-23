import { Mission, StoryFragment } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Misi 1: Menakar Kepekatan Penawar",
    topic: "Konsep Dasar Konsentrasi & Pengenceran Larutan",
    subtitle: "Meracik Ekstrak Sambiloto & Pelarut Air Mata Air",
    herbalContext: "Kampung dilanda wabah demam panas. Nenek Kebayan memiliki ekstrak rebusan daun sambiloto pekat (mengandung asam andrografolat & zat pahit aktif). Jika diminum dalam konsentrasi pekat (2.0 M), keasaman dan kepekatannya dapat merusak lambung warga. Diperlukan pengenceran menjadi konsentrasi terapeutik 0.50 M sebanyak 100 mL.",
    storyFragment: "Kampung sedang dilanda demam aneh. Nenek Kebayan, tabib kampung, membuka lemari ramuan warisan neneknya — separuh catatannya sudah pudar dimakan waktu.",
    challengeQuestion: "Tersedia larutan stok ekstrak sambiloto dengan konsentrasi pekat M₁ = 2,0 M. Nenek ingin menyiapkan 100 mL larutan penawar dengan konsentrasi tepat M₂ = 0,50 M. Berapakah volume ekstrak pekat (V₁) dan volume air mata air (V_air) yang harus dicampurkan ke dalam kuali?",
    theoryConnection: "Dalam ilmu kimia dan farmasi, daun sambiloto (Andrographis paniculata) mengandung senyawa aktif asam andrografolat. Konsep Pengenceran Larutan (M₁·V₁ = M₂·V₂) berlaku karena saat pelarut (air) ditambahkan, jumlah mol zat terlarut (n = M × V) di dalam larutan tidak berubah (n₁ = n₂). Volume total adalah V₂ = V₁ + V_air.",
    knownVariables: [
      { label: "Konsentrasi Ekstrak Pekat (M₁)", value: "2,0 M" },
      { label: "Konsentrasi Target Ramuan (M₂)", value: "0,50 M" },
      { label: "Volume Total Larutan Obat (V₂)", value: "100 mL" },
      { label: "Rumus Pengenceran", value: "M₁ × V₁ = M₂ × V₂" },
      { label: "Target Volume Ekstrak (V₁)", value: "25 mL" },
      { label: "Target Air Mata Air (V_air)", value: "75 mL (100 mL - 25 mL)" }
    ],
    objectives: [
      "Pahami konsep Molaritas (M) dan rumus pengenceran M₁ × V₁ = M₂ × V₂.",
      "Hitung volume ekstrak pekat (V₁) dan air pelarut yang diperlukan untuk mencapai konsentrasi 0,50 M dalam 100 mL larutan.",
      "Konsultasikan prinsip kepekatan larutan dengan Nenek Kebayan AI.",
      "Uji takaran volume ekstrak pekat dan air pelarut di kuali laboratorium dalam waktu 60 detik."
    ],
    scientificConcept: {
      title: "Molaritas & Hukum Pengenceran (Dilution)",
      summary: "Molaritas (M) menyatakan jumlah mol zat terlarut per liter larutan (M = n / V). Pada proses pengenceran, penambahan air hanya memperbesar volume total tanpa mengubah jumlah mol zat terlarut, sehingga n₁ = n₂ atau M₁ × V₁ = M₂ × V₂.",
      formula: "M₁ · V₁ = M₂ · V₂   (dengan V_total = V₁ + V_air)"
    },
    experimentConfig: {
      cauldronName: "Kuali Tembaga Ramuan Sambiloto",
      reagentAName: "Ekstrak Sambiloto Pekat (2.0 M)",
      reagentAUnit: "mL",
      reagentAMin: 5,
      reagentAMax: 60,
      reagentAStep: 1,
      reagentADefault: 10,
      
      reagentBName: "Air Murni Mata Air Pegunungan",
      reagentBUnit: "mL",
      reagentBMin: 20,
      reagentBMax: 120,
      reagentBStep: 5,
      reagentBDefault: 40,

      // Target: M1*V1 = M2*V2 -> Target 0.50 M in 100 mL total solution -> V1 = 25 mL, V2 = 75 mL
      targetReagentA: 25,
      targetReagentB: 75,
      toleranceA: 2,
      toleranceB: 5,

      indicatorName: "Tingkat Kepekatan Herbal (0.50 M)",
      colorStates: {
        under: {
          color: "#A3D977",
          bgClass: "bg-lime-200 text-lime-900 border-lime-400",
          label: "Terlalu Encer (Konsentrasi < 0.50 M)",
          feedback: "Warna ramuan terlalu pucat kehijauan muda. Kadar zat aktif sambiloto belum mencukupi untuk menurunkan demam!"
        },
        target: {
          color: "#4E8752",
          bgClass: "bg-emerald-700 text-emerald-50 border-emerald-500",
          label: "Tepat & Seimbang (M = 0.50 M, Volume 100 mL)",
          feedback: "MasyaAllah! Warna hijau daun segar berkilau sempurna. Konsentrasi 0.50 M pas untuk meredakan demam tanpa mengiritasi lambung!"
        },
        over: {
          color: "#1F3B20",
          bgClass: "bg-emerald-950 text-emerald-200 border-emerald-800",
          label: "Terlalu Pekat (Konsentrasi > 0.50 M)",
          feedback: "Warna ramuan hijau sangat gelap dan berbusa pekat. Kepekatan tinggi berbahaya dan dapat melukai dinding lambung!"
        }
      }
    },
    sampleQuestions: [
      "Nenek, mengapa daun sambiloto yang pekat harus diencerkan dengan air mata air?",
      "Bagaimana cara menghitung volume ekstrak sambiloto (V1) jika ingin konsentrasi 0.50 M sebanyak 100 mL?",
      "Apa hubungan antara jumlah mol zat terlarut sebelum dan sesudah pengenceran?"
    ]
  },
  {
    id: 2,
    title: "Misi 2: Keseimbangan Asam dan Basa",
    topic: "Prinsip Titrasi Asam-Basa & Netralisasi",
    subtitle: "Menetralkan Asam Jeruk Purut dengan Basa Abu Kayu",
    herbalContext: "Warga yang terkena demam juga menderita asidosis (kelebihan asam lambung). Nenek Kebayan menyiapkan ekstrak asam sitrat alami dari jeruk purut (0.10 M). Agar ramuan tidak melukai lambung karena terlalu asam, asam tersebut harus dinetralkan dengan basa kalium karbonat dari air abu kayu bakar (0.10 M).",
    storyFragment: "Ramuan pertama berhasil, tapi Nenek Kebayan teringat: dulu neneknya pernah bilang, 'takaran yang tepat itu bukan dihafal, tapi dirasakan pelan-pelan.'",
    challengeQuestion: "Nenek menyiapkan 20 mL larutan asam jeruk purut (0,10 M, asam bervalensi 1). Berapa volume larutan basa abu kayu (0,10 M, basa bervalensi 1) yang harus diteteskan ke dalam bejana agar terjadi reaksi netralisasi sempurna (pH = 7) yang ditandai dengan warna hijau zamrud?",
    theoryConnection: "Asam jeruk purut melepaskan ion H⁺ sedangkan air abu kayu (mengandung K₂CO₃/KOH) menyediakan ion OH⁻. Reaksi netralisasi terjadi ketika ion H⁺ bereaksi dengan OH⁻ membentuk H₂O: H⁺ + OH⁻ → H₂O. Pada titik netral: Mol H⁺ = Mol OH⁻ (a · M_A · V_A = b · M_B · V_B).",
    knownVariables: [
      { label: "Volume Asam Jeruk (V_A)", value: "20 mL" },
      { label: "Konsentrasi Asam Jeruk (M_A)", value: "0,10 M (valensi a = 1)" },
      { label: "Konsentrasi Basa Abu Kayu (M_B)", value: "0,10 M (valensi b = 1)" },
      { label: "Rumus Netralisasi", value: "a × M_A × V_A = b × M_B × V_B" },
      { label: "Target Titran Basa (V_B)", value: "20 mL" }
    ],
    objectives: [
      "Pahami reaksi netralisasi asam dan basa (H⁺ + OH⁻ → H₂O).",
      "Ketahui bahwa titik netral dicapai ketika mol ion H⁺ tepat sama dengan mol ion OH⁻.",
      "Teteskan basa abu kayu secara bertahap hingga lakmus alami ramuan berubah warna menjadi hijau zamrud netral (pH 7)."
    ],
    scientificConcept: {
      title: "Reaksi Netralisasi Asam-Basa",
      summary: "Reaksi asam dengan basa menghasilkan garam dan air. Pada titik netralisasi sempurna, seluruh ion H⁺ dari asam habis dinetralkan oleh ion OH⁻ dari basa sehingga tercapai pH netral.",
      formula: "a · M_A · V_A = b · M_B · V_B   (mol H⁺ = mol OH⁻)"
    },
    experimentConfig: {
      cauldronName: "Bejana Gerabah Netralisasi",
      reagentAName: "Ekstrak Asam Jeruk Purut (0.10 M)",
      reagentAUnit: "mL",
      reagentAMin: 10,
      reagentAMax: 50,
      reagentAStep: 1,
      reagentADefault: 20,
      
      reagentBName: "Titran Basa Abu Kayu (0.10 M)",
      reagentBUnit: "mL",
      reagentBMin: 5,
      reagentBMax: 50,
      reagentBStep: 1,
      reagentBDefault: 10,

      // Target: 20 mL Asam (0.1 M) netral dengan 20 mL Basa (0.1 M)
      targetReagentA: 20,
      targetReagentB: 20,
      toleranceA: 1,
      toleranceB: 1,

      indicatorName: "Indikator Daun Kelor & Lakmus Alami",
      colorStates: {
        under: {
          color: "#E25A42",
          bgClass: "bg-rose-100 text-rose-900 border-rose-400",
          label: "Masih Asam (pH < 7, Jingga Kemerahan)",
          feedback: "Larutan masih berwarna jingga kemerahan. Ion H⁺ asam masih berlebih, ramuan masih terlalu kecut!"
        },
        target: {
          color: "#3F8A6B",
          bgClass: "bg-teal-700 text-teal-50 border-teal-400",
          label: "Netral Sempurna (pH = 7, Hijau Zamrud)",
          feedback: "Alhamdulillah! Larutan berubah menjadi hijau zamrud jernih. Mol asam dan basa tepat seimbang (2.0 mmol)!"
        },
        over: {
          color: "#6B3F8A",
          bgClass: "bg-purple-900 text-purple-100 border-purple-500",
          label: "Kelebihan Basa (pH > 7, Ungu Gelap)",
          feedback: "Warna berubah menjadi ungu gelap kebiruan. Basa abu kayu berlebih membuat ramuan menjadi pahit getir!"
        }
      }
    },
    sampleQuestions: [
      "Nenek, mengapa ekstrak jeruk purut yang asam perlu dinetralkan dengan abu kayu?",
      "Bagaimana rumus kesetaraan mol asam dan basa pada titik netralisasi?",
      "Mengapa warna indikator berubah menjadi hijau zamrud saat asam dan basa seimbang?"
    ]
  },
  {
    id: 3,
    title: "Misi 3: Menemukan Titik Ekuivalen",
    topic: "Titik Ekuivalen, Titik Akhir Titrasi & Indikator Alami",
    subtitle: "Misteri Bunga Telang & Kapur Sirih",
    herbalContext: "Nenek menemukan catatan usang tentang getah asam belimbing wuluh yang tidak diketahui konsentrasinya (M_asam = ?). Untuk mengetahui kadar asam aslinya, kita melakukan titrasi 25 mL getah asam tersebut dengan larutan standar basa kapur sirih (0.20 M) menggunakan indikator pigmen antosianin bunga telang.",
    storyFragment: "Di catatan yang lebih pudar, tertulis nama seorang tabib muda yang hilang saat mencari ramuan penawar wabah serupa, puluhan tahun lalu.",
    challengeQuestion: "Sebanyak 25 mL getah belimbing asam dititrasi dengan larutan standar basa kapur sirih (0,20 M). Pada saat tepat mencapai titik ekuivalen (warna berubah menjadi biru toska), volume basa kapur sirih yang terpakai adalah 30 mL. Hitunglah konsentrasi getah belimbing asam tersebut (M_asam) dan uji di laboratorium!",
    theoryConnection: "Titik Ekuivalen adalah kondisi stoikiometri di mana mol asam tepat habis bereaksi dengan mol basa: n(H⁺) = n(OH⁻) ⇒ M_A × V_A = M_B × V_B. Indikator antosianin bunga telang sangat peka terhadap pH: merah muda keunguan (asam) → biru toska (ekuivalen/pH ~7) → hijau kekuningan (basa).",
    knownVariables: [
      { label: "Volume Sampel Getah Asam (V_A)", value: "25 mL" },
      { label: "Konsentrasi Basa Standar Kapur (M_B)", value: "0,20 M" },
      { label: "Volume Basa pada Titik Ekuivalen (V_B)", value: "30 mL" },
      { label: "Rumus Titrasi Asam-Basa", value: "M_A = (M_B × V_B) / V_A" },
      { label: "Hasil Hitungan Konsentrasi Asam (M_A)", value: "0,24 M ( (0,20 × 30) / 25 )" }
    ],
    objectives: [
      "Bedakan antara 'Titik Ekuivalen' (stoikiometri teoritis) dan 'Titik Akhir Titrasi' (perubahan warna fisik indikator).",
      "Gunakan sifat pigmen antosianin bunga telang yang sensitif terhadap trayek pH.",
      "Tentukan volume titran basa kapur sirih (30 mL, 0.20 M) hingga kuali mencapai warna biru toska cerah khas titik ekuivalen."
    ],
    scientificConcept: {
      title: "Titik Ekuivalen vs Titik Akhir Titrasi",
      summary: "Titik ekuivalen adalah saat mol asam tepat habis bereaksi dengan mol basa secara teoritis. Titik akhir titrasi adalah saat indikator menunjukkan perubahan warna nyata di laboratorium. Indikator antosianin bunga telang berubah: merah keunguan (asam) → biru toska (ekuivalen) → hijau kekuningan (basa).",
      formula: "n(H⁺) = n(OH⁻)  ⇒  M_A · V_A = M_B · V_B"
    },
    experimentConfig: {
      cauldronName: "Buret Bambu & Kuali Porselen Telang",
      reagentAName: "Getah Belimbing Asam (25 mL, Konsentrasi Misterius)",
      reagentAUnit: "mL",
      reagentAMin: 25,
      reagentAMax: 25,
      reagentAStep: 0,
      reagentADefault: 25,
      
      reagentBName: "Titran Basa Kapur Sirih (0.20 M)",
      reagentBUnit: "mL",
      reagentBMin: 10,
      reagentBMax: 50,
      reagentBStep: 1,
      reagentBDefault: 15,

      // Target: Asam 25 mL butuh 30 mL Kapur Sirih (0.20 M) => M_asam = (30 * 0.2) / 25 = 0.24 M
      targetReagentA: 25,
      targetReagentB: 30,
      toleranceA: 0,
      toleranceB: 1,

      indicatorName: "Antosianin Kelopak Bunga Telang",
      colorStates: {
        under: {
          color: "#9B387E",
          bgClass: "bg-pink-900 text-pink-100 border-pink-500",
          label: "Belum Ekuivalen (Merah Muda Keunguan Asam)",
          feedback: "Larutan masih bernuansa merah muda keunguan. Mol asam belum sepenuhnya bereaksi dengan kapur sirih!"
        },
        target: {
          color: "#2C7DA0",
          bgClass: "bg-cyan-800 text-cyan-50 border-cyan-400",
          label: "Titik Ekuivalen Tercapai (Biru Toska Anggun)",
          feedback: "Subhanallah! Warna biru toska bercahaya muncul seketika. Titik ekuivalen asam getah belimbing (0.24 M) telah terungkap!"
        },
        over: {
          color: "#588157",
          bgClass: "bg-emerald-900 text-emerald-100 border-emerald-400",
          label: "Lewat Titik Ekuivalen (Hijau Kekuningan Basa)",
          feedback: "Warna berubah menjadi hijau kekuningan akibat kelebihan basa kapur sirih. Percobaan telah melewati titik akhir titrasi!"
        }
      }
    },
    sampleQuestions: [
      "Nenek, bagaimana cara menentukan konsentrasi getah belimbing dari volume kapur sirih yang terpakai?",
      "Apa bedanya titik ekuivalen teoritis dan titik akhir titrasi indikator bunga telang?",
      "Mengapa antosianin bunga telang berubah dari merah muda ungu menjadi biru toska saat ekuivalen?"
    ]
  },
  {
    id: 4,
    title: "Misi 4: Ramuan Penawar Wabah Akhir",
    topic: "Aplikasi Stoikiometri Titrasi & Penawar Sempurna",
    subtitle: "Minyak Cengkeh Asam & Basa Bunga Lawang Emas",
    herbalContext: "Wabah telah mencapai puncaknya di kampung. Inilah ramuan pamungkas yang pernah dirintis Nenek Kebayan puluhan tahun lalu: sintesis presisi senyawa eugenol asam fenolat minyak cengkeh (0.25 M) dengan ekstrak basa bunga lawang (0.50 M) berindikator kunyit emas.",
    storyFragment: "Ternyata tabib muda itu adalah Nenek Kebayan sendiri, di masa mudanya. Ramuan terakhir ini adalah janji yang akhirnya bisa ia tepati.",
    challengeQuestion: "Nenek memasukkan 20 mL minyak cengkeh asam fenolat (0,25 M, total 5,0 mmol asam). Berapakah volume ekstrak basa bunga lawang (0,50 M) yang harus diteteskan dengan kontrol mikro agar seluruh 5,0 mmol asam bereaksi tepat 1:1 membentuk Ramuan Penawar Emas (Golden Elixir)?",
    theoryConnection: "Dalam kimia farmasi, reaksi stoikiometri asam fenolat dengan basa menghasilkan kompleks garam eugenolat yang larut dan berkhasiat anti-inflamasi tinggi. Mol asam = M_A × V_A = 0,25 M × 20 mL = 5,0 mmol. Agar stoikiometri 1:1 terpenuhi tanpa racun sisa reagen: V_B = mol / M_B = 5,0 mmol / 0,50 M = 10,0 mL.",
    knownVariables: [
      { label: "Volume Asam Fenolat Cengkeh (V_A)", value: "20 mL" },
      { label: "Konsentrasi Asam Cengkeh (M_A)", value: "0,25 M" },
      { label: "Jumlah Mol Asam (n_A)", value: "5,0 mmol (0,25 M × 20 mL)" },
      { label: "Konsentrasi Basa Bunga Lawang (M_B)", value: "0,50 M" },
      { label: "Target Volume Basa Lawang (V_B)", value: "10,0 mL (5,0 mmol / 0,50 M)" }
    ],
    objectives: [
      "Terapkan pemahaman penuh perhitungan konsentrasi dan stoikiometri titrasi presisi.",
      "Gunakan kontrol tetesan mikro untuk mencapai kemurnian ramuan pada titik stoikiometri 1:1 yang tepat.",
      "Selesaikan ramuan penawar emas (Golden Elixir) sebelum waktu 60 detik habis."
    ],
    scientificConcept: {
      title: "Aplikasi Stoikiometri Reaksi Larutan",
      summary: "Dalam formulasi obat dan kimia analitis, presisi titrasi menentukan efikasi dan keamanan senyawa aktif. Menghitung kadar zat aktif dengan titrasi langsung menjamin rasio stoikiometri 1:1 tanpa kelebihan pereaksi berbahaya.",
      formula: "n_asam = n_basa  ⇒  (M_A × V_A) = (M_B × V_B)"
    },
    experimentConfig: {
      cauldronName: "Kuali Emas Warisan Tabib Muda",
      reagentAName: "Minyak Cengkeh Asam Fenolat (0.25 M)",
      reagentAUnit: "mL",
      reagentAMin: 15,
      reagentAMax: 40,
      reagentAStep: 1,
      reagentADefault: 20,
      
      reagentBName: "Titran Basa Ekstrak Bunga Lawang (0.50 M)",
      reagentBUnit: "mL",
      reagentBMin: 5,
      reagentBMax: 30,
      reagentBStep: 0.5,
      reagentBDefault: 6,

      // Target: 20 mL Cengkeh (0.25 M) => mol = 5 mmol. Butuh 10 mL Bunga Lawang (0.50 M) => mol = 5 mmol
      targetReagentA: 20,
      targetReagentB: 10,
      toleranceA: 1,
      toleranceB: 0.5,

      indicatorName: "Indikator Kunyit Emas Tradisional",
      colorStates: {
        under: {
          color: "#E09F3E",
          bgClass: "bg-amber-100 text-amber-900 border-amber-400",
          label: "Belum Matang (Kuning Pucat Asam)",
          feedback: "Aroma cengkeh masih terlalu tajam dan warna masih kuning pucat. Mol asam masih bersisa!"
        },
        target: {
          color: "#D9A441",
          bgClass: "bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-bold border-yellow-300 ring-4 ring-yellow-400/40",
          label: "Ramuan Penawar Agung Berkilau Emas (Sempurna)",
          feedback: "Maha Suci Tuhan! Ramuan berkilau keemasan hangat. Stoikiometri 5.0 mmol terpenuhi tepat tanpa sisa racun!"
        },
        over: {
          color: "#8B263E",
          bgClass: "bg-rose-950 text-rose-200 border-rose-700",
          label: "Terlalu Pekat Basa (Merah Tua Keruh)",
          feedback: "Warna berubah merah gelap kecoklatan karena kelebihan bunga lawang. Senyawa aktif terdegradasi oleh basa!"
        }
      }
    },
    sampleQuestions: [
      "Nenek, bagaimana cara menghitung kebutuhan volume basa bunga lawang (0.50 M) untuk 20 mL minyak cengkeh (0.25 M)?",
      "Mengapa stoikiometri 1:1 asam-basa sangat krusial dalam pembuatan obat?",
      "Nenek, apa rahasia janji yang tersimpan selama puluhan tahun ini?"
    ]
  }
];

export const STORY_FRAGMENTS: StoryFragment[] = [
  {
    missionId: 1,
    unlocked: false,
    title: "Fragmen I: Warisan Lemari Usang",
    storyText: "Kampung sedang dilanda demam aneh. Nenek Kebayan, tabib kampung, membuka lemari ramuan warisan neneknya — separuh catatannya sudah pudar dimakan waktu.",
    chemicalWisdom: "Kepekatan bukanlah soal banyaknya daun yang ditumbuk semata, melainkan keselarasan antara partikel zat terlarut dengan air yang melarutkannya.",
    recipeName: "Ramuan Sambiloto Murni 0.50 M",
    recipeIngredients: ["25 mL Ekstrak Daun Sambiloto Pekat (2.0 M)", "75 mL Air Mata Air Pegunungan"],
    scientificFormula: "M₁ × V₁ = M₂ × V₂  ⇒  2.0 M × 25 mL = 0.50 M × 100 mL"
  },
  {
    missionId: 2,
    unlocked: false,
    title: "Fragmen II: Rasa di Ujung Jari",
    storyText: "Ramuan pertama berhasil, tapi Nenek Kebayan teringat: dulu neneknya pernah bilang, 'takaran yang tepat itu bukan dihafal, tapi dirasakan pelan-pelan.'",
    chemicalWisdom: "Asam yang tajam dan basa yang pekat akan saling memadamkan amarahnya saat bertemu dalam jumlah mol yang setara, melahirkan garam penyejuk dan air kehidupan.",
    recipeName: "Penawar Seimbang Jeruk Purut & Abu Kayu",
    recipeIngredients: ["20 mL Ekstrak Jeruk Purut (0.10 M)", "20 mL Titran Basa Abu Kayu (0.10 M)", "3 tetes Indikator Daun Kelor"],
    scientificFormula: "Mol Asam = Mol Basa  ⇒  (0.10 M × 20 mL) = (0.10 M × 20 mL) = 2.0 mmol"
  },
  {
    missionId: 3,
    unlocked: false,
    title: "Fragmen III: Tabib Muda yang Hilang",
    storyText: "Di catatan yang lebih pudar, tertulis nama seorang tabib muda yang hilang saat mencari ramuan penawar wabah serupa, puluhan tahun lalu.",
    chemicalWisdom: "Perubahan warna bunga telang dari ungu ke biru toska adalah saksi bisu tercapainya titik ekuivalen — batas suci di mana tak ada lagi asam yang tersisa tanpa pasangan basanya.",
    recipeName: "Eliksir Bunga Telang & Kapur Sirih",
    recipeIngredients: ["25 mL Getah Belimbing Asam (0.24 M)", "30 mL Basa Kapur Sirih (0.20 M)", "Kelopak Bunga Telang Alami"],
    scientificFormula: "M_Asam = (M_Basa × V_Basa) / V_Asam  ⇒  (0.20 M × 30 mL) / 25 mL = 0.24 M"
  },
  {
    missionId: 4,
    unlocked: false,
    title: "Fragmen IV: Janji Puluhan Tahun",
    storyText: "Ternyata tabib muda itu adalah Nenek Kebayan sendiri, di masa mudanya. Ramuan terakhir ini adalah janji yang akhirnya bisa ia tepati.",
    chemicalWisdom: "Ilmu kimia dan kearifan leluhur bertaut dalam bejana emas. Ketika ketelitian stoikiometri dipadukan dengan niat tulus menolong sesama, lahirlah penawar sejati penumpas wabah.",
    recipeName: "Ramuan Agung Penawar Wabah (Golden Elixir)",
    recipeIngredients: ["20 mL Minyak Cengkeh Fenolat (0.25 M)", "10 mL Basa Bunga Lawang (0.50 M)", "Ekstrak Kunyit Emas Kerajaan"],
    scientificFormula: "Stoikiometri 1:1 Presisi  ⇒  5.0 mmol Asam Fenolat + 5.0 mmol Basa Lawang = Netralisasi Sempurna Emas"
  }
];
