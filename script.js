const taskList = document.getElementById('task-list');

function createTask(taskText) {
  const listItem = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `task${taskList.children.length + 1}`;

  const label = document.createElement('label');
  label.htmlFor = checkbox.id;
  label.textContent = taskText;

  listItem.appendChild(checkbox);
  listItem.appendChild(label);

  taskList.appendChild(listItem);

  const message = `La tâche "${taskText}" a été ajoutée à la liste.`;
  speak(message);
}

function speak(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  }
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const task = checkbox.nextElementSibling.textContent;

  if (checkbox.checked) {
    console.log(`La tâche "${task}" a été cochée`);
    const message = `La tâche "${task}" a été cochée.`;
    speak(message);
  } else {
    console.log(`La tâche "${task}" a été décochée`);
    const message = `La tâche "${task}" a été décochée.`;
    speak(message);
  }
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckboxChange);
});

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'fr-FR';
  
  recognition.addEventListener('result', (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    
    if (transcript.startsWith('check')) {
      const taskName = transcript.slice(6).trim();
      const tasks = document.querySelectorAll('#task-list li label');
      for (const task of tasks) {
        if (task.textContent === taskName) {
          const checkbox = task.previousElementSibling;
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
          const message = `La tâche "${taskName}" a été ${checkbox.checked ? 'cochée' : 'décochée'}.`;
          speak(message);
          break;
        }
      }
    } else {
      console.log(`Nouvelle tâche : "${transcript}"`);
      createTask(transcript); 
    }
  });
  
  
  recognition.addEventListener('end', () => {
    setTimeout(() => {
      recognition.start();
    }, 1000);
  });

  recognition.start();
} else {
  console.log('La reconnaissance vocale n\'est pas disponible sur ce navigateur.');
}