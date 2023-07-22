const hideElements = document.querySelectorAll("[id='hideElement']");
const hideRescueElements = document.querySelectorAll("[id='hide-rescue']");
const button=document.getElementById('hide');
const button2=document.getElementById('hide-show');

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

button2.addEventListener('click', function(){
    if(hideRescueElements[0].style.display=="none"){
        button2.innerText="See less";
        for(var i=0; i<hideRescueElements.length; i++){
            hideRescueElements[i].style.display="block";
        }
    }
    else{
        button2.innerText="See more";
        for(var i=0; i<hideRescueElements.length; i++){
            hideRescueElements[i].style.display="none";
        }
    }
});