# Как опубликовать прототип на GitHub Pages

## 1. Создайте репозиторий

1. Войдите на [github.com](https://github.com/).
2. Нажмите **New repository**.
3. Назовите репозиторий `biz-course-prototype`.
4. Выберите **Public** и нажмите **Create repository**.

## 2. Загрузите файлы

Распакуйте подготовленный архив. На странице нового репозитория выберите
**uploading an existing file**, перенесите туда всё содержимое папки и нажмите
**Commit changes**.

Важно: папки `app`, `components`, `pages`, `public` и `.github` должны находиться
сразу в корне репозитория, рядом с `package.json`.

## 3. Включите GitHub Pages

1. Откройте **Settings → Pages**.
2. В разделе **Build and deployment** выберите **Source → GitHub Actions**.
3. Откройте вкладку **Actions** и дождитесь зелёной отметки у задачи
   «Публикация прототипа».

После первой публикации адрес появится в **Settings → Pages**. Обычно он выглядит
так: `https://ВАШ-ЛОГИН.github.io/biz-course-prototype/`.

При следующих изменениях достаточно загрузить обновлённые файлы в ветку `main` —
GitHub опубликует новую версию автоматически.
