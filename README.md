# المنيو الإلكتروني - خان الجمر (Restaurant QR Menu)

تطبيق منيو إلكتروني كامل مبني بـ Next.js 15 + TypeScript + Tailwind CSS، ومنشور بالكامل على **Cloudflare** (Workers + D1 + R2)، يحتوي على:

- **صفحة المنيو للزبون** (`/`): تصفح الأصناف حسب التصنيف، صورة + وصف + سعر لكل طبق، شارة "عرض خاص" عند وجود خصم، تقييمات الزبائن، وزر لإرسال شكوى/اقتراح.
- **لوحة تحكم الإدارة** (`/admin`): إدارة الأصناف والأسعار مع حاسبة تلقائية للكلفة ونسبة الربح وفرق السعر (بنفس منطق ملف الإكسل)، رفع الصور، إدارة التقييمات (الموافقة/الحذف)، إدارة الشكاوى (تغيير الحالة/الحذف)، وصفحة إعدادات لرفع شعار المطعم وتعديل الاسم.

## منطق حساب الأسعار (يطابق ملف الإكسل)

```
إجمالي الكلفة = كلفة المنتج + كلفة السلطة
نسبة الربح % = (السعر - إجمالي الكلفة) / إجمالي الكلفة × 100
فرق السعر = السعر الجديد - السعر القديم
```

هذا المنطق مطبّق في `src/lib/pricing.ts` ويُستخدم مباشرة في لوحة التحكم أثناء إضافة/تعديل أي صنف.

## التقنيات

- Next.js 15 (App Router) + TypeScript، منشور عبر [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) على **Cloudflare Workers**
- **Cloudflare D1** (SQLite) عبر Prisma ORM + `@prisma/adapter-d1`
- **Cloudflare R2** لتخزين الصور المرفوعة (لوغو المطعم وصور الأصناف)
- Tailwind CSS (تصميم عربي RTL بالكامل، هوية "خان الجمر": فحمي/جمر/ذهبي)
- مصادقة إدارية بسيطة (JWT في كوكي httpOnly عبر `jose` + `bcryptjs`)

## الإعداد المحلي

