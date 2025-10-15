(function(){
/* ========= Görseller ========= */
const CARD_BACK_IMAGE_URL = "https://steve-p.org/cards/pix/RWSa-X-BA.png";

/* 78 kartın ön yüz linkleri */
const CARD_IMAGES = {
  "The Fool":"https://steve-p.org/cards/pix/RWSa-T-00.png",
  "The Magician":"https://steve-p.org/cards/pix/RWSa-T-01.png",
  "The High Priestess":"https://steve-p.org/cards/pix/RWSa-T-02.png",
  "The Empress":"https://steve-p.org/cards/pix/RWSa-T-03.png",
  "The Emperor":"https://steve-p.org/cards/pix/RWSa-T-04.png",
  "The Hierophant":"https://steve-p.org/cards/pix/RWSa-T-05.png",
  "The Lovers":"https://steve-p.org/cards/pix/RWSa-T-06.png",
  "The Chariot":"https://steve-p.org/cards/pix/RWSa-T-07.png",
  "Strength":"https://steve-p.org/cards/pix/RWSa-T-08.png",
  "The Hermit":"https://steve-p.org/cards/pix/RWSa-T-09.png",
  "Wheel of Fortune":"https://steve-p.org/cards/pix/RWSa-T-10.png",
  "Justice":"https://steve-p.org/cards/pix/RWSa-T-11.png",
  "The Hanged Man":"https://steve-p.org/cards/pix/RWSa-T-12.png",
  "Death":"https://steve-p.org/cards/pix/RWSa-T-13.png",
  "Temperance":"https://steve-p.org/cards/pix/RWSa-T-14.png",
  "The Devil":"https://steve-p.org/cards/pix/RWSa-T-15.png",
  "The Tower":"https://steve-p.org/cards/pix/RWSa-T-16.png",
  "The Star":"https://steve-p.org/cards/pix/RWSa-T-17.png",
  "The Moon":"https://steve-p.org/cards/pix/RWSa-T-18.png",
  "The Sun":"https://steve-p.org/cards/pix/RWSa-T-19.png",
  "Judgement":"https://steve-p.org/cards/pix/RWSa-T-20.png",
  "The World":"https://steve-p.org/cards/pix/RWSa-T-21.png",
  "Ace of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-0A.webp",
  "Two of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-02.webp",
  "Three of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-03.webp",
  "Four of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-04.webp",
  "Five of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-05.webp",
  "Six of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-06.webp",
  "Seven of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-07.webp",
  "Eight of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-08.webp",
  "Nine of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-09.webp",
  "Ten of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-10.webp",
  "Page of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-J1.webp",
  "Knight of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-J2.webp",
  "Queen of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-QU.webp",
  "King of Wands":"https://steve-p.org/cards/small/sm_RWSa-W-KI.webp",
  "Ace of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-0A.webp",
  "Two of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-02.webp",
  "Three of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-03.webp",
  "Four of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-04.webp",
  "Five of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-05.webp",
  "Six of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-06.webp",
  "Seven of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-07.webp",
  "Eight of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-08.webp",
  "Nine of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-09.webp",
  "Ten of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-10.webp",
  "Page of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-J1.webp",
  "Knight of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-J2.webp",
  "Queen of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-QU.webp",
  "King of Cups":"https://steve-p.org/cards/small/sm_RWSa-C-KI.webp",
  "Ace of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-0A.webp",
  "Two of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-02.webp",
  "Three of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-03.webp",
  "Four of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-04.webp",
  "Five of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-05.webp",
  "Six of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-06.webp",
  "Seven of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-07.webp",
  "Eight of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-08.webp",
  "Nine of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-09.webp",
  "Ten of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-10.webp",
  "Page of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-J1.webp",
  "Knight of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-J2.webp",
  "Queen of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-QU.webp",
  "King of Swords":"https://steve-p.org/cards/small/sm_RWSa-S-KI.webp",
  "Ace of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-0A.png",
  "Two of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-02.png",
  "Three of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-03.png",
  "Four of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-04.png",
  "Five of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-05.png",
  "Six of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-06.png",
  "Seven of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-07.png",
  "Eight of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-08.png",
  "Nine of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-09.png",
  "Ten of Pentacles":"https://steve-p.org/cards/pix/RWSa-P-10.png",
  "Page of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-J1.webp",
  "Knight of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-J2.webp",
  "Queen of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-QU.webp",
  "King of Pentacles":"https://steve-p.org/cards/small/sm_RWSa-P-KI.webp"
};

/* ========= Tarot veri ========= */
const MAJOR = [
  'The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant',
  'The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man',
  'Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgement','The World'
];
const SUITS = ['Wands','Cups','Swords','Pentacles'];
const RANKS = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];
const MINOR = SUITS.flatMap(suit => RANKS.map(rank => `${rank} of ${suit}`));
const ALL_CARDS = [...MAJOR, ...MINOR].map((name,idx)=>({id:idx,name}));

/* ========= Yorum uzunluğu hedefleri ========= */
function lengthTargets(label){
  const l=(label||'Orta').toLowerCase();
  if(l.includes('kısa')) return [10,12];
  if(l.includes('uzun')) return [20,22];
  return [15,17]; // Orta
}

/* ========= Evet/Hayır (Tek kart) ========= */
const YESNO = { "The Sun":"yes","The Lovers":"yes","The World":"yes","The Tower":"no","Death":"no","The Devil":"no" };
const SUIT_YESNO = { Wands:"yes", Cups:"maybe", Swords:"no", Pentacles:"yes" };
function suitOf(n){ return SUITS.find(s=>n.includes(` of ${s}`)); }
function defaultYesNo(n){ const s=suitOf(n); return SUIT_YESNO[s]||"maybe"; }
function yesNoSentence(cardName){
  const v=(YESNO[cardName]||defaultYesNo(cardName));
  if(v==="yes")return "Enerji net biçimde ‘evet’ yönünde; niyetin açık, adımların tutarlı olursa kapılar açılıyor.";
  if(v==="no")return "Zamanlama uygun görünmüyor; koşulları sadeleştirip sınırlarını koruman gerekiyor.";
  return "Şu an cevap belirsiz; kriterleri netleştirirsen tablo lehine dönüşebilir.";
}

/* ========= Majör Arkana – kategoriye özel çekirdekler =========
   Her biri 1–2 cümlelik modern çekirdek; üzerine bankalarla genişleyecek. */
const MAJOR_BASE = {
  "The Fool": {
    "Genel": "The Fool taze sayfa ve cesur denemeler çağırır. Akışa güven, esnek kal ve ufak risklerle ufkunu genişlet.",
    "Aşk": "Aşkta spontane başlangıçlar ve masum bir heyecan vurgusu var. Kalbinin merakına alan aç, ama sınırlarını da unutma.",
    "Kariyer/Para": "Kariyerde yeni yol, staj/yan proje ya da sektör değişimi tetiklenebilir. Deneyim topla, öğrenme hızını yüksek tut."
  },
  "The Magician": {
    "Genel": "The Magician odak, niyet ve beceriyi tek potada eritir. Ne istiyorsan netleştir ve kaynaklarını akıllıca hizala.",
    "Aşk": "Sözlerin ve yaklaşımın büyü gibi etki edecek. Net iletişim ve bilinçli jestler romantik alanı canlandırır.",
    "Kariyer/Para": "Araçlar elinde, yetenek setin yeterli. Sunum, pazarlık ve görünürlük kariyer ivmeni belirler."
  },
  "The High Priestess": {
    "Genel": "Görünenin ardında bir katman daha var. Sezgine güven, aceleyi bırak ve iç bilgeliğinle hizalan.",
    "Aşk": "Duyguların dip akıntısını dinle; söylemediklerin de ilişkiyi şekillendiriyor. Zamanla derin bağ netleşir.",
    "Kariyer/Para": "Bilgi saklı; veri topla, gözlem yap. Stratejiyi sakinlik ve mahremiyetle kur."
  },
  "The Empress": {
    "Genel": "Bereket, yaratıcılık ve rahat akış. Değer üret, besle ve büyüt; süreç kendiliğinden genişler.",
    "Aşk": "Şefkat, dokunsallık ve güvenli bağ teması güçleniyor. İlişkiyi besleyen küçük ritüeller mucizeler yaratır.",
    "Kariyer/Para": "Projeler meyve verebilir. Değer üretimine ve kullanıcı deneyimine odaklan; karşılığı gelecektir."
  },
  "The Emperor": {
    "Genel": "Sınırlar, yapı ve kararlılık zamanı. Kural koy, netleş ve uzun vadeli çerçeve kur.",
    "Aşk": "İlişkide sağlam çerçeveler ve karşılıklı saygı yükselir. Güven, tutarlılık ve plan birlikte yürür.",
    "Kariyer/Para": "Otorite, süreç ve sistem. Prosedür kurmak ve liderlik etmek kazandırır."
  },
  "The Hierophant": {
    "Genel": "Gelenek, rehberlik ve uygun ritüeller. Öğren, mentorluk al ya da aktar; köklenme iyi gelir.",
    "Aşk": "İlişkide değerler ve aile/çevre onayı gündem olabilir. Ortak inanç ve standartlar uyumu büyütür.",
    "Kariyer/Para": "Kurumsal yapı ve etik çizgi önemli. Doğru rehberle ilerlemek hız kazandırır."
  },
  "The Lovers": {
    "Genel": "Seçim ve uyum. Kalp ile aklı uyumlamak, bütünsel bir karar vermek demektir.",
    "Aşk": "Çekim güçlü; açık iletişim ve karşılıklılık bağınızı derinleştirir.",
    "Kariyer/Para": "Ortaklık ve birliktelik senaryoları öne çıkar. Değer uyumu olan işbirlikleri ivme katar."
  },
  "The Chariot": {
    "Genel": "İrade, yön ve hız. Duyguyu dizginleyip odağı korursan hedefe kilitlenirsin.",
    "Aşk": "Sınırlar netleşince ilerleme hızlanır. Birlikte aynı yöne bakmak ilişkide ivme yaratır.",
    "Kariyer/Para": "Stratejik hız ve disiplin. Yol haritan netse başarı peşinden gelir."
  },
  "Strength": {
    "Genel": "Yumuşak güç, sabır ve öz-şefkat. Zoru nazikçe tutan el her kapıyı açar.",
    "Aşk": "Empati ve sakin güç ilişkide güven inşa eder. Acele etmeden derinleş.",
    "Kariyer/Para": "Dayanıklılık ve karakter. Zor dosyalar nazik direnişle çözülür."
  },
  "The Hermit": {
    "Genel": "İçe dönüş ve rafine farkındalık. Gürültüyü kıs; öz yolda ışığı bul.",
    "Aşk": "Kısa bir içe çekilme, duyguların özüne inmeyi sağlar. Derinlik yüzeyselliği dağıtır.",
    "Kariyer/Para": "Odaklı yalnız çalışma verim getirir. Analiz, sentez ve sadeleşme şart."
  },
  "Wheel of Fortune": {
    "Genel": "Döngüler hızla değişiyor. Şansı yakalamak için esnek ve uyanık ol.",
    "Aşk": "Beklenmedik karşılaşmalar ve dönüm noktaları. Zamanlama kritik.",
    "Kariyer/Para": "Piyasa/kurum rüzgârı değişebilir. Adaptasyon kabiliyeti kazandırır."
  },
  "Justice": {
    "Genel": "Denge, hak ve sorumluluk. Nesnel bakışla net bir karar verme zamanı.",
    "Aşk": "Dürüstlük, sınırlar ve karşılıklılık. Adil paylaşım bağı güçlendirir.",
    "Kariyer/Para": "Sözleşme, hukuk ve prosedür. Şeffaflıkla ilerlemek güven getirir."
  },
  "The Hanged Man": {
    "Genel": "Durup farklı yerden bakma; perspektif değişince düğüm çözülür.",
    "Aşk": "Bekleme, kabulleniş ve yeni bakış açısı ilişkide şifa olabilir.",
    "Kariyer/Para": "Planı askıya alıp yeniden çerçevelemek gerekir. Sabır terazidir."
  },
  "Death": {
    "Genel": "Bitmesi gereken biter; boşalan yerde gerçek yenilik filizlenir.",
    "Aşk": "Eski kalıpları bırakınca bağ nefes alır. Dönüşümle taze alan açılır.",
    "Kariyer/Para": "Kapanışlar, birleşmeler ya da rol değişimi. Eskiyi bırakmak güce dönüşür."
  },
  "Temperance": {
    "Genel": "Ayarlama, denge ve uyum. Azar azar ama sürekli; ritim tuttur.",
    "Aşk": "Ilımlı yaklaşım güven verir. Uçları birleştiren sabırdır.",
    "Kariyer/Para": "Kaynakları kararlı biçimde harmanla. Sürdürülebilir tempo başarıyı getirir."
  },
  "The Devil": {
    "Genel": "Aşırı bağlar, bağımlı döngüler ve sahte konfor alanı. Fark et, çöz, özgürleş.",
    "Aşk": "Takıntı/çekim dengesini kur. Sınır ihlallerini görünür kıl.",
    "Kariyer/Para": "Kısa vadeli kazanım için uzun vadeyi yakma. Etik çizgi hayat kurtarır."
  },
  "The Tower": {
    "Genel": "Beklenmedik kırılma; sahte yapılar yıkılır, gerçek görünür.",
    "Aşk": "Sarsıcı farkındalık sonrası daha dürüst bir zemin mümkün.",
    "Kariyer/Para": "Risk yönetimi şart. Eski sistem çökebilir; çevik ol."
  },
  "The Star": {
    "Genel": "Arınma, umut ve yumuşak yenilenme. İç huzuru rehber al.",
    "Aşk": "Nazik yakınlık, açık yürek ve şefkatli diyalog. Bağ kendini onarır.",
    "Kariyer/Para": "Uzun vadeli vizyon ve itibar parlıyor. Yavaş ama sağlam ivme."
  },
  "The Moon": {
    "Genel": "Belirsizlik ve iç sezgi. Sis dağılana kadar acele yok.",
    "Aşk": "Duygusal dalgalar var; ismini koymak için zaman tanı.",
    "Kariyer/Para": "Veri eksik; varsayımla değil test ederek ilerle."
  },
  "The Sun": {
    "Genel": "Açıklık, canlılık ve net başarı. Sahne senin; parlamaktan çekinme.",
    "Aşk": "Neşe, oyun ve sıcaklık. Bağda şeffaf mutluluk teması.",
    "Kariyer/Para": "Görünürlük artıyor; sonuçlar netleşiyor. Başarı paylaşılmalı."
  },
  "Judgement": {
    "Genel": "Uyanış ve çağrı. İç sesin yeni bir seviyeye çağırıyor.",
    "Aşk": "Geçmişten gelen konular kapanış istiyor. Affediş iyileştirir.",
    "Kariyer/Para": "Kariyer kararlarını yeniden değerlendir; misyon odaklı hizalan."
  },
  "The World": {
    "Genel": "Tamamlama ve entegrasyon. Döngü kapanır; yeni kapı açılır.",
    "Aşk": "Olgunlaşmış bağ ve ortak ufuk. Birlikte büyük resmi görüyorsunuz.",
    "Kariyer/Para": "Proje/evre başarıyla tamam. Ölçeklemek için hazır görünüyorsun."
  }
};

/* ========= Minör Arkana – suit & rank temaları ========= */
const SUIT_THEMES = {
  "Wands": {
    Genel: "Eylem, motivasyon ve girişim enerjisini ön plana çıkarır.",
    Aşk: "Kıvılcım, çekim ve hareket; tutku dengeli olmalı.",
    "Kariyer/Para": "Girişimcilik, hızlı iterasyon ve görünürlük; enerji doğru kanala akmalı."
  },
  "Cups": {
    Genel: "Duygu, sezgi ve bağ temaları yüzeye çıkar.",
    Aşk: "Şefkat, yakınlık ve duygusal akış; kalp dili ön planda.",
    "Kariyer/Para": "Ekip uyumu, empati ve kullanıcı deneyimi; duyarlı yaklaşım kazandırır."
  },
  "Swords": {
    Genel: "Zihin, netlik ve sınır; analiz ile ilerle.",
    Aşk: "İletişim ve gerçekleri konuşma ihtiyacı; sınırlar saygı ister.",
    "Kariyer/Para": "Strateji, karar ve problem çözme; veriye sadık kal."
  },
  "Pentacles": {
    Genel: "Somutlaştırma, emek ve istikrar; küçük adım büyük etki.",
    Aşk: "Güven, süreklilik ve bakım; ilişkiyi besleyen rutinler.",
    "Kariyer/Para": "Kaynak yönetimi, kalite ve sürdürülebilir performans."
  }
};

const RANK_THEMES = {
  "Ace": {
    Genel: "Saf başlangıç ve yoğun potansiyel; ilk adım kutsal.",
    Aşk: "Taze duygu ve açık yüreklilik; kıvılcım yeni.",
    "Kariyer/Para": "Yeni fırsat, tohum ekimi ve fikir doğuşu."
  },
  "Two": {
    Genel: "İkilikte denge, seçim ve hizalanma ihtiyacı.",
    Aşk: "Karşılıklılık, ortak niyet ve uyum arayışı.",
    "Kariyer/Para": "Planlama, ortaklık ve seçenekleri tartma."
  },
  "Three": {
    Genel: "Genişleme, iş birliği ve ilk sonuçların görülmesi.",
    Aşk: "Sosyallik, destek ve paylaşılan heyecan.",
    "Kariyer/Para": "Projede ölçeklenme ve ufka bakış."
  },
  "Four": {
    Genel: "Stabilite, temel ve güvenli alanın güçlenmesi.",
    Aşk: "Güvenli bağ, yuva hissi ve tatlı ritüeller.",
    "Kariyer/Para": "Süreç oturtma ve verimli çerçeve."
  },
  "Five": {
    Genel: "Sürtünme, eksilme ya da çatışma; ayar şart.",
    Aşk: "Yanlış anlaşılmalar; şefkatli diyalogla onar.",
    "Kariyer/Para": "Kaynak/ekip baskısı; riskleri dağıt."
  },
  "Six": {
    Genel: "Akış, destek ve iyileştirici hareket.",
    Aşk: "Nazik alışveriş ve tatlı jestler yakınlaştırır.",
    "Kariyer/Para": "Paylaşım ve kazan-kazan dengeyi kurar."
  },
  "Seven": {
    Genel: "Değerlendirme, sabır ve stratejik bekleme.",
    Aşk: "Neyi neden istediğini netleştirme dönemi.",
    "Kariyer/Para": "Verimi ölç, süreci iyileştir, sabırlı ol."
  },
  "Eight": {
    Genel: "Ustalığa giden ritim; derinleşme ve disiplin.",
    Aşk: "Emek, dikkat ve kaliteli zaman bağ kurar.",
    "Kariyer/Para": "Odaklı çalışma; beceriyi parlat."
  },
  "Nine": {
    Genel: "Dayanıklılık, sınır koruma ve kazanıma yaklaşma.",
    Aşk: "Yorgunlukta bile bağın kıymetini bilmek.",
    "Kariyer/Para": "Seçici enerji kullanımı; tükenmeyi önle."
  },
  "Ten": {
    Genel: "Döngü kapanışı; yükün bırakılması ya da tamamlanma.",
    Aşk: "Emeklerin meyvesi ve ortak çatı hissi.",
    "Kariyer/Para": "Sonuç alma, teslim ve ödül/öğrenme."
  },
  "Page": {
    Genel: "Öğrencilik zihni, merak ve mesajlar.",
    Aşk: "Tatlı başlangıç ve saf iletişim; küçük haberler.",
    "Kariyer/Para": "Yeni beceriye adım; staj/deneme alanı."
  },
  "Knight": {
    Genel: "Hareket, cesaret ve amaç doğrultusunda ivme.",
    Aşk: "Atak yaklaşım; kıvılcımı canlı tut.",
    "Kariyer/Para": "Sahada görünür ol; tempo ve takip."
  },
  "Queen": {
    Genel: "Olgun enerji, şefkat ve çekirdekten yönetim.",
    Aşk: "Kucaklayıcı diyalog; duygusal zekâ yükselir.",
    "Kariyer/Para": "Kalite standardı ve görünmez liderlik."
  },
  "King": {
    Genel: "Usta seviye; stratejik yönetim ve otorite.",
    Aşk: "Tutarlılık, koruyucu yaklaşım ve netlik.",
    "Kariyer/Para": "Büyük resim, temsil ve karar gücü."
  }
};

/* ========= Kategoriye göre modern cümle bankaları ========= */
const BANK_COMMON = {
  Genel: [
    "Şu an küçük ama tutarlı adımlar büyük fark yaratır.",
    "Kendi ritmini sürdürdükçe dış gürültü anlamını yitirir.",
    "Sınırlarını ihlal eden alışkanlıkları nazikçe söndür.",
    "Odaklandığın yerde enerji büyür; seçimini bilinçle yap.",
    "Kendini karşılaştırmak yerine ilerlemeni ölç.",
    "Görünenden fazlası var; acele etmeden katmanları aç.",
    "Mükemmel anı beklemek yerine yeterince iyiyle başla.",
    "Sadelik, karmaşık çözümlerden daha çeviktir.",
    "Şefkatli disiplin sürdürülebilir ivme yaratır.",
    "Küçük kazanımları kutlamak motivasyonu kalıcı kılar.",
    "Eski kalıpları güncelle; yeni halin yeni kurallar ister.",
    "Sezgini veriyle konuştur; içgörü pratikle güçlenir.",
    "Güvende hissettiğin alanı genişletmek mümkün.",
    "Hayır demek de bir bakım biçimidir.",
    "Zamanını neye verdiğin karakterini şekillendirir.",
    "Öncelik listeni üç maddeyle sınırla ve uygula.",
    "Duygularını isimlendirmek netlik sağlar."
  ],
  Aşk: [
    "İletişimi açık ve yumuşak tut; savunmadan meraka geç.",
    "Küçük jestler bağın sıcaklığını hızla yükseltir.",
    "Sınırlar ve ihtiyaçlar şefkatle konuşulmalı.",
    "Birlikte kurulan ritüeller ilişkiyi besler.",
    "Duyguların gelgitine panik değil merakla yaklaş.",
    "Kıyas yerine özgün bağınıza odaklanın.",
    "Romantizm bir sonuç değil, emek isteyen bir süreçtir.",
    "Beden dilini ve sessiz mesajları da dinle.",
    "Güven, tutarlılıkla büyür; söz ve davranış hizalanmalı.",
    "Paylaşılan hayaller, günlük küçük adımlarla gerçek olur.",
    "Geçmiş kalıpları fark etmek özgürleştirir.",
    "Birlikte gülmek, zor konuları da yumuşatır.",
    "Kırılganlık güçsüzlük değil; yakınlık köprüsüdür.",
    "Zamanlamayı aceleye getirmeden deneyimleyin.",
    "Kalbin ritmine saygı duymak bağa alan açar.",
    "Sevgi, seçtiğin davranışlarda görünür."
  ],
  "Kariyer/Para": [
    "Stratejini 90 gün için sadeleştir; ölç, öğren, ayarla.",
    "Görünürlük ve kalite birlikte yürürse ivme kalıcı olur.",
    "Veri, sezgiye yön verir; ikisini de kullan.",
    "Takviminde odak blokları oluştur; çoklu görev dağıtır.",
    "İtibarın, sözlerin ve teslim ettiklerinle inşa olur.",
    "Riskleri küçük parçalara bölmek yönetilebilir kılar.",
    "Mentorluk almak verimini katlar.",
    "Süreç haritası, telaşı anlamlı hıza çevirir.",
    "Pazarlıkta değer önerini somutlaştır.",
    "Geri bildirim yakıtındır; düzenli ve dürüst al.",
    "Bütçede esnek pay bırak; sürprizler yönetilebilir olur.",
    "Yaptıklarını belgelemek görünmez emeği görünür kılar.",
    "Yetkinliklerini vitrine çıkar; fırsatlar seni bulur.",
    "Ekiple anlaşılmış ritim, yükleri adil dağıtır.",
    "Odaklandığın iki hedef seç ve derinleş."
  ]
};

/* ========= Majör/MİNÖR lezzet cümleleri ========= */
const BANK_FLAVORS = {
  Major: [
    "Büyük resim netleştikçe küçük detaylar yerini bulur.",
    "Hayat sahnesinde yeni perde açılıyor.",
    "Bu arketip içsel pusulanı kalibre ediyor.",
    "Ders tamamlandıkça hafifliyorsun."
  ],
  Wands: [
    "Kıvılcımı koru ama yakmayacak şekilde yönlendir.",
    "Enerjini tek kanala toplayınca hız kazanacaksın.",
    "Cesaretin planla birleştiğinde fark yaratır."
  ],
  Cups: [
    "Duyguların ritmi pusulan; dalga geçince panikleme.",
    "Empati alanı açtıkça bağlar kendini onarır.",
    "Kalp diliyle kurulan cümleler sihir taşır."
  ],
  Swords: [
    "Netlik rahatlatır; kelimelerin mimari kurar.",
    "Zihni sadeleştirdikçe karar gücün artar.",
    "Gerçekler konuşulduğunda güvensizlik erir."
  ],
  Pentacles: [
    "Kalite tekrarla doğar; ritmine sadık kal.",
    "Topraklanınca fikir maddeye dönüşür.",
    "Küçük iyileştirmeler toplamda büyük etki eder."
  ]
};

/* ========= Kart adından suit/rank yakalama ========= */
function parseMinor(name){
  for(const s of SUITS){
    const of = ` of ${s}`;
    if(name.endsWith(of)){
      const rank = name.slice(0, name.length - of.length);
      return {suit:s, rank};
    }
  }
  return null;
}

/* ========= Kart bazlı “çekirdek” paragraf üretimi ========= */
function coreSentences(cardName, category){
  // Majörse: doğrudan MAJOR_BASE kullan
  if(MAJOR.includes(cardName)){
    const base = MAJOR_BASE[cardName]?.[category] || MAJOR_BASE[cardName]?.["Genel"] || "";
    return splitToSentences(base);
  }
  // Minörse: suit + rank temalarını harmanla
  const mr = parseMinor(cardName);
  if(!mr) return [];
  const suitPart = SUIT_THEMES[mr.suit]?.[category] || SUIT_THEMES[mr.suit]?.Genel || "";
  const rankPart = RANK_THEMES[mr.rank]?.[category] || RANK_THEMES[mr.rank]?.Genel || "";
  const joiner = " Bu kart, durumu pratik adımlarla ileri taşıman için nazik ama net bir çağrı yapıyor.";
  return splitToSentences(`${rankPart} ${suitPart}${joiner}`);
}

/* ========= Cümle yardımcıları ========= */
function splitToSentences(text){
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s=>s.trim())
    .filter(Boolean);
}

