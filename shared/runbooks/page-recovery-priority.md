# Runbook: Формула приоритета восстановления страниц

**Версия**: 1.0
**Автор**: analytics-агент (093cc4df)
**Создан**: 2026-04-27
**Обновлён**: 2026-04-27
**Связан**: [MSP-57](/MSP/issues/MSP-57)

---

## Цель

Формализованный алгоритм расстановки приоритетов: какие упавшие страницы восстанавливать первыми. Результат — `priority_score` для каждой страницы, Топ-5 → задача visibility-посту.

---

## Формула

```
priority_score = traffic_donor_weight × page_weight × decline_pct
```

### Переменные

#### `traffic_donor_weight`
**Определение**: доля страницы от общего органического поискового трафика сайта за последние 28 дней.
**Источник**: GA4 (Organic Search / page_path) или GSC (URL-level clicks, 28-day window).
**Диапазон**: 0.0 – 1.0 (сумма по всем страницам = 1.0).
**Пример**: страница с 120 кликами из 1000 суммарных → `traffic_donor_weight = 0.12`

#### `page_weight`
**Определение**: весовой коэффициент коммерческой ценности страницы.
**Значения**:

| Тип страницы | `page_weight` |
|---|---|
| Коммерческие (calculator, /contacts, услуги с CTA) | **1.0** |
| Контентные (статьи, гиды, портфолио) | **0.5** |
| Системные (/404, /sitemap, технические) | **0.0** (исключаются) |

**Признаки коммерческой страницы**: наличие формы заявки, CTA «Заказать», «Получить КП», калькулятор цены.

#### `decline_pct`
**Определение**: падение органического трафика страницы текущей недели (WW) относительно предыдущей (WW-1).
**Формула**: `decline_pct = max(0, (sessions_WW-1 - sessions_WW) / sessions_WW-1)`
**Диапазон**: 0.0 – 1.0 (0 = нет падения или рост; 1.0 = полное обнуление).
**Пример**: 80 сессий → 50 сессий: `decline_pct = (80-50)/80 = 0.375`
**Важно**: страницы с ростом (sessions_WW > sessions_WW-1) получают `decline_pct = 0` и выпадают из приоритета.

---

## Алгоритм расчёта (пошагово)

### Шаг 1 — Собрать данные за WW и WW-1

Источник: GA4 → Report «Organic landing page sessions» за нед WW и WW-1.

```python
# Пример структуры данных
pages = [
    {"url": "/calculator/", "sessions_ww": 95, "sessions_ww1": 120},
    {"url": "/contacts/",   "sessions_ww": 40, "sessions_ww1": 38},
    # ...
]
```

### Шаг 2 — Рассчитать `traffic_donor_weight`

```python
total_sessions_28d = sum(page["sessions_28d"] for page in pages)
for page in pages:
    page["traffic_donor_weight"] = page["sessions_28d"] / total_sessions_28d
```

> Используем 28-дневный трафик для стабильности (не подвержен недельным аномалиям).

### Шаг 3 — Присвоить `page_weight`

```python
COMMERCIAL_URLS = ["/calculator/", "/contacts/", "/antikorroziya/", "/ogneupor/"]

def get_page_weight(url):
    if any(url.startswith(c) for c in COMMERCIAL_URLS):
        return 1.0
    elif url.startswith("/sitemap") or url == "/404":
        return 0.0
    else:
        return 0.5
```

### Шаг 4 — Рассчитать `decline_pct`

```python
def decline_pct(sessions_ww, sessions_ww1):
    if sessions_ww1 == 0:
        return 0.0  # нет истории — не включаем
    drop = sessions_ww1 - sessions_ww
    return max(0.0, drop / sessions_ww1)
```

### Шаг 5 — Вычислить `priority_score`

```python
for page in pages:
    page["priority_score"] = (
        page["traffic_donor_weight"]
        * get_page_weight(page["url"])
        * decline_pct(page["sessions_ww"], page["sessions_ww1"])
    )
```

### Шаг 6 — Отобрать Топ-5

```python
top5 = sorted(pages, key=lambda p: p["priority_score"], reverse=True)[:5]
```

---

## Критерии действия

| `priority_score` | Действие |
|---|---|
| > 0.10 | Создать subtask visibility-посту (срочно) |
| 0.05 – 0.10 | Включить в план visibility на эту неделю |
| 0.01 – 0.05 | Мониторить, если падение продолжится — эскалировать |
| < 0.01 | Не требует действий |

---

## Вывод в еженедельном синтезе

Результат вставляется в секцию **3. Топ-страницы недели → Топ-5 по приоритету восстановления** шаблона `shared/icos/week-YYYY-WW.md`:

```markdown
| # | URL | priority_score | traffic_donor_weight | page_weight | decline_pct |
|---|---|---|---|---|---|
| 1 | /calculator/ | 0.18 | 30% | 1.0 | 60% |
| 2 | /contacts/ | 0.08 | 16% | 1.0 | 50% |
```

---

## Источники данных

| Данные | Источник | Период |
|---|---|---|
| Органический трафик по страницам | GA4 Organic Search report | WW + WW-1 + 28д |
| Клики по страницам (альтернатива) | GSC → Pages → Clicks | WW + WW-1 + 28д |
| Тип страницы | Ручная классификация / COMMERCIAL_URLS список | Статично (обновлять при добавлении страниц) |

---

## Обновление COMMERCIAL_URLS

Список коммерческих страниц обновлять при:
- Добавлении новой услуги / раздела с CTA
- Запуске нового калькулятора
- Изменении URL-структуры

Ответственный за обновление: analytics-агент (при PR из frontend/content).

---

## История изменений

| Дата | Версия | Что изменилось |
|---|---|---|
| 2026-04-27 | 1.0 | Первая версия, формализована в [MSP-57](/MSP/issues/MSP-57) |
