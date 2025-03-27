var ctx = document.getElementById('subject performance chart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Maths', 'English', 'Science', 'General Knowledge'],
        datasets: [{
            label: 'Daily Subject Peformance',
            data: [45, 69 , 78, 86],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2',
                'rgba(54, 162, 235, 0.2',
                'rgba(255, 206, 86, 0.2',
                'rgba(75, 192, 192, 0.2',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1',
                'rgba(54, 162, 235, 1',
                'rgba(255, 206, 86, 1',
                'rgba(75, 192, 192, 1',
            ],
            borderWidth: 1
        }]
    },  
    options: {
        responsive: true,
    } 
});

var chart2 = document.getElementById('weekly performance').getContext('2d');
var myChart = new Chart(chart2 , {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        datasets: [{
            label: 'General Weekly Performance',
            data: [58, 85, 70, 45, 68],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2',
                'rgba(54, 162, 235, 0.2',
                'rgba(255, 206, 86, 0.2',
                'rgba(75, 192, 192, 0.2',
                'rgba(255, 159, 64, 0.2',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1',
                'rgba(54, 162, 235, 1',
                'rgba(255, 206, 86, 1',
                'rgba(75, 192, 192, 1',
                'rgba(255, 159, 64, 1',
            ],
            borderWidth: 1
        }]
    },  
    options: {
        responsive: true,
    } 
});


var chart3 = document.getElementById('monthly performance').getContext('2d');
var myChart = new Chart(chart3 , {
    type: 'line',
    data: {
        labels: ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'General Monthly Performance',
            data: [58, 85, 70, 45, 68, 20, 77, 94, 55, 84, 32, 89],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2',
                'rgba(54, 162, 235, 0.2',
                'rgba(255, 206, 86, 0.2',
                'rgba(75, 192, 192, 0.2',
                'rgba(255, 159, 64, 0.2',
                'rgba(0, 238, 255, 0.2',
                'rgba(150, 50, 135, 0.2',
                'rgba(145, 255, 0, 0.2',
                'rgba(204, 0, 255, 0.2',
                'rgba(255, 234, 0, 0.2',
                'rgba(0, 255, 153, 0.2',
                'rgba(21, 0, 255, 0.2',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1',
                'rgba(54, 162, 235, 1',
                'rgba(255, 206, 86, 1',
                'rgba(75, 192, 192, 1',
                'rgba(255, 159, 64, 1',
                'rgba(0, 238, 255, 1',
                'rgba(150, 50, 135, 1',
                'rgba(145, 255, 0, 1',
                'rgba(204, 0, 255, 1',
                'rgba(255, 234, 0, 1',
                'rgba(0, 255, 153, 1',
                'rgba(21, 0, 255, 1',
            ],
            borderWidth: 1
        }]
    },  
    options: {
        responsive: true,
    } 
});

var chart4 = document.getElementById('Leaderboard Ranking').getContext('2d');
var myChart = new Chart(chart4, {
    type: 'polarArea',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Leaderboard Ranking',
            data: [2, 5, 1, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2',
                'rgba(54, 162, 235, 0.2',
                'rgba(255, 206, 86, 0.2',
                'rgba(75, 192, 192, 0.2',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1',
                'rgba(54, 162, 235, 1',
                'rgba(255, 206, 86, 1',
                'rgba(75, 192, 192, 1',
            ],
            borderWidth: 1
        }]
    },  
    options: {
        responsive: true,
    } 
});

//Light & Dark mode feature//
let toggleBtn = document.getElementById('toggle-btn');
let body = document.body;
let darkMode = localStorage.getItem('dark-mode');

const enableDarkMode = () =>{
   toggleBtn.classList.replace('fa-sun', 'fa-moon');
   body.classList.add('dark');
   localStorage.setItem('dark-mode', 'enabled');
}

const disableDarkMode = () =>{
   toggleBtn.classList.replace('fa-moon', 'fa-sun');
   body.classList.remove('dark');
   localStorage.setItem('dark-mode', 'disabled');
}

if(darkMode === 'enabled'){
   enableDarkMode();
}

toggleBtn.onclick = (e) =>{
   darkMode = localStorage.getItem('dark-mode');
   if(darkMode === 'disabled'){
      enableDarkMode();
   }else{
      disableDarkMode();
   }
}

//Sidebar//
let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () =>{
   profile.classList.toggle('active');
   search.classList.remove('active');
}

let search = document.querySelector('.header .flex .search-form');

document.querySelector('#search-btn').onclick = () =>{
   search.classList.toggle('active');
   profile.classList.remove('active');
}

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

window.onscroll = () =>{
   profile.classList.remove('active');
   search.classList.remove('active');

   if(window.innerWidth < 1200){
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
}


