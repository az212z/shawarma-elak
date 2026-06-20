# DESIGN-QUALITY-REPORT — شاورما إيلاك

## 1) المهارات المُستدعاة وكيف

| المهارة | كيف استُخدمت |
|---|---|
| **ui-ux-pro-max** (+ `search.py --design-system`) | شغّلت البحث على «shawarma street food premium modern». أخذت منه: نمط Storytelling/Feature-Rich، أساس charcoal `#1C1917` + gold accent، وتشيك-ليست ما-قبل-التسليم (لا emoji كأيقونات، focus states، تباين 4.5:1، reduced-motion، breakpoints 375/768/1024/1440). |
| **design-taste-frontend** | طبّقت الـ Brief Inference + الـ dials + قواعد anti-slop. الـ Design Read أدناه. التزمت بـ: لا em-dash نهائيًا، قفل ثيم واحد (داكن لكل الصفحة)، لون accent واحد (ember) عبر الموقع، نظام نصف-قطر واحد، hero يدخل ضمن الـ viewport، صور حقيقية لا fake screenshots، تنوّع layout families. |
| **emil-design-eng** | تايمنغ الموشن: ease-out `cubic-bezier(.16,1,.3,1)`، ميكرو 150–300ms، ردّ ضغط `scale(.97)`، stagger للـ reveal، الموشن التوقيعي يخدم القصة لا الزينة، عناصر متحرّكة محدودة لكل مشهد. |
| **high-end-visual-design** | منع الـ defaults الرخيصة: ظلال ملوّنة بلون الخلفية، تدرّجات دافئة هادئة، مسافات كريمة، كروت أطباق بحواف ناعمة وظل موحّد، لمعة CTA راقية، إحساس street-food-luxe. |

> القواعد الداخلية في `DESIGN-SKILLS-RULES.md` طُبّقت بالكامل (a11y، touch، performance، identity، responsive، typography، motion، نصوص، taste).

## 2) Design Read (من design-taste-frontend)
«موقع landing لمطعم شاورما فاخر موجّه للزبون السعودي، بلغة street-food-luxe واثقة، يميل إلى vanilla CSS + خطوط عربية display/kufi/body مع موشن SVG توقيعي وحركة محسوبة.»

- **DESIGN_VARIANCE: 7** — هيرو split (نص/سيخ متحرّك)، layout families متنوّعة.
- **MOTION_INTENSITY: 6** — موشن توقيعي + ken-burns + reveal + hover، كلها معطّلة تحت reduced-motion.
- **VISUAL_DENSITY: 4** — مساحات مريحة، كروت تتنفّس.

## 3) مخرجات ui-ux-pro-max (Palette / Type)
- **Palette (semantic CSS vars):** `--bg #17120F` فحمي قريب من الأسود، `--bg-2/3` أسطح مرفوعة، `--ink #F6EFE6` كريمي، `--brand #E8531E` (ember orange)، `--brand-2 #C0381A` (أحمر عميق)، `--gold #D9B463 / --gold-soft #C9A24B`. لون accent واحد مقفول عبر الموقع.
- **Typography:** Display = **El Messiri**، Kufi/labels = **Reem Kufi**، Body = **Tajawal**. مزدوج عربي (display أنيق + body نظيف) كما يوصي البريف والمهارة. تحميل عبر preconnect + `display=swap`.

## 4) الموشن التوقيعي — كيف يعمل (السيخ الدوّار)
البنية SVG inline في الهيرو، طبقات absolutely-positioned، transform/opacity فقط (60fps):

1. **الدوران:** مجموعة `.spit-cone` (مخروط الشاورما + خطوط اللحم + لمعة) تدور عبر `@keyframes coneSpin` يلعب `scaleX` من 1 → .32 → 1 (مع إزاحة بسيطة) = إحساس دوران 3D حول السيخ العمودي. 7s ease-in-out متكرّر بهدوء.
2. **وهج الجمر:** `.spit-glow` تدرّج شعاعي برتقالي خلف السيخ ينبض `emberPulse` (3.4s) — شهيّة + heat.
3. **الدخان:** `.spit-smoke` ثلاث دوائر مموّهة تصعد وتتلاشى (`smoke` 4.5s، staggered) فوق رأس السيخ.
4. **الشرائح المتساقطة:** أربع `.slice` تتقشّر من حافة المخروط وتنزل بـ `sliceFall` (translate + rotate + fade، stagger 1s/2.4s/4.1s/5.6s) وتستقر على **الطبق/الخبز** `.spit-plate` أسفل السيخ.
5. **عدد المجموعات المتحرّكة المتزامنة:** ≤ 2–3 (مخروط يدور + وهج/دخان + شريحة واحدة في طريقها) — تايست وغير مزعج.

