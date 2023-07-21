const toggleButton = document.getElementById('toggle');
const elementToToggle = document.getElementById('confirmBox');
const checkBox = document.getElementById('isSure');
const submitButton = document.getElementById('submitButton');

toggleButton.addEventListener('click', function() {
    elementToToggle.classList.toggle('hidden');
    checkBox.checked=false;
});

checkBox.addEventListener('change', function(){
    submitButton.disabled = !checkBox.checked;
})

