
// HIDE LOCK IF MENUS ARE OPEN ON MOBILE ONLY
window.addEventListener('click', () => {
    if(window.innerWidth >= 1400) return;


    const tryBtn = document.querySelector('button[data-role~="try-it"]');
    const lock = document.querySelector('#tdv-lock');
    const mainHeader = document.querySelector('#main-header');

    if(mainHeader.classList.contains('nav-open')) {
        if(tryBtn) {
            tryBtn.style.display = 'none';
        }
        lock.style.display = 'none';
    }
    if(!mainHeader.classList.contains('nav-open') && ((tryBtn && tryBtn.style.display === 'none') || (lock && lock.style.display === 'none'))) {
        if(tryBtn) {
            tryBtn.style.display = '';
        }
        lock.style.display = '';
    }
}); 

// RESET RIGHTBAR ON RESIZE (annoying for devel)
let known = window.innerWidth;
window.addEventListener('resize', () => {

    const rightbar = document.querySelector('.tdv-rightbar');
    
    const props = ['height', 'width', 'right'];

    if(known < 1400 && window.innerWidth >= 1400) {
        props.forEach(k => rightbar.style[k] = '');        
    } else if(known >= 1400 && window.innerWidth < 1400) {
        
        props.forEach(k => rightbar.style[k] = '0px');
        
    }
    known = window.innerWidth;
});

window.addEventListener('load', () => {
    document.querySelectorAll('*[href]').forEach(entry => entry.href = entry.href.toLowerCase());
});
