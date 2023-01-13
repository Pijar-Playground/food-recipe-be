const db = require('../db') // import dari file ./db.js

// Get all users with pagination
const getAllRecipesPagination = async (params) => {
  const { limit, page, sort } = params

  return await db`SELECT * FROM recipes ${
    sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
}

// get all Recipes without pagination
const getAllRecipes = async (params) => {
  const { sort } = params

  return await db`SELECT * FROM recipes ${
    sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
  }`
}

const getCountRecipe = async () => {
  return await db`SELECT COUNT(id) FROM recipes`
}

// get selected users by id
const getRecipeById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipes WHERE slug = ${id}`
}

// add new user to db
const addNewRecipe = async (params) => {
  const { name, email, phone, password, photo } = params

  return await db`
      INSERT INTO account (name, email, password, phone, photo) 
      VALUES (${name}, ${email}, ${password}, ${phone}, ${photo})
    `
}

// update user
const updateRecipe = async (params) => {
  const { name, email, phone, password, photo, id, defaultValue } = params

  return await db`
    UPDATE account SET
      "name" = ${name || defaultValue?.name},
      "email" = ${email || defaultValue?.email},
      "phone" = ${phone || defaultValue?.phone},
      "password" = ${password || defaultValue?.password},
      "photo" = ${photo || defaultValue?.photo}
    WHERE "id" = ${id};
  `
}

// delete user by id
const deleteRecipeById = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."account" WHERE "id" = ${id}`
}

module.exports = {
  getAllRecipesPagination,
  getAllRecipes,
  getRecipeById,
  addNewRecipe,
  deleteRecipeById,
  updateRecipe,
  getCountRecipe,
}
