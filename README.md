# Inventory Procurement API

Backend API untuk mengelola proses procurement dan inventory, mulai dari pembuatan Purchase Request hingga barang diterima dan stok inventory diperbarui.

Project ini dibuat sebagai technical take-home test untuk mengimplementasikan workflow:

```text
Purchase Request
       ↓
   Approval
       ↓
 Purchase Order
       ↓
 Goods Receipt
       ↓
Inventory Updated
```

## Tech Stack

* Node.js
* TypeScript
* Express.js
* MySQL
* mysql2
* Zod
* JWT
* bcrypt
* Swagger / OpenAPI
* Vitest

## Arsitektur

Project menggunakan pendekatan layered architecture:

```text
Route
  ↓
Controller
  ↓
Validator
  ↓
Service
  ↓
Repository
  ↓
MySQL
```

Pembagian tanggung jawab:

* **Route**: Mendefinisikan endpoint dan authorization middleware.
* **Controller**: Menangani HTTP request/response.
* **Validator**: Melakukan validasi request menggunakan Zod.
* **Service**: Menangani business logic dan business rules.
* **Repository**: Menangani query dan akses database.
* **Database**: Menjaga data integrity melalui foreign key, unique constraint, dan constraint lainnya.

Business logic ditempatkan di service layer agar controller tetap tipis dan logic tidak bercampur dengan database access.

## Struktur Project

