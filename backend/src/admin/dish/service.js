import DishInfo from "../../dishes/infoModel.js";

/* 
  Service layer:
  Handles dish business logic and database operations.
  Called by the controller and returns structured results.
*/

//Create new dish
export const createDish = async (dishData) => {
  const {
    nome,
    categoria,
    immagine,
    ingredienti,
    kcal,
    info
  } = dishData;

  if (!nome || !categoria || !immagine || !ingredienti || ingredienti.length === 0 || !kcal) {
    return {
      status: false,
      message: "Dati mancanti"
    };
  }

  const existingDish = await DishInfo.findOne({ nome });
  if (existingDish) {
    return {
      status: false,
      message: "Piatto già esistente"
    };
  }

  const newDish = new DishInfo({
    nome,
    categoria,
    immagine,
    ingredienti,
    kcal,
    info
  });

  await newDish.save();

  return {
    status: true,
    dish: newDish
  };
};

// Delete dish
export const deleteDish = async (dishId) => {
  if (!dishId) {
    return {
      status: false,
      message: "ID piatto mancante"
    };
  }

  const dish = await DishInfo.findById(dishId);

  if (!dish) {
    return {
      status: false,
      message: "Piatto non trovata"
    };
  }

  await DishInfo.findByIdAndDelete(dishId);

  return {
    status: true
  };
};

// Update dish
export const updateDish = async (id, data) => {
  const dish = await DishInfo.findById(id);

  if (!dish) {
    return {
      status: false,
      message: "Piatto non trovata"
    };
  }

  dish.nome = data.nome;
  dish.categoria = data.categoria;
  dish.ingredienti = data.ingredienti;
  dish.kcal = data.kcal;
  dish.info = data.info;
  dish.immagine = data.immagine;


  await dish.save();

  return {
    status: true,
    dish
  };
};
