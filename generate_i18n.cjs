const fs = require('fs');

const base = {
  prayers: 'Prayers',
  quran: 'Quran',
  settings: 'Settings',
  searchLocation: 'Search Location',
  enterCity: 'Enter city name...',
  nothingFound: 'Nothing found',
  darkTheme: 'Dark Theme',
  enableDarkTheme: 'Enable dark mode',
  appLanguage: 'App Language',
  autoSelected: 'Auto-selected',
  manualSelected: 'Manually selected',
  untilNextPrayer: 'Until next prayer',
  timeLeft: 'Time left',
  chooseCity: 'Choose City',
  streakDays: 'Day streak',
  searchSurah: 'Search surah...',
  ayahs: 'Ayahs:',
  h: 'h',
  m: 'm',
  Fajr: 'Fajr',
  Sunrise: 'Sunrise',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
  loadingError: 'Failed to load prayer times',
  resetAuto: 'Auto (System)',
  loading: 'Loading...',
  chooseLang: 'Choose Language',
  streakTitle: 'Faith Flame',
  streakDay1: 'Day',
  streakDay2: 'Days',
  streakDay5: 'Days',
  continueReading: 'Continue Reading',
  surahPrefix: 'Surah',
  searchSurahDesc: 'Search surah (number or name)'
};

