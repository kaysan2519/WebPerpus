import { PrismaClient, Role, CopyStatus, LoanStatus, FineStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for PerpusKita Digital Library...');

  // 1. Seed Categories
  const categories = [
    { name: 'Pengembangan Diri', slug: 'pengembangan-diri', description: 'Buku peningkatan kualitas hidup, produktivitas, dan mindset.' },
    { name: 'Fiksi & Sastra', slug: 'fiksi-sastra', description: 'Karya sastra fiksi, novel, antologi cerpen kontemporer dan klasik.' },
    { name: 'Sejarah & Humaniora', slug: 'sejarah-humaniora', description: 'Sejarah dunia, peradaban nusantara, dan kajian kebudayaan.' },
    { name: 'Psikologi & Filsafat', slug: 'psikologi-filsafat', description: 'Kajian pemikiran stoikisme, kesehatan mental, dan perilaku manusia.' },
    { name: 'Teknologi & Desain', slug: 'teknologi-desain', description: 'Arsitektur perangkat lunak, pemrograman modern, dan interaksi manusia-komputer.' },
    { name: 'Bisnis & Finansial', slug: 'bisnis-finansial', description: 'Ekonomi, keuangan pribadi, strategi investasi, dan kepemimpinan.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`✅ Seeded ${categories.length} categories.`);

  // 2. Seed Authors
  const authors = [
    { name: 'James Clear', bio: 'Penulis dan pembicara ahli dalam pembentukan kebiasaan hidup produktif.' },
    { name: 'Leila S. Chudori', bio: 'Wartawati senior dan sastrawati peraih berbagai penghargaan sastra nasional.' },
    { name: 'Pramoedya Ananta Toer', bio: 'Sastrawan legendaris Indonesia, dinominasikan beberapa kali untuk Nobel Sastra.' },
    { name: 'Yuval Noah Harari', bio: 'Sejarawan dan filsuf asal Universitas Ibrani Yerusalem.' },
    { name: 'Henry Manampiring', bio: 'Praktisi periklanan dan penulis buku best seller stoisisme Filosofi Teras.' },
    { name: 'Martin Fowler', bio: 'Ahli arsitektur software terkemuka dan penulis buku Refactoring.' },
    { name: 'Robert C. Martin', bio: 'Dikenal sebagai Uncle Bob, pelopor Agile Manifesto dan Clean Code.' },
    { name: 'Morgan Housel', bio: 'Partner di Collaborative Fund dan mantan kolumnis di The Wall Street Journal.' },
  ];

  const authorMap = new Map<string, string>();
  for (const auth of authors) {
    const record = await prisma.author.upsert({
      where: { name: auth.name },
      update: { bio: auth.bio },
      create: auth,
    });
    authorMap.set(auth.name, record.id);
  }
  console.log(`✅ Seeded ${authors.length} authors.`);

  // 3. Seed Publishers
  const publishers = [
    { name: 'Penguin Random House', address: 'New York, USA' },
    { name: 'Kepustakaan Populer Gramedia', address: 'Jakarta, Indonesia' },
    { name: 'Lentera Dipantara', address: 'Jakarta, Indonesia' },
    { name: 'HarperCollins', address: 'New York, USA' },
    { name: 'Penerbit Kompas', address: 'Jakarta, Indonesia' },
    { name: 'Addison-Wesley Professional', address: 'Boston, USA' },
    { name: 'Prentice Hall', address: 'New Jersey, USA' },
    { name: 'Penerbit Baca', address: 'Tangerang Selatan, Indonesia' },
  ];

  const publisherMap = new Map<string, string>();
  for (const pub of publishers) {
    const record = await prisma.publisher.upsert({
      where: { name: pub.name },
      update: { address: pub.address },
      create: pub,
    });
    publisherMap.set(pub.name, record.id);
  }
  console.log(`✅ Seeded ${publishers.length} publishers.`);

  // 4. Seed Users (Roles: ADMIN, LIBRARIAN, MEMBER)
  const users = [
    {
      clerkId: 'user_admin_demo',
      email: 'admin@perpuskita.id',
      name: 'Kaysan Rafif (Admin)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: Role.ADMIN,
      memberId: 'PK-ADM-001',
      phone: '+6281234567001',
      address: 'Gedung Perpustakaan Pusat PerpusKita Lt. 3',
    },
    {
      clerkId: 'user_librarian_demo',
      email: 'pustakawan@perpuskita.id',
      name: 'Siti Rahmawati (Pustakawan)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      role: Role.LIBRARIAN,
      memberId: 'PK-LIB-001',
      phone: '+6281234567002',
      address: 'Meja Sirkulasi & Preservasi Koleksi',
    },
    {
      clerkId: 'user_member_demo',
      email: 'ahmad.fauzi@perpuskita.id',
      name: 'Ahmad Fauzi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: Role.MEMBER,
      memberId: 'PK-2024-8841',
      phone: '+6281234567890',
      address: 'Jl. Merdeka No. 45, Jakarta Pusat',
    },
  ];

  const userRecords: Record<string, string> = {};
  for (const u of users) {
    const record = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        avatar: u.avatar,
        phone: u.phone,
        address: u.address,
      },
      create: u,
    });
    userRecords[u.role] = record.id;
  }
  console.log(`✅ Seeded ${users.length} initial users.`);

  // 5. Seed Curated Books & Copies
  const curatedBooks = [
    {
      isbn: '978-602-06-3317-6',
      title: 'Atomic Habits',
      slug: 'atomic-habits',
      description: 'Atomic Habits adalah panduan praktis dan teruji tentang bagaimana perubahan kecil yang konsisten dapat menghasilkan hasil luar biasa dalam jangka panjang. Memaparkan cara membangun kebiasaan baik dan mengeliminasi kebiasaan destruktif.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
      pages: 320,
      publishYear: 2018,
      language: 'id',
      shelfLocation: 'Rak D-04 (Self Improvement)',
      isPopular: true,
      isEditorChoice: true,
      categorySlug: 'pengembangan-diri',
      authorName: 'James Clear',
      publisherName: 'Penguin Random House',
      copiesCount: 4,
    },
    {
      isbn: '978-602-424-694-5',
      title: 'Laut Bercerita',
      slug: 'laut-bercerita',
      description: 'Laut Bercerita menceritakan tentang hilangnya para aktivis mahasiswa di era Orde Baru pada tahun 1998 melalui sudut pandang Biru Laut dan keluarganya. Sebuah adikarya sastra kontemporer yang sarat akan rasa kehilangan dan keteguhan.',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80',
      pages: 394,
      publishYear: 2017,
      language: 'id',
      shelfLocation: 'Rak A-12 (Sastra Indonesia)',
      isPopular: true,
      isEditorChoice: true,
      categorySlug: 'fiksi-sastra',
      authorName: 'Leila S. Chudori',
      publisherName: 'Kepustakaan Populer Gramedia',
      copiesCount: 3,
    },
    {
      isbn: '978-979-97312-3-4',
      title: 'Bumi Manusia',
      slug: 'bumi-manusia',
      description: 'Bumi Manusia adalah roman pembuka Tetralogi Buru. Mengisahkan Minke, pemuda priyayi cerdas, dan pergulatan hidupnya menghadapi feodalisme, rasisme era kolonial Belanda, dan cintanya kepada Annelies Mellema.',
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
      pages: 535,
      publishYear: 1980,
      language: 'id',
      shelfLocation: 'Rak B-01 (Koleksi Sastra Klasik)',
      isPopular: true,
      isEditorChoice: true,
      categorySlug: 'sejarah-humaniora',
      authorName: 'Pramoedya Ananta Toer',
      publisherName: 'Lentera Dipantara',
      copiesCount: 3,
    },
    {
      isbn: '978-602-424-416-3',
      title: 'Sapiens: Riwayat Singkat Umat Manusia',
      slug: 'sapiens',
      description: 'Bagaimana spesies kera yang tidak mencolok dapat mendominasi planet Bumi? Harari menelusuri sejarah evolusi manusia dari Revolusi Kognitif, Revolusi Pertanian, hingga masa kecerdasan buatan.',
      coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80',
      pages: 512,
      publishYear: 2014,
      language: 'id',
      shelfLocation: 'Rak S-03 (Sejarah Dunia)',
      isPopular: true,
      isEditorChoice: true,
      categorySlug: 'sejarah-humaniora',
      authorName: 'Yuval Noah Harari',
      publisherName: 'HarperCollins',
      copiesCount: 2,
    },
    {
      isbn: '978-602-412-518-9',
      title: 'Filosofi Teras',
      slug: 'filosofi-teras',
      description: 'Penerapan praktis filsafat Stoa kuno untuk mengatasi kekhawatiran zaman modern. Mengajarkan seni membedakan apa yang berada di bawah kendali kita dan apa yang berada di luar kendali kita.',
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=700&q=80',
      pages: 346,
      publishYear: 2018,
      language: 'id',
      shelfLocation: 'Rak P-02 (Filsafat Praktis)',
      isPopular: true,
      isEditorChoice: false,
      categorySlug: 'psikologi-filsafat',
      authorName: 'Henry Manampiring',
      publisherName: 'Penerbit Kompas',
      copiesCount: 3,
    },
    {
      isbn: '978-0-13-235088-4',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      slug: 'clean-code',
      description: 'Buku standar industri rekayasa perangkat lunak tentang penulisan kode yang bersih, mudah dirawat, dan profesional. Dilengkapi teknik refactoring mendalam dan studi kasus.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=80',
      pages: 464,
      publishYear: 2008,
      language: 'en',
      shelfLocation: 'Rak T-02 (Teknologi Informasi)',
      isPopular: true,
      isEditorChoice: true,
      categorySlug: 'teknologi-desain',
      authorName: 'Robert C. Martin',
      publisherName: 'Prentice Hall',
      copiesCount: 4,
    },
    {
      isbn: '978-0-20-148567-7',
      title: 'Refactoring: Improving the Design of Existing Code',
      slug: 'refactoring',
      description: 'Karya fundamental Martin Fowler yang memetakan teknik restrukturisasi kode tanpa mengubah perilaku eksternal, meningkatkan performa dan keterbacaan jangka panjang.',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80',
      pages: 448,
      publishYear: 1999,
      language: 'en',
      shelfLocation: 'Rak T-05 (Software Engineering)',
      isPopular: false,
      isEditorChoice: true,
      categorySlug: 'teknologi-desain',
      authorName: 'Martin Fowler',
      publisherName: 'Addison-Wesley Professional',
      copiesCount: 2,
    },
    {
      isbn: '978-623-00-2640-9',
      title: 'The Psychology of Money',
      slug: 'the-psychology-of-money',
      description: 'Pelajaran abadi mengenai kekayaan, keserakahan, dan kebahagiaan. Bagaimana mengelola uang bukanlah persoalan matematika semata melainkan kendali atas perilaku emosional.',
      coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=700&q=80',
      pages: 262,
      publishYear: 2020,
      language: 'id',
      shelfLocation: 'Rak B-04 (Finansial & Bisnis)',
      isPopular: true,
      isEditorChoice: false,
      categorySlug: 'bisnis-finansial',
      authorName: 'Morgan Housel',
      publisherName: 'Penerbit Baca',
      copiesCount: 3,
    },
  ];

  const bookRecords: any[] = [];

  for (const book of curatedBooks) {
    const categoryId = categoryMap.get(book.categorySlug)!;
    const authorId = authorMap.get(book.authorName)!;
    const publisherId = publisherMap.get(book.publisherName)!;

    const bookRecord = await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        slug: book.slug,
        description: book.description,
        coverImage: book.coverImage,
        pages: book.pages,
        publishYear: book.publishYear,
        language: book.language,
        shelfLocation: book.shelfLocation,
        isPopular: book.isPopular,
        isEditorChoice: book.isEditorChoice,
        categoryId,
        authorId,
        publisherId,
      },
      create: {
        isbn: book.isbn,
        title: book.title,
        slug: book.slug,
        description: book.description,
        coverImage: book.coverImage,
        pages: book.pages,
        publishYear: book.publishYear,
        language: book.language,
        shelfLocation: book.shelfLocation,
        isPopular: book.isPopular,
        isEditorChoice: book.isEditorChoice,
        categoryId,
        authorId,
        publisherId,
      },
    });

    bookRecords.push(bookRecord);

    // Create book copies if not exists
    for (let i = 1; i <= book.copiesCount; i++) {
      const barcode = `BC-${book.slug.substring(0, 4).toUpperCase()}-${String(i).padStart(2, '0')}`;
      await prisma.bookCopy.upsert({
        where: { barcode },
        update: {},
        create: {
          bookId: bookRecord.id,
          barcode,
          status: i === 1 && book.slug === 'laut-bercerita' ? CopyStatus.BORROWED : CopyStatus.AVAILABLE,
          condition: 'Baik',
        },
      });
    }
  }
  console.log(`✅ Seeded ${curatedBooks.length} curated books with physical copies.`);

  // 6. Seed Sample Active Loan & Loan History
  const memberUserId = userRecords[Role.MEMBER];
  if (memberUserId && bookRecords.length > 1) {
    const targetCopy = await prisma.bookCopy.findFirst({
      where: { book: { slug: 'laut-bercerita' } },
    });

    if (targetCopy) {
      const loanRecord = await prisma.loan.upsert({
        where: { loanNumber: 'LN-202610-001' },
        update: {},
        create: {
          loanNumber: 'LN-202610-001',
          userId: memberUserId,
          borrowDate: new Date('2026-09-25T08:30:00Z'),
          dueDate: new Date('2026-10-09T23:59:59Z'),
          status: LoanStatus.BORROWED,
          renewCount: 0,
          notes: 'Peminjaman koleksi sastra untuk tugas telaah esai.',
          items: {
            create: {
              bookCopyId: targetCopy.id,
            },
          },
        },
      });

      // Seed Activity Log
      await prisma.activityLog.create({
        data: {
          userId: memberUserId,
          action: 'BORROW',
          description: `Meminjam buku "Laut Bercerita" (Barcode: ${targetCopy.barcode})`,
        },
      });
    }
  }

  // 7. Seed Reviews
  if (memberUserId && bookRecords[0]) {
    await prisma.review.upsert({
      where: {
        id: 'rev-atomic-habits-01',
      },
      update: {},
      create: {
        id: 'rev-atomic-habits-01',
        userId: memberUserId,
        bookId: bookRecords[0].id,
        rating: 5,
        comment: 'Buku yang sangat mengubah cara pandang saya mengenai rutinitas harian. Penjelasannya sangat aplikatif dan mudah diterapkan.',
        likes: 12,
      },
    });
  }

  console.log('✨ PerpusKita database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