```text
evindo_test2/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── swagger.ts
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── index.ts
│
├── database/
│   ├── migrations/
│   │   └── 001_create_master_tables.sql
│   ├── seeds/
│   │   └── 001_users.sql
│   ├── migrate.ts
│   └── seed.ts
│
├── tests/
│   ├── auth/
│   ├── purchase-request/
│   ├── purchase-order/
│   └── goods-receipt/
│
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database Design

Database dirancang berdasarkan alur procurement dan inventory.

Beberapa prinsip utama:

* Stock tidak disimpan di tabel `products`.
* Stock disimpan berdasarkan kombinasi `product` dan `warehouse` pada tabel `inventories`.
* Setiap penerimaan barang menghasilkan `inventory_movement`.
* Purchase Request dapat memiliki beberapa item.
* Purchase Order dibuat berdasarkan Purchase Request yang telah disetujui.
* Goods Receipt dapat dilakukan secara bertahap.
* Update Goods Receipt, Purchase Order, Inventory, dan Inventory Movement dilakukan dalam satu database transaction.

### ERD

ERD project dapat dilihat pada:

**[ERD Diagram](https://drive.google.com/file/d/1gCEme-s_ni844P6MsNlArT1_Jmy24o54/view?usp=sharing)**

### Entity Utama

* `users`
* `products`
* `suppliers`
* `warehouses`
* `inventories`
* `inventory_movements`
* `purchase_requests`
* `purchase_request_items`
* `purchase_orders`
* `purchase_order_items`
* `goods_receipts`
* `goods_receipt_items`

## Role & Authorization

System menggunakan tiga role:

| Role       | Tanggung Jawab                                                         |
| ---------- | ---------------------------------------------------------------------- |
| `USER`     | Menjalankan aktivitas procurement operasional                          |
| `APPROVER` | Review dan approval Purchase Request                                   |
| `ADMIN`    | Mengelola master data dan melihat data transaksi untuk troubleshooting |

`USER` dan `APPROVER` merupakan role yang disebutkan pada case study. `ADMIN` merupakan role tambahan yang digunakan untuk pengelolaan master data.

Detail role segregation dapat dilihat pada:

**[Role Segregation](https://docs.google.com/spreadsheets/d/1gOU5UhV-vX25M8Zlqm_UX0UWeJK9Y1TiF1nH1ItombU/edit?usp=sharing)**

### USER

USER dapat:

* Membuat Purchase Request.
* Mengubah Purchase Request miliknya selama masih `DRAFT`.
* Submit Purchase Request.
* Melihat data procurement yang berkaitan dengan aktivitasnya.
* Membuat Purchase Order dari Purchase Request yang telah `APPROVED`.
* Menandai Purchase Order sebagai `ORDERED`.
* Membuat Goods Receipt.

### APPROVER

APPROVER dapat:

* Melihat Purchase Request.
* Approve Purchase Request dengan status `SUBMITTED`.
* Reject Purchase Request dengan status `SUBMITTED`.
* Melihat data transaksi untuk kebutuhan approval dan monitoring.

### ADMIN

ADMIN dapat:

* Membuat Product, Supplier, dan Warehouse.
* Melihat master data.
* Mengubah master data.
* Melihat data transaksi untuk kebutuhan troubleshooting.

ADMIN tidak berpartisipasi dalam workflow procurement dan tidak dapat:

* Membuat atau mengubah Purchase Request.
* Submit Purchase Request.
* Approve atau reject Purchase Request.
* Membuat Purchase Order.
* Mencatat Goods Receipt.

## Asumsi

### 1. Role dan authorization ownership

System menggunakan tiga role: `USER`, `APPROVER`, dan `ADMIN`.

`USER` dan `APPROVER` merupakan role yang secara eksplisit dibutuhkan oleh case study. `ADMIN` merupakan role tambahan untuk mengelola master data dan membantu kebutuhan read-only operational troubleshooting.

* `USER` bertanggung jawab atas aktivitas procurement operasionalnya sendiri, termasuk Purchase Request, submission, melihat data procurement, dan Goods Receipt.
* `APPROVER` bertanggung jawab melakukan review serta approve atau reject Purchase Request yang telah di-submit.
* `ADMIN` bertanggung jawab terhadap master data dan dapat melihat data transaksi untuk kebutuhan troubleshooting.

### 2. Transaction authorization

`ADMIN` tidak berpartisipasi dalam workflow transaksi procurement dan tidak dapat melakukan perubahan transaksi seperti:

* Membuat atau mengubah Purchase Request.
* Approve atau reject Purchase Request.
* Membuat Purchase Order.
* Mencatat Goods Receipt.

Pemisahan ini digunakan untuk menjaga tanggung jawab antar-role tetap jelas dan mengurangi risiko perubahan transaksi oleh pihak yang tidak memiliki kewenangan.

### 3. Master data management

`ADMIN` dapat membuat, melihat, dan mengubah:

* Product
* Supplier
* Warehouse

Penghapusan master data tidak disediakan karena data tersebut dapat telah direferensikan oleh transaksi.

Sebagai gantinya, master data memiliki field `is_active` untuk menonaktifkan data sehingga tidak digunakan pada transaksi baru.

### 4. Purchase Order ownership

Purchase Order hanya dapat dibuat dari Purchase Request dengan status `APPROVED`.

Purchase Order dibuat oleh `USER` yang bertanggung jawab terhadap proses procurement, dengan Supplier dipilih pada saat PO dibuat.

### 5. Scope of additional business rules

Business rules tambahan pada implementasi ini hanya digunakan untuk memperjelas:

* Role ownership.
* Authorization.
* API behavior.
* Data integrity.

Business rules tersebut tidak dimaksudkan untuk menambahkan fitur procurement di luar scope utama case study.

### 6. Rejected Purchase Request

Purchase Request yang telah `REJECTED` dianggap final.

Purchase Request yang telah ditolak:

* Tidak dapat diedit.
* Tidak dapat di-submit kembali.

Jika kebutuhan procurement masih diperlukan, `USER` perlu membuat Purchase Request baru.

### 7. Purchase Order cancellation

Case study mendefinisikan `CANCELLED` sebagai salah satu status Purchase Order, tetapi tidak mendefinisikan API cancellation maupun role yang memiliki kewenangan untuk melakukan cancellation.

Oleh karena itu, cancellation berada di luar workflow yang diimplementasikan pada project ini.

## Engineering Decisions

### Raw SQL

Project menggunakan raw SQL melalui `mysql2` dibandingkan ORM.

Alasannya:

* Query database dapat dikontrol secara langsung.
* Relasi dan constraint database dapat terlihat dengan jelas.
* Memudahkan penggunaan transaction dan row locking.
* Memudahkan analisis query menggunakan `EXPLAIN`.

### Inventory dipisahkan dari Product

Stock tidak disimpan pada tabel `products`.

Inventory bergantung pada kombinasi:

```text
Product + Warehouse
```

Sehingga satu product dapat memiliki jumlah stock yang berbeda pada warehouse yang berbeda.

Contoh:

```text
Product A
├── Warehouse Jakarta → 100
├── Warehouse Bandung → 50
└── Warehouse Surabaya → 25
```

Hal ini direpresentasikan melalui unique constraint pada:

```text
(product_id, warehouse_id)
```

### Goods Receipt menggunakan Database Transaction

Goods Receipt melakukan beberapa perubahan data sekaligus:

```text
Goods Receipt
      ↓
