
/* Я читал, что алгоритм getElementByID работает быстрее, чем querySelector, поэтому 
здесь использую его. Хоть и не большое кол-во элементов, но какая-никакая оптимизация :D*/
const nextBtnEl = document.getElementById('next');
const prevBtnEl = document.getElementById('prev');
const slideEls = document.querySelectorAll('.nav__text');


const bodyEl = document.querySelector('body');
const formBtnEl = document.getElementById('openModal');
const modalEl = document.getElementById('modal');
const modalBodyEl = modalEl.querySelector('#modal-body');
const closeModalBtnEl = modalBodyEl.querySelector('#cancelBtn');
const closeCrossEl = modalBodyEl.querySelector('#closeCross');
const nameHintEl = modalBodyEl.querySelector('#name-hint');
const telHintEl = modalBodyEl.querySelector('#tel-hint');
const formEl = modalBodyEl.querySelector('#form');
const telInputEl = formEl.querySelector('#tel');
const nameInputEl = formEl.querySelector('#name');
const tableEl = modalEl.querySelector('#table');
const spinerEl = modalEl.querySelector('#spinner');
const errorEl = modalEl.querySelector('#error');


const sortEl = document.getElementById('sort');
let plants = document.querySelector('.plants__cards');

nextBtnEl.addEventListener('click', plusSlide);
prevBtnEl.addEventListener('click', minusSlide);

//Упорядоченный по цене массив растений
let featuredPlants = [
    {
        title: 'Kaktus Plants',
        price: '85.000',
        id: '01',
    },
    {
        title: 'Kecubung Plants',
        price: '85.000',
        id: '02',
    },
    {
        title: 'Kecubung Plants',
        price: '85.000',
        id: '03',
    },
    {
        title: 'Kecubung Plants',
        price: '85.000',
        id: '04',
    },
    {
        title: 'Landak Plants',
        price: '105.000',
        id: '05',
    }
]

//Фкнция создания карточки растения
function templateOfPlantCard(el) {
    return `<div class="plant-card">
<img class="plant-card__img" src="images/plant${el.id}.jpg" alt="photo of plant">
<p class="plant-card__title">${el.title}</p>
<p class="plant-card__price">IDR ${el.price}</p>
</div>`
}

//Функция отрисовки растений
function plantsCardsRender(){
    //Находим актуальный блок plants
    plants = document.querySelector('.plants__cards')
    featuredPlants.forEach(el => {
        plants.insertAdjacentHTML('beforeend',templateOfPlantCard(el))
    });
}
//Первичная отрисовка
plantsCardsRender();



sortEl.addEventListener('change',() => {
    //Меняем порядок в массиве растений
    featuredPlants.reverse();
    //Заменяем текущий блок на пустой
    plants.replaceWith(plants.cloneNode());
    //Отрисовываем заново с учетом нового порядка
    plantsCardsRender();
})




function showSlides(n) {
    let i;
    if (n > slideEls.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slideEls.length;
    }
    for (i = 0; i < slideEls.length; i++) {
        slideEls[i].classList.remove('visible');
        slideEls[i].classList.add('invisible');
    }
    slideEls[slideIndex - 1].classList.add('visible');
}


let slideIndex = 1;
showSlides(slideIndex);

function plusSlide() {
    showSlides(++slideIndex);
}

function minusSlide() {
    showSlides(--slideIndex);
}





const telReg = /^((\+7)|8)\d{10}$/
const nameReg = /^.{3,}$/



formBtnEl.addEventListener('click', () => {
    bodyEl.classList.add('scroll-lock');
    modalEl.classList.add('open')
})

//Решил через делегирвание сделать + чтобы клик вне тоже закрывал
modalEl.addEventListener('click', e => {
    const elOnClick = e.target;
    if (elOnClick === modalEl || elOnClick === closeModalBtnEl || elOnClick === closeCrossEl) {
        e.preventDefault();
        bodyEl.classList.remove('scroll-lock');
        modalEl.classList.remove('open');
        //Т.к. стоит transition 0.3 у модального окна, без таймаута в процессе исчезновения окна
        //заметно как вернулась форма
        setTimeout(() => clearForm(), 300);
    }

})

//Решил сделать функцию для поля и подсказок, так как суть будет одна для всех
//возможных полей и мне показалось  проще вызывать функцию с самим полем и подсказкой, 
//чем постоянно писать эти две строки
function clearFormInputs(input, hint) {
    input.classList.remove('invalid');
    hint.classList.remove('visible');
}

function clearForm() {
    for (let i = tableEl.children.length - 1; i > 0; i--) {
        tableEl.children[i].remove();
    }
    tableEl.classList.remove('visible');
    errorEl.classList.remove('visible')
    modalBodyEl.classList.remove('invisible')
}

//Вывод сделал раз за сеанс, для новой попытки - перезагрузка страницы

formEl.addEventListener('submit', e => {
    e.preventDefault();
    if (nameReg.test(nameInputEl.value)) {
        clearFormInputs(nameInputEl, nameHintEl)
    } else {
        nameInputEl.classList.add('invalid');
        nameHintEl.classList.add('visible');
    }
    if (telReg.test(telInputEl.value)) {
        clearFormInputs(telInputEl, telHintEl);
    } else {
        telInputEl.classList.add('invalid');
        telHintEl.classList.add('visible');
    }
    if (nameReg.test(nameInputEl.value) && telReg.test(telInputEl.value)) {
        modalBodyEl.classList.add('invisible');
        //Решил обнулять значения только после отправки формы, чтобы пользователь мог вернуться 
        //к оставленной форме с частично заполенными полями
        nameInputEl.value = '';
        telInputEl.value = '';

        spinerEl.classList.add('visible');
        return fetch(`https://jsonplaceholder.typicode.com/todos`)
            //Если успешно -> перебираем все элементы, подходящие критериям запроса
            .then(result => result.json())
            .then(result => {
                result.forEach(el => {
                    if (el.userId === 5 && el.completed === false) {
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
                    setTimeout(() => {
                        spinerEl.classList.remove('visible')
                        tableEl.classList.add('visible');
                    }, 1500)

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




