
// variaveis globais

let nav = 0
let clicked = null
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : {};


// variavel do modal:
const eventModal = document.getElementById('eventModal');
const eventList = document.getElementById('eventList');
const backDrop = document.getElementById('modalBackDrop')
const eventTitleInput = document.getElementById('eventTitleInput')
// --------
const calendar = document.getElementById('calendar') // div calendar:
const weekdays = ['domingo','segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'] //array with weekdays:

//funções

function openModal(date) {
  clicked = date;
  const dayEvents = events[clicked] || [];

  eventList.innerHTML = '';

  if (dayEvents.length === 0) {
    eventList.innerHTML = '<p>Sem eventos para este dia.</p>';
  } else {
    dayEvents.forEach((event, index) => {
      const eventItem = document.createElement('div');
      eventItem.innerHTML = `
        ${event}
        <button onclick="deleteSingleEvent(${index})" style="margin-left: 10px;">🗑️</button>
      `;
      eventList.appendChild(eventItem);
    });
  }

  eventModal.style.display = 'block';
  backDrop.style.display = 'block';
}



//função load() será chamada quando a pagina carregar:

function load (){ 
  const date = new Date() 
  

  //mudar titulo do mês:
  if(nav !== 0){
    date.setMonth(new Date().getMonth() + nav) 
  }
  
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  
  
  const daysMonth = new Date (year, month + 1 , 0).getDate()
  const firstDayMonth = new Date (year, month, 1)
  

  const dateString = firstDayMonth.toLocaleDateString('pt-br', {
    weekday: 'long',
    year:    'numeric',
    month:   'numeric',
    day:     'numeric',
  })
  

  const paddinDays = weekdays.indexOf(dateString.split(', ') [0])
  
  //mostrar mês e ano:
  document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br',{month: 'long'})}, ${year}`

  
  calendar.innerHTML =''

  // criando uma div com os dias:

  for (let i = 1; i <= paddinDays + daysMonth; i++) {
    const dayS = document.createElement('div')
    dayS.classList.add('day')

    const dayString = `${month + 1}/${i - paddinDays}/${year}`

    //condicional para criar os dias de um mês:
     
    if (i > paddinDays) {
      dayS.innerText = i - paddinDays
      

      const eventDay = events[dayString];
      
      if(i - paddinDays === day && nav === 0){
        dayS.id = 'currentDay'
      }


      if (eventDay) {
        eventDay.forEach(event => {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = event;
          dayS.appendChild(eventDiv);
        });
      }
      

      dayS.addEventListener('click', ()=> openModal(dayString))

    } else {
      dayS.classList.add('padding')
    }

    
    calendar.appendChild(dayS)
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  eventTitleInput.value = '';
  eventModal.style.display = 'none';
  backDrop.style.display = 'none';
  clicked = null;
}

function saveEvent() {
  const title = eventTitleInput.value;
  if (title) {
    if (!events[clicked]) {
      events[clicked] = [];
    }

    events[clicked].push(title);
    localStorage.setItem('events', JSON.stringify(events));

    eventTitleInput.value = '';
    openModal(clicked); // recarrega o modal com novos eventos
    load(); // atualiza o calendário
  } else {
    eventTitleInput.classList.add('error');
  }
}



function deleteEvent(){

  events = events.filter(event => event.date !== clicked)
  localStorage.setItem('events', JSON.stringify(events))
  closeModal()
}

function deleteSingleEvent(index) {
  events[clicked].splice(index, 1);
  if (events[clicked].length === 0) {
    delete events[clicked];
  }

  localStorage.setItem('events', JSON.stringify(events));
  openModal(clicked); // atualiza o modal
  load(); // atualiza o calendário
}
// botões 

function buttons (){
  document.getElementById('backButton').addEventListener('click', ()=>{
    nav--
    load()
    
  })

  document.getElementById('nextButton').addEventListener('click',()=>{
    nav++
    load()
    
  })

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
  
  
}
buttons()
load()