Purchase Order Item
      ↓
Purchase Order Status
      ↓
Inventory
      ↓
Inventory Movement
```

Perubahan tersebut dilakukan dalam satu transaction.

Jika salah satu operasi gagal, seluruh perubahan di-rollback untuk menghindari kondisi data yang tidak konsisten.

Purchase Order dan item terkait juga menggunakan row locking saat proses Goods Receipt untuk membantu mencegah race condition ketika terdapat concurrent receipt.

### Purchase Order Status

Status Purchase Order ditentukan berdasarkan jumlah barang yang telah diterima.

```text
Tidak ada receipt
      ↓
   ORDERED

Sebagian quantity diterima
      ↓
PARTIALLY_RECEIVED

Seluruh quantity diterima
      ↓
   RECEIVED
```

Dengan pendekatan ini, status PO merepresentasikan kondisi penerimaan barang berdasarkan data `received_quantity`.

### Master Data menggunakan `is_active`

Product, Supplier, dan Warehouse tidak dihapus secara fisik.

Sebagai gantinya digunakan:

```text
is_active
```

Hal ini mempertahankan referensi historical transaction tanpa menghapus data master yang sudah digunakan oleh transaksi sebelumnya.

### Cursor-based Retrieval

Endpoint yang membutuhkan pengambilan data mendukung filter dan cursor-based retrieval.

Pendekatan ini dipilih dibandingkan offset-based pagination karena lebih sesuai untuk navigasi dataset yang dapat berjumlah besar.

Pada offset pagination, ketika client meminta data pada offset yang semakin jauh, database tetap perlu melewati record-record sebelumnya. Cursor-based retrieval menggunakan posisi record sebelumnya sebagai titik awal pengambilan data sehingga lebih sesuai untuk traversal data dalam jumlah besar.

Filter tetap disediakan agar client dapat mempersempit dataset sebelum melakukan traversal menggunakan cursor.

### Separation of Business Logic and Database Access

Service layer bertanggung jawab terhadap business rules, sedangkan repository bertanggung jawab terhadap query database.

Contoh:

```text
Goods Receipt Service
    ├── Validate PO status
    ├── Validate received quantity
    ├── Calculate PO status
    └── Execute transaction

Goods Receipt Repository
    ├── Insert GR
    ├── Update PO items
    ├── Update PO
    ├── Update inventory
    └── Insert movement
```

Pendekatan ini membuat business logic lebih mudah diuji tanpa mencampurkan HTTP handling dengan database access.

## Installation

### Requirements

Pastikan environment sudah memiliki:

* Node.js
* npm
* MySQL

### Clone Repository

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

### Install Dependencies

```bash
npm install
```

## Environment Variables

Buat file `.env` berdasarkan `.env.example`.

Contoh:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_db

JWT_SECRET=your-secret-key
```

Sesuaikan konfigurasi database dengan environment lokal.

## Database Migration

Jalankan migration:

```bash
npm run migrate
```

Migration akan membuat tabel-tabel yang dibutuhkan oleh aplikasi.

## Database Seed

Setelah migration selesai, jalankan:

```bash
npm run seed
```

Seed akan membuat user yang dibutuhkan untuk menjalankan workflow dan melakukan testing API.

## Menjalankan Application

Untuk menjalankan aplikasi:

```bash
npm run start
```

Default API tersedia pada:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

## Testing

Automated test dijalankan menggunakan Vitest.

Jalankan:

