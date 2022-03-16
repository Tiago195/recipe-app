import React, { useEffect, useState, useCallback } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import RedirectButton from '../../components/RedirectButton';
import { getDrink, SURPRISE_ME_DRINKS } from '../../services';

function ExploreDrinks() {
  const [id, setId] = useState('0');
  const getRandomDrink = useCallback(async () => {
    const response = await getDrink(SURPRISE_ME_DRINKS);
    setId(response.drinks[0].idDrink);
  }, []);

  useEffect(() => {
    getRandomDrink();
  }, [getRandomDrink]);
  return (
    <div>
      <Header title="Explore Drinks" />
      <main>
        <RedirectButton
          dataTest="explore-by-ingredient"
          titleBtn="By Ingredient"
          path="/explore/drinks/ingredients"
        />

        <RedirectButton
          dataTest="explore-surprise"
          titleBtn="Surprise me!"
          path={ `/drinks/${id}` }
        />

      </main>
      <Footer />
    </div>
  );
}

export default ExploreDrinks;
