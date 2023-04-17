const taskList = document.getElementById('task-list');

//Fonction pour créer la têche dans le DOM
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

//FOnction qui permet au robot de parler à voix haute
function speak(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  }
}

//Fonction qui permet de retirer les tâche de la liste
function removeTask(taskName) {
  const tasks = document.querySelectorAll('#task-list li label');
  for (const task of tasks) {
    if (task.textContent === taskName) {
      const listItem = task.parentNode;
      taskList.removeChild(listItem);
      break;
    }
  }
}

//Début de la détection de voix
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'fr-FR';
  
  recognition.addEventListener('result', (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    
    //dire 'valide' pour cocher et décocher une tâche
    if (transcript.startsWith('valide')) {
      const taskName = transcript.slice(6).trim();
      const tasks = document.querySelectorAll('#task-list li label');
      for (const task of tasks) {
        if (task.textContent === taskName) {
          const checkbox = task.previousElementSibling;
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
          const message = `La tâche "${taskName}" a été ${checkbox.checked ? 'cochée' : 'décochée'}.`;
          console.log(`${message}`);
          speak(message);
          break;
        }
      }
    }
    //dire enlève pour retirer de la liste
    else if (transcript.startsWith('enlève')) {
      const taskName = transcript.slice(6).trim();
      const message = `La tâche "${taskName}" a été retirée de la liste.`;
      console.log(`${message}`);
      speak(message);
      removeTask(taskName)
    }
    //ajouter une tâche en parlant
    else {
      console.log(`Nouvelle tâche : "${transcript}"`);
      createTask(transcript); 
    }
  });
  
  //Timeout après la reconnaissance
  recognition.addEventListener('end', () => {
    setTimeout(() => {
      recognition.start();
    }, 1000);
  });
 
  //lancemant de la fonction
  recognition.start();
} else {
  console.log('La reconnaissance vocale n\'est pas disponible sur ce navigateur.');
}