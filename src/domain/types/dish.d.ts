interface Ingredient {
  id: string;
  title: string;
  qtd: string;
  dishId: string;
  createdAt: string;
  updatedAt: string;
}

interface Preparation {
  id: string;
  description: string;
  dishId: string;
  createdAt: string;
  updatedAt: string;
}

interface Suggestion {
  id: string;
  description: string;
  dishId: string;
  createdAt: string;
  updatedAt: string;
}

interface Dish {
  id: string;
  title: string;
  time: string;
  userId: string;
  isDeleted: boolean;
  deleteAt: null | string;
  createdAt: string;
  updatedAt: string;
  ingredients: Ingredient[];
  preparations: Preparation[];
  suggestions: Suggestion[];
}
