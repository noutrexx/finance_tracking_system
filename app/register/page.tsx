"use client";

import React, { useState } from 'react';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        message.success(data.message);
        router.push('/'); // Başarılıysa anasayfaya (Login) at
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Sunucu bağlantı hatası!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Title level={3}>Kayıt Ol</Title>
            <Text type="secondary">Yeni hesap oluşturun</Text>
        </div>

        <Form onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="username" rules={[{ required: true, message: 'Kullanıcı adı gerekli!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı Seçin" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Şifre gerekli!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Şifre Belirleyin" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ backgroundColor: '#52c41a' }}>
              Kayıt Ol
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Zaten üye misin? <Link href="/" style={{ color: '#1677ff' }}>Giriş Yap</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}