function pickFrom(arr, n){
  const a=[...arr]; const out=[];
  for(let i=0;i<n && a.length;i++){
    const j = Math.floor(Math.random()*a.length);
    out.push(a.splice(j,1)[0]);
  }
  return out;
}

/* ========= Uzunluğa göre yorum üretimi ========= */
function buildMeaning(cardName, category, lengthLabel, includeYesNo=false){
  const [minS,maxS] = lengthTargets(lengthLabel);
  const target = Math.floor(Math.random()*(maxS-minS+1))+minS;

  const sentences = [];
  // 1) çekirdek
  sentences.push(...coreSentences(cardName, category));

  // 2) kategori bankası
  const bankCat = BANK_COMMON[category] || BANK_COMMON["Genel"];
  // 3) flavor – majör ya da suit
  let flavor = [];
  if(MAJOR.includes(cardName)){
    flavor = BANK_FLAVORS.Major;
  }else{
    const mr = parseMinor(cardName);
    if(mr) flavor = BANK_FLAVORS[mr.suit] || [];
  }

  // 4) karışım: kategori bankasından 6–9, flavor’dan 2–3 cümle çek
  sentences.push(...pickFrom(bankCat, 8));
  sentences.push(...pickFrom(flavor, 3));

  // 5) Tek kartta evet/hayır notu
  if(includeYesNo){
    sentences.push(yesNoSentence(cardName));
  }

  // 6) tekrarları temizle, kısalık/uzunluk ve akış için hafif düzen
  const seen = new Set();
  const unique = [];
  for(const s of sentences){
    const key = s.toLowerCase();
    if(!seen.has(key)){ unique.push(s); seen.add(key); }
  }

  // Çekirdek ilk, sonra karışım, hedefe kadar kısalt
  const out = unique.slice(0, Math.max(target, 3));

  // Ufak kapanış cümlesi (ton yumuşatma)
  const closers = {
    Genel: "Kendine nazik, seçimlerine tutarlı ol; yol kendini açacak.",
    Aşk: "Şefkatli iletişim ve küçük jestler bağınızı büyütür.",
    "Kariyer/Para": "Kalite ve görünürlük birlikteliği seni ileri taşıyacak."
  };
  if(out.length < target) out.push(closers[category] || closers.Genel);
  while(out.length < target){
    // Bankadan tekrar olmayan birkaç cümle daha dene
    const pool = [...bankCat, ...flavor];
    const tryPick = pickFrom(pool, 1)[0] || "Ritmine sadık kal; akış seni destekliyor.";
    if(!out.includes(tryPick)) out.push(tryPick);
  }

  return out.join(" ");
}

