const formBtnEl = document.getElementById('openModal');


/* Я читал, что алгоритм getElementByID работает быстрее, чем querySelector, поэтому 
здесь использую его. Хоть и не большое кол-во элементов, но какая-никакая оптимизация :D*/
const bodyEl = document.querySelector('body');
const modalEl = document.getElementById('modal');
const modalBodyEl = document.getElementById('modal-body');
const closeModalBtnEl = document.getElementById('cancelBtn');
const closeCrossEl = document.getElementById('closeCross');
const nameHintEl = document.getElementById('name-hint');
const telHintEl = document.getElementById('tel-hint');

formBtnEl.addEventListener('click', e => {
    bodyEl.classList.add('scroll-lock');
    modalEl.classList.add('open')
})

//Решил через делегирвание сделать + чтобы клик вне тоже закрывал
modalEl.addEventListener('click', e => {
    if (e.target === modalEl || e.target === closeModalBtnEl || e.target === closeCrossEl) {
        e.preventDefault();
        bodyEl.classList.remove('scroll-lock');
        modalEl.classList.remove('open')
    }

})


const telReg = /^((\+7)|8)\d{10}$/
const nameReg = /^.{3,}$/

const formEl = document.getElementById('form');
const telInputEl = document.getElementById('tel');
const nameInputEl = document.getElementById('name');
const tableEl = document.getElementById('table');
const spinerEl = document.getElementById('spinner');
const errorEl = document.getElementById('error');


//Вывод сделал раз за сеанс, для новой попытки - перезагрузка страницы

formEl.addEventListener('submit', e => {
    e.preventDefault();
    if (nameReg.test(nameInputEl.value)) {
        nameInputEl.classList.remove('invalid');
        nameHintEl.classList.remove('visible');
    } else {
        nameInputEl.classList.add('invalid');
        nameHintEl.classList.add('visible');
    }
    if (telReg.test(telInputEl.value)) {
        telInputEl.classList.remove('invalid');
        telHintEl.classList.remove('visible');
    } else {
        telInputEl.classList.add('invalid');
        telHintEl.classList.add('visible');
    }
    if (nameReg.test(nameInputEl.value) && telReg.test(telInputEl.value)) {
        modalBodyEl.classList.add('invisible');
        spinerEl.classList.add('visible');
        return fetch(`https://jsonplaceholder.typicode.com/todos`)
            //Если успешно -> перебираем все элементы, подходящие критериям запроса
            .then(result => result.json())
            .then(result => {
                result.forEach(el => {
                    if (el.userId === 5 && el.completed === false) {
                        console.log(el)
                        tableEl.insertAdjacentHTML('beforeend', `
                        <tr>
                            <td>
                                ${el.userId}
                            </td>
                            <td>
                                ${el.id}
                            </td>
                            <td>
                                ${el.title}
                            </td>
                            <td>
                                ${el.completed}
                            </td>
                        </tr>    
                        `)
                    }
                    //Скрытие загрузки и показ рещультата решил сделать здесь, а не через finally,
                    //т.к. уже после цикла все данные вставлены 
                    spinerEl.classList.remove('visible')
                    tableEl.classList.add('open')
                });
            })
            //Если не получилось - будет окно с сообщением и так же надо будет перезагрузить страницу
            .catch(error => {
                console.log(error);
                errorEl.classList.add('visible');
                spinerEl.classList.remove('visible');

            });
    }
})