const Expenses=require('../model/expenses')
const fs=require('fs')
const User = require('../model/users')

var ITEMS_PER_PAGE=3

exports.showServer=(req, res, next)=>{
    res.send("<h1>Welcome to Expense Tracker's Backend Server</h1>")
}

// Pagination
exports.updatePages=(req,res,next)=>{
    console.log(req.params.pages)
    ITEMS_PER_PAGE=parseInt(req.params.pages)
    res.status(200).send({updated:true})
}

exports.getExpenses=async(req, res, next)=>{
    var totalExpenses;
    let positive=0.00, negative=0.00;
    const page = +req.params.pageNo || 1;
    let totalItems=Expenses.find({'userId': req.user.id}).then(response=>{
        totalExpenses=response.length
        response.map(i=>{
            (i.amount>0)?positive+=i.amount:negative+=i.amount;
        })
    }).catch(err=>console.log(err))

    await totalItems;

    Expenses.find({'userId': req.user.id}).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    .then(response=>{
        res.status(200).send({
            response: response,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalExpenses,
            hasPreviousPage: page > 1,
            nextPage:page+1,
            previousPage:page-1,
            positive:positive,
            negative:negative,
            lastPage:Math.ceil(totalExpenses/ITEMS_PER_PAGE),
            totalItems: totalExpenses
        });
    })
}

exports.getExpense=(req, res, next)=>{
    Expenses.findById(req.params.id).then(response=>{
        res.status(200).send(response)
        console.log(response)
    }).catch(err=>console.log(err))
}

// Add Expense
exports.addExpense=(req, res, next)=>{
    const expense=new Expenses({
        amount: req.body.amount,
        desc: req.body.desc,
        catg: req.body.catg,
        userId: req.user.id
    })
    return expense.save()
    .then(response=>{
        res.status(201).send(response)
    }).catch(err=>console.log(err))
}

// Delete Expense
exports.deleteExpense=(req, res, next)=>{
    Expenses.findByIdAndDelete(req.params.id).then(response=>{
        res.status(200).send({response:response})
    }).catch(err=>console.log(err))
}

// Edit Expense
exports.editExpense=(req, res, next)=>{
    Expenses.findById(req.params.id).then(response=>{
        response.amount=req.body.amount
        response.desc=req.body.desc
        response.catg=req.body.catg
        return response.save()
    }).catch(err=>console.log(err)).then(response=>{
        res.status(200).send({
            response:response
        })
    }).catch(err=>console.log(err))
}

// Download Expense
exports.downloadExpenses=(req,res,next)=>{
    Expenses.find({'userId': req.user.id}).then(expenses=>{
        fs.writeFile("expenses.txt", JSON.stringify(expenses), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync("expenses.txt", "utf8"));
            }
        });
        const file=`${__dirname}/expenses.txt`
        res.status(200).send(JSON.stringify(expenses))
    }).catch(err=>console.log(err))
}
