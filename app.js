const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const ejs = require('ejs');
const app = express();



//view engine set up
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');



//app configuration
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));



var tasks = []

const date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

var currentDate = `${day}/${month}/${year}`;



app.get('/', (req, res) =>
{   
    res.render('pages/index', {currentDate:currentDate,
    tasks:tasks})

})
app.get('/delete', (req, res)=>{
    res.redirect('/')
})

app.post('/delete',(req, res) =>
{
    const indexToDelete = req.body.indexToDelete;
    console.log(indexToDelete)
    console.log(tasks)
    tasks.splice(indexToDelete, 1);
    console.log(tasks)
    res.redirect('/')
}
)
app.post('/', (req,res) =>
{
    tasks.push(req.body.new_task)
    console.log(tasks)
    res.redirect('/')
})


app.listen(3000, () => console.log('Server is running on port 3000'))