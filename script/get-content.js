document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:8888').then(response => response.json()).then(data => {
        const content = document.getElementById('content');
        const items = `<ul>${data.items.map(el => `<li>${el}</li>`).join('')}</ul>`;

        content.innerHTML = items;
    })
});