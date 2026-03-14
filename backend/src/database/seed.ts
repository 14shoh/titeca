import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Product } from '../companies/entities/product.entity';
import { Exhibition } from '../exhibitions/entities/exhibition.entity';
import { ExhibitionProgram } from '../exhibitions/entities/exhibition-program.entity';
import { ExhibitionParticipant } from '../exhibitions/entities/exhibition-participant.entity';
import { Booth } from '../booths/entities/booth.entity';
import { BoothReservation } from '../reservations/entities/booth-reservation.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Application } from '../applications/entities/application.entity';
import { ApplicationDocument } from '../applications/entities/application-document.entity';
import { News } from '../news/entities/news.entity';
import { Banner } from '../banners/entities/banner.entity';
import { Message } from '../messages/entities/message.entity';
import { Partner } from '../partners/entities/partner.entity';

import { Role } from '../common/enums/role.enum';
import { Industry } from '../common/enums/industry.enum';
import { ExhibitionStatus } from '../common/enums/exhibition-status.enum';
import { BoothStatus } from '../common/enums/booth-status.enum';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { ApplicationStatus } from '../common/enums/application-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

// Load .env manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) {
    console.warn('.env not found — using defaults. Copy .env.example to .env first.');
    return;
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'titeca',
  entities: [
    User, Company, Product,
    Exhibition, ExhibitionProgram, ExhibitionParticipant,
    Booth, BoothReservation, Payment,
    Application, ApplicationDocument,
    News, Banner, Message, Partner,
  ],
  synchronize: true,
  logging: false,
});

