"use client";

import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Button, Tag, Space, Avatar, message } from 'antd';
import { PlusCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/'); 
    } else {
      setUser(storedUser);
    }

    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
      .then(res => res.json())
      .then(data => {
        setCoins(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Veri hatası:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const handleAddCoin = async (coin: any) => {
    try {
      const response = await fetch('/api/portfolio/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user, 
          coinId: coin.id,
          coinSymbol: coin.symbol
        }),
      });
      
      const data = await response.json();
      
      if(data.success) {
        message.success(`${coin.name} başarıyla listene eklendi!`);
      } else {
        message.warning('Bu coin zaten listende olabilir veya bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      message.error('Sunucu hatası!');
    }
  };

  const columns = [
    {
      title: 'Coin',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.image} size="small" />
          <Text strong>{text}</Text>
          <Text type="secondary">({record.symbol.toUpperCase()})</Text>
        </Space>
      ),
    },
    {
      title: 'Fiyat ($)',
      dataIndex: 'current_price',
      key: 'current_price',
      render: (price: number) => <Text strong>${price.toLocaleString()}</Text>,
    },
    {
      title: '24s Değişim',
      dataIndex: 'price_change_percentage_24h',
      key: 'change',
      render: (change: number) => (
        <Tag color={change > 0 ? 'green' : 'red'}>
          {change > 0 ? '+' : ''}{change.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: 'İşlem',
      key: 'action',
      // TypeScript düzeltmesi burada yapıldı:
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<PlusCircleOutlined />} 
          ghost
          onClick={() => handleAddCoin(record)} 
        >
          Listeme Ekle
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px 50px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
           <Title level={2} style={{ margin: 0 }}>Piyasa Özeti</Title>
           <Text type="secondary">Hoşgeldin, <span style={{fontWeight:'bold', color:'#1677ff'}}>{user}</span></Text>
        </div>
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Çıkış Yap</Button>
      </div>

      <Card style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table 
          dataSource={coins} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
}