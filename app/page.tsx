'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Layers3,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Access = 0 | 1 | 2;

type Lesson = {
  id: number;
  module: number;
  eyebrow: string;
  title: string;
  duration: string;
  access: Access;
  intro: string;
  takeaway: string;
  steps: { title: string; text: string }[];
  question: string;
  options: string[];
  correct: number;
};

type CourseToolInput = { lessonId?: unknown; optionIndex?: unknown };
type ModelContextLike = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: CourseToolInput) => unknown;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

const accessNames: Record<Access, string> = {
  0: 'Доступен всем',
  1: 'Нужен Сбер ID',
  2: 'Нужен СберБизнес ID',
};

const profileNames: Record<Access, string> = {
  0: 'Гость',
  1: 'Сбер ID',
  2: 'СберБизнес ID',
};

const modules = [
  { id: 1, title: 'Находим прибыльную нишу' },
  { id: 2, title: 'Запускаем продажи' },
  { id: 3, title: 'Управляем ростом' },
];

const lessons: Lesson[] = [
  {
    id: 1, module: 1, eyebrow: 'Основа бизнес-модели', title: 'Формулируем ценность для клиента', duration: '8 минут', access: 0,
    intro: 'Клиент покупает не товар сам по себе, а изменение в своей жизни или работе. Начните с задачи клиента — так продукт будет проще объяснить и продать.',
    takeaway: 'Хорошая ценность называет клиента, его задачу и измеримый результат.',
    steps: [
      { title: 'Выберите одного клиента', text: 'Не «все предприниматели», а, например, владельцы кофеен с одной–тремя точками.' },
      { title: 'Опишите неудобство', text: 'Зафиксируйте ситуацию, в которой человек уже ищет решение и готов менять привычный способ.' },
      { title: 'Назовите результат', text: 'Сформулируйте пользу через деньги, время или снижение риска — без общих обещаний.' },
    ],
    question: 'Какая формулировка точнее описывает ценность продукта?',
    options: ['Мы используем современные технологии', 'Помогаем кафе сократить списания продуктов на 20% за месяц', 'Мы — команда опытных профессионалов'], correct: 1,
  },
  {
    id: 2, module: 1, eyebrow: 'Проверка идеи', title: 'Проверяем спрос без большого бюджета', duration: '10 минут', access: 0,
    intro: 'До разработки продукта проверьте, готовы ли люди обсуждать решение, оставлять контакты и платить. Несколько коротких экспериментов дешевле полноценного запуска.',
    takeaway: 'Сильный сигнал спроса — действие клиента, а не его вежливое одобрение.',
    steps: [
      { title: 'Проведите 7 интервью', text: 'Спрашивайте о последнем реальном случае, а не о гипотетическом будущем.' },
      { title: 'Соберите простой оффер', text: 'Одной страницы с понятным результатом и кнопкой заявки достаточно для первого теста.' },
      { title: 'Считайте действия', text: 'Заявки, предзаказы и встречи важнее лайков и общей посещаемости.' },
    ],
    question: 'Какой сигнал лучше всего подтверждает спрос?', options: ['50 лайков', 'Похвала знакомого', '5 предзаказов от целевых клиентов'], correct: 2,
  },
  {
    id: 3, module: 1, eyebrow: 'Экономика продукта', title: 'Считаем юнит-экономику', duration: '12 минут', access: 1,
    intro: 'Юнит-экономика показывает, зарабатывает ли бизнес на одной продаже. Она помогает вовремя заметить, когда рост оборота увеличивает не прибыль, а убыток.',
    takeaway: 'Маржинальный доход с продажи должен покрывать привлечение клиента и постоянные расходы.',
    steps: [
      { title: 'Найдите выручку с заказа', text: 'Используйте средний чек без НДС и разовых доплат.' },
      { title: 'Вычтите переменные расходы', text: 'Учтите сырьё, упаковку, доставку и комиссию площадки.' },
      { title: 'Сравните с CAC', text: 'Стоимость привлечения должна быть ниже ожидаемой прибыли от клиента.' },
    ],
    question: 'Выручка с заказа — 3 000 ₽, переменные расходы — 1 800 ₽. Чему равна маржа?', options: ['1 200 ₽', '1 800 ₽', '3 000 ₽'], correct: 0,
  },
  {
    id: 4, module: 2, eyebrow: 'Система продаж', title: 'Собираем первую воронку', duration: '9 минут', access: 0,
    intro: 'Воронка превращает продажи из набора случайных действий в управляемый процесс. На старте достаточно четырёх этапов и одной метрики на каждом.',
    takeaway: 'Улучшайте самый слабый переход, а не всю воронку одновременно.',
    steps: [
      { title: 'Контакт', text: 'Клиент увидел предложение и перешёл к подробностям.' },
      { title: 'Интерес', text: 'Оставил заявку, написал или согласился на встречу.' },
      { title: 'Сделка', text: 'Получил предложение и оплатил заказ.' },
    ],
    question: 'Из 100 заявок 20 стали покупателями. Какая конверсия в продажу?', options: ['5%', '20%', '80%'], correct: 1,
  },
  {
    id: 5, module: 2, eyebrow: 'Предложение', title: 'Готовим оффер, который понятен сразу', duration: '11 минут', access: 1,
    intro: 'Сильный оффер помогает клиенту быстро ответить на три вопроса: что изменится, почему вам можно доверять и что делать дальше.',
    takeaway: 'Один оффер — один сегмент, один результат и одно следующее действие.',
    steps: [
      { title: 'Результат', text: 'Начните с главной пользы на языке клиента.' },
      { title: 'Доказательство', text: 'Добавьте цифру, кейс, гарантию или прозрачное объяснение метода.' },
      { title: 'Следующий шаг', text: 'Предложите одно простое действие без лишнего выбора.' },
    ],
    question: 'Что сильнее всего перегружает оффер?', options: ['Один конкретный результат', 'Несколько равных призывов к действию', 'Короткий кейс клиента'], correct: 1,
  },
  {
    id: 6, module: 2, eyebrow: 'Финансы', title: 'Планируем денежный поток', duration: '14 минут', access: 2,
    intro: 'Прибыльный бизнес может столкнуться с кассовым разрывом, если поступления приходят позже платежей. Платёжный календарь помогает увидеть риск заранее.',
    takeaway: 'Деньги планируют по датам поступления и списания, а не по дате сделки.',
    steps: [
      { title: 'Соберите остаток', text: 'Начните с денег на счетах и в кассе на начало периода.' },
      { title: 'Разнесите поступления', text: 'Учитывайте реальные сроки оплат и вероятность задержки.' },
      { title: 'Поставьте платежи', text: 'Сначала обязательные, затем операционные и инвестиционные.' },
    ],
    question: 'Что раньше всего показывает будущий кассовый разрыв?', options: ['Рост подписчиков', 'Платёжный календарь с отрицательным остатком', 'Высокая годовая выручка'], correct: 1,
  },
  {
    id: 7, module: 3, eyebrow: 'Команда', title: 'Нанимаем без перегруза', duration: '10 минут', access: 1,
    intro: 'Новый сотрудник нужен, когда есть повторяемая работа и понятный результат роли. До найма отделите разовую перегрузку от устойчивой потребности.',
    takeaway: 'Нанимайте на измеримый результат, а не на расплывчатый список обязанностей.',
    steps: [
      { title: 'Опишите результат', text: 'Что изменится в бизнесе через три месяца после выхода сотрудника.' },
      { title: 'Зафиксируйте ритм', text: 'Какие задачи повторяются каждую неделю и сколько времени занимают.' },
      { title: 'Подготовьте ввод', text: 'Дайте доступы, контекст, чек-лист и первую контрольную точку.' },
    ],
    question: 'Что должно появиться до публикации вакансии?', options: ['Измеримый результат роли', 'Максимально длинный список задач', 'Новый офис'], correct: 0,
  },
  {
    id: 8, module: 3, eyebrow: 'Управление', title: 'Настраиваем ключевые метрики', duration: '13 минут', access: 2,
    intro: 'Панель из пяти–семи метрик помогает принимать решения быстрее. Показатели должны быть связаны с целью и иметь владельца.',
    takeaway: 'Хорошая метрика подсказывает действие, а не просто описывает прошлое.',
    steps: [
      { title: 'Выберите цель', text: 'Например: повысить повторные продажи с 18% до 25%.' },
      { title: 'Добавьте опережающий показатель', text: 'То, на что команда может повлиять уже на этой неделе.' },
      { title: 'Назначьте владельца', text: 'Один человек обновляет показатель и предлагает действие.' },
    ],
    question: 'Какая метрика лучше помогает управлять повторными продажами?', options: ['Цвет логотипа', 'Доля клиентов с повторным заказом', 'Количество сотрудников'], correct: 1,
  },
  {
    id: 9, module: 3, eyebrow: 'Стратегия', title: 'Составляем план роста на 90 дней', duration: '15 минут', access: 2,
    intro: 'Квартальный план связывает одну цель, несколько инициатив и еженедельный ритм проверки. Так стратегия остаётся рабочим инструментом, а не презентацией.',
    takeaway: 'На 90 дней выбирайте одну главную цель и не больше трёх инициатив.',
    steps: [
      { title: 'Одна цель', text: 'Запишите числовой результат и дату, к которой он нужен.' },
      { title: 'Три инициативы', text: 'Выберите действия с наибольшим влиянием на цель.' },
      { title: 'Еженедельный обзор', text: 'Сравнивайте план и факт, снимайте препятствия, корректируйте действия.' },
    ],
    question: 'Какой план реалистичнее на один квартал?', options: ['10 равных приоритетов', 'Одна цель и до трёх инициатив', 'Список идей без метрик'], correct: 1,
  },
];

