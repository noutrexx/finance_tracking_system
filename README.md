Financial Asset and Portfolio Management System

This project is a Full-Stack web application where users can track their financial assets such as cryptocurrency and gold with real-time market prices, record buy-sell transactions, and offers detailed profit/loss analysis.


<img alt="Ekran görüntüsü 2026-03-01 200943" src="https://github.com/user-attachments/assets/2a45bbb6-31e1-49ae-8442-2e48b7ca99d4" />
<img alt="Ekran görüntüsü 2026-03-01 200934" src="https://github.com/user-attachments/assets/884fbfb6-9161-459c-8f3e-269f75da8197" />
<img alt="Ekran görüntüsü 2026-03-01 200924" src="https://github.com/user-attachments/assets/b8eccba4-61ba-4bfd-b473-045cb9dce3e0" />
<img alt="Ekran görüntüsü 2026-03-01 200839" src="https://github.com/user-attachments/assets/373cb506-21b4-4770-8ca5-3f6a90a74bf9" />
<img alt="Ekran görüntüsü 2026-03-01 200906" src="https://github.com/user-attachments/assets/34329075-459c-4a39-8164-0e29af54e9b5" />


It was developed specifically in accordance with the learning outcomes of the Database Management Systems course; a significant part of the business logic is resolved at the database layer using Oracle PL/SQL.


Highlighted Features

-Live Data Stream: Real-time cryptocurrency prices with CoinGecko API integration.
-Portfolio Management: Adding, selling assets, and real-time cost calculation.
-Advanced Statistics: Display of total cost, current value, and net Profit/Loss.
-Automatic Logging System: Automatic background recording of user transactions at the database level.
-Dark/Light Theme: Modern and user-friendly interface with Ant Design.


Technologies Used
 Frontend:
  -Next.js (React Framework)
  -TypeScript
  -Ant Design (UI Library)
  -Recharts (Graphic Display)
  
 Backend & Database:
  -Node.js & Next.js API Routes
  -oracledb (Node.js Oracle Driver)
  -Oracle Database (XE)
  -PL/SQL Objects: Stored Procedures, Triggers, Views

  
Database Architecture (PL/SQL)
Going beyond ordinary CRUD operations in the project, database features were actively used: 
-Views: Used for user portfolio summaries and system statistics (VW_KULLANICI_PORTFOYU, VW_SISTEM_OZETI). 
-Procedures: Buy and sell transactions (SP_COIN_EKLE, SP_COIN_SAT) were written by being calculated securely on the database side. 
-Triggers: Automatic logging to the ISLEM_LOGLARI table was provided by intervening in every INSERT, UPDATE, and DELETE operation performed on the table.


Installation and Execution Test Accounts You can use the following default user information to test the application:

Username: admin | Password: 123456
Username: ogrenci | Password: 123456

Prepare the Database: Copy the codes inside the veritabani.sql file located in the main directory of the project and create the tables by executing them with the SYSTEM user in Oracle SQL Developer.
Clone the Repository and Install Dependencies:
```bash
git clone [https://github.com/noutrexx/finance_tracking_system.git](https://github.com/noutrexx/finance_tracking_system.git)
cd kurumsal-login
npm install