/* ========= Pozisyonlar ========= */
const positions = {
  three: ['Geçmiş','Şimdi','Gelecek'],
  five: ['Geçmiş','Şimdi','Gizli Etkiler','Engeller/Zorluklar','Gelecek'],
  cross: ['Şimdiki Durum','Engeller/Zorluklar','Bilinçli Farkındalık','Bilinçaltı/Temel','Geçmiş','Gelecek','Sen','Karşı Taraf','Umutlar/Korkular','Sonuç'],
  relationship: ['Senin Duyguların','Onun Duyguları','Senin Düşüncelerin','Onun Düşünceleri','Aranızdaki Bağ','Engeller/Sorunlar','Gelecek Olası Sonuç']
};

/* ========= State ========= */
const state = {
  name:"", mode:null, category:null, commentLengthLabel:"Orta",
  yesnoQuestion:"",
  decksMeta:null, chosenDeckIndex:null,
  needSelect:0, selectedCards:[]
};

/* ========= Render ========= */
const root = document.getElementById('tarot-app');
render();

function render(){
  if(state.selectedCards.length && state.selectedCards.length===state.needSelect){ return renderFinal(); }

  root.innerHTML = `
    <h2>🔮 Online Tarot</h2>
    <div class="muted">İsmini, açılımı ve <b>yorum boyutunu</b> seç. Tek Kart’ta evet/hayır sorunu yaz.</div>

    <div class="section">
      <div class="row row-2">
        <div>
          <label class="muted">İsmin</label>
          <input id="inp-name" type="text" placeholder="İsmini yaz" value="${escapeHtml(state.name)}">
        </div>
        <div>
          <label class="muted">Açılım Türü</label>
          <select id="sel-mode">
            <option value="">Seçiniz...</option>
            <option value="one" ${state.mode==='one'?'selected':''}>Tek Kart</option>
            <option value="three" ${state.mode==='three'?'selected':''}>3 Kart</option>
            <option value="five" ${state.mode==='five'?'selected':''}>5 Kart</option>
            <option value="cross" ${state.mode==='cross'?'selected':''}>Haç Açılımı</option>
            <option value="relationship" ${state.mode==='relationship'?'selected':''}>İlişki Açılımı</option>
          </select>
        </div>
        <div>
          <label class="muted">Yorum Boyutu</label>
          <select id="sel-len">
            <option ${state.commentLengthLabel==='Kısa'?'selected':''}>Kısa</option>
            <option ${state.commentLengthLabel==='Orta'?'selected':''}>Orta</option>
            <option ${state.commentLengthLabel==='Uzun'?'selected':''}>Uzun</option>
          </select>
        </div>
      </div>
    </div>
  `;

  if(state.mode === 'one'){
    root.insertAdjacentHTML('beforeend', `
      <div class="section">
        <label class="muted">Evet / Hayır Sorun</label>
        <textarea id="inp-yn" placeholder="Örn: Bugünkü görüşmem olumlu geçer mi?">${escapeHtml(state.yesnoQuestion)}</textarea>
      </div>
    `);
  } else if(state.mode){
    root.insertAdjacentHTML('beforeend', `
      <div class="section">
        <label class="muted">Kategori</label>
        <select id="sel-cat">
          <option value="">Seçiniz…</option>
          <option value="Aşk" ${state.category==='Aşk'?'selected':''}>Aşk</option>
          <option value="Kariyer/Para" ${state.category==='Kariyer/Para'?'selected':''}>Kariyer/Para</option>
          <option value="Genel" ${state.category==='Genel'?'selected':''}>Genel</option>
          <option value="Genel Durum" ${state.category==='Genel Durum'?'selected':''}>Genel Durum</option>
        </select>
      </div>
    `);
  }

  root.insertAdjacentHTML('beforeend', `
    <div class="section">
      <button id="btn-decks" class="btn">Desteleri Oluştur</button>
      ${state.decksMeta ? '<span class="pill" style="margin-left:8px;">Hazır</span>':''}
      <div id="form-hint" class="muted" style="margin-top:8px;"></div>
    </div>
  `);

  if(state.decksMeta){
    if(state.chosenDeckIndex === null){
      const wrap = document.createElement('div'); 
      wrap.className='section';
      wrap.innerHTML = `<div class="decks" id="decks"></div>`;
      const decksEl = wrap.querySelector('#decks');

      state.decksMeta.decks.forEach((deck,i)=>{
        const stackImgs = Array.from({length:5}).map(()=>`<img src="${CARD_BACK_IMAGE_URL}" alt="Deck">`).join('');
        decksEl.insertAdjacentHTML('beforeend', `
          <button class="deck deck-btn" data-i="${i}" type="button" aria-label="Deste ${i+1}">
            <div class="deck-stack">${stackImgs}</div>
            <div class="deck-meta">
              <div class="deck-title">Deste ${i+1}</div>
              <div class="muted">${deck.length} kart</div>
            </div>
          </button>
        `);
      });

      decksEl.addEventListener('click', (e)=>{
        const btn = e.target.closest('.deck-btn');
        if(!btn) return;
        const i = parseInt(btn.dataset.i,10);
        state.chosenDeckIndex = i;
        state.needSelect = requiredCount(state.mode);
        state.selectedCards = [];
        render();
      });

      root.appendChild(wrap);
    }else{
      const deck = state.decksMeta.decks[state.chosenDeckIndex];
      const picked = state.selectedCards.length;
      const wrap = document.createElement('div'); wrap.className='section';
      wrap.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span class="pill">Deste ${state.chosenDeckIndex+1}</span>
          <span class="muted">Seçilecek: <b>${state.needSelect}</b> • Seçilen: <b>${picked}</b></span>
          <div style="flex:1"></div>
          <button id="btn-change-deck" class="btn" style="background:#555;color:#fff">Desteyi Değiştir</button>
        </div>
        <div class="cards" id="cards-grid"></div>
      `;
      root.appendChild(wrap);

      const grid = wrap.querySelector('#cards-grid');
      deck.forEach(cardId=>{
        const cardData = ALL_CARDS[cardId];
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
          <div class="card-inner">
            <div class="back"><img alt="back" src="${CARD_BACK_IMAGE_URL}"></div>
            <div class="face"><img alt="${escapeHtml(cardData.name)}" src="${CARD_IMAGES[cardData.name]||''}"></div>
          </div>
        `;
        el.addEventListener('click', ()=>{
          if(el.classList.contains('flipped')) return;
          if(state.selectedCards.length >= state.needSelect) return;
          el.classList.add('flipped');
          el.insertAdjacentHTML('beforeend', `<div class="sel-badge">#${state.selectedCards.length+1}</div>`);
          state.selectedCards.push({ id: cardId, name: cardData.name, img: CARD_IMAGES[cardData.name]||'' });
          if(state.selectedCards.length === state.needSelect){
            setTimeout(()=>render(), 600);
          }
        });
        grid.appendChild(el);
      });

      wrap.querySelector('#btn-change-deck').addEventListener('click', ()=>{
        state.chosenDeckIndex = null;
        state.selectedCards = [];
        render();
      });
    }
  }

  bindInputs();
}

