// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Получение элементов DOM
    const calendar = document.getElementById('календарь');
    const textbox = document.getElementById('текст-бокс');
    const todayDate = document.getElementById('сегодняшняя-дата');
    const datePicker = document.getElementById('выбор-даты');

    // Установка сегодняшней даты
    todayDate.textContent = `Сегодня: ${new Date().toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    let currentDate = new Date();

    // Установка значения поля ввода даты
    datePicker.value = formatDate(currentDate);

    datePicker.addEventListener('change', function() {
        // Обновление текущей даты
        currentDate = new Date(datePicker.value);
        renderCalendar();
    });

    const annuallyBolded = [
        '2002-01-01', 
        '2002-05-01', 
        '2002-05-09'  
    ];
    const bolded = [];
    const monthlyBolded = [];

    let selectedDates = [];
    let startDate = null;
    let endDate = null;
    let notes = {};

    // Форматирование даты в YYYY-MM-DD
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Форматирование даты в YYYY-MM
    function formatMonth(date) {
        return date.toISOString().slice(0, 7);
    }

    // Парсинг строки даты в объект Date
    function parseDate(str) {
        return new Date(str + 'T00:00:00');
    }

    
    function isExerciseDay(date) {
        const day = date.getDay();
        return day === 1 || day === 3 || day === 5; 
    }

    
    function isRehabDay(date) {
        const day = date.getDay();
        const cutoff = new Date('2012-07-01');
        return (day === 1 || day === 5) && date < cutoff; 
    }

    
    function isDinnerDay(date) {
        return formatDate(date) === '2012-05-15';
    }

    
    function isBolded(date) {
        const dateStr = formatDate(date);
        const day = date.getDate();
        return annuallyBolded.includes(dateStr) || bolded.includes(dateStr) || monthlyBolded.includes(day) ||
               isRehabDay(date) || isDinnerDay(date);
    }

    // Проверка, является ли дата в предыдущем/следующем месяце
    function isTrailing(date, month) {
        return date.getMonth() !== month;
    }

    
    function generateMonth(year, month, monthIndex) {
        
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';

        
        const header = document.createElement('div');
        header.className = 'month-header';
        header.textContent = new Date(year, month).toLocaleDateString('ru', { month: 'long', year: 'numeric' });
        monthDiv.appendChild(header);

        
        const daysDiv = document.createElement('div');
        daysDiv.className = 'days';

        
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        daysOfWeek.forEach(day => {
            
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            daysDiv.appendChild(dayHeader);
        });

        
        const firstDay = new Date(year, month, 1);
        const startDay = (firstDay.getDay() + 6) % 7; // Monday first

        // Добавление дней предыдущего месяца
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            // Создание элемента для дня предыдущего месяца
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day trailing';
            dayDiv.textContent = prevMonthDays - i;
            daysDiv.appendChild(dayDiv);
        }

        // Добавление дней текущего месяца
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.textContent = day;
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                // Выделение выходных
                dayDiv.classList.add('weekend');
            }
            if (isBolded(date)) {
                //TODO:праздники сделать
                dayDiv.classList.add('holiday');
                dayDiv.classList.add('bold');
            }
            if (selectedDates.some(d => d.getTime() === date.getTime())) {
                // Выделение если выбрана
                dayDiv.classList.add('selected');
            }
            const dateKey = formatDate(date);
            if (notes[dateKey]) {
                
                dayDiv.classList.add('has-note');
                dayDiv.title = notes[dateKey];
            }
            
            dayDiv.addEventListener('click', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    // Добавление заметки при Ctrl+click
                    const note = prompt(`Введите заметку для даты ${date.toLocaleDateString('ru')}:`, notes[dateKey] || '');
                    if (note !== null) {
                        notes[dateKey] = note;
                        dayDiv.title = note;
                        dayDiv.classList.add('has-note');
                    }
                } else {
                    
                    selectDate(date);
                }
            });
            daysDiv.appendChild(dayDiv);
        }

        // Добавление дней следующего месяца
        const totalCells = 42;
        const filledCells = startDay + daysInMonth;
        for (let i = 1; filledCells + i <= totalCells; i++) {
            // Создание элемента для дня следующего месяца
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day trailing';
            dayDiv.textContent = i;
            daysDiv.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysDiv);
        return monthDiv;
    }

    
    function renderCalendar() {
        
        calendar.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        calendar.appendChild(generateMonth(year, month, 0));
    }

    // Выбор даты пользователем
    function selectDate(date) {
        if (selectedDates.length === 0) {
            // Первая выбранная дата
            selectedDates = [date];
        } else if (selectedDates.length === 1) {
            // Вторая дата для диапазона
            const first = selectedDates[0];
            if (date < first) {
                selectedDates = [date, first];
            } else {
                selectedDates = [first, date];
            }
        } else {
            selectedDates = [date];
        }
        if (selectedDates.length > 21) {
            selectedDates = selectedDates.slice(0, 21);
        }
        startDate = selectedDates[0];
        endDate = selectedDates[selectedDates.length - 1];
        updateTextbox('Выбор даты');
        renderCalendar();
    }

    // Получение знака китайского зодиака по году
    function getChineseZodiac(year) {
        const zodiac = ['Крыса', 'Бык', 'Тигр', 'Кролик', 'Дракон', 'Змея', 'Лошадь', 'Коза', 'Обезьяна', 'Петух', 'Собака', 'Свинья'];
        return zodiac[(year - 2020) % 12];
    }

    function updateTextbox(event) {
        if (startDate && endDate) {
            // Подсчет количества дней
            const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            const year = startDate.getFullYear();
            // Получение знака зодиака
            const zodiac = getChineseZodiac(year);
            const startStr = startDate.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
            const endStr = endDate.toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' });
            textbox.value = `${startStr} - ${endStr} (${daysCount} дней) Год ${zodiac}`;
        }
    }

    renderCalendar();
});