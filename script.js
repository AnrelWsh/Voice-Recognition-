const taskList = document.getElementById('task-list');

// Fonction pour créer une nouvelle tâche dans la liste
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

// Fonction pour lire un message à haute voix
function speak(message) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  }
}

// Fonction pour gérer le changement d'état d'une checkbox
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

// Ajout d'un événement de changement pour chaque checkbox
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckboxChange);
});

// Configuration et démarrage de la reconnaissance vocale
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'fr-FR';
  
  recognition.addEventListener('result', (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;

    // Vérifier si le texte reconnu est différent de "Coucou Copain"
    console.log(`Nouvelle tâche : "${transcript}"`);
    createTask(transcript); // Créer une nouvelle tâche avec le texte reconnu
    

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