```bash
npm test
```

Test mencakup business rules utama yang ditentukan pada case study:

1. Purchase Request tidak dapat di-submit tanpa item.
2. Purchase Request yang bukan `SUBMITTED` tidak dapat di-approve.
3. Purchase Order tidak dapat dibuat dari Purchase Request yang belum `APPROVED`.
4. Satu Purchase Request tidak dapat dibuat menjadi lebih dari satu Purchase Order.
5. Goods Receipt tidak dapat menerima quantity yang lebih besar dari quantity yang dipesan.
6. Goods Receipt menambah stock pada warehouse yang sesuai.
7. Purchase Order berubah menjadi `RECEIVED` ketika seluruh quantity telah diterima.

Goods Receipt juga diuji sebagai integration flow karena proses tersebut melibatkan beberapa tabel dan harus menjaga konsistensi antara:

```text
Goods Receipt
Purchase Order
Inventory
Inventory Movement
```

## API Documentation

API documentation tersedia menggunakan Swagger UI.

Setelah aplikasi berjalan, buka:

```text
http://localhost:3000/api-docs
```

Swagger menyediakan dokumentasi endpoint, request body, response, dan authentication scheme.

### Authentication pada Swagger

1. Jalankan endpoint:

```text
POST /auth/login
```

2. Gunakan credential user yang tersedia dari seed.
3. Copy JWT token dari response.
4. Klik **Authorize** pada Swagger UI.
5. Masukkan token menggunakan format:

```text
Bearer <JWT_TOKEN>
```

6. Endpoint yang membutuhkan authentication dapat digunakan setelah authorization berhasil.

## Procurement Workflow

Workflow utama dapat dijalankan dengan urutan:

```text
1. Login
   ↓
2. Create Purchase Request
   ↓
3. Add Purchase Request Items
   ↓
4. Submit Purchase Request
   ↓
5. Approve Purchase Request
   ↓
6. Create Purchase Order
   ↓
7. Mark Purchase Order as ORDERED
   ↓
8. Create partial Goods Receipt
   ↓
9. Inventory increases
   ↓
10. Create remaining Goods Receipt
   ↓
11. Purchase Order becomes RECEIVED
```

## API Resources

Resource utama yang tersedia:

| Resource               | Keterangan                                      |
| ---------------------- | ----------------------------------------------- |
| `/auth`                | Authentication dan user information             |
| `/products`            | Product master data                             |
| `/suppliers`           | Supplier master data                            |
| `/warehouses`          | Warehouse master data                           |
| `/inventory`           | Current stock berdasarkan product dan warehouse |
| `/inventory/movements` | Riwayat inventory movement                      |
| `/purchase-requests`   | Purchase Request                                |
| `/purchase-orders`     | Purchase Order                                  |
| `/goods-receipts`      | Goods Receipt                                   |

Detail endpoint, request, dan response tersedia melalui Swagger UI.

## Out of Scope

Hal-hal berikut tidak diimplementasikan karena tidak diperlukan oleh core workflow atau tidak didefinisikan secara cukup pada case study:

* Purchase Order cancellation API.
* Purchase Request resubmission setelah rejection.
* Penghapusan master data secara fisik.
* Payment atau invoice processing.
* Supplier quotation/comparison workflow.
* Advanced audit trail.
* Notification system.
* Idempotency key untuk seluruh endpoint.
* Reporting atau dashboard analytics.

Fitur-fitur tersebut dapat dikembangkan lebih lanjut jika requirement bisnis diperluas.

## Submission Notes

Project ini berfokus pada core procurement workflow, data integrity, authorization, transaction handling, dan automated testing terhadap business rules utama.

Diagram ERD dan role segregation disediakan sebagai bagian dari dokumentasi desain:

* **ERD:** <https://drive.google.com/file/d/1gCEme-s_ni844P6MsNlArT1_Jmy24o54/view?usp=sharing>
* **Role Segregation:** <https://docs.google.com/spreadsheets/d/1gOU5UhV-vX25M8Zlqm_UX0UWeJK9Y1TiF1nH1ItombU/edit?usp=sharing>
