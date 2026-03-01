import { NextResponse } from 'next/server';

export async function GET() {
  // Gerçekçi olması için fiyatlara ufak rastgele değişimler ekliyoruz
  const randomChange = () => (Math.random() * 2 - 1).toFixed(2); // -1 ile +1 arası sayı
  
  const goldData = [
    {
      id: 'gram-altin',
      symbol: 'GRAM',
      name: 'Gram Altın',
      image: 'https://img.icons8.com/color/48/gold-bars.png', // Altın ikonu
      current_price: 3050.45 + parseFloat(randomChange()), // Örnek Fiyat
      price_change_percentage_24h: 1.25
    },
    {
      id: 'ons-altin',
      symbol: 'XAU',
      name: 'Ons Altın',
      image: 'https://img.icons8.com/color/48/gold-ore.png',
      current_price: 2680.10 + parseFloat(randomChange()),
      price_change_percentage_24h: 0.45
    },
    {
      id: 'altin-s1',
      symbol: 'ALTIN.S1',
      name: 'Darphane Altın Sertifikası',
      image: 'https://img.icons8.com/fluency/48/certificate.png', // Sertifika ikonu
      current_price: 24.85 + (Math.random() * 0.1),
      price_change_percentage_24h: 2.10
    },
    {
        id: 'gumus-gram',
        symbol: 'GUMUS',
        name: 'Gümüş (Gram)',
        image: 'https://img.icons8.com/color/48/silver-bars.png',
        current_price: 34.20,
        price_change_percentage_24h: -0.50
      }
  ];

  return NextResponse.json(goldData);
}