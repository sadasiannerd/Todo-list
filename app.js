const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const ejs = require('ejs');
const date = require(path.join(__dirname, 'date.js'))
const app = express();
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

//get the current date
let currentDate = date.getTime()


//view engine set up
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');



//app configuration
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

//access the local DB
main().catch(err => console.log(err));



const taskSchema = new Schema ({
        date: String,
        task_name: String,
        finished: Number,
    })
const listSchema = new Schema (
    {
        list_name:String,
        list: [taskSchema],
    }
)
const lists = mongoose.model('customList', listSchema)

const tasks = mongoose.model('Home', taskSchema);

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

let all_tasks = []

app.get('/', async (req, res) =>
{  
    all_tasks = await tasks.find({date: currentDate});
    if(all_tasks.length === 0) console.log('There is currently no task of ' + currentDate); 
    res.render('pages/index', {currentDate:currentDate, tasks: all_tasks})
})
app.post('/', (req,res) =>
{
    let new_task = req.body.new_task
    let task_to_create = new tasks({date: currentDate, task_name: new_task, finished: 0});
    tasks.insertMany([task_to_create])
    res.redirect('/')
})
app.get('/delete', (req, res)=>{
    res.redirect('/')

})
app.post('/delete',async (req, res) =>
{
    let itemToDelete = req.body.itemToDelete
    await tasks.deleteOne({_id: itemToDelete})
    res.redirect('/')
}
)
app.get('/finish', async (req, res) =>
{
    res.redirect('/')
})
app.post('/finish', async (req, res) =>
{
    let itemToFinish = req.body.itemToFinish
    the_task = await tasks.find({_id: itemToFinish})
    console.log(the_task[0].finished)
    if (the_task[0].finished === 0) await tasks.updateOne({_id: itemToFinish}, {finished : 1})
    else{
        await tasks.updateOne({_id: itemToFinish}, {finished: 0})
    }
    res.redirect('/')
}
)
app.get('/:customList', async (req, res) => 
{
    let customList = req.params.customList;
    let find_list = await lists.find({list_name: customList})
    if(find_list.length === 0){
        new_list = new lists({
            list_name: customList,
            list: []
        })
        lists.bulkSave([new_list])
        res.render("pages/index", {currentDate: currentDate, tasks: []})
    }else{
        res.render("pages/index", {currentDate: currentDate, tasks: find_list[0].list})
    }

})


app.listen(3000, () => console.log('Server is running on port 3000'))