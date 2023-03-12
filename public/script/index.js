const rememberCheckboxes = $('.finished-check-box');
const rememberCheckboxArray = Array.from(rememberCheckboxes)

rememberCheckboxArray.forEach((rememberCheckbox)=>{
    rememberCheckbox.addEventListener('change', function(){
    var finished_task_num = this.getAttribute('value')
    localStorage.setItem('rememberCheckbox-' + String(finished_task_num), this.checked)
    console.log(finished_task_num)
    })
})


for(var i = 0; i< rememberCheckboxArray.length; i++)
{
    if(localStorage.getItem('rememberCheckbox-' + String(i)) === 'true'){ 
    rememberCheckboxArray[i].checked = true;
    console.log('Checkbox ${i} is checked!')
}
}

