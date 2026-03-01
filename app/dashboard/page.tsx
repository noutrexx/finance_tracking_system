"use client";

import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Button, Tag, Space, Avatar, message, Row, Col, Statistic, Tabs, ConfigProvider, theme, Switch, Modal, Spin, InputNumber } from 'antd';
import { PlusCircleOutlined, LogoutOutlined, WalletOutlined, BankOutlined, ArrowUpOutlined, ArrowDownOutlined, GlobalOutlined, GoldOutlined, MoonOutlined, SunOutlined, MinusCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  
  const [cryptoData, setCryptoData] = useState<any[]>([]); 
  const [goldData, setGoldData] = useState<any[]>([]);     
  const [myCoins, setMyCoins] = useState<any[]>([]);       
  const [portfolioStats, setPortfolioStats] = useState({ totalCost: 0, currentValue: 0, profit: 0, profitPercent: 0 });
  
  // LOG SAYISI İÇİN STATE
  const [logCount, setLogCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const router = useRouter();

  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [amountInput, setAmountInput] = useState<number | null>(1);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const fetchData = async (username: string) => {
    setLoading(true);
    try {
      // 1. Kripto Verisi
      const cryptoRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const cData = await cryptoRes.json();
      setCryptoData(cData);

      // 2. Altın Verisi
      const goldRes = await fetch('/api/market/gold');
      const gData = await goldRes.json();
      setGoldData(gData);

      // 3. Portföy Listesi
      const portfolioRes = await fetch('/api/portfolio/list', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username }),
      });
      const pData = await portfolioRes.json();
      if(pData.success) setMyCoins(pData.data);

      // 4. İSTATİSTİKLER (SENİN MEVCUT API'NE UYUMLU KISIM)
      // Senin API şu formatta dönüyor: { users: 2, tracking: 5, logs: 10 }
      const statRes = await fetch('/api/stats');
      const statData = await statRes.json();
      
      // Eğer log verisi varsa state'e kaydet
      if(statData && statData.logs !== undefined) {
          setLogCount(statData.logs);
      }

    } catch (error) { console.error("Veri çekme hatası:", error); }
    setLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) router.push('/'); else { setUser(storedUser); fetchData(storedUser); }
  }, []);

  useEffect(() => {
    if (myCoins.length > 0 && (cryptoData.length > 0 || goldData.length > 0)) {
      let cost = 0; let value = 0;
      myCoins.forEach((item: any) => {
        let liveAsset: any = cryptoData.find((c: any) => c.id === item.coinId);
        if(!liveAsset) liveAsset = goldData.find((g: any) => g.id === item.coinId);
        if (liveAsset && item.buyPrice && item.amount) {
          cost += item.buyPrice * item.amount;
          value += liveAsset.current_price * item.amount;
        }
      });
      const profit = value - cost;
      const percent = cost > 0 ? (profit / cost) * 100 : 0;
      setPortfolioStats({ totalCost: cost, currentValue: value, profit: profit, profitPercent: percent });
    } else { setPortfolioStats({ totalCost: 0, currentValue: 0, profit: 0, profitPercent: 0 }); }
  }, [myCoins, cryptoData, goldData]);

  const handleLogout = () => { localStorage.removeItem('currentUser'); router.push('/'); };

  const openAddModal = (e: any, asset: any) => { e.stopPropagation(); setSelectedAsset(asset); setAmountInput(1); setIsAddOpen(true); };
  const confirmAddAsset = async () => {
    if(!amountInput || amountInput <= 0) return;
    try {
      const res = await fetch('/api/portfolio/add', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, coinId: selectedAsset.id, coinSymbol: selectedAsset.symbol, price: selectedAsset.current_price, amount: amountInput }),
      });
      const data = await res.json();
      if(data.success) { messageApi.success('Eklendi!'); setIsAddOpen(false); fetchData(user); }
      else { messageApi.error(data.message); }
    } catch (error) { messageApi.error('Hata oluştu'); }
  };

  const openSellModal = (asset: any) => { setSelectedAsset(asset); setAmountInput(1); setIsSellOpen(true); };
  const confirmSellAsset = async () => {
    if(!amountInput || amountInput <= 0) return;
    try {
      const res = await fetch('/api/portfolio/delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, coinId: selectedAsset.coinId, amount: amountInput }),
      });
      const data = await res.json();
      if(data.success) { messageApi.success('Satış Başarılı!'); setIsSellOpen(false); fetchData(user); }
    } catch (error) { messageApi.error('Hata oluştu'); }
  };

  const openChart = async (record: any) => {
    setSelectedAsset(record); setIsChartOpen(true); setChartLoading(true); setChartData([]);
    if (['GRAM','XAU','ALTIN.S1','GUMUS'].includes(record.symbol)) {
      const mockHistory = []; let price = record.current_price; const today = new Date();
      for(let i=7; i>=0; i--) {
        const date = new Date(today); date.setDate(date.getDate() - i);
        price = price + (Math.random() * price * 0.05 - price * 0.025);
        mockHistory.push({ date: date.toLocaleDateString('tr-TR', {day:'numeric', month:'short'}), price: price });
      }
      setChartData(mockHistory); setChartLoading(false);
    } else {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${record.id}/market_chart?vs_currency=usd&days=7`);
        const data = await res.json();
        const history = data.prices.map((item: any) => ({ date: new Date(item[0]).toLocaleDateString('tr-TR', {day:'numeric', month:'short'}), price: item[1] }));
        setChartData(history);
      } catch (err) { } finally { setChartLoading(false); }
    }
  };

  const marketColumns = [
    { title: 'Varlık', dataIndex: 'name', key: 'name', render: (text: string, record: any) => <Space><Avatar src={record.image} size="small" /><Text strong>{text}</Text></Space> },
    { title: 'Fiyat', dataIndex: 'current_price', render: (price: number) => <Text>${price?.toLocaleString()}</Text> },
    { title: 'İşlem', render: (_: any, record: any) => <Button type="primary" size="small" icon={<PlusCircleOutlined />} ghost onClick={(e) => openAddModal(e, record)}>Al / Ekle</Button> },
  ];

  const myColumns = [
    { title: 'Sembol', dataIndex: 'coinSymbol', render: (text: string) => <Tag color="blue">{text.toUpperCase()}</Tag> },
    { title: 'Adet', dataIndex: 'amount', render: (val: number) => <Text strong>{val}</Text> },
    { title: 'Maliyet', dataIndex: 'buyPrice', render: (price: number) => <Text type="secondary">${price?.toLocaleString()}</Text> },
    { title: 'Değer', render: (_: any, record: any) => {
        let live = cryptoData.find((c: any) => c.id === record.coinId) || goldData.find((g: any) => g.id === record.coinId);
        if (!live) return <Text>-</Text>;
        return <Text strong>${(live.current_price * record.amount).toLocaleString(undefined, {maximumFractionDigits: 2})}</Text>
      }
    },
    { title: 'K/Z', render: (_: any, record: any) => {
        let live = cryptoData.find((c: any) => c.id === record.coinId) || goldData.find((g: any) => g.id === record.coinId);
        if (!live || !record.buyPrice) return <Tag>-</Tag>;
        const p = ((live.current_price - record.buyPrice) / record.buyPrice) * 100;
        return <Tag color={p >= 0 ? 'success' : 'error'}>%{p.toFixed(2)}</Tag>;
      }
    },
    { title: 'Sat', render: (_: any, record: any) => <Button danger size="small" icon={<MinusCircleOutlined />} onClick={() => openSellModal(record)}>Sat</Button> }
  ];

  return (
    <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm, token: { colorPrimary: '#1677ff' } }}>
      {contextHolder}
      <div style={{ padding: '20px 50px', minHeight: '100vh', backgroundColor: isDarkMode ? '#000000' : '#f0f2f5', transition: 'all 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div><Title level={2} style={{ margin: 0 }}>Yatırım Paneli</Title><Text type="secondary">Kullanıcı: <b>{user}</b></Text></div>
          <Space><Switch checkedChildren={<MoonOutlined />} unCheckedChildren={<SunOutlined />} checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} /><Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Çıkış</Button></Space>
        </div>
        
        {/* --- İSTATİSTİK KARTLARI (ŞİMDİ 4 TANE) --- */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={6}>
            <Card variant="borderless">
              <Statistic title="Maliyet" value={portfolioStats.totalCost} precision={2} prefix={<WalletOutlined />} suffix="$" />
            </Card>
          </Col>
          <Col span={6}>
            <Card variant="borderless">
              <Statistic title="Değer" value={portfolioStats.currentValue} precision={2} prefix={<BankOutlined />} suffix="$" styles={{ content: { color: '#1677ff' } }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card variant="borderless">
              <Statistic title="Kar/Zarar" value={portfolioStats.profit} precision={2} styles={{ content: { color: portfolioStats.profit >= 0 ? '#3f8600' : '#cf1322' } }} prefix={portfolioStats.profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} suffix={`$`} />
            </Card>
          </Col>
          {/* LOG KARTI - ARTIK SENİN BACKEND'DEN GELEN VERİYİ GÖSTERİYOR */}
          <Col span={6}>
            <Card variant="borderless">
              <Statistic title="İşlem Kaydı (Log)" value={logCount} prefix={<HistoryOutlined />} suffix="Adet" styles={{ content: { color: '#faad14' } }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={13}><Card variant="borderless"><Tabs defaultActiveKey="1" items={[{ key: '1', label: <span><GlobalOutlined /> Kripto</span>, children: <Table dataSource={cryptoData} columns={marketColumns} rowKey="id" pagination={false} size="small" onRow={(r) => ({ onClick: () => openChart(r), style: { cursor: 'pointer' } })} /> }, { key: '2', label: <span><GoldOutlined /> Altın</span>, children: <Table dataSource={goldData} columns={marketColumns} rowKey="id" pagination={false} size="small" onRow={(r) => ({ onClick: () => openChart(r), style: { cursor: 'pointer' } })} /> }]} /></Card></Col>
          <Col span={11}><Card title="Portföyüm" variant="borderless"><Table dataSource={myCoins} columns={myColumns} rowKey="kayitId" pagination={false} size="small" locale={{emptyText: 'Boş'}} /></Card></Col>
        </Row>
        <Modal title="Grafik" open={isChartOpen} onCancel={() => setIsChartOpen(false)} footer={null} width={700}>
           {chartLoading ? <div style={{textAlign:'center', padding:50}}><Spin size="large"/></div> : (<div style={{width:'100%', height:350}}><ResponsiveContainer><AreaChart data={chartData}><defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1677ff" stopOpacity={0.8}/><stop offset="95%" stopColor="#1677ff" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="date"/><YAxis domain={['auto','auto']}/><CartesianGrid opacity={0.1}/><Tooltip/><Area type="monotone" dataKey="price" stroke="#1677ff" fill="url(#colorPrice)"/></AreaChart></ResponsiveContainer></div>)}
        </Modal>
        <Modal title={`Alış: ${selectedAsset?.name}`} open={isAddOpen} onCancel={() => setIsAddOpen(false)} onOk={confirmAddAsset} okText="Satın Al"><div style={{textAlign:'center'}}><Avatar src={selectedAsset?.image} size="large"/><p style={{marginTop:10}}>Adet Giriniz:</p><InputNumber min={0.01} value={amountInput} onChange={(val) => setAmountInput(val)} style={{width:'100%'}} />{selectedAsset && amountInput && (<p style={{marginTop:10, color:'#1677ff'}}>Toplam: ${(selectedAsset.current_price * amountInput).toLocaleString()}</p>)}</div></Modal>
        <Modal title={`Satış: ${selectedAsset?.coinSymbol?.toUpperCase()}`} open={isSellOpen} onCancel={() => setIsSellOpen(false)} onOk={confirmSellAsset} okText="Sat / Azalt" okButtonProps={{ danger: true }}><div style={{textAlign:'center'}}><p style={{color:'red', fontWeight:'bold'}}>Kaç adet satacaksınız?</p><p>Mevcut: <b>{selectedAsset?.amount}</b> adet</p><InputNumber min={0.01} max={selectedAsset?.amount} value={amountInput} onChange={(val) => setAmountInput(val)} style={{width:'100%'}} size="large"/></div></Modal>
      </div>
    </ConfigProvider>
  );
}