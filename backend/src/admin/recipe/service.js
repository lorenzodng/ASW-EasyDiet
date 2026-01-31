import RecipeInfo from "../../recipes/infoModel.js";

// Service layer:
// handles business logic and database operations.
// Called by controllers and returns structured results.

export const createRecipe = async (recipeData) => {
  const {
    nome,
    categoria,
    immagine,
    ingredienti,
    kcal,
    info
  } = recipeData;

  if (!nome || !categoria || !immagine || !ingredienti || ingredienti.length === 0 || !kcal) {
    return {
      status: false,
      message: "Dati mancanti"
    };
  }

  const existingRecipe = await RecipeInfo.findOne({ nome });
  if (existingRecipe) {
    return {
      status: false,
      message: "Ricetta già esistente"
    };
  }

  const newRecipe = new RecipeInfo({
    nome,
    categoria,
    immagine,
    ingredienti,
    kcal,
    info
  });

  await newRecipe.save();

  return {
    status: true,
    recipe: newRecipe
  };
};


export const deleteRecipe = async (recipeId) => {
  if (!recipeId) {
    return {
      status: false,
      message: "ID ricetta mancante"
    };
  }

  const recipe = await RecipeInfo.findById(recipeId);

  if (!recipe) {
    return {
      status: false,
      message: "Ricetta non trovata"
    };
  }

  await RecipeInfo.findByIdAndDelete(recipeId);

  return {
    status: true
  };
};


export const updateRecipe = async (id, data) => {
  const recipe = await RecipeInfo.findById(id);

  if (!recipe) {
    return {
      status: false,
      message: "Ricetta non trovata"
    };
  }

  recipe.nome = data.nome;
  recipe.categoria = data.categoria;
  recipe.ingredienti = data.ingredienti;
  recipe.kcal = data.kcal;
  recipe.info = data.info;
  recipe.immagine = data.immagine;


  await recipe.save();

  return {
    status: true,
    recipe
  };
};
