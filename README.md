Finansal Varlık ve Portföy Yönetim Sistemi


Bu proje, kullanıcıların kripto para ve altın gibi finansal varlıklarını anlık piyasa fiyatlarıyla takip edebildiği, alım-satım işlemlerini kaydeden ve detaylı kâr/zarar analizi sunan **Full-Stack** bir web uygulamasıdır. 


<img alt="Ekran görüntüsü 2026-03-01 200934" src="https://github.com/user-attachments/assets/884fbfb6-9161-459c-8f3e-269f75da8197" />
<img alt="Ekran görüntüsü 2026-03-01 200924" src="https://github.com/user-attachments/assets/b8eccba4-61ba-4bfd-b473-045cb9dce3e0" />
<img alt="Ekran görüntüsü 2026-03-01 200943" src="https://github.com/user-attachments/assets/2a45bbb6-31e1-49ae-8442-2e48b7ca99d4" />
<img alt="Ekran görüntüsü 2026-03-01 200839" src="https://github.com/user-attachments/assets/373cb506-21b4-4770-8ca5-3f6a90a74bf9" />
<img alt="Ekran görüntüsü 2026-03-01 200906" src="https://github.com/user-attachments/assets/34329075-459c-4a39-8164-0e29af54e9b5" />

Özellikle **Veritabanı Yönetim Sistemleri** dersi kazanımlarına uygun olarak geliştirilmiş olup; iş mantığının önemli bir kısmı (Business Logic) Oracle PL/SQL kullanılarak veritabanı katmanında çözülmüştür.

Öne Çıkan Özellikler

* **Canlı Veri Akışı:** CoinGecko API entegrasyonu ile anlık kripto para fiyatları.
* **Portföy Yönetimi:** Varlık ekleme, satma ve anlık maliyet hesaplama.
* **Gelişmiş İstatistikler:** Toplam maliyet, güncel değer ve net Kâr/Zarar gösterimi.
* **Otomatik Loglama Sistemi:** Kullanıcı işlemlerinin veritabanı seviyesinde arka planda otomatik kaydedilmesi.
* **Karanlık/Aydınlık Tema:** Ant Design ile modern ve kullanıcı dostu arayüz.

 Kullanılan Teknolojiler

Frontend (Ön Yüz):
- Next.js (React Framework)
- TypeScript
- Ant Design (UI Kütüphanesi)
- Recharts (Grafik Gösterimi)

Backend (Arka Yüz) & Veritabanı:
- Node.js & Next.js API Routes
- `oracledb` (Node.js Oracle Sürücüsü)
- Oracle Database (XE)
- **PL/SQL Nesneleri:** Stored Procedures (Saklı Yordamlar), Triggers (Tetikleyiciler), Views (Görünümler)

 Veritabanı Mimarisi (PL/SQL)

Projede sıradan CRUD işlemlerinin ötesine geçilerek veritabanı özellikleri aktif kullanılmıştır:
**Views (Görünümler):** Kullanıcı portföy özetleri ve sistem istatistikleri (`VW_KULLANICI_PORTFOYU`, `VW_SISTEM_OZETI`) için kullanıldı.
**Procedures (Prosedürler):** Alım ve satım işlemleri (`SP_COIN_EKLE`, `SP_COIN_SAT`) veritabanı tarafında güvenli bir şekilde hesaplanarak yazıldı.
**Triggers (Tetikleyiciler):** Tabloya yapılan her `INSERT`, `UPDATE` ve `DELETE` işleminde araya girilerek `ISLEM_LOGLARI` tablosuna otomatik log atılması sağlandı.

Kurulum ve Çalıştırma
Test Hesapları
Uygulamayı test etmek için aşağıdaki varsayılan kullanıcı bilgilerini kullanabilirsiniz:

Kullanıcı Adı: admin | Şifre: 123456

Kullanıcı Adı: ogrenci | Şifre: 123456

**1. Veritabanını Hazırlayın:**
Proje ana dizininde bulunan `veritabani.sql` dosyasının içindeki kodları kopyalayın ve Oracle SQL Developer'da `SYSTEM` kullanıcısı ile çalıştırarak tabloları oluşturun.

**2. Repoyu Klonlayın ve Bağımlılıkları Yükleyin:**
```bash
git clone [https://github.com/KULLANICI_ADIN/PROJE_ADIN.git](https://github.com/KULLANICI_ADIN/PROJE_ADIN.git)
cd kurumsal-login
npm install

```bash
npm run dev
git clone [https://github.com/KULLANICI_ADIN/PROJE_ADIN.git](https://github.com/KULLANICI_ADIN/PROJE_ADIN.git)
cd kurumsal-login
npm install