const translations = {
  en: base,
  ru: {
    prayers: 'Намаз', quran: 'Коран', settings: 'Настройки', searchLocation: 'Поиск локации', enterCity: 'Введите название города...', nothingFound: 'Ничего не найдено', darkTheme: 'Темная тема', enableDarkTheme: 'Включить темное оформление', appLanguage: 'Язык приложения', autoSelected: 'Выбран автоматически', manualSelected: 'Выбран вручную', untilNextPrayer: 'До следующего намаза', timeLeft: 'Осталось', chooseCity: 'Выбрать город', streakDays: 'Дней подряд', searchSurah: 'Поиск суры...', ayahs: 'Аятов:', h: 'ч', m: 'мин', Fajr: 'Фаджр', Sunrise: 'Восход', Dhuhr: 'Зухр', Asr: 'Аср', Maghrib: 'Магриб', Isha: 'Иша', loadingError: 'Не удалось загрузить время намаза', resetAuto: 'Автоматически', loading: 'Загрузка...', chooseLang: 'Выберите язык', streakTitle: 'Огонёк веры', streakDay1: 'День', streakDay2: 'Дня', streakDay5: 'Дней', continueReading: 'Продолжить чтение', surahPrefix: 'Сура', searchSurahDesc: 'Поиск суры (номер или название)'
  },
  es: {
    prayers: 'Oraciones', quran: 'Corán', settings: 'Ajustes', searchLocation: 'Buscar ubicación', enterCity: 'Ingrese el nombre de la ciudad...', nothingFound: 'No se encontró nada', darkTheme: 'Tema oscuro', enableDarkTheme: 'Habilitar modo oscuro', appLanguage: 'Idioma de la aplicación', autoSelected: 'Selección automática', manualSelected: 'Selección manual', untilNextPrayer: 'Hasta la próxima oración', timeLeft: 'Tiempo restante', chooseCity: 'Elegir ciudad', streakDays: 'Racha de días', searchSurah: 'Buscar sura...', ayahs: 'Aleyas:', h: 'h', m: 'm', Fajr: 'Fajr', Sunrise: 'Amanecer', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', loadingError: 'Error al cargar horarios de oración', resetAuto: 'Automático (Sistema)', loading: 'Cargando...', chooseLang: 'Elegir idioma', streakTitle: 'Llama de fe', streakDay1: 'Día', streakDay2: 'Días', streakDay5: 'Días', continueReading: 'Continuar leyendo', surahPrefix: 'Sura', searchSurahDesc: 'Buscar sura (número o nombre)'
  },
  fr: {
    prayers: 'Prières', quran: 'Coran', settings: 'Paramètres', searchLocation: 'Rechercher un lieu', enterCity: 'Entrez le nom de la ville...', nothingFound: 'Rien trouvé', darkTheme: 'Thème sombre', enableDarkTheme: 'Activer le mode sombre', appLanguage: 'Langue de l\'application', autoSelected: 'Sélection automatique', manualSelected: 'Sélection manuelle', untilNextPrayer: 'Jusqu\'à la prochaine prière', timeLeft: 'Temps restant', chooseCity: 'Choisir la ville', streakDays: 'Série de jours', searchSurah: 'Rechercher sourate...', ayahs: 'Versets :', h: 'h', m: 'm', Fajr: 'Fajr', Sunrise: 'Lever', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', loadingError: 'Échec du chargement des horaires de prière', resetAuto: 'Automatique (Système)', loading: 'Chargement...', chooseLang: 'Choisir la langue', streakTitle: 'Flamme de foi', streakDay1: 'Jour', streakDay2: 'Jours', streakDay5: 'Jours', continueReading: 'Continuer la lecture', surahPrefix: 'Sourate', searchSurahDesc: 'Rechercher sourate (numéro ou nom)'
  },
  de: {
    prayers: 'Gebete', quran: 'Koran', settings: 'Einstellungen', searchLocation: 'Ort suchen', enterCity: 'Stadtname eingeben...', nothingFound: 'Nichts gefunden', darkTheme: 'Dunkles Thema', enableDarkTheme: 'Dunkelmodus aktivieren', appLanguage: 'App-Sprache', autoSelected: 'Automatisch ausgewählt', manualSelected: 'Manuell ausgewählt', untilNextPrayer: 'Bis zum nächsten Gebet', timeLeft: 'Verbleibende Zeit', chooseCity: 'Stadt wählen', streakDays: 'Tage Serie', searchSurah: 'Sura suchen...', ayahs: 'Ajāt:', h: 'Std', m: 'Min', Fajr: 'Fadschr', Sunrise: 'Sonnenaufgang', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Ischa', loadingError: 'Laden der Gebetszeiten fehlgeschlagen', resetAuto: 'Automatisch (System)', loading: 'Wird geladen...', chooseLang: 'Sprache wählen', streakTitle: 'Flamme des Glaubens', streakDay1: 'Tag', streakDay2: 'Tage', streakDay5: 'Tage', continueReading: 'Weiterlesen', surahPrefix: 'Sura', searchSurahDesc: 'Sura suchen (Nummer oder Name)'
  },
  zh: {
    prayers: '祈祷', quran: '古兰经', settings: '设置', searchLocation: '搜索位置', enterCity: '输入城市名称...', nothingFound: '未找到任何内容', darkTheme: '深色主题', enableDarkTheme: '启用深色模式', appLanguage: '应用语言', autoSelected: '自动选择', manualSelected: '手动选择', untilNextPrayer: '距离下次祈祷', timeLeft: '剩余时间', chooseCity: '选择城市', streakDays: '连续天数', searchSurah: '搜索苏拉...', ayahs: '阿亚：', h: '小时', m: '分钟', Fajr: '晨礼 (Fajr)', Sunrise: '日出', Dhuhr: '晌礼 (Dhuhr)', Asr: '晡礼 (Asr)', Maghrib: '昏礼 (Maghrib)', Isha: '宵礼 (Isha)', loadingError: '加载祈祷时间失败', resetAuto: '自动 (系统)', loading: '加载中...', chooseLang: '选择语言', streakTitle: '信仰之火', streakDay1: '天', streakDay2: '天', streakDay5: '天', continueReading: '继续阅读', surahPrefix: '苏拉', searchSurahDesc: '搜索苏拉 (编号或名称)'
  },
  ja: {
    prayers: '礼拝', quran: 'コーラン', settings: '設定', searchLocation: '場所を検索', enterCity: '都市名を入力...', nothingFound: '何も見つかりません', darkTheme: 'ダークテーマ', enableDarkTheme: 'ダークモードを有効にする', appLanguage: 'アプリの言語', autoSelected: '自動選択', manualSelected: '手動選択', untilNextPrayer: '次の礼拝まで', timeLeft: '残り時間', chooseCity: '都市を選択', streakDays: '連続日数', searchSurah: 'スーラを検索...', ayahs: 'アーヤ：', h: '時間', m: '分', Fajr: 'ファジュル', Sunrise: '日の出', Dhuhr: 'ズフル', Asr: 'アスル', Maghrib: 'マグリブ', Isha: 'イシャー', loadingError: '礼拝時間の読み込みに失敗しました', resetAuto: '自動 (システム)', loading: '読み込み中...', chooseLang: '言語を選択', streakTitle: '信仰の炎', streakDay1: '日', streakDay2: '日', streakDay5: '日', continueReading: '続きを読む', surahPrefix: 'スーラ', searchSurahDesc: 'スーラを検索 (番号または名前)'
  },
  ar: {
    prayers: 'الصلاة', quran: 'القرآن', settings: 'الإعدادات', searchLocation: 'البحث عن الموقع', enterCity: 'أدخل اسم المدينة...', nothingFound: 'لم يتم العثور على شيء', darkTheme: 'الوضع الداكن', enableDarkTheme: 'تفعيل الوضع الداكن', appLanguage: 'لغة التطبيق', autoSelected: 'تم التحديد تلقائيًا', manualSelected: 'تم التحديد يدويًا', untilNextPrayer: 'حتى الصلاة القادمة', timeLeft: 'الوقت المتبقي', chooseCity: 'اختر المدينة', streakDays: 'أيام متتالية', searchSurah: 'البحث عن سورة...', ayahs: 'آيات:', h: 'س', m: 'د', Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء', loadingError: 'فشل في تحميل أوقات الصلاة', resetAuto: 'تلقائي (النظام)', loading: 'جاري التحميل...', chooseLang: 'اختر اللغة', streakTitle: 'شعلة الإيمان', streakDay1: 'يوم', streakDay2: 'أيام', streakDay5: 'أيام', continueReading: 'مواصلة القراءة', surahPrefix: 'سورة', searchSurahDesc: 'البحث عن سورة (رقم أو اسم)'
  },
  pt: {
    prayers: 'Orações', quran: 'Alcorão', settings: 'Configurações', searchLocation: 'Buscar Local', enterCity: 'Digite o nome da cidade...', nothingFound: 'Nada encontrado', darkTheme: 'Tema Escuro', enableDarkTheme: 'Ativar modo escuro', appLanguage: 'Idioma do Aplicativo', autoSelected: 'Selecionado automaticamente', manualSelected: 'Selecionado manualmente', untilNextPrayer: 'Até a próxima oração', timeLeft: 'Tempo restante', chooseCity: 'Escolher Cidade', streakDays: 'Dias seguidos', searchSurah: 'Buscar surata...', ayahs: 'Versículos:', h: 'h', m: 'm', Fajr: 'Fajr', Sunrise: 'Nascer do sol', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', loadingError: 'Falha ao carregar os horários de oração', resetAuto: 'Automático (Sistema)', loading: 'Carregando...', chooseLang: 'Escolher Idioma', streakTitle: 'Chama da Fé', streakDay1: 'Dia', streakDay2: 'Dias', streakDay5: 'Dias', continueReading: 'Continuar lendo', surahPrefix: 'Surata', searchSurahDesc: 'Buscar surata (número ou nome)'
  },
  it: {
    prayers: 'Preghiere', quran: 'Corano', settings: 'Impostazioni', searchLocation: 'Cerca posizione', enterCity: 'Inserisci il nome della città...', nothingFound: 'Nessun risultato', darkTheme: 'Tema scuro', enableDarkTheme: 'Abilita modalità scura', appLanguage: 'Lingua dell\'app', autoSelected: 'Selezionato automaticamente', manualSelected: 'Selezionato manualmente', untilNextPrayer: 'Fino alla prossima preghiera', timeLeft: 'Tempo rimasto', chooseCity: 'Scegli Città', streakDays: 'Giorni consecutivi', searchSurah: 'Cerca sura...', ayahs: 'Versetti:', h: 'h', m: 'm', Fajr: 'Fajr', Sunrise: 'Alba', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', loadingError: 'Impossibile caricare gli orari di preghiera', resetAuto: 'Automatico (Sistema)', loading: 'Caricamento...', chooseLang: 'Scegli la lingua', streakTitle: 'Fiamma di Fede', streakDay1: 'Giorno', streakDay2: 'Giorni', streakDay5: 'Giorni', continueReading: 'Continua a leggere', surahPrefix: 'Sura', searchSurahDesc: 'Cerca sura (numero o nome)'
  },
  tr: {
    prayers: 'Namaz', quran: 'Kuran', settings: 'Ayarlar', searchLocation: 'Konum Ara', enterCity: 'Şehir adını girin...', nothingFound: 'Hiçbir şey bulunamadı', darkTheme: 'Karanlık Tema', enableDarkTheme: 'Karanlık modu etkinleştir', appLanguage: 'Uygulama Dili', autoSelected: 'Otomatik seçildi', manualSelected: 'Manuel seçildi', untilNextPrayer: 'Bir sonraki namaza kadar', timeLeft: 'Kalan zaman', chooseCity: 'Şehir Seç', streakDays: 'Seri günleri', searchSurah: 'Sure ara...', ayahs: 'Ayetler:', h: 's', m: 'd', Fajr: 'Fecr', Sunrise: 'Güneş', Dhuhr: 'Öğle', Asr: 'İkindi', Maghrib: 'Akşam', Isha: 'Yatsı', loadingError: 'Namaz vakitleri yüklenemedi', resetAuto: 'Otomatik (Sistem)', loading: 'Yükleniyor...', chooseLang: 'Dil Seç', streakTitle: 'İman Ateşi', streakDay1: 'Gün', streakDay2: 'Gün', streakDay5: 'Gün', continueReading: 'Okumaya Devam Et', surahPrefix: 'Sure', searchSurahDesc: 'Sure ara (numara veya isim)'
  },
  ko: {
    prayers: '기도', quran: '꾸란', settings: '설정', searchLocation: '위치 검색', enterCity: '도시 이름 입력...', nothingFound: '검색 결과 없음', darkTheme: '다크 테마', enableDarkTheme: '다크 모드 활성화', appLanguage: '앱 언어', autoSelected: '자동 선택됨', manualSelected: '수동 선택됨', untilNextPrayer: '다음 기도까지', timeLeft: '남은 시간', chooseCity: '도시 선택', streakDays: '연속 일수', searchSurah: '수라 검색...', ayahs: '아야:', h: '시간', m: '분', Fajr: '파즈르', Sunrise: '일출', Dhuhr: '두흐르', Asr: '아스르', Maghrib: '마그리브', Isha: '이샤', loadingError: '기도 시간을 불러오지 못했습니다', resetAuto: '자동 (시스템)', loading: '로딩 중...', chooseLang: '언어 선택', streakTitle: '신앙의 불꽃', streakDay1: '일', streakDay2: '일', streakDay5: '일', continueReading: '계속 읽기', surahPrefix: '수라', searchSurahDesc: '수라 검색 (번호 또는 이름)'
  },
  hi: {
    prayers: 'नमाज़', quran: 'क़ुरान', settings: 'सेटिंग्स', searchLocation: 'स्थान खोजें', enterCity: 'शहर का नाम दर्ज करें...', nothingFound: 'कुछ नहीं मिला', darkTheme: 'डार्क थीम', enableDarkTheme: 'डार्क मोड सक्षम करें', appLanguage: 'ऐप की भाषा', autoSelected: 'स्वचालित चयनित', manualSelected: 'मैन्युअल रूप से चयनित', untilNextPrayer: 'अगली नमाज़ तक', timeLeft: 'शेष समय', chooseCity: 'शहर चुनें', streakDays: 'लगातार दिन', searchSurah: 'सूरा खोजें...', ayahs: 'आयतें:', h: 'घं', m: 'मि', Fajr: 'फ़ज्र', Sunrise: 'सूर्योदय', Dhuhr: 'ज़ुहर', Asr: 'अस्र', Maghrib: 'मग़रिब', Isha: 'ईशा', loadingError: 'नमाज़ का समय लोड करने में विफल', resetAuto: 'ऑटो (सिस्टम)', loading: 'लोड हो रहा है...', chooseLang: 'भाषा चुनें', streakTitle: 'आस्था की लौ', streakDay1: 'दिन', streakDay2: 'दिन', streakDay5: 'दिन', continueReading: 'पढ़ना जारी रखें', surahPrefix: 'सूरा', searchSurahDesc: 'सूरा खोजें (नंबर या नाम)'
  },
  nl: {
    prayers: 'Gebeden', quran: 'Koran', settings: 'Instellingen', searchLocation: 'Locatie zoeken', enterCity: 'Voer stadsnaam in...', nothingFound: 'Niets gevonden', darkTheme: 'Donker Thema', enableDarkTheme: 'Donkere modus inschakelen', appLanguage: 'App Taal', autoSelected: 'Automatisch geselecteerd', manualSelected: 'Handmatig geselecteerd', untilNextPrayer: 'Tot het volgende gebed', timeLeft: 'Resterende tijd', chooseCity: 'Kies Stad', streakDays: 'Aantal dagen', searchSurah: 'Soera zoeken...', ayahs: 'Verzen:', h: 'u', m: 'm', Fajr: 'Fajr', Sunrise: 'Zonsopkomst', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', loadingError: 'Kan gebedstijden niet laden', resetAuto: 'Automatisch (Systeem)', loading: 'Laden...', chooseLang: 'Kies Taal', streakTitle: 'Vlam van Geloof', streakDay1: 'Dag', streakDay2: 'Dagen', streakDay5: 'Dagen', continueReading: 'Verder lezen', surahPrefix: 'Soera', searchSurahDesc: 'Soera zoeken (nummer of naam)'
  },
  pl: {
    prayers: 'Modlitwy', quran: 'Koran', settings: 'Ustawienia', searchLocation: 'Szukaj lokalizacji', enterCity: 'Wpisz nazwę miasta...', nothingFound: 'Nic nie znaleziono', darkTheme: 'Ciemny motyw', enableDarkTheme: 'Włącz tryb ciemny', appLanguage: 'Język aplikacji', autoSelected: 'Wybrano automatycznie', manualSelected: 'Wybrano ręcznie', untilNextPrayer: 'Do następnej modlitwy', timeLeft: 'Pozostały czas', chooseCity: 'Wybierz Miasto', streakDays: 'Dni z rzędu', searchSurah: 'Szukaj sury...', ayahs: 'Wersety:', h: 'g', m: 'm', Fajr: 'Fadżr', Sunrise: 'Wschód słońca', Dhuhr: 'Zuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isza', loadingError: 'Nie udało się załadować godzin modlitw', resetAuto: 'Automatycznie (System)', loading: 'Ładowanie...', chooseLang: 'Wybierz język', streakTitle: 'Płomień Wiary', streakDay1: 'Dzień', streakDay2: 'Dni', streakDay5: 'Dni', continueReading: 'Kontynuuj czytanie', surahPrefix: 'Sura', searchSurahDesc: 'Szukaj sury (numer lub nazwa)'
  },
  id: {
    prayers: 'Salat', quran: 'Al-Qur\'an', settings: 'Pengaturan', searchLocation: 'Cari Lokasi', enterCity: 'Masukkan nama kota...', nothingFound: 'Tidak ditemukan', darkTheme: 'Tema Gelap', enableDarkTheme: 'Aktifkan mode gelap', appLanguage: 'Bahasa Aplikasi', autoSelected: 'Dipilih otomatis', manualSelected: 'Dipilih secara manual', untilNextPrayer: 'Hingga salat berikutnya', timeLeft: 'Sisa waktu', chooseCity: 'Pilih Kota', streakDays: 'Hari berturut-turut', searchSurah: 'Cari surah...', ayahs: 'Ayat:', h: 'j', m: 'm', Fajr: 'Subuh', Sunrise: 'Syuruq', Dhuhr: 'Zuhur', Asr: 'Asar', Maghrib: 'Magrib', Isha: 'Isya', loadingError: 'Gagal memuat jadwal salat', resetAuto: 'Otomatis (Sistem)', loading: 'Memuat...', chooseLang: 'Pilih Bahasa', streakTitle: 'Api Iman', streakDay1: 'Hari', streakDay2: 'Hari', streakDay5: 'Hari', continueReading: 'Lanjutkan membaca', surahPrefix: 'Surah', searchSurahDesc: 'Cari surah (nomor atau nama)'
  },
  th: {
    prayers: 'ละหมาด', quran: 'อัลกุรอาน', settings: 'การตั้งค่า', searchLocation: 'ค้นหาสถานที่', enterCity: 'ป้อนชื่อเมือง...', nothingFound: 'ไม่พบข้อมูล', darkTheme: 'ธีมมืด', enableDarkTheme: 'เปิดใช้งานโหมดมืด', appLanguage: 'ภาษาของแอป', autoSelected: 'เลือกอัตโนมัติ', manualSelected: 'เลือกด้วยตนเอง', untilNextPrayer: 'จนถึงละหมาดครั้งต่อไป', timeLeft: 'เวลาที่เหลือ', chooseCity: 'เลือกเมือง', streakDays: 'จำนวนวันต่อเนื่อง', searchSurah: 'ค้นหาซูเราะห์...', ayahs: 'อายะห์:', h: 'ชม.', m: 'น.', Fajr: 'ฟัจญ์ร', Sunrise: 'ซุรูก', Dhuhr: 'ซุฮรี', Asr: 'อัสรี', Maghrib: 'มักริบ', Isha: 'อิชาอ์', loadingError: 'ไม่สามารถโหลดเวลาละหมาดได้', resetAuto: 'อัตโนมัติ (ระบบ)', loading: 'กำลังโหลด...', chooseLang: 'เลือกภาษา', streakTitle: 'เปลวไฟแห่งศรัทธา', streakDay1: 'วัน', streakDay2: 'วัน', streakDay5: 'วัน', continueReading: 'อ่านต่อ', surahPrefix: 'ซูเราะห์', searchSurahDesc: 'ค้นหาซูเราะห์ (หมายเลขหรือชื่อ)'
  },
  vi: {
    prayers: 'Cầu nguyện', quran: 'Kinh Quran', settings: 'Cài đặt', searchLocation: 'Tìm kiếm Vị trí', enterCity: 'Nhập tên thành phố...', nothingFound: 'Không tìm thấy gì', darkTheme: 'Chủ đề Tối', enableDarkTheme: 'Bật chế độ tối', appLanguage: 'Ngôn ngữ Ứng dụng', autoSelected: 'Tự động chọn', manualSelected: 'Chọn thủ công', untilNextPrayer: 'Cho đến giờ cầu nguyện tiếp theo', timeLeft: 'Thời gian còn lại', chooseCity: 'Chọn Thành phố', streakDays: 'Số ngày liên tiếp', searchSurah: 'Tìm kiếm surah...', ayahs: 'Câu (Ayah):', h: 'g', m: 'p', Fajr: 'Fajr', Sunrise: 'Bình minh', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha', loadingError: 'Không tải được giờ cầu nguyện', resetAuto: 'Tự động (Hệ thống)', loading: 'Đang tải...', chooseLang: 'Chọn Ngôn ngữ', streakTitle: 'Ngọn lửa Niềm tin', streakDay1: 'Ngày', streakDay2: 'Ngày', streakDay5: 'Ngày', continueReading: 'Tiếp tục đọc', surahPrefix: 'Surah', searchSurahDesc: 'Tìm kiếm surah (số hoặc tên)'
  },
  fa: {
    prayers: 'نماز', quran: 'قرآن', settings: 'تنظیمات', searchLocation: 'جستجوی مکان', enterCity: 'نام شهر را وارد کنید...', nothingFound: 'چیزی یافت نشد', darkTheme: 'تم تاریک', enableDarkTheme: 'فعال‌سازی حالت تاریک', appLanguage: 'زبان برنامه', autoSelected: 'انتخاب خودکار', manualSelected: 'انتخاب دستی', untilNextPrayer: 'تا نماز بعدی', timeLeft: 'زمان باقی‌مانده', chooseCity: 'انتخاب شهر', streakDays: 'روزهای متوالی', searchSurah: 'جستجوی سوره...', ayahs: 'آیات:', h: 'س', m: 'د', Fajr: 'صبح', Sunrise: 'طلوع', Dhuhr: 'ظهر', Asr: 'عصر', Maghrib: 'مغرب', Isha: 'عشاء', loadingError: 'بارگذاری اوقات شرعی با شکست مواجه شد', resetAuto: 'خودکار (سیستم)', loading: 'در حال بارگذاری...', chooseLang: 'انتخاب زبان', streakTitle: 'شعله ایمان', streakDay1: 'روز', streakDay2: 'روز', streakDay5: 'روز', continueReading: 'ادامه خواندن', surahPrefix: 'سوره', searchSurahDesc: 'جستجوی سوره (شماره یا نام)'
  },
  uk: {
    prayers: 'Намаз', quran: 'Коран', settings: 'Налаштування', searchLocation: 'Пошук локації', enterCity: 'Введіть назву міста...', nothingFound: 'Нічого не знайдено', darkTheme: 'Темна тема', enableDarkTheme: 'Увімкнути темне оформлення', appLanguage: 'Мова додатку', autoSelected: 'Обрано автоматично', manualSelected: 'Обрано вручну', untilNextPrayer: 'До наступного намазу', timeLeft: 'Залишилось', chooseCity: 'Обрати місто', streakDays: 'Днів поспіль', searchSurah: 'Пошук сури...', ayahs: 'Аятів:', h: 'г', m: 'хв', Fajr: 'Фаджр', Sunrise: 'Схід', Dhuhr: 'Зухр', Asr: 'Аср', Maghrib: 'Магріб', Isha: 'Іша', loadingError: 'Не вдалося завантажити час намазу', resetAuto: 'Автоматично (Система)', loading: 'Завантаження...', chooseLang: 'Оберіть мову', streakTitle: 'Вогник віри', streakDay1: 'День', streakDay2: 'Дні', streakDay5: 'Днів', continueReading: 'Продовжити читання', surahPrefix: 'Сура', searchSurahDesc: 'Пошук сури (номер або назва)'
  }
};

const output = `export type LangType = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar' | 'pt' | 'it' | 'tr' | 'ko' | 'hi' | 'nl' | 'pl' | 'id' | 'th' | 'vi' | 'fa' | 'uk';

export const LANGUAGES: LangType[] = ['en', 'ru', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'pt', 'it', 'tr', 'ko', 'hi', 'nl', 'pl', 'id', 'th', 'vi', 'fa', 'uk'];

export const I18N = ${JSON.stringify(translations, null, 2)};
`;

fs.writeFileSync('src/i18n.ts', output);
console.log('src/i18n.ts created successfully!');
