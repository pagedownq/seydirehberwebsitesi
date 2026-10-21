// Gizlilik Politikası, Kullanım Koşulları ve KVKK Aydınlatma Metni için tek kaynak.
// Web sayfaları (Policies, Privacy, KVKK) buradan render edilir; mobil uygulamadaki düz metin
// (seydirehber_expo/src/features/policies/content.ts) bu dosyadan üretilir — metin değişirse ikisi birlikte güncellenmeli.
// İçerik uygulamanın gerçekte yaptığına göre yazıldı (2026-10-21 kod incelemesi).

export interface PolicySection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  after?: string[];
}

export interface PolicyDocument {
  id: 'privacy' | 'terms' | 'kvkk';
  title: string;
  summary: string;
  intro: string[];
  sections: PolicySection[];
}

export const POLICY_UPDATED_AT = '21 Ekim 2026';
export const CONTACT_EMAIL = 'seydirehber@gmail.com';
export const CONTROLLER_NAME = 'Seydi Rehber (MGVerse Studio)';

export const PRIVACY_POLICY: PolicyDocument = {
  id: 'privacy',
  title: 'Gizlilik Politikası',
  summary: 'Hangi verileri neden işlediğimiz, kimlerle paylaştığımız ve verilerinizi nasıl silebileceğiniz.',
  intro: [
    `Bu politika, Seydi Rehber mobil uygulamasını (iOS ve Android), seydirehber.com.tr web sitesini ve işletmelere sunulan Esnaf Panelini kullandığınızda kişisel verilerinizin nasıl işlendiğini açıklar. Hizmeti ${CONTROLLER_NAME} sunar.`,
    'Verilerinizi reklam amacıyla kullanmıyor, hiçbir kişi veya kuruma satmıyoruz. Uygulamada reklam bulunmaz.',
  ],
  sections: [
    {
      heading: '1. İşlediğimiz veriler',
      bullets: [
        'Hesap bilgileri: Google veya Apple ile giriş yaptığınızda adınız, e-posta adresiniz, profil fotoğrafınızın bağlantısı ve size atanan kullanıcı kimliği (UID). Apple ile girişte e-postanızı gizlemeyi seçebilirsiniz. Misafir olarak kullandığınızda yalnızca anonim bir kullanıcı kimliği oluşturulur.',
        'Paylaştığınız içerikler: işletme ve yerler için yazdığınız yorumlar ve puanlar; forum gönderileri ve yanıtları; uygunsuz içerik için gönderdiğiniz şikayetler.',
        'Destek talepleri: destek formuna yazdığınız ad soyad, e-posta, telefon, konu ve mesaj. Talebiniz çözüldüğünde size bildirim gönderebilmek için cihazınızın bildirim anahtarı da talebe eklenir.',
        'Kupon kullanımı: hangi kupon için kod aldığınız, kodun geçerlilik süresi, kullanılıp kullanılmadığı ve kullanım zamanı.',
        'Bildirimler: cihazınıza özel bildirim anahtarı (FCM token), platform (iOS/Android) ve bildirim tercihleriniz.',
        'Kullanım bilgileri: uygulamayı en son açtığınız zaman, platform ve hesap türü (misafir/hesaplı). Ayrıca Google Firebase Analytics aracılığıyla görüntülenen ekranlar, uygulama içi etkileşimler, cihaz modeli, işletim sistemi sürümü, uygulama sürümü, kullanıcı kimliğiniz ve IP adresinden çıkarılan yaklaşık konum (ülke/şehir) toplanır.',
        'Konum: yalnızca izin verirseniz, harita ve mesafe gösterimi için cihazınızda kullanılır. Konumunuz sunucularımıza gönderilmez ve kaydedilmez.',
      ],
      after: [
        'Favorileriniz, arama geçmişiniz, engellediğiniz kullanıcılar ve uygulama ayarlarınız yalnızca cihazınızda saklanır; uygulamayı sildiğinizde bunlar da silinir.',
      ],
    },
    {
      heading: '2. Verileri hangi amaçlarla kullanıyoruz',
      bullets: [
        'Hesabınızı oluşturmak, giriş yapmanızı ve uygulamanın temel özelliklerini sunmak.',
        'Yorum, puan ve forum içeriklerinizi yayınlamak; işletme ortalama puanlarını hesaplamak.',
        'Kupon kodu üretmek ve işletmenin kodu doğrulayabilmesini sağlamak.',
        'Duyuru, nöbetçi eczane hatırlatması, vefat ilanı ve yorum yanıtı gibi bildirimleri göndermek.',
        'Destek taleplerinizi yanıtlamak.',
        'Kötüye kullanımı önlemek, şikayetleri incelemek ve topluluk kurallarını uygulamak.',
        'Toplu kullanım istatistikleriyle (aktif kullanıcı sayısı, sık kullanılan ekranlar vb.) uygulamayı geliştirmek.',
        'Google veya Apple ile ilk kez giriş yaptığınızda size bir hoş geldin e-postası göndermek.',
      ],
    },
    {
      heading: '3. Verileri kimler görebilir',
      bullets: [
        'Herkes: yorumlarınız ve puanlarınız adınız ve profil fotoğrafınızla birlikte; forum gönderileriniz ve yanıtlarınız adınızla birlikte uygulamadaki diğer kullanıcılara görünür. Forumda anonim paylaşırsanız adınız diğer kullanıcılara gösterilmez, ancak kötüye kullanımı önlemek için adınız kayıtlı kalır ve yöneticiler görebilir.',
        'İşletmeler: Esnaf Paneli üzerinden kendi işletmelerine yazılan yorumları görebilir ve yanıtlayabilir; kendi kuponlarına ait kodları doğrular. İşletmeler e-posta adresinizi veya iletişim bilgilerinizi görmez.',
        'Seydi Rehber yöneticileri: içerikleri denetlemek, şikayetleri ve destek taleplerini incelemek için gerekli verilere erişebilir.',
      ],
    },
    {
      heading: '4. Hizmet sağlayıcılar ve yurt dışına aktarım',
      paragraphs: [
        'Uygulamayı çalıştırmak için aşağıdaki hizmet sağlayıcıları kullanıyoruz. Bu sağlayıcıların sunucuları Türkiye dışında bulunabileceğinden verileriniz yurt dışına aktarılmaktadır:',
      ],
      bullets: [
        'Google Firebase (Google LLC): giriş/kimlik doğrulama, veritabanı, bildirim gönderimi (Firebase Cloud Messaging) ve kullanım analizi (Firebase Analytics).',
        'Google ile Giriş ve Apple ile Giriş: hesabınızla oturum açmanız için.',
        'Apple Push Notification Service: iOS cihazlara bildirim iletmek için.',
        'Supabase: uygulamadaki işletme, etkinlik ve yer görsellerinin barındırılması.',
        'EmailJS: hoş geldin e-postasının gönderilmesi (adınız ve e-posta adresiniz iletilir).',
      ],
      after: [
        'Uygulama ayrıca nöbetçi eczane ve hava durumu gibi bazı bilgileri üçüncü taraf web sayfalarından, haberleri yerel haber sitelerinin RSS akışından, vefat ilanlarını Seydişehir Belediyesi sitesinden gösterir. Bu sayfaları açtığınızda ilgili sitelerin kendi gizlilik politikaları geçerlidir.',
      ],
    },
    {
      heading: '5. Saklama süresi',
      bullets: [
        'Hesap bilgileriniz ve paylaştığınız içerikler, hesabınız açık olduğu sürece veya siz ya da biz içeriği silene kadar saklanır.',
        'Destek talepleri, talep sonuçlandırılana kadar ve olası uyuşmazlıklar için makul bir süre saklanır.',
        '30 günden uzun süredir kullanılmayan bildirim anahtarları yöneticiler tarafından periyodik olarak silinir.',
        'Firebase Analytics verileri Google tarafından, Firebase projesinde tanımlı saklama süresi boyunca tutulur.',
      ],
    },
    {
      heading: '6. Hesabınızı ve verilerinizi silme',
      paragraphs: [
        'Uygulamada "Ayarlar > Hesabı Sil" ile hesabınızı istediğiniz an silebilirsiniz. Bu işlem giriş hesabınızı ve yazdığınız tüm yorumları hemen ve kalıcı olarak siler.',
        `Forum gönderileriniz ve yanıtlarınız, destek talepleriniz ve kupon kayıtlarınız dahil diğer verilerinizin de silinmesini istiyorsanız ${CONTACT_EMAIL} adresine hesabınızın e-posta adresiyle yazın. Talebinizi en geç 30 gün içinde sonuçlandırırız.`,
      ],
    },
    {
      heading: '7. Yaş sınırı',
      paragraphs: [
        'Yorum yazma, puan verme ve forumda paylaşım gibi etkileşimli özellikler 18 yaş ve üzeri kullanıcılar içindir. 18 yaşından küçük bir kullanıcıya ait veri işlediğimizi fark edersek bu verileri sileriz.',
      ],
    },
    {
      heading: '8. Güvenlik',
      paragraphs: [
        'Uygulama ile sunucular arasındaki tüm iletişim şifreli bağlantı (HTTPS/TLS) üzerinden yapılır. Veritabanı erişimi kurallarla sınırlandırılmıştır; örneğin kullanım kayıtlarını ve destek taleplerini yalnızca yöneticiler okuyabilir. Hiçbir sistem tamamen risksiz olmadığından, bir güvenlik ihlali fark edersek ilgili kişileri ve gerekli durumlarda Kişisel Verileri Koruma Kurulunu bilgilendiririz.',
      ],
    },
    {
      heading: '9. Değişiklikler ve iletişim',
      paragraphs: [
        `Bu politikayı güncellediğimizde "Son güncelleme" tarihini değiştiririz; önemli değişiklikleri uygulama içinde duyururuz. Sorularınız ve talepleriniz için: ${CONTACT_EMAIL}`,
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: PolicyDocument = {
  id: 'terms',
  title: 'Kullanım Koşulları',
  summary: 'Uygulamayı kullanırken uyulması gereken kurallar ve tarafların sorumlulukları.',
  intro: [
    'Seydi Rehber mobil uygulamasını ve seydirehber.com.tr web sitesini kullanarak bu koşulları kabul etmiş olursunuz. Koşulları kabul etmiyorsanız lütfen hizmeti kullanmayın.',
  ],
  sections: [
    {
      heading: '1. Hizmetin kapsamı',
      paragraphs: [
        'Seydi Rehber, Seydişehir için şehir rehberi sunan ücretsiz bir hizmettir: işletmeler, gezilecek yerler, etkinlikler, nöbetçi eczaneler, noterler, pazarlar, otobüs saatleri, hava durumu, haberler, vefat ilanları, iş ilanları, kuponlar ve kullanıcı forumu.',
        'Bu bilgilerin bir kısmı belediye, haber siteleri, eczane ve hava durumu servisleri gibi üçüncü taraf kaynaklardan derlenir ve işletmeler tarafından iletilir. Bilgileri güncel tutmaya çalışsak da doğruluğunu ve kesintisiz erişimi garanti edemeyiz. Nöbetçi eczane, otobüs saatleri gibi önemli konularda resmi kaynaktan teyit etmenizi öneririz.',
      ],
    },
    {
      heading: '2. Hesap ve misafir kullanım',
      bullets: [
        'Uygulamayı misafir olarak kullanabilir veya Google ya da Apple hesabınızla giriş yapabilirsiniz.',
        'Misafir kullanıcılar uygulamanın çoğu özelliğini kullanabilir; forumdaki yanıtları görmek ve yanıt yazmak için Google veya Apple ile giriş yapmak gerekir.',
        'Yorum yazma, puan verme ve forumda paylaşım gibi etkileşimli özellikler 18 yaş ve üzeri kullanıcılar içindir.',
        'Hesabınızla yapılan işlemlerden siz sorumlusunuz.',
      ],
    },
    {
      heading: '3. Topluluk kuralları',
      paragraphs: ['Yorumlarda ve forumda aşağıdakiler yasaktır:'],
      bullets: [
        'Küfür, hakaret, argo, nefret söylemi, tehdit veya taciz.',
        'Yanıltıcı, yasa dışı, müstehcen içerik veya başkasının telif hakkını ihlal eden içerik.',
        'Kişileri veya işletmeleri asılsız iddialarla karalamak, sahte veya karşılığında menfaat sağlanmış yorum yazmak.',
        'Başkalarının kişisel bilgilerini (telefon, adres vb.) izinsiz paylaşmak.',
        'Reklam, spam veya aynı içeriği tekrar tekrar paylaşmak.',
      ],
      after: [
        'Paylaştığınız içerikten siz sorumlusunuz. İçeriğinizi uygulamada yayınlamamız ve göstermemiz için bize ücretsiz, münhasır olmayan bir kullanım izni vermiş olursunuz.',
      ],
    },
    {
      heading: '4. Moderasyon',
      bullets: [
        'Otomatik filtre: uygunsuz kelimeler içeren içerikler yayınlanmadan engellenir.',
        'Şikayet: uygunsuz bulduğunuz yorum ve forum içeriklerini "Rapor Et" ile bize bildirebilirsiniz. Birden fazla şikayet alan forum içerikleri inceleme sonuçlanana kadar gizlenir. Bildirimleri 24 saat içinde incelemeyi hedefliyoruz.',
        'Engelleme: rahatsız eden kullanıcıları engelleyerek içeriklerini gizleyebilir, engeli "Ayarlar" menüsünden kaldırabilirsiniz.',
        'Kuralları ihlal eden içerikler bildirim yapılmaksızın silinebilir; ihlali tekrarlayan hesapların erişimi kısıtlanabilir veya kapatılabilir.',
      ],
    },
    {
      heading: '5. Kuponlar ve kampanyalar',
      paragraphs: [
        'Kuponlar ve kampanyalar ilgili işletmeler tarafından sunulur; indirim oranı, geçerlilik koşulları ve uygulanmasından işletme sorumludur. Kupon kodları kısa süre geçerlidir ve tek kullanımlıktır. Seydi Rehber, kullanıcı ile işletme arasındaki alışverişin tarafı değildir.',
      ],
    },
    {
      heading: '6. İşletme bilgileri, yorumlar ve iş ilanları',
      bullets: [
        'İşletmeler hakkındaki yorumlar ve puanlar kullanıcıların kişisel görüşleridir; Seydi Rehber\'in görüşünü yansıtmaz.',
        'İşletmeler, Esnaf Paneli üzerinden kendilerine yazılan yorumlara herkese açık yanıt verebilir.',
        'İş ilanlarındaki bilgiler işverenler tarafından sağlanır. Başvurular doğrudan işverenle yapılır; Seydi Rehber işe alım sürecinin tarafı değildir. Başvuru sırasında kişisel bilgilerinizi paylaşırken dikkatli olun.',
      ],
    },
    {
      heading: '7. Haberler ve dış içerikler',
      paragraphs: [
        'Haberler yerel basın kuruluşlarının RSS yayınlarından alınır ve kaynağına bağlantı verilir; haberlerin içeriğinden kaynak yayıncı sorumludur. Hak sahiplerinin bildirimi üzerine ilgili içerik kaldırılır (uyar-kaldır).',
      ],
    },
    {
      heading: '8. Fikri mülkiyet',
      paragraphs: [
        'Uygulamanın tasarımı, yazılımı, logosu ve Seydi Rehber adı bize aittir; izinsiz kopyalanamaz veya ticari amaçla kullanılamaz. Kullanıcıların ve işletmelerin paylaştığı içeriklerin hakları sahiplerine aittir.',
      ],
    },
    {
      heading: '9. Sorumluluğun sınırlandırılması',
      paragraphs: [
        'Hizmet "olduğu gibi" sunulur. Üçüncü taraf kaynaklardan gelen bilgilerin hatalı veya eksik olmasından, kullanıcıların ve işletmelerin paylaştığı içeriklerden ve hizmette yaşanabilecek kesintilerden doğan zararlardan, kanunen izin verilen ölçüde sorumlu değiliz.',
      ],
    },
    {
      heading: '10. Değişiklikler, uygulanacak hukuk ve iletişim',
      paragraphs: [
        'Bu koşulları güncelleyebiliriz; güncel metin her zaman uygulamada ve web sitemizde yayınlanır. Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır.',
        `Sorularınız ve içerik kaldırma talepleriniz için: ${CONTACT_EMAIL}`,
      ],
    },
  ],
};

export const KVKK_NOTICE: PolicyDocument = {
  id: 'kvkk',
  title: 'KVKK Aydınlatma Metni',
  summary: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme.',
  intro: [
    `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla ${CONTROLLER_NAME} olarak kişisel verilerinizi aşağıda açıklanan kapsamda işliyoruz. Ayrıntılı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.`,
  ],
  sections: [
    {
      heading: '1. Veri sorumlusu',
      paragraphs: [`${CONTROLLER_NAME} — İletişim: ${CONTACT_EMAIL}`],
    },
    {
      heading: '2. İşlenen kişisel veri kategorileri',
      bullets: [
        'Kimlik: ad soyad.',
        'İletişim: e-posta adresi; destek formunda verirseniz telefon numarası.',
        'Görsel: hesabınıza ait profil fotoğrafı bağlantısı.',
        'Müşteri işlem: yorumlar ve puanlar, forum gönderileri ve yanıtları, şikayetler, destek talepleri, kupon kodları ve kullanım kayıtları.',
        'İşlem güvenliği: kullanıcı kimliği (UID), bildirim anahtarı, son açılış zamanı, platform ve hesap türü.',
        'Kullanım verileri: Firebase Analytics ile toplanan ekran görüntüleme ve uygulama etkileşim bilgileri, cihaz ve sürüm bilgileri, IP adresinden çıkarılan yaklaşık konum.',
      ],
      after: [
        'Harita ve mesafe için kullanılan anlık konumunuz yalnızca cihazınızda işlenir; tarafımızca kaydedilmez ve aktarılmaz.',
      ],
    },
    {
      heading: '3. İşleme amaçları',
      bullets: [
        'Üyelik ve giriş işlemlerinin yürütülmesi, uygulama hizmetlerinin sunulması.',
        'Kullanıcı içeriklerinin yayınlanması ve moderasyonu, şikayetlerin incelenmesi.',
        'Kupon ve kampanya süreçlerinin yürütülmesi.',
        'Bildirim gönderilmesi ve destek taleplerinin yanıtlanması.',
        'Bilgi güvenliğinin sağlanması ve kötüye kullanımın önlenmesi.',
        'Hizmetin geliştirilmesi için kullanım istatistiklerinin oluşturulması.',
      ],
    },
    {
      heading: '4. Hukuki sebepler',
      paragraphs: ['Kişisel verileriniz KVKK\'nın 5. maddesinin 2. fıkrasında yer alan şu hukuki sebeplere dayanılarak işlenir:'],
      bullets: [
        'Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (c bendi): hesap, içerik paylaşımı, kupon ve destek hizmetleri.',
        'Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi (ç bendi): yasal düzenlemelerden doğan saklama ve bildirim yükümlülükleri.',
        'Bir hakkın tesisi, kullanılması veya korunması (e bendi): uyuşmazlıklarda ve şikayet incelemelerinde.',
        'Temel hak ve özgürlüklerinize zarar vermemek kaydıyla veri sorumlusunun meşru menfaati (f bendi): güvenlik, moderasyon ve kullanım istatistikleri.',
      ],
    },
    {
      heading: '5. Toplama yöntemi',
      paragraphs: [
        'Kişisel verileriniz; uygulama, web sitesi ve Esnaf Paneli üzerinden, giriş yaptığınızda Google veya Apple aracılığıyla, formları doldurduğunuzda ve uygulamayı kullanırken otomatik yollarla elektronik ortamda toplanır.',
      ],
    },
    {
      heading: '6. Aktarım',
      bullets: [
        'Yorumlar ve forum içerikleri, niteliği gereği uygulamadaki diğer kullanıcılara; işletmelere yazılan yorumlar ilgili işletmeye görünür.',
        'Hizmetin sunulması için kullanılan Google Firebase, Google ile Giriş, Apple ile Giriş ve bildirim servisleri, Supabase ve EmailJS hizmet sağlayıcılarına aktarılır. Bu sağlayıcıların sunucuları yurt dışında bulunabildiğinden aktarım, KVKK\'nın 9. maddesi kapsamında yurt dışına yapılmaktadır.',
        'Kanunen yetkili kamu kurum ve kuruluşlarına, talep halinde ve mevzuatın gerektirdiği ölçüde.',
      ],
      after: ['Kişisel verileriniz reklam veya pazarlama amacıyla üçüncü kişilere aktarılmaz ve satılmaz.'],
    },
    {
      heading: '7. Haklarınız (KVKK md. 11)',
      bullets: [
        'Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme,',
        'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
        'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,',
        'Eksik veya yanlış işlenmişse düzeltilmesini isteme,',
        'KVKK\'nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
        'Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
        'Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,',
        'Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme.',
      ],
    },
    {
      heading: '8. Başvuru',
      paragraphs: [
        `Haklarınızı kullanmak için talebinizi, uygulamada kayıtlı e-posta adresinizden ${CONTACT_EMAIL} adresine iletebilirsiniz. Başvurunuzda adınızı soyadınızı ve talebinizi açıkça belirtmeniz gerekir. Talebiniz, niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
        'Uygulamadaki "Ayarlar > Hesabı Sil" seçeneği giriş hesabınızı ve yorumlarınızı hemen siler; diğer verileriniz için yukarıdaki yolla başvurabilirsiniz.',
      ],
    },
  ],
};

export const POLICY_DOCUMENTS: PolicyDocument[] = [PRIVACY_POLICY, TERMS_OF_SERVICE, KVKK_NOTICE];

/** Mobil uygulamadaki düz metin gösterimi için (aynı içerik). */
export function policyToPlainText(doc: PolicyDocument): string {
  const lines: string[] = [`Son Güncelleme: ${POLICY_UPDATED_AT}`, '', ...doc.intro.flatMap((p) => [p, ''])];
  for (const section of doc.sections) {
    lines.push(`${section.heading}:`);
    section.paragraphs?.forEach((p) => lines.push(p));
    section.bullets?.forEach((b) => lines.push(`• ${b}`));
    section.after?.forEach((p) => lines.push(p));
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}
