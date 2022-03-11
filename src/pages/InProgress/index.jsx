import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import clipBoard from 'clipboard-copy';

import { useIngretientes, useUpdateInProgress } from '../../hooks';
import { actionAddFavorite, removeFavorites, setFoodAndDrinks,
  setInProgressRecipes } from '../../redux/actions';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import InputCheck from '../../components/InputCheck';
import testando from '../../helper';

export default function InProgress() {
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const test = pathname.split('/')[1] === 'foods' ? 'meals' : 'drinks';
  const { responseFoodAndDrinks, favoriteRecipes } = useSelector((state) => state);
  const { get, name, strCategory, objFavorites, rota,
    strInstructions, strThumb, strTitle } = testando(responseFoodAndDrinks)[test];
  const [share, setShare] = useState('share');
  const { newProgress, storage } = useUpdateInProgress(name);
  const [ingredientes, quantities] = useIngretientes(responseFoodAndDrinks[0]);
  const [isFavorite, setIsFavorite] = useState(favoriteRecipes.some((e) => e.id === id));
  const dispatch = useDispatch();
  const ID_ENPOINT = 'lookup.php?i=';

  const setFoodAndDrink = useCallback(async () => {
    dispatch(setFoodAndDrinks(await get(`${ID_ENPOINT}${id}`)));
  }, [dispatch, id, get]);

  useEffect(() => {
    setFoodAndDrink();
  }, [setFoodAndDrink]);

  useEffect(() => {
    if (!storage[name][id]) {
      dispatch(setInProgressRecipes(name, { [id]: [] }));
      newProgress();
    }
  }, [dispatch, id]);

  function copyLink() {
    clipBoard(`http://localhost:3000${rota}`);
    setShare('Link copied!');
  }

  function setFavorite() {
    setIsFavorite(!isFavorite);
    if (isFavorite) {
      dispatch(removeFavorites(id));
      localStorage.setItem('favoriteRecipes',
        JSON.stringify(favoriteRecipes.filter((f) => f.id !== id)));
    } else {
      dispatch(actionAddFavorite(objFavorites));
      localStorage.setItem('favoriteRecipes',
        JSON.stringify([...favoriteRecipes, objFavorites]));
    }
  }

  return (
    <div>
      <section>
        {responseFoodAndDrinks[0] && (
          <>
            <section>
              <img
                data-testid="recipe-photo"
                src={ responseFoodAndDrinks[0][strThumb] }
                alt=""
              />
              <div>
                <h1 data-testid="recipe-title">{responseFoodAndDrinks[0][strTitle]}</h1>
                <h3
                  data-testid="recipe-category"
                >
                  {responseFoodAndDrinks[0][strCategory]}
                </h3>
              </div>
              <div>
                <button
                  data-testid="share-btn"
                  type="button"
                  onClick={ copyLink }
                >
                  {share}

                </button>
                <button
                  type="button"
                  onClick={ setFavorite }
                >
                  <img
                    data-testid="favorite-btn"
                    src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
                    alt=""
                  />
                </button>
              </div>
            </section>
            <section>
              <h3>Ingredients</h3>
              <div>
                {ingredientes.map((e, i) => (
                  <InputCheck
                    key={ i }
                    text={ `${e[1]} ${quantities[i][1]}` }
                    index={ i }
                  />
                ))}
              </div>
            </section>
            <section>
              <h3>Instructions</h3>
              <p
                data-testid="instructions"
              >
                { responseFoodAndDrinks[0][strInstructions]}
              </p>
            </section>
          </>
        )}
        <button
          type="button"
          data-testid="finish-recipe-btn"
          disabled={ storage[name][id]
            ? storage[name][id].length !== ingredientes.length : null }
          onClick={ () => history.push('/done-recipes') }
        >
          Finish Recipe
        </button>
      </section>
    </div>
  );
}