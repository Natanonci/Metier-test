import { PrismaClient, CommentStatus } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const THAI_NAMES = ["สมชาย", "มานะ", "วิชัย", "กฤษฎา", "พรทิพย์", "สมหญิง", "อารยา", "ชัยยุทธ", "ธนาธร", "จิราพร", "ณัฐวุฒิ", "กมลวรรณ", "นันทนา", "สุรศักดิ์", "ประยุทธ์", "สมศักดิ์", "อภิสิทธิ์", "ยิ่งลักษณ์"];

const THAI_COMMENTS = [
  "บทความนี้ดีมาก 10 เต็ม 10",
  "ชอบมากอ่านง่าย 1",
  "สุดยอด 555",
  "รอติดตามตอนต่อไป 2",
  "เนื้อหามีประโยชน์ 100",
  "สุดยอดไปเลย 9",
  "อ่านแล้วเข้าใจง่าย 4",
  "ดีเยี่ยม 88",
  "ได้ความรู้เยอะมาก 5555",
  "ขอบคุณ 1",
  "ดีมาก 2",
  "น่าสนใจ 3",
  "ขอบคุณสำหรับข้อมูลดีๆ 10"
];

const BLOG_TITLES = [
  "วิธีการเขียนโค้ดสำหรับผู้เริ่มต้น", "10 เทคนิคการจัดการเวลา", "การลงทุนในตลาดหุ้นเบื้องต้น", "การดูแลสุขภาพจิตในยุคดิจิทัล",
  "ทำไมการอ่านหนังสือถึงสำคัญ", "เทคนิคการถ่ายภาพด้วยมือถือ", "ประวัติศาสตร์ศิลปะไทย", "สถานที่ท่องเที่ยวที่น่าสนใจในไทย",
  "มารยาททางสังคมที่ควรรู้", "การใช้เทคโนโลยีในชีวิตประจำวัน", "วิธีจัดการความเครียด", "การตั้งเป้าหมายในชีวิต",
  "หนังสือที่ควรหยิบมาอ่านซ้ำ", "แนวคิดแบบผู้ประกอบการ", "ทำความรู้จักกับบล็อกเชน", "คู่มือการสร้างแบรนด์ส่วนตัว",
  "การสื่อสารอย่างมีประสิทธิภาพ", "ประโยชน์ของการนั่งสมาธิ", "ความลับของความสำเร็จ", "การพัฒนาตนเองอย่างยั่งยืน",
  "สิ่งแวดล้อมกับอนาคตของเรา", "บทเรียนจากความล้มเหลว", "ความรู้เรื่องภาษีสำหรับคนทำงาน", "การออกกำลังกายที่บ้าน",
  "วิธีทำเงินผ่านออนไลน์", "รีวิวอุปกรณ์อิเล็กทรอนิกส์ใหม่", "สิ่งที่ควรรู้ก่อนซื้อบ้าน", "เรียนรู้ภาษาใหม่ด้วยตนเอง",
  "สร้างความสัมพันธ์ที่ดีในที่ทำงาน", "วิธีปรับสมดุลชีวิตและการทำงาน", "เทรนด์เทคโนโลยีในปีนี้", "เคล็ดลับการออมเงิน",
  "ข้อดีของการตื่นเช้า", "ปัญหาโลกร้อนและการแก้ไข", "รู้จักกับศิลปะร่วมสมัย", "แนวคิดล้ำสมัยในการศึกษา",
  "ทักษะที่จำเป็นสำหรับอนาคต", "การเริ่มต้นธุรกิจเล็กๆ", "ความสำคัญของปัญญาประดิษฐ์", "ค้นพบตัวเองและศักยภาพที่ซ่อนอยู่"
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const COMMENT_STATUSES: CommentStatus[] = ["PENDING", "APPROVED", "REJECTED"];

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create 2 Admin Users
  const password123Hash = await bcrypt.hash("password123", 10);
  const super1234Hash = await bcrypt.hash("super1234", 10);

  await prisma.adminUser.createMany({
    data: [
      { username: "admin", passwordHash: password123Hash },
      { username: "superadmin", passwordHash: super1234Hash }
    ]
  });
  console.log("2 Admin users created: admin, superadmin");

  // Create exactly 40 Blogs
  for (let i = 0; i < 40; i++) {
    // Make 35 blogs true and 5 blogs false
    const isPublished = i < 35; 
    
    const title = BLOG_TITLES[i];
    
    // 1 to 7 images
    const numImages = Math.floor(Math.random() * 7) + 1;
    const images: string[] = [];
    for (let k = 0; k < numImages; k++) {
      const uniqueNum = i * 10 + k; 
      images.push(`https://picsum.photos/800/600?random=${uniqueNum}`);
    }

    const viewCount = Math.floor(Math.random() * (5000 - 10 + 1)) + 10;
    const slug = `blog-post-${i + 1}-${Date.now()}`;

    const blog = await prisma.blog.create({
      data: {
        title: title,
        slug: slug,
        summary: `นี่คือบทสรุปสั้นๆ ของบทความเรื่อง ${title} ซึ่งมีเนื้อหาน่าสนใจและเป็นประโยชน์ต่อผู้อ่านทุกคน ให้สามารถนำไปใช้จริงได้ทันที`,
        content: `นี่คือเนื้อหาแบบเต็มของบทความเรื่อง ${title} ซึ่งจะมีรายละเอียดต่างๆ มากมาย เพื่ออธิบายเรื่องราวอย่างลึกซึ้ง ครอบคลุมทั้งแนวคิดเบื้องต้น วิธีการนำไปปรับใช้จริง และตัวอย่างเพื่อให้เห็นภาพได้ชัดเจนยิ่งขึ้น หวังว่าผู้ที่เข้ามาอ่านจะได้รับข้อมูลที่มีประโยชน์ไปประยุกต์ใช้ในชีวิตประจำวัน พร้อมทั้งพัฒนาตนเองและก้าวไปข้างหน้าได้อย่างมั่นใจ`,
        isPublished,
        viewCount,
        images: images,
      },
    });

    // Create 3-5 Comments per blog
    const numComments = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
    for (let j = 0; j < numComments; j++) {
      const status = getRandomItem(COMMENT_STATUSES);
      await prisma.comment.create({
        data: {
          blogId: blog.id,
          senderName: getRandomItem(THAI_NAMES),
          message: getRandomItem(THAI_COMMENTS),
          status: status,
        },
      });
    }
  }

  console.log("Created exactly 40 blogs with comments (35 published, 5 unpublished).");
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
