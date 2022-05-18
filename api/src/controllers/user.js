const axios = require("axios")
const { User } = require("../db")
const db_mock_data = require('../../db_mock_data.json');//DATA MOCK

const getUser = async () => {
  try {
    //GET DATA MOCK
    db_mock_data.users.forEach(async (user)=>{
      await User.findOrCreate({
        where: {
          fullName: user.fullName,
          password: user.password,
          email: user.email,
          id_document: user.id_document,
          role: user.role
        }
     })
   })

   //DB INFO
   return await User.findAll()
  } catch (error) {
    console.log(error)
  }
}

const getUserById = async (idUser)=> {
  try {
    const userRef = await User.findByPk(idUser)
    return userRef.toJSON()
  } catch (error) {
    console.log(error)
  }
}

const postUser = async (user) => {
  try {
    const userCreated = await User.create({
        fullName: user.fullName,
        password: user.password,
        email: user.email,
        id_document: user.id_document,
        role: user.role
   })

   return userCreated
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getUser, postUser, getUserById }
