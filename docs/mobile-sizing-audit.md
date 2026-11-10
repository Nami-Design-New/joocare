# Mobile sizing audit (< 640px)

النطاق: الشاشات الأصغر من `sm` بس. كل اقتراح بيحط قيمة الموبيل كـ base class، والقيمة الحالية بتتنقل لـ `sm:` أو `md:`، فالديسكتوب مش هيتغير.

المصدر:
- **الصفحات العامة و auth**: اتصورت على 375px (emulation موبيل حقيقي) واتراجعت بالعين.
- **صفحات candidate / company / hiring-manager**: مراجعة كود بس (محتاجة login)، فدي محتاجة تتأكد بالعين.

مفيش ولا صفحة عامة فيها horizontal scroll على 375px.

الأولوية: 🔴 باينة ومزعجة · 🟡 تحسين واضح · ⚪ اختياري

---

## مكونات مشتركة (تصليح واحد بيأثر على صفحات كتير)

| الأولوية | المكان | الحالي | المقترح | السبب |
|---|---|---|---|---|
| ✅ | [FAQSection.tsx:49](../src/features/home/components/FAQSection.tsx#L49) و [forEmployers/FAQSection.tsx:44](../src/features/forEmployers/components/FAQSection.tsx#L44) (وصفحة FAQ) | item `px-6 py-2` + trigger `py-4` | `px-4 py-1 sm:px-6 sm:py-2` + trigger `py-3 sm:py-4` | كل سؤال واخد ~90px ارتفاع، و12 سؤال بيبقوا صفحة طويلة جدًا |
| ✅ | [Testimonials.tsx:73-82](../src/features/home/components/Testimonials.tsx#L73) | header `mb-12 flex items-center justify-between`، الأزرار `h-12 w-12` | `mb-6 gap-3 sm:mb-12` + الأزرار `size-10 sm:size-12` + `min-w-0` على العنوان | نفس مشكلة Recent Jobs: العنوان بيتكسر على 3 سطور جنب الأزرار |
| ✅ | [Footer.tsx:169](../src/shared/components/Footer.tsx#L169) | `text-base md:text-lg` | `text-sm md:text-lg` | سطر الحقوق كبير نسبيًا على الموبيل |
| ✅ | Footer: زرار back-to-top | قطره ~46px وراكب على خط الفاصل | `size-10 sm:size-12` أو نزّله شوية | راكب على الـ divider فوق سطر الحقوق |
| ✅ | [Footer.tsx:77](../src/shared/components/Footer.tsx#L77) (كل قوائم الفوتر) | `space-y-4` | `space-y-3 md:space-y-4` | الفوتر طويل على الموبيل |
| ✅ | [LinkedInButton.tsx:21](../src/features/auth/components/ui/LinkedInButton.tsx#L21) و [GoogleButton.tsx:21](../src/features/auth/components/ui/GoogleButton.tsx#L21) | `text-lg` | `text-base sm:text-lg` | أكبر من زرار Login نفسه |

---

## Home `/`

| الأولوية | المكان | الحالي | المقترح | السبب |
|---|---|---|---|---|
| ✅ | [LiveJobs.tsx](../src/features/home/components/LiveJobs.tsx) | — | اتصلّح | الهيدر بقى stacked |
| ✅ | [HowItWorksCard.tsx:16](../src/features/home/components/HowItWorksCard.tsx#L16) | `pt-4 pb-8` + أيقونة `size-14` | `pt-2 pb-6 sm:pt-4 sm:pb-8` + `size-12 sm:size-14` | الـ 3 steps واخدين ~700px |
| ✅ | [StatCard.tsx:4](../src/features/home/components/StatCard.tsx#L4) | `p-8` | `p-4 sm:p-8` | الكارت في عمود نصه 160px، و padding 32px بيكسر الـ label على 3 سطور |
| ✅ | [ImpactSection.tsx:26](../src/features/home/components/ImpactSection.tsx#L26) | `gap-12` | `gap-8 lg:gap-12` | مسافة كبيرة بين الكلام والـ stats |
| ✅ | [TopEmployers.tsx:27](../src/features/home/components/TopEmployers.tsx#L27) | `gap-8` | `gap-4 sm:gap-8` | اللوجوهات صغيرة والمسافات بينها كبيرة |
| ✅ | [JobCard.tsx:16](../src/features/home/components/JobCard.tsx#L16) | `p-5` | `p-4 sm:p-5` | — |
| ⚪ | LiveJobs: عدد الوظايف | 8 كروت تحت بعض | ممكن تعرض 4 بس على الموبيل (`[&>*:nth-child(n+5)]:hidden sm:...`) | السكشن طويل جدًا (مش موضوع مقاسات، قرارك) |

## About `/about`

| الأولوية | المكان | الحالي | المقترح | السبب |
|---|---|---|---|---|
| ✅ | [AboutImageTextBlock.tsx:27](../src/features/about/components/AboutImageTextBlock.tsx#L27) (Vision / Mission / Commitment) | `text-3xl` + `my-7` | `text-2xl sm:text-4xl` + `my-4 sm:my-7` | أكبر عنوان في الموقع على الموبيل، وباقي السكشنز `text-xl` |
| ✅ | [AboutImageTextBlock.tsx:21](../src/features/about/components/AboutImageTextBlock.tsx#L21) | `px-4` (جوه `layout-content` اللي عنده padding أصلًا) | `px-0 sm:px-6` | المحتوى مزاح لجوه أكتر من باقي الصفحة (حوالي 28px بدل 16) |
| ✅ | [AboutVisionSection.tsx:15](../src/features/about/components/AboutVisionSection.tsx#L15) | `my-14 py-16` | `my-8 py-10 sm:my-14 sm:py-16` | فراغ ~120px بين السكشنز |
| ✅ | [CorePillarsSection.tsx:15-16](../src/features/about/components/CorePillarsSection.tsx#L15) | `py-16` + `px-4` | `py-10 sm:py-20` + `px-0 sm:px-6` | نفس موضوع الـ padding الزيادة |
| ✅ | [AboutHeroSection.tsx:91](../src/features/about/components/AboutHeroSection.tsx#L91) (الـ 4 stats) | `p-8` | `p-3 sm:p-8` | فراغ ~100px بين الصف الأول والتاني |
| ✅ | [CorePillarsAccordionItem.tsx:29](../src/features/about/components/CorePillarsAccordionItem.tsx#L29) | `text-justify` | `text-start sm:text-justify` | الـ justify بيعمل فراغات كبيرة بين الكلمات في العمود الضيق |
| ✅ | [AboutHeroSection.tsx:62](../src/features/about/components/AboutHeroSection.tsx#L62) | `h-[420px]` | `h-[340px] sm:h-[520px]` | الكولاج طويل |

## For Employers `/for-employers`

| الأولوية | المكان | الحالي | المقترح | السبب |
|---|---|---|---|---|
| 🔴 | [HireSection.tsx](../src/features/forEmployers/components/HireSection.tsx#L22) | الـ subtitle متكرر: "…Easier Than YouThinkBuilding Your Medical Team…" | — | **مش مقاسات**: النص متكرر مرتين (غالبًا من الـ API أو الترجمة) |
| ✅ | [BannerSection.tsx:31](../src/features/forEmployers/components/BannerSection.tsx#L31) | `text-[clamp(1.75rem,2.8vw,3rem)]` | `text-[clamp(1.375rem,2.8vw,3rem)]` | العنوان الأخضر 4 سطور بـ 28px |
| ✅ | [WhySection.tsx:30](../src/features/forEmployers/components/WhySection.tsx#L30) | `text-3xl` | `text-2xl md:text-5xl` | أكبر من باقي عناوين الصفحة |
| ✅ | [WhySection.tsx:34](../src/features/forEmployers/components/WhySection.tsx#L34) | `text-base` | `text-sm md:text-xl` | الفقرة طويلة جدًا بـ 16px |
| ✅ | [WhySection.tsx:19](../src/features/forEmployers/components/WhySection.tsx#L19) و [FAQSection.tsx:23](../src/features/forEmployers/components/FAQSection.tsx#L23) | `py-20` | `py-10 sm:py-20` | فراغ كبير بين السكشنز |
| ✅ | [HireSection.tsx:31-33](../src/features/forEmployers/components/HireSection.tsx#L31) | كارت `p-6` + صورة `h-56` | `p-4 sm:p-8` + `h-40 sm:h-56` | كل step كارت ~500px |
| ✅ | [EmployersHeroSection.tsx:40](../src/features/forEmployers/components/EmployersHeroSection.tsx#L40) | `h-100` (400px) | `h-72 sm:h-100` | الـ 3 صور طويلة جدًا |
| ✅ | [EmployersHeroSection.tsx:17](../src/features/forEmployers/components/EmployersHeroSection.tsx#L17) | `py-18` | `pb-10 sm:py-18` | — |
| ✅ | [FAQSection.tsx:24](../src/features/forEmployers/components/FAQSection.tsx#L24) | `px-4` جوه container | `px-0 sm:px-6` | الأسئلة أضيق من باقي الصفحة |

## FAQ `/faq`

| الأولوية | المكان | المقترح | السبب |
|---|---|---|---|
| ✅ | الهيدر (الصورة + كلمة "FAQ") | قلل الـ padding اللي فوق الصورة (~90px)، وخلي العنوان `text-3xl sm:text-5xl` | العنوان ضخم وفيه فراغ كبير فوقه |
| ✅ | الأسئلة | زي بند الـ FAQ المشترك فوق | — |

## Contact `/contact`

| الأولوية | المكان | المقترح | السبب |
|---|---|---|---|
| ✅ | الكارت الخارجي + الكارت الرمادي الداخلي | قلل الـ padding الداخلي لـ `p-4` على الموبيل | padding مزدوج، فالمحتوى بيبقى في عرض ~280px |

## Jobs `/jobs` و Job details `/jobs/[id]`

| الأولوية | المكان | الحالي | المقترح | السبب |
|---|---|---|---|---|
| 🟡 | [JobDetailsHeader.tsx:34](../src/features/jobs/components/candidate/JobDetailsHeader.tsx#L34) | `text-lg` ("at Hospitals & …") | `text-sm md:text-lg` | أكبر من عنوان الوظيفة نفسه (`text-base`) |
| 🟡 | [JobLocationAndSalaryCard.tsx:19,34](../src/features/jobs/components/JobLocationAndSalaryCard.tsx#L19) | `text-lg` + `py-8` | `text-base md:text-lg` + `py-5 md:py-8` | — |
| 🟡 | [JobDescriptionCard.tsx:20-21](../src/features/jobs/components/JobDescriptionCard.tsx#L20) | `p-7` + `text-xl` | `p-4 md:p-7` + `text-lg md:text-xl` | الكارت ده بالذات طويل جدًا، فالـ padding بيفرق |
| 🟡 | [AboutEmployer.tsx:24-28](../src/features/jobs/components/candidate/AboutEmployer.tsx#L24) | `text-lg` / `text-base` + `text-justify` | `text-base md:text-lg` / `text-sm md:text-base` + `text-start md:text-justify` | اسم الشركة بيتكسر، والوصف فيه فراغات كبيرة بين الكلمات |
| 🟡 | [SimilarJobCard.tsx](../src/features/about/components/SimilarJobCard.tsx#L23) | — | شيل الـ `h-full` أو الـ min-height على الموبيل | فيه فراغ فاضي ~60px تحت المحتوى |
| ⚪ | [CandidateJobCard.tsx:114](../src/features/jobs/components/candidate/CandidateJobCard.tsx#L114) | `text-sm md:text-base` | تمام | — |

## Auth (login / register / forget password)

| الأولوية | المكان | المقترح | السبب |
|---|---|---|---|
| ⚪ | أزرار LinkedIn / Google | شوف بند المكونات المشتركة | — |
| ⚪ | Login: الـ form | فيه فراغ ~100px فوق "Welcome Back!" | ممكن تقلل الـ top padding على الموبيل |

باقي صفحات الـ auth شكلها كويس على الموبيل.

---

## Dashboards (candidate / company / hiring-manager): مراجعة كود

> اتصوّرت بالحسابين (company و candidate) وبصفحات الـ hiring manager على 375px. البنود اللي عليها 👁️ اتأكدت بالعين، والباقي من مراجعة الكود بس، لأن المودالز وحالات الداتا الفاضية متصوّرتش. الجداول كلها جوه `overflow-x-auto` فمفيش مشكلة فيها.

### 🆕 لقيتها في الصور (مش في مراجعة الكود)

| الأولوية | المكان | المشكلة | المقترح |
|---|---|---|---|
| 🔴 | [CvBuilderWizard.tsx:29](../src/features/candidate-cv-builder/components/wizard/CvBuilderWizard.tsx#L29) (`/candidate/build-cv/create`) | **الصفحة الوحيدة اللي فيها horizontal scroll** (عرضها 440px): الـ grid ملوش أعمدة على الموبيل، فبيتمد على قد الـ stepper (9 خطوات) والفورم بيطلع برا الشاشة | ضيف `grid-cols-1` (= `minmax(0,1fr)`) قبل `lg:grid-cols-[…]` |
| 🔴 | `/company/talent-database` | **Bug مش مقاسات**: الصفحة بتقع بـ 500 "Maximum update depth exceeded" (infinite setState loop) | محتاج debug |
| 🟡 | [PlainBreadcramb.tsx:16-19](../src/shared/components/PlainBreadcramb.tsx#L16) و [Breadcrumb.tsx:36-39](../src/shared/components/Breadcrumb.tsx#L36) | مع العناوين الطويلة ("Build Your Professional CV" و "Professional Credentials") العنوان والـ breadcrumb الاتنين بيتكسروا على سطرين | `hidden sm:flex` على الـ `ol`، أو اعرض آخر item بس على الموبيل |
| 🟡 | كارت التابات اللي فوق صفحات company و candidate (Company Profile / Dashboard…) | الكارت واخد ~90px بسبب padding الكارت + padding التابات | قلل padding الكارت لـ `p-2` على الموبيل |
| 🟡 | Job management: كارت الوظيفة | زراري "Received Applications" و "Job Details" ارتفاعهم ~20px بس، أصغر من tap target مريح | `h-9 sm:h-…` |
| 🟡 | Candidate: تابات Saved / Applied (Job Applications) | الخط `text-xl`، أكبر من باقي التابات | `text-base sm:text-xl` |
| ⚪ | Certificates / Licenses: الكارت | العنوان `text-xl` والتواريخ `text-lg` | درجة أصغر على الموبيل |
| ⚪ | Company profile: About | `text-justify` بيعمل فراغات كبيرة بين الكلمات | `text-start sm:text-justify` ([AboutSection.tsx:25](../src/features/company-profile/components/AboutSection.tsx#L25)) |
| ⚪ | Build CV: الـ hero | `text-justify` في الفقرة ([CvBuilderHero.tsx:44](../src/features/candidate-cv-builder/components/landing/CvBuilderHero.tsx#L44)) | `text-start sm:text-justify` |

**بنود مراجعة الكود اللي اتأكدت بالعين 👁️:**
- كوفر ولوجو Company Profile (ProfileHeader)
- فورم Post Job لازق في حرف الشاشة
- تابات الـ pipeline ("Pipeline Candidates" بيتكسر على سطرين)
- صورة الـ candidate في Candidate Profile
- عناوين Additional Info و CV Builder و ATS و Create Password
- الـ justify في أكورديون ATS
- كروت الداشبورد (`14 days` و `5.2K` بـ 38px)

اللي اتشاف وشكله كويس: Projects، Project details، Roles، Users، Assessments، Assessment results، Basic info، Chat، Hiring-manager shared project.

> **اتصلّح أثناء المراجعة:** [ActiveJobRow.tsx](../src/features/company-dashboard/components/ActiveJobRow.tsx) كان فيه merge conflict markers متعملها commit في `d5c4604`، وكان عامل Build Error لكل صفحات company. اتحل بنسخة HEAD (current) زي ما طلبت.

### مشتركة: ابدأ بيها (تصليح واحد بيغطي صفحات كتير)

| الأولوية | المكان | الحالي | المقترح | السبب |
|---|---|---|---|---|
| 🔴 | [dialog.tsx:75](../src/shared/components/ui/dialog.tsx#L75) | `w-full` | `w-[calc(100%-2rem)] sm:w-full` | ~15 مودال لازقين في حرف الشاشة (Delete, Success, Alert, CV, credentials, education/experience, skills, UpdateEmail…) |
| 🔴 | [PasswordChangedModal.tsx:44-48](../src/shared/components/modals/PasswordChangedModal.tsx#L44) | صورة `size-75` + `px-8 pt-30 pb-16` | `size-48 sm:size-75` + `px-5 pt-16 pb-8 sm:px-8 sm:pt-30 sm:pb-16` | صورة 300px في مساحة ~280px، يعني بتطلع برا |
| 🟡 | [ModalHeading.tsx:28](../src/shared/components/modals/ModalHeading.tsx#L28) | `text-[28px]` | `text-2xl sm:text-[28px]` | بيغطي 6+ مودالز. نفس الـ `text-[28px]` متكرر inline في credentials modals و EducationFormModal:111 و ExperienceFormModal:148 و UpdateEmailModal:33 و CvViewModal:49 و TalentMessageDialog:71 |
| 🟡 | [CountPageHeader.tsx:23-26](../src/shared/components/common/CountPageHeader.tsx#L23) | `flex … justify-between` + `text-[38px]` / `text-[28px]` | ضيف `flex-wrap` + `text-[28px] sm:text-[38px]` / `text-xl sm:text-[28px]` | صفحات Roles و Users و Recruiter Activity و Assessment Categories |
| 🟡 | [SuccessModal.tsx:129-154](../src/shared/components/modals/SuccessModal.tsx#L129) | `p-8`، `mt-15 mb-12`، `h-50 w-50`، `text-lg` | `p-5 sm:p-8`، `mt-8 mb-6 sm:…`، `h-36 w-36 sm:h-50 sm:w-50`، `text-base sm:text-lg` | ⚠️ اللي بيمرروا `visualClassName` لازم يمرروا كمان قيمة `sm:` بتاعتهم، عشان tailwind-merge مش هيشيل `sm:h-50` |
| 🟡 | [DeleteModal.tsx:52-55](../src/shared/components/modals/DeleteModal.tsx#L52) و [AlertModal.tsx:53-54](../src/shared/components/modals/AlertModal.tsx#L53) | `p-8` + gif `h-50 w-50` + `mt-15 mb-12` | `p-5 sm:p-8` + `h-32 w-32 sm:h-50 sm:w-50` + `mt-8 mb-6 sm:…` | المودال بياخد معظم ارتفاع الشاشة |
| 🟡 | [button.tsx:38](../src/shared/components/ui/button.tsx#L38) variant `pill` | `h-13 px-8` + nowrap | `h-11 px-5 sm:h-13 sm:px-8` | بيصلّح أزرار الـ pill اللي عرضها `w-1/3` واتزنقت (post-job، complete-account، account settings). ⚠️ بيأثر على الصفحات العامة كمان، فممكن تصلّح كل مكان لوحده بدل كده |
| ⚪ | [YesNoQuestionCard.tsx:55,62](../src/shared/components/YesNoQuestionCard.tsx#L55) | `text-[21px]`، `gap-14` | `text-lg sm:text-[21px]`، `gap-8 sm:gap-14` | — |
| ⚪ | [HttpStatusState.tsx:33](../src/shared/components/HttpStatusState.tsx#L33) و [RouteErrorFallback.tsx:29](../src/shared/components/RouteErrorFallback.tsx#L29) | `py-16`، `p-8`، `text-3xl` | `py-8 sm:py-16`، `p-5 sm:p-8`، `text-2xl sm:text-3xl` | شاشات الإيرور |
| ⚪ | [PositionCard.tsx:20-21](../src/features/jobs/components/PositionCard.tsx#L20) | `gap-6`، لوجو `h-22 w-24` | `gap-3 sm:gap-6`، `h-16 w-18 sm:h-22 sm:w-24` | هيدر الوظيفة في company و pipeline |

### Candidate

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🟡 | [AdditionalInfoPage.tsx:24](../src/features/candidate-additional-info/components/AdditionalInfoPage.tsx#L24) | `text-[32px] leading-10` | `text-2xl leading-8 sm:text-[32px] sm:leading-10` |
| 🟡 | [AdditionalInfoPage.tsx:53,61](../src/features/candidate-additional-info/components/AdditionalInfoPage.tsx#L53) | `min-w-40` / `min-w-56` | `w-full sm:w-auto sm:min-w-40` / `w-full sm:w-auto sm:min-w-56` (مش داخلين جنب بعض) |
| 🟡 | Certificate / License / Qualification modals (`:222` / `:219` / `:254`) | `text-[28px]` | `text-2xl sm:text-[28px]` |
| 🟡 | [CvBuilderHero.tsx:29,41](../src/features/candidate-cv-builder/components/landing/CvBuilderHero.tsx#L29) و [AtsIntroCard.tsx:17,30](../src/features/candidate-cv-match-ats/components/intro/AtsIntroCard.tsx#L17) | `gap-8 p-6`، `text-3xl` | `gap-6 p-4 sm:gap-8 sm:p-6`، `text-2xl sm:text-3xl` |
| 🟡 | [CvBuilderWizard.tsx:39](../src/features/candidate-cv-builder/components/wizard/CvBuilderWizard.tsx#L39) و [PersonalDetailsStep.tsx:28](../src/features/candidate-cv-builder/components/wizard/steps/PersonalDetailsStep.tsx#L28) | `gap-15` | `gap-8 sm:gap-15` |
| 🟡 | [CvViewModal.tsx:47](../src/features/candidate-cv-builder/components/view/CvViewModal.tsx#L47) | `px-6 py-8` | `px-4 py-5 sm:px-6 sm:py-8` |
| 🟡 | [AtsAnalyzing.tsx:13](../src/features/candidate-cv-match-ats/components/AtsAnalyzing.tsx#L13) | `gap-18 py-10` | `gap-10 py-8 sm:gap-18 sm:py-10` |
| 🟡 | [AtsFeatureAccordion.tsx:24](../src/features/candidate-cv-match-ats/components/intro/AtsFeatureAccordion.tsx#L24) | `text-justify text-lg` | `text-start text-sm sm:text-justify sm:text-lg` |
| ⚪ | [AtsResultCard.tsx:37](../src/features/candidate-cv-match-ats/components/results/AtsResultCard.tsx#L37) | `text-[38px]` | `text-3xl sm:text-[38px]` |
| ⚪ | [AiJobMatchHeader.tsx:20,25](../src/features/candidate-ai-job-match/components/AiJobMatchHeader.tsx#L20) | `size-14`، `text-2xl` | `size-11 sm:size-14`، `text-xl sm:text-2xl` |
| ⚪ | [AssessmentStatusIcon.tsx:23,27](../src/features/candidate-assessment/components/status/AssessmentStatusIcon.tsx#L23) و AssessmentUnavailable.tsx:25 | `size-28` / `size-14` | `size-20 sm:size-28` / `size-10 sm:size-14` |
| ⚪ | [ProfileViewerCard.tsx:23,28](../src/features/candidate-profile-insights/components/ProfileViewerCard.tsx#L23) | `size-20` / `size-17.5` | `size-14 sm:size-20` / `size-12 sm:size-17.5` |
| ⚪ | CVModal.tsx:49، AddSkillsModal.tsx:212، EditSkillsModal.tsx:121، CvAddButton.tsx:17، CvBuilderActions.tsx:13 | `p-8` / `px-10` / `px-8` | `p-5 sm:p-8` / `px-6 sm:px-10` / `px-5 sm:px-8` |

### Chat (candidate + company)

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🟡 | [ChatConversationList.tsx:45-46](../src/features/chat/components/ChatConversationList.tsx#L45) | `px-6 pt-6`، `text-2xl` | `px-4 pt-4 sm:px-6 sm:pt-6`، `text-xl sm:text-2xl` |
| ⚪ | [ChatWindowHeader.tsx:50](../src/features/chat/components/ChatWindowHeader.tsx#L50) | `size-14` | `size-11 sm:size-14` |
| ⚪ | [ChatMessageItem.tsx:61-65](../src/features/chat/components/ChatMessageItem.tsx#L61) | `w-105` / `w-108` / `w-100` | `w-fit sm:w-105`… (حاليًا كل رسالة، حتى "Hi"، واخدة العرض كله. ده تغيير في الشكل، فقرارك) |

### Company: profile، complete account، settings

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🔴 | [ProfileHeader.tsx:53,60](../src/features/company-profile/components/ProfileHeader.tsx#L53) | الكوفر `h-93.75` (375px) + `mb-20` + `rounded-[40px]` | `h-48 mb-14 rounded-3xl sm:h-93.75 sm:mb-20 sm:rounded-[40px]` |
| 🔴 | [ProfileHeader.tsx:114-115](../src/features/company-profile/components/ProfileHeader.tsx#L114) | لوجو `w-37.5 h-37.5`، `-bottom-12 left-8` | `size-24 sm:size-37.5`، `-bottom-8 start-4 sm:-bottom-12 sm:start-8` |
| 🔴 | [cover-upload-image.tsx:102,113,164](../src/features/complete-account/components/cover-upload-image.tsx#L102) | `h-93.75`، `h-75 rounded-[50px]`، لوجو `w-37.5` | `h-60 sm:h-93.75`، `h-44 rounded-3xl sm:h-75 sm:rounded-[50px]`، `size-24 sm:size-37.5` |
| 🔴 | [wizard-navigation.tsx:29,42,54](../src/features/complete-account/components/wizard-navigation.tsx#L29) | `w-1/3` pill `px-8` | `w-1/2 px-4 sm:w-1/3 sm:px-8` (حوالي 40px بس للنص، فبيطلع برا الزرار) |
| 🟡 | [BasicInfoForm.tsx:209,383](../src/features/accout-settings/components/basic-info/BasicInfoForm.tsx#L209) | `w-1/3` pill | `w-1/2 px-4 sm:w-1/3 sm:px-8` |
| ⚪ | [UpdateEmailModal.tsx:31](../src/features/accout-settings/components/basic-info/UpdateEmailModal.tsx#L31) | `pt-14` | `pt-10 sm:pt-14` |

### Company: dashboard

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🟡 | [DashboardAnalyticsCard.tsx:35,61](../src/features/company-dashboard/components/DashboardAnalyticsCard.tsx#L35) | `p-6`، `text-[38px]` | `p-4 sm:p-6`، `text-3xl sm:text-[38px]` |
| 🟡 | [DashBoardStatsCard.tsx:33,51](../src/features/company-dashboard/components/DashBoardStatsCard.tsx#L33) | `p-6` (+ `end-6`)، `text-[28px]` | `p-4 sm:p-6` (+ `end-4 sm:end-6`)، `text-2xl sm:text-[28px]` |
| ⚪ | [DashboardRecruitersChart.tsx:31](../src/features/company-dashboard/components/DashboardRecruitersChart.tsx#L31) | `p-6` | `p-4 sm:p-6` |

### Company: jobs، post-job، pipeline

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🔴 | [PostJobForm.tsx:751-752](../src/features/jobs/components/PostJobForm.tsx#L751) | `max-w-7xl py-12` من غير padding جانبي، + `p-6` | `px-4 py-6 sm:px-0 sm:py-12` + `p-4 sm:p-6` (الفورم لازق في حرف الشاشة) |
| 🔴 | [PostJobForm.tsx:820,839](../src/features/jobs/components/PostJobForm.tsx#L820) | `w-2/6 md:w-1/6` pill | `w-1/2 px-4 sm:w-2/6 sm:px-8 md:w-1/6` (نص Prev/Next بيطلع برا الزرار) |
| 🟡 | [JobCandidatesTabs.tsx:38](../src/features/jobs/components/pipeline/JobCandidatesTabs.tsx#L38) | `px-4 py-3 text-base` | `px-2 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base` |
| 🟡 | [JobDescriptionCard.tsx:20](../src/features/jobs/components/JobDescriptionCard.tsx#L20) | `p-7` | `p-4 sm:p-7` (نفس البند اللي في Job details العامة) |
| ⚪ | job-management/page.tsx:6، JobManagementSection.tsx:118، PipelineCandidatesTab.tsx:87، PipelineFiltersPage.tsx:140، JobOverviewCard.tsx:15 | `gap-12`، `p-8`، `p-10`، `text-2xl`، `px-4` | `gap-6 sm:gap-12`، `p-5 sm:p-8`، `p-6 sm:p-10`، `text-xl sm:text-2xl`، `sm:px-4` |

### Company: assessments

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🔴 | [CandidateAssessmentHeader.tsx:145](../src/features/company-assessments/components/results/CandidateAssessmentHeader.tsx#L145) | `grid-cols-4 gap-3` | `grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3` (الـ 4 pills النص بتاعهم بيطلع برا) |
| 🟡 | ExternalInvitationsPage.tsx:46، AssessmentResultsPage.tsx:28، AssessmentCandidateSummary.tsx:29 | `text-[28px]` | `text-2xl sm:text-[28px]` |
| 🟡 | [AssessmentSentSuccess.tsx:40,57,66](../src/features/company-assessments/components/shared/AssessmentSentSuccess.tsx#L57) | صورة `h-[242px] w-[230px]`، `text-[30px]`، `pt-10` | `h-[168px] w-[160px] sm:…`، `text-2xl sm:text-[30px]`، `pt-14 sm:pt-10` |
| ⚪ | CandidateAssessmentHeader.tsx:59,153، AssessmentCandidateSummary.tsx:22، ExternalInvitationsPage.tsx:43، AssessmentProgress.tsx:11، AssessmentBuilderHeader.tsx:19، AssessmentCategoriesPage.tsx:22، AssignAssessmentDialog.tsx:61 | `p-6`، `text-2xl`، `p-5`، `gap-11`، `mb-10`، `gap-10` | `p-4 sm:p-6`، `text-xl sm:text-2xl`، `p-3 sm:p-5`، `gap-6 sm:gap-11`، `mb-6 sm:mb-10`، `gap-6 sm:gap-10` |

### Company: projects، talent database، users

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🔴 | [ProjectShareModal.tsx:120,126](../src/features/company-projects/components/Modals/ProjectShareModal.tsx#L126) | `max-w-[700px] p-10`، صورة `h-[242px] w-[230px]` | ضيف `w-[calc(100%-2rem)]` + `p-5 sm:p-10`، `h-40 w-38 sm:h-[242px] sm:w-[230px]` |
| 🟡 | [MemberFormModal.tsx:55](../src/features/company-admin-users/components/MemberFormModal.tsx#L55) | `max-w-lg p-8 sm:p-10` | ضيف `w-[calc(100%-2rem)]` + `p-5 sm:p-10` |
| 🟡 | [TalentResultsHeader.tsx:28-29](../src/features/company-talent-database/components/TalentResultsHeader.tsx#L28) | `text-[28px]` / `text-4xl` | `text-xl sm:text-[28px]` / `text-[28px] sm:text-4xl` |
| 🟡 | [ScheduleInterviewsStep.tsx:78,86](../src/features/company-projects/components/shared-review/ScheduleInterviewsStep.tsx#L78) (كمان hiring-manager) | `px-10` / `px-8` | `flex-1 px-4 sm:flex-none sm:px-10` / `… sm:px-8` |
| ⚪ | CandidatePreviewModal.tsx:90، ProjectsPage.tsx:80، CandidateProfileSidebar.tsx:36، ProjectCandidateProfilePage.tsx:21، SharedReviewPage.tsx:26، TalentMessageDialog.tsx:62، TalentDatabasePage.tsx:108 | `text-4xl`، `p-8`، `size-37.5`، `gap-8 py-8`، `pt-10 pb-14`، `gap-8`، dialog title `text-[28px]` | `text-3xl sm:text-4xl`، `p-5 sm:p-8`، `size-28 sm:size-37.5`، `gap-5 py-5 sm:…`، `pt-6 pb-8 sm:…`، `gap-5 sm:gap-8`، `text-2xl sm:text-[28px]` |

### Hiring manager

| الأولوية | المكان | الحالي | المقترح |
|---|---|---|---|
| 🟡 | [CreatePasswordContent.tsx:16,19,28](../src/features/auth/components/first-login/CreatePasswordContent.tsx#L16) | `text-3xl`، `text-lg` | `text-2xl sm:text-3xl`، `text-base sm:text-lg` |
| — | shared projects | شوف ScheduleInterviewsStep فوق | — |

---

## ترتيب مقترح للشغل

1. `dialog.tsx` + `ModalHeading` + `CountPageHeader` + مودالز Success / Delete / Alert / PasswordChanged (تصليحات قليلة بتغطي معظم الداشبورد)
2. كل الـ 🔴: أولهم `grid-cols-1` في CvBuilderWizard (الـ horizontal scroll الوحيد)، وبعدين ProfileHeader، cover-upload، PostJobForm، wizard-navigation، CandidateAssessmentHeader، ProjectShareModal، عناوين About، Banner بتاع employers، النص المتكرر)
3. الـ FAQ accordion المشترك + هيدر Testimonials
4. باقي الـ 🟡، وبعدين الـ ⚪ لو عندك وقت