يعتمد التطوير المحلي على [Wrangler](https://developers.cloudflare.com/workers/wrangler/) لمحاكاة D1 وR2 محلياً (بدون الحاجة لحساب Cloudflare حقيقي أثناء التطوير):

```bash
npm install
cp .env.example .env          # عدّل AUTH_SECRET على الأقل
npm run cf:migrate:local      # ينشئ الجداول في قاعدة D1 المحلية (محاكاة)
npm run cf:seed:gen           # يولّد migrations/0002_seed_data.sql من prisma/seed-data.ts
npm run cf:migrate:local      # يطبّق ملف البيانات المولّد على D1 المحلية
npm run dev
```

- المنيو: http://localhost:3000
- لوحة التحكم: http://localhost:3000/admin/login (`admin` / القيمة التي وضعتها في `ADMIN_PASSWORD` عند توليد ملف البذور، أو `changeme123` افتراضياً)

## النشر على Cloudflare (خطوة بخطوة)

### 1. تسجيل الدخول وربط الحساب

```bash
npx wrangler login
```

### 2. إنشاء قاعدة بيانات D1 وحاوية R2

```bash
npx wrangler d1 create khan-al-jamr-db
npx wrangler r2 bucket create khan-al-jamr-images
```

انسخ `database_id` الذي يطبعه الأمر الأول والصقه في `wrangler.jsonc` مكان `REPLACE_WITH_YOUR_D1_DATABASE_ID`.

### 3. تطبيق المايكريشن والبيانات الأولية على القاعدة الحقيقية (Remote)

```bash
ADMIN_PASSWORD="اختر-كلمة-مرور-قوية" npm run cf:seed:gen
npm run cf:migrate:remote
```

هذا ينشئ الجداول ويعبئ التصنيفات و38 صنف/عرض من ملف الإكسل الأصلي، بالإضافة لحساب الأدمن. **لا داعي لتكرار هذه الخطوة** لاحقاً - إدارة الأصناف بعدها تتم من لوحة التحكم مباشرة.

### 4. ضبط الأسرار (Secrets)

```bash
npx wrangler secret put AUTH_SECRET
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
```

القيمتان الأخيرتان هنا فقط لأغراض مرجعية (تسجيل الدخول فعلياً يتحقق من الحساب المخزَّن في D1 الذي أنشأته في الخطوة 3)؛ الأهم هو `AUTH_SECRET` - قيمة عشوائية طويلة (`openssl rand -base64 32`) تُستخدم لتوقيع جلسة تسجيل الدخول.

### 5. النشر

```bash
npm run cf:deploy
```

سيطبع الأمر رابط الـ Worker الخاص بك (مثل `khan-al-jamr-menu.<account>.workers.dev`). يمكنك لاحقاً ربط دومين خاص من تبويب **Workers & Pages → Custom Domains** في لوحة Cloudflare.

### تحديثات لاحقة على قاعدة البيانات

إذا عدّلت `prisma/schema.prisma` مستقبلاً:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script --output migrations/000X_change.sql
npm run cf:migrate:local   # للاختبار محلياً أولاً
npm run cf:migrate:remote  # ثم على الإنتاج
```

### لماذا Cloudflare بهذا الشكل تحديداً؟

| القرار | السبب |
|---|---|
| D1 بدل Postgres | قاعدة بيانات مُدارة من Cloudflare نفسها، بدون خدمة خارجية، وتعمل مباشرة كـ binding داخل الـ Worker بدون اتصال TCP (غير مدعوم في بيئة Workers) |
| R2 لتخزين الصور بدل Base64 في القاعدة | Workers/D1 لا يناسبان تخزين ملفات كبيرة كنص Base64؛ R2 هو الحل الأنسب لتخزين الكائنات (صور) على Cloudflare، وتُخدَّم عبر `/api/images/[key]` |
| `@opennextjs/cloudflare` بدل `next start` عادي | Cloudflare Workers لا يشغّل سيرفر Node.js تقليدي؛ هذا المحوّل يبني تطبيق Next.js (App Router، API routes، middleware) ليعمل كـ Worker مع الحفاظ على كل الميزات |
| `nodejs_compat` مفعّلة في `wrangler.jsonc` | مطلوبة لتوافق مكتبات مثل `bcryptjs` و `Buffer` مع بيئة Workers |

## هيكل المشروع

```
wrangler.jsonc              إعداد Cloudflare Worker (D1 + R2 + Assets bindings)
open-next.config.ts         إعداد محوّل OpenNext Cloudflare
prisma/schema.prisma        نموذج البيانات (SQLite/D1): تصنيفات، أصناف، تقييمات، شكاوى، حساب الأدمن، الإعدادات
prisma/seed-data.ts         بيانات المصدر الوحيدة للتصنيفات/الأصناف (من ملف الإكسل الأصلي)
prisma/seed.ts              تعبئة اختيارية لقاعدة sqlite محلية عادية (خارج D1)
scripts/generate-d1-seed.ts يولّد migrations/0002_seed_data.sql من seed-data.ts
migrations/                 ملفات SQL تُطبَّق عبر `wrangler d1 migrations apply`
src/lib/pricing.ts          منطق حساب الكلفة والنسبة وفرق السعر
src/lib/auth.ts             توليد/التحقق من جلسة الأدمن (JWT)
src/lib/prisma.ts           getPrisma() - يبني عميل Prisma من D1 binding عند كل طلب
src/middleware.ts           حماية مسارات /admin و /api/admin
src/app/                    صفحات المنيو ولوحة التحكم (App Router)
src/app/api/                نقاط API العامة والخاصة بالأدمن
src/app/api/images/[key]    تقديم الصور المرفوعة من R2
src/components/             مكونات واجهة الزبون
src/components/admin/       مكونات لوحة التحكم (نموذج الصنف، حاسبة الأسعار)
```

## أفكار للتوسّع لاحقاً

- إضافة QR Code يولّد رابط المنيو مباشرة (يمكن إضافته كصفحة `/admin/qr` تستخدم مكتبة توليد QR من جهة العميل).
- دعم لغات متعددة (عربي/إنجليزي) عبر `next-intl`.
- إشعارات فورية للإدارة عند وصول شكوى جديدة (بريد إلكتروني أو Telegram Bot).
- ربط دومين مخصص بدل رابط `workers.dev` الافتراضي.
