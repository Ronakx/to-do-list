// script.js
// JavaScript code for handling form submission and adding to-do items
document.getElementById('todo-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  // Get the value from the input fields
  const todoInput = document.getElementById('todo-input');
  const reminderInput = document.getElementById('reminder-input');
  const todoText = todoInput.value.trim();
  const reminderDateTime = reminderInput.value;

  // Create a new list item with the to-do text and reminder
  if (todoText !== '') {
    const listItem = document.createElement('li');
    const todoSpan = document.createElement('span');
    todoSpan.textContent = todoText;
    const reminderSpan = document.createElement('span');
    reminderSpan.textContent = reminderDateTime;

    // Append the new list item to the to-do list
    listItem.appendChild(todoSpan);
    listItem.appendChild(document.createElement('br'));
    listItem.appendChild(reminderSpan);

    // Create a Notify button
    const notifyButton = document.createElement('button');
    notifyButton.textContent = 'Notify';
    notifyButton.addEventListener('click', function() {
      showNotification(todoText);
    });

    // Append the Notify button to the list item
    listItem.appendChild(document.createElement('br'));
    listItem.appendChild(notifyButton);

    const todoList = document.getElementById('todo-list');
    todoList.appendChild(listItem);

    // Set a notification for the reminder
    const reminderDate = new Date(reminderDateTime);
    const now = new Date();
    const timeDifference = reminderDate.getTime() - now.getTime();
    if (timeDifference > 0) {
      setTimeout(() => {
        showNotification(todoText);
      }, timeDifference);
    }

    // Clear the input fields
    todoInput.value = '';
    reminderInput.value = '';
  }
});

// JavaScript code for handling print button click
document.getElementById('print-button').addEventListener('click', function() {
  window.print();
});

// JavaScript code for handling save button click
document.getElementById('save-button').addEventListener('click', function() {
  const todoList = document.getElementById('todo-list');
  const listItems = todoList.getElementsByTagName('li');
  const listData = [];

  for (let i = 0; i < listItems.length; i++) {
    const todoText = listItems[i].querySelector('span:nth-child(1)').textContent;
    const reminderDateTime = listItems[i].querySelector('span:nth-child(3)').textContent;
    listData.push(todoText + ' - ' + reminderDateTime);
  }

  const listText = listData.join('\n');
  const blob = new Blob([listText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'to-do-list.txt';
  link.click();

  // Clean up the object URL
  URL.revokeObjectURL(url);
});

// Function to show a notification with sound
function showNotification(todoText) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Reminder', {
      body: todoText,
      sound: 'notification_sound.wav' // Specify the path to your notification sound file
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const notification = new Notification('Reminder', {
          body: todoText,
          sound: 'notification_sound.wav' // Specify the path to your notification sound file
        });
      }
    });
  }
}

// Get the reset button element
const resetButton = document.getElementById('reset-button');

// Add event listener to reset button
resetButton.addEventListener('click', function() {
  // Reset the form and to-do list
  document.getElementById('todo-form').reset();
  document.getElementById('todo-list').innerHTML = '';
});

// JavaScript code for the additional features

// Function to filter the tasks based on the selected filter option
function filterTasks(filter) {
  const todoList = document.getElementById('todo-list');
  const tasks = todoList.getElementsByTagName('li');

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const isCompleted = task.classList.contains('completed');

    if (filter === 'all' || (filter === 'pending' && !isCompleted) || (filter === 'completed' && isCompleted)) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  }
}

// Function to mark a task as done (add a checkmark)
function markTaskAsDone(task) {
  task.classList.toggle('completed');
}

// Event listener for the filter select
const filterSelect = document.getElementById('filter-select');
filterSelect.addEventListener('change', function() {
  const selectedFilter = this.value;
  filterTasks(selectedFilter);
});

// Event listener for the todo list
const todoList = document.getElementById('todo-list');
todoList.addEventListener('click', function(event) {
  const target = event.target;

  // Check if the clicked element is the checkmark (to mark a task as done)
  if (target.classList.contains('checkmark')) {
    const task = target.parentNode;
    markTaskAsDone(task);
  }
});
