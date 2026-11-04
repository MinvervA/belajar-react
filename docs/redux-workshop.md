# Migrasi Redux Toolkit dan RTK Query

Implementasi ini melanjutkan hasil migrasi Tailwind pada proyek yang sama. Tidak ada perubahan router, endpoint server, warna, layout, atau tipe domain pizza/pesanan. `CartItem` dipindahkan dari file Context ke `APIResponseType.ts` tanpa mengubah bentuknya.

## Arsitektur akhir

- `src/store.ts`: `combineSlices`, `makeStore(preloadedState)`, middleware API, tipe store/dispatch, integrasi Redux DevTools pada mode development.
- `src/hooks.ts`: hook React Redux bertipe melalui `.withTypes()`.
- `src/features/cartSlice.ts`: tambah/kosongkan cart, selector cart dan jumlah item.
- `src/features/orderSlice.ts`: tipe serta ukuran pizza, dengan selector masing-masing.
- `src/api/pizzaApi.ts`: enam endpoint `getPizzas`, `getPizzaOfTheDay`, `getPastOrders`, `getPastOrder`, `placeOrder`, dan `postContact`.
- `App.tsx`: satu Provider Redux. Header membaca selector jumlah item; Order membaca state pilihan dan cart.
- `page` dan `focusedOrder` tetap state lokal Past Orders. Modal dan komponen tampilan tetap menggunakan implementasi Tailwind sebelumnya.
- Context cart, tiga helper fetch lama, QueryClientProvider, TanStack Query DevTools, dan dependensi TanStack Query dihapus. TanStack Router beserta devtools router tetap dipakai.

## Perubahan perilaku yang disengaja

1. Pilihan tipe/ukuran pizza bertahan saat berpindah halaman. Reload browser tetap mengembalikan default `pepperoni`/`M`; tidak ada localStorage.
2. Penundaan buatan 3 detik sebelum mengambil daftar pizza dihapus. Status loading kini mengikuti request sebenarnya dan cache RTK Query.

Perbaikan terkait migrasi: checkout berhasil mengosongkan cart dan menginvalidasi seluruh halaman riwayat. Checkout gagal mempertahankan cart dan menampilkan pesan error. Tombol checkout/add dinonaktifkan selama checkout. Contact menampilkan error yang bisa dicoba kembali dan mencegah submit saat request berjalan.

## Cache dan pagination

`currentData` hanya menampilkan data untuk argumen halaman/id saat ini. Ketika membuka halaman yang belum ada di cache, loading ditampilkan, bukan baris halaman sebelumnya. Data halaman yang sudah di-cache dapat langsung ditampilkan. `refetchOnMountOrArgChange: 30` memeriksa umur hasil terakhir untuk daftar riwayat; detail memakai 86400 detik. Retensi cache dan usia refetch adalah dua pengaturan yang berbeda.

`providesTags: ["PastOrders"]` menghubungkan semua halaman daftar ke mutation checkout. Hanya respons checkout yang berhasil menginvalidasi tag. Subscription aktif di-refetch; cache tidak aktif dibuang dan diambil ulang ketika dibuka.

## Praktik DevTools

Jalankan `npm run dev`, buka aplikasi dan Redux DevTools extension yang sudah dipasang di browser. Store mengaktifkan integrasi DevTools hanya pada mode development.

1. Tambahkan pizza: lihat `cart/addToCart` dan perubahan `cart`.
2. Ubah tipe/ukuran: lihat `order/setPizzaType` dan `order/setPizzaSize`.
3. Buka riwayat: lihat `pizzaApi/executeQuery/pending` lalu `fulfilled` dan cache per argumen.
4. Checkout: lihat mutation, invalidasi daftar, dan `cart/clearCart` setelah sukses.
5. Bandingkan request gagal: action `rejected`, pesan error, cart tetap ada.

Integrasi action DevTools dapat diperiksa dengan hook pengujian; pemasangan extension browser tidak dilakukan otomatis.

## Pengujian

```sh
npm run typecheck
npm run lint
npx vitest run
npm run build
npm run lint
```

Tujuh tes awal dipertahankan. Tes Contact dan Pizza of the Day menggunakan Provider/store terisolasi, serta memeriksa objek `Request` yang dikirim `fetchBaseQuery`. Tiga file tambahan menguji slice/store, deduplikasi/cache/invalidation, dan pagination saat request berikutnya belum selesai. Total: 10 file, 12 tes.

Pemeriksaan `npm ci` dilakukan dengan salinan package.json/package-lock.json di direktori sementara, tanpa mengganti node_modules proyek aktif.

## Catatan dependensi

Versi baru dipatok: `@reduxjs/toolkit` 2.13.0 dan `react-redux` 9.3.0. npm masih memberi peringatan peer dependency dari `@tanstack/react-store` 0.5.8 (dependensi router lama) terhadap React 19. Instalasi melaporkan 30 temuan audit (17 moderate, 6 high, 7 critical); upgrade dependensi di luar migrasi ini belum dilakukan.

Build mempertahankan URL font `/public/Pacifico-Regular.ttf` untuk disajikan server saat runtime. Server deployment tetap perlu menyediakan `/api` dan `/public`. Bundle entry setelah migrasi sekitar 409.73 kB (gzip 128.91 kB), dibanding 355.26 kB (gzip 108.82 kB) sebelum migrasi.

## Referensi

- [Redux Toolkit combineSlices](https://redux.js.org/toolkit/api/combineSlices)
- [Typed React Redux hooks](https://redux.js.org/usage/usage-with-typescript)
- [RTK Query automated refetching](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching)

## Hasil verifikasi implementasi

- Typecheck, lint sebelum/sesudah build, 12 tes dalam 10 file, build, dan `npm ci` terisolasi lulus.
- Smoke test Chromium dengan API simulasi lulus: persistensi pilihan antarhalaman, badge, checkout gagal/sukses, invalidasi riwayat tanpa reload, cache/loading pagination, detail modal, Contact gagal/retry, dan error boundary.
- Hook DevTools pengujian menerima action slice, query pending/fulfilled, mutation rejected/fulfilled, serta pembuangan cache setelah invalidasi. Ini memverifikasi integrasi, bukan instalasi extension browser.
- Tidak ada overflow halaman pada 390, 768, dan 1280px untuk Home, Order, Past Orders, dan Contact.
- Respons 500 pada smoke test disengaja untuk memeriksa jalur error. Pengiriman checkout/Contact nyata ke database tidak dilakukan.