function readNumber(key: string, fallback: number) {
  if (typeof window === 'undefined') return fallback;
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) ? value : fallback;
}

function Logo() {
  return (
    <div className="brand" aria-label="СберБизнес Live">
      <span className="brand-mark"><Check /></span>
      <span><b>СБЕР</b> Бизнес Live</span>
    </div>
  );
}

export default function Home() {
  const [currentId, setCurrentId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [access, setAccess] = useState<Access>(0);
  const [answer, setAnswer] = useState('');
  const [answerState, setAnswerState] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [contentsOpen, setContentsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [courseDescriptionOpen, setCourseDescriptionOpen] = useState(false);
  const [completionNotice, setCompletionNotice] = useState<{ title: string; count: number } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setCurrentId(Math.min(9, Math.max(1, readNumber('course-current', 1))));
    setAccess(Math.min(2, Math.max(0, readNumber('course-access', 0))) as Access);
    try {
      const stored = JSON.parse(window.localStorage.getItem('course-completed') || '[]');
      if (Array.isArray(stored)) setCompleted(stored.filter((id) => Number.isInteger(id)));
    } catch { setCompleted([]); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem('course-current', String(currentId));
    window.localStorage.setItem('course-access', String(access));
    window.localStorage.setItem('course-completed', JSON.stringify(completed));
  }, [currentId, access, completed, hydrated]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'submit_lesson_answer',
      title: 'Ответить на вопрос урока',
      description: 'Открывает первый урок и проверяет ответ на необязательный вопрос для самопроверки. Ответ не влияет на прогресс.',
      inputSchema: {
        type: 'object',
        properties: {
          lessonId: { type: 'integer', minimum: 1, maximum: 9 },
          optionIndex: { type: 'integer', minimum: 0, maximum: 2 },
        },
        required: ['lessonId', 'optionIndex'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!Number.isInteger(input.lessonId) || !Number.isInteger(input.optionIndex)) {
          throw new Error('lessonId and optionIndex must be integers');
        }
        const target = lessons[Number(input.lessonId) - 1];
        if (!target) throw new Error('Lesson not found');
        if (access < target.access) throw new Error(accessNames[target.access]);
        if (target.id !== 1) throw new Error('В этом уроке нет проверочного задания');
        const correct = Number(input.optionIndex) === target.correct;
        setCurrentId(target.id);
        setAnswer(String(input.optionIndex));
        setAnswerState(correct ? 'correct' : 'wrong');
        return { lessonId: target.id, correct };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [access]);

  const lesson = lessons[currentId - 1];
  const isLocked = access < lesson.access;
  const isComplete = completed.includes(lesson.id);
  const progress = Math.round((completed.length / lessons.length) * 100);
  const nextLesson = lessons[currentId] || null;
  const hasFinalTask = lesson.id === 1;
  const moduleProgress = useMemo(() => modules.map((module) => {
    const ids = lessons.filter((item) => item.module === module.id).map((item) => item.id);
    return ids.filter((id) => completed.includes(id)).length;
  }), [completed]);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 420);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  useEffect(() => {
    if (!completionNotice) return;
    const timeout = window.setTimeout(() => setCompletionNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [completionNotice]);

  function selectLesson(id: number) {
    setCurrentId(id); setAnswer(''); setAnswerState('idle'); setContentsOpen(false); setCourseDescriptionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function checkAnswer() {
    if (Number(answer) !== lesson.correct) { setAnswerState('wrong'); return; }
    setAnswerState('correct');
  }

  function handleDockAction() {
    if (isLocked) { setAuthOpen(true); return; }
    if (isComplete) return;
    setCompleted((items) => items.includes(lesson.id) ? items : [...items, lesson.id]);
    setCompletionNotice({ title: lesson.title, count: completed.length + 1 });
  }

  function chooseAccess(level: Access) { setAccess(level); setAuthOpen(false); }

  function showCourseDescription() {
    setCourseDescriptionOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function returnToLesson() {
    setCourseDescriptionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="course-shell">
      <div className="promo">Новые навыки для устойчивого бизнеса · бесплатно</div>
      <header className="site-header">
        <Logo />
        <nav aria-label="Основная навигация">
          <a href="#lesson">Академия бизнеса</a><a href="#practice">Практика</a><a href="#about">О курсе</a>
        </nav>
        <Button variant="ghost" className="profile-button" onClick={() => setAuthOpen(true)}>
          <CircleUserRound /><span>{profileNames[access]}</span>
        </Button>
      </header>

      <main id="lesson" className="lesson-layout">
        <section className={`course-titlebar ${courseDescriptionOpen ? 'description-open' : ''}`} aria-label="Навигация по курсу">
          {!courseDescriptionOpen && <button className="course-description-arrow" onClick={showCourseDescription} aria-label="Открыть описание курса"><ArrowLeft /></button>}
          <div><span>Курс</span><h2>Бизнес без хаоса: от идеи к системе</h2></div>
          <Button variant="outline" className="course-description-button" onClick={courseDescriptionOpen ? returnToLesson : showCourseDescription}>
            {courseDescriptionOpen ? 'К уроку' : 'Описание курса'}
          </Button>
        </section>

        {courseDescriptionOpen ? (
          <article className="course-description-card" id="course-description">
            <p className="eyebrow">Практический курс для малого бизнеса</p>
            <h1>Бизнес без хаоса:<br />от идеи к системе</h1>
            <p className="course-description-lead">За девять коротких уроков вы проверите идею, соберёте понятную систему продаж и подготовите бизнес к управляемому росту.</p>
            <div className="course-description-meta">
              <div><Layers3 /><span><b>3 модуля</b><small>От идеи до роста</small></span></div>
              <div><Clock3 /><span><b>9 уроков</b><small>Около 1,5 часов</small></span></div>
              <div><Target /><span><b>Практика</b><small>Без сложной теории</small></span></div>
            </div>
            <section className="course-description-program" aria-labelledby="program-title">
              <div className="section-heading"><span>01</span><h2 id="program-title">Что внутри</h2></div>
              <div className="program-list">
                <div><span>1</span><div><b>Находим прибыльную нишу</b><p>Формулируем ценность, проверяем спрос и считаем экономику продукта.</p></div></div>
                <div><span>2</span><div><b>Запускаем продажи</b><p>Собираем первую воронку, сильный оффер и платёжный календарь.</p></div></div>
                <div><span>3</span><div><b>Управляем ростом</b><p>Настраиваем команду, ключевые метрики и план на 90 дней.</p></div></div>
              </div>
            </section>
            <div className="course-description-footer">
              <div><small>Ваш прогресс</small><b>{completed.length} из 9 уроков завершено</b></div>
              <Button className="primary-cta" onClick={returnToLesson}>К уроку <ArrowRight /></Button>
            </div>
          </article>
        ) : (
        <article className="lesson-card">
          <div className="lesson-topline">
            <div>
              <span className="lesson-count">Модуль {lesson.module} · Урок {lesson.id} из 9</span>
              <span className={`access-badge access-${lesson.access}`}>
                {lesson.access === 0 ? <Sparkles /> : <LockKeyhole />}{accessNames[lesson.access]}
              </span>
              <span className="course-completion"><Check /> {completed.length}/9 завершено</span>
            </div>
            <span className="duration"><Clock3 /> {lesson.duration}</span>
          </div>

          {isLocked ? (
            <section className="locked-state" aria-labelledby="locked-title">
              <span className="lock-illustration"><LockKeyhole /></span>
              <p className="eyebrow">{lesson.eyebrow}</p><h1 id="locked-title">{lesson.title}</h1>
              <p>Этот урок открывается после входа через {profileNames[lesson.access]}. Прогресс и ответы сохранятся в профиле.</p>
              <Button className="primary-cta" onClick={() => setAuthOpen(true)}>Войти через {profileNames[lesson.access]} <ChevronRight /></Button>
              <button className="text-link" onClick={() => setContentsOpen(true)}>Выбрать доступный урок</button>
            </section>
          ) : (
            <>
              <p className="eyebrow">{lesson.eyebrow}</p><h1>{lesson.title}</h1><p className="lead">{lesson.intro}</p>
              <div className="takeaway"><span><Target /></span><div><small>Главная мысль</small><p>{lesson.takeaway}</p></div></div>
              <section className="steps" id="about" aria-labelledby="steps-title">
                <div className="section-heading"><span>01</span><h2 id="steps-title">Разберите по шагам</h2></div>
                <div className="step-grid">
                  {lesson.steps.map((step, index) => (
                    <div className="step" key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></div>
                  ))}
                </div>
              </section>
              {hasFinalTask && (
                <section className="checkpoint" id="practice" aria-labelledby="checkpoint-title">
                  <div className="checkpoint-copy"><span className="checkpoint-icon"><ShieldCheck /></span><div><p className="eyebrow">Самопроверка</p><h2 id="checkpoint-title">Проверьте понимание</h2><p>Это необязательный вопрос: ответ не влияет на завершение урока и общий прогресс.</p></div></div>
                  <p className="question">{lesson.question}</p>
                  <RadioGroup value={answer} onValueChange={(value) => { setAnswer(String(value)); setAnswerState('idle'); }} aria-label="Варианты ответа">
                    {lesson.options.map((option, index) => (
                      <label className="answer-option" key={option}><RadioGroupItem value={String(index)} /><span>{option}</span></label>
                    ))}
                  </RadioGroup>
                  <div className="answer-action">
                    <Button onClick={checkAnswer} disabled={!answer || answerState === 'correct'} className="primary-cta">
                      {answerState === 'correct' ? <><Check /> Ответ верный</> : 'Проверить ответ'}
                    </Button>
                    {answerState === 'wrong' && <p className="answer-feedback wrong">Почти. Вернитесь к главной мысли и попробуйте ещё раз.</p>}
                    {answerState === 'correct' && <p className="answer-feedback correct"><Check /> Отлично — ответ верный.</p>}
                  </div>
                </section>
              )}
              <div className="lesson-footer-nav">
                {currentId === 1
                  ? <Button variant="outline" onClick={showCourseDescription}><ArrowLeft /> Описание курса</Button>
                  : <Button variant="outline" onClick={() => selectLesson(currentId - 1)}><ArrowLeft /> Назад</Button>}
                {nextLesson ? <Button onClick={() => selectLesson(currentId + 1)}>Следующий урок <ArrowRight /></Button> : <Button disabled={!isComplete}><Check /> Курс завершён</Button>}
              </div>
            </>
          )}
        </article>
        )}

      </main>

      {!courseDescriptionOpen && completionNotice && (
        <div className="completion-notice" role="status" aria-live="polite">
          <span className="completion-notice-icon"><Check /></span>
          <div className="completion-notice-copy">
            <b>Урок завершён</b>
            <p>«{completionNotice.title}» засчитан. Прогресс: {completionNotice.count} из {lessons.length}.</p>
          </div>
          <button onClick={() => setCompletionNotice(null)} aria-label="Закрыть уведомление"><X /></button>
          <span className="completion-notice-progress" />
        </div>
      )}

      <div className="bottom-dock" aria-label="Навигация по курсу">
        <button className={`dock-up ${showBackToTop ? 'visible' : ''}`} aria-label="Наверх" tabIndex={showBackToTop ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp /></button>
        <button className="contents-button" onClick={() => setContentsOpen(true)}><Menu /><span>Содержание</span><b>{courseDescriptionOpen ? 'О курсе' : `${currentId}/9`}</b></button>
        <button
          className="dock-action"
          disabled={!courseDescriptionOpen && !isLocked && isComplete}
          onClick={courseDescriptionOpen ? returnToLesson : handleDockAction}
        >
          {courseDescriptionOpen ? <><ArrowRight /> К уроку</> : isLocked ? <><LockKeyhole /> Открыть</> : isComplete ? <><Check /> Завершено</> : <><Check /> Завершить урок</>}
        </button>
        <span className="dock-progress" style={{ width: `${progress}%` }} />
      </div>

      <Dialog open={contentsOpen} onOpenChange={setContentsOpen}>
        <DialogContent className="contents-dialog" showCloseButton>
          <DialogHeader><DialogTitle>Бизнес без хаоса: от идеи к системе</DialogTitle><DialogDescription>Выберите урок или посмотрите, что откроется после входа.</DialogDescription></DialogHeader>
          <button className={`course-overview-row ${courseDescriptionOpen ? 'active' : ''}`} onClick={() => { setContentsOpen(false); showCourseDescription(); }}>
            <span><Layers3 /></span>
            <span><b>Описание курса</b><small>Формат, программа и результат обучения</small></span>
            <ChevronRight />
          </button>
          <Progress value={progress} locale="ru-RU" className="dialog-progress"><ProgressLabel>Общий прогресс</ProgressLabel><ProgressValue /></Progress>
          <Accordion key={`contents-${lesson.module}`} defaultValue={[`module-${lesson.module}`]} multiple>
            {modules.map((module, moduleIndex) => (
              <AccordionItem value={`module-${module.id}`} key={module.id}>
                <AccordionTrigger className="module-trigger"><span><small>Модуль {module.id}</small>{module.title}</span><em>{moduleProgress[moduleIndex]}/3</em></AccordionTrigger>
                <AccordionContent className="module-lessons">
                  {lessons.filter((item) => item.module === module.id).map((item) => {
                    const locked = access < item.access; const done = completed.includes(item.id);
                    return (
                      <button key={item.id} className={`lesson-row ${currentId === item.id ? 'active' : ''}`} onClick={() => selectLesson(item.id)}>
                        <span className={`lesson-status ${done ? 'done' : ''} ${locked ? 'locked' : ''}`}>{done ? <Check /> : locked ? <LockKeyhole /> : item.id}</span>
                        <span className="lesson-row-copy"><b>{item.title}</b><small>{item.duration} · {locked ? accessNames[item.access] : done ? 'Завершено' : item.id === 1 ? 'С заданием' : 'Без задания'}</small></span>
                      </button>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="auth-dialog">
          <DialogHeader><DialogTitle>Режим просмотра прототипа</DialogTitle><DialogDescription>Переключите профиль, чтобы проверить уровни доступа. Реальная авторизация не выполняется.</DialogDescription></DialogHeader>
          <div className="profile-options">
            {([0, 1, 2] as Access[]).map((level) => (
              <button key={level} className={access === level ? 'selected' : ''} onClick={() => chooseAccess(level)}>
                <span>{level === 0 ? <CircleUserRound /> : level === 1 ? <ShieldCheck /> : <BriefcaseBusiness />}</span>
                <span><b>{profileNames[level]}</b><small>{level === 0 ? 'Только открытые уроки' : level === 1 ? 'Открытые уроки + материалы для физлиц' : 'Доступ ко всем 9 урокам'}</small></span>
                {access === level && <Check />}
              </button>
            ))}
          </div>
          <div className="prototype-note"><Layers3 /> В боевой версии кнопки запустят соответствующий сценарий авторизации.</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
