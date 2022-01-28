const Pet = require("./model");
const db  = require("../../utils/database");

Pet().init();


// create one pet=====================
async function createOne(req, res){
    const petToCreate = {
        ...req.body
    }
    const createOne = Pet().createOnePet;
    const thisPetRes = await createOne(petToCreate, res);
    return res.json({ data: thisPetRes });
}

// get all Pets ======================
async function getAll(req, res){
    if(req.query.microchip !== undefined){
        const microchip = req.query.microchip
        const thisMicrochip = await Pet().getAllPetsWithoutMicrochip(microchip);
        return res.json({data: thisMicrochip})
    }
    else{
        const all = Pet().getAllPets;
        const thisAllPetRes = await all(res);
        return res.json({data: thisAllPetRes})
    }
}

// get a Pet with an id==============
async function getOnePetById(req, res){
    const idToGet = req.params.id;
  
    const one = Pet().getOneById;
    const thisPetRes = await one(idToGet);
    return res.json({ data: thisPetRes });
}

// get pets by all types==============
async function getPetsType(req,res){
    const petsTypes = await Pet().getAllPetsType(res)
    return res.json({ data: petsTypes });
}

// get pets by type, breed and microchip==================
async function getPetsbyType(req,res){
    const type = req.path.slice(1);
    
    if(req.query.breed){
        const breed = req.query.breed;
        const petsBreed = await Pet().getPetsBreedType(breed, type);
        return res.json({ data: petsBreed });
    }
    else if(req.query.microchip){
        const microchip = req.query.microchip;
        const petsMicrochip = await Pet().getPetsMicrochipType(microchip, type);
        return res.json({ data: petsMicrochip });
    }
    else{
        const petsTypes = await Pet().getPetsType(type);
        return res.json({ data: petsTypes });
    }
}

// this edit function works correctly
// update pet by id or name=====================
async function edit(req, res){
    if(req.params.identifier === NaN){
        // name
        const updateName = {
            name: req.params.identifier,
            ...req.body
        }
        const updatedName = await Pet().editByName(updateName)
        console.log({updatedName});
        return res.json({data: updatedName})
    }else{
        const updatedId = {
            id: req.params.identifier,
            ...req.body
        }
        const updatedById = await Pet().editById(updatedId)
        console.log({updatedById});
        return res.json({data: updatedById})
    }
}

// delete one by id===========================
async function deleteById(req,res){
    const petToDelete = {
        id: req.params.id
    };
    const thisRes = await Pet().deleteOneById(petToDelete.id);
    return res.json({ data: thisRes });
} 
  
module.exports = {
    createOne,
    getAll,
    getOnePetById,
    getPetsType,
    getPetsbyType,
    edit,
    deleteById
};