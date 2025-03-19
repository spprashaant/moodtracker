// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // retrieve the DOM elements and store in variables
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodTimeline = document.getElementById('mood-timeline');
    const calendarView = document.getElementById('calendar-view');
    const calendarHeader = document.getElementById('calendar-header');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const dayViewBtn = document.getElementById('day-view-btn');
    const weekViewBtn = document.getElementById('week-view-btn');
    const monthViewBtn = document.getElementById('month-view-btn');
    const dayNavigation = document.getElementById('day-navigation');
    const weekNavigation = document.getElementById('week-navigation');
    const monthNavigation = document.getElementById('month-navigation');
    const prevDayBtn = document.getElementById('prev-day-btn');
    const nextDayBtn = document.getElementById('next-day-btn');
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    const prevMonthTimelineBtn = document.getElementById('prev-month-timeline-btn');
    const nextMonthTimelineBtn = document.getElementById('next-month-timeline-btn');
    let currentDate = new Date();

    // Set the default view to month
    let currentView = 'month';

    // Add click event listener to the mood buttons
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the mood value from the data-mood attribute
            const mood = button.getAttribute('data-mood');
            // Get the current date in the format MM/DD/YYYY
            const date = new Date().toLocaleDateString();
            // Save the mood to local storage
            saveMood(date, mood);
            // Display the moods and calendar
            displayMoods();
            displayCalendar();
        });
    });

    // Add click event listener to the clear storage button
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    clearStorageBtn.addEventListener('click', () => {
        // Clear the moods from local storage
        localStorage.removeItem('moods');
        // Display the moods and calendar
        displayMoods();
        displayCalendar();
    });

    // Add click event listeners to the navigation buttons
    prevMonthBtn.addEventListener('click', () => {
        // Set the month to the previous month
        currentDate.setMonth(currentDate.getMonth() - 1);
        // Display the calendar
        displayCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        // Set the month to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
        // Display the calendar
        displayCalendar();
    });

    // Add click event listeners to the view buttons
    dayViewBtn.addEventListener('click', () => {
        currentView = 'day';
        updateView();
    });

    weekViewBtn.addEventListener('click', () => {
        currentView = 'week';
        updateView();
    });

    monthViewBtn.addEventListener('click', () => {
        currentView = 'month';
        updateView();
    });

    // Add click event listeners to the navigation buttons
    // Sets the current date to the previous or next day, week, or month
    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        displayMoods();
    });

    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        displayMoods();
    });

    prevWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        displayMoods();
    });

    nextWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        displayMoods();
    });

    prevMonthTimelineBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        displayMoods();
    });

    nextMonthTimelineBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        displayMoods();
    });

    // Function to save the mood to local storage
    function saveMood(date, mood) {
        // Get the moods from local storage and parse to json or an empty array if there are no moods
        let moods = JSON.parse(localStorage.getItem('moods')) || [];
        // Add the new mood entry to the moods array
        moods.push({ date, mood });
        // Save the moods back to local storage
        localStorage.setItem('moods', JSON.stringify(moods));
    }

    // Function to display the moods in the mood timeline
    function displayMoods() {
        // Get the moods from local storage and parse to json or an empty array if there are no moods
        const moods = JSON.parse(localStorage.getItem('moods')) || [];
        moodTimeline.innerHTML = '';
        // Display the moods based on the current view
        if (currentView === 'day') {
            const date = currentDate.toLocaleDateString();
            // Find the mood entry for the current date
            const moodEntry = moods.find(entry => entry.date === date);
            if (moodEntry) {
                // Create a div element to display the mood entry
                const moodEntryDiv = document.createElement('div');
                // Set the text content of the div to the date and mood emoji
                moodEntryDiv.textContent = `${date}: ${getEmojiForMood(moodEntry.mood)}`;
                // Append the mood entry div to the mood timeline
                moodTimeline.appendChild(moodEntryDiv);
            }
        } else if (currentView === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            // Display the mood entries for the current week
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const dateString = date.toLocaleDateString();
                
                const moodEntry = moods.find(entry => entry.date === dateString);
                if (moodEntry) {
                    const moodEntryDiv = document.createElement('div');
                    moodEntryDiv.textContent = `${dateString}: ${getEmojiForMood(moodEntry.mood)}`;
                    moodTimeline.appendChild(moodEntryDiv);
                }
            }
        } else if (currentView === 'month') {
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            // Display the mood entries for the current month
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day).toLocaleDateString();
                const moodEntry = moods.find(entry => entry.date === date);
                if (moodEntry) {
                    const moodEntryDiv = document.createElement('div');
                    moodEntryDiv.textContent = `${date}: ${getEmojiForMood(moodEntry.mood)}`;
                    moodTimeline.appendChild(moodEntryDiv);
                }
            }
        }
        // Hide the next button if it is the current date, week, or month
        updateNavigationButtons();
    }

    // Function to display the calendar
    function displayCalendar() {
        // Get the moods from local storage and parse to json or an empty array if there are no moods
        const moods = JSON.parse(localStorage.getItem('moods')) || [];
        calendarView.innerHTML = '';
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        calendarHeader.textContent = `${month} ${year}`; // Display month and year
        // calculate the number of days in the current month
        const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
        // Display the days of the month in the calendar
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, currentDate.getMonth(), day).toLocaleDateString();
            // Find the mood entry for the current date
            const moodEntry = moods.find(entry => entry.date === date);
            // Create a div element to display the day in the calendar
            const calendarDay = document.createElement('div');
            // Add the calendar-day class to the div element
            calendarDay.classList.add('calendar-day');

            if (moodEntry) {
                // Add the mood color to the div element
                calendarDay.classList.add(`mood-${moodEntry.mood}`);
                // Set the inner HTML of the div element to the mood emoji and day
                calendarDay.innerHTML = `<span>${getEmojiForMood(moodEntry.mood)}</span> ${day}`;
            } else {
                // Set the text content of the div element to the day
                calendarDay.textContent = day;
            }
            calendarView.appendChild(calendarDay);
        }

        // Hide next month button if it is the current month
        const today = new Date();
        if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
            nextMonthBtn.style.display = 'none';
        } else {
            nextMonthBtn.style.display = 'inline-block';
        }
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const today = new Date();
        // Hide next day button if it is the current day
        if (currentDate.toDateString() === today.toDateString()) {
            nextDayBtn.style.display = 'none';
        } else {
            nextDayBtn.style.display = 'inline-block';
        }

        // Hide next week button if it is the current week
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        if (today >= startOfWeek && today <= endOfWeek) {
            nextWeekBtn.style.display = 'none';
        } else {
            nextWeekBtn.style.display = 'inline-block';
        }

        // Hide next month button if it is the current month
        if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
            nextMonthTimelineBtn.style.display = 'none';
        } else {
            nextMonthTimelineBtn.style.display = 'inline-block';
        }
    }

    // Function to get the emoji for the mood
    function getEmojiForMood(mood) {
        switch(mood) {
            case 'sad': return '😢';
            case 'angry': return '😠';
            case 'neutral': return '😐';
            case 'happy': return '😊';
            case 'excited': return '😃';
            default: return '';
        }
    }

    // Function to add test entries to local storage
    function addTestEntries() {
        const testMoods = [
            { date: new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString(), mood: 'happy' },
            { date: new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString(), mood: 'sad' },
            { date: new Date(new Date().setDate(new Date().getDate() - 3)).toLocaleDateString(), mood: 'neutral' },
            // Test data for previous months
            { date: new Date(new Date().setMonth(new Date().getMonth() - 1, 10)).toLocaleDateString(), mood: 'angry' },
            { date: new Date(new Date().setMonth(new Date().getMonth() - 1, 15)).toLocaleDateString(), mood: 'excited' },
            { date: new Date(new Date().setMonth(new Date().getMonth() - 2, 5)).toLocaleDateString(), mood: 'happy' },
            { date: new Date(new Date().setMonth(new Date().getMonth() - 2, 20)).toLocaleDateString(), mood: 'sad' }
        ];
        // Get the moods from local storage and parse to json or an empty array if there are no moods
        let moods = JSON.parse(localStorage.getItem('moods')) || [];
        // Add the test moods to the moods array
        moods = moods.concat(testMoods);
        // Save the moods back to local storage
        localStorage.setItem('moods', JSON.stringify(moods));
    }

    // Function to update the view based on the current view
    function updateView() {
        // Display the day, week, or month navigation based on the current view
        dayNavigation.style.display = currentView === 'day' ? 'flex' : 'none';
        weekNavigation.style.display = currentView === 'week' ? 'flex' : 'none';
        monthNavigation.style.display = currentView === 'month' ? 'flex' : 'none';
        displayMoods();
        updateViewButtons();
    }

    // Function to update the view buttons based on the current view
    function updateViewButtons() {
        dayViewBtn.classList.toggle('selected', currentView === 'day');
        weekViewBtn.classList.toggle('selected', currentView === 'week');
        monthViewBtn.classList.toggle('selected', currentView === 'month');
    }

    // Display the moods and calendar when the DOM is fully loaded
    addTestEntries();
    displayMoods();
    displayCalendar();
    updateView();
});
