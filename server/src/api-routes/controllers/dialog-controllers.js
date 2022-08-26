const {getDialog} = require("../../db/models/dialogs");

function create(req, res){
    res.send(  {message: "Create dialog"} );
}

function update(req, res){
    const {id} = req.params;
    res.send(  {message: "Update dialog ", id} );
}

async function read(req, res){
    const {id} = req.params; // dialog_id
    const {sub} = req.auth;  // user_id
    try{
        const dialog = await getDialog(sub, id);
        console.log("reading", dialog)
        res.send(dialog);
    } catch (e){
        console.log(e)
        res.status(400).send({ error: "Error fetching dialog " + id });
    }
}

function del(req, res){
    const {id} = req.params;
    res.send( {message: "Delete dialog", id} );
}

module.exports = {create, update, read, del};