**fallback عند `prefers-reduced-motion: reduce`:** كل الأنميشن يتوقف؛ السيخ ثابت، الدخان يختفي، والشرائح الأربع تُعرض **مستقرّة على الطبق** (translate/rotate نهائية ثابتة). الحالة النهائية مركّبة وواضحة.

**باقي اللمسات:** ken-burns على صورة الجلسة الحقيقية (se-6)، scroll-reveal عبر IntersectionObserver (+ fallback 2.5s)، hover zoom على كروت الأطباق والمعرض، تصغير الهيدر عند السكرول، لمعة sheen على زر CTA الأساسي.

## 5) قرارات UI/UX أساسية
- **قائمة جوال ملء الشاشة:** `100vw/100dvh`، خلفية `--bg` صلبة، زر X واضح أعلى اليسار، تُقفل بالضغط على رابط أو Escape، تمنع scroll الخلفية.
- **نموذج الطلب:** label فوق الحقل، خطأ تحت الحقل مباشرة، تحقّق عند الإرسال + focus لأول حقل خاطئ، توست نجاح (aria-live)، حفظ localStorage تجريبي، يفتح wa.me برسالة عربية جاهزة.
- **FABs:** واتساب + اتصال + خرائط، أهداف لمس ≥ 44px.
- **Lightbox** بسيط للمعرض بأزرار وأوصاف.

## 6) لماذا هذه الألوان/الخطوط
الفحمي + الإمبر/الأحمر + الذهب = حرارة الفحم وشهيّة الشاورما مع رقي (street-food-luxe لا رخيص). El Messiri يعطي عناوين عربية فخمة بطابع شرقي، Tajawal نظيف وعالي القراءة للجسم، Reem Kufi للّيبلز يضيف هوية كوفية.

## 7) Accessibility
- تباين: كريمي `#F6EFE6` على فحمي `#17120F` ≈ 14:1؛ نص مكتوم `#CDBFAE` على الخلفية ≈ 8:1؛ أبيض على زر الإمبر ≈ 4.6:1. كلها ≥ 4.5:1.
- HTML سيمانتيك (header/nav/main/section/footer)، تدرّج h1→h2→h3 بلا قفز.
- كل صورة لها alt عربي وصفي + width/height + lazy (غير الهيرو) + decoding=async.
- كل زر أيقونة له aria-label، الأيقونات الزخرفية `aria-hidden`. skip-link. focus-visible بـ outline ذهبي.
- المعنى لا يعتمد اللون وحده. دعم reduced-motion كامل.

## 8) Touch & Responsive
- أهداف لمس ≥ 44–48px، ردّ ضغط `scale(.97)` < 150ms بلا إزاحة layout.
- Mobile-first؛ breakpoints 600/760/920؛ لا تمرير أفقي عند 390px؛ `min-h-dvh`؛ جسم 16px.

## 9) Performance
- vanilla فقط، لا مكتبات. خطوط preconnect + swap. أبعاد صور محدّدة (CLS≈0). الهيرو `fetchpriority=high`، البقية lazy. أنميشن transform/opacity فقط.

## 10) Taste (اختبار القبول)
فاخر؟ نعم — فحم/إمبر/ذهب، حركة سينمائية محسوبة. سعودي مناسب؟ نعم — لهجة محايدة طبيعية. يقنع خلال 3 ثوانٍ؟ السيخ الدوّار + العنوان + التقييم. لا يشبه قالبًا مجانيًا؟ موشن SVG توقيعي مخصّص. تناسق المسافات/الصور/الأزرار/الحركة؟ نعم.

## 11) النصوص (محايدة جندريًا)
«اطلب الآن / استعرض القائمة / احجز طاولة / اتصل / تواصل / زورنا». لا «اطلبي/احجزي/لكِ». لا أسعار مخترعة («حسب القائمة»). التقييم 4.3 (531) من قوقل حقيقي. صفر em-dash.
