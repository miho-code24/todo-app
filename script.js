/*保存機能*/
function saveTasks() {
  const tasks = [];

  document.querySelectorAll('#taskList li').forEach(function (li) {
    const span = li.querySelector('span');
    const checkbox = li.querySelector('input[type="checkbox"]');

    tasks.push({
      text: span ? span.textContent : '',
      completed: checkbox ? checkbox.checked : false
    });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}
//並び替え機能
function moveTask(li, direction) {
  if (direction === 'up') {
    const prev = li.previousElementSibling;
    if (prev) taskList.insertBefore(li, prev);
  } else if (direction === 'down') {
    const next = li.nextElementSibling;
    if (next) taskList.insertBefore(next, li); // 次を手前に入れて結果的に下へ
  }
  saveTasks();
}

const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

searchInput.addEventListener('input', function () {
  const q = searchInput.value.trim().toLowerCase();

  document.querySelectorAll('#taskList li').forEach(function (li) {
    const text = li.querySelector('span')?.textContent.toLowerCase() || '';
    li.style.display = text.includes(q) ? '' : 'none';
  });
});

clearSearchBtn.addEventListener('click', function () {
  searchInput.value = '';
  searchInput.dispatchEvent(new Event('input')); // 絞り込みを解除
  searchInput.focus();
});
taskInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addBtn.click();
});

addBtn.addEventListener('click', function () {
  const task = taskInput.value.trim();
  if (task === '') return;

  const li = document.createElement('li');
  const upBtn = document.createElement('button');
  upBtn.textContent = '↑';
  upBtn.classList.add('move-btn');
  upBtn.addEventListener('click', function () {
    moveTask(li, 'up');
  });

  const downBtn = document.createElement('button');
  downBtn.textContent = '↓';
  downBtn.classList.add('move-btn');
  downBtn.addEventListener('click', function () {
    moveTask(li, 'down');
  });

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const span = document.createElement('span');
  span.textContent = task;
  span.addEventListener('dblclick', function () {
    enableInlineEdit(span);
  });

  checkbox.addEventListener('change', function () {
    span.classList.toggle('completed', checkbox.checked);
    saveTasks(); // ←チェック変更も保存
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '削除';
  deleteBtn.classList.add('delete-btn');

  deleteBtn.addEventListener('click', function () {
    li.remove();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(upBtn);
  li.appendChild(downBtn);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);

  saveTasks();
  taskInput.value = '';
});

window.addEventListener('load', function () {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  savedTasks.forEach(function (task) {
    const li = document.createElement('li');
    const upBtn = document.createElement('button');
    upBtn.textContent = '↑';
    upBtn.classList.add('move-btn');
    upBtn.addEventListener('click', function () {
      moveTask(li, 'up');
    });

    const downBtn = document.createElement('button');
    downBtn.textContent = '↓';
    downBtn.classList.add('move-btn');
    downBtn.addEventListener('click', function () {
      moveTask(li, 'down');
    });

    const checkbox = document.createElement('input'); // ← input は小文字
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;

    const span = document.createElement('span');
    span.textContent = task.text; // ← task.text
    span.classList.toggle('completed', checkbox.checked); // ←復元時に反映
    span.addEventListener('dblclick', function () {
      enableInlineEdit(span);
    });

    checkbox.addEventListener('change', function () {
      span.classList.toggle('completed', checkbox.checked);
      saveTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';

    deleteBtn.addEventListener('click', function () {
      li.remove();
      saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(upBtn);
    li.appendChild(downBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
});
/*編集機能*/
function enableInlineEdit(span) {
  const li = span.closest('li');
  const checkbox = li.querySelector('input[type="checkbox"]');
  const oldText = span.textContent;

  const edit = document.createElement('input');
  edit.type = 'text';
  edit.value = oldText;
  edit.style.flex = '1';

  li.replaceChild(edit, span);
  edit.focus();
  edit.select();

  function finish(commit) {
    const newSpan = document.createElement('span');
    const newText = edit.value.trim();

    newSpan.textContent = commit && newText !== '' ? newText : oldText;
    newSpan.classList.toggle('completed', checkbox.checked);

    newSpan.addEventListener('dblclick', function () {
      enableInlineEdit(newSpan);
    });

    li.replaceChild(newSpan, edit);
    if (commit) saveTasks();
  }

  edit.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  });

  edit.addEventListener('blur', function () {
    finish(true);
  });
}
