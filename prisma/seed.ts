import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.SQLITE_DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.tool.deleteMany();
  await prisma.service.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.investigation.deleteMany();
  await prisma.article.deleteMany();
  await prisma.follower.deleteMany();

  await prisma.tool.createMany({
    data: [
      {
        name: "PreRECON",
        description: "инструмент для первичного анализа исходных данных.",
        icon: "/assets/tools/prerecon.png",
        order: 0,
      },
      {
        name: "Whiteboard",
        description: "инструмент для первичной визуализации данных.",
        icon: "/assets/tools/whiteboard.png",
        order: 1,
      },
      {
        name: "Catharsis",
        description: "инструмент для систематизации данных.",
        icon: "/assets/tools/catharsis.png",
        order: 2,
      },
      {
        name: "Report Framework",
        description: "инструмент для эксплуатации данных.",
        icon: "/assets/tools/reportframework.png",
        order: 3,
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        name: "Физические номера",
        description:
          "используйте удалённо реальный номер телефона, привязанный к конкретному физическому устройству.",
        icon: "/assets/service/sim.jpg",
        order: 0,
      },
      {
        name: "Расследования",
        description:
          "Stand-alone OSINT products и Stand-alone OSINT analytics products. Расследования с разными типами исходных данных и разным уровнем верификации под любые задачи.",
        icon: "/assets/service/docs.jpg",
        order: 1,
      },
      {
        name: "Наставничество",
        description:
          "индивидуальное менторство без софистики и презентаций. Только практика и необходимая теория. Уроки в формате звонков.",
        icon: "/assets/service/books.jpg",
        order: 2,
      },
    ],
  });

  await prisma.partner.createMany({
    data: [
      {
        name: "Tooxan",
        description: "CLI-инструмент для поиска и анализа информации.",
        logo: "/assets/partners/tooxan.png",
        order: 0,
      },
      {
        name: "OathNet",
        description: "веб-агрегатор баз данных и стиллер-логов.",
        logo: "/assets/partners/oathnet.png",
        order: 1,
      },
      {
        name: "Soubrettecover",
        description: "дизайнер-иллюстратор.",
        logo: "/assets/partners/soubrette.png",
        order: 2,
      },
    ],
  });

  await prisma.investigation.createMany({
    data: [
      {
        title: "Китокейс",
        slug: "kitocase",
        excerpt:
          "06.05.2025 участник Личного Архива «Контр-Культуры» xeohate, в категории «Расследования», обратился к другим участникам группы с предложением рассмотреть кейс: у меня есть кейс про малолетних скулшутеров — заставляют детей вырезать на себе ники, промывают мозги мизантропией и ненавистью к людям, выкладывают в каналы мануалы по убийству и скулшутингу.",
        coverImage: "/assets/tools/prereconback.png",
        order: 0,
      },
      {
        title: "NFT Scam",
        slug: "nft-scam",
        excerpt:
          "Поздней ночью 27 января 2026 года обычный пользователь Telegram получил сообщение, пересланное от бота, под предлогом, что ему купили NFT-подарок, и чтобы его получить нужно что-то подтвердить. Через несколько минут все его активы, размещённые на аккаунте, были переведены на подконтрольный злоумышленникам профиль.",
        coverImage: "/assets/tools/catharsisback.png",
        order: 1,
      },
      {
        title: "Ингушский кейс",
        slug: "ingush-case",
        excerpt: "Самый первый отчёт в истории проекта.",
        coverImage: "/assets/service/simshadow.png",
        order: 2,
      },
    ],
  });

  await prisma.article.createMany({
    data: [
      {
        title: "Систематизация",
        slug: "systematization",
        excerpt: "Визуализация и систематизация",
        coverImage: "/assets/tools/whiteboard.png",
        body: "<p>Разбираем, как приводить разрозненные данные расследования к единой структуре — от сырых источников до карты связей, которую можно читать с первого взгляда.</p>",
        order: 0,
      },
      {
        title: "Анонимность, OPSEC",
        slug: "anonymity-opsec",
        excerpt: "Анонимность и OPSEC",
        coverImage: "/assets/tools/catharsisback.png",
        body: "<p>Базовые правила операционной безопасности для тех, кто проводит расследования: разделение личностей, чистые устройства, гигиена метаданных.</p>",
        order: 1,
      },
      {
        title: "Социальная инженерия",
        slug: "social-engineering",
        excerpt: "Методы проверки объективности",
        coverImage: "/assets/service/booksshadow.png",
        body: "<p>Как отличить достоверный источник от манипуляции и почему любое утверждение в расследовании должно проходить перекрёстную проверку.</p>",
        order: 2,
      },
    ],
  });

  const followerNames = [
    "Алина",
    "Кирилл",
    "Вика",
    "Стас",
    "Марина",
    "Данил",
    "Настя",
    "Тимур",
    "Лера",
    "Роман",
    "Полина",
    "Олег",
  ];
  await prisma.follower.createMany({
    data: followerNames.map((name, i) => ({
      name,
      avatar: `/assets/followers/f${i + 1}.svg`,
      telegramUrl: "https://t.me/counterculture",
      order: i,
    })),
  });

  const servicesContent = `
<p>Услуги проекта &quot;Контр-Культура&quot; и Дика: t.me/osintfigure</p>
<p>Способ оплаты<br><b>USDT (TRC20), TON</b></p>
<p>Если вы никогда до этого не взаимодействовали с криптовалютой — напишите нам, поможем с регистрацией и пополнением криптокошелька.</p>
<h2>Расследования</h2>
<ul>
<li>Информационное досье / Stand-alone OSINT products: <b>8.99 USDT</b></li>
<li>Оперативное досье / Stand-alone OSINT analytics products: <b>20.99 USDT+</b></li>
<li>Разведывательное досье / Stand-alone OSINT and HUMINT analytics products: <b>29.99 USDT+</b></li>
<li><i>Привлечь Отдел Расследований</i>: <b>29.99 USDT</b></li>
</ul>
<h2>Обучение</h2>
<ul>
<li>Наставничество (менторство): <b>79.99usdt/мес.</b></li>
<li>Личный Архив: 5.99usdt/мес., <b>14.99usdt/навсегда</b></li>
</ul>
<h2>Физические номера</h2>
<ul>
<li>+420: <b>9.99usdt</b></li>
</ul>
<h2>Реклама</h2>
<ul>
<li>Telegram-канал 1/24: <b>39usdt</b></li>
<li>Остальные платформы: условия индивидуальны. Контактные данные:
<ul>
<li>t.me/osintfigure</li>
<li>dd1kfuckedthem@proton.me</li>
</ul>
</li>
</ul>
`.trim();

  const siteSettingsData = {
    qrImage: "/assets/archive/qr.jpg",
    joinText:
      "Личный Архив — приватный Telegram-форум проекта: обучение в закрытом сообществе и практика. В категориях архива вы найдёте: софт, веб-инструменты, авторские методички, отчёты, доступ, инструкции, литературу, базы данных и словари, категорию для проведения расследований, а также деловые предложения от участников группы.",
    email: "dd1kfuckedthem@proton.me",
    telegramUrl: "https://t.me/counterculture",
    tiktokUrl: "https://www.tiktok.com/@counterculture",
    youtubeUrl: "https://www.youtube.com/@counterculture",
    servicesContent,
  };
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    create: { id: "main", ...siteSettingsData },
    update: siteSettingsData,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
