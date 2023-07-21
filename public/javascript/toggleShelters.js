const hideElements = document.querySelectorAll("[id='hideElement']");
const button=document.getElementById('hide');

button.addEventListener('click', function(){
    if(hideElements[0].style.display=="none"){
        button.innerText="See less";
        for(var i=0; i<hideElements.length; i++){
            hideElements[i].style.display="block";
        }
    }
    else{
        button.innerText="See more";
        for(var i=0; i<hideElements.length; i++){
            hideElements[i].style.display="none";
        }
    }
});