# Monitoring Teltonika
Program Untuk Melakukan Monitoring Terhadap Perangkat Teltonika Untuk Implementasi Pada Model Bisnis Tracking Cooling Truck dan Cold Storage

## Fitur-fitur:
* Login
  
  [ Login Screen ]![Screenshot 2024-10-04 065006](https://github.com/user-attachments/assets/d1c938e5-ece9-435f-9ec1-95b44f065b36)
* Lupa Password
  -Fitur untuk mengubah password bagi role klien, kredensial merupakan verifikasi dalam bentuk OTP yang akan dikirimkan ke     email bersangkutan(sesuai input pada kolom email)
  
  [ Insert Email Screen ]![Screenshot 2024-10-04 065020](https://github.com/user-attachments/assets/981498c5-8c6c-4dab-92cf-21498be9f71d)
  [ OTP Screen ]![Screenshot 2024-10-04 065033](https://github.com/user-attachments/assets/5067d724-057b-4167-ac23-d7fd8b36413c)

* Dashboard Admin
  -Menampilkan Map Untuk Cold Storage dan Truck Cooling(icon/marker yang berbeda dalam 1 peta)
  -Saat icon/ marker diklik, muncul modal/ popup informasi : Client, Waktu, Lokasi, Suhu, Barang, Storage
* Dashboard Client
  -Menampilkan Map Untuk Cold Storage dan Truck Cooling(icon/marker yang berbeda dalam 1 peta)
  -Saat icon/ marker diklik, muncul modal/ popup informasi : Waktu, Lokasi, Suhu, Barang, Storage
  
  [ Dashboard Screen ]![Screenshot 2024-10-04 064703](https://github.com/user-attachments/assets/cef29d35-a04b-4fe3-bac4-1034dd14d13d)

* Riwayat
  -Menampilkan suhu untuk yang cold storage dan truck cooling --> grafik
  -Menampilkan Peta untuk truck cooling dalam bentuk rute yang telah dilalui (bisa si save setelah selesai)
  -Menampilkan riwayat kondisi alat (nyala/ mati) --> grafik
  -Mengatur Interval penampilkan Riwayat (interval sending data diatur statis)
  
  [ Riwayat Input and Tracked Maps Screen ]![Screenshot 2024-10-04 064817](https://github.com/user-attachments/assets/5ec2b5ea-8294-41d5-ad54-90beee6123a9)
  [ Chart Suhu and Teltonika Status Screen ]![Screenshot 2024-10-04 064845](https://github.com/user-attachments/assets/4a75a7e5-93bc-448d-86cb-fc761bdab7ee)

* Kelola Client[ Admin ]
  -Fitur pada role admin untuk melakukan pengelolaan terhadap klien yang ada, pada fitur ini admin dapat saja melakukan         suspend, delete, serta update terhadap klien yang terdaftar
  
* Kelola Alat[ Admin ]
  -Fitur pada role admin untuk menambahkan dan menghapuskan alat Teltonika yang terdaftar

## Instalasi dan Pemakaian

### Website Access
#### https://monitoring-teltonika-fe.vercel.app/

### Local Run

Prerequisites:
-Node.js v20.17.0

Step-by-Step[ Windows ]:

1. ` git clone https://github.com/ridhofrd/monitoringTeltonika.git`

2. `cd project-truck-cooling/back-end`
   
3. `npm install`
   
4. `npm start`
   
5. `cd ..`
   
6. `cd front-end`
   
7. `npm install`
   
8. `npm start`

[ Catatan: back-end dan front-end pada local run mungkin saja tidak tersinkronisasi! ]