async function seed() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Connected.\n');

  // ─── Clear all tables (order matters: children before parents) ────────────
  console.log('Clearing existing data...');
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const entity of [
    'application_documents', 'applications',
    'payments', 'booth_reservations', 'booths',
    'exhibition_participants', 'exhibition_programs',
    'products', 'companies',
    'messages', 'news', 'banners', 'partners',
    'exhibitions', 'users',
  ]) {
    await AppDataSource.query(`TRUNCATE TABLE \`${entity}\``);
  }
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Tables cleared.\n');

  const hash = (pwd: string) => bcrypt.hash(pwd, 10);

  // ─── 1. USERS ─────────────────────────────────────────────────────────────
  console.log('Seeding users...');
  const userRepo = AppDataSource.getRepository(User);

  const adminUser = await userRepo.save(userRepo.create({
    email: 'admin@titeca.tj',
    password: await hash('Admin@123'),
    role: Role.ADMIN,
    firstName: 'Алишер',
    lastName: 'Рахимов',
    phone: '+992 37 221 0000',
    isEmailVerified: true,
  }));

  const companyUser1 = await userRepo.save(userRepo.create({
    email: 'agrotech@titeca.tj',
    password: await hash('Company@123'),
    role: Role.COMPANY,
    firstName: 'Бахром',
    lastName: 'Назаров',
    phone: '+992 37 222 1111',
    isEmailVerified: true,
  }));

  const companyUser2 = await userRepo.save(userRepo.create({
    email: 'techpark@titeca.tj',
    password: await hash('Company@123'),
    role: Role.COMPANY,
    firstName: 'Мадина',
    lastName: 'Усмонова',
    phone: '+992 37 222 2222',
    isEmailVerified: true,
  }));

  const companyUser3 = await userRepo.save(userRepo.create({
    email: 'textilepro@titeca.tj',
    password: await hash('Company@123'),
    role: Role.COMPANY,
    firstName: 'Рустам',
    lastName: 'Холматов',
    phone: '+992 37 222 3333',
    isEmailVerified: true,
  }));

  const regularUser1 = await userRepo.save(userRepo.create({
    email: 'visitor1@mail.ru',
    password: await hash('User@123'),
    role: Role.USER,
    firstName: 'Санавбар',
    lastName: 'Ахмедова',
    phone: '+992 900 100 001',
    isEmailVerified: true,
  }));

  const regularUser2 = await userRepo.save(userRepo.create({
    email: 'visitor2@mail.ru',
    password: await hash('User@123'),
    role: Role.USER,
    firstName: 'Фарход',
    lastName: 'Давлатов',
    phone: '+992 900 100 002',
    isEmailVerified: false,
  }));

  console.log(`  Created ${6} users`);

  // ─── 2. COMPANIES ─────────────────────────────────────────────────────────
  console.log('Seeding companies...');
  const companyRepo = AppDataSource.getRepository(Company);

  const company1 = await companyRepo.save(companyRepo.create({
    userId: companyUser1.id,
    name: 'АгроТехника Таджикистана',
    logo: '/uploads/logos/agrotech.png',
    description: 'Ведущий поставщик сельскохозяйственной техники и оборудования в Таджикистане. Более 15 лет на рынке.',
    industry: Industry.AGRICULTURE,
    website: 'https://agrotech.tj',
    phone: '+992 37 222 1111',
    email: 'info@agrotech.tj',
    address: 'Душанбе, ул. Рудаки 42',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }));

  const company2 = await companyRepo.save(companyRepo.create({
    userId: companyUser2.id,
    name: 'TechPark Solutions',
    logo: '/uploads/logos/techpark.png',
    description: 'Инновационная IT-компания, специализирующаяся на разработке программного обеспечения и цифровых решений для бизнеса.',
    industry: Industry.TECHNOLOGY,
    website: 'https://techpark.tj',
    phone: '+992 37 222 2222',
    email: 'info@techpark.tj',
    address: 'Душанбе, Технопарк, ул. Айни 14',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  }));

  const company3 = await companyRepo.save(companyRepo.create({
    userId: companyUser3.id,
    name: 'Шарк Тексстайл',
    logo: '/uploads/logos/textile.png',
    description: 'Производство высококачественных тканей и готовой одежды. Экспорт в 12 стран мира.',
    industry: Industry.TEXTILE,
    website: 'https://sharktextile.tj',
    phone: '+992 37 222 3333',
    email: 'info@sharktextile.tj',
    address: 'Худжанд, ул. Ленина 5',
  }));

  console.log(`  Created ${3} companies`);

  // ─── 3. PRODUCTS ──────────────────────────────────────────────────────────
  console.log('Seeding products...');
  const productRepo = AppDataSource.getRepository(Product);

  await productRepo.save([
    productRepo.create({
      companyId: company1.id,
      name: 'Трактор МТЗ-82.1',
      description: 'Многоцелевой колёсный трактор с мощностью двигателя 80 л.с. Подходит для всех видов полевых работ.',
      image: '/uploads/products/tractor.jpg',
    }),
    productRepo.create({
      companyId: company1.id,
      name: 'Сеялка СЗ-3.6',
      description: 'Зернотравяная сеялка для посева зерновых, зернобобовых и трав. Ширина захвата 3.6 м.',
      image: '/uploads/products/seeder.jpg',
    }),
    productRepo.create({
      companyId: company2.id,
      name: 'ERP-система TajBiz',
      description: 'Комплексная система управления предприятием для малого и среднего бизнеса. Включает модули: бухгалтерия, склад, CRM.',
      image: '/uploads/products/erp.jpg',
    }),
    productRepo.create({
      companyId: company2.id,
      name: 'Мобильное приложение SmartFarm',
      description: 'Приложение для управления фермерским хозяйством: мониторинг полей, планирование урожая, учёт техники.',
      image: '/uploads/products/smartfarm.jpg',
    }),
    productRepo.create({
      companyId: company3.id,
      name: 'Шёлковая ткань "Атлас Шарки"',
      description: 'Натуральный таджикский шёлк ручной выработки. Ширина 90 см. Более 50 расцветок.',
      image: '/uploads/products/silk.jpg',
    }),
    productRepo.create({
      companyId: company3.id,
      name: 'Национальная одежда "Чакан"',
      description: 'Традиционный таджикский костюм с ручной вышивкой. Размеры от S до XXL.',
      image: '/uploads/products/chakan.jpg',
    }),
  ]);

  console.log(`  Created ${6} products`);

  // ─── 4. EXHIBITIONS ───────────────────────────────────────────────────────
  console.log('Seeding exhibitions...');
  const exhibitionRepo = AppDataSource.getRepository(Exhibition);

  const expo1 = await exhibitionRepo.save(exhibitionRepo.create({
    title: {
      tj: 'Тоҷикистон — Кишвари Саноатӣ 2026',
      ru: 'Таджикистан — Страна Промышленности 2026',
      en: 'Tajikistan — Industrial Nation 2026',
    },
    description: {
      tj: 'Намоишгоҳи байналмилалии саноат, технология ва инновация. Беш аз 200 ширкат аз 30 кишвар.',
      ru: 'Международная выставка промышленности, технологий и инноваций. Более 200 компаний из 30 стран.',
      en: 'International exhibition of industry, technology and innovation. Over 200 companies from 30 countries.',
    },
    startDate: new Date('2026-04-15T09:00:00'),
    endDate: new Date('2026-04-18T18:00:00'),
    location: 'Кохи Борбад, Душанбе',
    city: 'Душанбе',
    country: 'Tajikistan',
    industry: Industry.MANUFACTURING,
    status: ExhibitionStatus.PUBLISHED,
    coverImage: '/uploads/exhibitions/industry2026.jpg',
    gallery: [
      '/uploads/exhibitions/gallery/industry1.jpg',
      '/uploads/exhibitions/gallery/industry2.jpg',
    ],
  }));

  const expo2 = await exhibitionRepo.save(exhibitionRepo.create({
    title: {
      tj: 'AgroForum Тоҷикистон 2026',
      ru: 'AgroForum Таджикистан 2026',
      en: 'AgroForum Tajikistan 2026',
    },
    description: {
      tj: 'Форуми агросаноатии Тоҷикистон. Тухмӣ, техника, технологияҳои навин дар кишоварзӣ.',
      ru: 'Агропромышленный форум Таджикистана. Семена, техника, новые технологии в земледелии.',
      en: 'Agro-industrial forum of Tajikistan. Seeds, machinery, new technologies in agriculture.',
    },
    startDate: new Date('2026-05-20T09:00:00'),
    endDate: new Date('2026-05-22T17:00:00'),
    location: 'Выставочный центр, Худжанд',
    city: 'Худжанд',
    country: 'Tajikistan',
    industry: Industry.AGRICULTURE,
    status: ExhibitionStatus.PUBLISHED,
    coverImage: '/uploads/exhibitions/agroforum2026.jpg',
    gallery: [
      '/uploads/exhibitions/gallery/agro1.jpg',
    ],
  }));

  const expo3 = await exhibitionRepo.save(exhibitionRepo.create({
    title: {
      tj: 'TechSummit Осиёи Марказӣ 2026',
      ru: 'TechSummit Центральная Азия 2026',
      en: 'TechSummit Central Asia 2026',
    },
    description: {
      tj: 'Саммити технологияҳои иттилоотӣ ва инновация барои Осиёи Марказӣ.',
      ru: 'Саммит информационных технологий и инноваций для Центральной Азии.',
      en: 'Summit of information technologies and innovations for Central Asia.',
    },
    startDate: new Date('2026-07-10T10:00:00'),
    endDate: new Date('2026-07-12T18:00:00'),
    location: 'Технопарк Душанбе, Душанбе',
    city: 'Душанбе',
    country: 'Tajikistan',
    industry: Industry.TECHNOLOGY,
    status: ExhibitionStatus.DRAFT,
    coverImage: '/uploads/exhibitions/techsummit2026.jpg',
    gallery: [],
  }));

  const expoCompleted = await exhibitionRepo.save(exhibitionRepo.create({
    title: {
      tj: 'Тансофти Тоҷик 2025',
      ru: 'Текстиль Таджикистана 2025',
      en: 'Textile Tajikistan 2025',
    },
    description: {
      tj: 'Намоишгоҳи байналмилалии нассоҷӣ ва либос.',
      ru: 'Международная выставка текстиля и одежды.',
      en: 'International exhibition of textiles and clothing.',
    },
    startDate: new Date('2025-10-05T09:00:00'),
    endDate: new Date('2025-10-07T17:00:00'),
    location: 'Кохи Борбад, Душанбе',
    city: 'Душанбе',
    country: 'Tajikistan',
    industry: Industry.TEXTILE,
    status: ExhibitionStatus.COMPLETED,
    coverImage: '/uploads/exhibitions/textile2025.jpg',
    gallery: [],
  }));

  console.log(`  Created ${4} exhibitions`);

  // ─── 5. EXHIBITION PROGRAMS ───────────────────────────────────────────────
  console.log('Seeding exhibition programs...');
  const programRepo = AppDataSource.getRepository(ExhibitionProgram);

  await programRepo.save([
    programRepo.create({
      exhibitionId: expo1.id,
      title: 'Открытие выставки. Приветственное слово',
      startTime: new Date('2026-04-15T09:00:00'),
      endTime: new Date('2026-04-15T10:30:00'),
      speaker: 'Министр промышленности и новых технологий РТ',
    }),
    programRepo.create({
      exhibitionId: expo1.id,
      title: 'Панельная дискуссия: Индустриализация Таджикистана',
      startTime: new Date('2026-04-15T11:00:00'),
      endTime: new Date('2026-04-15T13:00:00'),
      speaker: 'Рахмон А.Р., Назаров С.Б.',
    }),
    programRepo.create({
      exhibitionId: expo1.id,
      title: 'Презентация инвестиционных проектов',
      startTime: new Date('2026-04-16T10:00:00'),
      endTime: new Date('2026-04-16T12:00:00'),
      speaker: 'Председатель Агентства по инвестициям',
    }),
    programRepo.create({
      exhibitionId: expo2.id,
      title: 'Открытие AgroForum 2026',
      startTime: new Date('2026-05-20T09:00:00'),
      endTime: new Date('2026-05-20T10:00:00'),
      speaker: 'Министр сельского хозяйства РТ',
    }),
    programRepo.create({
      exhibitionId: expo2.id,
      title: 'Семинар: Цифровые технологии в сельском хозяйстве',
      startTime: new Date('2026-05-20T11:00:00'),
      endTime: new Date('2026-05-20T13:00:00'),
      speaker: 'Бахром Назаров, TechPark Solutions',
    }),
    programRepo.create({
      exhibitionId: expo3.id,
      title: 'Keynote: Будущее цифровой экономики ЦА',
      startTime: new Date('2026-07-10T10:00:00'),
      endTime: new Date('2026-07-10T11:30:00'),
      speaker: 'Мадина Усмонова, TechPark Solutions',
    }),
  ]);

  console.log(`  Created ${6} programs`);

  // ─── 6. EXHIBITION PARTICIPANTS ───────────────────────────────────────────
  console.log('Seeding exhibition participants...');
  const participantRepo = AppDataSource.getRepository(ExhibitionParticipant);

  await participantRepo.save([
    participantRepo.create({
      exhibitionId: expo1.id,
      companyId: company1.id,
      status: 'CONFIRMED',
    }),
    participantRepo.create({
      exhibitionId: expo1.id,
      companyId: company2.id,
      status: 'CONFIRMED',
    }),
    participantRepo.create({
      exhibitionId: expo2.id,
      companyId: company1.id,
      status: 'CONFIRMED',
    }),
    participantRepo.create({
      exhibitionId: expo2.id,
      companyId: company3.id,
      status: 'PENDING',
    }),
    participantRepo.create({
      exhibitionId: expo3.id,
      companyId: company2.id,
      status: 'PENDING',
    }),
    participantRepo.create({
      exhibitionId: expoCompleted.id,
      companyId: company3.id,
      status: 'CONFIRMED',
    }),
  ]);

  console.log(`  Created ${6} participants`);

  // ─── 7. BOOTHS ────────────────────────────────────────────────────────────
  console.log('Seeding booths...');
  const boothRepo = AppDataSource.getRepository(Booth);

  const booths1 = await boothRepo.save([
    boothRepo.create({ exhibitionId: expo1.id, number: 'A-01', size: '3x3', price: 2500, posX: 50, posY: 50, status: BoothStatus.PAID }),
    boothRepo.create({ exhibitionId: expo1.id, number: 'A-02', size: '3x3', price: 2500, posX: 180, posY: 50, status: BoothStatus.RESERVED }),
    boothRepo.create({ exhibitionId: expo1.id, number: 'A-03', size: '3x3', price: 2500, posX: 310, posY: 50, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo1.id, number: 'B-01', size: '4x4', price: 4000, posX: 50, posY: 180, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo1.id, number: 'B-02', size: '4x4', price: 4000, posX: 180, posY: 180, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo1.id, number: 'C-01', size: '6x6', price: 8000, posX: 310, posY: 180, status: BoothStatus.AVAILABLE }),
  ]);

  const booths2 = await boothRepo.save([
    boothRepo.create({ exhibitionId: expo2.id, number: 'A-01', size: '3x3', price: 1800, posX: 50, posY: 50, status: BoothStatus.PAID }),
    boothRepo.create({ exhibitionId: expo2.id, number: 'A-02', size: '3x3', price: 1800, posX: 180, posY: 50, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo2.id, number: 'B-01', size: '4x4', price: 3200, posX: 50, posY: 180, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo2.id, number: 'B-02', size: '4x4', price: 3200, posX: 180, posY: 180, status: BoothStatus.AVAILABLE }),
  ]);

  const booths3 = await boothRepo.save([
    boothRepo.create({ exhibitionId: expo3.id, number: 'T-01', size: '3x3', price: 3500, posX: 50, posY: 50, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo3.id, number: 'T-02', size: '3x3', price: 3500, posX: 180, posY: 50, status: BoothStatus.AVAILABLE }),
    boothRepo.create({ exhibitionId: expo3.id, number: 'T-03', size: '6x3', price: 6000, posX: 310, posY: 50, status: BoothStatus.AVAILABLE }),
  ]);

  console.log(`  Created ${booths1.length + booths2.length + booths3.length} booths`);

  // ─── 8. NEWS ──────────────────────────────────────────────────────────────
  console.log('Seeding news...');
  const newsRepo = AppDataSource.getRepository(News);

  await newsRepo.save([
    newsRepo.create({
      title: {
        tj: 'Таҷрибаи ширкатҳои хориҷӣ дар намоишгоҳи саноатӣ',
        ru: 'Опыт иностранных компаний на промышленной выставке',
        en: 'Experience of foreign companies at the industrial exhibition',
      },
      content: {
        tj: 'Дар намоишгоҳи байналмилалии саноатӣ, ки дар шаҳри Душанбе баргузор гардид, беш аз 50 ширкати хориҷӣ иштирок намуданд. Онҳо маҳсулот ва технологияҳои навини худро намоиш доданд.',
        ru: 'На международной промышленной выставке, прошедшей в Душанбе, приняли участие более 50 иностранных компаний. Они представили свои новейшие продукты и технологии.',
        en: 'More than 50 foreign companies participated in the international industrial exhibition held in Dushanbe. They presented their latest products and technologies.',
      },
      image: '/uploads/news/foreign-companies.jpg',
      author: 'Редакция Titeca',
      publishedAt: new Date('2026-03-01T10:00:00'),
    }),
    newsRepo.create({
      title: {
        tj: 'Сармоягузории 200 млн. сомонӣ дар бахши кишоварзӣ',
        ru: 'Инвестиции 200 млн. сомони в сферу сельского хозяйства',
        en: 'Investment of 200 million somoni in the agricultural sector',
      },
      content: {
        tj: 'Ҳукумати Ҷумҳурии Тоҷикистон барои рушди бахши кишоварзӣ маблағгузории 200 миллион сомониро тасдиқ кард. Ин маблағ барои харидории техника ва ҷорӣ намудани технологияҳои навин истифода бурда мешавад.',
        ru: 'Правительство Республики Таджикистан утвердило финансирование в размере 200 миллионов сомони для развития сельскохозяйственного сектора. Эти средства будут направлены на закупку техники и внедрение новых технологий.',
        en: 'The Government of the Republic of Tajikistan approved funding of 200 million somoni for the development of the agricultural sector. These funds will be used to purchase equipment and introduce new technologies.',
      },
      image: '/uploads/news/agro-investment.jpg',
      author: 'Министерство сельского хозяйства РТ',
      publishedAt: new Date('2026-03-05T09:00:00'),
    }),
    newsRepo.create({
      title: {
        tj: 'TechPark Solutions — ғолиби ҷоизаи инновация 2025',
        ru: 'TechPark Solutions — победитель премии инноваций 2025',
        en: 'TechPark Solutions — winner of the Innovation Award 2025',
      },
      content: {
        tj: 'Ширкати TechPark Solutions дар озмуни бузурги инновация "Дигиталии Тоҷикистон" ҷоизаи якумро гирифт. Эро барои сохтани барномаи SmartFarm мукофотонида шуд.',
        ru: 'Компания TechPark Solutions заняла первое место в конкурсе инноваций «Цифровой Таджикистан». Компания была награждена за разработку приложения SmartFarm.',
        en: 'TechPark Solutions won first place in the Digital Tajikistan innovation competition. The company was awarded for developing the SmartFarm application.',
      },
      image: '/uploads/news/techpark-award.jpg',
      author: 'Мадина Усмонова',
      publishedAt: new Date('2026-03-10T14:00:00'),
    }),
    newsRepo.create({
      title: {
        tj: 'Бозори матоъ ва либоси тоҷик дар бозори байналмилалӣ',
        ru: 'Таджикский текстиль и одежда на международном рынке',
        en: 'Tajik textiles and clothing on the international market',
      },
      content: {
        tj: 'Содироти маҳсулоти нассоҷии Тоҷикистон дар соли 2025 нисбат ба соли қаблӣ 35 фоиз афзоиш ёфт. Ширкатҳои тоҷик ба бозорҳои Аврупо, Россия ва Хитой ворид шудаанд.',
        ru: 'Экспорт текстильной продукции Таджикистана в 2025 году вырос на 35% по сравнению с предыдущим годом. Таджикские компании вышли на рынки Европы, России и Китая.',
        en: 'Exports of Tajik textile products in 2025 grew by 35% compared to the previous year. Tajik companies have entered the markets of Europe, Russia and China.',
      },
      image: '/uploads/news/textile-export.jpg',
      author: 'Рустам Холматов',
      publishedAt: new Date('2026-03-12T11:00:00'),
    }),
  ]);

  console.log(`  Created ${4} news articles`);

  // ─── 9. BANNERS ───────────────────────────────────────────────────────────
  console.log('Seeding banners...');
  const bannerRepo = AppDataSource.getRepository(Banner);

  await bannerRepo.save([
    bannerRepo.create({
      image: '/uploads/banners/expo-industry-2026.jpg',
      link: '/exhibitions',
      title: 'Таджикистан — Страна Промышленности 2026. 15-18 апреля, Душанбе',
      order: 1,
      isActive: true,
    }),
    bannerRepo.create({
      image: '/uploads/banners/agroforum-2026.jpg',
      link: '/exhibitions',
      title: 'AgroForum Таджикистан 2026. 20-22 мая, Худжанд',
      order: 2,
      isActive: true,
    }),
    bannerRepo.create({
      image: '/uploads/banners/techsummit-2026.jpg',
      link: '/exhibitions',
      title: 'TechSummit Центральная Азия 2026. 10-12 июля, Душанбе',
      order: 3,
      isActive: true,
    }),
    bannerRepo.create({
      image: '/uploads/banners/promo-booth.jpg',
      link: '/auth/register',
      title: 'Зарегистрируйте вашу компанию и займите стенд!',
      order: 4,
      isActive: false,
    }),
  ]);

  console.log(`  Created ${4} banners`);

  // ─── 10. PARTNERS ─────────────────────────────────────────────────────────
  console.log('Seeding partners...');
  const partnerRepo = AppDataSource.getRepository(Partner);

  await partnerRepo.save([
    partnerRepo.create({ name: 'Министерство промышленности РТ', logo: '/uploads/partners/moit.png', url: 'https://moit.tj', order: 1, isActive: true }),
    partnerRepo.create({ name: 'Торгово-промышленная палата РТ', logo: '/uploads/partners/tpp.png', url: 'https://tpp.tj', order: 2, isActive: true }),
    partnerRepo.create({ name: 'Агентство по инвестициям', logo: '/uploads/partners/invest.png', url: 'https://investtj.tj', order: 3, isActive: true }),
    partnerRepo.create({ name: 'Национальный банк Таджикистана', logo: '/uploads/partners/nbt.png', url: 'https://nbt.tj', order: 4, isActive: true }),
    partnerRepo.create({ name: 'ЮНИДО в Таджикистане', logo: '/uploads/partners/unido.png', url: 'https://unido.org', order: 5, isActive: true }),
    partnerRepo.create({ name: 'Азиатский банк развития', logo: '/uploads/partners/adb.png', url: 'https://adb.org', order: 6, isActive: true }),
  ]);

  console.log(`  Created ${6} partners`);

  // ─── 11. APPLICATIONS ─────────────────────────────────────────────────────
  console.log('Seeding applications...');
  const appRepo = AppDataSource.getRepository(Application);

  const app1 = await appRepo.save(appRepo.create({
    userId: regularUser1.id,
    exhibitionId: expo1.id,
    status: ApplicationStatus.APPROVED,
    notes: 'Хотим принять участие как представитель малого бизнеса из Хатлонской области.',
  }));

  const app2 = await appRepo.save(appRepo.create({
    userId: regularUser2.id,
    exhibitionId: expo2.id,
    status: ApplicationStatus.PENDING,
    notes: 'Фермерское хозяйство "Зарафшон", выращивание хлопка и пшеницы. Ищем партнёров по технике.',
  }));

  const app3 = await appRepo.save(appRepo.create({
    userId: regularUser1.id,
    exhibitionId: expo3.id,
    status: ApplicationStatus.REJECTED,
    notes: 'Заявка подана повторно — первая была отклонена из-за неполного пакета документов.',
  }));

  console.log(`  Created ${3} applications`);

  // ─── 12. APPLICATION DOCUMENTS ────────────────────────────────────────────
  console.log('Seeding application documents...');
  const docRepo = AppDataSource.getRepository(ApplicationDocument);

  await docRepo.save([
    docRepo.create({
      applicationId: app1.id,
      fileName: 'company_registration.pdf',
      fileUrl: '/uploads/documents/company_registration.pdf',
      fileType: 'application/pdf',
    }),
    docRepo.create({
      applicationId: app1.id,
      fileName: 'tax_certificate.pdf',
      fileUrl: '/uploads/documents/tax_certificate.pdf',
      fileType: 'application/pdf',
    }),
    docRepo.create({
      applicationId: app2.id,
      fileName: 'farm_license.pdf',
      fileUrl: '/uploads/documents/farm_license.pdf',
      fileType: 'application/pdf',
    }),
  ]);

  console.log(`  Created ${3} application documents`);

  // ─── 13. BOOTH RESERVATIONS ───────────────────────────────────────────────
  console.log('Seeding booth reservations...');
  const reservationRepo = AppDataSource.getRepository(BoothReservation);

  // booth A-01 of expo1 is PAID — already CONFIRMED reservation
  const res1 = await reservationRepo.save(reservationRepo.create({
    boothId: booths1[0].id,
    userId: companyUser1.id,
    companyId: company1.id,
    status: ReservationStatus.CONFIRMED,
    paymentStatus: PaymentStatus.SUCCESS,
  }));

  // booth A-02 of expo1 is RESERVED — PENDING reservation
  const res2 = await reservationRepo.save(reservationRepo.create({
    boothId: booths1[1].id,
    userId: companyUser2.id,
    companyId: company2.id,
    status: ReservationStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
  }));

  // booth A-01 of expo2 is PAID — CONFIRMED reservation
  const res3 = await reservationRepo.save(reservationRepo.create({
    boothId: booths2[0].id,
    userId: companyUser1.id,
    companyId: company1.id,
    status: ReservationStatus.CONFIRMED,
    paymentStatus: PaymentStatus.SUCCESS,
  }));

  // cancelled reservation
  const res4 = await reservationRepo.save(reservationRepo.create({
    boothId: booths2[1].id,
    userId: companyUser3.id,
    companyId: company3.id,
    status: ReservationStatus.CANCELLED,
    paymentStatus: PaymentStatus.FAILED,
  }));

  console.log(`  Created ${4} reservations`);

  // ─── 14. PAYMENTS ─────────────────────────────────────────────────────────
  console.log('Seeding payments...');
  const paymentRepo = AppDataSource.getRepository(Payment);

  await paymentRepo.save([
    paymentRepo.create({
      userId: companyUser1.id,
      reservationId: res1.id,
      amount: 2500,
      currency: 'TJS',
      status: PaymentStatus.SUCCESS,
      method: 'Korти Амонатбонк',
      transactionId: 'TXN-2026-001-AGROTECH',
    }),
    paymentRepo.create({
      userId: companyUser2.id,
      reservationId: res2.id,
      amount: 2500,
      currency: 'TJS',
      status: PaymentStatus.PENDING,
      method: 'Eskhata Pay',
      transactionId: null,
    }),
    paymentRepo.create({
      userId: companyUser1.id,
      reservationId: res3.id,
      amount: 1800,
      currency: 'TJS',
      status: PaymentStatus.SUCCESS,
      method: 'Корти Амонатбонк',
      transactionId: 'TXN-2026-002-AGROTECH',
    }),
    paymentRepo.create({
      userId: companyUser3.id,
      reservationId: res4.id,
      amount: 1800,
      currency: 'TJS',
      status: PaymentStatus.FAILED,
      method: 'Eskhata Pay',
      transactionId: 'TXN-2026-003-FAIL',
    }),
  ]);

  console.log(`  Created ${4} payments`);

  // ─── 15. MESSAGES ─────────────────────────────────────────────────────────
  console.log('Seeding messages...');
  const messageRepo = AppDataSource.getRepository(Message);

  await messageRepo.save([
    messageRepo.create({
      senderId: regularUser1.id,
      receiverId: companyUser1.id,
      content: 'Здравствуйте! Ваша сельскохозяйственная техника доступна для небольших фермерских хозяйств? Какие условия аренды?',
      isRead: true,
    }),
    messageRepo.create({
      senderId: companyUser1.id,
      receiverId: regularUser1.id,
      content: 'Добрый день! Да, мы предлагаем гибкие условия. Пишите на agrotech@titeca.tj или звоните +992 37 222 1111.',
      isRead: true,
    }),
    messageRepo.create({
      senderId: regularUser2.id,
      receiverId: companyUser2.id,
      content: 'Меня интересует система SmartFarm для хозяйства на 50 гектаров. Есть ли демо-версия?',
      isRead: false,
    }),
    messageRepo.create({
      senderId: adminUser.id,
      receiverId: companyUser1.id,
      content: 'Ваша заявка на участие в выставке "Таджикистан — Страна Промышленности 2026" одобрена. Стенд A-01 закреплён за вами.',
      isRead: true,
    }),
    messageRepo.create({
      senderId: adminUser.id,
      receiverId: regularUser1.id,
      content: 'Ваша заявка на участие в выставке одобрена. Добро пожаловать!',
      isRead: false,
    }),
    messageRepo.create({
      senderId: companyUser2.id,
      receiverId: regularUser2.id,
      content: 'Здравствуйте! Да, у нас есть 30-дневная бесплатная пробная версия SmartFarm. Напишите нам на info@techpark.tj.',
      isRead: false,
    }),
  ]);

  console.log(`  Created ${6} messages`);

  // ─── Done ─────────────────────────────────────────────────────────────────
  await AppDataSource.destroy();

  console.log('\n✔ Seed complete!\n');
  console.log('Test accounts:');
  console.log('  Admin:   admin@titeca.tj      / Admin@123');
  console.log('  Company: agrotech@titeca.tj   / Company@123');
  console.log('  Company: techpark@titeca.tj   / Company@123');
  console.log('  Company: textilepro@titeca.tj / Company@123');
  console.log('  User:    visitor1@mail.ru     / User@123');
  console.log('  User:    visitor2@mail.ru     / User@123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
