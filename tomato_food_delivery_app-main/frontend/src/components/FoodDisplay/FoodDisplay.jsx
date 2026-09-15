import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({ category }) => {

  const { food_list, searchQuery, setSearchQuery } = useContext(StoreContext);

  // Normalise the query once: trimmed + lowercase, so "  SALAD " matches "Greek salad".
  const query = searchQuery.trim().toLowerCase();

  const filteredList = food_list.filter((item) => {
    // A dish must match BOTH the selected category AND the search text.
    const matchesCategory = category === "All" || category === item.category;

    const matchesSearch =
      query === "" ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // The heading changes so it's always obvious what you're looking at.
  const heading = query
    ? `Results for "₹{searchQuery.trim()}"`
    : category === "All"
      ? "Top dishes near you"
      : `${category} dishes`;

  return (
    <div className='food-display' id='food-display'>

      <div className="food-display-header">
        <h2>{heading}</h2>
        {query && (
          <p className='food-display-count'>
            {filteredList.length} {filteredList.length === 1 ? "dish" : "dishes"} found
          </p>
        )}
      </div>

      {filteredList.length === 0 ? (
        <div className='food-display-empty'>
          <p className='food-display-empty-title'>No dishes matched your search.</p>
          <p>Try a different word, or clear the search to see the full menu.</p>
          <button onClick={() => setSearchQuery("")}>Clear search</button>
        </div>
      ) : (
        <div className='food-display-list'>
          {filteredList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              desc={item.description}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