/* ========= Final ekran ========= */
function renderFinal(){
  const lenLabel = state.commentLengthLabel || "Orta";
  // kategori alanı: “Genel Durum” seçildiyse “Genel”e normalize
  const category = (state.mode==='one') ? "Genel" : (state.category==="Genel Durum"?"Genel":state.category||"Genel");

  root.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
      <span class="pill">${escapeHtml(state.name)}</span>
      <span class="pill">${label(state.mode)}</span>
      ${state.mode!=='one' ? `<span class="pill">${escapeHtml(category)}</span>`:''}
      <span class="pill">${escapeHtml(lenLabel)}</span>
      <div style="flex:1"></div>
      <button id="btn-retry" class="btn dark">Yeniden Dene</button>
    </div>

    <div class="final-grid" id="final-grid"></div>
    <div class="reading"><h3>🧿 Yorum</h3><div id="reading-body"></div></div>
  `;

  const gallery = document.getElementById('final-grid');
  state.selectedCards.forEach((c,i)=>{
    gallery.insertAdjacentHTML('beforeend', `
      <div class="final-card">
        <div class="img"><img src="${c.img}" alt="${escapeHtml(c.name)}"></div>
        <div class="cap">#${i+1} • ${escapeHtml(c.name)}</div>
      </div>
    `);
  });

  const body = document.getElementById('reading-body');
  if(state.mode==='one'){
    const c = state.selectedCards[0];
    const txt = buildMeaning(c.name, "Genel", lenLabel, true);
    body.insertAdjacentHTML('beforeend', `
      <div class="meta">Soru: <b>${escapeHtml(state.yesnoQuestion||'—')}</b></div>
      <div class="item">${escapeHtml(txt)}</div>
    `);
  }else{
    const pos = positions[state.mode] || [];
    state.selectedCards.forEach((c,i)=>{
      const posLabel = pos[i]||('Kart '+(i+1));
      const txt = buildMeaning(c.name, category, lenLabel, false);
      body.insertAdjacentHTML('beforeend', `
        <div class="item">
          <div class="meta">${escapeHtml(posLabel)} • Kart: <b>${escapeHtml(c.name)}</b></div>
          ${escapeHtml(txt)}
        </div>
      `);
    });
  }

  document.getElementById('btn-retry').addEventListener('click', ()=>{ resetAll(); render(); });
}

/* ========= Inputs ========= */
function bindInputs(){
  const nameEl = document.getElementById('inp-name');
  const modeEl = document.getElementById('sel-mode');
  const lenEl  = document.getElementById('sel-len');
  const catEl  = document.getElementById('sel-cat');
  const ynEl   = document.getElementById('inp-yn');
  const decksBtn = document.getElementById('btn-decks');

  if(nameEl) nameEl.addEventListener('input', e=>{ state.name = e.target.value.trim(); });
  if(modeEl) modeEl.addEventListener('change', e=>{
    state.mode = e.target.value || null;
    state.category = null; state.decksMeta=null; state.chosenDeckIndex=null; state.selectedCards=[]; state.needSelect=0; state.yesnoQuestion='';
    render();
  });
  if(lenEl) lenEl.addEventListener('change', e=>{ state.commentLengthLabel = e.target.value; });
  if(catEl) catEl.addEventListener('change', e=>{ state.category = e.target.value || null; });
  if(ynEl) ynEl.addEventListener('input', e=>{ state.yesnoQuestion = e.target.value; });

  if(decksBtn) decksBtn.addEventListener('click', ()=>{
    const hint = document.getElementById('form-hint');
    const nameInput = document.getElementById('inp-name');
    const modeInput = document.getElementById('sel-mode');
    const catInput  = document.getElementById('sel-cat');

    clearError(nameInput); clearError(modeInput); if(catInput) clearError(catInput);
    hint.textContent = "";

    if(!state.name){ setError(nameInput); hint.textContent = "Lütfen ismini yaz."; nameInput?.focus(); return; }
    if(!state.mode){ setError(modeInput); hint.textContent = "Lütfen açılım türünü seç."; modeInput?.focus(); return; }
    if(state.mode!=='one' && !state.category){
      setError(catInput); hint.textContent = "Bu açılım için kategori (Aşk / Kariyer-Para / Genel) seçmelisin."; catInput?.focus(); return;
    }

    state.decksMeta = buildDecks(state.mode);
    state.chosenDeckIndex = null; state.selectedCards=[]; state.needSelect = requiredCount(state.mode);
    render();
  });

  function setError(el){ if(!el) return; el.classList.add('field-error'); el.scrollIntoView({behavior:'smooth', block:'center'}); }
  function clearError(el){ if(!el) return; el.classList.remove('field-error'); }
}

/* ========= Helpers ========= */
function buildDecks(mode){
  const shuffled = shuffle(ALL_CARDS.map(c=>c.id));
  let decksCount = 6, size = 13;
  if(mode==='cross'){ decksCount = 3; size = 26; }
  const decks = []; let i=0;
  for(let d=0; d<decksCount; d++){ decks.push(shuffled.slice(i, i+size)); i+=size; }
  return {count:decksCount, size, decks};
}
function requiredCount(m){ return m==='one'?1: m==='three'?3: m==='five'?5: m==='cross'?10: m==='relationship'?7:1; }
function label(m){ return m==='one'?'Tek Kart': m==='three'?'3 Kart': m==='five'?'5 Kart': m==='cross'?'Haç Açılımı':'İlişki Açılımı'; }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function escapeHtml(s=''){ return s.replace(/[&<>"']/g, ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch])); }
function resetAll(){ state.name=''; state.mode=null; state.category=null; state.commentLengthLabel='Orta'; state.yesnoQuestion=''; state.decksMeta=null; state.chosenDeckIndex=null; state.selectedCards=[]; state.needSelect=0; }

})();
