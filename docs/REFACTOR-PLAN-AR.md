# خطة تظبيط كود Joocare (جزء جزء)

> **تاريخ المراجعة:** 2026-11-11, branch `development` (commit `9c771cc`)
> **الغرض:** قائمة شغل مرتبة. كل مرحلة تتعمل في PR لوحدها، ونعلّم `[x]` على كل بند بعد ما يخلص ويتراجع.
> **مراجع:** القواعد في [RULES.md](RULES.md). كل الأرقام هنا متقاسة من الكود.

---

## الأرقام وقت المراجعة

| الفحص                                                           | النتيجة                                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit`                                              | ✅ ناجح                                                                                         |
| `npx eslint src`                                                | ❌ **11 error + 36 warning** (7 `no-explicit-any`، 4 `react-hooks` refs/render، 34 unused vars) |
| ملفات `src`                                                     | 1143 ملف، منها 489 فيها `'use client'`                                                          |
| `console.log`                                                   | 47 مرة في حوالي 25 ملف (منهم `src/auth.ts`)                                                     |
| ملفات مش مستوردة في أي مكان (dead code)                         | 40 ملف                                                                                          |
| `shared` بيستورد من `features` (عكس الاتجاه)                    | 7 ملفات                                                                                         |
| raw `fetch(` خارج `apiFetch`                                    | 33 مرة في حوالي 29 ملف                                                                          |
| `process.env.NEXT_PUBLIC_*` مباشرة                              | 42 مرة في حوالي 20 ملف                                                                          |
| ألوان hex (`[#...]`)                                            | 50                                                                                              |
| ألوان palette خام (`gray-*`, `red-500`...)                      | 122                                                                                             |
| `bg-white` / `text-white` / `text-black`                        | 260                                                                                             |
| أحجام خط arbitrary (`text-[28px]`...)                           | 206                                                                                             |
| classes غير RTL-safe (`ml-` `mr-` `pl-` `pr-` `left-` `right-`) | 124                                                                                             |
| `locale === 'ar'` ternaries                                     | 48                                                                                              |
| `next/link` بدل `@/i18n/navigation`                             | 7                                                                                               |
| عدد `<main>`                                                    | 24 (فيهم متداخلين)                                                                              |
| CI                                                              | build بس، **مفيش lint ولا type-check ولا tests**                                                |

---

## ✅ الحاجات المظبوطة (نحافظ عليها)

- **التقسيم الأساسي** `app` / `features` / `shared` / `i18n` واضح ومناسب لمشروع Next.js App Router.
- **القواعد مكتوبة كويس**: [RULES.md](RULES.md) شامل، وفيه reference implementations (`company-admin-users`، `candidate-settings/change-password`).
- **طبقة API مركزية**: `apiFetch` بيرجع `{ ok, data, message }` ومش بيعمل throw، وفيه `api-endpoints.ts` و`http-error.ts` و`in-flight-dedupe.ts` و`request-logging.ts`.
- **TypeScript strict** والـ type-check ناجح، و`any` قليلة جدًا (حوالي 7).
- **تسمية الكومبوننتات موحدة**: 508 ملف PascalCase مقابل 4 بس kebab-case.
- **مفيش barrel files**، والـ imports مباشرة زي ما القواعد بتقول.
- **الفورمز** ماشية على React Hook Form + Zod مع message-factory للترجمة.
- **shadcn/ui** متظبط بـ aliases صح في `components.json`، والـ `cn()` مستخدمة.
- **i18n** بـ next-intl مع locale routing، وفيه ملفات ترجمة للغتين.
- **فيه CI للـ deploy** على `main` و`development`.

---

## المرحلة 0: نظافة الريبو والأدوات (PR صغير وسريع)

- [x] **ملفات تعليمات الـ AI في مكان غلط:** `CLAUDE.md` و`AGENTS.md` اتنقلوا من `docs/` للـ root (بـ `git mv`)، واللينكات جواهم بقت بتشاور على `docs/RULES.md`.
- [x] **لينك مكسور:** `README.md:63` بقى بيشاور على `docs/RULES.md`. ولينك `request-caching-audit.md` جوا `docs/RULES.md` اتصلح كمان.
- [x] **نص زيادة في آخر `docs/RULES.md`:** سطور "create same desgin typical in figma..." اتشالت.
- [x] **ملفات مش المفروض تكون في git:** `ts_errors.txt` اتمسح، و`.playwright-mcp/*.log` اتشال من git، والاتنين اتضافوا لـ `.gitignore` مع `.agents/` (الفولدر الفاضي اتمسح).
- [x] **scripts في `package.json`:** اتضاف `typecheck` و`format` و`format:check`، واتعمل `.prettierignore`.
- [x] نسخ الأدوات: `@types/node` بقى `^24` (زي Node 24 على السيرفر)، و`eslint-config-next` بقى `16.2.6` (نفس نسخة `next` المتسطبة). الـ typecheck لسه ناجح، والـ lint نفس النتيجة (11 error + 36 warning).
- [ ] **CI (قرار صاحب المشروع):** `.github/workflows` مش هنلمسه. لو اتقرر بعدين يتضاف `npm run typecheck` و`npm run lint` على الـ PRs، ده بيتعمل يدوي.
- [x] **قواعد Prettier:** `.prettierrc` فيه القواعد كاملة (single quotes، semicolons، 2 spaces، printWidth 80، trailing commas، LF، وترتيب Tailwind classes جوا `cn`/`cva`/`clsx`). و`.vscode/settings.json` بقى بيستخدم Prettier للـ TS/TSX (كان بيستخدم formatter بتاع TypeScript، وده سبب اختلاف الستايل). واتضاف `.gitattributes` عشان كل الملفات تبقى LF.
- [ ] **تطبيق الفورمات:** `npm run format:check` بيقول إن **872 ملف** محتاجين فورمات. نشغّل `npm run format` في PR **لوحده**، في وقت مفيش فيه branches مفتوحة، عشان مايعملش conflicts.

---

## المرحلة 1: الأمان والإنتاج (P0، قبل أي حاجة تانية)

- [ ] **⚠️ redirect الإنتاج:** `next.config.ts` فيه redirect **permanent (308)** من `joocare.com` إلى `https://www.joocare.cloud`. الـ CI بيعمل deploy لـ `main` على `joocare.com` (live) و`.cloud` هو بيئة التست. لو مش مقصود، **أي حد يفتح الموقع الحقيقي بيتحول لبيئة التست**، والمتصفحات بتعمل cache للـ permanent redirect. القيمة القديمة المتعلق عليها كانت `www.joocare.com`. **لازم يتأكد فورًا.**
- [x] **تسريب بيانات في اللوج:** اتشال `console.log("USER FOUND:", data)` (اللي كان بيطبع response الدخول بالتوكن) و`console.log('LOGIN ATTEMPT:', email)` من `src/auth.ts`.
- [x] **Open redirect:** helper جديد `getSafeRedirectPath` في `src/shared/lib/safe-redirect.ts`، بيقبل بس paths جوا الموقع (بيحل الـ URL ويقارن الـ origin، فبيرفض `https://...` و`//...` و`/\...` و`/\t/...`). اتستخدم في مكانين: `src/proxy.ts` و`features/auth/hooks/useLogin.ts` (التحويل بعد تسجيل الدخول).
- [ ] **XSS محتمل من HTML جاي من الـ API** (`dangerouslySetInnerHTML` من غير sanitize). **اتأجل بقرار:** اتعمل واترجع زي ما كان. الأماكن:
  - `src/features/jobs/components/JobDescriptionCard.tsx`
  - `src/features/jobs/components/JobReviewPanel.tsx`
  - `src/features/about/components/SimilarJobCard.tsx`
  - `src/app/[locale]/(shared-layout)/privacy-policy/page.tsx`
  - `src/app/[locale]/(shared-layout)/terms-conditions/page.tsx`
  - الحل لما يتقرر: helper واحد `sanitizeHtml` (مثلًا `isomorphic-dompurify`)، أو تأكيد مكتوب من الباك إند إن المحتوى متنضف.
- [ ] **JSON-LD:** `jobs/page.tsx` و`faq/page.tsx` بيعملوا `JSON.stringify(schema)` جوا `<script>` من غير escape لـ `<`. **اتأجل بقرار:** اتعمل واترجع زي ما كان.
- [x] **`/en/en` بعد تسجيل الدخول:** الـ proxy بيحفظ `callbackUrl` باللغة (`/en/...`) وراوتر next-intl بيضيف اللغة تاني. `useLogin` بقى يفصل اللغة من المسار قبل `router.push` (مشكلة كانت موجودة قبل التعديلات).
- [ ] **`api/pdf-proxy` و`api/download-cv`:** سياسة موحدة للدومينات المسموحة والـ redirects والـ timeout وحجم الملف.

---

## المرحلة 2: ESLint يبقى صفر

- [ ] حل الـ 11 error:
  - `no-explicit-any` ×7 (منهم `features/jobs/hooks/useGetCompanyJob.ts` و`shared/lib/typed-zod-resolver.ts`)
  - `react-hooks/refs` و`render` ×4 (منهم `useInfiniteScroll` و`header/DrawerScrollableContent.tsx`)
- [ ] شيل الـ 34 unused vars/imports.
- [ ] شيل كل الـ `console.log` (47). لو فيه لوج محتاجينه يروح لـ `shared/lib/request-logging.ts`.
- [ ] نضيف rule في ESLint: `no-console: ['warn', { allow: ['warn', 'error'] }]`.
- [ ] نضيف rule تمنع `next/link` و`next/navigation` (`no-restricted-imports`) ونوجّه لـ `@/i18n/navigation`. فيه 7 أماكن محتاجة تتصلح.
- [ ] (اختياري) rule تمنع `@/features/*` جوا `src/shared/**`، عشان المرحلة 5 ماتترجعش تاني.

---

## المرحلة 3: الكود الميت والملفات المكررة

> قبل أي حذف: `grep` على اسم الملف للتأكد إنه مش متحمّل dynamic.

- [ ] **`features/forEmployers`:** فيه 10 ملفات في الـ root متكررة في `components/` ومش مستخدمة: `Banner`، `BannerSection`، `EmployersHero`، `EmployersHeroSection`، `FAQ`، `FAQSection`، `Hire`، `HireSection`، `Why`، `WhySection`. الصفحة بتستخدم نسخ `components/` بس.
- [ ] **ملفات مش مستوردة في أي مكان:**
  - `about/components/`: `AboutStatItem.tsx`، `core-pillars-data.ts`، `Misison.tsx`، `Vision.tsx`
  - `auth/components/forget-password/EnterEmailModal.tsx`
  - `candidate-credentials/services/qualification-service.ts`
  - `candidate-settings/hooks/useGetBusinessVerification.tsx` (اسمه تبع الـ company settings أصلًا)
  - `company/types/index.ts`
  - `company-projects/components/Modals/CandidatePreviewModal.tsx`
  - `contact/RenderField.tsx`
  - `home/components/Cons.tsx`، `Pros.tsx`
  - `jobs/components/`: `ApplicantRow.tsx`، `JobPostForm.tsx`، `JobsList.tsx`، و`company/JobEducationAndCertificationsCard.tsx`، `JobLocationAndSalaryCard.tsx`، `JobOverviewCard.tsx`
  - `jobs/hooks/useFormPersist.ts`، `jobs/services/job-management-service.ts`
  - `notifications/hooks/useDeleteNotifcataion.ts`
  - `shared/components/ClientErrorBoundary.tsx`، `FilepondComponents.tsx`
  - `shared/services/job-titles.ts`، `shared/util/formateDate.ts`
  - shadcn مش مستخدمة: `ui/calendar`، `ui/field`، `ui/form`، `ui/progress`، `ui/sonner`. **ده قرار:** ممكن تفضل لو هنستخدمها قريب.
- [ ] **ملف "copy" مستخدم فعلًا:** `accout-settings/services/update-business-verification-service copy.ts` (الاسم فيه مسافة)، ومستورد في `useUpdateBusinessVerification.tsx:4`. يتغير اسمه لـ `update-business-verification-service.ts` ويتصلح الـ import.
- [ ] **`.dark` في `globals.css` (سطر 367):** مفيش `ThemeProvider` شغال (`next-themes` مستوردة بس في `ui/sonner.tsx` اللي مش مستخدم)، يعني الـ dark mode **مش شغال خالص**. القرار: إما نشيل `.dark` و`next-themes`، أو نخليه ضمن نطاق الشغل ونكمله.
- [ ] `DescriptionSection.tsx` بياخد prop اسمه `title` والـ JSX اللي بيعرضه متعلق، فالعنوان مش بيظهر.

---

## المرحلة 4: الأسماء والـ Folder Structure

> كل rename في PR لوحده بـ `git mv`، ونعمل `tsc` بعده. أي route عام (URL) لو اتغير اسمه يتعمله redirect.

### 4.1 أخطاء إملائية

| الحالي                                                 | الصح                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `features/accout-settings/`                            | `features/company-account-settings/` (أو `account-settings`) |
| `features/forEmployers/`                               | `features/for-employers/`                                    |
| `app/.../shared-copmonents-page/`                      | تتشال من الإنتاج أو تتنقل لـ route dev-only (شوف 4.3)        |
| `candidate-profile/services/user-skills-suggetions.ts` | `user-skills-suggestions-service.ts`                         |
| `notifications/hooks/useDeleteNotifcataion.ts`         | يتمسح (مش مستخدم)                                            |
| `shared/components/PlainBreadcramb.tsx`                | `PlainBreadcrumb.tsx`                                        |
| `about/components/Misison.tsx`                         | يتمسح (مش مستخدم)                                            |
| `shared/util/formateDate.ts`                           | يتمسح (مش مستخدم)                                            |

### 4.2 توحيد أسماء الفولدرات جوا الـ features

القاعدة في RULES.md: `components / hooks / services / actions / validation / types / constants / utils / store`.

- [ ] `lib/` يبقى `utils/`: `accout-settings/lib`، `auth/lib`، `home/lib`
- [ ] `ui/` يبقى `components/`: `company/ui`
- [ ] `schema/` يبقى `validation/`، و`steps/` يدخل جوا `components/steps/`: `complete-account`
- [ ] `service/` يبقى `services/`: `notifications/service`
- [ ] `data/` (بيانات تجريبية) يبقى `constants/`: `company-admin-roles/data`، `company-admin-users/data`
- [ ] ملفات في root الـ feature تدخل فولدراتها:
  - `contact/*.tsx` (10 ملفات) تدخل `components/`، و`types.ts` يبقى `types/contact.types.ts`
  - `faq/services.ts` و`types.ts` و`utils.ts` تدخل الفولدرات بتاعتها
  - `forEmployers/services.ts` و`types.ts` و`utils.ts` كذلك
  - `jobs/utils.ts` (348 سطر) و`jobs/utils/` موجودين مع بعض، يتدمجوا
- [ ] `features/settings/` فيه `store/` بس وهو app-wide settings، ينقل لـ `shared/store/settings` أو يفضل مع توضيح في RULES.
- [ ] 27 hook امتدادها `.tsx` ومعظمها مش بيرجع JSX، تبقى `.ts`.

### 4.3 `shared`

- [ ] `shared/util/` و`shared/lib/` نفس الدور، يتدمجوا في `shared/lib/`.
- [ ] `shared/components/` فيه 31 ملف flat. يتقسموا:
  - `shared/components/form/`: `InputField`، `TextareaField`، `SelectInputField`، `MultiSelect*`، `TagsInputField`، `PhoneInputCode`، `YearPicker`، `LabelCheckbox`، `SearchInput`، `FilepondUpload`، `StoredFilepondUpload`، `filepondPlugins`
  - `shared/components/feedback/`: `EmptyDataState`، `HttpStatusState`، `RouteErrorFallback`، `ProgressRing`
  - `shared/components/layout/`: `Footer`، `HeaderLayout`، `header/`، `sidebar-nav/`، `SidebarLinks`، `BackToTopButton`، `Breadcrumb`، `PlainBreadcramb`
- [ ] `shared/hooks/requestNotificationPermission.ts` مش hook، ينقل لـ `shared/lib/`.
- [ ] صفحة `shared-copmonents-page` (معرض كومبوننتات بيانات تجريبية) ظاهرة في الإنتاج. تتقفل بـ `notFound()` لو `NODE_ENV === 'production'`.
- [ ] نحدّث جدول `shared` في RULES.md بعد التقسيم.

---

## المرحلة 5: اتجاه الاعتماد (Layering)

### 5.1 `shared` بيستورد من `features` (ممنوع حسب RULES.md)

| الملف                                                  | بيستورد من                                        |
| ------------------------------------------------------ | ------------------------------------------------- |
| `shared/components/HeaderLayout.tsx`                   | company-profile                                   |
| `shared/components/header/HeaderActionsButtons.tsx`    | candidate-profile, company-profile, notifications |
| `shared/components/header/UserDropDown.tsx`            | auth, candidate-profile, company-profile          |
| `shared/components/header/UserProfileCard.tsx`         | auth, candidate-profile, company-profile          |
| `shared/components/header/DrawerScrollableContent.tsx` | notifications                                     |
| `shared/providers/MainProviders.tsx`                   | auth, settings                                    |
| `shared/providers/redux/store.ts`                      | auth, settings                                    |

**الحل المقترح:** الهيدر ده app shell مش shared UI. ينقل لـ `features/app-shell/` (أو `src/app/_components/`) ويفضل في shared الأجزاء الـ presentational بس، وهي تاخد البيانات props. الـ redux store والـ providers ينقلوا لـ `src/app/providers/` أو `src/store/`، ويتوثق إنهم composition layer مسموحلها تستورد features.

### 5.2 Features بتعتمد على بعض جامد

أكبر الاعتمادات:

| من                | إلى                     | عدد الـ imports |
| ----------------- | ----------------------- | --------------- |
| jobs              | company-assessments     | 15              |
| jobs              | company-talent-database | 8               |
| shared-components | company-admin-roles     | 8               |
| company-projects  | candidate-profile       | 6               |
| company-projects  | candidate-credentials   | 6               |
| about             | home                    | 6               |
| shared-components | company-assessments     | 6               |

- [ ] **اعتماد دائري:** `auth` و`accout-settings` بيستوردوا من بعض. اللي مشترك ينقل لـ `shared` أو لواحد منهم بس.
- [ ] `features/shared-components/` اسمه بيقول shared بس هو feature بيستورد من features تانية. نحدد دوره: لو صفحة معرض، يتقفل مع 4.3. لو كومبوننتات مشتركة، ينقل لـ `shared`.
- [ ] الحاجات المشتركة فعلًا بين أكتر من feature (types التقييمات، بطاقة المرشح، chips الحالة) تنقل لـ `shared`. أي import لـ preview data من feature تانية يتشال.

---

## المرحلة 6: طبقة الـ API

- [ ] **14 lookup hook مكررين:** `useGetCategories`، `useGetCitiesByCountryId`، `useGetCountries`، `useGetCurrencies`، `useGetDomains`، `useGetEducationLevels`، `useGetEmployerTypes`، `useGetExperiences`، `useGetJobTitles`، `useGetLicenses`، `useGetMandatoryCertifications`، `useGetOrganizationSizes`، `useGetSkills`، `useGetSpecialties`. كلهم كاتبين `useInfiniteQuery` + raw `fetch` بنفسهم، مع إن `useInfiniteLookup` موجود ومستخدم في 6 بس. يتحولوا كلهم عليه، والفرق بينهم يبقى config.
- [ ] **raw `fetch` في services/components** يتحول لـ `apiFetch`:
  - `about/services/about-service.ts`
  - `auth/services/candidate-register-service.ts`، `employer-register-service.ts`
  - `candidate-profile/hooks/useGetUserSkills.ts`
  - `home/components/PopularSearchesInteractive.tsx` (fetch جوا كومبوننت)
  - `home/services/home-service.ts`
  - `jobs/services/download-cv-service.ts`، `jobs-listing-service.ts`
  - `notifications/service/notifications-service.ts`
  - `shared-company-profile/services/company-profile-service.ts`
  - `shared/components/PdfViewer.tsx`، `StoredFilepondUpload.tsx`
- [ ] **`process.env.NEXT_PUBLIC_*` مباشرة** في حوالي 20 ملف (أغلبها services في `accout-settings`، `company-profile`، `complete-account`، `jobs`، `candidate-settings`) تتغير لـ `getBaseApiUrl()` و`getUserApiUrl()` و`getCompanyApiUrl()`.
- [ ] `jobs/hooks/useGetCompanyJob.ts` بيقرا response بأكتر من شكل بـ `any`. نحدد type واحد للـ response ونعمل mapping في الـ service.
- [ ] نضيف `signal` (AbortSignal) و`timeout` لـ options بتاعة `apiFetch`، وTanStack بيبعت `signal` أصلًا للـ queryFn.
- [ ] نراجع defaults الـ QueryClient (`shared/providers/tanstack-query/query-client-setup.ts`): refetch on mount/focus مقفول على مستوى المشروع كله، فالإشعارات وحالة الطلبات محتاجة `staleTime` و`refetchOnWindowFocus` خاصين بيها.

---

## المرحلة 7: الـ Design System

### 7.1 الـ Tokens (`src/app/globals.css`، 757 سطر وحوالي 350 variable)

المشكلة: فيه tokens أساسية كويسة (`primary`، `secondary`، `muted`، `destructive`، `success`، `warning`، `border`، `radius-*`، `shadow-*`)، بس اتضاف فوقيها **حوالي 100 token خاص بشاشة معينة**:
`assessment-*` (23)، `question-card-*` (10)، `match-*` (12)، `dashboard-*` (12)، `chat-*` (13)، `cv-builder-*` (8)، `why-*` (9)، `avatar-*` (8)، `ats-*`، `profile-*`، `job-status-*`، `legacy-accent*`.

- [ ] نطلع قيم الـ tokens دي ونشوف المتكرر. غالبًا `assessment-primary` و`chat-primary` و`dashboard-primary` و`cv-builder-primary` و`ats-primary` نفس اللون أو قريبين جدًا.
- [ ] نعيد التنظيم على 3 طبقات:
  1. **Palette:** الألوان الخام (`brand-500`...، `neutral-*`)
  2. **Semantic:** `primary`، `surface`، `surface-muted`، `text-heading`، `text-muted`، `success/warning/danger/info` + `-bg`
  3. **Component:** بس لما يكون فيه فرق حقيقي ومقصود في التصميم
- [ ] نشيل `legacy-accent*`، و`gray-45` المتعرف مرتين.
- [ ] نقسم `globals.css`: `tokens.css` و`base.css` و`vendors/filepond.css` و`vendors/ckeditor.css` وlayout utilities.

### 7.2 الاستخدام في الكود

- [ ] 50 لون hex (`text-[#212529]` وغيره). أكتر الملفات: `forEmployers/*`، `ui/badge.tsx`، `PlainBreadcramb.tsx`، `company-admin-users/MembersTable.tsx`.
- [ ] 122 palette خام (`gray-500`، `red-500`...). الأخطاء تبقى `text-destructive`.
- [ ] 260 `bg-white` و`text-white` و`text-black`. تبقى `bg-card` و`bg-background` و`text-primary-foreground`. ده شرط لو هنعمل dark mode.
- [ ] نضيف ESLint/grep check في CI يمنع `\[#[0-9a-f]` و`-(gray|red|...)-[0-9]` في الملفات الجديدة.

### 7.3 Typography

- [ ] **مفيش type scale:** 206 حجم arbitrary، والأكتر `text-[28px]` ×47، `text-[10px]` ×40، `text-[13px]` ×30، `text-[12px]` ×20، `text-[21px]` ×17. نعرّف scale في `@theme` (مثلًا `--text-page-title`، `--text-section-title`، `--text-card-title`، `--text-body`، `--text-caption`) أو كومبوننت `Heading` بـ variants.
- [ ] **خط عربي:** `[locale]/layout.tsx` بيحمّل `Outfit` و`Noto_Sans` latin بس، فالعربي بيقع على خط النظام وبيختلف من جهاز للتاني. نضيف خط عربي (مثلًا `Noto_Sans_Arabic` أو `IBM_Plex_Sans_Arabic`) ونربطه بـ `lang="ar"`.

### 7.4 RTL

- [ ] 124 class فيزيائية (`ml-*`، `mr-*`، `pl-*`، `pr-*`، `left-*`، `right-*`) تبقى logical (`ms-*`، `me-*`، `ps-*`، `pe-*`، `start-*`، `end-*`).
- [ ] 48 `locale === 'ar'`. اللي للستايل يبقى `rtl:`، واللي للنص يروح لملفات الترجمة.

### 7.5 الكومبوننتات

- [ ] **Input متكرر:** `shared/components/ui/input.tsx` و`shared/components/InputField.tsx` و`features/contact/Input.tsx` و`Select.tsx` و`Textarea.tsx` و`PhoneInput.tsx`. نسخ contact تتشال وتستخدم الـ shared fields.
- [ ] **Breadcrumb مرتين:** `Breadcrumb.tsx` و`PlainBreadcramb.tsx`. يبقوا واحد بـ variant.
- [ ] **Page headers:** `ProjectDetailsHeader` (28px bold) و`SettingsPageHeader` (32px semibold) وغيرهم. نعمل `PageHeader` واحد مشترك.
- [ ] **مكتبات مكررة الوظيفة:**
  - date picker: `react-datepicker` + `react-day-picker`. نختار واحدة، والأحسن day-picker لأنها اللي shadcn بيستخدمها.
  - carousel: `swiper` + `embla-carousel-react`. نختار واحدة.
  - primitives: `radix-ui` + `@base-ui/react`. نشوف استخدام base-ui الوحيد ونستبدله.

---

## المرحلة 8: تقسيم الملفات الكبيرة

> بالترتيب ده، وكل ملف في PR لوحده. نقسم حسب المسؤولية (sections + hook للـ logic + mapping functions في `utils`).

| الملف                                                                                    | الأسطر                       |
| ---------------------------------------------------------------------------------------- | ---------------------------- |
| `features/jobs/components/JobPostStepOne.tsx`                                            | 1265                         |
| `features/jobs/components/PostJobForm.tsx`                                               | 911                          |
| `features/candidate-settings/components/basic-info/BasicInfoForm.tsx`                    | 695                          |
| `features/jobs/components/JobReviewPanel.tsx`                                            | 636                          |
| `features/accout-settings/components/business-verification/BusinessVerificationForm.tsx` | 507                          |
| `features/auth/components/register-employer-content/FormCandidateRegister.tsx`           | 472                          |
| `features/accout-settings/components/basic-info/BasicInfoForm.tsx`                       | 413                          |
| `features/complete-account/steps/step-two.tsx`                                           | 408                          |
| `src/auth.ts`                                                                            | 379                          |
| `features/company-projects/components/ProjectCandidatesTable.tsx`                        | 387                          |
| `features/candidate-credentials/components/*/…Modal.tsx` (3 ملفات)                       | 317–374                      |
| `app/[locale]/(shared-layout)/jobs/page.tsx`                                             | 341 (page المفروض تبقى thin) |

- [ ] الـ 3 modals في `candidate-credentials` (Certificate، License، Qualification) شبه بعض، فيه فرصة لـ `CredentialFormModal` واحد بـ config.

---

## المرحلة 9: البيانات التجريبية والربط الحقيقي

فيه **حوالي 23 ملف preview/mock** بتشغّل شاشات كاملة من غير API:

| Feature                            | الملفات                                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| company-projects                   | `project-preview-data`، `candidate-profile-preview-data`، `shared-review-preview-data`، `useCompanyProjectsPreview`، `useProjectCandidatesPreview` |
| company-talent-database            | `talent-preview-data`، `useTalentDatabasePreview` (**بيعرض "تم الإرسال" من غير API**)                                                              |
| chat                               | `chat-preview`، `candidate-chat-preview` (الرسايل بتتضاف local بس)                                                                                 |
| company-dashboard                  | `dashboard-preview`، `active-jobs-preview`                                                                                                         |
| company-admin-roles / users        | `data/roles.data`، `permissions.data`، `members.data`                                                                                              |
| candidate-\*                       | ai-job-match، assessment، cv-builder، cv-match-ats، profile-insights، additional-info                                                              |
| jobs                               | `apply-preview-data`، `candidate-answers-preview-data`، `useAiTalentMatchPreview`                                                                  |
| about / company-recruiter-activity | `commitment-preview-data`، `recruiter-activity-preview-data`                                                                                       |

- [ ] نعمل جدول جاهزية (ملف جديد في `docs/` أو قسم هنا): كل شاشة **مربوطة** أو **UI بس** أو **مستنية API**.
- [ ] أي عملية بتعرض نجاح وهي مش بتبعت حاجة (talent database send message، chat send) تتقفل أو يظهر عليها إنها تجريبية لحد ما تتربط.
- [ ] الـ preview data تفضل في `constants/*-preview-data.ts` بس (زي ما هي)، وماتتستوردش من feature تانية.

---

## المرحلة 10: Accessibility والاختبارات

- [ ] **`<main>` متداخل:** موجود في `(shared-layout)/layout.tsx` وفي layouts وصفحات جواه (`candidate/layout.tsx`، `candidate/settings/layout.tsx`، `candidate/credentials/layout.tsx`، `candidate/profile/page.tsx`...، 24 مرة). نخلي `main` واحد بس في أعلى layout والباقي `div` أو `section`.
- [ ] Labels مش مربوطة بالحقول (`contact/Input.tsx`). هتتحل لوحدها لما contact يستخدم الـ shared fields.
- [ ] نصوص إنجليزي ثابتة في الكومبوننتات العامة (`RouteErrorFallback`: "Try again") تتنقل للترجمة.
- [ ] **الاختبارات:** مفيش test runner. نبدأ بـ Playwright لرحلات قليلة ومهمة: تسجيل الدخول (candidate و employer)، نشر وظيفة، التقديم على وظيفة، التحويل بعد الـ login (يغطي `callbackUrl`). ونضيفهم للـ CI.
- [ ] Vitest لـ `shared/lib` (`fetch-manager`، `password-rules`، `gpa`، `phone`) لأنها pure functions وسهلة.

---

## ترتيب التنفيذ المقترح

| #   | المرحلة                      | الحجم | ليه بالترتيب ده                               |
| --- | ---------------------------- | ----- | --------------------------------------------- |
| 1   | المرحلة 1: الأمان والإنتاج   | صغير  | خطر حقيقي على المستخدمين                      |
| 2   | المرحلة 0: نظافة وأدوات + CI | صغير  | كل اللي بعده يتحمى بالـ lint والـ typecheck   |
| 3   | المرحلة 2: ESLint صفر        | صغير  | الـ CI يبقى أخضر                              |
| 4   | المرحلة 3: كود ميت           | صغير  | يقلل الملفات قبل ما ننقل ونسمي                |
| 5   | المرحلة 4: أسماء وفولدرات    | متوسط | renames بس، من غير تغيير logic                |
| 6   | المرحلة 6: طبقة الـ API      | متوسط | توحيد سلوك الطلبات                            |
| 7   | المرحلة 5: الـ Layering      | متوسط | أسهل بعد ما الفولدرات تتظبط                   |
| 8   | المرحلة 7: الـ Design System | كبير  | tokens الأول، بعدين الاستبدال feature feature |
| 9   | المرحلة 8: الملفات الكبيرة   | كبير  | ملف ملف                                       |
| 10  | المرحلة 9 و10                | مستمر | مع الباك إند والـ QA                          |

**قواعد الشغل:**

- PR لكل مرحلة، أو لكل بند لو البند كبير.
- ماندمجش rename أو format مع تغيير logic في نفس الـ PR.
- بعد كل PR: `npm run lint` و`npx tsc --noEmit` و`npm run build`، ونجرب الصفحات اللي اتأثرت **بالعربي والإنجليزي وعلى الموبايل**.
