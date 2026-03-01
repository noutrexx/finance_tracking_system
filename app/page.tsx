"use client";

import React, { useState } from 'react';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Yönlendirme için gerekli kütüphane

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Router'ı tanımlıyoruz

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        message.success(data.message);
        
        // 1. Kullanıcı adını tarayıcı hafızasına kaydet (İleride lazım olacak)
        localStorage.setItem('currentUser', values.username);
        
        // 2. Dashboard sayfasına fırlat
        router.push('/dashboard'); 
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Sunucu hatası!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Title level={3} style={{ margin: 0 }}>Sisteme Giriş</Title>
            <Text type="secondary">Kripto Takip Paneli</Text>
        </div>

        <Form onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="username" rules={[{ required: true, message: 'Kullanıcı adı girin!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Şifre girin!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 15 }}>
            Hesabın yok mu? <Link href="/register" style={{ fontWeight: 'bold', color: '#1677ff' }}>Hemen Kayıt Ol</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}